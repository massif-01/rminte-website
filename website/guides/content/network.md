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

## 5. 使用 AI 配置 C1 网络共享

具备本机命令执行能力的 Agent Harness（如 Codex、Hermes）可以根据自然语言检查网络拓扑，并帮助配置从用户电脑到 RM-01 内部网络的转发与共享。这里的 AI 必须能够在目标电脑上执行系统命令；普通对话式 AI 只能提供操作建议，不能直接完成配置。

### 在哪里运行 AI Agent

建议直接在连接 C1 的用户电脑上运行 Agent。因为互联网出口、默认路由和共享规则都由这台电脑管理，Agent 需要获得该电脑的管理员权限才能完成配置。

如果 Codex、Hermes 或其他 Agent 运行在 RM-01 内部，则必须事先获得对用户电脑的远程命令执行权限和管理员授权；否则它无法修改用户电脑上的网络共享、路由与防火墙设置。

### 执行前确认

- 用户电脑已经通过 C1 接入 RM-01，并能看到名为 `AX88179` 或 USB Ethernet 的网络接口。
- 用户电脑的 C1 地址为 `10.10.99.100/24`，RM-01 内部节点仍使用 `10.10.99.99`、`10.10.99.98` 和 `10.10.99.97`。
- 用户电脑已经通过 Wi-Fi、以太网或其他接口正常访问互联网。
- Agent Harness 可以在用户电脑上执行命令，并可在需要时请求管理员权限。
- 已保存下载、远程会话及其他依赖网络的工作，并能够在本机恢复网络配置。

### 可直接发送给 Agent 的提示词

下面的提示词保留了 RM-01 的出厂网络拓扑，同时要求 Agent 先检查、再修改，并给出验证与回滚方法。可以直接复制到 Codex、Hermes 或其他具备命令执行能力的 Agent Harness：

```text
你正在帮助我为 RM-01 配置 C1 网络共享。请先检查当前系统、网络接口、地址、默认路由和防火墙状态，确认实际情况与下述拓扑一致后再执行修改；不要仅凭接口名称猜测，也不要改动 RM-01 内部节点的固定地址。

当前拓扑如下：
- 用户电脑通过 USB-C 连接 RM-01 的 C1 接口；该连接在用户电脑上通常显示为 AX88179 或 USB Ethernet，地址为 10.10.99.100/24。
- RM-01 内部网络为 10.10.99.0/24。
- 应用计算机（LPMU）地址为 10.10.99.99。
- 推理计算机（AGX）地址为 10.10.99.98。
- 带外管理计算机地址为 10.10.99.97。
- 用户电脑还通过另一个网络接口连接互联网。

我的目标是：保留用户电脑现有的互联网连接，并把该连接通过 C1 对应的 AX88179 / USB Ethernet 接口共享给 RM-01 内部网络，使 10.10.99.99、10.10.99.98 和 10.10.99.97 能够访问互联网。

请按以下约束操作：
1. 先识别操作系统、实际互联网出口接口和 C1 对应接口，并向我说明准备修改的项目。
2. 使用当前操作系统原生且改动最小的网络共享方式，配置必要的 IP 转发、NAT、路由或 Internet Connection Sharing。
3. 不要改变用户电脑现有互联网接口的优先级和默认路由，不要改动上述 RM-01 节点地址，也不要清空或覆盖无关的防火墙规则。
4. 如需管理员权限，请明确说明用途后再请求；如果当前系统或权限无法安全完成配置，请停止并说明原因。
5. 完成后验证：用户电脑仍可访问互联网；10.10.99.99、10.10.99.98、10.10.99.97 可达；RM-01 内部节点可以访问公网 IP，并能正常解析域名。
6. 最后列出实际执行的命令或修改项、验证结果，以及恢复原配置的回滚步骤。
```

macOS 通常使用“互联网共享”及系统路由机制；Linux 通常使用 IP 转发与 nftables 或 iptables；Windows 专业版通常使用 Internet Connection Sharing（ICS）。具体命令和接口名称应以 Agent 在当前电脑上的检查结果为准。Windows 家庭版当前不受支持。

### 如何判断配置成功

配置完成后，应同时满足以下条件：

1. 用户电脑原有的互联网连接保持可用。
2. 用户电脑可以访问 `10.10.99.99`、`10.10.99.98` 和 `10.10.99.97`。
3. RM-01 内部节点既能访问公网 IP，也能解析并访问域名。
4. Agent 已给出实际修改项和可执行的回滚步骤，而不是只报告“配置成功”。

### 安全提示

> 允许 Agent 以管理员或 root 权限配置网络，会使其能够修改路由、IP 转发、NAT、Internet Connection Sharing 和防火墙规则。只使用可信的 Agent Harness，并在授权前核对其操作计划。若用户电脑正承担远程连接或其他关键网络任务，请先确保可以在本机恢复配置。

## 6. 通过 C3 将 RM-01 接入上层网络

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

## 7. 通过 LPMU 完成整机联网

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

## 5. Configure C1 Internet Sharing with AI

An Agent Harness with local command-execution capability, such as Codex or Hermes, can inspect the network topology from natural-language instructions and help configure forwarding and internet sharing from the user computer to the RM-01 internal network. The AI must be able to execute system commands on the target computer. A chat-only AI can provide instructions but cannot apply the configuration.

### Where to run the AI agent

Run the agent directly on the user computer connected to C1 whenever possible. That computer owns the internet uplink, default route, and sharing rules, so the agent needs administrator access on that computer to perform the configuration.

If Codex, Hermes, or another agent runs inside RM-01, it must already have authorized remote command execution and administrator access to the user computer. Without that access, it cannot change network sharing, routing, or firewall settings on the user computer.

### Confirm before starting

- The user computer is connected to RM-01 through C1 and can see a network interface named `AX88179` or USB Ethernet.
- The C1 address on the user computer is `10.10.99.100/24`, while the RM-01 internal nodes remain at `10.10.99.99`, `10.10.99.98`, and `10.10.99.97`.
- The user computer already has working internet access through Wi-Fi, Ethernet, or another interface.
- The Agent Harness can execute commands on the user computer and request administrator privileges when required.
- Active downloads, remote sessions, and other network-dependent work have been saved, and the network can be recovered locally if needed.

### Prompt to send directly to the agent

The following prompt preserves the factory RM-01 topology, requires inspection before modification, and asks for validation and rollback instructions. Copy it into Codex, Hermes, or another command-capable Agent Harness:

```text
You are helping me configure C1 internet sharing for RM-01. First inspect the current operating system, network interfaces, addresses, default routes, and firewall state. Make changes only after confirming that the actual configuration matches the topology below. Do not infer interface roles from names alone, and do not change the fixed addresses of the RM-01 internal nodes.

Current topology:
- The user computer is connected by USB-C to the C1 port on RM-01. On the user computer, this connection normally appears as AX88179 or USB Ethernet and uses 10.10.99.100/24.
- The RM-01 internal network is 10.10.99.0/24.
- The application computer (LPMU) is 10.10.99.99.
- The inference computer (AGX) is 10.10.99.98.
- The out-of-band management computer is 10.10.99.97.
- The user computer also has internet access through a separate network interface.

My goal is to preserve the user computer's existing internet connection and share it through the AX88179 / USB Ethernet interface associated with C1, allowing 10.10.99.99, 10.10.99.98, and 10.10.99.97 to access the internet.

Follow these constraints:
1. Identify the operating system, the actual internet uplink, and the interface associated with C1, then explain what you plan to change.
2. Use the operating system's native, least-invasive sharing method to configure only the necessary IP forwarding, NAT, routing, or Internet Connection Sharing.
3. Do not change the priority or default route of the user computer's existing internet interface. Do not change the RM-01 node addresses above, and do not flush or overwrite unrelated firewall rules.
4. If administrator privileges are required, explain why before requesting them. If the current system or permissions cannot complete the configuration safely, stop and report the reason.
5. After applying the configuration, verify that the user computer still has internet access; 10.10.99.99, 10.10.99.98, and 10.10.99.97 are reachable; and the RM-01 internal nodes can reach a public IP address and resolve DNS names.
6. Finally, list the commands or settings actually changed, the validation results, and the rollback steps required to restore the original configuration.
```

macOS normally uses Internet Sharing and system routing facilities; Linux typically uses IP forwarding with nftables or iptables; and Windows Pro normally uses Internet Connection Sharing (ICS). Exact commands and interface names must follow the agent's inspection of the current computer. Windows Home is not currently supported.

### How to confirm that it worked

All of the following conditions should be true after configuration:

1. The user computer's original internet connection remains available.
2. The user computer can reach `10.10.99.99`, `10.10.99.98`, and `10.10.99.97`.
3. RM-01 internal nodes can reach both public IP addresses and internet hostnames through DNS.
4. The agent reports the exact changes made and provides executable rollback steps instead of only stating that the configuration succeeded.

### Security notice

> Granting an agent administrator or root access for network configuration allows it to change routes, IP forwarding, NAT, Internet Connection Sharing, and firewall rules. Use only a trusted Agent Harness and review its proposed actions before authorizing them. If the user computer carries a remote session or other critical network workload, make sure the configuration can be recovered locally first.

## 6. Connect RM-01 to an Upstream Network through C3

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

## 7. Bring the Complete System Online through LPMU

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
