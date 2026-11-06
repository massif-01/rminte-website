# Ejemplos por tarea

Los ejemplos usan TS_BASE y TS_TOKEN del [inicio rápido](quickstart.md). Sustituye las direcciones, los identificadores de objetos, las versiones de configuración y los datos de seguimiento por los valores reales. Los ejemplos de control tienen efectos reales: ejecuta solo la tarea que quieras realizar.

## Supervisar el dispositivo

Lee las temperaturas, la refrigeración, la alimentación y el estado de los ordenadores desde tu sistema de supervisión. Inicia sesión para las capacidades READ; algunas API de resumen son públicas.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/temp/read"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/fan/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/power/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/device/status?device=agx"
```

Conserva valid de temperatura, duty_valid del ventilador, valid/crc_valid de alimentación y las horas de la última actualización. Muestra de forma explícita los estados inválidos o desconectados. duty es un porcentaje; rpm es la velocidad de giro. El estado state=on de un ordenador no demuestra que su aplicación esté lista. Consulta [Modelos de respuesta](response-models.md).

Una supervisión correcta requiere mediciones válidas que sigan actualizándose. Usa WebSocket para un panel continuo. Si las temperaturas no son válidas, consulta temp.sources; si falla la telemetría de cómputo, consulta monitor.status. No sustituyas los valores ausentes por cero. El ejemplo Python incluido solo inicia sesión, consulta y cierra la sesión.

## Controlar un ordenador

Requiere ADMIN. Lee primero device.status para identificar agx o lpmu y su estado actual. Usa una acción explícita on/off en lugar de repetir toggle después de agotar el tiempo de espera.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"agx","action":"on"}' \
  "$TS_BASE/api/v1/device/power"
```

Después consulta device.status mediante GET y comprueba state/power_good. Verifica que la aplicación esté lista en el ordenador de destino o mediante una API de comprobación de estado de la aplicación. Para un apagado normal usa off. force_off/reset interrumpen el trabajo y pueden provocar pérdida de datos; prepara primero el mantenimiento del sistema de destino.

Para cambiar USB, envía POST a device.usb.set con `{"target":"agx"}` y consulta después device.usb.status mediante GET. Los otros destinos son esp32/lpmu/disconnect. La ruta anterior puede desconectarse durante el cambio; esto no implica por sí solo un fallo del dispositivo.

Si se agota el tiempo de espera, consulta el estado antes de reintentar. Conserva el estado de error, la indicación de alimentación y los detalles si el destino no alcanza el estado esperado.

## Ajustar luces y ventiladores

Las operaciones LED habituales requieren ADMIN. Consulta led.list mediante GET para obtener el nombre de un dispositivo y, después, aplica un color de relleno:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"board","color":"#00A0FF"}' \
  "$TS_BASE/api/v1/led/fill"
```

Vuelve a consultar led.list. Para conservar la presentación tras un reinicio, envía por separado POST a led.save con `{"device":"board"}` y comprueba saved. Mostrar el contenido y guardar la configuración de arranque son pasos distintos.

Para los ventiladores, consulta primero fan.status/config. Envía POST a fan.set con `{"id":0,"duty":50}` solo después de obtener el identificador real del ventilador. fan.mode selecciona off/manual/auto/curve. Los permisos de curva, límites y persistencia se indican en la [referencia de ventiladores](reference/fan.md).

Después de cambiar la salida, comprueba duty_valid/duty/target_duty, la temperatura y los fallos. Restaura el modo de control previsto después de un ajuste manual temporal.

## Gestionar tareas remotas

Usa ssh.exec/exec_stream para un comando puntual; para un servicio gestionado de forma continua, usa un comando SSH guardado y su registro de ejecución. Ejecutar comandos sin procesar requiere ROOT; iniciar un servicio gestionado existente requiere al menos ADMIN.

Antes de iniciar, confirma la conectividad, una huella de host verificada y un host guardado que haga referencia a una clave SSH válida. Las huellas desconocidas o modificadas se verifican con ssh.test y una fuente de confianza, no borrando la confianza ni aceptándolas automáticamente.

1. Con root, consulta ssh.hosts y ssh.commands. Comprueba host, command, service_mode y los criterios de disponibilidad. Consulta [Modelos de configuración](configuration-models.md).
2. Lee el active_version más reciente e inicia el servicio guardado:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"command_id":"YOUR_SERVICE_COMMAND_ID","active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/ssh/services/start"
```

3. Conserva run_id y operation_id. Envía POST a automation.services.status con `{"run_id":"YOUR_RUN_ID","verify":true}`. Comprueba operation_phase, busy y state. verify conecta con el host original; no es una simple lectura de la caché local.
4. Verifica el funcionamiento y la disponibilidad de la aplicación. Para detenerla, envía POST a automation.services.stop con el run_id original y sigue consultando el estado.

Un run_id no indica que el servicio esté listo; last_known es una observación anterior. Eliminar la configuración o una clave local no detiene los procesos remotos. Usa la identidad de ejecución original en lugar de intentar identificar un proceso por su nombre.

Para una ejecución puntual en streaming, autentica WebSocket antes de enviar POST a ssh.exec_stream. Conserva todos los datos de seguimiento y consulta ssh.exec_status tras una interrupción. No vuelvas a ejecutar un comando solo para recuperar la salida que falta. Consulta [SSH en streaming](websocket.md#http-started-streaming-ssh) para distinguir ejecución, coincidencia de condiciones e integridad de la salida.

## Configurar la automatización

El flujo consiste en obtener datos, asignarlos a variables y ejecutar una acción cuando se cumplan las condiciones. Con root, consulta primero automation.status/config.status. Resuelve los problemas de carga, habilitación, pausa o selección de fuente SD antes de editar.

Empieza con una variable de usuario guardada:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/automation/config/status"
```

Usa su active_version en la siguiente solicitud:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/automation/variables/set"
```

Consulta automation.variables.get con root para confirmar value, readonly y source_id. Conserva el nuevo active_version. Crea una regla enabled:false a partir del [modelo de reglas](configuration-models.md#automation-rules); usa una acción de registro antes de añadir efectos de alimentación o ejecución remota.

Añade una fuente de datos real solo cuando la necesites. Verifica la llegada de datos, las actualizaciones de variables y el estado desactualizado antes de habilitar la regla. Guardar una definición, habilitar la configuración, iniciar el motor y ejecutar acciones son estados distintos; saved:true no basta.

Después de un conflicto, vuelve a leer e integra los cambios. Previsualiza el impacto de una eliminación. Usa la previsualización y aplicación para seleccionar SD o una copia de seguridad. Respeta los resultados de pausa u ocupado; no sobrescribas los archivos gestionados.

## Mantener el dispositivo

Elige un único objetivo de mantenimiento cada vez para poder comprobar sus efectos.

| Objetivo | Secuencia | Finalización |
| --- | --- | --- |
| Copiar un objeto como respaldo | Exporta con el rol requerido por el objeto; guarda tscfg; previsualiza cualquier importación posterior | Paquete completo conservado y verificable; exportar no equivale a recuperar |
| Guardar un archivo | Carga, consulta los atributos, descarga y compara | Ruta, longitud y bytes previstos |
| Actualizar firmware/WWW | Comprueba que las imágenes correspondan, transfiere, consulta el progreso global, confirma el estado y reinicia si es necesario | Identidad y versión correctas en ejecución y aplicación operativa |
| Cambiar la red | Registra el acceso y la configuración anteriores; modifica, guarda y vuelve a conectar | Funcionan tanto el acceso de gestión como la red de destino |
| Cambiar una contraseña | change_password, vuelve a iniciar sesión y actualiza las sesiones de los clientes | Funcionan las credenciales nuevas; no se da por supuesta la validez de las sesiones antiguas |
| Instalar un certificado de identidad | Comprueba que CSR y clave correspondan, instala y verifica cert.status y la confianza del cliente | Material correcto, identidad cargada real y conexión del cliente verificada |

Consulta [Transferencias y actualizaciones](transfers.md) para las solicitudes completas y los límites de capacidad. cert.* gestiona la identidad del dispositivo, key.* las claves SSH y hosts.* las huellas remotas. Después de un fallo, determina qué fases han surtido efecto antes de reintentar o recuperar.
