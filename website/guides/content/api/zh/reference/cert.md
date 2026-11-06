# 设备证书接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [cert.delete](#certdelete) | 删除本地设备身份材料 |
| [cert.generate_csr](#certgenerate_csr) | 生成设备证书申请 |
| [cert.generate_keypair](#certgenerate_keypair) | 生成设备身份密钥 |
| [cert.get_certificate](#certget_certificate) | 读取设备公有证书 |
| [cert.install](#certinstall) | 安装设备证书 |
| [cert.install_ca](#certinstall_ca) | 安装并批准 CA 链 |
| [cert.status](#certstatus) | 读取设备证书与诊断服务状态 |

<a id="certdelete"></a>

## cert.delete

删除本地设备身份材料

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/cert/delete`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `confirm` | boolean | 必填 | 必须显式true，确认删除本地PKI材料。 | 无默认值 |

### 请求示例

```json
{
  "confirm": true
}
```

### 返回与完成条件

data.success/message。

### 使用要点

可能改变独立HTTPS诊断服务的身份或进入初始证书状态；不代表签发方已经撤销证书。

<a id="certgenerate_csr"></a>

## cert.generate_csr

生成设备证书申请

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/cert/generate_csr`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `device_id` | string | 可选 | 证书主体的设备标识。 | 构建设定的设备标识 |
| `organization` | string | 可选 | 组织名。 | RMinte |
| `org_unit` | string | 可选 | 组织单位。 | Device |

### 请求示例

```json
{
  "device_id": "YOUR_DEVICE_ID",
  "organization": "YOUR_ORG",
  "org_unit": "Device"
}
```

### 返回与完成条件

data.success/csr_pem；将CSR交给可信签发方签发，不包含私钥。

<a id="certgenerate_keypair"></a>

## cert.generate_keypair

生成设备身份密钥

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/cert/generate_keypair`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `force` | boolean | 可选 | 已有材料时是否请求重新生成。 | false |

### 请求示例

```json
{}
```

### 返回与完成条件

data.success/message。

### 使用要点

替换设备密钥可能使已有证书不再匹配；先确认维护方案。此密钥不是key.*管理的SSH密钥。

<a id="certget_certificate"></a>

## cert.get_certificate

读取设备公有证书

**方法**：GET / POST
**路径**：`/api/v1/cert/get_certificate`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.cert_pem 为设备证书PEM，不包含私钥。

<a id="certinstall"></a>

## cert.install

安装设备证书

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/cert/install`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `cert_pem` | string | 必填 | PEM证书，最多3999内容字节，必须匹配已有设备私钥。 | 无默认值 |

### 请求示例

```json
{
  "cert_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### 返回与完成条件

data.success/message/cert_info；字段含subject_cn/issuer_cn/not_before/not_after/validity/time_ready及到期信息。

### 使用要点

证书保存、有效性与独立HTTPS诊断服务加载状态分别检查；业务API仍使用HTTP80。安装后读取cert.status。

<a id="certinstall_ca"></a>

## cert.install_ca

安装并批准 CA 链

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/cert/install_ca`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `ca_pem` | string | 必填 | 可信CA链PEM；必须通过解析和容量检查。 | 无默认值 |

### 请求示例

```json
{
  "ca_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### 返回与完成条件

data.success/message。

### 使用要点

CA链会影响信任判断；只安装管理方已核验的材料。

<a id="certstatus"></a>

## cert.status

读取设备证书与诊断服务状态

**方法**：GET / POST
**路径**：`/api/v1/cert/status`
**最低权限**：无需登录

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#certificate).

### 请求示例

```json
{}
```

### 返回与完成条件

data.has_private_key/has_certificate/has_ca_chain；证书信息、time_ready/validity/blocked_by及独立HTTPS诊断服务运行态分别返回，见证书返回模型。
