# 日志接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [log.capture](#logcapture) | 控制系统日志捕获 |
| [log.clear](#logclear) | 清空日志缓冲 |
| [log.list](#loglist) | 查询系统日志 |
| [log.setLevel](#logsetlevel) | 设置日志输出级别 |
| [log.stats](#logstats) | 读取日志缓冲统计 |

<a id="logcapture"></a>

## log.capture

控制系统日志捕获

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/log/capture`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 必填 | 是否把系统日志捕获进日志缓冲。 | 无默认值 |

### 请求示例

```json
{
  "enable": true
}
```

### 返回与完成条件

data.capturing。

<a id="logclear"></a>

## log.clear

清空日志缓冲

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/log/clear`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.cleared；之前的内存日志无法再从该缓冲读取。

<a id="loglist"></a>

## log.list

查询系统日志

**方法**：GET / POST
**路径**：`/api/v1/log/list`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 可选 | 在本次搜索结果内的起始偏移。 | 0 |
| `limit` | integer | 可选 | 最多返回数量1–200。 | 50 |
| `level` | integer | 可选 | 仅该日志级别1–5；与范围筛选不要混用。 | 全部 |
| `minLevel` | integer | 可选 | 最小级别。 | ERROR |
| `maxLevel` | integer | 可选 | 最大级别。 | VERBOSE |
| `tag` | string | 可选 | 模块名子串筛选。 | 无 |
| `keyword` | string | 可选 | 消息关键字。 | 无 |

### 请求示例

```json
{
  "limit": 50
}
```

### 返回与完成条件

data.logs数组与total/offset/returned/bufferCapacity/bufferCount；日志项timestamp为启动后毫秒，含level/levelName/tag/message/task。

### 使用要点

内存缓冲有限；offset作用在已选出的搜索结果上，不是无限历史分页。

<a id="logsetlevel"></a>

## log.setLevel

设置日志输出级别

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/log/setLevel`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `level` | integer / string | 必填 | 0–5或error/warn/info/debug/verbose等日志级别名。 | 无默认值 |
| `tag` | string | 可选 | 指定模块；省略为全局。 | 全局 |

### 请求示例

```json
{
  "level": 3
}
```

### 返回与完成条件

data.level为级别名称；指定模块时另含tag。

<a id="logstats"></a>

## log.stats

读取日志缓冲统计

**方法**：GET / POST
**路径**：`/api/v1/log/stats`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data 为日志缓冲和捕获状态统计；用于判断容量与当前记录情况。
