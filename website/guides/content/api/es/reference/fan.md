# API: Ventiladores

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [fan.config](#fanconfig) | Consultar la configuración del ventilador, incluida la curva |
| [fan.curve](#fancurve) | Configurar la curva de temperatura de un ventilador |
| [fan.enable](#fanenable) | Habilitar o deshabilitar un ventilador |
| [fan.limits](#fanlimits) | Establecer los límites mínimo y máximo del porcentaje de salida |
| [fan.mode](#fanmode) | Seleccionar el modo de funcionamiento del ventilador |
| [fan.save](#fansave) | Guardar la configuración del ventilador en NVS |
| [fan.set](#fanset) | Establecer la velocidad del ventilador en modo manual |
| [fan.status](#fanstatus) | Consultar el estado de los ventiladores |

<a id="fanconfig"></a>

## fan.config

Consultar la configuración del ventilador, incluida la curva

**Métodos**: GET / POST
**Ruta**: `/api/v1/fan/config`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Opcional | ID de ventilador; consíguelo primero de fan.status. | Todos si se omite |

### Ejemplo de solicitud

```json
{
  "id": 0
}
```

### Respuesta y conclusión

Una configuración o todas: id/mode/min_duty/max_duty/invert_pwm/hysteresis/min_interval/curve. Los puntos de curva usan temp (Celsius) y duty (porcentaje).

<a id="fancurve"></a>

## fan.curve

Configurar la curva de temperatura de un ventilador

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/fan/curve`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatorio | ID de ventilador dentro del rango admitido del dispositivo. | Sin valor predeterminado |
| `curve` | array | Obligatorio | Hasta 10 puntos {temp:Celsius,duty:percent}; temperaturas en orden ascendente y duty entre 0 y 100. | Sin valor predeterminado |
| `hysteresis` | number | Opcional | Histéresis de temperatura, de 0 a 20 grados Celsius. | Valor actual |
| `min_interval` | integer | Opcional | Intervalo de ajuste mínimo, número entero 100-60000 milisegundos. | Valor actual |

### Ejemplo de solicitud

```json
{
  "id": 0,
  "curve": [
    {
      "temp": 30,
      "duty": 30
    },
    {
      "temp": 60,
      "duty": 80
    }
  ],
  "hysteresis": 3,
  "min_interval": 2000
}
```

### Respuesta y conclusión

data.id/points/applied/persisted.

### Notas de uso

La configuración de la curva y el modo de control son independientes. Vuelve a consultar la configuración y selecciona el modo curve si es necesario.

<a id="fanenable"></a>

## fan.enable

Habilitar o deshabilitar un ventilador

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/fan/enable`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatorio | ID de ventilador dentro del rango admitido del dispositivo. | Sin valor predeterminado |
| `enable` | boolean | Obligatorio | true habilita; false deshabilita. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "id": 0,
  "enable": true
}
```

### Respuesta y conclusión

data.id/enabled.

### Notas de uso

Deshabilitarlo puede reducir la refrigeración. Comprueba por separado la temperatura y la protección.

<a id="fanlimits"></a>

## fan.limits

Establecer los límites mínimo y máximo del porcentaje de salida

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/fan/limits`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatorio | ID de ventilador dentro del rango admitido del dispositivo. | Sin valor predeterminado |
| `min_duty` | integer | Opcional | Porcentaje mínimo de salida, de 0 a 100, sin superar el máximo. | Valor actual |
| `max_duty` | integer | Opcional | Porcentaje máximo de salida, de 0 a 100. | Valor actual |

### Ejemplo de solicitud

```json
{
  "id": 0,
  "min_duty": 20,
  "max_duty": 100
}
```

### Respuesta y conclusión

data.id/min_duty/max_duty/applied/persisted.

<a id="fanmode"></a>

## fan.mode

Seleccionar el modo de funcionamiento del ventilador

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/fan/mode`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatorio | ID de ventilador dentro del rango admitido del dispositivo. | Sin valor predeterminado |
| `mode` | string | Obligatorio | off/manual/auto/curve. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "id": 0,
  "mode": "auto"
}
```

### Respuesta y conclusión

data.id/mode/applied/persisted. Distingue la aplicación en ejecución de un fallo al guardar.

<a id="fansave"></a>

## fan.save

Guardar la configuración del ventilador en NVS

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/fan/save`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Opcional | ID del ventilador. | Todos los ventiladores |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.status/persisted. Comprueba los detalles del fallo; no des por supuesto que el ajuste se conservará tras reiniciar.

<a id="fanset"></a>

## fan.set

Establecer la velocidad del ventilador en modo manual

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/fan/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatorio | ID de ventilador dentro del rango admitido del dispositivo. | Sin valor predeterminado |
| `duty` | integer | Obligatorio | Porcentaje de salida solicitado, de 0 a 100. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#fan) común.

### Ejemplo de solicitud

```json
{
  "id": 0,
  "duty": 50
}
```

### Respuesta y conclusión

Estado aplicado del ventilador; comprueba duty_valid/duty/target_duty/mode.

### Notas de uso

Afecta a la refrigeración. Cambia el ajuste de forma deliberada y vuelve a consultar la salida real y la solicitada.

<a id="fanstatus"></a>

## fan.status

Consultar el estado de los ventiladores

**Métodos**: GET / POST
**Ruta**: `/api/v1/fan/status`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | integer | Opcional | ID de ventilador; consíguelo primero de fan.status. | Todos si se omite |

Consulta el [modelo de datos](../response-models.md#fan) común.

### Ejemplo de solicitud

```json
{
  "id": 0
}
```

### Respuesta y conclusión

Con id, data contiene un ventilador; sin id, contiene data.fans y temperature/temp_valid/temp_source. Consulta el modelo de respuesta de ventiladores.
