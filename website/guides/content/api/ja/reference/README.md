# API 索引

28 のグループに属する 277 個の登録名を収録しています。276 個は別名を含む実装済みの処理で、1 個は未対応であることを明示するために残された名前です。登録だけでは、必要な機能やリソースが利用可能とは限りません。専用のバイナリ転送ルートと WebSocket は別の章で説明します。

## 例を送信する

目的の API の JSON を request.json として保存し、プレースホルダーを実際の値に置き換え、記載されたパスへ POST してください。公開 API では Authorization ヘッダーを省略できます。

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

空の {} は、操作固有の引数がない呼び出しを示します。書き込みは実際に状態を変更します。必要なバージョン、オブジェクト ID、証明書、リリース資料を先に用意してください。GET は記載された API だけで使用できます。複雑なパラメーターには POST JSON を使います。

## グループ

| グループ | カウント |
| --- | --- |
| [アカウントとセッション](auth.md) | 7 |
| [コントローラーステータス](system.md) | 8 |
| [ファン](fan.md) | 8 |
| [温度](temp.md) | 6 |
| [電源と保護](power.md) | 13 |
| [コンピューターと USB](device.md) | 9 |
| [一般およびモジュール設定](config.md) | 10 |
| [ネットワーク](network.md) | 9 |
| [WiFi管理](wifi.md) | 4 |
| [ネットワーク転送](nat.md) | 4 |
| [アドレス割り当て](dhcp.md) | 4 |
| [時間](time.md) | 5 |
| [デバイスファイル](storage.md) | 9 |
| [コントローラー サービス](service.md) | 5 |
| [コンピューティング監視](monitor.md) | 6 |
| [監視レイアウト](ui.md) | 2 |
| [ログ](log.md) | 5 |
| [SSH フィンガープリント](hosts.md) | 5 |
| [SSH キー](key.md) | 6 |
| [デバイス証明書](cert.md) | 7 |
| [ライトとマトリックス](led.md) | 24 |
| [ピンメンテナンス](gpio.md) | 4 |
| [アプリケーションコンピューターのネットワーク設定](lpmu_access.md) | 3 |
| [SSH 接続とコマンド](ssh.md) | 23 |
| [リモート ファイル](sftp.md) | 6 |
| [自動化と管理対象サービス](automation.md) | 56 |
| [設定パッケージ](config_pack.md) | 8 |
| [アップデートとリカバリ](ota.md) | 21 |

## 全登録名

| 名前 | 目的 | 最小アクセス権 | メソッド | 可用性 |
| --- | --- | --- | --- | --- |
| [auth.admin.reset_password](auth.md#authadminreset_password) | 管理者のデフォルトパスワードを復元します | ROOT | POST | 条件付き。詳細を見る |
| [auth.admin.set_password](auth.md#authadminset_password) | rootは管理者パスワードを設定します | ROOT | POST | 条件付き。詳細を見る |
| [auth.change_password](auth.md#authchange_password) | パスワードを変更する | リクエスト本文の token（認証 API 専用） | POST | 条件付き。詳細を見る |
| [auth.login](auth.md#authlogin) | ユーザーログイン | 公開 | POST | 条件付き。詳細を見る |
| [auth.logout](auth.md#authlogout) | ユーザーのログアウト | リクエスト本文の token（認証 API 専用） | POST | 条件付き。詳細を見る |
| [auth.root.set_password](auth.md#authrootset_password) | root は root パスワードを設定します | ROOT | POST | 条件付き。詳細を見る |
| [auth.status](auth.md#authstatus) | 認証ステータスの確認 | リクエスト本文の token（認証 API 専用） | POST | 条件付き。詳細を見る |
| [automation.action.stats](automation.md#automationactionstats) | アクション実行統計の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [automation.action.stats.reset](automation.md#automationactionstatsreset) | アクション統計のリセット | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.actions.add](automation.md#automationactionsadd) | 新しいアクション テンプレートを作成する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.actions.delete](automation.md#automationactionsdelete) | アクション テンプレートを削除する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.actions.execute](automation.md#automationactionsexecute) | アクションテンプレートを実行する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.actions.export](automation.md#automationactionsexport) | アクション テンプレートを設定パッケージ (.tscfg) としてエクスポート | ROOT | POST | 条件付き。詳細を見る |
| [automation.actions.get](automation.md#automationactionsget) | ID によるアクション テンプレートの取得 | READ | GET/POST | 条件付き。詳細を見る |
| [automation.actions.import](automation.md#automationactionsimport) | 設定パッケージからアクション テンプレートをインポートする | ROOT | POST | 条件付き。詳細を見る |
| [automation.actions.list](automation.md#automationactionslist) | すべてのアクション テンプレートをリストする | READ | GET/POST | 条件付き。詳細を見る |
| [automation.actions.update](automation.md#automationactionsupdate) | 既存のアクション テンプレートを更新する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.config.apply](automation.md#automationconfigapply) | 確認済みの復元または設定元の選択を適用する | ROOT | POST | 条件付き。詳細を見る |
| [automation.config.backup](automation.md#automationconfigbackup) | 完全な緊急設定を保存します | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.config.enable](automation.md#automationconfigenable) | 現在の設定を明示的に有効化または一時停止します | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.config.preview](automation.md#automationconfigpreview) | 設定の復元またはソースの選択をプレビューする | ROOT | POST | 条件付き。詳細を見る |
| [automation.config.refresh](automation.md#automationconfigrefresh) | ユーザーの選択を変更せずに SD カードを 1 回チェックします | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.config.status](automation.md#automationconfigstatus) | 現在の自動化ストレージとバックアップのステータス | READ | GET/POST | 条件付き。詳細を見る |
| [automation.pause](automation.md#automationpause) | 自動化エンジンを一時停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.proxy.fetch](automation.md#automationproxyfetch) | 外部 REST API からのプロキシ取得 | READ | POST | 条件付き。詳細を見る |
| [automation.proxy.socketio_test](automation.md#automationproxysocketio_test) | Socket.IO 接続のテスト (v4 プロトコル) | ROOT | POST | 条件付き。詳細を見る |
| [automation.proxy.websocket_test](automation.md#automationproxywebsocket_test) | WebSocket 接続のテスト | ROOT | POST | 条件付き。詳細を見る |
| [automation.reload](automation.md#automationreload) | 設定の再読み込み | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.resume](automation.md#automationresume) | 自動化エンジンを再開します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.rules.add](automation.md#automationrulesadd) | 新しいルールを追加する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.rules.delete](automation.md#automationrulesdelete) | ルールを削除する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.rules.disable](automation.md#automationrulesdisable) | ルールを無効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.rules.enable](automation.md#automationrulesenable) | ルールを有効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.rules.export](automation.md#automationrulesexport) | ルールを設定パッケージ (.tscfg) としてエクスポート | ROOT | POST | 条件付き。詳細を見る |
| [automation.rules.get](automation.md#automationrulesget) | ID によるルールの詳細の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [automation.rules.import](automation.md#automationrulesimport) | 設定パッケージからルールをインポートします | ROOT | POST | 条件付き。詳細を見る |
| [automation.rules.list](automation.md#automationruleslist) | すべてのルールをリストする | READ | GET/POST | 条件付き。詳細を見る |
| [automation.rules.trigger](automation.md#automationrulestrigger) | ルールを手動でトリガーする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.rules.update](automation.md#automationrulesupdate) | 取得済みの revision を条件にルールを更新する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.services.list](automation.md#automationserviceslist) | 独立して管理するリモートサービスの操作一覧を取得する | READ | GET/POST | 条件付き。詳細を見る |
| [automation.services.status](automation.md#automationservicesstatus) | 管理対象リモートプロセスの状態を確認する | READ | GET/POST | 条件付き。詳細を見る |
| [automation.services.stop](automation.md#automationservicesstop) | 検証済みの管理対象リモート プロセスを停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.add](automation.md#automationsourcesadd) | 新しいデータソースを追加する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.add_mapping](automation.md#automationsourcesadd_mapping) | 既存のデータ ソースにフィールド マッピングを追加する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.delete](automation.md#automationsourcesdelete) | データ ソースの削除 | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.disable](automation.md#automationsourcesdisable) | データ ソースを無効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.enable](automation.md#automationsourcesenable) | データ ソースを有効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.export](automation.md#automationsourcesexport) | データ ソースを設定パッケージ (.tscfg) としてエクスポート | ROOT | POST | 条件付き。詳細を見る |
| [automation.sources.import](automation.md#automationsourcesimport) | 設定パッケージからデータ ソースをインポートする | ROOT | POST | 条件付き。詳細を見る |
| [automation.sources.list](automation.md#automationsourceslist) | すべてのデータ ソースをリストする | READ | GET/POST | 条件付き。詳細を見る |
| [automation.sources.remove_mapping](automation.md#automationsourcesremove_mapping) | データ ソースからフィールド マッピングを削除します | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.sources.update](automation.md#automationsourcesupdate) | 既存のデータ ソースを更新する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.start](automation.md#automationstart) | 自動化エンジンを開始します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.status](automation.md#automationstatus) | 自動化 エンジンのステータスを取得する | READ | GET/POST | 条件付き。詳細を見る |
| [automation.stop](automation.md#automationstop) | 自動化エンジンを停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.test.device](automation.md#automationtestdevice) | デバイス制御アクションのテスト | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.test.gpio](automation.md#automationtestgpio) | GPIO アクションのテスト | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.test.led](automation.md#automationtestled) | LED の動作をテストする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.test.ssh](automation.md#automationtestssh) | SSH コマンドの実行をテストする | ROOT | POST | 条件付き。詳細を見る |
| [automation.variables.delete](automation.md#automationvariablesdelete) | 保存されたユーザー変数を削除します | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [automation.variables.get](automation.md#automationvariablesget) | 変数値の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [automation.variables.list](automation.md#automationvariableslist) | すべての変数をリストする | READ | GET/POST | 条件付き。詳細を見る |
| [automation.variables.set](automation.md#automationvariablesset) | 変数値を設定します | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [cert.delete](cert.md#certdelete) | すべての PKI 認証情報を削除します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [cert.generate_csr](cert.md#certgenerate_csr) | 証明書署名リクエストの生成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [cert.generate_keypair](cert.md#certgenerate_keypair) | ECDSA P-256 鍵ペアの生成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [cert.get_certificate](cert.md#certget_certificate) | デバイス証明書 PEM の取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [cert.install](cert.md#certinstall) | 署名付き証明書のインストール | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [cert.install_ca](cert.md#certinstall_ca) | CA 証明書チェーンをインストールする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [cert.status](cert.md#certstatus) | 証明書と診断サービスのステータスの読み取り | 公開 | GET/POST | 条件付き。詳細を見る |
| [config.delete](config.md#configdelete) | 設定値の削除 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.get](config.md#configget) | 設定値の取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [config.list](config.md#configlist) | 設定キーのリスト | ADMIN | GET/POST | 条件付き。詳細を見る |
| [config.module.list](config.md#configmodulelist) | すべての構成モジュールをリストします | READ | GET/POST | 条件付き。詳細を見る |
| [config.module.reset](config.md#configmodulereset) | モジュール設定のリセット | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.module.save](config.md#configmodulesave) | モジュール設定を NVS に保存 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.module.set](config.md#configmoduleset) | モジュール設定の設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.module.show](config.md#configmoduleshow) | モジュール設定を表示 | READ | GET/POST | 条件付き。詳細を見る |
| [config.pack.apply](config_pack.md#configpackapply) | 未対応の汎用設定適用 | ADMIN | POST/PUT/DELETE | サポートされていません |
| [config.pack.content](config_pack.md#configpackcontent) | インポートされた設定パッケージの内容を復号化して取得します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.pack.export](config_pack.md#configpackexport) | 構成を暗号化された .tscfg としてエクスポート | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.pack.export_cert](config_pack.md#configpackexport_cert) | 暗号化用のデバイス証明書をエクスポートする | READ | GET/POST | 条件付き。詳細を見る |
| [config.pack.import](config_pack.md#configpackimport) | アップロード済みの .tscfg をその場所で検証する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.pack.info](config_pack.md#configpackinfo) | 設定パッケージのシステム情報を取得する | READ | GET/POST | 条件付き。詳細を見る |
| [config.pack.list](config_pack.md#configpacklist) | ディレクトリ内の .tscfg ファイルを一覧表示します | READ | GET/POST | 条件付き。詳細を見る |
| [config.pack.verify](config_pack.md#configpackverify) | .tscfg パッケージの署名を確認する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.save](config.md#configsave) | 設定をストレージに保存する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [config.set](config.md#configset) | 設定値を変更する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [device.fan.set](device.md#devicefanset) | ファンモードとデューティ比を設定します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [device.fan.status](device.md#devicefanstatus) | ファンステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [device.ping](device.md#deviceping) | ネットワーク接続のテスト (TCP ポートのチェック) | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [device.power](device.md#devicepower) | 機器の電源を制御する（on/off/force_off） | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [device.power.status](device.md#devicepowerstatus) | 電力測定値の取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [device.reset](device.md#devicereset) | デバイスをリセットします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [device.status](device.md#devicestatus) | デバイスの電源ステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [device.usb.set](device.md#deviceusbset) | USB MUX ターゲットの設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [device.usb.status](device.md#deviceusbstatus) | USB MUX ステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [dhcp.clients](dhcp.md#dhcpclients) | DHCP クライアントの一覧表示 | READ | GET/POST | 条件付き。詳細を見る |
| [dhcp.start](dhcp.md#dhcpstart) | DHCPサーバーを起動します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [dhcp.status](dhcp.md#dhcpstatus) | DHCP サーバーのステータスを取得する | READ | GET/POST | 条件付き。詳細を見る |
| [dhcp.stop](dhcp.md#dhcpstop) | DHCP サーバーを停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.config](fan.md#fanconfig) | 曲線を含むファン設定を取得 | READ | GET/POST | 条件付き。詳細を見る |
| [fan.curve](fan.md#fancurve) | ファンの温度曲線を設定します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.enable](fan.md#fanenable) | ファンを有効または無効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.limits](fan.md#fanlimits) | デューティ比の上限・下限を設定する（min/max） | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.mode](fan.md#fanmode) | ファン動作モードの設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.save](fan.md#fansave) | ファン設定を NVS に保存 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.set](fan.md#fanset) | ファン速度の設定 (手動モード) | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [fan.status](fan.md#fanstatus) | ファンステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [gpio.info](gpio.md#gpioinfo) | GPIO ピン情報の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [gpio.list](gpio.md#gpiolist) | 制御可能な GPIO ピンをすべてリストします。 | READ | GET/POST | 条件付き。詳細を見る |
| [gpio.set](gpio.md#gpioset) | GPIO レベルの設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [gpio.toggle](gpio.md#gpiotoggle) | GPIO レベルの切り替え | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [hosts.clear](hosts.md#hostsclear) | 既知のホストをすべてクリアします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [hosts.info](hosts.md#hostsinfo) | 既知のホスト情報を取得する | READ | GET/POST | 条件付き。詳細を見る |
| [hosts.list](hosts.md#hostslist) | 既知の SSH ホストをすべてリストします | READ | GET/POST | 条件付き。詳細を見る |
| [hosts.remove](hosts.md#hostsremove) | 既知のホストを削除します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [hosts.update](hosts.md#hostsupdate) | ホストのフィンガープリントを強制的に更新します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [key.delete](key.md#keydelete) | 鍵を削除する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [key.export](key.md#keyexport) | 公開鍵のエクスポート | READ | GET/POST | 条件付き。詳細を見る |
| [key.exportPrivate](key.md#keyexportprivate) | 秘密鍵のエクスポート (エクスポート可能なキーのみ) | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [key.generate](key.md#keygenerate) | 新しい鍵を生成します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [key.info](key.md#keyinfo) | 鍵情報の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [key.list](key.md#keylist) | 保存されているすべての鍵をリストする | READ | GET/POST | 条件付き。詳細を見る |
| [led.boot.config](led.md#ledbootconfig) | LED 起動時設定の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [led.brightness](led.md#ledbrightness) | 機器の明るさを取得・設定する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.clear](led.md#ledclear) | デバイス上のすべての LED をクリアします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.color.hsv](led.md#ledcolorhsv) | HSV を RGB に変換 | READ | GET/POST | 条件付き。詳細を見る |
| [led.color.parse](led.md#ledcolorparse) | カラー文字列を RGB に解析します | READ | GET/POST | 条件付き。詳細を見る |
| [led.color_correction.export](led.md#ledcolor_correctionexport) | 色補正設定を SD カードにエクスポート | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.color_correction.get](led.md#ledcolor_correctionget) | 色補正設定の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [led.color_correction.import](led.md#ledcolor_correctionimport) | SD カードから色補正設定をインポート | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.color_correction.reset](led.md#ledcolor_correctionreset) | 色補正をデフォルトにリセットする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.color_correction.set](led.md#ledcolor_correctionset) | 色補正設定を設定する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.effect.list](led.md#ledeffectlist) | 利用可能なエフェクトのリスト | READ | GET/POST | 条件付き。詳細を見る |
| [led.effect.start](led.md#ledeffectstart) | デバイス上のエフェクトを開始します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.effect.stop](led.md#ledeffectstop) | デバイス上の効果を停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.fill](led.md#ledfill) | すべての LED を色で塗りつぶします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.filter.list](led.md#ledfilterlist) | 利用可能な後処理フィルターをリストします。 | READ | GET/POST | 条件付き。詳細を見る |
| [led.filter.start](led.md#ledfilterstart) | 後処理フィルターを適用する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.filter.stop](led.md#ledfilterstop) | 後処理フィルターを停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.image](led.md#ledimage) | マトリックス上に画像を表示 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.list](led.md#ledlist) | LED デバイスのリスト | 公開 | GET/POST | 条件付き。詳細を見る |
| [led.qrcode](led.md#ledqrcode) | QRコードの生成と表示 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.save](led.md#ledsave) | 現在の状態を起動時設定として保存します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.set](led.md#ledset) | LED ピクセル範囲を設定します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.text](led.md#ledtext) | マトリックス上にテキストを表示 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [led.text.stop](led.md#ledtextstop) | テキストオーバーレイを停止します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [log.capture](log.md#logcapture) | ESP_LOG の収集を有効・無効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [log.clear](log.md#logclear) | ログバッファをクリアします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [log.list](log.md#loglist) | フィルタリングを使用してログ エントリを取得する | ADMIN | GET/POST | 条件付き。詳細を見る |
| [log.setLevel](log.md#logsetlevel) | ログレベルの設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [log.stats](log.md#logstats) | ログ システム統計の取得 | ADMIN | GET/POST | 条件付き。詳細を見る |
| [monitor.config](monitor.md#monitorconfig) | コンピューティング モニター構成の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [monitor.data](monitor.md#monitordata) | 最新の計算リソースのテレメトリ データを取得する | READ | GET/POST | 条件付き。詳細を見る |
| [monitor.set_server](monitor.md#monitorset_server) | コンピューティング監視サーバーの IP とポートを設定します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [monitor.start](monitor.md#monitorstart) | コンピューティング監視の開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [monitor.status](monitor.md#monitorstatus) | コンピューティング監視ステータスの取得 | READ | GET/POST | 条件付き。詳細を見る |
| [monitor.stop](monitor.md#monitorstop) | コンピューティング監視の停止 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [nat.disable](nat.md#natdisable) | NAT ゲートウェイを無効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [nat.enable](nat.md#natenable) | NAT ゲートウェイを有効にする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [nat.save](nat.md#natsave) | NAT 構成を保存する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [nat.status](nat.md#natstatus) | NAT ゲートウェイのステータスを取得する | READ | GET/POST | 条件付き。詳細を見る |
| [network.eth.status](network.md#networkethstatus) | イーサネットステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [network.hostname](network.md#networkhostname) | ホスト名を取得・設定する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [network.lpmu_access.log](lpmu_access.md#networklpmu_accesslog) | アプリケーションコンピューターの上位ネットワーク接続設定の実行ログを取得する | ADMIN | GET/POST | 条件付き。詳細を見る |
| [network.lpmu_access.start](lpmu_access.md#networklpmu_accessstart) | アプリケーションコンピューターの上位ネットワーク接続設定を開始する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [network.lpmu_access.status](lpmu_access.md#networklpmu_accessstatus) | アプリケーションコンピューターの上位ネットワーク接続設定の状態を取得する | ADMIN | GET/POST | 条件付き。詳細を見る |
| [network.status](network.md#networkstatus) | ネットワーク全体のステータスを取得します | 公開 | GET/POST | 条件付き。詳細を見る |
| [network.wifi.ap.config](network.md#networkwifiapconfig) | WiFi AP の構成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [network.wifi.ap.stations](network.md#networkwifiapstations) | AP に接続している端末を取得する | READ | GET/POST | 条件付き。詳細を見る |
| [network.wifi.connect](network.md#networkwificonnect) | WiFi ネットワークに接続する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [network.wifi.disconnect](network.md#networkwifidisconnect) | WiFi から切断 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [network.wifi.mode](network.md#networkwifimode) | WiFi モードを取得・設定する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [network.wifi.scan](network.md#networkwifiscan) | WiFi ネットワークをスキャンします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.abort](ota.md#otaabort) | ファームウェア更新キャンセル要求 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.partitions](ota.md#otapartitions) | 更新パーティションの検査 | READ | GET/POST | 条件付き。詳細を見る |
| [ota.progress](ota.md#otaprogress) | ファームウェア更新の進行状況を読み取ります | READ | GET/POST | 条件付き。詳細を見る |
| [ota.rollback](ota.md#otarollback) | ファームウェアのロールバック | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.server.get](ota.md#otaserverget) | 更新サーバー構成の読み取り | READ | GET/POST | 条件付き。詳細を見る |
| [ota.server.set](ota.md#otaserverset) | アップデートサーバー構成の設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.start_file](ota.md#otastart_file) | SDからファームウェアアップデートを開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.start_url](ota.md#otastart_url) | URLからファームウェアアップデートを開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.status](ota.md#otastatus) | ファームウェアアップデートステータスの読み取り | READ | GET/POST | 条件付き。詳細を見る |
| [ota.test_connection](ota.md#otatest_connection) | 更新 URL を調査する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.upgrade_file](ota.md#otaupgrade_file) | ota.start_file の互換性エイリアス | ADMIN | POST/PUT/DELETE | エイリアス |
| [ota.upgrade_url](ota.md#otaupgrade_url) | ota.start_url の互換性エイリアス | ADMIN | POST/PUT/DELETE | エイリアス |
| [ota.upload_abort](ota.md#otaupload_abort) | ファームウェアのアップロード制御を中止する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.upload_begin](ota.md#otaupload_begin) | ファームウェアアップロード制御の開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.upload_end](ota.md#otaupload_end) | ファームウェアアップロード制御を終了 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.validate](ota.md#otavalidate) | ファームウェアが正常に実行されていることを確認します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.version](ota.md#otaversion) | ファームウェアバージョンの読み取り | 公開 | GET/POST | 条件付き。詳細を見る |
| [ota.www.abort](ota.md#otawwwabort) | WWW 更新キャンセルのリクエスト | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.www.progress](ota.md#otawwwprogress) | WWW 更新の進行状況を読み取る | READ | GET/POST | 条件付き。詳細を見る |
| [ota.www.start](ota.md#otawwwstart) | URLからWWW更新を開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ota.www.start_sdcard](ota.md#otawwwstart_sdcard) | SDからWWW更新を開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.chip](power.md#powerchip) | パワーチップデータの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [power.debug](power.md#powerdebug) | デバッグモードを設定します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.interval.set](power.md#powerintervalset) | サンプリング間隔の設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.monitor.start](power.md#powermonitorstart) | 電力監視の開始 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.monitor.stop](power.md#powermonitorstop) | 電力監視の停止 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.protection.config](power.md#powerprotectionconfig) | 電圧保護構成の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [power.protection.set](power.md#powerprotectionset) | 電圧保護の構成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.protection.status](power.md#powerprotectionstatus) | 電圧保護ステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [power.stats](power.md#powerstats) | 監視統計の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [power.stats.reset](power.md#powerstatsreset) | 監視統計のリセット | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.status](power.md#powerstatus) | 電力監視ステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [power.threshold.set](power.md#powerthresholdset) | 電圧閾値の設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [power.voltage](power.md#powervoltage) | 現在の電圧を読み取る | 公開 | GET/POST | 条件付き。詳細を見る |
| [service.list](service.md#servicelist) | すべてのサービスを一覧表示 | 公開 | GET/POST | 条件付き。詳細を見る |
| [service.restart](service.md#servicerestart) | サービスを再起動する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [service.start](service.md#servicestart) | サービスを開始する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [service.status](service.md#servicestatus) | サービスステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [service.stop](service.md#servicestop) | サービスを停止する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [sftp.get](sftp.md#sftpget) | SFTP経由でファイルをダウンロード | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [sftp.ls](sftp.md#sftpls) | SFTP 経由でリモート ディレクトリを一覧表示する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [sftp.mkdir](sftp.md#sftpmkdir) | SFTP経由でリモートディレクトリを作成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [sftp.put](sftp.md#sftpput) | SFTP経由でファイルをアップロード | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [sftp.rm](sftp.md#sftprm) | SFTP経由でリモートファイルを削除 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [sftp.stat](sftp.md#sftpstat) | SFTP経由でリモートファイル情報を取得 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.cancel](ssh.md#sshcancel) | 実行中の SSH 実行セッションをキャンセルします | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.commands.add](ssh.md#sshcommandsadd) | SSH コマンド設定の追加または更新 | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.commands.export](ssh.md#sshcommandsexport) | SSH コマンド設定を .tscfg としてエクスポート | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.commands.get](ssh.md#sshcommandsget) | ID による SSH コマンド設定の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [ssh.commands.import](ssh.md#sshcommandsimport) | .tscfg から SSH コマンド設定をインポート | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.commands.list](ssh.md#sshcommandslist) | すべての SSH コマンド設定をリストします。 | READ | GET/POST | 条件付き。詳細を見る |
| [ssh.commands.remove](ssh.md#sshcommandsremove) | SSH コマンド設定の削除 | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.commands.update](ssh.md#sshcommandsupdate) | 既存の SSH コマンド設定を更新する | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.copyid](ssh.md#sshcopyid) | 公開鍵をリモートサーバーに展開します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.exec](ssh.md#sshexec) | SSH経由でリモートコマンドを実行 | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.exec_status](ssh.md#sshexec_status) | 自分の現在または最新の SSH 実行結果を取得する | ROOT | GET/POST | 条件付き。詳細を見る |
| [ssh.exec_stream](ssh.md#sshexec_stream) | WebSocket 経由のストリーミング出力によるリモート コマンドの実行 | ROOT | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.hosts.add](ssh.md#sshhostsadd) | SSHホスト設定の追加 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.hosts.export](ssh.md#sshhostsexport) | SSH ホスト設定を .tscfg としてエクスポート | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.hosts.get](ssh.md#sshhostsget) | ID による SSH ホスト設定の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [ssh.hosts.import](ssh.md#sshhostsimport) | .tscfg から SSH ホスト設定をインポート | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.hosts.list](ssh.md#sshhostslist) | すべての SSH ホスト設定をリストします。 | READ | GET/POST | 条件付き。詳細を見る |
| [ssh.hosts.remove](ssh.md#sshhostsremove) | SSH ホスト設定の削除 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.hosts.update](ssh.md#sshhostsupdate) | 既存の SSH ホスト設定を更新する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.keygen](ssh.md#sshkeygen) | SSH 鍵ペアの生成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.revoke](ssh.md#sshrevoke) | デプロイされた公開鍵をリモート サーバーから取り消します (削除します)。 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.services.start](ssh.md#sshservicesstart) | 保存済みの管理対象サービスを開始する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ssh.test](ssh.md#sshtest) | SSH 接続のテスト | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [storage.delete](storage.md#storagedelete) | ファイルまたはディレクトリを削除します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [storage.info](storage.md#storageinfo) | ファイル情報の取得 | READ | GET/POST | 条件付き。詳細を見る |
| [storage.list](storage.md#storagelist) | ディレクトリの内容をリストする | READ | GET/POST | 条件付き。詳細を見る |
| [storage.mkdir](storage.md#storagemkdir) | ディレクトリの作成 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [storage.mount](storage.md#storagemount) | SDカードをマウントする | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [storage.read](storage.md#storageread) | ファイルの内容を読み取ります | READ | GET/POST | 条件付き。詳細を見る |
| [storage.rename](storage.md#storagerename) | ファイルの名前を変更・移動する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [storage.status](storage.md#storagestatus) | ストレージステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [storage.unmount](storage.md#storageunmount) | SD カードのアンマウント | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [system.apis](system.md#systemapis) | 登録されているすべての API をリストします | READ | GET/POST | 条件付き。詳細を見る |
| [system.cpu](system.md#systemcpu) | CPU コア統計の取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [system.info](system.md#systeminfo) | システム情報の取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [system.log.level](system.md#systemloglevel) | ログレベルを取得・設定する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [system.memory](system.md#systemmemory) | メモリ情報の取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [system.memory_detail](system.md#systemmemory_detail) | 詳細なメモリ分析を取得する | ADMIN | GET/POST | 条件付き。詳細を見る |
| [system.reboot](system.md#systemreboot) | システムを再起動します | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [system.tasks](system.md#systemtasks) | タスクリストの取得 | ADMIN | GET/POST | 条件付き。詳細を見る |
| [temp.bind](temp.md#tempbind) | 温度とシステム変数をバインド・解除する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [temp.manual](temp.md#tempmanual) | 手動温度モードを設定・取得する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [temp.read](temp.md#tempread) | 現在の温度を読み取ります | READ | GET/POST | 条件付き。詳細を見る |
| [temp.select](temp.md#tempselect) | 優先する温度取得元を設定・取得する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [temp.sources](temp.md#tempsources) | すべての温度源情報を取得する | READ | GET/POST | 条件付き。詳細を見る |
| [temp.status](temp.md#tempstatus) | 温度システムステータスの取得 | 公開 | GET/POST | 条件付き。詳細を見る |
| [time.force_sync](time.md#timeforce_sync) | NTP 同期を強制する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [time.info](time.md#timeinfo) | 時刻同期情報を取得する | 公開 | GET/POST | 条件付き。詳細を見る |
| [time.set_ntp](time.md#timeset_ntp) | NTPサーバーの設定 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [time.set_timezone](time.md#timeset_timezone) | タイムゾーンを設定する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [time.sync](time.md#timesync) | ブラウザーの時刻で同期する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [ui.widgets.get](ui.md#uiwidgetsget) | データウィジェットの設定を取得する | READ | GET/POST | 条件付き。詳細を見る |
| [ui.widgets.set](ui.md#uiwidgetsset) | データウィジェットの設定を保存する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [wifi.connect](wifi.md#wificonnect) | WiFi ネットワークに接続する | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [wifi.disconnect](wifi.md#wifidisconnect) | WiFi から切断 | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [wifi.scan](wifi.md#wifiscan) | WiFi ネットワークをスキャンします | ADMIN | POST/PUT/DELETE | 条件付き。詳細を見る |
| [wifi.status](wifi.md#wifistatus) | WiFi ステータスを取得する | 公開 | GET/POST | 条件付き。詳細を見る |

## その他の面

[ファイル・イメージ転送](../transfers.md) | [WebSocket](../websocket.md) | [mTLS 診断](../compatibility.md#mtls-diagnostic-service)
