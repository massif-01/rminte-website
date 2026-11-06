# リモートファイル API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [sftp.get](#sftpget) | SFTP経由でファイルをダウンロード |
| [sftp.ls](#sftpls) | SFTP 経由でリモート ディレクトリを一覧表示する |
| [sftp.mkdir](#sftpmkdir) | SFTP経由でリモートディレクトリを作成 |
| [sftp.put](#sftpput) | SFTP経由でファイルをアップロード |
| [sftp.rm](#sftprm) | SFTP経由でリモートファイルを削除 |
| [sftp.stat](#sftpstat) | SFTP経由でリモートファイル情報を取得 |

<a id="sftpget"></a>

## sftp.get

SFTP経由でファイルをダウンロード

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/sftp/get`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `remote` | string | 必須 | リモートファイルの絶対パス。 | 既定値なし |
| `local` | string | 必須 | ローカルデバイスファイルの絶対パス。 | 既定値なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### 応答と完了

data.remote/local/success;ローカルデバイスファイルを書き込みます。

### 使用上の注意

リモートホストの信頼確認と認証が必要です。失敗しても、フィンガープリントは自動承認されません。get にはローカルの書き込み制限が適用され、put はローカルの内容をリモートへ送信します。

<a id="sftpls"></a>

## sftp.ls

SFTP 経由でリモート ディレクトリを一覧表示する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/sftp/ls`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `path` | string | 必須 | リモートのディレクトリまたはファイルのパス。 | 既定値なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 応答と完了

data.path/files を返します。各項目には name/size/is_dir/mtime/permissions が含まれます。

### 使用上の注意

リモートホストの信頼確認と認証が必要です。失敗しても、フィンガープリントは自動承認されません。get にはローカルの書き込み制限が適用され、put はローカルの内容をリモートへ送信します。

<a id="sftpmkdir"></a>

## sftp.mkdir

SFTP経由でリモートディレクトリを作成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/sftp/mkdir`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `path` | string | 必須 | リモートのディレクトリまたはファイルのパス。 | 既定値なし |
| `mode` | integer | 任意 | 10 進数の JSON 整数としての許可ビット。 8 進数の 0755 は 10 進数の 493 です。 | 493 |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 応答と完了

data.path/created.

### 使用上の注意

リモートホストの信頼確認と認証が必要です。失敗しても、フィンガープリントは自動承認されません。get にはローカルの書き込み制限が適用され、put はローカルの内容をリモートへ送信します。

<a id="sftpput"></a>

## sftp.put

SFTP経由でファイルをアップロード

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/sftp/put`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `remote` | string | 必須 | リモートファイルの絶対パス。 | 既定値なし |
| `local` | string | 必須 | ローカルデバイスファイルの絶対パス。 | 既定値なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### 応答と完了

data.remote/local/success; リモートファイルを書きます。

### 使用上の注意

リモートホストの信頼確認と認証が必要です。失敗しても、フィンガープリントは自動承認されません。get にはローカルの書き込み制限が適用され、put はローカルの内容をリモートへ送信します。

<a id="sftprm"></a>

## sftp.rm

SFTP経由でリモートファイルを削除

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/sftp/rm`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `path` | string | 必須 | リモートのディレクトリまたはファイルのパス。 | 既定値なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 応答と完了

data.path/deleted.

### 使用上の注意

リモートホストの信頼確認と認証が必要です。失敗しても、フィンガープリントは自動承認されません。get にはローカルの書き込み制限が適用され、put はローカルの内容をリモートへ送信します。

<a id="sftpstat"></a>

## sftp.stat

SFTP経由でリモートファイル情報を取得

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/sftp/stat`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `path` | string | 必須 | リモートのディレクトリまたはファイルのパス。 | 既定値なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 応答と完了

data.path/size/is_dir/is_link/uid/gid/permissions/atime/mtime.

### 使用上の注意

リモートホストの信頼確認と認証が必要です。失敗しても、フィンガープリントは自動承認されません。get にはローカルの書き込み制限が適用され、put はローカルの内容をリモートへ送信します。
