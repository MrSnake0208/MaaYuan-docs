import announcementEntries from './data/announcements.json'

export function createAnnouncementNavMenuItems(renderContent = content => content) {
  return announcementEntries.map(({ text, content }) => ({
    component: 'AnnouncementNavAction',
    props: {
      title: text,
      content: renderContent(content).trim(),
    },
  }))
}
