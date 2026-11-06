# Fans APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [fan.config](#fanconfig) | Get fan configuration including curve |
| [fan.curve](#fancurve) | Set temperature curve for fan |
| [fan.enable](#fanenable) | Enable or disable a fan |
| [fan.limits](#fanlimits) | Set duty cycle limits (min/max) |
| [fan.mode](#fanmode) | Set fan operating mode |
| [fan.save](#fansave) | Save fan configuration to NVS |
| [fan.set](#fanset) | Set fan speed (manual mode) |
| [fan.status](#fanstatus) | Get fan status |

<a id="fanconfig"></a>

## fan.config

Get fan configuration including curve

**Methods**: GET / POST
**Path**: `/api/v1/fan/config`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Optional | Fan ID; obtain it from fan.status first. | All when omitted |

### Request example

```json
{
  "id": 0
}
```

### Response and completion

One/all configurations: id/mode/min_duty/max_duty/invert_pwm/hysteresis/min_interval/curve. Curve points use temp(Celsius)/duty(percent).

<a id="fancurve"></a>

## fan.curve

Set temperature curve for fan

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/fan/curve`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Required | Fan ID within the device's supported range. | No default |
| `curve` | array | Required | At most 10 {temp:Celsius,duty:percent} points; ascending temperatures and duty 0-100. | No default |
| `hysteresis` | number | Optional | Temperature hysteresis, 0-20 Celsius. | Current value |
| `min_interval` | integer | Optional | Minimum adjustment interval, integer 100-60000 milliseconds. | Current value |

### Request example

```json
{
  "id": 0,
  "curve": [
    {
      "temp": 30,
      "duty": 30
    },
    {
      "temp": 60,
      "duty": 80
    }
  ],
  "hysteresis": 3,
  "min_interval": 2000
}
```

### Response and completion

data.id/points/applied/persisted.

### Usage notes

Curve configuration and control mode are separate. Read back configuration and select curve mode if needed.

<a id="fanenable"></a>

## fan.enable

Enable or disable a fan

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/fan/enable`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Required | Fan ID within the device's supported range. | No default |
| `enable` | boolean | Required | true enables; false disables. | No default |

### Request example

```json
{
  "id": 0,
  "enable": true
}
```

### Response and completion

data.id/enabled.

### Usage notes

Disabling can reduce cooling. Check temperature and protection separately.

<a id="fanlimits"></a>

## fan.limits

Set duty cycle limits (min/max)

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/fan/limits`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Required | Fan ID within the device's supported range. | No default |
| `min_duty` | integer | Optional | Minimum duty, 0-100 percent, no greater than maximum. | Current value |
| `max_duty` | integer | Optional | Maximum duty, 0-100 percent. | Current value |

### Request example

```json
{
  "id": 0,
  "min_duty": 20,
  "max_duty": 100
}
```

### Response and completion

data.id/min_duty/max_duty/applied/persisted.

<a id="fanmode"></a>

## fan.mode

Set fan operating mode

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/fan/mode`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Required | Fan ID within the device's supported range. | No default |
| `mode` | string | Required | off/manual/auto/curve. | No default |

### Request example

```json
{
  "id": 0,
  "mode": "auto"
}
```

### Response and completion

data.id/mode/applied/persisted. Distinguish runtime application from storage failure.

<a id="fansave"></a>

## fan.save

Save fan configuration to NVS

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/fan/save`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Optional | Fan ID. | All fans |

### Request example

```json
{}
```

### Response and completion

data.status/persisted. Inspect failure details; do not assume retention after restart.

<a id="fanset"></a>

## fan.set

Set fan speed (manual mode)

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/fan/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Required | Fan ID within the device's supported range. | No default |
| `duty` | integer | Required | Requested duty, 0-100 percent. | No default |

See the shared [data model](../response-models.md#fan).

### Request example

```json
{
  "id": 0,
  "duty": 50
}
```

### Response and completion

Applied fan state; inspect duty_valid/duty/target_duty/mode.

### Usage notes

Affects cooling. Change deliberately and read back actual/requested output.

<a id="fanstatus"></a>

## fan.status

Get fan status

**Methods**: GET / POST
**Path**: `/api/v1/fan/status`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | integer | Optional | Fan ID; obtain it from fan.status first. | All when omitted |

See the shared [data model](../response-models.md#fan).

### Request example

```json
{
  "id": 0
}
```

### Response and completion

With id, data is one fan; otherwise data.fans plus temperature/temp_valid/temp_source. See the fan response model.
