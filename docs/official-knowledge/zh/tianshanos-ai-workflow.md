---
id: "tianshanos-ai-workflow"
language: "zh"
title: "三种分工，一台 RM-01：认识 TianshanOS 与它连接的 AI 世界"
source_commit: "not-applicable-owner-original"
prepared_on: "2026-10-30"
content_kind: "official-product-copy"
applicability: "Owner-provided architecture and workflow introduction (2026-10-30). Examples require application deployment and configuration; use versioned operating guides for procedures and permissions."
source_files: ["docs/official-knowledge/zh/tianshanos-ai-workflow.md"]
source_urls: ["https://github.com/RMinte/rminte-website/blob/main/docs/official-knowledge/zh/tianshanos-ai-workflow.md"]
default_retrieval: true
evidence_status: "Owner-provided Chinese/English originals; editorial product description, not independent operational verification. Original supplied outside Git; source_commit is not applicable."
---

# 三种分工，一台 RM-01：认识 TianshanOS 与它连接的 AI 世界

把 RM-01 放在桌面，接通电源，你面前是一台便携 AI 设备。

它的内部，有两台承担不同任务的计算机：AGX 运行模型，LPMU 运行 Agent、工具和业务应用。还有一颗运行 TianshanOS 的 ESP32，负责设备管理与控制。

三者通过内部网络连接，又各有自己的职责。理解这套分工，也就理解了 RM-01 如何把模型能力、应用能力和硬件控制装进同一台设备。

**从一次 AI 任务开始**

假设你想在 RM-01 上搭建一个资料助手，让它查找本地文档、分析内容，再整理成一份报告。

部署好模型服务和应用之后，任务可以这样进行：运行在 LPMU 上的应用接收你的要求，读取资料，将需要分析的内容交给 AGX 上的模型。模型返回结果，应用再根据结果调用工具、补充信息，或者生成文件。

这也是 Agent 工作中的一种常见配合：模型理解任务、提出下一步，应用执行工具、取得结果，再交给模型继续处理。

在 RM-01 中，这两类工作有各自的计算资源。

AGX 为模型推理提供 AI 算力。LPMU 是独立的 x86 计算机，可以承载 Agent 程序、代码执行、数据库访问和业务服务，也便于接入已有的 x86 软件与工具。

模型和应用通过内部网络交换请求与结果。两台计算机各有存储和运行环境，你可以围绕自己的用途部署它们，也可以分别维护和调整。

这样的分工，让“运行一个模型”有机会继续走向“完成一项工作”。

**TianshanOS 让这套组合更容易掌握**

两台计算机共同工作，也带来了新的使用需求：模型服务是否启动？应用能否连接？设备温度如何？需要调整某个服务时，从哪里操作？

TianshanOS 为这些事情提供了一个共同入口。

它运行在 ESP32 上，通过内部网络连接 AGX 和 LPMU，并与整机的电源、风扇、灯光等硬件相连。打开浏览器，你可以查看设备状态；完成主机、指令和数据源配置后，还可以检查服务、执行命令，把常用操作放到首页。

例如，可以将 AGX 上的模型服务和 LPMU 上的应用服务分别保存为操作卡片。使用时，你看到的是“启动模型服务”“检查应用状态”这样的任务名称，背后的主机选择、命令和参数由配置者准备。

模型与应用之间的请求仍由它们通过内部网络交换。TianshanOS 承担的是管理、状态连接和操作组织，让你更容易掌握这两台计算机组成的 AI 环境。

**让 AI 服务的状态，连接到设备的行为**

TianshanOS 与 AI 应用的结合，还可以再往前一步。

应用中有很多值得关注的状态：服务是否就绪、任务是否完成、温度数据是否更新。TianshanOS 可以通过接口或远程指令读取这些信息，将它们用于规则判断，再执行对应动作。

比如，在应用提供状态接口、完成规则配置之后，可以让点阵屏显示任务进度，用灯光表示服务是否就绪，或者在某个条件满足时记录日志、调用已保存的指令。

这时，RM-01 的外观与内部运行有了联系。桌面上的灯光和显示内容，可以成为你了解 AI 任务的另一种方式。

这里有两层配合：Agent 根据任务调用工具，TianshanOS 根据配置管理设备和执行规则。两者可以通过接口连接，各自承担适合的工作。

**AI 任务背后，还有电源与散热**

模型推理和应用运行，最终都落在硬件上。持续计算产生热量，供电变化影响运行，温度来源是否可靠也会影响散热判断。

ESP32 的独立管理角色，在这里体现出价值。

TianshanOS 可以查看供电读数、控制相关模组电源，并按配置执行低电压保护。散热方面，你可以查看温度与风扇状态，设置温度曲线，也可以使用参考温度趋势的智能热控。温度来源失效时，系统采用相应的保护调速。

这些能力围绕着同一个目标：让计算部分运行任务时，整机仍有独立的管理与控制。

这个管理入口能否使用，取决于 ESP32 的供电和网络状态；通过 SSH 检查或操作服务，则需要目标计算机能够响应。各部分的状态有明确含义，才能帮助用户判断下一步。

**从现有功能，扩展到自己的 AI 工作方式**

RM-01 可以承载不同模型，也可以搭配不同 Agent 和应用。TianshanOS 的扩展方式，围绕这些变化展开。

它支持 REST API、WebSocket、Socket.IO 和远程指令结果等数据来源；动作可以连接本地控制台命令、SSH 指令、灯光显示、日志和 Webhook 请求。

对使用者来说，这意味着许多连接可以从配置开始。

你可以接入新应用的状态接口，为它准备操作卡片，再按需要增加自动化规则。模型服务换了，应用流程调整了，对应的管理配置也可以随之改变。

AGX 提供模型运行能力，LPMU 提供应用与工具的运行空间，TianshanOS 则提供连接设备状态与操作的方式。三者组合，给 RM-01 留下了持续扩展用途的空间。

**协作建立在清楚的权限与信任之上**

内部各部分能够互相连接，也需要明确谁可以操作、连接的是谁、配置来自哪里。

TianshanOS 区分 admin 与 root 权限，将终端、远程指令和自动化等高级入口交给 root 管理。SSH 支持密钥认证，并通过主机指纹核对 AGX、LPMU 等连接对象；指纹发生变化时，需要确认后再建立信任。

对于支持的配置包，系统提供签名验证、签名者授权检查及面向目标设备的加密能力。接收配置时，设备既检查内容，也检查来源和授权。

这些机制为整机协作建立安全边界。部署时完成账号、密钥、证书和相关安全选项的配置，才能让连接能力与控制权限相互配合。

**让模型、应用与设备一起工作**

使用 RM-01，你可以从一个模型开始，再加入工具、资料和业务应用，构建自己的 AI 工作流程。

AGX 承担模型推理，LPMU 承载 Agent 与应用，ESP32 上的 TianshanOS 管理设备，并将状态、指令和硬件动作连接起来。

你面对的是一台桌面设备，内部却为 AI 工作安排了不同角色。它们通过网络合作，通过权限建立边界，也通过 TianshanOS 的界面与配置，变得更容易观察、操作和扩展。

从模型给出回答，到应用完成任务，再到设备呈现运行状态——这几部分的结合，构成了 RM-01 的 AI 使用体验。
