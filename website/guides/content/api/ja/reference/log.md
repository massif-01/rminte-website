# ログ API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [log.capture](#logcapture) | ESP_LOG の収集を有効・無効にする |
| [log.clear](#logclear) | ログバッファをクリアします |
| [log.list](#loglist) | フィルタリングを使用してログ エントリを取得する |
| [log.setLevel](#logsetlevel) | ログレベルの設定 |
| [log.stats](#logstats) | ログ システム統計の取得 |

<a id="logcapture"></a>

## log.capture

ESP_LOG の収集を有効・無効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/log/capture`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 必須 | システム ログをログ バッファにキャプチャします。 | 既定値なし |

### リクエストの例

```json
{
  "enable": true
}
```

### 応答と完了

data.capturing.

<a id="logclear"></a>

## log.clear

ログバッファをクリアします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/log/clear`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.cleared を返します。それまでメモリにあったログは、このバッファから読み取れなくなります。

<a id="loglist"></a>

## log.list

フィルタリングを使用してログ エントリを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/log/list`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 任意 | この検索結果内の開始オフセット。 | 0 |
| `limit` | integer | 任意 | 戻り値の制限、1 ～ 200。 | 50 |
| `level` | integer | 任意 | 正確なログ レベル 1 ～ 5。範囲フィルターと組み合わせないでください。 | 全て |
| `minLevel` | integer | 任意 | 最小ログレベル。 | ERROR |
| `maxLevel` | integer | 任意 | 最大ログレベル。 | VERBOSE |
| `tag` | string | 任意 | モジュール名の部分文字列フィルター。 | なし |
| `keyword` | string | 任意 | メッセージのキーワード。 | なし |

### リクエストの例

```json
{
  "limit": 50
}
```

### 応答と完了

data.logs/total/offset/returned/bufferCapacity/bufferCount を返します。各ログには timestamp（起動からのミリ秒）、level/levelName/tag/message/task が含まれます。

### 使用上の注意

メモリ履歴には制限があります。オフセットは、無制限のアーカイブではなく、選択した検索結果内に適用されます。

<a id="logsetlevel"></a>

## log.setLevel

ログレベルの設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/log/setLevel`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `level` | integer / string | 必須 | 整数 0～5、または error/warn/info/debug/verbose などのレベル名。 | 既定値なし |
| `tag` | string | 任意 | 特定のモジュール。グローバルの場合は省略します。 | グローバル |

### リクエストの例

```json
{
  "level": 3
}
```

### 応答と完了

data.level はレベル名です。モジュール別の変更では tag も含まれます。

<a id="logstats"></a>

## log.stats

ログ システム統計の取得

**メソッド**: GET / POST
**パス**: `/api/v1/log/stats`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

ログバッファと収集状況の統計を返し、容量と現在の記録状態を示します。
