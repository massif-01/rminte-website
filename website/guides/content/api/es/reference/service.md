# API: Servicios del controlador

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [service.list](#servicelist) | Enumerar todos los servicios |
| [service.restart](#servicerestart) | Reiniciar un servicio |
| [service.start](#servicestart) | Iniciar un servicio |
| [service.status](#servicestatus) | Consultar el estado de un servicio |
| [service.stop](#servicestop) | Detener un servicio |

<a id="servicelist"></a>

## service.list

Enumerar todos los servicios

**Métodos**: GET / POST
**Ruta**: `/api/v1/service/list`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.total/running/services; las entradas contienen name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicerestart"></a>

## service.restart

Reiniciar un servicio

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/service/restart`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre de servicio obtenido de service.list. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Respuesta y conclusión

data.name/status.

### Notas de uso

El mantenimiento puede interrumpir la red, WebUI o sus dependencias. Usa automation.services para las aplicaciones remotas.

<a id="servicestart"></a>

## service.start

Iniciar un servicio

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/service/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre de servicio obtenido de service.list. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Respuesta y conclusión

data.name/status.

### Notas de uso

El mantenimiento puede interrumpir la red, WebUI o sus dependencias. Usa automation.services para las aplicaciones remotas.

<a id="servicestatus"></a>

## service.status

Consultar el estado de un servicio

**Métodos**: GET / POST
**Ruta**: `/api/v1/service/status`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre de servicio obtenido de service.list. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "name": "webui"
}
```

### Respuesta y conclusión

data.name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicestop"></a>

## service.stop

Detener un servicio

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/service/stop`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre de servicio obtenido de service.list. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Respuesta y conclusión

data.name/status.

### Notas de uso

El mantenimiento puede interrumpir la red, WebUI o sus dependencias. Usa automation.services para las aplicaciones remotas.
