# Network APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [network.eth.status](#networkethstatus) | Get Ethernet status |
| [network.hostname](#networkhostname) | Get/set hostname |
| [network.status](#networkstatus) | Get overall network status |
| [network.wifi.ap.config](#networkwifiapconfig) | Configure WiFi AP |
| [network.wifi.ap.stations](#networkwifiapstations) | Get connected AP stations |
| [network.wifi.connect](#networkwificonnect) | Connect to WiFi network |
| [network.wifi.disconnect](#networkwifidisconnect) | Disconnect from WiFi |
| [network.wifi.mode](#networkwifimode) | Get/set WiFi mode |
| [network.wifi.scan](#networkwifiscan) | Scan for WiFi networks |

<a id="networkethstatus"></a>

## network.eth.status

Get Ethernet status

**Methods**: GET / POST
**Path**: `/api/v1/network/eth/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.status/link_up, config_error/config_error_name/interface_present, available IP/netmask/gateway/dns1/dns2, and transmit/receive stats.

<a id="networkhostname"></a>

## network.hostname

Get/set hostname

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/hostname`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `hostname` | string | Optional | New device hostname. | Query only |

### Request example

```json
{}
```

### Response and completion

data.hostname.

### Usage notes

Can change access addresses and certificate name matching. Clients should check the actual address.

<a id="networkstatus"></a>

## network.status

Get overall network status

**Methods**: GET / POST
**Path**: `/api/v1/network/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.hostname/wifi_mode, ethernet, wifi_sta, and wifi_ap. ethernet also includes config_error/config_error_name/interface_present. IP and gateway fields depend on connection state.

<a id="networkwifiapconfig"></a>

## network.wifi.ap.config

Configure WiFi AP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/wifi/ap/config`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `ssid` | string | Required | Access-point SSID. | No default |
| `password` | string | Optional | Access-point password; omitted/empty creates an open AP. | Empty string |
| `channel` | integer | Optional | Access-point channel. | Implementation initial value |
| `hidden` | boolean | Optional | Hide the SSID. | false |

### Request example

```json
{
  "ssid": "TianShanOS",
  "password": "REPLACE_WITH_STRONG_PASSWORD",
  "channel": 6,
  "hidden": false
}
```

### Response and completion

data.ssid/auth/channel/hidden/configured.

### Usage notes

Changing the hotspot can affect current connectivity.

<a id="networkwifiapstations"></a>

## network.wifi.ap.stations

Get connected AP stations

**Methods**: GET / POST
**Path**: `/api/v1/network/wifi/ap/stations`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.count/stations with associated clients and available signal information.

<a id="networkwificonnect"></a>

## network.wifi.connect

Connect to WiFi network

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/wifi/connect`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `ssid` | string | Required | Target network SSID. | No default |
| `password` | string | Optional | Network password. | Empty string |

### Request example

```json
{
  "ssid": "YOUR_SSID",
  "password": "YOUR_WIFI_PASSWORD"
}
```

### Response and completion

data.ssid/connecting. Query WiFi state until an address is acquired.

### Usage notes

Can change the active network connection; prepare another access route.

<a id="networkwifidisconnect"></a>

## network.wifi.disconnect

Disconnect from WiFi

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/wifi/disconnect`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.disconnected. Management connectivity may also end.

<a id="networkwifimode"></a>

## network.wifi.mode

Get/set WiFi mode

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/wifi/mode`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `mode` | string | Optional | off/sta/ap/apsta. | Query only |

### Request example

```json
{
  "mode": "apsta"
}
```

### Response and completion

data.mode.

### Usage notes

sta joins a network; ap offers a hotspot. Switching can disconnect management.

<a id="networkwifiscan"></a>

## network.wifi.scan

Scan for WiFi networks

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/network/wifi/scan`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.count/networks; entries ssid/rssi/channel/auth, plus bssid for wifi.scan. RSSI is dBm.

### Usage notes

Starts a real scan. Both entries have the same access requirements but differing auth text/fields.
