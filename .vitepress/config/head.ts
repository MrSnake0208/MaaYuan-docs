import type { HeadConfig } from "vitepress";

export const head: HeadConfig[] = [
  ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
  ["meta", { name: "description", content: "MaaYuan 是代号鸢/如鸢玩家的实用助手，日常、活动、高难关卡直接拿捏，解放双手，畅玩无忧！立即了解如何使用或参与开发 MaaYuan，并查看更多代号鸢/如鸢攻略与实用工具。" }],
  ["meta", { property: "og:type", content: "website" }],
  ["meta", { property: "og:locale", content: "zh_CN" }],
  ["meta", { property: "og:title", content: "MaaYuan 开发及使用手册 | 代号鸢/如鸢小助手" }],
  ["meta", { property: "og:description", content: "MaaYuan 是代号鸢/如鸢玩家的实用助手，日常、活动、高难关卡直接拿捏，解放双手，畅玩无忧！立即了解如何使用或参与开发 MaaYuan，并查看更多代号鸢/如鸢攻略与实用工具。" }],
  ["link", { rel: "icon", href: "/favicon.ico" }],
  ["link", { rel: "apple-touch-icon", href: "/icon.png" }],
];
