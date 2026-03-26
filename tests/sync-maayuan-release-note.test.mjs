import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import {
  createNavPopoverData,
  selectLatestStableRelease,
  writeNavPopoverFile,
} from '../scripts/sync-maayuan-release-note.mjs'

const execFileAsync = promisify(execFile)

test('createNavPopoverData maps latest release fields into nav popover content', () => {
  const navPopoverData = createNavPopoverData({
    tag_name: 'v2.1.3',
    name: 'MaaYuan 2.1.3',
    body: `
## 更新内容

- 修复连接不稳定问题
- 支持新的活动关卡
- 优化启动性能

## 其他

感谢反馈
    `.trim(),
  })

  assert.deepEqual(navPopoverData, {
    badgeText: '✨ v2.1.3',
    title: '更新渠道 ✨最新正式版✨',
    description: 'MaaYuan 2.1.3',
    highlights: [
      '修复连接不稳定问题',
      '支持新的活动关卡',
      '优化启动性能',
      '感谢反馈',
    ],
    ariaLabel: '查看当前项目版本与更新说明',
  })
})

test('selectLatestStableRelease ignores prerelease entries and picks the newest stable release', () => {
  const release = selectLatestStableRelease([
    {
      tag_name: 'v2.1.1-beta.3',
      prerelease: false,
      draft: false,
      published_at: '2026-03-26T01:00:00Z',
    },
    {
      tag_name: 'v2.1.0',
      prerelease: false,
      draft: false,
      published_at: '2026-03-20T01:00:00Z',
    },
    {
      tag_name: 'v2.0.9',
      prerelease: false,
      draft: false,
      published_at: '2026-03-10T01:00:00Z',
    },
  ])

  assert.equal(release.tag_name, 'v2.1.0')
})

test('writeNavPopoverFile falls back when release body is empty', async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), 'maayuan-release-note-'))
  const outputPath = join(fixtureDir, 'navPopover.mjs')

  await writeNavPopoverFile(outputPath, {
    tag_name: 'v2.1.4',
    name: '',
    body: '',
  })

  const generatedContent = await readFile(outputPath, 'utf8')

  assert.match(generatedContent, /badgeText": "✨ v2\.1\.4"/)
  assert.match(generatedContent, /description": "v2\.1\.4"/)
  assert.match(generatedContent, /"暂无发布说明，请查看 GitHub Release 页面"/)
})

test('createNavPopoverData prefers detailed lines after section headings', () => {
  const navPopoverData = createNavPopoverData({
    tag_name: 'v1.0.2',
    name: 'v1.0.2',
    body: `
🥳 **MaaYuan v1.0.2 （正式版）**

- 下载更新尽在导航站

---

## 📕 版本迭代公告

这个月先发布稳定版，方便月底赶作业。

## 📕 **v1.0.1 更新内容**

### 🏮 **青丘戏坊**

自动导航。支持只领取时辰不扫荡。

### 🔨 **爱拼才会赢**

适配心纸营建派遣 & 首通。
    `.trim(),
  })

  assert.deepEqual(navPopoverData.highlights, [
    '这个月先发布稳定版，方便月底赶作业。',
    '自动导航。支持只领取时辰不扫荡。',
    '适配心纸营建派遣 & 首通。',
  ])
})

test('CLI writes navPopover module from a release json file', async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), 'maayuan-release-note-cli-'))
  const releasePath = join(fixtureDir, 'release.json')
  const outputPath = join(fixtureDir, 'navPopover.mjs')

  await writeFile(releasePath, JSON.stringify({
    tag_name: 'v2.1.5',
    name: 'MaaYuan 2.1.5',
    body: '- 修复已知问题',
  }), 'utf8')

  await execFileAsync('node', [
    'scripts/sync-maayuan-release-note.mjs',
    '--release-json',
    releasePath,
    '--output',
    outputPath,
  ], {
    cwd: process.cwd(),
  })

  const generatedContent = await readFile(outputPath, 'utf8')
  assert.match(generatedContent, /export const navPopoverData =/)
  assert.match(generatedContent, /MaaYuan 2\.1\.5/)
})
