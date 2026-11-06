# API: Paquetes de configuración

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [config.pack.apply](#configpackapply) | Aplicación de configuración genérica no admitida |
| [config.pack.content](#configpackcontent) | Descifrar y obtener el contenido de un paquete importado |
| [config.pack.export](#configpackexport) | Exportar la configuración como .tscfg cifrado |
| [config.pack.export_cert](#configpackexport_cert) | Exportar el certificado del dispositivo para el cifrado |
| [config.pack.import](#configpackimport) | Validar un archivo .tscfg cargado en su ubicación actual |
| [config.pack.info](#configpackinfo) | Consultar información del sistema de paquetes de configuración |
| [config.pack.list](#configpacklist) | Enumerar los archivos .tscfg de un directorio |
| [config.pack.verify](#configpackverify) | Verificar la firma de un paquete .tscfg |

<a id="configpackapply"></a>

## config.pack.apply

Aplicación de configuración genérica no admitida

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/pack/apply`
**Acceso mínimo**: ADMIN

**Operación no admitida.** El nombre se conserva para rechazar explícitamente llamadas obsoletas.

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatorio | Ruta absoluta del dispositivo; la configuración gestionada y los archivos sensibles tienen restricciones adicionales. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Respuesta y conclusión

data.success=false con result_code/reason de operación no admitida. No se aplica ninguna configuración, aunque code=0 en el nivel superior.

### Notas de uso

No se admite aplicar una configuración genérica. Usa el flujo de importación específico del objeto.

<a id="configpackcontent"></a>

## config.pack.content

Descifrar y obtener el contenido de un paquete importado

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/pack/content`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre del paquete utilizado por el almacenamiento del paquete. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "name": "example"
}
```

### Respuesta y conclusión

data.name/content/content_raw; content es estructurado si puede analizarse como JSON.

### Notas de uso

Solo para lecturas administrativas de confianza. No incluyas secretos de configuración en registros públicos.

<a id="configpackexport"></a>

## config.pack.export

Exportar la configuración como .tscfg cifrado

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/pack/export`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre del paquete. | Sin valor predeterminado |
| `content` | object / string | Obligatorio | Contenido de configuración para cifrar; debe poder codificarse en JSON. | Sin valor predeterminado |
| `recipient_cert` | string | Obligatorio | Certificado PEM del dispositivo destinatario. | Sin valor predeterminado |
| `description` | string | Opcional | Descripción del paquete. | Vacío |
| `save_path` | string | Opcional | Ruta de guardado SD opcional. | No guardar un archivo en el dispositivo |

### Ejemplo de solicitud

```json
{
  "name": "example",
  "content": {
    "example": true
  },
  "recipient_cert": "RECIPIENT_CERTIFICATE_PEM"
}
```

### Respuesta y conclusión

data.tscfg/filename/size; si se solicitó guardar un archivo y se guardó correctamente, también se incluye saved_path.

### Notas de uso

Requiere la capacidad local de exportación Developer. El destino sigue teniendo que validar e importar explícitamente el paquete.

<a id="configpackexport_cert"></a>

## config.pack.export_cert

Exportar el certificado del dispositivo para el cifrado

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/pack/export_cert`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.certificate/fingerprint/cn; material público para cifrar a este dispositivo, no una clave privada.

<a id="configpackimport"></a>

## config.pack.import

Validar un archivo .tscfg cargado en su ubicación actual

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/pack/import`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `content` | string | Se requiere content o path | Texto JSON sin formato del paquete, no una carga útil Base64 arbitraria. | Sin valor predeterminado |
| `path` | string | Se requiere content o path | Ruta absoluta de un paquete cargado en el dispositivo. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Respuesta y conclusión

Datos de éxito: valid/result_code/result_message/reason/path/saved_path, name/description/source_file/target_device/created_at y signature. Los paquetes inválidos devuelven un error de operación.

### Notas de uso

content puede guardar un paquete verificado en el almacenamiento de paquetes; path lo valida en su ubicación actual. Ninguno aplica la configuración de gestión. Usa la importación del objeto correspondiente.

<a id="configpackinfo"></a>

## config.pack.info

Consultar información del sistema de paquetes de configuración

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/pack/info`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.can_export/device_type/cert_fingerprint/cert_cn/cert_ou/pack_version/algorithm.

<a id="configpacklist"></a>

## config.pack.list

Enumerar los archivos .tscfg de un directorio

**Métodos**: GET / POST
**Ruta**: `/api/v1/config/pack/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `path` | string | Opcional | Ruta de directorio absoluta. | /sdcard/config |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/config"
}
```

### Respuesta y conclusión

data.files/count; las entradas incluyen name/path/size/mtime/valid y la información disponible del emisor.

<a id="configpackverify"></a>

## config.pack.verify

Verificar la firma de un paquete .tscfg

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/config/pack/verify`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `content` | string | Se requiere content o path | Texto JSON sin formato del paquete, no una carga útil Base64 arbitraria. | Sin valor predeterminado |
| `path` | string | Se requiere content o path | Ruta absoluta de un paquete cargado en el dispositivo. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Respuesta y conclusión

data.valid/result_code/result_message/reason/signature. signature contiene valid/is_official/signer_cn/signer_ou/signed_at.

### Notas de uso

Comprueba los campos anidados valid/reason. Una validación genérica no demuestra que la configuración se haya importado.
