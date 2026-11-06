# Logs APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [log.capture](#logcapture) | Enable/disable ESP_LOG capture |
| [log.clear](#logclear) | Clear log buffer |
| [log.list](#loglist) | Get log entries with filtering |
| [log.setLevel](#logsetlevel) | Set log level |
| [log.stats](#logstats) | Get log system statistics |

<a id="logcapture"></a>

## log.capture

Enable/disable ESP_LOG capture

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/log/capture`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Required | Capture system logs into the log buffer. | No default |

### Request example

```json
{
  "enable": true
}
```

### Response and completion

data.capturing.

<a id="logclear"></a>

## log.clear

Clear log buffer

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/log/clear`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.cleared. Earlier in-memory logs can no longer be read from this buffer.

<a id="loglist"></a>

## log.list

Get log entries with filtering

**Methods**: GET / POST
**Path**: `/api/v1/log/list`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `offset` | integer | Optional | Starting offset within this search result. | 0 |
| `limit` | integer | Optional | Return limit, 1-200. | 50 |
| `level` | integer | Optional | Exact log level 1-5; do not combine with range filters. | All |
| `minLevel` | integer | Optional | Minimum log level. | ERROR |
| `maxLevel` | integer | Optional | Maximum log level. | VERBOSE |
| `tag` | string | Optional | Module-name substring filter. | None |
| `keyword` | string | Optional | Message keyword. | None |

### Request example

```json
{
  "limit": 50
}
```

### Response and completion

data.logs/total/offset/returned/bufferCapacity/bufferCount. Entries have timestamp(milliseconds since start),level/levelName/tag/message/task.

### Usage notes

Memory history is bounded. offset applies within the selected search result, not an unlimited archive.

<a id="logsetlevel"></a>

## log.setLevel

Set log level

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/log/setLevel`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `level` | integer / string | Required | Integer 0-5 or a level name such as error/warn/info/debug/verbose. | No default |
| `tag` | string | Optional | Specific module; omit for global. | Global |

### Request example

```json
{
  "level": 3
}
```

### Response and completion

data.level is the level name; tag is included for a module-specific change.

<a id="logstats"></a>

## log.stats

Get log system statistics

**Methods**: GET / POST
**Path**: `/api/v1/log/stats`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

Log-buffer and capture statistics, indicating capacity/current recording state.
