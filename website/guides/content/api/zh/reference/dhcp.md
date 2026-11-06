# 地址分配接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [dhcp.clients](#dhcpclients) | 读取 DHCP 租约 |
| [dhcp.start](#dhcpstart) | 启动 DHCP 服务 |
| [dhcp.status](#dhcpstatus) | 读取 DHCP 状态 |
| [dhcp.stop](#dhcpstop) | 停止 DHCP 服务 |

<a id="dhcpclients"></a>

## dhcp.clients

读取 DHCP 租约

**方法**：GET / POST
**路径**：`/api/v1/dhcp/clients`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `interface` | string | 可选 | ap/wifi 或 eth/ethernet。 | 查询省略时聚合；启停省略时ap |

### 请求示例

```json
{
  "interface": "ap"
}
```

### 返回与完成条件

data.clients/count，租约含mac/ip/hostname、lease_start/lease_expire/is_static。

<a id="dhcpstart"></a>

## dhcp.start

启动 DHCP 服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/dhcp/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `interface` | string | 可选 | ap/wifi 或 eth/ethernet。 | 查询省略时聚合；启停省略时ap |

### 请求示例

```json
{
  "interface": "ap"
}
```

### 返回与完成条件

data.interface/started。

<a id="dhcpstatus"></a>

## dhcp.status

读取 DHCP 状态

**方法**：GET / POST
**路径**：`/api/v1/dhcp/status`
**最低权限**：READ

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `interface` | string | 可选 | ap/wifi 或 eth/ethernet。 | 查询省略时聚合；启停省略时ap |

### 请求示例

```json
{
  "interface": "ap"
}
```

### 返回与完成条件

data.interfaces或单接口，含state/running、pool、gateway/dns/netmask/lease_min及统计；另有interface_present/restore_error/apply_error。eth另含want_running/link_up/resume_error；错误码0表示该步骤未报告错误。

### 使用要点

want_running是期望运行状态，不等于running；接口不存在、链路断开或恢复失败时分别检查新增状态，不能只看是否分配到地址。

<a id="dhcpstop"></a>

## dhcp.stop

停止 DHCP 服务

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/dhcp/stop`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `interface` | string | 可选 | ap/wifi 或 eth/ethernet。 | 查询省略时聚合；启停省略时ap |

### 请求示例

```json
{
  "interface": "ap"
}
```

### 返回与完成条件

data.interface/stopped。
