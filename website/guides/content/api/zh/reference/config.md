# 普通与模块配置接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [config.delete](#configdelete) | 删除一个配置键 |
| [config.get](#configget) | 读取一个配置值 |
| [config.list](#configlist) | 读取配置键统计 |
| [config.module.list](#configmodulelist) | 读取模块配置索引 |
| [config.module.reset](#configmodulereset) | 恢复模块默认配置 |
| [config.module.save](#configmodulesave) | 保存模块配置 |
| [config.module.set](#configmoduleset) | 修改模块中的配置键 |
| [config.module.show](#configmoduleshow) | 读取模块配置 |
| [config.save](#configsave) | 保存普通配置 |
| [config.set](#configset) | 设置一个配置值 |

<a id="configdelete"></a>

## config.delete

删除一个配置键

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/delete`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `key` | string | 必填 | 配置键，保留完整名称。 | 无默认值 |

### 请求示例

```json
{
  "key": "example.setting"
}
```

### 返回与完成条件

data.key/deleted。

<a id="configget"></a>

## config.get

读取一个配置值

**方法**：GET / POST
**路径**：`/api/v1/config/get`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `key` | string | 必填 | 配置键，保留完整名称。 | 无默认值 |

### 请求示例

```json
{
  "key": "system.language"
}
```

### 返回与完成条件

data.key/type/value。仅 key=system.language 可匿名；其他键要求ADMIN。

<a id="configlist"></a>

## config.list

读取配置键统计

**方法**：GET / POST
**路径**：`/api/v1/config/list`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.items 以及 file_keys/nvs_keys/total_keys；具体项取决于已注册配置。

<a id="configmodulelist"></a>

## config.module.list

读取模块配置索引

**方法**：GET / POST
**路径**：`/api/v1/config/module/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.modules，各项含 name/version/dirty/nvs_namespace/registered；另有全局序号等信息。

<a id="configmodulereset"></a>

## config.module.reset

恢复模块默认配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/module/reset`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `module` | string | 必填 | net/dhcp/wifi/nat/led/fan/device/system；支持 all 的操作见说明。 | 无默认值 |
| `persist` | boolean | 可选 | 是否把重置结果保存。 | false |

### 请求示例

```json
{
  "module": "system",
  "persist": false
}
```

### 返回与完成条件

data.module/reset/persisted。

### 使用要点

会覆盖所选模块配置；操作前读取并保留需要的设置。

<a id="configmodulesave"></a>

## config.module.save

保存模块配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/module/save`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `module` | string | 必填 | net/dhcp/wifi/nat/led/fan/device/system；支持 all 的操作见说明。 | 无默认值 |

### 请求示例

```json
{
  "module": "all"
}
```

### 返回与完成条件

单模块保存结果；all 返回 results 及 success_count/fail_count，逐项检查success/error。

<a id="configmoduleset"></a>

## config.module.set

修改模块中的配置键

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/module/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `module` | string | 必填 | net/dhcp/wifi/nat/led/fan/device/system；支持 all 的操作见说明。 | 无默认值 |
| `key` | string | 必填 | 配置键，保留完整名称。 | 无默认值 |
| `value` | boolean / number / string | 必填 | 与模块字段类型一致的值。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#模块配置).

### 请求示例

```json
{
  "module": "system",
  "key": "timezone",
  "value": "CST-8"
}
```

### 返回与完成条件

data.module/key/success/dirty；需要保存时调用 config.module.save。

<a id="configmoduleshow"></a>

## config.module.show

读取模块配置

**方法**：GET / POST
**路径**：`/api/v1/config/module/show`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `module` | string | 必填 | net/dhcp/wifi/nat/led/fan/device/system；支持 all 的操作见说明。 | 无默认值 |

共享字段或返回说明见[数据模型](../configuration-models.md#模块配置).

### 请求示例

```json
{
  "module": "wifi"
}
```

### 返回与完成条件

单模块 data.module/config/dirty；all 可返回按模块分组对象。低于ADMIN权限时的密码字段被省略。

<a id="configsave"></a>

## config.save

保存普通配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/save`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.saved；失败时保留现状并查询，不假定全部已保存。

<a id="configset"></a>

## config.set

设置一个配置值

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `key` | string | 必填 | 配置键，保留完整名称。 | 无默认值 |
| `value` | boolean / number / string | 必填 | 配置值，不能以对象或数组替代。 | 无默认值 |

### 请求示例

```json
{
  "key": "system.language",
  "value": "zh-CN"
}
```

### 返回与完成条件

data.key/success；需要持久保存时另用 config.save。
