# SSH主机指纹接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [hosts.clear](#hostsclear) | 清空已记住的主机指纹 |
| [hosts.info](#hostsinfo) | 查看主机指纹 |
| [hosts.list](#hostslist) | 列出已记住的主机指纹 |
| [hosts.remove](#hostsremove) | 删除一条指纹记录 |
| [hosts.update](#hostsupdate) | 从主机重新取得指纹 |

<a id="hostsclear"></a>

## hosts.clear

清空已记住的主机指纹

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/hosts/clear`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.cleared。

### 使用要点

会影响后续SSH/SFTP信任核验，不删除SSH主机连接配置。

<a id="hostsinfo"></a>

## hosts.info

查看主机指纹

**方法**：GET / POST
**路径**：`/api/v1/hosts/info`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | 远端地址；信任记录以地址和端口匹配。 | 无默认值 |
| `port` | integer | 可选 | SSH端口1–65535。 | 22 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "port": 22
}
```

### 返回与完成条件

data.host/port/type/fingerprint/added。

<a id="hostslist"></a>

## hosts.list

列出已记住的主机指纹

**方法**：GET / POST
**路径**：`/api/v1/hosts/list`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.hosts/count；每项host/port/type/fingerprint/added。

<a id="hostsremove"></a>

## hosts.remove

删除一条指纹记录

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/hosts/remove`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | 远端地址；信任记录以地址和端口匹配。 | 无默认值 |
| `port` | integer | 可选 | SSH端口1–65535。 | 22 |

### 请求示例

```json
{
  "host": "192.0.2.20"
}
```

### 返回与完成条件

data.host/port/removed。

### 使用要点

删除信任记录不会撤销远端账户或密钥授权；下一次连接需要重新核验。

<a id="hostsupdate"></a>

## hosts.update

从主机重新取得指纹

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/hosts/update`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `host` | string | 必填 | 远端地址；信任记录以地址和端口匹配。 | 无默认值 |
| `port` | integer | 可选 | SSH端口1–65535。 | 22 |

### 请求示例

```json
{
  "host": "192.0.2.20"
}
```

### 返回与完成条件

data.host/port/updated/message。

### 使用要点

会实际连接远端更新信任，先通过可信来源核实主机身份。
