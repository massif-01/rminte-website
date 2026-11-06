# 自动化与受管服务接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [automation.action.stats](#automationactionstats) | 读取动作执行统计 |
| [automation.action.stats.reset](#automationactionstatsreset) | 清零动作统计 |
| [automation.actions.add](#automationactionsadd) | 新建动作模板 |
| [automation.actions.delete](#automationactionsdelete) | 预览或删除动作模板 |
| [automation.actions.execute](#automationactionsexecute) | 执行一个动作模板 |
| [automation.actions.export](#automationactionsexport) | 导出动作模板配置包 |
| [automation.actions.get](#automationactionsget) | 读取动作模板 |
| [automation.actions.import](#automationactionsimport) | 预览或导入动作模板配置包 |
| [automation.actions.list](#automationactionslist) | 列出动作模板 |
| [automation.actions.update](#automationactionsupdate) | 修改动作模板 |
| [automation.config.apply](#automationconfigapply) | 应用已确认的配置切换 |
| [automation.config.backup](#automationconfigbackup) | 保存内部应急备份 |
| [automation.config.enable](#automationconfigenable) | 启用或暂停当前配置 |
| [automation.config.preview](#automationconfigpreview) | 预览配置来源切换或恢复 |
| [automation.config.refresh](#automationconfigrefresh) | 重新检查配置存储 |
| [automation.config.status](#automationconfigstatus) | 读取配置来源与备份状态 |
| [automation.pause](#automationpause) | 暂停自动化引擎 |
| [automation.proxy.fetch](#automationproxyfetch) | 由设备获取 HTTP 数据 |
| [automation.proxy.socketio_test](#automationproxysocketio_test) | 测试外部 Socket.IO 事件 |
| [automation.proxy.websocket_test](#automationproxywebsocket_test) | 测试外部 WebSocket 数据 |
| [automation.reload](#automationreload) | 重新加载自动化配置 |
| [automation.resume](#automationresume) | 恢复自动化引擎 |
| [automation.rules.add](#automationrulesadd) | 新建自动化规则 |
| [automation.rules.delete](#automationrulesdelete) | 预览或删除规则 |
| [automation.rules.disable](#automationrulesdisable) | 禁用一条规则 |
| [automation.rules.enable](#automationrulesenable) | 启用一条规则 |
| [automation.rules.export](#automationrulesexport) | 导出规则配置包 |
| [automation.rules.get](#automationrulesget) | 读取一条规则 |
| [automation.rules.import](#automationrulesimport) | 预览或导入规则包 |
| [automation.rules.list](#automationruleslist) | 列出自动化规则 |
| [automation.rules.trigger](#automationrulestrigger) | 手动触发一条规则 |
| [automation.rules.update](#automationrulesupdate) | 修改自动化规则 |
| [automation.services.list](#automationserviceslist) | 列出受管远端服务记录 |
| [automation.services.status](#automationservicesstatus) | 核验受管远端服务 |
| [automation.services.stop](#automationservicesstop) | 停止受管远端服务 |
| [automation.sources.add](#automationsourcesadd) | 新建数据源 |
| [automation.sources.add_mapping](#automationsourcesadd_mapping) | 添加数据字段映射 |
| [automation.sources.delete](#automationsourcesdelete) | 预览或删除数据源 |
| [automation.sources.disable](#automationsourcesdisable) | 停用数据源 |
| [automation.sources.enable](#automationsourcesenable) | 启用数据源 |
| [automation.sources.export](#automationsourcesexport) | 导出数据源配置包 |
| [automation.sources.import](#automationsourcesimport) | 预览或导入数据源配置包 |
| [automation.sources.list](#automationsourceslist) | 列出数据源 |
| [automation.sources.remove_mapping](#automationsourcesremove_mapping) | 删除数据字段映射 |
| [automation.sources.update](#automationsourcesupdate) | 修改数据源 |
| [automation.start](#automationstart) | 启动自动化引擎 |
| [automation.status](#automationstatus) | 读取自动化运行概况 |
| [automation.stop](#automationstop) | 停止自动化引擎 |
| [automation.test.device](#automationtestdevice) | 立即测试设备控制 |
| [automation.test.gpio](#automationtestgpio) | 立即测试引脚动作 |
| [automation.test.led](#automationtestled) | 立即测试 LED 动作 |
| [automation.test.ssh](#automationtestssh) | 立即测试已配置主机命令 |
| [automation.variables.delete](#automationvariablesdelete) | 删除保存的用户变量 |
| [automation.variables.get](#automationvariablesget) | 读取一个变量 |
| [automation.variables.list](#automationvariableslist) | 列出变量 |
| [automation.variables.set](#automationvariablesset) | 新建或修改用户变量 |

<a id="automationactionstats"></a>

## automation.action.stats

读取动作执行统计

**方法**：GET / POST
**路径**：`/api/v1/automation/action/stats`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data为动作管理器当前统计；是运行统计，不是持久审计记录。

<a id="automationactionstatsreset"></a>

## automation.action.stats.reset

清零动作统计

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/action/stats/reset`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

code=0表示重置请求成功。

<a id="automationactionsadd"></a>

## automation.actions.add

新建动作模板

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/actions/add`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="automationactionsdelete"></a>

## automation.actions.delete

预览或删除动作模板

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/actions/delete`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `preview` | boolean | 可选 | true仅列影响；false执行删除。 | false |
| `replacement_id` | string | 可选 | 把依赖替换到指定对象ID。 | 无 |
| `mode` | string | 可选 | cascade请求级联处理；与force/replacement策略择一使用。 | 普通删除 |
| `force` | boolean | 可选 | 强制删除被引用对象；先预览影响。 | false |
| `pause_automation` | boolean | 可选 | 是否先暂停自动化。 | false |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 另附impact说明引用影响。

### 使用要点

删除本地定义不会自动停止已运行的远端程序或撤销公钥。

<a id="automationactionsexecute"></a>

## automation.actions.execute

执行一个动作模板

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/actions/execute`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "id": "example-action",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data.async/status/duration_ms等执行结果；低于ADMIN权限时响应会裁剪私有输出。

### 使用要点

会实际执行模板中的硬件或远端操作；异步模板需继续确认其目标结果。

<a id="automationactionsexport"></a>

## automation.actions.export

导出动作模板配置包

**方法**：POST
**路径**：`/api/v1/automation/actions/export`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `recipient_cert` | string | 可选 | 接收设备的证书PEM；省略加密给本设备。 | 本设备证书 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "id": "example"
}
```

### 返回与完成条件

data.tscfg/filename；是否可导出另受Developer设备证书及接收设备材料限制。

### 使用要点

得到包文本后由客户端保存；包不会自动成为另一台设备的活动配置。

<a id="automationactionsget"></a>

## automation.actions.get

读取动作模板

**方法**：GET / POST
**路径**：`/api/v1/automation/actions/get`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "id": "example"
}
```

### 返回与完成条件

data为单个动作模板及active_version；低于ADMIN权限时字段会被裁剪。

<a id="automationactionsimport"></a>

## automation.actions.import

预览或导入动作模板配置包

**方法**：POST
**路径**：`/api/v1/automation/actions/import`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必填 | 完整配置包JSON文本，作为字符串传入。 | 无默认值 |
| `preview` | boolean | 可选 | true只预览。 | false |
| `active_version` | string | 正式应用必填 | 当前配置版本。 | 预览可使用当前版本 |
| `overwrite` | boolean | 可选 | 允许覆盖已存在且内容不同对象。 | false |
| `expected_credential` | integer | 正式应用必填 | 预览credential_generation值。 | 无 |
| `expected_digest` | string | 正式应用必填 | 预览package_digest值。 | 无 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 预览还含valid/items/exists/unchanged/package_digest/credential_generation；正式应用含imported/overwritten/restart_required。

### 使用要点

先预览，后携带同一包的摘要、凭据代次和配置版本提交；发生变化时重新预览。

<a id="automationactionslist"></a>

## automation.actions.list

列出动作模板

**方法**：GET / POST
**路径**：`/api/v1/automation/actions/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 可选 | 返回偏移，非负。 | 0 |
| `limit` | integer | 可选 | 返回条数；不传不主动截断。 | 全部 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{}
```

### 返回与完成条件

data.templates/count/total/active_version/load_error/paused；低于ADMIN权限时返回受限元信息并带restricted。

<a id="automationactionsupdate"></a>

## automation.actions.update

修改动作模板

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/actions/update`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#动作模板).

### 请求示例

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="automationconfigapply"></a>

## automation.config.apply

应用已确认的配置切换

**方法**：POST
**路径**：`/api/v1/automation/config/apply`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `operation` | string | 必填 | 与预览相同的操作。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `target_version` | string | 必填 | 预览中目标配置版本。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#config-result).

### 请求示例

```json
{
  "operation": "use_sd",
  "active_version": "CURRENT_VERSION",
  "target_version": "PREVIEW_TARGET_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

切换或恢复可能替换整套主机、命令、规则、变量和数据源；先预览并保留当前输入。

<a id="automationconfigbackup"></a>

## automation.config.backup

保存内部应急备份

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/config/backup`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#config-result).

### 请求示例

```json
{
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationconfigenable"></a>

## automation.config.enable

启用或暂停当前配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/config/enable`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `enabled` | boolean | 必填 | true启用当前配置，false暂停。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#config-result).

### 请求示例

```json
{
  "active_version": "CURRENT_VERSION",
  "enabled": false
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationconfigpreview"></a>

## automation.config.preview

预览配置来源切换或恢复

**方法**：POST
**路径**：`/api/v1/automation/config/preview`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `operation` | string | 必填 | use_sd/save_to_sd/restore_internal。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#config-result).

### 请求示例

```json
{
  "operation": "use_sd"
}
```

### 返回与完成条件

data为预览差异、当前与目标版本以及选择条件；正式应用须使用返回版本。

### 使用要点

切换或恢复可能替换整套主机、命令、规则、变量和数据源；先预览并保留当前输入。

<a id="automationconfigrefresh"></a>

## automation.config.refresh

重新检查配置存储

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/config/refresh`
**最低权限**：ROOT

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#config-result).

### 请求示例

```json
{}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationconfigstatus"></a>

## automation.config.status

读取配置来源与备份状态

**方法**：GET / POST
**路径**：`/api/v1/automation/config/status`
**最低权限**：READ

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#config-result).

### 请求示例

```json
{}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationpause"></a>

## automation.pause

暂停自动化引擎

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/pause`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

成功由code=0和message表示；之后读取automation.status确认运行状态。

### 使用要点

引擎状态、未结束动作或存储状态可能使请求被拒绝；停止请求超时不等于全部动作已结束。

<a id="automationproxyfetch"></a>

## automation.proxy.fetch

由设备获取 HTTP 数据

**方法**：POST
**路径**：`/api/v1/automation/proxy/fetch`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 必填 | 目标HTTP(S)地址，或受支持的本机API地址。 | 无默认值 |
| `method` | string | 可选 | 支持GET/POST/PUT/DELETE；不提供通用请求body参数。 | GET |
| `headers` | object | 可选 | 请求头字符串映射；避免在普通日志保存认证值。 | 无 |
| `timeout` | integer | 可选 | 总请求超时，毫秒。 | 15000 |
| `cert_pem` | string | 可选 | 私有签发方CA材料；最多16384字节。 | 系统信任 |
| `skip_verify` | boolean | 可选 | 兼容参数，只能false；true拒绝。 | false |

### 请求示例

```json
{
  "url": "https://example.com/status",
  "method": "GET"
}
```

### 返回与完成条件

data.status/content_length/body；本机API结果嵌在body内，还需检查其中code。

### 使用要点

本机API转发沿用当前会话及目标接口权限；访问外部HTTP(S)服务要求ROOT。请求与响应有超时、大小和网络预算，不是无限制代理。

<a id="automationproxysocketio_test"></a>

## automation.proxy.socketio_test

测试外部 Socket.IO 事件

**方法**：POST
**路径**：`/api/v1/automation/proxy/socketio_test`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 必填 | Socket.IO服务地址，v4协议。 | 无默认值 |
| `event` | string | 可选 | 目标事件名。 | 首个事件 |
| `timeout_ms` | integer | 可选 | 连接/事件等待期限，毫秒。 | 10000 |
| `json_path` | string | 可选 | 事件数据提取路径。 | 完整数据 |

### 请求示例

```json
{
  "url": "https://example.com",
  "event": "status"
}
```

### 返回与完成条件

data.connected/sid/event/data，可能有value/path/path_error/error。

### 使用要点

与普通WebSocket协议不同；会实际连接远端。

<a id="automationproxywebsocket_test"></a>

## automation.proxy.websocket_test

测试外部 WebSocket 数据

**方法**：POST
**路径**：`/api/v1/automation/proxy/websocket_test`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `uri` | string | 必填 | ws://或wss://目标。 | 无默认值 |
| `timeout_ms` | integer | 可选 | 连接与数据等待期限，毫秒。 | 10000 |
| `subscribe` | string | 可选 | 连接后发送的订阅文本。 | 不发送 |
| `json_path` | string | 可选 | 响应JSON字段提取路径。 | 完整消息 |

### 请求示例

```json
{
  "uri": "wss://example.com/events",
  "timeout_ms": 10000
}
```

### 返回与完成条件

data.connected/message，可能有value/path/path_error/error。

### 使用要点

实际连接并可发送消息；一次测试不是长期数据订阅。

<a id="automationreload"></a>

## automation.reload

重新加载自动化配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/reload`
**最低权限**：ROOT

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

引擎状态、未结束动作或存储状态可能使请求被拒绝；停止请求超时不等于全部动作已结束。

<a id="automationresume"></a>

## automation.resume

恢复自动化引擎

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/resume`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

成功由code=0和message表示；之后读取automation.status确认运行状态。

### 使用要点

引擎状态、未结束动作或存储状态可能使请求被拒绝；停止请求超时不等于全部动作已结束。

<a id="automationrulesadd"></a>

## automation.rules.add

新建自动化规则

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/rules/add`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `expected_revision` | integer | 可选 | 原规则修订号；修改时携带最近读取值。 | 新建不需要 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

保存定义与触发执行分开；不要使用受限读取结果覆盖完整规则。

<a id="automationrulesdelete"></a>

## automation.rules.delete

预览或删除规则

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/rules/delete`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `preview` | boolean | 可选 | true仅列影响；false执行删除。 | false |
| `replacement_id` | string | 可选 | 把依赖替换到指定对象ID。 | 无 |
| `mode` | string | 可选 | cascade请求级联处理；与force/replacement策略择一使用。 | 普通删除 |
| `force` | boolean | 可选 | 强制删除被引用对象；先预览影响。 | false |
| `pause_automation` | boolean | 可选 | 是否先暂停自动化。 | false |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 可能附impact。

<a id="automationrulesdisable"></a>

## automation.rules.disable

禁用一条规则

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/rules/disable`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `expected_revision` | integer | 可选 | 当前规则修订号。 | 建议携带 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationrulesenable"></a>

## automation.rules.enable

启用一条规则

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/rules/enable`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `expected_revision` | integer | 可选 | 当前规则修订号。 | 建议携带 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationrulesexport"></a>

## automation.rules.export

导出规则配置包

**方法**：POST
**路径**：`/api/v1/automation/rules/export`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `recipient_cert` | string | 可选 | 接收设备的证书PEM；省略加密给本设备。 | 本设备证书 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule"
}
```

### 返回与完成条件

data.tscfg/filename；包内是规则配置输入。

<a id="automationrulesget"></a>

## automation.rules.get

读取一条规则

**方法**：GET / POST
**路径**：`/api/v1/automation/rules/get`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule"
}
```

### 返回与完成条件

data为规则定义、当前修订和运行统计；低于ADMIN权限时省略完整条件和动作。

<a id="automationrulesimport"></a>

## automation.rules.import

预览或导入规则包

**方法**：POST
**路径**：`/api/v1/automation/rules/import`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必填 | 配置包JSON文本。 | 无默认值 |
| `preview` | boolean | 可选 | 预览或正式应用。 | false |
| `active_version` | string | 正式应用必填 | 当前配置版本。 | 无默认值 |
| `overwrite` | boolean | 可选 | 是否覆盖同名规则。 | false |
| `expected_revision` | integer | 正式应用必填 | 预览中的规则修订号。 | 无默认值 |
| `expected_generation` | integer | 正式应用必填 | 预览中的规则代次。 | 无默认值 |
| `credential_generation` | integer | 正式应用必填 | 预览中的证书/凭据代次。 | 无默认值 |
| `package_digest` | string | 正式应用必填 | 预览中的包摘要。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 返回与完成条件

data包含包预览或应用结果、版本与摘要；正式应用校验预览条件仍然成立。

### 使用要点

仅完整JSON body，不允许query。该入口的确认字段与其他对象导入不同，不能混用expected_credential/expected_digest。

<a id="automationruleslist"></a>

## automation.rules.list

列出自动化规则

**方法**：GET / POST
**路径**：`/api/v1/automation/rules/list`
**最低权限**：READ

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{}
```

### 返回与完成条件

data.rules/count/active_version/loaded/paused/load_error/recovery_required/invalid_items/restart_required；每条包含ID、启用/修订及运行统计，低于ADMIN权限时为受限视图。

<a id="automationrulestrigger"></a>

## automation.rules.trigger

手动触发一条规则

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/rules/trigger`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

### 请求示例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data为触发结果；被拒绝时返回具体原因，执行完成仍需看相应动作或服务状态。

### 使用要点

有实际副作用；冷却、暂停、规则条件与运行状态可能拒绝。

<a id="automationrulesupdate"></a>

## automation.rules.update

修改自动化规则

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/rules/update`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `expected_revision` | integer | 可选 | 原规则修订号；修改时携带最近读取值。 | 新建不需要 |

共享字段或返回说明见[数据模型](../configuration-models.md#自动化规则).

### 请求示例

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

保存定义与触发执行分开；不要使用受限读取结果覆盖完整规则。

<a id="automationserviceslist"></a>

## automation.services.list

列出受管远端服务记录

**方法**：GET / POST
**路径**：`/api/v1/automation/services/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.items；每项run_id/command_id/rule_id/source/name/state/current/last_known及operation状态等。

### 使用要点

运行记录不证明当前远端进程仍存在；需要verify时显式核验。

<a id="automationservicesstatus"></a>

## automation.services.status

核验受管远端服务

**方法**：GET / POST
**路径**：`/api/v1/automation/services/status`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `run_id` | string | 必填 | 从启动结果或服务列表取得的运行ID。 | 无默认值 |
| `verify` | boolean | 可选 | 请求连接原主机进行状态核验。 | 按接口处理 |

### 请求示例

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### 返回与完成条件

data.run_id/state/source/last_known/confirmed_ms/generation/busy、operation_id/operation_phase/operation_kind/operation_reason/operation_error。

### 使用要点

busy或进行中阶段需继续查询；停止依据原运行记录核实的进程身份，不按名字任意杀进程。

<a id="automationservicesstop"></a>

## automation.services.stop

停止受管远端服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/services/stop`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `run_id` | string | 必填 | 从启动结果或服务列表取得的运行ID。 | 无默认值 |
| `verify` | boolean | 可选 | 请求连接原主机进行状态核验。 | 按接口处理 |

### 请求示例

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### 返回与完成条件

data.run_id/state/source/last_known/confirmed_ms/generation/busy、operation_id/operation_phase/operation_kind/operation_reason/operation_error。

### 使用要点

busy或进行中阶段需继续查询；停止依据原运行记录核实的进程身份，不按名字任意杀进程。

<a id="automationsourcesadd"></a>

## automation.sources.add

新建数据源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/add`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="automationsourcesadd_mapping"></a>

## automation.sources.add_mapping

添加数据字段映射

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/add_mapping`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `json_path` | string | 必填 | 要提取的字段路径。 | 无默认值 |
| `var_name` | string | 必填 | 目标变量名。 | 无默认值 |
| `transform` | string | 可选 | 可选转换表达式。 | 无 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "json_path": "temperature",
  "var_name": "compute.temperature"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 另附source_id/mapping_count/mapping_index。

<a id="automationsourcesdelete"></a>

## automation.sources.delete

预览或删除数据源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/delete`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `preview` | boolean | 可选 | true仅列影响；false执行删除。 | false |
| `replacement_id` | string | 可选 | 把依赖替换到指定对象ID。 | 无 |
| `mode` | string | 可选 | cascade请求级联处理；与force/replacement策略择一使用。 | 普通删除 |
| `force` | boolean | 可选 | 强制删除被引用对象；先预览影响。 | false |
| `pause_automation` | boolean | 可选 | 是否先暂停自动化。 | false |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 另附impact说明引用影响。

### 使用要点

删除本地定义不会自动停止已运行的远端程序或撤销公钥。

<a id="automationsourcesdisable"></a>

## automation.sources.disable

停用数据源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/disable`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationsourcesenable"></a>

## automation.sources.enable

启用数据源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/enable`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

<a id="automationsourcesexport"></a>

## automation.sources.export

导出数据源配置包

**方法**：POST
**路径**：`/api/v1/automation/sources/export`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `recipient_cert` | string | 可选 | 接收设备的证书PEM；省略加密给本设备。 | 本设备证书 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example"
}
```

### 返回与完成条件

data.tscfg/filename；是否可导出另受Developer设备证书及接收设备材料限制。

### 使用要点

得到包文本后由客户端保存；包不会自动成为另一台设备的活动配置。

<a id="automationsourcesimport"></a>

## automation.sources.import

预览或导入数据源配置包

**方法**：POST
**路径**：`/api/v1/automation/sources/import`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必填 | 完整配置包JSON文本，作为字符串传入。 | 无默认值 |
| `preview` | boolean | 可选 | true只预览。 | false |
| `active_version` | string | 正式应用必填 | 当前配置版本。 | 预览可使用当前版本 |
| `overwrite` | boolean | 可选 | 允许覆盖已存在且内容不同对象。 | false |
| `expected_credential` | integer | 正式应用必填 | 预览credential_generation值。 | 无 |
| `expected_digest` | string | 正式应用必填 | 预览package_digest值。 | 无 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 预览还含valid/items/exists/unchanged/package_digest/credential_generation；正式应用含imported/overwritten/restart_required。

### 使用要点

先预览，后携带同一包的摘要、凭据代次和配置版本提交；发生变化时重新预览。

<a id="automationsourceslist"></a>

## automation.sources.list

列出数据源

**方法**：GET / POST
**路径**：`/api/v1/automation/sources/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 可选 | 返回偏移，非负。 | 0 |
| `limit` | integer | 可选 | 返回条数；不传不主动截断。 | 全部 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{}
```

### 返回与完成条件

data.sources/count/total/active_version/load_error/paused；非root返回受限元信息并带restricted。

<a id="automationsourcesremove_mapping"></a>

## automation.sources.remove_mapping

删除数据字段映射

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/remove_mapping`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `index` | integer | 选择方式之一 | 映射索引，非负。 | 无 |
| `json_path` | string | 选择方式之一 | 已有字段路径。 | 无 |
| `var_name` | string | 选择方式之一 | 已有变量名。 | 无 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "index": 0
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 另附source_id/mapping_count。

<a id="automationsourcesupdate"></a>

## automation.sources.update

修改数据源

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/sources/update`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#数据源).

### 请求示例

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="automationstart"></a>

## automation.start

启动自动化引擎

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/start`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

成功由code=0和message表示；之后读取automation.status确认运行状态。

### 使用要点

引擎状态、未结束动作或存储状态可能使请求被拒绝；停止请求超时不等于全部动作已结束。

<a id="automationstatus"></a>

## automation.status

读取自动化运行概况

**方法**：GET / POST
**路径**：`/api/v1/automation/status`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data为引擎运行状态、计数、配置来源及自动启动信息；字段以当前引擎状态为准。

<a id="automationstop"></a>

## automation.stop

停止自动化引擎

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/stop`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

成功由code=0和message表示；之后读取automation.status确认运行状态。

### 使用要点

引擎状态、未结束动作或存储状态可能使请求被拒绝；停止请求超时不等于全部动作已结束。

<a id="automationtestdevice"></a>

## automation.test.device

立即测试设备控制

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/test/device`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 必填 | agx或lpmu。 | 无默认值 |
| `action` | string | 必填 | 目标设备支持的电源/复位动作。 | 无默认值 |

### 请求示例

```json
{
  "device": "agx",
  "action": "on"
}
```

### 返回与完成条件

code=0及message表示控制调用成功；之后读取device.status。

### 使用要点

会实际控制目标计算机。

<a id="automationtestgpio"></a>

## automation.test.gpio

立即测试引脚动作

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/test/gpio`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 必填 | 受支持引脚编号。 | 无默认值 |
| `level` | boolean | 必填 | true为高电平，false为低电平。 | 无默认值 |
| `pulse_ms` | integer | 可选 | 脉冲持续时间，毫秒；0表示不作定时脉冲。 | 0 |

### 请求示例

```json
{
  "pin": 1,
  "level": false,
  "pulse_ms": 0
}
```

### 返回与完成条件

code=0及message表示动作调用成功；之后独立读取目标引脚状态。

### 使用要点

会操作硬件引脚，先核对其功能。

<a id="automationtestled"></a>

## automation.test.led

立即测试 LED 动作

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/test/led`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device` | string | 必填 | 目标灯光设备。 | 无默认值 |
| `index` | integer | 可选 | 灯索引。 | 0 |
| `r` | integer | 可选 | 红色分量0–255。 | 0 |
| `g` | integer | 可选 | 绿色分量0–255。 | 0 |
| `b` | integer | 可选 | 蓝色分量0–255。 | 0 |

### 请求示例

```json
{
  "device": "board",
  "r": 0,
  "g": 64,
  "b": 128
}
```

### 返回与完成条件

data为动作执行结果。

### 使用要点

名称含test仍会实际改变设备。

<a id="automationtestssh"></a>

## automation.test.ssh

立即测试已配置主机命令

**方法**：POST
**路径**：`/api/v1/automation/test/ssh`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host_id` | string | 必填 | 保存的SSH主机配置ID。 | 无默认值 |
| `command` | string | 必填 | 远端命令。 | 无默认值 |
| `timeout_ms` | integer | 可选 | 毫秒超时。 | 30000 |

### 请求示例

```json
{
  "host_id": "example-host",
  "command": "uname -a",
  "timeout_ms": 30000
}
```

### 返回与完成条件

data为远端执行结果，检查退出码与输出。

### 使用要点

不是纯语法检查，会实际连接并执行。

<a id="automationvariablesdelete"></a>

## automation.variables.delete

删除保存的用户变量

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/variables/delete`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 用户变量名。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `preview` | boolean | 可选 | 只查看引用影响。 | false |
| `force` | boolean | 可选 | 确认引用影响后请求强制删除。 | false |
| `pause_automation` | boolean | 可选 | 暂停自动化后处理。 | false |

共享字段或返回说明见[数据模型](../response-models.md#variable).

### 请求示例

```json
{
  "name": "example.temperature",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 可能附impact。

<a id="automationvariablesget"></a>

## automation.variables.get

读取一个变量

**方法**：GET / POST
**路径**：`/api/v1/automation/variables/get`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 完整变量名。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#variable).

### 请求示例

```json
{
  "name": "compute.temperature"
}
```

### 返回与完成条件

data为变量值及类型、来源、只读和更新时间等元数据。

<a id="automationvariableslist"></a>

## automation.variables.list

列出变量

**方法**：GET / POST
**路径**：`/api/v1/automation/variables/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `configured_only` | boolean | 可选 | 只列保存的用户变量定义。 | false |
| `prefix` | string | 可选 | 变量名前缀筛选。 | 无 |
| `source_id` | string | 可选 | 按来源ID筛选。 | 无 |
| `include_value` | boolean | 可选 | 是否返回变量值。 | true |
| `include_meta` | boolean | 可选 | 是否包含时间、来源、只读等元数据。 | true |

共享字段或返回说明见[数据模型](../response-models.md#variable).

### 请求示例

```json
{}
```

### 返回与完成条件

data.variables/count；include_value控制是否附value，include_meta控制时间、来源和只读等元数据。

<a id="automationvariablesset"></a>

## automation.variables.set

新建或修改用户变量

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/automation/variables/set`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 用户变量名。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `value` | boolean / number / string / null | 必填 | 要保存的值；不以数组/对象替代数值温度。 | 无默认值 |
| `create_only` | boolean | 可选 | 若已存在只返回现有值，不覆盖。 | false |
| `source_id` | string | 可选 | 来源标识。 | user |
| `value_type` | integer | 可选 | 可选类型标识；一般让实现根据value判断。 | 按value推导 |

共享字段或返回说明见[数据模型](../response-models.md#variable).

### 请求示例

```json
{
  "name": "example.temperature",
  "value": 42.5,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。 另含name/created/value。

### 使用要点

只读或系统来源变量可能拒绝修改；数组/对象值不属于此简化模型。
