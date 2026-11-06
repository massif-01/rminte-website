# 远端文件接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [sftp.get](#sftpget) | 下载远端文件到设备 |
| [sftp.ls](#sftpls) | 列出远端目录 |
| [sftp.mkdir](#sftpmkdir) | 建立远端目录 |
| [sftp.put](#sftpput) | 上传设备文件到远端 |
| [sftp.rm](#sftprm) | 删除远端文件 |
| [sftp.stat](#sftpstat) | 读取远端文件属性 |

<a id="sftpget"></a>

## sftp.get

下载远端文件到设备

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/sftp/get`
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
| `remote` | string | 必填 | 远端文件绝对路径。 | 无默认值 |
| `local` | string | 必填 | 设备本地文件绝对路径。 | 无默认值 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### 返回与完成条件

data.remote/local/success；写入设备本地文件。

### 使用要点

需要远端可信主机指纹及认证；失败不自动接受指纹。get的本地目标受外部写路径限制；put会把本地内容发送给远端。

<a id="sftpls"></a>

## sftp.ls

列出远端目录

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/sftp/ls`
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
| `path` | string | 必填 | 远端目录或文件路径。 | 无默认值 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 返回与完成条件

data.path/files，文件项含name/size/is_dir/mtime/permissions。

### 使用要点

需要远端可信主机指纹及认证；失败不自动接受指纹。get的本地目标受外部写路径限制；put会把本地内容发送给远端。

<a id="sftpmkdir"></a>

## sftp.mkdir

建立远端目录

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/sftp/mkdir`
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
| `path` | string | 必填 | 远端目录或文件路径。 | 无默认值 |
| `mode` | integer | 可选 | 权限位，JSON使用十进制；0755对应493。 | 493 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 返回与完成条件

data.path/created。

### 使用要点

需要远端可信主机指纹及认证；失败不自动接受指纹。get的本地目标受外部写路径限制；put会把本地内容发送给远端。

<a id="sftpput"></a>

## sftp.put

上传设备文件到远端

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/sftp/put`
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
| `remote` | string | 必填 | 远端文件绝对路径。 | 无默认值 |
| `local` | string | 必填 | 设备本地文件绝对路径。 | 无默认值 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### 返回与完成条件

data.remote/local/success；写入远端文件。

### 使用要点

需要远端可信主机指纹及认证；失败不自动接受指纹。get的本地目标受外部写路径限制；put会把本地内容发送给远端。

<a id="sftprm"></a>

## sftp.rm

删除远端文件

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/sftp/rm`
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
| `path` | string | 必填 | 远端目录或文件路径。 | 无默认值 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 返回与完成条件

data.path/deleted。

### 使用要点

需要远端可信主机指纹及认证；失败不自动接受指纹。get的本地目标受外部写路径限制；put会把本地内容发送给远端。

<a id="sftpstat"></a>

## sftp.stat

读取远端文件属性

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/sftp/stat`
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
| `path` | string | 必填 | 远端目录或文件路径。 | 无默认值 |

### 请求示例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 返回与完成条件

data.path/size/is_dir/is_link/uid/gid/permissions/atime/mtime。

### 使用要点

需要远端可信主机指纹及认证；失败不自动接受指纹。get的本地目标受外部写路径限制；put会把本地内容发送给远端。
