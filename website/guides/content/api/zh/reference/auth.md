# 账户和会话接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [auth.admin.reset_password](#authadminreset_password) | 恢复 admin 默认密码 |
| [auth.admin.set_password](#authadminset_password) | 由 root 设置 admin 密码 |
| [auth.change_password](#authchange_password) | 更改本账户密码 |
| [auth.login](#authlogin) | 登录并取得会话 |
| [auth.logout](#authlogout) | 退出当前会话 |
| [auth.root.set_password](#authrootset_password) | 由 root 设置 root 密码 |
| [auth.status](#authstatus) | 检查一个 Token |

<a id="authadminreset_password"></a>

## auth.admin.reset_password

恢复 admin 默认密码

**方法**：POST
**路径**：`/api/v1/auth/admin/reset_password`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `token` | string | 必填 | 有效登录 Token，放在 JSON 中；不能用 session_id 替代。 | 无默认值 |

### 请求示例

```json
{
  "token": "ROOT_TOKEN"
}
```

### 返回与完成条件

data.success/username/password_changed；重置成功后 admin 使用默认密码 rm01 登录。

### 使用要点

root 可将 admin 密码恢复为 rm01；重置后使用该默认密码登录。

<a id="authadminset_password"></a>

## auth.admin.set_password

由 root 设置 admin 密码

**方法**：POST
**路径**：`/api/v1/auth/admin/set_password`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `token` | string | 必填 | 有效登录 Token，放在 JSON 中；不能用 session_id 替代。 | 无默认值 |
| `new_password` | string | 必填 | 新密码，4–64 字节。 | 无默认值 |

### 请求示例

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### 返回与完成条件

data 含 success、sessions_revoked、reauth_required、username、password_changed。受影响账户会话被撤销。

### 使用要点

Authorization 要求 root，JSON token 也必须通过 root 校验；两处各有用途。

<a id="authchange_password"></a>

## auth.change_password

更改本账户密码

**方法**：POST
**路径**：`/api/v1/auth/change_password`
**最低权限**：参数 Token（认证专用）

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `token` | string | 必填 | 有效登录 Token，放在 JSON 中；不能用 session_id 替代。 | 无默认值 |
| `old_password` | string | 必填 | 当前密码。 | 无默认值 |
| `new_password` | string | 必填 | 新密码，4–64 字节。 | 无默认值 |

### 请求示例

```json
{
  "token": "YOUR_TOKEN",
  "old_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD"
}
```

### 返回与完成条件

data.success、sessions_revoked、reauth_required；成功后重新登录。

### 使用要点

由账户使用者主动更改密码；成功后原会话失效。

<a id="authlogin"></a>

## auth.login

登录并取得会话

**方法**：POST
**路径**：`/api/v1/auth/login`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `username` | string | 必填 | 已配置账户 admin 或 root。 | 无默认值 |
| `password` | string | 必填 | 该账户当前密码。 | 无默认值 |

### 请求示例

```json
{
  "username": "admin",
  "password": "rm01"
}
```

### 返回与完成条件

POST 成功为 code=0，data 含 token、session_id、username、level、expires_in（秒）、password_changed。

### 使用要点

连续失败5次会锁定300秒；登录不建立 WebSocket 订阅。

<a id="authlogout"></a>

## auth.logout

退出当前会话

**方法**：POST
**路径**：`/api/v1/auth/logout`
**最低权限**：参数 Token（认证专用）

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

POST 专用入口返回 {success:true}。客户端同时丢弃自己的 Token。

### 使用要点

通过 Authorization 请求头标识退出会话；无需 JSON。内部同名处理函数的参数 token 形式不作为 HTTP POST 示例。

<a id="authrootset_password"></a>

## auth.root.set_password

由 root 设置 root 密码

**方法**：POST
**路径**：`/api/v1/auth/root/set_password`
**最低权限**：ROOT

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `token` | string | 必填 | 有效登录 Token，放在 JSON 中；不能用 session_id 替代。 | 无默认值 |
| `new_password` | string | 必填 | 新密码，4–64 字节。 | 无默认值 |

### 请求示例

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### 返回与完成条件

data 含 success、sessions_revoked、reauth_required、username、password_changed。受影响账户会话被撤销。

### 使用要点

Authorization 要求 root，JSON token 也必须通过 root 校验；两处各有用途。

<a id="authstatus"></a>

## auth.status

检查一个 Token

**方法**：POST
**路径**：`/api/v1/auth/status`
**最低权限**：参数 Token（认证专用）

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `token` | string | 必填 | 有效登录 Token，放在 JSON 中；不能用 session_id 替代。 | 无默认值 |

### 请求示例

```json
{
  "token": "YOUR_TOKEN"
}
```

### 返回与完成条件

data.valid 为有效性；有效时含 username、level、expires_in 和 password_changed；valid=false 可以与 code=0 同时出现。
