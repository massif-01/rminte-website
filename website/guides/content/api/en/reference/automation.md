# Automation and managed services APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [automation.action.stats](#automationactionstats) | Get action execution statistics |
| [automation.action.stats.reset](#automationactionstatsreset) | Reset action statistics |
| [automation.actions.add](#automationactionsadd) | Create a new action template |
| [automation.actions.delete](#automationactionsdelete) | Delete an action template |
| [automation.actions.execute](#automationactionsexecute) | Execute an action template |
| [automation.actions.export](#automationactionsexport) | Export action template as config pack (.tscfg) |
| [automation.actions.get](#automationactionsget) | Get action template by ID |
| [automation.actions.import](#automationactionsimport) | Import action template from config pack |
| [automation.actions.list](#automationactionslist) | List all action templates |
| [automation.actions.update](#automationactionsupdate) | Update an existing action template |
| [automation.config.apply](#automationconfigapply) | Apply the confirmed restore or source choice |
| [automation.config.backup](#automationconfigbackup) | Save the complete emergency configuration |
| [automation.config.enable](#automationconfigenable) | Explicitly enable or pause the current configuration |
| [automation.config.preview](#automationconfigpreview) | Preview a configuration restore or source choice |
| [automation.config.refresh](#automationconfigrefresh) | Check SD card once without changing the user choice |
| [automation.config.status](#automationconfigstatus) | Current automation storage and backup status |
| [automation.pause](#automationpause) | Pause automation engine |
| [automation.proxy.fetch](#automationproxyfetch) | Proxy fetch from external REST API |
| [automation.proxy.socketio_test](#automationproxysocketio_test) | Test Socket.IO connection (v4 protocol) |
| [automation.proxy.websocket_test](#automationproxywebsocket_test) | Test WebSocket connection |
| [automation.reload](#automationreload) | Reload configuration |
| [automation.resume](#automationresume) | Resume automation engine |
| [automation.rules.add](#automationrulesadd) | Add a new rule |
| [automation.rules.delete](#automationrulesdelete) | Delete a rule |
| [automation.rules.disable](#automationrulesdisable) | Disable a rule |
| [automation.rules.enable](#automationrulesenable) | Enable a rule |
| [automation.rules.export](#automationrulesexport) | Export rule as config pack (.tscfg) |
| [automation.rules.get](#automationrulesget) | Get rule details by ID |
| [automation.rules.import](#automationrulesimport) | Import rule from config pack |
| [automation.rules.list](#automationruleslist) | List all rules |
| [automation.rules.trigger](#automationrulestrigger) | Manually trigger a rule |
| [automation.rules.update](#automationrulesupdate) | Update rule with expected revision |
| [automation.services.list](#automationserviceslist) | List independent remote service controls |
| [automation.services.status](#automationservicesstatus) | Confirm managed remote process state |
| [automation.services.stop](#automationservicesstop) | Stop verified managed remote process |
| [automation.sources.add](#automationsourcesadd) | Add a new data source |
| [automation.sources.add_mapping](#automationsourcesadd_mapping) | Add a field mapping to an existing data source |
| [automation.sources.delete](#automationsourcesdelete) | Delete a data source |
| [automation.sources.disable](#automationsourcesdisable) | Disable a data source |
| [automation.sources.enable](#automationsourcesenable) | Enable a data source |
| [automation.sources.export](#automationsourcesexport) | Export data source as config pack (.tscfg) |
| [automation.sources.import](#automationsourcesimport) | Import data source from config pack |
| [automation.sources.list](#automationsourceslist) | List all data sources |
| [automation.sources.remove_mapping](#automationsourcesremove_mapping) | Remove a field mapping from a data source |
| [automation.sources.update](#automationsourcesupdate) | Update an existing data source |
| [automation.start](#automationstart) | Start automation engine |
| [automation.status](#automationstatus) | Get automation engine status |
| [automation.stop](#automationstop) | Stop automation engine |
| [automation.test.device](#automationtestdevice) | Test device control action |
| [automation.test.gpio](#automationtestgpio) | Test GPIO action |
| [automation.test.led](#automationtestled) | Test LED action |
| [automation.test.ssh](#automationtestssh) | Test SSH command execution |
| [automation.variables.delete](#automationvariablesdelete) | Delete a saved user variable |
| [automation.variables.get](#automationvariablesget) | Get variable value |
| [automation.variables.list](#automationvariableslist) | List all variables |
| [automation.variables.set](#automationvariablesset) | Set variable value |

<a id="automationactionstats"></a>

## automation.action.stats

Get action execution statistics

**Methods**: GET / POST
**Path**: `/api/v1/automation/action/stats`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

Current action-manager runtime statistics, not a persistent audit trail.

<a id="automationactionstatsreset"></a>

## automation.action.stats.reset

Reset action statistics

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/action/stats/reset`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

code=0 reports the reset request succeeded.

<a id="automationactionsadd"></a>

## automation.actions.add

Create a new action template

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/actions/add`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="automationactionsdelete"></a>

## automation.actions.delete

Delete an action template

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/actions/delete`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `preview` | boolean | Optional | true previews impact; false performs deletion. | false |
| `replacement_id` | string | Optional | Replacement object ID for dependent references. | None |
| `mode` | string | Optional | cascade requests cascade handling; choose one strategy rather than combining force/replacement. | Ordinary deletion |
| `force` | boolean | Optional | Force deletion of a referenced object only after previewing impact. | false |
| `pause_automation` | boolean | Optional | Pause automation before handling. | false |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Response and completion

Configuration-result model plus impact describing references affected.

### Usage notes

Deleting local definitions does not automatically stop remote programs or revoke public keys.

<a id="automationactionsexecute"></a>

## automation.actions.execute

Execute an action template

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/actions/execute`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "id": "example-action",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

data.async/status/duration_ms and execution results; private output is filtered for below-ADMIN.

### Usage notes

Executes the template's real hardware/remote effects. Continue checking the target result for asynchronous templates.

<a id="automationactionsexport"></a>

## automation.actions.export

Export action template as config pack (.tscfg)

**Methods**: POST
**Path**: `/api/v1/automation/actions/export`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `recipient_cert` | string | Optional | Recipient certificate PEM; omission encrypts for this device. | This device certificate |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "id": "example"
}
```

### Response and completion

data.tscfg/filename. Export additionally depends on Developer device identity and recipient materials.

### Usage notes

The client saves returned package text. It does not become another device's active configuration automatically.

<a id="automationactionsget"></a>

## automation.actions.get

Get action template by ID

**Methods**: GET / POST
**Path**: `/api/v1/automation/actions/get`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "id": "example"
}
```

### Response and completion

One action template and active_version; below-ADMIN fields are filtered.

<a id="automationactionsimport"></a>

## automation.actions.import

Import action template from config pack

**Methods**: POST
**Path**: `/api/v1/automation/actions/import`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Required | Complete package JSON text supplied as a string. | No default |
| `preview` | boolean | Optional | Preview only when true. | false |
| `active_version` | string | Required for apply | Current configuration version. | Preview may use current version |
| `overwrite` | boolean | Optional | Permit replacing an existing object with different content. | false |
| `expected_credential` | integer | Required for apply | credential_generation returned by preview. | None |
| `expected_digest` | string | Required for apply | package_digest returned by preview. | None |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Response and completion

Configuration-result model. Preview adds valid/items/exists/unchanged/package_digest/credential_generation; apply adds imported/overwritten/restart_required.

### Usage notes

Preview first, then apply the same package with digest,credential generation,and configuration version. Preview again if conditions change.

<a id="automationactionslist"></a>

## automation.actions.list

List all action templates

**Methods**: GET / POST
**Path**: `/api/v1/automation/actions/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `offset` | integer | Optional | Nonnegative return offset. | 0 |
| `limit` | integer | Optional | Return count; omission does not request truncation. | All |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{}
```

### Response and completion

data.templates/count/total/active_version/load_error/paused; below-ADMIN gets restricted metadata.

<a id="automationactionsupdate"></a>

## automation.actions.update

Update an existing action template

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/actions/update`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#action-templates).

### Request example

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="automationconfigapply"></a>

## automation.config.apply

Apply the confirmed restore or source choice

**Methods**: POST
**Path**: `/api/v1/automation/config/apply`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `operation` | string | Required | The same operation selected during preview. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `target_version` | string | Required | Target version returned by preview. | No default |

See the shared [data model](../response-models.md#config-result).

### Request example

```json
{
  "operation": "use_sd",
  "active_version": "CURRENT_VERSION",
  "target_version": "PREVIEW_TARGET_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Selection/recovery can replace the entire hosts/commands/rules/variables/sources set. Preview and preserve current input first.

<a id="automationconfigbackup"></a>

## automation.config.backup

Save the complete emergency configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/config/backup`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../response-models.md#config-result).

### Request example

```json
{
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationconfigenable"></a>

## automation.config.enable

Explicitly enable or pause the current configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/config/enable`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `enabled` | boolean | Required | true enables the current configuration; false pauses it. | No default |

See the shared [data model](../response-models.md#config-result).

### Request example

```json
{
  "active_version": "CURRENT_VERSION",
  "enabled": false
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationconfigpreview"></a>

## automation.config.preview

Preview a configuration restore or source choice

**Methods**: POST
**Path**: `/api/v1/automation/config/preview`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `operation` | string | Required | use_sd/save_to_sd/restore_internal. | No default |

See the shared [data model](../response-models.md#config-result).

### Request example

```json
{
  "operation": "use_sd"
}
```

### Response and completion

Preview differences,current/target versions,and selection preconditions. Apply must use the returned versions.

### Usage notes

Selection/recovery can replace the entire hosts/commands/rules/variables/sources set. Preview and preserve current input first.

<a id="automationconfigrefresh"></a>

## automation.config.refresh

Check SD card once without changing the user choice

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/config/refresh`
**Minimum access**: ROOT

### Parameters

No business parameters.

See the shared [data model](../response-models.md#config-result).

### Request example

```json
{}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationconfigstatus"></a>

## automation.config.status

Current automation storage and backup status

**Methods**: GET / POST
**Path**: `/api/v1/automation/config/status`
**Minimum access**: READ

### Parameters

No business parameters.

See the shared [data model](../response-models.md#config-result).

### Request example

```json
{}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationpause"></a>

## automation.pause

Pause automation engine

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/pause`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

code=0/message reports success. Read automation.status to verify runtime state.

### Usage notes

Engine state,unfinished actions,or storage can reject requests. A stop timeout does not establish that all actions ended.

<a id="automationproxyfetch"></a>

## automation.proxy.fetch

Proxy fetch from external REST API

**Methods**: POST
**Path**: `/api/v1/automation/proxy/fetch`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Required | HTTP(S) destination or a supported local API address. | No default |
| `method` | string | Optional | Supports GET/POST/PUT/DELETE; no generic request-body parameter. | GET |
| `headers` | object | Optional | String-valued request headers; keep credentials out of ordinary logs. | None |
| `timeout` | integer | Optional | Total request timeout in milliseconds. | 15000 |
| `cert_pem` | string | Optional | Private-issuer CA material, at most 16384 bytes. | System trust |
| `skip_verify` | boolean | Optional | Compatibility parameter: false only; true is rejected. | false |

### Request example

```json
{
  "url": "https://example.com/status",
  "method": "GET"
}
```

### Response and completion

data.status/content_length/body; local API results are nested in body, whose code must also be checked.

### Usage notes

Local API forwarding retains the current session and destination permissions. External HTTP(S) requests require ROOT. Time, size, and network budgets apply; this is not an unrestricted proxy.

<a id="automationproxysocketio_test"></a>

## automation.proxy.socketio_test

Test Socket.IO connection (v4 protocol)

**Methods**: POST
**Path**: `/api/v1/automation/proxy/socketio_test`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Required | Socket.IO v4 server address. | No default |
| `event` | string | Optional | Target event name. | First event |
| `timeout_ms` | integer | Optional | Connection/event deadline in milliseconds. | 10000 |
| `json_path` | string | Optional | Event-data extraction path. | Complete data |

### Request example

```json
{
  "url": "https://example.com",
  "event": "status"
}
```

### Response and completion

data.connected/sid/event/data, possibly value/path/path_error/error.

### Usage notes

Uses Socket.IO rather than plain WebSocket; connects to a real remote service.

<a id="automationproxywebsocket_test"></a>

## automation.proxy.websocket_test

Test WebSocket connection

**Methods**: POST
**Path**: `/api/v1/automation/proxy/websocket_test`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `uri` | string | Required | ws:// or wss:// destination. | No default |
| `timeout_ms` | integer | Optional | Connection/data wait deadline in milliseconds. | 10000 |
| `subscribe` | string | Optional | Subscription text to send after connecting. | Send nothing |
| `json_path` | string | Optional | JSON extraction path for the response. | Complete message |

### Request example

```json
{
  "uri": "wss://example.com/events",
  "timeout_ms": 10000
}
```

### Response and completion

data.connected/message, possibly value/path/path_error/error.

### Usage notes

Connects and can send text. One test is not a persistent subscription.

<a id="automationreload"></a>

## automation.reload

Reload configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/reload`
**Minimum access**: ROOT

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Engine state,unfinished actions,or storage can reject requests. A stop timeout does not establish that all actions ended.

<a id="automationresume"></a>

## automation.resume

Resume automation engine

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/resume`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

code=0/message reports success. Read automation.status to verify runtime state.

### Usage notes

Engine state,unfinished actions,or storage can reject requests. A stop timeout does not establish that all actions ended.

<a id="automationrulesadd"></a>

## automation.rules.add

Add a new rule

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/rules/add`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `expected_revision` | integer | Optional | Original rule revision; carry the latest read value for update. | Not needed for creation |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Saving and triggering are separate. Do not overwrite complete rules from filtered views.

<a id="automationrulesdelete"></a>

## automation.rules.delete

Delete a rule

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/rules/delete`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `preview` | boolean | Optional | true previews impact; false performs deletion. | false |
| `replacement_id` | string | Optional | Replacement object ID for dependent references. | None |
| `mode` | string | Optional | cascade requests cascade handling; choose one strategy rather than combining force/replacement. | Ordinary deletion |
| `force` | boolean | Optional | Force deletion of a referenced object only after previewing impact. | false |
| `pause_automation` | boolean | Optional | Pause automation before handling. | false |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Response and completion

Configuration-result model, possibly impact.

<a id="automationrulesdisable"></a>

## automation.rules.disable

Disable a rule

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/rules/disable`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `expected_revision` | integer | Optional | Current rule revision. | Recommended |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationrulesenable"></a>

## automation.rules.enable

Enable a rule

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/rules/enable`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `expected_revision` | integer | Optional | Current rule revision. | Recommended |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationrulesexport"></a>

## automation.rules.export

Export rule as config pack (.tscfg)

**Methods**: POST
**Path**: `/api/v1/automation/rules/export`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `recipient_cert` | string | Optional | Recipient certificate PEM; omission encrypts for this device. | This device certificate |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule"
}
```

### Response and completion

data.tscfg/filename; package contains rule configuration input.

<a id="automationrulesget"></a>

## automation.rules.get

Get rule details by ID

**Methods**: GET / POST
**Path**: `/api/v1/automation/rules/get`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule"
}
```

### Response and completion

Rule definition,current revision,and runtime statistics; below-ADMIN omits complete conditions/actions.

<a id="automationrulesimport"></a>

## automation.rules.import

Import rule from config pack

**Methods**: POST
**Path**: `/api/v1/automation/rules/import`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Required | Package JSON text. | No default |
| `preview` | boolean | Optional | Preview or apply mode. | false |
| `active_version` | string | Required for apply | Current configuration version. | No default |
| `overwrite` | boolean | Optional | Overwrite rules with the same ID. | false |
| `expected_revision` | integer | Required for apply | Rule revision returned by preview. | No default |
| `expected_generation` | integer | Required for apply | Rule generation returned by preview. | No default |
| `credential_generation` | integer | Required for apply | Certificate/credential generation returned by preview. | No default |
| `package_digest` | string | Required for apply | Package digest returned by preview. | No default |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Response and completion

Preview/apply results,versions,and digests. Apply confirms that preview preconditions still hold.

### Usage notes

Complete JSON body only; no query. Confirmation fields differ from other imports; do not use expected_credential/expected_digest here.

<a id="automationruleslist"></a>

## automation.rules.list

List all rules

**Methods**: GET / POST
**Path**: `/api/v1/automation/rules/list`
**Minimum access**: READ

### Parameters

No business parameters.

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{}
```

### Response and completion

data.rules/count/active_version/loaded/paused/load_error/recovery_required/invalid_items/restart_required. Entries include ID,enablement,revision,runtime statistics; below-ADMIN is restricted.

<a id="automationrulestrigger"></a>

## automation.rules.trigger

Manually trigger a rule

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/rules/trigger`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

### Request example

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Trigger result or rejection reason. Confirm action/service state to establish completion.

### Usage notes

Has real effects. Cooldown,pause,conditions,and runtime state may reject triggering.

<a id="automationrulesupdate"></a>

## automation.rules.update

Update rule with expected revision

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/rules/update`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `expected_revision` | integer | Optional | Original rule revision; carry the latest read value for update. | Not needed for creation |

See the shared [data model](../configuration-models.md#automation-rules).

### Request example

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Saving and triggering are separate. Do not overwrite complete rules from filtered views.

<a id="automationserviceslist"></a>

## automation.services.list

List independent remote service controls

**Methods**: GET / POST
**Path**: `/api/v1/automation/services/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.items with run_id/command_id/rule_id/source/name/state/current/last_known and operation status.

### Usage notes

Retained run records do not prove a remote process still exists. Request verification explicitly when needed.

<a id="automationservicesstatus"></a>

## automation.services.status

Confirm managed remote process state

**Methods**: GET / POST
**Path**: `/api/v1/automation/services/status`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `run_id` | string | Required | Run ID from the start response or service list. | No default |
| `verify` | boolean | Optional | Connect to the original host to verify state. | Per-operation handling |

### Request example

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### Response and completion

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### Usage notes

Continue querying busy/in-progress operations. Stop uses verified original process identity, not arbitrary name-based killing.

<a id="automationservicesstop"></a>

## automation.services.stop

Stop verified managed remote process

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/services/stop`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `run_id` | string | Required | Run ID from the start response or service list. | No default |
| `verify` | boolean | Optional | Connect to the original host to verify state. | Per-operation handling |

### Request example

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### Response and completion

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### Usage notes

Continue querying busy/in-progress operations. Stop uses verified original process identity, not arbitrary name-based killing.

<a id="automationsourcesadd"></a>

## automation.sources.add

Add a new data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/add`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="automationsourcesadd_mapping"></a>

## automation.sources.add_mapping

Add a field mapping to an existing data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/add_mapping`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `json_path` | string | Required | Data field path to extract. | No default |
| `var_name` | string | Required | Destination variable name. | No default |
| `transform` | string | Optional | Optional transform expression. | None |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "json_path": "temperature",
  "var_name": "compute.temperature"
}
```

### Response and completion

Configuration-result model plus source_id/mapping_count/mapping_index.

<a id="automationsourcesdelete"></a>

## automation.sources.delete

Delete a data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/delete`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `preview` | boolean | Optional | true previews impact; false performs deletion. | false |
| `replacement_id` | string | Optional | Replacement object ID for dependent references. | None |
| `mode` | string | Optional | cascade requests cascade handling; choose one strategy rather than combining force/replacement. | Ordinary deletion |
| `force` | boolean | Optional | Force deletion of a referenced object only after previewing impact. | false |
| `pause_automation` | boolean | Optional | Pause automation before handling. | false |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Response and completion

Configuration-result model plus impact describing references affected.

### Usage notes

Deleting local definitions does not automatically stop remote programs or revoke public keys.

<a id="automationsourcesdisable"></a>

## automation.sources.disable

Disable a data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/disable`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationsourcesenable"></a>

## automation.sources.enable

Enable a data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/enable`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

<a id="automationsourcesexport"></a>

## automation.sources.export

Export data source as config pack (.tscfg)

**Methods**: POST
**Path**: `/api/v1/automation/sources/export`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `recipient_cert` | string | Optional | Recipient certificate PEM; omission encrypts for this device. | This device certificate |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example"
}
```

### Response and completion

data.tscfg/filename. Export additionally depends on Developer device identity and recipient materials.

### Usage notes

The client saves returned package text. It does not become another device's active configuration automatically.

<a id="automationsourcesimport"></a>

## automation.sources.import

Import data source from config pack

**Methods**: POST
**Path**: `/api/v1/automation/sources/import`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Required | Complete package JSON text supplied as a string. | No default |
| `preview` | boolean | Optional | Preview only when true. | false |
| `active_version` | string | Required for apply | Current configuration version. | Preview may use current version |
| `overwrite` | boolean | Optional | Permit replacing an existing object with different content. | false |
| `expected_credential` | integer | Required for apply | credential_generation returned by preview. | None |
| `expected_digest` | string | Required for apply | package_digest returned by preview. | None |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Response and completion

Configuration-result model. Preview adds valid/items/exists/unchanged/package_digest/credential_generation; apply adds imported/overwritten/restart_required.

### Usage notes

Preview first, then apply the same package with digest,credential generation,and configuration version. Preview again if conditions change.

<a id="automationsourceslist"></a>

## automation.sources.list

List all data sources

**Methods**: GET / POST
**Path**: `/api/v1/automation/sources/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `offset` | integer | Optional | Nonnegative return offset. | 0 |
| `limit` | integer | Optional | Return count; omission does not request truncation. | All |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{}
```

### Response and completion

data.sources/count/total/active_version/load_error/paused; non-root gets restricted metadata.

<a id="automationsourcesremove_mapping"></a>

## automation.sources.remove_mapping

Remove a field mapping from a data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/remove_mapping`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `index` | integer | One selection alternative | Nonnegative mapping index. | None |
| `json_path` | string | One selection alternative | Existing field path. | None |
| `var_name` | string | One selection alternative | Existing variable name. | None |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "index": 0
}
```

### Response and completion

Configuration-result model plus source_id/mapping_count.

<a id="automationsourcesupdate"></a>

## automation.sources.update

Update an existing data source

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/sources/update`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#data-sources).

### Request example

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="automationstart"></a>

## automation.start

Start automation engine

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/start`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

code=0/message reports success. Read automation.status to verify runtime state.

### Usage notes

Engine state,unfinished actions,or storage can reject requests. A stop timeout does not establish that all actions ended.

<a id="automationstatus"></a>

## automation.status

Get automation engine status

**Methods**: GET / POST
**Path**: `/api/v1/automation/status`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data contains engine state, counters, configuration source, and automatic-start information, depending on engine state.

<a id="automationstop"></a>

## automation.stop

Stop automation engine

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/stop`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

code=0/message reports success. Read automation.status to verify runtime state.

### Usage notes

Engine state,unfinished actions,or storage can reject requests. A stop timeout does not establish that all actions ended.

<a id="automationtestdevice"></a>

## automation.test.device

Test device control action

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/test/device`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Required | agx or lpmu. | No default |
| `action` | string | Required | A power/reset action supported by the target. | No default |

### Request example

```json
{
  "device": "agx",
  "action": "on"
}
```

### Response and completion

code=0/message reports control-call success. Read device.status afterward.

### Usage notes

Controls the real target computer.

<a id="automationtestgpio"></a>

## automation.test.gpio

Test GPIO action

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/test/gpio`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `pin` | integer | Required | Supported pin number. | No default |
| `level` | boolean | Required | true=high, false=low. | No default |
| `pulse_ms` | integer | Optional | Pulse duration in milliseconds; 0 means no timed pulse. | 0 |

### Request example

```json
{
  "pin": 1,
  "level": false,
  "pulse_ms": 0
}
```

### Response and completion

code=0/message reports action-call success. Read the target pin separately.

### Usage notes

Operates hardware pins. Verify their function first.

<a id="automationtestled"></a>

## automation.test.led

Test LED action

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/test/led`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Required | Target LED device. | No default |
| `index` | integer | Optional | LED index. | 0 |
| `r` | integer | Optional | Red component, 0-255. | 0 |
| `g` | integer | Optional | Green component, 0-255. | 0 |
| `b` | integer | Optional | Blue component, 0-255. | 0 |

### Request example

```json
{
  "device": "board",
  "r": 0,
  "g": 64,
  "b": 128
}
```

### Response and completion

Action execution result in data.

### Usage notes

Despite test in the name, changes the device.

<a id="automationtestssh"></a>

## automation.test.ssh

Test SSH command execution

**Methods**: POST
**Path**: `/api/v1/automation/test/ssh`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host_id` | string | Required | Saved SSH host configuration ID. | No default |
| `command` | string | Required | Remote command. | No default |
| `timeout_ms` | integer | Optional | Timeout in milliseconds. | 30000 |

### Request example

```json
{
  "host_id": "example-host",
  "command": "uname -a",
  "timeout_ms": 30000
}
```

### Response and completion

Remote execution result; inspect exit code and output.

### Usage notes

Connects and executes; not a syntax-only check.

<a id="automationvariablesdelete"></a>

## automation.variables.delete

Delete a saved user variable

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/variables/delete`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | User-variable name. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `preview` | boolean | Optional | Preview reference impact only. | false |
| `force` | boolean | Optional | Request forced deletion after confirming impact. | false |
| `pause_automation` | boolean | Optional | Pause automation before processing. | false |

See the shared [data model](../response-models.md#variable).

### Request example

```json
{
  "name": "example.temperature",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Response and completion

Configuration-result model, possibly impact.

<a id="automationvariablesget"></a>

## automation.variables.get

Get variable value

**Methods**: GET / POST
**Path**: `/api/v1/automation/variables/get`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Complete variable name. | No default |

See the shared [data model](../response-models.md#variable).

### Request example

```json
{
  "name": "compute.temperature"
}
```

### Response and completion

data contains the variable value and type, source, readonly, and update metadata.

<a id="automationvariableslist"></a>

## automation.variables.list

List all variables

**Methods**: GET / POST
**Path**: `/api/v1/automation/variables/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `configured_only` | boolean | Optional | List only saved user-variable definitions. | false |
| `prefix` | string | Optional | Variable-name prefix filter. | None |
| `source_id` | string | Optional | Filter by source ID. | None |
| `include_value` | boolean | Optional | Include variable values. | true |
| `include_meta` | boolean | Optional | Include timestamps, source, readonly, and other metadata. | true |

See the shared [data model](../response-models.md#variable).

### Request example

```json
{}
```

### Response and completion

data.variables/count. include_value controls value inclusion; include_meta controls time, source, readonly, and related metadata.

<a id="automationvariablesset"></a>

## automation.variables.set

Set variable value

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/automation/variables/set`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | User-variable name. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `value` | boolean / number / string / null | Required | Value to save; do not substitute arrays/objects for numeric temperatures. | No default |
| `create_only` | boolean | Optional | Return an existing value without overwriting it. | false |
| `source_id` | string | Optional | Source identifier. | user |
| `value_type` | integer | Optional | Optional type ID; normally infer from value. | Inferred from value |

See the shared [data model](../response-models.md#variable).

### Request example

```json
{
  "name": "example.temperature",
  "value": 42.5,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration-result model plus name/created/value.

### Usage notes

Readonly/system-source variables may reject changes. Arrays/objects are outside this simplified value model.
