# 温度接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [temp.bind](#tempbind) | 绑定温度变量 |
| [temp.manual](#tempmanual) | 设置手动测试温度 |
| [temp.read](#tempread) | 读取当前温度 |
| [temp.select](#tempselect) | 选择首选温度源 |
| [temp.sources](#tempsources) | 查看所有温度来源 |
| [temp.status](#tempstatus) | 查看温度输入状态 |

<a id="tempbind"></a>

## temp.bind

绑定温度变量

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/temp/bind`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `variables` | array | 可选 | 最多8个{name,weight}；空数组解除多项绑定。 | 省略时不修改 |
| `variable` | string / null | 可选 | 单变量兼容形式；null 或空字符串解除。 | 省略时不修改 |

### 请求示例

```json
{
  "variables": [
    {
      "name": "compute.temperature",
      "weight": 1
    }
  ]
}
```

### 返回与完成条件

data.bound_variables 与绑定状态、有效计数/权重、weighted_temp_c、partial_stale/valid；无权限读取的变量值会裁剪。

### 使用要点

变量必须已存在且可作数值温度。ADMIN可省略绑定字段查询；提供variables或variable修改、解除绑定时必须ROOT。

<a id="tempmanual"></a>

## temp.manual

设置手动测试温度

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/temp/manual`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 可选 | 开关手动温度模式。 | 省略时不修改 |
| `temperature_c` | number | 可选 | 摄氏度，-50.0–150.0。 | 省略时不修改 |
| `temperature` | number | 可选 | temperature_c 的兼容名称；建议只传一个温度字段。 | 省略时不修改 |
| `temperature_01c` | integer | 可选 | 十分之一摄氏度，-500–1500；无摄氏度字段时使用。 | 省略时不修改 |

### 请求示例

```json
{
  "enable": true,
  "temperature_c": 45
}
```

### 返回与完成条件

data.manual_mode/current_temp_c/current_temp_01c/active_source。

### 使用要点

会改变控制用温度输入；测试后显式关闭手动模式并回读。

<a id="tempread"></a>

## temp.read

读取当前温度

**方法**：GET / POST
**路径**：`/api/v1/temp/read`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `source` | string | 可选 | default/local或sensor_local/agx或agx_auto/variable/manual。 | 当前有效来源 |

共享字段或返回说明见[数据模型](../response-models.md#temperature).

### 请求示例

```json
{}
```

### 返回与完成条件

data.temperature_c、temperature_01c、source、timestamp_ms、valid；变量源可能附 partial_stale 和绑定计数/权重。

<a id="tempselect"></a>

## temp.select

选择首选温度源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/temp/select`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `source` | string | 可选 | auto/agx/sensor/variable。 | 省略时只查询 |

### 请求示例

```json
{
  "source": "auto"
}
```

### 返回与完成条件

data.preferred_source/active_source/temperature_c/valid。

<a id="tempsources"></a>

## temp.sources

查看所有温度来源

**方法**：GET / POST
**路径**：`/api/v1/temp/sources`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data 当前温度与有效性，以及 providers 数组；每项含 name/type/active/valid/stale/last_value_c/last_value_01c/last_update_ms/age_ms/update_count。

### 使用要点

age_ms=null 表示没有可用更新时间；变量源另报告部分失效及有效计数/权重。

<a id="tempstatus"></a>

## temp.status

查看温度输入状态

**方法**：GET / POST
**路径**：`/api/v1/temp/status`
**最低权限**：无需登录

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#temperature).

### 请求示例

```json
{}
```

### 返回与完成条件

data.initialized/manual_mode/active_source/preferred_source/temperature_c/temperature_01c/timestamp_ms/valid，可能附 bound_variable。
