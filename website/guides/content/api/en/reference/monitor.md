# Compute monitoring APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [monitor.config](#monitorconfig) | Get Compute monitor configuration |
| [monitor.data](#monitordata) | Get latest Compute telemetry data |
| [monitor.set_server](#monitorset_server) | Set compute monitoring server IP and port |
| [monitor.start](#monitorstart) | Start Compute monitoring |
| [monitor.status](#monitorstatus) | Get Compute monitor status |
| [monitor.stop](#monitorstop) | Stop Compute monitoring |

<a id="monitorconfig"></a>

## monitor.config

Get Compute monitor configuration

**Methods**: GET / POST
**Path**: `/api/v1/monitor/config`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.server/port/reconnect_ms/heartbeat_timeout_ms/startup_delay_ms/auto_start/update_temp_source.

<a id="monitordata"></a>

## monitor.data

Get latest Compute telemetry data

**Methods**: GET / POST
**Path**: `/api/v1/monitor/data`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.timestamp; cpu cores/data(id/usage/freq); memory ram/swap used/total(MB); temperature cpu/soc0/soc1/soc2/tj(Celsius); power gpu_soc/cpu_cv/sys_5v current/average(mW); gpu.gr3d_freq_pct.

### Usage notes

Missing valid compute data returns a business error. These are compute-host metrics.

<a id="monitorset_server"></a>

## monitor.set_server

Set compute monitoring server IP and port

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/monitor/set_server`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `server` | string | Required | Monitoring-server address. | No default |
| `port` | integer | Optional | Port 1-65535; omission follows driver defaults. | 0 selects default handling |

### Request example

```json
{
  "server": "192.0.2.20",
  "port": 58090
}
```

### Response and completion

data.server/port/saved.

<a id="monitorstart"></a>

## monitor.start

Start Compute monitoring

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/monitor/start`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.started.

<a id="monitorstatus"></a>

## monitor.status

Get Compute monitor status

**Methods**: GET / POST
**Path**: `/api/v1/monitor/status`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.initialized/running/connection/reconnects/messages/errors/reliability/connected_time_ms; last_error may appear.

<a id="monitorstop"></a>

## monitor.stop

Stop Compute monitoring

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/monitor/stop`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.stopped.
