# ネットワーク転送 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [nat.disable](#natdisable) | NAT ゲートウェイを無効にする |
| [nat.enable](#natenable) | NAT ゲートウェイを有効にする |
| [nat.save](#natsave) | NAT 構成を保存する |
| [nat.status](#natstatus) | NAT ゲートウェイのステータスを取得する |

<a id="natdisable"></a>

## nat.disable

NAT ゲートウェイを無効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/nat/disable`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.success.

### 使用上の注意

有効にするには、接続された WiFi STA が必要です。 nat.save を使用してランタイムの変更を保存します。

<a id="natenable"></a>

## nat.enable

NAT ゲートウェイを有効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/nat/enable`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.success.

### 使用上の注意

有効にするには、接続された WiFi STA が必要です。 nat.save を使用してランタイムの変更を保存します。

<a id="natsave"></a>

## nat.save

NAT 構成を保存する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/nat/save`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.success.

### 使用上の注意

有効にするには、接続された WiFi STA が必要です。 nat.save を使用してランタイムの変更を保存します。

<a id="natstatus"></a>

## nat.status

NAT ゲートウェイのステータスを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/nat/status`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.enabled/state/wifi_connected/eth_up.

### 使用上の注意

有効にするには、接続された WiFi STA が必要です。 nat.save を使用してランタイムの変更を保存します。
