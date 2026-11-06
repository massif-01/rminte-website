# 更新と復旧 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [ota.abort](#otaabort) | ファームウェア更新キャンセル要求 |
| [ota.partitions](#otapartitions) | 更新パーティションの検査 |
| [ota.progress](#otaprogress) | ファームウェア更新の進行状況を読み取ります |
| [ota.rollback](#otarollback) | ファームウェアのロールバック |
| [ota.server.get](#otaserverget) | 更新サーバー構成の読み取り |
| [ota.server.set](#otaserverset) | アップデートサーバー構成の設定 |
| [ota.start_file](#otastart_file) | SDからファームウェアアップデートを開始 |
| [ota.start_url](#otastart_url) | URLからファームウェアアップデートを開始 |
| [ota.status](#otastatus) | ファームウェアアップデートステータスの読み取り |
| [ota.test_connection](#otatest_connection) | 更新 URL を調査する |
| [ota.upgrade_file](#otaupgrade_file) | ota.start_file の互換性エイリアス |
| [ota.upgrade_url](#otaupgrade_url) | ota.start_url の互換性エイリアス |
| [ota.upload_abort](#otaupload_abort) | ファームウェアのアップロード制御を中止する |
| [ota.upload_begin](#otaupload_begin) | ファームウェアアップロード制御の開始 |
| [ota.upload_end](#otaupload_end) | ファームウェアアップロード制御を終了 |
| [ota.validate](#otavalidate) | ファームウェアが正常に実行されていることを確認します |
| [ota.version](#otaversion) | ファームウェアバージョンの読み取り |
| [ota.www.abort](#otawwwabort) | WWW 更新キャンセルのリクエスト |
| [ota.www.progress](#otawwwprogress) | WWW 更新の進行状況を読み取る |
| [ota.www.start](#otawwwstart) | URLからWWW更新を開始 |
| [ota.www.start_sdcard](#otawwwstart_sdcard) | SDからWWW更新を開始 |

<a id="otaabort"></a>

## ota.abort

ファームウェア更新キャンセル要求

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/abort`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.aborted=true を返します。対応する進捗を読み取り、状態を確認してください。

### 使用上の注意

プライベート タスクではなく、現在の更新に基づいて動作します。状態が不明な間は、すぐに別のアップデートを開始しないでください。

<a id="otapartitions"></a>

## ota.partitions

更新パーティションの検査

**メソッド**: GET / POST
**パス**: `/api/v1/ota/partitions`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.running/next のそれぞれに label/address/size/is_bootable が含まれます。起動可能なパーティションには version/project も含まれ、can_rollback も返されます。

<a id="otaprogress"></a>

## ota.progress

ファームウェア更新の進行状況を読み取ります

**メソッド**: GET / POST
**パス**: `/api/v1/ota/progress`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.state/percent/total_size/received_size/message を返します。state は idle/checking/downloading/verifying/writing/pending_reboot/error のいずれかです。

### 使用上の注意

機器全体の進捗であり、ログインごとのタスク結果ではありません。開始後は定期的に照会してください。100% だけでは、新しいバージョンが動作中とは確認できません。

<a id="otarollback"></a>

## ota.rollback

ファームウェアのロールバック

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/rollback`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

ロールバック用パーティションを選択して再起動を試みます。応答前に接続が切れる場合があります。応答が返る場合は data.rolling_back=true です。

### 使用上の注意

まず ota.partitions.can_rollback を確認してください。ロールバック後は再ログインし、バージョンと設定の互換性を確認します。no_reboot は未対応です。

<a id="otaserverget"></a>

## ota.server.get

更新サーバー構成の読み取り

**メソッド**: GET / POST
**パス**: `/api/v1/ota/server/get`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

ADMIN は data.url/configured を読み取れます。それより低いロールには configured だけが返されます。

<a id="otaserverset"></a>

## ota.server.set

アップデートサーバー構成の設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/server/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 必須 | 更新サーバーの URL、最大 255 文字。空の文字列を指定するとクリアされます。 | 既定値なし |
| `save` | boolean | 任意 | サーバーアドレスを永続化します。 | false |

### リクエストの例

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "save": true
}
```

### 応答と完了

data.url/saved.

### 使用上の注意

アドレスを設定してもアップデートは開始されません。 WWW URL はこのアドレスから派生できます。

<a id="otastart_file"></a>

## ota.start_file

SDからファームウェアアップデートを開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/start_file`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `file` | string | file または path が必要 | ファームウェアファイルの絶対パス。file の使用を推奨します。 | 既定値なし |
| `path` | string | 任意 | file の別名。 | 未指定 |
| `auto_reboot` | boolean | 任意 | ファームウェア更新の完了後、自動的に再起動します。 | true |
| `no_reboot` | boolean | 任意 | auto_reboot を反転した指定。指定すると auto_reboot より優先されます。 | 上書きなし |
| `allow_downgrade` | boolean | 任意 | 古いバージョンへの更新を許可します。ファームウェアイメージの検証は引き続き行われます。 | false |
| `skip_verify` | boolean | 任意 | SD ファイルの互換性オプション。 TLS 接続はありません。ファームウェアの完全性チェックはバイパスされません。 | false |

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### 応答と完了

data.started/path.(パス)

### 使用上の注意

開始成功は、リクエストが開始されたことを意味します。 ota.progress を読み取り、再起動後に ota.status を確認します。このハードウェアとパーティションのレイアウトには完全なイメージを使用してください。

<a id="otastart_url"></a>

## ota.start_url

URLからファームウェアアップデートを開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/start_url`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 必須 | 完全なファームウェア イメージの HTTP または HTTPS URL (最大 2048 バイト)。 | 既定値なし |
| `auto_reboot` | boolean | 任意 | ファームウェア更新の完了後、自動的に再起動します。 | true |
| `no_reboot` | boolean | 任意 | auto_reboot を反転した指定。指定すると auto_reboot より優先されます。 | 上書きなし |
| `allow_downgrade` | boolean | 任意 | 古いバージョンへの更新を許可します。ファームウェアイメージの検証は引き続き行われます。 | false |
| `skip_verify` | boolean | 任意 | ファームウェアの TLS 設定に従い、HTTPS サーバーの検証を緩和するよう要求します。それでも接続に失敗する場合があります。イメージの完全性検証は省略されません。通常は false のままにしてください。 | false |

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### 応答と完了

data.started/url. ディレクティブ

### 使用上の注意

開始成功は、リクエストが開始されたことを意味します。 ota.progress を読み取り、再起動後に ota.status を確認します。このハードウェアとパーティションのレイアウトには完全なイメージを使用してください。

<a id="otastatus"></a>

## ota.status

ファームウェアアップデートステータスの読み取り

**メソッド**: GET / POST
**パス**: `/api/v1/ota/status`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.state/running/next/pending_verify を返し、検証待ちの場合は rollback_timeout も含まれます。パーティション情報には label/address/size と取得可能なバージョン情報が含まれます。

### 使用上の注意

size の単位はバイトです。書き込み後に再起動し、実際に動作しているバージョンを確認してください。

<a id="otatest_connection"></a>

## ota.test_connection

更新 URL を調査する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/test_connection`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 必須 | 確認対象の更新ファイルの URL。 | 既定値なし |

### リクエストの例

```json
{
  "url": "http://updates.example.com/firmware.bin"
}
```

### 応答と完了

データには、成功と接続診断が含まれています。

### 使用上の注意

実際のネットワークリクエストを送信します。接続できても、そのイメージをインストールできるとは限りません。

<a id="otaupgrade_file"></a>

## ota.upgrade_file

ota.start_file の互換性エイリアス

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/upgrade_file`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `file` | string | file または path が必要 | ファームウェアファイルの絶対パス。file の使用を推奨します。 | 既定値なし |
| `path` | string | 任意 | file の別名。 | 未指定 |
| `auto_reboot` | boolean | 任意 | ファームウェア更新の完了後、自動的に再起動します。 | true |
| `no_reboot` | boolean | 任意 | auto_reboot を反転した指定。指定すると auto_reboot より優先されます。 | 上書きなし |
| `allow_downgrade` | boolean | 任意 | 古いバージョンへの更新を許可します。ファームウェアイメージの検証は引き続き行われます。 | false |
| `skip_verify` | boolean | 任意 | SD ファイルの互換性オプション。 TLS 接続はありません。ファームウェアの完全性チェックはバイパスされません。 | false |

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### 応答と完了

data.started/path.(パス)

### 使用上の注意

ota.start_file と同じパラメーター、権限、結果を持つ互換用の別名です。

<a id="otaupgrade_url"></a>

## ota.upgrade_url

ota.start_url の互換性エイリアス

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/upgrade_url`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 必須 | 完全なファームウェア イメージの HTTP または HTTPS URL (最大 2048 バイト)。 | 既定値なし |
| `auto_reboot` | boolean | 任意 | ファームウェア更新の完了後、自動的に再起動します。 | true |
| `no_reboot` | boolean | 任意 | auto_reboot を反転した指定。指定すると auto_reboot より優先されます。 | 上書きなし |
| `allow_downgrade` | boolean | 任意 | 古いバージョンへの更新を許可します。ファームウェアイメージの検証は引き続き行われます。 | false |
| `skip_verify` | boolean | 任意 | ファームウェアの TLS 設定に従い、HTTPS サーバーの検証を緩和するよう要求します。それでも接続に失敗する場合があります。イメージの完全性検証は省略されません。通常は false のままにしてください。 | false |

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### 応答と完了

data.started/url. ディレクティブ

### 使用上の注意

ota.start_url と同じパラメーター、権限、結果を持つ互換用の別名です。

<a id="otaupload_abort"></a>

## ota.upload_abort

ファームウェアのアップロード制御を中止する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/upload_abort`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.aborted.

<a id="otaupload_begin"></a>

## ota.upload_begin

ファームウェアアップロード制御の開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/upload_begin`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `size` | integer | 必須 | ファームウェアの正の合計バイト数。これもターゲット パーティションによって制限されます。 | 既定値なし |

### リクエストの例

```json
{
  "size": 1048576
}
```

### 応答と完了

data.ready/expected_size.

### 使用上の注意

アップロードの制御を行います。データを送る公開 upload_write API はないため、begin/end だけではファームウェアを転送できません。通常の連携では、完全なファイルを送信するバイナリルートを使用してください。

<a id="otaupload_end"></a>

## ota.upload_end

ファームウェアアップロード制御を終了

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/upload_end`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `auto_reboot` | boolean | 任意 | 完了時に自動的に再起動します。 | true |

### リクエストの例

```json
{
  "auto_reboot": false
}
```

### 応答と完了

data.completed/reboot_pending.

### 使用上の注意

完全なデータを含むアクティブなアップロードが必要です。アクティブなアップロードがない場合は失敗します。

<a id="otavalidate"></a>

## ota.validate

ファームウェアが正常に実行されていることを確認します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/validate`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.validated.

### 使用上の注意

確認によりロールバック状態が変更されます。まず、実行中のバージョンとアプリケーションの正常性を確認します。

<a id="otaversion"></a>

## ota.version

ファームウェアバージョンの読み取り

**メソッド**: GET / POST
**パス**: `/api/v1/ota/version`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.version/project/compile_date/compile_time/idf_version.

<a id="otawwwabort"></a>

## ota.www.abort

WWW 更新キャンセルのリクエスト

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/www/abort`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.aborted=true を返します。対応する進捗を読み取り、状態を確認してください。

### 使用上の注意

プライベート タスクではなく、現在の更新に基づいて動作します。状態が不明な間は、すぐに別のアップデートを開始しないでください。

<a id="otawwwprogress"></a>

## ota.www.progress

WWW 更新の進行状況を読み取る

**メソッド**: GET / POST
**パス**: `/api/v1/ota/www/progress`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.state/percent/total/received/message/running を返します。完了は state=completed かつ running=false で確認します。

### 使用上の注意

機器全体の進捗であり、ログインごとのタスク結果ではありません。開始後は定期的に照会してください。100% だけでは、新しいバージョンが動作中とは確認できません。

<a id="otawwwstart"></a>

## ota.www.start

URLからWWW更新を開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/www/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 任意 | www.bin の HTTP または HTTPS URL。完全な URL は 255 バイトに制限してください。それより長い入力は完全には保持されない可能性があります。 | 設定済みの更新サーバーから決定 |
| `skip_verify` | boolean | 任意 | ファームウェアの TLS 設定に従い、HTTPS サーバーの検証を緩和するよう要求します。それでも接続に失敗する場合があります。イメージの完全性検証は省略されません。通常は false のままにしてください。 | false |

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{
  "url": "http://updates.example.com/www.bin"
}
```

### 応答と完了

data.status=started/url を返します。

### 使用上の注意

個別の HTML ファイルではなく、ファームウェアに一致する完全な www.bin を使用してください。次に、ota.www.progress を読んでください。

<a id="otawwwstart_sdcard"></a>

## ota.www.start_sdcard

SDからWWW更新を開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ota/www/start_sdcard`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `file` | string | 必須 | WWWイメージの絶対ファイルパス。 255 バイトに制限してください。それより長い入力は完全には保持されない可能性があります。 | 既定値なし |

共有 [データ モデル](../response-models.md#ota) を参照してください。

### リクエストの例

```json
{
  "file": "/sdcard/www.bin"
}
```

### 応答と完了

data.status=started/file を返します。
