# 计算机与USB接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [device.fan.set](#devicefanset) | 通过兼容入口设置风扇 |
| [device.fan.status](#devicefanstatus) | 读取兼容风扇状态 |
| [device.ping](#deviceping) | 从设备诊断网络连通 |
| [device.power](#devicepower) | 控制计算机电源 |
| [device.power.status](#devicepowerstatus) | 读取电源轨状态 |
| [device.reset](#devicereset) | 复位计算机 |
| [device.status](#devicestatus) | 读取一台计算机状态 |
| [device.usb.set](#deviceusbset) | 切换 USB 连接目标 |
| [device.usb.status](#deviceusbstatus) | 读取 USB 连接目标 |

<a id="devicefanset"></a>

## device.fan.set

通过兼容入口设置风扇

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/device/fan/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `fan` | integer | 必填 | 风扇编号。 | 无默认值 |
| `mode` | string | 可选 | off/manual/auto/curve；具体处理见此入口。 | 省略时不修改 |
| `duty` | integer | 可选 | 手动输出0–100%。 | 省略时不修改 |

### 请求示例

```json
{
  "fan": 0,
  "mode": "manual",
  "duty": 50
}
```

### 返回与完成条件

data.fan/success。

### 使用要点

新集成优先使用 fan.mode 与 fan.set 分别操作。

<a id="devicefanstatus"></a>

## device.fan.status

读取兼容风扇状态

**方法**：GET / POST
**路径**：`/api/v1/device/fan/status`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `fan` | integer | 可选 | 风扇编号。 | 全部 |

### 请求示例

```json
{}
```

### 返回与完成条件

data.fans 或单个风扇状态；兼容字段 temp 使用此入口定义，建议新集成统一用 fan.status。

<a id="deviceping"></a>

## device.ping

从设备诊断网络连通

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/device/ping`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | 目标IPv4地址或主机名。 | 无默认值 |
| `timeout` | integer | 可选 | 请求超时，毫秒。 | 1000 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "timeout": 1000
}
```

### 返回与完成条件

data.host/reachable，成功可能有 latency_ms，失败可能有 error。

### 使用要点

reachable=false 是诊断结果，不代表 API 自身未执行。

<a id="devicepower"></a>

## device.power

控制计算机电源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/device/power`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标计算机：agx=推理计算机，lpmu=应用计算机。 | agx |
| `action` | string | 必填 | on/off/toggle/force_off。 | 无默认值 |

### 请求示例

```json
{
  "device": "agx",
  "action": "on"
}
```

### 返回与完成条件

data.device/action/success 表示控制调用结果；继续读取 device.status。

### 使用要点

force_off 可能使未保存数据丢失；优先使用正常关机流程。重复toggle会反转状态。

<a id="devicepowerstatus"></a>

## device.power.status

读取电源轨状态

**方法**：GET / POST
**路径**：`/api/v1/device/power/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.rails 数组含 name/voltage_mv/current_ma/power_mw，另有 total_power_mw；按字段使用mV/mA/mW。

<a id="devicereset"></a>

## device.reset

复位计算机

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/device/reset`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标计算机：agx=推理计算机，lpmu=应用计算机。 | agx |

### 请求示例

```json
{
  "device": "agx"
}
```

### 返回与完成条件

data.device/reset；随后重新查询设备与业务状态。

### 使用要点

会中断目标计算机当前工作。

<a id="devicestatus"></a>

## device.status

读取一台计算机状态

**方法**：GET / POST
**路径**：`/api/v1/device/status`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标计算机：agx=推理计算机，lpmu=应用计算机。 | agx |

### 请求示例

```json
{
  "device": "agx"
}
```

### 返回与完成条件

data.device/state/power_good/uptime_ms/boot_count；state 为 off/standby/on/booting/error。

### 使用要点

电源状态不证明操作系统或应用已经就绪。

<a id="deviceusbset"></a>

## device.usb.set

切换 USB 连接目标

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/device/usb/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `target` | string | 必填 | esp32/agx/lpmu/disconnect。 | 无默认值 |

### 请求示例

```json
{
  "target": "agx"
}
```

### 返回与完成条件

data.target/success。

### 使用要点

切换可能中断原通道上的控制或传输。

<a id="deviceusbstatus"></a>

## device.usb.status

读取 USB 连接目标

**方法**：GET / POST
**路径**：`/api/v1/device/usb/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.target/configured；目标可为 esp32/agx/lpmu/disconnected。
