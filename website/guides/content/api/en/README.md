# TianshanOS API User Guide

Connect your own scripts and systems to monitor the device, control its computers, receive live status, run remote tasks, and maintain configuration and updates. This guide assumes familiarity with HTTP, JSON, and basic server operations; circuit and firmware knowledge is not required.

This guide is based on **TianshanOS 0.6.4**.

## Find your task

| Task | Start here |
| --- | --- |
| Make your first API call | [Quick start](quickstart.md) |
| Identify the controller and the two computers | [Devices and names](devices.md) |
| Monitor temperatures, fans, power, and computers | [Monitoring](scenarios.md#monitor-the-device) |
| Switch power or the USB connection | [Device control](scenarios.md#control-a-computer) |
| Start and verify a remote service | [Remote tasks](scenarios.md#manage-remote-tasks) |
| Configure variables, sources, actions, and rules | [Automation](scenarios.md#configure-automation) and [Configuration models](configuration-models.md) |
| Transfer files or update firmware | [Maintenance](scenarios.md#maintain-the-device) and [Transfers](transfers.md) |
| Receive live status and results | [WebSocket](websocket.md) |
| Look up an API | [Complete reference](reference/README.md) |
| Investigate errors or maintain a long-running integration | [Troubleshooting](troubleshooting.md) and [Operations](operations.md) |

## Reading order

Complete a read-only request in the quick start first. Then follow the scenario for your task, including its result checks and recovery steps. Open the reference when you need individual parameters.

The documented default accounts admin/root and initial password rm01 are product defaults. Other addresses, filenames, tokens, and response values are illustrative. Use the actual address and current password of a device you manage. Examples contain no private tokens, changed passwords, or real application records.

The reference covers 277 registered names in 28 functional groups, including config.pack.apply, which is retained but does not apply generic configuration. Dedicated file/image routes and WebSocket messages have separate chapters. A registered name does not guarantee that the required hardware, storage, credentials, or remote service is ready.
