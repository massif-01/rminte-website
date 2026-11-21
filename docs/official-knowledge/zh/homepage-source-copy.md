---
id: "homepage-source-copy"
language: "zh"
title: "首页完整原文补充"
source_commit: "c9b0897aa87a7e22a0ab264f9007a131f43a1135"
prepared_on: "2026-10-30"
content_kind: "official-source-text"
applicability: "Includes dynamic states and text not simultaneously visible. UI keys identify original source fields. The RM-01 model scale was updated with the website source on 2026-11-21."
source_files: ["website/assets/site-data.js"]
source_urls: ["https://rminte.com/"]
default_retrieval: true
evidence_status: "source transcription; not independent operational verification"
---

## metrics

### value

140W

### label

整机功耗

### value

64

### label

路峰值并发

### value

7x24

### label

工业级运行

### 模型参数规模

27-284B

## pillars

### title

配置驱动硬件

### text

引脚、服务与系统行为，都可以通过 JSON 配置定义。现场调试所需的代码修改因此减少，设备配置也有据可查。

### title

南北向设备控制

### text

北向管理推理算力，南向管理通用计算与存储。TianshanOS 连接两端，协调内部设备，让各个模组各司其职。

### title

安全配置包

### text

模型、密钥与现场参数的交付，需要清楚的安全边界。配置包支持 ECDH、AES-256-GCM 与 ECDSA 签名，为交付提供加密与签名支持。

### title

OTA 与自动化

### text

设备可以通过 HTTPS 或 SD 卡升级，升级异常时自动回滚。WebUI、CLI 与 API 提供管理入口，规则引擎接手重复操作，让日常运维少一些手动处理。

## modules

### name

Agent 与应用模组

### spec

x86 / 8 核 8 线程 / 16GB–32GB ECC / 512GB–2TB NVMe

### text

独立的 x86 计算机，为 Agent 与应用提供专属的运行资源。工具调用、代码执行与数据库访问在应用侧完成，模型推理由推理模组承担。兼容广泛的 x86 软件生态，让已有工具与业务应用更容易接入 Agent 工作流。

### name

推理模组

### spec

64GB VRAM / 128GB VRAM / 275 TOPS INT8 / 1200–2070 TFLOPS FP4

### text

自研推理引擎与高速互联线路提高推理效率。资源集中用于模型推理与 KV Cache，为更大模型、更长上下文与更高并发留出空间。

### name

加密模组

### spec

TPM 2.0 / RSA / ECC

### text

你的后训练模型、RAG 知识库、业务数据与应用代码，都值得保护。独立安全模组隔离私钥，硬件级非对称密钥保护降低私钥导出与复制风险，为业务资产建立设备级安全边界。

### name

网络模组

### spec

内部交换 / 路由 / 统一 API

### text

调用本地 AI，也可以沿用熟悉的云服务接口体验。内部交换、路由与统一 API 连接各个模组，减少系统扩展与维护所需的改动。

### name

电源与热管理

### spec

USB-C PD 3.1 / 最高 140W / Z 型独立风道

### text

统一供电、启动时序与 Z 型独立风道共同支撑整机运行，降低频繁启停、高负载和积尘的影响。减少停机与现场维护，让工作少受打扰。

## engine

### title

沿用生态，减少适配

### text

定制 vLLM 沿用 Hugging Face 模型生态，自研内核优化推理计算；C++ 专用引擎面向模型架构与硬件平台，组织权重加载、算子和运行时。两条路线支持 RMQ 模型，并通过兼容 OpenAI 等接口的服务连接应用，减少接入与适配工作。

### title

容纳更长的上下文，处理更多并发

### text

分页缓存与递归状态管理承接上下文，前缀缓存复用已有计算。专用引擎通过内存与 SSD 分层存储扩展上下文容量，结合批量输入处理与连续批处理，减少权重重复读取，让文档分析、多轮交互和并发请求共用推理资源。

### title

从推理需求出发，设计整机

### text

主板与推理引擎协同设计，围绕 GPU、内存带宽和缓存安排计算与数据访问。投影合并、算子融合与专家归组减少搬运开销；MTP 与批量解码分别服务于单请求生成和并发任务，将硬件资源转化为模型执行效率。

## ui

### chapter0

为模型推理及AI应用原生设计

### chapter1

推理引擎

### chapter2

整机协同

### chapter3

硬件架构

### chapter4

深入内部

### chapter5

持续运行

### chapter6

材料与光

### chapter7

触感与表面

### chapter8

连接与访问

### chapter9

方案交付

### chapter10

制造精度

### langToggle

EN

### mobileMenu

菜单

### closeMenu

关闭

### heroTitle

RM-01
让 AI 在本地，
为你工作

### heroLead

RM-01 为模型推理与 Agent 应用运行提供各自独立的计算空间，让智能在你的业务现场持续行动、交付结果。

### explore

继续探索

### scroll

继续向下

### productTitle

TianshanOS 让整机协同有序

### systemDemoTitle

TianshanOS 界面演示

### productLead

一台设备的运行，离不开内部各个部分的配合。TianshanOS 管理 RM-01 的内部设备与系统行为，让推理、应用与存储共同工作。无需专门建设供电、网络与机房环境，RM-01 就能走进业务现场。

### systemDemoAction

查看界面演示

### agentTitle

连接电源
接入世界

### agentLead

一个接口连接电源，一个接口连接网络。智能眼镜、电脑、路由器、手机与平板，都是访问本地 AI 的入口。你熟悉的设备，由此连接身边的算力。

### agentPointOne

Ubuntu 系统

### agentPointTwo

Agent 执行

### agentPointThree

多终端访问

### hardwareTitle

各司其职，整机交付

### hardwareLead

应用有自己的运行空间，推理有专属的计算资源。RM-01 将模型、应用与运行环境整合进一台设备，让各个模组的协作，服务于你的业务。

### filmTitle

机身展开，协作可见

### filmLead

紧凑机身之内，推理、应用、互联与散热各有其位。随着结构展开，模组之间的连接逐一显现，一套本地 AI 系统的构成也随之清晰。

### engineTitle

让算力，承载更多任务

### engineLead

自研推理引擎提高算力与显存利用率，减少资源消耗。更大模型、更长上下文与更多并发任务，由此获得运行空间。

### egTag

示意图

### egL0P3T

模型与接口

### egL0P3S

Hugging Face · OpenAI 兼容

### egL0P2T

RMinte 推理层

### egL0P2S

定制 vLLM · C++ 引擎

### egL0P1T

NVIDIA CUDA

### egL0P1S

计算平台

### egL1P3T

并发请求

### egL1P3S

连续批处理

### egL1P2T

分页 KV 缓存

### egL1P2S

前缀复用 · 递归状态

### egL1P1T

显存 / 内存

### egL1P1S

上下文容量

### egL1P0T

SSD

### egL1P0S

分层扩展上下文

### egL2P3T

模型

### egL2P3S

投影合并 · 算子融合

### egL2P2T

融合算子

### egL2P2S

减少数据搬运

### egL2P1T

GPU 算力

### egL2P1S

带宽与缓存

### egAria0

推理软件与 CUDA 的分层示意：同一套接口，两条推理路线

### egAria1

分页 KV 缓存与 SSD 分层存储示意：多路并发共享缓存

### egAria2

算子融合示意：三次读写合并为一次

### thermalTitle

EricLake
封闭式热管理系统

### thermalLead

EricLake 以特制叶片、定制电机与 Z 型独立风道共同导出热量，支撑高并发任务。风道经多轮计算流体力学仿真优化，封闭式结构有效减少灰尘进入核心器件区域，照顾高负载下的运行，也照顾日复一日的使用。

### thermalPointBlade

0.13mm

### thermalPointDuct

Z 型风道

### thermalPointCfd

CFD 优化

### sapphireTitle

蓝宝石亮起，
智能开始工作

### sapphireLead

光掠过切面，蓝宝石的轮廓从深色机身上浮现。外覆合工艺让蓝宝石贴合机身表面，保留多重锐角切面。高硬度让成型与镜面抛光更为艰难，良品率也随之降低。56 小时的雕琢与抛光，凝结在这一刻的光泽里。

### sapphireFactOne

56 小时雕琢

### sapphireFactTwo

外覆合工艺

### sapphireLabel

蓝宝石 × 铝合金

### cartridgeTitle

换一张卡，
切换一套 AI

### cartridgeLead

模型与应用存放在可更换的存储卡中。插入 RM-01，一套对应业务的本地 AI 方案随之装载。同一台设备，换一张卡，就能接手另一项工作。

### cartridgeFactOne

插卡即用

### cartridgeFactTwo

模型应用

### glassTouchMaterial

绒光肤感玻璃

### glassTouchTitle

绒光玻璃，温润触感

### glassTouchLead

整面绒光肤感玻璃柔化光线，呈现温润触感。目光与指尖，都能感知 RM-01 的表面质感。

### craftScrollHint

向下滚动，查看更多工艺

### craftTitle

材料、表面与装配
每一处都有标准

### thermalDetailCaption

超高速射出成型叶片承担持续散热

### ttiChapter

智能热控

### ttiTitle

热将起，
风先知

### ttiText1

推理持续，散热也持续。TTI 通过 TTO 实时观测热状态，由神经网络模型预测未来 90 秒的功率变化，推演 15、45、90 秒后的温度。它不只看此刻的温度，也记得热是怎样积蓄起来的。热未起，风量已就位；热渐稳，转速自然回落。起伏更少，不同的环境与负载，都能从容应对。

### ttiText2

该模型基于真实设备运行数据训练。突发任务无法预知，基础曲线、配置上限与独立保护策略始终托底。

### ttiNow

现在

### ttiLead

提前

### ttiTemp

温度

### ttiAirflow

风量

### ttiNetwork

神经网络

### ttiObserve

观测

### ttiPredict

预测

### ttiRegulate

调节

### ttiCool

散热

### craftStoryMaterial

铝合金机身

### craftStoryMaterialText

6063 铝合金构成机身，握持时的扎实感，来自材料本身。

### craftStoryFinish

精细喷砂

### craftStoryFinishText

喷砂赋予金属细腻的表面。目光看见的纹理，指尖也能感知。

### craftStoryRadius

玻璃圆角

### craftStoryRadiusText

玻璃边缘采用 R0.2 mm 圆角，与铝合金机身精密贴合。两种材料在这里相接，也在这里体现装配的功夫。

### craftStoryTolerance

工艺公差

### craftStoryToleranceText

工艺公差小于 0.03 mm。精度落实在接缝与收口，让每一处衔接都经得起细看。

### craftLead

从 6063 铝合金到 260 目精细喷砂，RM-01 对材料、表面处理与装配精度逐项把控。最终落到用户手上的，是细腻的触感、严密的接缝，以及从第一次上手就能感受到的整机品质。

### craftMaterial

高品质铝合金机身

### craftMeshUnit

目

### craftFinish

精细喷砂表面工艺

### craftCaptionSurface

均匀细腻的喷砂表面，让光线在金属上呈现克制的层次。

### craftCaptionFit

严密的接缝与干净的收口，让设计精度落到真实装配。

### craftCaptionEdge

从结构边缘到散热开槽，保持一致的加工与表面标准。

### craftCaptionSlot

卡槽开口、结构边缘与机身表面，保持一致的加工精度。

### footer

泛灵（成都）人工智能科技有限公司

### copyright

© 2026 RMinte ( Chengdu ) Artificial Intelligence Technology Co., Ltd. · RM-01 Portable AI Supercomputer

### contactButton

联系我们

### contactKicker

CONTACT

### contactTitle

联系我们

### salesContact

销售与渠道合作

### manufacturingContact

制造与供应链合作

### supportContact

售前与售后服务

### communityContact

产品与技术交流

### sampleLoan

样机借用

### sampleApply

点此申请

### sampleLoadError

申请表暂时无法加载，请重试或刷新页面

### sampleReload

刷新页面
