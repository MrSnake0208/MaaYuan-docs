<script setup lang="ts">
import {
  hasAuthor,
  homeCommunityLinks,
  homeCommunityLinksDescription,
  homeCommunityLinksTitle,
} from "../../shared/homeCommunityLinks.mjs";

function getExternalTarget(external?: boolean) {
  return external ? "_blank" : undefined;
}

function getExternalRel(external?: boolean) {
  return external ? "noopener noreferrer" : undefined;
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
        v-for="link in homeCommunityLinks"
        :key="link.text"
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
            >
              {{ link.author?.name }}
            </span>
          </span>

          <span class="home-community-links__link-arrow" aria-hidden="true"
            >↗</span
          >
        </a>
      </article>
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-bg-soft));
  color: var(--vp-c-brand-1);
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1;
}

.home-community-links__link-arrow {
  flex: none;
  color: var(--vp-c-text-3);
  font-size: 0.96rem;
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
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .home-community-links__primary {
    min-height: 68px;
    padding-inline: 14px;
  }
}
</style>
