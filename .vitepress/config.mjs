import { createMarkdownRenderer, defineConfig } from "vitepress";
import { createAnnouncementNavMenuItems } from "./shared/announcementNav.mjs";
import { navPopoverData } from "./shared/navPopover.mjs";
import { head } from "./config/head";
import { heroRandomImagesPlugin } from "./plugins/heroRandomImages.mjs";

const announcementMarkdownRenderer = await createMarkdownRenderer(process.cwd());
const announcementNavMenuItems = createAnnouncementNavMenuItems(content =>
  announcementMarkdownRenderer.render(content)
);

export default defineConfig({
  title: "MaaYuan Docs",
  description: "MaaYuan 文档站",
  head,
  vite: {
    plugins: [heroRandomImagesPlugin()],
  },

  rewrites: {
    "zh/:rest*": ":rest*",
  },

  srcExclude: ["README.md", "operations-log.md", "scripts/**", "tests/**"],

  lastUpdated: true,
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      themeConfig: {
        nav: [
          {
            component: "NavPopoverBadge",
            props: navPopoverData,
          },
          {
            text: "📢 公告",
            items: announcementNavMenuItems,
          },
          {
            text: '📖 使用手册',
            items: [
              { text: '快速开始', link: '/Started/Install' },
              { text: '关于MaaYuan', link: '/Manual/Overview' },
              { text: '功能介绍', link: '/Features/InstancesAndTaskList' },
              { text: '任务介绍', link: '/Activity/Current' },
              { text: '常见问题', link: '/FAQ/' },
            ],
          },
          { 
            text: '🛠️ 开发手册', 
            items: [
              { text: "MaaYuan零基础开发指南", link: "/Developer/0.0-MaaYuan零基础开发指南" },
              { text: "开发工具介绍", link: "/Developer/0.1-开发工具介绍" },
              { text: "MaaYuan开发规范", link: "/Developer/1.0-MaaYuan开发规范" },
              { text: "节点信息输出", link: "/Developer/1.1-节点信息输出" },
              { text: "interface字段配置", link: "/Developer/1.2-interface字段配置" },
              { text: "日常行动通用模块", link: "/Developer/4.1-日常行动通用模块" },
              { text: "其它通用模块", link: "/Developer/4.3-其它通用模块" },
            ],
          },
          {
            text: '🔗 友情链接',
            items: [
              { text: 'Maa', link: 'https://maa.plus/' },
              { text: 'Mirror酱', link: 'https://mirrorchyan.com/zh/projects?rid=MaaYuan&source=navtop' },
              { text: 'MaaLYSK', link: 'https://maalysk.top/zh_cn/' },
              { text: '代号鸢BWiki', link: 'https://wiki.biligame.com/yuan/%E9%A6%96%E9%A1%B5' },
            ],
          },
        ],
        sidebar: {
          "/Developer/": [
            {
              text: "🛠️ 开发手册",
              items: [
                { text: "MaaYuan零基础开发指南", link: "/Developer/0.0-MaaYuan零基础开发指南" },
                { text: "开发工具介绍", link: "/Developer/0.1-开发工具介绍" },
                { text: "MaaYuan开发规范", link: "/Developer/1.0-MaaYuan开发规范" },
                { text: "节点信息输出", link: "/Developer/1.1-节点信息输出" },
                { text: "interface字段配置", link: "/Developer/1.2-interface字段配置" },
                { text: "日常行动通用模块", link: "/Developer/4.1-日常行动通用模块" },
                { text: "其它通用模块", link: "/Developer/4.3-其它通用模块" },
              ],
            },
          ],
          "/": [
            {
              text: "🚀 快速开始",
              items: [
                { text: "下载与安装", link: "/Started/Install" },
                { text: "首次启动", link: "/Started/FirstLaunch" },
                { text: "连接与更新", link: "/Started/ConnectionAndUpdate" },
              ],
            },
            {
              text: "📘 关于MaaYuan",
              items: [
                { text: "项目概览", link: "/Manual/Overview" },
                { text: "反馈方式", link: "/Manual/Feedback" },
                { text: "公告存档", link: "/Manual/AnnouncementArchive" },
                { text: "加入我们", link: "/Manual/JoinUs" },
              ],
            },
            {
              text: "⚙️ 功能介绍",
              items: [
                { text: "实例与任务列表", link: "/Features/InstancesAndTaskList" },
                { text: "日常任务说明", link: "/Features/DailyTasks" },
                { text: "进阶功能说明", link: "/Features/AdvancedTasks" },
                { text: "通知设置", link: "/Features/Notifications" },
                { text: "作业功能", link: "/Features/HomeworkShare" },
              ],
            },
            {
              text: "🎉 活动指南",
              items: [
                { text: "当前活动", link: "/Activity/Current" },
                { text: "常驻任务", link: "/Activity/Permanent" },
                { text: "往期任务", link: "/Activity/EventArchive"},
              ],
            },
            {
              text: "💫 常见问题",
              items: [{ text: "FAQ", link: "/FAQ/" }],
            },
          ],
        },

        outline: {
          level: [2, 3],
          label: "目录",
        },
        darkModeSwitchLabel: "切换主题",
        sidebarMenuLabel: "文档目录",
        returnToTopLabel: "返回顶部",
        docFooter: {
          prev: "上一篇",
          next: "下一篇",
        },
        editLink: {
          pattern: "https://github.com/MrSnake0208/MaaYuan-docs/edit/main/:path",
          text: "在 GitHub 上编辑此页",
        },
        logo: "/icon.png",
        socialLinks: [{ icon: "github", link: "https://github.com/MrSnake0208/MaaYuan-docs" }],
        footer: {
          message: 'MaaYuan 为免费开源项目，欢迎前往 <a href="https://github.com/MrSnake0208/MaaYuan-docs" target="_blank" rel="noreferrer">GitHub</a> 关注文档更新。',
          copyright: 'MaaYuan Docs · Built with VitePress',
        },
      },
    },
  },

  themeConfig: {
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
  },
});