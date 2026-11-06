# SSH 接続とコマンド API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [ssh.cancel](#sshcancel) | 実行中の SSH 実行セッションをキャンセルします |
| [ssh.commands.add](#sshcommandsadd) | SSH コマンド設定の追加または更新 |
| [ssh.commands.export](#sshcommandsexport) | SSH コマンド設定を .tscfg としてエクスポート |
| [ssh.commands.get](#sshcommandsget) | ID による SSH コマンド設定の取得 |
| [ssh.commands.import](#sshcommandsimport) | .tscfg から SSH コマンド設定をインポート |
| [ssh.commands.list](#sshcommandslist) | すべての SSH コマンド設定をリストします。 |
| [ssh.commands.remove](#sshcommandsremove) | SSH コマンド設定の削除 |
| [ssh.commands.update](#sshcommandsupdate) | 既存の SSH コマンド設定を更新する |
| [ssh.copyid](#sshcopyid) | 公開鍵をリモートサーバーに展開します |
| [ssh.exec](#sshexec) | SSH経由でリモートコマンドを実行 |
| [ssh.exec_status](#sshexec_status) | 自分の現在または最新の SSH 実行結果を取得する |
| [ssh.exec_stream](#sshexec_stream) | WebSocket 経由のストリーミング出力によるリモート コマンドの実行 |
| [ssh.hosts.add](#sshhostsadd) | SSHホスト設定の追加 |
| [ssh.hosts.export](#sshhostsexport) | SSH ホスト設定を .tscfg としてエクスポート |
| [ssh.hosts.get](#sshhostsget) | ID による SSH ホスト設定の取得 |
| [ssh.hosts.import](#sshhostsimport) | .tscfg から SSH ホスト設定をインポート |
| [ssh.hosts.list](#sshhostslist) | すべての SSH ホスト設定をリストします。 |
| [ssh.hosts.remove](#sshhostsremove) | SSH ホスト設定の削除 |
| [ssh.hosts.update](#sshhostsupdate) | 既存の SSH ホスト設定を更新する |
| [ssh.keygen](#sshkeygen) | SSH 鍵ペアの生成 |
| [ssh.revoke](#sshrevoke) | デプロイされた公開鍵をリモート サーバーから取り消します (削除します)。 |
| [ssh.services.start](#sshservicesstart) | 保存済みの管理対象サービスを開始する |
| [ssh.test](#sshtest) | SSH 接続のテスト |

<a id="sshcancel"></a>

## ssh.cancel

実行中の SSH 実行セッションをキャンセルします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/cancel`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `session_id` | integer | 必須 | ssh.exec_stream によって返される実行 ID。 | 既定値なし |
| `boot_id` | string | 任意 | result_key とともに指定する場合、開始時の受付応答と一致する必要があります。実行を開始したログインセッションでは、両方を省略できます。 | 既定値なし |
| `result_key` | string | 任意 | boot_id とともに指定する、受付応答の秘密鍵。 | 既定値なし |

### リクエストの例

```json
{
  "session_id": 1
}
```

### 応答と完了

data.cancelled=true はキャンセル要求の受け付けを示します。引き続き最終状態を照会してください。

### 使用上の注意

実行を開始したログインセッションが必要です。別の root セッションからはキャンセルできません。操作受付情報を指定した場合は、情報の組がそろい、同じ実行に一致するかも確認されます。cancelled は要求の受け付けだけを示し、exec_status には引き続き操作受付情報一式が必要です。

<a id="sshcommandsadd"></a>

## ssh.commands.add

SSH コマンド設定の追加または更新

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/commands/add`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

### リクエストの例

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="sshcommandsexport"></a>

## ssh.commands.export

SSH コマンド設定を .tscfg としてエクスポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/commands/export`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `recipient_cert` | string | 任意 | 受信先の証明書 PEM。省略すると、この機器向けに暗号化します。 | このデバイス証明書 |
| `include_host` | boolean | 任意 | 依存ホスト定義をエクスポートに含めます。 | false |

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

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

<a id="sshcommandsget"></a>

## ssh.commands.get

ID による SSH コマンド設定の取得

**メソッド**: GET / POST
**パス**: `/api/v1/ssh/commands/get`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

### リクエストの例

```json
{
  "id": "example"
}
```

### 応答と完了

1 つの SSH コマンドと active_version。 ADMIN 未満のフィールドはフィルタリングされます。

<a id="sshcommandsimport"></a>

## ssh.commands.import

.tscfg から SSH コマンド設定をインポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/commands/import`
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

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

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

<a id="sshcommandslist"></a>

## ssh.commands.list

すべての SSH コマンド設定をリストします。

**メソッド**: GET / POST
**パス**: `/api/v1/ssh/commands/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 任意 | 取得開始位置を示す非負のオフセット。 | 0 |
| `limit` | integer | 任意 | 取得件数。省略時は件数の切り詰めを要求しません。 | 全て |
| `host_id` | string | 任意 | 保存されたホスト ID でフィルターします。 | 全て |

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.commands/count/total/active_version/load_error/paused を返します。ADMIN 未満では制限されたメタデータだけが返されます。

<a id="sshcommandsremove"></a>

## ssh.commands.remove

SSH コマンド設定の削除

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/commands/remove`
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

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

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

<a id="sshcommandsupdate"></a>

## ssh.commands.update

既存の SSH コマンド設定を更新する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/commands/update`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#ssh-commands) を参照してください。

### リクエストの例

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="sshcopyid"></a>

## ssh.copyid

公開鍵をリモートサーバーに展開します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/copyid`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | リモート アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート アカウント。 | 既定値なし |
| `port` | integer | 任意 | SSH ポート。 | 22 |
| `password` | string | 必須 | このリモート認証のパスワード。 | 既定値なし |
| `keyid` | string | 必須 | 公開鍵の配置または撤去の対象となるローカル鍵 ID。 | 既定値なし |
| `trust_new` | boolean | 任意 | 新しいホストは、独立した検証後にのみ受け入れてください。 | false |
| `accept_changed` | boolean | 任意 | 変更されたホスト フィンガープリントは、検証後にのみ受け入れてください。 | false |
| `confirmed_fingerprint` | string | 任意 | 確認中のホストと一致する検証済みのフィンガープリント。 | なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |
| `verify` | boolean | 任意 | デプロイ後に確認します。 | true |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

data.deployed/verified/registered/registration_error、host_id、ホストと鍵の詳細を返します。リモートへの配置とローカルの登録は別々に確認してください。

### 使用上の注意

ローカル登録は失敗しても、リモート展開は成功する可能性があります。すぐに再インストールしないでください。

<a id="sshexec"></a>

## ssh.exec

SSH経由でリモートコマンドを実行

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/exec`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `keypath` | string | サポートされている即時呼び出し認証の代替手段 | デバイスの秘密鍵のパス。サポートはエントリ ポイントによって異なります。 | なし |
| `command` | string | 必須 | リモート コマンド テキスト。 | 既定値なし |
| `timeout_ms` | integer | 任意 | 接続・実行のタイムアウト（ミリ秒）。 | SSH のデフォルト |
| `trust_new` | boolean | 任意 | 新しいホストは、独立した検証後にのみ受け入れてください。 | false |
| `accept_changed` | boolean | 任意 | 変更されたホスト フィンガープリントは、検証後にのみ受け入れてください。 | false |
| `confirmed_fingerprint` | string | 任意 | 確認中のホストと一致する検証済みのフィンガープリント。 | なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a"
}
```

### 応答と完了

data.stdout/stderr/exit_code/host_status/fingerprint を返します。終了コードとアプリケーションの出力を確認してください。

### 使用上の注意

未知または変更されたフィンガープリントでは、確認用の情報が返されます。承認前に検証してください。リモートの終了コードが 0 以外でも、最上位の code は 0 の場合があります。

<a id="sshexec_status"></a>

## ssh.exec_status

自分の現在または最新の SSH 実行結果を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/ssh/exec_status`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `session_id` | integer | 必須 | ssh.exec_stream によって返される実行 ID。 | 既定値なし |
| `boot_id` | string | 必須 | 受付応答に含まれる、32 文字の16 進数の起動識別子。 | 既定値なし |
| `result_key` | string | 必須 | 受付応答に含まれる、32 文字の16 進数の結果取得用認証情報。 | 既定値なし |

### リクエストの例

```json
{
  "session_id": 1,
  "boot_id": "00000000000000000000000000000000",
  "result_key": "00000000000000000000000000000000"
}
```

### 応答と完了

data は WebSocket の結果形式を使います。実行中は ssh_exec_running、終了時は ssh_exec_done/cancelled/error です。status/exit_code/success と、出力が欠けていないことを確認してください。

### 使用上の注意

実行を開始したセッションと正しい操作受付情報が必要です。0 で埋めた例は形式だけを示すため、実際の開始応答の値を使ってください。照会でコマンドが再実行されることはありません。

<a id="sshexec_stream"></a>

## ssh.exec_stream

WebSocket 経由のストリーミング出力によるリモート コマンドの実行

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/exec_stream`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | SSH ホスト アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート ユーザー名。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535。 | 22 |
| `password` | string | 代替認証 | 接続先のリモートアカウントのパスワード。TianshanOS のアカウント用ではありません。 | なし |
| `keyid` | string | 代替認証 | デバイスに保存された SSH 秘密鍵 ID。 | なし |
| `command` | string | 必須 | コマンドテキスト。 | 既定値なし |
| `expect_pattern` | string | 任意 | 成功を判定する照合パターン。 | 変更なし |
| `fail_pattern` | string | 任意 | 失敗を判定する照合パターン。 | 変更なし |
| `extract_pattern` | string | 任意 | 出力抽出パターン。 | 変更なし |
| `var_name` | string | 任意 | 結果変数のプレフィックス。 | 変更なし |
| `timeout` | integer | 任意 | ここではミリ秒単位です。保存済みコマンドの timeout_sec とは異なります。 | デフォルトの実行期限 |
| `collect_output` | boolean | 任意 | 収集された出力を保持します。 | true |
| `max_output_size` | integer | 任意 | 収集する出力の上限（バイト）。 | デバイスのデフォルト |
| `stop_on_match` | boolean | 任意 | パターンに一致したら停止します。 | false |
| `command_id` | string | command_instance とのオプションのペア | 関連付けられた保存されたコマンド ID。 | なし |
| `command_instance` | string | command_id とのオプションのペア | 一覧の runtime_instance と一致する、16 文字の小文字の16 進数識別子。 | なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a",
  "collect_output": true
}
```

### 応答と完了

data.session_id/boot_id/result_key を返します。WebSocket の結果を受け取ったり ssh.exec_status を照会したりする前に、操作受付情報を保存してください。

### 使用上の注意

ストリーミング用の実行枠を排他的に使用します。汎用の keypath 認証は使えません。所有者、最終状態、出力が欠けていないことを確認してください。

<a id="sshhostsadd"></a>

## ssh.hosts.add

SSHホスト設定の追加

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/hosts/add`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

### リクエストの例

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="sshhostsexport"></a>

## ssh.hosts.export

SSH ホスト設定を .tscfg としてエクスポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/hosts/export`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `recipient_cert` | string | 任意 | 受信先の証明書 PEM。省略すると、この機器向けに暗号化します。 | このデバイス証明書 |

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

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

<a id="sshhostsget"></a>

## ssh.hosts.get

ID による SSH ホスト設定の取得

**メソッド**: GET / POST
**パス**: `/api/v1/ssh/hosts/get`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

### リクエストの例

```json
{
  "id": "example"
}
```

### 応答と完了

1 つのホストと active_version。 ADMIN 未満のフィールドはフィルタリングされます。

<a id="sshhostsimport"></a>

## ssh.hosts.import

.tscfg から SSH ホスト設定をインポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/hosts/import`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 必須 | 文字列として提供される完全なパッケージの JSON テキスト。 | 既定値なし |
| `preview` | boolean | 任意 | true の場合のみプレビューします。 | false |
| `active_version` | string | 適用時に必須 | 現在の設定バージョン。 | プレビューでは現在のバージョンが使用される可能性があります |
| `overwrite` | boolean | 任意 | 既存のオブジェクトを異なるコンテンツに置き換えることを許可します。 | false |
| `expected_credential` | integer | 適用時に必須 | プレビューが返した credential_generation。 | なし |
| `expected_digest` | string | 適用時に必須 | プレビューが返した package_digest。 | なし |

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

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

<a id="sshhostslist"></a>

## ssh.hosts.list

すべての SSH ホスト設定をリストします。

**メソッド**: GET / POST
**パス**: `/api/v1/ssh/hosts/list`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 任意 | 取得開始位置を示す非負のオフセット。 | 0 |
| `limit` | integer | 任意 | 取得件数。省略時は件数の切り詰めを要求しません。 | 全て |

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.hosts/count/total/active_version/load_error/paused を返します。ADMIN 未満では制限されたメタデータだけが返されます。

<a id="sshhostsremove"></a>

## ssh.hosts.remove

SSH ホスト設定の削除

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/hosts/remove`
**最低権限**: ADMIN

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

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

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

<a id="sshhostsupdate"></a>

## ssh.hosts.update

既存の SSH ホスト設定を更新する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/hosts/update`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | 安定したオブジェクト ID。読み取り後も既存の ID を保持します。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

共有 [データ モデル](../configuration-models.md#ssh-hosts) を参照してください。

### リクエストの例

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

設定の結果として active_version/source/loaded/configured/enabled/paused/saved/uncertain とエラー箇所を返します。詳細は設定結果モデルを参照してください。

### 使用上の注意

追加には未使用の ID が必要です。更新には既存のオブジェクトが必要です。完全なモデルの例を参照してください。

<a id="sshkeygen"></a>

## ssh.keygen

SSH 鍵ペアの生成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/keygen`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `id` | string | 必須 | キー ID。 | 既定値なし |
| `type` | string | 任意 | ここで指定可能な鍵の種類。例：rsa2048/rsa4096/ec256/ec384。 | rsa2048 |
| `comment` | string | 任意 | 公開鍵コメント。 | 空 |

### リクエストの例

```json
{
  "id": "example-key",
  "type": "ec256"
}
```

### 応答と完了

data.id/type/public_key.

### 使用上の注意

新しい統合には key.generate を優先します。サポートされているパラメータが異なります。

<a id="sshrevoke"></a>

## ssh.revoke

デプロイされた公開鍵をリモート サーバーから取り消します (削除します)。

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/revoke`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `host` | string | 必須 | リモート アドレス。 | 既定値なし |
| `user` | string | 必須 | リモート アカウント。 | 既定値なし |
| `port` | integer | 任意 | SSH ポート。 | 22 |
| `password` | string | 必須 | このリモート認証のパスワード。 | 既定値なし |
| `keyid` | string | 必須 | 公開鍵の配置または撤去の対象となるローカル鍵 ID。 | 既定値なし |
| `trust_new` | boolean | 任意 | 新しいホストは、独立した検証後にのみ受け入れてください。 | false |
| `accept_changed` | boolean | 任意 | 変更されたホスト フィンガープリントは、検証後にのみ受け入れてください。 | false |
| `confirmed_fingerprint` | string | 任意 | 確認中のホストと一致する検証済みのフィンガープリント。 | なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key"
}
```

### 応答と完了

data.revoked/found/removed_count およびリモートの詳細。

### 使用上の注意

ローカル キー、ホスト定義、リモート プロセスではなく、指定された公開鍵のみを削除します。

<a id="sshservicesstart"></a>

## ssh.services.start

保存済みの管理対象サービスを開始する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/services/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `command_id` | string | 必須 | 管理対象サービスとして構成された保存されたコマンド ID。 | 既定値なし |
| `active_version` | string | 必須 | 設定状態から取得した最新の active_version。変更後は読み直してください。 | 既定値なし |

### リクエストの例

```json
{
  "command_id": "example-service",
  "active_version": "CURRENT_VERSION"
}
```

### 応答と完了

data.operation_id/run_id; automation.services.status で確認します。

### 使用上の注意

保存済みの設定を使用します。呼び出しが成功した後でも、実行中のプロセスとアプリケーションの準備完了を区別します。

<a id="sshtest"></a>

## ssh.test

SSH 接続のテスト

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ssh/test`
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
| `trust_new` | boolean | 任意 | 新しいホストは、独立した検証後にのみ受け入れてください。 | false |
| `accept_changed` | boolean | 任意 | 変更されたホスト フィンガープリントは、検証後にのみ受け入れてください。 | false |
| `confirmed_fingerprint` | string | 任意 | 確認中のホストと一致する検証済みのフィンガープリント。 | なし |

### リクエストの例

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key"
}
```

### 応答と完了

data.success/host/port/user/host_status/fingerprint を返します。接続に失敗した場合は stage/reason/error とフィンガープリントが含まれる場合があります。

### 使用上の注意

接続と認証の条件を確認するもので、すべてのリモートコマンドやサービスが利用できることを保証するものではありません。
