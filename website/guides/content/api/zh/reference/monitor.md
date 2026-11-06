# 算力监控接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [monitor.config](#monitorconfig) | 读取算力监控配置 |
| [monitor.data](#monitordata) | 读取算力主机最新遥测 |
| [monitor.set_server](#monitorset_server) | 配置算力监控地址 |
| [monitor.start](#monitorstart) | 启动算力监控 |
| [monitor.status](#monitorstatus) | 读取算力监控连接状态 |
| [monitor.stop](#monitorstop) | 停止算力监控 |

<a id="monitorconfig"></a>

## monitor.config

读取算力监控配置

**方法**：GET / POST
**路径**：`/api/v1/monitor/config`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.server/port/reconnect_ms/heartbeat_timeout_ms/startup_delay_ms/auto_start/update_temp_source。

<a id="monitordata"></a>

## monitor.data

读取算力主机最新遥测

**方法**：GET / POST
**路径**：`/api/v1/monitor/data`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.timestamp；cpu含cores/data（id/usage/freq），memory含ram/swap的used/total（MB），temperature含cpu/soc0/soc1/soc2/tj（°C），power含gpu_soc/cpu_cv/sys_5v的current/average（mW），gpu含gr3d_freq_pct。

### 使用要点

没有有效算力数据会返回业务失败；这是算力主机指标。

<a id="monitorset_server"></a>

## monitor.set_server

配置算力监控地址

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/monitor/set_server`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `server` | string | 必填 | 监控服务地址。 | 无默认值 |
| `port` | integer | 可选 | 服务端口1–65535；省略按驱动默认处理。 | 0表示采用默认处理 |

### 请求示例

```json
{
  "server": "192.0.2.20",
  "port": 58090
}
```

### 返回与完成条件

data.server/port/saved。

<a id="monitorstart"></a>

## monitor.start

启动算力监控

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/monitor/start`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.started。

<a id="monitorstatus"></a>

## monitor.status

读取算力监控连接状态

**方法**：GET / POST
**路径**：`/api/v1/monitor/status`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.initialized/running/connection/reconnects/messages/errors/reliability/connected_time_ms；失败时可能有last_error。

<a id="monitorstop"></a>

## monitor.stop

停止算力监控

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/monitor/stop`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.stopped。
