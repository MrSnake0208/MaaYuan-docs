import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

const DEFAULT_ARIA_LABEL = '查看当前项目版本与更新说明'
const DEFAULT_TITLE = '更新渠道 ✨最新版本✨'

function normalizeLine(line) {
  return line
    .replace(/^\s*#+\s+/, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+\.\s+/, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`>#*_~]/g, '')
    .trim()
}

function extractHighlights(body) {
  const lines = body.split('\n').map(line => line.replace(/\r/g, ''))
  const hasSectionHeading = lines.some(line => /^\s*##\s+/.test(line))
  const highlights = []
  let started = !hasSectionHeading

  for (const rawLine of lines) {
    if (/^\s*##\s+/.test(rawLine)) {
      started = true
      continue
    }

    if (!started || /^\s*###\s+/.test(rawLine))
      continue

    const line = normalizeLine(rawLine)
    if (!line || /^[-—]{3,}$/.test(line))
      continue

    if (/^full changelog:/i.test(line) || /mirror酱/i.test(line))
      continue

    highlights.push(line)
    if (highlights.length === 5)
      break
  }

  return highlights
}

export function selectLatestRelease(releases) {
  return releases
    .filter(release => !release.draft)
    .sort((left, right) => new Date(right.published_at) - new Date(left.published_at))[0]
}

export function createNavPopoverData(release) {
  const highlights = extractHighlights(release.body ?? '')

  return {
    badgeText: `✨ ${release.tag_name}`,
    title: DEFAULT_TITLE,
    description: release.name || release.tag_name,
    highlights: highlights.length > 0
      ? highlights
      : ['暂无发布说明，请查看 GitHub Release 页面'],
    ariaLabel: DEFAULT_ARIA_LABEL,
  }
}

export function renderNavPopoverModule(navPopoverData) {
  return [
    '// 由 scripts/sync-maayuan-release-note.mjs 自动生成，请勿手动编辑',
    'export const navPopoverData = ' + JSON.stringify(navPopoverData, null, 2),
    '',
  ].join('\n')
}

export async function writeNavPopoverFile(targetPath, release) {
  const navPopoverData = createNavPopoverData(release)
  await mkdir(dirname(targetPath), { recursive: true })
  await writeFile(targetPath, renderNavPopoverModule(navPopoverData), 'utf8')
  return navPopoverData
}

function parseCliArgs(argv) {
  const args = new Map()

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]
    if (!current.startsWith('--'))
      continue

    args.set(current, argv[index + 1])
    index += 1
  }

  return {
    releaseJsonPath: args.get('--release-json'),
    outputPath: args.get('--output') ?? '.vitepress/shared/navPopover.mjs',
  }
}

async function main() {
  const { releaseJsonPath, outputPath } = parseCliArgs(process.argv.slice(2))

  if (!releaseJsonPath)
    throw new Error('缺少 --release-json 参数')

  const payload = JSON.parse(await readFile(resolve(releaseJsonPath), 'utf8'))
  const release = Array.isArray(payload) ? selectLatestRelease(payload) : payload

  if (!release)
    throw new Error('未找到可用的 release')

  await writeNavPopoverFile(resolve(outputPath), release)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`[sync-maayuan-release-note] ${error.message}`)
    process.exitCode = 1
  })
}
