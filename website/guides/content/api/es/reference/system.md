# API: Estado del controlador

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [system.apis](#systemapis) | Enumerar todas las API registradas |
| [system.cpu](#systemcpu) | Consultar estadísticas de los núcleos de CPU |
| [system.info](#systeminfo) | Consultar información del sistema |
| [system.log.level](#systemloglevel) | Consultar o establecer el nivel de registro |
| [system.memory](#systemmemory) | Consultar información de memoria |
| [system.memory_detail](#systemmemory_detail) | Consultar un análisis detallado de memoria |
| [system.reboot](#systemreboot) | Reiniciar el sistema |
| [system.tasks](#systemtasks) | Consultar la lista de tareas |

<a id="systemapis"></a>

## system.apis

Enumerar todas las API registradas

**Métodos**: GET / POST
**Ruta**: `/api/v1/system/apis`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.apis es un array de cadenas de nombres con total; también pueden aparecer indicadores heredados de presencia del monitor.

### Notas de uso

Una lista de nombres no sustituye la documentación de parámetros y permisos.

<a id="systemcpu"></a>

## system.cpu

Consultar estadísticas de los núcleos de CPU

**Métodos**: GET / POST
**Ruta**: `/api/v1/system/cpu`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.total_usage/cores; cada núcleo incluye id/usage. Estas son métricas de controlador, no métricas de ordenador de inferencia.

<a id="systeminfo"></a>

## system.info

Consultar información del sistema

**Métodos**: GET / POST
**Ruta**: `/api/v1/system/info`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.app contiene name/version/idf_version/compile_time/compile_date; chip contiene model/cores/revision/features; flash_size se expresa en bytes y uptime_ms en milisegundos.

<a id="systemloglevel"></a>

## system.log.level

Consultar o establecer el nivel de registro

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/system/log/level`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `level` | integer | Opcional | 0=NONE,1=ERROR,2=WARN,3=INFO,4=DEBUG,5=VERBOSE. | Sin cambios |
| `tag` | string | Opcional | Cambie solo el nivel de registro de este módulo; la omisión afecta a todos los módulos. | Global |

### Ejemplo de solicitud

```json
{
  "level": 3
}
```

### Respuesta y conclusión

data.status; un cambio también incluye level/tag.

### Notas de uso

Destinado a diagnósticos temporales; No se promete el registro persistente de archivos.

<a id="systemmemory"></a>

## system.memory

Consultar información de memoria

**Métodos**: GET / POST
**Ruta**: `/api/v1/system/memory`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.free_heap/min_free_heap se expresan en bytes. internal y psram, cuando esté disponible, contienen total/free/allocated/largest_block, todos en bytes.

<a id="systemmemory_detail"></a>

## system.memory_detail

Consultar un análisis detallado de memoria

**Métodos**: GET / POST
**Ruta**: `/api/v1/system/memory_detail`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Grupos de diagnóstico data.dram/psram/iram/dma/static/rtc/nvs/tasks/history/tips. total/free/used son estadísticas de memoria; stack_allocation_estimated indica que se trata de una estimación.

### Notas de uso

Las estimaciones de una instantánea de diagnóstico no son un desglose exacto de la memoria física ni una prueba de una fuga de memoria.

<a id="systemreboot"></a>

## system.reboot

Reiniciar el sistema

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/system/reboot`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `delay` | integer | Opcional | Retraso en milisegundos, finalmente limitado a 100-10000. | 500 |

### Ejemplo de solicitud

```json
{
  "delay": 500
}
```

### Respuesta y conclusión

data.status=rebooting, delay_ms y waiting_for_maintenance=false. El reinicio se solicita tras el retardo; esta API no espera a que termine una actualización.

### Notas de uso

Interrumpe la conectividad de gestión. Guarda la configuración requerida, espere la recuperación y vuelva a iniciar sesión.

<a id="systemtasks"></a>

## system.tasks

Consultar la lista de tareas

**Métodos**: GET / POST
**Ruta**: `/api/v1/system/tasks`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.tasks/count; las tareas incluyen name/state/priority/core/stack_hwm. stack_hwm es una marca nativa de uso de pila, no la memoria libre total.
