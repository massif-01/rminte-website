# Application-computer network setup APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [network.lpmu_access.log](#networklpmu_accesslog) | Get the execution log for an application computer network access run |
| [network.lpmu_access.start](#networklpmu_accessstart) | Start application computer upstream-network access setup |
| [network.lpmu_access.status](#networklpmu_accessstatus) | Get application computer upstream-network access setup status |

<a id="networklpmu_accesslog"></a>

## network.lpmu_access.log

Get the execution log for an application computer network access run

**Methods**: GET / POST
**Path**: `/api/v1/network/lpmu_access/log`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `run_id` | integer | Required | Current run number returned by start/status. | No default |
| `offset` | integer | Required | Nonnegative byte offset; use 0 initially. | No default |

### Request example

```json
{
  "run_id": 1,
  "offset": 0
}
```

### Response and completion

data.run_id/output/next_offset/done. Continue at next_offset.

### Usage notes

At most 1024 bytes per chunk. Stale run_id is rejected. done means the current log tail was read; still inspect task status.

<a id="networklpmu_accessstart"></a>

## network.lpmu_access.start

Start application computer upstream-network access setup

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/lpmu_access/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `sudo_password` | string | Optional | Remote sudo password, used for this execution only. | Empty |

### Request example

```json
{}
```

### Response and completion

data.run_id/running/stage. Continue querying status/log.

### Usage notes

Fixed target 10.10.99.99:22; requires saved host/key, one task at a time. Changes the remote network.

<a id="networklpmu_accessstatus"></a>

## network.lpmu_access.status

Get application computer upstream-network access setup status

**Methods**: GET / POST
**Path**: `/api/v1/network/lpmu_access/status`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `diagnostics` | boolean | Optional | Include additional timing/resource diagnostics. | false |

### Request example

```json
{}
```

### Response and completion

data.run_id/running/stage, transferred bytes,exit_code/reason/failure_stage,internet_confirmed/configuration_complete,output_tail/output_truncated. Diagnostics appear only when requested.

### Usage notes

Completion requires final-stage/script confirmation. Queuing or script exit 0 alone does not establish configured networking.
