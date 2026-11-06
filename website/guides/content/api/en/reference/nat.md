# Network forwarding APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [nat.disable](#natdisable) | Disable NAT gateway |
| [nat.enable](#natenable) | Enable NAT gateway |
| [nat.save](#natsave) | Save NAT configuration |
| [nat.status](#natstatus) | Get NAT gateway status |

<a id="natdisable"></a>

## nat.disable

Disable NAT gateway

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/nat/disable`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.success.

### Usage notes

Enabling requires connected WiFi STA. Save runtime changes with nat.save.

<a id="natenable"></a>

## nat.enable

Enable NAT gateway

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/nat/enable`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.success.

### Usage notes

Enabling requires connected WiFi STA. Save runtime changes with nat.save.

<a id="natsave"></a>

## nat.save

Save NAT configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/nat/save`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.success.

### Usage notes

Enabling requires connected WiFi STA. Save runtime changes with nat.save.

<a id="natstatus"></a>

## nat.status

Get NAT gateway status

**Methods**: GET / POST
**Path**: `/api/v1/nat/status`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.enabled/state/wifi_connected/eth_up.

### Usage notes

Enabling requires connected WiFi STA. Save runtime changes with nat.save.
