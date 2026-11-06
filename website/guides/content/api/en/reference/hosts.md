# SSH fingerprints APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [hosts.clear](#hostsclear) | Clear all known hosts |
| [hosts.info](#hostsinfo) | Get known host info |
| [hosts.list](#hostslist) | List all known SSH hosts |
| [hosts.remove](#hostsremove) | Remove a known host |
| [hosts.update](#hostsupdate) | Force update a host fingerprint |

<a id="hostsclear"></a>

## hosts.clear

Clear all known hosts

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/hosts/clear`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.cleared.

### Usage notes

Affects later SSH/SFTP trust checks; does not delete saved host connection definitions.

<a id="hostsinfo"></a>

## hosts.info

Get known host info

**Methods**: GET / POST
**Path**: `/api/v1/hosts/info`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | Remote address; trust records match address and port. | No default |
| `port` | integer | Optional | SSH port, 1-65535. | 22 |

### Request example

```json
{
  "host": "192.0.2.20",
  "port": 22
}
```

### Response and completion

data.host/port/type/fingerprint/added.

<a id="hostslist"></a>

## hosts.list

List all known SSH hosts

**Methods**: GET / POST
**Path**: `/api/v1/hosts/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.hosts/count; entries host/port/type/fingerprint/added.

<a id="hostsremove"></a>

## hosts.remove

Remove a known host

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/hosts/remove`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | Remote address; trust records match address and port. | No default |
| `port` | integer | Optional | SSH port, 1-65535. | 22 |

### Request example

```json
{
  "host": "192.0.2.20"
}
```

### Response and completion

data.host/port/removed.

### Usage notes

Removing trust does not revoke remote users/keys. Verify identity again before the next connection.

<a id="hostsupdate"></a>

## hosts.update

Force update a host fingerprint

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/hosts/update`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | Remote address; trust records match address and port. | No default |
| `port` | integer | Optional | SSH port, 1-65535. | 22 |

### Request example

```json
{
  "host": "192.0.2.20"
}
```

### Response and completion

data.host/port/updated/message.

### Usage notes

Connects to the remote host and updates trust. Independently verify its identity first.
