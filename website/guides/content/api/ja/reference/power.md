# 電源と保護 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [power.chip](#powerchip) | パワーチップデータの取得 |
| [power.debug](#powerdebug) | デバッグモードを設定します |
| [power.interval.set](#powerintervalset) | サンプリング間隔の設定 |
| [power.monitor.start](#powermonitorstart) | 電力監視の開始 |
| [power.monitor.stop](#powermonitorstop) | 電力監視の停止 |
| [power.protection.config](#powerprotectionconfig) | 電圧保護構成の取得 |
| [power.protection.set](#powerprotectionset) | 電圧保護の構成 |
| [power.protection.status](#powerprotectionstatus) | 電圧保護ステータスの取得 |
| [power.stats](#powerstats) | 監視統計の取得 |
| [power.stats.reset](#powerstatsreset) | 監視統計のリセット |
| [power.status](#powerstatus) | 電力監視ステータスの取得 |
| [power.threshold.set](#powerthresholdset) | 電圧閾値の設定 |
| [power.voltage](#powervoltage) | 現在の電圧を読み取る |

<a id="powerchip"></a>

## power.chip

パワーチップデータの取得

**メソッド**: GET / POST
**パス**: `/api/v1/power/chip`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.voltage_v/current_a/power_w/valid/crc_valid/timestamp_ms/raw_data. 有効で完全性チェックされた値のみを使用してください。

<a id="powerdebug"></a>

## power.debug

デバッグモードを設定します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/debug`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 必須 | デバッグ出力を有効にします。 | 既定値なし |

### リクエストの例

```json
{
  "enable": false
}
```

### 応答と完了

data.debug_enabled.

<a id="powerintervalset"></a>

## power.interval.set

サンプリング間隔の設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/interval/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `interval_ms` | integer | 必須 | ミリ秒単位のサンプリング間隔。デバイスは、サポートされている範囲を下回る値を拒否します。 | 既定値なし |

### リクエストの例

```json
{
  "interval_ms": 1000
}
```

### 応答と完了

data.interval_ms.

<a id="powermonitorstart"></a>

## power.monitor.start

電力監視の開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/monitor/start`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.running.

### 使用上の注意

サンプリングを停止すると、今後の更新に影響します。保護に必要なデータも確認してください。

<a id="powermonitorstop"></a>

## power.monitor.stop

電力監視の停止

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/monitor/stop`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.running.

### 使用上の注意

サンプリングを停止すると、今後の更新に影響します。保護に必要なデータも確認してください。

<a id="powerprotectionconfig"></a>

## power.protection.config

電圧保護構成の取得

**メソッド**: GET / POST
**パス**: `/api/v1/power/protection/config`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.low_voltage_threshold/recovery_voltage_threshold（V）、shutdown_delay_sec/recovery_hold_sec/fan_stop_delay_sec（秒）、既定値を返します。

<a id="powerprotectionset"></a>

## power.protection.set

電圧保護の構成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/protection/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 任意 | 保護機能を開始または停止します。このフィールドを指定すると、有効・無効の設定は常に保存されます。 | 変更なし |
| `low_threshold` | number | 任意 | 低電圧しきい値 (V)。 | 変更なし |
| `recovery_threshold` | number | 任意 | 回復しきい値（V）。 | 変更なし |
| `shutdown_delay` | integer | 任意 | 低電圧シャットダウン遅延 (秒単位)。 | 変更なし |
| `recovery_hold` | integer | 任意 | 回復状態の継続に必要な時間（秒）。 | 変更なし |
| `fan_stop_delay` | integer | 任意 | コンピューターのシャットダウン後のファン停止遅延 (秒単位)。 | 変更なし |
| `persist` | boolean | 任意 | true はパラメーターのみの変更を保存します。有効・無効の変更は自動的に保存されます。 | false |

### リクエストの例

```json
{
  "persist": true
}
```

### 応答と完了

data.low_threshold_v/recovery_threshold_v/running/persisted.

### 使用上の注意

保護と自動シャットダウンに影響します。一部が適用された後で失敗する場合があるため、設定と状態を読み直してください。

<a id="powerprotectionstatus"></a>

## power.protection.status

電圧保護ステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/power/protection/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.initialized/running/state/current_voltage_v/countdown_remaining_sec/recovery_timer_sec/protection_count/uptime_ms を返し、devices には agx_powered/lpmu_powered/agx_connected が含まれます。

### 使用上の注意

initialized=false の場合、保護が有効に動作しているとは判断できません。

<a id="powerstats"></a>

## power.stats

監視統計の取得

**メソッド**: GET / POST
**パス**: `/api/v1/power/stats`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.voltage_samples/power_chip_packets/crc_errors/timeout_errors/threshold_violations/avg_voltage_v/avg_current_a/avg_power_w/uptime_ms.

<a id="powerstatsreset"></a>

## power.stats.reset

監視統計のリセット

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/stats/reset`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.reset.

### 使用上の注意

センサーのキャリブレーションではなく、統計をリセットします。

<a id="powerstatus"></a>

## power.status

電力監視ステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/power/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#power) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.voltage を返します。power_chip には voltage_v/current_a/power_w/valid/crc_valid が含まれます。protection、stats、monitoring_active は、それぞれ保護、集計、測定の状態を示します。

<a id="powerthresholdset"></a>

## power.threshold.set

電圧閾値の設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/power/threshold/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `min_v` | number | 必須 | 最小電圧 (V)。 | 既定値なし |
| `max_v` | number | 必須 | 最大電圧 (V)。最小値よりも大きい。 | 既定値なし |

### リクエストの例

```json
{
  "min_v": 12,
  "max_v": 24
}
```

### 応答と完了

data.min_v/max_v.

### 使用上の注意

監視しきい値と保護ポリシーは別のものです。保護には power.protection.set を使用します。

<a id="powervoltage"></a>

## power.voltage

現在の電圧を読み取る

**メソッド**: GET / POST
**パス**: `/api/v1/power/voltage`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `now` | boolean | 任意 | true はその場で測定し、false は直近の測定値を読み取ります。 | false |

### リクエストの例

```json
{}
```

### 応答と完了

data.voltage_v(V)/voltage_mv(mV)/adc_raw/timestamp_ms.
