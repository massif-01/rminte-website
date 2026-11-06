# Monitoring layout APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [ui.widgets.get](#uiwidgetsget) | Get data widgets configuration |
| [ui.widgets.set](#uiwidgetsset) | Save data widgets configuration |

<a id="uiwidgetsget"></a>

## ui.widgets.get

Get data widgets configuration

**Methods**: GET / POST
**Path**: `/api/v1/ui/widgets/get`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.widgets/refresh_interval/source; layout is saved in device configuration.

<a id="uiwidgetsset"></a>

## ui.widgets.set

Save data widgets configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ui/widgets/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `widgets` | array | Required | Widget configuration array; see the widget model. | No default |
| `refresh_interval` | integer | Optional | Refresh interval in milliseconds. | 5000 |

See the shared [data model](../configuration-models.md#monitoring-widgets).

### Request example

```json
{
  "widgets": [],
  "refresh_interval": 5000
}
```

### Response and completion

data.nvs_saved. Read layout back with ui.widgets.get.

### Usage notes

Serialized configuration is limited to 4000 bytes.
