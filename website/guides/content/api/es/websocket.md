# Integración con WebSocket

Conecta con `ws://10.10.99.97/ws`, sustituyendo la dirección por la IP de tu dispositivo. Este canal proporciona telemetría, registros, comandos del controlador y SSH interactivo. Establecer una conexión no autoriza por sí solo el acceso a funciones privadas.

## Autenticarse y suscribirse

Obtén un token mediante el inicio de sesión HTTP y envía:

```json
{"type":"auth","token":"YOUR_TOKEN"}
```

Espera auth_ok; un fallo devuelve auth_error. Los temas de telemetría ordinarios son públicos en esta versión, pero la autenticación sigue siendo útil para las funciones protegidas. Autenticarse no puede elevar una sesión READ a ROOT.

```json
{"type":"subscribe","topic":"fan.status","params":{"interval":5000}}
```

Confirmación de una suscripción correcta:

```json
{"type":"subscribed","topic":"fan.status","success":true}
```

Ejemplo de mensaje de datos:

```json
{"type":"data","topic":"fan.status","timestamp":123,"data":{"fans":[]}}
```

timestamp se expresa en **segundos desde el arranque**; las mediciones HTTP y los registros pueden usar milisegundos. Una suscripción correcta no demuestra que ya haya llegado la primera medición. Si dejan de llegar actualizaciones, comprueba el estado del canal y de la fuente, y consulta el estado por HTTP cuando sea necesario.

## Temas

| Tema | Intervalo de visualización predeterminado/mínimo | Contenido |
| --- | --- | --- |
| system.dashboard | 1000 ms | cpu/memory/info/network/power/fan/services; pueden omitirse las secciones no disponibles |
| system.info | 5000 ms | Información del controlador |
| system.memory | 5000 ms | Memoria del controlador |
| system.cpu | 1000 ms | CPU del controlador |
| network.status | 5000 ms | Estado de la red |
| power.status | 5000 ms | Estado de alimentación |
| fan.status | 5000 ms | Ventiladores |
| service.list | 5000 ms | Servicios del controlador |
| device.status | Por eventos, 2000 ms por defecto | Eventos de estado del ordenador, no una instantánea completa periódica |
| ota.progress | Por eventos, 1000 ms por defecto | Progreso de todo el dispositivo; comprueba el progreso HTTP y la versión después del reinicio |
| config.pack.validated | Por eventos, 0 por defecto | Validación del paquete cargado, no aplicación de la configuración |

params.interval es un entero no negativo en milisegundos. Los primeros ocho temas periódicos rechazan 0 y elevan los intervalos inferiores a su mínimo. Un intervalo no convierte los tres últimos temas basados en eventos en consultas periódicas. Volver a suscribirse al mismo tema en una conexión actualiza esa suscripción; no crea una cola de historial.

Cancela la suscripción con `{"type":"unsubscribe","topic":"fan.status"}` y comprueba unsubscribed/success. `{"type":"ping"}` recibe pong. Pong no demuestra que la sesión esté autorizada ni que la telemetría funcione correctamente.

## Registros

Se requiere ADMIN o superior. Autentícate y envía log_subscribe. El historial también requiere ADMIN.

| Tipo enviado | Campos | Resultado o efecto |
| --- | --- | --- |
| log_subscribe | minLevel, VERBOSE por defecto | log_subscribed/minLevel y después type=log |
| log_set_level | minLevel | Cambia el filtro de esta conexión, no los niveles de salida de todos los módulos |
| log_get_history | limit por defecto 500; minLevel ERROR; maxLevel VERBOSE | log_history con logs/total, limitado por la capacidad del búfer |
| log_unsubscribe | Ninguno | Detiene el flujo de registros de esta conexión |

Las entradas de registro contienen timestamp en milisegundos desde el arranque, level, levelName, tag, message y task. Los niveles 0-5 son NONE/ERROR/WARN/INFO/DEBUG/VERBOSE. La capacidad de conservación es limitada; volver a conectar no reproduce automáticamente el historial.

## Terminal de comandos del controlador

Este terminal controla el controlador de gestión, no el sistema Linux de ninguno de los ordenadores. Requiere ROOT y sus comandos pueden modificar el hardware o la configuración.

| Tipo enviado | Campos | Resultado |
| --- | --- | --- |
| terminal_start | token | Vincula y solicita el terminal; connected incluye prompt; si está ocupado, devuelve terminal_busy/retry_after |
| terminal_input | data: cadena de comando completa | Mensajes output/data y después done con code/output_incomplete/stopped |
| terminal_interrupt | Ninguno | Solicita la interrupción; command_stopping puede preceder a done |
| terminal_stop | Ninguno | Libera el terminal de esta conexión; no revierte efectos externos |

Solo puede haber un propietario del terminal activo a la vez. No tomes el control de un terminal en uso. La ausencia de salida no demuestra por sí sola que la ejecución haya fallado. En una primera integración, usa preferentemente las API HTTP de estado estructurado en lugar de analizar la salida del terminal.

## Shell SSH interactivo

Requiere ROOT. ssh_connect transmite token y vincula la conexión. Verifica primero las huellas remotas; este shell no tiene un interruptor para aceptar automáticamente huellas desconocidas.

| Tipo enviado | Campos | Resultado |
| --- | --- | --- |
| ssh_connect | token, host, user; port22/password opcionales para este acceso remoto | ssh_status connecting/connected/error; este acceso usa autenticación por contraseña |
| ssh_input | data | Escribe texto; incluye explícitamente los saltos de línea necesarios |
| ssh_resize | width, height | Enteros de 1 a 65535 para las columnas y filas del terminal |
| ssh_signal | signal | Envía una señal compatible; las solicitudes no admitidas fallan |
| ssh_disconnect | Ninguno | Desconecta el shell de esta conexión; comprueba el ssh_status final |

La salida utiliza ssh_output/data y el estado ssh_status/status/message. Cada conexión controla solo su propio shell. No repitas automáticamente una entrada tras un fallo de control o una desconexión; el destino remoto puede haberla recibido.

## SSH en streaming iniciado por HTTP

ssh.exec_stream se inicia por HTTP y devuelve session_id/boot_id/result_key. Es independiente del shell interactivo. Autentica WebSocket antes de iniciarlo para no perder los primeros eventos. Los eventos privados solo se envían a conexiones autorizadas para la sesión que inició la operación.

| Tipo recibido | Campos e interpretación |
| --- | --- |
| ssh_exec_start | session_id, command y patrones; iniciado, no completado |
| ssh_exec_output | session_id, output_offset, output_length, is_stderr, data_b64 |
| ssh_exec_match | session_id, expect_matched/fail_matched, extracted/is_final opcionales |
| ssh_exec_running | Respuesta de operación en curso de una consulta HTTP de estado |
| ssh_exec_done | session_id, execution_status, exit_code, status/success y coincidencias |
| ssh_exec_cancelled | session_id, execution_status; cancelar no demuestra que el proceso remoto haya terminado |
| ssh_exec_error | session_id, error, stage/detail opcionales |

Decodifica data_b64 como bytes, verifica output_length y usa output_offset para detectar huecos o duplicados. Mantén el estado de decodificación UTF-8 entre mensajes: un carácter puede abarcar varios mensajes.

Los resultados del terminal pueden incluir output_bytes/output_incomplete/collection_truncated/conditions_complete. **La finalización de la ejecución, la coincidencia de condiciones y la integridad de la salida son aspectos distintos.** exit_code=0 puede coexistir con una salida incompleta; una comprobación incompleta de condiciones no es un resultado positivo. Tras una desconexión, consulta ssh.exec_status con los datos de seguimiento; esta consulta no vuelve a ejecutar el comando ni garantiza recuperar toda la salida histórica.

## Capacidad y reconexión

Esta compilación admite ocho clientes WebSocket y 32 suscripciones a temas en el conjunto del servicio. Los mensajes grandes, clientes lentos, tareas exclusivas y el apagado pueden hacer que se rechacen operaciones. La entrada debe ser texto JSON del protocolo, con un máximo de 64 KiB; no uses la fragmentación como mecanismo para cargar archivos. También se aplican los límites de profundidad JSON.

Vuelve a conectar con una espera, autentícate de nuevo y restablece las suscripciones. No repitas automáticamente terminal_input, ssh_input ni controles HTTP. Muestra la antigüedad de la última actualización y el estado desactualizado o desconectado para que los valores antiguos no parezcan actuales.

El ejemplo subscribe.js incluido utiliza un navegador con acceso al dispositivo y no necesita bibliotecas de terceros.
