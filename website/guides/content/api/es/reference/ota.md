# API: Actualización y recuperación

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [ota.abort](#otaabort) | Solicitar la cancelación de una actualización del firmware |
| [ota.partitions](#otapartitions) | Consultar las particiones de actualización |
| [ota.progress](#otaprogress) | Consultar el progreso de actualización del firmware |
| [ota.rollback](#otarollback) | Revertir el firmware |
| [ota.server.get](#otaserverget) | Consultar la configuración del servidor de actualizaciones |
| [ota.server.set](#otaserverset) | Establecer la configuración del servidor de actualizaciones |
| [ota.start_file](#otastart_file) | Iniciar una actualización de firmware desde la SD |
| [ota.start_url](#otastart_url) | Iniciar una actualización de firmware desde una URL |
| [ota.status](#otastatus) | Consultar el estado de actualización del firmware |
| [ota.test_connection](#otatest_connection) | Probar una URL de actualización |
| [ota.upgrade_file](#otaupgrade_file) | Alias de compatibilidad de ota.start_file |
| [ota.upgrade_url](#otaupgrade_url) | Alias de compatibilidad de ota.start_url |
| [ota.upload_abort](#otaupload_abort) | Abortar el control de carga del firmware |
| [ota.upload_begin](#otaupload_begin) | Iniciar el control de carga del firmware |
| [ota.upload_end](#otaupload_end) | Finalizar el control de carga del firmware |
| [ota.validate](#otavalidate) | Confirmar que el firmware en ejecución funciona correctamente |
| [ota.version](#otaversion) | Consultar la versión del firmware |
| [ota.www.abort](#otawwwabort) | Solicitar la cancelación de una actualización WWW |
| [ota.www.progress](#otawwwprogress) | Consultar el progreso de actualización WWW |
| [ota.www.start](#otawwwstart) | Iniciar una actualización WWW desde una URL |
| [ota.www.start_sdcard](#otawwwstart_sdcard) | Iniciar una actualización WWW desde la SD |

<a id="otaabort"></a>

## ota.abort

Solicitar la cancelación de una actualización del firmware

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/abort`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.aborted=true; consulta el progreso correspondiente para confirmar el estado.

### Notas de uso

Actúa sobre la actualización actual, no como una tarea privada. No inicie inmediatamente otra actualización mientras el estado no esté claro.

<a id="otapartitions"></a>

## ota.partitions

Consultar las particiones de actualización

**Métodos**: GET / POST
**Ruta**: `/api/v1/ota/partitions`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.running/next contienen cada uno label/address/size/is_bootable; las particiones arrancables incluyen version/project. También se incluye can_rollback.

<a id="otaprogress"></a>

## ota.progress

Consultar el progreso de actualización del firmware

**Métodos**: GET / POST
**Ruta**: `/api/v1/ota/progress`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.state/percent/total_size/received_size/message. state puede ser idle/checking/downloading/verifying/writing/pending_reboot/error.

### Notas de uso

Es el progreso de todo el dispositivo, no el resultado de una tarea privada por sesión. Consúltalo periódicamente después de iniciar. Llegar al 100 % no demuestra que el dispositivo esté ejecutando la nueva versión.

<a id="otarollback"></a>

## ota.rollback

Revertir el firmware

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/rollback`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Intenta seleccionar la partición de reversión y reiniciar; la conexión puede cerrarse antes de una respuesta. Si se devuelve, data.rolling_back=true.

### Notas de uso

Comprueba primero ota.partitions.can_rollback. Tras la reversión, inicia sesión de nuevo y verifica la compatibilidad de versión y configuración. No se admite no_reboot.

<a id="otaserverget"></a>

## ota.server.get

Consultar la configuración del servidor de actualizaciones

**Métodos**: GET / POST
**Ruta**: `/api/v1/ota/server/get`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

ADMIN puede leer data.url/configured; los roles inferiores solo reciben configured.

<a id="otaserverset"></a>

## ota.server.set

Establecer la configuración del servidor de actualizaciones

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/server/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatorio | URL del servidor de actualizaciones, de hasta 255 caracteres; una cadena vacía la borra. | Sin valor predeterminado |
| `save` | boolean | Opcional | Guardar la dirección del servidor de forma persistente. | false |

### Ejemplo de solicitud

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "save": true
}
```

### Respuesta y conclusión

data.url/saved.

### Notas de uso

La configuración de la dirección no comienza una actualización. La URL WWW puede derivarse de esta dirección.

<a id="otastart_file"></a>

## ota.start_file

Iniciar una actualización de firmware desde la SD

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/start_file`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `file` | string | Se requiere file o path | Ruta absoluta del archivo de firmware; usa preferentemente file. | Sin valor predeterminado |
| `path` | string | Opcional | Alias de file. | No se suministra |
| `auto_reboot` | boolean | Opcional | Reiniciar automáticamente cuando finalice la actualización del firmware. | true |
| `no_reboot` | boolean | Opcional | Alias inverso de auto_reboot; tiene prioridad si se proporciona. | No sobrescribir |
| `allow_downgrade` | boolean | Opcional | Permitir una versión anterior; siguen aplicándose las comprobaciones de la imagen. | false |
| `skip_verify` | boolean | Opcional | Opción de compatibilidad para archivos SD. No hay conexión TLS; no omite las comprobaciones de integridad del firmware. | false |

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### Respuesta y conclusión

data.started/path.

### Notas de uso

Un inicio correcto significa que la solicitud ha comenzado. Consulta ota.progress y verifica ota.status después del reinicio. Usa una imagen completa que corresponda a este hardware y distribución de particiones.

<a id="otastart_url"></a>

## ota.start_url

Iniciar una actualización de firmware desde una URL

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/start_url`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatorio | URL HTTP o HTTPS de la imagen completa del firmware, de hasta 2048 bytes. | Sin valor predeterminado |
| `auto_reboot` | boolean | Opcional | Reiniciar automáticamente cuando finalice la actualización del firmware. | true |
| `no_reboot` | boolean | Opcional | Alias inverso de auto_reboot; tiene prioridad si se proporciona. | No sobrescribir |
| `allow_downgrade` | boolean | Opcional | Permitir una versión anterior; siguen aplicándose las comprobaciones de la imagen. | false |
| `skip_verify` | boolean | Opcional | Solicita comprobaciones menos estrictas del servidor HTTPS, sujetas a la configuración TLS del firmware; la conexión aún puede fallar. Se mantienen las comprobaciones de integridad de la imagen. Normalmente debe ser false. | false |

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### Respuesta y conclusión

data.started/url.

### Notas de uso

Un inicio correcto significa que la solicitud ha comenzado. Consulta ota.progress y verifica ota.status después del reinicio. Usa una imagen completa que corresponda a este hardware y distribución de particiones.

<a id="otastatus"></a>

## ota.status

Consultar el estado de actualización del firmware

**Métodos**: GET / POST
**Ruta**: `/api/v1/ota/status`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.state/running/next/pending_verify; rollback_timeout si la verificación está pendiente. Las particiones incluyen label/address/size y la información de versión disponible.

### Notas de uso

size se expresa en bytes. Después de escribir, reinicia y confirma la versión en ejecución.

<a id="otatest_connection"></a>

## ota.test_connection

Probar una URL de actualización

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/test_connection`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatorio | URL del archivo de actualización que se quiere probar. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "url": "http://updates.example.com/firmware.bin"
}
```

### Respuesta y conclusión

data contiene success y el diagnóstico de conexión.

### Notas de uso

Realiza una solicitud de red real. Tener conectividad no demuestra que la imagen se pueda instalar.

<a id="otaupgrade_file"></a>

## ota.upgrade_file

Alias de compatibilidad de ota.start_file

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/upgrade_file`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `file` | string | Se requiere file o path | Ruta absoluta del archivo de firmware; usa preferentemente file. | Sin valor predeterminado |
| `path` | string | Opcional | Alias de file. | No se suministra |
| `auto_reboot` | boolean | Opcional | Reiniciar automáticamente cuando finalice la actualización del firmware. | true |
| `no_reboot` | boolean | Opcional | Alias inverso de auto_reboot; tiene prioridad si se proporciona. | No sobrescribir |
| `allow_downgrade` | boolean | Opcional | Permitir una versión anterior; siguen aplicándose las comprobaciones de la imagen. | false |
| `skip_verify` | boolean | Opcional | Opción de compatibilidad para archivos SD. No hay conexión TLS; no omite las comprobaciones de integridad del firmware. | false |

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### Respuesta y conclusión

data.started/path.

### Notas de uso

Alias de compatibilidad con los parámetros, permisos y resultados de ota.start_file.

<a id="otaupgrade_url"></a>

## ota.upgrade_url

Alias de compatibilidad de ota.start_url

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/upgrade_url`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatorio | URL HTTP o HTTPS de la imagen completa del firmware, de hasta 2048 bytes. | Sin valor predeterminado |
| `auto_reboot` | boolean | Opcional | Reiniciar automáticamente cuando finalice la actualización del firmware. | true |
| `no_reboot` | boolean | Opcional | Alias inverso de auto_reboot; tiene prioridad si se proporciona. | No sobrescribir |
| `allow_downgrade` | boolean | Opcional | Permitir una versión anterior; siguen aplicándose las comprobaciones de la imagen. | false |
| `skip_verify` | boolean | Opcional | Solicita comprobaciones menos estrictas del servidor HTTPS, sujetas a la configuración TLS del firmware; la conexión aún puede fallar. Se mantienen las comprobaciones de integridad de la imagen. Normalmente debe ser false. | false |

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### Respuesta y conclusión

data.started/url.

### Notas de uso

Alias ​​de compatibilidad con los parámetros, permisos y resultados de ota.start_url.

<a id="otaupload_abort"></a>

## ota.upload_abort

Abortar el control de carga del firmware

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/upload_abort`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.aborted.

<a id="otaupload_begin"></a>

## ota.upload_begin

Iniciar el control de carga del firmware

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/upload_begin`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `size` | integer | Obligatorio | Recuento total positivo de bytes de firmware, también limitado por la partición de destino. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "size": 1048576
}
```

### Respuesta y conclusión

data.ready/expected_size.

### Notas de uso

Controla una carga. No hay una API pública upload_write para datos, por lo que begin/end no pueden transferir firmware por sí solos. Las integraciones ordinarias deben usar la ruta binaria de archivo completo.

<a id="otaupload_end"></a>

## ota.upload_end

Finalizar el control de carga del firmware

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/upload_end`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `auto_reboot` | boolean | Opcional | Reiniciar automáticamente al finalizar. | true |

### Ejemplo de solicitud

```json
{
  "auto_reboot": false
}
```

### Respuesta y conclusión

data.completed/reboot_pending.

### Notas de uso

Requiere una carga activa con los datos completos. Falla si no hay una carga activa.

<a id="otavalidate"></a>

## ota.validate

Confirmar que el firmware en ejecución funciona correctamente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/validate`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.validated.

### Notas de uso

La confirmación cambia el estado de reversión. Primero confirme la versión en ejecución y el estado de la aplicación.

<a id="otaversion"></a>

## ota.version

Consultar la versión del firmware

**Métodos**: GET / POST
**Ruta**: `/api/v1/ota/version`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.version/project/compile_date/compile_time/idf_version.

<a id="otawwwabort"></a>

## ota.www.abort

Solicitar la cancelación de una actualización WWW

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/www/abort`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.aborted=true; consulta el progreso correspondiente para confirmar el estado.

### Notas de uso

Actúa sobre la actualización actual, no como una tarea privada. No inicie inmediatamente otra actualización mientras el estado no esté claro.

<a id="otawwwprogress"></a>

## ota.www.progress

Consultar el progreso de actualización WWW

**Métodos**: GET / POST
**Ruta**: `/api/v1/ota/www/progress`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.state/percent/total/received/message/running. La finalización se indica con state=completed y running=false.

### Notas de uso

Es el progreso de todo el dispositivo, no el resultado de una tarea privada por sesión. Consúltalo periódicamente después de iniciar. Llegar al 100 % no demuestra que el dispositivo esté ejecutando la nueva versión.

<a id="otawwwstart"></a>

## ota.www.start

Iniciar una actualización WWW desde una URL

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/www/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Opcional | URL HTTP o HTTPS de www.bin. Limita la URL completa a 255 bytes; una entrada mayor puede no conservarse íntegra. | Derivado del servidor de actualización configurado |
| `skip_verify` | boolean | Opcional | Solicita comprobaciones menos estrictas del servidor HTTPS, sujetas a la configuración TLS del firmware; la conexión aún puede fallar. Se mantienen las comprobaciones de integridad de la imagen. Normalmente debe ser false. | false |

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{
  "url": "http://updates.example.com/www.bin"
}
```

### Respuesta y conclusión

data.status=started/url.

### Notas de uso

Usa el www.bin completo que corresponda al firmware, no un archivo HTML individual. Después consulta ota.www.progress.

<a id="otawwwstart_sdcard"></a>

## ota.www.start_sdcard

Iniciar una actualización WWW desde la SD

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ota/www/start_sdcard`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `file` | string | Obligatorio | Ruta de archivo absoluta de la imagen WWW. Limítelo a 255 bytes; Es posible que las entradas más largas no se conserven en su totalidad. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#ota) común.

### Ejemplo de solicitud

```json
{
  "file": "/sdcard/www.bin"
}
```

### Respuesta y conclusión

data.status=started/file.
