#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用法：
  bash scripts/merge-pr-with-opencommit.sh <PR编号> [额外的 gh pr merge 参数...]

示例：
  bash scripts/merge-pr-with-opencommit.sh 26
  bash scripts/merge-pr-with-opencommit.sh 26 --auto
  bash scripts/merge-pr-with-opencommit.sh 26 --delete-branch

脚本流程：
  1. gh pr checkout <PR编号>
  2. 切到 PR 的 base 分支并创建临时分支
  3. git merge --squash <PR分支>
  4. 调用 oco / oc 生成本地临时 commit
  5. 提取 subject / body
  6. 调用 gh pr merge --squash 完成合并

前置要求：
  - 已安装并登录 gh
  - 已安装 opencommit（命令为 oco 或 oc）
  - 当前工作区无未提交变更
EOF
}

log() {
  printf '[merge-pr-with-opencommit] %s\n' "$*"
}

fail() {
  printf '[merge-pr-with-opencommit] 错误：%s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "未找到命令：$1"
}

detect_opencommit_cmd() {
  if command -v oco >/dev/null 2>&1; then
    printf 'oco'
    return
  fi

  if command -v oc >/dev/null 2>&1; then
    printf 'oc'
    return
  fi

  fail '未找到 OpenCommit 命令（oco 或 oc）'
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || $# -lt 1 ]]; then
  usage
  exit 0
fi

PR_NUMBER="$1"
shift
EXTRA_MERGE_ARGS=("$@")

[[ "$PR_NUMBER" =~ ^[0-9]+$ ]] || fail "PR 编号必须是数字，当前输入：$PR_NUMBER"

require_cmd git
require_cmd gh
OPENCOMMIT_CMD="$(detect_opencommit_cmd)"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail '当前目录不是 Git 仓库'

if [[ -n "$(git status --porcelain)" ]]; then
  fail '当前工作区有未提交变更，请先提交或清理后再执行'
fi

gh auth status >/dev/null 2>&1 || fail 'gh 当前未登录或登录已失效，请先执行 gh auth login -h github.com'

ORIGINAL_BRANCH="$(git branch --show-current || true)"
BASE_BRANCH=""
TEMP_BRANCH=""
BODY_FILE=""
TEMP_BRANCH_CREATED=0
MERGE_COMPLETED=0

cleanup() {
  if [[ -n "${BODY_FILE:-}" && -f "${BODY_FILE:-}" ]]; then
    rm -f "$BODY_FILE"
  fi

  if [[ "${TEMP_BRANCH_CREATED:-0}" -eq 1 ]] && git show-ref --verify --quiet "refs/heads/$TEMP_BRANCH"; then
    local return_branch
    return_branch="$ORIGINAL_BRANCH"

    if [[ -z "$return_branch" || "$return_branch" == "$TEMP_BRANCH" ]]; then
      return_branch="$BASE_BRANCH"
    fi

    if [[ -n "$return_branch" ]] && git show-ref --verify --quiet "refs/heads/$return_branch"; then
      git switch "$return_branch" >/dev/null 2>&1 || true
    elif [[ -n "$BASE_BRANCH" ]] && git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
      git switch "$BASE_BRANCH" >/dev/null 2>&1 || true
    fi

    if [[ "${MERGE_COMPLETED:-0}" -eq 1 && -n "$BASE_BRANCH" ]]; then
      log "同步最新远端引用：origin/$BASE_BRANCH"
      git fetch origin "$BASE_BRANCH" >/dev/null 2>&1 || true

      if [[ "$(git branch --show-current || true)" == "$BASE_BRANCH" ]]; then
        log "快进更新本地 base 分支：$BASE_BRANCH"
        git pull --ff-only origin "$BASE_BRANCH" >/dev/null 2>&1 || true
      fi
    fi

    if [[ "${MERGE_COMPLETED:-0}" -eq 1 ]]; then
      log "删除临时分支：$TEMP_BRANCH"
      git branch -D "$TEMP_BRANCH" >/dev/null 2>&1 || true
    fi
  fi
}

trap cleanup EXIT

log "检出 PR #$PR_NUMBER"
gh pr checkout "$PR_NUMBER"

BASE_BRANCH="$(gh pr view "$PR_NUMBER" --json baseRefName --jq .baseRefName)"
PR_BRANCH="$(git branch --show-current)"

[[ -n "$BASE_BRANCH" ]] || fail "无法获取 PR #$PR_NUMBER 的 base 分支"
[[ -n "$PR_BRANCH" ]] || fail "无法获取 PR #$PR_NUMBER 的本地分支"

log "PR 分支：$PR_BRANCH"
log "Base 分支：$BASE_BRANCH"

log "同步 base 分支最新代码"
git switch "$BASE_BRANCH"
git pull --ff-only origin "$BASE_BRANCH"

TEMP_BRANCH="pr-${PR_NUMBER}-opencommit-$(date +%Y%m%d%H%M%S)"
log "创建临时分支：$TEMP_BRANCH"
git switch -c "$TEMP_BRANCH"
TEMP_BRANCH_CREATED=1

log "将 PR 变更 squash 到临时分支"
git merge --squash "$PR_BRANCH"

if [[ -n "$(git status --porcelain)" ]]; then
  log "调用 $OPENCOMMIT_CMD 生成临时 commit（强制禁用 git push）"
  OCO_GITPUSH=false "$OPENCOMMIT_CMD" --yes
else
  fail 'git merge --squash 后没有待提交变更，已取消'
fi

SUBJECT="$(git log -1 --pretty=%s)"
BODY_FILE="$(mktemp "/tmp/pr-${PR_NUMBER}-body.XXXXXX.txt")"
git log -1 --pretty=%b > "$BODY_FILE"

log "已生成 squash merge message"
printf '\n=== SUBJECT ===\n%s\n' "$SUBJECT"
printf '\n=== BODY ===\n'
cat "$BODY_FILE"
printf '\n'

read -r -p "确认执行 gh pr merge #$PR_NUMBER --squash 吗？[y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  fail '用户取消合并'
fi

MERGE_ARGS=("pr" "merge" "$PR_NUMBER" "--squash" "--subject" "$SUBJECT")
if [[ -s "$BODY_FILE" ]]; then
  MERGE_ARGS+=("--body-file" "$BODY_FILE")
fi
if [[ ${#EXTRA_MERGE_ARGS[@]} -gt 0 ]]; then
  MERGE_ARGS+=("${EXTRA_MERGE_ARGS[@]}")
fi

log "开始执行 gh ${MERGE_ARGS[*]}"
gh "${MERGE_ARGS[@]}"
MERGE_COMPLETED=1

log "PR #$PR_NUMBER 已完成 squash merge"
