# API: Supervisión de recursos de cómputo

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [monitor.config](#monitorconfig) | Consultar la configuración del monitor de cómputo |
| [monitor.data](#monitordata) | Consultar la telemetría de cómputo más reciente |
| [monitor.set_server](#monitorset_server) | Establecer la IP y el puerto del servidor de supervisión de cómputo |
| [monitor.start](#monitorstart) | Iniciar la supervisión de cómputo |
| [monitor.status](#monitorstatus) | Consultar el estado del monitor de cómputo |
| [monitor.stop](#monitorstop) | Detener la supervisión de cómputo |

<a id="monitorconfig"></a>

## monitor.config

Consultar la configuración del monitor de cómputo

**Métodos**: GET / POST
**Ruta**: `/api/v1/monitor/config`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.server/port/reconnect_ms/heartbeat_timeout_ms/startup_delay_ms/auto_start/update_temp_source.

<a id="monitordata"></a>

## monitor.data

Consultar la telemetría de cómputo más reciente

**Métodos**: GET / POST
**Ruta**: `/api/v1/monitor/data`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.timestamp; CPU: cores/data(id/usage/freq); memoria: ram/swap used/total (MB); temperatura: cpu/soc0/soc1/soc2/tj (Celsius); alimentación: gpu_soc/cpu_cv/sys_5v actual/promedio (mW); gpu.gr3d_freq_pct.

### Notas de uso

Si no hay datos de cómputo válidos, devuelve un error de operación. Son métricas del host de cómputo.

<a id="monitorset_server"></a>

## monitor.set_server

Establecer la IP y el puerto del servidor de supervisión de cómputo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/monitor/set_server`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `server` | string | Obligatorio | Dirección del servidor de supervisión. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535; si se omite, se usan los valores predeterminados del controlador. | 0 selecciona el comportamiento predeterminado |

### Ejemplo de solicitud

```json
{
  "server": "192.0.2.20",
  "port": 58090
}
```

### Respuesta y conclusión

data.server/port/saved.

<a id="monitorstart"></a>

## monitor.start

Iniciar la supervisión de cómputo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/monitor/start`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.started.

<a id="monitorstatus"></a>

## monitor.status

Consultar el estado del monitor de cómputo

**Métodos**: GET / POST
**Ruta**: `/api/v1/monitor/status`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.initialized/running/connection/reconnects/messages/errors/reliability/connected_time_ms; last_error puede aparecer.

<a id="monitorstop"></a>

## monitor.stop

Detener la supervisión de cómputo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/monitor/stop`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.stopped.
