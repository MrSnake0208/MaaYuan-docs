import communityLinksData from "./data/communityLinks.json";

export const homeCommunityLinksTitle = communityLinksData.title;
export const homeCommunityLinksDescription = communityLinksData.description;
export const homeCommunityLinks = communityLinksData.links;

export function hasAuthor(link) {
  return Boolean(link?.author?.name?.trim())
}

export function getAuthorBackground(link) {
  if (link?.author?.background) {
    return link.author.background
  }
  return `color-mix(in srgb, ${link?.author?.color || 'var(--vp-c-brand-1)'} 16%, var(--vp-c-bg-soft))`
}

export function getFeaturedLinks() {
  return homeCommunityLinks.filter(link => !link.more)
}

export function getMoreLinks() {
  return homeCommunityLinks.filter(link => link.more === true)
}
