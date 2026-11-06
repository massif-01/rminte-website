# ネットワーク API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [network.eth.status](#networkethstatus) | イーサネットステータスの取得 |
| [network.hostname](#networkhostname) | ホスト名を取得・設定する |
| [network.status](#networkstatus) | ネットワーク全体のステータスを取得します |
| [network.wifi.ap.config](#networkwifiapconfig) | WiFi AP の構成 |
| [network.wifi.ap.stations](#networkwifiapstations) | AP に接続している端末を取得する |
| [network.wifi.connect](#networkwificonnect) | WiFi ネットワークに接続する |
| [network.wifi.disconnect](#networkwifidisconnect) | WiFi から切断 |
| [network.wifi.mode](#networkwifimode) | WiFi モードを取得・設定する |
| [network.wifi.scan](#networkwifiscan) | WiFi ネットワークをスキャンします |

<a id="networkethstatus"></a>

## network.eth.status

イーサネットステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/network/eth/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.status/link_up、config_error/config_error_name/interface_present、取得可能な IP/netmask/gateway/dns1/dns2、送受信の統計を返します。

<a id="networkhostname"></a>

## network.hostname

ホスト名を取得・設定する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/hostname`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `hostname` | string | 任意 | 新しいデバイスのホスト名。 | クエリのみ |

### リクエストの例

```json
{}
```

### 応答と完了

data.hostname.

### 使用上の注意

アクセス アドレスと証明書名の一致を変更できます。クライアントは実際のアドレスを確認する必要があります。

<a id="networkstatus"></a>

## network.status

ネットワーク全体のステータスを取得します

**メソッド**: GET / POST
**パス**: `/api/v1/network/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.hostname/wifi_mode、ethernet、wifi_sta、wifi_ap を返します。ethernet には config_error/config_error_name/interface_present も含まれます。IP と gateway の各フィールドは接続状態によって変わります。

<a id="networkwifiapconfig"></a>

## network.wifi.ap.config

WiFi AP の構成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/wifi/ap/config`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `ssid` | string | 必須 | アクセスポイントのSSID。 | 既定値なし |
| `password` | string | 任意 | アクセスポイントのパスワード。省略するか空にすると、認証なしの AP を作成します。 | 空の文字列 |
| `channel` | integer | 任意 | アクセスポイントのチャネル。 | 実装初期値 |
| `hidden` | boolean | 任意 | SSIDを非表示にします。 | false |

### リクエストの例

```json
{
  "ssid": "TianShanOS",
  "password": "REPLACE_WITH_STRONG_PASSWORD",
  "channel": 6,
  "hidden": false
}
```

### 応答と完了

data.ssid/auth/channel/hidden/configured.

### 使用上の注意

ホットスポットを変更すると、現在の接続に影響する可能性があります。

<a id="networkwifiapstations"></a>

## network.wifi.ap.stations

AP に接続している端末を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/network/wifi/ap/stations`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.count/stations に、接続中のクライアントと取得可能な信号情報が含まれます。

<a id="networkwificonnect"></a>

## network.wifi.connect

WiFi ネットワークに接続する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/wifi/connect`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `ssid` | string | 必須 | ターゲット ネットワーク SSID。 | 既定値なし |
| `password` | string | 任意 | ネットワークパスワード。 | 空の文字列 |

### リクエストの例

```json
{
  "ssid": "YOUR_SSID",
  "password": "YOUR_WIFI_PASSWORD"
}
```

### 応答と完了

data.ssid/connecting. アドレスが取得されるまで WiFi の状態を照会して下さい。

### 使用上の注意

アクティブなネットワーク接続を変更できます。別のアクセスルートを用意してください。

<a id="networkwifidisconnect"></a>

## network.wifi.disconnect

WiFi から切断

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/wifi/disconnect`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.disconnected. 管理コネクティビティも終了することがあります。

<a id="networkwifimode"></a>

## network.wifi.mode

WiFi モードを取得・設定する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/wifi/mode`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `mode` | string | 任意 | off/sta/ap/apsta。 | クエリのみ |

### リクエストの例

```json
{
  "mode": "apsta"
}
```

### 応答と完了

data.mode.

### 使用上の注意

sta はネットワークへ接続し、ap はアクセスポイントを提供します。切り替えると管理接続が切れる場合があります。

<a id="networkwifiscan"></a>

## network.wifi.scan

WiFi ネットワークをスキャンします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/wifi/scan`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.count/networks を返します。各項目には ssid/rssi/channel/auth、wifi.scan ではさらに bssid が含まれます。RSSI の単位は dBm です。

### 使用上の注意

実際にスキャンを開始します。二つの API の権限要件は同じですが、auth の表記やフィールドが異なります。
