# Reglas comunes de las llamadas

## Rutas y métodos

Las URL de las API de gestión siguen el formato `http://10.10.99.97/api/v1/...`. Los puntos del nombre lógico se convierten en separadores de ruta: fan.status corresponde a /api/v1/fan/status. Respeta las mayúsculas y minúsculas, también en key.exportPrivate y log.setLevel.

Usa únicamente los métodos indicados para cada API. Las lecturas suelen admitir GET/POST y las escrituras POST/PUT/DELETE, aunque algunas API solo admiten POST. Esta guía utiliza normalmente GET para consultas sencillas y POST para ejecutar acciones. Un método no permitido devuelve HTTP405.

El nombre y los parámetros determinan la acción. No presupongas que DELETE siempre elimina un objeto ni que POST siempre lo crea.

## Sesiones y roles

Las solicitudes protegidas incluyen `Authorization: Bearer <token>`. No pongas tokens en las URL. Indicar un rol o session_id en el JSON de una solicitud ordinaria no acredita esa identidad.

| Nivel de acceso | Significado |
| --- | --- |
| Público | Accesible sin iniciar sesión; siguen aplicándose las condiciones del recurso |
| READ | Requiere al menos permiso de lectura; las sesiones admin/root autorizadas suelen cumplir esta condición |
| ADMIN | Operaciones habituales del dispositivo; requiere admin o root |
| ROOT | Ejecución de comandos sin procesar, modificación de definiciones de automatización y determinadas operaciones de gestión de cuentas; requiere root |
| Token en el cuerpo | Las API de autenticación validan el campo JSON token; esto no permite modificar cuentas de forma anónima |

Las cuentas predeterminadas son admin/root, ambas con contraseña inicial rm01. La política distingue READ/WRITE/ADMIN/ROOT, pero esto no implica que exista una API para crear cuentas arbitrarias en todos los niveles. Ningún endpoint registrado exige WRITE como nivel mínimo en esta versión.

Algunos recursos o parámetros añaden comprobaciones. La lectura de archivos ordinarios puede admitir READ; las rutas sensibles requieren ADMIN. config.get solo expone sin autenticación la preferencia de idioma; las demás claves requieren ADMIN. La lectura completa de hosts y comandos SSH, reglas y acciones suele requerir ADMIN; los secretos de automation.sources.list siguen requiriendo ROOT. Las consultas a temp.bind admiten ADMIN, pero modificar una vinculación requiere ROOT. automation.proxy.fetch aplica los permisos de la API de destino en llamadas locales y requiere ROOT para servicios externos. restricted:true indica que se han filtrado campos; nunca vuelvas a guardar los campos omitidos como valores vacíos.

## Parámetros

Usa Content-Type: application/json y un objeto JSON en el cuerpo de la solicitud. Los arrays deben ir dentro de los campos del objeto. Evita claves duplicadas y nombres de parámetros que se repitan en la URL y el cuerpo; los conflictos se rechazan.

Los parámetros de la URL se decodifican una sola vez y pueden interpretarse como enteros o booleanos. Usa preferentemente JSON para objetos, arrays, valores de coma flotante, null e identificadores cuyos ceros iniciales deban conservarse. No apliques dos veces la codificación de URL.

Un parámetro opcional puede omitirse; null no suele equivaler a omitirlo. Algunas API de vinculación usan explícitamente null para eliminar una vinculación. Las unidades de tiempo dependen de cada campo: milisegundos, segundos o tiempo Unix.

## Determinar el resultado

Respuesta de éxito habitual:

```json
{"code":0,"data":{"example":"value"}}
```

Los errores de la operación también pueden devolver HTTP200:

```json
{"code":1,"error":"invalid_request"}
```

La explicación puede estar en error o message. data puede ser un objeto, un array o no aparecer. Una respuesta correcta no tiene por qué incluir message.

1. Trata un estado HTTP no satisfactorio como un fallo de transporte, autorización, formato o servicio.
2. Si code está presente y es distinto de cero, gestiona el error de la operación.
3. Comprueba los campos valid, success, exit_code, persisted o el estado de la operación específico de la API. Un éxito en el nivel superior no sustituye estas comprobaciones.
4. Para las tareas asíncronas, sigue el procedimiento de confirmación indicado por la API y conserva los datos de seguimiento que devuelva. Tras una desconexión o result_unknown, comprueba el estado antes de reintentar.

El inicio y cierre de sesión, las cargas binarias y las descargas tienen formatos propios. El cuerpo de una descarga correcta contiene los bytes del archivo, no JSON.

## Códigos de error

| code | Nombre | Acción recomendada |
| --- | --- | --- |
| 0 | OK | Comprueba las condiciones de finalización de la API |
| 1 | INVALID_ARG | Comprueba los campos, tipos, rangos y condiciones de versión |
| 2 | NOT_FOUND | Actualiza la información del objeto o la operación; no inventes identificadores ni reutilices identificadores obsoletos |
| 3 | NO_PERMISSION | Comprueba el rol, los recursos sensibles y las condiciones de exportación |
| 4 | BUSY | Comprueba las operaciones en curso y espera antes de reintentar |
| 5 | TIMEOUT | Determina si existe un resultado antes de repetir una escritura |
| 6 | NO_MEM | Reduce el tamaño de la solicitud o la carga; conserva los resultados conocidos |
| 7 | INTERNAL | Conserva el motivo; comprueba el estado si aparece result_unknown |
| 8 | NOT_SUPPORTED | Usa una API compatible |
| 9 | HARDWARE | Comprueba el dispositivo, el sensor y la configuración |
| 10 | CONNECTION | Comprueba la red, el host remoto, la huella y el servicio |
| 11 | AUTH | Vuelve a autenticarte o completa la verificación requerida |

Los procesos de confianza SSH también usan 1001/1002 para huellas de host desconocidas o modificadas e incluyen los detalles de la huella. Verifica la identidad por un canal de confianza antes de confirmar; eliminar registros de confianza no verifica la identidad.

## Aplicación y persistencia

applied indica que el ajuste se ha aplicado; persisted o saved indican que se ha guardado. Los resultados pueden ser distintos. Puede producirse un error después de que una fase anterior haya surtido efecto: conserva los detalles y vuelve a consultar el estado.

Las conmutaciones, los disparadores de reglas, la ejecución remota y las actualizaciones no tienen por qué ser seguras al repetirse. Las consultas de solo lectura pueden reintentarse controlando la carga. Si una escritura agota el tiempo de espera, consulta primero el estado o los datos de seguimiento.

## Límites

El número de conexiones, el tamaño de los cuerpos, los tiempos de recepción y las plazas para tareas son limitados. Las comprobaciones de identidad y tamaño pueden rechazar una solicitud antes de recibir todo el cuerpo. No sustituyas las suscripciones activas por un gran número de consultas simultáneas.

Esta versión permite hasta 1 MiB en la ruta JSON genérica, con un límite de recepción de 30 segundos. Las solicitudes de autenticación se limitan a 16 KiB y 10 segundos. Los paquetes de configuración se limitan a 64 KiB. Cada API puede imponer límites menores. Consulta [Transferencias](transfers.md) para las rutas binarias.

La profundidad de anidamiento JSON está limitada a 32. Se rechazan los caracteres NUL incrustados, el contenido sobrante al final y las claves duplicadas. Ante HTTP413, reduce la solicitud o usa la ruta de carga específica de la función.
