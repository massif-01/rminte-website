# API: Temperatura

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [temp.bind](#tempbind) | Vincular o desvincular una temperatura a una variable del sistema |
| [temp.manual](#tempmanual) | Establecer o consultar el modo de temperatura manual |
| [temp.read](#tempread) | Consultar la temperatura actual |
| [temp.select](#tempselect) | Establecer o consultar la fuente de temperatura preferida |
| [temp.sources](#tempsources) | Consultar información de todas las fuentes de temperatura |
| [temp.status](#tempstatus) | Consultar el estado del sistema de temperatura |

<a id="tempbind"></a>

## temp.bind

Vincular o desvincular una temperatura a una variable del sistema

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/temp/bind`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `variables` | array | Opcional | Hasta 8 entradas {name,weight}; un array vacío elimina las vinculaciones a varias variables. | Sin cambios |
| `variable` | string / null | Opcional | Vinculación heredada a una sola variable; null o una cadena vacía la elimina. | Sin cambios |

### Ejemplo de solicitud

```json
{
  "variables": [
    {
      "name": "compute.temperature",
      "weight": 1
    }
  ]
}
```

### Respuesta y conclusión

data.bound_variables, estado de vinculación, recuentos y pesos válidos, weighted_temp_c y partial_stale/valid. Se filtran los valores de variables no autorizados.

### Notas de uso

Las variables deben existir y contener temperaturas numéricas. ADMIN puede consultar omitiendo los campos de vinculación; enviar variables o variable para cambiar o eliminar vinculaciones requiere ROOT.

<a id="tempmanual"></a>

## temp.manual

Establecer o consultar el modo de temperatura manual

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/temp/manual`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Opcional | Activa o desactiva el modo de temperatura manual. | Sin cambios |
| `temperature_c` | number | Opcional | Grados Celsius, de -50.0 a 150.0. | Sin cambios |
| `temperature` | number | Opcional | Alias de temperature_c; es preferible enviar un solo campo de temperatura. | Sin cambios |
| `temperature_01c` | integer | Opcional | Décimas de grado Celsius, de -500 a 1500; se usa si no se proporciona un campo en grados Celsius. | Sin cambios |

### Ejemplo de solicitud

```json
{
  "enable": true,
  "temperature_c": 45
}
```

### Respuesta y conclusión

data.manual_mode/current_temp_c/current_temp_01c/active_source.

### Notas de uso

Modifica la entrada de temperatura usada por el control. Desactiva explícitamente el modo manual y vuelve a consultar el estado al terminar la prueba.

<a id="tempread"></a>

## temp.read

Consultar la temperatura actual

**Métodos**: GET / POST
**Ruta**: `/api/v1/temp/read`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `source` | string | Opcional | default/local o sensor_local/agx o agx_auto/variable/manual. | Fuente activa actual |

Consulta el [modelo de datos](../response-models.md#temperature) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.temperature_c/temperature_01c/source/timestamp_ms/valid; las fuentes basadas en variables pueden incluir partial_stale y recuentos o pesos de las vinculaciones.

<a id="tempselect"></a>

## temp.select

Establecer o consultar la fuente de temperatura preferida

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/temp/select`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `source` | string | Opcional | auto/agx/sensor/variable. | Solo consulta |

### Ejemplo de solicitud

```json
{
  "source": "auto"
}
```

### Respuesta y conclusión

data.preferred_source/active_source/temperature_c/valid.

<a id="tempsources"></a>

## temp.sources

Consultar información de todas las fuentes de temperatura

**Métodos**: GET / POST
**Ruta**: `/api/v1/temp/sources`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Temperatura y validez actuales, junto con los proveedores. Las entradas incluyen name/type/active/valid/stale/last_value_c/last_value_01c/last_update_ms/age_ms/update_count.

### Notas de uso

age_ms=null indica que no hay una hora de actualización utilizable. Las fuentes basadas en variables también informan de fallos parciales y recuentos o pesos válidos.

<a id="tempstatus"></a>

## temp.status

Consultar el estado del sistema de temperatura

**Métodos**: GET / POST
**Ruta**: `/api/v1/temp/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#temperature) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.initialized/manual_mode/active_source/preferred_source/temperature_c/temperature_01c/timestamp_ms/valid, posiblemente bound_variable.
