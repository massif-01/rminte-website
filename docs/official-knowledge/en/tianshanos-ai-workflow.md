---
id: "tianshanos-ai-workflow"
language: "en"
title: "Three Roles. One RM-01. How TianshanOS Brings an AI Device Together"
source_commit: "not-applicable-owner-original"
prepared_on: "2026-10-30"
content_kind: "official-product-copy"
applicability: "Owner-provided architecture and workflow introduction (2026-10-30). Examples require application deployment and configuration; use versioned operating guides for procedures and permissions."
source_files: ["docs/official-knowledge/en/tianshanos-ai-workflow.md"]
source_urls: ["https://github.com/RMinte/rminte-website/blob/main/docs/official-knowledge/en/tianshanos-ai-workflow.md"]
default_retrieval: true
evidence_status: "Owner-provided Chinese/English originals; editorial product description, not independent operational verification. Original supplied outside Git; source_commit is not applicable."
---

# Three Roles. One RM-01. How TianshanOS Brings an AI Device Together

Place RM-01 on your desk and connect the power. Inside this portable AI device, three systems begin their work.

AGX runs the models. LPMU runs agents, tools, and applications. An ESP32 running TianshanOS manages the device and its hardware.

An internal network connects all three. Each has a distinct role, and together they bring model inference, application execution, and device control into one machine.

To understand RM-01, it helps to follow a task through it.

**From a request to a finished task**

Imagine building a research assistant on RM-01—one that searches local documents, examines the material, and prepares a report.

With the model service and application deployed, the workflow might look like this: an application on LPMU receives your request, retrieves the documents, and sends the relevant content to a model on AGX. The model returns a response. The application then uses that response to call a tool, gather more information, or create a file.

This exchange is central to many agent workflows. A model interprets the task and proposes a next step. The application executes the tool, collects the result, and returns it to the model.

RM-01 gives these workloads their own computing resources.

AGX provides the AI compute for model inference. LPMU is an independent x86 computer with room for agent software, code execution, database access, and application services. Its x86 architecture also makes it easier to work with existing software and tools.

The two computers exchange requests and results over the internal network. Each has its own storage and operating environment, allowing you to deploy, maintain, and adapt them to your needs.

That division of work creates a path from running a model to completing a useful task.

**A common place to manage the whole device**

Two computers working together introduce a few practical questions. Has the model service started? Can the application reach it? How warm is the device? Where do you go to check a service or change a setting?

TianshanOS provides a common management interface.

Running on the ESP32, it connects to AGX and LPMU over the internal network and interfaces with hardware such as power controls, fans, and lighting. A browser gives you access to device status. Once hosts, commands, and data sources are configured, that same interface can help you check services, run commands, and keep frequent actions on the home page.

For example, a root user can create separate action cards for the model service on AGX and the application service on LPMU. The person using the device sees a clear action such as “Start model service” or “Check application status.” The host, command, and parameters are prepared behind it.

Model and application traffic flows between the two computers over the internal network. TianshanOS provides the management layer: a place to bring status information and controls together, making the AI environment easier to understand and operate.

**Connecting AI activity to the device around it**

An AI application has states worth knowing about. A service becomes ready. A task finishes. A temperature reading stops updating.

TianshanOS can obtain this information through interfaces or remote commands, evaluate configured conditions, and trigger actions.

With a suitable application interface and rules in place, the matrix display could show task progress. Lighting could indicate that a service is ready. A state change could create a log entry or trigger a saved command.

The hardware then becomes another way to follow the work happening inside RM-01. A glance at the device can tell you something about the AI task it is running.

There are two complementary forms of coordination here. An agent calls tools to carry out a task. TianshanOS manages device behavior through configured controls and rules. Interfaces allow the two to work together while keeping their responsibilities clear.

**Looking after the hardware behind the task**

Inference and application workloads depend on the physical device. Sustained computation generates heat. Changes in power affect operation. Cooling decisions depend on valid temperature readings.

This is where the ESP32’s independent management role matters.

TianshanOS can display power readings, control the relevant compute modules, and apply configured low-voltage protection. For cooling, it provides temperature and fan status, configurable fan curves, and an intelligent thermal control mode that considers temperature trends. If a temperature source becomes invalid, the system uses its protective fan setting.

While the compute systems handle their workloads, a separate controller looks after device management and hardware control.

Access to that controller depends on its power and network connection. Service checks and commands sent over SSH also depend on the target computer responding. Clear status information helps the user distinguish these conditions and choose the next step.

**Room for your own AI workflow**

The models you use may change. So may your agents, tools, and applications. RM-01’s management environment needs room to grow with them.

TianshanOS supports data sources including REST APIs, WebSocket, Socket.IO, and remote command results. Available actions include local console commands, SSH commands, lighting and display controls, logging, and webhook requests.

Many integrations can begin with configuration.

You can connect a new application’s status interface, prepare its action cards, and add rules as the workflow develops. When a model service changes or an application evolves, the management configuration can follow.

AGX provides model compute. LPMU provides an environment for applications and tools. TianshanOS connects device information with controls and actions. Together, they give RM-01 room to take on new uses.

**Clear boundaries for a connected system**

Connections between systems need clear rules: who may act, which host is being contacted, and where a configuration came from.

TianshanOS separates admin and root privileges, reserving advanced functions such as the terminal, remote commands, and automation for root users. SSH supports key authentication and uses host fingerprints to verify connection targets such as AGX and LPMU. A changed fingerprint requires review before trust is updated.

For supported configuration packages, the system provides signature verification, signer authorization checks, and encryption for the intended device. These mechanisms help establish both the integrity of a package and whether its source is authorized.

Security takes shape across these boundaries. Account settings, keys, certificates, and the relevant security options need to be configured as part of deployment so that access and control match the intended use.

**Models, applications, and hardware working together**

You can begin with a model on RM-01, then add tools, documents, and applications to build an AI workflow of your own.

AGX handles inference. LPMU hosts agents and applications. TianshanOS on the ESP32 manages the device and connects status information, commands, and hardware actions.

On your desk, they form a single portable device. Inside, each has a role to play. The network connects them, permissions define their boundaries, and TianshanOS gives you a way to observe, operate, and extend the system.

A model produces a response. An application turns it into work. The device gives that work a physical home—and TianshanOS helps bring the whole experience together.
