# API: Configuración

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [config.delete](#configdelete) | Eliminar un valor de configuración |
| [config.get](#configget) | Consultar un valor de configuración |
| [config.list](#configlist) | Enumerar las claves de configuración |
| [config.module.list](#configmodulelist) | Enumerar todos los módulos de configuración |
| [config.module.reset](#configmodulereset) | Restablecer la configuración de un módulo |
| [config.module.save](#configmodulesave) | Guardar la configuración de un módulo en NVS |
| [config.module.set](#configmoduleset) | Establecer la configuración de un módulo |
| [config.module.show](#configmoduleshow) | Mostrar la configuración de un módulo |
| [config.save](#configsave) | Guardar la configuración en el almacenamiento |
| [config.set](#configset) | Establecer un valor de configuración |

<a id="configdelete"></a>

## config.delete

Eliminar un valor de configuración

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/delete`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `key` | string | Obligatorio | Nombre completo de la clave de configuración. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "key": "example.setting"
}
```

### Respuesta y conclusión

data.key/deleted.

<a id="configget"></a>

## config.get

Consultar un valor de configuración

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/get`
**Acceso mínimo**: Público

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `key` | string | Obligatorio | Nombre completo de la clave de configuración. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "key": "system.language"
}
```

### Respuesta y conclusión

data.key/type/value. Solo key=system.language es accesible sin autenticación; las demás claves requieren ADMIN.

<a id="configlist"></a>

## config.list

Enumerar las claves de configuración

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/list`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.items/file_keys/nvs_keys/total_keys, dependiendo de la configuración registrada.

<a id="configmodulelist"></a>

## config.module.list

Enumerar todos los módulos de configuración

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/module/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.modules con name/version/dirty/nvs_namespace/registered; también puede aparecer información de secuencia global.

<a id="configmodulereset"></a>

## config.module.reset

Restablecer la configuración de un módulo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/module/reset`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatorio | net/dhcp/wifi/nat/led/fan/device/system; consulta cada operación para conocer todas las capacidades. | Sin valor predeterminado |
| `persist` | boolean | Opcional | Guardar de forma persistente el resultado del restablecimiento. | false |

### Ejemplo de solicitud

```json
{
  "module": "system",
  "persist": false
}
```

### Respuesta y conclusión

data.module/reset/persisted.

### Notas de uso

Sobrescribe el módulo seleccionado. Lee y conserva primero los ajustes que necesites.

<a id="configmodulesave"></a>

## config.module.save

Guardar la configuración de un módulo en NVS

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/module/save`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatorio | net/dhcp/wifi/nat/led/fan/device/system; consulta cada operación para conocer todas las capacidades. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "module": "all"
}
```

### Respuesta y conclusión

Resultado de un módulo o de todos con results/success_count/fail_count. Comprueba cada success/error.

<a id="configmoduleset"></a>

## config.module.set

Establecer la configuración de un módulo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/module/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatorio | net/dhcp/wifi/nat/led/fan/device/system; consulta cada operación para conocer todas las capacidades. | Sin valor predeterminado |
| `key` | string | Obligatorio | Nombre completo de la clave de configuración. | Sin valor predeterminado |
| `value` | boolean / number / string | Obligatorio | Valor que coincida con el tipo de campo del módulo. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#module-configuration) común.

### Ejemplo de solicitud

```json
{
  "module": "system",
  "key": "timezone",
  "value": "CST-8"
}
```

### Respuesta y conclusión

data.module/key/success/dirty. Guarda de forma persistente con config.module.save.

<a id="configmoduleshow"></a>

## config.module.show

Mostrar la configuración de un módulo

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/module/show`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatorio | net/dhcp/wifi/nat/led/fan/device/system; consulta cada operación para conocer todas las capacidades. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#module-configuration) común.

### Ejemplo de solicitud

```json
{
  "module": "wifi"
}
```

### Respuesta y conclusión

Un módulo: data.module/config/dirty. all puede devolver los módulos agrupados. Las vistas con un rol inferior a ADMIN omiten las contraseñas.

<a id="configsave"></a>

## config.save

Guardar la configuración en el almacenamiento

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/save`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.saved. Conserva y consulta el estado tras un fallo; no des por supuesto que se haya guardado todo.

<a id="configset"></a>

## config.set

Establecer un valor de configuración

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `key` | string | Obligatorio | Nombre completo de la clave de configuración. | Sin valor predeterminado |
| `value` | boolean / number / string | Obligatorio | Valor de configuración; no es un objeto ni un array. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "key": "system.language",
  "value": "zh-CN"
}
```

### Respuesta y conclusión

data.key/success. Usa config.save por separado para guardar de forma persistente.
