# SSH connections and commands APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [ssh.cancel](#sshcancel) | Cancel running SSH exec session |
| [ssh.commands.add](#sshcommandsadd) | Add or update SSH command configuration |
| [ssh.commands.export](#sshcommandsexport) | Export SSH command configuration as .tscfg |
| [ssh.commands.get](#sshcommandsget) | Get SSH command configuration by ID |
| [ssh.commands.import](#sshcommandsimport) | Import SSH command configuration from .tscfg |
| [ssh.commands.list](#sshcommandslist) | List all SSH command configurations |
| [ssh.commands.remove](#sshcommandsremove) | Remove SSH command configuration |
| [ssh.commands.update](#sshcommandsupdate) | Update an existing SSH commands configuration |
| [ssh.copyid](#sshcopyid) | Deploy public key to remote server |
| [ssh.exec](#sshexec) | Execute remote command via SSH |
| [ssh.exec_status](#sshexec_status) | Read owned current or latest SSH result |
| [ssh.exec_stream](#sshexec_stream) | Execute remote command with streaming output via WebSocket |
| [ssh.hosts.add](#sshhostsadd) | Add SSH host configuration |
| [ssh.hosts.export](#sshhostsexport) | Export SSH host configuration as .tscfg |
| [ssh.hosts.get](#sshhostsget) | Get SSH host configuration by ID |
| [ssh.hosts.import](#sshhostsimport) | Import SSH host configuration from .tscfg |
| [ssh.hosts.list](#sshhostslist) | List all SSH host configurations |
| [ssh.hosts.remove](#sshhostsremove) | Remove SSH host configuration |
| [ssh.hosts.update](#sshhostsupdate) | Update an existing SSH hosts configuration |
| [ssh.keygen](#sshkeygen) | Generate SSH key pair |
| [ssh.revoke](#sshrevoke) | Revoke (remove) deployed public key from remote server |
| [ssh.services.start](#sshservicesstart) | Start a stored managed service |
| [ssh.test](#sshtest) | Test SSH connection |

<a id="sshcancel"></a>

## ssh.cancel

Cancel running SSH exec session

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/cancel`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `session_id` | integer | Required | Execution ID returned by ssh.exec_stream. | No default |
| `boot_id` | string | Optional | When supplied with result_key, must match the start receipt. The initiating login session may omit both. | No default |
| `result_key` | string | Optional | Private receipt key supplied together with boot_id. | No default |

### Request example

```json
{
  "session_id": 1
}
```

### Response and completion

data.cancelled=true accepts cancellation intent; continue querying final status.

### Usage notes

Requires the initiating login session; another root session cannot cancel it. A supplied receipt is still checked as a complete matching pair. cancelled acknowledges intent only; exec_status still needs the complete receipt.

<a id="sshcommandsadd"></a>

## ssh.commands.add

Add or update SSH command configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/commands/add`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#ssh-commands).

### Request example

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="sshcommandsexport"></a>

## ssh.commands.export

Export SSH command configuration as .tscfg

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/commands/export`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `recipient_cert` | string | Optional | Recipient certificate PEM; omission encrypts for this device. | This device certificate |
| `include_host` | boolean | Optional | Include the dependent host definition in export. | false |

See the shared [data model](../configuration-models.md#ssh-commands).

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

<a id="sshcommandsget"></a>

## ssh.commands.get

Get SSH command configuration by ID

**Methods**: GET / POST
**Path**: `/api/v1/ssh/commands/get`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |

See the shared [data model](../configuration-models.md#ssh-commands).

### Request example

```json
{
  "id": "example"
}
```

### Response and completion

One SSH command and active_version; below-ADMIN fields are filtered.

<a id="sshcommandsimport"></a>

## ssh.commands.import

Import SSH command configuration from .tscfg

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/commands/import`
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

See the shared [data model](../configuration-models.md#ssh-commands).

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

<a id="sshcommandslist"></a>

## ssh.commands.list

List all SSH command configurations

**Methods**: GET / POST
**Path**: `/api/v1/ssh/commands/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `offset` | integer | Optional | Nonnegative return offset. | 0 |
| `limit` | integer | Optional | Return count; omission does not request truncation. | All |
| `host_id` | string | Optional | Filter by saved host ID. | All |

See the shared [data model](../configuration-models.md#ssh-commands).

### Request example

```json
{}
```

### Response and completion

data.commands/count/total/active_version/load_error/paused; below-ADMIN gets restricted metadata.

<a id="sshcommandsremove"></a>

## ssh.commands.remove

Remove SSH command configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/commands/remove`
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

See the shared [data model](../configuration-models.md#ssh-commands).

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

<a id="sshcommandsupdate"></a>

## ssh.commands.update

Update an existing SSH commands configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/commands/update`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#ssh-commands).

### Request example

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="sshcopyid"></a>

## ssh.copyid

Deploy public key to remote server

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/copyid`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | Remote address. | No default |
| `user` | string | Required | Remote account. | No default |
| `port` | integer | Optional | SSH port. | 22 |
| `password` | string | Required | Password for this remote authentication. | No default |
| `keyid` | string | Required | Local key ID whose public key is being deployed/revoked. | No default |
| `trust_new` | boolean | Optional | Accept a new host only after independent verification. | false |
| `accept_changed` | boolean | Optional | Accept a changed host fingerprint only after verification. | false |
| `confirmed_fingerprint` | string | Optional | Verified fingerprint matching the host being confirmed. | None |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |
| `verify` | boolean | Optional | Verify after deployment. | true |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

data.deployed/verified/registered/registration_error,host_id and host/key details. Check remote deployment separately from local registration.

### Usage notes

Remote deployment can succeed while local registration fails. Do not immediately install again.

<a id="sshexec"></a>

## ssh.exec

Execute remote command via SSH

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/exec`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `command` | string | Required | Remote command text. | No default |
| `timeout_ms` | integer | Optional | Connection/execution deadline in milliseconds. | SSH default |
| `trust_new` | boolean | Optional | Accept a new host only after independent verification. | false |
| `accept_changed` | boolean | Optional | Accept a changed host fingerprint only after verification. | false |
| `confirmed_fingerprint` | string | Optional | Verified fingerprint matching the host being confirmed. | None |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a"
}
```

### Response and completion

data.stdout/stderr/exit_code/host_status/fingerprint. Check exit code and application output.

### Usage notes

Unknown/changed fingerprints return confirmation information. Verify before accepting. A nonzero remote exit code need not make top-level code nonzero.

<a id="sshexec_status"></a>

## ssh.exec_status

Read owned current or latest SSH result

**Methods**: GET / POST
**Path**: `/api/v1/ssh/exec_status`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `session_id` | integer | Required | Execution ID returned by ssh.exec_stream. | No default |
| `boot_id` | string | Required | 32-character hexadecimal boot identity from the receipt. | No default |
| `result_key` | string | Required | 32-character hexadecimal result credential from the receipt. | No default |

### Request example

```json
{
  "session_id": 1,
  "boot_id": "00000000000000000000000000000000",
  "result_key": "00000000000000000000000000000000"
}
```

### Response and completion

data uses WebSocket result format: ssh_exec_running while active, ssh_exec_done/cancelled/error at termination. Check status/exit_code/success and output completeness.

### Usage notes

Requires the initiating session and correct receipt. Zero-filled sample values show shape only; use the actual start response. Querying does not rerun the command.

<a id="sshexec_stream"></a>

## ssh.exec_stream

Execute remote command with streaming output via WebSocket

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/exec_stream`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `command` | string | Required | Command text. | No default |
| `expect_pattern` | string | Optional | Success-match pattern. | Unchanged |
| `fail_pattern` | string | Optional | Failure-match pattern. | Unchanged |
| `extract_pattern` | string | Optional | Output-extraction pattern. | Unchanged |
| `var_name` | string | Optional | Result-variable prefix. | Unchanged |
| `timeout` | integer | Optional | Milliseconds here, unlike saved-command timeout_sec. | Default execution deadline |
| `collect_output` | boolean | Optional | Retain collected output. | true |
| `max_output_size` | integer | Optional | Output-collection limit in bytes. | Device default |
| `stop_on_match` | boolean | Optional | Stop after a match. | false |
| `command_id` | string | Optional pair with command_instance | Associated saved-command ID. | None |
| `command_instance` | string | Optional pair with command_id | 16-character lowercase hexadecimal identity matching runtime_instance from the list. | None |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a",
  "collect_output": true
}
```

### Response and completion

data.session_id/boot_id/result_key. Preserve the receipt before consuming WebSocket results or querying ssh.exec_status.

### Usage notes

Exclusive streaming slot. No generic keypath authentication here. Verify ownership,terminal status,and output completeness.

<a id="sshhostsadd"></a>

## ssh.hosts.add

Add SSH host configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/hosts/add`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#ssh-hosts).

### Request example

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="sshhostsexport"></a>

## ssh.hosts.export

Export SSH host configuration as .tscfg

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/hosts/export`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `recipient_cert` | string | Optional | Recipient certificate PEM; omission encrypts for this device. | This device certificate |

See the shared [data model](../configuration-models.md#ssh-hosts).

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

<a id="sshhostsget"></a>

## ssh.hosts.get

Get SSH host configuration by ID

**Methods**: GET / POST
**Path**: `/api/v1/ssh/hosts/get`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |

See the shared [data model](../configuration-models.md#ssh-hosts).

### Request example

```json
{
  "id": "example"
}
```

### Response and completion

One host and active_version; below-ADMIN fields are filtered.

<a id="sshhostsimport"></a>

## ssh.hosts.import

Import SSH host configuration from .tscfg

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/hosts/import`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Required | Complete package JSON text supplied as a string. | No default |
| `preview` | boolean | Optional | Preview only when true. | false |
| `active_version` | string | Required for apply | Current configuration version. | Preview may use current version |
| `overwrite` | boolean | Optional | Permit replacing an existing object with different content. | false |
| `expected_credential` | integer | Required for apply | credential_generation returned by preview. | None |
| `expected_digest` | string | Required for apply | package_digest returned by preview. | None |

See the shared [data model](../configuration-models.md#ssh-hosts).

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

<a id="sshhostslist"></a>

## ssh.hosts.list

List all SSH host configurations

**Methods**: GET / POST
**Path**: `/api/v1/ssh/hosts/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `offset` | integer | Optional | Nonnegative return offset. | 0 |
| `limit` | integer | Optional | Return count; omission does not request truncation. | All |

See the shared [data model](../configuration-models.md#ssh-hosts).

### Request example

```json
{}
```

### Response and completion

data.hosts/count/total/active_version/load_error/paused; below-ADMIN gets restricted metadata.

<a id="sshhostsremove"></a>

## ssh.hosts.remove

Remove SSH host configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/hosts/remove`
**Minimum access**: ADMIN

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

See the shared [data model](../configuration-models.md#ssh-hosts).

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

<a id="sshhostsupdate"></a>

## ssh.hosts.update

Update an existing SSH hosts configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/hosts/update`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Stable object ID; retain the existing ID after reading. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

See the shared [data model](../configuration-models.md#ssh-hosts).

### Request example

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

Configuration result with active_version/source/loaded/configured/enabled/paused/saved/uncertain and error location. See the complete config-result model.

### Usage notes

Add requires an unused ID; update requires an existing object. See complete model examples.

<a id="sshkeygen"></a>

## ssh.keygen

Generate SSH key pair

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/keygen`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Key ID. | No default |
| `type` | string | Optional | Key type accepted here, such as rsa2048/rsa4096/ec256/ec384. | rsa2048 |
| `comment` | string | Optional | Public-key comment. | Empty |

### Request example

```json
{
  "id": "example-key",
  "type": "ec256"
}
```

### Response and completion

data.id/type/public_key.

### Usage notes

Prefer key.generate for new integrations; supported parameters differ.

<a id="sshrevoke"></a>

## ssh.revoke

Revoke (remove) deployed public key from remote server

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/revoke`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | Remote address. | No default |
| `user` | string | Required | Remote account. | No default |
| `port` | integer | Optional | SSH port. | 22 |
| `password` | string | Required | Password for this remote authentication. | No default |
| `keyid` | string | Required | Local key ID whose public key is being deployed/revoked. | No default |
| `trust_new` | boolean | Optional | Accept a new host only after independent verification. | false |
| `accept_changed` | boolean | Optional | Accept a changed host fingerprint only after verification. | false |
| `confirmed_fingerprint` | string | Optional | Verified fingerprint matching the host being confirmed. | None |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key"
}
```

### Response and completion

data.revoked/found/removed_count and remote details.

### Usage notes

Removes the specified public key only, not local keys,host definitions,or remote processes.

<a id="sshservicesstart"></a>

## ssh.services.start

Start a stored managed service

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/services/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `command_id` | string | Required | Saved command ID configured as a managed service. | No default |
| `active_version` | string | Required | Latest active_version from configuration state; reread after changes. | No default |

### Request example

```json
{
  "command_id": "example-service",
  "active_version": "CURRENT_VERSION"
}
```

### Response and completion

data.operation_id/run_id; verify with automation.services.status.

### Usage notes

Uses saved configuration. Distinguish process running from application ready even after call success.

<a id="sshtest"></a>

## ssh.test

Test SSH connection

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ssh/test`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `trust_new` | boolean | Optional | Accept a new host only after independent verification. | false |
| `accept_changed` | boolean | Optional | Accept a changed host fingerprint only after verification. | false |
| `confirmed_fingerprint` | string | Optional | Verified fingerprint matching the host being confirmed. | None |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key"
}
```

### Response and completion

data.success/host/port/user/host_status/fingerprint; connection failure may include stage/reason/error and fingerprints.

### Usage notes

Establishes connection/authentication conditions, not the usability of every remote command/service.
