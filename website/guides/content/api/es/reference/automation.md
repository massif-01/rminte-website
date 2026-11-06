# API: Automatización y servicios gestionados

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [automation.action.stats](#automationactionstats) | Consultar estadísticas de ejecución de acciones |
| [automation.action.stats.reset](#automationactionstatsreset) | Restablecer las estadísticas de acciones |
| [automation.actions.add](#automationactionsadd) | Crear una plantilla de acción |
| [automation.actions.delete](#automationactionsdelete) | Eliminar una plantilla de acción |
| [automation.actions.execute](#automationactionsexecute) | Ejecutar una plantilla de acción |
| [automation.actions.export](#automationactionsexport) | Exportar una plantilla de acción como paquete .tscfg |
| [automation.actions.get](#automationactionsget) | Consultar una plantilla de acción por ID |
| [automation.actions.import](#automationactionsimport) | Importar una plantilla de acción desde un paquete de configuración |
| [automation.actions.list](#automationactionslist) | Enumerar todas las plantillas de acciones |
| [automation.actions.update](#automationactionsupdate) | Actualizar una plantilla de acción existente |
| [automation.config.apply](#automationconfigapply) | Aplicar la restauración o selección de fuente confirmada |
| [automation.config.backup](#automationconfigbackup) | Guardar la configuración completa de emergencia |
| [automation.config.enable](#automationconfigenable) | Habilitar o pausar explícitamente la configuración actual |
| [automation.config.preview](#automationconfigpreview) | Previsualizar una restauración o selección de fuente |
| [automation.config.refresh](#automationconfigrefresh) | Comprobar la SD una vez sin cambiar la selección del usuario |
| [automation.config.status](#automationconfigstatus) | Consultar el estado de almacenamiento y respaldo de automatización |
| [automation.pause](#automationpause) | Pausar el motor de automatización |
| [automation.proxy.fetch](#automationproxyfetch) | Consultar una API REST externa a través del dispositivo |
| [automation.proxy.socketio_test](#automationproxysocketio_test) | Probar una conexión Socket.IO con el protocolo v4 |
| [automation.proxy.websocket_test](#automationproxywebsocket_test) | Probar una conexión WebSocket |
| [automation.reload](#automationreload) | Volver a cargar la configuración |
| [automation.resume](#automationresume) | Reanudar el motor de automatización |
| [automation.rules.add](#automationrulesadd) | Añadir una regla |
| [automation.rules.delete](#automationrulesdelete) | Eliminar una regla |
| [automation.rules.disable](#automationrulesdisable) | Deshabilitar una regla |
| [automation.rules.enable](#automationrulesenable) | Habilitar una regla |
| [automation.rules.export](#automationrulesexport) | Exportar una regla como paquete .tscfg |
| [automation.rules.get](#automationrulesget) | Consultar los detalles de una regla por ID |
| [automation.rules.import](#automationrulesimport) | Importar una regla desde un paquete de configuración |
| [automation.rules.list](#automationruleslist) | Enumerar todas las reglas |
| [automation.rules.trigger](#automationrulestrigger) | Activar una regla manualmente |
| [automation.rules.update](#automationrulesupdate) | Actualizar una regla indicando la revisión esperada |
| [automation.services.list](#automationserviceslist) | Enumerar los controles independientes de servicios remotos |
| [automation.services.status](#automationservicesstatus) | Confirmar el estado de un proceso remoto gestionado |
| [automation.services.stop](#automationservicesstop) | Detener un proceso remoto gestionado verificado |
| [automation.sources.add](#automationsourcesadd) | Añadir una fuente de datos |
| [automation.sources.add_mapping](#automationsourcesadd_mapping) | Añadir una asignación de campo a una fuente existente |
| [automation.sources.delete](#automationsourcesdelete) | Eliminar una fuente de datos |
| [automation.sources.disable](#automationsourcesdisable) | Deshabilitar una fuente de datos |
| [automation.sources.enable](#automationsourcesenable) | Habilitar una fuente de datos |
| [automation.sources.export](#automationsourcesexport) | Exportar una fuente de datos como paquete .tscfg |
| [automation.sources.import](#automationsourcesimport) | Importar una fuente de datos desde un paquete de configuración |
| [automation.sources.list](#automationsourceslist) | Enumerar todas las fuentes de datos |
| [automation.sources.remove_mapping](#automationsourcesremove_mapping) | Eliminar una asignación de campo de una fuente de datos |
| [automation.sources.update](#automationsourcesupdate) | Actualizar una fuente de datos existente |
| [automation.start](#automationstart) | Iniciar el motor de automatización |
| [automation.status](#automationstatus) | Consultar el estado del motor de automatización |
| [automation.stop](#automationstop) | Detener el motor de automatización |
| [automation.test.device](#automationtestdevice) | Probar una acción de control de dispositivo |
| [automation.test.gpio](#automationtestgpio) | Probar una acción GPIO |
| [automation.test.led](#automationtestled) | Probar una acción LED |
| [automation.test.ssh](#automationtestssh) | Probar la ejecución de un comando SSH |
| [automation.variables.delete](#automationvariablesdelete) | Eliminar una variable de usuario guardada |
| [automation.variables.get](#automationvariablesget) | Consultar el valor de una variable |
| [automation.variables.list](#automationvariableslist) | Enumerar todas las variables |
| [automation.variables.set](#automationvariablesset) | Establecer el valor de una variable |

<a id="automationactionstats"></a>

## automation.action.stats

Consultar estadísticas de ejecución de acciones

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/action/stats`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Estadísticas actuales de ejecución del gestor de acciones, no un historial de auditoría persistente.

<a id="automationactionstatsreset"></a>

## automation.action.stats.reset

Restablecer las estadísticas de acciones

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/action/stats/reset`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

code=0 indica que la solicitud de restablecimiento se ha completado correctamente.

<a id="automationactionsadd"></a>

## automation.actions.add

Crear una plantilla de acción

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/actions/add`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

### Ejemplo de solicitud

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="automationactionsdelete"></a>

## automation.actions.delete

Eliminar una plantilla de acción

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/actions/delete`
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

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

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

<a id="automationactionsexecute"></a>

## automation.actions.execute

Ejecutar una plantilla de acción

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/actions/execute`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

### Ejemplo de solicitud

```json
{
  "id": "example-action",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

data.async/status/duration_ms y resultados de ejecución; la salida privada se filtra para roles inferiores a ADMIN.

### Notas de uso

Ejecuta los efectos reales de la plantilla sobre el hardware o el destino remoto. En las plantillas asíncronas, sigue comprobando el resultado del destino.

<a id="automationactionsexport"></a>

## automation.actions.export

Exportar una plantilla de acción como paquete .tscfg

**Métodos**: POST
**Ruta**: `/api/v1/automation/actions/export`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `recipient_cert` | string | Opcional | Certificado PEM del destinatario; si se omite, cifra para este dispositivo. | Certificado de este dispositivo |

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

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

<a id="automationactionsget"></a>

## automation.actions.get

Consultar una plantilla de acción por ID

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/actions/get`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

### Ejemplo de solicitud

```json
{
  "id": "example"
}
```

### Respuesta y conclusión

Una plantilla de acción y active_version; los campos se filtran para roles inferiores a ADMIN.

<a id="automationactionsimport"></a>

## automation.actions.import

Importar una plantilla de acción desde un paquete de configuración

**Métodos**: POST
**Ruta**: `/api/v1/automation/actions/import`
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

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

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

<a id="automationactionslist"></a>

## automation.actions.list

Enumerar todas las plantillas de acciones

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/actions/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `offset` | integer | Opcional | Desplazamiento de retorno no negativo. | 0 |
| `limit` | integer | Opcional | Número de elementos que se devolverán; omitirlo no solicita truncamiento. | Todo |

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.templates/count/total/active_version/load_error/paused; los roles inferiores a ADMIN reciben metadatos restringidos.

<a id="automationactionsupdate"></a>

## automation.actions.update

Actualizar una plantilla de acción existente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/actions/update`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#action-templates) común.

### Ejemplo de solicitud

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="automationconfigapply"></a>

## automation.config.apply

Aplicar la restauración o selección de fuente confirmada

**Métodos**: POST
**Ruta**: `/api/v1/automation/config/apply`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `operation` | string | Obligatorio | La misma operación seleccionada durante la vista previa. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `target_version` | string | Obligatorio | Versión de destino devuelta por vista previa. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#config-result) común.

### Ejemplo de solicitud

```json
{
  "operation": "use_sd",
  "active_version": "CURRENT_VERSION",
  "target_version": "PREVIEW_TARGET_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

La selección o recuperación puede sustituir todo el conjunto de hosts/commands/rules/variables/sources. Previsualiza y conserva primero tus datos actuales.

<a id="automationconfigbackup"></a>

## automation.config.backup

Guardar la configuración completa de emergencia

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/config/backup`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#config-result) común.

### Ejemplo de solicitud

```json
{
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationconfigenable"></a>

## automation.config.enable

Habilitar o pausar explícitamente la configuración actual

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/config/enable`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `enabled` | boolean | Obligatorio | true habilita la configuración actual; false la pausa. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#config-result) común.

### Ejemplo de solicitud

```json
{
  "active_version": "CURRENT_VERSION",
  "enabled": false
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationconfigpreview"></a>

## automation.config.preview

Previsualizar una restauración o selección de fuente

**Métodos**: POST
**Ruta**: `/api/v1/automation/config/preview`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `operation` | string | Obligatorio | use_sd/save_to_sd/restore_internal. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#config-result) común.

### Ejemplo de solicitud

```json
{
  "operation": "use_sd"
}
```

### Respuesta y conclusión

Previsualiza las diferencias, las versiones actual y de destino y las condiciones previas de selección. Para aplicar, usa las versiones devueltas.

### Notas de uso

La selección o recuperación puede sustituir todo el conjunto de hosts/commands/rules/variables/sources. Previsualiza y conserva primero tus datos actuales.

<a id="automationconfigrefresh"></a>

## automation.config.refresh

Comprobar la SD una vez sin cambiar la selección del usuario

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/config/refresh`
**Acceso mínimo**: ROOT

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#config-result) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationconfigstatus"></a>

## automation.config.status

Consultar el estado de almacenamiento y respaldo de automatización

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/config/status`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../response-models.md#config-result) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationpause"></a>

## automation.pause

Pausar el motor de automatización

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/pause`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

code=0/message indica éxito. Consulta automation.status para verificar el estado de ejecución.

### Notas de uso

El estado del motor, las acciones sin terminar o el almacenamiento pueden hacer que se rechace una solicitud. Que se agote el tiempo de parada no demuestra que todas las acciones hayan terminado.

<a id="automationproxyfetch"></a>

## automation.proxy.fetch

Consultar una API REST externa a través del dispositivo

**Métodos**: POST
**Ruta**: `/api/v1/automation/proxy/fetch`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatorio | Destino HTTP(S) o una dirección API local compatible. | Sin valor predeterminado |
| `method` | string | Opcional | Admite GET/POST/PUT/DELETE; no hay un parámetro genérico de cuerpo de solicitud. | GET |
| `headers` | object | Opcional | Cabeceras de solicitud con valores de tipo cadena; no incluyas credenciales en registros ordinarios. | Ninguno |
| `timeout` | integer | Opcional | Tiempo máximo total de la solicitud, en milisegundos. | 15000 |
| `cert_pem` | string | Opcional | Material de CA de emisor privado, como máximo 16384 bytes. | Confianza en el sistema |
| `skip_verify` | boolean | Opcional | Parámetro de compatibilidad: solo false; true se rechaza. | false |

### Ejemplo de solicitud

```json
{
  "url": "https://example.com/status",
  "method": "GET"
}
```

### Respuesta y conclusión

data.status/content_length/body; los resultados de una API local están anidados en body y también debes comprobar su code.

### Notas de uso

El reenvío de API local conserva los permisos de sesión y destino actuales. Las solicitudes HTTP(S) externas requieren ROOT. Se aplican presupuestos de tiempo, tamaño y red; Este no es un proxy sin restricciones.

<a id="automationproxysocketio_test"></a>

## automation.proxy.socketio_test

Probar una conexión Socket.IO con el protocolo v4

**Métodos**: POST
**Ruta**: `/api/v1/automation/proxy/socketio_test`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatorio | Dirección del servidor Socket.IO v4. | Sin valor predeterminado |
| `event` | string | Opcional | Nombre del evento objetivo. | Primer evento |
| `timeout_ms` | integer | Opcional | Tiempo máximo de conexión y evento, en milisegundos. | 10000 |
| `json_path` | string | Opcional | Ruta de extracción de datos de eventos. | Datos completos |

### Ejemplo de solicitud

```json
{
  "url": "https://example.com",
  "event": "status"
}
```

### Respuesta y conclusión

data.connected/sid/event/data y, según el caso, value/path/path_error/error.

### Notas de uso

Usa Socket.IO, no WebSocket simple; conecta con un servicio remoto real.

<a id="automationproxywebsocket_test"></a>

## automation.proxy.websocket_test

Probar una conexión WebSocket

**Métodos**: POST
**Ruta**: `/api/v1/automation/proxy/websocket_test`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `uri` | string | Obligatorio | Destino ws:// o wss://. | Sin valor predeterminado |
| `timeout_ms` | integer | Opcional | Tiempo máximo de conexión y espera de datos, en milisegundos. | 10000 |
| `subscribe` | string | Opcional | Texto de suscripción para enviar después de conectarse. | No enviar nada |
| `json_path` | string | Opcional | Ruta de extracción JSON para la respuesta. | Mensaje completo |

### Ejemplo de solicitud

```json
{
  "uri": "wss://example.com/events",
  "timeout_ms": 10000
}
```

### Respuesta y conclusión

data.connected/message y, según el caso, value/path/path_error/error.

### Notas de uso

Se conecta y puede enviar mensajes de texto. Una prueba no es una suscripción persistente.

<a id="automationreload"></a>

## automation.reload

Volver a cargar la configuración

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/reload`
**Acceso mínimo**: ROOT

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

El estado del motor, las acciones sin terminar o el almacenamiento pueden hacer que se rechace una solicitud. Que se agote el tiempo de parada no demuestra que todas las acciones hayan terminado.

<a id="automationresume"></a>

## automation.resume

Reanudar el motor de automatización

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/resume`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

code=0/message indica éxito. Consulta automation.status para verificar el estado de ejecución.

### Notas de uso

El estado del motor, las acciones sin terminar o el almacenamiento pueden hacer que se rechace una solicitud. Que se agote el tiempo de parada no demuestra que todas las acciones hayan terminado.

<a id="automationrulesadd"></a>

## automation.rules.add

Añadir una regla

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/rules/add`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `expected_revision` | integer | Opcional | Revisión original de la regla; incluye el valor consultado más reciente para actualizar. | No es necesario para la creación |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Guardar y activar son pasos distintos. No sobrescribas reglas completas a partir de vistas con campos filtrados.

<a id="automationrulesdelete"></a>

## automation.rules.delete

Eliminar una regla

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/rules/delete`
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

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Respuesta y conclusión

Modelo de resultado de configuración y, en algunos casos, impact.

<a id="automationrulesdisable"></a>

## automation.rules.disable

Deshabilitar una regla

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/rules/disable`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `expected_revision` | integer | Opcional | Revisión actual de la regla. | Recomendado |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationrulesenable"></a>

## automation.rules.enable

Habilitar una regla

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/rules/enable`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `expected_revision` | integer | Opcional | Revisión actual de la regla. | Recomendado |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationrulesexport"></a>

## automation.rules.export

Exportar una regla como paquete .tscfg

**Métodos**: POST
**Ruta**: `/api/v1/automation/rules/export`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `recipient_cert` | string | Opcional | Certificado PEM del destinatario; si se omite, cifra para este dispositivo. | Certificado de este dispositivo |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule"
}
```

### Respuesta y conclusión

data.tscfg/filename; el paquete contiene la entrada de configuración de la regla.

<a id="automationrulesget"></a>

## automation.rules.get

Consultar los detalles de una regla por ID

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/rules/get`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule"
}
```

### Respuesta y conclusión

Definición de regla, revisión actual y estadísticas de ejecución; para roles inferiores a ADMIN se omiten las condiciones y acciones completas.

<a id="automationrulesimport"></a>

## automation.rules.import

Importar una regla desde un paquete de configuración

**Métodos**: POST
**Ruta**: `/api/v1/automation/rules/import`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Obligatorio | Texto JSON del paquete. | Sin valor predeterminado |
| `preview` | boolean | Opcional | Modo de vista previa o aplicación. | false |
| `active_version` | string | Necesario para aplicar | Versión de configuración actual. | Sin valor predeterminado |
| `overwrite` | boolean | Opcional | Sobrescribe reglas con el mismo ID. | false |
| `expected_revision` | integer | Necesario para aplicar | Revisión de reglas devuelta por previsualización. | Sin valor predeterminado |
| `expected_generation` | integer | Necesario para aplicar | Generación de reglas devuelta por previsualización. | Sin valor predeterminado |
| `credential_generation` | integer | Necesario para aplicar | Generación del certificado o de las credenciales devuelta por la previsualización. | Sin valor predeterminado |
| `package_digest` | string | Necesario para aplicar | Resumen del paquete devuelto por vista previa. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Respuesta y conclusión

Resultados, versiones y resúmenes de previsualización y aplicación. Aplicar confirma que siguen cumpliéndose las condiciones de la previsualización.

### Notas de uso

Solo un cuerpo JSON completo; no admite parámetros de URL. Los campos de confirmación son distintos de los de otras importaciones; no uses aquí expected_credential/expected_digest.

<a id="automationruleslist"></a>

## automation.rules.list

Enumerar todas las reglas

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/rules/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.rules/count/active_version/loaded/paused/load_error/recovery_required/invalid_items/restart_required. Las entradas incluyen ID, habilitación, revisión y estadísticas de ejecución; los roles inferiores a ADMIN tienen acceso restringido.

<a id="automationrulestrigger"></a>

## automation.rules.trigger

Activar una regla manualmente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/rules/trigger`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado del disparo o motivo del rechazo. Confirma el estado de la acción o del servicio para determinar si ha terminado.

### Notas de uso

Tiene efectos reales. El periodo de espera, la pausa, las condiciones o el estado de ejecución pueden impedir el disparo.

<a id="automationrulesupdate"></a>

## automation.rules.update

Actualizar una regla indicando la revisión esperada

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/rules/update`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `expected_revision` | integer | Opcional | Revisión original de la regla; incluye el valor consultado más reciente para actualizar. | No es necesario para la creación |

Consulta el [modelo de datos](../configuration-models.md#automation-rules) común.

### Ejemplo de solicitud

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Guardar y activar son pasos distintos. No sobrescribas reglas completas a partir de vistas con campos filtrados.

<a id="automationserviceslist"></a>

## automation.services.list

Enumerar los controles independientes de servicios remotos

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/services/list`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.items con run_id/command_id/rule_id/source/name/state/current/last_known y estado de operación.

### Notas de uso

Conservar un registro de ejecución no demuestra que el proceso remoto siga existiendo. Solicita la verificación explícitamente cuando sea necesario.

<a id="automationservicesstatus"></a>

## automation.services.status

Confirmar el estado de un proceso remoto gestionado

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/services/status`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `run_id` | string | Obligatorio | run_id de la respuesta de inicio o de la lista de servicios. | Sin valor predeterminado |
| `verify` | boolean | Opcional | Conéctese al host original para verificar el estado. | Según la operación |

### Ejemplo de solicitud

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### Respuesta y conclusión

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### Notas de uso

Sigue consultando las operaciones ocupadas o en curso. La parada usa la identidad verificada del proceso original, no elimina procesos arbitrarios por su nombre.

<a id="automationservicesstop"></a>

## automation.services.stop

Detener un proceso remoto gestionado verificado

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/services/stop`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `run_id` | string | Obligatorio | run_id de la respuesta de inicio o de la lista de servicios. | Sin valor predeterminado |
| `verify` | boolean | Opcional | Conéctese al host original para verificar el estado. | Según la operación |

### Ejemplo de solicitud

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### Respuesta y conclusión

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### Notas de uso

Sigue consultando las operaciones ocupadas o en curso. La parada usa la identidad verificada del proceso original, no elimina procesos arbitrarios por su nombre.

<a id="automationsourcesadd"></a>

## automation.sources.add

Añadir una fuente de datos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/add`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="automationsourcesadd_mapping"></a>

## automation.sources.add_mapping

Añadir una asignación de campo a una fuente existente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/add_mapping`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `json_path` | string | Obligatorio | Ruta del campo de datos a extraer. | Sin valor predeterminado |
| `var_name` | string | Obligatorio | Nombre de la variable de destino. | Sin valor predeterminado |
| `transform` | string | Opcional | Expresión de transformación opcional. | Ninguno |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "json_path": "temperature",
  "var_name": "compute.temperature"
}
```

### Respuesta y conclusión

Modelo de resultado de configuración más source_id/mapping_count/mapping_index.

<a id="automationsourcesdelete"></a>

## automation.sources.delete

Eliminar una fuente de datos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/delete`
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

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

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

<a id="automationsourcesdisable"></a>

## automation.sources.disable

Deshabilitar una fuente de datos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/disable`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationsourcesenable"></a>

## automation.sources.enable

Habilitar una fuente de datos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/enable`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

<a id="automationsourcesexport"></a>

## automation.sources.export

Exportar una fuente de datos como paquete .tscfg

**Métodos**: POST
**Ruta**: `/api/v1/automation/sources/export`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `recipient_cert` | string | Opcional | Certificado PEM del destinatario; si se omite, cifra para este dispositivo. | Certificado de este dispositivo |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

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

<a id="automationsourcesimport"></a>

## automation.sources.import

Importar una fuente de datos desde un paquete de configuración

**Métodos**: POST
**Ruta**: `/api/v1/automation/sources/import`
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

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

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

<a id="automationsourceslist"></a>

## automation.sources.list

Enumerar todas las fuentes de datos

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/sources/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `offset` | integer | Opcional | Desplazamiento de retorno no negativo. | 0 |
| `limit` | integer | Opcional | Número de elementos que se devolverán; omitirlo no solicita truncamiento. | Todo |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.sources/count/total/active_version/load_error/paused; las sesiones que no son root reciben metadatos restringidos.

<a id="automationsourcesremove_mapping"></a>

## automation.sources.remove_mapping

Eliminar una asignación de campo de una fuente de datos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/remove_mapping`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `index` | integer | Una alternativa de selección | Índice de asignación no negativo. | Ninguno |
| `json_path` | string | Una alternativa de selección | Ruta de campo existente. | Ninguno |
| `var_name` | string | Una alternativa de selección | Nombre de variable existente. | Ninguno |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "index": 0
}
```

### Respuesta y conclusión

Modelo de resultado de configuración más source_id/mapping_count.

<a id="automationsourcesupdate"></a>

## automation.sources.update

Actualizar una fuente de datos existente

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/sources/update`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatorio | ID de objeto estable; conservar el ID existente después de la lectura. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |

Consulta el [modelo de datos](../configuration-models.md#data-sources) común.

### Ejemplo de solicitud

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Resultado de la configuración con active_version/source/loaded/configured/enabled/paused/saved/uncertain y ubicación del error. Consulta el modelo completo de resultados de configuración.

### Notas de uso

Añadir requiere un ID sin usar; actualizar requiere un objeto existente. Consulta los ejemplos completos del modelo.

<a id="automationstart"></a>

## automation.start

Iniciar el motor de automatización

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/start`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

code=0/message indica éxito. Consulta automation.status para verificar el estado de ejecución.

### Notas de uso

El estado del motor, las acciones sin terminar o el almacenamiento pueden hacer que se rechace una solicitud. Que se agote el tiempo de parada no demuestra que todas las acciones hayan terminado.

<a id="automationstatus"></a>

## automation.status

Consultar el estado del motor de automatización

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/status`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data contiene el estado del motor, contadores, fuente de configuración e información de inicio automático, según el estado del motor.

<a id="automationstop"></a>

## automation.stop

Detener el motor de automatización

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/stop`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

code=0/message indica éxito. Consulta automation.status para verificar el estado de ejecución.

### Notas de uso

El estado del motor, las acciones sin terminar o el almacenamiento pueden hacer que se rechace una solicitud. Que se agote el tiempo de parada no demuestra que todas las acciones hayan terminado.

<a id="automationtestdevice"></a>

## automation.test.device

Probar una acción de control de dispositivo

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/test/device`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Obligatorio | agx o lpmu. | Sin valor predeterminado |
| `action` | string | Obligatorio | Acción de alimentación o reinicio admitida por el destino. | Sin valor predeterminado |

### Ejemplo de solicitud

```json
{
  "device": "agx",
  "action": "on"
}
```

### Respuesta y conclusión

code=0/message indica que la llamada de control ha tenido éxito. Consulta después device.status.

### Notas de uso

Controla el ordenador de destino real.

<a id="automationtestgpio"></a>

## automation.test.gpio

Probar una acción GPIO

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/test/gpio`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `pin` | integer | Obligatorio | Número de pin compatible. | Sin valor predeterminado |
| `level` | boolean | Obligatorio | true=nivel alto, false=nivel bajo. | Sin valor predeterminado |
| `pulse_ms` | integer | Opcional | Duración del pulso en milisegundos; 0 significa que no hay pulso temporizado. | 0 |

### Ejemplo de solicitud

```json
{
  "pin": 1,
  "level": false,
  "pulse_ms": 0
}
```

### Respuesta y conclusión

code=0/message indica que la llamada de acción ha tenido éxito. Lee el pin de destino por separado.

### Notas de uso

Opera pines de hardware. Primero verifique su función.

<a id="automationtestled"></a>

## automation.test.led

Probar una acción LED

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/test/led`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `device` | string | Obligatorio | Dispositivo LED de destino. | Sin valor predeterminado |
| `index` | integer | Opcional | Índice LED. | 0 |
| `r` | integer | Opcional | Componente rojo, 0-255. | 0 |
| `g` | integer | Opcional | Componente verde, 0-255. | 0 |
| `b` | integer | Opcional | Componente azul, 0-255. | 0 |

### Ejemplo de solicitud

```json
{
  "device": "board",
  "r": 0,
  "g": 64,
  "b": 128
}
```

### Respuesta y conclusión

Resultado de ejecución de la acción en data.

### Notas de uso

Aunque el nombre incluya test, modifica el dispositivo.

<a id="automationtestssh"></a>

## automation.test.ssh

Probar la ejecución de un comando SSH

**Métodos**: POST
**Ruta**: `/api/v1/automation/test/ssh`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `host_id` | string | Obligatorio | ID de configuración de un host SSH guardado. | Sin valor predeterminado |
| `command` | string | Obligatorio | Comando remoto. | Sin valor predeterminado |
| `timeout_ms` | integer | Opcional | Tiempo máximo de espera, en milisegundos. | 30000 |

### Ejemplo de solicitud

```json
{
  "host_id": "example-host",
  "command": "uname -a",
  "timeout_ms": 30000
}
```

### Respuesta y conclusión

Resultado de ejecución remota; inspeccionar el código de salida y la salida.

### Notas de uso

Conecta y ejecuta; no es una verificación solo de sintaxis.

<a id="automationvariablesdelete"></a>

## automation.variables.delete

Eliminar una variable de usuario guardada

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/variables/delete`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre de variable de usuario. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `preview` | boolean | Opcional | Solo previsualizar el impacto sobre las referencias. | false |
| `force` | boolean | Opcional | Solicitar la supresión forzada después de confirmar el impacto. | false |
| `pause_automation` | boolean | Opcional | Pausar la automatización antes de la operación. | false |

Consulta el [modelo de datos](../response-models.md#variable) común.

### Ejemplo de solicitud

```json
{
  "name": "example.temperature",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Respuesta y conclusión

Modelo de resultado de configuración y, en algunos casos, impact.

<a id="automationvariablesget"></a>

## automation.variables.get

Consultar el valor de una variable

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/variables/get`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre completo de la variable. | Sin valor predeterminado |

Consulta el [modelo de datos](../response-models.md#variable) común.

### Ejemplo de solicitud

```json
{
  "name": "compute.temperature"
}
```

### Respuesta y conclusión

data contiene el valor y el tipo de la variable, source, readonly y metadatos de actualización.

<a id="automationvariableslist"></a>

## automation.variables.list

Enumerar todas las variables

**Métodos**: GET / POST
**Ruta**: `/api/v1/automation/variables/list`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `configured_only` | boolean | Opcional | Enumerar solo las definiciones de variables de usuario guardadas. | false |
| `prefix` | string | Opcional | Filtro por prefijo de nombre de variable. | Ninguno |
| `source_id` | string | Opcional | Filtrar por ID de fuente. | Ninguno |
| `include_value` | boolean | Opcional | Incluye valores de variables. | true |
| `include_meta` | boolean | Opcional | Incluir marcas de tiempo, source, readonly y otros metadatos. | true |

Consulta el [modelo de datos](../response-models.md#variable) común.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.variables/count. include_value controla si se incluyen valores; include_meta controla las marcas de tiempo, source, readonly y los metadatos relacionados.

<a id="automationvariablesset"></a>

## automation.variables.set

Establecer el valor de una variable

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/automation/variables/set`
**Acceso mínimo**: ROOT

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatorio | Nombre de variable de usuario. | Sin valor predeterminado |
| `active_version` | string | Obligatorio | active_version más reciente del estado de configuración; vuelve a consultarlo después de los cambios. | Sin valor predeterminado |
| `value` | boolean / number / string / null | Obligatorio | Valor que se guardará; no sustituyas temperaturas numéricas por arrays u objetos. | Sin valor predeterminado |
| `create_only` | boolean | Opcional | Devuelve un valor existente sin sobrescribirlo. | false |
| `source_id` | string | Opcional | Identificador de fuentes. | usuario |
| `value_type` | integer | Opcional | ID de tipo opcional; normalmente se infiere del valor. | Inferido del valor |

Consulta el [modelo de datos](../response-models.md#variable) común.

### Ejemplo de solicitud

```json
{
  "name": "example.temperature",
  "value": 42.5,
  "active_version": "CURRENT_VERSION"
}
```

### Respuesta y conclusión

Modelo de resultado de configuración más name/created/value.

### Notas de uso

Las variables readonly o de origen del sistema pueden rechazar cambios. Los arrays y objetos quedan fuera de este modelo de valores simplificado.
