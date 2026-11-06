# API: Cuentas y sesiones

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [auth.admin.reset_password](#authadminreset_password) | Restablecer la contraseña predeterminada de admin |
| [auth.admin.set_password](#authadminset_password) | Establecer la contraseña de admin como root |
| [auth.change_password](#authchange_password) | Cambiar la contraseña |
| [auth.login](#authlogin) | Iniciar sesión |
| [auth.logout](#authlogout) | Cerrar sesión |
| [auth.root.set_password](#authrootset_password) | Establecer la contraseña de root como root |
| [auth.status](#authstatus) | Comprobar el estado de autenticación |

<a id="authadminreset_password"></a>

## auth.admin.reset_password

Restablecer la contraseña predeterminada de admin

**Métodos**: POST
**Ruta**: `/api/v1/auth/admin/reset_password`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatorio | Token de inicio de sesión válido en el JSON; session_id no lo sustituye. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "token": "ROOT_TOKEN"
}
```

### Respuesta y conclusión

data.success/username/password_changed. Tras el éxito, admin inicia sesión con la contraseña predeterminada rm01.

### Notas de uso

Root restablece la contraseña de admin a rm01. Usa esa contraseña predeterminada después del restablecimiento.

<a id="authadminset_password"></a>

## auth.admin.set_password

Establecer la contraseña de admin como root

**Métodos**: POST
**Ruta**: `/api/v1/auth/admin/set_password`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatorio | Token de inicio de sesión válido en el JSON; session_id no lo sustituye. | Sin valor predeterminado |
| `new_password` | string | Obligatorio | Nueva contraseña, 4-64 bytes. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### Respuesta y conclusión

data.success/sessions_revoked/reauth_required/username/password_changed. Se revocan las sesiones de la cuenta afectada.

### Notas de uso

Tanto la identidad de Authorization como el token JSON deben superar las comprobaciones de root; ambos campos cumplen una función.

<a id="authchange_password"></a>

## auth.change_password

Cambiar la contraseña

**Métodos**: POST
**Ruta**: `/api/v1/auth/change_password`
**Acceso mínimo**: token en el cuerpo de la solicitud (API de autenticación)

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatorio | Token de inicio de sesión válido en el JSON; session_id no lo sustituye. | Sin valor predeterminado |
| `old_password` | string | Obligatorio | Contraseña actual. | Sin valor predeterminado |
| `new_password` | string | Obligatorio | Nueva contraseña, 4-64 bytes. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "token": "YOUR_TOKEN",
  "old_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD"
}
```

### Respuesta y conclusión

data.success/sessions_revoked/reauth_required. Vuelve a iniciar sesión tras el éxito.

### Notas de uso

El titular de la cuenta decide cuándo cambiar la contraseña. La sesión anterior queda invalidada tras el cambio correcto.

<a id="authlogin"></a>

## auth.login

Iniciar sesión

**Métodos**: POST
**Ruta**: `/api/v1/auth/login`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `username` | string | Obligatorio | Cuenta admin o root configurada. | Sin valor predeterminado |
| `password` | string | Obligatorio | Contraseña actual para esa cuenta. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "username": "admin",
  "password": "rm01"
}
```

### Respuesta y conclusión

Un POST correcto devuelve code=0 y data.token/session_id/username/level/expires_in (segundos)/password_changed.

### Notas de uso

Cinco fallos consecutivos bloquean el inicio de sesión durante 300 segundos. El inicio de sesión no establece suscripciones a WebSocket.

<a id="authlogout"></a>

## auth.logout

Cerrar sesión

**Métodos**: POST
**Ruta**: `/api/v1/auth/logout`
**Acceso mínimo**: token en el cuerpo de la solicitud (API de autenticación)

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

El POST específico devuelve {success:true}. Descarta también el token en el cliente.

### Notas de uso

Authorization identifica la sesión que se cerrará; no hace falta un cuerpo JSON. La forma con token en el cuerpo del manejador interno no es el formato del POST HTTP específico.

<a id="authrootset_password"></a>

## auth.root.set_password

Establecer la contraseña de root como root

**Métodos**: POST
**Ruta**: `/api/v1/auth/root/set_password`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatorio | Token de inicio de sesión válido en el JSON; session_id no lo sustituye. | Sin valor predeterminado |
| `new_password` | string | Obligatorio | Nueva contraseña, 4-64 bytes. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### Respuesta y conclusión

data.success/sessions_revoked/reauth_required/username/password_changed. Se revocan las sesiones de la cuenta afectada.

### Notas de uso

Tanto la identidad de Authorization como el token JSON deben superar las comprobaciones de root; ambos campos cumplen una función.

<a id="authstatus"></a>

## auth.status

Comprobar el estado de autenticación

**Métodos**: POST
**Ruta**: `/api/v1/auth/status`
**Acceso mínimo**: token en el cuerpo de la solicitud (API de autenticación)

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatorio | Token de inicio de sesión válido en el JSON; session_id no lo sustituye. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "token": "YOUR_TOKEN"
}
```

### Respuesta y conclusión

data.valid indica la validez; las sesiones válidas incluyen username/level/expires_in/password_changed. valid=false puede coexistir con code=0.
