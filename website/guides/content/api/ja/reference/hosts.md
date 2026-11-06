# SSH ホストのフィンガープリント API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [hosts.clear](#hostsclear) | 既知のホストをすべてクリアします |
| [hosts.info](#hostsinfo) | 既知のホスト情報を取得する |
| [hosts.list](#hostslist) | 既知の SSH ホストをすべてリストします |
| [hosts.remove](#hostsremove) | 既知のホストを削除します |
| [hosts.update](#hostsupdate) | ホストのフィンガープリントを強制的に更新します |

<a id="hostsclear"></a>

## hosts.clear

既知のホストをすべてクリアします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/hosts/clear`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.cleared.

### 使用上の注意

後の SSH/SFTP 信頼チェックに影響します。保存されたホスト接続定義は削除されません。

<a id="hostsinfo"></a>

## hosts.info

既知のホスト情報を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/hosts/info`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | リモート アドレス。信頼レコードはアドレスとポートに一致します。 | 既定値なし |
| `port` | integer | 任意 | SSH ポート、1-65535。 | 22 |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "port": 22
}
```

### 応答と完了

data.host/port/type/fingerprint/added.

<a id="hostslist"></a>

## hosts.list

既知の SSH ホストをすべてリストします

**メソッド**: GET / POST
**パス**: `/api/v1/hosts/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.hosts/count を返します。各項目には host/port/type/fingerprint/added が含まれます。

<a id="hostsremove"></a>

## hosts.remove

既知のホストを削除します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/hosts/remove`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | リモート アドレス。信頼レコードはアドレスとポートに一致します。 | 既定値なし |
| `port` | integer | 任意 | SSH ポート、1-65535。 | 22 |

### リクエストの例

```json
{
  "host": "192.0.2.20"
}
```

### 応答と完了

data.host/port/removed.(削除)

### 使用上の注意

信頼記録を削除しても、リモート側のユーザーや鍵は失効しません。次の接続前に、接続先の本人性を再確認してください。

<a id="hostsupdate"></a>

## hosts.update

ホストのフィンガープリントを強制的に更新します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/hosts/update`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | リモート アドレス。信頼レコードはアドレスとポートに一致します。 | 既定値なし |
| `port` | integer | 任意 | SSH ポート、1-65535。 | 22 |

### リクエストの例

```json
{
  "host": "192.0.2.20"
}
```

### 応答と完了

data.host/port/updated/message.

### 使用上の注意

リモート ホストに接続し、信頼を更新します。最初にその身元を独立して検証します。
