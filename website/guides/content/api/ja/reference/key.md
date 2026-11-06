# SSH 鍵 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [key.delete](#keydelete) | 鍵を削除する |
| [key.export](#keyexport) | 公開鍵のエクスポート |
| [key.exportPrivate](#keyexportprivate) | 秘密鍵のエクスポート (エクスポート可能なキーのみ) |
| [key.generate](#keygenerate) | 新しい鍵を生成します |
| [key.info](#keyinfo) | 鍵情報の取得 |
| [key.list](#keylist) | 保存されているすべての鍵をリストする |

<a id="keydelete"></a>

## key.delete

鍵を削除する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/key/delete`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | ローカル鍵 ID。 | 既定値なし |
| `preview` | boolean | 任意 | true は関連するホストと実行のプレビュー、false は削除。 | false |

### リクエストの例

```json
{
  "id": "example-key",
  "preview": true
}
```

### 応答と完了

プレビュー: data.hosts/runs/complete. 削除: data.id/deleted.

### 使用上の注意

リモートプロセスを停止したり、authorized_keys から公開鍵を削除したりするものではありません。鍵を削除すると、既存の実行を検証・停止できなくなる場合があります。

<a id="keyexport"></a>

## key.export

公開鍵のエクスポート

**メソッド**: GET / POST
**パス**: `/api/v1/key/export`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | ローカル鍵 ID。 | 既定値なし |

### リクエストの例

```json
{
  "id": "example-key"
}
```

### 応答と完了

data.id/type/public_key/comment; public_key は OpenSSH テキストです。

### 使用上の注意

非表示の鍵の読み取りには、適切なロールが必要です。

<a id="keyexportprivate"></a>

## key.exportPrivate

秘密鍵のエクスポート (エクスポート可能なキーのみ)

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/key/exportPrivate`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | ローカル鍵 ID。 | 既定値なし |

### リクエストの例

```json
{
  "id": "example-key"
}
```

### 応答と完了

data.id/type/private_key/comment/warning.

### 使用上の注意

ADMIN と exportable=true が必要です。キーはデフォルトではエクスポートできません。応答を秘密情報として扱い、通常のログには記録しないでください。

<a id="keygenerate"></a>

## key.generate

新しい鍵を生成します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/key/generate`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | ローカル鍵 ID。 | 既定値なし |
| `type` | string | 任意 | rsa2048/rsa4096/ec256/ecdsa/ec384。 | rsa2048 |
| `comment` | string | 任意 | 公開鍵コメント。 | 空 |
| `alias` | string | 任意 | 表示エイリアス。 | 空 |
| `hidden` | boolean | 任意 | 鍵を非表示にします。 | false |
| `exportable` | boolean | 任意 | 後で秘密鍵をエクスポートできるようにします。 | false |
| `request_id` | string | 任意 | オプションの相関値、32バイト未満、英数字/hyphen のみ。 | なし |

### リクエストの例

```json
{
  "id": "example-key",
  "type": "ec256",
  "exportable": false
}
```

### 応答と完了

data.generated/id/type を返します。失敗時は failed_stage/esp_error/cleanup_complete/cleanup_error が含まれる場合があります。

### 使用上の注意

generated を確認してください。ID がすでに存在する場合や生成に失敗した場合はエラーになります。既存の鍵は自動で上書きされません。

<a id="keyinfo"></a>

## key.info

鍵情報の取得

**メソッド**: GET / POST
**パス**: `/api/v1/key/info`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | ローカル鍵 ID。 | 既定値なし |

### リクエストの例

```json
{
  "id": "example-key"
}
```

### 応答と完了

data.id/type/type_desc/comment/alias/created/last_used/has_public_key/exportable/hidden.

<a id="keylist"></a>

## key.list

保存されているすべての鍵をリストする

**メソッド**: GET / POST
**パス**: `/api/v1/key/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.keys/count/max_keys を返します。メタデータは id/type/type_desc/comment/alias/created/last_used/has_pubkey/exportable/hidden です。

### 使用上の注意

ADMIN 未満では許可された鍵のメタデータだけが返されます。一覧に秘密鍵は含まれません。
