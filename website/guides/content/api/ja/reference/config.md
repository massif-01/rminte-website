# 設定 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [config.delete](#configdelete) | 設定値の削除 |
| [config.get](#configget) | 設定値の取得 |
| [config.list](#configlist) | 設定キーのリスト |
| [config.module.list](#configmodulelist) | すべての構成モジュールをリストします |
| [config.module.reset](#configmodulereset) | モジュール設定のリセット |
| [config.module.save](#configmodulesave) | モジュール設定を NVS に保存 |
| [config.module.set](#configmoduleset) | モジュール設定の設定 |
| [config.module.show](#configmoduleshow) | モジュール設定を表示 |
| [config.save](#configsave) | 設定をストレージに保存する |
| [config.set](#configset) | 設定値を変更する |

<a id="configdelete"></a>

## config.delete

設定値の削除

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/delete`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `key` | string | 必須 | 完全な設定キー名。 | 既定値なし |

### リクエストの例

```json
{
  "key": "example.setting"
}
```

### 応答と完了

data.key/deleted.

<a id="configget"></a>

## config.get

設定値の取得

**メソッド**: GET / POST
**パス**: `/api/v1/config/get`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `key` | string | 必須 | 完全な設定キー名。 | 既定値なし |

### リクエストの例

```json
{
  "key": "system.language"
}
```

### 応答と完了

data.key/type/value を返します。未認証で読み取れるのは key=system.language だけです。他のキーには ADMIN が必要です。

<a id="configlist"></a>

## config.list

設定キーのリスト

**メソッド**: GET / POST
**パス**: `/api/v1/config/list`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.items/file_keys/nvs_keys/total_keys (登録された構成に応じて)。

<a id="configmodulelist"></a>

## config.module.list

すべての構成モジュールをリストします

**メソッド**: GET / POST
**パス**: `/api/v1/config/module/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.modules に name/version/dirty/nvs_namespace/registered が含まれます。全体のシーケンス情報が返される場合もあります。

<a id="configmodulereset"></a>

## config.module.reset

モジュール設定のリセット

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/module/reset`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `module` | string | 必須 | net/dhcp/wifi/nat/led/fan/device/system。対応内容は各操作の説明を参照してください。 | 既定値なし |
| `persist` | boolean | 任意 | リセット結果を保持します。 | false |

### リクエストの例

```json
{
  "module": "system",
  "persist": false
}
```

### 応答と完了

data.module/reset/persisted.

### 使用上の注意

選択したモジュールを上書きします。最初に必要な設定を読み取って保持します。

<a id="configmodulesave"></a>

## config.module.save

モジュール設定を NVS に保存

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/module/save`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `module` | string | 必須 | net/dhcp/wifi/nat/led/fan/device/system。対応内容は各操作の説明を参照してください。 | 既定値なし |

### リクエストの例

```json
{
  "module": "all"
}
```

### 応答と完了

単一モジュールの結果、または全モジュールの results/success_count/fail_count を返します。各項目の success/error を確認してください。

<a id="configmoduleset"></a>

## config.module.set

モジュール設定の設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/module/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `module` | string | 必須 | net/dhcp/wifi/nat/led/fan/device/system。対応内容は各操作の説明を参照してください。 | 既定値なし |
| `key` | string | 必須 | 完全な設定キー名。 | 既定値なし |
| `value` | boolean / number / string | 必須 | モジュールフィールドのタイプに一致する値。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#module-configuration) を参照してください。

### リクエストの例

```json
{
  "module": "system",
  "key": "timezone",
  "value": "CST-8"
}
```

### 応答と完了

data.module/key/success/dirty. ペルシストと config.module.save.

<a id="configmoduleshow"></a>

## config.module.show

モジュール設定を表示

**メソッド**: GET / POST
**パス**: `/api/v1/config/module/show`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `module` | string | 必須 | net/dhcp/wifi/nat/led/fan/device/system。対応内容は各操作の説明を参照してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#module-configuration) を参照してください。

### リクエストの例

```json
{
  "module": "wifi"
}
```

### 応答と完了

単一モジュールでは data.module/config/dirty を返します。all ではモジュールをグループ化した結果が返される場合があります。ADMIN 未満ではパスワードが省略されます。

<a id="configsave"></a>

## config.save

設定をストレージに保存する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/save`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.saved を返します。失敗した場合は状態を保持・照会し、すべて保存できたと決めつけないでください。

<a id="configset"></a>

## config.set

設定値を変更する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `key` | string | 必須 | 完全な設定キー名。 | 既定値なし |
| `value` | boolean / number / string | 必須 | 設定値。オブジェクトや配列ではありません。 | 既定値なし |

### リクエストの例

```json
{
  "key": "system.language",
  "value": "zh-CN"
}
```

### 応答と完了

data.key/success. 利用条件 config.save 持続のために別に。
