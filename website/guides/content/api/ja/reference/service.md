# コントローラーのサービス API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [service.list](#servicelist) | すべてのサービスを一覧表示 |
| [service.restart](#servicerestart) | サービスを再起動する |
| [service.start](#servicestart) | サービスを開始する |
| [service.status](#servicestatus) | サービスステータスの取得 |
| [service.stop](#servicestop) | サービスを停止する |

<a id="servicelist"></a>

## service.list

すべてのサービスを一覧表示

**メソッド**: GET / POST
**パス**: `/api/v1/service/list`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.total/running/services を返します。各項目には name/state/phase/healthy/start_time_ms/start_duration_ms が含まれます。

<a id="servicerestart"></a>

## service.restart

サービスを再起動する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/service/restart`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | service.list から取得したサービス名。 | 既定値なし |

### リクエストの例

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 応答と完了

data.name/status.

### 使用上の注意

保守操作でネットワーク、WebUI、依存する機能が中断する場合があります。リモートアプリケーションには automation.services を使用してください。

<a id="servicestart"></a>

## service.start

サービスを開始する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/service/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | service.list から取得したサービス名。 | 既定値なし |

### リクエストの例

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 応答と完了

data.name/status.

### 使用上の注意

保守操作でネットワーク、WebUI、依存する機能が中断する場合があります。リモートアプリケーションには automation.services を使用してください。

<a id="servicestatus"></a>

## service.status

サービスステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/service/status`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | service.list から取得したサービス名。 | 既定値なし |

### リクエストの例

```json
{
  "name": "webui"
}
```

### 応答と完了

data.name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicestop"></a>

## service.stop

サービスを停止する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/service/stop`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | service.list から取得したサービス名。 | 既定値なし |

### リクエストの例

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 応答と完了

data.name/status.

### 使用上の注意

保守操作でネットワーク、WebUI、依存する機能が中断する場合があります。リモートアプリケーションには automation.services を使用してください。
