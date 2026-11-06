# 配置数据模型

这些模型用于保存主机、命令、数据源、动作和规则。它们是设备运行时会使用的定义，保存后可能影响后续自动化行为。初次接入先创建禁用的示例，再读取确认。

## 先读取版本，再修改

使用 root 读取 `automation.config.status`，保存返回的 `active_version`。写入请求在顶层带这个值；每次成功写入后更新版本，再进行下一次修改。规则更新还建议带读取到的 `expected_revision`。冲突表示读取之后配置变了，应重新读取并合并，不能仅用新版本号重放旧配置。

本页 JSON 是请求对象示例。`CURRENT_VERSION`、ID、地址、密钥、变量名等必须替换成你的实际值；它们不是可直接使用的设备记录。所有模型字段放在请求顶层，除下面明确展示的子对象外，不额外包一层 `config`。

读取权限较低时可能只得到带 `restricted:true` 的摘要。完整读取SSH主机/命令、规则与动作通常需要ADMIN，automation.sources.list秘密字段仍需ROOT；写入按各接口权限执行。省略的秘密字段不能按空值保存回去。主机、数据源更新支持合并原对象；命令、动作模板应提交完整定义。规则有自己的合并与修订检查，不应把一种对象的更新方式推广到全部对象。

## SSH 主机

对应 `ssh.hosts.add/update`。这个对象记录“连接谁、以谁的身份、用哪把密钥”；它与 `hosts.*` 保存的主机指纹不同。

```json
{
  "id":"example-host", "active_version":"CURRENT_VERSION",
  "host":"192.0.2.20", "port":22, "username":"YOUR_USER",
  "auth_type":"key", "keyid":"example-key", "enabled":true
}
```

| 字段 | 类型、范围与含义 |
| --- | --- |
| id | 稳定字符串 ID，最多31字节；新建未存在、更新已存在 |
| host | 地址字符串，最多63字节 |
| port | SSH端口整数，通常22；采用有效端口1–65535 |
| username | 远端用户名，最多31字节；不是设备登录用户名 |
| auth_type | `key` / `password`；持久配置推荐key |
| keyid | 设备保存的SSH私钥ID，最多31字节 |
| enabled | 布尔；解码默认true |
| created_time | 可选无符号32位时间值；通常保留设备已有值 |

此持久模型不保存密码字段。`password` 模式不能解释为已经持久保存了远端密码；即时连接的密码通过各自调用提供。最多16个主机。主机地址、密钥存在及远端信任另行校验。

## SSH 命令

对应 `ssh.commands.add/update`。保存命令不会立即执行。正常短命令使用 `service_mode:false`；需要管理持续运行的服务时设true，并通过 `ssh.services.start` 启动。

```json
{
  "id":"example-command", "active_version":"CURRENT_VERSION",
  "host_id":"example-host", "name":"Read OS", "command":"uname -a",
  "timeout_sec":30, "enabled":true, "service_mode":false
}
```

| 字段 | 类型、范围与含义 |
| --- | --- |
| id / host_id | 字符串，各最多31字节；host_id必须对应主机定义 |
| name / command | 字符串，分别最多63 / 1023字节 |
| desc / icon | 可选字符串，最多127 / 63字节；icon可为显示图标或路径 |
| expect_pattern / fail_pattern / extract_pattern | 可选输出匹配/提取模式，各最多127字节 |
| var_name | 可选结果变量前缀，最多31字节 |
| timeout_sec | 0–65535秒，默认30；不要传毫秒 |
| stop_on_match / nohup / enabled / service_mode | 布尔；enabled默认true，其他默认false |
| ready_pattern / service_fail_pattern | 服务就绪/失败的匹配模式，各最多127字节 |
| ready_timeout_sec / ready_check_interval_ms | 0–65535，分别是秒/毫秒；服务使用时应明确配置 |
| created_time | 可选无符号32位时间值 |

兼容名称：`timeout`、`expectPattern`、`failPattern`、`extractPattern`、`varName`、`stopOnMatch`、`serviceMode`、`readyPattern`、`serviceFailPattern`、`readyTimeout`、`readyInterval`。新集成使用表内名称，避免同传两个名称。`_object_id`、`runtime_instance` 是定义/运行身份信息，保留设备读取值，不自行编造。最多64个命令。

## 数据源

对应 `automation.sources.add/update`。数据源负责从网络或设备取得数据，并映射为变量；规则再使用这些变量。

```json
{
  "id":"example-source", "active_version":"CURRENT_VERSION", "label":"Temperature",
  "type":"rest", "enabled":false, "poll_interval_ms":5000, "auto_discover":false,
  "rest_url":"https://example.com/status", "rest_method":"GET",
  "mappings":[{"path":"temperature","var":"compute.temperature"}]
}
```

| 共用字段 | 类型与含义 |
| --- | --- |
| id / label | 字符串，最多63 / 47字节 |
| type | 推荐字符串 `builtin` / `websocket` / `socketio` / `rest` / `variable`；也接受相应0–4整数 |
| enabled / auto_discover | 布尔；auto_discover默认true，示例显式禁用以避免意外发现大量变量 |
| poll_interval_ms | 0–4294967295的整数毫秒，实际更新方式依源类型；不要把0理解成无限频率 |
| mappings | 最多4个映射；每个有path（最多95字节）、var（最多63字节）、可选transform（最多63字节） |

映射的 `path` / `var` 还接受 `json_path` / `var_name`。字段路径是数据中的位置，如 `temperature`、`cpu.cores[0].freq`；不是URL。变换表达式作用于提取值，先以已知样本验证结果。

| type | 对应类型字段 |
| --- | --- |
| websocket | ws_uri（最多95字节）、ws_path（旧式单字段路径，最多63字节）、reconnect_ms（0–65535毫秒） |
| socketio | sio_url（最多95字节）、sio_event（最多63字节） |
| rest | rest_url（最多95字节）、rest_method（最多7字节）、rest_auth（最多47字节）、rest_path（旧式单字段路径，最多63字节） |
| variable | var_name、var_prefix、var_watch_all；SSH数据流程另有ssh_host_id、ssh_command、expect_pattern、fail_pattern、extract_pattern、timeout_sec |
| builtin | builtin子对象：type选择设备内置采样项；GPIO使用pin，ADC使用channel/atten，计算机状态可有device_index |

字符串类型写法还接受便捷字段：WebSocket的 `uri/json_path`、Socket.IO的 `url/event`、REST的 `url/method/auth_header/json_path`。新集成采用表内规范名称。变量源中字符串通常最多63字节，ssh_command最多95字节，timeout_sec为0–65535秒。内置源类型是设备采样项编号，建立集成优先读取已有内置定义，避免猜测硬件引脚与通道。

## 用户变量

对应 `automation.variables.set`，读取用 `.get/list`。变量名、来源、只读标记与更新时间同样重要，不能只存value。

```json
{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}
```

`value` 可以是null、布尔、有限数字或最多63字节的字符串。通常省略 `value_type` 自动推导；显式传时0=null、1=bool、2=int、3=float、4=string，必须与值匹配。整数采用32位有符号范围，其他有限数采用浮点值。

`source_id` 默认 `user`。`create_only:true` 在已存在时保留原值，不表示已经把请求的新值写进去。系统来源及只读变量可能拒绝变更。温度绑定要求适合用作数值温度的变量，不把字符串、无效或陈旧值视为正常传感器数据。

## 动作模板

对应 `automation.actions.add/update`。模板可以被多条规则复用。下面示例只写日志，适合验证保存与执行路径。

```json
{
  "id":"example-action","active_version":"CURRENT_VERSION","name":"Record a message",
  "enabled":true,"type":"log","async":false,"delay_ms":0,
  "log":{"level":3,"message":"Example action"}
}
```

共用字段：id最多63字节、name最多47字节、description最多63字节；enabled默认true，async默认false；delay_ms为0–65535毫秒。created_at是可选非负整数时间值，通常保留设备已有值。

| type | 必要的类型子对象及字段 |
| --- | --- |
| log | log：level、message（最多47字节） |
| set_var | set_var：variable、value，以及可选value_type |
| ssh_cmd | ssh：host_ref、command、timeout_ms、async |
| ssh_cmd_ref | ssh_ref：cmd_id，引用保存的SSH命令 |
| gpio | gpio：pin、level（**布尔**）、pulse_ms |
| device_ctrl | device：device、action；使用已有设备动作定义 |
| cli | cli：command、var_name、timeout_ms |
| webhook | webhook：url、method、body_template |
| led | led：device、ctrl_type以及该显示功能需要的字段，见下节 |

主机引用、变量名、cmd_id、设备动作名通常最多63字节；短SSH/CLI命令和Webhook URL最多95字节，Webhook method最多7字节、body_template最多63字节。超出长度拒绝，不应依赖截断。模板中的命令容量不同于 `ssh.commands` 的1023字节。

### LED 动作字段

`led.ctrl_type` 是字符串：fill/effect/brightness/off/text/image/qrcode/filter/filter_stop/text_stop。按对应功能填写，不把直接LED API所有字段照搬到模板中。

通用字段有device、index（255表示整灯）、color（颜色字符串）或r/g/b、brightness（0–255）、effect、speed、duration_ms（0–65535毫秒）。矩阵功能字段有text（最多127字节）、font（最多31字节）、image_path（最多127字节）、qr_text（最多255字节）、qr_ecc（L/M/Q/H字符串）、filter（最多31字节）、filter_params、center、loop、scroll、align、x/y、auto_pos（文字自动定位布尔）。scroll为none/left/right/up/down，align为left/center/right，x/y为有符号16位坐标。

二维码指定前景色使用 `qr_fg`，背景路径使用 `qr_bg_image`；显式黑色仍是有意设置，不等于没有传颜色。filter_params采用该滤镜支持的命名数值参数。动作仅在设备支持该功能、路径与配置有效时可执行；先保存和读取，再有意识地执行测试。

## 自动化规则

对应 `automation.rules.add/update`。规则由条件与动作组成；保存启用的规则可能让它开始自动执行，初次创建建议enabled=false。

```json
{
  "id":"example-rule","active_version":"CURRENT_VERSION","name":"Temperature example",
  "enabled":false,"logic":"and","cooldown_ms":10000,
  "conditions":[{"variable":"example.temperature","operator":"gt","value":50}],
  "actions":[{"type":"log","level":3,"message":"Temperature high"}]
}
```

| 字段 | 类型与含义 |
| --- | --- |
| id / name / icon | 字符串，最多63 / 47 / 63字节；ID不得包含路径分隔符或控制字符 |
| enabled | 布尔，默认true；示例主动禁用 |
| manual_trigger / show_on_dashboard / allow_manual_trigger | 布尔；定义触发或界面呈现选项，不提升调用者权限 |
| cooldown_ms | 无符号32位毫秒；避免连续重复触发 |
| revision | 规则修订号；更新并发控制使用读取值对应的expected_revision |
| logic / conditions | logic为and/or，默认and；conditions数组最多255项 |
| actions | 数组最多255项；启用规则不能无动作 |

一个条件是 `{variable,operator,value}`，operator可为eq/ne/lt/le/gt/ge/contains。value使用用户变量的值模型。也接受 `conditions:{logic,items:[…]}` 形式，新集成选择一种形式即可。

规则内动作采用**平铺字段**：例如log直接用level/message，SSH直接用host_ref/command，GPIO直接用pin/level；与上面模板的子对象形式不同。规则内SSH类型名为 `ssh`，模板是 `ssh_cmd`。引用模板只需 `template_id`，引用优先于缓存的内联字段。

规则动作共用字段：delay_ms、async、repeat_mode（once/while_true/count）、repeat_count（0–255）、repeat_interval_ms（0–65535毫秒），可另带condition（同条件模型，null表示无额外条件）。重复行为应结合动作副作用选择。

| 规则内type | 平铺类型字段 |
| --- | --- |
| log / set_var | level/message；或variable/value/value_type |
| ssh / ssh_cmd_ref | host_ref/command/ssh_async/timeout_ms；或cmd_id |
| gpio / device_ctrl | pin/level（布尔）/pulse_ms；或device/action |
| webhook / cli | url/method/body_template；或command/var_name/timeout_ms |
| led | 显示字段直接平铺，如device/ctrl_type/r/g/b；ctrl_type是数值枚举，不是模板字符串 |

复杂LED规则优先引用已保存动作模板，避免混淆两套编码。需要直接内联时按下面映射：ctrl_type为0=fill、1=effect、2=brightness、3=off、4=text、5=image、6=qrcode、7=filter、8=filter_stop、9=text_stop；qr_ecc使用字符编码整数（L=76/M=77/Q=81/H=72）。filter_params仍为独立对象，整数范围为speed1–100、intensity/density/decay/amplitude0–255、scale1–100、levels2–16、amount/saturation/frequency0–100、angle0–360、width1–16、wavelength1–32。它们使用模板/UI单位，与直接LED滤镜API的部分单位不同。不要把完整API请求放进actions数组。

## 模块配置

`config.module.show` 返回模块自己的config对象，先读已有字段，再用 `config.module.set` 修改一个键。支持的模块名为net/dhcp/wifi/nat/led/fan/device/system；show/save/reset是否接受all见各接口。key只填模块内部键名，value保留原字段类型。

保存模块配置与自动化配置的active_version机制不同；`config.module.save` 根据dirty状态保存。改网络、DHCP、WiFi会影响管理连接，先记录访问路径。低于ADMIN权限读取时，WiFi密码字段会被省略。

## 监控组件

`ui.widgets` 保存前端布局JSON，而不是创建数据采集器。widgets是前端解释的配置数组；首次读取可为空。更改时从 `ui.widgets.get` 的实际配置开始，保留组件已有字段与ID。刷新间隔以毫秒表示，省略为5000；序列化后的整体配置最多4000字节。保存返回nvs_saved，不等于目标变量已有数据。

## 导入、删除和切换配置

对象的导入采用“预览→携带预览条件正式应用”。tscfg是完整包的JSON**字符串**；它与任意JSON对象不是一回事。主机、命令、数据源、动作导入带expected_digest和expected_credential；规则导入字段不同，见[规则接口参考](reference/automation.md#automationrulesimport)。

删除先用preview=true获取impact，再决定保留依赖、替换引用或级联处理。删除定义不会自动结束远端进程或撤销远端公钥。切换SD/内部备份是整套配置操作，应使用automation.config.preview/apply；不要上传文件覆盖受管目录来绕过配置版本与依赖检查。
