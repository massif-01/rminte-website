# コンピューターと USB API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [device.fan.set](#devicefanset) | ファンモードとデューティ比を設定します |
| [device.fan.status](#devicefanstatus) | ファンステータスの取得 |
| [device.ping](#deviceping) | ネットワーク接続のテスト (TCP ポートのチェック) |
| [device.power](#devicepower) | 機器の電源を制御する（on/off/force_off） |
| [device.power.status](#devicepowerstatus) | 電力測定値の取得 |
| [device.reset](#devicereset) | デバイスをリセットします |
| [device.status](#devicestatus) | デバイスの電源ステータスの取得 |
| [device.usb.set](#deviceusbset) | USB MUX ターゲットの設定 |
| [device.usb.status](#deviceusbstatus) | USB MUX ステータスの取得 |

<a id="devicefanset"></a>

## device.fan.set

ファンモードとデューティ比を設定します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/device/fan/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `fan` | integer | 必須 | ファン ID。 | 既定値なし |
| `mode` | string | 任意 | off/manual/auto/curve。この互換 API では専用の処理を行います。 | 変更なし |
| `duty` | integer | 任意 | 手動デューティ、0 ～ 100 パーセント。 | 変更なし |

### リクエストの例

```json
{
  "fan": 0,
  "mode": "manual",
  "duty": 50
}
```

### 応答と完了

data.fan/success.

### 使用上の注意

新しい統合には、個別の fan.mode 呼び出しと fan.set 呼び出しを優先します。

<a id="devicefanstatus"></a>

## device.fan.status

ファンステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/device/fan/status`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `fan` | integer | 任意 | ファン ID。 | 全て |

### リクエストの例

```json
{}
```

### 応答と完了

data.fans または単一ファンの情報を返します。互換用の temp はこの API のモデルに従います。新しい連携では fan.status を優先してください。

<a id="deviceping"></a>

## device.ping

ネットワーク接続のテスト (TCP ポートのチェック)

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/device/ping`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | ターゲットの IPv4 アドレスまたはホスト名。 | 既定値なし |
| `timeout` | integer | 任意 | リクエストのタイムアウト (ミリ秒単位)。 | 1000 |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "timeout": 1000
}
```

### 応答と完了

data.host/reachable を返します。成功時は latency_ms、失敗時は error が含まれる場合があります。

### 使用上の注意

reachable=false は診断結果です。API が実行されなかったことを示すものではありません。

<a id="devicepower"></a>

## device.power

機器の電源を制御する（on/off/force_off）

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/device/power`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | 対象コンピューター：agx=推論、lpmu=アプリケーション。 | agx |
| `action` | string | 必須 | on/off/toggle/force_off。 | 既定値なし |

### リクエストの例

```json
{
  "device": "agx",
  "action": "on"
}
```

### 応答と完了

data.device/action/success は制御要求の結果を示します。その後も device.status を読み取って確認してください。

### 使用上の注意

force_off では未保存のデータが失われる場合があります。通常のシャットダウンを優先してください。toggle を繰り返すと、再び状態が反転します。

<a id="devicepowerstatus"></a>

## device.power.status

電力測定値の取得

**メソッド**: GET / POST
**パス**: `/api/v1/device/power/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.rails の各項目に name/voltage_mv/current_ma/power_mw が含まれ、total_power_mw も返されます。単位は mV/mA/mW です。

<a id="devicereset"></a>

## device.reset

デバイスをリセットします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/device/reset`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | 対象コンピューター：agx=推論、lpmu=アプリケーション。 | agx |

### リクエストの例

```json
{
  "device": "agx"
}
```

### 応答と完了

data.device/reset. その後、コンピュータとアプリケーションの状態を再度チェックします。

### 使用上の注意

ターゲット コンピュータの作業を中断します。

<a id="devicestatus"></a>

## device.status

デバイスの電源ステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/device/status`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | 対象コンピューター：agx=推論、lpmu=アプリケーション。 | agx |

### リクエストの例

```json
{
  "device": "agx"
}
```

### 応答と完了

data.device/state/power_good/uptime_ms/boot_count を返します。state は off/standby/on/booting/error のいずれかです。

### 使用上の注意

電源状態はOSを確立しません/application 読みやすさ。

<a id="deviceusbset"></a>

## device.usb.set

USB MUX ターゲットの設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/device/usb/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `target` | string | 必須 | esp32/agx/lpmu/disconnect。 | 既定値なし |

### リクエストの例

```json
{
  "target": "agx"
}
```

### 応答と完了

data.target/success.

### 使用上の注意

切換えは制御を中断できます/transfers オリジナルのルートで。

<a id="deviceusbstatus"></a>

## device.usb.status

USB MUX ステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/device/usb/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.target/configured を返します。target は esp32/agx/lpmu/disconnected のいずれかです。
