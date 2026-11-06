# クイックスタート

機器に接続してログインし、認証が必要な測定値を読み取ります。ログインセッションの開始と終了を除き、この手順では状態の読み取りだけを行います。

## 機器のアドレスを設定する

機器の現在の IP アドレスを使用します。WebUI と管理 API は既定で HTTP ポート 80 を使用するため、通常はポート番号の指定は不要です。API のプレフィックスは `/api/v1` です。例のアドレスを使用する機器のアドレスに置き換えてください。

```sh
export TS_BASE='http://10.10.99.97'
```

接続の問題については、IP アドレス、ネットワーク、およびサービスの状態を確認してください。 [トラブルシューティング](troubleshooting.md#cannot-connect)を参照してください。

## コントローラー情報の読み取り

```sh
curl --connect-timeout 5 --max-time 15 \
  "$TS_BASE/api/v1/system/info"
```

応答の抜粋:

```json
{"code":0,"data":{"app":{"name":"TianShanOS","version":"0.6.4","compile_date":"Nov 5 2026","compile_time":"10:00:00"},"chip":{"model":"ESP32-S3","cores":2},"uptime_ms":123456}}
```

HTTP ステータスを確認してから、code の値を確認します。バージョンは data.app.version、稼働時間は uptime_ms にあり、単位はミリ秒です。最上位に data.version があるとは限りません。

## ログインしてセッションを保持する

デフォルトのアカウントは `admin` および `root` で、どちらも初期パスワードは `rm01` です。ログインして、そのアカウントに許可されている API を使用します。パスワードを変更した場合は、現在のパスワードを使用してください。

login.json を作成する前に `umask 077` を実行して、ファイルへのアクセスを制限します。この例では初期設定の admin アカウントを使用します。

```json
{"username":"admin","password":"rm01"}
```

```sh
umask 077
curl --connect-timeout 5 --max-time 15 \
  -H 'Content-Type: application/json' --data-binary @login.json \
  "$TS_BASE/api/v1/auth/login" > login-response.json
export TS_TOKEN="$(python3 -c 'import json; r=json.load(open("login-response.json")); assert r["code"] == 0; print(r["data"]["token"])')"
```

成功時の data には token、session_id、username、level、expires_in（秒）、password_changed が含まれます。認証には token を使用します。session_id は識別子であり、認証情報の代わりにはなりません。

以降の呼び出しには返されたトークンを使用します。アクセスできる範囲は data.level と各 API の権限設定によって決まります。パスワードを変更する場合は、アカウント管理用の auth.change_password を使用します。

パスワードファイル、ログイン応答、トークンは認証情報として扱います。使用後は一時的な認証情報ファイルを削除してください。

## 認証して温度を読み取る

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
```

例示的な抜粋:

```json
{"code":0,"data":{"temperature_c":42.5,"temperature_01c":425,"source":"variable","timestamp_ms":120000,"valid":true}}
```

temperature_c は摂氏温度、temperature_01c は 0.1 度単位の値です。valid:true の場合に限って、有効な測定値として扱ってください。監視システムでは、欠測や無効な値を 0 度に置き換えてはいけません。

## ログアウト

```sh
curl --connect-timeout 5 --max-time 15 \
  -X POST -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/auth/logout"
unset TS_TOKEN
```

POST によるログアウトでは、通常の code/data 形式ではなく `{"success":true}` が返されます。そのセッションを使用していたスクリプトや接続には、再び有効なセッションが必要になります。

次に[目的別の操作例](scenarios.md)へ進むか、編集可能な資料に付属する読み取り専用の Python サンプルを使用します。
