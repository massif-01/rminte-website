# Controller services APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [service.list](#servicelist) | List all services |
| [service.restart](#servicerestart) | Restart a service |
| [service.start](#servicestart) | Start a service |
| [service.status](#servicestatus) | Get service status |
| [service.stop](#servicestop) | Stop a service |

<a id="servicelist"></a>

## service.list

List all services

**Methods**: GET / POST
**Path**: `/api/v1/service/list`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.total/running/services; entries name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicerestart"></a>

## service.restart

Restart a service

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/service/restart`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Service name obtained from service.list. | No default |

### Request example

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Response and completion

data.name/status.

### Usage notes

Maintenance can interrupt network/WebUI/dependencies. Use automation.services for remote applications.

<a id="servicestart"></a>

## service.start

Start a service

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/service/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Service name obtained from service.list. | No default |

### Request example

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Response and completion

data.name/status.

### Usage notes

Maintenance can interrupt network/WebUI/dependencies. Use automation.services for remote applications.

<a id="servicestatus"></a>

## service.status

Get service status

**Methods**: GET / POST
**Path**: `/api/v1/service/status`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Service name obtained from service.list. | No default |

### Request example

```json
{
  "name": "webui"
}
```

### Response and completion

data.name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicestop"></a>

## service.stop

Stop a service

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/service/stop`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Service name obtained from service.list. | No default |

### Request example

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Response and completion

data.name/status.

### Usage notes

Maintenance can interrupt network/WebUI/dependencies. Use automation.services for remote applications.
