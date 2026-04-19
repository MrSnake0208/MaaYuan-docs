<script setup lang="ts">
import { contributors } from '../../../contributors'

defineOptions({ name: 'HomeContributors' })
</script>

<template>
  <section class="home-contributors" aria-labelledby="home-contributors-title">
    <div class="home-contributors__header">
      <h2 id="home-contributors-title" class="home-contributors__title">
        致谢
      </h2>
      <p class="home-contributors__description">
        感谢所有人的贡献与参与，是你们的帮助让MaaYuan越来越强大，以下排名不分先后
        <br>
🫱🏻‍🫲🏼欢迎主动提交PR加入我们
      </p>
    </div>

    <div class="home-contributors__grid">
      <template v-for="{ name, avatar, github } in contributors" :key="name">
        <a
          v-if="github"
          class="home-contributors__avatar-link"
          :href="`https://github.com/${github}`"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${name} on GitHub`"
          :title="name"
        >
          <img
            class="home-contributors__avatar"
            loading="lazy"
            :src="avatar"
            width="48"
            height="48"
            :alt="`${name} 的头像`"
          >
        </a>

        <span
          v-else
          class="home-contributors__avatar-link is-static"
          :aria-label="name"
          :title="name"
        >
          <img
            class="home-contributors__avatar"
            loading="lazy"
            :src="avatar"
            width="48"
            height="48"
            :alt="`${name} 的头像`"
          >
        </span>
      </template>
    </div>
  </section>
</template>

<style scoped>
.home-contributors {
  margin: 72px auto 24px;
  max-width: 900px;
  padding: 0 24px 24px;
  text-align: center;
}

.home-contributors__header {
  margin-bottom: 24px;
}

.home-contributors__title {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 600;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.home-contributors__description {
  margin: 12px 0 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}

.home-contributors__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.home-contributors__avatar-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--vp-c-default-soft);
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 8px 24px rgb(15 23 42 / 10%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.home-contributors__avatar-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgb(79 70 229 / 18%);
}

.home-contributors__avatar-link.is-static:hover {
  transform: none;
  box-shadow: 0 8px 24px rgb(15 23 42 / 10%);
}

.home-contributors__avatar {
  display: block;
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.dark .home-contributors__avatar-link {
  border-color: rgb(255 255 255 / 8%);
  box-shadow: 0 10px 24px rgb(2 6 23 / 35%);
}

.dark .home-contributors__avatar-link:hover {
  box-shadow: 0 14px 30px rgb(99 102 241 / 28%);
}

@media (max-width: 640px) {
  .home-contributors {
    margin-top: 56px;
    padding-inline: 16px;
  }

  .home-contributors__grid {
    gap: 12px;
  }
}
</style>
