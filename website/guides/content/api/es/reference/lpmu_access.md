# API: Red del ordenador de aplicaciones

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [network.lpmu_access.log](#networklpmu_accesslog) | Consultar el registro de una ejecución de configuración de red del ordenador de aplicaciones |
| [network.lpmu_access.start](#networklpmu_accessstart) | Iniciar la configuración de acceso del ordenador de aplicaciones a la red superior |
| [network.lpmu_access.status](#networklpmu_accessstatus) | Consultar el estado de la configuración de acceso del ordenador de aplicaciones a la red superior |

<a id="networklpmu_accesslog"></a>

## network.lpmu_access.log

Consultar el registro de una ejecución de configuración de red del ordenador de aplicaciones

**Métodos**: GET / POST
**Ruta**: `/api/v1/network/lpmu_access/log`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `run_id` | integer | Obligatorio | Número de ejecución actual devuelto por start/status. | Sin valor predeterminado |
| `offset` | integer | Obligatorio | Desplazamiento no negativo en bytes; empieza por 0. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "run_id": 1,
  "offset": 0
}
```

### Respuesta y conclusión

data.run_id/output/next_offset/done. Continúa desde next_offset.

### Notas de uso

Como máximo 1024 bytes por fragmento. Se rechaza un run_id obsoleto. done indica que se ha leído el final actual del registro; aún debes comprobar el estado de la tarea.

<a id="networklpmu_accessstart"></a>

## network.lpmu_access.start

Iniciar la configuración de acceso del ordenador de aplicaciones a la red superior

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/lpmu_access/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `sudo_password` | string | Opcional | Contraseña sudo remota utilizada solo para esta ejecución. | Vacío |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.run_id/running/stage. Sigue consultando status/log.

### Notas de uso

Destino fijo 10.10.99.99:22; requiere host y clave guardados y admite una sola tarea a la vez. Modifica la red remota.

<a id="networklpmu_accessstatus"></a>

## network.lpmu_access.status

Consultar el estado de la configuración de acceso del ordenador de aplicaciones a la red superior

**Métodos**: GET / POST
**Ruta**: `/api/v1/network/lpmu_access/status`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `diagnostics` | boolean | Opcional | Incluir diagnósticos adicionales de tiempos y recursos. | false |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.run_id/running/stage, bytes transferidos,exit_code/reason/failure_stage,internet_confirmed/configuration_complete,output_tail/output_truncated. Los diagnósticos aparecen sólo cuando se solicita.

### Notas de uso

La finalización requiere confirmar la fase final y el script. Que esté en cola o que el script termine con código 0 no demuestra por sí solo que la red esté configurada.
