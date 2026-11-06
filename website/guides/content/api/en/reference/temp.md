# Temperature APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [temp.bind](#tempbind) | Bind/unbind temperature to a system variable |
| [temp.manual](#tempmanual) | Set/get manual temperature mode |
| [temp.read](#tempread) | Read current temperature |
| [temp.select](#tempselect) | Set/get preferred temperature source |
| [temp.sources](#tempsources) | Get all temperature sources info |
| [temp.status](#tempstatus) | Get temperature system status |

<a id="tempbind"></a>

## temp.bind

Bind/unbind temperature to a system variable

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/temp/bind`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `variables` | array | Optional | At most 8 {name,weight} entries; an empty array clears multi-variable bindings. | Unchanged |
| `variable` | string / null | Optional | Legacy single-variable binding; null or empty string clears it. | Unchanged |

### Request example

```json
{
  "variables": [
    {
      "name": "compute.temperature",
      "weight": 1
    }
  ]
}
```

### Response and completion

data.bound_variables, binding state, valid counts/weights, weighted_temp_c, partial_stale/valid. Unauthorized variable values are filtered.

### Usage notes

Variables must exist and be numeric temperatures. ADMIN may query with binding fields omitted; supplying variables or variable to change or clear bindings requires ROOT.

<a id="tempmanual"></a>

## temp.manual

Set/get manual temperature mode

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/temp/manual`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Optional | Enable or disable manual temperature mode. | Unchanged |
| `temperature_c` | number | Optional | Celsius, -50.0 to 150.0. | Unchanged |
| `temperature` | number | Optional | Alias of temperature_c; preferably send only one temperature field. | Unchanged |
| `temperature_01c` | integer | Optional | Tenths of Celsius, -500 to 1500; used when no Celsius field is supplied. | Unchanged |

### Request example

```json
{
  "enable": true,
  "temperature_c": 45
}
```

### Response and completion

data.manual_mode/current_temp_c/current_temp_01c/active_source.

### Usage notes

Changes temperature input used by control. Explicitly disable manual mode and read back state after testing.

<a id="tempread"></a>

## temp.read

Read current temperature

**Methods**: GET / POST
**Path**: `/api/v1/temp/read`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `source` | string | Optional | default/local or sensor_local/agx or agx_auto/variable/manual. | Current active source |

See the shared [data model](../response-models.md#temperature).

### Request example

```json
{}
```

### Response and completion

data.temperature_c/temperature_01c/source/timestamp_ms/valid; variable sources may include partial_stale and binding counts/weights.

<a id="tempselect"></a>

## temp.select

Set/get preferred temperature source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/temp/select`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `source` | string | Optional | auto/agx/sensor/variable. | Query only |

### Request example

```json
{
  "source": "auto"
}
```

### Response and completion

data.preferred_source/active_source/temperature_c/valid.

<a id="tempsources"></a>

## temp.sources

Get all temperature sources info

**Methods**: GET / POST
**Path**: `/api/v1/temp/sources`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

Current temperature/validity plus providers. Entries include name/type/active/valid/stale/last_value_c/last_value_01c/last_update_ms/age_ms/update_count.

### Usage notes

age_ms=null means no usable update time. Variable sources also report partial failures and valid counts/weights.

<a id="tempstatus"></a>

## temp.status

Get temperature system status

**Methods**: GET / POST
**Path**: `/api/v1/temp/status`
**Minimum access**: Public

### Parameters

No business parameters.

See the shared [data model](../response-models.md#temperature).

### Request example

```json
{}
```

### Response and completion

data.initialized/manual_mode/active_source/preferred_source/temperature_c/temperature_01c/timestamp_ms/valid, possibly bound_variable.
