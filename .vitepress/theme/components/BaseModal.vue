<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

type ClassValue = HTMLAttributes['class']

const props = withDefaults(defineProps<{
  isVisible: boolean
  teleportTo?: string
  closeOnOverlay?: boolean
  overlayClass?: ClassValue
  contentClass?: ClassValue
  useContentWrapper?: boolean
}>(), {
  teleportTo: 'body',
  closeOnOverlay: true,
  useContentWrapper: true,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'overlayClick', event: MouseEvent): void
  (e: 'wheel', event: WheelEvent): void
}>()

function handleOverlayClick(event: MouseEvent) {
  emit('overlayClick', event)

  if (props.closeOnOverlay)
    emit('close')
}
</script>

<template>
  <Teleport :to="teleportTo">
    <transition name="modal-fade">
      <div
        v-if="isVisible"
        class="base-modal-overlay"
        :class="overlayClass"
        @click="handleOverlayClick"
        @wheel="$emit('wheel', $event)"
      >
        <transition name="modal-scale">
          <div
            v-if="isVisible && useContentWrapper"
            class="base-modal-content"
            :class="contentClass"
            @click.stop
          >
            <slot />
          </div>
        </transition>
        <template v-if="!useContentWrapper">
          <slot />
        </template>
      </div>
    </transition>
  </Teleport>
</template>

<style>
.base-modal-overlay {
  position: fixed !important;
  inset: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  z-index: 2147483647 !important;
  overflow: hidden !important;
}

.base-modal-content {
  position: relative;
  width: min(90vw, 640px);
  max-width: 100%;
  max-height: 90vh;
  overflow: auto;
  border-radius: 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}
</style>
