# 设备文件接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [storage.delete](#storagedelete) | 删除文件或目录 |
| [storage.info](#storageinfo) | 读取文件信息 |
| [storage.list](#storagelist) | 列出目录 |
| [storage.mkdir](#storagemkdir) | 建立目录 |
| [storage.mount](#storagemount) | 挂载 SD 卡 |
| [storage.read](#storageread) | 读取小文本或 JSON 文件 |
| [storage.rename](#storagerename) | 移动或重命名文件 |
| [storage.status](#storagestatus) | 读取存储挂载状态 |
| [storage.unmount](#storageunmount) | 卸载 SD 卡 |

<a id="storagedelete"></a>

## storage.delete

删除文件或目录

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/storage/delete`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example.txt"
}
```

### 返回与完成条件

data.deleted 为删除路径。

### 使用要点

支持/sdcard/、/spiffs/、/www/下允许操作的路径；目录可能递归删除，受管配置与存储根目录仍受保护。

<a id="storageinfo"></a>

## storage.info

读取文件信息

**方法**：GET / POST
**路径**：`/api/v1/storage/info`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example.txt"
}
```

### 返回与完成条件

data.path/name/type/size/modified；修改时间为文件系统时间，单位Unix秒。

<a id="storagelist"></a>

## storage.list

列出目录

**方法**：GET / POST
**路径**：`/api/v1/storage/list`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 可选 | 目录绝对路径。 | /sdcard |
| `recursive` | boolean | 可选 | 当前未实现递归；传true仍只列当前目录，建议省略。 | false |

### 请求示例

```json
{
  "path": "/sdcard"
}
```

### 返回与完成条件

data.path/entries；每项有name/type/size等信息。列表读取敏感目录需ADMIN。

<a id="storagemkdir"></a>

## storage.mkdir

建立目录

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/storage/mkdir`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example"
}
```

### 返回与完成条件

data.created 为路径。

<a id="storagemount"></a>

## storage.mount

挂载 SD 卡

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/storage/mount`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.status，挂载时附path。

### 使用要点

会影响使用SD文件的其他操作；卸载前结束文件和升级任务。

<a id="storageread"></a>

## storage.read

读取小文本或 JSON 文件

**方法**：GET / POST
**路径**：`/api/v1/storage/read`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `path` | string | 必填 | 设备上的绝对路径；受管配置与敏感文件另受限制。 | 无默认值 |

### 请求示例

```json
{
  "path": "/sdcard/example.txt"
}
```

### 返回与完成条件

data.path/size/type/content；type=json时content为解析结果，type=text时为字符串。

### 使用要点

文件最大8192字节；敏感路径要求ADMIN。二进制或大文件使用专用下载。

<a id="storagerename"></a>

## storage.rename

移动或重命名文件

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/storage/rename`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `from` | string | 必填 | 原绝对路径。 | 无默认值 |
| `to` | string | 必填 | 目标绝对路径。 | 无默认值 |

### 请求示例

```json
{
  "from": "/sdcard/example.txt",
  "to": "/sdcard/renamed.txt"
}
```

### 返回与完成条件

data.from/to。

### 使用要点

原路径和目标路径均须位于允许的/sdcard/、/spiffs/或/www/范围，并通过受管路径检查；文件系统与挂载状态仍可能限制移动。

<a id="storagestatus"></a>

## storage.status

读取存储挂载状态

**方法**：GET / POST
**路径**：`/api/v1/storage/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.sd/spiffs，分别含mounted及存在时的path。

<a id="storageunmount"></a>

## storage.unmount

卸载 SD 卡

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/storage/unmount`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.status，挂载时附path。

### 使用要点

会影响使用SD文件的其他操作；卸载前结束文件和升级任务。
