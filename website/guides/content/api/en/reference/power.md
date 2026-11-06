# Power and protection APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [power.chip](#powerchip) | Get power chip data |
| [power.debug](#powerdebug) | Set debug mode |
| [power.interval.set](#powerintervalset) | Set sampling interval |
| [power.monitor.start](#powermonitorstart) | Start power monitoring |
| [power.monitor.stop](#powermonitorstop) | Stop power monitoring |
| [power.protection.config](#powerprotectionconfig) | Get voltage protection configuration |
| [power.protection.set](#powerprotectionset) | Configure voltage protection |
| [power.protection.status](#powerprotectionstatus) | Get voltage protection status |
| [power.stats](#powerstats) | Get monitoring statistics |
| [power.stats.reset](#powerstatsreset) | Reset monitoring statistics |
| [power.status](#powerstatus) | Get power monitoring status |
| [power.threshold.set](#powerthresholdset) | Set voltage thresholds |
| [power.voltage](#powervoltage) | Read current voltage |

<a id="powerchip"></a>

## power.chip

Get power chip data

**Methods**: GET / POST
**Path**: `/api/v1/power/chip`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.voltage_v/current_a/power_w/valid/crc_valid/timestamp_ms/raw_data. Use only valid, integrity-checked values.

<a id="powerdebug"></a>

## power.debug

Set debug mode

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/debug`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Required | Enable debug output. | No default |

### Request example

```json
{
  "enable": false
}
```

### Response and completion

data.debug_enabled.

<a id="powerintervalset"></a>

## power.interval.set

Set sampling interval

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/interval/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `interval_ms` | integer | Required | Sampling interval in milliseconds; the device rejects values below its supported range. | No default |

### Request example

```json
{
  "interval_ms": 1000
}
```

### Response and completion

data.interval_ms.

<a id="powermonitorstart"></a>

## power.monitor.start

Start power monitoring

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/monitor/start`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.running.

### Usage notes

Stopping sampling affects future updates. Check the data required by protection as well.

<a id="powermonitorstop"></a>

## power.monitor.stop

Stop power monitoring

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/monitor/stop`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.running.

### Usage notes

Stopping sampling affects future updates. Check the data required by protection as well.

<a id="powerprotectionconfig"></a>

## power.protection.config

Get voltage protection configuration

**Methods**: GET / POST
**Path**: `/api/v1/power/protection/config`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.low_voltage_threshold/recovery_voltage_threshold(V), shutdown_delay_sec/recovery_hold_sec/fan_stop_delay_sec(seconds), and defaults.

<a id="powerprotectionset"></a>

## power.protection.set

Configure voltage protection

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/protection/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Optional | Start/stop protection; supplying this field always saves enablement. | Unchanged |
| `low_threshold` | number | Optional | Low-voltage threshold in V. | Unchanged |
| `recovery_threshold` | number | Optional | Recovery threshold in V. | Unchanged |
| `shutdown_delay` | integer | Optional | Low-voltage shutdown delay in seconds. | Unchanged |
| `recovery_hold` | integer | Optional | Required recovery hold time in seconds. | Unchanged |
| `fan_stop_delay` | integer | Optional | Fan-stop delay after computer shutdown, in seconds. | Unchanged |
| `persist` | boolean | Optional | true saves parameter-only changes; enablement changes are saved automatically. | false |

### Request example

```json
{
  "persist": true
}
```

### Response and completion

data.low_threshold_v/recovery_threshold_v/running/persisted.

### Usage notes

Affects protection and automatic shutdown. Partial application can precede failure; read back configuration/state.

<a id="powerprotectionstatus"></a>

## power.protection.status

Get voltage protection status

**Methods**: GET / POST
**Path**: `/api/v1/power/protection/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.initialized/running/state/current_voltage_v/countdown_remaining_sec/recovery_timer_sec/protection_count/uptime_ms; devices has agx_powered/lpmu_powered/agx_connected.

### Usage notes

initialized=false does not establish active protection.

<a id="powerstats"></a>

## power.stats

Get monitoring statistics

**Methods**: GET / POST
**Path**: `/api/v1/power/stats`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.voltage_samples/power_chip_packets/crc_errors/timeout_errors/threshold_violations/avg_voltage_v/avg_current_a/avg_power_w/uptime_ms.

<a id="powerstatsreset"></a>

## power.stats.reset

Reset monitoring statistics

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/stats/reset`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.reset.

### Usage notes

Resets statistics, not sensor calibration.

<a id="powerstatus"></a>

## power.status

Get power monitoring status

**Methods**: GET / POST
**Path**: `/api/v1/power/status`
**Minimum access**: Public

### Parameters

No business parameters.

See the shared [data model](../response-models.md#power).

### Request example

```json
{}
```

### Response and completion

data.voltage; power_chip has voltage_v/current_a/power_w/valid/crc_valid; protection,stats,monitoring_active describe protection, aggregates, and sampling.

<a id="powerthresholdset"></a>

## power.threshold.set

Set voltage thresholds

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/power/threshold/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `min_v` | number | Required | Minimum voltage in V. | No default |
| `max_v` | number | Required | Maximum voltage in V; greater than minimum. | No default |

### Request example

```json
{
  "min_v": 12,
  "max_v": 24
}
```

### Response and completion

data.min_v/max_v.

### Usage notes

Monitoring thresholds and protection policy are separate; use power.protection.set for protection.

<a id="powervoltage"></a>

## power.voltage

Read current voltage

**Methods**: GET / POST
**Path**: `/api/v1/power/voltage`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `now` | boolean | Optional | true samples now; false reads the latest value. | false |

### Request example

```json
{}
```

### Response and completion

data.voltage_v(V)/voltage_mv(mV)/adc_raw/timestamp_ms.
