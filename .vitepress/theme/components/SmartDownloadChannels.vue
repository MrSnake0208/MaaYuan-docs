<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

type Platform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'unknown'
type Arch = 'x64' | 'arm64' | 'arm' | 'unknown'

interface DownloadChannel {
  label: string
  href: string
  note?: string
}

interface DownloadRecommendation {
  button: string
  hint: string
  filename?: string
  tone: 'brand' | 'warning' | 'danger' | 'neutral'
}

type MirrorChyanOs = 'windows' | 'macos' | 'linux'
type MirrorChyanArch = 'x64' | 'arm64'
type UserAgentHighEntropyHint = 'architecture'

const releaseFiles = {
  windows: {
    x64: 'MaaYuan-win-x86_64-vx.x.x-xxxx.zip',
  },
  macos: {
    arm64: 'MaaYuan-macos-aarch64-vx.x.x-xxxx.tar.gz',
  },
} as const

const downloadChannels: DownloadChannel[] = [
  {
    label: '123 云盘',
    href: 'https://www.123865.com/s/iFtSjv-E7QV?pwd=yuan#',
  },
  {
    label: '百度网盘',
    href: 'https://pan.baidu.com/s/1iONHXFD3p-UkMTPMMvEPFQ?pwd=yuan',
  },
]

const rootRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLDetailsElement | null>(null)
const summaryRef = ref<HTMLElement | null>(null)
const isClientReady = ref(false)
const isExpanded = ref(false)
const detectedPlatform = ref<Platform>('unknown')
const detectedArch = ref<Arch>('unknown')

function normalizePlatform(raw: string) {
  const value = raw.toLowerCase()

  if (/(iphone|ipad|ipod|ios)/.test(value))
    return 'ios' as const
  if (/android/.test(value))
    return 'android' as const
  if (/(mac|darwin|os x)/.test(value))
    return 'macos' as const
  if (/(win|windows)/.test(value))
    return 'windows' as const
  if (/linux|x11/.test(value))
    return 'linux' as const

  return 'unknown' as const
}

function normalizeArch(raw: string) {
  const value = raw.toLowerCase()

  if (/(arm64|aarch64|armv8|apple\s?silicon)/.test(value))
    return 'arm64' as const
  if (/(arm|armv7)/.test(value))
    return 'arm' as const
  if (/(x86_64|x64|win64|wow64|amd64|intel|x86)/.test(value))
    return 'x64' as const

  return 'unknown' as const
}

async function detectEnvironment() {
  if (typeof navigator === 'undefined')
    return

  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string
      architecture?: string
      getHighEntropyValues?: (hints: UserAgentHighEntropyHint[]) => Promise<{
        architecture?: string
      }>
    }
  }

  const userAgent = nav.userAgent ?? ''
  const platformHint = [nav.userAgentData?.platform, nav.platform, userAgent].filter(Boolean).join(' ')

  detectedPlatform.value = normalizePlatform(platformHint)

  if (detectedPlatform.value === 'macos') {
    const macArchitectureHints = [nav.userAgentData?.architecture].filter(Boolean) as string[]

    if (nav.userAgentData?.getHighEntropyValues) {
      try {
        const hints = await nav.userAgentData.getHighEntropyValues(['architecture'])
        if (hints.architecture)
          macArchitectureHints.unshift(hints.architecture)
      }
      catch {
        // Ignore and fall back to the only supported macOS architecture.
      }
    }

    const detectedMacArch = normalizeArch(macArchitectureHints.join(' '))
    detectedArch.value = detectedMacArch === 'unknown' ? 'arm64' : detectedMacArch
    return
  }

  const architectureHint = [nav.userAgentData?.architecture, userAgent, nav.platform].filter(Boolean).join(' ')
  detectedArch.value = normalizeArch(architectureHint)
}

const recommendation = computed<DownloadRecommendation>(() => {
  if (!isClientReady.value) {
    return {
      button: '查看全部下载渠道',
      hint: '正在识别当前系统与架构；若未自动推荐，可直接展开下方下载渠道手动选择安装包。',
      tone: 'neutral',
    }
  }

  if (detectedPlatform.value === 'windows' && detectedArch.value === 'x64') {
    return {
      button: '推荐下载 Windows x64 版',
      hint: '进入任一网盘后，优先选择以下完整安装包：',
      filename: releaseFiles.windows.x64,
      tone: 'brand',
    }
  }

  if (detectedPlatform.value === 'windows' && (detectedArch.value === 'arm64' || detectedArch.value === 'arm')) {
    return {
      button: 'Windows ARM 暂不支持',
      hint: 'MaaYuan 当前仅支持 Windows x64；如果你的设备是 Windows ARM，请暂时不要下载 ARM 安装包。',
      tone: 'danger',
    }
  }

  if (detectedPlatform.value === 'windows') {
    return {
      button: '推荐下载 Windows x64 版',
      hint: 'MaaYuan 当前仅支持 Windows x64；若未识别出架构，请优先下载 x86_64 完整包。',
      filename: releaseFiles.windows.x64,
      tone: 'warning',
    }
  }

  if (detectedPlatform.value === 'macos' && detectedArch.value === 'x64') {
    return {
      button: 'macOS Intel 暂不支持',
      hint: 'MaaYuan 目前仅提供 macOS Apple Silicon（aarch64）安装包；若你使用的是 Intel Mac，建议改用 Windows 环境。',
      tone: 'danger',
    }
  }

  if (detectedPlatform.value === 'macos') {
    return {
      button: '推荐下载 macOS Apple Silicon 版',
      hint: '进入任一网盘后，优先选择以下完整安装包；若你的 Mac 是 Intel 处理器，则当前暂不支持。',
      filename: releaseFiles.macos.arm64,
      tone: 'brand',
    }
  }

  if (detectedPlatform.value === 'linux') {
    return {
      button: 'Linux 暂不支持',
      hint: 'MaaYuan 当前不提供 Linux 版本，请改用 Windows x64 或 macOS Apple Silicon 设备。',
      tone: 'danger',
    }
  }

  if (detectedPlatform.value === 'android') {
    return {
      button: 'Android 暂不支持',
      hint: 'MaaYuan 当前不提供 Android 版本，请改用 Windows x64 或 macOS Apple Silicon 设备。',
      tone: 'danger',
    }
  }

  if (detectedPlatform.value === 'ios') {
    return {
      button: 'iOS 暂不支持',
      hint: 'MaaYuan 当前不提供 iOS 版本，请改用 Windows x64 或 macOS Apple Silicon 设备。',
      tone: 'danger',
    }
  }

  return {
    button: '当前系统暂不支持',
    hint: 'MaaYuan 当前仅支持 Windows x64 与 macOS Apple Silicon（aarch64）。',
    tone: 'danger',
  }
})

function getStickyOffset() {
  if (typeof document === 'undefined')
    return 0

  return ['.VPNav', '.VPSectionTabs', '.VPLocalNav']
    .map((selector) => document.querySelector<HTMLElement>(selector)?.getBoundingClientRect().height ?? 0)
    .reduce((sum, height) => sum + height, 0)
}

function getPreferredScrollTarget() {
  let current = rootRef.value?.previousElementSibling ?? null

  while (current) {
    if (/^H[1-6]$/.test(current.tagName))
      return current as HTMLElement

    current = current.previousElementSibling
  }

  return summaryRef.value || detailsRef.value
}

const mirrorChyanUrl = computed(() => {
  const params = new URLSearchParams({
    rid: 'MaaYuan',
    channel: 'beta',
    source: 'maayuan-docs-download',
  })

  if (detectedPlatform.value === 'windows' && detectedArch.value !== 'arm64' && detectedArch.value !== 'arm') {
    params.set('os', 'windows')
    params.set('arch', 'x64')
  }
  else if (detectedPlatform.value === 'macos' && detectedArch.value !== 'x64') {
    params.set('os', 'macos')
    params.set('arch', 'arm64')
  }

  return `https://mirrorchyan.com/zh/projects?${params.toString()}`
})

async function revealChannels() {
  if (detailsRef.value && !detailsRef.value.open)
    detailsRef.value.open = true

  isExpanded.value = true

  await nextTick()

  requestAnimationFrame(() => {
    const target = getPreferredScrollTarget()
    if (!target)
      return

    const extraGap = 12
    const top = window.scrollY + target.getBoundingClientRect().top - getStickyOffset() - extraGap

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    })
  })
}

function syncExpandedState() {
  isExpanded.value = detailsRef.value?.open ?? false
}

onMounted(() => {
  void (async () => {
    await detectEnvironment()
    isClientReady.value = true
    syncExpandedState()
  })()
})
</script>

<template>
  <section ref="rootRef" class="smart-download" aria-label="智能下载渠道推荐">
    <div class="smart-download__hero">
      <button
        type="button"
        class="smart-download__primary"
        :class="`smart-download__primary--${recommendation.tone}`"
        :aria-expanded="isExpanded ? 'true' : 'false'"
        aria-controls="download-channel-links"
        @click="revealChannels"
      >
        {{ recommendation.button }}
      </button>
      <p class="smart-download__hint">
        {{ recommendation.hint }}
      </p>
      <p v-if="recommendation.filename" class="smart-download__filename">
        <code>{{ recommendation.filename }}</code>
      </p>
      <p class="smart-download__mirror">
        <span>已有 Mirror酱 CDK？</span>
        <a :href="mirrorChyanUrl" target="_blank" rel="noopener noreferrer">
          前往 Mirror酱 高速下载
        </a>
      </p>
    </div>

    <details ref="detailsRef" class="smart-download__details" @toggle="syncExpandedState">
      <summary ref="summaryRef" class="smart-download__summary">
        查看全部下载渠道
      </summary>

      <div id="download-channel-links" class="smart-download__grid">
        <a
          v-for="channel in downloadChannels"
          :key="channel.label"
          class="smart-download__link"
          :href="channel.href"
          target="_blank"
          rel="noopener"
        >
          <span class="smart-download__link-main">{{ channel.label }}</span>
          <span v-if="channel.note" class="smart-download__link-note">{{ channel.note }}</span>
        </a>
      </div>
    </details>
  </section>
</template>

<style scoped>
.smart-download {
  margin: 18px 0 12px;
}

.smart-download__hero {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgb(99 102 241 / 12%), transparent 36%),
    linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg-elv));
  box-shadow: 0 16px 40px rgb(79 70 229 / 10%);
}

.dark .smart-download__hero {
  box-shadow: 0 18px 44px rgb(15 23 42 / 28%);
}

.smart-download__primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 52px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--vp-c-brand-3), var(--vp-c-brand-2));
  color: var(--vp-c-white);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 28px rgb(79 70 229 / 20%);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.smart-download__primary--warning {
  background: linear-gradient(135deg, var(--vp-c-warning-3), var(--vp-c-warning-2));
  color: var(--vp-c-black);
  box-shadow: 0 14px 28px rgb(234 179 8 / 18%);
}

.smart-download__primary--danger {
  background: linear-gradient(135deg, var(--vp-c-danger-3), var(--vp-c-danger-2));
  color: var(--vp-c-white);
  box-shadow: 0 14px 28px rgb(220 38 38 / 22%);
}

.smart-download__primary--neutral {
  background: linear-gradient(135deg, var(--vp-c-default-3), var(--vp-c-default-2));
  color: var(--vp-c-white);
  box-shadow: 0 14px 28px rgb(100 116 139 / 18%);
}

.smart-download__primary:hover {
  transform: translateY(-2px);
  filter: saturate(1.08);
  box-shadow: 0 18px 34px rgb(79 70 229 / 26%);
}

.smart-download__primary:active {
  transform: translateY(0);
}

.smart-download__hint {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.smart-download__filename {
  margin: -2px 0 0;
}

.smart-download__filename code {
  display: inline-block;
  max-width: 100%;
  padding: 8px 10px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-brand-soft) 70%, transparent);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: normal;
  word-break: break-all;
}

.smart-download__mirror {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 2px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.smart-download__mirror a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
}

.smart-download__mirror a:hover {
  text-decoration: underline;
}

.smart-download__details {
  margin-top: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 78%, transparent);
  overflow: hidden;
}

.smart-download__summary {
  list-style: none;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.smart-download__summary::-webkit-details-marker {
  display: none;
}

.smart-download__summary::after {
  content: '▾';
  float: right;
  color: var(--vp-c-brand-1);
  transition: transform 0.2s ease;
}

.smart-download__details[open] .smart-download__summary::after {
  transform: rotate(180deg);
}

.smart-download__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  padding: 0 18px 18px;
}

.smart-download__link {
  display: grid;
  gap: 4px;
  min-height: 64px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
  color: var(--vp-c-text-1);
  text-decoration: none;
  box-shadow: 0 10px 24px rgb(79 70 229 / 10%);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease,
    background 0.2s ease;
}

.smart-download__link:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 16px 32px rgb(79 70 229 / 18%);
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-elv));
}

.smart-download__link-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 700;
}

.smart-download__link-main::after {
  content: '↗';
  color: var(--vp-c-brand-1);
  font-size: 0.95rem;
}

.smart-download__link-note {
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
}

@media (max-width: 640px) {
  .smart-download__hero {
    padding: 16px;
  }

  .smart-download__primary {
    width: 100%;
  }

  .smart-download__grid {
    grid-template-columns: 1fr;
    padding: 0 16px 16px;
  }
}
</style>
