# API: Certificados del dispositivo

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [cert.delete](#certdelete) | Eliminar todas las credenciales PKI |
| [cert.generate_csr](#certgenerate_csr) | Generar una solicitud de firma de certificado |
| [cert.generate_keypair](#certgenerate_keypair) | Generar un par de claves ECDSA P-256 |
| [cert.get_certificate](#certget_certificate) | Obtener el certificado del dispositivo en formato PEM |
| [cert.install](#certinstall) | Instalar un certificado firmado |
| [cert.install_ca](#certinstall_ca) | Instalar una cadena de certificados de CA |
| [cert.status](#certstatus) | Consultar el estado de los certificados y del servicio de diagnóstico |

<a id="certdelete"></a>

## cert.delete

Eliminar todas las credenciales PKI

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/cert/delete`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `confirm` | boolean | Obligatorio | true explícito confirma la eliminación del material PKI local. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "confirm": true
}
```

### Respuesta y conclusión

data.success/message.

### Notas de uso

Puede cambiar la identidad del servicio de diagnóstico HTTPS independiente o devolverla a un estado de certificado inicial. No revoca un certificado en su emisor.

<a id="certgenerate_csr"></a>

## cert.generate_csr

Generar una solicitud de firma de certificado

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/cert/generate_csr`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device_id` | string | Opcional | Identificador de dispositivo para el sujeto del certificado. | ID de dispositivo configurado por compilación |
| `organization` | string | Opcional | Nombre de la organización. | RMinte |
| `org_unit` | string | Opcional | Unidad organizativa. | Dispositivo |

### Ejemplo de solicitud

```json
{
  "device_id": "YOUR_DEVICE_ID",
  "organization": "YOUR_ORG",
  "org_unit": "Device"
}
```

### Respuesta y conclusión

data.success/csr_pem. Entrega la CSR a un emisor de confianza; no contiene ninguna clave privada.

<a id="certgenerate_keypair"></a>

## cert.generate_keypair

Generar un par de claves ECDSA P-256

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/cert/generate_keypair`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `force` | boolean | Opcional | Solicitar regeneración cuando ya exista material de identidad. | false |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.success/message.

### Notas de uso

Sustituir la clave de identidad puede hacer que el certificado existente deje de corresponder a ella. Planifica primero el mantenimiento. No es una clave SSH de key.*.

<a id="certget_certificate"></a>

## cert.get_certificate

Obtener el certificado del dispositivo en formato PEM

**Métodos**: GET / POST
**Ruta**: `/api/v1/cert/get_certificate`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.cert_pem es el certificado del dispositivo en formato PEM, sin clave privada.

<a id="certinstall"></a>

## cert.install

Instalar un certificado firmado

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/cert/install`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `cert_pem` | string | Obligatorio | Certificado PEM de hasta 3999 bytes de contenido; debe corresponder a la clave privada existente del dispositivo. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "cert_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### Respuesta y conclusión

data.success/message/cert_info con subject_cn/issuer_cn/not_before/not_after/validity/time_ready y información de expiración.

### Notas de uso

Comprueba por separado el almacenamiento y la validez del certificado y la identidad cargada por el servicio de diagnóstico HTTPS independiente. Las API de gestión siguen en HTTP80. Consulta cert.status después de la instalación.

<a id="certinstall_ca"></a>

## cert.install_ca

Instalar una cadena de certificados de CA

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/cert/install_ca`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `ca_pem` | string | Obligatorio | Cadena de CA de confianza en formato PEM; se aplican comprobaciones de formato y capacidad. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "ca_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### Respuesta y conclusión

data.success/message.

### Notas de uso

El material de CA afecta la confianza. Instale únicamente cadenas verificadas por el administrador.

<a id="certstatus"></a>

## cert.status

Consultar el estado de los certificados y del servicio de diagnóstico

**Métodos**: GET / POST
**Ruta**: `/api/v1/cert/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#certificate) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.has_private_key/has_certificate/has_ca_chain; la información del certificado, time_ready/validity/blocked_by y el estado de ejecución del servicio de diagnóstico HTTPS independiente se informan por separado. Consulta el modelo de respuesta de certificados.
