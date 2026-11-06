# 機器の証明書 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [cert.delete](#certdelete) | すべての PKI 認証情報を削除します |
| [cert.generate_csr](#certgenerate_csr) | 証明書署名リクエストの生成 |
| [cert.generate_keypair](#certgenerate_keypair) | ECDSA P-256 鍵ペアの生成 |
| [cert.get_certificate](#certget_certificate) | デバイス証明書 PEM の取得 |
| [cert.install](#certinstall) | 署名付き証明書のインストール |
| [cert.install_ca](#certinstall_ca) | CA 証明書チェーンをインストールする |
| [cert.status](#certstatus) | 証明書と診断サービスのステータスの読み取り |

<a id="certdelete"></a>

## cert.delete

すべての PKI 認証情報を削除します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/cert/delete`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `confirm` | boolean | 必須 | 明示的な true は、ローカル PKI マテリアルの削除を確認します。 | 既定値なし |

### リクエストの例

```json
{
  "confirm": true
}
```

### 応答と完了

data.success/message.

### 使用上の注意

独立した HTTPS 診断サービスの識別用証明書を変更したり、初期証明書の状態に戻したりできます。発行元で証明書を失効させるものではありません。

<a id="certgenerate_csr"></a>

## cert.generate_csr

証明書署名リクエストの生成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/cert/generate_csr`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device_id` | string | 任意 | 証明書サブジェクトのデバイス識別子。 | ビルド構成されたデバイス ID |
| `organization` | string | 任意 | 組織名。 | RMinte |
| `org_unit` | string | 任意 | 組織単位。 | Device |

### リクエストの例

```json
{
  "device_id": "YOUR_DEVICE_ID",
  "organization": "YOUR_ORG",
  "org_unit": "Device"
}
```

### 応答と完了

data.success/csr_pem を返します。CSR は信頼できる発行元へ渡してください。秘密鍵は含まれません。

<a id="certgenerate_keypair"></a>

## cert.generate_keypair

ECDSA P-256 鍵ペアの生成

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/cert/generate_keypair`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `force` | boolean | 任意 | アイデンティティ マテリアルがすでに存在する場合、再生成を要求します。 | false |

### リクエストの例

```json
{}
```

### 応答と完了

data.success/message.

### 使用上の注意

識別用の鍵を置き換えると、既存の証明書と一致しなくなる場合があります。先に保守を計画してください。key.* が扱う SSH 鍵とは別の鍵です。

<a id="certget_certificate"></a>

## cert.get_certificate

デバイス証明書 PEM の取得

**メソッド**: GET / POST
**パス**: `/api/v1/cert/get_certificate`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.cert_pem は、秘密鍵を含まないデバイス証明書 PEM です。

<a id="certinstall"></a>

## cert.install

署名付き証明書のインストール

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/cert/install`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `cert_pem` | string | 必須 | PEM 証明書、最大 3999 コンテンツ バイト。既存のデバイス秘密鍵と一致する必要があります。 | 既定値なし |

### リクエストの例

```json
{
  "cert_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### 応答と完了

data.success/message/cert_info (subject_cn/issuer_cn/not_before/not_after/validity/time_ready および有効期限情報付き)。

### 使用上の注意

証明書の保存、有効性、独立した HTTPS 診断サービスによる読み込みをそれぞれ確認します。管理 API は HTTP のポート 80 のままです。インストール後は cert.status を読み取ってください。

<a id="certinstall_ca"></a>

## cert.install_ca

CA 証明書チェーンをインストールする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/cert/install_ca`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `ca_pem` | string | 必須 | 信頼できる CA チェーン PEM。解析と容量チェックが適用されます。 | 既定値なし |

### リクエストの例

```json
{
  "ca_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### 応答と完了

data.success/message.

### 使用上の注意

CA マテリアルは信頼に影響します。管理者が検証したチェーンのみをインストールしてください。

<a id="certstatus"></a>

## cert.status

証明書と診断サービスのステータスの読み取り

**メソッド**: GET / POST
**パス**: `/api/v1/cert/status`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#certificate) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

data.has_private_key/has_certificate/has_ca_chain を返します。証明書情報、time_ready/validity/blocked_by、独立した HTTPS 診断サービスの実行状態はそれぞれ別に報告されます。証明書の応答モデルを参照してください。
