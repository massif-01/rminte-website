# 网络转发接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [nat.disable](#natdisable) | 关闭 NAT 网关 |
| [nat.enable](#natenable) | 启用 NAT 网关 |
| [nat.save](#natsave) | 保存 NAT 配置 |
| [nat.status](#natstatus) | 读取网关状态 |

<a id="natdisable"></a>

## nat.disable

关闭 NAT 网关

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/nat/disable`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.success。

### 使用要点

启用依赖WiFi STA已连接；运行态切换后使用nat.save保存。

<a id="natenable"></a>

## nat.enable

启用 NAT 网关

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/nat/enable`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.success。

### 使用要点

启用依赖WiFi STA已连接；运行态切换后使用nat.save保存。

<a id="natsave"></a>

## nat.save

保存 NAT 配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/nat/save`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.success。

### 使用要点

启用依赖WiFi STA已连接；运行态切换后使用nat.save保存。

<a id="natstatus"></a>

## nat.status

读取网关状态

**方法**：GET / POST
**路径**：`/api/v1/nat/status`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.enabled/state/wifi_connected/eth_up。

### 使用要点

启用依赖WiFi STA已连接；运行态切换后使用nat.save保存。
