# TianshanOS root 运维指南

![TianshanOS](图片和附件/tsintro.png)

本指南面向使用 root 账户管理 TianshanOS 的运维人员。第一部分介绍 admin 与 root 共用的日常功能，第二部分介绍 root 专属的“终端”“指令”和“自动化”。安全管理请切换到《TianshanOS 安全指南》。

root 可以执行会改变设备、远程主机和自动化流程的高影响操作。开始操作前，应确认当前设备、目标主机和正在运行的任务。

设备型号、硬件配置和当前状态会影响页面显示。页面未显示的设备、按钮或选项无需操作。

## 第一部分：admin 与 root 共用的日常功能

### 1. 开始使用

#### 进入 WebUI

1. 在浏览器中打开设备的 WebUI 地址。
2. 点击页面右上角的“登录”。
3. 输入 `root` 和设备提供的 root 密码。
4. 点击“登录”。登录成功后，右上角会显示当前用户名。

首次使用默认密码登录时，页面会显示“安全提醒”。可以在弹窗中输入当前密码和新密码，随后点击“立即修改”。新密码需要输入两次并保持一致。选择“稍后修改”会关闭提醒。

完成操作后，点击右上角的“退出登录”。页面会返回“系统”。

#### 切换语言

点击页面顶部的语言按钮，在菜单中选择中文或 English。页面内容和按钮名称会立即切换到所选语言。

#### 页面导航

root 可以使用以下入口：

- “系统”：查看设备状态，控制模组、风扇和 LED，并进入 OTA 升级。
- “网络”：查看和调整以太网、WiFi、DHCP 与 NAT 设置。
- “文件”：管理 SD 卡和 SPIFFS 中的文件。
- “终端”：使用设备控制台并查看系统日志。
- “自动化”：管理数据源、变量、动作模板和规则。
- “指令”：管理并运行远程 SSH 指令。
- “安全”：进入单独的安全管理页面，详细操作请查看安全指南。

### 2. 系统状态与常用操作

点击顶部导航中的“系统”进入系统页面。

#### 查看资源与服务状态

“资源监控”显示 CPU、DRAM 和 PSRAM 的使用情况。DRAM 是设备的主要运行内存，PSRAM 是扩展内存。

- 点击“详情”查看内存总量、已用空间、空闲空间和碎片率。
- “服务”按钮旁显示正在运行的服务数量和服务总数。
- 点击“服务”查看各项服务的状态、阶段和健康情况。

服务状态为“失败”或健康状态异常时，可以先刷新页面确认状态。

#### 查看系统与电源信息

“系统总览”显示芯片、固件版本、运行时间和编译时间。“电源状态”显示输入电压、内部电压、电流、功率和保护状态。

保护状态旁的开关用于启用或停用低电压保护。启用后，系统会在输入电压过低时执行已设置的关机和恢复流程。

#### 查看网络与时间

“网络与时间”显示以太网、WiFi、IP 地址、当前时间、同步状态、时间源和时区。

- 点击“同步时间”，将浏览器当前时间同步到设备。
- 点击“时区”，选择预设时区或填写页面支持的时区设置，然后保存。
- 点击“OTA 升级”，进入固件升级页面。

#### 高级操作

##### 重启 TianshanOS

重启会暂时中断 WebUI、终端、自动化和设备管理功能。确认当前操作已经完成后，点击“重启”并确认。页面会提示系统正在重启，设备恢复后可以重新打开 WebUI。

##### 重启单项服务

重启服务会暂时中断该服务提供的功能。在“服务状态”中找到异常服务，点击该行的“重启”。操作完成后重新查看状态和健康信息。

##### 调整关机设置

更改电压阈值或等待时间会影响设备的关机与恢复行为。修改前应确认设备的供电要求。

点击“关机设置”，可以调整以下内容：

- “低电压阈值”：低于该电压后开始关机倒计时。
- “恢复电压阈值”：高于该电压后开始恢复流程。
- “关机倒计时”：检测到低电压后等待多久执行关机。
- “恢复稳定等待”：电压恢复后等待多久确认供电稳定。
- “风扇关闭延迟”：关机后等待多久关闭风扇。

保存后，页面会应用新的保护设置。

##### 切换顶部 USB 连接目标

切换 USB 目标可能使当前连接的外设暂时断开。确认目标设备和正在进行的工作后再操作。

页面显示 USB 切换功能时，点击“USB”按钮，可以在 ESP、AGX 和 LPMU 之间切换顶部 USB 接口的连接目标。按钮会显示当前目标，切换成功后页面会给出提示。

### 3. 设备面板

“设备面板”位于“系统”页面，包含模组电源控制、快捷操作和数据组件。

#### 控制 AGX 和 LPMU

AGX 和 LPMU 按钮会显示当前状态。绿色表示设备正在运行，红色表示设备已关闭，检测期间会显示等待状态。

强制断电可能造成未保存的数据丢失。关闭模组前，应先保存模组中的工作并完成正常关机流程。

- 点击 AGX 状态按钮，可以为 AGX 上电或断电。操作期间等待页面显示最终结果。
- 点击 LPMU 状态按钮，会触发一次与物理电源按钮相同的操作。页面会继续检测 LPMU 状态；检测超时时应以页面提示为准，不要连续点击。

#### 使用快捷操作

“快捷操作”显示已经配置为“仅手动触发”的自动化规则。

1. 点击卡片运行对应操作。
2. 卡片显示处理中时，等待本次操作完成。
3. 支持后台运行的卡片会显示运行状态，并提供“日志”和“停止”。
4. 点击“日志”查看当前输出；点击“停止”结束仍在运行的任务。

正在运行的任务需要先停止，随后才能再次启动。触发一个操作后，等待几秒再启动其他操作。

长按卡片，出现排序提示后拖动，可以调整快捷操作的显示顺序。“暂无快捷操作”表示当前没有已配置的手动规则。规则配置方法见第二部分的“自动化管理”。

#### 管理数据组件

数据组件用于在“设备面板”中持续显示设备数据。

1. 点击“组件管理”。
2. 选择刷新间隔，或关闭自动刷新。
3. 添加预设组件，或选择页面提供的组件样式和数据来源。
4. 根据需要编辑名称、显示方式和单位，然后保存。

已有组件可以编辑、删除和调整顺序。也可以直接点击组件卡片进入编辑界面。长按组件后拖动，可以改变它在面板中的位置。

### 4. 风扇管理

“风扇控制”位于“系统”页面。页面只显示当前设备实际提供的风扇。

#### 查看风扇状态

顶部状态栏显示“有效温度”和“目标转速”。每张风扇卡片显示当前模式、转速百分比和可用的 RPM。RPM 表示风扇每分钟转数。

点击右上角的刷新按钮，可以重新获取当前状态。

#### 选择运行模式

| 模式 | 作用 |
| --- | --- |
| “关闭” | 停止风扇。 |
| “手动” | 使用固定转速，滑块可以设置 0–100%。 |
| “自动” | 以风扇曲线为基础，同时根据温度变化趋势和保护状态调整转速。 |
| “曲线” | 按照已设置的温度与转速对应关系运行。 |

关闭风扇或设置过低的手动转速会降低散热能力。执行前应确认设备负载和温度，并持续观察温度变化。

在“手动”模式下，拖动“转速调节”滑块设置速度。其他模式下，滑块保持不可用。

#### 设置风扇曲线

点击“曲线”打开“风扇曲线管理”。页面会列出当前可选的风扇和温度数据来源。

1. 在“选择风扇”中选择页面当前显示的风扇。
2. 在“绑定温度变量”中添加一个或多个温度来源，并设置权重。
3. 点击绑定按钮，使选定温度来源生效。
4. 在“温度-转速曲线”中添加或编辑曲线点。每条曲线至少需要 2 个点，最多支持 10 个点。
5. 设置“最小占空比”和“最大占空比”。最小值不能高于最大值。
6. 根据需要设置“温度迟滞”和“最小间隔”。温度迟滞范围为 0–20°C，最小间隔范围为 500–30000 ms。
7. 点击“应用曲线”。系统会保存设置，并将所选风扇切换到“曲线”模式。

“温度迟滞”用于减少临界温度附近的频繁调速。“最小间隔”用于限制连续两次调速之间的最短时间。

#### 导入和导出曲线

- 点击“导入配置”，选择有效的曲线 JSON 文件。检查页面加载的曲线和参数后，点击“应用曲线”使其生效。
- 点击“导出配置”，浏览器会下载当前曲线，同时尝试将副本保存到 SD 卡的 `/sdcard/config` 目录。页面会提示 SD 卡保存结果。

#### 使用测试温度

测试温度会临时替代正常温度来源，并影响自动或曲线调速。测试期间应持续观察风扇和设备状态。

1. 在“测试温度”中输入 0–100°C 的数值。
2. 点击“测试”，观察目标转速和风扇响应。
3. 测试结束后立即点击“清除测试”，恢复正常温度来源。

### 5. LED 管理

“LED 控制”位于“系统”页面，只显示当前设备提供的 LED。

#### 常用控制

- 点击设备卡片中的开关，开启或关闭对应 LED。
- 使用“亮度”调节当前设备的亮度。
- 选择颜色或预设色，使支持颜色控制的设备显示所选颜色。
- 点击“动画特效”中的选项启动动画，点击“停止动画”结束当前动画。
- 点击“保存配置”，保存当前设备的 LED 设置。
- 点击“全部关闭”，关闭页面当前显示的所有 LED。

不同 LED 提供的颜色、亮度和动画选项可能不同。以当前设备卡片和设置弹窗中显示的选项为准。

#### LED 矩阵高级功能

设备提供 LED 矩阵时，设置弹窗还可以包含以下功能：

- “显示图像”：从 SD 卡选择图像并显示。
- “生成 QR 码”：输入内容，设置颜色和纠错级别后生成 QR 码。
- “显示文本”：输入文字，并设置字体、对齐方式、滚动速度、前景色和背景。
- “后处理滤镜”：选择页面当前提供的滤镜并应用；点击停止按钮结束滤镜。
- “色彩校正”：调整矩阵显示效果，并根据页面按钮重置、导入或导出校正设置。

LED 矩阵的尺寸、动画和滤镜由当前设备决定。文档中的操作以页面实际显示内容为准。

### 6. 网络管理

点击顶部导航中的“网络”进入“网络设置”。修改网络模式、热点或 NAT 设置可能中断当前 WebUI、终端和自动化连接。保存设置前，应确认可以通过新的网络地址重新连接设备。

#### 查看网络状态

页面顶部显示以太网、WiFi 客户端和 WiFi 热点的连接状态。进入对应面板，可以查看 IP 地址、子网掩码、网关、DNS、MAC 地址、SSID、信号和接入设备数量等信息。

以太网面板用于查看当前链路和地址信息，不提供地址修改入口。

#### 选择 WiFi 模式

| 模式 | 作用 |
| --- | --- |
| “关闭” | 关闭 WiFi。 |
| “站点 (STA)” | 让设备连接现有 WiFi 网络。 |
| “热点 (AP)” | 让设备提供 WiFi 热点。 |
| “STA+AP” | 同时连接现有 WiFi，并保留设备热点。 |

选择模式后等待页面刷新状态。切换模式期间，当前无线连接可能暂时断开。

#### 连接 WiFi

1. 将 WiFi 模式设置为“站点 (STA)”或“STA+AP”。
2. 在“站点连接”中点击“扫描”。
3. 从列表中选择网络。列表会显示 SSID、信号强度、信道和认证方式。
4. 输入密码并确认。开放网络可以将密码留空。
5. 等待状态变为“已连接”，并确认页面显示新的 IP 地址。

点击“断开”可以结束当前 WiFi 客户端连接。

#### 配置 WiFi 热点

1. 将 WiFi 模式设置为“热点 (AP)”或“STA+AP”。
2. 在“热点”区域点击“配置”。
3. 填写 SSID。密码留空会创建开放热点；设置密码时至少输入 8 位字符。
4. 选择信道，并根据需要启用“隐藏 SSID”。
5. 点击“应用”，等待热点状态更新。

点击“设备”可以查看当前连接到热点的设备。

#### 设置主机名

在“网络服务”的“主机名”区域输入新名称，然后点击“设置”。主机名更新后，页面会显示当前名称。

#### 查看 DHCP 客户端

DHCP 会自动为接入设备分配网络地址。点击“客户端”，选择“WiFi AP”或“Ethernet”，查看当前分配记录。点击刷新按钮可以重新加载列表。

#### 高级网络操作

##### 设置 NAT 网关

NAT 用于在设备的网络接口之间转发连接。启用或停用 NAT 后，点击“保存”保留当前设置。操作完成后检查 WiFi 和 Ethernet 状态。

##### 通过 LPMU 接入上层网络

页面显示“接入上层网络”时，点击“通过LPMU接入”。等待状态从“处理中”变为“成功”或“失败”。处理期间不要重复启动。失败时查看页面给出的错误和输出信息。

### 7. 文件管理

点击顶部导航中的“文件”进入“文件管理”。

SD 卡是可插拔存储，SPIFFS 是设备内部文件存储。点击“SD 卡”或“SPIFFS”切换位置。面包屑显示当前路径，点击其中的目录可以返回对应层级。

#### 浏览和管理文件

- 点击文件夹名称进入该目录。
- 点击文件右侧的下载按钮，将文件保存到浏览器的下载位置。
- 点击重命名按钮，输入新名称并确认。
- 点击“新建文件夹”，输入文件夹名称并创建。
- 点击刷新按钮重新加载当前目录和存储状态。

#### 上传文件

1. 进入目标目录。
2. 点击“上传文件”。
3. 点击上传区域选择一个或多个文件，或将文件拖入该区域。
4. 检查上传列表，移除不需要的文件。
5. 点击“上传”，等待每个文件显示完成状态。

上传 `.tscfg` 配置包时，页面会进入配置包校验和应用流程。配置包的来源、签名和应用要求请查看安全指南。

#### 批量操作

勾选文件或文件夹后，页面会显示批量工具栏。

- “批量下载”下载选中的文件。文件夹不会加入下载内容。
- “批量删除”删除选中的文件和文件夹。
- “取消选择”清除当前选择。

#### 删除文件或文件夹

删除操作无法从 WebUI 撤销。删除文件夹时，其中的全部内容也会被删除。确认名称和路径后，再点击“删除”或“批量删除”并确认。

#### 挂载和卸载 SD 卡

卸载 SD 卡会使卡中的文件暂时无法访问。确认没有上传、下载或其他文件操作正在进行后，点击“卸载 SD”。

SD 卡未挂载时，页面会显示“挂载 SD”。点击该按钮，等待存储状态变为“已挂载”，随后重新进入 SD 卡目录。

### 8. OTA 更新

在“系统”页面的“网络与时间”区域点击“OTA 升级”，进入“固件升级”。

更新过程中设备会重启，WebUI、终端和自动化会暂时断开。开始前应保存正在进行的工作，并保持设备供电稳定。升级进度尚未完成时不要关闭设备。

#### 从 OTA 服务器检查更新

1. 查看页面显示的“当前版本”。
2. 在“OTA 服务器”中输入管理员或发行方提供的服务器地址。
3. 点击“保存”，随后点击“检查更新”。
4. 页面会显示“发现新版本”“已是最新版本”“服务器版本较旧”或错误信息。
5. 确认目标版本后，点击“立即升级”或页面显示的升级按钮。
6. 等待下载、安装和重启完成。页面显示中止按钮时，可以按需中止当前支持中止的阶段。
7. 设备重新上线后，重新连接 WebUI，并核对“当前版本”。

升级同时包含 WebUI 时，固件和 WebUI 会依次更新。两者应来自同一发布版本。

#### 手动升级

展开“手动升级”后，可以选择以下方式：

- “从 URL 升级”：填写固件 URL，根据发布说明选择“包含 WebUI”，然后点击“升级”。
- “从 SD 卡升级”：填写固件文件路径，例如 `/sdcard/firmware.bin`。选择“包含 WebUI”时，页面会同时处理同目录中的 WebUI 文件。

“跳过验证”会绕过固件完整性或签名检查，并增加安装损坏或非预期固件的风险。日常升级应保持验证开启。只有在固件来源和操作要求已经确认时才使用该选项。

#### 分区管理与回滚

“分区管理”显示当前运行分区和其他可用分区。

- “标记有效”会确认当前运行版本，并取消该版本的自动回滚保护。确认当前版本运行正常后再执行。
- “回滚到此版本”会选择另一可启动版本，并通过重启切换。回滚会中断当前服务，执行前应确认目标版本和相关数据兼容。

操作完成并重启后，重新打开 WebUI，核对当前版本和设备状态。

### 9. 安全管理入口

点击顶部导航中的“安全”进入安全管理页面。SSH 密钥、远程主机、主机指纹、HTTPS 证书、配置包和账户管理的操作请查看《TianshanOS 安全指南》。本指南不重复这些内容。

## 第二部分：root 专属运维功能

### 10. 终端与系统日志

“终端”只对 root 显示。它可以直接执行设备控制台命令，也可以查看设备日志。命令可能立即改变设备状态，输入前应确认命令来源、参数和影响。

#### 连接并使用终端

1. 点击顶部导航中的“终端”。
2. 等待页面显示“已连接到设备”和 `tianshan>` 提示符。
3. 输入 `help`，查看当前固件实际提供的命令。
4. 输入命令并按 Enter。等待输出结束并重新出现提示符。

页面显示“未连接到设备”时，输入不会执行。连接断开后页面会提示重新连接；恢复连接后再提交命令，避免重复执行。

终端提供以下键盘操作：

| 操作 | 作用 |
| --- | --- |
| `Ctrl+C` | 中断当前执行或清除正在输入的内容。 |
| `Ctrl+L` | 清屏。 |
| `↑` / `↓` | 查看本次页面会话中的命令历史。 |
| `←` / `→` | 在当前输入中移动光标。 |

页面顶部的“清屏”只清除当前显示，不会撤销已经执行的命令。“断开”会结束当前终端连接。

#### 进入远程 SSH Shell

SSH Shell 会把后续键盘输入发送到远程主机。连接前应确认目标地址、用户和认证方式，并完成安全指南中的 SSH 准备工作。

1. 在终端中输入 `help`，查看当前 `ssh` 命令及 Shell 参数说明。
2. 按页面当前命令格式填写目标主机和用户，并启动 Shell。
3. 等待终端显示远程连接成功，再输入远程命令。
4. 按 `Ctrl+\` 退出 SSH Shell，返回 `tianshan>` 提示符。

不要在屏幕共享、录屏或可被他人查看的终端中输入明文凭据。

#### 查看系统日志

点击终端页顶部的“系统日志”打开日志窗口。

- “级别”控制最低显示级别。选择 ERROR、WARN+、INFO+ 或 DEBUG+ 可以缩小日志范围。
- “TAG”按日志来源筛选。
- “搜索”按关键词筛选当前日志。
- “自动滚动”开启时，页面会跟随最新日志。
- 刷新按钮会重新读取历史日志。
- 清除按钮只清除当前窗口中的日志显示。

筛选后没有内容时，可以先清空 TAG 和关键词，再调整级别。关闭日志窗口不会停止设备服务。

### 11. 管理和运行远程指令

“指令”用于保存可重复使用的 SSH 命令，并在选定的远程主机上运行。远程主机及其认证信息在“安全”页面管理；具体操作请查看安全指南。

#### 选择主机并查看指令

1. 点击顶部导航中的“指令”。
2. 在“选择主机”中选择页面当前显示的主机。
3. 在“命令列表”中查看该主机已有的指令。

“孤儿命令”表示指令引用的主机已经不存在。这类指令无法执行。可以删除它，或通过导入时的主机绑定功能重新关联到有效主机。

#### 新建或编辑指令

保存的指令会在远程主机上执行。创建前应先在目标主机上人工确认命令及权限，避免把删除、关机、重启或覆盖文件等操作配置成容易误触的指令。

1. 选择主机后点击“新建指令”。编辑现有指令时，点击该指令的编辑按钮。
2. 填写“指令 ID”。ID 必须唯一，只能使用字母、数字、下划线和连字符，且不能以下划线或连字符开头或结尾。
3. 填写“指令名称”和“SSH 命令”。多行命令每行填写一条。
4. 根据需要填写描述，并选择图标或 SD 卡中的图像。
5. 检查高级选项，然后点击“保存”。

名称用于页面显示，ID 用于保存和引用。修改已经被自动化使用的 ID 前，应先检查相关动作模板和数据源。

#### 执行并查看结果

1. 点击指令卡片上的执行按钮。
2. 在“执行结果”中观察输出和状态。
3. 页面显示“取消”时，可以终止当前仍在执行的会话。
4. 点击“清除”移除当前结果显示。

“清除”不会撤销远程主机已经完成的操作。执行结果中的成功、失败、提取内容和最终状态取决于指令的匹配设置。

#### 配置结果匹配

结果匹配用于把远程输出转换为容易判断的状态。

- “成功匹配模式”：输出包含指定文本时标记成功。
- “失败匹配模式”：输出包含指定文本时标记失败。
- “提取模式”：使用一个 `(.*)` 捕获组保存输出中的目标内容。
- “匹配后自动停止”：匹配成功后终止仍在持续运行的命令。
- “超时”：超过等待时间仍未得到匹配结果时停止等待。该设置仅在配置匹配模式或启用匹配后停止时生效。
- “存储变量名”：保存状态和提取结果，供自动化页面选择。

成功和失败文本应选择稳定、明确的输出。过于宽泛的文字可能造成误判。保存后先执行一次并检查“匹配结果”，再把变量用于规则。

#### 使用后台执行和服务模式

nohup 表示命令在远程主机后台继续运行，SSH 断开后仍可继续。后台任务不会因为关闭 WebUI 自动停止。

启用“后台执行（nohup）”后，可以使用：

- “查看日志”：读取后台任务的当前日志。
- “实时跟踪”：持续刷新日志。
- “停止跟踪”：停止页面刷新，不停止远程任务。
- “检查进程”：查看后台任务是否仍在运行。
- “停止进程”：结束对应后台任务。

“服务模式（监测就绪状态）”用于持续观察后台任务是否进入可用状态。启用后需要填写：

- “就绪匹配模式”：日志出现这些文字时标记为就绪，可用 `|` 分隔多个模式。
- “失败匹配模式”：日志出现这些文字时标记为失败。
- “超时”：等待就绪状态的最长时间。
- “检测间隔”：检查日志的频率。
- “存储变量名”：保存 checking、ready、timeout 等状态。

停止跟踪和停止进程含义不同。结束查看时使用“停止跟踪”；确认远程任务可以终止后再使用“停止进程”。

#### 导入和导出指令

- 点击指令的导出按钮，可以导出该指令，并按页面选项包含依赖的主机配置。
- 点击“导入指令”，选择 `.tscfg` 配置包，预览内容，并按需覆盖已有配置或绑定到页面当前显示的主机。

导入可能覆盖同名配置，并可能包含远程主机信息。签名验证、证书信任和配置包来源的判断请按照安全指南执行。页面提示需要重启时，应先结束终端和自动化任务，再安排重启。

删除指令前，应确认它没有被自动化数据源或动作模板引用。删除操作无法从指令页面撤销。

### 12. 自动化管理

“自动化”把设备数据和操作连接成可重复执行的流程。页面中的主要关系如下：

```text
数据源 → 变量 → 规则条件 → 动作模板 → 执行结果
                      └─ 仅手动触发 → 系统页快捷操作
```

- 数据源读取外部或设备数据。
- 变量保存可以用于判断的值。
- 规则决定何时执行。
- 动作模板定义要执行的任务。
- 仅手动触发的规则会显示在“系统”页面的“快捷操作”中。

#### 查看和控制自动化引擎

页面顶部显示引擎状态、规则数、变量数、数据源数、触发次数和运行时长。

| 操作 | 影响 |
| --- | --- |
| “启动” | 启动处于停止状态的引擎，开始处理已启用规则。 |
| “暂停” | 暂停规则处理，保留当前配置。恢复时先点击“停止”，再点击“启动”。 |
| “停止” | 停止规则处理和数据源读取。已有配置不会因此删除。 |
| “重新加载” | 从已保存配置重新加载引擎内容。未保存的页面输入不会保留。 |

停止或暂停引擎会中断自动处理。操作前应确认当前是否依赖自动化进行散热、告警、远程服务或其他持续任务。操作后刷新状态卡片，确认最终状态。

#### 完成一条最小自动化流程

推荐按以下顺序建立新流程：

1. 创建数据源并使用页面的测试功能确认连接。
2. 启用数据源，确认“变量”区域出现需要的值，并检查更新时间。
3. 创建动作模板，检查参数后点击“测试”。测试会立即执行动作，应先确认设备和远程主机允许本次操作。
4. 创建规则，暂不勾选“创建后立即启用”。
5. 检查条件、冷却时间、动作顺序、延迟和重复设置。
6. 保存规则后再启用，并观察变量、触发次数和实际结果。

#### 管理数据源

点击“数据源”区域的“添加”，选择页面当前支持的类型：

| 类型 | 用途 |
| --- | --- |
| “REST API” | 定期读取一个 HTTP 地址返回的数据。 |
| “WebSocket” | 接收一个持续连接推送的数据。 |
| “Socket.IO” | 接收 Socket.IO 服务发送的事件数据。 |
| “指令变量” | 读取“指令”页面保存的执行结果。 |

REST API 是通过网址请求数据的方式；WebSocket 和 Socket.IO 用于持续接收更新；指令变量来自已配置 SSH 指令的结果。

1. 填写数据源 ID、显示标签和当前类型要求的连接信息。
2. 使用“测试连接”或页面对应的测试按钮。
3. 对 REST API、WebSocket 或 Socket.IO，从测试结果中选择需要保存的数据字段。Socket.IO 的事件名称留空时，测试功能可以尝试发现服务推送的事件。
4. 对“指令变量”，先选择主机和已经设置存储变量名的指令，再设置检测间隔。
5. 保存并启用数据源，然后在“变量”区域检查结果。

数据源列表显示类型、状态和更新间隔。可以启用、停用、查看变量、导出或删除。停用或删除数据源后，依赖其变量的规则可能无法继续判断。删除前应先检查规则引用。

导入和导出数据源使用配置包。导入前预览 ID、类型和目标配置；覆盖同名数据源前确认现有规则的依赖。配置包的信任判断请查看安全指南。

#### 查看变量

“变量”区域显示当前自动化可以使用的数据。使用搜索框可以按名称筛选。

检查变量时应关注：

- 名称和所属数据源是否符合预期。
- 当前值和数据类型是否适合规则比较。
- 更新时间是否持续变化。
- 页面是否提示数据过期或无有效数据。

变量没有更新时，先检查对应数据源是否启用，再使用数据源的测试功能确认连接和字段选择。

#### 创建和测试动作模板

动作模板定义规则触发后执行的任务。点击“动作模板”区域的“添加”，选择当前支持的类型：

| 类型 | 作用 |
| --- | --- |
| “CLI 命令” | 执行 TianshanOS 本地控制台命令。 |
| “SSH 命令” | 执行“指令”页面中已经配置的远程指令。 |
| “LED 控制” | 控制页面当前提供的 LED 设备和显示功能。 |
| “日志记录” | 按指定级别写入一条日志。 |
| “设置变量” | 将指定值写入自动化变量。 |
| “Webhook” | 向指定 HTTP 地址发送请求。 |

CLI 是设备本地命令；SSH 命令在远程主机执行；Webhook 用于通知或调用外部服务。

所有动作模板都需要唯一 ID。可以填写显示名称、描述和执行延迟，并根据需要启用“异步执行”。异步动作提交后在后台继续，后续状态需要通过对应日志、变量或目标设备确认。

不同类型还需要以下信息：

- CLI 命令：命令行，可选结果变量和超时时间。
- SSH 命令：从页面当前提供的主机和指令中选择，并检查预览。
- LED 控制：选择设备和当前设备支持的颜色、动画、亮度、文本、图像、QR 码或滤镜操作。
- 日志记录：选择级别并填写消息，消息可以引用变量。
- 设置变量：填写变量名和值。
- Webhook：填写请求方式、URL 和页面要求的请求内容；JSON 是页面用于填写结构化请求内容的文本格式。

“测试”会立即执行动作。涉及断电、重启、远程命令、LED 显示或外部请求时，应先确认测试影响。测试成功后再把动作加入规则。

删除动作模板前，应确认没有规则引用它。导入可能覆盖同名动作，导出和导入的配置包信任要求请查看安全指南。

#### 创建规则

规则把变量条件和动作模板连接起来。

1. 点击“规则”区域的“添加”。
2. 填写唯一的“规则 ID”、规则名称和图标。
3. 选择“条件逻辑”：
   - “全部满足 (AND)”表示所有条件同时满足才触发。
   - “任一满足 (OR)”表示任意一个条件满足即可触发。
4. 设置“冷却时间”，限制规则连续触发的频率。
5. 添加条件并选择变量、比较方式和值。
6. 添加一个或多个动作模板，设置执行顺序所需的延迟。
7. 检查规则后保存。需要立即运行时再启用。

页面当前提供的比较方式包括：等于、不等于、大于、大于等于、小于、小于等于、值变化和包含。比较值应与变量的数据类型相符。

#### 配置动作重复和执行条件

每个动作可以选择：

- “单次”：规则每次触发时执行一次。
- “条件持续时重复”：动作条件保持满足时按设置间隔重复。
- “指定次数”：按设置次数和间隔重复。

还可以为单个动作添加执行条件。该条件只决定这个动作是否执行，不改变整条规则的触发条件。

重复动作可能持续控制设备、发送网络请求或执行远程命令。启用前应设置合理间隔，并确认停止方式。需要立即终止自动处理时，可以停用规则；后台远程任务还需要在“指令”页面检查并停止对应进程。

#### 创建快捷操作

勾选“仅手动触发”后，规则不需要触发条件，并会作为操作卡片显示在“系统”页面。

1. 填写规则 ID、名称和图标。
2. 勾选“仅手动触发”。
3. 添加需要执行的动作模板。
4. 保存并启用规则。
5. 返回“系统”，在“快捷操作”中检查卡片并进行一次受控测试。

手动规则仍会执行其全部动作、延迟和重复设置。面向 admin 提供快捷操作前，应确保名称清楚、风险可预期，并提供可用的日志或停止方式。

#### 维护规则和配置

规则列表可以启用、停用、手动触发、编辑、导出和删除。

- 手动触发会立即执行规则动作，操作前应检查目标设备和主机状态。
- 停用规则会阻止后续自动触发，不会撤销已经完成的动作。
- 删除规则无法从页面撤销。
- 编辑规则时，先检查变量和动作模板仍然存在。
- 导入规则前预览规则 ID、条件和动作引用；覆盖同名配置前确认影响。

导入或修改数据源、动作和规则后，检查引擎状态以及列表中的启用状态。页面提示需要重新加载或重启时，应先结束仍在运行的远程任务，再安排操作。

# TianshanOS Root Operations Guide

![TianshanOS](图片和附件/tsintro%201.png)

This guide is for operators who manage TianshanOS with the root account. Part I covers routine tasks shared by admin and root. Part II covers the root-only “Terminal,” “Commands,” and “Automation” pages. Use the TianshanOS Security Guide for security management.

Root can perform high-impact operations that change the device, remote hosts, and automation workflows. Confirm the current device, target host, and running tasks before continuing.

Available pages and controls depend on the device model, hardware configuration, and current state. No action is required for a device, button, or option that is not shown.

## Part I: Routine Tasks Shared by Admin and Root

### 1. Getting Started

#### Open the WebUI

1. Open the device WebUI address in a browser.
2. Select “Login” in the upper-right corner.
3. Enter `root` and the root password supplied with the device.
4. Select “Login.” After a successful login, the current username appears in the upper-right corner.

When the default password is still in use, a “Security Reminder” appears after login. Enter the current password and the new password, then select “Change Now.” Enter the new password twice with matching values. Select “Change Later” to close the reminder.

After completing your work, select “Logout” in the upper-right corner. The WebUI returns to “System.”

#### Switch Languages

Select the language button at the top of the page, then choose Chinese or English. Page content and control labels switch immediately.

#### Page Navigation

Root can use these pages:

- “System”: View device status, control modules, fans, and LEDs, and open OTA Update.
- “Network”: View and change Ethernet, WiFi, DHCP, and NAT settings.
- “Files”: Manage files on the SD Card and SPIFFS.
- “Terminal”: Use the device console and view system logs.
- “Automation”: Manage data sources, variables, action templates, and rules.
- “Commands”: Manage and run remote SSH commands.
- “Security”: Open the separate security management page. See the Security Guide for instructions.

### 2. System Status and Routine Operations

Select “System” in the top navigation.

#### View Resource and Service Status

“Resource Monitor” shows CPU, DRAM, and PSRAM usage. DRAM is the main working memory, and PSRAM is extended memory.

- Select “Details” to view total, used, and free memory, plus fragmentation.
- The number next to “Services” shows running services and total services.
- Select “Services” to view each service's status, stage, and health.

If a service shows “Failed” or an unhealthy state, refresh the page first to confirm the current condition.

#### View System and Power Information

“System Overview” shows the chip, firmware version, uptime, and build time. “Power Status” shows input voltage, internal voltage, current, power, and protection status.

The switch beside the protection status enables or disables low-voltage protection. When enabled, the configured shutdown and recovery process runs if input voltage becomes too low.

#### View Network and Time

“Network & Time” shows Ethernet, WiFi, IP address, current time, sync status, time source, and timezone.

- Select “Sync Time” to copy the browser's current time to the device.
- Select “Timezone,” choose a preset or enter a supported timezone setting, then save.
- Select “OTA Update” to open the firmware update page.

#### Advanced Operations

##### Reboot TianshanOS

A reboot temporarily interrupts the WebUI, Terminal, Automation, and device management. Complete current work before selecting “Reboot” and confirming. The page reports that the system is rebooting. Reopen the WebUI after the device recovers.

##### Restart One Service

Restarting a service temporarily interrupts the function it provides. Open “Service Status,” find the affected service, and select “Reboot” on that row. Check its status and health again when the operation finishes.

##### Change Shutdown Settings

Voltage thresholds and delay values affect device shutdown and recovery. Confirm the device's power requirements before changing them.

Select “Shutdown Settings” to change:

- “Low Voltage Threshold”: Starts the shutdown countdown below this voltage.
- “Recovery Threshold”: Starts recovery above this voltage.
- “Shutdown Countdown”: Sets the delay before shutdown after low voltage is detected.
- “Recovery Stabilization”: Sets the wait time used to confirm stable power recovery.
- “Fan Stop Delay”: Sets the delay before fans stop after shutdown.

Save the form to apply the updated protection settings.

##### Switch the Top USB Target

Switching the USB target may temporarily disconnect an attached device. Confirm the target and finish active work before continuing.

When USB switching is available, select the “USB” button to change the top USB connection among ESP, AGX, and LPMU. The button shows the current target, and the page confirms a successful switch.

### 3. Device Panel

The “Device Panel” is on the “System” page. It contains module power controls, Quick Actions, and data widgets.

#### Control AGX and LPMU

The AGX and LPMU buttons show the current state. Green indicates a running device, red indicates a powered-off device, and a waiting state appears during detection.

Forced power-off can cause loss of unsaved data. Save work on the module and complete its normal shutdown process before removing power.

- Select the AGX state button to power AGX on or off. Wait for the final result shown on the page.
- Select the LPMU state button to trigger the same action as its physical power button. The page continues checking the LPMU state. Follow the displayed message if detection times out, and avoid repeated clicks.

#### Use Quick Actions

“Quick Actions” shows automation rules configured as “Manual Trigger Only.”

1. Select a card to run its action.
2. Wait while the card shows that processing is in progress.
3. Cards that support background tasks show a running state and provide “Log” and “Stop.”
4. Select “Log” to view current output. Select “Stop” to end a running task.

A running task must be stopped before it can be started again. After triggering one action, wait a few seconds before starting another.

Press and hold a card until the reorder indicator appears, then drag it to change the display order. “No Quick Actions” means that no manual rules are currently configured. See “Automation Management” in Part II to configure rules.

#### Manage Data Widgets

Data widgets continuously display device data in the “Device Panel.”

1. Select “Widget Manager.”
2. Choose a refresh interval or disable automatic refresh.
3. Add a preset widget, or choose a component style and data source offered by the page.
4. Edit its label, display style, and unit as needed, then save.

Existing widgets can be edited, deleted, and reordered. You can also select a widget card to edit it. Press and hold a widget, then drag it to a new position.

### 4. Fan Management

“Fan Control” is on the “System” page. The page shows only fans currently provided by the device.

#### View Fan Status

The status bar shows “Effective Temp” and “Target Speed.” Each fan card shows the current mode, speed percentage, and RPM when available. RPM is the number of fan revolutions per minute.

Select the refresh button in the upper-right corner to reload the current state.

#### Select an Operating Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Stops the fan. |
| “Manual” | Uses a fixed speed set with the 0–100% slider. |
| “Auto” | Starts from the fan curve and also responds to temperature trends and protection states. |
| “Curve” | Follows the configured temperature-to-speed points. |

Turning a fan off or using a low manual speed reduces cooling. Confirm the device load and temperature before changing the mode, and continue monitoring temperature afterward.

In “Manual” mode, use the “Speed Adjust” slider to set the speed. The slider is unavailable in other modes.

#### Configure a Fan Curve

Select “Curve” to open “Fan Curve Management.” The page lists the fans and temperature data sources currently available.

1. Under “Select Fan,” choose a fan shown by the page.
2. Under “Bind Temperature Variable,” add one or more temperature sources and assign weights.
3. Select the bind control to apply the selected temperature sources.
4. Add or edit points under “Temperature-Speed Curve.” A curve requires at least 2 points and supports up to 10 points.
5. Set “Min Duty Cycle” and “Max Duty Cycle.” The minimum cannot be greater than the maximum.
6. Set “Temperature Hysteresis” and “Min Interval” as needed. Hysteresis accepts 0–20°C, and the minimum interval accepts 500–30000 ms.
7. Select “Apply Curve.” The settings are saved and the selected fan switches to “Curve” mode.

“Temperature Hysteresis” reduces repeated speed changes near a temperature boundary. “Min Interval” sets the shortest time between speed adjustments.

#### Import and Export a Curve

- Select “Import Config” and choose a valid curve JSON file. Review the loaded curve and parameters, then select “Apply Curve.”
- Select “Export Config” to download the current curve in the browser. The page also attempts to save a copy under `/sdcard/config` and reports the SD Card result.

#### Use a Test Temperature

A test temperature temporarily replaces the normal temperature source and affects Auto or Curve control. Monitor the fan and device state throughout the test.

1. Enter a value from 0–100°C under “Test Temp.”
2. Select “Test” and observe the target speed and fan response.
3. Select “Clear Test” immediately after the test to restore the normal temperature source.

### 5. LED Management

“LED Control” is on the “System” page and shows only LEDs currently provided by the device.

#### Routine Controls

- Use the switch on a device card to turn that LED on or off.
- Use “Brightness” to change the brightness of the current device.
- Select a color or preset color for devices that support color control.
- Choose an item under “Effects” to start it, and select “Stop Effect” to end the current effect.
- Select “Save Config” to save the current LED settings.
- Select “All Off” to turn off all LEDs currently shown on the page.

Available colors, brightness controls, and effects vary by LED. Use the options shown on the current device card and settings dialog.

#### Advanced LED Matrix Features

When the device provides an LED Matrix, its settings dialog can also include:

- “Display Image”: Select and display an image from the SD Card.
- “Generate QR”: Enter content and choose colors and an error-correction level.
- “Display Text”: Enter text and set the font, alignment, scroll speed, foreground color, and background.
- “Post-processing Filter”: Apply a filter currently offered by the page, or use the stop control to end it.
- “Color Correction”: Adjust the matrix output and use the available controls to reset, import, or export correction settings.

Matrix dimensions, effects, and filters are determined by the current device. Follow the controls displayed in the WebUI.

### 6. Network Management

Select “Network” in the top navigation to open “Network Settings.” Changing the network mode, hotspot, or NAT settings may interrupt the WebUI, Terminal, and Automation connections. Before saving, make sure you can reconnect through the new network address.

#### View Network Status

The top of the page shows the state of Ethernet, the WiFi client, and the WiFi AP. Open the related panel to view IP address, subnet mask, gateway, DNS, MAC address, SSID, signal, and connected-device counts when available.

The Ethernet panel displays the current link and address information. It does not provide address editing controls.

#### Select a WiFi Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Turns WiFi off. |
| “Station (STA)” | Connects the device to an existing WiFi network. |
| “Access Point (AP)” | Makes the device provide a WiFi hotspot. |
| “STA+AP” | Connects to an existing WiFi network while keeping the device hotspot available. |

After choosing a mode, wait for the page to refresh the state. The current wireless connection may be interrupted during the switch.

#### Connect to WiFi

1. Set the WiFi mode to “Station (STA)” or “STA+AP.”
2. Under “Station,” select “Scan.”
3. Choose a network from the list. The list shows SSID, signal strength, channel, and authentication type.
4. Enter the password and confirm. Leave the password blank for an open network.
5. Wait for the state to change to “Connected,” then confirm the new IP address.

Select “Disconnect” to end the current WiFi client connection.

#### Configure the WiFi AP

1. Set the WiFi mode to “Access Point (AP)” or “STA+AP.”
2. Under “Hotspot,” select “Config.”
3. Enter the SSID. A blank password creates an open hotspot; a protected hotspot requires at least 8 characters.
4. Select a channel and enable “Hidden SSID” if needed.
5. Select “Apply” and wait for the hotspot state to update.

Select “Devices” to view clients currently connected to the hotspot.

#### Set the Hostname

Enter a new name in the “Hostname” section under “Network Services,” then select “Set.” The page shows the current hostname after it updates.

#### View DHCP Clients

DHCP automatically assigns network addresses to connected devices. Select “Clients,” choose “WiFi AP” or “Ethernet,” and view the current leases. Use the refresh button to reload the list.

#### Advanced Network Operations

##### Configure the NAT Gateway

NAT forwards connections between the device's network interfaces. Enable or disable NAT, then select “Save” to retain the setting. Check the WiFi and Ethernet status afterward.

##### Access the Upstream Network via LPMU

When “Upstream Network Access” is shown, select “Access via LPMU.” Wait for the state to change from “Processing” to “Success” or “Failed.” Do not start it again while processing. If it fails, read the error and output shown by the page.

### 7. File Management

Select “Files” in the top navigation to open “File Manager.”

The SD Card is removable storage, and SPIFFS is internal device file storage. Select “SD Card” or “SPIFFS” to switch locations. The breadcrumb shows the current path; select a directory in it to return to that level.

#### Browse and Manage Files

- Select a folder name to open it.
- Select the download button beside a file to save it to the browser's download location.
- Select the rename button, enter a new name, and confirm.
- Select “New Folder,” enter a folder name, and create it.
- Select the refresh button to reload the current directory and storage state.

#### Upload Files

1. Open the target directory.
2. Select “Upload Files.”
3. Select one or more files, or drag files into the upload area.
4. Review the upload list and remove unwanted files.
5. Select “Upload” and wait for each file to show completion.

Uploading a `.tscfg` configuration package starts its verification and application flow. See the Security Guide for package sources, signatures, and application requirements.

#### Batch Operations

After selecting files or folders, the batch toolbar appears.

- “Batch Download” downloads selected files. Folders are not included.
- “Batch Delete” deletes selected files and folders.
- “Clear Selection” clears the current selection.

#### Delete a File or Folder

Deletion cannot be undone in the WebUI. Deleting a folder also deletes all of its contents. Confirm the name and path before selecting “Delete” or “Batch Delete” and approving the prompt.

#### Mount and Unmount the SD Card

Unmounting the SD Card makes its files temporarily unavailable. Make sure no upload, download, or other file operation is in progress, then select “Unmount SD.”

When the SD Card is not mounted, the page shows “Mount SD.” Select it, wait for the state to change to “Mounted,” then open the SD Card directory again.

### 8. OTA Updates

On the “System” page, select “OTA Update” in the “Network & Time” section to open “Firmware Upgrade.”

The device reboots during an update, temporarily disconnecting the WebUI, Terminal, and Automation. Save active work and keep device power stable before starting. Do not power off the device while update progress is incomplete.

#### Check for Updates from an OTA Server

1. Review the “Current Version.”
2. Enter the OTA server address supplied by an administrator or publisher.
3. Select “Save,” then select “Check Update.”
4. The page reports “Update Available,” “Already up to date,” an older server version, or an error.
5. Confirm the target version, then select “Upgrade Now” or the upgrade control shown by the page.
6. Wait for download, installation, and reboot to finish. When “Abort” is available, it can stop the stages that support cancellation.
7. Reconnect to the WebUI after the device comes back online and verify “Current Version.”

When “Include WebUI” is enabled, the firmware and WebUI are updated in sequence. Both should come from the same release.

#### Manual Upgrade

Expand “Manual Upgrade” and choose one of these methods:

- “Upgrade from URL”: Enter the firmware URL, set “Include WebUI” according to the release instructions, then select “Upgrade.”
- “Upgrade from SD Card”: Enter a firmware path such as `/sdcard/firmware.bin`. When “Include WebUI” is enabled, the page also processes the WebUI file in the same directory.

“Skip Verify” bypasses firmware integrity or signature checks and increases the risk of installing damaged or unintended firmware. Keep verification enabled for routine updates. Use this option only after the firmware source and operating instructions have been confirmed.

#### Partition Management and Rollback

“Partition Management” shows the running partition and other available partitions.

- “Mark Valid” confirms the running version and disables automatic rollback protection for that version. Use it after confirming that the current version operates correctly.
- “Rollback to This Version” selects another bootable version and switches through a reboot. Rollback interrupts current services. Confirm the target version and data compatibility first.

After the operation and reboot complete, reopen the WebUI and verify the current version and device state.

### 9. Security Management Entry

Select “Security” in the top navigation to open security management. Use the TianshanOS Security Guide for SSH keys, remote hosts, known-host fingerprints, HTTPS certificates, configuration packages, and account management. These procedures are not repeated here.

## Part II: Root-only Operations

### 10. Terminal and System Logs

“Terminal” is shown only to root. It can run device console commands directly and display device logs. A command may change device state immediately. Confirm its source, parameters, and impact before entering it.

#### Connect to and Use Terminal

1. Select “Terminal” in the top navigation.
2. Wait for “Connected to device” and the `tianshan>` prompt.
3. Enter `help` to view the commands provided by the current firmware.
4. Enter a command and press Enter. Wait for its output to finish and the prompt to return.

Input is not executed while the page shows “Not connected to device.” After a disconnect, wait for the reconnection message before submitting a command again to avoid duplicate execution.

Terminal supports these keyboard controls:

| Control | Purpose |
| --- | --- |
| `Ctrl+C` | Interrupt the current operation or clear the current input. |
| `Ctrl+L` | Clear the screen. |
| `↑` / `↓` | Browse command history from the current page session. |
| `←` / `→` | Move the cursor within the current input. |

“Clear” at the top of the page only clears the display. It does not undo commands that have already run. “Disconnect” ends the current Terminal connection.

#### Open a Remote SSH Shell

An SSH Shell sends subsequent keyboard input to a remote host. Confirm the target address, user, and authentication method, and complete the SSH preparation described in the Security Guide before connecting.

1. Enter `help` in Terminal and review the current `ssh` command and Shell parameters.
2. Follow the displayed command format to provide the target host and user and start the Shell.
3. Wait for the remote connection confirmation before entering remote commands.
4. Press `Ctrl+\` to leave the SSH Shell and return to the `tianshan>` prompt.

Do not enter plaintext credentials while the terminal is being shared, recorded, or viewed by another person.

#### View System Logs

Select “System Logs” at the top of Terminal to open the log window.

- “Level” sets the minimum displayed level. Use ERROR, WARN+, INFO+, or DEBUG+ to narrow the output.
- “TAG” filters by log source.
- “Search” filters the current logs by keyword.
- “Auto Scroll” follows new log entries when enabled.
- The refresh button reloads historical logs.
- The clear button clears only the logs currently shown in the window.

If filtering produces no output, clear TAG and Search first, then change Level. Closing the log window does not stop device services.

### 11. Manage and Run Remote Commands

“Commands” stores reusable SSH commands and runs them on a selected remote host. Remote hosts and their authentication information are managed on the “Security” page. See the Security Guide for those procedures.

#### Select a Host and View Commands

1. Select “Commands” in the top navigation.
2. Choose a host currently shown under “Select Host.”
3. Review its saved items under “Command List.”

“Orphan Commands” reference hosts that no longer exist and cannot be executed. Delete an orphan command, or use the host binding option during import to associate it with a valid host.

#### Create or Edit a Command

A saved command runs on a remote host. Verify the command and required permissions on that host before saving it. Take extra care with commands that delete data, shut down or restart a host, or overwrite files.

1. Select a host, then select “New Command.” Use the edit button on an existing command to change it.
2. Enter a unique “Command ID.” It may contain letters, numbers, underscores, and hyphens, and cannot begin or end with an underscore or hyphen.
3. Enter “Command Name” and “Command.” Put each command on a separate line when using multiple lines.
4. Add a description and choose an icon or an image from the SD Card if needed.
5. Review the advanced options, then select “Save.”

The name is shown on the page, while the ID is used for storage and references. Before changing an ID already in use, check related action templates and data sources in Automation.

#### Execute a Command and Review the Result

1. Select the execute control on a command card.
2. Watch the output and status under “Execution Result.”
3. When “Cancel” is shown, use it to end the current execution session.
4. Select “Clear” to remove the current result display.

“Clear” does not undo work already completed on the remote host. Success, failure, extracted content, and final status depend on the command's matching settings.

#### Configure Result Matching

Result matching converts remote output into a status that is easier to use.

- “Success Pattern”: Marks the result successful when the output contains the configured text.
- “Fail Pattern”: Marks the result failed when the output contains the configured text.
- “Extract Pattern”: Uses one `(.*)` capture group to save selected output.
- “Stop on Match”: Ends a continuing command after a successful match.
- “Timeout”: Stops waiting when no match arrives within the configured time. It applies only when a match pattern or Stop on Match is configured.
- “Variable Name”: Saves status and extracted output for use on the Automation page.

Choose stable, specific success and failure text. Broad text can produce incorrect matches. Execute the command once and review “Match Results” before using its variables in a rule.

#### Use Background Execution and Service Mode

nohup means a command continues to run in the remote host's background after the SSH connection closes. Closing the WebUI does not stop a background task.

After enabling “Background (nohup),” you can use:

- “View Log”: Read the current background-task log.
- “Tail Log”: Continuously refresh the log.
- “Stop Tail”: Stop refreshing the page without stopping the remote task.
- “Check Process”: Check whether the background task is still running.
- “Stop Process”: End the corresponding background task.

“Service Mode (monitor ready state)” watches a background task until it becomes available. It requires:

- “Ready Pattern”: Marks the service ready when the configured text appears. Use `|` to separate multiple patterns.
- “Fail Pattern”: Marks the service failed when the configured text appears.
- “Timeout”: Sets the longest wait for the ready state.
- “Check Interval”: Sets how often the log is checked.
- “Variable Name”: Stores states such as checking, ready, and timeout.

Stop Tail and Stop Process have different effects. Use “Stop Tail” when you only want to stop viewing updates. Use “Stop Process” only after confirming that the remote task can be ended.

#### Import and Export Commands

- Use the export button on a command to export it and, when selected, include its dependent host configuration.
- Select “Import Command,” choose a `.tscfg` configuration package, preview its contents, and choose whether to overwrite an existing configuration or bind it to a host currently shown on the page.

Import can overwrite an item with the same ID and can include remote-host information. Follow the Security Guide when evaluating signatures, certificate trust, and package sources. If the page says a restart is required, finish Terminal and Automation tasks before scheduling it.

Before deleting a command, confirm that no Automation data source or action template references it. Deletion cannot be undone on the Commands page.

### 12. Automation Management

“Automation” connects device data with repeatable operations. The main relationship is:

```text
Data source → Variable → Rule condition → Action template → Result
                                └─ Manual Trigger Only → System Quick Action
```

- A data source reads external or device data.
- A variable stores a value that can be evaluated.
- A rule decides when work runs.
- An action template defines the work to perform.
- A Manual Trigger Only rule appears under “Quick Actions” on the “System” page.

#### View and Control the Automation Engine

The status cards show engine state, rule count, variable count, data source count, trigger count, and runtime.

| Control | Effect |
| --- | --- |
| “Start” | Starts a stopped engine and begins processing enabled rules. |
| “Pause” | Pauses rule processing while retaining the configuration. To resume, select “Stop,” then “Start.” |
| “Stop” | Stops rule processing and data-source updates. Saved configuration is retained. |
| “Reload” | Reloads engine content from saved configuration. Unsaved form input is not retained. |

Stopping or pausing the engine interrupts automatic processing. First confirm whether cooling, alerts, remote services, or other ongoing work depends on Automation. Refresh the status cards afterward to confirm the final state.

#### Build a Minimal Automation Workflow

Use this order for a new workflow:

1. Create a data source and use its test control to confirm the connection.
2. Enable the data source, confirm that the needed value appears under “Variables,” and check its update time.
3. Create an action template, review its parameters, and select “Test.” Testing runs the action immediately, so first confirm that the device and remote host can accept it.
4. Create a rule with “Enable after creation” cleared.
5. Review its conditions, cooldown, action order, delays, and repeat settings.
6. Save and enable the rule, then observe variables, trigger count, and the actual result.

#### Manage Data Sources

Select “Add” under “Data Sources,” then choose a type currently supported by the page:

| Type | Purpose |
| --- | --- |
| “REST API” | Periodically reads data returned by an HTTP address. |
| “WebSocket” | Receives data pushed over a persistent connection. |
| “Socket.IO” | Receives events sent by a Socket.IO service. |
| “Command Variable” | Reads saved results from the Commands page. |

REST API reads data through a URL. WebSocket and Socket.IO receive continuing updates. A Command Variable comes from the result of a configured SSH command.

1. Enter the data source ID, display label, and the connection information required by its type.
2. Use “Test Connection” or the test control shown for that type.
3. For REST API, WebSocket, or Socket.IO, select the data fields to store from the test result. Leaving the Socket.IO event name blank lets the test attempt to discover an event sent by the service.
4. For “Command Variable,” select a host and a command that has a Variable Name, then set the polling interval.
5. Save and enable the source, then check the result under “Variables.”

The source list shows type, status, and update interval. You can enable or disable a source, view its variables, export it, or delete it. Disabling or deleting a source can prevent dependent rules from evaluating. Check rule references before deletion.

Data source import and export use configuration packages. Preview the ID, type, and target configuration before import. Check existing rule dependencies before overwriting a source with the same ID. Follow the Security Guide for package trust.

#### View Variables

“Variables” shows the data currently available to Automation. Use the search field to filter by name.

Check:

- Whether the name and source are expected.
- Whether the current value and data type are suitable for comparison.
- Whether the update time continues to change.
- Whether the page reports stale or invalid data.

When a variable stops updating, first check whether its source is enabled. Then use the source test to verify the connection and selected field.

#### Create and Test Action Templates

An action template defines work performed after a rule triggers. Select “Add” under “Action Templates,” then choose a supported type:

| Type | Purpose |
| --- | --- |
| “CLI Command” | Runs a local TianshanOS console command. |
| “SSH Command” | Runs a remote command already configured on the Commands page. |
| “LED Control” | Controls LED devices and display features currently provided by the page. |
| “Log” | Writes a log message at a selected level. |
| “Set Variable” | Writes a value to an Automation variable. |
| “Webhook” | Sends a request to an HTTP address. |

CLI is a local device command. An SSH Command runs on a remote host. A Webhook notifies or calls an external service.

Every action template needs a unique ID. You can add a display name, description, and execution delay, and enable “Async execution” when needed. An asynchronous action continues in the background after submission. Confirm later status through the related log, variable, or target device.

Each type also requires:

- CLI Command: A command line, with an optional result variable and timeout.
- SSH Command: A host and command currently provided by the page. Review the preview before saving.
- LED Control: A device and the colors, effects, brightness, text, image, QR code, or filter operations currently supported by that device.
- Log: A level and message. The message can reference variables.
- Set Variable: A variable name and value.
- Webhook: A method, URL, and the request content required by the page. JSON is the text format used for structured request content.

“Test” executes the action immediately. Confirm the effect before testing power controls, reboots, remote commands, LED output, or external requests. Add an action to a rule only after the test result is understood.

Before deleting an action template, confirm that no rule references it. Import can overwrite an action with the same ID. Follow the Security Guide for trust requirements when importing or exporting configuration packages.

#### Create a Rule

A rule connects variable conditions to action templates.

1. Select “Add” under “Rules.”
2. Enter a unique “Rule ID,” a rule name, and an icon.
3. Choose “Logic”:
   - “All match (AND)” triggers only when every condition matches.
   - “Any match (OR)” triggers when any condition matches.
4. Set “Cooldown (ms)” to limit how frequently the rule can trigger.
5. Add conditions and select a variable, comparison, and value.
6. Add one or more action templates and set any delay needed for their order.
7. Review and save the rule. Enable it only when it is ready to run.

The current comparisons are “Equal,” “Not Equal,” “Greater Than,” “Greater or Equal,” “Less Than,” “Less or Equal,” “Value Changed,” and “Contains.” Use a comparison value that matches the variable's data type.

#### Configure Repetition and Action Conditions

Each action supports:

- “Once”: Runs once each time the rule triggers.
- “Repeat while true”: Repeats at the configured interval while the action condition remains true.
- “Fixed count”: Repeats for the configured count and interval.

You can also add an execution condition to an individual action. It controls only that action and does not change the rule's trigger conditions.

A repeated action can continue controlling a device, sending network requests, or running remote commands. Set an appropriate interval and confirm the stop method before enabling the rule. Disable the rule to end further automatic triggers. A remote background task must also be checked and stopped from the Commands page.

#### Create a Quick Action

When “Manual Trigger Only” is enabled, the rule needs no trigger conditions and appears as a card on the “System” page.

1. Enter the rule ID, name, and icon.
2. Enable “Manual Trigger Only.”
3. Add the action templates to run.
4. Save and enable the rule.
5. Return to “System,” find the card under “Quick Actions,” and run one controlled test.

A manual rule still uses all configured actions, delays, and repeat settings. Before exposing a Quick Action to admin users, give it a clear name, make its impact predictable, and provide a usable log or stop method.

#### Maintain Rules and Configuration

The Rules list can enable, disable, manually trigger, edit, export, and delete a rule.

- Manual Trigger runs the rule's actions immediately. Check the target device and host first.
- Disabling a rule prevents future automatic triggers. It does not undo completed actions.
- Deleting a rule cannot be undone on the page.
- Before editing a rule, confirm that its variables and action templates still exist.
- Before importing a rule, preview its ID, conditions, and action references. Confirm the impact before overwriting an item with the same ID.

After importing or changing data sources, actions, or rules, verify the engine state and the enabled state shown in each list. When the page says Reload or a restart is required, finish running remote tasks before scheduling it.
