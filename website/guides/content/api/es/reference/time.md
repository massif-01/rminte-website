# API: Hora

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [time.force_sync](#timeforce_sync) | Forzar la sincronización NTP |
| [time.info](#timeinfo) | Consultar información de sincronización horaria |
| [time.set_ntp](#timeset_ntp) | Establecer el servidor NTP |
| [time.set_timezone](#timeset_timezone) | Establecer la zona horaria |
| [time.sync](#timesync) | Sincronizar la hora desde el navegador |

<a id="timeforce_sync"></a>

## time.force_sync

Forzar la sincronización NTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/time/force_sync`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.syncing/message. Consulta time.info para comprobar la sincronización real.

<a id="timeinfo"></a>

## time.info

Consultar información de sincronización horaria

**Métodos**: GET / POST
**Ruta**: `/api/v1/time/info`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.timestamp (segundos Unix), timestamp_ms, datetime/timezone y source/sync_status/synced/last_sync/sync_count/ntp_server.

<a id="timeset_ntp"></a>

## time.set_ntp

Establecer el servidor NTP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/time/set_ntp`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `server` | string | Obligatorio | Nombre o dirección del servidor NTP. | Sin valor predeterminado |
| `index` | integer | Opcional | Índice de ranura del servidor. | 0 |

### Ejemplo de solicitud

```json
{
  "server": "YOUR_NTP_SERVER",
  "index": 0
}
```

### Respuesta y conclusión

data.server/index/success.

<a id="timeset_timezone"></a>

## time.set_timezone

Establecer la zona horaria

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/time/set_timezone`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `timezone` | string | Obligatorio | Cadena de zona horaria POSIX, como CST-8. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "timezone": "CST-8"
}
```

### Respuesta y conclusión

data.timezone/local_time/success.

<a id="timesync"></a>

## time.sync

Sincronizar la hora desde el navegador

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/time/sync`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `timestamp_ms` | integer | Obligatorio | Marca de tiempo Unix en milisegundos. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "timestamp_ms": 1793894400000
}
```

### Respuesta y conclusión

data.datetime/synced/source.

### Notas de uso

El cambio de hora del sistema afecta las comprobaciones de validez del certificado. Lee time.info después para confirmar.
