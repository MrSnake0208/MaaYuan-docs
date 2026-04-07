import communityLinksData from './data/communityLinks.json'

export const homeCommunityLinksTitle = communityLinksData.title
export const homeCommunityLinksDescription = communityLinksData.description
export const homeCommunityLinks = communityLinksData.links

export function hasAuthor(link) {
  return Boolean(link?.author?.name?.trim())
}

// 获取所有分类（按出现顺序）
export function getCategories() {
  const categories = [...new Set(homeCommunityLinks.map(link => link.category).filter(Boolean))]
  return categories
}

// 按分类分组的链接
export function getLinksByCategory() {
  const grouped = {}
  for (const link of homeCommunityLinks) {
    const cat = link.category || '其他'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(link)
  }
  return grouped
}

// 获取指定分类的链接
export function getLinksByCategoryName(categoryName) {
  return homeCommunityLinks.filter(link => link.category === categoryName)
}

// 获取作者背景色（默认为 color 的 16% 透明度混合）
export function getAuthorBackground(link) {
  if (link?.author?.background) {
    return link.author.background
  }
  return `color-mix(in srgb, ${link?.author?.color || 'var(--vp-c-brand-1)'} 16%, var(--vp-c-bg-soft))`
}
