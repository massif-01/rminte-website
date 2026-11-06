# WiFi management APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [wifi.connect](#wificonnect) | Connect to WiFi network |
| [wifi.disconnect](#wifidisconnect) | Disconnect from WiFi |
| [wifi.scan](#wifiscan) | Scan for WiFi networks |
| [wifi.status](#wifistatus) | Get WiFi status |

<a id="wificonnect"></a>

## wifi.connect

Connect to WiFi network

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/wifi/connect`
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

<a id="wifidisconnect"></a>

## wifi.disconnect

Disconnect from WiFi

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/wifi/disconnect`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.disconnected. Management connectivity may also end.

<a id="wifiscan"></a>

## wifi.scan

Scan for WiFi networks

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/wifi/scan`
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

<a id="wifistatus"></a>

## wifi.status

Get WiFi status

**Methods**: GET / POST
**Path**: `/api/v1/wifi/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.ap/sta with state/has_ip, available ip; STA may add gateway/rssi. Structure differs from network.status.
