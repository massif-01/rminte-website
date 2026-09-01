# RM-01 网络配置指南

## 1. 先了解两条网络连接路径

RM-01 提供两条基于 USB-C 的网络连接路径，本文分别称为 **C1 接口**和 **C3 接口**。两者都能承载网络连接，但连接对象和网络拓扑不同：

| 接口 | 主要用途 | 连接后的网络关系 |
| --- | --- | --- |
| C1 | 将电脑、平板或手机等用户设备接入 RM-01 | 用户设备加入 RM-01 内部交换机网络，成为内部网络中的一个节点 |
| C3 | 将 RM-01 接入用户现有的局域网 | 通过 LPMU 为其他内部节点提供路由，使整机接入交换机或路由器所在的上层网络 |

## 2. 识别 C1 与 C3

### C1 接口

C1 位于机身侧后方。面对上下排列的两个 USB-C 接口时，C1 是靠上的接口；接口下方刻有连接图样，可用于确认位置。

### C3 接口

C3 位于机身顶部。掀开上方磁吸盖板后，可以看到该 USB-C 接口。C3 是顶部共享 USB 接口，可在 TianshanOS 中切换至 ESP、AGX 或 LPMU。

## 3. 通过 C1 将用户设备接入 RM-01

使用支持数据传输的 USB-C 线缆，将 iPad、电脑、手机或其他用户设备连接至 C1。连接后，RM-01 会自动完成 DHCP 地址分配，用户无需手动填写 IP 地址、网关或 DNS。

用户设备通常会识别出一个名为 `AX88179` 或 USB Ethernet 的有线网络接口。该设备随后会加入 RM-01 内部交换机网络，并可以与内部网络中的设备通信。

> C1 会把用户设备直接接入 RM-01 内部网络。只连接可信设备；在公共或不受信任环境中，不要把未经管理的设备接入 C1。

## 4. 保留互联网连接并向 RM-01 共享网络

### 用户设备的互联网连接可能发生什么

连接 C1 后，部分操作系统可能把 `AX88179` 当作优先网络出口。由于 C1 首先用于访问 RM-01 内部网络，而不是直接提供互联网，用户设备原有的互联网连接可能暂时中断。

如果用户设备仍需通过 Wi-Fi、以太网或其他连接访问互联网，应确保原有互联网连接的优先级高于 `AX88179`：

| 系统 | 系统中的名称 | 设置原则 |
| --- | --- | --- |
| macOS | 网络服务顺序（Service Order） | 将提供互联网的 Wi-Fi 或以太网置于 `AX88179` 之上 |
| Windows | 接口跃点数（Interface Metric） | 数值越小优先级越高；使互联网接口的跃点数小于 `AX88179` |
| Linux | 路由 metric（Route Metric） | 数值越小优先级越高；使互联网默认路由的 metric 小于 `AX88179` |

### 使用 RM-01 网络连接工具

如果还需要把用户设备的互联网连接共享给 RM-01，请从网站的“下载”页面获取 **RM-01 网络连接工具**。该工具会配置用户设备与 C1 之间的 DHCP、路由和网络共享规则，使互联网流量能够从用户设备转发至 RM-01 内部网络。

当前支持：

- macOS
- Linux
- Windows 专业版

Windows 家庭版当前不受支持。

> 网络连接工具会修改用户设备的网络地址、路由和共享设置，运行时可能短暂中断现有连接。开始前请保存正在进行的下载、远程会话和其他依赖网络的工作。

## 5. 通过 C3 将 RM-01 接入上层网络

这里的“上层网络”是指用户已有的局域网，例如交换机或路由器所在的网络。

### 准备连接器

用户需自备以下连接设备：

- 一个 USB-C ↔ RJ45 以太网适配器
- 一根连接交换机或路由器的 RJ45 网线

将 USB-C 端连接至 C3，再将 RJ45 网线连接至用户的交换机或路由器。仅完成物理连接还不足以完成 DHCP 和路由配置，后续必须运行 RM-01 内置的网络配置程序。

### 将顶部 USB 切换至 LPMU

1. 打开 TianshanOS 首页。
2. 找到“USB 切换”区域。
3. 点击“USB”按钮，将顶部 USB 接口的当前目标切换至 `LPMU`。
4. 确认页面显示的当前目标为 `LPMU` 后，再继续网络配置。

切换顶部 USB 目标时，当前连接可能短暂断开。请勿在接口正在传输数据时切换目标。

## 6. 通过 LPMU 完成整机联网

RM-01 出厂时已在 LPMU 中预制网络自动化配置项目。LPMU 取得上层网络连接后，会通过内部路由与 NAT 为 AGX 等内部节点转发流量，使整机接入用户的上层网络。

### 项目位置和用户需要做什么

项目位于 **LPMU 当前用户的主目录**，预制路径为 `~/network-setup/`，其中面向 LPMU 的脚本位于 `~/network-setup/lpmu/`。

出厂设备不需要重新下载项目，也不需要重复执行 README 中面向工程部署的 `scp`、`chmod` 或安装步骤。普通用户应从 TianshanOS 运行配置；只有在故障诊断或二次开发时，才需要进入项目目录检查脚本与日志。

> 请勿随意移动、重命名或删除 `~/network-setup/`。TianshanOS 的网络配置功能依赖出厂预制的项目路径和脚本。

### 自动化项目会完成什么

执行配置后，项目会在 LPMU 上依次完成以下工作：

1. 检测具有网关的网络接口，并通过连通性测试选择可用的上层网络出口。
2. 重新设置 LPMU 的默认路由，使流量通过选定的上层网络接口发送。
3. 启用 IPv4 转发，并配置 `iptables` 的 NAT 与 FORWARD 规则。
4. 使内部 AGX（默认地址 `10.10.99.98`）通过 LPMU（内部地址 `10.10.99.99`）访问上层网络。
5. 配置用于访问 AGX 的端口转发规则。

项目还包含可选的智能路由监控服务。启用后，服务每 30 秒检查一次当前网络出口，在连接失效时尝试切换至其他可用接口，并在首选接口恢复后切换回来。

### 通过 TianshanOS 运行

1. 确认 C3 已通过 USB-C ↔ RJ45 以太网适配器连接至交换机或路由器。
2. 确认 TianshanOS 首页中的顶部 USB 目标已经切换至 `LPMU`。
3. 在 TianshanOS 顶部导航中打开“网络”。
4. 找到“接入上层网络”。
5. 点击“通过LPMU接入”。
6. 等待状态从“处理中”变为“成功”或“失败”。处理期间不要重复启动。

状态显示“成功”表示脚本已找到可用的上层网络出口、完成 LPMU 路由配置，并执行内部网络转发与 NAT 配置。此时仍建议验证 AGX 的 IP 连通性和 DNS 解析，而不是仅以按钮状态作为最终判断。

### 如何确认联网成功

首先确认 TianshanOS 显示“成功”。如果用户拥有 AGX 终端权限，可在 AGX 中依次执行：

```bash
ping -c 3 10.10.99.99  # 验证 AGX 到 LPMU
ping -c 3 8.8.8.8       # 验证互联网 IP 连通性
ping -c 3 google.com    # 验证 DNS 解析
```

三项测试分别验证内部链路、互联网转发和 DNS。第一项失败通常表示内部连接或地址配置异常；第一项成功而第二项失败，应检查 LPMU 的上层网络、默认路由和 NAT；前两项成功而第三项失败，则应检查 DNS 配置。

### 端口转发与安全边界

当前项目会在 LPMU 的上层网络接口配置以下转发：

| LPMU 入口 | 转发目标 | 用途 |
| --- | --- | --- |
| TCP `58022` | AGX TCP `22` | 通过 LPMU 访问 AGX 的 SSH 服务 |
| TCP/UDP `58000–58999` | AGX 相同端口 | 访问运行在 AGX 上的应用服务 |

例如，SSH 客户端连接的是 LPMU 的上层网络地址，但用户名和认证凭据属于 AGX：

```bash
ssh -p 58022 <AGX_USERNAME>@<LPMU_IP>
```

> 端口转发会扩大 AGX 服务在上层网络中的可访问范围。只应在可信局域网中启用，并结合交换机、路由器或上层防火墙限制来源地址；不要把这些端口直接暴露到公共互联网。

### 风险与故障排查

> “通过LPMU接入”会删除 LPMU 的旧默认路由，清空现有 `iptables` NAT 表和 FORWARD 链规则，并把 FORWARD 默认策略设置为 DROP，随后再写入 RM-01 所需的路由、NAT 与端口转发规则。该过程可能立即中断远程连接，也会覆盖已有的自定义网络和防火墙配置。若 LPMU 做过定制，请先导出路由表与防火墙规则，并确保具备本地恢复方式。

如果接入失败，请依次检查：

1. C3 使用的 USB-C ↔ RJ45 适配器和网线是否连接牢固。
2. 交换机或路由器端口是否已经启用。
3. TianshanOS 首页显示的顶部 USB 目标是否为 `LPMU`。
4. 上层网络是否能向 LPMU 提供有效地址、网关和 DNS。
5. “接入上层网络”区域显示的错误和输出信息。
6. AGX 是否仍可访问 LPMU 内部地址 `10.10.99.99`。
7. LPMU 中是否存在与默认路由、NAT、FORWARD 链或端口转发冲突的自定义规则。

# RM-01 Network Configuration Guide

## 1. Understand the Two Network Paths

RM-01 provides two USB-C-based network paths, referred to in this guide as the **C1 port** and the **C3 port**. Both carry network connections, but they connect different devices and create different network topologies:

| Port | Primary purpose | Network relationship after connection |
| --- | --- | --- |
| C1 | Connect a computer, tablet, phone, or other user device to RM-01 | The user device joins the RM-01 internal switch network as an internal network node |
| C3 | Connect RM-01 to the user's existing local network | LPMU routes traffic for the other internal nodes, allowing the complete system to join the upstream switch or router network |

## 2. Identify C1 and C3

### C1 port

C1 is on the rear side of the enclosure. Of the two vertically arranged USB-C ports, C1 is the upper port. A connection symbol engraved below the port helps identify it.

### C3 port

C3 is on top of the enclosure. Lift the magnetic top cover to expose this USB-C port. C3 is the shared top USB port and can be switched among ESP, AGX, and LPMU in TianshanOS.

## 3. Connect a User Device through C1

Use a USB-C cable that supports data transfer to connect an iPad, computer, phone, or other user device to C1. RM-01 automatically provides DHCP configuration, so the user does not need to enter an IP address, gateway, or DNS server manually.

The user device will normally detect a wired network interface named `AX88179` or USB Ethernet. The device then joins the RM-01 internal switch network and can communicate with devices on that network.

> C1 connects the user device directly to the RM-01 internal network. Connect only trusted devices, and do not attach unmanaged devices to C1 in public or untrusted environments.

## 4. Keep Internet Access and Share It with RM-01

### What may happen to the user device's internet connection

After C1 is connected, some operating systems may treat `AX88179` as the preferred network path. Because C1 provides access to the RM-01 internal network rather than direct internet access, the user device's existing internet connection may be interrupted.

If the user device must continue using Wi-Fi, Ethernet, or another connection for internet access, keep that internet connection at a higher priority than `AX88179`:

| System | System terminology | Configuration principle |
| --- | --- | --- |
| macOS | Network service order (Service Order) | Place the internet-providing Wi-Fi or Ethernet service above `AX88179` |
| Windows | Interface metric | Lower values have higher priority; use a lower metric for the internet interface than for `AX88179` |
| Linux | Route metric | Lower values have higher priority; use a lower metric for the internet default route than for `AX88179` |

### Use the RM-01 Network Connection Tool

To share the user device's internet connection with RM-01, obtain the **RM-01 Network Connection Tool** from the website's Downloads page. The tool configures DHCP, routing, and network-sharing rules between the user device and C1 so internet traffic can be forwarded into the RM-01 internal network.

Currently supported systems:

- macOS
- Linux
- Windows Pro

Windows Home is not currently supported.

> The network connection tool changes network addressing, routing, and sharing settings on the user device. Existing connections may be interrupted briefly. Save active downloads, remote sessions, and other network-dependent work before starting.

## 5. Connect RM-01 to an Upstream Network through C3

In this guide, “upstream network” means the user's existing local network, such as a network provided by a switch or router.

### Prepare the adapter

The user must provide:

- A USB-C-to-RJ45 Ethernet adapter
- An RJ45 Ethernet cable connected to the switch or router

Connect the USB-C end to C3, then connect the RJ45 cable to the user's switch or router. The physical connection alone does not complete DHCP or routing configuration. The built-in RM-01 network configuration program must be run afterward.

### Switch the top USB port to LPMU

1. Open the TianshanOS home page.
2. Find “USB Switch.”
3. Select the “USB” button and switch the current target of the top USB port to `LPMU`.
4. Confirm that the page shows `LPMU` as the current target before continuing.

Switching the top USB target may disconnect the current link briefly. Do not switch targets while data is being transferred through the port.

## 6. Bring the Complete System Online through LPMU

RM-01 ships with the network automation project preloaded on LPMU. After LPMU obtains upstream connectivity, it uses internal routing and NAT to forward traffic for AGX and the other internal nodes, bringing the complete system onto the user's upstream network.

### Project location and what the user needs to do

The project is stored in the **home directory of the current LPMU user** at `~/network-setup/`. LPMU-specific scripts are located in `~/network-setup/lpmu/`.

On a factory-configured device, do not download the project again or repeat the engineering deployment steps in the repository README, such as `scp`, `chmod`, or service installation. Regular users should start the configuration from TianshanOS. Enter the project directory only for troubleshooting or development.

> Do not move, rename, or delete `~/network-setup/`. The TianshanOS network configuration workflow depends on the factory project path and scripts.

### What the automation project configures

When started, the project performs the following work on LPMU:

1. Detects interfaces with gateways and runs connectivity tests to select a usable upstream path.
2. Replaces the LPMU default route so traffic uses the selected upstream interface.
3. Enables IPv4 forwarding and configures `iptables` NAT and FORWARD rules.
4. Allows the internal AGX, at the default address `10.10.99.98`, to reach the upstream network through LPMU at `10.10.99.99`.
5. Adds port-forwarding rules for services hosted on AGX.

The project also includes an optional smart-route monitoring service. When enabled, it checks the current upstream path every 30 seconds, attempts to fail over when connectivity is lost, and returns to the preferred interface when that interface recovers.

### Run the configuration from TianshanOS

1. Confirm that C3 is connected to the switch or router through the USB-C-to-RJ45 Ethernet adapter.
2. Confirm that the top USB target on the TianshanOS home page is set to `LPMU`.
3. Open “Network” from the top navigation in TianshanOS.
4. Find “Upstream Network Access.”
5. Select “Access via LPMU.”
6. Wait for the state to change from “Processing” to “Success” or “Failed.” Do not start the operation again while it is processing.

“Success” means that the script found a usable upstream path, configured the LPMU route, and ran the internal forwarding and NAT configuration. Verify AGX IP connectivity and DNS resolution afterward instead of treating the button state as the only proof of connectivity.

### Confirm that the connection works

First confirm that TianshanOS reports “Success.” If the user has AGX terminal access, run these checks on AGX:

```bash
ping -c 3 10.10.99.99  # Verify AGX-to-LPMU connectivity
ping -c 3 8.8.8.8       # Verify internet IP connectivity
ping -c 3 google.com    # Verify DNS resolution
```

These checks isolate the internal link, internet forwarding, and DNS. If the first test fails, inspect the internal link and addressing. If the first succeeds but the second fails, inspect the LPMU upstream connection, default route, and NAT. If only the third fails, inspect DNS configuration.

### Port forwarding and the security boundary

The current project configures these forwards on the LPMU upstream interface:

| LPMU entry | Forwarding target | Purpose |
| --- | --- | --- |
| TCP `58022` | AGX TCP `22` | Reach the AGX SSH service through LPMU |
| TCP/UDP `58000–58999` | The same ports on AGX | Reach application services running on AGX |

For SSH, the client connects to the LPMU upstream address, but the username and authentication credentials belong to AGX:

```bash
ssh -p 58022 <AGX_USERNAME>@<LPMU_IP>
```

> Port forwarding increases the reachability of AGX services from the upstream network. Enable it only on a trusted LAN and restrict source addresses with the switch, router, or upstream firewall. Do not expose these ports directly to the public internet.

### Risks and troubleshooting

> “Access via LPMU” deletes the previous LPMU default routes, flushes the existing `iptables` NAT table and FORWARD chain, sets the default FORWARD policy to DROP, and then writes the RM-01 routing, NAT, and port-forwarding rules. This can immediately interrupt remote sessions and overwrite custom network or firewall configuration. If LPMU has been customized, export the current routes and firewall rules first and make sure a local recovery path is available.

If the operation fails, check the following in order:

1. Confirm that the USB-C-to-RJ45 adapter and Ethernet cable connected to C3 are secure.
2. Confirm that the switch or router port is enabled.
3. Confirm that the TianshanOS home page shows `LPMU` as the current top USB target.
4. Confirm that the upstream network provides LPMU with a valid address, gateway, and DNS configuration.
5. Read the error and output shown in “Upstream Network Access.”
6. Confirm that AGX can still reach the LPMU internal address `10.10.99.99`.
7. Check for custom LPMU rules that conflict with the default route, NAT, FORWARD chain, or port forwarding.
