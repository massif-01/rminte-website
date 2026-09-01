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

RM-01 出厂时已在 LPMU 中内置网络自动化配置程序。LPMU 会为 RM-01 的其他内部节点提供路由，因此完成以下操作后，整机可以接入用户的上层网络。

### 运行内置网络配置程序

1. 确认 C3 已通过 USB-C ↔ RJ45 以太网适配器连接至交换机或路由器。
2. 确认 TianshanOS 首页中的顶部 USB 目标已经切换至 `LPMU`。
3. 在 TianshanOS 顶部导航中打开“网络”。
4. 找到“接入上层网络”。
5. 点击“通过LPMU接入”。
6. 等待状态从“处理中”变为“成功”或“失败”。处理期间不要重复启动。

状态显示“成功”后，LPMU 会取得上层网络连接，并通过内部路由为 RM-01 的其他计算节点提供网络。

### 风险与故障排查

> “通过LPMU接入”会调整 LPMU 的网络接口、DHCP、默认路由、IP 转发、NAT 和防火墙规则，可能中断正在进行的远程连接，也可能覆盖已有的自定义网络规则。若 LPMU 已进行过自定义网络或防火墙配置，请先记录现有配置再执行。

如果接入失败，请依次检查：

1. C3 使用的 USB-C ↔ RJ45 适配器和网线是否连接牢固。
2. 交换机或路由器端口是否已经启用。
3. TianshanOS 首页显示的顶部 USB 目标是否为 `LPMU`。
4. “接入上层网络”区域显示的错误和输出信息。
5. LPMU 中是否存在会阻止 DHCP、路由、NAT 或防火墙配置的自定义规则。

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

The LPMU ships with the RM-01 automated network configuration program. LPMU routes traffic for the other internal RM-01 nodes, so the complete system can join the user's upstream network after the following procedure is completed.

### Run the built-in network configuration program

1. Confirm that C3 is connected to the switch or router through the USB-C-to-RJ45 Ethernet adapter.
2. Confirm that the top USB target on the TianshanOS home page is set to `LPMU`.
3. Open “Network” from the top navigation in TianshanOS.
4. Find “Upstream Network Access.”
5. Select “Access via LPMU.”
6. Wait for the state to change from “Processing” to “Success” or “Failed.” Do not start the operation again while it is processing.

After the state changes to “Success,” LPMU has obtained upstream connectivity and provides network access to the other RM-01 compute nodes through internal routing.

### Risks and troubleshooting

> “Access via LPMU” changes LPMU network interfaces, DHCP, default routes, IP forwarding, NAT, and firewall rules. It may interrupt active remote sessions and may overwrite existing custom network rules. If LPMU already has custom network or firewall configuration, record the current configuration before running this operation.

If the operation fails, check the following in order:

1. Confirm that the USB-C-to-RJ45 adapter and Ethernet cable connected to C3 are secure.
2. Confirm that the switch or router port is enabled.
3. Confirm that the TianshanOS home page shows `LPMU` as the current top USB target.
4. Read the error and output shown in “Upstream Network Access.”
5. Check whether custom LPMU rules are preventing DHCP, routing, NAT, or firewall configuration.
