# API: Registros

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [log.capture](#logcapture) | Habilitar o deshabilitar la captura de ESP_LOG |
| [log.clear](#logclear) | Borrar el búfer de registros |
| [log.list](#loglist) | Consultar entradas de registro con filtros |
| [log.setLevel](#logsetlevel) | Establecer el nivel de registro |
| [log.stats](#logstats) | Consultar estadísticas del sistema de registros |

<a id="logcapture"></a>

## log.capture

Habilitar o deshabilitar la captura de ESP_LOG

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/log/capture`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Obligatorio | Capture los registros del sistema en el búfer de registros. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "enable": true
}
```

### Respuesta y conclusión

data.capturing.

<a id="logclear"></a>

## log.clear

Borrar el búfer de registros

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/log/clear`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.cleared. Los registros en memoria anteriores ya no se pueden leer de este búfer.

<a id="loglist"></a>

## log.list

Consultar entradas de registro con filtros

**Métodos**: GET / POST
**Ruta**: `/api/v1/log/list`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `offset` | integer | Opcional | Desplazamiento inicial dentro de este resultado de búsqueda. | 0 |
| `limit` | integer | Opcional | Límite de retorno, 1-200. | 50 |
| `level` | integer | Opcional | Nivel de registro exacto 1-5; no combinar con filtros de rango. | Todo |
| `minLevel` | integer | Opcional | Nivel mínimo de registro. | ERROR |
| `maxLevel` | integer | Opcional | Nivel máximo de registro. | VERBOSE |
| `tag` | string | Opcional | Filtro de subcadena de nombre de módulo. | Ninguno |
| `keyword` | string | Opcional | Palabra clave del mensaje. | Ninguno |

### Ejemplo de solicitud

```json
{
  "limit": 50
}
```

### Respuesta y conclusión

data.logs/total/offset/returned/bufferCapacity/bufferCount. Las entradas contienen timestamp (milisegundos desde el arranque), level/levelName/tag/message/task.

### Notas de uso

El historial en memoria es limitado. offset se aplica al resultado de búsqueda seleccionado, no a un archivo ilimitado.

<a id="logsetlevel"></a>

## log.setLevel

Establecer el nivel de registro

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/log/setLevel`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `level` | integer / string | Obligatorio | Entero 0-5 o un nombre de nivel como error/warn/info/debug/verbose. | Sin valor predeterminado |
| `tag` | string | Opcional | Módulo específico; omítelo para cambiar el nivel global. | Global |

### Ejemplo de solicitud

```json
{
  "level": 3
}
```

### Respuesta y conclusión

data.level es el nombre del nivel; tag se incluye cuando el cambio afecta a un módulo concreto.

<a id="logstats"></a>

## log.stats

Consultar estadísticas del sistema de registros

**Métodos**: GET / POST
**Ruta**: `/api/v1/log/stats`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Estadísticas del búfer y de la captura de registros, con la capacidad y el estado actual de grabación.
