# 温度 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [temp.bind](#tempbind) | 温度とシステム変数をバインド・解除する |
| [temp.manual](#tempmanual) | 手動温度モードを設定・取得する |
| [temp.read](#tempread) | 現在の温度を読み取ります |
| [temp.select](#tempselect) | 優先する温度取得元を設定・取得する |
| [temp.sources](#tempsources) | すべての温度源情報を取得する |
| [temp.status](#tempstatus) | 温度システムステータスの取得 |

<a id="tempbind"></a>

## temp.bind

温度とシステム変数をバインド・解除する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/temp/bind`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `variables` | array | 任意 | 最大 8 つの {name,weight} エントリ。空の配列は複数変数のバインディングをクリアします。 | 変更なし |
| `variable` | string / null | 任意 | 従来の単一変数バインディング。 null または空の文字列を指定するとクリアされます。 | 変更なし |

### リクエストの例

```json
{
  "variables": [
    {
      "name": "compute.temperature",
      "weight": 1
    }
  ]
}
```

### 応答と完了

data.bound_variables、バインドの状態、有効な件数・重み、weighted_temp_c、partial_stale/valid を返します。権限がない変数の値は除外されます。

### 使用上の注意

変数が存在し、数値型の温度である必要があります。ADMIN はバインド用フィールドを省略して照会できます。variables または variable を指定し、バインドの変更や解除を行う場合は ROOT が必要です。

<a id="tempmanual"></a>

## temp.manual

手動温度モードを設定・取得する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/temp/manual`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 任意 | 手動温度モードを有効または無効にします。 | 変更なし |
| `temperature_c` | number | 任意 | 摂氏、-50.0 ～ 150.0。 | 変更なし |
| `temperature` | number | 任意 | temperature_c の別名。温度のフィールドは、どちらか一方だけを送信することを推奨します。 | 変更なし |
| `temperature_01c` | integer | 任意 | 0.1 ℃単位、-500～1500。摂氏のフィールドが指定されていない場合に使用します。 | 変更なし |

### リクエストの例

```json
{
  "enable": true,
  "temperature_c": 45
}
```

### 応答と完了

data.manual_mode/current_temp_c/current_temp_01c/active_source.

### 使用上の注意

制御に使用する温度入力を変更します。テスト後は手動モードを明示的に無効にし、状態を読み直してください。

<a id="tempread"></a>

## temp.read

現在の温度を読み取ります

**メソッド**: GET / POST
**パス**: `/api/v1/temp/read`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `source` | string | 任意 | default/local または sensor_local/agx または agx_auto/variable/manual。 | 現在アクティブなソース |

共有 [データ モデル](../response-models.md#temperature) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.temperature_c/temperature_01c/source/timestamp_ms/valid を返します。変数ソースでは partial_stale とバインドの件数・重みが含まれる場合があります。

<a id="tempselect"></a>

## temp.select

優先する温度取得元を設定・取得する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/temp/select`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `source` | string | 任意 | auto/agx/sensor/variable。 | クエリのみ |

### リクエストの例

```json
{
  "source": "auto"
}
```

### 応答と完了

data.preferred_source/active_source/temperature_c/valid.

<a id="tempsources"></a>

## temp.sources

すべての温度源情報を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/temp/sources`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

現在の温度と有効性に加え、取得元の情報を返します。各項目には name/type/active/valid/stale/last_value_c/last_value_01c/last_update_ms/age_ms/update_count が含まれます。

### 使用上の注意

age_ms=null は、利用可能な更新時刻がないことを示します。変数ソースでは一部の取得失敗、有効な件数・重みも返します。

<a id="tempstatus"></a>

## temp.status

温度システムステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/temp/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#temperature) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.initialized/manual_mode/active_source/preferred_source/temperature_c/temperature_01c/timestamp_ms/valid を返し、bound_variable が含まれる場合があります。
