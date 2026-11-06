# API: Claves SSH

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [key.delete](#keydelete) | Eliminar una clave |
| [key.export](#keyexport) | Exportar una clave pública |
| [key.exportPrivate](#keyexportprivate) | Exportar una clave privada, solo si es exportable |
| [key.generate](#keygenerate) | Generar una clave |
| [key.info](#keyinfo) | Consultar información de una clave |
| [key.list](#keylist) | Enumerar todas las claves almacenadas |

<a id="keydelete"></a>

## key.delete

Eliminar una clave

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/key/delete`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | Identificación de clave local. | Sin valor predeterminado |
| `preview` | boolean | Opcional | true previsualiza los hosts y ejecuciones asociados; false elimina. | false |

### Ejemplo de solicitud

```json
{
  "id": "example-key",
  "preview": true
}
```

### Respuesta y conclusión

Previsualización: data.hosts/runs/complete. Eliminación: data.id/deleted.

### Notas de uso

No detiene los procesos remotos ni elimina las claves públicas de authorized_keys. La eliminación puede impedir verificar o detener una ejecución existente.

<a id="keyexport"></a>

## key.export

Exportar una clave pública

**Métodos**: GET / POST
**Ruta**: `/api/v1/key/export`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | Identificación de clave local. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "id": "example-key"
}
```

### Respuesta y conclusión

data.id/type/public_key/comment; public_key es texto de OpenSSH.

### Notas de uso

Las lecturas de claves ocultas requieren el rol adecuado.

<a id="keyexportprivate"></a>

## key.exportPrivate

Exportar una clave privada, solo si es exportable

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/key/exportPrivate`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | Identificación de clave local. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "id": "example-key"
}
```

### Respuesta y conclusión

data.id/type/private_key/comment/warning.

### Notas de uso

Requiere ADMIN y exportable=true; las claves no son exportables por defecto. Trata la respuesta como un secreto; no la incluyas en registros ordinarios.

<a id="keygenerate"></a>

## key.generate

Generar una clave

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/key/generate`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | Identificación de clave local. | Sin valor predeterminado |
| `type` | string | Opcional | rsa2048/rsa4096/ec256/ecdsa/ec384. | rsa2048 |
| `comment` | string | Opcional | Comentario de la clave pública. | Vacío |
| `alias` | string | Opcional | Alias para mostrar. | Vacío |
| `hidden` | boolean | Opcional | Ocultar la clave. | false |
| `exportable` | boolean | Opcional | Permitir la exportación posterior de la clave privada. | false |
| `request_id` | string | Opcional | Valor opcional de correlación de solicitudes, de menos de 32 bytes; solo admite caracteres alfanuméricos y guiones. | Ninguno |

### Ejemplo de solicitud

```json
{
  "id": "example-key",
  "type": "ec256",
  "exportable": false
}
```

### Respuesta y conclusión

data.generated/id/type; un fallo puede incluir failed_stage/esp_error/cleanup_complete/cleanup_error.

### Notas de uso

Comprueba generated. Un ID existente o un fallo de generación producen un error; las claves no se sobrescriben automáticamente.

<a id="keyinfo"></a>

## key.info

Consultar información de una clave

**Métodos**: GET / POST
**Ruta**: `/api/v1/key/info`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | Identificación de clave local. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "id": "example-key"
}
```

### Respuesta y conclusión

data.id/type/type_desc/comment/alias/created/last_used/has_public_key/exportable/hidden.

<a id="keylist"></a>

## key.list

Enumerar todas las claves almacenadas

**Métodos**: GET / POST
**Ruta**: `/api/v1/key/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.keys/count/max_keys; metadatos id/type/type_desc/comment/alias/created/last_used/has_pubkey/exportable/hidden.

### Notas de uso

Los roles inferiores a ADMIN solo reciben los metadatos de claves permitidos. Las listas no contienen claves privadas.
