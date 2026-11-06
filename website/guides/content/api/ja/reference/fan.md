# ファン API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [fan.config](#fanconfig) | 曲線を含むファン設定を取得 |
| [fan.curve](#fancurve) | ファンの温度曲線を設定します |
| [fan.enable](#fanenable) | ファンを有効または無効にする |
| [fan.limits](#fanlimits) | デューティ比の上限・下限を設定する（min/max） |
| [fan.mode](#fanmode) | ファン動作モードの設定 |
| [fan.save](#fansave) | ファン設定を NVS に保存 |
| [fan.set](#fanset) | ファン速度の設定 (手動モード) |
| [fan.status](#fanstatus) | ファンステータスの取得 |

<a id="fanconfig"></a>

## fan.config

曲線を含むファン設定を取得

**メソッド**: GET / POST
**パス**: `/api/v1/fan/config`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 任意 | ファン ID;まず fan.status から取得します。 | 省略時はすべて |

### リクエストの例

```json
{
  "id": 0
}
```

### 応答と完了

単一または全ファンの設定として id/mode/min_duty/max_duty/invert_pwm/hysteresis/min_interval/curve を返します。曲線上の点は temp（摂氏）と duty（%）を使います。

<a id="fancurve"></a>

## fan.curve

ファンの温度曲線を設定します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/fan/curve`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必須 | デバイスがサポートする範囲内のファン ID。 | 既定値なし |
| `curve` | array | 必須 | {temp:摂氏温度,duty:パーセント} の点を最大 10 個指定します。温度は昇順、duty は 0〜100 です。 | 既定値なし |
| `hysteresis` | number | 任意 | 温度ヒステリシス、摂氏 0 ～ 20 度。 | 現在値 |
| `min_interval` | integer | 任意 | 最小調整間隔、整数 100 ～ 60000 ミリ秒。 | 現在値 |

### リクエストの例

```json
{
  "id": 0,
  "curve": [
    {
      "temp": 30,
      "duty": 30
    },
    {
      "temp": 60,
      "duty": 80
    }
  ],
  "hysteresis": 3,
  "min_interval": 2000
}
```

### 応答と完了

data.id/points/applied/persisted.

### 使用上の注意

カーブ設定と制御モードは別です。設定を読み戻し、必要に応じて曲線モードを選択します。

<a id="fanenable"></a>

## fan.enable

ファンを有効または無効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/fan/enable`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必須 | デバイスがサポートする範囲内のファン ID。 | 既定値なし |
| `enable` | boolean | 必須 | true を有効にします。 false は無効にします。 | 既定値なし |

### リクエストの例

```json
{
  "id": 0,
  "enable": true
}
```

### 応答と完了

data.id/enabled.

### 使用上の注意

無効化すると冷却能力が低下する場合があります。温度と保護状態は別に確認してください。

<a id="fanlimits"></a>

## fan.limits

デューティ比の上限・下限を設定する（min/max）

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/fan/limits`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必須 | デバイスがサポートする範囲内のファン ID。 | 既定値なし |
| `min_duty` | integer | 任意 | 最小デューティ、0 ～ 100 パーセント、最大値以下。 | 現在値 |
| `max_duty` | integer | 任意 | 最大デューティ、0 ～ 100 パーセント。 | 現在値 |

### リクエストの例

```json
{
  "id": 0,
  "min_duty": 20,
  "max_duty": 100
}
```

### 応答と完了

data.id/min_duty/max_duty/applied/persisted.

<a id="fanmode"></a>

## fan.mode

ファン動作モードの設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/fan/mode`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必須 | デバイスがサポートする範囲内のファン ID。 | 既定値なし |
| `mode` | string | 必須 | off/manual/auto/curve。 | 既定値なし |

### リクエストの例

```json
{
  "id": 0,
  "mode": "auto"
}
```

### 応答と完了

data.id/mode/applied/persisted を返します。実行中の状態への適用と、保存の失敗を区別してください。

<a id="fansave"></a>

## fan.save

ファン設定を NVS に保存

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/fan/save`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 任意 | ファン ID。 | すべてのファン |

### リクエストの例

```json
{}
```

### 応答と完了

data.status/persisted を返します。失敗の詳細を確認し、再起動後も保持されると決めつけないでください。

<a id="fanset"></a>

## fan.set

ファン速度の設定 (手動モード)

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/fan/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 必須 | デバイスがサポートする範囲内のファン ID。 | 既定値なし |
| `duty` | integer | 必須 | 要求されたデューティ、0 ～ 100 パーセント。 | 既定値なし |

共有 [データ モデル](../response-models.md#fan) を参照してください。

### リクエストの例

```json
{
  "id": 0,
  "duty": 50
}
```

### 応答と完了

適用後のファン状態を返します。duty_valid/duty/target_duty/mode を確認してください。

### 使用上の注意

冷却に影響します。変更の影響を考慮し、実際の出力と要求した出力を読み直してください。

<a id="fanstatus"></a>

## fan.status

ファンステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/fan/status`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | integer | 任意 | ファン ID;まず fan.status から取得します。 | 省略時はすべて |

共有 [データ モデル](../response-models.md#fan) を参照してください。

### リクエストの例

```json
{
  "id": 0
}
```

### 応答と完了

id を指定すると data に単一ファンを返します。省略すると data.fans と temperature/temp_valid/temp_source を返します。ファンの応答モデルを参照してください。
