# 风扇接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [fan.config](#fanconfig) | 读取风扇配置 |
| [fan.curve](#fancurve) | 设置温度调速曲线 |
| [fan.enable](#fanenable) | 启用或停用风扇 |
| [fan.limits](#fanlimits) | 设置风扇输出上下限 |
| [fan.mode](#fanmode) | 切换风扇控制模式 |
| [fan.save](#fansave) | 保存风扇配置 |
| [fan.set](#fanset) | 设置手动输出 |
| [fan.status](#fanstatus) | 读取风扇状态 |

<a id="fanconfig"></a>

## fan.config

读取风扇配置

**方法**：GET / POST
**路径**：`/api/v1/fan/config`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 可选 | 风扇编号；先从 fan.status 列表取得。 | 省略时返回全部 |

### 请求示例

```json
{
  "id": 0
}
```

### 返回与完成条件

单个或全部配置；字段含 id/mode/min_duty/max_duty/invert_pwm/hysteresis/min_interval/curve。curve 点含 temp（°C）和 duty（%）。

<a id="fancurve"></a>

## fan.curve

设置温度调速曲线

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/fan/curve`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必填 | 风扇编号，必须处于设备支持范围。 | 无默认值 |
| `curve` | array | 必填 | 最多10个{temp:摄氏度,duty:百分比}点；温度递增，输出0–100。 | 无默认值 |
| `hysteresis` | number | 可选 | 温度回差0–20°C。 | 当前值 |
| `min_interval` | integer | 可选 | 调速最小间隔100–60000毫秒整数。 | 当前值 |

### 请求示例

```json
{
  "id": 0,
  "curve": [
    {
      "temp": 30,
      "duty": 30
    },
    {
      "temp": 60,
      "duty": 80
    }
  ],
  "hysteresis": 3,
  "min_interval": 2000
}
```

### 返回与完成条件

data.id/points/applied/persisted。

### 使用要点

曲线与模式分开；设置后读取配置，并按需要切换 curve 模式。

<a id="fanenable"></a>

## fan.enable

启用或停用风扇

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/fan/enable`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必填 | 风扇编号，必须处于设备支持范围。 | 无默认值 |
| `enable` | boolean | 必填 | true 启用；false 停用。 | 无默认值 |

### 请求示例

```json
{
  "id": 0,
  "enable": true
}
```

### 返回与完成条件

data.id/enabled。

### 使用要点

停用可能降低散热能力；独立检查温度和保护状态。

<a id="fanlimits"></a>

## fan.limits

设置风扇输出上下限

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/fan/limits`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必填 | 风扇编号，必须处于设备支持范围。 | 无默认值 |
| `min_duty` | integer | 可选 | 下限0–100%，不得大于上限。 | 当前值 |
| `max_duty` | integer | 可选 | 上限0–100%。 | 当前值 |

### 请求示例

```json
{
  "id": 0,
  "min_duty": 20,
  "max_duty": 100
}
```

### 返回与完成条件

data.id/min_duty/max_duty/applied/persisted。

<a id="fanmode"></a>

## fan.mode

切换风扇控制模式

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/fan/mode`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必填 | 风扇编号，必须处于设备支持范围。 | 无默认值 |
| `mode` | string | 必填 | off/manual/auto/curve。 | 无默认值 |

### 请求示例

```json
{
  "id": 0,
  "mode": "auto"
}
```

### 返回与完成条件

data.id/mode/applied/persisted；保存不成功时按返回区分运行态和保存结果。

<a id="fansave"></a>

## fan.save

保存风扇配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/fan/save`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 可选 | 风扇编号。 | 全部风扇 |

### 请求示例

```json
{}
```

### 返回与完成条件

data.status/persisted；失败时读取详情，不宣称重启后一定保留。

<a id="fanset"></a>

## fan.set

设置手动输出

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/fan/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必填 | 风扇编号，必须处于设备支持范围。 | 无默认值 |
| `duty` | integer | 必填 | 请求占空比0–100%。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#fan).

### 请求示例

```json
{
  "id": 0,
  "duty": 50
}
```

### 返回与完成条件

data 为应用后的风扇状态，检查 duty_valid/duty/target_duty 与 mode。

### 使用要点

会影响散热；仅在明确需要时调整。请求输出与实际输出应回读确认。

<a id="fanstatus"></a>

## fan.status

读取风扇状态

**方法**：GET / POST
**路径**：`/api/v1/fan/status`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | integer | 可选 | 风扇编号；先从 fan.status 列表取得。 | 省略时返回全部 |

共享字段或返回说明见[数据模型](../response-models.md#fan).

### 请求示例

```json
{
  "id": 0
}
```

### 返回与完成条件

指定 id 时 data 是单个风扇；省略时 data.fans 为列表，并附 temperature/temp_valid/temp_source。单个状态字段见风扇返回模型。
