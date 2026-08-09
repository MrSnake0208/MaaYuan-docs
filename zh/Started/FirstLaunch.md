# 首次启动<Badge type="tip" text="新手" />

::: tip
首次启动 `MaaYuan` 会自动安装/更新依赖库，请耐心等待安装任务完成，如任务长时间未完成，请查阅[【常见问题-问题排查】](../FAQ/01-general-issues)，后续每天第一次启动 `MaaYuan` 都会先自启动检测当前版本及依赖库，是正常操作。
:::

## 第一次运行

### Windows

- 双击运行 `MaaYuan.exe` 。
- 初次运行若**报错**，找到文件夹内 **DependencySetup_依赖库安装_win.bat** → 右键「以管理员身份运行」→ 根据提示操作 → 重启电脑；若不成功请查阅[【下载与安装-安装运行环境（依赖库）】](../Started/Install.html#%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83-%E4%BE%9D%E8%B5%96%E5%BA%93)。

### macOS

- **开启运行权限**：终端输入指令：`sudo spctl --master-disable`，输入密码（输入时无显示，确认后回车）。
- 打开 **系统设置 → 隐私与安全性 → 安全性** → 选择「任何来源」。
- 打开 **系统设置 → 隐私与安全性** → 底部「已阻止使用的应用」→ 点击「仍然允许」。
- **处理弹窗**：后续若多次弹窗阻止，保持「隐私与安全性」窗口打开，重复点击「仍然允许」。
- **验证**：点击文件夹中 `MaaYuan` 成功后会弹出 `MaaYuan` 主窗口；若无反应，重新执行权限指令。
- **启动**：进入安装目录，找到 `MaaYuan` **文件** → 右键「制作替身」（快捷方式），将替身拖到桌面/启动栏，后续直接点击启动。

## 模拟器适配

- **模拟器支持**：可参考 MAA 文档站，查阅[模拟器和设备支持](https://docs.maa.plus/zh-cn/manual/device/)，确认正在使用的模拟器支持情况。
- **分辨率**：模拟器分辨率应为手机版 720×1280 DPI 320。

## 代号鸢/如鸢客户端下载
- 推荐使用官网下载，代号鸢可使用**biubiu加速器**下载。下载后需要将apk文件导入模拟器安装。
<table>
    <tbody>
        <tr>
            <td align="center">游戏名</td>
            <td align="center" colspan="3">代号鸢</td>
            <td align="center">如鸢</td>
        </tr>
        <tr>
            <td align="center">区服</td>
            <td align="center">台服</td>
            <td align="center" colspan="2">港澳服</td>
            <td align="center">国服</td>
        </tr>
        <tr>
            <td align="center">游戏语言</td>
            <td align="center" colspan="2">繁中</td>
            <td align="center" colspan="2">简中</td>
        </tr>
        <tr>
            <td align="center">官服</td>
            <td align="center">
                <a href="https://ashesofthekingdom.sialiagames.com.tw/prism-ledum2pm/?access=1002_2002_3003#/">官网</a>/谷歌
            </td>
            <td align="center">谷歌</td>
            <td align="center">
                <a href="https://ashesofthekingdom.qookkagames.com/prism-leduk39b/?access=1004_2001_3003#/">官网</a>
            </td>
            <td align="center">
                <a href="https://yuan.lingxigames.com/">官网</a>/Tap
            </td>
        </tr>
        <tr>
            <td align="center">渠道服</td>
            <td align="center" colspan="3">/</td>
            <td align="center">九游/小米/华为/OPPO</td>
        </tr>
    </tbody>
</table>

- 关于下载渠道**Tap版本**，在数据中客户端的名称与官网下载是不同的，如果不需要执行任务列表中的**启动游戏**，可无视此差异。
- 关于下载渠道**谷歌版本**，在数据中客户端的名称与官网下载是不同的，如果不需要执行任务列表中的**启动biubiu**，可无视此差异。

## 开启一键解放双手

- 勾选想要执行的任务，点击“开始任务”运行你的 `MaaYuan` 吧。
- 更多关于任务的说明请继续阅读[项目概览](../Manual/Overview) 或 [功能介绍](../Features/HomeInterface)。

## 常见首次启动异常

- 长时间卡在依赖安装：请查阅[【常见问题】](../FAQ/01-general-issues)。
- 双击无反应：检查运行库是否安装及系统权限。
- 模拟器未适配：优先确认分辨率、ADB 连接与后台保活设置。
