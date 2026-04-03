import communityLinksData from './data/communityLinks.json'

export const homeCommunityLinksTitle = communityLinksData.title
export const homeCommunityLinksDescription = communityLinksData.description
export const homeCommunityLinks = communityLinksData.links

export function hasAuthor(link) {
  return Boolean(link?.author?.name?.trim())
}
