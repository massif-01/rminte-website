# WiFi管理接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [wifi.connect](#wificonnect) | 连接无线网络 |
| [wifi.disconnect](#wifidisconnect) | 断开无线接入 |
| [wifi.scan](#wifiscan) | 扫描附近无线网络 |
| [wifi.status](#wifistatus) | 读取 WiFi 管理状态 |

<a id="wificonnect"></a>

## wifi.connect

连接无线网络

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/wifi/connect`
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

<a id="wifidisconnect"></a>

## wifi.disconnect

断开无线接入

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/wifi/disconnect`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.disconnected；管理连接可能随之中断。

<a id="wifiscan"></a>

## wifi.scan

扫描附近无线网络

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/wifi/scan`
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

<a id="wifistatus"></a>

## wifi.status

读取 WiFi 管理状态

**方法**：GET / POST
**路径**：`/api/v1/wifi/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.ap 与 data.sta 含 state/has_ip；获得地址时附ip，STA还可能含gateway/rssi。与network.status的结构不同。
