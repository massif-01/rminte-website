# 設定パッケージ API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [config.pack.apply](#configpackapply) | 未対応の汎用設定適用 |
| [config.pack.content](#configpackcontent) | インポートされた設定パッケージの内容を復号化して取得します |
| [config.pack.export](#configpackexport) | 構成を暗号化された .tscfg としてエクスポート |
| [config.pack.export_cert](#configpackexport_cert) | 暗号化用のデバイス証明書をエクスポートする |
| [config.pack.import](#configpackimport) | アップロード済みの .tscfg をその場所で検証する |
| [config.pack.info](#configpackinfo) | 設定パッケージのシステム情報を取得する |
| [config.pack.list](#configpacklist) | ディレクトリ内の .tscfg ファイルを一覧表示します |
| [config.pack.verify](#configpackverify) | .tscfg パッケージの署名を確認する |

<a id="configpackapply"></a>

## config.pack.apply

未対応の汎用設定適用

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/pack/apply`
**最低権限**: ADMIN

**サポートされていない操作です。** 名前は、廃止された呼び出しを明示的に拒否するために保持されます。

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 応答と完了

data.success=false と、未対応を示す result_code/reason を返します。最上位の code=0 でも、設定は適用されません。

### 使用上の注意

汎用適用はサポートされていません。オブジェクトの専用インポート フローを使用します。

<a id="configpackcontent"></a>

## config.pack.content

インポートされた設定パッケージの内容を復号化して取得します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/pack/content`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | パッケージ ストレージで使用されるパッケージ名。 | 既定値なし |

### リクエストの例

```json
{
  "name": "example"
}
```

### 応答と完了

data.name/content/content_raw を返します。JSON として解析できる場合、content は構造化データになります。

### 使用上の注意

信頼された管理用途の読み取りに限って使用してください。設定内の秘密情報を公開ログに記録してはいけません。

<a id="configpackexport"></a>

## config.pack.export

構成を暗号化された .tscfg としてエクスポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/pack/export`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | パッケージ名。 | 既定値なし |
| `content` | object / string | 必須 | 暗号化する構成コンテンツ。 JSON エンコード可能である必要があります。 | 既定値なし |
| `recipient_cert` | string | 必須 | 受信側デバイス証明書 PEM。 | 既定値なし |
| `description` | string | 任意 | パッケージの説明。 | 空 |
| `save_path` | string | 任意 | オプションの SD 保存パス。 | デバイス ファイルを保存しない |

### リクエストの例

```json
{
  "name": "example",
  "content": {
    "example": true
  },
  "recipient_cert": "RECIPIENT_CERTIFICATE_PEM"
}
```

### 応答と完了

data.tscfg/filename/size を返します。要求したファイル保存に成功した場合は saved_path も含まれます。

### 使用上の注意

機器側で Developer のエクスポート機能が必要です。受信先でもパッケージを検証し、明示的にインポートする必要があります。

<a id="configpackexport_cert"></a>

## config.pack.export_cert

暗号化用のデバイス証明書をエクスポートする

**メソッド**: GET / POST
**パス**: `/api/v1/config/pack/export_cert`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.certificate/fingerprint/cn を返します。この機器向けの暗号化に使用する公開情報であり、秘密鍵ではありません。

<a id="configpackimport"></a>

## config.pack.import

アップロード済みの .tscfg をその場所で検証する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/pack/import`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `content` | string | content または path が必須 | 任意の Base64 ペイロードではなく、生のパッケージ JSON テキスト。 | 既定値なし |
| `path` | string | content または path が必須 | デバイス上にアップロードされたパッケージの絶対パス。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 応答と完了

成功時は data 内に valid/result_code/result_message/reason/path/saved_path、name/description/source_file/target_device/created_at、signature を返します。無効なパッケージは処理エラーになります。

### 使用上の注意

content を指定すると、検証済みのパッケージをパッケージ保存領域に保存できます。path を指定した場合は、その場所のファイルを検証します。どちらも管理設定を適用するものではありません。対象オブジェクトのインポートを使用してください。

<a id="configpackinfo"></a>

## config.pack.info

設定パッケージのシステム情報を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/config/pack/info`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.can_export/device_type/cert_fingerprint/cert_cn/cert_ou/pack_version/algorithm.

<a id="configpacklist"></a>

## config.pack.list

ディレクトリ内の .tscfg ファイルを一覧表示します

**メソッド**: GET / POST
**パス**: `/api/v1/config/pack/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 任意 | 絶対ディレクトリパス。 | /sdcard/config |

### リクエストの例

```json
{
  "path": "/sdcard/config"
}
```

### 応答と完了

data.files/count を返します。各項目には name/path/size/mtime/valid と、取得可能な発行元情報が含まれます。

<a id="configpackverify"></a>

## config.pack.verify

.tscfg パッケージの署名を確認する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/config/pack/verify`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `content` | string | content または path が必須 | 任意の Base64 ペイロードではなく、生のパッケージ JSON テキスト。 | 既定値なし |
| `path` | string | content または path が必須 | デバイス上にアップロードされたパッケージの絶対パス。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 応答と完了

data.valid/result_code/result_message/reason/signature を返します。signature には valid/is_official/signer_cn/signer_ou/signed_at が含まれます。

### 使用上の注意

入れ子の valid/reason を確認してください。汎用の検証に成功しても、設定のインポートが完了したことにはなりません。
