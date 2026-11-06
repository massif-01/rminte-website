# General and module configuration APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [config.delete](#configdelete) | Delete configuration value |
| [config.get](#configget) | Get configuration value |
| [config.list](#configlist) | List configuration keys |
| [config.module.list](#configmodulelist) | List all config modules |
| [config.module.reset](#configmodulereset) | Reset module configuration |
| [config.module.save](#configmodulesave) | Save module configuration to NVS |
| [config.module.set](#configmoduleset) | Set module configuration |
| [config.module.show](#configmoduleshow) | Show module configuration |
| [config.save](#configsave) | Save configuration to storage |
| [config.set](#configset) | Set configuration value |

<a id="configdelete"></a>

## config.delete

Delete configuration value

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/delete`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `key` | string | Required | Complete configuration key name. | No default |

### Request example

```json
{
  "key": "example.setting"
}
```

### Response and completion

data.key/deleted.

<a id="configget"></a>

## config.get

Get configuration value

**Methods**: GET / POST
**Path**: `/api/v1/config/get`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `key` | string | Required | Complete configuration key name. | No default |

### Request example

```json
{
  "key": "system.language"
}
```

### Response and completion

data.key/type/value. Only key=system.language is anonymous; other keys require ADMIN.

<a id="configlist"></a>

## config.list

List configuration keys

**Methods**: GET / POST
**Path**: `/api/v1/config/list`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.items/file_keys/nvs_keys/total_keys, depending on registered configuration.

<a id="configmodulelist"></a>

## config.module.list

List all config modules

**Methods**: GET / POST
**Path**: `/api/v1/config/module/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.modules with name/version/dirty/nvs_namespace/registered; global sequence information may also appear.

<a id="configmodulereset"></a>

## config.module.reset

Reset module configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/module/reset`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `module` | string | Required | net/dhcp/wifi/nat/led/fan/device/system; see the operation for all support. | No default |
| `persist` | boolean | Optional | Persist the reset result. | false |

### Request example

```json
{
  "module": "system",
  "persist": false
}
```

### Response and completion

data.module/reset/persisted.

### Usage notes

Overwrites the selected module. Read and retain needed settings first.

<a id="configmodulesave"></a>

## config.module.save

Save module configuration to NVS

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/module/save`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `module` | string | Required | net/dhcp/wifi/nat/led/fan/device/system; see the operation for all support. | No default |

### Request example

```json
{
  "module": "all"
}
```

### Response and completion

Single-module result, or all with results/success_count/fail_count. Check each success/error.

<a id="configmoduleset"></a>

## config.module.set

Set module configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/module/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `module` | string | Required | net/dhcp/wifi/nat/led/fan/device/system; see the operation for all support. | No default |
| `key` | string | Required | Complete configuration key name. | No default |
| `value` | boolean / number / string | Required | Value matching the module field's type. | No default |

See the shared [data model](../configuration-models.md#module-configuration).

### Request example

```json
{
  "module": "system",
  "key": "timezone",
  "value": "CST-8"
}
```

### Response and completion

data.module/key/success/dirty. Persist with config.module.save.

<a id="configmoduleshow"></a>

## config.module.show

Show module configuration

**Methods**: GET / POST
**Path**: `/api/v1/config/module/show`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `module` | string | Required | net/dhcp/wifi/nat/led/fan/device/system; see the operation for all support. | No default |

See the shared [data model](../configuration-models.md#module-configuration).

### Request example

```json
{
  "module": "wifi"
}
```

### Response and completion

Single module: data.module/config/dirty. all can return grouped modules. Below-ADMIN views omit passwords.

<a id="configsave"></a>

## config.save

Save configuration to storage

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/save`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.saved. Preserve/query state after failure; do not assume complete persistence.

<a id="configset"></a>

## config.set

Set configuration value

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `key` | string | Required | Complete configuration key name. | No default |
| `value` | boolean / number / string | Required | Configuration value; not an object or array. | No default |

### Request example

```json
{
  "key": "system.language",
  "value": "zh-CN"
}
```

### Response and completion

data.key/success. Use config.save separately for persistence.
