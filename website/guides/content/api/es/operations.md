# Mantener la integración en funcionamiento

## Gestionar la sesión

Mantén una sesión por proceso cliente y reutilízala en las solicitudes. Programa su renovación a partir de expires_in; vuelve a iniciar sesión después de un fallo claro de autenticación, no en cada consulta periódica. Hay ocho plazas de sesión compartidas por scripts y navegadores. Si están ocupadas, un nuevo inicio de sesión puede invalidar una sesión anterior de la misma cuenta.

Las sesiones normales caducan a los 86400 segundos en esta compilación. Un reinicio, el cierre de sesión, un cambio de contraseña o una revocación requieren volver a autenticarse. Trata los tokens como credenciales opacas; no intentes interpretar su contenido ni construirlos.

## Elegir entre consultas periódicas y suscripciones

Usa HTTP para lecturas ocasionales y WebSocket para un panel que se muestre de forma continua. Suscríbete solo a los temas necesarios y cancela las suscripciones al salir de la vista. Los intervalos de actualización de pantalla no cambian los periodos de muestreo del hardware ni de control del ventilador.

Tras una desconexión, vuelve a conectar, autentícate y restablece las suscripciones. No repitas automáticamente los comandos de alimentación, las ejecuciones SSH ni las actualizaciones. No se garantiza que se recuperen los datos de telemetría y los registros perdidos durante la desconexión.

## Seguir una operación

La ejecución SSH en streaming usa session_id+boot_id+result_key; el session_id de ejecución es distinto del session_id de inicio de sesión. OTA utiliza un progreso compartido por todo el dispositivo, sin datos de seguimiento privados por operación.

Para consultar un resultado SSH necesitas los datos de seguimiento completos y la sesión que inició la operación; para cancelarla puede bastar el session_id de ejecución de esa misma sesión. No compartas los datos de seguimiento. Un reinicio, la sustitución de una operación o el plazo de conservación pueden impedir consultar el resultado; en ese caso, comprueba el estado remoto. Coordina el inicio, la cancelación y el seguimiento de OTA desde un único proceso de mantenimiento: su estado global no representa una tarea privada y exclusiva.

## Tiempos de espera y reintentos

Establece por separado los límites de tiempo de conexión y de ejecución. Los escaneos, diagnósticos de red, comandos remotos y actualizaciones pueden tardar más que una lectura habitual. Un tiempo de espera HTTP agotado no cancela el trabajo en el servidor.

Reintenta las consultas limitando las solicitudes simultáneas y aumentando la espera. Si no conoces el resultado de una escritura, consulta primero el estado; repítela solo si sabes que no se inició y todavía es necesaria. Es preferible indicar el estado deseado en lugar de usar toggle.

## Cambios de configuración

Lee active_version antes de escribir y vuelve a consultar la versión tras un conflicto. Las reglas también pueden requerir expected_revision. No sobrescribas objetos completos a partir de una respuesta de lista con campos filtrados.

Registra la versión de la aplicación, la fecha y hora de compilación y las capacidades que usa tu integración. Una misma cadena de versión puede corresponder a compilaciones reparadas diferentes. Después de una actualización, revisa los cambios en métodos, roles, campos y funciones obsoletas.

## Registros operativos

Registra la hora, el destino, el tipo de operación, el código de la operación, un motivo breve y los identificadores no secretos de la operación. Si necesitas conservar credenciales de resultados, guárdalas en un almacenamiento con acceso controlado. Los registros ordinarios no deben incluir Authorization, cuerpos de inicio de sesión, claves privadas ni secretos de paquetes.
