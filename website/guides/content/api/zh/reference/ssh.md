# SSH连接与命令接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [ssh.cancel](#sshcancel) | 请求取消自己的流式执行 |
| [ssh.commands.add](#sshcommandsadd) | 新建SSH命令 |
| [ssh.commands.export](#sshcommandsexport) | 导出SSH命令配置包 |
| [ssh.commands.get](#sshcommandsget) | 读取SSH命令 |
| [ssh.commands.import](#sshcommandsimport) | 预览或导入SSH命令配置包 |
| [ssh.commands.list](#sshcommandslist) | 列出SSH命令 |
| [ssh.commands.remove](#sshcommandsremove) | 预览或删除SSH命令 |
| [ssh.commands.update](#sshcommandsupdate) | 修改SSH命令 |
| [ssh.copyid](#sshcopyid) | 向远端安装公钥 |
| [ssh.exec](#sshexec) | 执行并等待一条远端命令 |
| [ssh.exec_status](#sshexec_status) | 查询自己的流式执行结果 |
| [ssh.exec_stream](#sshexec_stream) | 启动流式远端命令 |
| [ssh.hosts.add](#sshhostsadd) | 新建SSH主机 |
| [ssh.hosts.export](#sshhostsexport) | 导出SSH主机配置包 |
| [ssh.hosts.get](#sshhostsget) | 读取SSH主机 |
| [ssh.hosts.import](#sshhostsimport) | 预览或导入SSH主机配置包 |
| [ssh.hosts.list](#sshhostslist) | 列出SSH主机 |
| [ssh.hosts.remove](#sshhostsremove) | 预览或删除SSH主机 |
| [ssh.hosts.update](#sshhostsupdate) | 修改SSH主机 |
| [ssh.keygen](#sshkeygen) | 兼容 SSH 密钥生成 |
| [ssh.revoke](#sshrevoke) | 撤销远端公钥 |
| [ssh.services.start](#sshservicesstart) | 启动已保存的受管服务 |
| [ssh.test](#sshtest) | 测试远端 SSH 连接 |

<a id="sshcancel"></a>

## ssh.cancel

请求取消自己的流式执行

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/cancel`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `session_id` | integer | 必填 | ssh.exec_stream返回的执行编号。 | 无默认值 |
| `boot_id` | string | 可选 | 与result_key成对提供时必须匹配启动回执；同一发起登录会话可省略这一对。 | 无默认值 |
| `result_key` | string | 可选 | 与boot_id成对提供的私有结果钥匙。 | 无默认值 |

### 请求示例

```json
{
  "session_id": 1
}
```

### 返回与完成条件

data.cancelled=true表示取消意图已接受；继续查询最终结果。

### 使用要点

必须是发起任务的同一登录会话；另一root会话也不能取消。提供回执时仍检查整组匹配。cancelled只表示取消意图已接受；完整回执仍用于exec_status查询。

<a id="sshcommandsadd"></a>

## ssh.commands.add

新建SSH命令

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/commands/add`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

### 请求示例

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="sshcommandsexport"></a>

## ssh.commands.export

导出SSH命令配置包

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/commands/export`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `recipient_cert` | string | 可选 | 接收设备的证书PEM；省略加密给本设备。 | 本设备证书 |
| `include_host` | boolean | 可选 | 导出时是否带依赖的主机配置。 | false |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

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

<a id="sshcommandsget"></a>

## ssh.commands.get

读取SSH命令

**方法**：GET / POST
**路径**：`/api/v1/ssh/commands/get`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

### 请求示例

```json
{
  "id": "example"
}
```

### 返回与完成条件

data为单个SSH命令及active_version；低于ADMIN权限时字段会被裁剪。

<a id="sshcommandsimport"></a>

## ssh.commands.import

预览或导入SSH命令配置包

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/commands/import`
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

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

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

<a id="sshcommandslist"></a>

## ssh.commands.list

列出SSH命令

**方法**：GET / POST
**路径**：`/api/v1/ssh/commands/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 可选 | 返回偏移，非负。 | 0 |
| `limit` | integer | 可选 | 返回条数；不传不主动截断。 | 全部 |
| `host_id` | string | 可选 | 按主机配置ID筛选。 | 全部 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

### 请求示例

```json
{}
```

### 返回与完成条件

data.commands/count/total/active_version/load_error/paused；低于ADMIN权限时返回受限元信息并带restricted。

<a id="sshcommandsremove"></a>

## ssh.commands.remove

预览或删除SSH命令

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/commands/remove`
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

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

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

<a id="sshcommandsupdate"></a>

## ssh.commands.update

修改SSH命令

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/commands/update`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-命令).

### 请求示例

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="sshcopyid"></a>

## ssh.copyid

向远端安装公钥

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/copyid`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | 远端地址。 | 无默认值 |
| `user` | string | 必填 | 远端账户。 | 无默认值 |
| `port` | integer | 可选 | SSH端口。 | 22 |
| `password` | string | 必填 | 用于本次远端认证的密码。 | 无默认值 |
| `keyid` | string | 必填 | 要部署或撤销公钥对应的本地密钥ID。 | 无默认值 |
| `trust_new` | boolean | 可选 | 接受首次主机，仅在核实后使用。 | false |
| `accept_changed` | boolean | 可选 | 接受变化的主机指纹，仅在核实后使用。 | false |
| `confirmed_fingerprint` | string | 可选 | 与待确认主机一致的已核实指纹。 | 无 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |
| `verify` | boolean | 可选 | 部署后是否核对。 | true |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data.deployed/verified/registered/registration_error、host_id及主机/密钥信息；分别确认远端部署和本地配置登记。

### 使用要点

远端部署可能成功而本地登记失败；不要直接重复安装。

<a id="sshexec"></a>

## ssh.exec

执行并等待一条远端命令

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/exec`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | SSH主机地址。 | 无默认值 |
| `user` | string | 必填 | 远端用户名。 | 无默认值 |
| `port` | integer | 可选 | 端口1–65535。 | 22 |
| `password` | string | 认证方式之一 | 本次远端密码，不是TianShanOS登录密码。 | 无 |
| `keyid` | string | 认证方式之一 | 设备内保存的SSH私钥ID。 | 无 |
| `keypath` | string | 支持的即时调用认证方式之一 | 设备上的私钥路径；具体入口支持范围见说明。 | 无 |
| `command` | string | 必填 | 远端执行的命令文本。 | 无默认值 |
| `timeout_ms` | integer | 可选 | 连接/执行期限，毫秒。 | SSH默认 |
| `trust_new` | boolean | 可选 | 接受首次主机，仅在核实后使用。 | false |
| `accept_changed` | boolean | 可选 | 接受变化的主机指纹，仅在核实后使用。 | false |
| `confirmed_fingerprint` | string | 可选 | 与待确认主机一致的已核实指纹。 | 无 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a"
}
```

### 返回与完成条件

data.stdout/stderr/exit_code/host_status/fingerprint；检查exit_code和业务输出。

### 使用要点

指纹未知或变化会返回确认信息；先核实，不自动接受。远端命令非零退出码不一定使顶层code非零。

<a id="sshexec_status"></a>

## ssh.exec_status

查询自己的流式执行结果

**方法**：GET / POST
**路径**：`/api/v1/ssh/exec_status`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `session_id` | integer | 必填 | ssh.exec_stream返回的执行编号。 | 无默认值 |
| `boot_id` | string | 必填 | 执行回执中的32位十六进制启动标识。 | 无默认值 |
| `result_key` | string | 必填 | 执行回执中的32位十六进制结果查询凭据。 | 无默认值 |

### 请求示例

```json
{
  "session_id": 1,
  "boot_id": "00000000000000000000000000000000",
  "result_key": "00000000000000000000000000000000"
}
```

### 返回与完成条件

data 包含WebSocket同格式的执行消息：运行中type=ssh_exec_running，结束为ssh_exec_done/cancelled/error；检查具体status/exit_code/success和输出完整性。

### 使用要点

必须仍使用发起者会话及正确回执；示例零值仅展示格式，实际值直接使用启动响应。查询不会重跑命令。

<a id="sshexec_stream"></a>

## ssh.exec_stream

启动流式远端命令

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/exec_stream`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | SSH主机地址。 | 无默认值 |
| `user` | string | 必填 | 远端用户名。 | 无默认值 |
| `port` | integer | 可选 | 端口1–65535。 | 22 |
| `password` | string | 认证方式之一 | 本次远端密码，不是TianShanOS登录密码。 | 无 |
| `keyid` | string | 认证方式之一 | 设备内保存的SSH私钥ID。 | 无 |
| `command` | string | 必填 | 命令文本。 | 无默认值 |
| `expect_pattern` | string | 可选 | 成功匹配模式。 | 省略时不修改 |
| `fail_pattern` | string | 可选 | 失败匹配模式。 | 省略时不修改 |
| `extract_pattern` | string | 可选 | 提取输出模式。 | 省略时不修改 |
| `var_name` | string | 可选 | 结果变量前缀。 | 省略时不修改 |
| `timeout` | integer | 可选 | 此入口为毫秒；与保存命令的timeout_sec区分。 | 默认执行期限 |
| `collect_output` | boolean | 可选 | 是否保留输出。 | true |
| `max_output_size` | integer | 可选 | 输出收集上限，字节。 | 设备默认 |
| `stop_on_match` | boolean | 可选 | 匹配后是否结束。 | false |
| `command_id` | string | 与command_instance配套可选 | 关联已保存命令编号。 | 无 |
| `command_instance` | string | 与command_id配套可选 | 列表runtime_instance对应的16位小写十六进制标识。 | 无 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a",
  "collect_output": true
}
```

### 返回与完成条件

data.session_id/boot_id/result_key；先保存回执，再通过WebSocket接收结果或ssh.exec_status查询。

### 使用要点

一次流式执行有独占操作槽。此入口不提供通用keypath认证；输出与终态都需校验归属及完整性。

<a id="sshhostsadd"></a>

## ssh.hosts.add

新建SSH主机

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/hosts/add`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

### 请求示例

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="sshhostsexport"></a>

## ssh.hosts.export

导出SSH主机配置包

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/hosts/export`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `recipient_cert` | string | 可选 | 接收设备的证书PEM；省略加密给本设备。 | 本设备证书 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

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

<a id="sshhostsget"></a>

## ssh.hosts.get

读取SSH主机

**方法**：GET / POST
**路径**：`/api/v1/ssh/hosts/get`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

### 请求示例

```json
{
  "id": "example"
}
```

### 返回与完成条件

data为单个SSH主机及active_version；低于ADMIN权限时字段会被裁剪。

<a id="sshhostsimport"></a>

## ssh.hosts.import

预览或导入SSH主机配置包

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/hosts/import`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必填 | 完整配置包JSON文本，作为字符串传入。 | 无默认值 |
| `preview` | boolean | 可选 | true只预览。 | false |
| `active_version` | string | 正式应用必填 | 当前配置版本。 | 预览可使用当前版本 |
| `overwrite` | boolean | 可选 | 允许覆盖已存在且内容不同对象。 | false |
| `expected_credential` | integer | 正式应用必填 | 预览credential_generation值。 | 无 |
| `expected_digest` | string | 正式应用必填 | 预览package_digest值。 | 无 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

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

<a id="sshhostslist"></a>

## ssh.hosts.list

列出SSH主机

**方法**：GET / POST
**路径**：`/api/v1/ssh/hosts/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 可选 | 返回偏移，非负。 | 0 |
| `limit` | integer | 可选 | 返回条数；不传不主动截断。 | 全部 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

### 请求示例

```json
{}
```

### 返回与完成条件

data.hosts/count/total/active_version/load_error/paused；低于ADMIN权限时返回受限元信息并带restricted。

<a id="sshhostsremove"></a>

## ssh.hosts.remove

预览或删除SSH主机

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/hosts/remove`
**最低权限**：ADMIN

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

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

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

<a id="sshhostsupdate"></a>

## ssh.hosts.update

修改SSH主机

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/hosts/update`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 对象稳定ID；查询已有对象后保留原ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#ssh-主机).

### 请求示例

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data 为配置结果，含active_version/source/loaded/configured/enabled/paused/saved/uncertain及错误位置；完整字段见配置结果模型。

### 使用要点

新建要求ID未存在，修改要求对象已存在；完整请求示例见配置数据模型。

<a id="sshkeygen"></a>

## ssh.keygen

兼容 SSH 密钥生成

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/keygen`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 密钥ID。 | 无默认值 |
| `type` | string | 可选 | rsa2048/rsa4096/ec256/ec384等此入口接受类型。 | rsa2048 |
| `comment` | string | 可选 | 公钥注释。 | 空 |

### 请求示例

```json
{
  "id": "example-key",
  "type": "ec256"
}
```

### 返回与完成条件

data.id/type/public_key。

### 使用要点

新集成建议统一使用key.generate；两入口支持参数不同。

<a id="sshrevoke"></a>

## ssh.revoke

撤销远端公钥

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/revoke`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | 远端地址。 | 无默认值 |
| `user` | string | 必填 | 远端账户。 | 无默认值 |
| `port` | integer | 可选 | SSH端口。 | 22 |
| `password` | string | 必填 | 用于本次远端认证的密码。 | 无默认值 |
| `keyid` | string | 必填 | 要部署或撤销公钥对应的本地密钥ID。 | 无默认值 |
| `trust_new` | boolean | 可选 | 接受首次主机，仅在核实后使用。 | false |
| `accept_changed` | boolean | 可选 | 接受变化的主机指纹，仅在核实后使用。 | false |
| `confirmed_fingerprint` | string | 可选 | 与待确认主机一致的已核实指纹。 | 无 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key"
}
```

### 返回与完成条件

data.revoked/found/removed_count 与远端信息。

### 使用要点

只移除指定公钥，不等于删除本地密钥、主机配置或停止远端任务。

<a id="sshservicesstart"></a>

## ssh.services.start

启动已保存的受管服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/services/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `command_id` | string | 必填 | 已保存并配置为受管服务的命令ID。 | 无默认值 |
| `active_version` | string | 必填 | 最近一次读取配置状态返回的版本；配置变化后重新读取。 | 无默认值 |

### 请求示例

```json
{
  "command_id": "example-service",
  "active_version": "CURRENT_VERSION"
}
```

### 返回与完成条件

data.operation_id/run_id；随后用automation.services.status核验。

### 使用要点

使用已保存配置；即使调用成功也需区分进程运行与已就绪。

<a id="sshtest"></a>

## ssh.test

测试远端 SSH 连接

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ssh/test`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | SSH主机地址。 | 无默认值 |
| `user` | string | 必填 | 远端用户名。 | 无默认值 |
| `port` | integer | 可选 | 端口1–65535。 | 22 |
| `password` | string | 认证方式之一 | 本次远端密码，不是TianShanOS登录密码。 | 无 |
| `keyid` | string | 认证方式之一 | 设备内保存的SSH私钥ID。 | 无 |
| `keypath` | string | 支持的即时调用认证方式之一 | 设备上的私钥路径；具体入口支持范围见说明。 | 无 |
| `trust_new` | boolean | 可选 | 接受首次主机，仅在核实后使用。 | false |
| `accept_changed` | boolean | 可选 | 接受变化的主机指纹，仅在核实后使用。 | false |
| `confirmed_fingerprint` | string | 可选 | 与待确认主机一致的已核实指纹。 | 无 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key"
}
```

### 返回与完成条件

data.success/host/port/user/host_status/fingerprint；连接失败可返回stage/reason/error及指纹信息。

### 使用要点

只证明连接和认证条件，不证明任意远端命令或服务可运行。
