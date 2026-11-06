# Modelos de configuración

Estos modelos guardan hosts, comandos, fuentes, acciones y reglas que el dispositivo puede usar durante la ejecución. Guarda primero un ejemplo desactivado y vuelve a consultarlo antes de habilitar sus efectos.

## Leer la versión antes de escribir

Con root, consulta automation.config.status y conserva active_version. Inclúyelo en el nivel superior de la solicitud de escritura. Después de cada escritura correcta, usa la nueva versión en la siguiente solicitud. Al actualizar reglas, incluye también la revision consultada como expected_revision. Un conflicto requiere volver a leer e integrar los cambios, no simplemente sustituir el token de versión y reenviar datos obsoletos.

Los siguientes objetos JSON son ejemplos completos de la estructura de solicitud. Sustituye CURRENT_VERSION, los identificadores, direcciones, claves y nombres de variables. Pon los campos del modelo en el nivel superior de la solicitud; no añadas un objeto contenedor config salvo en los subobjetos que se muestran explícitamente.

restricted:true puede indicar una vista que solo contiene metadatos. Usa ADMIN para leer completos los hosts y comandos SSH, las reglas y las acciones; los secretos de automation.sources.list siguen requiriendo ROOT. La escritura de definiciones requiere el rol indicado por cada API. Un campo secreto omitido no es un valor vacío. Las actualizaciones de hosts y fuentes se integran con el JSON existente; las de comandos y acciones deben incluir definiciones completas. Las reglas tienen sus propias comprobaciones de integración y revisión; no supongas que todas las familias se actualizan igual.

## Hosts SSH

Para ssh.hosts.add/update. Guarda dónde y cómo conectar y qué clave utilizar; hosts.* guarda, en cambio, las huellas.

```json
{"id":"example-host","active_version":"CURRENT_VERSION","host":"192.0.2.20","port":22,"username":"YOUR_USER","auth_type":"key","keyid":"example-key","enabled":true}
```

| Campo | Tipo, límite y significado |
| --- | --- |
| id | Cadena estable de hasta 31 bytes; no debe existir al añadir y debe existir al actualizar |
| host | Cadena de dirección de hasta 63 bytes |
| port | Puerto SSH entero, normalmente 22; rango 1-65535 |
| username | Usuario remoto de hasta 31 bytes; distinto del inicio de sesión del dispositivo |
| auth_type | key/password; se recomienda key para las definiciones persistentes |
| keyid | ID de una clave SSH privada local guardada, de hasta 31 bytes |
| enabled | Booleano; valor predeterminado de decodificación true |
| created_time | Valor de tiempo opcional, entero sin signo de 32 bits; normalmente se conserva el valor existente |

El modelo persistente no guarda un campo password. El modo password no implica que se haya guardado una contraseña remota; las llamadas inmediatas proporcionan sus propias credenciales. Se admiten como máximo 16 hosts. La dirección, la existencia de la clave y la confianza remota se comprueban por separado.

## Comandos SSH

Para ssh.commands.add/update. Guardar un comando no lo ejecuta. Usa service_mode:false para comandos breves; los servicios gestionados de larga duración usan true y ssh.services.start.

```json
{"id":"example-command","active_version":"CURRENT_VERSION","host_id":"example-host","name":"Read OS","command":"uname -a","timeout_sec":30,"enabled":true,"service_mode":false}
```

| Campo | Tipo, límite y significado |
| --- | --- |
| id / host_id | Cadenas de hasta 31 bytes cada una; host_id hace referencia a un host guardado |
| name / command | Cadenas de hasta 63 / 1023 bytes |
| desc / icon | Cadenas opcionales de hasta 127 / 63 bytes; icon puede ser un icono de pantalla o una ruta |
| expect_pattern / fail_pattern / extract_pattern | Patrones opcionales de coincidencia o extracción, de hasta 127 bytes cada uno |
| var_name | Prefijo opcional para las variables de resultado, de hasta 31 bytes |
| timeout_sec | 0-65535 segundos, 30 por defecto; no milisegundos |
| stop_on_match / nohup / enabled / service_mode | Booleanos; enabled es true por defecto, los demás false |
| ready_pattern / service_fail_pattern | Patrones de disponibilidad o fallo del servicio, de hasta 127 bytes cada uno |
| ready_timeout_sec / ready_check_interval_ms | Enteros de 0 a 65535, en segundos y milisegundos respectivamente; configúralos de forma explícita para los servicios |
| created_time | Valor de tiempo opcional, entero sin signo de 32 bits |

Los alias son timeout, expectPattern, failPattern, extractPattern, varName, stopOnMatch, serviceMode, readyPattern, serviceFailPattern, readyTimeout y readyInterval. Usa preferentemente los nombres de la tabla; no envíes ambas variantes. _object_id/runtime_instance representan la identidad persistente y la identidad de ejecución; conserva los valores devueltos, no los inventes. Se admiten como máximo 64 comandos.

## Fuentes de datos

Para automation.sources.add/update. Las fuentes obtienen datos y los asignan a variables que utilizan las reglas.

```json
{"id":"example-source","active_version":"CURRENT_VERSION","label":"Temperature","type":"rest","enabled":false,"poll_interval_ms":5000,"auto_discover":false,"rest_url":"https://example.com/status","rest_method":"GET","mappings":[{"path":"temperature","var":"compute.temperature"}]}
```

| Campo común | Tipo y significado |
| --- | --- |
| id / label | Cadenas de hasta 63 / 47 bytes |
| type | Cadenas builtin/websocket/socketio/rest/variable o los enteros correspondientes de 0 a 4 |
| enabled / auto_discover | Booleanos; auto_discover es true por defecto; el ejemplo lo desactiva explícitamente |
| poll_interval_ms | Entero de 0 a 4294967295 milisegundos; la actualización depende del tipo; cero no significa muestreo ilimitado |
| mappings | Como máximo 4: path de hasta 95 bytes, var de hasta 63 bytes y transform opcional de hasta 63 bytes |

path/var de una asignación también admiten json_path/var_name. path localiza un campo dentro de los datos, como temperature o cpu.cores[0].freq; no es una URL. Verifica las transformaciones con valores de muestra conocidos.

| Tipo | Campos específicos |
| --- | --- |
| websocket | ws_uri de hasta 95 bytes; ws_path es la ruta heredada de un único campo, de hasta 63 bytes; reconnect_ms de 0 a 65535 ms |
| socketio | sio_url de hasta 95 bytes; sio_event de hasta 63 bytes |
| rest | rest_url de hasta 95 bytes; rest_method de hasta 7 bytes; rest_auth de hasta 47 bytes; rest_path es la ruta heredada de hasta 63 bytes |
| variable | var_name, var_prefix, var_watch_all; los flujos SSH también usan ssh_host_id, ssh_command, expect_pattern, fail_pattern, extract_pattern y timeout_sec |
| builtin | Objeto builtin: type selecciona una muestra integrada; GPIO usa pin, ADC usa channel/atten y el estado del ordenador puede usar device_index |

Las entradas de tipo cadena también aceptan estos alias: en WebSocket, uri/json_path; en Socket.IO, url/event; en REST, url/method/auth_header/json_path. Usa preferentemente los campos canónicos anteriores. Las cadenas de fuentes de variables suelen admitir hasta 63 bytes; ssh_command, 95 bytes; timeout_sec, 0-65535 segundos. Para los identificadores numéricos de tipo de hardware o canal integrados, parte de definiciones existentes en lugar de adivinar pines o canales.

## Variables de usuario

automation.variables.set escribe; get/list leen. Además de value, importan name, source, readonly y la antigüedad del dato.

```json
{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}
```

value admite null, booleanos, números finitos o una cadena de hasta 63 bytes. Normalmente se omite value_type para inferirlo. Los tipos explícitos son 0=null, 1=bool, 2=int, 3=float y 4=string, y deben coincidir con el valor. Los enteros usan el rango con signo de 32 bits; los demás valores numéricos finitos usan coma flotante.

source_id es user por defecto. create_only:true conserva una variable existente, por lo que no demuestra que se haya escrito el nuevo valor solicitado. Las variables readonly o de origen del sistema pueden rechazar cambios. La vinculación de temperatura requiere variables numéricas de temperatura adecuadas; las cadenas, los valores inválidos y los datos desactualizados no son mediciones normales de sensores.

## Plantillas de acciones

automation.actions.add/update guarda acciones reutilizables. Este ejemplo registra un mensaje en lugar de controlar el hardware.

```json
{"id":"example-action","active_version":"CURRENT_VERSION","name":"Record a message","enabled":true,"type":"log","async":false,"delay_ms":0,"log":{"level":3,"message":"Example action"}}
```

Campos comunes: id de hasta 63 bytes, name de 47 bytes y description de 63 bytes; enabled es true por defecto y async es false; delay_ms admite 0-65535 milisegundos. created_at es un valor de tiempo entero no negativo opcional que normalmente se conserva del objeto existente.

| type | Subobjeto y campos específicos |
| --- | --- |
| log | log: level y message de hasta 47 bytes |
| set_var | set_var: variable, value y value_type opcional |
| ssh_cmd | ssh: host_ref, command, timeout_ms, async |
| ssh_cmd_ref | ssh_ref: cmd_id que hace referencia a un comando guardado |
| gpio | gpio: pin, level de tipo **booleano**, pulse_ms |
| device_ctrl | device: device y action con una acción compatible |
| cli | cli: command, var_name, timeout_ms |
| webhook | webhook: url, method, body_template |
| led | led: device, ctrl_type y los campos de esa función de visualización |

Las referencias a hosts, nombres de variables, referencias a comandos y nombres de dispositivo o acción suelen admitir hasta 63 bytes. Los comandos SSH/CLI en línea y la URL de webhook admiten hasta 95 bytes; method, 7 bytes; body_template, 63 bytes. Los campos demasiado largos se rechazan; no confíes en que se recorten. Los comandos de acciones en línea tienen menos capacidad que los guardados en ssh.commands.

### Campos de acciones LED

led.ctrl_type es fill/effect/brightness/off/text/image/qrcode/filter/filter_stop/text_stop. Proporciona los campos de la función elegida, no todos los parámetros de una API LED directa.

Campos comunes de visualización: device, index (255=all), cadena color o r/g/b, brightness de 0 a 255, effect, speed y duration_ms de 0 a 65535. Campos de matriz: text de hasta 127 bytes, font de 31, image_path de 127, qr_text de 255, qr_ecc como cadena L/M/Q/H, filter de 31, filter_params, center, loop, scroll, align, x/y y auto_pos para colocar el texto. scroll es none/left/right/up/down; align es left/center/right; x/y son coordenadas con signo de 16 bits.

El primer plano del QR usa qr_fg y el fondo qr_bg_image. El negro explícito es un color intencionado, no un valor omitido. filter_params utiliza opciones numéricas con nombre admitidas por el efecto. La ejecución requiere además hardware compatible y rutas y configuración válidas. Guarda y vuelve a consultar antes de probar deliberadamente un efecto.

## Reglas de automatización

automation.rules.add/update guarda condiciones y acciones. Las reglas habilitadas pueden empezar a ejecutarse automáticamente; establece inicialmente enabled:false.

```json
{"id":"example-rule","active_version":"CURRENT_VERSION","name":"Temperature example","enabled":false,"logic":"and","cooldown_ms":10000,"conditions":[{"variable":"example.temperature","operator":"gt","value":50}],"actions":[{"type":"log","level":3,"message":"Temperature high"}]}
```

| Campo | Tipo y significado |
| --- | --- |
| id / name / icon | Cadenas de hasta 63 / 47 / 63 bytes; ID rechaza separadores y caracteres de control |
| enabled | Booleano, true por defecto; el ejemplo lo desactiva explícitamente |
| manual_trigger / show_on_dashboard / allow_manual_trigger | Booleanos para el disparo y la presentación, no para los permisos del solicitante |
| cooldown_ms | Milisegundos, entero sin signo de 32 bits |
| revision | Revisión de la regla; usa la revisión consultada como expected_revision para condicionar la actualización |
| logic / conditions | and/or, and por defecto; hasta 255 condiciones |
| actions | Hasta 255 entradas; una regla habilitada no puede carecer de acciones |

Una condición es {variable, operator, value}; los operadores son eq/ne/lt/le/gt/ge/contains. Los valores siguen el modelo de variables. También se admite conditions:{logic, items:[...]}; elige una representación.

Las acciones de regla en línea usan **campos planos**: log tiene level/message, SSH tiene host_ref/command y GPIO tiene pin/level. Las plantillas usan, en cambio, subobjetos anidados. El tipo SSH en línea es ssh; el de plantilla es ssh_cmd. Una referencia template_id tiene prioridad sobre los campos en línea almacenados en caché.

Campos comunes de acciones: delay_ms, async, repeat_mode (once/while_true/count), repeat_count de 0 a 255, repeat_interval_ms de 0 a 65535 y condition opcional (modelo de condición; null la elimina). Elige la repetición teniendo en cuenta los efectos de la acción.

| Tipo en línea | Campos planos |
| --- | --- |
| log / set_var | level/message; o variable/value/value_type |
| ssh / ssh_cmd_ref | host_ref/command/ssh_async/timeout_ms; o cmd_id |
| gpio / device_ctrl | pin/level booleano/pulse_ms; o device/action |
| webhook / cli | url/method/body_template; o command/var_name/timeout_ms |
| led | device/ctrl_type/r/g/b y demás campos planos; ctrl_type usa un enumerado entero, no las cadenas de las plantillas |

Para reglas LED complejas, usa preferentemente una plantilla guardada. ctrl_type en línea: 0 fill, 1 effect, 2 brightness, 3 off, 4 text, 5 image, 6 qrcode, 7 filter, 8 filter_stop, 9 text_stop. qr_ecc en línea es un entero con el código de carácter: L76/M77/Q81/H72.

filter_params sigue siendo un objeto propio. Rangos enteros: speed 1-100; intensity/density/decay/amplitude 0-255; scale 1-100; levels 2-16; amount/saturation/frequency 0-100; angle 0-360; width 1-16; wavelength 1-32. Estas unidades de plantilla o interfaz difieren de las de algunos filtros LED directos. No pongas una solicitud API completa dentro del array actions.

## Configuración de módulos

config.module.show devuelve el objeto config del módulo. Lee los campos existentes antes de cambiar una clave con config.module.set. Módulos: net/dhcp/wifi/nat/led/fan/device/system. Consulta las operaciones individuales para conocer todas las capacidades. key es local al módulo; conserva el tipo de value.

config.module.save y el estado dirty son independientes de active_version de automatización. Los cambios de red pueden interrumpir el acceso; registra primero la ruta de acceso. Las vistas WiFi con un nivel inferior a ADMIN omiten las contraseñas.

## Widgets de supervisión

ui.widgets guarda el JSON de distribución de la interfaz; no crea recolectores de datos. widgets es un array que interpreta la interfaz y puede estar vacío al principio. Parte de ui.widgets.get y conserva los campos e identificadores existentes. refresh_interval se expresa en milisegundos y es 5000 por defecto. La configuración serializada completa está limitada a 4000 bytes. nvs_saved no implica que una variable tenga datos.

## Importación, eliminación y selección de fuente

Previsualiza antes de aplicar y usa las condiciones previas de la previsualización. tscfg es el JSON completo del paquete como **cadena**, no un objeto arbitrario. La importación de hosts, comandos, fuentes y acciones usa expected_digest/expected_credential. La importación de reglas tiene campos de confirmación distintos; consulta su referencia.

Previsualiza el impacto antes de elegir una eliminación ordinaria, una sustitución o una eliminación en cascada. Eliminar definiciones no detiene automáticamente los procesos remotos ni revoca claves remotas. Seleccionar SD o una copia interna sustituye el conjunto de configuración; usa automation.config.preview/apply en lugar de sobrescribir archivos protegidos.
