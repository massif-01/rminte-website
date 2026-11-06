# 监控布局接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [ui.widgets.get](#uiwidgetsget) | 读取监控组件布局 |
| [ui.widgets.set](#uiwidgetsset) | 保存监控组件布局 |

<a id="uiwidgetsget"></a>

## ui.widgets.get

读取监控组件布局

**方法**：GET / POST
**路径**：`/api/v1/ui/widgets/get`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.widgets/refresh_interval/source；布局保存于设备配置。

<a id="uiwidgetsset"></a>

## ui.widgets.set

保存监控组件布局

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ui/widgets/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `widgets` | array | 必填 | 组件配置列表，结构见监控组件模型。 | 无默认值 |
| `refresh_interval` | integer | 可选 | 刷新间隔，毫秒。 | 5000 |

共享字段或返回说明见[数据模型](../configuration-models.md#监控组件).

### 请求示例

```json
{
  "widgets": [],
  "refresh_interval": 5000
}
```

### 返回与完成条件

data.nvs_saved；成功后用ui.widgets.get回读布局。

### 使用要点

序列化配置最多4000字节。
