# Transferencia de archivos y actualizaciones

Los archivos ordinarios y las imágenes APP/WWW usan rutas binarias específicas. El cuerpo contiene los bytes originales del archivo; las respuestas correctas no siempre incluyen code. Estas rutas son independientes de los 277 nombres lógicos de API.

## Archivos ordinarios

| Ruta | Método y acceso | Solicitud y resultado |
| --- | --- | --- |
| /api/v1/file/download | GET, READ; ADMIN para rutas sensibles | Ruta absoluta en los parámetros de la URL; la respuesta contiene los bytes de un archivo, no un directorio |
| /api/v1/file/upload | POST, ADMIN | Ruta de destino en la URL y bytes originales en el cuerpo; el éxito devuelve path/size/status=uploaded |

Las cargas HTTP solo admiten archivos ordinarios validados dentro de `/sdcard/`. Otras operaciones, como storage.rename/delete, tienen un ámbito de rutas distinto; no permiten cargar por HTTP en `/spiffs/` o `/www/`. Leer configuraciones sensibles o claves privadas requiere ADMIN. Los directorios gestionados de automatización, alias, copias de seguridad y archivos temporales siguen protegidos; modifícalos mediante las API de configuración de objetos.

Las cargas admiten hasta 16 MiB, con un tiempo de recepción máximo de 300 segundos, y están limitadas además por la memoria, el espacio libre y el estado del almacenamiento. Envía un archivo completo y no vacío. Repetir la solicitud no añade fragmentos al archivo. Una carga sustituye el destino existente; guarda primero el contenido que necesites conservar. Aplica una sola vez la codificación de URL a las rutas.

Configura TS_BASE y TS_TOKEN antes de ejecutar:

```sh
curl --connect-timeout 5 --max-time 330 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @example.txt \
  "$TS_BASE/api/v1/file/upload?path=/sdcard/example.txt"

curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  --get --data-urlencode 'path=/sdcard/example.txt' \
  "$TS_BASE/api/v1/file/download" -o downloaded-example.txt
```

Cargar un archivo .tscfg añade información config_pack.valid/reason/signature. uploaded significa que se ha guardado, no que sea de confianza ni que se haya aplicado. Usa la importación específica del objeto para previsualizar y aplicar; config.pack.apply no aplica una configuración genérica. Los paquetes de datos ordinarios y los paquetes de reglas que contienen comandos tienen comprobaciones distintas de uso de firma; la validación ordinaria no sustituye la validación de importación de reglas.

Si aparece file_replace_uncertain o se pierde la conexión, consulta los metadatos del archivo y descarga su contenido antes de reintentar.

## Preparar las imágenes

Obtén una imagen APP completa del firmware y un www.bin correspondiente al hardware, la distribución de particiones y la versión del firmware. Una imagen WWW no es un archivo HTML individual. Haz una copia de seguridad de la configuración, asegura una alimentación estable, reserva una ventana de mantenimiento y prepara una vía de recuperación.

Las descargas admiten HTTP y HTTPS. HTTPS utiliza por defecto la confianza de certificados del sistema. skip_verify es una opción de descarga; no puede corregir imágenes dañadas o incompatibles ni la falta de capacidad. Normalmente debes mantenerlo en false. Las API actuales de inicio no aceptan un parámetro cert_pem de una CA privada.

## Elegir el método de transferencia

| Método | API | Requisitos |
| --- | --- | --- |
| Descarga desde el dispositivo | ota.start_url / ota.www.start | El dispositivo puede acceder al servidor de imágenes; comprueba la red y el almacenamiento |
| Archivo en SD | ota.start_file / ota.www.start_sdcard | SD montada con los archivos de imagen completos |
| Carga desde el cliente | Rutas binarias siguientes | El cliente dispone de los archivos completos y el dispositivo tiene una SD con escritura habilitada para los archivos intermedios y la caché de recuperación |

| Ruta | Método y acceso | Opciones y respuesta de éxito |
| --- | --- | --- |
| /api/v1/ota/firmware | POST, ADMIN | Imagen APP completa en el cuerpo; auto_reboot en la URL es true por defecto; status=success, size, message, reboot_pending, auto_reboot_requested |
| /api/v1/ota/www | POST, ADMIN | www.bin completo en el cuerpo; status=success, size, message; sin reinicio automático |

Ambas rutas admiten hasta 16 MiB con un tiempo de recepción máximo de 300 segundos, sujeto a la capacidad de la partición de destino y a la memoria. Se comprueban las cabeceras del firmware y que la instalación esté completa. Una carga correcta guarda los archivos de recuperación en SD y un manifiesto con la recuperación automática desactivada; comprobar que la aplicación funciona tras el reinicio es una fase independiente.

Este ejemplo desactiva el reinicio automático para que el proceso de mantenimiento pueda comprobar primero el resultado:

```sh
curl --connect-timeout 5 --max-time 600 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @firmware.bin \
  "$TS_BASE/api/v1/ota/firmware?auto_reboot=false"
```

firmware.bin es un nombre de archivo del cliente; sustitúyelo por la imagen completa del firmware. Esta solicitud escribe en el dispositivo. Con auto_reboot=true, se solicita un reinicio unos 2 segundos después de una respuesta correcta y la conexión puede cerrarse.

## Confirmar el progreso y la finalización

Después de iniciar por URL o SD, consulta ota.progress, o ota.www.progress para WWW. El progreso es compartido por todo el dispositivo, sin datos privados de seguimiento por sesión. Coordina las actualizaciones desde un único proceso de mantenimiento para evitar inicios simultáneos o cancelar otra actualización.

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/ota/progress"
```

El progreso de APP contiene state/percent/received_size/total_size/message. WWW usa received/total y añade running. pending_reboot indica que hace falta reiniciar; error indica un fallo. Llegar al 100 % no demuestra por sí solo que la nueva versión esté ejecutándose. Para cancelar, envía un objeto vacío por POST a ota.abort u ota.www.abort y confirma el estado antes de iniciar de nuevo.

En las cargas binarias, usa la respuesta HTTP; no supongas que el progreso global identifica esta solicitud. HTTP409 con status=partial, error=recovery_cache_failed y flash_written=true significa que se ha escrito la memoria Flash, pero no se ha guardado por completo la caché de recuperación de la SD. Comprueba las particiones y los archivos de recuperación. Perder la respuesta tampoco demuestra que no se haya escrito nada.

Después de instalar el firmware, reinicia según lo previsto, vuelve a iniciar sesión, consulta ota.status/partitions y comprueba el funcionamiento de la aplicación. ota.validate confirma el firmware actual; llámala después de comprobar el estado de la aplicación.

## Reversión y recuperación desde SD

Comprueba ota.partitions.can_rollback antes de llamar a ota.rollback. La reversión puede reiniciar el dispositivo de inmediato. Vuelve a conectar y verifica la versión, la compatibilidad de la configuración y el estado de la aplicación.

La recuperación desde SD utiliza TianShanOS.bin, www.bin y manifest.json dentro de `/sdcard/recovery/`. armed controla si la recuperación está habilitada; force controla la comparación de versiones. Que los archivos existan no significa que la recuperación esté habilitada. Sigue el procedimiento de recuperación del distribuidor, ya que afecta a un arranque posterior y al almacenamiento persistente; cargar los archivos no demuestra por sí solo que la recuperación sea correcta.

No se expone ninguna API de preparación, estado o autorización de la recuperación. No inventes rutas ni consideres ota.upload_begin/end/abort un protocolo completo de transferencia por fragmentos. Las integraciones ordinarias deben usar las rutas binarias anteriores.
