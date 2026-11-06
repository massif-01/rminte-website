# API: LED y matriz

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [led.boot.config](#ledbootconfig) | Consultar la configuración de arranque de LED |
| [led.brightness](#ledbrightness) | Consultar o establecer el brillo del dispositivo |
| [led.clear](#ledclear) | Apagar todos los LED del dispositivo |
| [led.color.hsv](#ledcolorhsv) | Convertir HSV a RGB |
| [led.color.parse](#ledcolorparse) | Interpretar una cadena de color como RGB |
| [led.color_correction.export](#ledcolor_correctionexport) | Exportar la configuración de corrección de color a la SD |
| [led.color_correction.get](#ledcolor_correctionget) | Consultar la configuración de corrección de color |
| [led.color_correction.import](#ledcolor_correctionimport) | Importar la configuración de corrección de color desde la SD |
| [led.color_correction.reset](#ledcolor_correctionreset) | Restablecer la corrección de color a los valores predeterminados |
| [led.color_correction.set](#ledcolor_correctionset) | Establecer la configuración de corrección de color |
| [led.effect.list](#ledeffectlist) | Enumerar los efectos disponibles |
| [led.effect.start](#ledeffectstart) | Iniciar un efecto en el dispositivo |
| [led.effect.stop](#ledeffectstop) | Detener un efecto en el dispositivo |
| [led.fill](#ledfill) | Aplicar un color a todos los LED |
| [led.filter.list](#ledfilterlist) | Enumerar los filtros de posprocesamiento disponibles |
| [led.filter.start](#ledfilterstart) | Aplicar un filtro de posprocesamiento |
| [led.filter.stop](#ledfilterstop) | Detener un filtro de posprocesamiento |
| [led.image](#ledimage) | Mostrar una imagen en la matriz |
| [led.list](#ledlist) | Enumerar los dispositivos LED |
| [led.qrcode](#ledqrcode) | Generar y mostrar un código QR |
| [led.save](#ledsave) | Guardar el estado actual como configuración de arranque |
| [led.set](#ledset) | Establecer un rango de píxeles LED |
| [led.text](#ledtext) | Mostrar texto en la matriz |
| [led.text.stop](#ledtextstop) | Detener la superposición de texto |

<a id="ledbootconfig"></a>

## led.boot.config

Consultar la configuración de arranque de LED

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/boot/config`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |

### Ejemplo de solicitud

```json
{
  "device": "matrix"
}
```

### Respuesta y conclusión

Array data.boot_config: device/enabled/animation/speed/brightness/filter/filter_speed/image_path/qrcode_text.

<a id="ledbrightness"></a>

## led.brightness

Consultar o establecer el brillo del dispositivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/brightness`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |
| `brightness` | integer | Opcional | Brillo, 0-255. | Solo consulta |

### Ejemplo de solicitud

```json
{
  "device": "matrix",
  "brightness": 64
}
```

### Respuesta y conclusión

data.device/brightness.

<a id="ledclear"></a>

## led.clear

Apagar todos los LED del dispositivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/clear`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |
| `off` | boolean | Opcional | Desactivar la salida después de borrar. | false |

### Ejemplo de solicitud

```json
{
  "device": "matrix"
}
```

### Respuesta y conclusión

data.device/cleared.

### Notas de uso

Detiene o sustituye la presentación actual. Guardar la configuración de arranque es un paso independiente.

<a id="ledcolorhsv"></a>

## led.color.hsv

Convertir HSV a RGB

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/color/hsv`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `h` | integer | Obligatorio | Tono entero, 0-359 grados. | Sin valor predeterminado |
| `s` | integer | Obligatorio | Saturación entera de 0 a 255. | Sin valor predeterminado |
| `v` | integer | Obligatorio | Valor o brillo entero de 0 a 255. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#color) común.

### Ejemplo de solicitud

```json
{
  "h": 200,
  "s": 255,
  "v": 255
}
```

### Respuesta y conclusión

data.hsv/rgb/hex; vea el modelo de color para los rangos.

<a id="ledcolorparse"></a>

## led.color.parse

Interpretar una cadena de color como RGB

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/color/parse`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `color` | string | Obligatorio | Cadena de color compatible, como #00A0FF. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "color": "#00A0FF"
}
```

### Respuesta y conclusión

data.input/rgb(r/g/b)/hex/value.

<a id="ledcolor_correctionexport"></a>

## led.color_correction.export

Exportar la configuración de corrección de color a la SD

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/color_correction/export`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Opcional | Ruta de destino SD absoluta. | /sdcard/config/led_color_correction.json |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example-color.json"
}
```

### Respuesta y conclusión

data.path/success.

<a id="ledcolor_correctionget"></a>

## led.color_correction.get

Consultar la configuración de corrección de color

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/color_correction/get`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#color) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Configuración de corrección de color: enabled/brightness/gamma/saturation/white_point; consulta el modelo de color.

<a id="ledcolor_correctionimport"></a>

## led.color_correction.import

Importar la configuración de corrección de color desde la SD

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/color_correction/import`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example-color.json"
}
```

### Respuesta y conclusión

data.success.

### Notas de uso

Las lecturas de archivos usan la sesión actual. Las rutas gestionadas o sensibles pueden requerir ADMIN.

<a id="ledcolor_correctionreset"></a>

## led.color_correction.reset

Restablecer la corrección de color a los valores predeterminados

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/color_correction/reset`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.success.

<a id="ledcolor_correctionset"></a>

## led.color_correction.set

Establecer la configuración de corrección de color

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/color_correction/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Opcional | Habilite la corrección de color. | Sin cambios |
| `brightness` | object | Opcional | {enabled:boolean,factor:number}; factor de 0 a 2. | Sin cambios |
| `gamma` | object | Opcional | {enabled:boolean,gamma:number}; gamma de 0.1 a 4; value es un alias de gamma. | Sin cambios |
| `saturation` | object | Opcional | {enabled:boolean,factor:number}; factor de 0 a 2. | Sin cambios |
| `white_point` | object | Opcional | Ganancias RGB del punto blanco; consulta el modelo de color. | Sin cambios |

Consulta el [modelo de datos](../response-models.md#color) común.

### Ejemplo de solicitud

```json
{
  "enabled": true
}
```

### Respuesta y conclusión

data.success.

### Notas de uso

Lee la configuración actual y cambie solo los campos previstos. La corrección difiere del brillo por dispositivo 0-255.

<a id="ledeffectlist"></a>

## led.effect.list

Enumerar los efectos disponibles

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/effect/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.effects; led.list también indica la compatibilidad del dispositivo.

<a id="ledeffectstart"></a>

## led.effect.start

Iniciar un efecto en el dispositivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/effect/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |
| `effect` | string | Obligatorio | Nombre del efecto de la lista admitida. | Sin valor predeterminado |
| `speed` | integer | Opcional | Velocidad de animación, 1-100. | 50 |
| `color` | string / object / integer | Opcional | Cadena de color, {r,g,b} o el entero decimal equivalente a 0xRRGGBB; componentes de 0 a 255. | Color predeterminado del efecto |

### Ejemplo de solicitud

```json
{
  "device": "matrix",
  "effect": "rainbow",
  "speed": 50
}
```

### Respuesta y conclusión

data.device/effect/speed/started.

### Notas de uso

Confirma que el efecto de ejemplo sea compatible. Un nuevo efecto reemplaza al actual.

<a id="ledeffectstop"></a>

## led.effect.stop

Detener un efecto en el dispositivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/effect/stop`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |

### Ejemplo de solicitud

```json
{
  "device": "matrix"
}
```

### Respuesta y conclusión

data.device/stopped.

<a id="ledfill"></a>

## led.fill

Aplicar un color a todos los LED

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/fill`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |
| `color` | string / object / integer | Obligatorio | Cadena de color, {r,g,b} o el entero decimal equivalente a 0xRRGGBB; componentes de 0 a 255. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "device": "board",
  "color": "#00A0FF"
}
```

### Respuesta y conclusión

data.device/color(r/g/b)/success.

<a id="ledfilterlist"></a>

## led.filter.list

Enumerar los filtros de posprocesamiento disponibles

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/filter/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.filters con name/description.

<a id="ledfilterstart"></a>

## led.filter.start

Aplicar un filtro de posprocesamiento

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/filter/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |
| `filter` | string | Obligatorio | Selecciona uno de led.filter.list. | Sin valor predeterminado |
| `speed` | integer | Opcional | Velocidad del filtro. | 50 |
| `intensity` | number | Opcional | Intensidad. | Filtro predeterminado |
| `amount` | number | Opcional | Intensidad del efecto. | Filtro predeterminado |
| `scale` | number | Opcional | Escala espacial. | Filtro predeterminado |
| `angle` | number | Opcional | Ángulo. | Filtro predeterminado |
| `frequency` | number | Opcional | . | Filtro predeterminado |
| `amplitude` | number | Opcional | Amplitud. | Filtro predeterminado |
| `wavelength` | number | Opcional | Wavelength. | Filtro predeterminado |
| `width` | number | Opcional | Width. | Filtro predeterminado |
| `saturation` | number | Opcional | Saturación. | Filtro predeterminado |
| `levels` | number | Opcional | Número de niveles. | Filtro predeterminado |
| `decay` | number | Opcional | Decaimiento. | Filtro predeterminado |
| `density` | number | Opcional | Densidad. | Filtro predeterminado |

### Ejemplo de solicitud

```json
{
  "device": "matrix",
  "filter": "YOUR_FILTER",
  "speed": 50
}
```

### Respuesta y conclusión

data.device/filter/speed/applied.

### Notas de uso

Las opciones afectan solo a los filtros que las utilizan. Configura el filtro seleccionado en lugar de aplicar todas las opciones indiscriminadamente.

<a id="ledfilterstop"></a>

## led.filter.stop

Detener un filtro de posprocesamiento

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/filter/stop`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |

### Ejemplo de solicitud

```json
{
  "device": "matrix"
}
```

### Respuesta y conclusión

data.device/stopped.

<a id="ledimage"></a>

## led.image

Mostrar una imagen en la matriz

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/image`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Dispositivo de visualización de destino. | matriz |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |
| `center` | boolean | Opcional | Centrar la imagen. | true |

### Ejemplo de solicitud

```json
{
  "device": "matrix",
  "path": "/sdcard/example.png",
  "center": true
}
```

### Respuesta y conclusión

data.device/path/displayed/width/height/animated/frames.

### Notas de uso

Requiere un formato de imagen compatible y un archivo válido. Las lecturas sensibles mantienen las comprobaciones de ruta.

<a id="ledlist"></a>

## led.list

Enumerar los dispositivos LED

**Métodos**: GET / POST
**Ruta**: `/api/v1/led/list`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.devices con name/count/brightness/layout/effects/current; current contiene animation/speed/on/color.

<a id="ledqrcode"></a>

## led.qrcode

Generar y mostrar un código QR

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/qrcode`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Dispositivo de visualización de destino. | matriz |
| `text` | string | Obligatorio | Contenido a codificar. | Sin valor predeterminado |
| `ecc` | string | Opcional | Nivel de corrección de errores L/M/Q/H. | L |
| `bg_image` | string | Opcional | Ruta de imagen de fondo absoluta opcional. | Ninguno |
| `color` | string / object / integer | Opcional | Cadena de color, {r,g,b} o el entero decimal equivalente a 0xRRGGBB; componentes de 0 a 255. | Primer plano predeterminado |

### Ejemplo de solicitud

```json
{
  "device": "matrix",
  "text": "https://example.com",
  "ecc": "L"
}
```

### Respuesta y conclusión

data.device/text/version/size/capacity/displayed.

### Notas de uso

La capacidad depende de la longitud del texto, del tamaño de la matriz y del nivel ECC. La lectura de la imagen de fondo está sujeta a comprobaciones de ruta.

<a id="ledsave"></a>

## led.save

Guardar el estado actual como configuración de arranque

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/save`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Todos los dispositivos LED |

### Ejemplo de solicitud

```json
{
  "device": "board"
}
```

### Respuesta y conclusión

data.device/saved/animation/brightness/speed. Considéralo configuración de arranque solo cuando se haya guardado correctamente.

<a id="ledset"></a>

## led.set

Establecer un rango de píxeles LED

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Obligatorio | Nombre del dispositivo LED: touch/board/matrix; usa led.list como referencia. | Sin valor predeterminado |
| `color` | string / object / integer | Obligatorio | Cadena de color, {r,g,b} o el entero decimal equivalente a 0xRRGGBB; componentes de 0 a 255. | Sin valor predeterminado |
| `index` | integer | Opcional | Primer píxel, numerado desde cero; debe ser inferior al número de píxeles del dispositivo. | 0 |
| `count` | integer | Opcional | Número positivo de píxeles consecutivos; el rango debe caber dentro del dispositivo. | 1 si se proporciona index; si no, todos los píxeles |

### Ejemplo de solicitud

```json
{
  "device": "board",
  "index": 0,
  "count": 1,
  "color": {
    "r": 0,
    "g": 64,
    "b": 128
  }
}
```

### Respuesta y conclusión

data.device/start/count/color (r/g/b)/success.

### Notas de uso

Detiene la animación de la capa de destino y habilita el dispositivo. Si se omiten index/count, rellena todo el dispositivo; index por sí solo escribe un píxel. Un relleno completo actualiza el ajuste de color sólido actual. Guardarlo de forma persistente es un paso separado de configuración de iluminación.

<a id="ledtext"></a>

## led.text

Mostrar texto en la matriz

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/text`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Dispositivo de destino. | matriz |
| `text` | string | Obligatorio | Mostrar texto. | Sin valor predeterminado |
| `font` | string | Opcional | Nombre de fuente compatible. | cjk; carga /sdcard/fonts/<font>.fnt |
| `x` | integer | Opcional | Coordenada horizontal inicial. | Posición predeterminada |
| `y` | integer | Opcional | Coordenada vertical inicial. | Posición predeterminada |
| `align` | string | Opcional | left/center/right. | izquierda |
| `scroll` | string | Opcional | none/left/right/up/down. | ninguno |
| `speed` | integer | Opcional | Velocidad de desplazamiento. | 30 |
| `loop` | boolean | Opcional | Repetir el texto en desplazamiento. | false |
| `invert` | boolean | Opcional | Invertir la salida superpuesta. | false |
| `color` | string / object / integer | Opcional | Cadena de color, {r,g,b} o el entero decimal equivalente a 0xRRGGBB; componentes de 0 a 255. | Blanco |

### Ejemplo de solicitud

```json
{
  "device": "matrix",
  "text": "Ready",
  "scroll": "none"
}
```

### Respuesta y conclusión

data.device/text/font/displayed.

### Notas de uso

La disponibilidad de caracteres depende de la fuente seleccionada.

<a id="ledtextstop"></a>

## led.text.stop

Detener la superposición de texto

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/led/text/stop`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Opcional | Dispositivo de destino. | matriz |

### Ejemplo de solicitud

```json
{
  "device": "matrix"
}
```

### Respuesta y conclusión

data.device/stopped.
