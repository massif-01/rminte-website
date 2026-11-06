# Time APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [time.force_sync](#timeforce_sync) | Force NTP sync |
| [time.info](#timeinfo) | Get time sync info |
| [time.set_ntp](#timeset_ntp) | Set NTP server |
| [time.set_timezone](#timeset_timezone) | Set timezone |
| [time.sync](#timesync) | Sync time from browser |

<a id="timeforce_sync"></a>

## time.force_sync

Force NTP sync

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/time/force_sync`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.syncing/message. Inspect time.info for actual synchronization.

<a id="timeinfo"></a>

## time.info

Get time sync info

**Methods**: GET / POST
**Path**: `/api/v1/time/info`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.timestamp (Unix seconds), timestamp_ms, datetime/timezone, and source/sync_status/synced/last_sync/sync_count/ntp_server.

<a id="timeset_ntp"></a>

## time.set_ntp

Set NTP server

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/time/set_ntp`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `server` | string | Required | NTP server hostname or address. | No default |
| `index` | integer | Optional | Server slot index. | 0 |

### Request example

```json
{
  "server": "YOUR_NTP_SERVER",
  "index": 0
}
```

### Response and completion

data.server/index/success.

<a id="timeset_timezone"></a>

## time.set_timezone

Set timezone

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/time/set_timezone`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `timezone` | string | Required | POSIX timezone string, such as CST-8. | No default |

### Request example

```json
{
  "timezone": "CST-8"
}
```

### Response and completion

data.timezone/local_time/success.

<a id="timesync"></a>

## time.sync

Sync time from browser

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/time/sync`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `timestamp_ms` | integer | Required | Unix timestamp in milliseconds. | No default |

### Request example

```json
{
  "timestamp_ms": 1793894400000
}
```

### Response and completion

data.datetime/synced/source.

### Usage notes

Changing system time affects certificate validity checks. Read time.info afterwards to confirm.
