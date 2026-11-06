# 网络接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [network.eth.status](#networkethstatus) | 读取以太网状态 |
| [network.hostname](#networkhostname) | 查询或修改设备主机名 |
| [network.status](#networkstatus) | 读取网络总览 |
| [network.wifi.ap.config](#networkwifiapconfig) | 配置设备无线热点 |
| [network.wifi.ap.stations](#networkwifiapstations) | 读取热点关联终端 |
| [network.wifi.connect](#networkwificonnect) | 连接无线网络 |
| [network.wifi.disconnect](#networkwifidisconnect) | 断开无线接入 |
| [network.wifi.mode](#networkwifimode) | 查询或切换 WiFi 模式 |
| [network.wifi.scan](#networkwifiscan) | 扫描附近无线网络 |

<a id="networkethstatus"></a>

## network.eth.status

读取以太网状态

**方法**：GET / POST
**路径**：`/api/v1/network/eth/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.status/link_up、config_error/config_error_name/interface_present，与有效时的ip/netmask/gateway/dns1/dns2及stats收发统计。

<a id="networkhostname"></a>

## network.hostname

查询或修改设备主机名

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/hostname`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `hostname` | string | 可选 | 要设置的新主机名。 | 省略时只查询 |

### 请求示例

```json
{}
```

### 返回与完成条件

data.hostname。

### 使用要点

修改可能影响后续访问地址及证书名称匹配；已有客户端应核对实际地址。

<a id="networkstatus"></a>

## network.status

读取网络总览

**方法**：GET / POST
**路径**：`/api/v1/network/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.hostname/wifi_mode、ethernet、wifi_sta、wifi_ap。ethernet另含config_error/config_error_name/interface_present；IP、网关等字段依连接状态存在。

<a id="networkwifiapconfig"></a>

## network.wifi.ap.config

配置设备无线热点

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/wifi/ap/config`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `ssid` | string | 必填 | 热点名称。 | 无默认值 |
| `password` | string | 可选 | 热点密码；省略或空串会配置开放热点。 | 空字符串 |
| `channel` | integer | 可选 | 热点信道。 | 当前实现初值 |
| `hidden` | boolean | 可选 | 是否隐藏SSID。 | false |

### 请求示例

```json
{
  "ssid": "TianShanOS",
  "password": "REPLACE_WITH_STRONG_PASSWORD",
  "channel": 6,
  "hidden": false
}
```

### 返回与完成条件

data.ssid/auth/channel/hidden/configured。

### 使用要点

改变热点可能影响当前连接。

<a id="networkwifiapstations"></a>

## network.wifi.ap.stations

读取热点关联终端

**方法**：GET / POST
**路径**：`/api/v1/network/wifi/ap/stations`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.count/stations；返回已关联终端及可用信号信息。

<a id="networkwificonnect"></a>

## network.wifi.connect

连接无线网络

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/wifi/connect`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `ssid` | string | 必填 | 目标网络SSID。 | 无默认值 |
| `password` | string | 可选 | 网络密码。 | 空字符串 |

### 请求示例

```json
{
  "ssid": "YOUR_SSID",
  "password": "YOUR_WIFI_PASSWORD"
}
```

### 返回与完成条件

data.ssid/connecting；继续查询WiFi状态确认地址已经获得。

### 使用要点

可能改变当前网络连接；准备好新的访问方式。

<a id="networkwifidisconnect"></a>

## network.wifi.disconnect

断开无线接入

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/wifi/disconnect`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.disconnected；管理连接可能随之中断。

<a id="networkwifimode"></a>

## network.wifi.mode

查询或切换 WiFi 模式

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/wifi/mode`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `mode` | string | 可选 | off/sta/ap/apsta。 | 省略时只查询 |

### 请求示例

```json
{
  "mode": "apsta"
}
```

### 返回与完成条件

data.mode。

### 使用要点

sta为接入现有无线网络，ap为设备提供热点；切换可能断开当前管理连接。

<a id="networkwifiscan"></a>

## network.wifi.scan

扫描附近无线网络

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/wifi/scan`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.count/networks；每项含ssid/rssi/channel/auth，wifi.scan另含bssid。rssi单位dBm。

### 使用要点

会实际启动扫描；两个入口认证要求相同，返回的auth文本与字段有所区别。
