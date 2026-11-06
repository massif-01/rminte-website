# 時刻 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [time.force_sync](#timeforce_sync) | NTP 同期を強制する |
| [time.info](#timeinfo) | 時刻同期情報を取得する |
| [time.set_ntp](#timeset_ntp) | NTPサーバーの設定 |
| [time.set_timezone](#timeset_timezone) | タイムゾーンを設定する |
| [time.sync](#timesync) | ブラウザーの時刻で同期する |

<a id="timeforce_sync"></a>

## time.force_sync

NTP 同期を強制する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/time/force_sync`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.syncing/message. インスペクト time.info 実際の同期のために。

<a id="timeinfo"></a>

## time.info

時刻同期情報を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/time/info`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.timestamp（Unix 秒）、timestamp_ms、datetime/timezone、source/sync_status/synced/last_sync/sync_count/ntp_server を返します。

<a id="timeset_ntp"></a>

## time.set_ntp

NTPサーバーの設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/time/set_ntp`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `server` | string | 必須 | NTP サーバーのホスト名またはアドレス。 | 既定値なし |
| `index` | integer | 任意 | サーバースロットのインデックス。 | 0 |

### リクエストの例

```json
{
  "server": "YOUR_NTP_SERVER",
  "index": 0
}
```

### 応答と完了

data.server/index/success.

<a id="timeset_timezone"></a>

## time.set_timezone

タイムゾーンを設定する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/time/set_timezone`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `timezone` | string | 必須 | CST-8 などの POSIX タイムゾーン文字列。 | 既定値なし |

### リクエストの例

```json
{
  "timezone": "CST-8"
}
```

### 応答と完了

data.timezone/local_time/success.

<a id="timesync"></a>

## time.sync

ブラウザーの時刻で同期する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/time/sync`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `timestamp_ms` | integer | 必須 | ミリ秒単位の Unix タイムスタンプ。 | 既定値なし |

### リクエストの例

```json
{
  "timestamp_ms": 1793894400000
}
```

### 応答と完了

data.datetime/synced/source.(/同期/ソース)

### 使用上の注意

システム時刻を変更すると、証明書の有効性チェックに影響します。その後、time.info を読んで確認してください。
