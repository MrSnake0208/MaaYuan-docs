<script setup lang="ts">
import {
  hasAuthor,
  getAuthorBackground,
  homeCommunityLinksDescription,
  homeCommunityLinksTitle,
  getFeaturedLinks,
  getMoreLinks,
} from "../../shared/homeCommunityLinks.mjs";
import { ref, computed } from "vue";

const featuredLinks = getFeaturedLinks()
const moreLinks = getMoreLinks()
const showMore = ref(false)

const allLinks = computed(() => {
  return [...featuredLinks, ...moreLinks]
})

const lastFeaturedIndex = computed(() => featuredLinks.value.length - 1)
const lastMoreIndex = computed(() => allLinks.value.length - 1)

function getExternalTarget(external?: boolean) {
  return external ? "_blank" : undefined;
}

function getExternalRel(external?: boolean) {
  return external ? "noopener noreferrer" : undefined;
}

function toggleMore() {
  showMore.value = !showMore.value
}

defineOptions({ name: "HomeCommunityLinks" });
</script>

<template>
  <section
    class="home-community-links"
    aria-labelledby="home-community-links-title"
  >
    <div class="home-community-links__header">
      <h2 id="home-community-links-title" class="home-community-links__title">
        {{ homeCommunityLinksTitle }}
      </h2>
      <p class="home-community-links__description">
        {{ homeCommunityLinksDescription }}
      </p>
    </div>

    <div class="home-community-links__grid">
      <article
        v-for="(link, index) in allLinks"
        :key="link.text"
        v-show="!link.more || showMore"
        class="home-community-links__item"
        :class="{ 'has-author': hasAuthor(link) }"
      >
        <a
          class="home-community-links__primary"
          :href="link.href"
          :target="getExternalTarget(link.external)"
          :rel="getExternalRel(link.external)"
        >
          <span class="home-community-links__icon" aria-hidden="true">{{
            link.icon
          }}</span>

          <span class="home-community-links__text-group">
            <span class="home-community-links__text">{{ link.text }}</span>

            <span
              v-if="hasAuthor(link)"
              class="home-community-links__author-badge"
              :style="{
                '--author-badge-color': link.author?.color,
                '--author-badge-bg': getAuthorBackground(link)
              }"
            >
              {{ link.author?.name }}
            </span>
          </span>

          <span class="home-community-links__link-arrow" aria-hidden="true"
            >↗</span
          >
        </a>
      </article>

      <div
        v-if="moreLinks.length > 0"
        class="home-community-links__toggle-wrapper"
        :style="{
          '--featured-count': featuredLinks.length,
          '--total-count': allLinks.length
        }"
      >
        <button
          v-if="!showMore"
          class="home-community-links__more-button"
          @click="toggleMore"
        >
          <span>更多</span>
          <span class="home-community-links__more-arrow">▼</span>
        </button>
        <button
          v-else
          class="home-community-links__more-button home-community-links__more-button--collapse"
          @click="toggleMore"
        >
          <span>收起</span>
          <span class="home-community-links__more-arrow">▲</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-community-links {
  margin: 64px auto 24px;
  max-width: 1120px;
  padding: 0 24px;
}

.home-community-links__header {
  margin-bottom: 28px;
  text-align: center;
}

.home-community-links__title {
  margin: 0;
  font-size: clamp(1.65rem, 2.4vw, 2rem);
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.home-community-links__description {
  margin: 12px 0 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}

.home-community-links__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.home-community-links__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.home-community-links__primary {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 14px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 72%, transparent);
  color: var(--vp-c-text-1);
  text-decoration: none;
  box-shadow: 0 8px 24px rgb(15 23 42 / 8%);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.home-community-links__primary:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 14px 32px rgb(79 70 229 / 16%);
}

.home-community-links__icon {
  flex: none;
  font-size: 1.35rem;
  line-height: 1;
}

.home-community-links__text-group {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.home-community-links__text {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.home-community-links__author-badge {
  --author-badge-color: var(--vp-c-brand-1);
  --author-badge-bg: color-mix(in srgb, var(--author-badge-color) 16%, var(--vp-c-bg-soft));
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--author-badge-bg);
  color: var(--author-badge-color);
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1;
}

.home-community-links__link-arrow {
  flex: none;
  color: var(--vp-c-text-3);
  font-size: 0.96rem;
}

.home-community-links__toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-community-links__more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-height: 72px;
  padding: 14px 18px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 14px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.home-community-links__more-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
}

.home-community-links__more-arrow {
  font-size: 0.75rem;
}

.home-community-links__more-button--collapse {
  width: 100%;
  height: 100%;
  min-height: 72px;
  align-self: flex-end;
}

.dark .home-community-links__primary {
  box-shadow: 0 10px 26px rgb(2 6 23 / 28%);
}

.dark .home-community-links__primary:hover {
  box-shadow: 0 16px 34px rgb(99 102 241 / 22%);
}

@media (max-width: 640px) {
  .home-community-links {
    margin-top: 56px;
    padding-inline: 16px;
  }

  .home-community-links__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .home-community-links__primary {
    min-height: 68px;
    padding-inline: 14px;
  }

  .home-community-links__more-button {
    min-height: 68px;
    padding-inline: 14px;
  }
}

@media (max-width: 400px) {
  .home-community-links__grid {
    grid-template-columns: 1fr;
  }

  .home-community-links__more-button--collapse {
    width: 100%;
  }
}
</style>
