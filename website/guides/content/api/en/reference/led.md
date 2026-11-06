# Lights and matrix APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [led.boot.config](#ledbootconfig) | Get LED boot configuration |
| [led.brightness](#ledbrightness) | Get/set device brightness |
| [led.clear](#ledclear) | Clear all LEDs on device |
| [led.color.hsv](#ledcolorhsv) | Convert HSV to RGB |
| [led.color.parse](#ledcolorparse) | Parse color string to RGB |
| [led.color_correction.export](#ledcolor_correctionexport) | Export color correction config to SD card |
| [led.color_correction.get](#ledcolor_correctionget) | Get color correction configuration |
| [led.color_correction.import](#ledcolor_correctionimport) | Import color correction config from SD card |
| [led.color_correction.reset](#ledcolor_correctionreset) | Reset color correction to defaults |
| [led.color_correction.set](#ledcolor_correctionset) | Set color correction configuration |
| [led.effect.list](#ledeffectlist) | List available effects |
| [led.effect.start](#ledeffectstart) | Start effect on device |
| [led.effect.stop](#ledeffectstop) | Stop effect on device |
| [led.fill](#ledfill) | Fill all LEDs with color |
| [led.filter.list](#ledfilterlist) | List available post-processing filters |
| [led.filter.start](#ledfilterstart) | Apply post-processing filter |
| [led.filter.stop](#ledfilterstop) | Stop post-processing filter |
| [led.image](#ledimage) | Display image on matrix |
| [led.list](#ledlist) | List LED devices |
| [led.qrcode](#ledqrcode) | Generate and display QR code |
| [led.save](#ledsave) | Save current state as boot configuration |
| [led.set](#ledset) | Set an LED pixel range |
| [led.text](#ledtext) | Display text on matrix |
| [led.text.stop](#ledtextstop) | Stop text overlay |

<a id="ledbootconfig"></a>

## led.boot.config

Get LED boot configuration

**Methods**: GET / POST
**Path**: `/api/v1/led/boot/config`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |

### Request example

```json
{
  "device": "matrix"
}
```

### Response and completion

data.boot_config array: device/enabled/animation/speed/brightness/filter/filter_speed/image_path/qrcode_text.

<a id="ledbrightness"></a>

## led.brightness

Get/set device brightness

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/brightness`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |
| `brightness` | integer | Optional | Brightness, 0-255. | Query only |

### Request example

```json
{
  "device": "matrix",
  "brightness": 64
}
```

### Response and completion

data.device/brightness.

<a id="ledclear"></a>

## led.clear

Clear all LEDs on device

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/clear`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |
| `off` | boolean | Optional | Disable output after clearing. | false |

### Request example

```json
{
  "device": "matrix"
}
```

### Response and completion

data.device/cleared.

### Usage notes

Stops/replaces the current display. Saving startup configuration is separate.

<a id="ledcolorhsv"></a>

## led.color.hsv

Convert HSV to RGB

**Methods**: GET / POST
**Path**: `/api/v1/led/color/hsv`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `h` | integer | Required | Integer hue, 0-359 degrees. | No default |
| `s` | integer | Required | Integer saturation, 0-255. | No default |
| `v` | integer | Required | Integer value/brightness, 0-255. | No default |

See the shared [data model](../response-models.md#color).

### Request example

```json
{
  "h": 200,
  "s": 255,
  "v": 255
}
```

### Response and completion

data.hsv/rgb/hex; see the color model for ranges.

<a id="ledcolorparse"></a>

## led.color.parse

Parse color string to RGB

**Methods**: GET / POST
**Path**: `/api/v1/led/color/parse`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `color` | string | Required | Supported color string, such as #00A0FF. | No default |

### Request example

```json
{
  "color": "#00A0FF"
}
```

### Response and completion

data.input/rgb(r/g/b)/hex/value.

<a id="ledcolor_correctionexport"></a>

## led.color_correction.export

Export color correction config to SD card

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/color_correction/export`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Optional | Absolute SD destination path. | /sdcard/config/led_color_correction.json |

### Request example

```json
{
  "path": "/sdcard/example-color.json"
}
```

### Response and completion

data.path/success.

<a id="ledcolor_correctionget"></a>

## led.color_correction.get

Get color correction configuration

**Methods**: GET / POST
**Path**: `/api/v1/led/color_correction/get`
**Minimum access**: READ

### Parameters

No business parameters.

See the shared [data model](../response-models.md#color).

### Request example

```json
{}
```

### Response and completion

Color-correction configuration: enabled/brightness/gamma/saturation/white_point; see the color model.

<a id="ledcolor_correctionimport"></a>

## led.color_correction.import

Import color correction config from SD card

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/color_correction/import`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |

### Request example

```json
{
  "path": "/sdcard/example-color.json"
}
```

### Response and completion

data.success.

### Usage notes

File reads use the current session. Managed/sensitive paths can require ADMIN.

<a id="ledcolor_correctionreset"></a>

## led.color_correction.reset

Reset color correction to defaults

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/color_correction/reset`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.success.

<a id="ledcolor_correctionset"></a>

## led.color_correction.set

Set color correction configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/color_correction/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Optional | Enable color correction. | Unchanged |
| `brightness` | object | Optional | {enabled:boolean,factor:number}; factor 0-2. | Unchanged |
| `gamma` | object | Optional | {enabled:boolean,gamma:number}; gamma 0.1-4; value is a gamma alias. | Unchanged |
| `saturation` | object | Optional | {enabled:boolean,factor:number}; factor 0-2. | Unchanged |
| `white_point` | object | Optional | White-point RGB gains; see the color model. | Unchanged |

See the shared [data model](../response-models.md#color).

### Request example

```json
{
  "enabled": true
}
```

### Response and completion

data.success.

### Usage notes

Read current settings and change only intended fields. Correction differs from per-device brightness 0-255.

<a id="ledeffectlist"></a>

## led.effect.list

List available effects

**Methods**: GET / POST
**Path**: `/api/v1/led/effect/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.effects; led.list also reports device support.

<a id="ledeffectstart"></a>

## led.effect.start

Start effect on device

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/effect/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |
| `effect` | string | Required | Effect name from the supported list. | No default |
| `speed` | integer | Optional | Animation speed, 1-100. | 50 |
| `color` | string / object / integer | Optional | Color string, {r,g,b}, or a decimal 0xRRGGBB integer; components 0-255. | Effect default color |

### Request example

```json
{
  "device": "matrix",
  "effect": "rainbow",
  "speed": 50
}
```

### Response and completion

data.device/effect/speed/started.

### Usage notes

Confirm the example effect is supported. A new effect replaces the current one.

<a id="ledeffectstop"></a>

## led.effect.stop

Stop effect on device

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/effect/stop`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |

### Request example

```json
{
  "device": "matrix"
}
```

### Response and completion

data.device/stopped.

<a id="ledfill"></a>

## led.fill

Fill all LEDs with color

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/fill`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |
| `color` | string / object / integer | Required | Color string, {r,g,b}, or a decimal 0xRRGGBB integer; components 0-255. | No default |

### Request example

```json
{
  "device": "board",
  "color": "#00A0FF"
}
```

### Response and completion

data.device/color(r/g/b)/success.

<a id="ledfilterlist"></a>

## led.filter.list

List available post-processing filters

**Methods**: GET / POST
**Path**: `/api/v1/led/filter/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.filters with name/description.

<a id="ledfilterstart"></a>

## led.filter.start

Apply post-processing filter

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/filter/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |
| `filter` | string | Required | Select from led.filter.list. | No default |
| `speed` | integer | Optional | Filter speed. | 50 |
| `intensity` | number | Optional | Intensity. | Filter default |
| `amount` | number | Optional | Effect amount. | Filter default |
| `scale` | number | Optional | Spatial scale. | Filter default |
| `angle` | number | Optional | Angle. | Filter default |
| `frequency` | number | Optional | Frequency. | Filter default |
| `amplitude` | number | Optional | Amplitude. | Filter default |
| `wavelength` | number | Optional | Wavelength. | Filter default |
| `width` | number | Optional | Width. | Filter default |
| `saturation` | number | Optional | Saturation. | Filter default |
| `levels` | number | Optional | Number of levels. | Filter default |
| `decay` | number | Optional | Decay. | Filter default |
| `density` | number | Optional | Density. | Filter default |

### Request example

```json
{
  "device": "matrix",
  "filter": "YOUR_FILTER",
  "speed": 50
}
```

### Response and completion

data.device/filter/speed/applied.

### Usage notes

Options affect only filters using them. Configure the selected filter rather than applying every option indiscriminately.

<a id="ledfilterstop"></a>

## led.filter.stop

Stop post-processing filter

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/filter/stop`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |

### Request example

```json
{
  "device": "matrix"
}
```

### Response and completion

data.device/stopped.

<a id="ledimage"></a>

## led.image

Display image on matrix

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/image`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target display device. | matrix |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |
| `center` | boolean | Optional | Center the image. | true |

### Request example

```json
{
  "device": "matrix",
  "path": "/sdcard/example.png",
  "center": true
}
```

### Response and completion

data.device/path/displayed/width/height/animated/frames.

### Usage notes

Requires supported image format and a valid file. Sensitive reads retain path checks.

<a id="ledlist"></a>

## led.list

List LED devices

**Methods**: GET / POST
**Path**: `/api/v1/led/list`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.devices with name/count/brightness/layout/effects/current; current has animation/speed/on/color.

<a id="ledqrcode"></a>

## led.qrcode

Generate and display QR code

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/qrcode`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target display device. | matrix |
| `text` | string | Required | Content to encode. | No default |
| `ecc` | string | Optional | Error-correction level L/M/Q/H. | L |
| `bg_image` | string | Optional | Optional absolute background-image path. | None |
| `color` | string / object / integer | Optional | Color string, {r,g,b}, or a decimal 0xRRGGBB integer; components 0-255. | Default foreground |

### Request example

```json
{
  "device": "matrix",
  "text": "https://example.com",
  "ecc": "L"
}
```

### Response and completion

data.device/text/version/size/capacity/displayed.

### Usage notes

Capacity depends on text length,matrix size,and ECC. Background reads have path checks.

<a id="ledsave"></a>

## led.save

Save current state as boot configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/save`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | LED device name: touch/board/matrix; use led.list as authority. | All LED devices |

### Request example

```json
{
  "device": "board"
}
```

### Response and completion

data.device/saved/animation/brightness/speed. Treat it as startup configuration only after saving succeeds.

<a id="ledset"></a>

## led.set

Set an LED pixel range

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Required | LED device name: touch/board/matrix; use led.list as authority. | No default |
| `color` | string / object / integer | Required | Color string, {r,g,b}, or a decimal 0xRRGGBB integer; components 0-255. | No default |
| `index` | integer | Optional | Zero-based first pixel; must be below the device pixel count. | 0 |
| `count` | integer | Optional | Positive number of consecutive pixels; the range must fit the device. | 1 with index; otherwise all pixels |

### Request example

```json
{
  "device": "board",
  "index": 0,
  "count": 1,
  "color": {
    "r": 0,
    "g": 64,
    "b": 128
  }
}
```

### Response and completion

data.device/start/count/color (r/g/b)/success.

### Usage notes

Stops the target-layer animation and enables the device. Omitting index/count fills the whole device; index alone writes one pixel. A full fill updates the current solid-color preset. Persistent saving is a separate lighting-configuration step.

<a id="ledtext"></a>

## led.text

Display text on matrix

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/text`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target device. | matrix |
| `text` | string | Required | Display text. | No default |
| `font` | string | Optional | Supported font name. | cjk; loads /sdcard/fonts/<font>.fnt |
| `x` | integer | Optional | Starting horizontal coordinate. | Default position |
| `y` | integer | Optional | Starting vertical coordinate. | Default position |
| `align` | string | Optional | left/center/right. | left |
| `scroll` | string | Optional | none/left/right/up/down. | none |
| `speed` | integer | Optional | Scroll speed. | 30 |
| `loop` | boolean | Optional | Loop the scrolling text. | false |
| `invert` | boolean | Optional | Invert overlapping output. | false |
| `color` | string / object / integer | Optional | Color string, {r,g,b}, or a decimal 0xRRGGBB integer; components 0-255. | White |

### Request example

```json
{
  "device": "matrix",
  "text": "Ready",
  "scroll": "none"
}
```

### Response and completion

data.device/text/font/displayed.

### Usage notes

Character availability depends on the selected font.

<a id="ledtextstop"></a>

## led.text.stop

Stop text overlay

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/led/text/stop`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device` | string | Optional | Target device. | matrix |

### Request example

```json
{
  "device": "matrix"
}
```

### Response and completion

data.device/stopped.
