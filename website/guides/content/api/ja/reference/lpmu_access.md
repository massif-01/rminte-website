# アプリケーションコンピューターのネットワーク設定 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [network.lpmu_access.log](#networklpmu_accesslog) | アプリケーションコンピューターの上位ネットワーク接続設定の実行ログを取得する |
| [network.lpmu_access.start](#networklpmu_accessstart) | アプリケーションコンピューターの上位ネットワーク接続設定を開始する |
| [network.lpmu_access.status](#networklpmu_accessstatus) | アプリケーションコンピューターの上位ネットワーク接続設定の状態を取得する |

<a id="networklpmu_accesslog"></a>

## network.lpmu_access.log

アプリケーションコンピューターの上位ネットワーク接続設定の実行ログを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/network/lpmu_access/log`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `run_id` | integer | 必須 | start/status が返す現在の実行番号。 | 既定値なし |
| `offset` | integer | 必須 | 負でないバイト オフセット。最初は 0 を使用します。 | 既定値なし |

### リクエストの例

```json
{
  "run_id": 1,
  "offset": 0
}
```

### 応答と完了

data.run_id/output/next_offset/done. 続きを見る next_offset.

### 使用上の注意

1 チャンクは最大 1024 バイトです。古い run_id は拒否されます。done は現時点のログ末尾まで読んだことを示すため、タスクの状態は引き続き確認してください。

<a id="networklpmu_accessstart"></a>

## network.lpmu_access.start

アプリケーションコンピューターの上位ネットワーク接続設定を開始する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/network/lpmu_access/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `sudo_password` | string | 任意 | リモート sudo パスワード。この実行にのみ使用されます。 | 空 |

### リクエストの例

```json
{}
```

### 応答と完了

data.run_id/running/stage. クエリのステータスを続行/log.

### 使用上の注意

対象は 10.10.99.99:22 に固定され、保存済みのホストと鍵が必要です。同時に一つのタスクだけを実行します。リモート側のネットワークを変更する操作です。

<a id="networklpmu_accessstatus"></a>

## network.lpmu_access.status

アプリケーションコンピューターの上位ネットワーク接続設定の状態を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/network/lpmu_access/status`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `diagnostics` | boolean | 任意 | 処理時間とリソース使用状況の追加診断を含めます。 | false |

### リクエストの例

```json
{}
```

### 応答と完了

data.run_id/running/stage、転送バイト数、exit_code/reason/failure_stage、internet_confirmed/configuration_complete、output_tail/output_truncated を返します。診断情報は要求した場合だけ含まれます。

### 使用上の注意

完了には最終段階またはスクリプトによる確認が必要です。待ち行列への追加やスクリプトの終了コード 0 だけでは、ネットワークの設定完了は確認できません。
