# Pin maintenance APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [gpio.info](#gpioinfo) | Get GPIO pin info |
| [gpio.list](#gpiolist) | List all controllable GPIO pins |
| [gpio.set](#gpioset) | Set GPIO level |
| [gpio.toggle](#gpiotoggle) | Toggle GPIO level |

<a id="gpioinfo"></a>

## gpio.info

Get GPIO pin info

**Methods**: GET / POST
**Path**: `/api/v1/gpio/info`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `pin` | integer | pin or name required | Whitelisted GPIO number from gpio.list. | None |
| `name` | string | pin or name required | Pin name from gpio.list. | None |

### Request example

```json
{
  "name": "AGX_RESET"
}
```

### Response and completion

data.gpio/name/description/level/default/modified.

<a id="gpiolist"></a>

## gpio.list

List all controllable GPIO pins

**Methods**: GET / POST
**Path**: `/api/v1/gpio/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.count/pins; entries gpio/name/description/level/default/modified.

### Usage notes

Advanced maintenance with whitelisted pins only, not arbitrary GPIO access.

<a id="gpioset"></a>

## gpio.set

Set GPIO level

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/gpio/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `pin` | integer | pin or name required | Whitelisted GPIO number from gpio.list. | None |
| `name` | string | pin or name required | Pin name from gpio.list. | None |
| `level` | integer | Required | 0 or 1. | No default |

### Request example

```json
{
  "name": "AGX_RESET",
  "level": 0
}
```

### Response and completion

data.gpio/name/level.

### Usage notes

Pins can control reset,forced shutdown,or USB routing. Verify physical function first.

<a id="gpiotoggle"></a>

## gpio.toggle

Toggle GPIO level

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/gpio/toggle`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `pin` | integer | pin or name required | Whitelisted GPIO number from gpio.list. | None |
| `name` | string | pin or name required | Pin name from gpio.list. | None |

### Request example

```json
{
  "name": "AGX_RESET"
}
```

### Response and completion

data.gpio/name/previous/level.

### Usage notes

Repeats toggle again. Do not replay blindly after a network timeout.
