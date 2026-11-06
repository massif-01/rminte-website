# 配置包接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [config.pack.apply](#configpackapply) | 旧通用配置应用入口 |
| [config.pack.content](#configpackcontent) | 读取包内解密内容 |
| [config.pack.export](#configpackexport) | 生成加密配置包 |
| [config.pack.export_cert](#configpackexport_cert) | 读取配置接收证书 |
| [config.pack.import](#configpackimport) | 验证已上传配置包 |
| [config.pack.info](#configpackinfo) | 读取配置包能力 |
| [config.pack.list](#configpacklist) | 列出目录中的配置包 |
| [config.pack.verify](#configpackverify) | 验证配置包信任 |

<a id="configpackapply"></a>

## config.pack.apply

旧通用配置应用入口

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/pack/apply`
**最低权限**：ADMIN

**当前不支持实际操作**，保留名称用于明确回应旧调用。

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 返回与完成条件

data.success=false及不支持的result_code/reason；即使顶层code=0也没有应用配置。

### 使用要点

不支持通用apply。改用相应对象的专用导入流程。

<a id="configpackcontent"></a>

## config.pack.content

读取包内解密内容

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/pack/content`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 配置包名，按包存储接口使用。 | 无默认值 |

### 请求示例

```json
{
  "name": "example"
}
```

### 返回与完成条件

data.name/content/content_raw；content为可解析JSON时的结构内容。

### 使用要点

仅供受信任管理读取；包含配置秘密时不能转入公开日志。

<a id="configpackexport"></a>

## config.pack.export

生成加密配置包

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/pack/export`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 包名称。 | 无默认值 |
| `content` | object / string | 必填 | 待加密配置内容；只允许可编码的JSON内容。 | 无默认值 |
| `recipient_cert` | string | 必填 | 接收设备证书PEM。 | 无默认值 |
| `description` | string | 可选 | 包说明。 | 空 |
| `save_path` | string | 可选 | 可选SD保存路径。 | 不保存设备文件 |

### 请求示例

```json
{
  "name": "example",
  "content": {
    "example": true
  },
  "recipient_cert": "RECIPIENT_CERTIFICATE_PEM"
}
```

### 返回与完成条件

data.tscfg/filename/size；指定保存路径成功时附saved_path。

### 使用要点

导出另要求本设备具有Developer导出能力；生成的包仍需在目标设备校验和专用导入。

<a id="configpackexport_cert"></a>

## config.pack.export_cert

读取配置接收证书

**方法**：GET / POST
**路径**：`/api/v1/config/pack/export_cert`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.certificate/fingerprint/cn；用于向此设备加密配置，不包含私钥。

<a id="configpackimport"></a>

## config.pack.import

验证已上传配置包

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/pack/import`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `content` | string | 与path至少一个 | 配置包的原始JSON文本，不是任意Base64载荷。 | 无默认值 |
| `path` | string | 与content至少一个 | 设备上已上传包的绝对路径。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 返回与完成条件

成功data含valid/result_code/result_message/reason/path/saved_path、name/description/source_file/target_device/created_at及signature；验证不通过返回业务错误。

### 使用要点

content流程可将已验证包保存到包存储，path流程原地校验；都不应用业务配置。实际变更用对应对象专用import。

<a id="configpackinfo"></a>

## config.pack.info

读取配置包能力

**方法**：GET / POST
**路径**：`/api/v1/config/pack/info`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.can_export/device_type/cert_fingerprint/cert_cn/cert_ou/pack_version/algorithm。

<a id="configpacklist"></a>

## config.pack.list

列出目录中的配置包

**方法**：GET / POST
**路径**：`/api/v1/config/pack/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 可选 | 目录绝对路径。 | /sdcard/config |

### 请求示例

```json
{
  "path": "/sdcard/config"
}
```

### 返回与完成条件

data.files/count，包项含name/path/size/mtime/valid及可用的签发信息。

<a id="configpackverify"></a>

## config.pack.verify

验证配置包信任

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/config/pack/verify`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `content` | string | 与path至少一个 | 配置包的原始JSON文本，不是任意Base64载荷。 | 无默认值 |
| `path` | string | 与content至少一个 | 设备上已上传包的绝对路径。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 返回与完成条件

data.valid/result_code/result_message/reason/signature；签名含valid/is_official/signer_cn/signer_ou/signed_at。

### 使用要点

检查嵌套valid和reason；通用验证不表示配置已导入。
