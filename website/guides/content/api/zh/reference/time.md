# 时间接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [time.force_sync](#timeforce_sync) | 请求重新同步时间 |
| [time.info](#timeinfo) | 读取时间与同步状态 |
| [time.set_ntp](#timeset_ntp) | 配置 NTP 服务端 |
| [time.set_timezone](#timeset_timezone) | 设置显示时区 |
| [time.sync](#timesync) | 设置设备时间 |

<a id="timeforce_sync"></a>

## time.force_sync

请求重新同步时间

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/time/force_sync`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.syncing/message；之后通过time.info判断同步是否完成。

<a id="timeinfo"></a>

## time.info

读取时间与同步状态

**方法**：GET / POST
**路径**：`/api/v1/time/info`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.timestamp（Unix秒）、timestamp_ms、datetime/timezone、source/sync_status/synced/last_sync/sync_count/ntp_server。

<a id="timeset_ntp"></a>

## time.set_ntp

配置 NTP 服务端

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/time/set_ntp`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `server` | string | 必填 | NTP服务端名称或地址。 | 无默认值 |
| `index` | integer | 可选 | 服务端槽位索引。 | 0 |

### 请求示例

```json
{
  "server": "YOUR_NTP_SERVER",
  "index": 0
}
```

### 返回与完成条件

data.server/index/success。

<a id="timeset_timezone"></a>

## time.set_timezone

设置显示时区

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/time/set_timezone`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `timezone` | string | 必填 | POSIX时区字符串，例如CST-8。 | 无默认值 |

### 请求示例

```json
{
  "timezone": "CST-8"
}
```

### 返回与完成条件

data.timezone/local_time/success。

<a id="timesync"></a>

## time.sync

设置设备时间

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/time/sync`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `timestamp_ms` | integer | 必填 | Unix毫秒时间戳。 | 无默认值 |

### 请求示例

```json
{
  "timestamp_ms": 1793894400000
}
```

### 返回与完成条件

data.datetime/synced/source。

### 使用要点

设置时间会影响证书有效期等判断；调用后读取time.info确认。
