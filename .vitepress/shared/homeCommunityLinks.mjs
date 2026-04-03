export const homeCommunityLinksTitle = '工具与社区链接'
export const homeCommunityLinksDescription = '欢迎投稿共建社区~'

export const homeCommunityLinks = [
  {
    icon: '📤',
    text: '作业站',
    href: 'https://share.maayuan.top/',
    external: true,
    author: {
      name: 'MrSnake',
      url: 'https://github.com/MrSnake0208',
    },
  },
  {
    icon: '🐱',
    text: '咪教模拟器助手',
    href: 'https://meow.maayuan.top/',
    external: true,
  },
  {
    icon: '🍄',
    text: '躬耕南阳助手',
    href: 'https://fungi2025.maayuan.top/',
    external: true,
  },
  {
    icon: '⚔️',
    text: '朝歌之战助手',
    href: 'https://zhaoge.maayuan.top/',
    external: true,
  },
]

export function hasAuthor(link) {
  return Boolean(link?.author?.name?.trim())
}
