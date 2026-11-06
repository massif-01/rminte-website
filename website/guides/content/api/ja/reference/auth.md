# アカウントとセッション API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [auth.admin.reset_password](#authadminreset_password) | 管理者のデフォルトパスワードを復元します |
| [auth.admin.set_password](#authadminset_password) | rootは管理者パスワードを設定します |
| [auth.change_password](#authchange_password) | パスワードを変更する |
| [auth.login](#authlogin) | ユーザーログイン |
| [auth.logout](#authlogout) | ユーザーのログアウト |
| [auth.root.set_password](#authrootset_password) | root は root パスワードを設定します |
| [auth.status](#authstatus) | 認証ステータスの確認 |

<a id="authadminreset_password"></a>

## auth.admin.reset_password

管理者のデフォルトパスワードを復元します

**メソッド**: POST
**パス**: `/api/v1/auth/admin/reset_password`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `token` | string | 必須 | JSON の有効なログイン トークン。 session_id は代替ではありません。 | 既定値なし |

### リクエストの例

```json
{
  "token": "ROOT_TOKEN"
}
```

### 応答と完了

data.success/username/password_changed を返します。成功後、admin は初期パスワード rm01 でログインします。

### 使用上の注意

rootは管理者パスワードを rm01 に復元します。リセット後はそのデフォルトのパスワードを使用してください。

<a id="authadminset_password"></a>

## auth.admin.set_password

rootは管理者パスワードを設定します

**メソッド**: POST
**パス**: `/api/v1/auth/admin/set_password`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `token` | string | 必須 | JSON の有効なログイン トークン。 session_id は代替ではありません。 | 既定値なし |
| `new_password` | string | 必須 | 新しいパスワード、4 ～ 64 バイト。 | 既定値なし |

### リクエストの例

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### 応答と完了

data.success/sessions_revoked/reauth_required/username/password_changed を返します。対象アカウントのセッションは無効になります。

### 使用上の注意

Authorization で示す利用者と、JSON の token の両方が root の確認を通る必要があります。両方の指定が必要です。

<a id="authchange_password"></a>

## auth.change_password

パスワードを変更する

**メソッド**: POST
**パス**: `/api/v1/auth/change_password`
**最低権限**: リクエスト本文のトークンで認証（認証 API 専用）

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `token` | string | 必須 | JSON の有効なログイン トークン。 session_id は代替ではありません。 | 既定値なし |
| `old_password` | string | 必須 | 現在のパスワード。 | 既定値なし |
| `new_password` | string | 必須 | 新しいパスワード、4 ～ 64 バイト。 | 既定値なし |

### リクエストの例

```json
{
  "token": "YOUR_TOKEN",
  "old_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD"
}
```

### 応答と完了

data.success/sessions_revoked/reauth_required を返します。成功後は再ログインしてください。

### 使用上の注意

アカウント所有者は、いつパスワードを変更するかを選択します。古いセッションは成功後に無効になります。

<a id="authlogin"></a>

## auth.login

ユーザーログイン

**メソッド**: POST
**パス**: `/api/v1/auth/login`
**最低権限**: パブリック

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `username` | string | 必須 | 設定済みの admin または root アカウント。 | 既定値なし |
| `password` | string | 必須 | そのアカウントの現在のパスワード。 | 既定値なし |

### リクエストの例

```json
{
  "username": "admin",
  "password": "rm01"
}
```

### 応答と完了

POST の成功時は code=0 となり、data.token/session_id/username/level/expires_in（秒）/password_changed が返されます。

### 使用上の注意

5 回連続で失敗すると、ログインが 300 秒間ロックされます。ログインでは WebSocket サブスクリプションは確立されません。

<a id="authlogout"></a>

## auth.logout

ユーザーのログアウト

**メソッド**: POST
**パス**: `/api/v1/auth/logout`
**最低権限**: リクエスト本文のトークンで認証（認証 API 専用）

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

専用 POST は {success:true} を返します。クライアントトークンも破棄します。

### 使用上の注意

Authorization で終了するセッションを指定します。JSON は不要です。内部ハンドラーが持つ本文トークン形式は、この専用 HTTP POST の呼び出し形式とは異なります。

<a id="authrootset_password"></a>

## auth.root.set_password

root は root パスワードを設定します

**メソッド**: POST
**パス**: `/api/v1/auth/root/set_password`
**最低権限**: ROOT

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `token` | string | 必須 | JSON の有効なログイン トークン。 session_id は代替ではありません。 | 既定値なし |
| `new_password` | string | 必須 | 新しいパスワード、4 ～ 64 バイト。 | 既定値なし |

### リクエストの例

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### 応答と完了

data.success/sessions_revoked/reauth_required/username/password_changed を返します。対象アカウントのセッションは無効になります。

### 使用上の注意

Authorization で示す利用者と、JSON の token の両方が root の確認を通る必要があります。両方の指定が必要です。

<a id="authstatus"></a>

## auth.status

認証ステータスの確認

**メソッド**: POST
**パス**: `/api/v1/auth/status`
**最低権限**: リクエスト本文のトークンで認証（認証 API 専用）

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `token` | string | 必須 | JSON の有効なログイン トークン。 session_id は代替ではありません。 | 既定値なし |

### リクエストの例

```json
{
  "token": "YOUR_TOKEN"
}
```

### 応答と完了

data.valid が有効性を示します。有効なセッションでは username/level/expires_in/password_changed も含まれます。code=0 でも valid=false の場合があります。
