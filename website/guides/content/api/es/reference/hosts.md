# API: Huellas de hosts SSH

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [hosts.clear](#hostsclear) | Borrar todos los hosts conocidos |
| [hosts.info](#hostsinfo) | Consultar información de un host conocido |
| [hosts.list](#hostslist) | Enumerar todos los hosts SSH conocidos |
| [hosts.remove](#hostsremove) | Eliminar un host conocido |
| [hosts.update](#hostsupdate) | Forzar la actualización de la huella de un host |

<a id="hostsclear"></a>

## hosts.clear

Borrar todos los hosts conocidos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/hosts/clear`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.cleared.

### Notas de uso

Afecta a las comprobaciones de confianza SSH/SFTP posteriores; no elimina las definiciones de conexión de host guardadas.

<a id="hostsinfo"></a>

## hosts.info

Consultar información de un host conocido

**Métodos**: GET / POST
**Ruta**: `/api/v1/hosts/info`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección remota; los registros de confianza coinciden por dirección y puerto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto SSH de 1 a 65535. | 22 |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "port": 22
}
```

### Respuesta y conclusión

data.host/port/type/fingerprint/added.

<a id="hostslist"></a>

## hosts.list

Enumerar todos los hosts SSH conocidos

**Métodos**: GET / POST
**Ruta**: `/api/v1/hosts/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.hosts/count; las entradas contienen host/port/type/fingerprint/added.

<a id="hostsremove"></a>

## hosts.remove

Eliminar un host conocido

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/hosts/remove`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección remota; los registros de confianza coinciden por dirección y puerto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto SSH de 1 a 65535. | 22 |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20"
}
```

### Respuesta y conclusión

data.host/port/removed.

### Notas de uso

Eliminar la confianza no revoca usuarios ni claves remotas. Verifica otra vez la identidad antes de la siguiente conexión.

<a id="hostsupdate"></a>

## hosts.update

Forzar la actualización de la huella de un host

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/hosts/update`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección remota; los registros de confianza coinciden por dirección y puerto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto SSH de 1 a 65535. | 22 |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20"
}
```

### Respuesta y conclusión

data.host/port/updated/message.

### Notas de uso

Conecta con el host remoto y actualiza la confianza. Verifica primero su identidad por una vía independiente.
