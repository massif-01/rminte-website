# API: Ordenadores y USB

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [device.fan.set](#devicefanset) | Establecer el modo y el porcentaje de salida del ventilador |
| [device.fan.status](#devicefanstatus) | Consultar el estado de los ventiladores |
| [device.ping](#deviceping) | Probar la conectividad de red mediante un puerto TCP |
| [device.power](#devicepower) | Controlar la alimentación del dispositivo (on/off/force_off) |
| [device.power.status](#devicepowerstatus) | Consultar las mediciones de alimentación |
| [device.reset](#devicereset) | Reiniciar el dispositivo |
| [device.status](#devicestatus) | Consultar el estado de alimentación del dispositivo |
| [device.usb.set](#deviceusbset) | Seleccionar el destino del multiplexor USB |
| [device.usb.status](#deviceusbstatus) | Consultar el estado del multiplexor USB |

<a id="devicefanset"></a>

## device.fan.set

Establecer el modo y el porcentaje de salida del ventilador

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/device/fan/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `fan` | integer | Obligatorio | ID del ventilador. | Sin valor predeterminado |
| `mode` | string | Opcional | off/manual/auto/curve; esta entrada de compatibilidad tiene su propio manejo. | Sin cambios |
| `duty` | integer | Opcional | Porcentaje de salida manual, de 0 a 100. | Sin cambios |

### Ejemplo de solicitud

```json
{
  "fan": 0,
  "mode": "manual",
  "duty": 50
}
```

### Respuesta y conclusión

data.fan/success.

### Notas de uso

Para nuevas integraciones, usa llamadas separadas a fan.mode y fan.set.

<a id="devicefanstatus"></a>

## device.fan.status

Consultar el estado de los ventiladores

**Métodos**: GET / POST
**Ruta**: `/api/v1/device/fan/status`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `fan` | integer | Opcional | ID del ventilador. | Todo |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.fans o un ventilador; temp de compatibilidad sigue el modelo de esta entrada. Para nuevas integraciones, usa preferentemente fan.status.

<a id="deviceping"></a>

## device.ping

Probar la conectividad de red mediante un puerto TCP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/device/ping`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección IPv4 o nombre de host de destino. | Sin valor predeterminado |
| `timeout` | integer | Opcional | Tiempo máximo de la solicitud, en milisegundos. | 1000 |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "timeout": 1000
}
```

### Respuesta y conclusión

data.host/reachable; si tiene éxito, puede incluir latency_ms; si falla, error.

### Notas de uso

reachable=false es un resultado de diagnóstico, no una prueba de que la API no se haya ejecutado.

<a id="devicepower"></a>

## device.power

Controlar la alimentación del dispositivo (on/off/force_off)

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/device/power`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Ordenador de destino: agx=inferencia, lpmu=aplicaciones. | agx |
| `action` | string | Obligatorio | on/off/toggle/force_off. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "device": "agx",
  "action": "on"
}
```

### Respuesta y conclusión

data.device/action/success informa del resultado de la llamada de control. Sigue consultando device.status.

### Notas de uso

force_off puede provocar la pérdida de datos sin guardar; usa preferentemente el apagado normal. Repetir toggle vuelve a invertir el estado.

<a id="devicepowerstatus"></a>

## device.power.status

Consultar las mediciones de alimentación

**Métodos**: GET / POST
**Ruta**: `/api/v1/device/power/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Entradas data.rails: name/voltage_mv/current_ma/power_mw; total_power_mw. Las unidades son mV/mA/mW.

<a id="devicereset"></a>

## device.reset

Reiniciar el dispositivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/device/reset`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Ordenador de destino: agx=inferencia, lpmu=aplicaciones. | agx |

### Ejemplo de solicitud

```json
{
  "device": "agx"
}
```

### Respuesta y conclusión

data.device/reset. Después vuelve a comprobar el estado del ordenador y de la aplicación.

### Notas de uso

Interrumpe el trabajo del ordenador de destino.

<a id="devicestatus"></a>

## device.status

Consultar el estado de alimentación del dispositivo

**Métodos**: GET / POST
**Ruta**: `/api/v1/device/status`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Ordenador de destino: agx=inferencia, lpmu=aplicaciones. | agx |

### Ejemplo de solicitud

```json
{
  "device": "agx"
}
```

### Respuesta y conclusión

data.device/state/power_good/uptime_ms/boot_count; state es off/standby/on/booting/error.

### Notas de uso

El estado de alimentación no demuestra que el sistema operativo o la aplicación estén listos.

<a id="deviceusbset"></a>

## device.usb.set

Seleccionar el destino del multiplexor USB

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/device/usb/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `target` | string | Obligatorio | esp32/agx/lpmu/disconnect. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "target": "agx"
}
```

### Respuesta y conclusión

data.target/success.

### Notas de uso

El cambio puede interrumpir el control o las transferencias de la ruta original.

<a id="deviceusbstatus"></a>

## device.usb.status

Consultar el estado del multiplexor USB

**Métodos**: GET / POST
**Ruta**: `/api/v1/device/usb/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.target/configured; target puede ser esp32/agx/lpmu/disconnected.
