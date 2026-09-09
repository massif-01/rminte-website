# Guía de uso de TianshanOS para admin

Los nombres de botones y secciones se conservan en inglés para que puedas localizarlos en el dispositivo. La WebUI del dispositivo admite chino e inglés; cambiar el idioma de este sitio no cambia los idiomas del dispositivo.

Esta guía se dirige a quienes administran TianshanOS con la cuenta admin y explica las tareas habituales disponibles en la interfaz web. Para gestionar la seguridad, consulta la Guía de seguridad de TianshanOS. El acceso al terminal, las reglas de automatización y la gestión de comandos se describen en la guía de operaciones de root.

Los controles disponibles dependen del dispositivo y de su configuración. Algunos solo aparecen cuando está conectado el hardware necesario o se ha configurado la función correspondiente.

## 1. Primeros pasos

### Abrir la interfaz web

1. Abre la interfaz web del dispositivo (WebUI) en la dirección facilitada por tu administrador.
2. Selecciona «Login» en la esquina superior derecha.
3. Mantén `admin` como nombre de usuario e introduce la contraseña de admin suministrada con el dispositivo.
4. Selecciona «Login». Tras iniciar sesión, el nombre del usuario actual aparecerá en la esquina superior derecha.

Si todavía se utiliza la contraseña predeterminada, al iniciar sesión aparece «Security Reminder». Introduce la contraseña actual y la nueva y selecciona «Change Now». Escribe la nueva contraseña dos veces; ambas entradas deben coincidir. «Change Later» cierra el recordatorio.

Cuando termines, selecciona «Logout» en la esquina superior derecha. Tendrás que volver a iniciar sesión para utilizar el dispositivo.

### Cambiar de idioma

Selecciona el botón de idioma situado en la parte superior de la página y elige chino o inglés. El contenido y las etiquetas de los controles cambian al instante.

### Navegar por las páginas

Las páginas principales de admin son:

- «System»: consultar el estado del dispositivo, controlar módulos, ventiladores y LED, y abrir la actualización OTA.
- «Network»: consultar el estado de Ethernet y los clientes DHCP, configurar WiFi y gestionar el reenvío NAT.
- «Files»: gestionar los archivos de la tarjeta SD y de SPIFFS.
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

El reinicio interrumpe temporalmente la interfaz web y la gestión del dispositivo. Termina las tareas en curso antes de seleccionar «Reboot» y confirmar. La página indica que el sistema se está reiniciando. Vuelve a abrir la interfaz cuando el dispositivo esté disponible.

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

«Quick Actions» muestra las tarjetas de acciones habilitadas para los usuarios admin.

1. Selecciona una tarjeta para ejecutar su acción.
2. Espera mientras la tarjeta indica que se está procesando.
3. Las tarjetas que admiten tareas en segundo plano muestran el estado de ejecución y los controles «Log» y «Stop».
4. Selecciona «Log» para ver la salida actual. Selecciona «Stop» para detener una tarea en ejecución.

<!-- operational-note -->

Debes detener una tarea en ejecución antes de volver a iniciarla. Tras activar una acción, espera unos segundos antes de iniciar otra.

Mantén pulsada una tarjeta hasta que aparezca el indicador de reordenación y arrástrala para cambiar su posición. «No Quick Actions» significa que no hay tarjetas disponibles para la cuenta admin.

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

Selecciona «Network» en la navegación superior para abrir «Network Settings». Cambiar el modo de red, el punto de acceso o NAT puede interrumpir la conexión actual con la interfaz web. Antes de guardar, asegúrate de que podrás volver a conectarte mediante la nueva dirección de red.

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

El dispositivo se reinicia durante la actualización y la interfaz web se desconecta temporalmente. Guarda el trabajo en curso y asegura una alimentación estable antes de empezar. No apagues el dispositivo mientras la actualización no haya terminado.

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
