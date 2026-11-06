# 灯光与矩阵接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [led.boot.config](#ledbootconfig) | 读取启动显示配置 |
| [led.brightness](#ledbrightness) | 查询或修改亮度 |
| [led.clear](#ledclear) | 清空显示 |
| [led.color.hsv](#ledcolorhsv) | 将 HSV 转换为 RGB |
| [led.color.parse](#ledcolorparse) | 解析颜色表示 |
| [led.color_correction.export](#ledcolor_correctionexport) | 保存颜色校正文件 |
| [led.color_correction.get](#ledcolor_correctionget) | 读取颜色校正 |
| [led.color_correction.import](#ledcolor_correctionimport) | 从文件导入颜色校正 |
| [led.color_correction.reset](#ledcolor_correctionreset) | 恢复默认颜色校正 |
| [led.color_correction.set](#ledcolor_correctionset) | 修改颜色校正 |
| [led.effect.list](#ledeffectlist) | 列出动画名称 |
| [led.effect.start](#ledeffectstart) | 启动灯光动画 |
| [led.effect.stop](#ledeffectstop) | 停止灯光动画 |
| [led.fill](#ledfill) | 设置整灯颜色 |
| [led.filter.list](#ledfilterlist) | 列出显示滤镜 |
| [led.filter.start](#ledfilterstart) | 应用显示滤镜 |
| [led.filter.stop](#ledfilterstop) | 停止显示滤镜 |
| [led.image](#ledimage) | 在矩阵上显示图片 |
| [led.list](#ledlist) | 列出灯光和矩阵设备 |
| [led.qrcode](#ledqrcode) | 显示二维码 |
| [led.save](#ledsave) | 把当前显示保存为启动配置 |
| [led.set](#ledset) | 设置灯光像素范围 |
| [led.text](#ledtext) | 显示矩阵文字 |
| [led.text.stop](#ledtextstop) | 停止滚动文字 |

<a id="ledbootconfig"></a>

## led.boot.config

读取启动显示配置

**方法**：GET / POST
**路径**：`/api/v1/led/boot/config`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |

### 请求示例

```json
{
  "device": "matrix"
}
```

### 返回与完成条件

data.boot_config数组，每项device/enabled/animation/speed/brightness/filter/filter_speed/image_path/qrcode_text。

<a id="ledbrightness"></a>

## led.brightness

查询或修改亮度

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/brightness`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |
| `brightness` | integer | 可选 | 亮度0–255。 | 省略时只查询 |

### 请求示例

```json
{
  "device": "matrix",
  "brightness": 64
}
```

### 返回与完成条件

data.device/brightness。

<a id="ledclear"></a>

## led.clear

清空显示

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/clear`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |
| `off` | boolean | 可选 | 清空后是否关闭设备输出。 | false |

### 请求示例

```json
{
  "device": "matrix"
}
```

### 返回与完成条件

data.device/cleared。

### 使用要点

会停止或替换当前显示，启动配置保存需另行操作。

<a id="ledcolorhsv"></a>

## led.color.hsv

将 HSV 转换为 RGB

**方法**：GET / POST
**路径**：`/api/v1/led/color/hsv`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `h` | integer | 必填 | 色相整数0–359，度。 | 无默认值 |
| `s` | integer | 必填 | 饱和度整数0–255。 | 无默认值 |
| `v` | integer | 必填 | 明度整数0–255。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#color).

### 请求示例

```json
{
  "h": 200,
  "s": 255,
  "v": 255
}
```

### 返回与完成条件

data.hsv/rgb/hex；数值范围见颜色模型。

<a id="ledcolorparse"></a>

## led.color.parse

解析颜色表示

**方法**：GET / POST
**路径**：`/api/v1/led/color/parse`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `color` | string | 必填 | 支持的颜色字符串，例如#00A0FF。 | 无默认值 |

### 请求示例

```json
{
  "color": "#00A0FF"
}
```

### 返回与完成条件

data.input/rgb（r/g/b）/hex/value。

<a id="ledcolor_correctionexport"></a>

## led.color_correction.export

保存颜色校正文件

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/color_correction/export`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 可选 | 要写入的SD绝对路径。 | /sdcard/config/led_color_correction.json |

### 请求示例

```json
{
  "path": "/sdcard/example-color.json"
}
```

### 返回与完成条件

data.path/success。

<a id="ledcolor_correctionget"></a>

## led.color_correction.get

读取颜色校正

**方法**：GET / POST
**路径**：`/api/v1/led/color_correction/get`
**最低权限**：READ

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#color).

### 请求示例

```json
{}
```

### 返回与完成条件

data 为颜色校正配置，字段含enabled/brightness/gamma/saturation/white_point，见颜色模型。

<a id="ledcolor_correctionimport"></a>

## led.color_correction.import

从文件导入颜色校正

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/color_correction/import`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example-color.json"
}
```

### 返回与完成条件

data.success。

### 使用要点

文件读取按当前会话检查；受管或敏感路径可能需ADMIN。

<a id="ledcolor_correctionreset"></a>

## led.color_correction.reset

恢复默认颜色校正

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/color_correction/reset`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.success。

<a id="ledcolor_correctionset"></a>

## led.color_correction.set

修改颜色校正

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/color_correction/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 可选 | 启用校正。 | 省略时不修改 |
| `brightness` | object | 可选 | {enabled:boolean,factor:number}，factor为0–2。 | 省略时不修改 |
| `gamma` | object | 可选 | {enabled:boolean,gamma:number}，gamma为0.1–4；value是gamma的兼容字段。 | 省略时不修改 |
| `saturation` | object | 可选 | {enabled:boolean,factor:number}，factor为0–2。 | 省略时不修改 |
| `white_point` | object | 可选 | 白点r/g/b增益，见颜色模型。 | 省略时不修改 |

共享字段或返回说明见[数据模型](../response-models.md#color).

### 请求示例

```json
{
  "enabled": true
}
```

### 返回与完成条件

data.success。

### 使用要点

先读取当前值，只修改需要的字段；它与单设备0–255亮度不同。

<a id="ledeffectlist"></a>

## led.effect.list

列出动画名称

**方法**：GET / POST
**路径**：`/api/v1/led/effect/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.effects；具体设备支持项也可从led.list读取。

<a id="ledeffectstart"></a>

## led.effect.start

启动灯光动画

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/effect/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |
| `effect` | string | 必填 | 从设备支持列表选取的动画名。 | 无默认值 |
| `speed` | integer | 可选 | 动画速度1–100。 | 50 |
| `color` | string / object / integer | 可选 | 颜色字符串、{r,g,b} 对象或 0xRRGGBB 的十进制整数；RGB 分量0–255。 | 动画默认色 |

### 请求示例

```json
{
  "device": "matrix",
  "effect": "rainbow",
  "speed": 50
}
```

### 返回与完成条件

data.device/effect/speed/started。

### 使用要点

示例动画名需先确认设备支持；新动画会替换当前效果。

<a id="ledeffectstop"></a>

## led.effect.stop

停止灯光动画

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/effect/stop`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |

### 请求示例

```json
{
  "device": "matrix"
}
```

### 返回与完成条件

data.device/stopped。

<a id="ledfill"></a>

## led.fill

设置整灯颜色

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/fill`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |
| `color` | string / object / integer | 必填 | 颜色字符串、{r,g,b} 对象或 0xRRGGBB 的十进制整数；RGB 分量0–255。 | 无默认值 |

### 请求示例

```json
{
  "device": "board",
  "color": "#00A0FF"
}
```

### 返回与完成条件

data.device/color（r/g/b）/success。

<a id="ledfilterlist"></a>

## led.filter.list

列出显示滤镜

**方法**：GET / POST
**路径**：`/api/v1/led/filter/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.filters，含name/description。

<a id="ledfilterstart"></a>

## led.filter.start

应用显示滤镜

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/filter/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |
| `filter` | string | 必填 | 从led.filter.list选取。 | 无默认值 |
| `speed` | integer | 可选 | 滤镜速度。 | 50 |
| `intensity` | number | 可选 | 强度 | 按滤镜默认 |
| `amount` | number | 可选 | 效果量 | 按滤镜默认 |
| `scale` | number | 可选 | 空间比例 | 按滤镜默认 |
| `angle` | number | 可选 | 角度 | 按滤镜默认 |
| `frequency` | number | 可选 | 频率 | 按滤镜默认 |
| `amplitude` | number | 可选 | 幅度 | 按滤镜默认 |
| `wavelength` | number | 可选 | 波长 | 按滤镜默认 |
| `width` | number | 可选 | 宽度 | 按滤镜默认 |
| `saturation` | number | 可选 | 饱和度 | 按滤镜默认 |
| `levels` | number | 可选 | 分级数量 | 按滤镜默认 |
| `decay` | number | 可选 | 衰减 | 按滤镜默认 |
| `density` | number | 可选 | 密度 | 按滤镜默认 |

### 请求示例

```json
{
  "device": "matrix",
  "filter": "YOUR_FILTER",
  "speed": 50
}
```

### 返回与完成条件

data.device/filter/speed/applied。

### 使用要点

各扩展参数只对使用它的滤镜生效，按所选效果调整，不把全部参数同时套用。

<a id="ledfilterstop"></a>

## led.filter.stop

停止显示滤镜

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/filter/stop`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |

### 请求示例

```json
{
  "device": "matrix"
}
```

### 返回与完成条件

data.device/stopped。

<a id="ledimage"></a>

## led.image

在矩阵上显示图片

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/image`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标显示设备。 | matrix |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |
| `center` | boolean | 可选 | 是否居中。 | true |

### 请求示例

```json
{
  "device": "matrix",
  "path": "/sdcard/example.png",
  "center": true
}
```

### 返回与完成条件

data.device/path/displayed/width/height/animated/frames。

### 使用要点

需要设备支持的图像格式和有效文件；读取敏感路径仍受权限限制。

<a id="ledlist"></a>

## led.list

列出灯光和矩阵设备

**方法**：GET / POST
**路径**：`/api/v1/led/list`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.devices；每项name/count/brightness/layout/effects/current，current含animation/speed/on/color。

<a id="ledqrcode"></a>

## led.qrcode

显示二维码

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/qrcode`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标显示设备。 | matrix |
| `text` | string | 必填 | 要编码的内容。 | 无默认值 |
| `ecc` | string | 可选 | 纠错等级L/M/Q/H。 | L |
| `bg_image` | string | 可选 | 可选背景图片绝对路径。 | 无 |
| `color` | string / object / integer | 可选 | 颜色字符串、{r,g,b} 对象或 0xRRGGBB 的十进制整数；RGB 分量0–255。 | 默认前景色 |

### 请求示例

```json
{
  "device": "matrix",
  "text": "https://example.com",
  "ecc": "L"
}
```

### 返回与完成条件

data.device/text/version/size/capacity/displayed。

### 使用要点

内容长度与矩阵尺寸、纠错等级共同决定是否能显示；背景读取有路径权限检查。

<a id="ledsave"></a>

## led.save

把当前显示保存为启动配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/save`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 全部灯光设备 |

### 请求示例

```json
{
  "device": "board"
}
```

### 返回与完成条件

data.device/saved/animation/brightness/speed；保存成功后才将其当作启动配置。

<a id="ledset"></a>

## led.set

设置灯光像素范围

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 必填 | 灯光设备名：touch、board、matrix，以 led.list 为准。 | 无默认值 |
| `color` | string / object / integer | 必填 | 颜色字符串、{r,g,b} 对象或 0xRRGGBB 的十进制整数；RGB 分量0–255。 | 无默认值 |
| `index` | integer | 可选 | 起始像素索引，0起；必须小于设备像素总数。 | 0 |
| `count` | integer | 可选 | 连续写入的像素数，正整数，范围不能越过设备末端。 | 有index时1，否则全部像素 |

### 请求示例

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

### 返回与完成条件

data.device/start/count/color（r/g/b）/success。

### 使用要点

停止目标层动画并启用设备。省略index和count时设置整灯；只给index时设置一个像素。整灯填色会更新当前纯色预设；持久保存另按灯光配置流程处理。

<a id="ledtext"></a>

## led.text

显示矩阵文字

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/text`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标设备。 | matrix |
| `text` | string | 必填 | 显示文字。 | 无默认值 |
| `font` | string | 可选 | 支持的字体名。 | cjk；从/sdcard/fonts/<font>.fnt加载 |
| `x` | integer | 可选 | 起始横坐标。 | 默认位置 |
| `y` | integer | 可选 | 起始纵坐标。 | 默认位置 |
| `align` | string | 可选 | left/center/right。 | left |
| `scroll` | string | 可选 | none/left/right/up/down。 | none |
| `speed` | integer | 可选 | 滚动速度。 | 30 |
| `loop` | boolean | 可选 | 是否循环。 | false |
| `invert` | boolean | 可选 | 是否反色。 | false |
| `color` | string / object / integer | 可选 | 颜色字符串、{r,g,b} 对象或 0xRRGGBB 的十进制整数；RGB 分量0–255。 | 白色 |

### 请求示例

```json
{
  "device": "matrix",
  "text": "Ready",
  "scroll": "none"
}
```

### 返回与完成条件

data.device/text/font/displayed。

### 使用要点

字符是否可显示取决于所选字体。

<a id="ledtextstop"></a>

## led.text.stop

停止滚动文字

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/led/text/stop`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 可选 | 目标设备。 | matrix |

### 请求示例

```json
{
  "device": "matrix"
}
```

### 返回与完成条件

data.device/stopped。
