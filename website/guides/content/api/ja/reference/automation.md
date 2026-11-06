# 自動化と管理対象サービス API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [automation.action.stats](#automationactionstats) | アクション実行統計の取得 |
| [automation.action.stats.reset](#automationactionstatsreset) | アクション統計のリセット |
| [automation.actions.add](#automationactionsadd) | 新しいアクション テンプレートを作成する |
| [automation.actions.delete](#automationactionsdelete) | アクション テンプレートを削除する |
| [automation.actions.execute](#automationactionsexecute) | アクションテンプレートを実行する |
| [automation.actions.export](#automationactionsexport) | アクション テンプレートを設定パッケージ (.tscfg) としてエクスポート |
| [automation.actions.get](#automationactionsget) | ID によるアクション テンプレートの取得 |
| [automation.actions.import](#automationactionsimport) | 設定パッケージからアクション テンプレートをインポートする |
| [automation.actions.list](#automationactionslist) | すべてのアクション テンプレートをリストする |
| [automation.actions.update](#automationactionsupdate) | 既存のアクション テンプレートを更新する |
| [automation.config.apply](#automationconfigapply) | 確認済みの復元または設定元の選択を適用する |
| [automation.config.backup](#automationconfigbackup) | 完全な緊急設定を保存します |
| [automation.config.enable](#automationconfigenable) | 現在の設定を明示的に有効化または一時停止します |
| [automation.config.preview](#automationconfigpreview) | 設定の復元またはソースの選択をプレビューする |
| [automation.config.refresh](#automationconfigrefresh) | ユーザーの選択を変更せずに SD カードを 1 回チェックします |
| [automation.config.status](#automationconfigstatus) | 現在の自動化ストレージとバックアップのステータス |
| [automation.pause](#automationpause) | 自動化エンジンを一時停止します |
| [automation.proxy.fetch](#automationproxyfetch) | 外部 REST API からのプロキシ取得 |
| [automation.proxy.socketio_test](#automationproxysocketio_test) | Socket.IO 接続のテスト (v4 プロトコル) |
| [automation.proxy.websocket_test](#automationproxywebsocket_test) | WebSocket 接続のテスト |
| [automation.reload](#automationreload) | 設定の再読み込み |
| [automation.resume](#automationresume) | 自動化エンジンを再開します |
| [automation.rules.add](#automationrulesadd) | 新しいルールを追加する |
| [automation.rules.delete](#automationrulesdelete) | ルールを削除する |
| [automation.rules.disable](#automationrulesdisable) | ルールを無効にする |
| [automation.rules.enable](#automationrulesenable) | ルールを有効にする |
| [automation.rules.export](#automationrulesexport) | ルールを設定パッケージ (.tscfg) としてエクスポート |
| [automation.rules.get](#automationrulesget) | ID によるルールの詳細の取得 |
| [automation.rules.import](#automationrulesimport) | 設定パッケージからルールをインポートします |
| [automation.rules.list](#automationruleslist) | すべてのルールをリストする |
| [automation.rules.trigger](#automationrulestrigger) | ルールを手動でトリガーする |
| [automation.rules.update](#automationrulesupdate) | 取得済みの revision を条件にルールを更新する |
| [automation.services.list](#automationserviceslist) | 独立して管理するリモートサービスの操作一覧を取得する |
| [automation.services.status](#automationservicesstatus) | 管理対象リモートプロセスの状態を確認する |
| [automation.services.stop](#automationservicesstop) | 検証済みの管理対象リモート プロセスを停止します |
| [automation.sources.add](#automationsourcesadd) | 新しいデータソースを追加する |
| [automation.sources.add_mapping](#automationsourcesadd_mapping) | 既存のデータ ソースにフィールド マッピングを追加する |
| [automation.sources.delete](#automationsourcesdelete) | データ ソースの削除 |
| [automation.sources.disable](#automationsourcesdisable) | データ ソースを無効にする |
| [automation.sources.enable](#automationsourcesenable) | データ ソースを有効にする |
| [automation.sources.export](#automationsourcesexport) | データ ソースを設定パッケージ (.tscfg) としてエクスポート |
| [automation.sources.import](#automationsourcesimport) | 設定パッケージからデータ ソースをインポートする |
| [automation.sources.list](#automationsourceslist) | すべてのデータ ソースをリストする |
| [automation.sources.remove_mapping](#automationsourcesremove_mapping) | データ ソースからフィールド マッピングを削除します |
| [automation.sources.update](#automationsourcesupdate) | 既存のデータ ソースを更新する |
| [automation.start](#automationstart) | 自動化エンジンを開始します |
| [automation.status](#automationstatus) | 自動化 エンジンのステータスを取得する |
| [automation.stop](#automationstop) | 自動化エンジンを停止します |
| [automation.test.device](#automationtestdevice) | デバイス制御アクションのテスト |
| [automation.test.gpio](#automationtestgpio) | GPIO アクションのテスト |
| [automation.test.led](#automationtestled) | LED の動作をテストする |
| [automation.test.ssh](#automationtestssh) | SSH コマンドの実行をテストする |
| [automation.variables.delete](#automationvariablesdelete) | 保存されたユーザー変数を削除します |
| [automation.variables.get](#automationvariablesget) | 変数値の取得 |
| [automation.variables.list](#automationvariableslist) | すべての変数をリストする |
| [automation.variables.set](#automationvariablesset) | 変数値を設定します |

<a id="automationactionstats"></a>

## automation.action.stats

アクション実行統計の取得

**メソッド**: GET / POST
**パス**: `/api/v1/automation/action/stats`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

現在のアクション マネージャーのランタイム統計。永続的な監査証跡ではありません。

<a id="automationactionstatsreset"></a>

## automation.action.stats.reset

アクション統計のリセット

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/action/stats/reset`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

code=0 は、リセット要求が成功したことを報告します。

<a id="automationactionsadd"></a>

## automation.actions.add

新しいアクション テンプレートを作成する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/actions/add`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="automationactionsdelete"></a>

## automation.actions.delete

アクション テンプレートを削除する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/actions/delete`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `preview` | boolean | 任意 | true は影響のプレビュー、false は削除の実行。 | false |
| `replacement_id` | string | 任意 | 依存参照の置換オブジェクト ID。 | なし |
| `mode` | string | 任意 | cascade でカスケード処理を要求します。force や replacement を組み合わせず、一つの方法を選んでください。 | 通常の削除 |
| `force` | boolean | 任意 | 影響をプレビューした後にのみ参照オブジェクトを強制的に削除します。 | false |
| `pause_automation` | boolean | 任意 | 処理する前に自動化を一時停止します。 | false |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 応答と完了

設定結果モデルに加え、影響を受ける参照を示す impact を返します。

### 使用上の注意

ローカル定義を削除しても、リモート プログラムが自動的に停止したり、公開鍵が取り消されたりすることはありません。

<a id="automationactionsexecute"></a>

## automation.actions.execute

アクションテンプレートを実行する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/actions/execute`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "id": "example-action",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

data.async/status/duration_ms と実行結果を返します。ADMIN 未満では非公開の出力が除外されます。

### 使用上の注意

テンプレートで指定したハードウェア・リモート操作を実際に実行します。非同期テンプレートでは、その後も対象の実行結果を確認してください。

<a id="automationactionsexport"></a>

## automation.actions.export

アクション テンプレートを設定パッケージ (.tscfg) としてエクスポート

**メソッド**: POST
**パス**: `/api/v1/automation/actions/export`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `recipient_cert` | string | 任意 | 受信先の証明書 PEM。省略すると、この機器向けに暗号化します。 | このデバイス証明書 |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "id": "example"
}
```

### 応答と完了

data.tscfg/filename を返します。エクスポートには、機器の Developer 識別情報と受信先の資料も必要です。

### 使用上の注意

返されたパッケージのテキストはクライアント側で保存します。別の機器の有効な設定に自動適用されるわけではありません。

<a id="automationactionsget"></a>

## automation.actions.get

ID によるアクション テンプレートの取得

**メソッド**: GET / POST
**パス**: `/api/v1/automation/actions/get`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "id": "example"
}
```

### 応答と完了

一つのアクションテンプレートと active_version を返します。ADMIN 未満では一部のフィールドが除外されます。

<a id="automationactionsimport"></a>

## automation.actions.import

設定パッケージからアクション テンプレートをインポートする

**メソッド**: POST
**パス**: `/api/v1/automation/actions/import`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必須 | 文字列として提供される完全なパッケージの JSON テキスト。 | 既定値なし |
| `preview` | boolean | 任意 | true の場合のみプレビューします。 | false |
| `active_version` | string | 適用時に必須 | 現在の設定バージョン。 | プレビューでは現在のバージョンが使用される可能性があります |
| `overwrite` | boolean | 任意 | 既存のオブジェクトを異なるコンテンツに置き換えることを許可します。 | false |
| `expected_credential` | integer | 適用時に必須 | プレビューが返した credential_generation。 | なし |
| `expected_digest` | string | 適用時に必須 | プレビューが返した package_digest。 | なし |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 応答と完了

設定結果モデルを返します。プレビュー時は valid/items/exists/unchanged/package_digest/credential_generation、適用時は imported/overwritten/restart_required が追加されます。

### 使用上の注意

最初にプレビューし、そのダイジェスト、認証情報の世代、設定バージョンを指定して、同じパッケージを適用します。条件が変わった場合はプレビューをやり直してください。

<a id="automationactionslist"></a>

## automation.actions.list

すべてのアクション テンプレートをリストする

**メソッド**: GET / POST
**パス**: `/api/v1/automation/actions/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 任意 | 取得開始位置を示す非負のオフセット。 | 0 |
| `limit` | integer | 任意 | 取得件数。省略時は件数の切り詰めを要求しません。 | 全て |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.templates/count/total/active_version/load_error/paused を返します。ADMIN 未満では制限されたメタデータだけが返されます。

<a id="automationactionsupdate"></a>

## automation.actions.update

既存のアクション テンプレートを更新する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/actions/update`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#action-templates) を参照してください。

### リクエストの例

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="automationconfigapply"></a>

## automation.config.apply

確認済みの復元または設定元の選択を適用する

**メソッド**: POST
**パス**: `/api/v1/automation/config/apply`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `operation` | string | 必須 | プレビュー中に選択されたのと同じ操作。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `target_version` | string | 必須 | プレビューによって返されたターゲット バージョン。 | 既定値なし |

共有 [データ モデル](../response-models.md#config-result) を参照してください。

### リクエストの例

```json
{
  "operation": "use_sd",
  "active_version": "CURRENT_VERSION",
  "target_version": "PREVIEW_TARGET_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

選択や復元によって、hosts/commands/rules/variables/sources の設定一式が置き換わる場合があります。先にプレビューし、現在の入力を保存してください。

<a id="automationconfigbackup"></a>

## automation.config.backup

完全な緊急設定を保存します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/config/backup`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../response-models.md#config-result) を参照してください。

### リクエストの例

```json
{
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationconfigenable"></a>

## automation.config.enable

現在の設定を明示的に有効化または一時停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/config/enable`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `enabled` | boolean | 必須 | true の場合、現在の設定が有効になります。 false は一時停止します。 | 既定値なし |

共有 [データ モデル](../response-models.md#config-result) を参照してください。

### リクエストの例

```json
{
  "active_version": "CURRENT_VERSION",
  "enabled": false
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationconfigpreview"></a>

## automation.config.preview

設定の復元またはソースの選択をプレビューする

**メソッド**: POST
**パス**: `/api/v1/automation/config/preview`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `operation` | string | 必須 | use_sd/save_to_sd/restore_internal. | 既定値なし |

共有 [データ モデル](../response-models.md#config-result) を参照してください。

### リクエストの例

```json
{
  "operation": "use_sd"
}
```

### 応答と完了

差分、現在と対象のバージョン、選択の前提条件をプレビューします。適用時は返されたバージョンを使用してください。

### 使用上の注意

選択や復元によって、hosts/commands/rules/variables/sources の設定一式が置き換わる場合があります。先にプレビューし、現在の入力を保存してください。

<a id="automationconfigrefresh"></a>

## automation.config.refresh

ユーザーの選択を変更せずに SD カードを 1 回チェックします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/config/refresh`
**最低権限**: ROOT

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#config-result) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationconfigstatus"></a>

## automation.config.status

現在の自動化ストレージとバックアップのステータス

**メソッド**: GET / POST
**パス**: `/api/v1/automation/config/status`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#config-result) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationpause"></a>

## automation.pause

自動化エンジンを一時停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/pause`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

code=0/message が成功を示します。実行中の状態は automation.status を読み取って確認してください。

### 使用上の注意

エンジンの状態、未完了のアクション、ストレージの状態によって、リクエストが拒否される場合があります。停止がタイムアウトしても、すべてのアクションが終了したとは限りません。

<a id="automationproxyfetch"></a>

## automation.proxy.fetch

外部 REST API からのプロキシ取得

**メソッド**: POST
**パス**: `/api/v1/automation/proxy/fetch`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 必須 | HTTP(S) 宛先またはサポートされているローカル API アドレス。 | 既定値なし |
| `method` | string | 任意 | GET/POST/PUT/DELETE に対応します。汎用のリクエスト本文パラメーターはありません。 | GET |
| `headers` | object | 任意 | 文字列値のリクエスト ヘッダー。認証情報を通常のログから除外します。 | なし |
| `timeout` | integer | 任意 | リクエストの合計タイムアウト時間 (ミリ秒)。 | 15000 |
| `cert_pem` | string | 任意 | 独自の発行元の CA 資料。最大 16384 バイト。 | システムトラスト |
| `skip_verify` | boolean | 任意 | 互換性パラメーター: false のみ。 true は拒否されます。 | false |

### リクエストの例

```json
{
  "url": "https://example.com/status",
  "method": "GET"
}
```

### 応答と完了

data.status/content_length/body を返します。ローカル API の結果は body 内に入るため、その code も確認してください。

### 使用上の注意

ローカル API の転送には、現在のセッションと呼び出し先の権限が適用されます。外部 HTTP(S) リクエストには ROOT が必要です。時間、サイズ、ネットワークの上限があり、無制限に利用できるプロキシではありません。

<a id="automationproxysocketio_test"></a>

## automation.proxy.socketio_test

Socket.IO 接続のテスト (v4 プロトコル)

**メソッド**: POST
**パス**: `/api/v1/automation/proxy/socketio_test`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `url` | string | 必須 | Socket.IO v4 サーバーのアドレス。 | 既定値なし |
| `event` | string | 任意 | 対象イベント名。 | 最初のイベント |
| `timeout_ms` | integer | 任意 | 接続・イベント待ちの期限（ミリ秒）。 | 10000 |
| `json_path` | string | 任意 | イベントデータ抽出パス。 | 完全データ |

### リクエストの例

```json
{
  "url": "https://example.com",
  "event": "status"
}
```

### 応答と完了

data.connected/sid/event/data を返し、場合によって value/path/path_error/error も含まれます。

### 使用上の注意

プレーンな WebSocket ではなく Socket.IO を使用します。実際のリモートサービスに接続します。

<a id="automationproxywebsocket_test"></a>

## automation.proxy.websocket_test

WebSocket 接続のテスト

**メソッド**: POST
**パス**: `/api/v1/automation/proxy/websocket_test`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `uri` | string | 必須 | ws:// または wss:// 宛先。 | 既定値なし |
| `timeout_ms` | integer | 任意 | 接続・データ待ちの期限（ミリ秒）。 | 10000 |
| `subscribe` | string | 任意 | 接続後に送信するサブスクリプション テキスト。 | 何も送信しない |
| `json_path` | string | 任意 | 応答の JSON 抽出パス。 | メッセージ全体 |

### リクエストの例

```json
{
  "uri": "wss://example.com/events",
  "timeout_ms": 10000
}
```

### 応答と完了

data.connected/message を返し、場合によって value/path/path_error/error も含まれます。

### 使用上の注意

接続し、テキストを送信する場合があります。一度の接続テストは、継続的な購読を作成するものではありません。

<a id="automationreload"></a>

## automation.reload

設定の再読み込み

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/reload`
**最低権限**: ROOT

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

エンジンの状態、未完了のアクション、ストレージの状態によって、リクエストが拒否される場合があります。停止がタイムアウトしても、すべてのアクションが終了したとは限りません。

<a id="automationresume"></a>

## automation.resume

自動化エンジンを再開します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/resume`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

code=0/message が成功を示します。実行中の状態は automation.status を読み取って確認してください。

### 使用上の注意

エンジンの状態、未完了のアクション、ストレージの状態によって、リクエストが拒否される場合があります。停止がタイムアウトしても、すべてのアクションが終了したとは限りません。

<a id="automationrulesadd"></a>

## automation.rules.add

新しいルールを追加する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/rules/add`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `expected_revision` | integer | 任意 | 元のルールの revision。更新時は最新の読み取り値を指定します。 | 作成には必要ありません |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

保存と実行は別の操作です。フィルタリングされた読み取り結果で、完全なルールを上書きしてはいけません。

<a id="automationrulesdelete"></a>

## automation.rules.delete

ルールを削除する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/rules/delete`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `preview` | boolean | 任意 | true は影響のプレビュー、false は削除の実行。 | false |
| `replacement_id` | string | 任意 | 依存参照の置換オブジェクト ID。 | なし |
| `mode` | string | 任意 | cascade でカスケード処理を要求します。force や replacement を組み合わせず、一つの方法を選んでください。 | 通常の削除 |
| `force` | boolean | 任意 | 影響をプレビューした後にのみ参照オブジェクトを強制的に削除します。 | false |
| `pause_automation` | boolean | 任意 | 処理する前に自動化を一時停止します。 | false |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 応答と完了

設定結果モデルを返し、impact が含まれる場合があります。

<a id="automationrulesdisable"></a>

## automation.rules.disable

ルールを無効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/rules/disable`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `expected_revision` | integer | 任意 | 現在のルール リビジョン。 | 推奨 |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationrulesenable"></a>

## automation.rules.enable

ルールを有効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/rules/enable`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `expected_revision` | integer | 任意 | 現在のルール リビジョン。 | 推奨 |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationrulesexport"></a>

## automation.rules.export

ルールを設定パッケージ (.tscfg) としてエクスポート

**メソッド**: POST
**パス**: `/api/v1/automation/rules/export`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `recipient_cert` | string | 任意 | 受信先の証明書 PEM。省略すると、この機器向けに暗号化します。 | このデバイス証明書 |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule"
}
```

### 応答と完了

data.tscfg/filename を返します。パッケージにはルールの設定入力が含まれます。

<a id="automationrulesget"></a>

## automation.rules.get

ID によるルールの詳細の取得

**メソッド**: GET / POST
**パス**: `/api/v1/automation/rules/get`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule"
}
```

### 応答と完了

ルールの定義、現在の revision、実行時の統計を返します。ADMIN 未満では条件とアクションの全情報は含まれません。

<a id="automationrulesimport"></a>

## automation.rules.import

設定パッケージからルールをインポートします

**メソッド**: POST
**パス**: `/api/v1/automation/rules/import`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必須 | パッケージの JSON テキスト。 | 既定値なし |
| `preview` | boolean | 任意 | プレビューまたは適用モード。 | false |
| `active_version` | string | 適用時に必須 | 現在の設定バージョン。 | 既定値なし |
| `overwrite` | boolean | 任意 | 同じ ID のルールを上書きします。 | false |
| `expected_revision` | integer | 適用時に必須 | プレビューによって返されたルール リビジョン。 | 既定値なし |
| `expected_generation` | integer | 適用時に必須 | プレビューが返したルールの世代。 | 既定値なし |
| `credential_generation` | integer | 適用時に必須 | プレビューが返した証明書・認証情報の世代。 | 既定値なし |
| `package_digest` | string | 適用時に必須 | プレビューによって返されたパッケージ ダイジェスト。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 応答と完了

プレビュー・適用の結果、バージョン、ダイジェストを返します。適用時は、プレビューの前提条件が現在も成立していることを確認します。

### 使用上の注意

完全な JSON 本文だけを指定し、クエリは使いません。確認フィールドは他のインポートと異なるため、ここでは expected_credential/expected_digest を使用しないでください。

<a id="automationruleslist"></a>

## automation.rules.list

すべてのルールをリストする

**メソッド**: GET / POST
**パス**: `/api/v1/automation/rules/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.rules/count/active_version/loaded/paused/load_error/recovery_required/invalid_items/restart_required を返します。各項目には ID、有効状態、revision、実行時の統計が含まれます。ADMIN 未満では情報が制限されます。

<a id="automationrulestrigger"></a>

## automation.rules.trigger

ルールを手動でトリガーする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/rules/trigger`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

### リクエストの例

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

実行要求の結果または拒否理由を返します。完了を確認するには、アクションやサービスの状態も確認してください。

### 使用上の注意

実際の動作を伴います。クールダウン、一時停止、条件、実行中の状態により、実行要求が拒否される場合があります。

<a id="automationrulesupdate"></a>

## automation.rules.update

取得済みの revision を条件にルールを更新する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/rules/update`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `expected_revision` | integer | 任意 | 元のルールの revision。更新時は最新の読み取り値を指定します。 | 作成には必要ありません |

共有 [データ モデル](../configuration-models.md#automation-rules) を参照してください。

### リクエストの例

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

保存と実行は別の操作です。フィルタリングされた読み取り結果で、完全なルールを上書きしてはいけません。

<a id="automationserviceslist"></a>

## automation.services.list

独立して管理するリモートサービスの操作一覧を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/automation/services/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.items に run_id/command_id/rule_id/source/name/state/current/last_known と操作状態が含まれます。

### 使用上の注意

保持された実行記録は、リモート プロセスがまだ存在していることを証明するものではありません。必要に応じて明示的に検証を要求します。

<a id="automationservicesstatus"></a>

## automation.services.status

管理対象リモートプロセスの状態を確認する

**メソッド**: GET / POST
**パス**: `/api/v1/automation/services/status`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `run_id` | string | 必須 | 開始応答またはサービス リストからの実行 ID。 | 既定値なし |
| `verify` | boolean | 任意 | 元のホストに接続して状態を確認します。 | オペレーションごとの処理 |

### リクエストの例

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### 応答と完了

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### 使用上の注意

busy または進行中の操作は、状態の照会を続けてください。停止には検証済みの元のプロセス識別情報を使い、任意のプロセスを名前で強制終了するものではありません。

<a id="automationservicesstop"></a>

## automation.services.stop

検証済みの管理対象リモート プロセスを停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/services/stop`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `run_id` | string | 必須 | 開始応答またはサービス リストからの実行 ID。 | 既定値なし |
| `verify` | boolean | 任意 | 元のホストに接続して状態を確認します。 | オペレーションごとの処理 |

### リクエストの例

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### 応答と完了

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### 使用上の注意

busy または進行中の操作は、状態の照会を続けてください。停止には検証済みの元のプロセス識別情報を使い、任意のプロセスを名前で強制終了するものではありません。

<a id="automationsourcesadd"></a>

## automation.sources.add

新しいデータソースを追加する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/add`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="automationsourcesadd_mapping"></a>

## automation.sources.add_mapping

既存のデータ ソースにフィールド マッピングを追加する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/add_mapping`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `json_path` | string | 必須 | 抽出するデータ フィールドのパス。 | 既定値なし |
| `var_name` | string | 必須 | 宛先変数名。 | 既定値なし |
| `transform` | string | 任意 | オプションの変換式。 | なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "json_path": "temperature",
  "var_name": "compute.temperature"
}
```

### 応答と完了

設定結果モデルに加え、source_id/mapping_count/mapping_index を返します。

<a id="automationsourcesdelete"></a>

## automation.sources.delete

データ ソースの削除

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/delete`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `preview` | boolean | 任意 | true は影響のプレビュー、false は削除の実行。 | false |
| `replacement_id` | string | 任意 | 依存参照の置換オブジェクト ID。 | なし |
| `mode` | string | 任意 | cascade でカスケード処理を要求します。force や replacement を組み合わせず、一つの方法を選んでください。 | 通常の削除 |
| `force` | boolean | 任意 | 影響をプレビューした後にのみ参照オブジェクトを強制的に削除します。 | false |
| `pause_automation` | boolean | 任意 | 処理する前に自動化を一時停止します。 | false |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 応答と完了

設定結果モデルに加え、影響を受ける参照を示す impact を返します。

### 使用上の注意

ローカル定義を削除しても、リモート プログラムが自動的に停止したり、公開鍵が取り消されたりすることはありません。

<a id="automationsourcesdisable"></a>

## automation.sources.disable

データ ソースを無効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/disable`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationsourcesenable"></a>

## automation.sources.enable

データ ソースを有効にする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/enable`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

<a id="automationsourcesexport"></a>

## automation.sources.export

データ ソースを設定パッケージ (.tscfg) としてエクスポート

**メソッド**: POST
**パス**: `/api/v1/automation/sources/export`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `recipient_cert` | string | 任意 | 受信先の証明書 PEM。省略すると、この機器向けに暗号化します。 | このデバイス証明書 |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example"
}
```

### 応答と完了

data.tscfg/filename を返します。エクスポートには、機器の Developer 識別情報と受信先の資料も必要です。

### 使用上の注意

返されたパッケージのテキストはクライアント側で保存します。別の機器の有効な設定に自動適用されるわけではありません。

<a id="automationsourcesimport"></a>

## automation.sources.import

設定パッケージからデータ ソースをインポートする

**メソッド**: POST
**パス**: `/api/v1/automation/sources/import`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必須 | 文字列として提供される完全なパッケージの JSON テキスト。 | 既定値なし |
| `preview` | boolean | 任意 | true の場合のみプレビューします。 | false |
| `active_version` | string | 適用時に必須 | 現在の設定バージョン。 | プレビューでは現在のバージョンが使用される可能性があります |
| `overwrite` | boolean | 任意 | 既存のオブジェクトを異なるコンテンツに置き換えることを許可します。 | false |
| `expected_credential` | integer | 適用時に必須 | プレビューが返した credential_generation。 | なし |
| `expected_digest` | string | 適用時に必須 | プレビューが返した package_digest。 | なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 応答と完了

設定結果モデルを返します。プレビュー時は valid/items/exists/unchanged/package_digest/credential_generation、適用時は imported/overwritten/restart_required が追加されます。

### 使用上の注意

最初にプレビューし、そのダイジェスト、認証情報の世代、設定バージョンを指定して、同じパッケージを適用します。条件が変わった場合はプレビューをやり直してください。

<a id="automationsourceslist"></a>

## automation.sources.list

すべてのデータ ソースをリストする

**メソッド**: GET / POST
**パス**: `/api/v1/automation/sources/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 任意 | 取得開始位置を示す非負のオフセット。 | 0 |
| `limit` | integer | 任意 | 取得件数。省略時は件数の切り詰めを要求しません。 | 全て |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.sources/count/total/active_version/load_error/paused を返します。root 以外では制限されたメタデータだけが返されます。

<a id="automationsourcesremove_mapping"></a>

## automation.sources.remove_mapping

データ ソースからフィールド マッピングを削除します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/remove_mapping`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `index` | integer | 1 つの選択肢 | 非負のマッピング インデックス。 | なし |
| `json_path` | string | 1 つの選択肢 | 既存のフィールド パス。 | なし |
| `var_name` | string | 1 つの選択肢 | 既存の変数名。 | なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "index": 0
}
```

### 応答と完了

コンフィギュレーションレスモデルプラス source_id/mapping_count.

<a id="automationsourcesupdate"></a>

## automation.sources.update

既存のデータ ソースを更新する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/sources/update`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#data-sources) を参照してください。

### リクエストの例

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="automationstart"></a>

## automation.start

自動化エンジンを開始します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/start`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

code=0/message が成功を示します。実行中の状態は automation.status を読み取って確認してください。

### 使用上の注意

エンジンの状態、未完了のアクション、ストレージの状態によって、リクエストが拒否される場合があります。停止がタイムアウトしても、すべてのアクションが終了したとは限りません。

<a id="automationstatus"></a>

## automation.status

自動化 エンジンのステータスを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/automation/status`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data には、エンジンの状態に応じて、状態、カウンター、設定の取得元、自動起動に関する情報が含まれます。

<a id="automationstop"></a>

## automation.stop

自動化エンジンを停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/stop`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

code=0/message が成功を示します。実行中の状態は automation.status を読み取って確認してください。

### 使用上の注意

エンジンの状態、未完了のアクション、ストレージの状態によって、リクエストが拒否される場合があります。停止がタイムアウトしても、すべてのアクションが終了したとは限りません。

<a id="automationtestdevice"></a>

## automation.test.device

デバイス制御アクションのテスト

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/test/device`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 必須 | agx または lpmu。 | 既定値なし |
| `action` | string | 必須 | 対象が対応する電源・リセット操作。 | 既定値なし |

### リクエストの例

```json
{
  "device": "agx",
  "action": "on"
}
```

### 応答と完了

code=0/message は制御要求の成功を示します。その後に device.status を読み取ってください。

### 使用上の注意

実際のターゲット コンピュータを制御します。

<a id="automationtestgpio"></a>

## automation.test.gpio

GPIO アクションのテスト

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/test/gpio`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 必須 | サポートされているピン番号。 | 既定値なし |
| `level` | boolean | 必須 | true=高、false=低。 | 既定値なし |
| `pulse_ms` | integer | 任意 | ミリ秒単位のパルス持続時間。 0 はタイミングパルスがないことを意味します。 | 0 |

### リクエストの例

```json
{
  "pin": 1,
  "level": false,
  "pulse_ms": 0
}
```

### 応答と完了

code=0/message は操作要求の成功を示します。対象ピンの状態は別に読み取ってください。

### 使用上の注意

ハードウェア端子を操作します。最初にそれらの機能を確認してください。

<a id="automationtestled"></a>

## automation.test.led

LED の動作をテストする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/test/led`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 必須 | ターゲット LED デバイス。 | 既定値なし |
| `index` | integer | 任意 | LEDインデックス。 | 0 |
| `r` | integer | 任意 | 赤のコンポーネント、0 ～ 255。 | 0 |
| `g` | integer | 任意 | 緑色のコンポーネント、0 ～ 255。 | 0 |
| `b` | integer | 任意 | 青色のコンポーネント、0 ～ 255。 | 0 |

### リクエストの例

```json
{
  "device": "board",
  "r": 0,
  "g": 64,
  "b": 128
}
```

### 応答と完了

アクションの実行結果をデータ化します。

### 使用上の注意

名前に test を含みますが、機器の状態を実際に変更します。

<a id="automationtestssh"></a>

## automation.test.ssh

SSH コマンドの実行をテストする

**メソッド**: POST
**パス**: `/api/v1/automation/test/ssh`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host_id` | string | 必須 | 保存された SSH ホスト設定 ID。 | 既定値なし |
| `command` | string | 必須 | リモートコマンド。 | 既定値なし |
| `timeout_ms` | integer | 任意 | ミリ秒単位のタイムアウト。 | 30000 |

### リクエストの例

```json
{
  "host_id": "example-host",
  "command": "uname -a",
  "timeout_ms": 30000
}
```

### 応答と完了

リモート実行結果。終了コードと出力を検査します。

### 使用上の注意

接続して実行します。構文のみのチェックではありません。

<a id="automationvariablesdelete"></a>

## automation.variables.delete

保存されたユーザー変数を削除します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/variables/delete`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | ユーザー変数名。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `preview` | boolean | 任意 | 参照先への影響だけをプレビューします。 | false |
| `force` | boolean | 任意 | 影響を確認の上、強制削除を依頼します。 | false |
| `pause_automation` | boolean | 任意 | 処理前に自動化を一時停止します。 | false |

共有 [データ モデル](../response-models.md#variable) を参照してください。

### リクエストの例

```json
{
  "name": "example.temperature",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 応答と完了

設定結果モデルを返し、impact が含まれる場合があります。

<a id="automationvariablesget"></a>

## automation.variables.get

変数値の取得

**メソッド**: GET / POST
**パス**: `/api/v1/automation/variables/get`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | 完全な変数名。 | 既定値なし |

共有 [データ モデル](../response-models.md#variable) を参照してください。

### リクエストの例

```json
{
  "name": "compute.temperature"
}
```

### 応答と完了

data に変数の値と型、取得元、読み取り専用の状態、更新に関するメタデータが含まれます。

<a id="automationvariableslist"></a>

## automation.variables.list

すべての変数をリストする

**メソッド**: GET / POST
**パス**: `/api/v1/automation/variables/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `configured_only` | boolean | 任意 | 保存されたユーザー変数定義のみをリストします。 | false |
| `prefix` | string | 任意 | 変数名のプレフィックス フィルター。 | なし |
| `source_id` | string | 任意 | ソース ID でフィルターします。 | なし |
| `include_value` | boolean | 任意 | 変数値を含めます。 | true |
| `include_meta` | boolean | 任意 | タイムスタンプ、ソース、読み取り専用、その他のメタデータを含めます。 | true |

共有 [データ モデル](../response-models.md#variable) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.variables/count を返します。include_value は値を含めるか、include_meta は時刻、取得元、readonly などのメタデータを含めるかを指定します。

<a id="automationvariablesset"></a>

## automation.variables.set

変数値を設定します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/automation/variables/set`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `name` | string | 必須 | ユーザー変数名。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `value` | boolean / number / string / null | 必須 | 保存する値。数値の温度の代わりに配列やオブジェクトを指定してはいけません。 | 既定値なし |
| `create_only` | boolean | 任意 | 既存の値を上書きせずに返します。 | false |
| `source_id` | string | 任意 | ソース識別子。 | user |
| `value_type` | integer | 任意 | オプションのタイプ ID。通常は値から推測します。 | 値から推測 |

共有 [データ モデル](../response-models.md#variable) を参照してください。

### リクエストの例

```json
{
  "name": "example.temperature",
  "value": 42.5,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

コンフィギュレーションレスモデルと名前/created/value.

### 使用上の注意

読み取り専用・システムソースの変数では変更が拒否される場合があります。この簡易的な値モデルでは、配列やオブジェクトは扱いません。
