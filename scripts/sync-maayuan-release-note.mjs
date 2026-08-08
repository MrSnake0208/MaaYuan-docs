import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

const DEFAULT_ARIA_LABEL = '查看当前项目版本与更新说明'
const RELEASE_CHANNELS = ['公测版', '正式版']
const PRERELEASE_TAG_PATTERN = /(?:^|[.-])(alpha|beta|rc|preview|nightly)(?:[.-]|$)/i

function normalizeLine(line) {
  return line
    .replace(/^\s*#+\s+/, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+\.\s+/, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`>#*_~]/g, '')
    .trim()
}

function isIgnoredLine(line) {
  return /^[-—]{3,}$/.test(line)
    || /^full changelog:/i.test(line)
    || /mirror酱/i.test(line)
}

function extractSections(body) {
  const lines = body.split('\n').map(line => line.replace(/\r/g, ''))
  const hasSectionHeading = lines.some(line => /^\s*##\s+/.test(line))
  const sections = []
  let started = !hasSectionHeading
  let currentTitle = ''
  let currentSection

  for (const rawLine of lines) {
    if (/^\s*##\s+/.test(rawLine)) {
      started = true
      currentTitle = ''
      currentSection = undefined
      continue
    }

    if (!started)
      continue

    if (/^\s*###\s+/.test(rawLine)) {
      currentTitle = normalizeLine(rawLine)
      currentSection = { title: currentTitle, items: [] }
      sections.push(currentSection)
      continue
    }

    const line = normalizeLine(rawLine)
    if (!line || isIgnoredLine(line))
      continue

    if (!currentSection) {
      const previousSection = sections.at(-1)
      currentSection = !currentTitle && previousSection && !previousSection.title
        ? previousSection
        : { ...(currentTitle ? { title: currentTitle } : {}), items: [] }

      if (currentSection !== previousSection)
        sections.push(currentSection)
    }

    currentSection.items.push(line)
  }

  const normalizedSections = []
  let remainingItemCount = 5

  for (const section of sections) {
    if (remainingItemCount === 0)
      break

    if (section.items.length === 0 && section.title) {
      normalizedSections.push({ items: [section.title] })
      remainingItemCount -= 1
      continue
    }

    const items = section.items.slice(0, remainingItemCount)
    if (items.length === 0)
      continue

    normalizedSections.push({
      ...(section.title ? { title: section.title } : {}),
      items,
    })
    remainingItemCount -= items.length
  }

  return normalizedSections
}

function extractReleaseChannel(release) {
  const tagName = release.tag_name ?? ''
  const versionLines = (release.body ?? '')
    .split(/\r?\n/)
    .filter(line => !tagName || line.toLowerCase().includes(tagName.toLowerCase()))
    .slice(0, 5)
  const metadata = [release.name ?? '', ...versionLines].join('\n')
  const explicitChannel = RELEASE_CHANNELS.find(channel => metadata.includes(channel))

  if (explicitChannel)
    return explicitChannel

  return release.prerelease || PRERELEASE_TAG_PATTERN.test(tagName)
    ? '公测版'
    : '正式版'
}

export function selectLatestRelease(releases) {
  return releases
    .filter(release => !release.draft)
    .sort((left, right) => new Date(right.published_at) - new Date(left.published_at))[0]
}

export function createNavPopoverData(release) {
  const sections = extractSections(release.body ?? '')
  const releaseChannel = extractReleaseChannel(release)

  return {
    badgeText: `✨ ${release.tag_name}`,
    title: `更新渠道 ✨${releaseChannel}✨`,
    description: release.name || release.tag_name,
    sections: sections.length > 0
      ? sections
      : [{ items: ['暂无发布说明，请查看 GitHub Release 页面'] }],
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
