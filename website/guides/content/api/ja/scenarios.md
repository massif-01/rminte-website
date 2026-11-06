# 目的別の操作例

例では[クイックスタート](quickstart.md)の TS_BASE と TS_TOKEN を使います。アドレス、オブジェクト ID、設定バージョン、操作受付情報を実際の値に置き換えてください。制御の例は実際に機器を動かします。目的の操作だけを実行してください。

## デバイスを監視する

温度、冷却、電源、コンピューターの状態を監視システムへ取り込みます。READ 権限が必要な機能はログインして利用します。一部の概要エンドポイントは公開されています。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/temp/read"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/fan/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/power/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/device/status?device=agx"
```

温度の valid、ファンの duty_valid、電源の valid/crc_valid、最終更新時刻を保持します。無効・切断中の状態は明示してください。duty は百分率、rpm は回転速度です。コンピューターが state=on でも、アプリケーションの準備完了を示すものではありません。[応答モデル](response-models.md)を参照してください。

監視が成功したということは、有効な読み取り値が更新され続けることを意味します。継続的なダッシュボードには WebSocket を使用します。無効な温度については、temp.sources を調べてください。計算リソースのテレメトリの問題については、monitor.status を調べてください。欠損値をゼロに置き換えないでください。提供されている Python サンプルは、ログイン、読み取り、ログアウトのみを実行します。

## コンピューターを制御する

ADMIN が必要です。最初に device.status を読み取り、対象が agx か lpmu かと、現在の状態を確認します。タイムアウト後に toggle を繰り返さず、on/off を明示して操作してください。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"agx","action":"on"}' \
  "$TS_BASE/api/v1/device/power"
```

次に GET device.status で state/power_good を確認します。アプリケーションの準備完了は、対象コンピューター上、または業務アプリケーションのヘルスチェック用エンドポイントで確認してください。通常のシャットダウンには off を使います。force_off/reset は処理を中断し、データを失う場合があるため、事前に対象システムの保守を調整してください。

USB の切り替えは、`{"target":"agx"}` を指定して POST device.usb.set を実行し、GET device.usb.status で確認します。他の指定先は esp32/lpmu/disconnect です。切り替え中に以前の接続経路が切断される場合があります。それだけで機器の故障とは判断できません。

タイムアウト後、再試行する前に状態をクエリします。ターゲットが予期した状態に達しない場合は、エラー状態、電力表示、および詳細を保存します。

## ライトとファンを調整する

通常の LED 操作には ADMIN が必要です。GET led.list で機器名を取得してから、指定した色で点灯させます。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"board","color":"#00A0FF"}' \
  "$TS_BASE/api/v1/led/fill"
```

led.list を再度読み取ります。再起動後にも同じ表示を使うには、別途 `{"device":"board"}` を指定して POST led.save を実行し、saved を確認します。表示を変える操作と、起動時の設定を保存する操作は別です。

ファンは、最初に fan.status/config を読み取ります。実際のファン ID を取得してから、`{"id":0,"duty":50}` を指定して POST fan.set を実行してください。fan.mode は off/manual/auto/curve を選択します。カーブ、上限・下限、永続保存に必要な権限は[ファンのリファレンス](reference/fan.md)に記載しています。

出力変更後、duty_valid/duty/target_duty、温度、故障を確認します。一時的に手動で設定した後、目的の制御モードを復元します。

## リモートタスクの管理

単発のコマンドには ssh.exec/exec_stream を使います。継続的に管理するサービスには、保存済み SSH コマンドと実行記録を使います。コマンドを直接実行するには ROOT、既存の管理対象サービスを開始するには ADMIN 以上が必要です。

開始前に、接続先への到達性、検証済みのホストフィンガープリント、保存済みホストが参照する SSH 鍵の有効性を確認します。未知・変更済みのフィンガープリントは ssh.test と信頼できる情報で確認してください。信頼情報を消去したり、自動承認したりして対処してはいけません。

1. root で ssh.hosts と ssh.commands を読み取ります。ホスト、コマンド、service_mode、準備完了の照合条件を確認します。[設定モデル](configuration-models.md)を参照してください。
2. 最新の active_version を読み取り、保存されたサービスを開始します。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"command_id":"YOUR_SERVICE_COMMAND_ID","active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/ssh/services/start"
```

3. run_id と operation_id を保持します。`{"run_id":"YOUR_RUN_ID","verify":true}` を指定して POST automation.services.status を実行し、operation_phase、busy、state を確認します。verify は元のホストに接続して確認します。ローカルのキャッシュを読むだけではありません。
4. アプリケーションの正常性と準備完了を確認します。停止する場合は、元の run_id を指定して POST automation.services.stop を実行し、引き続き状態を照会します。

run_id は準備完了を示すものではありません。 last_known は以前の観察です。構成またはローカル鍵を削除しても、リモートプロセスは停止しません。名前でプロセスを推測するのではなく、元の実行 ID を使用します。

単発コマンドのストリーミングでは、POST ssh.exec_stream の前に WebSocket を認証します。操作受付情報をすべて保持し、中断後は ssh.exec_status で確認してください。欠けた出力を取得するためだけにコマンドを再実行してはいけません。実行、パターン照合、出力の完全性は[ストリーミング SSH](websocket.md#http-started-streaming-ssh)を参照してください。

## 自動化を設定する

流れとしては、データを取得して変数にマッピングし、条件が成立した場合にアクションを実行します。 root で、最初に automation.status/config.status を読み取ります。編集する前に、読み込み、有効化、一時停止、または SD ソースの選択の問題を解決してください。

保存したユーザー変数から開始します。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/automation/config/status"
```

次のリクエストで active_version を使用します。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/automation/variables/set"
```

root で automation.variables.get を読み取り、value、readonly、source_id を確認します。新しい active_version を保持してください。[ルールモデル](configuration-models.md#automation-rules)から enabled:false のルールを作成します。電源操作やリモート実行を加える前に、ログアクションで確認してください。

実際のデータソースは、必要になってから追加します。ルールを有効にする前に、データの到着、変数の更新、データが古くなっていないかを確認してください。定義の保存、設定の有効化、エンジンの起動、アクションの実行は別の状態です。saved:true だけでは確認が足りません。

競合したら読み直して変更を統合します。削除の影響をプレビューしてください。SD またはバックアップの選択もプレビューしてから適用します。pause/busy の結果に従い、管理対象ファイルを直接上書きしないでください。

## デバイスのメンテナンス

メンテナンス目標を一度に 1 つ選択すると、その効果を確認できます。

| 目的 | 手順 | 完了の確認 |
| --- | --- | --- |
| オブジェクトをバックアップする | 対象オブジェクトに必要なロールでエクスポートし、tscfg を保存。後でインポートする際は先にプレビュー | 完全なパッケージを保持し、検証できること。エクスポートだけでは復元は完了しない |
| ファイルを保存する | アップロード、属性の検査、ダウンロードおよび比較 | 意図されたパス、長さ、バイト数 |
| ファームウェア/WWW の更新 | 一致するイメージを確認し、転送し、グローバルの進行状況を読み取り、状態を確認し、必要に応じて再起動します | 実行中のビルド識別子・バージョンが正しく、アプリケーションが動作すること |
| ネットワークの変更 | 以前の接続経路と設定を記録し、変更・保存して再接続 | 管理とターゲット ネットワーキングの両方が機能する |
| パスワードを変更する | change_password を実行し、再ログインしてクライアントのセッションを更新 | 新しい認証情報は機能します。古いセッションは有効とみなされなくなります |
| ID 証明書のインストール | CSR と鍵の一致を確認してインストールし、cert.status とクライアント側の信頼を確認 | 証明書・鍵が正しく、目的の ID が実際に読み込まれ、クライアント接続を検証できること |

完全なリクエストと容量制限については、[転送と更新](transfers.md) を参照してください。 cert.* はデバイス ID を管理し、key.* は SSH キーを管理し、hosts.* はリモート フィンガープリントを管理します。失敗後、再試行または回復する前にどの段階が有効になったかを確認します。
