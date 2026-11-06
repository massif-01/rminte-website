# 機器内のファイル API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [storage.delete](#storagedelete) | ファイルまたはディレクトリを削除します |
| [storage.info](#storageinfo) | ファイル情報の取得 |
| [storage.list](#storagelist) | ディレクトリの内容をリストする |
| [storage.mkdir](#storagemkdir) | ディレクトリの作成 |
| [storage.mount](#storagemount) | SDカードをマウントする |
| [storage.read](#storageread) | ファイルの内容を読み取ります |
| [storage.rename](#storagerename) | ファイルの名前を変更・移動する |
| [storage.status](#storagestatus) | ストレージステータスの取得 |
| [storage.unmount](#storageunmount) | SD カードのアンマウント |

<a id="storagedelete"></a>

## storage.delete

ファイルまたはディレクトリを削除します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/storage/delete`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example.txt"
}
```

### 応答と完了

data.deleted には、削除されたパスが含まれます。

### 使用上の注意

/sdcard/、/spiffs/、/www/ 以下の許可されたパスを扱います。ディレクトリは再帰的に削除される場合があります。管理対象の設定とストレージのルートは保護されます。

<a id="storageinfo"></a>

## storage.info

ファイル情報の取得

**メソッド**: GET / POST
**パス**: `/api/v1/storage/info`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example.txt"
}
```

### 応答と完了

data.path/name/type/size/modified を返します。modified はファイルシステムの Unix 時間（秒）です。

<a id="storagelist"></a>

## storage.list

ディレクトリの内容をリストする

**メソッド**: GET / POST
**パス**: `/api/v1/storage/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 任意 | 絶対ディレクトリパス。 | /sdcard |
| `recursive` | boolean | 任意 | 再帰的な一覧取得は未実装です。true でも、このディレクトリのみを取得します。省略を推奨します。 | false |

### リクエストの例

```json
{
  "path": "/sdcard"
}
```

### 応答と完了

data.path/entries に name/type/size などが含まれます。機密性の高いディレクトリの一覧には ADMIN が必要です。

<a id="storagemkdir"></a>

## storage.mkdir

ディレクトリの作成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/storage/mkdir`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example"
}
```

### 応答と完了

data.created にはディレクトリ パスが含まれます。

<a id="storagemount"></a>

## storage.mount

SDカードをマウントする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/storage/mount`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.status を返します。マウント時は path も含まれます。

### 使用上の注意

SDを使用した効果の高い操作 エンドファイル/update 取付ける前の仕事。

<a id="storageread"></a>

## storage.read

ファイルの内容を読み取ります

**メソッド**: GET / POST
**パス**: `/api/v1/storage/read`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example.txt"
}
```

### 応答と完了

data.path/size/type/content を返します。content は type=json では解析済みの JSON、type=text では文字列になります。

### 使用上の注意

ファイルは最大 8192 バイトです。機密性の高いパスには ADMIN が必要です。バイナリや大きなファイルには専用のダウンロードを使用してください。

<a id="storagerename"></a>

## storage.rename

ファイルの名前を変更・移動する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/storage/rename`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `from` | string | 必須 | 元の絶対パス。 | 既定値なし |
| `to` | string | 必須 | 宛先の絶対パス。 | 既定値なし |

### リクエストの例

```json
{
  "from": "/sdcard/example.txt",
  "to": "/sdcard/renamed.txt"
}
```

### 応答と完了

data.from/to. .

### 使用上の注意

両方のパスが、許可された /sdcard/、/spiffs/、または /www/ の場所内にあり、管理パス チェックに合格する必要があります。ファイルシステムとマウント状態により、移動が制限される可能性があります。

<a id="storagestatus"></a>

## storage.status

ストレージステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/storage/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.sd/spiffs とマウントされた使用可能なパス。

<a id="storageunmount"></a>

## storage.unmount

SD カードのアンマウント

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/storage/unmount`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.status を返します。マウント時は path も含まれます。

### 使用上の注意

SDを使用した効果の高い操作 エンドファイル/update 取付ける前の仕事。
