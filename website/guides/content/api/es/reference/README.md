# Índice de la API

277 nombres registrados en 28 grupos: 276 entradas con manejadores de operación, incluidos los alias, y una entrada conservada no admitida. El registro no demuestra que las dependencias estén listas. Las rutas binarias específicas y WebSocket se describen en capítulos separados.

## Enviar un ejemplo

Guarda el JSON de la API de destino como request.json y sustituye los valores de ejemplo. Envíalo por POST a la ruta indicada. En las API públicas puedes omitir la cabecera Authorization.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

Un objeto vacío {} consulta o no utiliza argumentos de operación. Las escrituras tienen efectos reales. Obtén primero la versión, el ID de objeto, el certificado o el material de distribución que se requiera. GET solo se permite donde se indique; usa POST JSON para parámetros complejos.

## Grupos

| Grupo | Contar |
| --- | --- |
| [Cuentas y períodos de sesiones](auth.md) | 7 |
| [Estado de control](system.md) | 8 |
| [Fans](fan.md) | 8 |
| [Temperatura](temp.md) | 6 |
| [Poder y protección](power.md) | 13 |
| [Computadoras y USB](device.md) | 9 |
| [Configuración general y módulo](config.md) | 10 |
| [Red](network.md) | 9 |
| [Gestión de WiFi](wifi.md) | 4 |
| [Red de reenvío](nat.md) | 4 |
| [Asignación](dhcp.md) | 4 |
| [Hora](time.md) | 5 |
| [Archivos de dispositivo](storage.md) | 9 |
| [Servicios de control](service.md) | 5 |
| [Supervisión de los costos](monitor.md) | 6 |
| [Diseño de supervisión](ui.md) | 2 |
| [Logs](log.md) | 5 |
| [huellas dactilares SSH](hosts.md) | 5 |
| [Llaves de SSH](key.md) | 6 |
| [Certificados de dispositivo](cert.md) | 7 |
| [Luces y matriz](led.md) | 24 |
| [Mantenimiento de pins](gpio.md) | 4 |
| [Configuración de red de ordenadores de aplicaciones](lpmu_access.md) | 3 |
| [SSH conexiones y comandos](ssh.md) | 23 |
| [Archivos remotos](sftp.md) | 6 |
| [Automatización y servicios gestionados](automation.md) | 56 |
| [Paquetes de configuración](config_pack.md) | 8 |
| [Actualizaciones y recuperación](ota.md) | 21 |

## Todos los nombres

| Nombre | Propósito | Acceso mínimo | Métodos | Disponibilidad |
| --- | --- | --- | --- | --- |
| [auth.admin.reset_password](auth.md#authadminreset_password) | Restablecer la contraseña predeterminada de admin | ROOT | POST | Condicional; ver detalles |
| [auth.admin.set_password](auth.md#authadminset_password) | Establecer la contraseña de admin como root | ROOT | POST | Condicional; ver detalles |
| [auth.change_password](auth.md#authchange_password) | Cambiar la contraseña | Token en el cuerpo (específico de autenticación) | POST | Condicional; ver detalles |
| [auth.login](auth.md#authlogin) | Iniciar sesión | Público | POST | Condicional; ver detalles |
| [auth.logout](auth.md#authlogout) | Cerrar sesión | Token en el cuerpo (específico de autenticación) | POST | Condicional; ver detalles |
| [auth.root.set_password](auth.md#authrootset_password) | Establecer la contraseña de root como root | ROOT | POST | Condicional; ver detalles |
| [auth.status](auth.md#authstatus) | Comprobar el estado de autenticación | Token en el cuerpo (específico de autenticación) | POST | Condicional; ver detalles |
| [automation.action.stats](automation.md#automationactionstats) | Consultar estadísticas de ejecución de acciones | READ | GET/POST | Condicional; ver detalles |
| [automation.action.stats.reset](automation.md#automationactionstatsreset) | Restablecer las estadísticas de acciones | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.actions.add](automation.md#automationactionsadd) | Crear una plantilla de acción | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.actions.delete](automation.md#automationactionsdelete) | Eliminar una plantilla de acción | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.actions.execute](automation.md#automationactionsexecute) | Ejecutar una plantilla de acción | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.actions.export](automation.md#automationactionsexport) | Exportar una plantilla de acción como paquete .tscfg | ROOT | POST | Condicional; ver detalles |
| [automation.actions.get](automation.md#automationactionsget) | Consultar una plantilla de acción por ID | READ | GET/POST | Condicional; ver detalles |
| [automation.actions.import](automation.md#automationactionsimport) | Importar una plantilla de acción desde un paquete de configuración | ROOT | POST | Condicional; ver detalles |
| [automation.actions.list](automation.md#automationactionslist) | Enumerar todas las plantillas de acciones | READ | GET/POST | Condicional; ver detalles |
| [automation.actions.update](automation.md#automationactionsupdate) | Actualizar una plantilla de acción existente | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.config.apply](automation.md#automationconfigapply) | Aplicar la restauración o selección de fuente confirmada | ROOT | POST | Condicional; ver detalles |
| [automation.config.backup](automation.md#automationconfigbackup) | Guardar la configuración completa de emergencia | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.config.enable](automation.md#automationconfigenable) | Habilitar o pausar explícitamente la configuración actual | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.config.preview](automation.md#automationconfigpreview) | Previsualizar una restauración o selección de fuente | ROOT | POST | Condicional; ver detalles |
| [automation.config.refresh](automation.md#automationconfigrefresh) | Comprobar la SD una vez sin cambiar la selección del usuario | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.config.status](automation.md#automationconfigstatus) | Consultar el estado de almacenamiento y respaldo de automatización | READ | GET/POST | Condicional; ver detalles |
| [automation.pause](automation.md#automationpause) | Pausar el motor de automatización | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.proxy.fetch](automation.md#automationproxyfetch) | Consultar una API REST externa a través del dispositivo | READ | POST | Condicional; ver detalles |
| [automation.proxy.socketio_test](automation.md#automationproxysocketio_test) | Probar una conexión Socket.IO con el protocolo v4 | ROOT | POST | Condicional; ver detalles |
| [automation.proxy.websocket_test](automation.md#automationproxywebsocket_test) | Probar una conexión WebSocket | ROOT | POST | Condicional; ver detalles |
| [automation.reload](automation.md#automationreload) | Volver a cargar la configuración | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.resume](automation.md#automationresume) | Reanudar el motor de automatización | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.rules.add](automation.md#automationrulesadd) | Añadir una regla | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.rules.delete](automation.md#automationrulesdelete) | Eliminar una regla | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.rules.disable](automation.md#automationrulesdisable) | Deshabilitar una regla | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.rules.enable](automation.md#automationrulesenable) | Habilitar una regla | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.rules.export](automation.md#automationrulesexport) | Exportar una regla como paquete .tscfg | ROOT | POST | Condicional; ver detalles |
| [automation.rules.get](automation.md#automationrulesget) | Consultar los detalles de una regla por ID | READ | GET/POST | Condicional; ver detalles |
| [automation.rules.import](automation.md#automationrulesimport) | Importar una regla desde un paquete de configuración | ROOT | POST | Condicional; ver detalles |
| [automation.rules.list](automation.md#automationruleslist) | Enumerar todas las reglas | READ | GET/POST | Condicional; ver detalles |
| [automation.rules.trigger](automation.md#automationrulestrigger) | Activar una regla manualmente | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.rules.update](automation.md#automationrulesupdate) | Actualizar una regla indicando la revisión esperada | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.services.list](automation.md#automationserviceslist) | Enumerar los controles independientes de servicios remotos | READ | GET/POST | Condicional; ver detalles |
| [automation.services.status](automation.md#automationservicesstatus) | Confirmar el estado de un proceso remoto gestionado | READ | GET/POST | Condicional; ver detalles |
| [automation.services.stop](automation.md#automationservicesstop) | Detener un proceso remoto gestionado verificado | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.add](automation.md#automationsourcesadd) | Añadir una fuente de datos | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.add_mapping](automation.md#automationsourcesadd_mapping) | Añadir una asignación de campo a una fuente existente | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.delete](automation.md#automationsourcesdelete) | Eliminar una fuente de datos | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.disable](automation.md#automationsourcesdisable) | Deshabilitar una fuente de datos | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.enable](automation.md#automationsourcesenable) | Habilitar una fuente de datos | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.export](automation.md#automationsourcesexport) | Exportar una fuente de datos como paquete .tscfg | ROOT | POST | Condicional; ver detalles |
| [automation.sources.import](automation.md#automationsourcesimport) | Importar una fuente de datos desde un paquete de configuración | ROOT | POST | Condicional; ver detalles |
| [automation.sources.list](automation.md#automationsourceslist) | Enumerar todas las fuentes de datos | READ | GET/POST | Condicional; ver detalles |
| [automation.sources.remove_mapping](automation.md#automationsourcesremove_mapping) | Eliminar una asignación de campo de una fuente de datos | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.sources.update](automation.md#automationsourcesupdate) | Actualizar una fuente de datos existente | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.start](automation.md#automationstart) | Iniciar el motor de automatización | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.status](automation.md#automationstatus) | Consultar el estado del motor de automatización | READ | GET/POST | Condicional; ver detalles |
| [automation.stop](automation.md#automationstop) | Detener el motor de automatización | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.test.device](automation.md#automationtestdevice) | Probar una acción de control de dispositivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.test.gpio](automation.md#automationtestgpio) | Probar una acción GPIO | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.test.led](automation.md#automationtestled) | Probar una acción LED | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.test.ssh](automation.md#automationtestssh) | Probar la ejecución de un comando SSH | ROOT | POST | Condicional; ver detalles |
| [automation.variables.delete](automation.md#automationvariablesdelete) | Eliminar una variable de usuario guardada | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [automation.variables.get](automation.md#automationvariablesget) | Consultar el valor de una variable | READ | GET/POST | Condicional; ver detalles |
| [automation.variables.list](automation.md#automationvariableslist) | Enumerar todas las variables | READ | GET/POST | Condicional; ver detalles |
| [automation.variables.set](automation.md#automationvariablesset) | Establecer el valor de una variable | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [cert.delete](cert.md#certdelete) | Eliminar todas las credenciales PKI | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [cert.generate_csr](cert.md#certgenerate_csr) | Generar una solicitud de firma de certificado | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [cert.generate_keypair](cert.md#certgenerate_keypair) | Generar un par de claves ECDSA P-256 | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [cert.get_certificate](cert.md#certget_certificate) | Obtener el certificado del dispositivo en formato PEM | Público | GET/POST | Condicional; ver detalles |
| [cert.install](cert.md#certinstall) | Instalar un certificado firmado | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [cert.install_ca](cert.md#certinstall_ca) | Instalar una cadena de certificados de CA | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [cert.status](cert.md#certstatus) | Consultar el estado de los certificados y del servicio de diagnóstico | Público | GET/POST | Condicional; ver detalles |
| [config.delete](config.md#configdelete) | Eliminar un valor de configuración | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.get](config.md#configget) | Consultar un valor de configuración | Público | GET/POST | Condicional; ver detalles |
| [config.list](config.md#configlist) | Enumerar las claves de configuración | ADMIN | GET/POST | Condicional; ver detalles |
| [config.module.list](config.md#configmodulelist) | Enumerar todos los módulos de configuración | READ | GET/POST | Condicional; ver detalles |
| [config.module.reset](config.md#configmodulereset) | Restablecer la configuración de un módulo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.module.save](config.md#configmodulesave) | Guardar la configuración de un módulo en NVS | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.module.set](config.md#configmoduleset) | Establecer la configuración de un módulo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.module.show](config.md#configmoduleshow) | Mostrar la configuración de un módulo | READ | GET/POST | Condicional; ver detalles |
| [config.pack.apply](config_pack.md#configpackapply) | Aplicación de configuración genérica no admitida | ADMIN | POST/PUT/DELETE | Sin apoyo |
| [config.pack.content](config_pack.md#configpackcontent) | Descifrar y obtener el contenido de un paquete importado | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.pack.export](config_pack.md#configpackexport) | Exportar la configuración como .tscfg cifrado | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.pack.export_cert](config_pack.md#configpackexport_cert) | Exportar el certificado del dispositivo para el cifrado | READ | GET/POST | Condicional; ver detalles |
| [config.pack.import](config_pack.md#configpackimport) | Validar un archivo .tscfg cargado en su ubicación actual | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.pack.info](config_pack.md#configpackinfo) | Consultar información del sistema de paquetes de configuración | READ | GET/POST | Condicional; ver detalles |
| [config.pack.list](config_pack.md#configpacklist) | Enumerar los archivos .tscfg de un directorio | READ | GET/POST | Condicional; ver detalles |
| [config.pack.verify](config_pack.md#configpackverify) | Verificar la firma de un paquete .tscfg | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.save](config.md#configsave) | Guardar la configuración en el almacenamiento | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [config.set](config.md#configset) | Establecer un valor de configuración | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [device.fan.set](device.md#devicefanset) | Establecer el modo y el porcentaje de salida del ventilador | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [device.fan.status](device.md#devicefanstatus) | Consultar el estado de los ventiladores | Público | GET/POST | Condicional; ver detalles |
| [device.ping](device.md#deviceping) | Probar la conectividad de red mediante un puerto TCP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [device.power](device.md#devicepower) | Controlar la alimentación del dispositivo (on/off/force_off) | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [device.power.status](device.md#devicepowerstatus) | Consultar las mediciones de alimentación | Público | GET/POST | Condicional; ver detalles |
| [device.reset](device.md#devicereset) | Reiniciar el dispositivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [device.status](device.md#devicestatus) | Consultar el estado de alimentación del dispositivo | Público | GET/POST | Condicional; ver detalles |
| [device.usb.set](device.md#deviceusbset) | Seleccionar el destino del multiplexor USB | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [device.usb.status](device.md#deviceusbstatus) | Consultar el estado del multiplexor USB | Público | GET/POST | Condicional; ver detalles |
| [dhcp.clients](dhcp.md#dhcpclients) | Enumerar los clientes DHCP | READ | GET/POST | Condicional; ver detalles |
| [dhcp.start](dhcp.md#dhcpstart) | Iniciar el servidor DHCP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [dhcp.status](dhcp.md#dhcpstatus) | Consultar el estado del servidor DHCP | READ | GET/POST | Condicional; ver detalles |
| [dhcp.stop](dhcp.md#dhcpstop) | Detener el servidor DHCP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.config](fan.md#fanconfig) | Consultar la configuración del ventilador, incluida la curva | READ | GET/POST | Condicional; ver detalles |
| [fan.curve](fan.md#fancurve) | Configurar la curva de temperatura de un ventilador | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.enable](fan.md#fanenable) | Habilitar o deshabilitar un ventilador | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.limits](fan.md#fanlimits) | Establecer los límites mínimo y máximo del porcentaje de salida | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.mode](fan.md#fanmode) | Seleccionar el modo de funcionamiento del ventilador | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.save](fan.md#fansave) | Guardar la configuración del ventilador en NVS | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.set](fan.md#fanset) | Establecer la velocidad del ventilador en modo manual | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [fan.status](fan.md#fanstatus) | Consultar el estado de los ventiladores | Público | GET/POST | Condicional; ver detalles |
| [gpio.info](gpio.md#gpioinfo) | Consultar información de un pin GPIO | READ | GET/POST | Condicional; ver detalles |
| [gpio.list](gpio.md#gpiolist) | Enumerar todos los pines GPIO controlables | READ | GET/POST | Condicional; ver detalles |
| [gpio.set](gpio.md#gpioset) | Establecer el nivel de un pin GPIO | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [gpio.toggle](gpio.md#gpiotoggle) | Conmutar el nivel de un pin GPIO | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [hosts.clear](hosts.md#hostsclear) | Borrar todos los hosts conocidos | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [hosts.info](hosts.md#hostsinfo) | Consultar información de un host conocido | READ | GET/POST | Condicional; ver detalles |
| [hosts.list](hosts.md#hostslist) | Enumerar todos los hosts SSH conocidos | READ | GET/POST | Condicional; ver detalles |
| [hosts.remove](hosts.md#hostsremove) | Eliminar un host conocido | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [hosts.update](hosts.md#hostsupdate) | Forzar la actualización de la huella de un host | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [key.delete](key.md#keydelete) | Eliminar una clave | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [key.export](key.md#keyexport) | Exportar una clave pública | READ | GET/POST | Condicional; ver detalles |
| [key.exportPrivate](key.md#keyexportprivate) | Exportar una clave privada, solo si es exportable | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [key.generate](key.md#keygenerate) | Generar una clave | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [key.info](key.md#keyinfo) | Consultar información de una clave | READ | GET/POST | Condicional; ver detalles |
| [key.list](key.md#keylist) | Enumerar todas las claves almacenadas | READ | GET/POST | Condicional; ver detalles |
| [led.boot.config](led.md#ledbootconfig) | Consultar la configuración de arranque de LED | READ | GET/POST | Condicional; ver detalles |
| [led.brightness](led.md#ledbrightness) | Consultar o establecer el brillo del dispositivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.clear](led.md#ledclear) | Apagar todos los LED del dispositivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.color.hsv](led.md#ledcolorhsv) | Convertir HSV a RGB | READ | GET/POST | Condicional; ver detalles |
| [led.color.parse](led.md#ledcolorparse) | Interpretar una cadena de color como RGB | READ | GET/POST | Condicional; ver detalles |
| [led.color_correction.export](led.md#ledcolor_correctionexport) | Exportar la configuración de corrección de color a la SD | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.color_correction.get](led.md#ledcolor_correctionget) | Consultar la configuración de corrección de color | READ | GET/POST | Condicional; ver detalles |
| [led.color_correction.import](led.md#ledcolor_correctionimport) | Importar la configuración de corrección de color desde la SD | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.color_correction.reset](led.md#ledcolor_correctionreset) | Restablecer la corrección de color a los valores predeterminados | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.color_correction.set](led.md#ledcolor_correctionset) | Establecer la configuración de corrección de color | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.effect.list](led.md#ledeffectlist) | Enumerar los efectos disponibles | READ | GET/POST | Condicional; ver detalles |
| [led.effect.start](led.md#ledeffectstart) | Iniciar un efecto en el dispositivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.effect.stop](led.md#ledeffectstop) | Detener un efecto en el dispositivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.fill](led.md#ledfill) | Aplicar un color a todos los LED | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.filter.list](led.md#ledfilterlist) | Enumerar los filtros de posprocesamiento disponibles | READ | GET/POST | Condicional; ver detalles |
| [led.filter.start](led.md#ledfilterstart) | Aplicar un filtro de posprocesamiento | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.filter.stop](led.md#ledfilterstop) | Detener un filtro de posprocesamiento | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.image](led.md#ledimage) | Mostrar una imagen en la matriz | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.list](led.md#ledlist) | Enumerar los dispositivos LED | Público | GET/POST | Condicional; ver detalles |
| [led.qrcode](led.md#ledqrcode) | Generar y mostrar un código QR | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.save](led.md#ledsave) | Guardar el estado actual como configuración de arranque | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.set](led.md#ledset) | Establecer un rango de píxeles LED | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.text](led.md#ledtext) | Mostrar texto en la matriz | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [led.text.stop](led.md#ledtextstop) | Detener la superposición de texto | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [log.capture](log.md#logcapture) | Habilitar o deshabilitar la captura de ESP_LOG | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [log.clear](log.md#logclear) | Borrar el búfer de registros | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [log.list](log.md#loglist) | Consultar entradas de registro con filtros | ADMIN | GET/POST | Condicional; ver detalles |
| [log.setLevel](log.md#logsetlevel) | Establecer el nivel de registro | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [log.stats](log.md#logstats) | Consultar estadísticas del sistema de registros | ADMIN | GET/POST | Condicional; ver detalles |
| [monitor.config](monitor.md#monitorconfig) | Consultar la configuración del monitor de cómputo | READ | GET/POST | Condicional; ver detalles |
| [monitor.data](monitor.md#monitordata) | Consultar la telemetría de cómputo más reciente | READ | GET/POST | Condicional; ver detalles |
| [monitor.set_server](monitor.md#monitorset_server) | Establecer la IP y el puerto del servidor de supervisión de cómputo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [monitor.start](monitor.md#monitorstart) | Iniciar la supervisión de cómputo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [monitor.status](monitor.md#monitorstatus) | Consultar el estado del monitor de cómputo | READ | GET/POST | Condicional; ver detalles |
| [monitor.stop](monitor.md#monitorstop) | Detener la supervisión de cómputo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [nat.disable](nat.md#natdisable) | Deshabilitar la pasarela NAT | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [nat.enable](nat.md#natenable) | Habilitar la pasarela NAT | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [nat.save](nat.md#natsave) | Guardar la configuración de NAT | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [nat.status](nat.md#natstatus) | Consultar el estado de la pasarela NAT | READ | GET/POST | Condicional; ver detalles |
| [network.eth.status](network.md#networkethstatus) | Consultar el estado de Ethernet | Público | GET/POST | Condicional; ver detalles |
| [network.hostname](network.md#networkhostname) | Consultar o establecer el nombre del host | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [network.lpmu_access.log](lpmu_access.md#networklpmu_accesslog) | Consultar el registro de una ejecución de configuración de red del ordenador de aplicaciones | ADMIN | GET/POST | Condicional; ver detalles |
| [network.lpmu_access.start](lpmu_access.md#networklpmu_accessstart) | Iniciar la configuración de acceso del ordenador de aplicaciones a la red superior | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [network.lpmu_access.status](lpmu_access.md#networklpmu_accessstatus) | Consultar el estado de la configuración de acceso del ordenador de aplicaciones a la red superior | ADMIN | GET/POST | Condicional; ver detalles |
| [network.status](network.md#networkstatus) | Consultar el estado general de la red | Público | GET/POST | Condicional; ver detalles |
| [network.wifi.ap.config](network.md#networkwifiapconfig) | Configurar el punto de acceso WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [network.wifi.ap.stations](network.md#networkwifiapstations) | Consultar las estaciones conectadas al punto de acceso | READ | GET/POST | Condicional; ver detalles |
| [network.wifi.connect](network.md#networkwificonnect) | Conectar a una red WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [network.wifi.disconnect](network.md#networkwifidisconnect) | Desconectar de WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [network.wifi.mode](network.md#networkwifimode) | Consultar o establecer el modo WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [network.wifi.scan](network.md#networkwifiscan) | Buscar redes WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.abort](ota.md#otaabort) | Solicitar la cancelación de una actualización del firmware | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.partitions](ota.md#otapartitions) | Consultar las particiones de actualización | READ | GET/POST | Condicional; ver detalles |
| [ota.progress](ota.md#otaprogress) | Consultar el progreso de actualización del firmware | READ | GET/POST | Condicional; ver detalles |
| [ota.rollback](ota.md#otarollback) | Revertir el firmware | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.server.get](ota.md#otaserverget) | Consultar la configuración del servidor de actualizaciones | READ | GET/POST | Condicional; ver detalles |
| [ota.server.set](ota.md#otaserverset) | Establecer la configuración del servidor de actualizaciones | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.start_file](ota.md#otastart_file) | Iniciar una actualización de firmware desde la SD | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.start_url](ota.md#otastart_url) | Iniciar una actualización de firmware desde una URL | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.status](ota.md#otastatus) | Consultar el estado de actualización del firmware | READ | GET/POST | Condicional; ver detalles |
| [ota.test_connection](ota.md#otatest_connection) | Probar una URL de actualización | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.upgrade_file](ota.md#otaupgrade_file) | Alias de compatibilidad de ota.start_file | ADMIN | POST/PUT/DELETE | Alias |
| [ota.upgrade_url](ota.md#otaupgrade_url) | Alias de compatibilidad de ota.start_url | ADMIN | POST/PUT/DELETE | Alias |
| [ota.upload_abort](ota.md#otaupload_abort) | Abortar el control de carga del firmware | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.upload_begin](ota.md#otaupload_begin) | Iniciar el control de carga del firmware | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.upload_end](ota.md#otaupload_end) | Finalizar el control de carga del firmware | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.validate](ota.md#otavalidate) | Confirmar que el firmware en ejecución funciona correctamente | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.version](ota.md#otaversion) | Consultar la versión del firmware | Público | GET/POST | Condicional; ver detalles |
| [ota.www.abort](ota.md#otawwwabort) | Solicitar la cancelación de una actualización WWW | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.www.progress](ota.md#otawwwprogress) | Consultar el progreso de actualización WWW | READ | GET/POST | Condicional; ver detalles |
| [ota.www.start](ota.md#otawwwstart) | Iniciar una actualización WWW desde una URL | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ota.www.start_sdcard](ota.md#otawwwstart_sdcard) | Iniciar una actualización WWW desde la SD | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.chip](power.md#powerchip) | Consultar los datos del chip de alimentación | Público | GET/POST | Condicional; ver detalles |
| [power.debug](power.md#powerdebug) | Establecer el modo de depuración | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.interval.set](power.md#powerintervalset) | Establecer el intervalo de muestreo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.monitor.start](power.md#powermonitorstart) | Iniciar la supervisión de alimentación | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.monitor.stop](power.md#powermonitorstop) | Detener la supervisión de alimentación | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.protection.config](power.md#powerprotectionconfig) | Consultar la configuración de protección de tensión | READ | GET/POST | Condicional; ver detalles |
| [power.protection.set](power.md#powerprotectionset) | Configurar la protección de tensión | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.protection.status](power.md#powerprotectionstatus) | Consultar el estado de protección de tensión | Público | GET/POST | Condicional; ver detalles |
| [power.stats](power.md#powerstats) | Consultar estadísticas de supervisión | READ | GET/POST | Condicional; ver detalles |
| [power.stats.reset](power.md#powerstatsreset) | Restablecer las estadísticas de supervisión | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.status](power.md#powerstatus) | Consultar el estado de supervisión de alimentación | Público | GET/POST | Condicional; ver detalles |
| [power.threshold.set](power.md#powerthresholdset) | Establecer los umbrales de tensión | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [power.voltage](power.md#powervoltage) | Consultar la tensión actual | Público | GET/POST | Condicional; ver detalles |
| [service.list](service.md#servicelist) | Enumerar todos los servicios | Público | GET/POST | Condicional; ver detalles |
| [service.restart](service.md#servicerestart) | Reiniciar un servicio | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [service.start](service.md#servicestart) | Iniciar un servicio | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [service.status](service.md#servicestatus) | Consultar el estado de un servicio | Público | GET/POST | Condicional; ver detalles |
| [service.stop](service.md#servicestop) | Detener un servicio | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [sftp.get](sftp.md#sftpget) | Descargar un archivo mediante SFTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [sftp.ls](sftp.md#sftpls) | Enumerar un directorio remoto mediante SFTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [sftp.mkdir](sftp.md#sftpmkdir) | Crear un directorio remoto mediante SFTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [sftp.put](sftp.md#sftpput) | Cargar un archivo mediante SFTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [sftp.rm](sftp.md#sftprm) | Eliminar un archivo remoto mediante SFTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [sftp.stat](sftp.md#sftpstat) | Consultar información de un archivo remoto mediante SFTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.cancel](ssh.md#sshcancel) | Cancelar una sesión SSH de ejecución en curso | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.commands.add](ssh.md#sshcommandsadd) | Añadir o actualizar la configuración de un comando SSH | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.commands.export](ssh.md#sshcommandsexport) | Exportar la configuración de un comando SSH como .tscfg | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.commands.get](ssh.md#sshcommandsget) | Consultar la configuración de un comando SSH por ID | READ | GET/POST | Condicional; ver detalles |
| [ssh.commands.import](ssh.md#sshcommandsimport) | Importar la configuración de un comando SSH desde .tscfg | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.commands.list](ssh.md#sshcommandslist) | Enumerar todas las configuraciones de comandos SSH | READ | GET/POST | Condicional; ver detalles |
| [ssh.commands.remove](ssh.md#sshcommandsremove) | Eliminar la configuración de un comando SSH | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.commands.update](ssh.md#sshcommandsupdate) | Actualizar una configuración de comandos SSH existente | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.copyid](ssh.md#sshcopyid) | Instalar una clave pública en el servidor remoto | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.exec](ssh.md#sshexec) | Ejecutar un comando remoto mediante SSH | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.exec_status](ssh.md#sshexec_status) | Consultar el resultado SSH actual o más reciente de la sesión solicitante | ROOT | GET/POST | Condicional; ver detalles |
| [ssh.exec_stream](ssh.md#sshexec_stream) | Ejecutar un comando remoto con salida en streaming por WebSocket | ROOT | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.hosts.add](ssh.md#sshhostsadd) | Añadir la configuración de un host SSH | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.hosts.export](ssh.md#sshhostsexport) | Exportar la configuración de un host SSH como .tscfg | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.hosts.get](ssh.md#sshhostsget) | Consultar la configuración de un host SSH por ID | READ | GET/POST | Condicional; ver detalles |
| [ssh.hosts.import](ssh.md#sshhostsimport) | Importar la configuración de un host SSH desde .tscfg | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.hosts.list](ssh.md#sshhostslist) | Enumerar todas las configuraciones de hosts SSH | READ | GET/POST | Condicional; ver detalles |
| [ssh.hosts.remove](ssh.md#sshhostsremove) | Eliminar la configuración de un host SSH | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.hosts.update](ssh.md#sshhostsupdate) | Actualizar una configuración de hosts SSH existente | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.keygen](ssh.md#sshkeygen) | Generar un par de claves SSH | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.revoke](ssh.md#sshrevoke) | Revocar una clave pública instalada en el servidor remoto | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.services.start](ssh.md#sshservicesstart) | Iniciar un servicio gestionado guardado | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ssh.test](ssh.md#sshtest) | Probar la conexión SSH | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [storage.delete](storage.md#storagedelete) | Eliminar un archivo o directorio | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [storage.info](storage.md#storageinfo) | Consultar información de un archivo | READ | GET/POST | Condicional; ver detalles |
| [storage.list](storage.md#storagelist) | Enumerar el contenido de un directorio | READ | GET/POST | Condicional; ver detalles |
| [storage.mkdir](storage.md#storagemkdir) | Crear un directorio | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [storage.mount](storage.md#storagemount) | Montar la tarjeta SD | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [storage.read](storage.md#storageread) | Leer el contenido de un archivo | READ | GET/POST | Condicional; ver detalles |
| [storage.rename](storage.md#storagerename) | Renombrar o mover un archivo | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [storage.status](storage.md#storagestatus) | Consultar el estado del almacenamiento | Público | GET/POST | Condicional; ver detalles |
| [storage.unmount](storage.md#storageunmount) | Desmontar la tarjeta SD | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [system.apis](system.md#systemapis) | Enumerar todas las API registradas | READ | GET/POST | Condicional; ver detalles |
| [system.cpu](system.md#systemcpu) | Consultar estadísticas de los núcleos de CPU | Público | GET/POST | Condicional; ver detalles |
| [system.info](system.md#systeminfo) | Consultar información del sistema | Público | GET/POST | Condicional; ver detalles |
| [system.log.level](system.md#systemloglevel) | Consultar o establecer el nivel de registro | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [system.memory](system.md#systemmemory) | Consultar información de memoria | Público | GET/POST | Condicional; ver detalles |
| [system.memory_detail](system.md#systemmemory_detail) | Consultar un análisis detallado de memoria | ADMIN | GET/POST | Condicional; ver detalles |
| [system.reboot](system.md#systemreboot) | Reiniciar el sistema | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [system.tasks](system.md#systemtasks) | Consultar la lista de tareas | ADMIN | GET/POST | Condicional; ver detalles |
| [temp.bind](temp.md#tempbind) | Vincular o desvincular una temperatura a una variable del sistema | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [temp.manual](temp.md#tempmanual) | Establecer o consultar el modo de temperatura manual | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [temp.read](temp.md#tempread) | Consultar la temperatura actual | READ | GET/POST | Condicional; ver detalles |
| [temp.select](temp.md#tempselect) | Establecer o consultar la fuente de temperatura preferida | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [temp.sources](temp.md#tempsources) | Consultar información de todas las fuentes de temperatura | READ | GET/POST | Condicional; ver detalles |
| [temp.status](temp.md#tempstatus) | Consultar el estado del sistema de temperatura | Público | GET/POST | Condicional; ver detalles |
| [time.force_sync](time.md#timeforce_sync) | Forzar la sincronización NTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [time.info](time.md#timeinfo) | Consultar información de sincronización horaria | Público | GET/POST | Condicional; ver detalles |
| [time.set_ntp](time.md#timeset_ntp) | Establecer el servidor NTP | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [time.set_timezone](time.md#timeset_timezone) | Establecer la zona horaria | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [time.sync](time.md#timesync) | Sincronizar la hora desde el navegador | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [ui.widgets.get](ui.md#uiwidgetsget) | Consultar la configuración de widgets de datos | READ | GET/POST | Condicional; ver detalles |
| [ui.widgets.set](ui.md#uiwidgetsset) | Guardar la configuración de widgets de datos | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [wifi.connect](wifi.md#wificonnect) | Conectar a una red WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [wifi.disconnect](wifi.md#wifidisconnect) | Desconectar de WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [wifi.scan](wifi.md#wifiscan) | Buscar redes WiFi | ADMIN | POST/PUT/DELETE | Condicional; ver detalles |
| [wifi.status](wifi.md#wifistatus) | Consultar el estado de WiFi | Público | GET/POST | Condicional; ver detalles |

## Otras superficies

[Transferencia de archivos/image](../transfers.md) | [WebSocket](../websocket.md) | [mTLS diagnostics](../compatibility.md#mtls-diagnostic-service)
