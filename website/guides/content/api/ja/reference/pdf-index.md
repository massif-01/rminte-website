# API索引

登録されている277件のAPI名をすべて掲載しています。名前を選ぶと、該当する項目に移動します。各項目には、使用できるメソッド、必要な最低権限、パラメーター、処理結果の確認方法を記載しています。

リファレンスのリクエスト例は、POSTでJSONを送信する形式です。例をrequest.jsonとして保存し、プレースホルダーを実際の値に置き換えて、記載されているパスに送信してください。認証不要のAPIではAuthorizationを省略できます。

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

書き込み操作は実際に機器や設定に影響します。必要なバージョン、オブジェクトID、証明書、リリース用ファイルなどを事前に用意してください。GETは明示的に許可されているAPIでのみ使用し、複雑なパラメーターはPOSTでJSONとして送信してください。

## 名前順で探す

権限の表示は、各APIの呼び出しに必要な最低権限です。リソース、セッション、機能の利用条件も満たす必要があります。登録が残っていてもサポートされていないAPIは、各項目で明記しています。
