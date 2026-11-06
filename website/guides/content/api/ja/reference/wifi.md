# Wi-Fi API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [wifi.connect](#wificonnect) | WiFi ネットワークに接続する |
| [wifi.disconnect](#wifidisconnect) | WiFi から切断 |
| [wifi.scan](#wifiscan) | WiFi ネットワークをスキャンします |
| [wifi.status](#wifistatus) | WiFi ステータスを取得する |

<a id="wificonnect"></a>

## wifi.connect

WiFi ネットワークに接続する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/wifi/connect`
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

<a id="wifidisconnect"></a>

## wifi.disconnect

WiFi から切断

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/wifi/disconnect`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.disconnected. 管理コネクティビティも終了することがあります。

<a id="wifiscan"></a>

## wifi.scan

WiFi ネットワークをスキャンします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/wifi/scan`
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

<a id="wifistatus"></a>

## wifi.status

WiFi ステータスを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/wifi/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.ap/sta に state/has_ip と取得可能な ip が含まれます。STA では gateway/rssi が追加される場合があります。network.status とは構造が異なります。
