# TianshanOS admin 日常使用指南

![TianshanOS](图片和附件/tsintro.png)

本指南面向使用 admin 账户管理 TianshanOS 的用户，介绍 WebUI 中的日常查看和操作功能。安全管理请切换到《TianshanOS 安全指南》。终端、自动化规则和指令管理由 root 运维指南说明。

设备型号、硬件配置和当前状态会影响页面显示。页面未显示的设备、按钮或选项无需操作。

## 1. 开始使用

### 进入 WebUI

1. 在浏览器中打开设备的 WebUI 地址。
2. 点击页面右上角的“登录”。
3. 用户名保持为 `admin`，输入设备提供的 admin 密码。
4. 点击“登录”。登录成功后，右上角会显示当前用户名。

首次使用默认密码登录时，页面会显示“安全提醒”。可以在弹窗中输入当前密码和新密码，随后点击“立即修改”。新密码需要输入两次并保持一致。选择“稍后修改”会关闭提醒。

完成操作后，点击右上角的“退出登录”。页面会返回“系统”。

### 切换语言

点击页面顶部的语言按钮，在菜单中选择中文或 English。页面内容和按钮名称会立即切换到所选语言。

### 页面导航

admin 日常使用的主要入口如下：

- “系统”：查看设备状态，控制模组、风扇和 LED，并进入 OTA 升级。
- “网络”：查看和调整以太网、WiFi、DHCP 与 NAT 设置。
- “文件”：管理 SD 卡和 SPIFFS 中的文件。
- “安全”：进入单独的安全管理页面，详细操作请查看安全指南。

## 2. 系统状态与常用操作

点击顶部导航中的“系统”进入系统页面。

### 查看资源与服务状态

“资源监控”显示 CPU、DRAM 和 PSRAM 的使用情况。DRAM 是设备的主要运行内存，PSRAM 是扩展内存。

- 点击“详情”查看内存总量、已用空间、空闲空间和碎片率。
- “服务”按钮旁显示正在运行的服务数量和服务总数。
- 点击“服务”查看各项服务的状态、阶段和健康情况。

服务状态为“失败”或健康状态异常时，可以先刷新页面确认状态。

### 查看系统与电源信息

“系统总览”显示芯片、固件版本、运行时间和编译时间。“电源状态”显示输入电压、内部电压、电流、功率和保护状态。

保护状态旁的开关用于启用或停用低电压保护。启用后，系统会在输入电压过低时执行已设置的关机和恢复流程。

### 查看网络与时间

“网络与时间”显示以太网、WiFi、IP 地址、当前时间、同步状态、时间源和时区。

- 点击“同步时间”，将浏览器当前时间同步到设备。
- 点击“时区”，选择预设时区或填写页面支持的时区设置，然后保存。
- 点击“OTA 升级”，进入固件升级页面。

### 高级操作

#### 重启 TianshanOS

重启会暂时中断 WebUI 和设备管理功能。确认当前操作已经完成后，点击“重启”并确认。页面会提示系统正在重启，设备恢复后可以重新打开 WebUI。

#### 重启单项服务

重启服务会暂时中断该服务提供的功能。在“服务状态”中找到异常服务，点击该行的“重启”。操作完成后重新查看状态和健康信息。

#### 调整关机设置

更改电压阈值或等待时间会影响设备的关机与恢复行为。修改前应确认设备的供电要求。

点击“关机设置”，可以调整以下内容：

- “低电压阈值”：低于该电压后开始关机倒计时。
- “恢复电压阈值”：高于该电压后开始恢复流程。
- “关机倒计时”：检测到低电压后等待多久执行关机。
- “恢复稳定等待”：电压恢复后等待多久确认供电稳定。
- “风扇关闭延迟”：关机后等待多久关闭风扇。

保存后，页面会应用新的保护设置。

#### 切换顶部 USB 连接目标

切换 USB 目标可能使当前连接的外设暂时断开。确认目标设备和正在进行的工作后再操作。

页面显示 USB 切换功能时，点击“USB”按钮，可以在 ESP、AGX 和 LPMU 之间切换顶部 USB 接口的连接目标。按钮会显示当前目标，切换成功后页面会给出提示。

## 3. 设备面板

“设备面板”位于“系统”页面，包含模组电源控制、快捷操作和数据组件。

### 控制 AGX 和 LPMU

AGX 和 LPMU 按钮会显示当前状态。绿色表示设备正在运行，红色表示设备已关闭，检测期间会显示等待状态。

强制断电可能造成未保存的数据丢失。关闭模组前，应先保存模组中的工作并完成正常关机流程。

- 点击 AGX 状态按钮，可以为 AGX 上电或断电。操作期间等待页面显示最终结果。
- 点击 LPMU 状态按钮，会触发一次与物理电源按钮相同的操作。页面会继续检测 LPMU 状态；检测超时时应以页面提示为准，不要连续点击。

### 使用快捷操作

“快捷操作”显示已经为 admin 开放的操作卡片。

1. 点击卡片运行对应操作。
2. 卡片显示处理中时，等待本次操作完成。
3. 支持后台运行的卡片会显示运行状态，并提供“日志”和“停止”。
4. 点击“日志”查看当前输出；点击“停止”结束仍在运行的任务。

正在运行的任务需要先停止，随后才能再次启动。触发一个操作后，等待几秒再启动其他操作。

长按卡片，出现排序提示后拖动，可以调整快捷操作的显示顺序。“暂无快捷操作”表示当前没有可供 admin 使用的卡片。

### 管理数据组件

数据组件用于在“设备面板”中持续显示设备数据。

1. 点击“组件管理”。
2. 选择刷新间隔，或关闭自动刷新。
3. 添加预设组件，或选择页面提供的组件样式和数据来源。
4. 根据需要编辑名称、显示方式和单位，然后保存。

已有组件可以编辑、删除和调整顺序。也可以直接点击组件卡片进入编辑界面。长按组件后拖动，可以改变它在面板中的位置。

## 4. 风扇管理

“风扇控制”位于“系统”页面。页面只显示当前设备实际提供的风扇。

### 查看风扇状态

顶部状态栏显示“有效温度”和“目标转速”。每张风扇卡片显示当前模式、转速百分比和可用的 RPM。RPM 表示风扇每分钟转数。

点击右上角的刷新按钮，可以重新获取当前状态。

### 选择运行模式

| 模式 | 作用 |
| --- | --- |
| “关闭” | 停止风扇。 |
| “手动” | 使用固定转速，滑块可以设置 0–100%。 |
| “自动” | 以风扇曲线为基础，同时根据温度变化趋势和保护状态调整转速。 |
| “曲线” | 按照已设置的温度与转速对应关系运行。 |

关闭风扇或设置过低的手动转速会降低散热能力。执行前应确认设备负载和温度，并持续观察温度变化。

在“手动”模式下，拖动“转速调节”滑块设置速度。其他模式下，滑块保持不可用。

### 设置风扇曲线

点击“曲线”打开“风扇曲线管理”。页面会列出当前可选的风扇和温度数据来源。

1. 在“选择风扇”中选择页面当前显示的风扇。
2. 在“绑定温度变量”中添加一个或多个温度来源，并设置权重。
3. 点击绑定按钮，使选定温度来源生效。
4. 在“温度-转速曲线”中添加或编辑曲线点。每条曲线至少需要 2 个点，最多支持 10 个点。
5. 设置“最小占空比”和“最大占空比”。最小值不能高于最大值。
6. 根据需要设置“温度迟滞”和“最小间隔”。温度迟滞范围为 0–20°C，最小间隔范围为 500–30000 ms。
7. 点击“应用曲线”。系统会保存设置，并将所选风扇切换到“曲线”模式。

“温度迟滞”用于减少临界温度附近的频繁调速。“最小间隔”用于限制连续两次调速之间的最短时间。

### 导入和导出曲线

- 点击“导入配置”，选择有效的曲线 JSON 文件。检查页面加载的曲线和参数后，点击“应用曲线”使其生效。
- 点击“导出配置”，浏览器会下载当前曲线，同时尝试将副本保存到 SD 卡的 `/sdcard/config` 目录。页面会提示 SD 卡保存结果。

### 使用测试温度

测试温度会临时替代正常温度来源，并影响自动或曲线调速。测试期间应持续观察风扇和设备状态。

1. 在“测试温度”中输入 0–100°C 的数值。
2. 点击“测试”，观察目标转速和风扇响应。
3. 测试结束后立即点击“清除测试”，恢复正常温度来源。

## 5. LED 管理

“LED 控制”位于“系统”页面，只显示当前设备提供的 LED。

### 常用控制

- 点击设备卡片中的开关，开启或关闭对应 LED。
- 使用“亮度”调节当前设备的亮度。
- 选择颜色或预设色，使支持颜色控制的设备显示所选颜色。
- 点击“动画特效”中的选项启动动画，点击“停止动画”结束当前动画。
- 点击“保存配置”，保存当前设备的 LED 设置。
- 点击“全部关闭”，关闭页面当前显示的所有 LED。

不同 LED 提供的颜色、亮度和动画选项可能不同。以当前设备卡片和设置弹窗中显示的选项为准。

### LED 矩阵高级功能

设备提供 LED 矩阵时，设置弹窗还可以包含以下功能：

- “显示图像”：从 SD 卡选择图像并显示。
- “生成 QR 码”：输入内容，设置颜色和纠错级别后生成 QR 码。
- “显示文本”：输入文字，并设置字体、对齐方式、滚动速度、前景色和背景。
- “后处理滤镜”：选择页面当前提供的滤镜并应用；点击停止按钮结束滤镜。
- “色彩校正”：调整矩阵显示效果，并根据页面按钮重置、导入或导出校正设置。

LED 矩阵的尺寸、动画和滤镜由当前设备决定。文档中的操作以页面实际显示内容为准。

## 6. 网络管理

点击顶部导航中的“网络”进入“网络设置”。修改网络模式、热点或 NAT 设置可能中断当前 WebUI 连接。保存设置前，应确认可以通过新的网络地址重新连接设备。

### 查看网络状态

页面顶部显示以太网、WiFi 客户端和 WiFi 热点的连接状态。进入对应面板，可以查看 IP 地址、子网掩码、网关、DNS、MAC 地址、SSID、信号和接入设备数量等信息。

以太网面板用于查看当前链路和地址信息，不提供地址修改入口。

### 选择 WiFi 模式

| 模式 | 作用 |
| --- | --- |
| “关闭” | 关闭 WiFi。 |
| “站点 (STA)” | 让设备连接现有 WiFi 网络。 |
| “热点 (AP)” | 让设备提供 WiFi 热点。 |
| “STA+AP” | 同时连接现有 WiFi，并保留设备热点。 |

选择模式后等待页面刷新状态。切换模式期间，当前无线连接可能暂时断开。

### 连接 WiFi

1. 将 WiFi 模式设置为“站点 (STA)”或“STA+AP”。
2. 在“站点连接”中点击“扫描”。
3. 从列表中选择网络。列表会显示 SSID、信号强度、信道和认证方式。
4. 输入密码并确认。开放网络可以将密码留空。
5. 等待状态变为“已连接”，并确认页面显示新的 IP 地址。

点击“断开”可以结束当前 WiFi 客户端连接。

### 配置 WiFi 热点

1. 将 WiFi 模式设置为“热点 (AP)”或“STA+AP”。
2. 在“热点”区域点击“配置”。
3. 填写 SSID。密码留空会创建开放热点；设置密码时至少输入 8 位字符。
4. 选择信道，并根据需要启用“隐藏 SSID”。
5. 点击“应用”，等待热点状态更新。

点击“设备”可以查看当前连接到热点的设备。

### 设置主机名

在“网络服务”的“主机名”区域输入新名称，然后点击“设置”。主机名更新后，页面会显示当前名称。

### 查看 DHCP 客户端

DHCP 会自动为接入设备分配网络地址。点击“客户端”，选择“WiFi AP”或“Ethernet”，查看当前分配记录。点击刷新按钮可以重新加载列表。

### 高级网络操作

#### 设置 NAT 网关

NAT 用于在设备的网络接口之间转发连接。启用或停用 NAT 后，点击“保存”保留当前设置。操作完成后检查 WiFi 和 Ethernet 状态。

#### 通过 LPMU 接入上层网络

页面显示“接入上层网络”时，点击“通过LPMU接入”。等待状态从“处理中”变为“成功”或“失败”。处理期间不要重复启动。失败时查看页面给出的错误和输出信息。

## 7. 文件管理

点击顶部导航中的“文件”进入“文件管理”。

SD 卡是可插拔存储，SPIFFS 是设备内部文件存储。点击“SD 卡”或“SPIFFS”切换位置。面包屑显示当前路径，点击其中的目录可以返回对应层级。

### 浏览和管理文件

- 点击文件夹名称进入该目录。
- 点击文件右侧的下载按钮，将文件保存到浏览器的下载位置。
- 点击重命名按钮，输入新名称并确认。
- 点击“新建文件夹”，输入文件夹名称并创建。
- 点击刷新按钮重新加载当前目录和存储状态。

### 上传文件

1. 进入目标目录。
2. 点击“上传文件”。
3. 点击上传区域选择一个或多个文件，或将文件拖入该区域。
4. 检查上传列表，移除不需要的文件。
5. 点击“上传”，等待每个文件显示完成状态。

上传 `.tscfg` 配置包时，页面会进入配置包校验和应用流程。配置包的来源、签名和应用要求请查看安全指南。

### 批量操作

勾选文件或文件夹后，页面会显示批量工具栏。

- “批量下载”下载选中的文件。文件夹不会加入下载内容。
- “批量删除”删除选中的文件和文件夹。
- “取消选择”清除当前选择。

### 删除文件或文件夹

删除操作无法从 WebUI 撤销。删除文件夹时，其中的全部内容也会被删除。确认名称和路径后，再点击“删除”或“批量删除”并确认。

### 挂载和卸载 SD 卡

卸载 SD 卡会使卡中的文件暂时无法访问。确认没有上传、下载或其他文件操作正在进行后，点击“卸载 SD”。

SD 卡未挂载时，页面会显示“挂载 SD”。点击该按钮，等待存储状态变为“已挂载”，随后重新进入 SD 卡目录。

## 8. OTA 更新

在“系统”页面的“网络与时间”区域点击“OTA 升级”，进入“固件升级”。

更新过程中设备会重启，WebUI 会暂时断开。开始前应保存正在进行的工作，并保持设备供电稳定。升级进度尚未完成时不要关闭设备。

### 从 OTA 服务器检查更新

1. 查看页面显示的“当前版本”。
2. 在“OTA 服务器”中输入管理员或发行方提供的服务器地址。
3. 点击“保存”，随后点击“检查更新”。
4. 页面会显示“发现新版本”“已是最新版本”“服务器版本较旧”或错误信息。
5. 确认目标版本后，点击“立即升级”或页面显示的升级按钮。
6. 等待下载、安装和重启完成。页面显示中止按钮时，可以按需中止当前支持中止的阶段。
7. 设备重新上线后，重新连接 WebUI，并核对“当前版本”。

升级同时包含 WebUI 时，固件和 WebUI 会依次更新。两者应来自同一发布版本。

### 手动升级

展开“手动升级”后，可以选择以下方式：

- “从 URL 升级”：填写固件 URL，根据发布说明选择“包含 WebUI”，然后点击“升级”。
- “从 SD 卡升级”：填写固件文件路径，例如 `/sdcard/firmware.bin`。选择“包含 WebUI”时，页面会同时处理同目录中的 WebUI 文件。

“跳过验证”会绕过固件完整性或签名检查，并增加安装损坏或非预期固件的风险。日常升级应保持验证开启。只有在固件来源和操作要求已经确认时才使用该选项。

### 分区管理与回滚

“分区管理”显示当前运行分区和其他可用分区。

- “标记有效”会确认当前运行版本，并取消该版本的自动回滚保护。确认当前版本运行正常后再执行。
- “回滚到此版本”会选择另一可启动版本，并通过重启切换。回滚会中断当前服务，执行前应确认目标版本和相关数据兼容。

操作完成并重启后，重新打开 WebUI，核对当前版本和设备状态。

## 9. 安全管理入口

点击顶部导航中的“安全”进入安全管理页面。SSH 密钥、远程主机、主机指纹、HTTPS 证书、配置包和账户管理的操作请查看《TianshanOS 安全指南》。本指南不重复这些内容。

# TianshanOS Admin User Guide

![TianshanOS](图片和附件/tsintro%201.png)

This guide is for users who manage TianshanOS with the admin account. It covers routine tasks available in the WebUI. Use the TianshanOS Security Guide for security management. Terminal access, automation rules, and command management are covered by the root operations guide.

Available pages and controls depend on the device model, hardware configuration, and current state. No action is required for a device, button, or option that is not shown.

## 1. Getting Started

### Open the WebUI

1. Open the device WebUI address in a browser.
2. Select “Login” in the upper-right corner.
3. Keep `admin` as the username and enter the admin password supplied with the device.
4. Select “Login.” After a successful login, the current username appears in the upper-right corner.

When the default password is still in use, a “Security Reminder” appears after login. Enter the current password and the new password, then select “Change Now.” Enter the new password twice with matching values. Select “Change Later” to close the reminder.

After completing your work, select “Logout” in the upper-right corner. The WebUI returns to “System.”

### Switch Languages

Select the language button at the top of the page, then choose Chinese or English. Page content and control labels switch immediately.

### Page Navigation

The main admin pages are:

- “System”: View device status, control modules, fans, and LEDs, and open OTA Update.
- “Network”: View and change Ethernet, WiFi, DHCP, and NAT settings.
- “Files”: Manage files on the SD Card and SPIFFS.
- “Security”: Open the separate security management page. See the Security Guide for instructions.

## 2. System Status and Routine Operations

Select “System” in the top navigation.

### View Resource and Service Status

“Resource Monitor” shows CPU, DRAM, and PSRAM usage. DRAM is the main working memory, and PSRAM is extended memory.

- Select “Details” to view total, used, and free memory, plus fragmentation.
- The number next to “Services” shows running services and total services.
- Select “Services” to view each service's status, stage, and health.

If a service shows “Failed” or an unhealthy state, refresh the page first to confirm the current condition.

### View System and Power Information

“System Overview” shows the chip, firmware version, uptime, and build time. “Power Status” shows input voltage, internal voltage, current, power, and protection status.

The switch beside the protection status enables or disables low-voltage protection. When enabled, the configured shutdown and recovery process runs if input voltage becomes too low.

### View Network and Time

“Network & Time” shows Ethernet, WiFi, IP address, current time, sync status, time source, and timezone.

- Select “Sync Time” to copy the browser's current time to the device.
- Select “Timezone,” choose a preset or enter a supported timezone setting, then save.
- Select “OTA Update” to open the firmware update page.

### Advanced Operations

#### Reboot TianshanOS

A reboot temporarily interrupts the WebUI and device management. Complete current work before selecting “Reboot” and confirming. The page reports that the system is rebooting. Reopen the WebUI after the device recovers.

#### Restart One Service

Restarting a service temporarily interrupts the function it provides. Open “Service Status,” find the affected service, and select “Reboot” on that row. Check its status and health again when the operation finishes.

#### Change Shutdown Settings

Voltage thresholds and delay values affect device shutdown and recovery. Confirm the device's power requirements before changing them.

Select “Shutdown Settings” to change:

- “Low Voltage Threshold”: Starts the shutdown countdown below this voltage.
- “Recovery Threshold”: Starts recovery above this voltage.
- “Shutdown Countdown”: Sets the delay before shutdown after low voltage is detected.
- “Recovery Stabilization”: Sets the wait time used to confirm stable power recovery.
- “Fan Stop Delay”: Sets the delay before fans stop after shutdown.

Save the form to apply the updated protection settings.

#### Switch the Top USB Target

Switching the USB target may temporarily disconnect an attached device. Confirm the target and finish active work before continuing.

When USB switching is available, select the “USB” button to change the top USB connection among ESP, AGX, and LPMU. The button shows the current target, and the page confirms a successful switch.

## 3. Device Panel

The “Device Panel” is on the “System” page. It contains module power controls, Quick Actions, and data widgets.

### Control AGX and LPMU

The AGX and LPMU buttons show the current state. Green indicates a running device, red indicates a powered-off device, and a waiting state appears during detection.

Forced power-off can cause loss of unsaved data. Save work on the module and complete its normal shutdown process before removing power.

- Select the AGX state button to power AGX on or off. Wait for the final result shown on the page.
- Select the LPMU state button to trigger the same action as its physical power button. The page continues checking the LPMU state. Follow the displayed message if detection times out, and avoid repeated clicks.

### Use Quick Actions

“Quick Actions” shows action cards that have been made available to admin users.

1. Select a card to run its action.
2. Wait while the card shows that processing is in progress.
3. Cards that support background tasks show a running state and provide “Log” and “Stop.”
4. Select “Log” to view current output. Select “Stop” to end a running task.

A running task must be stopped before it can be started again. After triggering one action, wait a few seconds before starting another.

Press and hold a card until the reorder indicator appears, then drag it to change the display order. “No Quick Actions” means that no cards are currently available to the admin account.

### Manage Data Widgets

Data widgets continuously display device data in the “Device Panel.”

1. Select “Widget Manager.”
2. Choose a refresh interval or disable automatic refresh.
3. Add a preset widget, or choose a component style and data source offered by the page.
4. Edit its label, display style, and unit as needed, then save.

Existing widgets can be edited, deleted, and reordered. You can also select a widget card to edit it. Press and hold a widget, then drag it to a new position.

## 4. Fan Management

“Fan Control” is on the “System” page. The page shows only fans currently provided by the device.

### View Fan Status

The status bar shows “Effective Temp” and “Target Speed.” Each fan card shows the current mode, speed percentage, and RPM when available. RPM is the number of fan revolutions per minute.

Select the refresh button in the upper-right corner to reload the current state.

### Select an Operating Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Stops the fan. |
| “Manual” | Uses a fixed speed set with the 0–100% slider. |
| “Auto” | Starts from the fan curve and also responds to temperature trends and protection states. |
| “Curve” | Follows the configured temperature-to-speed points. |

Turning a fan off or using a low manual speed reduces cooling. Confirm the device load and temperature before changing the mode, and continue monitoring temperature afterward.

In “Manual” mode, use the “Speed Adjust” slider to set the speed. The slider is unavailable in other modes.

### Configure a Fan Curve

Select “Curve” to open “Fan Curve Management.” The page lists the fans and temperature data sources currently available.

1. Under “Select Fan,” choose a fan shown by the page.
2. Under “Bind Temperature Variable,” add one or more temperature sources and assign weights.
3. Select the bind control to apply the selected temperature sources.
4. Add or edit points under “Temperature-Speed Curve.” A curve requires at least 2 points and supports up to 10 points.
5. Set “Min Duty Cycle” and “Max Duty Cycle.” The minimum cannot be greater than the maximum.
6. Set “Temperature Hysteresis” and “Min Interval” as needed. Hysteresis accepts 0–20°C, and the minimum interval accepts 500–30000 ms.
7. Select “Apply Curve.” The settings are saved and the selected fan switches to “Curve” mode.

“Temperature Hysteresis” reduces repeated speed changes near a temperature boundary. “Min Interval” sets the shortest time between speed adjustments.

### Import and Export a Curve

- Select “Import Config” and choose a valid curve JSON file. Review the loaded curve and parameters, then select “Apply Curve.”
- Select “Export Config” to download the current curve in the browser. The page also attempts to save a copy under `/sdcard/config` and reports the SD Card result.

### Use a Test Temperature

A test temperature temporarily replaces the normal temperature source and affects Auto or Curve control. Monitor the fan and device state throughout the test.

1. Enter a value from 0–100°C under “Test Temp.”
2. Select “Test” and observe the target speed and fan response.
3. Select “Clear Test” immediately after the test to restore the normal temperature source.

## 5. LED Management

“LED Control” is on the “System” page and shows only LEDs currently provided by the device.

### Routine Controls

- Use the switch on a device card to turn that LED on or off.
- Use “Brightness” to change the brightness of the current device.
- Select a color or preset color for devices that support color control.
- Choose an item under “Effects” to start it, and select “Stop Effect” to end the current effect.
- Select “Save Config” to save the current LED settings.
- Select “All Off” to turn off all LEDs currently shown on the page.

Available colors, brightness controls, and effects vary by LED. Use the options shown on the current device card and settings dialog.

### Advanced LED Matrix Features

When the device provides an LED Matrix, its settings dialog can also include:

- “Display Image”: Select and display an image from the SD Card.
- “Generate QR”: Enter content and choose colors and an error-correction level.
- “Display Text”: Enter text and set the font, alignment, scroll speed, foreground color, and background.
- “Post-processing Filter”: Apply a filter currently offered by the page, or use the stop control to end it.
- “Color Correction”: Adjust the matrix output and use the available controls to reset, import, or export correction settings.

Matrix dimensions, effects, and filters are determined by the current device. Follow the controls displayed in the WebUI.

## 6. Network Management

Select “Network” in the top navigation to open “Network Settings.” Changing the network mode, hotspot, or NAT settings may interrupt the current WebUI connection. Before saving, make sure you can reconnect through the new network address.

### View Network Status

The top of the page shows the state of Ethernet, the WiFi client, and the WiFi AP. Open the related panel to view IP address, subnet mask, gateway, DNS, MAC address, SSID, signal, and connected-device counts when available.

The Ethernet panel displays the current link and address information. It does not provide address editing controls.

### Select a WiFi Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Turns WiFi off. |
| “Station (STA)” | Connects the device to an existing WiFi network. |
| “Access Point (AP)” | Makes the device provide a WiFi hotspot. |
| “STA+AP” | Connects to an existing WiFi network while keeping the device hotspot available. |

After choosing a mode, wait for the page to refresh the state. The current wireless connection may be interrupted during the switch.

### Connect to WiFi

1. Set the WiFi mode to “Station (STA)” or “STA+AP.”
2. Under “Station,” select “Scan.”
3. Choose a network from the list. The list shows SSID, signal strength, channel, and authentication type.
4. Enter the password and confirm. Leave the password blank for an open network.
5. Wait for the state to change to “Connected,” then confirm the new IP address.

Select “Disconnect” to end the current WiFi client connection.

### Configure the WiFi AP

1. Set the WiFi mode to “Access Point (AP)” or “STA+AP.”
2. Under “Hotspot,” select “Config.”
3. Enter the SSID. A blank password creates an open hotspot; a protected hotspot requires at least 8 characters.
4. Select a channel and enable “Hidden SSID” if needed.
5. Select “Apply” and wait for the hotspot state to update.

Select “Devices” to view clients currently connected to the hotspot.

### Set the Hostname

Enter a new name in the “Hostname” section under “Network Services,” then select “Set.” The page shows the current hostname after it updates.

### View DHCP Clients

DHCP automatically assigns network addresses to connected devices. Select “Clients,” choose “WiFi AP” or “Ethernet,” and view the current leases. Use the refresh button to reload the list.

### Advanced Network Operations

#### Configure the NAT Gateway

NAT forwards connections between the device's network interfaces. Enable or disable NAT, then select “Save” to retain the setting. Check the WiFi and Ethernet status afterward.

#### Access the Upstream Network via LPMU

When “Upstream Network Access” is shown, select “Access via LPMU.” Wait for the state to change from “Processing” to “Success” or “Failed.” Do not start it again while processing. If it fails, read the error and output shown by the page.

## 7. File Management

Select “Files” in the top navigation to open “File Manager.”

The SD Card is removable storage, and SPIFFS is internal device file storage. Select “SD Card” or “SPIFFS” to switch locations. The breadcrumb shows the current path; select a directory in it to return to that level.

### Browse and Manage Files

- Select a folder name to open it.
- Select the download button beside a file to save it to the browser's download location.
- Select the rename button, enter a new name, and confirm.
- Select “New Folder,” enter a folder name, and create it.
- Select the refresh button to reload the current directory and storage state.

### Upload Files

1. Open the target directory.
2. Select “Upload Files.”
3. Select one or more files, or drag files into the upload area.
4. Review the upload list and remove unwanted files.
5. Select “Upload” and wait for each file to show completion.

Uploading a `.tscfg` configuration package starts its verification and application flow. See the Security Guide for package sources, signatures, and application requirements.

### Batch Operations

After selecting files or folders, the batch toolbar appears.

- “Batch Download” downloads selected files. Folders are not included.
- “Batch Delete” deletes selected files and folders.
- “Clear Selection” clears the current selection.

### Delete a File or Folder

Deletion cannot be undone in the WebUI. Deleting a folder also deletes all of its contents. Confirm the name and path before selecting “Delete” or “Batch Delete” and approving the prompt.

### Mount and Unmount the SD Card

Unmounting the SD Card makes its files temporarily unavailable. Make sure no upload, download, or other file operation is in progress, then select “Unmount SD.”

When the SD Card is not mounted, the page shows “Mount SD.” Select it, wait for the state to change to “Mounted,” then open the SD Card directory again.

## 8. OTA Updates

On the “System” page, select “OTA Update” in the “Network & Time” section to open “Firmware Upgrade.”

The device reboots during an update, temporarily disconnecting the WebUI. Save active work and keep device power stable before starting. Do not power off the device while update progress is incomplete.

### Check for Updates from an OTA Server

1. Review the “Current Version.”
2. Enter the OTA server address supplied by an administrator or publisher.
3. Select “Save,” then select “Check Update.”
4. The page reports “Update Available,” “Already up to date,” an older server version, or an error.
5. Confirm the target version, then select “Upgrade Now” or the upgrade control shown by the page.
6. Wait for download, installation, and reboot to finish. When “Abort” is available, it can stop the stages that support cancellation.
7. Reconnect to the WebUI after the device comes back online and verify “Current Version.”

When “Include WebUI” is enabled, the firmware and WebUI are updated in sequence. Both should come from the same release.

### Manual Upgrade

Expand “Manual Upgrade” and choose one of these methods:

- “Upgrade from URL”: Enter the firmware URL, set “Include WebUI” according to the release instructions, then select “Upgrade.”
- “Upgrade from SD Card”: Enter a firmware path such as `/sdcard/firmware.bin`. When “Include WebUI” is enabled, the page also processes the WebUI file in the same directory.

“Skip Verify” bypasses firmware integrity or signature checks and increases the risk of installing damaged or unintended firmware. Keep verification enabled for routine updates. Use this option only after the firmware source and operating instructions have been confirmed.

### Partition Management and Rollback

“Partition Management” shows the running partition and other available partitions.

- “Mark Valid” confirms the running version and disables automatic rollback protection for that version. Use it after confirming that the current version operates correctly.
- “Rollback to This Version” selects another bootable version and switches through a reboot. Rollback interrupts current services. Confirm the target version and data compatibility first.

After the operation and reboot complete, reopen the WebUI and verify the current version and device state.

## 9. Security Management Entry

Select “Security” in the top navigation to open security management. Use the TianshanOS Security Guide for SSH keys, remote hosts, known-host fingerprints, HTTPS certificates, configuration packages, and account management. These procedures are not repeated here.
