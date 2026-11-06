# API: Archivos remotos

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [sftp.get](#sftpget) | Descargar un archivo mediante SFTP |
| [sftp.ls](#sftpls) | Enumerar un directorio remoto mediante SFTP |
| [sftp.mkdir](#sftpmkdir) | Crear un directorio remoto mediante SFTP |
| [sftp.put](#sftpput) | Cargar un archivo mediante SFTP |
| [sftp.rm](#sftprm) | Eliminar un archivo remoto mediante SFTP |
| [sftp.stat](#sftpstat) | Consultar información de un archivo remoto mediante SFTP |

<a id="sftpget"></a>

## sftp.get

Descargar un archivo mediante SFTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/sftp/get`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `remote` | string | Obligatorio | Ruta de archivo remota absoluta. | Sin valor predeterminado |
| `local` | string | Obligatorio | Ruta absoluta del archivo del dispositivo local. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### Respuesta y conclusión

data.remote/local/success; escribe un archivo de dispositivo local.

### Notas de uso

Requiere confianza y autenticación del host remoto verificadas. Un fallo no acepta automáticamente huellas. get tiene restricciones de escritura local; put envía contenido local al host remoto.

<a id="sftpls"></a>

## sftp.ls

Enumerar un directorio remoto mediante SFTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/sftp/ls`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `path` | string | Obligatorio | Ruta del directorio o archivo remoto. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Respuesta y conclusión

data.path/files; las entradas contienen name/size/is_dir/mtime/permissions.

### Notas de uso

Requiere confianza y autenticación del host remoto verificadas. Un fallo no acepta automáticamente huellas. get tiene restricciones de escritura local; put envía contenido local al host remoto.

<a id="sftpmkdir"></a>

## sftp.mkdir

Crear un directorio remoto mediante SFTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/sftp/mkdir`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `path` | string | Obligatorio | Ruta del directorio o archivo remoto. | Sin valor predeterminado |
| `mode` | integer | Opcional | Bits de permisos como entero JSON decimal; el octal 0755 equivale al decimal 493. | 493 |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Respuesta y conclusión

data.path/created.

### Notas de uso

Requiere confianza y autenticación del host remoto verificadas. Un fallo no acepta automáticamente huellas. get tiene restricciones de escritura local; put envía contenido local al host remoto.

<a id="sftpput"></a>

## sftp.put

Cargar un archivo mediante SFTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/sftp/put`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `remote` | string | Obligatorio | Ruta de archivo remota absoluta. | Sin valor predeterminado |
| `local` | string | Obligatorio | Ruta absoluta del archivo del dispositivo local. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### Respuesta y conclusión

data.remote/local/success; escribe un archivo remoto.

### Notas de uso

Requiere confianza y autenticación del host remoto verificadas. Un fallo no acepta automáticamente huellas. get tiene restricciones de escritura local; put envía contenido local al host remoto.

<a id="sftprm"></a>

## sftp.rm

Eliminar un archivo remoto mediante SFTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/sftp/rm`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `path` | string | Obligatorio | Ruta del directorio o archivo remoto. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Respuesta y conclusión

data.path/deleted.

### Notas de uso

Requiere confianza y autenticación del host remoto verificadas. Un fallo no acepta automáticamente huellas. get tiene restricciones de escritura local; put envía contenido local al host remoto.

<a id="sftpstat"></a>

## sftp.stat

Consultar información de un archivo remoto mediante SFTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/sftp/stat`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `path` | string | Obligatorio | Ruta del directorio o archivo remoto. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Respuesta y conclusión

data.path/size/is_dir/is_link/uid/gid/permissions/atime/mtime.

### Notas de uso

Requiere confianza y autenticación del host remoto verificadas. Un fallo no acepta automáticamente huellas. get tiene restricciones de escritura local; put envía contenido local al host remoto.
