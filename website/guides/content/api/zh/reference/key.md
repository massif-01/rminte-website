# SSH密钥接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [key.delete](#keydelete) | 检查引用或删除密钥 |
| [key.export](#keyexport) | 读取 SSH 公钥 |
| [key.exportPrivate](#keyexportprivate) | 导出可导出的 SSH 私钥 |
| [key.generate](#keygenerate) | 生成 SSH 密钥 |
| [key.info](#keyinfo) | 查看密钥元信息 |
| [key.list](#keylist) | 列出可见密钥 |

<a id="keydelete"></a>

## key.delete

检查引用或删除密钥

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/key/delete`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 本地密钥ID。 | 无默认值 |
| `preview` | boolean | 可选 | true只读取关联主机/运行记录，false执行删除。 | false |

### 请求示例

```json
{
  "id": "example-key",
  "preview": true
}
```

### 返回与完成条件

预览返回data.hosts/runs/complete；删除返回data.id/deleted。

### 使用要点

删除本地密钥不会停止远端进程，也不会自动撤销远端authorized_keys中的公钥；可能失去原任务的核验/停止能力。

<a id="keyexport"></a>

## key.export

读取 SSH 公钥

**方法**：GET / POST
**路径**：`/api/v1/key/export`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 本地密钥ID。 | 无默认值 |

### 请求示例

```json
{
  "id": "example-key"
}
```

### 返回与完成条件

data.id/type/public_key/comment；公钥为OpenSSH文本。

### 使用要点

隐藏密钥的读取要求合适角色。

<a id="keyexportprivate"></a>

## key.exportPrivate

导出可导出的 SSH 私钥

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/key/exportPrivate`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 本地密钥ID。 | 无默认值 |

### 请求示例

```json
{
  "id": "example-key"
}
```

### 返回与完成条件

data.id/type/private_key/comment/warning。

### 使用要点

必须ADMIN且该密钥exportable=true；默认不可导出。响应按秘密保存，不写入普通日志。

<a id="keygenerate"></a>

## key.generate

生成 SSH 密钥

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/key/generate`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 本地密钥ID。 | 无默认值 |
| `type` | string | 可选 | rsa2048/rsa4096/ec256/ecdsa/ec384。 | rsa2048 |
| `comment` | string | 可选 | 公钥注释。 | 空 |
| `alias` | string | 可选 | 展示别名。 | 空 |
| `hidden` | boolean | 可选 | 是否隐藏。 | false |
| `exportable` | boolean | 可选 | 是否允许以后导出私钥。 | false |
| `request_id` | string | 可选 | 可选请求追踪值，短于32字节，只用字母数字和连字符。 | 无 |

### 请求示例

```json
{
  "id": "example-key",
  "type": "ec256",
  "exportable": false
}
```

### 返回与完成条件

data.generated/id/type；失败可附failed_stage/esp_error/cleanup_complete/cleanup_error。

### 使用要点

生成结果以generated为准；已有ID及生成失败按错误处理，不自动覆盖密钥。

<a id="keyinfo"></a>

## key.info

查看密钥元信息

**方法**：GET / POST
**路径**：`/api/v1/key/info`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `id` | string | 必填 | 本地密钥ID。 | 无默认值 |

### 请求示例

```json
{
  "id": "example-key"
}
```

### 返回与完成条件

data.id/type/type_desc/comment/alias/created/last_used/has_public_key/exportable/hidden。

<a id="keylist"></a>

## key.list

列出可见密钥

**方法**：GET / POST
**路径**：`/api/v1/key/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.keys/count/max_keys；元信息含id/type/type_desc/comment/alias/created/last_used/has_pubkey/exportable/hidden。

### 使用要点

低于ADMIN权限时只看到允许公开的密钥元信息；列表不包含私钥。
