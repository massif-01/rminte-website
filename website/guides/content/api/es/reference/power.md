# API: Alimentación y protección

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [power.chip](#powerchip) | Consultar los datos del chip de alimentación |
| [power.debug](#powerdebug) | Establecer el modo de depuración |
| [power.interval.set](#powerintervalset) | Establecer el intervalo de muestreo |
| [power.monitor.start](#powermonitorstart) | Iniciar la supervisión de alimentación |
| [power.monitor.stop](#powermonitorstop) | Detener la supervisión de alimentación |
| [power.protection.config](#powerprotectionconfig) | Consultar la configuración de protección de tensión |
| [power.protection.set](#powerprotectionset) | Configurar la protección de tensión |
| [power.protection.status](#powerprotectionstatus) | Consultar el estado de protección de tensión |
| [power.stats](#powerstats) | Consultar estadísticas de supervisión |
| [power.stats.reset](#powerstatsreset) | Restablecer las estadísticas de supervisión |
| [power.status](#powerstatus) | Consultar el estado de supervisión de alimentación |
| [power.threshold.set](#powerthresholdset) | Establecer los umbrales de tensión |
| [power.voltage](#powervoltage) | Consultar la tensión actual |

<a id="powerchip"></a>

## power.chip

Consultar los datos del chip de alimentación

**Métodos**: GET / POST
**Ruta**: `/api/v1/power/chip`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.voltage_v/current_a/power_w/valid/crc_valid/timestamp_ms/raw_data. Usa solo valores válidos cuya integridad se haya comprobado.

<a id="powerdebug"></a>

## power.debug

Establecer el modo de depuración

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/debug`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Obligatorio | Habilite la salida de depuración. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "enable": false
}
```

### Respuesta y conclusión

data.debug_enabled.

<a id="powerintervalset"></a>

## power.interval.set

Establecer el intervalo de muestreo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/interval/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `interval_ms` | integer | Obligatorio | Intervalo de muestreo en milisegundos; el dispositivo rechaza valores por debajo de su rango soportado. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "interval_ms": 1000
}
```

### Respuesta y conclusión

data.interval_ms.

<a id="powermonitorstart"></a>

## power.monitor.start

Iniciar la supervisión de alimentación

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/monitor/start`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.running.

### Notas de uso

Detener el muestreo afecta a las actualizaciones futuras. Comprueba también los datos que necesita la protección.

<a id="powermonitorstop"></a>

## power.monitor.stop

Detener la supervisión de alimentación

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/monitor/stop`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.running.

### Notas de uso

Detener el muestreo afecta a las actualizaciones futuras. Comprueba también los datos que necesita la protección.

<a id="powerprotectionconfig"></a>

## power.protection.config

Consultar la configuración de protección de tensión

**Métodos**: GET / POST
**Ruta**: `/api/v1/power/protection/config`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.low_voltage_threshold/recovery_voltage_threshold (V), shutdown_delay_sec/recovery_hold_sec/fan_stop_delay_sec (segundos) y valores predeterminados.

<a id="powerprotectionset"></a>

## power.protection.set

Configurar la protección de tensión

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/protection/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Opcional | Inicia o detiene la protección; proporcionar este campo siempre guarda el estado de habilitación. | Sin cambios |
| `low_threshold` | number | Opcional | Umbral de baja tensión en V. | Sin cambios |
| `recovery_threshold` | number | Opcional | Umbral de recuperación en V. | Sin cambios |
| `shutdown_delay` | integer | Opcional | Retardo de apagado por bajo voltaje en segundos. | Sin cambios |
| `recovery_hold` | integer | Opcional | Tiempo durante el que debe mantenerse la recuperación, en segundos. | Sin cambios |
| `fan_stop_delay` | integer | Opcional | Retardo de parada del ventilador tras apagar el ordenador, en segundos. | Sin cambios |
| `persist` | boolean | Opcional | true guarda los cambios que afectan solo a parámetros; los cambios de habilitación se guardan automáticamente. | false |

### Ejemplo de solicitud

```json
{
  "persist": true
}
```

### Respuesta y conclusión

data.low_threshold_v/recovery_threshold_v/running/persisted.

### Notas de uso

Afecta a la protección y al apagado automático. Puede aplicarse parcialmente antes de fallar; vuelve a consultar la configuración y el estado.

<a id="powerprotectionstatus"></a>

## power.protection.status

Consultar el estado de protección de tensión

**Métodos**: GET / POST
**Ruta**: `/api/v1/power/protection/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.initialized/running/state/current_voltage_v/countdown_remaining_sec/recovery_timer_sec/protection_count/uptime_ms; devices contiene agx_powered/lpmu_powered/agx_connected.

### Notas de uso

initialized=false no demuestra que la protección esté activa.

<a id="powerstats"></a>

## power.stats

Consultar estadísticas de supervisión

**Métodos**: GET / POST
**Ruta**: `/api/v1/power/stats`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.voltage_samples/power_chip_packets/crc_errors/timeout_errors/threshold_violations/avg_voltage_v/avg_current_a/avg_power_w/uptime_ms.

<a id="powerstatsreset"></a>

## power.stats.reset

Restablecer las estadísticas de supervisión

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/stats/reset`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.reset.

### Notas de uso

Reinicia estadísticas, no calibración de sensores.

<a id="powerstatus"></a>

## power.status

Consultar el estado de supervisión de alimentación

**Métodos**: GET / POST
**Ruta**: `/api/v1/power/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#power) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.voltage; power_chip contiene voltage_v/current_a/power_w/valid/crc_valid; protection, stats y monitoring_active describen la protección, los datos agregados y el muestreo.

<a id="powerthresholdset"></a>

## power.threshold.set

Establecer los umbrales de tensión

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/power/threshold/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `min_v` | number | Obligatorio | Tensión mínima en V. | Sin valor predeterminado |
| `max_v` | number | Obligatorio | Tensión máxima en V; mayor que el mínimo. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "min_v": 12,
  "max_v": 24
}
```

### Respuesta y conclusión

data.min_v/max_v.

### Notas de uso

Los umbrales de seguimiento y la política de protección están separados; utilice power.protection.set para protección.

<a id="powervoltage"></a>

## power.voltage

Consultar la tensión actual

**Métodos**: GET / POST
**Ruta**: `/api/v1/power/voltage`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `now` | boolean | Opcional | true toma una muestra ahora; false lee el valor más reciente. | false |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.voltage_v(V)/voltage_mv(mV)/adc_raw/timestamp_ms.
