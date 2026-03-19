# 下载与安装<Badge type="tip" text="简单" />

::: tip
本文用于第一次安装`MaaYuan`，包含版本选择、解压规范与运行环境配置。
:::

> 一句话教学：下载解压`MaaYuan`本体 +下载安装两个`运行环境`
下载&安装&更新均配置了图文或视频版，请自行前往[B站](https://space.bilibili.com/3690998968355771)或[小红书](https://www.xiaohongshu.com/user/profile/685e3301000000001b0229ed)查阅

## 一、先确认适用系统

| 系统 | Windows | macOS |
| --- | --- | --- |
| 系统版本 | `Windows 10` 及以上 | `macOS 15.0` 及以上 |
| 运行环境 | 需要 | 需要 |
| 模拟器支持 | 支持 | 支持 |
| 安装包名 | `MaaYuan-win-x86_64-vXXX.zip` | `MaaYuan-macos-aarch64-vXXX.tar.gz` |

::: warning
- MaaYuan 当前仅支持 `Windows x64` 与 `macOS Apple Silicon（aarch64）`。
- Windows 端只提供 `x86_64` 安装包，不支持 Windows ARM。
- macOS 目前仅支持 Apple Silicon（`aarch64`）安装包；Intel Mac 暂不支持。
- 若你使用的是 Intel Mac，可优先考虑 Windows 10+ 环境下使用 Windows 版 MaaYuan 与模拟器。
- Linux、Android、iOS 以及其他未知平台当前均不支持。
:::

## 二、下载渠道说明

- 【最省事】[Mirror酱](https://mirrorchyan.com/zh/projects?rid=MaaYuan&source=navtop)下载，详细介绍请查阅【常见问题-Mirror酱是什么】
- 【第一手】[GitHub](https://github.com/syoius/MaaYuan)下载，需要科学上网，如果喜欢`MaaYuan`，请在项目右上角点亮`Star`支持。
- 【最多选】网盘下载。AI抓取Github后网盘分流，更新不一定及时

<SmartDownloadChannels />

## 三、解压要求

### Windows

- 正确解压到**独立文件夹**，勿拆分文件
- 避免路径含中文，推荐非系统盘,例如 `D:\MaaYuan`。
- 不要直接解压到 `C:\` 或 `C:\Program Files\`，否则可能涉及管理员权限问题。

### macOS

- 正确解压到**独立文件夹**，勿拆分文件
- 尽量避免路径含中文。
- 下载目录可以作为临时解压位置，但正式使用仍建议放在独立目录。

## 四、安装依赖库

### Windows

1. 打开 MaaYuan 文件夹。
2. 右键 `DependencySetup_依赖库安装_win.bat`。
3. 选择“以管理员身份运行”。

### macOS

1. 打开 MaaYuan 文件夹。
2. 在文件夹位置打开终端。
3. 执行以下命令：

```sh
sh DependencySetup_依赖库安装_mac.sh
```

## 五、如果依赖安装失败

### Windows 手动补装

1. 安装 `vc_redist.x64`。
2. 安装 `.NET 10` 桌面运行时（`Windows x64`）。
3. 安装完成后如提示重启，请务必重启电脑。

### macOS 手动补装

1. 无需安装 `VCRedist`。
2. 安装 `.NET 10` 运行时（`macOS Arm64` 或对应架构版本）。
3. 安装完成后如提示重启，请务必重启。

::: details 版本变化提醒
从 `v2.0.0` 起，MaaYuan 需要 `.NET 10` 及以上运行库，原来的 `.NET 8` 已不再满足要求。
:::

## 六、下一步

安装完成后，继续阅读：

- [首次启动](./FirstLaunch)
- [连接与更新](./ConnectionAndUpdate)
