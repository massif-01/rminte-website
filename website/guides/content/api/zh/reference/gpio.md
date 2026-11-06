# 引脚维护接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [gpio.info](#gpioinfo) | 读取一个引脚状态 |
| [gpio.list](#gpiolist) | 列出可操作引脚 |
| [gpio.set](#gpioset) | 设置引脚电平 |
| [gpio.toggle](#gpiotoggle) | 翻转引脚电平 |

<a id="gpioinfo"></a>

## gpio.info

读取一个引脚状态

**方法**：GET / POST
**路径**：`/api/v1/gpio/info`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 与name至少一个 | 从gpio.list取得的白名单GPIO编号。 | 无 |
| `name` | string | 与pin至少一个 | 从gpio.list取得的引脚名称。 | 无 |

### 请求示例

```json
{
  "name": "AGX_RESET"
}
```

### 返回与完成条件

data.gpio/name/description/level/default/modified。

<a id="gpiolist"></a>

## gpio.list

列出可操作引脚

**方法**：GET / POST
**路径**：`/api/v1/gpio/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.count/pins；各项gpio/name/description/level/default/modified。

### 使用要点

高级硬件维护入口；只开放白名单，不是任意引脚控制。

<a id="gpioset"></a>

## gpio.set

设置引脚电平

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/gpio/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 与name至少一个 | 从gpio.list取得的白名单GPIO编号。 | 无 |
| `name` | string | 与pin至少一个 | 从gpio.list取得的引脚名称。 | 无 |
| `level` | integer | 必填 | 0或1。 | 无默认值 |

### 请求示例

```json
{
  "name": "AGX_RESET",
  "level": 0
}
```

### 返回与完成条件

data.gpio/name/level。

### 使用要点

引脚可能连接复位、强制关机或USB切换；先确认物理含义。

<a id="gpiotoggle"></a>

## gpio.toggle

翻转引脚电平

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/gpio/toggle`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 与name至少一个 | 从gpio.list取得的白名单GPIO编号。 | 无 |
| `name` | string | 与pin至少一个 | 从gpio.list取得的引脚名称。 | 无 |

### 请求示例

```json
{
  "name": "AGX_RESET"
}
```

### 返回与完成条件

data.gpio/name/previous/level。

### 使用要点

重复请求会再次翻转；不要在网络超时后直接重放。
