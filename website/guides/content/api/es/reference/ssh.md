# API: Conexiones y comandos SSH

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [ssh.cancel](#sshcancel) | Cancelar una sesión SSH de ejecución en curso |
| [ssh.commands.add](#sshcommandsadd) | Añadir o actualizar la configuración de un comando SSH |
| [ssh.commands.export](#sshcommandsexport) | Exportar la configuración de un comando SSH como .tscfg |
| [ssh.commands.get](#sshcommandsget) | Consultar la configuración de un comando SSH por ID |
| [ssh.commands.import](#sshcommandsimport) | Importar la configuración de un comando SSH desde .tscfg |
| [ssh.commands.list](#sshcommandslist) | Enumerar todas las configuraciones de comandos SSH |
| [ssh.commands.remove](#sshcommandsremove) | Eliminar la configuración de un comando SSH |
| [ssh.commands.update](#sshcommandsupdate) | Actualizar una configuración de comandos SSH existente |
| [ssh.copyid](#sshcopyid) | Instalar una clave pública en el servidor remoto |
| [ssh.exec](#sshexec) | Ejecutar un comando remoto mediante SSH |
| [ssh.exec_status](#sshexec_status) | Consultar el resultado SSH actual o más reciente de la sesión solicitante |
| [ssh.exec_stream](#sshexec_stream) | Ejecutar un comando remoto con salida en streaming por WebSocket |
| [ssh.hosts.add](#sshhostsadd) | Añadir la configuración de un host SSH |
| [ssh.hosts.export](#sshhostsexport) | Exportar la configuración de un host SSH como .tscfg |
| [ssh.hosts.get](#sshhostsget) | Consultar la configuración de un host SSH por ID |
| [ssh.hosts.import](#sshhostsimport) | Importar la configuración de un host SSH desde .tscfg |
| [ssh.hosts.list](#sshhostslist) | Enumerar todas las configuraciones de hosts SSH |
| [ssh.hosts.remove](#sshhostsremove) | Eliminar la configuración de un host SSH |
| [ssh.hosts.update](#sshhostsupdate) | Actualizar una configuración de hosts SSH existente |
| [ssh.keygen](#sshkeygen) | Generar un par de claves SSH |
| [ssh.revoke](#sshrevoke) | Revocar una clave pública instalada en el servidor remoto |
| [ssh.services.start](#sshservicesstart) | Iniciar un servicio gestionado guardado |
| [ssh.test](#sshtest) | Probar la conexión SSH |

<a id="sshcancel"></a>

## ssh.cancel

Cancelar una sesión SSH de ejecución en curso

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/cancel`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `session_id` | integer | Obligatorio | ID de ejecución devuelto por ssh.exec_stream. | Sin valor predeterminado |
| `boot_id` | string | Opcional | Si se proporciona junto con result_key, debe coincidir con los datos de seguimiento del inicio. La sesión que inició la ejecución puede omitir ambos. | Sin valor predeterminado |
| `result_key` | string | Opcional | Clave privada de seguimiento proporcionada junto con boot_id. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "session_id": 1
}
```

### Respuesta y conclusión

data.cancelled=true acepta la solicitud de cancelación; sigue consultando el estado final.

### Notas de uso

Requiere la sesión de inicio de sesión que inició la ejecución; otra sesión root no puede cancelarla. Si se proporcionan datos de seguimiento, se comprueba que el par esté completo y coincida. cancelled solo confirma la intención de cancelar; exec_status sigue necesitando los datos de seguimiento completos.

<a id="sshcommandsadd"></a>

## ssh.commands.add

Añadir o actualizar la configuración de un comando SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/commands/add`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="sshcommandsexport"></a>

## ssh.commands.export

Exportar la configuración de un comando SSH como .tscfg

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/commands/export`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `recipient_cert` | string | Opcional | Certificado PEM del destinatario; si se omite, cifra para este dispositivo. | Certificado de este dispositivo |
| `include_host` | boolean | Opcional | Incluya la definición de host dependiente en la exportación. | false |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{
  "id": "example"
}
```

### Respuesta y conclusión

data.tscfg/filename. La exportación también depende de la identidad Developer del dispositivo y del material del destinatario.

### Notas de uso

El cliente guarda el texto de paquete devuelto. No se convierte en la configuración activa de otro dispositivo automáticamente.

<a id="sshcommandsget"></a>

## ssh.commands.get

Consultar la configuración de un comando SSH por ID

**Métodos**: GET / POST
**Ruta**: `/api/v1/ssh/commands/get`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{
  "id": "example"
}
```

### Respuesta y conclusión

Un comando SSH y active_version; los campos se filtran para roles inferiores a ADMIN.

<a id="sshcommandsimport"></a>

## ssh.commands.import

Importar la configuración de un comando SSH desde .tscfg

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/commands/import`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Obligatorio | Texto JSON del paquete completo proporcionado como una cadena. | Sin valor predeterminado |
| `preview` | boolean | Opcional | true solo previsualiza. | false |
| `active_version` | string | Necesario para aplicar | Versión de configuración actual. | La previsualización puede usar la versión actual |
| `overwrite` | boolean | Opcional | Permite sustituir un objeto existente por contenido diferente. | false |
| `expected_credential` | integer | Necesario para aplicar | credential_generation devuelto por vista previa. | Ninguno |
| `expected_digest` | string | Necesario para aplicar | package_digest devuelto por vista previa. | Ninguno |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Respuesta y conclusión

Modelo de resultado de configuración. La previsualización añade valid/items/exists/unchanged/package_digest/credential_generation; aplicar añade imported/overwritten/restart_required.

### Notas de uso

Previsualiza primero y aplica después el mismo paquete con su resumen, generación de credenciales y versión de configuración. Previsualiza de nuevo si cambian las condiciones.

<a id="sshcommandslist"></a>

## ssh.commands.list

Enumerar todas las configuraciones de comandos SSH

**Métodos**: GET / POST
**Ruta**: `/api/v1/ssh/commands/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `offset` | integer | Opcional | Desplazamiento de retorno no negativo. | 0 |
| `limit` | integer | Opcional | Número de elementos que se devolverán; omitirlo no solicita truncamiento. | Todo |
| `host_id` | string | Opcional | Filtrar por ID de host guardado. | Todo |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.commands/count/total/active_version/load_error/paused; los roles inferiores a ADMIN reciben metadatos restringidos.

<a id="sshcommandsremove"></a>

## ssh.commands.remove

Eliminar la configuración de un comando SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/commands/remove`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `preview` | boolean | Opcional | true previsualiza el impacto; false realiza la eliminación. | false |
| `replacement_id` | string | Opcional | ID de objeto de sustitución para referencias dependientes. | Ninguno |
| `mode` | string | Opcional | cascade solicita tratar las dependencias en cascada; elige una estrategia en lugar de combinar force y replacement. | Eliminación ordinaria |
| `force` | boolean | Opcional | Fuerce la eliminación de un objeto al que se hace referencia solo después de obtener una vista previa del impacto. | false |
| `pause_automation` | boolean | Opcional | Pausar la automatización antes de la operación. | false |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Respuesta y conclusión

Modelo de resultado de configuración, más impact con las referencias afectadas.

### Notas de uso

La eliminación de definiciones locales no detiene automáticamente los programas remotos ni revoca las claves públicas.

<a id="sshcommandsupdate"></a>

## ssh.commands.update

Actualizar una configuración de comandos SSH existente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/commands/update`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#ssh-commands) común.

### Ejemplo de solicitud

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="sshcopyid"></a>

## ssh.copyid

Instalar una clave pública en el servidor remoto

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/copyid`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección remota. | Sin valor predeterminado |
| `user` | string | Obligatorio | Cuenta remota. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto SSH. | 22 |
| `password` | string | Obligatorio | Contraseña para esta autenticación remota. | Sin valor predeterminado |
| `keyid` | string | Obligatorio | ID de la clave local cuya clave pública se instala o revoca. | Sin valor predeterminado |
| `trust_new` | boolean | Opcional | Acepta un host nuevo solo después de verificarlo por una vía independiente. | false |
| `accept_changed` | boolean | Opcional | Acepta una huella de host modificada solo después de verificarla. | false |
| `confirmed_fingerprint` | string | Opcional | Huella verificada que coincide con el host que se está confirmando. | Ninguno |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `verify` | boolean | Opcional | Verificar después de instalar la clave. | true |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

data.deployed/verified/registered/registration_error, host_id y detalles del host y la clave. Comprueba por separado la instalación remota y el registro local.

### Notas de uso

La instalación remota puede completarse aunque falle el registro local. No vuelvas a instalar la clave de inmediato.

<a id="sshexec"></a>

## ssh.exec

Ejecutar un comando remoto mediante SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/exec`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `command` | string | Obligatorio | Texto de comando remoto. | Sin valor predeterminado |
| `timeout_ms` | integer | Opcional | Límite de tiempo de conexión o ejecución, en milisegundos. | SSH por defecto |
| `trust_new` | boolean | Opcional | Acepta un host nuevo solo después de verificarlo por una vía independiente. | false |
| `accept_changed` | boolean | Opcional | Acepta una huella de host modificada solo después de verificarla. | false |
| `confirmed_fingerprint` | string | Opcional | Huella verificada que coincide con el host que se está confirmando. | Ninguno |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a"
}
```

### Respuesta y conclusión

data.stdout/stderr/exit_code/host_status/fingerprint. Comprueba el código de salida y la salida de la aplicación.

### Notas de uso

Las huellas desconocidas o modificadas devuelven información para confirmar. Verifica antes de aceptar. Un código de salida remoto distinto de cero no siempre hace que code sea distinto de cero en el nivel superior.

<a id="sshexec_status"></a>

## ssh.exec_status

Consultar el resultado SSH actual o más reciente de la sesión solicitante

**Métodos**: GET / POST
**Ruta**: `/api/v1/ssh/exec_status`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `session_id` | integer | Obligatorio | ID de ejecución devuelto por ssh.exec_stream. | Sin valor predeterminado |
| `boot_id` | string | Obligatorio | Identificador de arranque hexadecimal de 32 caracteres de los datos de seguimiento. | Sin valor predeterminado |
| `result_key` | string | Obligatorio | Credencial de resultado hexadecimal de 32 caracteres de los datos de seguimiento. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "session_id": 1,
  "boot_id": "00000000000000000000000000000000",
  "result_key": "00000000000000000000000000000000"
}
```

### Respuesta y conclusión

data usa el formato de resultados WebSocket: ssh_exec_running mientras está activo y ssh_exec_done/cancelled/error al terminar. Comprueba status/exit_code/success y la integridad de la salida.

### Notas de uso

Requiere la sesión que inició la ejecución y los datos de seguimiento correctos. Los ceros del ejemplo solo muestran el formato; usa la respuesta real de inicio. Consultar no vuelve a ejecutar el comando.

<a id="sshexec_stream"></a>

## ssh.exec_stream

Ejecutar un comando remoto con salida en streaming por WebSocket

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/exec_stream`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `command` | string | Obligatorio | Texto del comando. | Sin valor predeterminado |
| `expect_pattern` | string | Opcional | Patrón de coincidencia de éxito. | Sin cambios |
| `fail_pattern` | string | Opcional | Patrón de coincidencia de fallo. | Sin cambios |
| `extract_pattern` | string | Opcional | Patrón de extracción de salida. | Sin cambios |
| `var_name` | string | Opcional | Prefijo de variables de resultado. | Sin cambios |
| `timeout` | integer | Opcional | Aquí se expresa en milisegundos, a diferencia de timeout_sec de los comandos guardados. | Límite de ejecución predeterminado |
| `collect_output` | boolean | Opcional | Conservar la salida recopilada. | true |
| `max_output_size` | integer | Opcional | Límite de recopilación de salida en bytes. | Dispositivo predeterminado |
| `stop_on_match` | boolean | Opcional | Para después de una coincidencia. | false |
| `command_id` | string | Par opcional con command_instance | ID de comando guardado asociado. | Ninguno |
| `command_instance` | string | Par opcional con command_id | Identidad hexadecimal en minúsculas de 16 caracteres que coincide con runtime_instance de la lista. | Ninguno |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a",
  "collect_output": true
}
```

### Respuesta y conclusión

data.session_id/boot_id/result_key. Conserva los datos de seguimiento antes de procesar resultados WebSocket o consultar ssh.exec_status.

### Notas de uso

Plaza exclusiva para ejecución en streaming. No admite autenticación genérica mediante keypath. Comprueba la sesión propietaria, el estado del terminal y la integridad de la salida.

<a id="sshhostsadd"></a>

## ssh.hosts.add

Añadir la configuración de un host SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/hosts/add`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="sshhostsexport"></a>

## ssh.hosts.export

Exportar la configuración de un host SSH como .tscfg

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/hosts/export`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `recipient_cert` | string | Opcional | Certificado PEM del destinatario; si se omite, cifra para este dispositivo. | Certificado de este dispositivo |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{
  "id": "example"
}
```

### Respuesta y conclusión

data.tscfg/filename. La exportación también depende de la identidad Developer del dispositivo y del material del destinatario.

### Notas de uso

El cliente guarda el texto de paquete devuelto. No se convierte en la configuración activa de otro dispositivo automáticamente.

<a id="sshhostsget"></a>

## ssh.hosts.get

Consultar la configuración de un host SSH por ID

**Métodos**: GET / POST
**Ruta**: `/api/v1/ssh/hosts/get`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{
  "id": "example"
}
```

### Respuesta y conclusión

Un host y active_version; los campos se filtran para roles inferiores a ADMIN.

<a id="sshhostsimport"></a>

## ssh.hosts.import

Importar la configuración de un host SSH desde .tscfg

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/hosts/import`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Obligatorio | Texto JSON del paquete completo proporcionado como una cadena. | Sin valor predeterminado |
| `preview` | boolean | Opcional | true solo previsualiza. | false |
| `active_version` | string | Necesario para aplicar | Versión de configuración actual. | La previsualización puede usar la versión actual |
| `overwrite` | boolean | Opcional | Permite sustituir un objeto existente por contenido diferente. | false |
| `expected_credential` | integer | Necesario para aplicar | credential_generation devuelto por vista previa. | Ninguno |
| `expected_digest` | string | Necesario para aplicar | package_digest devuelto por vista previa. | Ninguno |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Respuesta y conclusión

Modelo de resultado de configuración. La previsualización añade valid/items/exists/unchanged/package_digest/credential_generation; aplicar añade imported/overwritten/restart_required.

### Notas de uso

Previsualiza primero y aplica después el mismo paquete con su resumen, generación de credenciales y versión de configuración. Previsualiza de nuevo si cambian las condiciones.

<a id="sshhostslist"></a>

## ssh.hosts.list

Enumerar todas las configuraciones de hosts SSH

**Métodos**: GET / POST
**Ruta**: `/api/v1/ssh/hosts/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `offset` | integer | Opcional | Desplazamiento de retorno no negativo. | 0 |
| `limit` | integer | Opcional | Número de elementos que se devolverán; omitirlo no solicita truncamiento. | Todo |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.hosts/count/total/active_version/load_error/paused; los roles inferiores a ADMIN reciben metadatos restringidos.

<a id="sshhostsremove"></a>

## ssh.hosts.remove

Eliminar la configuración de un host SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/hosts/remove`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `preview` | boolean | Opcional | true previsualiza el impacto; false realiza la eliminación. | false |
| `replacement_id` | string | Opcional | ID de objeto de sustitución para referencias dependientes. | Ninguno |
| `mode` | string | Opcional | cascade solicita tratar las dependencias en cascada; elige una estrategia en lugar de combinar force y replacement. | Eliminación ordinaria |
| `force` | boolean | Opcional | Fuerce la eliminación de un objeto al que se hace referencia solo después de obtener una vista previa del impacto. | false |
| `pause_automation` | boolean | Opcional | Pausar la automatización antes de la operación. | false |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Respuesta y conclusión

Modelo de resultado de configuración, más impact con las referencias afectadas.

### Notas de uso

La eliminación de definiciones locales no detiene automáticamente los programas remotos ni revoca las claves públicas.

<a id="sshhostsupdate"></a>

## ssh.hosts.update

Actualizar una configuración de hosts SSH existente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/hosts/update`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#ssh-hosts) común.

### Ejemplo de solicitud

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="sshkeygen"></a>

## ssh.keygen

Generar un par de claves SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/keygen`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | Identificación de clave. | Sin valor predeterminado |
| `type` | string | Opcional | Tipo de clave aceptado aquí, como rsa2048/rsa4096/ec256/ec384. | rsa2048 |
| `comment` | string | Opcional | Comentario de la clave pública. | Vacío |

### Ejemplo de solicitud

```json
{
  "id": "example-key",
  "type": "ec256"
}
```

### Respuesta y conclusión

data.id/type/public_key.

### Notas de uso

Para nuevas integraciones, usa preferentemente key.generate; los parámetros admitidos son distintos.

<a id="sshrevoke"></a>

## ssh.revoke

Revocar una clave pública instalada en el servidor remoto

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/revoke`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección remota. | Sin valor predeterminado |
| `user` | string | Obligatorio | Cuenta remota. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto SSH. | 22 |
| `password` | string | Obligatorio | Contraseña para esta autenticación remota. | Sin valor predeterminado |
| `keyid` | string | Obligatorio | ID de la clave local cuya clave pública se instala o revoca. | Sin valor predeterminado |
| `trust_new` | boolean | Opcional | Acepta un host nuevo solo después de verificarlo por una vía independiente. | false |
| `accept_changed` | boolean | Opcional | Acepta una huella de host modificada solo después de verificarla. | false |
| `confirmed_fingerprint` | string | Opcional | Huella verificada que coincide con el host que se está confirmando. | Ninguno |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key"
}
```

### Respuesta y conclusión

data.revoked/found/removed_count y detalles remotos.

### Notas de uso

Solo elimina la clave pública indicada, no las claves locales, las definiciones de hosts ni los procesos remotos.

<a id="sshservicesstart"></a>

## ssh.services.start

Iniciar un servicio gestionado guardado

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/services/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `command_id` | string | Obligatorio | ID de comando guardado configurado como un servicio gestionado. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "command_id": "example-service",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

data.operation_id/run_id; verifica el estado con automation.services.status.

### Notas de uso

Usa la configuración guardada. Distingue entre un proceso en marcha y una aplicación lista, incluso si la llamada ha tenido éxito.

<a id="sshtest"></a>

## ssh.test

Probar la conexión SSH

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ssh/test`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatorio | Dirección del host SSH. | Sin valor predeterminado |
| `user` | string | Obligatorio | Nombre de usuario remoto. | Sin valor predeterminado |
| `port` | integer | Opcional | Puerto 1-65535. | 22 |
| `password` | string | Alternativa de autenticación | Contraseña de este acceso remoto, no de la cuenta TianshanOS. | Ninguno |
| `keyid` | string | Alternativa de autenticación | ID de una clave SSH privada guardada en el dispositivo. | Ninguno |
| `keypath` | string | Alternativa de autenticación admitida en la llamada inmediata | Ruta de clave privada del dispositivo; El soporte varía según el punto de entrada. | Ninguno |
| `trust_new` | boolean | Opcional | Acepta un host nuevo solo después de verificarlo por una vía independiente. | false |
| `accept_changed` | boolean | Opcional | Acepta una huella de host modificada solo después de verificarla. | false |
| `confirmed_fingerprint` | string | Opcional | Huella verificada que coincide con el host que se está confirmando. | Ninguno |

### Ejemplo de solicitud

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key"
}
```

### Respuesta y conclusión

data.success/host/port/user/host_status/fingerprint; un fallo de conexión puede incluir stage/reason/error y huellas.

### Notas de uso

Comprueba las condiciones de conexión y autenticación, no que todos los comandos o servicios remotos sean utilizables.
