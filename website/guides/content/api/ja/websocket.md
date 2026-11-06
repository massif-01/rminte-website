# WebSocket

`ws://10.10.99.97/ws` のアドレスを機器の IP に置き換えて接続します。このチャネルは、テレメトリ、ログ、コントローラーコマンド、対話型 SSH を提供します。接続の成功だけで、認証が必要な機能を使用できるようになるわけではありません。

## 認証して購読する

HTTP ログインを通じてトークンを取得し、次を送信します。

```json
{"type":"auth","token":"YOUR_TOKEN"}
```

auth_ok を待ちます。認証に失敗すると auth_error が返されます。通常のテレメトリトピックは現在公開されていますが、保護された機能を利用するために認証しておくことには意味があります。認証しても READ セッションが ROOT に昇格するわけではありません。

```json
{"type":"subscribe","topic":"fan.status","params":{"interval":5000}}
```

購読成功の応答例：

```json
{"type":"subscribed","topic":"fan.status","success":true}
```

データを格納した応答の例：

```json
{"type":"data","topic":"fan.status","timestamp":123,"data":{"fans":[]}}
```

timestamp の単位は **起動からの秒数**です。HTTP の測定値やログではミリ秒の場合があります。購読の成功は、最初の測定値の受信を確認したものではありません。更新が止まった場合はチャネルと取得元の状態を調べ、必要に応じて HTTP で状態を読み直してください。

## トピック

| トピック | 既定／最小の表示間隔 | コンテンツ |
| --- | --- | --- |
| system.dashboard | 1000ミリ秒 | cpu/memory/info/network/power/fan/services。取得できない項目は省略される場合あり |
| system.info | 5000ミリ秒 | コントローラー情報 |
| system.memory | 5000ミリ秒 | コントローラメモリ |
| system.cpu | 1000ミリ秒 | コントローラ CPU |
| network.status | 5000ミリ秒 | ネットワークステータス |
| power.status | 5000ミリ秒 | 電源ステータス |
| fan.status | 5000ミリ秒 | ファン |
| service.list | 5000ミリ秒 | コントローラー サービス |
| device.status | イベント駆動型、デフォルトは 2000 ミリ秒 | 定期的な完全なスナップショットではなく、コンピューター状態イベント |
| ota.progress | イベント駆動型、デフォルトは 1000 ミリ秒 | デバイス全体の進捗状況。再起動後のHTTPの進行状況とバージョンを確認する |
| config.pack.validated | イベント駆動型、デフォルトは 0 | アップロード済みパッケージの検証。設定の適用ではない |

params.interval はミリ秒単位の非負整数です。最初の 8 個の定期トピックは 0 を拒否し、最小値未満の値は最小値に引き上げます。interval を指定しても、最後の 3 個のイベントトピックがポーリングに変わるわけではありません。同じ接続で同じトピックを再購読すると既存の購読が更新され、履歴の待ち行列は作成されません。

`{"type":"unsubscribe","topic":"fan.status"}` で購読を解除し、unsubscribed/success を確認します。`{"type":"ping"}` に対して pong が返されます。pong だけでは、セッションの認可やテレメトリの正常性は確認できません。

## ログ

ADMIN 以上が必要です。認証してから、log_subscribe を送信します。履歴にも ADMIN が必要です。

| 送信する type | フィールド | 結果・効果 |
| --- | --- | --- |
| log_subscribe | minLevel。既定値は VERBOSE | log_subscribed/minLevel、次に type=log |
| log_set_level | minLevel | すべてのモジュール出力レベルではなく、この接続のフィルターを変更します |
| log_get_history | limit の既定値は 500、minLevel は ERROR、maxLevel は VERBOSE | logs/total を含む log_history。バッファー容量による上限あり |
| log_unsubscribe | なし | この接続のログ ストリームを停止します |

ログには起動からのミリ秒を示す timestamp、level、levelName、tag、message、task が含まれます。レベル 0〜5 は NONE/ERROR/WARN/INFO/DEBUG/VERBOSE です。保持できる量には限りがあり、再接続しても履歴は自動再送されません。

## コントローラーのコマンド端末

この端末が操作するのは管理コントローラーであり、2 台のコンピューター上の Linux システムではありません。ROOT が必要です。コマンドによってハードウェアや設定が変わる場合があります。

| 送信する type | フィールド | 結果 |
| --- | --- | --- |
| terminal_start | token | 端末を要求して接続に紐付け。connected は prompt を含む。使用中は terminal_busy/retry_after を返す |
| terminal_input | data: 完全なコマンド文字列 | output/data メッセージの後に、code/output_incomplete/stopped を含む done |
| terminal_interrupt | なし | 中断を要求。done の前に command_stopping が返る場合あり |
| terminal_stop | なし | 外部エフェクトのロールバックではなく、この接続のターミナルを解放します |

同時に端末を所有できるのは一つの接続だけです。使用中の端末を奪ってはいけません。出力がないだけでは、実行失敗とは判断できません。初めて連携を実装するときは、端末出力の解析よりも、構造化された HTTP の状態 API を優先してください。

## インタラクティブ SSH シェル

ROOT が必要です。ssh_connect に token を指定すると接続が紐付けられます。リモートホストのフィンガープリントを先に検証してください。このシェルには未知のフィンガープリントを自動承認するスイッチはありません。

| 送信する type | フィールド | 結果 |
| --- | --- | --- |
| ssh_connect | token、host、user。省略可能な port（22）と、接続先のログイン用 password | ssh_status の connecting/connected/error。この機能はパスワード認証を使用 |
| ssh_input | data | テキストを書き込みます。必須の改行を明示的に含める |
| ssh_resize | width、height | 端末の列数／行数を表す整数 1～65535 |
| ssh_signal | signal | サポートされている信号を送信します。サポートされていないリクエストは失敗します |
| ssh_disconnect | なし | この接続のシェルを切断します。最終的な ssh_status を観察する |

出力は ssh_output/data、状態は ssh_status/status/message で返されます。各接続は自分のシェルだけを操作します。操作の失敗や切断後に入力を自動再送しないでください。リモート側ではすでに受信している場合があります。

## HTTP で開始されたストリーミング SSH

ssh.exec_stream は HTTP で開始し、session_id/boot_id/result_key を返します。対話型シェルとは別の機能です。開始直後のイベントを取り逃さないよう、開始前に WebSocket を認証してください。非公開イベントは、開始元のセッションに対して認可された接続だけに配信されます。

| 受信する type | フィールドと解釈 |
| --- | --- |
| ssh_exec_start | session_id、command、照合パターン。開始を示し、完了を示すものではない |
| ssh_exec_output | session_id、output_offset、output_length、is_stderr、data_b64 |
| ssh_exec_match | session_id、expect_matched/fail_matched、オプションの extracted/is_final |
| ssh_exec_running | HTTP ステータス クエリからの進行中の応答 |
| ssh_exec_done | session_id、execution_status、exit_code、status/success、照合結果 |
| ssh_exec_cancelled | session_id, execution_status; キャンセルはリモートプロセス終了を確立しません |
| ssh_exec_error | session_id、error、省略可能な stage/detail |

data_b64 をバイト列へデコードし、output_length を確認します。output_offset で欠落や重複を検出してください。文字がメッセージをまたぐ場合があるため、UTF-8 のデコード状態をフレーム間で維持します。

最終結果には output_bytes/output_incomplete/collection_truncated/conditions_complete が含まれる場合があります。**実行の完了、条件の一致、出力が欠けていないことは別々に確認します。** exit_code=0 でも出力が欠けている場合があります。照合が未完了なら、条件が成立したと判断してはいけません。切断後は操作受付情報を使って ssh.exec_status を照会します。この照会はコマンドを再実行せず、過去の出力をすべて取得できるとも限りません。

## 容量と再接続

このビルドでは、サービス全体で WebSocket クライアントは 8 接続、トピック購読は 32 件までです。大きなフレーム、受信の遅いクライアント、排他的なタスク、シャットダウンによって処理が拒否される場合があります。入力は最大 64 KiB のプロトコル JSON テキストです。フラグメント分割をファイルのアップロード手段として使ってはいけません。JSON の深さ制限も適用されます。

待機時間を設けて再接続し、認証と購読をやり直します。terminal_input、ssh_input、HTTP の制御操作を自動で繰り返してはいけません。古い値を最新の値として表示しないよう、最終更新からの経過時間と、データが古い・切断中という状態を表示してください。

付属の subscribe.js は、機器へアクセスできるブラウザーで動作し、外部ライブラリを必要としません。
