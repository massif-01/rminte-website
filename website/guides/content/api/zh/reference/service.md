# 控制器服务接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [service.list](#servicelist) | 列出控制器内部服务 |
| [service.restart](#servicerestart) | 重启控制器内部服务 |
| [service.start](#servicestart) | 启动控制器内部服务 |
| [service.status](#servicestatus) | 读取一个内部服务状态 |
| [service.stop](#servicestop) | 停止控制器内部服务 |

<a id="servicelist"></a>

## service.list

列出控制器内部服务

**方法**：GET / POST
**路径**：`/api/v1/service/list`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.total/running/services；各项name/state/phase/healthy/start_time_ms/start_duration_ms。

<a id="servicerestart"></a>

## service.restart

重启控制器内部服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/service/restart`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 从service.list取得的服务名。 | 无默认值 |

### 请求示例

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 返回与完成条件

data.name/status。

### 使用要点

维护操作可能中断网络、WebUI或其他依赖；远端业务程序使用automation.services。

<a id="servicestart"></a>

## service.start

启动控制器内部服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/service/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 从service.list取得的服务名。 | 无默认值 |

### 请求示例

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 返回与完成条件

data.name/status。

### 使用要点

维护操作可能中断网络、WebUI或其他依赖；远端业务程序使用automation.services。

<a id="servicestatus"></a>

## service.status

读取一个内部服务状态

**方法**：GET / POST
**路径**：`/api/v1/service/status`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 从service.list取得的服务名。 | 无默认值 |

### 请求示例

```json
{
  "name": "webui"
}
```

### 返回与完成条件

data.name/state/phase/healthy/start_time_ms/start_duration_ms。

<a id="servicestop"></a>

## service.stop

停止控制器内部服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/service/stop`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `name` | string | 必填 | 从service.list取得的服务名。 | 无默认值 |

### 请求示例

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 返回与完成条件

data.name/status。

### 使用要点

维护操作可能中断网络、WebUI或其他依赖；远端业务程序使用automation.services。
