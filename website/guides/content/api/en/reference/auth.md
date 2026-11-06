# Accounts and sessions APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [auth.admin.reset_password](#authadminreset_password) | Restore the admin default password |
| [auth.admin.set_password](#authadminset_password) | Root sets admin password |
| [auth.change_password](#authchange_password) | Change password |
| [auth.login](#authlogin) | User login |
| [auth.logout](#authlogout) | User logout |
| [auth.root.set_password](#authrootset_password) | Root sets root password |
| [auth.status](#authstatus) | Check auth status |

<a id="authadminreset_password"></a>

## auth.admin.reset_password

Restore the admin default password

**Methods**: POST
**Path**: `/api/v1/auth/admin/reset_password`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `token` | string | Required | Valid login token in JSON; session_id is not a substitute. | No default |

### Request example

```json
{
  "token": "ROOT_TOKEN"
}
```

### Response and completion

data.success/username/password_changed. After success, admin logs in with default password rm01.

### Usage notes

Root restores the admin password to rm01. Use that default password after reset.

<a id="authadminset_password"></a>

## auth.admin.set_password

Root sets admin password

**Methods**: POST
**Path**: `/api/v1/auth/admin/set_password`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `token` | string | Required | Valid login token in JSON; session_id is not a substitute. | No default |
| `new_password` | string | Required | New password, 4-64 bytes. | No default |

### Request example

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### Response and completion

data.success/sessions_revoked/reauth_required/username/password_changed. Affected-account sessions are revoked.

### Usage notes

Both the Authorization identity and the JSON token must pass root checks; both fields have a purpose.

<a id="authchange_password"></a>

## auth.change_password

Change password

**Methods**: POST
**Path**: `/api/v1/auth/change_password`
**Minimum access**: Body token (authentication-specific)

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `token` | string | Required | Valid login token in JSON; session_id is not a substitute. | No default |
| `old_password` | string | Required | Current password. | No default |
| `new_password` | string | Required | New password, 4-64 bytes. | No default |

### Request example

```json
{
  "token": "YOUR_TOKEN",
  "old_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD"
}
```

### Response and completion

data.success/sessions_revoked/reauth_required. Log in again after success.

### Usage notes

The account holder chooses when to change the password. The old session is invalidated after success.

<a id="authlogin"></a>

## auth.login

User login

**Methods**: POST
**Path**: `/api/v1/auth/login`
**Minimum access**: Public

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `username` | string | Required | Configured admin or root account. | No default |
| `password` | string | Required | Current password for that account. | No default |

### Request example

```json
{
  "username": "admin",
  "password": "rm01"
}
```

### Response and completion

POST success has code=0 and data.token/session_id/username/level/expires_in(seconds)/password_changed.

### Usage notes

Five consecutive failures lock login for 300 seconds. Login does not establish WebSocket subscriptions.

<a id="authlogout"></a>

## auth.logout

User logout

**Methods**: POST
**Path**: `/api/v1/auth/logout`
**Minimum access**: Body token (authentication-specific)

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

Dedicated POST returns {success:true}. Also discard the client token.

### Usage notes

Authorization identifies the session to close; no JSON is needed. The internal handler's body-token form is not the dedicated HTTP POST contract.

<a id="authrootset_password"></a>

## auth.root.set_password

Root sets root password

**Methods**: POST
**Path**: `/api/v1/auth/root/set_password`
**Minimum access**: ROOT

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `token` | string | Required | Valid login token in JSON; session_id is not a substitute. | No default |
| `new_password` | string | Required | New password, 4-64 bytes. | No default |

### Request example

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### Response and completion

data.success/sessions_revoked/reauth_required/username/password_changed. Affected-account sessions are revoked.

### Usage notes

Both the Authorization identity and the JSON token must pass root checks; both fields have a purpose.

<a id="authstatus"></a>

## auth.status

Check auth status

**Methods**: POST
**Path**: `/api/v1/auth/status`
**Minimum access**: Body token (authentication-specific)

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `token` | string | Required | Valid login token in JSON; session_id is not a substitute. | No default |

### Request example

```json
{
  "token": "YOUR_TOKEN"
}
```

### Response and completion

data.valid reports validity; valid sessions include username/level/expires_in/password_changed. valid=false can coexist with code=0.
