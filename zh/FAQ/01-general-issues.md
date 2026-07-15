# 问题排查<Badge type="danger" text="必读" />

## 打不开
- 若`MaaYuan`在电脑某次更新/蓝屏/死机后无法运行，或者单纯是从报错窗口来到这的，那八成是由于运行库未更新导致的问题。请先阅读[下载与安装](https://maayuan.top/Started/Install.html)。
- 如果`MaaYuan`无法正常启动、ADB 被占用，或提示应用受系统限制，mac系统可尝试解除隔离，强制关闭所有`MaaYuan`和ADB进程：
1. 按Cmd+Option+Esc强制退出`MaaYuan`，
2. 打开终端（Terminal）依次执行：
```
pkill -f hd-adb
pkill -f adb
```
3. 如果仍无法启动，可能是macOS的Gatekeeper隔离属性导致。执行以下命令解隔离，将`<MAA应用路径>`替换为`MaaYuan`的实际路径：
```
xattr -dr com.apple.quarantine <MAA应用路径>
```

## 懒得查

- 可以先尝试让[deepseek](https://www.deepseek.com/)（或其他AI软件）来解决
- 文件位置：`/debug/maa.log`
- 提问格式：`根据以上日志信息，帮我分析可能是什么方面的问题，并告诉我如何解决`
- 文件如果太大，AI会拒绝分析，可以尝试删除log文件，复现问题，再上传到AI询问。

## 不干活

- **更新软件**：确保`MaaYuan`为最新版本。
- **关闭模拟器后台保活**：
  - 例如 MuMu 模拟器：右上角菜单 → 设置中心 → 其他 → 取消勾选“后台挂机时保活运行”。
- **检查分辨率**：[首次启动-模拟器适配](https://maayuan.top/Started/FirstLaunch.html)。
- **重装软件**：重新安装`MaaYuan`和模拟器。
- **更换触控方式**：尝试在MaaYuan设置-连接设置-触控方式中切换成其他触控方式。
- **游戏简繁体：**[常见问题](https://maayuan.top/FAQ/05-runtime-issues.html#%E5%90%AF%E5%8A%A8%E6%B8%B8%E6%88%8F%E6%97%A0%E6%B3%95%E8%BF%90%E8%A1%8C)

## 管理员权限说明

通常无需管理员权限即可运行，但以下情况除外：

- **目标模拟器以管理员运行**：自动检测连接或关闭模拟器时需管理员权限。
- **安装路径无写入权限**：如解压到`C:\`或`C:\Program Files\`等受保护目录。

⚠️ 注意：若关闭UAC后出现意外提权（未手动选择管理员仍以高权限启动），建议开启UAC以增强安全性。
