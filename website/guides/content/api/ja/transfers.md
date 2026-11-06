# ファイルとイメージの転送

通常ファイルと APP/WWW イメージの転送には、専用のバイナリルートを使います。本文には元のファイルのバイト列を送信し、成功時の応答にも code が含まれるとは限りません。これらのルートは 277 個の論理 API 名とは別です。

## 通常のファイル

| ルート | メソッド／権限 | リクエストと結果 |
| --- | --- | --- |
| /api/v1/file/download | GET、READ。機密パスには ADMIN が必要 | クエリ内の絶対パス。応答はディレクトリではなくファイルバイトです |
| /api/v1/file/upload | POST、ADMIN | クエリ内の宛先パス、本文内の元のバイト。成功すると path/size/status=uploaded が返されます |

HTTP アップロードは、検証済みの通常ファイルを `/sdcard/` 以下へ送信する場合に限られます。storage.rename/delete などのファイル操作とはパスの範囲が異なり、HTTP で `/spiffs/` や `/www/` へアップロードすることはできません。機密設定や秘密鍵の読み取りには ADMIN が必要です。自動化が管理するディレクトリ、別名、バックアップ、一時ファイルは保護されているため、オブジェクトの設定 API で編集してください。

アップロードは最大 16 MiB、受信時間は最大 300 秒です。メモリ、空き容量、ストレージの状態によっても制限されます。空でない完全なファイルを一度で送信してください。リクエストを繰り返しても分割データの追記にはなりません。既存の送信先ファイルを置き換えるため、必要な内容を事前に保存してください。パスの URL エンコードは一度だけ行います。

実行する前に TS_BASE と TS_TOKEN を構成します。

```sh
curl --connect-timeout 5 --max-time 330 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @example.txt \
  "$TS_BASE/api/v1/file/upload?path=/sdcard/example.txt"

curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  --get --data-urlencode 'path=/sdcard/example.txt' \
  "$TS_BASE/api/v1/file/download" -o downloaded-example.txt
```

.tscfg のアップロードでは、config_pack.valid/reason/signature が追加で返されます。uploaded は保存されたことを示し、信頼確認や適用の成功を示すものではありません。対象オブジェクト専用のインポートでプレビューと適用を行ってください。config.pack.apply は汎用設定を適用しません。通常のデータパッケージと、コマンドを含むルールパッケージでは署名用途の検査が異なります。通常の検証だけでルールのインポート検証を代用してはいけません。

file_replace_uncertain が返された場合や接続が切れた場合は、再試行する前にファイル情報を確認し、内容をダウンロードして調べてください。

## 更新イメージの準備

ハードウェア、パーティション構成、ファームウェアのバージョンに対応する、完全な APP イメージと www.bin を入手します。WWW イメージは個別の HTML ファイルではありません。設定をバックアップし、安定した電源と保守時間を確保し、復旧手段を用意してください。

ダウンロードには HTTP と HTTPS を使えます。HTTPS は既定でシステムの証明書信頼設定を使用します。skip_verify はダウンロード時のオプションですが、破損したイメージ、非互換のイメージ、容量不足を修復するものではありません。通常は false のままにしてください。現在の開始 API は、独自 CA の cert_pem パラメーターを受け付けません。

## 転送方法を選択してください

| メソッド | API | 要件 |
| --- | --- | --- |
| 機器がダウンロード | ota.start_url / ota.www.start | 機器からイメージ配信サーバーに到達できること。ネットワークとストレージを確認 |
| SD 上のファイル | ota.start_file / ota.www.start_sdcard | 完全なイメージ ファイルを含むマウントされた SD |
| クライアントからアップロード | 以下の専用バイナリ ルート | クライアントには完全なファイルがあります。デバイスにはステージングおよびリカバリ キャッシュ用の書き込み可能な SD が搭載されています |

| ルート | メソッド／権限 | オプションと成功 |
| --- | --- | --- |
| /api/v1/ota/firmware | POST、ADMIN | 本文は完全な APP イメージ。クエリの auto_reboot の既定値は true。成功時は status=success、size、message、reboot_pending、auto_reboot_requested |
| /api/v1/ota/www | POST、ADMIN | 本文は完全な www.bin。成功時は status=success、size、message。自動再起動なし |

どちらも最大 16 MiB、受信時間は最大 300 秒で、対象パーティションの容量とメモリによっても制限されます。ファームウェアのヘッダーとインストールの完全性が検査されます。アップロードに成功すると、SD の復旧用ファイルと、自動復旧を無効にした manifest が保存されます。再起動後にアプリケーションが正常に動くかどうかは、別に確認する必要があります。

この例では、自動再起動を無効にして、メンテナンス プロセスが最初に結果を検査できるようにします。

```sh
curl --connect-timeout 5 --max-time 600 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @firmware.bin \
  "$TS_BASE/api/v1/ota/firmware?auto_reboot=false"
```

firmware.bin はクライアント側のファイル名です。完全なファームウェアイメージのファイル名に置き換えてください。このリクエストは機器へ書き込みます。auto_reboot=true の場合、成功応答から約 2 秒後に再起動が要求され、接続が切れることがあります。

## 進行状況と完了を確認する

URL または SD から更新を開始した後は ota.progress、WWW の場合は ota.www.progress を読み取ります。進捗は機器全体で共有され、ログインごとの個別の操作受付情報はありません。同時開始や別の更新のキャンセルを避けるため、一つの保守プロセスで更新を調整してください。

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/ota/progress"
```

APP の進捗には state/percent/received_size/total_size/message があります。WWW は received/total を使い、running も返します。pending_reboot は再起動が必要、error は失敗を意味します。100% だけでは新しいバージョンが動作中とは判断できません。キャンセルするには ota.abort または ota.www.abort へ空のオブジェクトを POST し、状態を確認してから次の更新を開始してください。

バイナリアップロードでは、機器全体の進捗がこのリクエストに対応すると決めつけず、HTTP 応答を確認します。HTTP409 と status=partial、error=recovery_cache_failed、flash_written=true は、フラッシュへの書き込みは済んだものの、SD の復旧キャッシュは完全に保存されていないことを示します。パーティションと復旧用ファイルを確認してください。応答を受け取れなかった場合も、書き込みが行われていないとは限りません。

ファームウェアのインストール後は、計画に従って再起動し、再ログインして ota.status/partitions とアプリケーションの稼働状態を確認します。ota.validate は現在のファームウェアを確定する操作です。稼働確認を済ませてから呼び出してください。

## ロールバックと SD リカバリ

ota.rollback の前に ota.partitions.can_rollback を確認します。ロールバックで直ちに再起動する場合があります。再接続し、バージョン、設定の互換性、アプリケーションの状態を確認してください。

SD 復旧には `/sdcard/recovery/` 以下の TianShanOS.bin、www.bin、manifest.json を使います。armed は復旧の有効・無効、force はバージョン比較を制御します。ファイルが存在するだけでは、復旧が有効になっているとは限りません。次回の起動と永続ストレージに影響するため、発行元の復旧手順に従ってください。ファイルのアップロードだけで復旧成功とは判断できません。

復旧の準備・状態確認・認可を行う API は公開されていません。存在しないルートを作ったり、ota.upload_begin/end/abort を完全な分割転送プロトコルとして扱ったりしてはいけません。通常の連携では、上記のバイナリルートを使用してください。
