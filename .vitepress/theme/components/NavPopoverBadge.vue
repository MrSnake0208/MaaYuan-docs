<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  badgeText: string
  title: string
  description?: string
  highlights?: string[]
  ariaLabel?: string
  screenMenu?: boolean
}>(), {
  ariaLabel: '查看项目说明',
  description: '',
  highlights: () => [],
  screenMenu: false,
})

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const rootClass = computed(() => (
  props.screenMenu
    ? ['nav-popover-badge', 'nav-popover-badge--screen']
    : ['nav-popover-badge']
))

const hasDescription = computed(() => props.description.trim().length > 0)
const hasHighlights = computed(() => props.highlights.length > 0)

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
}

function openPopover() {
  isOpen.value = true
}

function closePopover() {
  isOpen.value = false
}

function togglePopover() {
  isOpen.value = !isOpen.value
}

function handleMouseEnter() {
  if (!props.screenMenu && isDesktopViewport())
    openPopover()
}

function handleMouseLeave() {
  if (!props.screenMenu && isDesktopViewport())
    closePopover()
}

function handleFocusIn() {
  if (props.screenMenu)
    return

  openPopover()
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null

  if (nextTarget && rootRef.value?.contains(nextTarget))
    return

  closePopover()
}

function handleTriggerClick() {
  if (props.screenMenu || !isDesktopViewport()) {
    togglePopover()
    return
  }

  openPopover()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closePopover()
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && !props.screenMenu) {
    event.preventDefault()
    togglePopover()
  }
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null

  if (!isOpen.value || !target || rootRef.value?.contains(target))
    return

  closePopover()
}

function handleWindowResize() {
  closePopover()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<template>
  <div
    ref="rootRef"
    :class="[...rootClass, { 'is-open': isOpen }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @keydown="handleKeydown"
  >
    <button
      type="button"
      class="nav-popover-badge__trigger"
      :aria-label="props.ariaLabel"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      @click="handleTriggerClick"
    >
      <span class="nav-popover-badge__label">{{ props.badgeText }}</span>
    </button>

    <div
      v-show="isOpen"
      class="nav-popover-badge__panel"
      role="tooltip"
    >
      <div class="nav-popover-badge__content">
        <p class="nav-popover-badge__title">
          {{ props.title }}
        </p>
        <p
          v-if="hasDescription"
          class="nav-popover-badge__description"
        >
          {{ props.description }}
        </p>
        <ul
          v-if="hasHighlights"
          class="nav-popover-badge__list"
        >
          <li
            v-for="item in props.highlights"
            :key="item"
            class="nav-popover-badge__list-item"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-popover-badge {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-popover-badge__trigger {
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  height: var(--vp-nav-height);
  border: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.25s,
    transform 0.25s;
}

.nav-popover-badge__trigger:hover,
.nav-popover-badge__trigger:focus-visible,
.nav-popover-badge.is-open .nav-popover-badge__trigger {
  color: var(--vp-c-brand-1);
  outline: none;
}

.nav-popover-badge__label {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
  border-radius: 999px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft), rgba(255, 255, 255, 0.04));
  box-shadow: 0 8px 24px rgba(86, 92, 255, 0.14);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.nav-popover-badge__panel {
  position: absolute;
  top: calc(100% - 8px);
  left: 50%;
  z-index: 40;
  width: min(420px, calc(100vw - 32px));
  padding-top: 16px;
  transform: translateX(-50%);
}

.nav-popover-badge__content {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 16px 18px;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, var(--vp-c-brand-soft) 8%);
  color: var(--vp-c-text-1);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  font-size: 13px;
  line-height: 1.7;
}

.nav-popover-badge__title,
.nav-popover-badge__description,
.nav-popover-badge__list {
  margin: 0;
}

.nav-popover-badge__title {
  font-weight: 700;
}

.nav-popover-badge__description {
  margin-top: 8px;
}

.nav-popover-badge__list {
  margin-top: 12px;
  padding-left: 1.1rem;
}

.nav-popover-badge__list-item + .nav-popover-badge__list-item {
  margin-top: 6px;
}

.nav-popover-badge__list-item {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.nav-popover-badge__content::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  width: 14px;
  height: 14px;
  border-top: 1px solid var(--vp-c-divider);
  border-left: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, var(--vp-c-brand-soft) 8%);
  transform: translateX(-50%) rotate(45deg);
}

.nav-popover-badge--screen {
  display: block;
  width: 100%;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nav-popover-badge--screen .nav-popover-badge__trigger {
  width: 100%;
  justify-content: flex-start;
  height: auto;
  padding: 12px 0 11px;
}

.nav-popover-badge--screen .nav-popover-badge__label {
  min-height: 36px;
}

.nav-popover-badge--screen .nav-popover-badge__panel {
  position: static;
  width: 100%;
  padding: 0 0 16px;
  transform: none;
}

.nav-popover-badge--screen .nav-popover-badge__content::before {
  display: none;
}

@media (max-width: 959px) {
  .nav-popover-badge__panel {
    left: auto;
    right: 0;
    transform: none;
  }

  .nav-popover-badge__content::before {
    left: auto;
    right: 28px;
    transform: rotate(45deg);
  }
}
</style>
