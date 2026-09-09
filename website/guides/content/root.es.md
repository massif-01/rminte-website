# Guía de operaciones de TianshanOS para root

Los nombres de botones y secciones se conservan en inglés para que puedas localizarlos en el dispositivo. La WebUI del dispositivo admite chino e inglés; cambiar el idioma de este sitio no cambia los idiomas del dispositivo.

Esta guía se dirige a quienes administran TianshanOS con la cuenta root. La parte I explica las tareas habituales compartidas por admin y root. La parte II describe las páginas «Terminal», «Commands» y «Automation», exclusivas de root. Para gestionar la seguridad, consulta la Guía de seguridad de TianshanOS.

<!-- operational-note -->

root puede realizar operaciones de gran impacto que modifican el dispositivo, los hosts remotos y los flujos de automatización. Confirma el dispositivo actual, el host de destino y las tareas en curso antes de continuar.

Los controles disponibles dependen del dispositivo y de su configuración. Algunos solo aparecen cuando está conectado el hardware necesario o se ha configurado la función correspondiente.

## Parte I: tareas habituales de admin y root

## 1. Primeros pasos

### Abrir la interfaz web

1. Abre la interfaz web del dispositivo (WebUI) en la dirección facilitada por tu administrador.
2. Selecciona «Login» en la esquina superior derecha.
3. Introduce `root` y la contraseña de root suministrada con el dispositivo.
4. Selecciona «Login». Tras iniciar sesión, el nombre del usuario actual aparecerá en la esquina superior derecha.

Si todavía se utiliza la contraseña predeterminada, al iniciar sesión aparece «Security Reminder». Introduce la contraseña actual y la nueva y selecciona «Change Now». Escribe la nueva contraseña dos veces; ambas entradas deben coincidir. «Change Later» cierra el recordatorio.

Cuando termines, selecciona «Logout» en la esquina superior derecha. Tendrás que volver a iniciar sesión para utilizar el dispositivo.

### Cambiar de idioma

Selecciona el botón de idioma situado en la parte superior de la página y elige chino o inglés. El contenido y las etiquetas de los controles cambian al instante.

### Navegar por las páginas

root tiene acceso a estas páginas:

- «System»: consultar el estado del dispositivo, controlar módulos, ventiladores y LED, y abrir la actualización OTA.
- «Network»: consultar el estado de Ethernet y los clientes DHCP, configurar WiFi y gestionar el reenvío NAT.
- «Files»: gestionar los archivos de la tarjeta SD y de SPIFFS.
- «Terminal»: utilizar la consola del dispositivo y consultar los registros del sistema.
- «Automation»: gestionar fuentes de datos, variables, plantillas de acciones y reglas.
- «Commands»: gestionar y ejecutar comandos SSH remotos.
- «Security»: abrir la página de gestión de seguridad. Consulta las instrucciones en la Guía de seguridad.

## 2. Estado del sistema y operaciones habituales

Selecciona «System» en la navegación superior.

### Consultar los recursos y los servicios

«Resource Monitor» muestra el uso de CPU, DRAM y PSRAM. DRAM y PSRAM son memorias que el dispositivo utiliza para ejecutar programas.

- Selecciona «Details» para consultar la memoria total, utilizada y libre, así como su fragmentación.
- La cifra junto a «Services» indica los servicios en ejecución y el total de servicios.
- Selecciona «Services» para consultar el estado, la fase y el estado de funcionamiento de cada servicio.

Si un servicio indica «Failed» o un estado anómalo, actualiza primero la página para comprobar su situación actual.

### Consultar el sistema y la alimentación

«System Overview» muestra el chip, la versión del firmware, el tiempo de funcionamiento y la fecha de compilación. «Power Status» muestra la tensión de entrada, la tensión interna, la corriente, la potencia y el estado de protección.

El interruptor junto al estado de protección activa o desactiva la protección por baja tensión. Si está activada, cuando la tensión de entrada cae demasiado se ejecuta el proceso de apagado y recuperación configurado.

### Consultar la red y la hora

«Network & Time» muestra Ethernet, WiFi, la dirección IP, la hora actual, el estado de sincronización, la fuente de hora y la zona horaria.

- Selecciona «Sync Time» para copiar la hora actual del navegador al dispositivo.
- Selecciona «Timezone», elige una opción predefinida o introduce una configuración de zona horaria admitida y guarda los cambios.
- Selecciona «OTA Update» para abrir la página de actualización del firmware.

### Operaciones avanzadas

#### Reiniciar TianshanOS

El reinicio interrumpe temporalmente la interfaz web, Terminal, Automation y la gestión del dispositivo. Termina las tareas en curso antes de seleccionar «Reboot» y confirmar. La página indica que el sistema se está reiniciando. Vuelve a abrir la interfaz cuando el dispositivo esté disponible.

#### Reiniciar un servicio

Reiniciar un servicio interrumpe temporalmente la función que ofrece. Abre «Service Status», busca el servicio afectado y selecciona «Reboot» en su fila. Al terminar, comprueba de nuevo su estado y su funcionamiento.

#### Cambiar la configuración de apagado

Estos ajustes determinan cuándo se apaga el dispositivo tras una caída de tensión y cuándo vuelve a arrancar al recuperarse la alimentación. Utiliza valores adecuados para los requisitos eléctricos del dispositivo.

Selecciona «Shutdown Settings» para cambiar:

- «Low Voltage Threshold»: tensión por debajo de la cual comienza la cuenta atrás de apagado.
- «Recovery Threshold»: tensión por encima de la cual comienza la recuperación.
- «Shutdown Countdown»: tiempo hasta el apagado desde que se detecta una tensión baja.
- «Recovery Stabilization»: tiempo de espera para confirmar que la alimentación se ha estabilizado.
- «Fan Stop Delay»: demora antes de detener los ventiladores tras el apagado.

Guarda el formulario para aplicar los nuevos ajustes de protección.

#### Cambiar el destino del USB superior

Cambiar el destino USB puede desconectar temporalmente un dispositivo conectado. Confirma el destino y termina el trabajo en curso antes de continuar.

Cuando esta función está disponible, cada pulsación del botón «USB» cambia el puerto USB superior al siguiente destino: ESP, AGX y LPMU, en ese orden. El botón muestra el destino actual y la página confirma el cambio cuando se realiza correctamente.

## 3. Panel del dispositivo

«Device Panel», en la página «System», contiene los controles de alimentación de los módulos, las acciones rápidas y los widgets de datos.

### Controlar AGX y LPMU

Los botones AGX y LPMU muestran el estado actual. El verde indica que el dispositivo está en funcionamiento; el rojo, que está apagado. Durante la detección se muestra un estado de espera.

Un apagado forzado puede causar la pérdida de datos sin guardar. Guarda el trabajo del módulo y completa su apagado normal antes de cortar la alimentación.

- Selecciona el botón de estado de AGX para encenderlo o apagarlo. Espera al resultado final que muestra la página.
- Selecciona el botón de estado de LPMU para ejecutar la misma acción que con su botón físico de encendido. La página continúa comprobando el estado de LPMU. Si se agota el tiempo de detección, sigue el mensaje mostrado y evita pulsar repetidamente.

### Utilizar las acciones rápidas

«Quick Actions» muestra las reglas de automatización configuradas como «Manual Trigger Only».

1. Selecciona una tarjeta para ejecutar su acción.
2. Espera mientras la tarjeta indica que se está procesando.
3. Las tarjetas que admiten tareas en segundo plano muestran el estado de ejecución y los controles «Log» y «Stop».
4. Selecciona «Log» para ver la salida actual. Selecciona «Stop» para detener una tarea en ejecución.

<!-- operational-note -->

Debes detener una tarea en ejecución antes de volver a iniciarla. Tras activar una acción, espera unos segundos antes de iniciar otra.

Mantén pulsada una tarjeta hasta que aparezca el indicador de reordenación y arrástrala para cambiar su posición. «No Quick Actions» significa que no hay reglas manuales configuradas. Consulta «Gestión de la automatización» en la parte II para configurar reglas.

### Gestionar los widgets de datos

Los widgets muestran datos del dispositivo de forma continua en «Device Panel».

1. Selecciona «Widget Manager».
2. Elige un intervalo de actualización o desactiva la actualización automática.
3. Añade un widget predefinido o elige uno de los estilos de componente y fuentes de datos que ofrece la página.
4. Ajusta su etiqueta, estilo de visualización y unidad según necesites, y guarda los cambios.

Puedes editar, eliminar y reordenar los widgets existentes. También puedes seleccionar una tarjeta de widget para editarla. Mantén pulsado un widget y arrástralo a otra posición.

## 4. Gestión de ventiladores

«Fan Control» se encuentra en «System». La página solo muestra los ventiladores que ofrece el dispositivo en ese momento.

### Consultar el estado de los ventiladores

La barra de estado muestra «Effective Temp» y «Target Speed». En los modos Auto y Curve, el porcentaje de la tarjeta de cada ventilador es el valor de control objetivo. En el modo Manual, es el ajuste actual. RPM es la velocidad medida en revoluciones por minuto y solo aparece cuando hay una lectura válida. El porcentaje no es una lectura de RPM.

En el modo Auto, la tarjeta también puede mostrar el estado de control, una temperatura de referencia de seguridad, una previsión de temperatura a 45 segundos y la tasa de variación de la temperatura. La previsión permite que el ventilador responda antes de que aumente la temperatura. Si la lectura deja de ser válida, comprueba que su fuente sigue actualizándose; el dispositivo adopta un ajuste de protección del ventilador. Selecciona el botón de información de la tarjeta para conocer el modo Auto.

Selecciona el botón de actualización de la esquina superior derecha para volver a cargar el estado actual.

### Seleccionar un modo de funcionamiento

| Modo | Función |
| --- | --- |
| «Off» | Detiene el ventilador. |
| «Manual» | Utiliza un porcentaje de control fijo, ajustado con el deslizador de 0-100%. |
| «Auto» | Parte de la curva del ventilador y responde también a las tendencias de temperatura y los estados de protección. |
| «Curve» | Sigue los puntos de temperatura y velocidad configurados. |

<!-- operational-note -->

Apagar un ventilador o utilizar una velocidad manual baja reduce la refrigeración. Comprueba la carga y la temperatura del dispositivo antes de cambiar de modo y sigue vigilando la temperatura después.

En el modo «Manual», utiliza «Speed Adjust» para ajustar la velocidad. El deslizador no está disponible en los demás modos.

### Configurar una curva de ventilador

Selecciona «Curve» en la cabecera de Fan Control para abrir «Fan Curve Management». El botón «Curve» de una tarjeta de ventilador cambia su modo de funcionamiento.

1. En «Select Fan», elige el número del ventilador que deseas ajustar. Compruébalo con las tarjetas de la página System.
2. En «Bind Temperature Variable», añade una o varias fuentes de temperatura y asigna sus ponderaciones.
3. Selecciona el control de vinculación para aplicar las fuentes. Los ventiladores en modo Auto y Curve comparten estas fuentes; un cambio afecta a todos los que las utilicen.
4. Añade o edita puntos en «Temperature-Speed Curve». Una curva requiere al menos 2 puntos y admite hasta 10.
5. Ajusta «Min Duty Cycle» y «Max Duty Cycle». El mínimo no puede superar el máximo.
6. Ajusta «Temperature Hysteresis» y «Min Interval» según necesites. La histéresis admite 0-20°C y el intervalo mínimo, 500-30000 ms.
7. Selecciona «Apply Curve». Se guardan los ajustes y el ventilador seleccionado pasa al modo «Curve».

«Min Duty Cycle» y «Max Duty Cycle» definen el rango de control en porcentajes. «Temperature Hysteresis» reduce los ajustes frecuentes provocados por pequeñas variaciones de temperatura. «Min Interval» establece el tiempo mínimo entre ajustes; 1000 ms equivalen a 1 segundo.

Aplicar una curva activa el modo Curve. Para seguir utilizando el control automático, vuelve a la tarjeta del ventilador y selecciona «Auto».

### Importar y exportar una curva

- Selecciona «Import Config» y elige un archivo JSON de curva válido. Revisa la curva y los parámetros cargados y selecciona «Apply Curve».
- Selecciona «Export Config» para descargar la curva actual desde el navegador. La página también intenta guardar una copia en `/sdcard/config` e informa del resultado en la tarjeta SD.

### Utilizar una temperatura de prueba

La temperatura de prueba sustituye temporalmente a la fuente de temperatura habitual y afecta al control Auto o Curve. Supervisa el ventilador y el estado del dispositivo durante toda la prueba.

1. Introduce un valor de 0-100°C en «Test Temp».
2. Selecciona «Test» y observa la velocidad objetivo y la respuesta del ventilador.
3. Al terminar, selecciona de inmediato «Clear Test» para restablecer la fuente de temperatura habitual.

## 5. Gestión de LED

«LED Control» se encuentra en «System» y solo muestra los LED que ofrece el dispositivo en ese momento.

### Controles habituales

- Utiliza el interruptor de una tarjeta para encender o apagar ese LED.
- Utiliza «Brightness» para ajustar el brillo del dispositivo actual.
- Selecciona un color o un color predefinido en los dispositivos que admitan control de color.
- Elige una opción de «Effects» para iniciarla y selecciona «Stop Effect» para detener el efecto actual.
- Selecciona «Save Config» para guardar los ajustes actuales de LED.
- Selecciona «All Off» para apagar todos los LED que aparecen en la página.

Los colores, controles de brillo y efectos disponibles varían según el LED. Utiliza las opciones de su tarjeta y de su cuadro de ajustes.

### Funciones avanzadas de la matriz LED

Si el dispositivo dispone de una matriz LED, su cuadro de ajustes también puede incluir:

- «Display Image»: seleccionar y mostrar una imagen de la tarjeta SD.
- «Generate QR»: introducir contenido y elegir los colores y el nivel de corrección de errores.
- «Display Text»: introducir texto y ajustar la fuente, la alineación, la velocidad de desplazamiento y los colores del texto y del fondo.
- «Post-processing Filter»: aplicar un filtro disponible en la página o detenerlo con el control correspondiente.
- «Color Correction»: ajustar la salida de la matriz y restablecer, importar o exportar los ajustes de corrección con los controles disponibles.

Las dimensiones de la matriz, los efectos y los filtros dependen del dispositivo. Sigue los controles que muestra la interfaz web.

## 6. Gestión de red

<!-- operational-note -->

Selecciona «Network» en la navegación superior para abrir «Network Settings». Cambiar el modo de red, el punto de acceso o NAT puede interrumpir las conexiones de la interfaz web, Terminal y Automation. Antes de guardar, asegúrate de que podrás volver a conectarte mediante la nueva dirección de red.

### Consultar el estado de la red

La parte superior de la página muestra el estado de Ethernet, del cliente WiFi y del punto de acceso WiFi. Abre el panel correspondiente para consultar, cuando estén disponibles, la dirección IP, la máscara de subred, la puerta de enlace, DNS, la dirección MAC, el SSID, la señal y el número de dispositivos conectados.

El panel Ethernet muestra el enlace y las direcciones actuales. No permite editar las direcciones.

### Seleccionar un modo WiFi

| Modo | Función |
| --- | --- |
| «Off» | Desactiva WiFi. |
| «Station (STA)» | Conecta el dispositivo a una red WiFi existente. |
| «Access Point (AP)» | Hace que el dispositivo ofrezca un punto de acceso WiFi. |
| «STA+AP» | Conecta el dispositivo a una red WiFi y mantiene disponible su punto de acceso. |

Después de elegir un modo, espera a que se actualice el estado en la página. La conexión inalámbrica actual puede interrumpirse durante el cambio.

### Conectarse a WiFi

1. Selecciona el modo «Station (STA)» o «STA+AP».
2. En «Station», selecciona «Scan».
3. Elige una red de la lista, que muestra el SSID, la intensidad de señal, el canal y el tipo de autenticación.
4. Introduce la contraseña y confirma. Déjala en blanco si la red es abierta.
5. Espera a que el estado cambie a «Connected» y comprueba la nueva dirección IP.

Selecciona «Disconnect» para finalizar la conexión del cliente WiFi actual.

### Configurar el punto de acceso WiFi

1. Selecciona el modo «Access Point (AP)» o «STA+AP».
2. En «Hotspot», selecciona «Config».
3. Introduce el SSID. Si dejas la contraseña en blanco, se crea un punto de acceso abierto; para protegerlo se requieren al menos 8 caracteres.
4. Selecciona un canal y activa «Hidden SSID» si lo necesitas.
5. Selecciona «Apply» y espera a que se actualice el estado.

Selecciona «Devices» para consultar los clientes conectados al punto de acceso.

### Establecer el nombre de host

Introduce un nombre nuevo en «Hostname», dentro de «Network Services», y selecciona «Set». La página muestra el nombre de host actual una vez actualizado.

### Consultar los clientes DHCP

DHCP asigna direcciones de red a los dispositivos conectados. Selecciona «Clients», elige «WiFi AP» o «Ethernet» y consulta las concesiones actuales. Utiliza el botón de actualización para recargar la lista.

### Operaciones de red avanzadas

#### Configurar la pasarela NAT

NAT reenvía tráfico entre las interfaces de red del dispositivo. Activa o desactiva NAT y selecciona «Save» para conservar el ajuste. Comprueba después el estado de WiFi y Ethernet.

#### Acceder a la red ascendente mediante LPMU

Cuando aparezca «Upstream Network Access», selecciona «Access via LPMU». Espera a que el estado pase de «Processing» a «Success» o «Failed». No vuelvas a iniciarlo mientras se procesa. Si falla, lee el error y la salida que muestra la página.

## 7. Gestión de archivos

Selecciona «Files» en la navegación superior para abrir «File Manager».

La tarjeta SD es almacenamiento extraíble y SPIFFS es el almacenamiento interno de archivos del dispositivo. Selecciona «SD Card» o «SPIFFS» para cambiar de ubicación. La ruta superior indica la carpeta actual. Selecciona el nombre de una carpeta en la ruta para volver a ella.

### Explorar y gestionar archivos

- Selecciona el nombre de una carpeta para abrirla.
- Selecciona el botón de descarga junto a un archivo para guardarlo en la ubicación de descargas del navegador.
- Selecciona el botón de cambio de nombre, introduce el nuevo nombre y confirma.
- Selecciona «New Folder», introduce un nombre y crea la carpeta.
- Selecciona el botón de actualización para recargar el directorio y el estado del almacenamiento.

### Subir archivos

1. Abre el directorio de destino.
2. Selecciona «Upload Files».
3. Selecciona uno o varios archivos o arrástralos al área de subida.
4. Revisa la lista y retira los archivos que no quieras subir.
5. Selecciona «Upload» y espera a que todos indiquen que han terminado.

Subir un paquete de configuración `.tscfg` inicia su flujo de verificación y aplicación. Consulta la Guía de seguridad para conocer los requisitos de origen, firma y aplicación de los paquetes.

### Operaciones por lotes

Al seleccionar archivos o carpetas aparece la barra de operaciones por lotes.

- «Batch Download» descarga los archivos seleccionados. No incluye las carpetas.
- «Batch Delete» elimina los archivos y las carpetas seleccionados.
- «Clear Selection» borra la selección actual.

### Eliminar un archivo o una carpeta

La eliminación no se puede deshacer desde la interfaz web. Eliminar una carpeta también elimina todo su contenido. Comprueba el nombre y la ruta antes de seleccionar «Delete» o «Batch Delete» y aceptar la confirmación.

### Montar y desmontar la tarjeta SD

Desmontar la tarjeta SD deja sus archivos temporalmente inaccesibles. Comprueba que no hay subidas, descargas ni otras operaciones de archivos en curso y selecciona «Unmount SD».

Cuando la tarjeta no está montada, aparece «Mount SD». Selecciónalo, espera al estado «Mounted» y vuelve a abrir el directorio de la tarjeta SD.

## 8. Actualizaciones OTA

En «System», selecciona «OTA Update» dentro de «Network & Time» para abrir «Firmware Upgrade».

<!-- operational-note -->

El dispositivo se reinicia durante la actualización y se desconectan temporalmente la interfaz web, Terminal y Automation. Guarda el trabajo en curso y asegura una alimentación estable antes de empezar. No apagues el dispositivo mientras la actualización no haya terminado.

### Buscar actualizaciones en un servidor OTA

1. Revisa «Current Version».
2. Introduce la dirección del servidor OTA facilitada por un administrador o por quien publica el firmware.
3. Selecciona «Save» y después «Check Update».
4. La página indicará «Update Available», «Already up to date», una versión anterior en el servidor o un error.
5. Confirma la versión de destino y selecciona «Upgrade Now» o el control de actualización que aparezca.
6. Espera a que terminen la descarga, la instalación y el reinicio. Si aparece «Abort», permite detener las fases que admiten cancelación.
7. Vuelve a conectarte a la interfaz web cuando el dispositivo esté disponible y comprueba «Current Version».

Con «Include WebUI» activado, el firmware y la interfaz web se actualizan de forma secuencial. Ambos deben pertenecer a la misma versión publicada.

### Actualización manual

Despliega «Manual Upgrade» y elige un método:

- «Upgrade from URL»: introduce la URL del firmware, ajusta «Include WebUI» según las instrucciones de la versión y selecciona «Upgrade».
- «Upgrade from SD Card»: introduce una ruta de firmware, como `/sdcard/firmware.bin`. Con «Include WebUI» activado, también se procesa el archivo de la interfaz web situado en el mismo directorio.

En las actualizaciones desde URL, «Skip Verify» omite la verificación del certificado del servidor HTTPS. Se elimina así la comprobación que confirma la identidad del servidor de descarga. Mantén esta opción desmarcada en las actualizaciones habituales. Si aparece un error de certificado, pide al administrador que revise la dirección y el certificado del servidor.

### Gestionar particiones y volver a una versión anterior

«Partition Management» muestra la partición en ejecución y las demás particiones disponibles.

- «Mark Valid» confirma la versión en ejecución y desactiva su protección de reversión automática. Utilízalo después de comprobar que la versión funciona correctamente.
- «Rollback to This Version» selecciona otra versión arrancable y cambia a ella mediante un reinicio. La reversión interrumpe los servicios actuales. Confirma primero la versión de destino y la compatibilidad de los datos.

Tras finalizar la operación y el reinicio, abre de nuevo la interfaz web y comprueba la versión actual y el estado del dispositivo.

## 9. Acceso a la gestión de seguridad

Selecciona «Security» en la navegación superior para abrir la gestión de seguridad. Consulta la Guía de seguridad de TianshanOS para gestionar claves SSH, hosts remotos, huellas de hosts conocidos, certificados HTTPS, paquetes de configuración y cuentas. Esos procedimientos no se repiten aquí.

## Parte II: operaciones exclusivas de root

## 10. Terminal y registros del sistema

«Terminal» solo se muestra a root. Permite ejecutar comandos de la consola del dispositivo y consultar sus registros. Un comando puede cambiar el estado del dispositivo de inmediato. Confirma su origen, sus parámetros y sus efectos antes de introducirlo.

### Conectar y utilizar Terminal

1. Selecciona «Terminal» en la navegación superior.
2. Espera al mensaje «Connected to device» y al indicador `tianshan>`.
3. Introduce `help` para consultar los comandos del firmware actual.
4. Introduce un comando y pulsa Intro. Espera a que termine la salida y vuelva a aparecer el indicador.

Mientras la página indique «Not connected to device», la entrada no se ejecuta. Tras una desconexión, espera al mensaje de reconexión antes de enviar de nuevo un comando para evitar ejecutarlo dos veces.

Terminal admite estos controles de teclado:

| Control | Función |
| --- | --- |
| Ctrl+C | Borra la entrada actual y solicita una interrupción. El comando solo se detendrá si admite interrupciones. |
| Ctrl+L | Limpia la pantalla. |
| ↑ / ↓ | Recorre el historial de comandos de la sesión actual de la página. |
| ← / → | Desplaza el cursor dentro de la entrada actual. |

«Clear», en la parte superior, solo limpia la pantalla. No deshace los comandos ya ejecutados. «Disconnect» cierra la conexión actual de Terminal.

### Abrir una sesión de shell SSH remota

Una sesión de shell SSH envía las siguientes entradas de teclado a un host remoto. Confirma la dirección de destino, el usuario y el método de autenticación, y completa la preparación SSH descrita en la Guía de seguridad antes de conectarte.

1. Introduce `ssh --help` para consultar las opciones del comando SSH.
2. Introduce `ssh --host <host> --user <user> --shell`, sustituyendo cada marcador, incluidos los signos angulares, por su valor real. Para especificar un puerto, añade `--port <port>` antes de --shell.
3. Espera a que se confirme la conexión remota antes de introducir comandos remotos.
4. Pulsa Ctrl+\ para salir de la sesión SSH y volver al indicador tianshan>.

No introduzcas credenciales en texto claro mientras compartes o grabas el terminal, o si otra persona puede verlo.

### Consultar los registros del sistema

Selecciona «System Logs» en la parte superior de Terminal para abrir la ventana de registros.

- «Level» establece el nivel mínimo mostrado. Utiliza ERROR, WARN+, INFO+ o DEBUG+ para acotar la salida.
- «TAG» filtra por origen del registro.
- «Search» filtra los registros actuales por palabra clave.
- «Auto Scroll» sigue las nuevas entradas cuando está activado.
- El botón de actualización vuelve a cargar los registros históricos.
- El botón de limpieza solo borra los registros mostrados en la ventana.

Si los filtros no devuelven resultados, borra primero TAG y Search y después cambia Level. Cerrar la ventana de registros no detiene los servicios del dispositivo.

## 11. Gestionar y ejecutar comandos remotos

«Commands» almacena comandos SSH reutilizables y los ejecuta en el host remoto seleccionado. Los hosts y sus datos de autenticación se gestionan en «Security». Consulta los procedimientos en la Guía de seguridad.

### Seleccionar un host y consultar sus comandos

1. Selecciona «Commands» en la navegación superior.
2. Elige uno de los hosts de «Select Host».
3. Revisa sus elementos guardados en «Command List».

Los comandos de «Orphan Commands» hacen referencia a hosts que ya no existen y no pueden ejecutarse. Elimina el comando huérfano o utiliza la vinculación de host durante la importación para asociarlo a uno válido.

### Crear o editar un comando

<!-- operational-note -->

Un comando guardado se ejecuta en un host remoto. Verifica el comando y los permisos necesarios en ese host antes de guardarlo. Extrema el cuidado con comandos que eliminen datos, apaguen o reinician un host o sobrescriban archivos.

1. Selecciona un host y después «New Command». Para modificar un comando existente, utiliza su botón de edición.
2. Introduce un «Command ID» único. Admite letras, números, guiones bajos y guiones; no puede empezar ni terminar con un guion bajo o un guion.
3. Introduce «Command Name» y «Command». Si utilizas varias líneas, escribe un comando por línea.
4. Añade una descripción y elige un icono o una imagen de la tarjeta SD si lo necesitas.
5. Revisa las opciones avanzadas y selecciona «Save». El nombre sirve para reconocer el comando; Automation utiliza su ID para referenciarlo. Al editar un comando, el ID es de solo lectura. Para utilizar otro ID, crea un comando nuevo y actualiza las plantillas de acciones o fuentes de datos que deban utilizarlo.

### Ejecutar un comando y revisar el resultado

1. Selecciona el control de ejecución de una tarjeta de comando.
2. Observa la salida y el estado en «Execution Result».
3. Si aparece «Cancel», utilízalo para finalizar la sesión de ejecución actual.
4. Selecciona «Clear» para borrar la visualización del resultado actual.

«Clear» no deshace las tareas ya completadas en el host remoto. El éxito, el fallo, el contenido extraído y el estado final dependen de los ajustes de coincidencia del comando.

### Configurar la evaluación del resultado

La búsqueda de coincidencias convierte la salida remota en un estado más fácil de utilizar.

- «Success Pattern»: marca el resultado como correcto si la salida contiene el texto configurado.
- «Fail Pattern»: marca el resultado como fallido si la salida contiene el texto configurado.
- «Extract Pattern»: utiliza un grupo de captura `(.*)` para guardar una parte de la salida.
- «Stop on Match»: finaliza un comando continuo cuando encuentra una coincidencia correcta.
- «Timeout»: deja de esperar si no hay coincidencias en el tiempo configurado. Solo se aplica si hay un patrón de éxito o fallo, o si «Stop on Match» está activado.
- «Variable Name»: guarda el estado y la salida extraída para utilizarlos en Automation.

Elige textos de éxito y fallo estables y específicos. Los textos demasiado generales pueden producir coincidencias incorrectas. Ejecuta el comando una vez y revisa «Match Results» antes de utilizar sus variables en una regla.

### Utilizar la ejecución en segundo plano y el modo de servicio

nohup permite que un comando siga ejecutándose en segundo plano en el host remoto después de cerrar la conexión SSH. Cerrar la interfaz web no detiene una tarea en segundo plano.

Tras activar «Background (nohup)», puedes utilizar:

- «View Log»: consultar el registro actual de la tarea en segundo plano.
- «Tail Log»: actualizar el registro de forma continua.
- «Stop Tail»: detener la actualización de la página sin detener la tarea remota.
- «Check Process»: comprobar si la tarea sigue en ejecución.
- «Stop Process»: finalizar la tarea correspondiente.

«Service Mode (monitor ready state)» supervisa una tarea en segundo plano hasta que está disponible. Debes indicar Ready Pattern y Variable Name. Ajusta el patrón de fallo opcional y los tiempos según necesites:
- «Ready Pattern»: marca el servicio como listo cuando aparece el texto configurado. Utiliza `|` para separar varios patrones.
- «Fail Pattern»: marca el servicio como fallido cuando aparece el texto configurado.
- «Timeout»: establece el tiempo máximo de espera hasta el estado listo.
- «Check Interval»: establece la frecuencia de consulta del registro.
- «Variable Name»: almacena estados como checking, ready y timeout.

Stop Tail y Stop Process tienen efectos distintos. Utiliza «Stop Tail» si solo quieres dejar de ver las actualizaciones. Utiliza «Stop Process» únicamente después de confirmar que la tarea remota puede terminarse.

### Importar y exportar comandos

- Utiliza el botón de exportación de un comando para exportarlo e incluir, si seleccionas la opción, la configuración del host del que depende.
- Selecciona «Import Command», elige un paquete de configuración `.tscfg`, revisa su contenido y decide si quieres sobrescribir una configuración existente o vincularlo a un host de la página.

La importación puede sobrescribir un elemento con el mismo ID e incluir información de hosts remotos. Sigue la Guía de seguridad para evaluar las firmas, la confianza de los certificados y el origen de los paquetes. Si la página exige un reinicio, termina las tareas de Terminal y Automation antes de programarlo.

Antes de eliminar un comando, comprueba que ninguna fuente de datos ni plantilla de acción de Automation lo referencia. La eliminación no se puede deshacer en Commands.

## 12. Gestión de la automatización

«Automation» conecta los datos del dispositivo con operaciones repetibles. La relación principal es:

```text
Automática: Fuente de datos → Variable → Regla → Acción
Manual: Acción rápida del sistema → Acción
```

- Una fuente de datos lee datos externos o del dispositivo.
- Una variable almacena un valor que se puede evaluar.
- Una regla decide cuándo se ejecuta el trabajo.
- Una plantilla de acción define el trabajo que se realiza.
- Una regla Manual Trigger Only aparece en «Quick Actions» de la página «System».

### Consultar y controlar el motor de automatización

Las tarjetas de estado muestran el estado del motor, el número de reglas, variables, fuentes de datos y activaciones, y el tiempo de funcionamiento.

| Control | Efecto |
| --- | --- |
| «Start» | Inicia un motor detenido y comienza a procesar las reglas habilitadas. |
| «Pause» | Suspende las siguientes evaluaciones automáticas. Las acciones en curso pueden continuar. Para reanudar, selecciona «Stop» y después «Start». |
| «Stop» | Detiene el procesamiento de reglas y la actualización de las fuentes de datos. Conserva la configuración guardada. |
| «Reload» | Vuelve a cargar la configuración guardada del motor. Si estaba en ejecución, se reanuda después. Guarda primero los cambios. |

<!-- operational-note -->

Antes de cambiar el estado del motor, comprueba si la refrigeración, las alertas u otras tareas en curso dependen de Automation. Pause y Stop no garantizan que terminen las acciones asíncronas en cola ni los procesos remotos en segundo plano. Comprueba esas tareas por separado y actualiza después el estado del motor.

### Crear un flujo de automatización mínimo

Para un flujo nuevo, sigue este orden:

1. Crea una fuente de datos y comprueba la conexión con su control de prueba.
2. Habilita la fuente, confirma que el valor necesario aparece en «Variables» y comprueba su hora de actualización.
3. Crea una plantilla de acción, revisa sus parámetros y selecciona «Test». La prueba ejecuta la acción de inmediato; confirma primero que el dispositivo y el host remoto pueden recibirla.
4. Crea una regla con «Enable immediately» desmarcado.
5. Revisa las condiciones, el tiempo entre activaciones, el orden de las acciones, las demoras y las repeticiones.
6. Guarda y habilita la regla; observa las variables, el contador de activaciones y el resultado real.

### Gestionar las fuentes de datos

Selecciona «Add» en «Data Sources» y elige un tipo admitido por la página:

| Tipo | Función |
| --- | --- |
| «REST API» | Lee periódicamente los datos devueltos por una dirección HTTP. |
| «WebSocket» | Recibe datos enviados mediante una conexión persistente. |
| «Socket.IO» | Recibe eventos enviados por un servicio Socket.IO. |
| «Command Variable» | Lee los resultados guardados de Commands. |

REST API lee datos mediante una URL. WebSocket y Socket.IO reciben actualizaciones continuas. Command Variable procede del resultado de un comando SSH configurado.

1. Introduce el ID, la etiqueta visible y los datos de conexión exigidos por el tipo de fuente.
2. Utiliza «Test Connection» o el control de prueba de ese tipo.
3. En REST API, WebSocket o Socket.IO, selecciona en el resultado de la prueba los campos que deseas guardar. Si dejas vacío el nombre de evento de Socket.IO, la prueba intenta descubrir un evento enviado por el servicio.
4. En «Command Variable», selecciona un host y un comando que tenga Variable Name y ajusta el intervalo de sondeo.
5. Guarda y habilita la fuente y comprueba el resultado en «Variables».

La lista muestra el tipo, el estado y el intervalo de actualización de cada fuente. Puedes habilitarla o deshabilitarla, consultar sus variables, exportarla o eliminarla. Deshabilitar o eliminar una fuente puede impedir la evaluación de las reglas que dependen de ella. Comprueba las referencias antes de eliminarla.

La importación y exportación de fuentes utilizan paquetes de configuración. Revisa el ID, el tipo y la configuración de destino antes de importar. Comprueba las dependencias de las reglas existentes antes de sobrescribir una fuente con el mismo ID. Sigue la Guía de seguridad para evaluar la confianza del paquete.

### Consultar las variables

«Variables» muestra los datos disponibles para Automation. Utiliza el campo de búsqueda para filtrar por nombre.

Comprueba:

- Que el nombre y el origen sean los esperados.
- Que el valor y el tipo de dato sean adecuados para la comparación.
- Que la hora de actualización siga cambiando.
- Si la página señala datos obsoletos o no válidos.

Si una variable deja de actualizarse, comprueba primero que su fuente esté habilitada. Después utiliza la prueba de la fuente para verificar la conexión y el campo seleccionado.

### Crear y probar plantillas de acciones

Una plantilla de acción define el trabajo que se realiza al activarse una regla. Selecciona «Add» en «Action Templates» y elige un tipo admitido:

| Tipo | Función |
| --- | --- |
| «CLI Command» | Ejecuta un comando local de la consola de TianshanOS. |
| «SSH Command» | Ejecuta un comando remoto ya configurado en Commands. |
| «LED Control» | Controla los LED y las funciones de visualización disponibles en la página. |
| «Log» | Escribe un mensaje de registro con el nivel seleccionado. |
| «Set Variable» | Asigna un valor a una variable de Automation. |
| «Webhook» | Envía una solicitud a una dirección HTTP. |

CLI es un comando local del dispositivo. SSH Command se ejecuta en un host remoto. Webhook notifica o llama a un servicio externo.

Cada plantilla necesita un ID único. Puedes añadir un nombre visible, una descripción y una demora de ejecución, y activar «Async execution» si lo necesitas. Una acción asíncrona continúa en segundo plano tras enviarse. Comprueba su estado posterior en el registro, la variable o el dispositivo de destino correspondiente.

Cada tipo requiere además:

- CLI Command: una línea de comandos, con variable de resultado y tiempo de espera opcionales.
- SSH Command: un host y un comando disponibles en la página. Revisa la vista previa antes de guardar.
- LED Control: un dispositivo y las operaciones de color, efectos, brillo, texto, imagen, código QR o filtro que admita.
- Log: un nivel y un mensaje. El mensaje puede referenciar variables.
- Set Variable: un nombre de variable y un valor.
- Webhook: un método, una URL y el contenido de solicitud exigido por la página. JSON es el formato de texto utilizado para el contenido estructurado de las solicitudes.

«Test» ejecuta la acción de inmediato. Confirma sus efectos antes de probar controles de alimentación, reinicios, comandos remotos, salida LED o solicitudes externas. Añade una acción a una regla solo después de comprender el resultado de la prueba. Antes de eliminar una plantilla, comprueba que ninguna regla la referencia. Una importación puede sobrescribir una acción con el mismo ID. Sigue los requisitos de confianza de la Guía de seguridad al importar o exportar paquetes de configuración.

### Crear una regla

Una regla vincula condiciones sobre variables con plantillas de acciones.

1. Selecciona «Add» en «Rules».
2. Introduce un «Rule ID» único, un nombre y un icono.
3. Elige «Logic»:
- AND activa la regla cuando se cumplen todas las condiciones.
- OR la activa cuando se cumple cualquiera de ellas.
4. Ajusta «Cooldown (ms)» para limitar la frecuencia de activación.
5. Añade condiciones y selecciona una variable, una comparación y un valor.
6. Añade una o varias plantillas de acciones y las demoras necesarias para su secuencia.
7. Revisa y guarda la regla. Habilítala solo cuando esté preparada para ejecutarse.

Las comparaciones actuales son «Equal», «Not Equal», «Greater Than», «Greater or Equal», «Less Than», «Less or Equal», «Value Changed» y «Contains». Utiliza un valor de comparación compatible con el tipo de dato de la variable.

### Configurar repeticiones y condiciones de las acciones

Cada acción admite:

- «Once»: se ejecuta una vez por cada activación de la regla.
- «Repeat while true»: se repite al intervalo configurado mientras se cumpla la condición propia de la acción, hasta 100 ejecuciones por ciclo.
- «Fixed count»: se repite con el número de veces y el intervalo configurados.

La condición de ejecución de una acción es independiente de las condiciones de activación de la regla. Define una condición de acción antes de utilizar «Repeat while true». Si no la hay, la acción se repite hasta alcanzar el límite por ciclo. Después la regla puede iniciar otro ciclo.

Deshabilitar una regla impide futuras activaciones automáticas; una secuencia de repeticiones en curso puede continuar. Deshabilita primero la regla y comprueba después las acciones activas. Si se trata de una tarea remota en segundo plano, detén su proceso en Commands y confirma que ha terminado.

### Crear una acción rápida

Con «Manual Trigger Only» activado, la regla no necesita condiciones de activación y aparece como tarjeta en «System».

1. Introduce el ID, el nombre y el icono de la regla.
2. Activa «Manual Trigger Only».
3. Añade las plantillas de acciones que se ejecutarán.
4. Guarda y habilita la regla para que su tarjeta aparezca en System.
5. Vuelve a «System», busca la tarjeta en «Quick Actions», ejecútala una vez y comprueba el resultado.

Una regla manual conserva todas sus acciones, demoras y repeticiones configuradas. Antes de ofrecer una acción rápida a los usuarios admin, asígnale un nombre claro, asegura que sus efectos sean previsibles y facilita un registro o un método de parada utilizable.

### Mantener las reglas y la configuración

La lista Rules permite habilitar, deshabilitar, activar manualmente, editar, exportar y eliminar reglas.

- Manual Trigger ejecuta las acciones sin comprobar si la regla está habilitada ni esperar su tiempo entre activaciones. No es una vista previa, aunque la regla esté deshabilitada.
- Deshabilitar una regla impide futuras activaciones automáticas. No deshace las acciones completadas.
- La eliminación de una regla no se puede deshacer en la página.
- Antes de editar una regla, confirma que sus variables y plantillas de acciones siguen existiendo.
- Antes de importar una regla, revisa su ID, sus condiciones y sus referencias a acciones. Confirma los efectos antes de sobrescribir un elemento con el mismo ID.

Después de importar o cambiar fuentes, acciones o reglas, comprueba el estado del motor y el estado habilitado de cada lista. Si la página exige Reload o un reinicio, termina las tareas remotas en curso antes de programarlo.
