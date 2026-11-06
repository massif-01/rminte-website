# API: GPIO

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [gpio.info](#gpioinfo) | Consultar información de un pin GPIO |
| [gpio.list](#gpiolist) | Enumerar todos los pines GPIO controlables |
| [gpio.set](#gpioset) | Establecer el nivel de un pin GPIO |
| [gpio.toggle](#gpiotoggle) | Conmutar el nivel de un pin GPIO |

<a id="gpioinfo"></a>

## gpio.info

Consultar información de un pin GPIO

**Métodos**: GET / POST
**Ruta**: `/api/v1/gpio/info`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `pin` | integer | Se requiere pin o name | Número GPIO incluido en la lista de pines permitidos de gpio.list. | Ninguno |
| `name` | string | Se requiere pin o name | Nombre de pin obtenido de gpio.list. | Ninguno |

### Ejemplo de solicitud

```json
{
  "name": "AGX_RESET"
}
```

### Respuesta y conclusión

data.gpio/name/description/level/default/modified.

<a id="gpiolist"></a>

## gpio.list

Enumerar todos los pines GPIO controlables

**Métodos**: GET / POST
**Ruta**: `/api/v1/gpio/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.count/pins; cada entrada contiene gpio/name/description/level/default/modified.

### Notas de uso

Mantenimiento avanzado limitado a los pines permitidos; no proporciona acceso a cualquier GPIO.

<a id="gpioset"></a>

## gpio.set

Establecer el nivel de un pin GPIO

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/gpio/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `pin` | integer | Se requiere pin o name | Número GPIO incluido en la lista de pines permitidos de gpio.list. | Ninguno |
| `name` | string | Se requiere pin o name | Nombre de pin obtenido de gpio.list. | Ninguno |
| `level` | integer | Obligatorio | 0 o 1. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "name": "AGX_RESET",
  "level": 0
}
```

### Respuesta y conclusión

data.gpio/name/level.

### Notas de uso

Los pines pueden controlar el reinicio, el apagado forzado o la ruta USB. Verifica primero su función física.

<a id="gpiotoggle"></a>

## gpio.toggle

Conmutar el nivel de un pin GPIO

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/gpio/toggle`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `pin` | integer | Se requiere pin o name | Número GPIO incluido en la lista de pines permitidos de gpio.list. | Ninguno |
| `name` | string | Se requiere pin o name | Nombre de pin obtenido de gpio.list. | Ninguno |

### Ejemplo de solicitud

```json
{
  "name": "AGX_RESET"
}
```

### Respuesta y conclusión

data.gpio/name/previous/level.

### Notas de uso

Repetir la llamada vuelve a conmutar el nivel. No la repitas sin comprobar el estado tras un tiempo de espera de red agotado.
