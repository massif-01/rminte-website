# API: Archivos del dispositivo

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [storage.delete](#storagedelete) | Eliminar un archivo o directorio |
| [storage.info](#storageinfo) | Consultar información de un archivo |
| [storage.list](#storagelist) | Enumerar el contenido de un directorio |
| [storage.mkdir](#storagemkdir) | Crear un directorio |
| [storage.mount](#storagemount) | Montar la tarjeta SD |
| [storage.read](#storageread) | Leer el contenido de un archivo |
| [storage.rename](#storagerename) | Renombrar o mover un archivo |
| [storage.status](#storagestatus) | Consultar el estado del almacenamiento |
| [storage.unmount](#storageunmount) | Desmontar la tarjeta SD |

<a id="storagedelete"></a>

## storage.delete

Eliminar un archivo o directorio

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/storage/delete`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example.txt"
}
```

### Respuesta y conclusión

data.deleted contiene la ruta eliminada.

### Notas de uso

Admite las rutas permitidas dentro de /sdcard/, /spiffs/ y /www/. Los directorios pueden eliminarse de forma recursiva; la configuración gestionada y las raíces de almacenamiento siguen protegidas.

<a id="storageinfo"></a>

## storage.info

Consultar información de un archivo

**Métodos**: GET / POST
**Ruta**: `/api/v1/storage/info`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example.txt"
}
```

### Respuesta y conclusión

data.path/name/type/size/modified. modified es la hora Unix del sistema de archivos, en segundos.

<a id="storagelist"></a>

## storage.list

Enumerar el contenido de un directorio

**Métodos**: GET / POST
**Ruta**: `/api/v1/storage/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Opcional | Ruta de directorio absoluta. | /sdcard |
| `recursive` | boolean | Opcional | La recursividad no está implementada; incluso con true solo se enumera este directorio. Es preferible omitir el parámetro. | false |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard"
}
```

### Respuesta y conclusión

data.path/entries con name/type/size, entre otros campos. Enumerar directorios sensibles requiere ADMIN.

<a id="storagemkdir"></a>

## storage.mkdir

Crear un directorio

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/storage/mkdir`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example"
}
```

### Respuesta y conclusión

data.created contiene la ruta del directorio.

<a id="storagemount"></a>

## storage.mount

Montar la tarjeta SD

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/storage/mount`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.status; al montar también se incluye path.

### Notas de uso

Afecta a las operaciones que usan la SD. Finaliza las operaciones de archivos y actualización antes de desmontarla.

<a id="storageread"></a>

## storage.read

Leer el contenido de un archivo

**Métodos**: GET / POST
**Ruta**: `/api/v1/storage/read`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example.txt"
}
```

### Respuesta y conclusión

data.path/size/type/content; content contiene JSON analizado si type=json y una cadena si type=text.

### Notas de uso

Archivo de hasta 8192 bytes. Las rutas sensibles requieren ADMIN. Usa la descarga específica para archivos binarios o grandes.

<a id="storagerename"></a>

## storage.rename

Renombrar o mover un archivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/storage/rename`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `from` | string | Obligatorio | Ruta absoluta original. | Sin valor predeterminado |
| `to` | string | Obligatorio | Ruta absoluta de destino. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "from": "/sdcard/example.txt",
  "to": "/sdcard/renamed.txt"
}
```

### Respuesta y conclusión

data.from/to.

### Notas de uso

Ambas rutas deben estar dentro de las ubicaciones permitidas /sdcard/, /spiffs/ o /www/ y pasar las comprobaciones de rutas administradas. El sistema de archivos y el estado de montaje aún pueden limitar los movimientos.

<a id="storagestatus"></a>

## storage.status

Consultar el estado del almacenamiento

**Métodos**: GET / POST
**Ruta**: `/api/v1/storage/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.sd/spiffs con mounted y la ruta disponible.

<a id="storageunmount"></a>

## storage.unmount

Desmontar la tarjeta SD

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/storage/unmount`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.status; al montar también se incluye path.

### Notas de uso

Afecta a las operaciones que usan la SD. Finaliza las operaciones de archivos y actualización antes de desmontarla.
