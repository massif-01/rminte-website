# Resolución de problemas

Registra el método, la ruta, el estado HTTP, el código de la operación, el motivo y los datos de seguimiento. No incluyas contraseñas, tokens, claves privadas ni cabeceras completas de autorización en las solicitudes de asistencia.

## No se puede conectar

Usa la dirección HTTP actual del dispositivo, por ejemplo http://10.10.99.97. El puerto predeterminado es 80 y no hace falta indicarlo explícitamente. Comprueba la dirección, la conectividad de red y el estado del servicio WebUI.

Que la página de diagnóstico mTLS funcione en el puerto 443 no demuestra que la API de gestión esté en marcha. Cuando funcione la solicitud pública system.info, comprueba el inicio de sesión y la función de destino.

## Fallo de autenticación o permisos

HTTP401 suele indicar que la sesión falta, es inválida o ha caducado; HTTP403 suele indicar permisos insuficientes. Algunos manejadores devuelven errores de autorización como errores de operación dentro de HTTP200.

Vuelve a iniciar sesión y comprueba data.level. Admin puede usar las API de configuración y mantenimiento que requieren ADMIN; la ejecución SSH sin procesar, la modificación de definiciones de automatización y ciertas operaciones de gestión de cuentas siguen requiriendo ROOT. La contraseña inicial es rm01; si se ha cambiado, usa la actual. Cambiar la contraseña revoca las sesiones afectadas. Espera a que termine un bloqueo de inicio de sesión; no lances reintentos simultáneos repetidos.

## Faltan temperaturas o telemetría

Comprueba en temp.sources la validez, la hora de actualización, la antigüedad y la fuente. Una entrada de temperatura basada en variables puede estar parcialmente desactualizada; comprueba los pesos y recuentos válidos. monitor.data depende de un servicio de monitorización en el host de cómputo; comprueba la conexión del monitor y la configuración de la dirección. Que el hardware esté encendido no garantiza que haya llegado telemetría.

## La solicitud se ha aceptado, pero no ha finalizado

Conserva y consulta los datos de seguimiento o el registro de ejecución. SSH requiere comprobar el estado final, el código de salida y la integridad de la salida; los servicios gestionados requieren un estado verificado; OTA requiere comprobar el progreso global, las particiones y la versión en ejecución tras el reinicio. started, cancel_requested o un registro histórico no bastan por sí solos.

## La configuración ha cambiado

Ante configuration_changed o un conflicto de versión, vuelve a leer el estado actual y el objeto correspondiente. Compara e integra tus cambios sin guardar antes de enviar la nueva versión. No te limites a sustituir el token de versión y repetir una solicitud de eliminación, importación o sobrescritura.

## Error al guardar o resultado desconocido

Comprueba applied, persisted, saved, uncertain, result_unknown y el motivo. El estado en ejecución puede cambiar aunque falle el almacenamiento. Vuelve a leerlo y comprueba después la configuración de arranque guardada o las copias de seguridad, según corresponda. Un fallo de red no demuestra que la solicitud no haya tenido efecto.

## La huella SSH ha cambiado

Detén los reintentos automáticos y obtén la huella actual del administrador del servidor. Comprueba si se ha reinstalado o sustituido el sistema o reasignado la dirección. Usa los campos de confirmación documentados solo después de verificar la identidad. Mantener la misma dirección no garantiza que sea el mismo host.

## Ocupado o sin capacidad

Reduce las solicitudes simultáneas, reutiliza sesiones y cierra las suscripciones o terminales que no uses. Comprueba las tareas activas. Reintentar desde el cliente no permite mantener una tarea en cola indefinidamente. Espera a que termine la secuencia de parada de tu propia tarea; no tomes el control de la de otra conexión.

## Ha fallado una carga o actualización

Comprueba el rol, que la solicitud se haya enviado completa, la ruta, el estado de la SD, el espacio libre, el tamaño de la partición de destino y que las imágenes estén completas y correspondan al hardware y la distribución de particiones. uploaded no significa que el paquete se haya validado ni que la instalación haya sido correcta. En SSH, consulta los datos de seguimiento conservados; en OTA, comprueba el progreso global y las particiones antes de reintentar, revertir o eliminar material de recuperación.
