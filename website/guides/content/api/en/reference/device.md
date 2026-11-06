# Computers and USB APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [device.fan.set](#devicefanset) | Set fan mode and duty |
| [device.fan.status](#devicefanstatus) | Get fan status |
| [device.ping](#deviceping) | Test network connectivity (TCP port check) |
| [device.power](#devicepower) | Control device power (on/off/force_off) |
| [device.power.status](#devicepowerstatus) | Get power measurements |
| [device.reset](#devicereset) | Reset device |
| [device.status](#devicestatus) | Get device power status |
| [device.usb.set](#deviceusbset) | Set USB MUX target |
| [device.usb.status](#deviceusbstatus) | Get USB MUX status |

<a id="devicefanset"></a>

## device.fan.set

Set fan mode and duty

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/device/fan/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `fan` | integer | Required | Fan ID. | No default |
| `mode` | string | Optional | off/manual/auto/curve; this compatibility entry has its own handling. | Unchanged |
| `duty` | integer | Optional | Manual duty, 0-100 percent. | Unchanged |

### Request example

```json
{
  "fan": 0,
  "mode": "manual",
  "duty": 50
}
```

### Response and completion

data.fan/success.

### Usage notes

Prefer separate fan.mode and fan.set calls for new integrations.

<a id="devicefanstatus"></a>

## device.fan.status

Get fan status

**Methods**: GET / POST
**Path**: `/api/v1/device/fan/status`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `fan` | integer | Optional | Fan ID. | All |

### Request example

```json
{}
```

### Response and completion

data.fans or one fan; compatibility temp follows this entry's model. Prefer fan.status for new integrations.

<a id="deviceping"></a>

## device.ping

Test network connectivity (TCP port check)

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/device/ping`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | Target IPv4 address or hostname. | No default |
| `timeout` | integer | Optional | Request timeout in milliseconds. | 1000 |

### Request example

```json
{
  "host": "192.0.2.20",
  "timeout": 1000
}
```

### Response and completion

data.host/reachable; success may include latency_ms, failure error.

### Usage notes

reachable=false is a diagnostic result, not proof the API did not execute.

<a id="devicepower"></a>

## device.power

Control device power (on/off/force_off)

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/device/power`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target computer: agx=inference, lpmu=application. | agx |
| `action` | string | Required | on/off/toggle/force_off. | No default |

### Request example

```json
{
  "device": "agx",
  "action": "on"
}
```

### Response and completion

data.device/action/success reports the control call. Continue reading device.status.

### Usage notes

force_off can lose unsaved data; prefer normal shutdown. Repeating toggle reverses state again.

<a id="devicepowerstatus"></a>

## device.power.status

Get power measurements

**Methods**: GET / POST
**Path**: `/api/v1/device/power/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.rails entries: name/voltage_mv/current_ma/power_mw; total_power_mw. Units are mV/mA/mW.

<a id="devicereset"></a>

## device.reset

Reset device

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/device/reset`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target computer: agx=inference, lpmu=application. | agx |

### Request example

```json
{
  "device": "agx"
}
```

### Response and completion

data.device/reset. Recheck computer and application state afterward.

### Usage notes

Interrupts the target computer's work.

<a id="devicestatus"></a>

## device.status

Get device power status

**Methods**: GET / POST
**Path**: `/api/v1/device/status`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target computer: agx=inference, lpmu=application. | agx |

### Request example

```json
{
  "device": "agx"
}
```

### Response and completion

data.device/state/power_good/uptime_ms/boot_count; state is off/standby/on/booting/error.

### Usage notes

Power state does not establish OS/application readiness.

<a id="deviceusbset"></a>

## device.usb.set

Set USB MUX target

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/device/usb/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `target` | string | Required | esp32/agx/lpmu/disconnect. | No default |

### Request example

```json
{
  "target": "agx"
}
```

### Response and completion

data.target/success.

### Usage notes

Switching can interrupt control/transfers on the original route.

<a id="deviceusbstatus"></a>

## device.usb.status

Get USB MUX status

**Methods**: GET / POST
**Path**: `/api/v1/device/usb/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.target/configured; target can be esp32/agx/lpmu/disconnected.
