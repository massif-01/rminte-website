---
id: "homepage-source-copy"
language: "en"
title: "Complete homepage source copy"
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

total power

### value

64

### label

peak sessions

### value

7x24

### label

industrial runtime

### model scale

27-284B

## pillars

### title

Configuration-driven hardware

### text

JSON configuration defines pins, services, and system behavior. That means fewer code changes during on-site setup and a clear record of how the device is configured.

### title

North-south device control

### text

Northbound control manages inference compute; southbound control manages general-purpose compute and storage. TianshanOS links both sides and coordinates the internal devices, with each module serving its role.

### title

Secure config packs

### text

Delivering models, keys, and site parameters calls for a clear security boundary. Config packs support ECDH, AES-256-GCM, and ECDSA signatures, providing encryption and signatures for delivery.

### title

OTA and automation

### text

Update your device through HTTPS or an SD card, with automatic rollback if an update fails. Manage it through WebUI, CLI, or API. The rule engine handles repeat operations, reducing manual work in day-to-day maintenance.

## modules

### name

Agent and application module

### spec

x86 / 8 cores, 8 threads / 16GB–32GB ECC / 512GB–2TB NVMe

### text

A separate x86 computer provides dedicated resources for agents and applications. It handles tool calls, code execution, and database access, while the inference module runs the models. Broad compatibility with the x86 software ecosystem makes it easier to bring existing tools and business applications into agent workflows.

### name

Inference module

### spec

64GB VRAM / 128GB VRAM / 275 TOPS INT8 / 1200–2070 TFLOPS FP4

### text

Our inference engine and high-speed interconnect improve inference efficiency. Resources focus on model inference and KV Cache, making room for larger models, longer contexts, and higher concurrency.

### name

Encryption module

### spec

TPM 2.0 / RSA / ECC

### text

Your post-trained models, RAG knowledge bases, business data, and application code deserve protection. A dedicated security module isolates private keys. Hardware-backed asymmetric key protection reduces the risk of key export and duplication, creating a device-level security boundary for your business assets.

### name

Network module

### spec

Internal switching / routing / unified API

### text

Access local AI through a familiar cloud-service interface. Internal switching, routing, and unified APIs connect the modules, reducing the changes needed for system expansion and maintenance.

### name

Power and thermal management

### spec

USB-C PD 3.1 / up to 140W / independent Z-shaped air duct

### text

Unified power delivery, startup sequencing, and a dedicated Z-shaped air duct support system operation, reducing the impact of frequent restarts, high loads, and dust buildup. Less downtime and on-site maintenance mean fewer interruptions to your work.

## engine

### title

Familiar ecosystem, less integration work

### text

Custom vLLM retains the Hugging Face model ecosystem and uses our kernels for inference. The dedicated C++ engine tailors weight loading, kernels, and the runtime to model architectures and hardware. Both paths support RMQ models and connect applications through services with interfaces such as the OpenAI-compatible API, reducing integration work.

### title

Longer contexts. More concurrent tasks.

### text

Paged caching and recurrent-state management retain context, while prefix caching reuses prior computation. The dedicated engine extends context capacity through memory and SSD storage tiers. Batched input processing and continuous batching reduce repeated weight reads, sharing inference resources across document analysis, multi-turn interaction, and concurrent requests.

### title

A system shaped by inference

### text

The motherboard and inference engine are designed together, organizing computation and data access around GPU compute, memory bandwidth, and caches. Merged projections, kernel fusion, and expert grouping reduce data movement. MTP serves single-request generation and batched decoding serves concurrent tasks, turning hardware resources into model execution efficiency.

## ui

### chapter0

PURPOSE-BUILT FOR MODEL INFERENCE AND AI APPLICATIONS

### chapter1

INFERENCE ENGINE

### chapter2

SYSTEM ORCHESTRATION

### chapter3

HARDWARE ARCHITECTURE

### chapter4

INSIDE RM-01

### chapter5

CONTINUOUS OPERATION

### chapter6

MATERIAL & LIGHT

### chapter7

TOUCH & SURFACE

### chapter8

CONNECTION

### chapter9

AI DELIVERY

### chapter10

PRECISION

### langToggle

中文

### mobileMenu

Menu

### closeMenu

Close

### heroTitle

RM-01
AI working for you, locally

### heroLead

RM-01 gives model inference and AI agent applications their own dedicated computing resources, so agents can keep working and delivering results on site.

### explore

Keep exploring

### scroll

Continue

### productTitle

TianshanOS Bringing the system together

### systemDemoTitle

TianshanOS interface demo

### productLead

A system depends on its parts working in concert. TianshanOS manages the devices and system behavior inside RM-01, coordinating inference, applications, and storage. Bring RM-01 to your business site without building dedicated power, network, or server-room infrastructure.

### systemDemoAction

View interface demo

### agentTitle

Connect to power.
Connect to the world.

### agentLead

One port for power. One for the network. Smart glasses, computers, routers, phones, and tablets give you access to local AI. The devices you know bring local AI within reach.

### agentPointOne

Ubuntu system

### agentPointTwo

Agent execution

### agentPointThree

Multi-device access

### hardwareTitle

Dedicated roles. One complete system.

### hardwareLead

Applications have their own space to run. Inference has dedicated compute. RM-01 brings models, applications, and their runtime into one device, with every module working to serve your business.

### filmTitle

See the system unfold

### filmLead

Inference, applications, connectivity, and cooling each have a place inside the compact chassis. As the structure unfolds, the connections between modules come into view, revealing how a complete local AI system takes shape.

### engineTitle

Compute that takes on more tasks

### engineLead

Our inference engine improves compute and GPU memory utilization while reducing resource use. That creates room for larger models, longer contexts, and more concurrent tasks.

### egTag

Illustrative

### egL0P3T

Models and API

### egL0P3S

Hugging Face · OpenAI-compatible

### egL0P2T

RMinte inference layer

### egL0P2S

Custom vLLM · C++ engine

### egL0P1T

NVIDIA CUDA

### egL0P1S

Compute platform

### egL1P3T

Concurrent requests

### egL1P3S

Continuous batching

### egL1P2T

Paged KV Cache

### egL1P2S

Prefix reuse · Recurrent state

### egL1P1T

VRAM / Memory

### egL1P1S

Context capacity

### egL1P0T

SSD

### egL1P0S

Tiered context extension

### egL2P3T

Model

### egL2P3S

Merged projections · Kernel fusion

### egL2P2T

Fused kernel

### egL2P2S

Less data movement

### egL2P1T

GPU compute

### egL2P1S

Bandwidth and cache

### egAria0

Layered view of inference software and CUDA: one interface, two inference paths

### egAria1

Paged KV cache and tiered SSD storage: concurrent requests share the cache

### egAria2

Kernel fusion: three reads and writes merged into one

### thermalTitle

EricLake
closed thermal system

### thermalLead

EricLake carries the heat out with purpose-made blades, a custom motor and a dedicated Z-shaped air duct, supporting high-concurrency workloads. The duct is refined through multiple rounds of computational fluid dynamics simulation, and the closed structure keeps dust out of the core component area, caring for demanding loads and for everyday use alike.

### thermalPointBlade

0.13mm

### thermalPointDuct

Z-shaped duct

### thermalPointCfd

CFD optimized

### sapphireTitle

When sapphire lights up,
intelligence gets to work

### sapphireLead

Light catches the facets, revealing the sapphire against the dark chassis. An exterior bonding process joins the gemstone to the surface while preserving its sharp facets. Its hardness makes shaping and mirror polishing a challenge and reduces production yields. Fifty-six hours of carving and polishing find their expression in this moment of light.

### sapphireFactOne

56 hours of finishing

### sapphireFactTwo

Exterior bonding process

### sapphireLabel

Sapphire × aluminum

### cartridgeTitle

Change the card,
change the AI

### cartridgeLead

Models and applications live on replaceable storage cards. Insert one into RM-01 to load a local AI solution for your business. A different card gives the same device a new job.

### cartridgeFactOne

Plug in and use

### cartridgeFactTwo

Models + applications

### glassTouchMaterial

VELVET-TOUCH GLASS

### glassTouchTitle

Velvet-touch glass. A warmth you can feel.

### glassTouchLead

A full face of velvet-touch glass softens the light and feels warm to the touch. The surface of RM-01 invites both a closer look and a touch.

### craftScrollHint

Scroll down to explore more craftsmanship

### craftTitle

Materials, finish, and fit.
A standard for every detail.

### thermalDetailCaption

Blades made with ultra-high-speed injection molding sustain cooling.

### ttiChapter

Smart thermal control

### ttiTitle

Ahead of
the heat

### ttiText1

Inference keeps running, and so does cooling. Through TTO, TTI observes the thermal state in real time. A neural network model predicts power for the next 90 seconds, then projects the temperature at 15, 45 and 90 seconds. It looks beyond the temperature right now, and remembers how the heat built up. Before heat rises, airflow is already in place; as it settles, fan speed eases back on its own. Fewer swings, and it handles different environments and workloads with ease.

### ttiText2

The model is trained on real device operating data. Sudden workloads can't be foreseen, so the base curve, configured limits and an independent protection policy always stand behind it.

### ttiNow

Now

### ttiLead

Lead

### ttiTemp

Temp

### ttiAirflow

Airflow

### ttiNetwork

Neural network

### ttiObserve

Observe

### ttiPredict

Predict

### ttiRegulate

Regulate

### ttiCool

Cool

### craftStoryMaterial

Aluminium chassis

### craftStoryMaterialText

The chassis is made from 6063 aluminium alloy. Its solid feel in your hand begins with the material itself.

### craftStoryFinish

Fine sandblasted finish

### craftStoryFinishText

Sandblasting gives the metal a fine texture you can see and feel.

### craftStoryRadius

Rounded glass edges

### craftStoryRadiusText

Glass edges with an R0.2 mm radius form a precision fit with the aluminium chassis. Where the two materials meet, the care in assembly comes into view.

### craftStoryTolerance

Manufacturing tolerance

### craftStoryToleranceText

Manufacturing tolerances stay below 0.03 mm. That precision shapes the seams and edges, rewarding a closer look at every joint.

### craftLead

From 6063 aluminium alloy to a fine 260-mesh sandblasted finish, RM-01 controls material selection, surface treatment, and assembly precision. The result reflects both product quality and our ability to integrate the supply chain for consistent manufacturing.

### craftMaterial

High-quality aluminium chassis

### craftMeshUnit

mesh

### craftFinish

Fine sandblasted finish

### craftCaptionSurface

A fine, even finish gives light a restrained depth across the metal surface.

### craftCaptionFit

Tight seams and clean edges carry design precision into real assembly.

### craftCaptionEdge

Structural edges and cooling slots share one consistent manufacturing standard.

### craftCaptionSlot

The card opening, structural edges, and chassis surface share the same machining precision.

### footer

RMinte AI

### copyright

© 2026 RMinte ( Chengdu ) Artificial Intelligence Technology Co., Ltd. · RM-01 Portable AI Supercomputer

### contactButton

Contact

### contactKicker

CONTACT

### contactTitle

Contact us

### salesContact

Sales & channel partnerships

### manufacturingContact

Manufacturing & supply chain partnerships

### supportContact

Pre-sales & after-sales service

### communityContact

Product & technical discussions

### sampleLoan

Demo unit loan

### sampleApply

Apply here

### sampleLoadError

The application could not load. Try again or refresh the page.

### sampleReload

Refresh page
