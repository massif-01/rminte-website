# 設定データモデル

これらのモデルは、実行時に使用するホスト、コマンド、データソース、アクション、ルールを保存します。まず無効の状態で例を保存し、読み直して確認してから、実際の動作を有効にしてください。

## 書き込み前にバージョンを確認する

root で automation.config.status を読み取り、active_version を保持します。書き込みリクエストの最上位にその値を指定してください。書き込みに成功するたびに、次のリクエストには新しく返されたバージョンを使います。ルールの更新では、読み取った revision も expected_revision として指定します。競合した場合は、読み直して変更を統合してください。バージョントークンだけを差し替え、古い入力を再送してはいけません。

以下の JSON オブジェクトは、リクエスト全体の形式例です。CURRENT_VERSION、識別子、アドレス、鍵、変数名を置き換えてください。モデルのフィールドはリクエストの最上位に指定します。明示したサブオブジェクトを除き、config というラッパーを追加してはいけません。

restricted:true は、メタデータだけが返されている場合があります。SSH ホスト・コマンド、ルール、アクションの全情報の読み取りには ADMIN を使います。automation.sources.list の秘密情報には引き続き ROOT が必要です。定義の書き込みには各 API が定めるロールが必要です。省略された秘密フィールドは空の値ではありません。ホスト・ソースの更新は既存の JSON に統合されますが、コマンド・アクションの更新では完全な定義を送る必要があります。ルールには独自の統合・revision 確認があるため、一つの種類の更新動作を他にも当てはめないでください。

## SSH ホスト

ssh.hosts.add/update 用のモデルです。接続先、接続方法、使用する鍵を保存します。フィンガープリントを保存する hosts.* とは別です。

```json
{"id":"example-host","active_version":"CURRENT_VERSION","host":"192.0.2.20","port":22,"username":"YOUR_USER","auth_type":"key","keyid":"example-key","enabled":true}
```

| フィールド | 種類、制限、および意味 |
| --- | --- |
| id | 安定した識別用文字列、最大 31 バイト。追加時は未登録、更新時は登録済みであること |
| host | アドレス文字列、最大 63 バイト |
| port | SSH ポートの整数値。通常は 22。1～65535 を指定 |
| username | リモート ユーザー、最大 31 バイト。デバイスログインとは異なります |
| auth_type | key/password。永続的な定義には key を推奨 |
| keyid | 保存されたローカル SSH 秘密鍵 ID、最大 31 バイト |
| enabled | ブール値、デコードのデフォルトは true |
| created_time | オプションの符号なし 32 ビット時刻値。通常は既存の値を保持します |

永続モデルに password フィールドは保存されません。password モードを選んでも、リモートパスワードが保存されるわけではありません。即時実行の呼び出しでは、その呼び出しで認証情報を指定します。ホストは最大 16 件です。アドレス、鍵の存在、リモートホストの信頼はそれぞれ確認されます。

## SSH コマンド

ssh.commands.add/update 用のモデルです。保存してもコマンドは実行されません。短いコマンドでは service_mode:false を使います。継続的に管理するサービスでは true を指定し、ssh.services.start で開始します。

```json
{"id":"example-command","active_version":"CURRENT_VERSION","host_id":"example-host","name":"Read OS","command":"uname -a","timeout_sec":30,"enabled":true,"service_mode":false}
```

| フィールド | 種類、制限、および意味 |
| --- | --- |
| id / host_id | 文字列、それぞれ最大 31 バイト。 host_id は保存されたホストを参照します |
| name / command | 文字列、最大 63 /1023 バイト |
| desc / icon | オプションの文字列、最大 127 /63 バイト。 icon には表示アイコンまたはパスを指定できます |
| expect_pattern / fail_pattern / extract_pattern | 省略可能な照合・抽出パターン。それぞれ最大 127 バイト |
| var_name | オプションの結果変数プレフィックス、最大 31 バイト |
| timeout_sec | 0 ～ 65535 秒、デフォルトは 30。ミリ秒ではありません |
| stop_on_match / nohup / enabled / service_mode | ブール値。enabled の既定値は true、その他は false |
| ready_pattern / service_fail_pattern | サービスの準備完了・失敗の照合パターン。それぞれ最大 127 バイト |
| ready_timeout_sec / ready_check_interval_ms | 整数 0～65535。単位はそれぞれ秒／ミリ秒。サービスの動作に合わせて設定 |
| created_time | オプションの符号なし 32 ビット時刻値 |

timeout、expectPattern、failPattern、extractPattern、varName、stopOnMatch、serviceMode、readyPattern、serviceFailPattern、readyTimeout、readyInterval という別名もあります。表に記載した標準名を優先し、同じ項目に二つの名前を同時指定しないでください。_object_id/runtime_instance は永続 ID／実行時 ID を示します。ID を作り出さず、返された値を保持してください。コマンドは最大 64 件です。

## データ ソース

automation.sources.add/update 用のモデルです。データソースはデータを取得し、ルールで使用する変数へマッピングします。

```json
{"id":"example-source","active_version":"CURRENT_VERSION","label":"Temperature","type":"rest","enabled":false,"poll_interval_ms":5000,"auto_discover":false,"rest_url":"https://example.com/status","rest_method":"GET","mappings":[{"path":"temperature","var":"compute.temperature"}]}
```

| 共有フィールド | 種類と意味 |
| --- | --- |
| id / label | 文字列、最大 63 /47 バイト |
| type | 文字列 builtin/websocket/socketio/rest/variable、または対応する整数 0～4 |
| enabled / auto_discover | ブール値。 auto_discover のデフォルトは true です。例では明示的に無効にします |
| poll_interval_ms | 整数0 ～ 4294967295 ミリ秒。更新の動作はタイプによって異なります。ゼロは無制限のサンプリングではありません |
| mappings | 最大 4 件。path は最大 95 バイト、var は 63 バイト、省略可能な transform は 63 バイト |

マッピングの path/var には、json_path/var_name という別名も使えます。path は temperature や cpu.cores[0].freq のように、データ内のフィールドを指定します。URL ではありません。変換は既知のサンプル値で確認してください。

| 型 | タイプ固有のフィールド |
| --- | --- |
| websocket | ws_uri 最大 95 バイト。 ws_path 最大 63 バイトのレガシー単一フィールド パス。 reconnect_ms0 ～ 65535 ミリ秒 |
| socketio | sio_url 最大 95 バイト。 sio_event 最大 63 バイト |
| rest | rest_url 最大 95 バイト。 rest_method 最大 7 バイト。 rest_auth 最大 47 バイト。 rest_path 最大 63 バイトのレガシー パス |
| variable | var_name、var_prefix、var_watch_all; SSH データ フローでは、ssh_host_id、ssh_command、expect_pattern、fail_pattern、extract_pattern、timeout_sec も使用されます。 |
| builtin | builtin オブジェクト。type で組み込みの測定対象を選択。GPIO は pin、ADC は channel/atten、コンピューター状態は device_index を使用可能 |

文字列型の入力には便利な別名も使えます。WebSocket は uri/json_path、Socket.IO は url/event、REST は url/method/auth_header/json_path に対応します。上表の標準フィールドを優先してください。変数ソースの文字列は通常最大 63 バイト、ssh_command は 95 バイト、timeout_sec は 0〜65535 秒です。組み込みのハードウェア種別やチャネルを数値 ID で指定する場合は、ピンやチャネルを推測せず、既存の定義から始めてください。

## ユーザー変数

automation.variables.set は書き込み、get/list は読み取りです。value だけでなく、name、source、readonly、経過時間も確認してください。

```json
{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}
```

value は null、ブール値、有限の数値、最大 63 バイトの文字列に対応します。通常は value_type を省略し、値から型を判定させます。明示的に指定する場合は 0=null、1=bool、2=int、3=float、4=string で、値と一致する必要があります。整数は符号付き 32 ビットの範囲、それ以外の有限の数値は浮動小数点として扱います。

source_id の既定値は user です。create_only:true は既存の変数を保持するため、新しい要求値が書き込まれたことを示すものではありません。読み取り専用・システムソースの変数では変更が拒否される場合があります。温度バインドには適切な数値型の温度変数が必要です。文字列、無効値、古いデータを通常のセンサー測定値として扱ってはいけません。

## アクションテンプレート

automation.actions.add/update は再利用可能なアクションを保存します。 この例では、ハードウェアの制御ではなくメッセージをログ化します。

```json
{"id":"example-action","active_version":"CURRENT_VERSION","name":"Record a message","enabled":true,"type":"log","async":false,"delay_ms":0,"log":{"level":3,"message":"Example action"}}
```

共通フィールドは、id（最大 63 バイト）、name（47 バイト）、description（63 バイト）です。enabled の既定値は true、async は false、delay_ms は 0〜65535 ミリ秒です。created_at は省略可能な非負整数の時刻値で、通常は既存のオブジェクトの値を保持します。

| 型 | タイプ固有のサブオブジェクトとフィールド |
| --- | --- |
| log | log: level、message（最大 47 バイト） |
| set_var | set_var: variable、value、省略可能な value_type |
| ssh_cmd | ssh: host_ref、command、timeout_ms、async |
| ssh_cmd_ref | ssh_ref: 保存済みコマンドを参照する cmd_id |
| gpio | gpio: pin、**ブール値**の level、pulse_ms |
| device_ctrl | device: device、対応する操作名を指定する action |
| cli | cli: command、var_name、timeout_ms |
| webhook | webhook: url、method、body_template |
| led | led: device、ctrl_type、選択した表示機能のフィールド |

ホスト参照、変数名、コマンド参照、機器名・アクション名は通常最大 63 バイトです。インラインの SSH/CLI コマンドと webhook URL は最大 95 バイト、method は 7 バイト、body_template は 63 バイトです。長すぎるフィールドは拒否されるため、切り詰められることを前提にしてはいけません。アクション内のインラインコマンドは、保存済みの ssh.commands より容量が小さくなります。

### LED アクション フィールド

led.ctrl_type は fill/effect/brightness/off/text/image/qrcode/filter/filter_stop/text_stop のいずれかです。直接呼び出す LED API の全パラメーターを入れるのではなく、選んだ表示機能のフィールドを指定してください。

表示用の共通フィールドは device、index（255=すべて）、color 文字列または r/g/b、brightness（0〜255）、effect、speed、duration_ms（0〜65535）です。マトリックス用には text（最大 127 バイト）、font（31）、image_path（127）、qr_text（255）、文字列 L/M/Q/H の qr_ecc、filter（31）、filter_params、center、loop、scroll、align、x/y、文字位置指定用の auto_pos があります。scroll は none/left/right/up/down、align は left/center/right です。x/y は符号付き 16 ビット座標です。

QR コードの前景色には qr_fg、背景画像には qr_bg_image を使います。明示的な黒は指定された色であり、省略値ではありません。filter_params はエフェクトが対応する名前付き数値オプションを使います。実行には対応ハードウェアと有効なパス・設定も必要です。まず保存と読み取りを確認してから、意図したエフェクトを試してください。

## 自動化ルール

automation.rules.add/update は条件とアクションを保存します。有効なルールは自動実行を開始する場合があるため、最初は enabled:false を指定してください。

```json
{"id":"example-rule","active_version":"CURRENT_VERSION","name":"Temperature example","enabled":false,"logic":"and","cooldown_ms":10000,"conditions":[{"variable":"example.temperature","operator":"gt","value":50}],"actions":[{"type":"log","level":3,"message":"Temperature high"}]}
```

| フィールド | 種類と意味 |
| --- | --- |
| id / name / icon | 文字列。それぞれ最大 63／47／63 バイト。ID には区切り文字・制御文字を使用不可 |
| enabled | ブール値、デフォルトは true。例では明示的に無効にします |
| manual_trigger / show_on_dashboard / allow_manual_trigger | トリガー・表示を制御するブール値。呼び出し元の権限を定めるものではない |
| cooldown_ms | 符号なし 32 ビット ミリ秒 |
| revision | ルールのリビジョン。読み取った revision を更新条件の expected_revision として指定 |
| logic / conditions | and/or。既定値は and。条件は最大 255 件 |
| actions | 最大 255 件。有効なルールではアクションを空にできない |

条件は {variable, operator, value} で表し、演算子は eq/ne/lt/le/gt/ge/contains です。値は変数モデルに従います。conditions:{logic, items:[...]} も使用できます。どちらか一つの表現を選んでください。

ルール内のインラインアクションは **フラットなフィールド**を使います。log は level/message、SSH は host_ref/command、GPIO は pin/level です。一方、テンプレートは入れ子のサブオブジェクトを使います。インライン SSH の type は ssh、テンプレートでは ssh_cmd です。template_id の参照は、キャッシュされたインラインフィールドより優先されます。

アクションの共通フィールドは delay_ms、async、repeat_mode（once/while_true/count）、repeat_count（0〜255）、repeat_interval_ms（0〜65535）、省略可能な condition（条件モデル。null で解除）です。動作が及ぼす影響を考慮して、繰り返し方法を選んでください。

| インラインタイプ | フラットフィールド |
| --- | --- |
| log / set_var | level/message、または variable/value/value_type |
| ssh / ssh_cmd_ref | host_ref/command/ssh_async/timeout_ms;または cmd_id |
| gpio / device_ctrl | pin／ブール値の level／pulse_ms、または device/action |
| webhook / cli | url/method/body_template、または command/var_name/timeout_ms |
| led | device/ctrl_type/r/g/b などのフラットなフィールド。ctrl_type はテンプレートの文字列ではなく整数の列挙値を使用 |

複雑な LED ルールでは、保存済みのテンプレートを参照してください。インラインの ctrl_type は 0=fill、1=effect、2=brightness、3=off、4=text、5=image、6=qrcode、7=filter、8=filter_stop、9=text_stop です。インラインの qr_ecc は文字コードの整数で、L=76、M=77、Q=81、H=72 です。

filter_params は独立したオブジェクトです。整数の範囲は speed が 1〜100、intensity/density/decay/amplitude が 0〜255、scale が 1〜100、levels が 2〜16、amount/saturation/frequency が 0〜100、angle が 0〜360、width が 1〜16、wavelength が 1〜32 です。テンプレート・UI の単位は、一部の直接呼び出す LED フィルターの単位と異なります。API リクエスト全体を actions 配列に入れてはいけません。

## モジュール設定

config.module.show はモジュールの config オブジェクトを返します。config.module.set で一つのキーを変更する前に、既存のフィールドを読み取ってください。モジュールは net/dhcp/wifi/nat/led/fan/device/system です。対応内容は各操作の説明を参照してください。key はモジュール内のキーを示します。値の型を保持してください。

config.module.save と dirty 状態は、automation の active_version とは別です。ネットワーク設定の変更でアクセスが切れる場合があるため、事前に接続経路を記録してください。ADMIN 未満では、WiFi の読み取り結果にパスワードは含まれません。

## 監視ウィジェット

ui.widgets はフロントエンドのレイアウト JSON を保存します。データ収集機能を作成するものではありません。widgets はフロントエンドが解釈する配列で、初期状態では空の場合があります。まず ui.widgets.get を読み取り、既存のフィールドと ID を保持してください。refresh_interval の単位はミリ秒、既定値は 5000 です。シリアライズ後の設定全体は 4000 バイトまでです。nvs_saved は、変数にデータがあることを示すものではありません。

## インポート、削除、ソースの選択

まずプレビューし、そのプレビューの前提条件を指定して適用します。tscfg は完全なパッケージ JSON を **文字列**として渡すもので、任意のオブジェクトではありません。ホスト・コマンド・ソース・アクションのインポートは expected_digest/expected_credential を使います。ルールのインポートでは確認フィールドが異なるため、リファレンスを参照してください。

削除の影響をプレビューしてから、通常削除・置き換え・カスケード削除を選択します。定義を削除しても、リモートプロセスが自動停止したり、リモート鍵が失効したりするわけではありません。SD／内部バックアップの選択は設定一式を置き換えるため、保護されたファイルを上書きせず、automation.config.preview/apply を使用してください。
