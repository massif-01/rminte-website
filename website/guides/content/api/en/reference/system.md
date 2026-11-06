# Controller status APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [system.apis](#systemapis) | List all registered APIs |
| [system.cpu](#systemcpu) | Get CPU core statistics |
| [system.info](#systeminfo) | Get system information |
| [system.log.level](#systemloglevel) | Get/set log level |
| [system.memory](#systemmemory) | Get memory information |
| [system.memory_detail](#systemmemory_detail) | Get detailed memory analysis |
| [system.reboot](#systemreboot) | Reboot the system |
| [system.tasks](#systemtasks) | Get task list |

<a id="systemapis"></a>

## system.apis

List all registered APIs

**Methods**: GET / POST
**Path**: `/api/v1/system/apis`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.apis is an array of name strings with total; legacy monitor-presence flags may also appear.

### Usage notes

A name list does not replace parameter/access documentation.

<a id="systemcpu"></a>

## system.cpu

Get CPU core statistics

**Methods**: GET / POST
**Path**: `/api/v1/system/cpu`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.total_usage/cores; each core includes id/usage. These are controller metrics, not inference-computer metrics.

<a id="systeminfo"></a>

## system.info

Get system information

**Methods**: GET / POST
**Path**: `/api/v1/system/info`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.app has name/version/idf_version/compile_time/compile_date; chip has model/cores/revision/features; flash_size is bytes and uptime_ms milliseconds.

<a id="systemloglevel"></a>

## system.log.level

Get/set log level

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/system/log/level`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `level` | integer | Optional | 0=NONE,1=ERROR,2=WARN,3=INFO,4=DEBUG,5=VERBOSE. | Unchanged |
| `tag` | string | Optional | Change only this module's log level; omission affects all modules. | Global |

### Request example

```json
{
  "level": 3
}
```

### Response and completion

data.status; a change also includes level/tag.

### Usage notes

Intended for temporary diagnostics; persistent file logging is not promised.

<a id="systemmemory"></a>

## system.memory

Get memory information

**Methods**: GET / POST
**Path**: `/api/v1/system/memory`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.free_heap/min_free_heap are bytes. internal and available psram contain total/free/allocated/largest_block, all in bytes.

<a id="systemmemory_detail"></a>

## system.memory_detail

Get detailed memory analysis

**Methods**: GET / POST
**Path**: `/api/v1/system/memory_detail`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.dram/psram/iram/dma/static/rtc/nvs/tasks/history/tips diagnostic groups. total/free/used are memory statistics; stack_allocation_estimated identifies estimation.

### Usage notes

Estimates in one diagnostic snapshot are not an exact physical-memory breakdown or proof of a leak.

<a id="systemreboot"></a>

## system.reboot

Reboot the system

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/system/reboot`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `delay` | integer | Optional | Delay in milliseconds, ultimately bounded to 100-10000. | 500 |

### Request example

```json
{
  "delay": 500
}
```

### Response and completion

data.status=rebooting, delay_ms, and waiting_for_maintenance=false. Restart is requested after the delay; this API does not wait for an update to finish.

### Usage notes

Interrupts management connectivity. Save required settings, wait for recovery, and log in again.

<a id="systemtasks"></a>

## system.tasks

Get task list

**Methods**: GET / POST
**Path**: `/api/v1/system/tasks`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.tasks/count; tasks include name/state/priority/core/stack_hwm. stack_hwm is a native stack watermark, not total free memory.
