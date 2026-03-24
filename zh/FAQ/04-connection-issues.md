# 连接问题<Badge type="danger" text="问题" />

::: danger 危险
使用`MaaYuan`前，请确认是否已自行安装并打开模拟器。
:::

## 模拟器设置

- 关闭模拟器后台保活；
- 模拟器旧版本可能连接不上，请更新模拟器
- 手动打开模拟器→启动游戏→游戏内（能看见游戏头像与昵称的页面）打开`MaaYuan`。
- 不同模拟器的设置

  - 雷电模拟器，请调整模拟器分辨率，版本可升级至9.0.37以及以上；
  - 夜神模拟器，请切换触控模式：`MaaYuan`设置-触控模式-选择“*AutoDetect*（自动检测）”

  - 蓝叠模拟器

    - 请下载 “[蓝叠adb tools](https://wwsq.lanzoue.com/i0Yhg2gk5czg) ” 并解压，将其地址手动填写至adb路径

    - 检查是否打开了adb连接：`设置` - `高级` - `Android调试（ADB）`

  -     <details>
            <summary>MuMu模拟器（点击前方▶️ 展开）</summary>
            - WIN系统-MuMu模拟器：[MuMu模拟器如何连接 adb？_MuMu模拟器_安卓模拟器](https://mumu.163.com/help/20240807/40912_1073151.html)
        
        - MAC系统-MuMu模拟器Pro：[如何连接ADB？_MuMu模拟器_安卓模拟器](https://mumu.163.com/mac/tutorials/connect-adb.html)
        
        - [MuMu模拟器12如何连接adb](https://mumu.163.com/help/20240807/40912_1073151.html)
        
        - [使用UU加速器后无法通过ADB连接MuMu12](https://mumu.163.com/help/20240807/40912_1144608.html)
        
        - [MuMu模拟器桥接模式连接adb教程](https://mumu.163.com/help/20240807/40912_1164744.html)
        - [MuMu模拟器12adb远程调试功能教程](https://mumu.163.com/help/20240902/40912_1178199.html)
          </details>


## 更新过后连不上模拟器

- 提示资源加载失败 → 删除现有`MaaYuan`文件夹，重新下载/解压
- 能搜到模拟器 → 点【自定义】→【保存】
- 搜不到模拟器 → 重启（按顺序尝试）：`MaaYuan`→ 模拟器 → 电脑
- ADB异常 → 强制关闭ADB工具后重新搜索

## 对“adb.exe”路径的访问被拒绝

可能原因：

- ADB路径/文件检测错误（自动检测时）；
- 无权限访问ADB或相关文件；
- 硬盘故障导致文件访问重定位失败。

解决办法：

- 手动替换ADB；
- 改用自定义连接。

## ADB被占用

常见原因及处理
- 手机助手占用：关闭手机助手及后台进程
- 多开冲突：检查是否被其他`MaaYuan`/游戏占用
- 残留进程：通过任务管理器结束所有`adb`相关进程后重试

基础解决步骤
关闭`MaaYuan`→ 打开任务管理器（Ctrl+Shift+Esc）→ 结束所有名称含`adb`的进程→ 重启`MaaYuan`，若仍失败，下载运行工具：`如果提示adb文件被占用请打开我.bat`

**高级排查（日志报错时）**（点击前方▶️ 展开）

典型错误特征：

- ```
  error: cannot bind to 127.0.0.1:5037（端口占用）
  adb server version不匹配
  ```


**定位占用程序**：

- 按`Win+R`输入`cmd`回车

- 执行命令（示例）：

  - ```
    netstat -aon|findstr 5037  # ADB守护端口
    netstat -aon|findstr 5555  # 模拟器常用端口
    ```

- 记录输出中的`PID`（末尾数字）

- 在任务管理器（需开启PID显示）找到对应PID进程，结束可疑程序

**附：开启任务管理器PID显示**

- 右键任务管理器表头 → 勾选`PID`

## 关闭外置VPN

- 部分加速器在启动加速和停止加速之后，都需要重启`MaaYuan`、Adb 和模拟器再连接。
- 同时使用 UU 加速器 和 MuMu 12 可以参考[**官方文档**](https://mumu.163.com/help/20240321/35047_1144608.html)。
- MuMu12模拟器支持内置加速功能，无需外置加速。

## 确认 Adb 及连接地址正确

自动连接检测失败

- 尝试以管理员权限启动`MaaYuan`（右键`MaaYuan.exe`，选以管理员身份运行）再检测；
- 仍失败，参考手动设置，确认模拟器和连接地址在下方列表。
- 支持设备及地址（点击前方▶️ 展开）
  - BlueStacks 5：`127.0.0.1:5555/5556/5565/5575/5585/5595/5554`
  - MuMu 模拟器 12：`127.0.0.1:16384/16416/16448/16480/16512/16544/16576`
  - 雷电模拟器 9：`emulator-5554/5556/5558/5560`, `127.0.0.1:5555/5557/5559/5561`
  - 夜神模拟器：`127.0.0.1:62001/59865`
  - 逍遥模拟器：`127.0.0.1:21503`

手动连接设置

- 填写信息：`MaaYuan`主界面 - 右上角连接框内 - 点击自定义按钮，填 adb 地址及路径；

- 导入 ADB路径：点击 Adb 路径后的“导入”，在模拟器的安装路径中找到 adb 的 exe 文件（如 adb.exe），点击打开；
- 模拟器ADB地址：本机模拟器连接地址为 127.0.0.1:<端口号> 或 emulator-<四位数字>。

- 常见模拟器地址（点击前方▶️ 展开）

  - BlueStacks 5：`127.0.0.1:5555/5556/5565/5575/5585/5595/5554`
  - MuMu 模拟器 12：`127.0.0.1:16384/16416/16448/16480/16512/16544/16576`
  - 雷电模拟器 9：`emulator-5554/5556/5558/5560`, `127.0.0.1:5555/5557/5559/5561`
  - 夜神模拟器：`127.0.0.1:62001/59865`
  - 逍遥模拟器：`127.0.0.1:21503`

- 替换Adb（解决连接/报错问题）：

  - 下载[platform tools](https://wwsq.lanzoue.com/i0Yhg2gk5czg)并解压到**全英文路径**；
  - 打开`MaaYuan`设置 → 连接 → 点击Adb路径图标 → 选择解压文件夹内的**adb.exe**（*不可单独使用，需保留完整文件*）；
  - **重要**：若用自定义连接，勿点“刷新”或“自动检测”（避免路径被重置）。

- 防火墙问题：临时关闭防火墙，并将 **adb.exe** 加入白名单。

- 路径问题：确保`MaaYuan`和platform tools所在目录**无中文/特殊字符**（改用全英文路径）。

## 启动Agent无进展

正在安装运行库，请稍候（通常10-15秒进入下一步）。若卡在“启动 Agent”无进展：

- 重启尝试；

- 重新安装尝试：

  - 不给机会：删除当前报错的文件夹，前往导航站下载完整包，重新解压；
  - 再给机会：选择设置-更新设置-重新下载资源全量包。

- Mac用户：可能因安全限制，可询问AI（如：“Mac上程序调用的嵌入式Python环境无法启动”）；

- 其他情况：关闭MuMu12模拟器支持内置加速功能，将`debug/maa.log`文件提供给AI排查并按指引操作。

## 依赖安装失败

如果显示**依赖安装失败**，请尝试手动安装依赖库。

- **手动安装依赖库方法：**（点击前方▶️ 展开）
  - 注意终端内均为英文符号

  - win+R，输入cmd，回车打开终端
  - 先输入`D:`/`E:`/`F:`，回车，切换到MaaYuan所在的盘。例如在D盘，则输入`D:`，回车
- ![https://docimg2.docs.qq.com/image/AgAABTTp4UWJHEwtrRdCJbAApElzBVcY.png?w=636&h=273](https://docimg2.docs.qq.com/image/AgAABTTp4UWJHEwtrRdCJbAApElzBVcY.png?w=636&h=273)

切换成功后，输入以下内容：

- ```
  D:\MaaYuan-win-x86_64-v0.9.13-beta.7\python\python.exe -m pip install maafw pandas openpyxl loguru opencv-python zhconv -i https://pypi.tuna.tsinghua.edu.cn/simple
  ```


注意：需要把`\python`前面的内容改成自己maa所在的路径（能看到python文件夹的这一页），

例如：

- ```
  D:\麻园\MaaYuan-win-x86_64-v0.9.13-beta.7\python\python.exe -m pip install maafw pandas openpyxl loguru opencv-python zhconv -i https://pypi.tuna.tsinghua.edu.cn/simple
  ```

  - 输入完成后回车，耐心等待安装完毕。

  - 之后打开`MaaYuan`，等待显示依赖安装成功即可。

- 如果显示因网络问题失败，尝试将-i 后的地址更换其它镜像源，如：`https://mirrors.aliyun.com/pypi/simple`

- 如果手动安装过程中遇到报错，可将报错内容复制发给AI让其分析解决方案。