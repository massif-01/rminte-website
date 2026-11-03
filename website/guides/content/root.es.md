# TianshanOS

Esta guía cubre las funciones de rutina en la Parte I y el acceso al terminal, los comandos remotos, la automatización y la copia de seguridad de la configuración en la Parte II. Las operaciones Root pueden afectar el dispositivo y los hosts remotos; Verifique las tareas objetivo y activas antes de continuar. Consulte la Guía de seguridad separada para conocer la gestión de la seguridad.

Versión cubierta: 0.6.4. Revisado el 3 de noviembre de 2026.

Utilice los controles que se muestran en su dispositivo. Algunos necesitan hardware o configuración específicos. En una computadora, coloque el cursor sobre un botón con un ícono para ver su nombre. En un teléfono, deslícese dentro de una tabla amplia para ver sus otras columnas.

## Parte I: Funciones de rutina

### 1. Primeros pasos

#### Abra el WebUI

1. Abra la interfaz web del dispositivo (WebUI) utilizando la dirección proporcionada por su administrador.
2. Seleccione "Iniciar sesión" en la esquina superior derecha.
3. Ingrese `root` y la contraseña root proporcionada con el dispositivo.
4. Seleccione "Iniciar sesión". Después de iniciar sesión correctamente, el nombre de usuario actual aparece en la esquina superior derecha.

Al iniciar sesión con la contraseña predeterminada se abre un "Recordatorio de seguridad". Ingrese la contraseña actual, luego ingrese la nueva contraseña dos veces y seleccione "Cambiar ahora". Ambas entradas de nueva contraseña deben coincidir. Seleccione "Más tarde" para cerrar el recordatorio.

Cuando haya terminado, seleccione "Cerrar sesión" en la esquina superior derecha. Deberá iniciar sesión nuevamente para usar el dispositivo.

Si se le niega el permiso, verifique la cuenta. Si el inicio de sesión ha caducado, inicie sesión nuevamente. Luego verifique el resultado de la operación anterior. Iniciar sesión no repite una tarea anterior. No cargue, elimine ni actualice de nuevo inmediatamente.

#### Cambiar idiomas

Seleccione el botón de idioma en la parte superior de la página, luego elija chino o inglés. El contenido de la página y las etiquetas de control cambian inmediatamente.

#### Navegación de página

Los usuarios root pueden acceder a estas páginas:

- “System”: vea el estado del dispositivo, los módulos de control, los ventiladores y los LED, y abra la actualización OTA.
- “Network”: verifique el estado de Ethernet y los clientes DHCP, configure WiFi y administre el reenvío NAT.
- “Files”: Administre archivos en la tarjeta SD y SPIFFS.
- “Terminal”: ejecute comandos del dispositivo y vea registros del sistema.
- “Commands”: gestiona y ejecuta comandos remotos SSH.
- “Automation”: Configura tareas y guarda una copia de seguridad de emergencia.
- “Security”: abra la página de administración de seguridad independiente. Consulte la Guía de seguridad para obtener instrucciones.

### 2. Estado del sistema y operaciones de rutina

Seleccione "Sistema" en la navegación superior.

#### Ver el estado de los recursos y servicios

“Recursos del chip de administración” muestra el uso de CPU, DRAM y PSRAM en el chip de administración. Estas lecturas no muestran el uso de recursos en la equipo de inferencia o en la equipo de aplicaciones.

- Seleccione "Detalles" para ver la memoria total, utilizada y libre y otra información de la memoria.
- Los valores marcados como "estimados" en los detalles de la memoria son solo como referencia. Si aparece una advertencia, conserve la información de la página y siga sus instrucciones.
- “Servicios” muestra el número de servicios en ejecución y el total. Selecciónelo para ver el estado y la etapa de inicio de cada servicio.
- Si un servicio informa un problema, actualice su estado. Para reiniciarlo, siga "Reiniciar un servicio" a continuación.

#### Ver información del sistema y de energía

«Vista general del sistema» muestra el chip, la versión del firmware, la versión de ESP-IDF y el tiempo de funcionamiento. Para el uso diario, compruebe la versión del firmware. ESP-IDF es el marco de software que utiliza el dispositivo.

El lado derecho de la tarjeta muestra el voltaje de entrada, el voltaje interno, la corriente, la potencia y el estado de protección.

Las configuraciones del sistema, como redes, ventiladores, temperatura e iluminación, se guardan dentro del dispositivo. Insertar una tarjeta SD antigua no los restaura. La configuración de la automatización se gestiona por separado; su copia de seguridad de emergencia no es una copia de seguridad completa del dispositivo.

El interruptor al lado del estado de protección habilita o deshabilita la protección de bajo voltaje. Cuando está habilitado, el dispositivo utiliza los voltajes y retrasos guardados para apagarse a bajo voltaje y reiniciarse después de que se recupera la energía.

#### Ver red y hora

“Red y hora” muestra Ethernet, WiFi, dirección IP, hora actual, estado de sincronización, fuente horaria y zona horaria.

- Seleccione “Sincronizar hora” para copiar la hora actual del navegador al dispositivo.
- Seleccione "Zona horaria", elija un ajuste preestablecido o ingrese una configuración de zona horaria compatible, luego guarde.
- Seleccione “Actualización OTA” para abrir la página de actualización del firmware.

#### Operaciones avanzadas

##### Reiniciar TianshanOS

Un reinicio interrumpe temporalmente la WebUI y la administración del dispositivo. Finalice las operaciones activas, luego seleccione "Reiniciar" y confirme. Espere a que el dispositivo se recupere y luego vuelva a abrir la WebUI.

##### Reiniciar un servicio

Reiniciar un servicio interrumpe temporalmente la función que proporciona. Abra "Estado del servicio", busque el servicio afectado y seleccione "Reiniciar" en esa fila. Verifique su estado nuevamente cuando finalice la operación.

##### Cambiar la configuración de apagado

Estas configuraciones controlan cuándo el dispositivo se apaga después de una caída de voltaje y cuándo se reinicia después de que se recupera la energía. Utilice valores que coincidan con los requisitos de energía de su dispositivo.

Seleccione "Configuración de apagado" para cambiar:

- “Umbral de Bajo Voltaje”: Inicia la cuenta regresiva de apagado por debajo de este voltaje.
- “Umbral de voltaje de recuperación”: Inicia la recuperación por encima de este voltaje.
- “Cuenta regresiva de apagado”: ​​establece el retraso antes del apagado después de que se detecta bajo voltaje.
- “Tiempo de espera de recuperación”: establece el tiempo de espera utilizado para confirmar la recuperación de energía estable.
- “Retraso de parada del ventilador”: establece el retraso antes de que los ventiladores se detengan después del apagado.

Guarde el formulario para aplicar la configuración de protección actualizada.

<!-- operational-note -->
Al abrir «Configuración de apagado», espere a que se carguen los ajustes actuales. Si se muestran valores predeterminados, no los tome como los valores del dispositivo. Revise las tensiones y los tiempos de espera antes de guardar. Puede cancelar durante la carga.

##### Cambiar el objetivo superior USB

Cambiar el objetivo USB puede desconectar temporalmente un dispositivo conectado. Confirme el objetivo y finalice el trabajo activo antes de continuar.

Los dispositivos que admiten conmutación USB muestran un botón "USB". Cada clic cambia el puerto USB superior al siguiente objetivo: ESP, Equipo de inferencia y luego Equipo de aplicaciones. "Desconectado" significa que no hay ningún objetivo conectado. Verifique el objetivo que se muestra en el botón y el mensaje de la página para confirmar el resultado.

### 3. Panel de dispositivos

El "Panel de dispositivos" está en la página "Sistema". Contiene controles de energía del módulo, acciones rápidas y widgets de datos.

#### Controlar la equipo de inferencia y la equipo de aplicaciones

«Equipo de inferencia» es el nombre que sustituye a AGX en la pantalla; «Equipo de aplicaciones» sustituye a LPMU. Los identificadores y comandos pueden seguir usando `agx` y `lpmu`. No cambie esos identificadores por su cuenta.

Guarde el trabajo en el módulo y complete su proceso de apagado normal antes de desconectar la alimentación. El apagado forzado puede provocar la pérdida de datos no guardados.

- «Alimentación del equipo de inferencia» muestra el estado del control de alimentación. Seleccione el botón para encenderlo o apagarlo y espere la confirmación.
- En «Alimentación del equipo de aplicaciones», «Accesible por red» y «No accesible por red» indican si hay acceso a través de la red. Si falla la comprobación, el estado de alimentación sigue sin conocerse. Estos resultados no confirman por sí solos si el equipo está encendido o apagado.
- Seleccionar el botón Equipo de aplicaciones desencadena la misma acción que presionar su botón de encendido físico. Espere la verificación y el resultado mostrado. Si desconoce el resultado, verifique la equipo y la red antes de presionar el botón nuevamente.

#### Utilice acciones rápidas

Un usuario root configura las tarjetas de acciones rápidas. Mostrar una tarjeta y permitir su ejecución manual son ajustes distintos. Una tarjeta visible puede no permitir iniciar la tarea.

1. Lea el nombre de la tarjeta y la descripción para identificar la tarea.
2. Seleccione “Inicio” o la tarjeta y lea el resultado. No lo inicie nuevamente mientras procesa.
3. Un mensaje ejecutado o en cola aún necesita una verificación de resultados real en el dispositivo o tarea de destino. Si se muestra un estado de servicio, distinga "Proceso en ejecución" de "Listo". Una tarjeta con varias tareas puede mostrar "Algunas tareas no están listas".

Las tarjetas con tareas remotas en segundo plano también ofrecen "Ver registro" y "Detener". Abra los registros para revisar las tareas relacionadas. Si aparecen varios registros, elija por nombre de tarea y host original. Verifique el objetivo antes de detenerlo, espere el resultado y luego verifique que se detuvo. Cerrar el registro o detener las actualizaciones del registro no detiene la tarea.

«Registros de ejecución» puede incluir tareas iniciadas antes. Que aparezcan no significa que sigan en ejecución. Seleccione «Verificar estado remoto» cuando sea necesario. Abra los registros desde la tarjeta correspondiente, Sistema o Automatización (capítulo 11). Si un control no está disponible o el resultado sigue sin estar claro, consulte los registros de ejecución y del sistema.

Si no puede iniciar la tarea, siga las indicaciones del mensaje. No pulse Inicio repetidamente:

- Regla deshabilitada o activación manual no permitida: verifique la configuración de la regla en “Automation” (Capítulo 12). Una tarjeta visible no es permiso para ejecutarla.
- Una tarea u operación en segundo plano está en progreso: espere su resultado. No lo empieces de nuevo.
- Ya existe un registro de ejecución para la tarea: verifique el estado y los registros de la tarea original en lugar de iniciarla nuevamente. Si necesita finalizar, deténgase y verifíquelo. Marque "Registros de ejecución" y Registros del sistema si no puede resolverlo.
- Configuración no cargada, falta un elemento requerido o Automatización en pausa: verifique la configuración y habilite el estado en “Automation” (Capítulos 12 y 13).

Si la página informa un inicio automático o una espera de reintento, déjela continuar. Los fallos de inicio temporales se reintentan cada 30 segundos durante un máximo de 6 minutos. Un inicio no confirmado se verifica antes de otro lanzamiento. Una ejecución manual fallida no se repite automáticamente. Cuando termine la espera, verifique el dispositivo y la red como se indica antes de decidir si desea seleccionar "Iniciar".

<!-- operational-note -->
Después de activar una acción, espere unos segundos antes de iniciar otra. Cerrar la página, eliminar una tarjeta o reiniciar TianshanOS no detiene los servicios en segundo plano en los hosts remotos. Para mantener un servicio detenido, deshabilite cualquier regla automática que pueda iniciarlo nuevamente en Automatización.

Mantenga presionada una tarjeta hasta que aparezca el indicador de reorden, luego arrástrela para cambiar el orden de visualización.

Si no aparecen tarjetas, lea la explicación. Espere si se está cargando la configuración. Si la carga falla, conserve el motivo y verifique “System Logs” en la Terminal. Si no hay acciones rápidas configuradas, seleccione “Open Automation” y verifique la configuración “Show on panel” de las reglas.

<!-- operational-note -->
Editar o importar una regla actualiza la configuración actual; No es necesario reiniciar para cambiar las reglas. Si se cambió la tarea de una tarjeta, revise sus condiciones, acciones y objetivos antes de ejecutarla.

No reinicie un dispositivo que proporciona servicios activos solo para restaurar una tarjeta.

#### Administrar widgets de datos

Los widgets de datos muestran los datos del dispositivo en el «Panel de dispositivos» y los actualizan durante el uso.

1. Seleccione "Administrador de widgets".
2. Elija un intervalo de actualización o desactive la actualización automática.
3. Agregue un widget preestablecido o elija un estilo de componente y fuente de datos ofrecidos por la página.
4. Edite su etiqueta, estilo de visualización y unidad según sea necesario y luego guárdelo.

Los widgets existentes se pueden editar, eliminar y reordenar. También puede seleccionar una tarjeta de widget para editarla. Mantenga presionado un widget y luego arrástrelo a una nueva posición.

«Pequeño», «Mediano» y «Grande» ocupan una, dos y tres columnas, y se adaptan a las pantallas estrechas. Al editar un icono, escriba su nombre siguiendo el ejemplo. En un widget de dos valores, cada uno tiene su propio origen de datos. Compruebe ambos orígenes y que los valores se actualicen.

"Error al cargar los widgets de datos" no significa que no exista ninguna configuración. Resuelva la causa y léala nuevamente. Si el guardado falla o su resultado no está confirmado, mantenga el contenido actual y verifique el mensaje. Ver sus cambios en la página no confirma que se hayan guardado.

### 4. Gestión de ventiladores

<!-- operational-note -->
"Control del ventilador" está en la página "Sistema". Las tarjetas de fans muestran los fans proporcionados por su dispositivo. Verifique el número del ventilador antes de cambiar una curva.

#### Ver estado del ventilador

La barra de estado muestra «Temperatura efectiva» y «Salida actual». El porcentaje grande es el ajuste de regulación confirmado por el dispositivo, no la velocidad medida. RPM indica las revoluciones por minuto medidas y no aparece si no hay una lectura válida. Si el porcentaje muestra `--`, la salida actual no está confirmada.

Al mover el deslizador manual, el valor situado a su lado muestra el ajuste que va a solicitar. El porcentaje grande sigue mostrando la salida actual. Suelte el deslizador y compruebe el mensaje y el valor actualizado. Si el valor solicitado no coincide con la salida actual, no dé el ajuste por aplicado.

El modo inteligente muestra su estado: «Modo inteligente», «Siguiendo la curva», protección o temperatura no válida. También muestra la temperatura de referencia de seguridad, la prevista dentro de 45 segundos y la velocidad de cambio de temperatura.

Si la temperatura deja de ser válida, verifique que su fuente aún se esté actualizando. El dispositivo cambia al control de protección en caso de pérdida de temperatura. Seleccione “TTI” para obtener una explicación del control térmico inteligente.

Utilice el botón de actualización en el encabezado de la sección para obtener el estado actual. Si el ajuste falla o la salida no está confirmada, verifique el dispositivo antes de decidir si desea volver a intentarlo.

#### Seleccione un modo de funcionamiento

| Propósito de | Función |
| --- | --- |
| “Apagado” | Detiene el ventilador. |
| “Manual” | Utiliza un porcentaje de control fijo establecido con el control deslizante 0-100%. |
| “Curva” | Sigue la curva de porcentaje de temperatura a control configurada. |
| “inteligente” | Utiliza la curva base, las tendencias de temperatura y los ajustes anteriores para controlar el enfriamiento. Utiliza control protector cuando es necesario. |

Detener un ventilador o establecer un valor manual bajo reduce la refrigeración. Primero verifique la carga y la temperatura y siga monitoreándolas. El control deslizante solo está disponible en el modo Manual cuando se confirma la salida actual.

#### Configurar una curva de ventilador

Seleccione "Curva" en el encabezado de la sección Control del ventilador para abrir "Gestión de la curva del ventilador". El botón “Curva” dentro de una tarjeta solo cambia el modo de funcionamiento.

1. En "Ventilador", elija el número que desea ajustar y compárelo con la página Sistema.
2. En “Enlace de variable de temperatura”, agregue variables de temperatura y asigne pesos.
3. Seleccione "Enlazar". La fuente de temperatura es compartida por los ventiladores en los modos Curva e Inteligente, por lo que cambiarla afecta a los ventiladores que usan esa fuente.
4. Agregue o edite “Nodos de curva”. Cada curva necesita al menos nodos 2 y admite hasta 10.
5. Establezca “Velocidad mínima” y “Velocidad máxima” como porcentajes de control. El mínimo no debe exceder el máximo.
6. Ajuste «Histéresis de temperatura» e «Intervalo mínimo». La histéresis admite 0-20°C y evita ajustes frecuentes ante pequeños cambios de temperatura. El intervalo admite 500-30000 ms. 1000 ms equivalen a 1 segundo.
7. Seleccione "Guardar curva". Después de guardar correctamente, el ventilador seleccionado cambia al modo Curva. Para utilizar el control térmico inteligente, regrese a la tarjeta y seleccione "Inteligente".

Si falla el guardado, lea el mensaje y verifique el estado actual antes de volver a intentarlo. Después de desvincular las variables de temperatura, verifique también la temperatura efectiva y el estado del ventilador.

<!-- operational-note -->
Después de abrir los ajustes o elegir otro ventilador, espere a que se cargue su configuración. Si se muestran valores predeterminados o un borrador anterior, no los tome como los valores actuales del dispositivo. Revíselos antes de guardar. Compruebe también los resultados de lectura y guardado de las asociaciones de temperatura.

Si el mensaje dice que la configuración del ventilador se aplicó pero no se guardó por completo, es posible que el ajuste actual ya esté vigente. Un reinicio puede restaurar la configuración anterior. Verifique el estado real del ventilador, confirme que el almacenamiento del dispositivo esté disponible y luego guarde nuevamente. No reinicie el dispositivo solo para probar si el guardado funcionó.

#### Importar y exportar una curva

- Seleccione "Importar configuración" y elija un archivo de curva JSON. JSON es el formato de archivo utilizado para almacenar datos de curvas. Revise los nodos, los límites y el número de ventilador, luego seleccione "Guardar curva" para aplicarlos.
- Seleccione "Exportar configuración" para descargar la curva actual. La página también intenta guardar una copia en `/sdcard/config` en la tarjeta SD. Verifique la descarga del navegador y el resultado informado de la tarjeta SD por separado.

#### Utilice una temperatura de prueba

Una temperatura de prueba reemplaza temporalmente la fuente normal y afecta el control Curve o Smart. Supervise el ventilador y el dispositivo durante toda la prueba.

1. Ingrese 0-100°C en "Temperatura de prueba".
2. Seleccione "Prueba" y observe la salida actual, el estado y la respuesta del ventilador.
3. Al terminar, seleccione «Borrar prueba». Compruebe que la temperatura efectiva vuelva a obtenerse de la fuente habitual.

### 5. Gestión de LED

“Control LED” está en la página “Sistema” y muestra los LED proporcionados por el dispositivo. Las funciones disponibles varían según el LED.

#### Controles de rutina

- Utilice el botón de la bombilla en la parte inferior de una tarjeta para encender o apagar el LED.
- Use los controles de brillo, tono y saturación. El brillo regula la intensidad de la luz; el tono elige el color, y la saturación va del blanco al color. Una saturación de 0 da luz blanca. Los cambios de tono y saturación se aplican al soltar el control.
- Utilice el botón de animación para abrir "Configuración de LED". Seleccione una animación en "Animación programática" y luego use su control de reproducción o detención.
- Seleccione el icono de guardar en la parte inferior derecha de la tarjeta para guardar la configuración de LED actual.
- Seleccione "Todo apagado" para apagar todos los LED y verificar el resultado informado. Si algunos fallan, verifique esos dispositivos.

#### Funciones avanzadas de matriz LED

Las tarjetas de la matriz tienen iconos para las funciones disponibles. Abra una función y cambie de grupo en «Ajustes LED»:

- “Animación programática”: seleccione y ejecute una animación.
- “Imagen/Código QR”: elija una imagen o un código QR en “Tipo” en la tarjeta, luego seleccione una imagen de tarjeta SD o ingrese el contenido QR.
- “Visualización de texto”: establece texto, fuente, alineación, desplazamiento, primer plano y fondo.
- “Filtro de posprocesamiento”: elija un filtro y parámetros, luego aplíquelos o deténgalos.
- “Corrección de color”: ajuste la pantalla y utilice los controles de reinicio, importación o exportación disponibles.

Verifique la luz real o la visualización de la matriz después de aplicar un cambio. Utilice únicamente las funciones que se muestran. Si falla una configuración, siga el mensaje para verificar el archivo, la entrada o el estado del dispositivo.

### 6. Gestión de red

<!-- operational-note -->
Seleccione "Red" en la navegación superior para abrir "Configuración de red". Cambiar el modo de red, el punto de acceso o la configuración de NAT puede interrumpir la conexión WebUI actual. Antes de guardar, asegúrese de poder volver a conectarse a través de la nueva dirección de red.

#### Ver estado de la red

La parte superior de la página muestra el estado de Ethernet, el cliente WiFi y el AP WiFi. Abra el panel relacionado para ver la dirección IP, la máscara de subred, la puerta de enlace, DNS, la dirección MAC, SSID, la señal y los recuentos de dispositivos conectados cuando estén disponibles.

El panel Ethernet muestra el enlace actual y la información de la dirección. No proporciona controles de edición de direcciones.

#### Seleccione un modo WiFi

| Propósito de | Función |
| --- | --- |
| “Apagado” | Desactiva WiFi. |
| “Estación (STA)” | Conecta el dispositivo a una red WiFi existente. |
| “Punto de acceso (AP)” | Hace que el dispositivo proporcione un punto de acceso WiFi. |
| “STA+AP” | Se conecta a una red WiFi existente mientras mantiene disponible el punto de acceso del dispositivo. |

Después de elegir un modo, espere a que la página actualice el estado. La conexión inalámbrica actual puede interrumpirse durante el cambio.

#### Conectarse a Wi-Fi

1. Configure el modo WiFi en “Estación (STA)” o “STA+AP”.
2. En "Estación", seleccione "Escanear".
3. Elija una red de la lista. La lista muestra SSID, intensidad de la señal, canal y tipo de autenticación.
4. Introduzca la contraseña y confirme. Deje la contraseña en blanco para una red abierta.
5. Espere a que el estado cambie a "Conectado" y luego confirme la nueva dirección IP.

Seleccione "Desconectar" para finalizar la conexión actual del cliente WiFi.

#### Configurar el AP WiFi

1. Configure el modo WiFi en “Punto de acceso (AP)” o “STA+AP”.
2. En "Hotspot", seleccione "Configuración".
3. Introduzca el SSID. Una contraseña en blanco crea un punto de acceso abierto; un punto de acceso protegido requiere al menos caracteres 8.
4. Seleccione un canal y habilite “Ocultar SSID” si es necesario.
5. Seleccione "Aplicar" y espere a que se actualice el estado del punto de acceso.

Seleccione "Dispositivos" para ver los clientes actualmente conectados al punto de acceso.

#### Establecer el nombre de host

Ingrese un nuevo nombre en la sección "Nombre de host" en "Servicios de red", luego seleccione "Establecer". La página muestra el nombre de host actual después de actualizarse.

#### Ver clientes DHCP

DHCP asigna automáticamente direcciones de red a los dispositivos conectados. Seleccione "Clientes", elija "WiFi AP" o "Ethernet" y vea los arrendamientos actuales. Utilice el botón de actualización para recargar la lista.

#### Operaciones de red avanzadas

##### Configurar la puerta de enlace NAT

NAT reenvía el tráfico de red entre las interfaces de red del dispositivo. Habilite o deshabilite NAT, luego seleccione "Guardar" para conservar la configuración. Verifique el estado del WiFi y de Ethernet luego.

##### Acceda a la red ascendente a través de la equipo de aplicaciones

Esta operación utiliza la equipo de aplicaciones configurada para configurar el acceso a la red. En Sistema, primero cambie el USB a "Equipo de aplicaciones" y verifique los cables de red. Su host SSH debe utilizar autenticación de clave y tener una huella digital de host verificada. Verifique la configuración del host, la clave y las huellas digitales usando la Guía de seguridad.

Obtenga la contraseña sudo para la cuenta SSH en ese host. Esta contraseña autoriza cambios en el sistema y puede diferir de la contraseña de WebUI.

1. En "Acceso a la red ascendente", seleccione "Acceso a través de la equipo de aplicaciones".
2. Ingrese la contraseña sudo de la equipo de aplicaciones y seleccione el botón de acceso. La contraseña se utiliza sólo para esta ejecución y no se guarda; ingréselo nuevamente para una ejecución posterior.
3. Espere a que finalice la operación. No lo inicie nuevamente mientras procesa.
4. El acceso se confirma solo cuando el resultado informa tanto una conexión a Internet como una configuración de red completa.
5. Después de cerrar la ventana de resultados, seleccione "Ver resultado" para abrirla nuevamente. Si falla o el resultado no está confirmado, lea el motivo y la etapa de falla. Expanda "Registro de ejecución" para obtener más detalles. Verifique la contraseña para ver si hay un error de contraseña, o el cableado y la red ascendente si no se encuentra una conexión a Internet.

Si la huella del host no está confirmada o ha cambiado, verifique su identidad en Seguridad. No siga intentando la conexión ni omita la comprobación. La salida del script remoto puede conservar su idioma original; guárdela si hace falta investigar.

Una solicitud de estado fallida no significa que el script se haya detenido. Utilice el control "Actualizar estado" disponible para verificar la ejecución actual antes de decidir si desea volver a intentarlo.

### 7. Gestión de archivos

Seleccione "Archivos" en la navegación superior para abrir el "Administrador de archivos".

La tarjeta SD es un almacenamiento extraíble y SPIFFS es un almacenamiento de archivos interno del dispositivo. Seleccione “Tarjeta SD” o “SPIFFS” para cambiar de ubicación. La ruta en la parte superior muestra su carpeta actual. Seleccione un nombre de carpeta en la ruta para volver a ella.

#### Explorar y administrar archivos

- Seleccione un nombre de carpeta para abrirla.
- Seleccione el botón de descarga al lado de un archivo para guardarlo en la ubicación de descarga del navegador.
- Seleccione el botón de cambio de nombre, ingrese un nuevo nombre y confirme.
- Seleccione “Nueva carpeta”, ingrese un nombre de carpeta y créela.
- Seleccione el botón Actualizar para recargar el directorio actual y el estado de almacenamiento.

Subir archivos, eliminarlos, renombrarlos, crear carpetas y montar o desmontar la tarjeta SD requiere una sesión válida. Leer y descargar archivos protegidos de Automatización también requiere permiso root. Confirme que la sesión root sigue siendo válida y use las páginas de configuración. No cambie la ruta ni use otra entrada para eludir los permisos.

#### Subir archivos

Los archivos solo se pueden subir a la tarjeta SD, no a SPIFFS. Compruebe primero que la tarjeta SD esté montada.

1. Seleccione «Tarjeta SD» y abra la carpeta donde desea subir los archivos.
2. Seleccione "Cargar archivos".
3. Seleccione uno o más archivos o arrastre archivos al área de carga.
4. Revise la lista de carga y elimine archivos no deseados.
5. Seleccione "Cargar" y espere a que cada archivo muestre su finalización.

Al subir un paquete `.tscfg`, se abren los pasos de verificación y aplicación. Esta página de archivos todavía no aplica los ajustes del paquete. Que la carga o la verificación se complete no significa que los ajustes estén activos.

Importe paquetes de reglas en Automatización, como se describe en el Capítulo 12. La carga normal de archivos no sustituye a la importación de reglas. Consulte la Guía de seguridad para obtener orientación sobre fuentes y firmas para otros paquetes.

#### Operaciones por lotes

Después de seleccionar archivos o carpetas, aparece la barra de herramientas por lotes.

- «Descarga por lotes» descarga los archivos seleccionados. No incluye las carpetas.
- “Eliminar por lotes” elimina los archivos y carpetas seleccionados.
- “Borrar selección” borra la selección actual.

#### Eliminar un archivo o carpeta

La eliminación no se puede deshacer en la WebUI. Al eliminar una carpeta también elimina su contenido. Compruebe el nombre y la ruta antes de seleccionar «Eliminar» o «Eliminar por lotes» y confirmar.

Los archivos administrados por Automatización están protegidos. Es posible que se rechace la carga o sobrescritura de archivos en `/sdcard/config/automation`, o la eliminación o cambio de nombre de esa carpeta o de una carpeta principal que la contenga. Si el mensaje dice que Automation administra el archivo, use “Configuration & backup” en Automation o la lista correspondiente. No utilice la Terminal para evitar la restricción.

#### Montar y desmontar la tarjeta SD

Al desmontar la tarjeta SD, sus archivos dejan de estar disponibles hasta volver a montarla. Termine las cargas, descargas y otras operaciones de archivos antes de seleccionar «Desmontar SD».

Desmontar o reemplazar la tarjeta puede cambiar la automatización a su configuración de emergencia interna. Es posible que esa copia sea más antigua y es posible que aún se ejecuten las reglas automáticas habilitadas. Sin una copia utilizable, es posible que la automatización no esté disponible. Revise la configuración y las tareas de emergencia antes de desmontar (Capítulo 13). Las imágenes, fuentes y registros de la tarjeta dejan de estar disponibles.

Cuando la tarjeta SD no está montada, la página muestra "Montar SD". Selecciónelo, espere a que el estado cambie a "Montado" y luego abra nuevamente el directorio de la tarjeta SD.

Montar la tarjeta no significa que Automatización haya cambiado a su configuración. Después de reinsertar una tarjeta, elija qué configuración usar como se describe en el Capítulo 13. Nada se sobrescribe ni se fusiona automáticamente.

### 8. Actualizaciones de OTA

En la página "Sistema", seleccione "Actualización OTA" en la sección "Red y hora" para abrir "Actualización de firmware".

<!-- operational-note -->
El dispositivo se reinicia durante una actualización, desconectando temporalmente la WebUI. Guarde el trabajo activo y mantenga estable la energía del dispositivo antes de comenzar. No apague el dispositivo mientras el progreso de la actualización esté incompleto.

#### Primera actualización de una versión anterior a 0.6.3

La primera actualización desde una estructura de almacenamiento anterior, como 0.6.2, necesita un paquete USB/serial compatible aprobado por el proveedor. Cargar solo el firmware o WebUI no puede completar esta actualización. Pídale al administrador o proveedor del dispositivo que siga las instrucciones del paquete. No borre toda la memoria flash ni utilice una tabla de particiones antigua.

Guarde los archivos importantes antes de actualizar. La herramienta combinada conserva las claves y la tarjeta SD; No borra la configuración de la tarjeta. El primer inicio aún puede leer o migrar la configuración existente. La entrega al cliente sigue el procedimiento de “borrar la configuración anterior y configurarla nuevamente”. El administrador o proveedor del dispositivo debe seguir las instrucciones de entrega. No borre toda la memoria flash usted mismo ni trate los archivos conservados como una configuración completa.

Mantenga la alimentación conectada durante la actualización y el primer inicio. Luego, verifique el inicio de sesión, las redes, los ventiladores, la iluminación, los hosts SSH y las reglas de automatización. Revise las reglas antes de probar cualquier tarea que controle la energía, reinicie un dispositivo o ejecute comandos remotos.

El paquete compatible actualiza ambas ranuras de aplicaciones. No asuma que la otra ranura todavía contiene la versión anterior. Si se pierde la contraseña root, utilice únicamente un método de recuperación confirmado por el proveedor para que coincida con la estructura de 0.6.3. No instale una imagen antigua para restablecer la contraseña.

Los métodos de actualización web que aparecen a continuación se aplican únicamente a las versiones que el proveedor ha aprobado para OTA. No sustituyen la primera actualización de la estructura de almacenamiento.

#### Buscar actualizaciones de un servidor OTA

1. Revise la “Versión actual”. Dos instalaciones de 0.6.3 pueden ser versiones de revisión diferentes. Consulte la versión completa, el tiempo de compilación y las instrucciones del editor en lugar de solo los tres primeros números.
2. Introduzca la dirección del servidor OTA proporcionada por un administrador o proveedor.
3. Seleccione “Save” y luego seleccione “Check Update”.
4. La página informa “Update Available” “Already up to date” de una versión anterior del servidor o de un error.
5. Confirme la versión de destino, luego seleccione “Upgrade Now” o el control de actualización que se muestra en la página.
6. Espere a que finalice la descarga, la instalación y el reinicio. Para cancelar utilice el botón “Abort” cuando esté disponible. No todas las etapas admiten la cancelación.
7. Espere a que la página confirme el firmware después de la actualización. Vuelva a conectarse al WebUI y verifique el “Current Version” y el estado del dispositivo.

“Upgrade Progress” muestra la etapa actual en su propia sección. Una lectura del 100% o un mensaje de que se escribieron archivos no confirma que se haya completado el reinicio y la verificación de la versión. Si el resultado no está confirmado o el firmware en ejecución difiere del objetivo, conserve el mensaje y verifique la versión actual. No repita la actualización sin verificar. Verifique los registros del sistema y comuníquese con el proveedor si es necesario.

Cuando “Also upgrade www” está habilitado, el firmware y WebUI se actualizan en secuencia. Utilice firmware coincidente y recursos WebUI de la misma versión. Si la interfaz anterior permanece después de la actualización, fuerce la actualización del navegador y verifique la versión y la página nuevamente.

#### Actualización manual

Expanda “Actualización manual” y elija uno de estos métodos:

- “Actualizar desde URL”: Ingrese la URL del firmware, configure “Actualizar también www” de acuerdo con las instrucciones de la versión y luego seleccione “Actualizar”. Aquí, www se refiere a los recursos de la interfaz web del dispositivo.
- “Actualización desde tarjeta SD”: Ingrese una ruta de firmware como `/sdcard/firmware.bin`. Si está habilitado "Actualizar también www", asegúrese de que `www.bin` de la misma versión esté en ese directorio.

Para una actualización desde una URL, "Omitir verificación de certificado" omite la verificación del certificado del servidor HTTPS. Esto elimina la verificación del certificado utilizada para confirmar la identidad del servidor de descarga. Déjelo sin marcar para actualizaciones de rutina. Si ve un error de certificado, solicite a su administrador que verifique la dirección del servidor y el certificado.

#### Gestión y reversión de particiones

“Administración de particiones” muestra la partición en ejecución y otras particiones disponibles.

- “Marcar válido” confirma la versión en ejecución y deshabilita la protección de reversión automática para esa versión. Úselo después de confirmar que la versión actual funciona correctamente.
- “Revertir a esta versión” selecciona otra versión de arranque y cambia mediante un reinicio. La reversión interrumpe los servicios actuales. Primero confirme la versión de destino y la compatibilidad de datos.

Una vez completada la operación y el reinicio, vuelva a abrir la WebUI y verifique la versión actual y el estado del dispositivo.

La versión 0.6.3 cambia el almacenamiento de configuración y el diseño de la partición del dispositivo. No vuelva directamente a una versión anterior de firmware incompatible. Si necesita volver a una versión anterior, solicite al proveedor del dispositivo que confirme un procedimiento completo de recuperación de firmware, diseño y configuración.

La reversión no restaura el formato de configuración anterior ni garantiza que las reglas antiguas funcionen.

### 9. Entrada a la gestión de seguridad

Seleccione "Seguridad" en la navegación superior para abrir la administración de seguridad. Utilice la Guía de seguridad TianshanOS para claves SSH, hosts remotos, huellas digitales de host conocidos, certificados HTTPS, paquetes de configuración y administración de cuentas. Estos procedimientos no se repiten aquí.

#### Operaciones fallidas o no confirmadas

Un error en el campo rojo le indica qué corregir. Arréglelo y luego guárdelo. Una marca de error borrada no confirma que se haya guardado correctamente; revisa el mensaje y la lista.

Compruebe qué operación falló y lea el motivo y el siguiente paso. Si el mensaje no da un motivo, no lo suponga.

Seleccione “Details” cuando esté disponible. Seleccione “Hide” para ocultar los detalles. Si se muestra un botón ×, selecciónelo para descartar el mensaje. Para verificaciones adicionales, mantenga un registro del mensaje y los detalles, luego abra “System Logs” en la Terminal para investigar.

Si un mensaje o sus detalles son largos, desplácese dentro de esa área para leer el contenido completo antes de decidir qué hacer a continuación.

Si el resultado no está confirmado, actualice y compruebe el estado del dispositivo, archivo o tarea. Un tiempo de espera agotado o una desconexión no significa que la operación no se haya ejecutado. No repita de inmediato las operaciones de alimentación, eliminación, inicio de tareas o actualización. Si sigue sin poder confirmarlo, abra «Registros del sistema» en Terminal para investigar.

Verifique los resultados de los lotes exitosos, fallidos y no confirmados por separado. Confirme los archivos guardados en la lista de descargas del navegador.

## Parte II: Funciones exclusivas de root

### 10. Registros de terminal y sistema

“Terminal” se muestra únicamente a root. Puede ejecutar comandos de la consola del dispositivo directamente y mostrar registros del dispositivo. Un comando puede cambiar el estado del dispositivo inmediatamente. Confirme su fuente, parámetros e impacto antes de ingresar.

#### Conectarse y utilizar la terminal

1. Seleccione "Terminal" en la navegación superior.
2. Espere "Conectado al dispositivo" y el mensaje `tianshan>`.
3. Ingrese `help` para ver los comandos proporcionados por el firmware actual.
4. Ingrese un comando y presione Enter. Espere a que finalice su salida y regrese el mensaje.

Los comandos no se ejecutan mientras la página muestra «Sin conexión al dispositivo». Tras una desconexión, espere el mensaje de reconexión antes de enviar otra vez el comando. Así evita ejecutarlo dos veces.

Si hay otra sesión de terminal en uso, cierre primero la terminal original. Si las conexiones están llenas, espere a volver a conectarse en lugar de abrir más pestañas. Después de un inicio de sesión caducado, inicie sesión nuevamente y espere a que Terminal confirme la conexión.

Mientras el comando siga activo, espere a que termine o solicite detenerlo. Si se indica que se está esperando una salida segura, la parada aún no ha terminado. Espere a que reaparezca el indicador de comandos antes de escribir otro. Si falta salida, compruebe por separado el resultado y los registros del sistema. La falta de salida no justifica ejecutar de nuevo el comando.

El terminal admite estos controles de teclado:

| Control | Función |
| --- | --- |
| Ctrl+C | Borra la entrada actual y solicita una interrupción. El comando debe soportar la interrupción para que se detenga. |
| Ctrl+L | Borra la pantalla. |
| ↑ / ↓ | Explora el historial de comandos desde la sesión de la página actual. |
| ← / → | Mueve el cursor dentro de la entrada actual. |

“Borrar” en la parte superior de la página solo borra la pantalla. No deshace los comandos que ya se han ejecutado. “Desconectar” finaliza la conexión actual del Terminal.

#### Abrir un Shell SSH remoto

Un Shell SSH envía entradas de teclado posteriores a un host remoto. Confirme la dirección de destino, el usuario y el método de autenticación, y complete la preparación de SSH descrita en la Guía de seguridad antes de conectarse. Si el terminal web requiere verificación del host, verifique y confirme la huella digital en Seguridad antes de volver a conectarse. No responda una confirmación en una consola serie o en el terminal de otra persona en su nombre.

1. Ingrese `ssh --help` para ver las opciones del comando SSH.
2. Ingrese `ssh --host <host> --user <user> --shell`, reemplazando cada marcador de posición, incluidos sus corchetes angulares, con el valor real. Para especificar un puerto, agregue `--port <port>` antes de --shell.
3. Espere la confirmación de la conexión remota antes de ingresar comandos remotos.
4. Presione Ctrl+\ para salir del shell SSH y regresar al indicador tianshan>.

No ingrese credenciales en texto sin formato mientras otra persona comparte, graba o ve el terminal.

#### Ver registros del sistema

Seleccione "Registros del sistema" en la parte superior de la Terminal para abrir la ventana de registro.

- “Nivel” establece el nivel mínimo mostrado. Utilice ERROR, WARN+, INFO+ o DEBUG+ para limitar la salida.
- Filtros “TAG” por fuente de registro.
- “Buscar” filtra los registros actuales por palabra clave.
- “Desplazamiento automático” sigue las nuevas entradas de registro cuando está habilitado.
- El botón de actualización recarga los registros históricos.
- El botón borrar borra solo los registros que se muestran actualmente en la ventana.

Si el filtrado no produce resultados, borre TAG y Buscar primero, luego cambie el Nivel. Cerrar la ventana de registro no detiene los servicios del dispositivo.

#### Compruebe dónde se guarda la automatización

Para una verificación de la línea de comandos, ingrese `auto --config status` para ver la ubicación de la configuración actual y el estado de la copia de seguridad. Utilice `auto --help` para conocer las opciones disponibles. Se eliminó la antigua opción `config --sync`. Utilice los pasos web del Capítulo 13 para realizar copias de seguridad y recuperación de rutina.

### 11. Administrar y ejecutar comandos remotos

«Comandos» guarda comandos SSH reutilizables y los ejecuta en el host remoto seleccionado. Los hosts y sus datos de autenticación se gestionan en «Seguridad». Consulte la guía de seguridad para esos pasos.

#### Verifique la huella digital del host antes de conectarse

La huella ayuda a identificar el host al que se conecta. Estos pasos corresponden a las pruebas de hosts SSH en la página web «Seguridad», no al flujo de confirmación de SSH Shell en Terminal. Si la huella no está registrada o ha cambiado, no siga ejecutando el comando. Abra «Seguridad», busque el host SSH y seleccione «Probar».

En la primera conexión, el diálogo muestra la dirección y la huella del host. Contrástelas con el administrador por un canal de confianza. Seleccione «Confiar y conectar» solo después de confirmar que coinciden.

Si la huella ha cambiado, el diálogo muestra la guardada y la actual, con «Cancelar» seleccionado. Reinstalar el host puede cambiar su huella, pero también puede tratarse de otro host o de una suplantación.

Compruebe la dirección y confirme el motivo del cambio por un canal de confianza. Si no puede confirmarlo, seleccione «Cancelar». No elimine la huella antigua para saltarse la comprobación. Seleccione «Actualizar clave del host» solo cuando haya confirmado que la nueva huella es fiable.

#### Seleccione un host y vea los comandos

1. Seleccione "Comandos" en la navegación superior.
2. Elija un host que se muestra actualmente en "Seleccionar host".
3. Revise sus elementos guardados en "Lista de comandos".

El texto del comando está contraído de forma predeterminada. Seleccione "Mostrar comando" para ver todas sus líneas u "Ocultar comando" para contraerlo. Expandir el texto no lo ejecuta.

Los “comandos huérfanos” no tienen un host utilizable y no se pueden ejecutar. Prepare un host válido, edite el comando, elija ese host y revise el contenido. Habilítelo y guárdelo solo cuando se permita la ejecución. Consulta las plantillas y reglas que lo utilizan. No se necesita un nuevo comando con el mismo nombre solo para volver a conectarlo a un host.

Para cambiar la dirección, el puerto, la cuenta o la clave de un host, edítelo en la lista de hosts SSH de Seguridad. La Guía de seguridad explica los pasos. Los cambios se aplican a conexiones futuras; las tareas ya iniciadas siguen usando los datos originales de sus registros. Antes de borrar una clave, consulte los hosts y los registros de ejecución relacionados. Borrarla no detiene las tareas remotas, pero puede impedir que este dispositivo las compruebe o detenga.

#### Crear o editar un comando

<!-- operational-note -->
Un comando guardado se ejecuta en un host remoto. Verifique el comando y los permisos requeridos en ese host antes de guardarlo. Tenga especial cuidado con los comandos que eliminan datos, apagan o reinician un host o sobrescriben archivos.

1. Seleccione un host, luego seleccione "Nuevo comando". Utilice el botón de edición en un comando existente para cambiarlo.
2. Ingrese un "ID de comando" único, como `model.v1` . No utilice saltos de línea, caracteres de control, barras o solo `.` o `..` . Puede contener hasta 31 letras o dígitos en inglés; Los caracteres chinos y algunos otros utilizan más espacio. Siga la longitud del mensaje del campo.
3. Ingrese "Nombre del comando" y "Comando". Coloque cada comando en una línea separada cuando utilice varias líneas.
4. Agregue una descripción y elija un ícono o una imagen de la tarjeta SD si es necesario.
5. Revise el host, si el comando está habilitado, el modo de ejecución y las opciones de coincidencia de salida; después seleccione «Guardar». Crear un ID duplicado produce un error, sin sobrescribir el comando existente. Para cambiarlo, use su botón de edición.

El nombre le ayuda a reconocer un comando; La automatización usa su ID para encontrarlo. No puede cambiar el ID de un comando existente. Para usar una nueva ID, cree un comando y actualice las plantillas y fuentes que lo usan.

#### Ejecutar un comando y revisar el resultado

1. Seleccione el control de ejecución en una tarjeta de comando.
2. Observe el resultado y el estado en "Resultado de la ejecución".
3. Cuando se muestre “Cancelar”, utilícelo para solicitar la interrupción de la sesión actual. Verifique el estado y la salida para confirmar si se detuvo. Las operaciones remotas completadas no se deshacen.
4. Seleccione “Borrar” para eliminar la visualización del resultado actual.

«Borrar» no deshace lo que ya se ha ejecutado en el host remoto. La clasificación como éxito o fallo, el contenido extraído y el estado final dependen de los criterios configurados para el comando.

La página comprueba el resultado de esta ejecución sin volver a ejecutar el comando. Si las comprobaciones automáticas de resultados se pausan, vuelva a abrir Comandos en la misma pestaña del navegador para continuar con la comprobación. Cerrar sesión, reiniciar el dispositivo o que un resultado ya no se conserve puede impedir la recuperación. Verifique el estado remoto real antes de decidir si ejecutarlo nuevamente.

Distinga el resultado de salida del comando, la coincidencia de condiciones y la integridad del registro. "Ejecución completada con código de salida confirmado 0" confirma una salida normal. Los resultados recopilados incompletos aún pueden dejar la coincidencia y la extracción sin confirmar. La falta de salida del registro en la página no significa que el comando remoto haya fallado. Siga el mensaje para comprobar la salida original y el host de destino.

#### Configurar la coincidencia de resultados

La coincidencia de resultados convierte la salida remota en un estado que es más fácil de usar.

- “Coincidencia esperada”: Marca el resultado exitoso cuando la salida contiene el texto configurado.
- “Fail Match”: Marca el resultado fallido cuando la salida contiene el texto configurado.
- “Extraer expresión regular”: utiliza un grupo de captura `(.*)` para guardar la salida seleccionada.
- “Detener al coincidir”: Solicita el fin de un comando continuo después de que coincida un resultado configurado. Comprueba también el estado final.
- “Tiempo de espera (s)”: Establece cuánto tiempo esperar para una coincidencia, en segundos. Se aplica solo cuando se establece un patrón de éxito o fracaso, o cuando está habilitado "Detener al coincidir".
- “Nombre de variable”: guarda el estado y la salida extraída para usar en la página de Automatización.

Elija texto estable y específico de éxito y fracaso. El texto amplio puede producir coincidencias incorrectas. Ejecute el comando una vez y revise "Resultados de la coincidencia" antes de usar sus variables en una regla.

Cuando Automatización usa este comando SSH normal, también aplica los ajustes guardados de coincidencia, extracción y parada al coincidir. Una coincidencia encontrada puede conservarse al llegar al límite de ejecución. Encontrar una coincidencia o no agotar el tiempo no demuestra que el proceso remoto haya terminado. Compruebe también el código de salida y el estado real.

#### Utilice el modo de servicio y ejecución en segundo plano

nohup significa que un comando continúa ejecutándose en segundo plano del host remoto después de que se cierra la conexión SSH. Cerrar la WebUI no detiene una tarea en segundo plano.

Las ejecuciones en segundo plano requieren autenticación de clave SSH. Implemente la clave pública en “Security” y luego seleccione el host asociado. No guarde contraseñas en texto plano en comandos en segundo plano. La misma clave debe permanecer disponible para detener o verificar la tarea original.

Después de activar «Ejecutar en segundo plano (nohup)» y ejecutar el comando, abra «Registros de ejecución» en Comandos. El botón de Sistema, exclusivo de root, y el de Automatización abren la misma lista. Esta incluye tareas anteriores; su presencia no demuestra que sigan en ejecución. Al iniciar una tarea también se comprueban los registros anteriores relacionados.

1. Busque la tarea original por su nombre, usuario, dirección de host y puerto.
2. Seleccione “Verify remote state” para verificar esta ejecución en el host original.“Refresh” sólo lee registros conocidos; no reemplaza la verificación.
3. Seleccione “View Log” para leer las últimas 100 líneas del host original. Seleccione “Follow log” para obtener actualizaciones.“Stop following” detiene solo las actualizaciones de la página.
4. Para finalizar la tarea, seleccione “Stop” en su registro y confirme. Espere el resultado, luego verifique que se haya detenido. No lo vuelvas a iniciar sin comprobarlo.

Tras reiniciar el dispositivo, los registros anteriores muestran «Sin comprobar». «Estado remoto sin confirmar» indica que aún no se sabe si la tarea está detenida o en ejecución. «Último resultado» es el último estado confirmado, no una garantía del estado actual.

Una lectura fallida no significa que el registro esté vacío o que el proceso haya salido. Verifique la conexión del host original, la ruta del registro y la clave SSH. Verifique nuevamente después de resolver el problema; No reinicie una tarea sólo porque falló su verificación de estado.

Si el registro ya no está en el host original, es posible que el host se haya reiniciado o que se hayan borrado los archivos temporales. Esto difiere de un registro vacío y no prueba que la tarea nunca se ejecutó. Verifique el estado remoto o solicite al administrador del host que lo verifique.

Eliminar un comando, cambiar su configuración de host o cambiar las configuraciones de automatización no finaliza un proceso remoto. Administre la tarea original desde "Registros de ejecución". La recreación de un comando con el mismo nombre o ID no asume la tarea original. Guarde cualquier llave que aún necesite para controlarlo.

«Modo servicio» supervisa una tarea en segundo plano hasta que está disponible. Complete «Criterio de disponibilidad» y «Nombre de variable». Ajuste el patrón de fallo y los tiempos si lo necesita:
- “Ready match”: Marca el servicio listo cuando aparece el texto configurado. Utilice `|` para separar varios patrones.
- “Fail Match”: Marca el servicio fallido cuando aparece el texto configurado.
- “Tiempo de espera(s) de listo”: Establece la espera más larga para el estado listo, en segundos.
- “Intervalo de verificación (ms)”: establece con qué frecuencia se verifica el registro, en milisegundos; 1000 ms equivale a 1 segundo.
- “Nombre de variable”: almacena estados como comprobación, listo y tiempo de espera.

<!-- operational-note -->
Las tareas en modo de servicio pueden estar iniciando, verificando, deteniendo o sin confirmar. Espere el resultado final después de aceptar una solicitud. Si ya existe un registro de ejecución en segundo plano, verifique esa ejecución original y confirme que haya finalizado antes de comenzar de nuevo. Una regla automática habilitada puede iniciar el servicio nuevamente. Deshabilite esa regla primero si el servicio debe permanecer detenido.

#### Importar y exportar comandos

- Utilice el botón exportar en un comando para exportarlo y, cuando esté seleccionado, incluya su configuración de host dependiente.
- Seleccione “Import Command”, elija un paquete de configuración `.tscfg`, obtenga una vista previa de su contenido y decida si desea sobrescribir la configuración existente.

La importación puede incluir un host remoto y reemplazar la configuración con la misma ID. Revise el comando, el host y los reemplazos en la vista previa antes de confirmar. Al guardar se actualiza la configuración actual sin reiniciar. Los procesos remotos existentes no se detienen ni se trasladan al nuevo host.

Las nuevas importaciones verifican el origen, la firma, el permiso de firma y el dispositivo de destino. Una exportación exitosa no garantiza una importación posterior. Un certificado de dispositivo destinado únicamente a HTTPS puede carecer de permiso para firmar paquetes de configuración. Pídale al proveedor de configuración que resuelva esto; no desactive la verificación.

#### Verifique el impacto antes de eliminar un comando

Después de seleccionar eliminar, revise las plantillas y reglas vinculadas. Elija un comando de reemplazo disponible o desvincule la configuración afectada y deshabilite sus reglas. Consulte el Capítulo 12 para conocer los pasos. La eliminación cambia sólo la configuración en uso; no actualiza la otra copia de emergencia.

Eliminar la configuración y detener un servicio remoto son operaciones independientes. La eliminación no detiene el servicio ni deshace las operaciones completadas. Para finalizar una tarea remota, deténgala desde "Registros de ejecución" y confirme el resultado.

### 12. Gestión de la automatización

"Automatización" conecta datos y operaciones en flujos de trabajo repetibles. Cree fuentes de datos y plantillas de acciones, luego use reglas para decidir cuándo ejecutarlas.

```text
Automático: fuente de datos → variable → evaluación de reglas → acciones
Manual: acción rápida de la página Sistema → acciones
```

Las fuentes leen datos, las variables contienen valores, las reglas evalúan condiciones y las plantillas definen tareas. Mostrar una regla en el panel y permitir la ejecución manual son configuraciones independientes. Las reglas automáticas también pueden aparecer en el panel.

#### Ver y controlar el motor de automatización

La parte superior de la página muestra el estado del motor, las reglas, las variables y los recuentos de fuentes, el recuento de activadores y el tiempo de ejecución.

| controlar | Efecto |
| --- | --- |
| “Start” | Arranca un motor parado. Las reglas habilitadas se ejecutan solo si la configuración actual permite la ejecución. |
| “Pause” | Detiene la evaluación automática adicional. Las acciones existentes pueden continuar. Para continuar a través de la página, pare el motor y luego enciéndalo. |
| “Stop” | Intenta detener las comprobaciones de reglas, la lectura de datos y la programación de acciones posteriores, manteniendo la configuración. Espere la confirmación; un tiempo de espera no significa que el motor se haya parado. |
| “Reload” | Lee la configuración nuevamente desde la ubicación en uso. Guarde las ediciones y compruebe el resultado. Se mantiene una pausa de configuración existente. |

Compruebe si la refrigeración, las alertas u otras tareas en curso dependen de la automatización. Detener el motor no detiene un proceso remoto en segundo plano. Detenga las tareas remotas desde "Registros de ejecución" y confirme el resultado.

“Disable automation” debajo de “Configuration & backup” está separado del control “Pause” del motor. Si la configuración está en pausa, revísela antes de seleccionar “Enable automation”. Reiniciar el dispositivo, recargar o detener y arrancar el motor no borra esta pausa de configuración. Consulte el Capítulo 13.

#### Cree un flujo de trabajo de automatización mínimo

1. Cree una fuente y use su prueba para verificar la conexión y los campos seleccionados.
2. Habilítelo, luego use el ícono “Ver variables” de la fila para verificar los valores y actualizar los tiempos.
3. Cree una plantilla, revise sus parámetros y seleccione "Probar". Las pruebas ejecutan la acción inmediatamente; confirme que el dispositivo y el host puedan aceptarlo.
4. Cree una regla con "Habilitar inmediatamente" desactivado. Establece condiciones, tiempo de reutilización, orden de acción, retrasos y repetición.
5. Configure “Mostrar en panel” y “Permitir activación manual” según sea necesario.
6. Guarde y luego habilite la regla. Verifique las variables, los recuentos de activadores y los resultados reales.

#### Administrar fuentes de datos

Seleccione "Agregar" en "Fuentes de datos" y elija un tipo: Tipo

| Tipo | Función |
| --- | --- |
| “API DE RESTO” | Lee periódicamente datos de una dirección HTTP. |
| “WebSocket” | Recibe datos enviados a través de una conexión persistente. |
| “Socket. IO” | Recibe eventos de un servicio Socket. IO. |
| “Variable de comando” | Lee los resultados de un comando remoto configurado. |

1. Ingrese una identificación única, una etiqueta para mostrar y la información de conexión requerida.
2. Utilice la prueba para comprobar la conexión. Obtenga direcciones, detalles de autenticación e información de campo del proveedor de datos.
3. Para los primeros tres tipos, seleccione campos de la respuesta de la prueba. Dejar el nombre de un evento Socket. IO en blanco permite que la prueba intente descubrir el evento.
4. Para una variable de comando, seleccione el host y un comando con un nombre de variable configurado, luego configure el intervalo de sondeo.
5. Verifique el interruptor de habilitación en el formulario, guárdelo y use “View Variables” en su fila para verificar el resultado.

Las filas de origen proporcionan un interruptor de habilitación, un visor de variables y controles de edición, exportación y eliminación. Verifique qué reglas usan una fuente antes de deshabilitarla o eliminarla, para no interrumpir sus tareas.

Para cambiar una fuente existente, seleccione su botón de edición. Revise la dirección, la autenticación, el intervalo de recopilación y el estado de habilitación, luego guarde. Las asignaciones de campo existentes permanecen vigentes. Utilice "Ver variables" después para verificar la fuente, los valores y los tiempos de actualización. Los intervalos en la ventana de edición están en segundos, con hasta tres decimales. La creación de una identificación duplicada no sobrescribe la fuente existente.

REST obtiene datos con el método GET o POST guardado. WebSocket recibe los datos enviados por el servidor; Socket.IO usa el evento y la dirección configurados. Después de probar la conexión, compruebe que los datos siguen actualizándose. Una fuente «Variable de comando» solo lee el estado existente y no inicia comandos. Ejecute el comando aparte si necesita un resultado nuevo.

Importar y exportar paquetes de configuración de uso. Obtenga una vista previa de los ID, tipos y reemplazos antes de importarlos y siga la Guía de seguridad para conocer los requisitos de origen y confianza.

#### Ver variables

Seleccione el icono con forma de ojo "Ver variables" en una fila de origen. La ventana muestra nombres, tipos, valores y tiempos de actualización. Las variables de comando remoto también se pueden ver desde el control de variables del comando.

- Confirme los nombres y la fuente, y verifique que los valores y tipos se ajusten a las comparaciones de la regla.
- Compruebe si los tiempos de actualización coinciden con la frecuencia de datos esperada.
- Si no hay datos disponibles, verifique que la fuente esté habilitada y luego pruebe la conexión y los campos. Para las variables de comando, verifique también el resultado de la ejecución del comando.

#### Administrar variables de usuario

Seleccione "Variables de usuario" en Automatización para ver las variables y los valores iniciales que guardó. Esta lista no contiene los datos recopilados en vivo del dispositivo.

1. Busque la variable y seleccione su icono de eliminación.
2. Revise las fuentes, plantillas y reglas afectadas. Siga la página para eliminar o manejar sus enlaces.
3. Después de confirmar, vuelva a leer la lista. Compruebe qué configuraciones relacionadas están habilitadas y sus resultados de ejecución. Eliminar una definición inicial no equivale a borrar todos los datos en vivo.

#### Crear y probar plantillas de acción

Seleccione "Agregar" en "Plantillas de acción" y elija un tipo de tarea:

| Tipo | Función |
| --- | --- |
| “Comando CLI” | Ejecuta un comando de consola de dispositivo local. |
| “Comando SSH” | Ejecuta un comando remoto guardado en la página Comandos. |
| “Control LED” | Controla los colores, efectos o contenido de la matriz del LED. |
| “Registro” | Escribe un mensaje en el nivel seleccionado. |
| “Establecer variable” | Asigna un valor a una variable de automatización. |
| “Webhook” | La opción permanece visible, pero no se implementa la ejecución de la acción. Actualmente no puede enviar una solicitud. |

Introduzca un ID único, un nombre y los parámetros específicos del tipo. Establezca un retraso o "Ejecución asíncrona" si es necesario. Una acción asincrónica continúa en segundo plano; verifique su resultado final a través de registros, variables o el dispositivo de destino.

- CLI: introduzca el comando. Puede añadir una variable de resultado y un tiempo de espera.
- SSH: elija un host y un comando configurados y verifique la vista previa.
- LED: seleccione el dispositivo y una operación compatible de color, efecto, brillo, texto, imagen, código QR o filtro.
- Registro: seleccione el nivel y el mensaje. El mensaje puede hacer referencia a variables.
- Establecer variable: ingrese el nombre y el valor de la variable.
- Webhook: Actualmente no disponible. Elija una acción admitida en su lugar. Los paquetes de reglas que contienen acciones Webhook tampoco se pueden importar.

“Test” ejecuta la acción. Verifique el efecto de las operaciones de encendido, reinicio, comando remoto o solicitud externa antes de realizar la prueba. Un mensaje en cola significa que la tarea fue aceptada, no que se realizó correctamente. Verifique los registros del sistema y también el dispositivo de destino.

Después de editar, guarde y verifique los parámetros. Si no se puede guardar, conserve el borrador y corrija el problema informado. Las importaciones pueden reemplazar las plantillas; revise el impacto de la eliminación antes de eliminar uno. Si falta una imagen o fuente, inserte la tarjeta SD original o seleccione un recurso disponible. La copia de seguridad de emergencia no guarda estos archivos.

#### Eliminar configuración y manejar sus enlaces

Eliminar una regla, plantilla, comando SSH, host, fuente o variable de usuario puede afectar otras configuraciones. Guarde primero una copia de seguridad de emergencia si la necesita. La eliminación no se puede deshacer de la página.

1. Seleccione eliminar en la lista correspondiente. Revise el nombre del objetivo y los elementos afectados.
2. Confirme la eliminación si no hay enlaces. De lo contrario, elija un reemplazo disponible o “Unlink and disable affected rules”.
3. Actualiza la lista después. Confirme la eliminación y verifique las plantillas, reglas y estados de habilitación vinculados.

Al desvincular una plantilla eliminada se elimina su acción de las reglas afectadas y se desactivan esas reglas. Al eliminar un comando SSH, las plantillas vinculadas quedan como borradores deshabilitados con la referencia del comando borrada; las reglas afectadas están desvinculadas y deshabilitadas. Antes de elegir un reemplazo, verifique su objetivo, acción y datos, no solo un nombre similar. Si el reemplazo no puede proporcionar los datos requeridos, la configuración relacionada se puede desactivar y conservar para editarla.

Al eliminar un host, revise también los comandos y fuentes afectados. Un comando sin un host no se puede ejecutar. Edítelo para elegir un host válido y luego verifique las plantillas y reglas relacionadas antes de habilitarlo. Eliminar la configuración del host local es independiente de revocar una clave pública remota; consulte la Guía de seguridad.

Después de la eliminación, la página informa por separado los elementos eliminados, deshabilitados y vinculados nuevamente. Consulta la lista real. Manejar enlaces no significa que todos los elementos relacionados hayan sido eliminados o estén listos para ejecutarse.

#### Utilice Forzar eliminación cuando sea necesario

Si no se puede completar la eliminación normal, seleccione “Force delete”, lea la explicación y confirme. Se elimina el elemento, se desvinculan las referencias que se puedan identificar y se desactivan las reglas afectadas. Los servicios remotos en segundo plano no se detienen.

Si no se puede determinar todo el alcance, la página le pedirá marcar “I agree to pause automation and continue deleting”. La automatización permanecerá en pausa después de la eliminación. Revise y repare la configuración restante y, después, seleccione “Enable automation” en “Configuration & backup”. Reiniciar el dispositivo no reanuda la automatización.

Si la configuración cambia durante la confirmación, seleccione “Review deletion impact”, revise la nueva lista y confirme de nuevo. La eliminación forzada no garantiza que se complete si falla la escritura en el almacenamiento. Vuelva a consultar la lista: que una tarjeta desaparezca no demuestra que la eliminación se haya guardado.

#### Crear una regla

1. Seleccione "Agregar" en "Reglas" e ingrese una identificación, nombre e ícono únicos.
2. Seleccione “Logic”: AND requiere que se cumplan todas las condiciones; OR requiere que se cumpla al menos una.
3. Establece el tiempo de reutilización para activadores automáticos. Los valores están en ms; 1000 ms equivale a 1 segundo.
4. Agregue condiciones y elija una variable, comparación y valor. Las comparaciones incluyen igual, no igual, mayor que, mayor o igual, menor que, menor o igual, valor cambiado y contiene. Haga coincidir el tipo de valor con la variable.
5. Agregue plantillas y establezca retrasos de acción, repeticiones y condiciones a nivel de acción.
6. Configure "Mostrar en panel" y "Permitir activación manual". El primero controla la visibilidad de la tarjeta en el Sistema; el segundo controla la ejecución manual.
7. Revise, guarde y luego habilite la regla. Deje desactivado "Habilitar inmediatamente" mientras lo configura por primera vez.

Guardar, habilitar o deshabilitar una regla actualiza la configuración actual sin reiniciar. Si la automatización está en pausa, el guardado no la reanuda. Actualiza la lista y comprueba el resultado. Actualice la copia de seguridad de emergencia después de cambios importantes, como se describe en el Capítulo 13.

Los fallos temporales de inicio automático se reintentan cada 30 segundos durante un máximo de 360 segundos. Un resultado no confirmado se verifica antes de otro lanzamiento. Los reintentos en ese intento continúan desde el paso de inicio en segundo plano inacabado; Los pasos anteriores completados no se repiten. Si la página dice que dejó de intentarlo o que la espera terminó, siga el mensaje antes de decidir si desea comenzar manualmente. Los fallos manuales no se reintentan automáticamente.

Cambiar la configuración relacionada permite volver a intentar una operación fallida. Las operaciones que terminaron bien siguen el intervalo de espera normal. Este intervalo limita los disparos automáticos, pero no es lo único que hay que comprobar tras un fallo.

<!-- operational-note -->
Puede guardar hasta 64 reglas. Esto no es garantía de que se puedan ejecutar 64 tareas a la vez. La longitud del comando y la cantidad de condiciones y acciones también afectan el almacenamiento y la memoria. Si la capacidad es insuficiente, elimine la configuración innecesaria o reduzca su contenido antes de guardarla.

<!-- operational-note -->
Haga coincidir el valor con el tipo seleccionado. Para un número, ingrese un valor específico, no infinito o NaN (un número no válido). Ingrese texto, un valor booleano (verdadero o falso) o nulo para los otros tipos. No ingrese un objeto o matriz JSON completo. Si la página informa un error, verifique la variable, la comparación y el valor antes de guardar nuevamente.

#### Configurar condiciones de repetición y acción

| Propósito de | Significado |
| --- | --- |
| “Una vez” | Se ejecuta una vez por activador. |
| “Repetir mientras sea cierto” | Se repite mientras se mantiene la condición de la acción, hasta 100 veces por ejecución. |
| “Recuento fijo” | Se repite para el conteo e intervalo configurados, verificando la condición de la acción antes de cada ejecución. |

Las condiciones de acción son independientes de las condiciones de activación de reglas. Sin una condición de acción, "Repetir mientras sea verdadero" continúa hasta el límite por ejecución. La regla puede desencadenar otra ejecución más adelante.

Deshabilitar una regla evita nuevos desencadenantes; una ejecución ya iniciada puede continuar. Para dejar de programar acciones posteriores, seleccione el control “Parar” del motor y espere la confirmación. Verifique las acciones ya enviadas y los procesos remotos por separado. Las operaciones completadas no se deshacen.

#### Crear una acción rápida

“Solo activación manual”, “Mostrar en panel” y “Permitir activación manual” controlan si una regla se ejecuta solo manualmente, si su tarjeta está visible y si los usuarios pueden ejecutarla.

1. Ingrese el ID, el nombre y el ícono, luego habilite "Solo disparo manual". Una regla de este tipo no necesita condiciones de activación automática.
2. Agregue plantillas y revise retrasos, repeticiones y condiciones de acción.
3. Habilite “Mostrar en panel” y “Permitir activación manual”, luego guarde y habilite la regla.
4. Regrese al Panel de dispositivos del sistema. Verifique el nombre y el estado de la tarjeta, ejecútela una vez y revise el resultado.

Las reglas automáticas también pueden aparecer en el panel. Mostrar una tarjeta no convierte la regla en manual. Una regla desactivada puede seguir visible, pero no iniciarse. Use nombres que expliquen el efecto de la acción. Para tareas SSH en segundo plano, admin puede consultar los registros y detenerlas desde la tarjeta; cambiar la configuración sigue correspondiendo a root. Root también puede consultar registros, verificar estados y detener servicios desde «Registros de ejecución».

#### Importar un paquete de configuración de reglas

Importe paquetes de reglas en Automatización, no a través del “Verify Only” de Seguridad o la carga de archivos. Este control verifica el firmante, el dispositivo de destino y la configuración requerida. Verificar cada paquete a través de su propio control de importación; el resultado de otro paquete no se aplica.

Antes de importar, prepare:

- Confirme si la tarjeta SD o la configuración de emergencia interna está en uso y si se puede guardar. Consulte el Capítulo 13.
- El dispositivo tiene un certificado válido, su clave privada correspondiente y una cadena de CA; su tiempo está verificado. Una cadena de CA verifica los orígenes de los certificados. Consulte la Guía de seguridad para conocer los pasos de instalación.
- El administrador de la implementación ha seleccionado un firmante de confianza. Root iniciar sesión o instalar certificados HTTPS no completa esta configuración. Pídale al administrador de implementación que lo configure si falta.
- Las plantillas, los comandos y los hosts de la regla están listos. Importar no los instala por usted. Agregue primero cualquier configuración que falte. Si la regla está habilitada, verifique también el estado de habilitación de la configuración que utiliza.

Guardar una importación actualiza la configuración actual sin reiniciar. Antes de confirmar, verifique el estado de habilitación, las condiciones, las acciones y los objetivos, y confirme que la ejecución sea segura. Se mantiene una pausa de configuración existente. Para evitar la ejecución, deshabilite primero la automatización o solicite al proveedor una versión deshabilitada.

1. Seleccione el icono de importación en “Rules” para abrir “Import Rule Configuration” y luego elija el archivo `.tscfg`. La verificación comienza y la página muestra una vista previa.
2. Espere a que “Signing trust, target device and rule content verified”. verifique el nombre, el ID de la regla y “Rule summary”. Expanda “View rule content” para revisar las condiciones, las acciones, los objetivos y el estado de habilitación; no confíe en el nombre del archivo.
3. Si existe la misma identificación, revise qué se reemplazará. Seleccione “Overwrite existing configuration” solo si desea reemplazarlo. Si el archivo, las credenciales o la configuración cambian después de la vista previa, seleccione “Check package again”. Cierre y vuelva a abrir el editor si la página se lo solicita; después, vuelva a comprobarlo.
4. Seleccione “Confirm Import” y espere el resultado de guardar. Consulte la lista de reglas, el estado de habilitación y las variables requeridas. Un guardado exitoso no demuestra una ejecución exitosa de la tarea.
5. Si la regla permite una verificación manual segura, ejecútela una vez y verifique el dispositivo o host. Para conocer otras reglas, observe los registros y los resultados después de una activación normal. Para borrar una pausa de configuración, revise la configuración antes de seleccionar “Enable automation”.

Las reglas importadas se pueden editar, habilitar, deshabilitar y eliminar. Verifique la configuración actual después de las ediciones y actualice la copia de seguridad de emergencia si es necesario. Una importación posterior aún requiere verificación de firma; el permiso para editar localmente no lo omite.

Es posible que un certificado destinado únicamente a HTTPS no autorice la firma de la configuración. Una exportación local exitosa aún puede ser rechazada en el momento de la importación. Solicite al proveedor que resuelva el problema del propósito del certificado; no desactive la verificación ni repita la importación.

Importar y editar no deshace las acciones terminadas ni detiene los procesos remotos en segundo plano. Si necesita terminarlos, hágalo desde «Registros de ejecución» y confirme el resultado.

#### Si la importación no se completa

##### Verificación fallida

| Mensaje o problema | Siguiente paso |
| --- | --- |
| Firma root no seleccionada, firmante no confiable o firmante no autorizado | Solicite al administrador de implementación o al proveedor de configuración que verifique el origen de la firma y los permisos del certificado. No sustituya el “Verify Only” de Security ni desactive la verificación. |
| El paquete apunta a otro dispositivo | Pídale al proveedor que lo exporte utilizando el certificado de este dispositivo; no cambie el nombre dentro del paquete. Organice paquetes de reemplazo coincidentes antes de cambiar también el certificado de este dispositivo. |
| La hora del dispositivo no está verificada | Verifique y sincronice la hora en “Network & Time” en Sistema, luego verifique el archivo nuevamente. |
| Carga de configuración | Espere a que termine y luego verifique el paquete nuevamente. |
| La configuración no se pudo cargar | Verifique los registros del sistema, resuelva la causa y restaure la configuración antes de volver a verificar. |
| Falta la configuración requerida | Agregue la plantilla, el comando o el host nombrado por la página y luego verifique nuevamente. |
| Configuración requerida deshabilitada | Compruebe si debería estar habilitado. Una vez que sea seguro ejecutarlo, habilítelo y verifique nuevamente. |
| Acción no admitida | Pídale al proveedor que revise el paquete. La importación de paquetes de reglas actualmente rechaza las acciones de Webhook; su presencia en el selector de plantillas no significa que el paquete pueda importarse. |
| Archivo, credenciales o configuración cambiados después de la vista previa | Seleccione “Check package again”. Vuelva a abrir el editor o seleccione el archivo según las instrucciones, luego revise y confirme. |

##### Guardar incompleto

| Mensaje o problema | Siguiente paso |
| --- | --- |
| Almacenamiento actual no disponible o lleno | Verifique la ubicación en “Configuration & backup”. Resuelva el problema de almacenamiento o reduzca el contenido innecesario, luego verifique nuevamente. |
| La configuración actual o la ubicación de guardado cambiaron | Guarde y copie el borrador. Vuelva a abrir el editor, revise la configuración más reciente y envíela nuevamente. No pulse guardar repetidamente. |
| Guardar resultado sin confirmar | Actualice y verifique el contenido de la regla y habilite el estado. Si aún no está claro, inspeccione los registros del sistema. Conserve el paquete original y no repita la importación. |

A una variable de condición sin una muestra no necesariamente le falta configuración; compruebe cuándo se actualizará. Si no se puede leer la configuración, conserve los archivos originales y verifique los registros del sistema. No sobrescriba el contenido dañado como si estuviera vacío.

#### Mantener reglas y configuración

- La ejecución manual requiere una regla habilitada que permita activadores manuales, sin que ninguna ejecución de la misma regla esté en curso. Omite las condiciones de activación automática y el tiempo de reutilización, pero aún aplica condiciones de acción, retrasos y repeticiones.
- La desactivación no deshace las acciones completadas. La eliminación no se puede deshacer de la página.
- Antes de editar fuentes, plantillas o comandos, verifique qué reglas los utilizan. Las ediciones de configuración no detienen las tareas remotas existentes. Verifique y detenga esas tareas por separado si es necesario.
- Importe cada paquete a través de su lista relevante y revise la vista previa. Consulte la Guía de seguridad para conocer todos los procedimientos de firma y cuenta.
- Si no se puede guardar, lea el mensaje y conserve el borrador. Si el guardado se realizó correctamente pero la actualización falló, actualice y verifique la lista antes de crear otro elemento.

### 13. Configuración y copia de seguridad

<!-- operational-note -->
Seleccione “Configuration & backup” en Automatización. Verifique “Currently using” antes de guardar, restaurar o elegir una configuración. Primero revise cualquier efecto sobre el enfriamiento, las alertas o las tareas remotas.

Mientras usa la tarjeta SD, busque "Guardar configuración actual" y "Restaurar configuración guardada" en el grupo de respaldo de emergencia. Siga los pasos a continuación para seleccionar "Guardar copia de seguridad de emergencia" o "Restaurar copia de seguridad de emergencia". El grupo "Tarjeta SD y automatización" contiene comprobaciones de tarjetas y controles de habilitación de automatización. Guardar una copia no cambia las configuraciones.

#### Distinga los tres tipos de contenido

| Contenido | como se salva |
| --- | --- |
| Configuraciones del sistema como redes, ventiladores, temperatura e iluminación. | Guardado dentro del dispositivo. Una restauración de copia de seguridad de Automatización no los cambia. |
| Configuración de automatización actual | Las adiciones, ediciones y eliminaciones van a la tarjeta SD durante el uso normal de SD, o al almacenamiento interno en modo de emergencia. |
| Respaldo de emergencia interno | Mientras usa la tarjeta SD, se actualiza solo cuando selecciona “Save emergency backup”. Las ediciones en modo de emergencia actualizan esta configuración interna directamente. |

La copia de seguridad de emergencia guarda juntas reglas, plantillas de acción, comandos SSH, hosts asociados, fuentes y definiciones iniciales de variables de usuario. No guarda claves privadas, imágenes, fuentes, registros ni estados de ejecución remota. La configuración del host sólo recuerda qué clave usar; la clave en sí no se copia.

Esta no es una copia de seguridad completa del dispositivo. Mantenga archivos y claves importantes a través de sus propios métodos de copia de seguridad. Una restauración no significa que los servicios remotos se hayan detenido o que todos los archivos necesarios para una regla estén disponibles.

#### Guardar una copia de seguridad de emergencia

1. Confirme que “Currently using” muestre “SD card configuration” y luego revise las reglas y tareas actuales.
2. Seleccione “Save emergency backup” y espere a que finalice.
3. Verifique “Last internal save” y “Backup status”. “Includes the current changes” significa que la copia interna coincide con la configuración actual.

Guardar reemplaza la copia de seguridad de emergencia anterior. Las ediciones posteriores de la tarjeta SD no la actualizan. Si no incluye los últimos cambios, revise el contenido actual antes de decidir si desea guardarlo nuevamente.

Mientras se utiliza “Internal emergency configuration”, las ediciones se guardan internamente. No es necesario que vuelva a seleccionar “Save emergency backup”.

#### Restaurar una copia de seguridad de emergencia

Una restauración reemplaza la configuración actual de la tarjeta SD con la copia interna, que puede ser más antigua. Exporte primero cualquier configuración y archivos actuales que necesite. No guarde primero una copia de seguridad de emergencia; eso sobrescribiría la copia anterior que desea restaurar.

1. Mientras usa la configuración de la tarjeta SD, seleccione “Restore emergency backup”.
2. Revise los elementos agregados, modificados y eliminados, y si la automatización permanecerá en pausa.
3. Confirme y espere a que finalice. Las listas se actualizan sin reiniciar el dispositivo.
4. Verifique reglas, hosts, variables, estados de habilitación y resultados de tareas. Si aún está en pausa, revise la configuración antes de seleccionar “Enable automation”.

Una restauración no cambia las redes, los ventiladores ni las claves. No termina de ejecutar servicios remotos. Administrelos desde "Registros de ejecución" si es necesario.

#### Cuando no hay disponible ninguna tarjeta SD utilizable

Si existe una configuración interna utilizable, el dispositivo cambia a ella. Las reglas automáticas habilitadas siguen sus condiciones; Las reglas manuales todavía necesitan un clic. La copia interna puede ser más antigua, así que verifique qué tareas pueden ejecutarse antes de un cambio planificado.

El modo de emergencia permite adiciones, ediciones y eliminaciones. Los guardados van directamente al almacenamiento interno. Si no existe ninguna configuración interna utilizable, lea primero el motivo. Puede comenzar con una nueva configuración válida, pero no sobrescriba los archivos dañados como si estuvieran vacíos.

Las redes, los ventiladores y otras configuraciones del sistema aún se cargan desde el almacenamiento interno. La configuración de emergencia no restaura las imágenes, fuentes o registros de la tarjeta SD. Inserte la tarjeta original o seleccione los archivos disponibles si faltan recursos. La falta de una tarjeta no significa que todas las funciones se detengan o que todas las tareas puedan continuar.

#### Elija una configuración después de reinsertar la tarjeta

Inserte una tarjeta SD utilizable y seleccione “Check SD card”, luego revise las dos opciones siguientes. La inserción no cambia ni fusiona configuraciones. Cierre el panel para seguir usando la configuración interna. Reiniciar no toma la decisión por usted.

| Botón | que pasa |
| --- | --- |
| “Use SD card configuration” | Lee y cambia a la configuración de la tarjeta. La configuración interna se conserva, no se copia en la tarjeta. |
| “Save current configuration to SD card and use it” | Reemplaza la configuración de la tarjeta con la configuración interna actual y luego cambia a la tarjeta. Se sobrescribe la configuración anterior de la tarjeta. |

1. Verifique la ubicación actual y decida qué configuración conservar.
2. Seleccione el botón correspondiente y revise el aviso de reemplazo y estado de habilitación. Antes de escribir en la tarjeta, verifique los elementos agregados, modificados y eliminados.
3. Confirme y espere. Verifique que “Currently using” muestre “SD card configuration” y luego revise las listas y los resultados de las tareas.

La configuración de tarjeta faltante o vacía no se completa automáticamente desde el almacenamiento interno. Confirme que lo que desea es una configuración vacía antes de elegirla. Si la tarjeta o la configuración cambian después de la vista previa, verifique nuevamente según las instrucciones; no reutilice la confirmación anterior.

#### Distinguir los resultados de guardar, cambiar y ejecutar

| Mensaje o situación | Siguiente paso |
| --- | --- |
| Guardado en la tarjeta SD, pero no cambiado | La configuración interna todavía está en uso. Seleccione “Use SD card configuration” para finalizar el cambio. No sobrescriba la tarjeta nuevamente. |
| Configuración guardada, automatización aún en pausa | Revise la configuración y seleccione “Enable automation”. No vuelva a guardar ni confíe en un reinicio para quitar la pausa. |
| Eliminación no guardada, automatización en pausa | Compruebe si el objetivo todavía está presente y si hay almacenamiento disponible. Repare y revise la configuración antes de decidir si habilitarla. |
| Guardar resultado sin confirmar | Lea la ubicación y el contenido nuevamente. Verifique los registros del sistema si es necesario. No vuelva a enviar el mismo cambio sin comprobarlo. |
| La entrada actual difiere de la última configuración | Copie cualquier borrador que necesite antes de cerrar y volver a abrir el editor. Revise el contenido más reciente e ingrese sus ediciones. La página no fusiona borradores por usted. |

Después de un cambio, restauración o guardado exitosos, verifique si las tareas pueden ejecutarse y si finalizan. Se mantiene una pausa de configuración; revise y seleccione “Enable automation” para continuar. Una pausa causada por “Disable automation” o una eliminación forzada no se borra reiniciando o cambiando las configuraciones.
