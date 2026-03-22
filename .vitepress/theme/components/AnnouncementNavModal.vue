<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BaseModal from './BaseModal.vue'

interface AnnouncementDetail {
  title: string
  content: string
}

const isVisible = ref(false)
const activeTitle = ref('')
const activeHtml = ref('')

function openAnnouncement(item: AnnouncementDetail) {
  isVisible.value = true
  activeTitle.value = item.title
  activeHtml.value = item.content
}

function closeAnnouncement() {
  isVisible.value = false
}

function handleOpenAnnouncement(event: Event) {
  const detail = (event as CustomEvent<AnnouncementDetail>).detail
  if (!detail?.title)
    return

  openAnnouncement(detail)
}

onMounted(() => {
  window.addEventListener('maayuan:open-announcement', handleOpenAnnouncement)
})

onUnmounted(() => {
  window.removeEventListener('maayuan:open-announcement', handleOpenAnnouncement)
})
</script>

<template>
  <BaseModal
    :is-visible="isVisible"
    content-class="notice-modal"
    @close="closeAnnouncement"
  >
    <section class="notice-modal__container">
      <header class="notice-modal__header">
        <div class="notice-modal__header-main">
          <p class="notice-modal__eyebrow">
            导航公告弹窗
          </p>
          <h2 class="notice-modal__title">
            {{ activeTitle }}
          </h2>
        </div>
        <div class="notice-modal__actions">
          <button
            type="button"
            class="notice-modal__close"
            @click="closeAnnouncement"
          >
            关闭
          </button>
        </div>
      </header>

      <article
        class="notice-modal__body vp-doc"
        v-html="activeHtml"
      />
    </section>
  </BaseModal>
</template>

<style scoped>
.notice-modal {
  width: min(92vw, 960px);
  max-height: min(88vh, 900px);
  padding: 0;
  overflow: hidden;
}

.notice-modal__container {
  display: flex;
  flex-direction: column;
  min-height: 240px;
  max-height: inherit;
}

.notice-modal__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, var(--vp-c-brand-1) 8%);
}

.notice-modal__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.notice-modal__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
}

.notice-modal__actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.notice-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 92px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notice-modal__close:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.notice-modal__body {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}

.notice-modal__body :deep(h1) {
  display: none;
}

.notice-modal__body :deep(h2) {
  display: block;
  min-width: 0;
  width: auto;
  margin-right: 0;
  white-space: normal;
}

.notice-modal__body :deep(h2::before),
.notice-modal__body :deep(h2::after) {
  display: none;
}

.notice-modal__body :deep(p),
.notice-modal__body :deep(li),
.notice-modal__body :deep(code),
.notice-modal__body :deep(a) {
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 768px) {
  .notice-modal {
    width: min(96vw, 960px);
    max-height: 92vh;
  }

  .notice-modal__header {
    flex-direction: column;
    align-items: stretch;
  }

  .notice-modal__actions {
    justify-content: flex-end;
  }
}
</style>
