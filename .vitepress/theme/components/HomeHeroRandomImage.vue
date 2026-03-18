<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { heroRandomImages } from 'virtual:hero-random-images'

const imagePaths = heroRandomImages

function getRandomIndex(excludedIndex = -1) {
  if (imagePaths.length === 0)
    return -1

  if (imagePaths.length === 1)
    return 0

  let nextIndex = excludedIndex
  while (nextIndex === excludedIndex)
    nextIndex = Math.floor(Math.random() * imagePaths.length)

  return nextIndex
}

const currentIndex = ref(getRandomIndex())
const currentSrc = computed(() => currentIndex.value >= 0 ? imagePaths[currentIndex.value] : '')
const loaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

function syncLoadedState() {
  const image = imageRef.value
  if (!image)
    return

  loaded.value = image.complete && image.naturalWidth > 0
}

function pickAnotherIndex() {
  if (imagePaths.length <= 1)
    return currentIndex.value

  return getRandomIndex(currentIndex.value)
}

function switchRandomImage() {
  if (!currentSrc.value)
    return

  loaded.value = false
  currentIndex.value = pickAnotherIndex()
}

function onLoad() {
  loaded.value = true
}

onMounted(() => {
  syncLoadedState()
})

watch(currentSrc, async () => {
  if (!currentSrc.value) {
    loaded.value = false
    return
  }

  await nextTick()
  syncLoadedState()
})
</script>

<template>
  <div class="home-random-hero" @click="switchRandomImage">
    <img
      v-if="currentSrc"
      ref="imageRef"
      class="image-src hero-random-image"
      :class="{ loaded }"
      :src="currentSrc"
      alt="MaaYuan 首页随机图"
      loading="eager"
      decoding="async"
      @load="onLoad"
    >
    <div v-if="currentSrc" class="image-tooltip">
      😭 求你别看了，戳就完事了
    </div>
  </div>
</template>

<style scoped>
.home-random-hero {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}

.hero-random-image {
  opacity: 0;
  transition: opacity 0.25s ease;
  user-select: none;
}

.hero-random-image.loaded {
  opacity: 1;
}

.image-tooltip {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.68);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
}

.home-random-hero:hover .image-tooltip {
  opacity: 1;
}

@media (max-width: 768px) {
  .image-tooltip {
    font-size: 11px;
    bottom: 2px;
  }
}
</style>
