# TianshanOS

Esta guía cubre comprobaciones del sistema, controles de dispositivos, redes, archivos y actualizaciones de firmware para la cuenta admin. La Guía de operaciones raíz cubre el acceso al terminal, los comandos remotos y la configuración de automatización. Consulte la Guía de seguridad separada para conocer la gestión de la seguridad.

Versión cubierta: 0.6.4. Revisado el 3 de noviembre de 2026.

Utilice los controles que se muestran en su dispositivo. Algunos necesitan hardware o configuración específicos. En una computadora, coloque el cursor sobre un botón con un ícono para ver su nombre. En un teléfono, deslícese dentro de una tabla amplia para ver sus otras columnas.

## 1. Empezando

### Abra la interfaz de usuario web

1. Abra la interfaz web del dispositivo (WebUI) utilizando la dirección proporcionada por su administrador.
2. Seleccione "Iniciar sesión" en la esquina superior derecha.
3. Mantenga `admin` como nombre de usuario e ingrese la contraseña admin proporcionada con el dispositivo.
4. Seleccione "Iniciar sesión". Después de iniciar sesión correctamente, el nombre de usuario actual aparece en la esquina superior derecha.

Al iniciar sesión con la contraseña predeterminada se abre un "Recordatorio de seguridad". Ingrese la contraseña actual, luego ingrese la nueva contraseña dos veces y seleccione "Cambiar ahora". Ambas entradas de nueva contraseña deben coincidir. Seleccione "Más tarde" para cerrar el recordatorio.

Cuando haya terminado, seleccione "Cerrar sesión" en la esquina superior derecha. Deberá iniciar sesión nuevamente para usar el dispositivo.

Si se le niega el permiso, verifique la cuenta. Si el inicio de sesión ha caducado, inicie sesión nuevamente. Luego verifique el resultado de la operación anterior. Iniciar sesión no repite una tarea anterior. No cargue, elimine ni actualice de nuevo inmediatamente.

### Cambiar idioma

Seleccione el botón de idioma en la parte superior de la página, luego elija chino o inglés. El contenido de la página y las etiquetas de control cambian inmediatamente.

### Navegación por las páginas

Las páginas principales de admin son:

- “Sistema”: vea el estado del dispositivo, los módulos de control, los ventiladores y los LED, y abra la actualización OTA.
- “Red”: Verifique el estado de Ethernet y los clientes DHCP, configure WiFi y administre el reenvío de NAT.
- “Archivos”: Administre archivos en la tarjeta SD y SPIFFS.
- “Seguridad”: abra la página de administración de seguridad separada. Consulte la Guía de seguridad para obtener instrucciones.

## 2. Estado del sistema y operaciones de rutina

Seleccione "Sistema" en la navegación superior.

### Ver el estado de los recursos y servicios

“Recursos del chip de administración” muestra el uso de CPU, DRAM y PSRAM en el chip de administración. Estas lecturas no muestran el uso de recursos en la equipo de inferencia o en la equipo de aplicaciones.

- Seleccione "Detalles" para ver la memoria total, utilizada y libre y otra información de la memoria.
- Los valores marcados como "estimados" en los detalles de la memoria son solo como referencia. Si aparece una advertencia, conserve la información de la página y siga sus instrucciones.
- “Servicios” muestra el número de servicios en ejecución y el total. Selecciónelo para ver el estado y la etapa de inicio de cada servicio.
- Si un servicio informa un problema, actualice su estado. Para reiniciarlo, siga "Reiniciar un servicio" a continuación.

### Ver información del sistema y de energía

«Vista general del sistema» muestra el chip, la versión del firmware, la versión de ESP-IDF y el tiempo de funcionamiento. Para el uso diario, compruebe la versión del firmware. ESP-IDF es el marco de software que utiliza el dispositivo.

El lado derecho de la tarjeta muestra el voltaje de entrada, el voltaje interno, la corriente, la potencia y el estado de protección.

Las configuraciones del sistema, como redes, ventiladores, temperatura e iluminación, se guardan dentro del dispositivo. Insertar una tarjeta SD antigua no los restaura. La configuración de la automatización se gestiona por separado; su copia de seguridad de emergencia no es una copia de seguridad completa del dispositivo.

El interruptor al lado del estado de protección habilita o deshabilita la protección de bajo voltaje. Cuando está habilitado, el dispositivo utiliza los voltajes y retrasos guardados para apagarse a bajo voltaje y reiniciarse después de que se recupera la energía.

### Ver red y hora

“Red y hora” muestra Ethernet, WiFi, dirección IP, hora actual, estado de sincronización, fuente horaria y zona horaria.

- Seleccione “Sincronizar hora” para copiar la hora actual del navegador al dispositivo.
- Seleccione "Zona horaria", elija un ajuste preestablecido o ingrese una configuración de zona horaria compatible, luego guarde.
- Seleccione “Actualización OTA” para abrir la página de actualización del firmware.

### Operaciones avanzadas

#### Reiniciar TianshanOS

Un reinicio interrumpe temporalmente la WebUI y la administración del dispositivo. Finalice las operaciones activas, luego seleccione "Reiniciar" y confirme. Espere a que el dispositivo se recupere y luego vuelva a abrir la WebUI.

#### Reiniciar un servicio

Reiniciar un servicio interrumpe temporalmente la función que proporciona. Abra "Estado del servicio", busque el servicio afectado y seleccione "Reiniciar" en esa fila. Verifique su estado nuevamente cuando finalice la operación.

#### Cambiar configuración de apagado

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

#### Cambia el objetivo superior USB

Cambiar el objetivo USB puede desconectar temporalmente un dispositivo conectado. Confirme el objetivo y finalice el trabajo activo antes de continuar.

Los dispositivos que admiten conmutación USB muestran un botón "USB". Cada clic cambia el puerto USB superior al siguiente objetivo: ESP, Equipo de inferencia y luego Equipo de aplicaciones. "Desconectado" significa que no hay ningún objetivo conectado. Verifique el objetivo que se muestra en el botón y el mensaje de la página para confirmar el resultado.

## 3. Panel de dispositivos

El "Panel de dispositivos" está en la página "Sistema". Contiene controles de energía del módulo, acciones rápidas y widgets de datos.

### Controlar la equipo de inferencia y la equipo de aplicaciones

«Equipo de inferencia» es el nombre que sustituye a AGX en la pantalla; «Equipo de aplicaciones» sustituye a LPMU. Los identificadores y comandos pueden seguir usando `agx` y `lpmu`. No cambie esos identificadores por su cuenta.

Guarde el trabajo en el módulo y complete su proceso de apagado normal antes de desconectar la alimentación. El apagado forzado puede provocar la pérdida de datos no guardados.

- «Alimentación del equipo de inferencia» muestra el estado del control de alimentación. Seleccione el botón para encenderlo o apagarlo y espere la confirmación.
- En «Alimentación del equipo de aplicaciones», «Accesible por red» y «No accesible por red» indican si hay acceso a través de la red. Si falla la comprobación, el estado de alimentación sigue sin conocerse. Estos resultados no confirman por sí solos si el equipo está encendido o apagado.
- Seleccionar el botón Equipo de aplicaciones desencadena la misma acción que presionar su botón de encendido físico. Espere la verificación y el resultado mostrado. Si desconoce el resultado, verifique la equipo y la red antes de presionar el botón nuevamente.

### Usar acciones rápidas

Un usuario root configura las tarjetas de acciones rápidas. Mostrar una tarjeta y permitir su ejecución manual son ajustes distintos. Una tarjeta visible puede no permitir iniciar la tarea.

1. Lea el nombre de la tarjeta y la descripción para identificar la tarea.
2. Seleccione “Inicio” o la tarjeta y lea el resultado. No lo inicie nuevamente mientras procesa.
3. Un mensaje ejecutado o en cola aún necesita una verificación de resultados real en el dispositivo o tarea de destino. Si se muestra un estado de servicio, distinga "Proceso en ejecución" de "Listo". Una tarjeta con varias tareas puede mostrar "Algunas tareas no están listas".

Las tarjetas con tareas remotas en segundo plano también ofrecen "Ver registro" y "Detener". Abra los registros para revisar las tareas relacionadas. Si aparecen varios registros, elija por nombre de tarea y host original. Verifique el objetivo antes de detenerlo, espere el resultado y luego verifique que se detuvo. Cerrar el registro o detener las actualizaciones del registro no detiene la tarea.

«Registros de ejecución» puede incluir tareas iniciadas antes. Que aparezcan no significa que sigan en ejecución. Seleccione «Verificar estado remoto» cuando sea necesario. admin puede entrar desde la tarjeta correspondiente; el botón independiente de Sistema solo se muestra a root. Si no puede usar un control o el resultado sigue sin estar claro, pida a root que lo compruebe.

Si no puede iniciar la tarea, siga las indicaciones del mensaje. No pulse Inicio repetidamente:

- Regla deshabilitada o activación manual no permitida: solicite a un usuario de root que verifique la configuración de la regla. Una tarjeta visible no es permiso para ejecutarla.
- Una tarea u operación en segundo plano está en progreso: espere su resultado. No lo empieces de nuevo.
- Ya existe un registro de ejecución para la tarea: verifique el estado y los registros de la tarea original en lugar de iniciarla nuevamente. Si necesita finalizar, deténgase y verifíquelo. Pídale a un usuario root que verifique si no puede resolverlo.
- Configuración no cargada, falta un elemento requerido o automatización en pausa: solicite a un usuario de root que verifique la configuración y habilite el estado.

Si la página informa un inicio automático o una espera de reintento, déjela continuar. Los fallos de inicio temporales se reintentan cada 30 segundos durante un máximo de 6 minutos. Un inicio no confirmado se verifica antes de otro lanzamiento. Una ejecución manual fallida no se repite automáticamente. Cuando termine la espera, verifique el dispositivo y la red como se indica antes de decidir si desea seleccionar "Iniciar".

<!-- operational-note -->
Después de activar una acción, espere unos segundos antes de iniciar otra. Cerrar la página, eliminar una tarjeta o reiniciar TianshanOS no detiene los servicios en segundo plano en los hosts remotos. Para mantener un servicio detenido, solicite a un usuario root que desactive cualquier regla automática que pueda iniciarlo nuevamente.

Mantenga presionada una tarjeta hasta que aparezca el indicador de reorden, luego arrástrela para cambiar el orden de visualización.

Si no aparecen tarjetas, lea la explicación. Espere si se está cargando la configuración. Si la carga falla, conserve el motivo y comuníquese con un usuario de root. Si no se configuran acciones rápidas, solicite a un usuario de root que verifique la configuración de las reglas “Show on panel”.

<!-- operational-note -->
Editar o importar una regla actualiza la configuración actual; No es necesario reiniciar para cambiar las reglas. Si se cambió la tarea de una tarjeta, solicite a un usuario root que confirme su contenido antes de ejecutarla.

No reinicie un dispositivo que proporciona servicios activos solo para restaurar una tarjeta.

### Administrar widgets de datos

Los widgets de datos muestran los datos del dispositivo en el «Panel de dispositivos» y los actualizan durante el uso.

1. Seleccione "Administrador de widgets".
2. Elija un intervalo de actualización o desactive la actualización automática.
3. Agregue un widget preestablecido o elija un estilo de componente y fuente de datos ofrecidos por la página.
4. Edite su etiqueta, estilo de visualización y unidad según sea necesario y luego guárdelo.

Los widgets existentes se pueden editar, eliminar y reordenar. También puede seleccionar una tarjeta de widget para editarla. Mantenga presionado un widget y luego arrástrelo a una nueva posición.

«Pequeño», «Mediano» y «Grande» ocupan una, dos y tres columnas, y se adaptan a las pantallas estrechas. Al editar un icono, escriba su nombre siguiendo el ejemplo. En un widget de dos valores, cada uno tiene su propio origen de datos. Compruebe ambos orígenes y que los valores se actualicen.

"Error al cargar los widgets de datos" no significa que no exista ninguna configuración. Resuelva la causa y léala nuevamente. Si el guardado falla o su resultado no está confirmado, mantenga el contenido actual y verifique el mensaje. Ver sus cambios en la página no confirma que se hayan guardado.

## 4. Gestión de ventiladores

<!-- operational-note -->
"Control del ventilador" está en la página "Sistema". Las tarjetas de fans muestran los fans proporcionados por su dispositivo. Verifique el número del ventilador antes de cambiar una curva.

### Ver estado del ventilador

La barra de estado muestra «Temperatura efectiva» y «Salida actual». El porcentaje grande es el ajuste de regulación confirmado por el dispositivo, no la velocidad medida. RPM indica las revoluciones por minuto medidas y no aparece si no hay una lectura válida. Si el porcentaje muestra `--`, la salida actual no está confirmada.

Al mover el deslizador manual, el valor situado a su lado muestra el ajuste que va a solicitar. El porcentaje grande sigue mostrando la salida actual. Suelte el deslizador y compruebe el mensaje y el valor actualizado. Si el valor solicitado no coincide con la salida actual, no dé el ajuste por aplicado.

El modo inteligente muestra su estado: «Modo inteligente», «Siguiendo la curva», protección o temperatura no válida. También muestra la temperatura de referencia de seguridad, la prevista dentro de 45 segundos y la velocidad de cambio de temperatura.

Si la temperatura deja de ser válida, verifique que su fuente aún se esté actualizando. El dispositivo cambia al control de protección en caso de pérdida de temperatura. Seleccione “TTI” para obtener una explicación del control térmico inteligente.

Utilice el botón de actualización en el encabezado de la sección para obtener el estado actual. Si el ajuste falla o la salida no está confirmada, verifique el dispositivo antes de decidir si desea volver a intentarlo.

### Seleccione un modo de funcionamiento

| Propósito de | Función |
| --- | --- |
| “Apagado” | Detiene el ventilador. |
| “Manual” | Utiliza un porcentaje de control fijo establecido con el control deslizante 0-100%. |
| “Curva” | Sigue la curva de porcentaje de temperatura a control configurada. |
| “inteligente” | Utiliza la curva base, las tendencias de temperatura y los ajustes anteriores para controlar el enfriamiento. Utiliza control protector cuando es necesario. |

Detener un ventilador o establecer un valor manual bajo reduce la refrigeración. Primero verifique la carga y la temperatura y siga monitoreándolas. El control deslizante solo está disponible en el modo Manual cuando se confirma la salida actual.

### Configurar una curva de ventilador

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

### Importar y exportar una curva

- Seleccione "Importar configuración" y elija un archivo de curva JSON. JSON es el formato de archivo utilizado para almacenar datos de curvas. Revise los nodos, los límites y el número de ventilador, luego seleccione "Guardar curva" para aplicarlos.
- Seleccione "Exportar configuración" para descargar la curva actual. La página también intenta guardar una copia en `/sdcard/config` en la tarjeta SD. Verifique la descarga del navegador y el resultado informado de la tarjeta SD por separado.

### Utilice una temperatura de prueba

Una temperatura de prueba reemplaza temporalmente la fuente normal y afecta el control Curve o Smart. Supervise el ventilador y el dispositivo durante toda la prueba.

1. Ingrese 0-100°C en "Temperatura de prueba".
2. Seleccione "Prueba" y observe la salida actual, el estado y la respuesta del ventilador.
3. Al terminar, seleccione «Borrar prueba». Compruebe que la temperatura efectiva vuelva a obtenerse de la fuente habitual.

## 5. Gestión de LED

“Control LED” está en la página “Sistema” y muestra los LED proporcionados por el dispositivo. Las funciones disponibles varían según el LED.

### Controles habituales

- Utilice el botón de la bombilla en la parte inferior de una tarjeta para encender o apagar el LED.
- Use los controles de brillo, tono y saturación. El brillo regula la intensidad de la luz; el tono elige el color, y la saturación va del blanco al color. Una saturación de 0 da luz blanca. Los cambios de tono y saturación se aplican al soltar el control.
- Utilice el botón de animación para abrir "Configuración de LED". Seleccione una animación en "Animación programática" y luego use su control de reproducción o detención.
- Seleccione el icono de guardar en la parte inferior derecha de la tarjeta para guardar la configuración de LED actual.
- Seleccione "Todo apagado" para apagar todos los LED y verificar el resultado informado. Si algunos fallan, verifique esos dispositivos.

### Funciones avanzadas de la matriz LED

Las tarjetas de la matriz tienen iconos para las funciones disponibles. Abra una función y cambie de grupo en «Ajustes LED»:

- “Animación programática”: seleccione y ejecute una animación.
- “Imagen/Código QR”: elija una imagen o un código QR en “Tipo” en la tarjeta, luego seleccione una imagen de tarjeta SD o ingrese el contenido QR.
- “Visualización de texto”: establece texto, fuente, alineación, desplazamiento, primer plano y fondo.
- “Filtro de posprocesamiento”: elija un filtro y parámetros, luego aplíquelos o deténgalos.
- “Corrección de color”: ajuste la pantalla y utilice los controles de reinicio, importación o exportación disponibles.

Verifique la luz real o la visualización de la matriz después de aplicar un cambio. Utilice únicamente las funciones que se muestran. Si falla una configuración, siga el mensaje para verificar el archivo, la entrada o el estado del dispositivo.

## 6. Gestión de red

<!-- operational-note -->
Seleccione "Red" en la navegación superior para abrir "Configuración de red". Cambiar el modo de red, el punto de acceso o la configuración de NAT puede interrumpir la conexión WebUI actual. Antes de guardar, asegúrese de poder volver a conectarse a través de la nueva dirección de red.

### Ver el estado de la red

La parte superior de la página muestra el estado de Ethernet, el cliente WiFi y el AP WiFi. Abra el panel relacionado para ver la dirección IP, la máscara de subred, la puerta de enlace, DNS, la dirección MAC, SSID, la señal y los recuentos de dispositivos conectados cuando estén disponibles.

El panel Ethernet muestra el enlace actual y la información de la dirección. No proporciona controles de edición de direcciones.

### Seleccione un modo WiFi

| Propósito de | Función |
| --- | --- |
| “Apagado” | Desactiva WiFi. |
| “Estación (STA)” | Conecta el dispositivo a una red WiFi existente. |
| “Punto de acceso (AP)” | Hace que el dispositivo proporcione un punto de acceso WiFi. |
| “STA+AP” | Se conecta a una red WiFi existente mientras mantiene disponible el punto de acceso del dispositivo. |

Después de elegir un modo, espere a que la página actualice el estado. La conexión inalámbrica actual puede interrumpirse durante el cambio.

### Conectar a WiFi

1. Configure el modo WiFi en “Estación (STA)” o “STA+AP”.
2. En "Estación", seleccione "Escanear".
3. Elija una red de la lista. La lista muestra SSID, intensidad de la señal, canal y tipo de autenticación.
4. Introduzca la contraseña y confirme. Deje la contraseña en blanco para una red abierta.
5. Espere a que el estado cambie a "Conectado" y luego confirme la nueva dirección IP.

Seleccione "Desconectar" para finalizar la conexión actual del cliente WiFi.

### Configurar el AP WiFi

1. Configure el modo WiFi en “Punto de acceso (AP)” o “STA+AP”.
2. En "Hotspot", seleccione "Configuración".
3. Introduzca el SSID. Una contraseña en blanco crea un punto de acceso abierto; un punto de acceso protegido requiere al menos caracteres 8.
4. Seleccione un canal y habilite “Ocultar SSID” si es necesario.
5. Seleccione "Aplicar" y espere a que se actualice el estado del punto de acceso.

Seleccione "Dispositivos" para ver los clientes actualmente conectados al punto de acceso.

### Establecer el nombre de host

Ingrese un nuevo nombre en la sección "Nombre de host" en "Servicios de red", luego seleccione "Establecer". La página muestra el nombre de host actual después de actualizarse.

### Ver clientes DHCP

DHCP asigna automáticamente direcciones de red a los dispositivos conectados. Seleccione "Clientes", elija "WiFi AP" o "Ethernet" y vea los arrendamientos actuales. Utilice el botón de actualización para recargar la lista.

### Operaciones de red avanzadas

#### Configurar la puerta de enlace NAT

NAT reenvía el tráfico de red entre las interfaces de red del dispositivo. Habilite o deshabilite NAT, luego seleccione "Guardar" para conservar la configuración. Verifique el estado del WiFi y de Ethernet luego.

#### Acceda a la red ascendente a través de la equipo de aplicaciones

Esta operación utiliza la equipo de aplicaciones configurada para configurar el acceso a la red. En Sistema, primero cambie el USB a "Equipo de aplicaciones" y verifique los cables de red. Su host SSH debe utilizar autenticación de clave y tener una huella digital de host verificada. Pídale a un usuario root que verifique estas configuraciones usando la Guía de seguridad.

Obtenga la contraseña sudo para la cuenta SSH en ese host. Esta contraseña autoriza cambios en el sistema y puede diferir de la contraseña de WebUI.

1. En "Acceso a la red ascendente", seleccione "Acceso a través de la equipo de aplicaciones".
2. Ingrese la contraseña sudo de la equipo de aplicaciones y seleccione el botón de acceso. La contraseña se utiliza sólo para esta ejecución y no se guarda; ingréselo nuevamente para una ejecución posterior.
3. Espere a que finalice la operación. No lo inicie nuevamente mientras procesa.
4. El acceso se confirma solo cuando el resultado informa tanto una conexión a Internet como una configuración de red completa.
5. Después de cerrar la ventana de resultados, seleccione "Ver resultado" para abrirla nuevamente. Si falla o el resultado no está confirmado, lea el motivo y la etapa de falla. Expanda "Registro de ejecución" para obtener más detalles. Verifique la contraseña para ver si hay un error de contraseña, o el cableado y la red ascendente si no se encuentra una conexión a Internet.

Si la huella del host no está confirmada o ha cambiado, pida a root que verifique su identidad. No siga intentando la conexión ni omita la comprobación. La salida del script remoto puede conservar su idioma original; guárdela si hace falta investigar.

Una solicitud de estado fallida no significa que el script se haya detenido. Utilice el control "Actualizar estado" disponible para verificar la ejecución actual antes de decidir si desea volver a intentarlo.

## 7. Gestión de archivos

Seleccione "Archivos" en la navegación superior para abrir el "Administrador de archivos".

La tarjeta SD es un almacenamiento extraíble y SPIFFS es un almacenamiento de archivos interno del dispositivo. Seleccione “Tarjeta SD” o “SPIFFS” para cambiar de ubicación. La ruta en la parte superior muestra su carpeta actual. Seleccione un nombre de carpeta en la ruta para volver a ella.

### Explorar y administrar archivos

- Seleccione un nombre de carpeta para abrirla.
- Seleccione el botón de descarga al lado de un archivo para guardarlo en la ubicación de descarga del navegador.
- Seleccione el botón de cambio de nombre, ingrese un nuevo nombre y confirme.
- Seleccione “Nueva carpeta”, ingrese un nombre de carpeta y créela.
- Seleccione el botón Actualizar para recargar el directorio actual y el estado de almacenamiento.

Subir archivos, eliminarlos, renombrarlos, crear carpetas y montar o desmontar la tarjeta SD requiere una sesión válida. Leer y descargar archivos protegidos de Automatización también requiere permiso root. Si se deniega el acceso a admin, pida a root que use las páginas de configuración. No cambie la ruta ni use otra entrada para eludir los permisos.

### Cargar archivos

Los archivos solo se pueden subir a la tarjeta SD, no a SPIFFS. Compruebe primero que la tarjeta SD esté montada.

1. Seleccione «Tarjeta SD» y abra la carpeta donde desea subir los archivos.
2. Seleccione "Cargar archivos".
3. Seleccione uno o más archivos o arrastre archivos al área de carga.
4. Revise la lista de carga y elimine archivos no deseados.
5. Seleccione "Cargar" y espere a que cada archivo muestre su finalización.

Al subir un paquete `.tscfg`, se abren los pasos de verificación y aplicación. Esta página de archivos todavía no aplica los ajustes del paquete. Que la carga o la verificación se complete no significa que los ajustes estén activos.

Proporciona paquetes de reglas a un usuario de root para importarlos en Automatización. La carga normal de archivos no sustituye a la importación de reglas. Consulte la Guía de seguridad para obtener orientación sobre fuentes y firmas para otros paquetes.

### Operaciones por lotes

Después de seleccionar archivos o carpetas, aparece la barra de herramientas por lotes.

- «Descarga por lotes» descarga los archivos seleccionados. No incluye las carpetas.
- “Eliminar por lotes” elimina los archivos y carpetas seleccionados.
- “Borrar selección” borra la selección actual.

### Eliminar un archivo o carpeta

La eliminación no se puede deshacer en la WebUI. Al eliminar una carpeta también elimina su contenido. Compruebe el nombre y la ruta antes de seleccionar «Eliminar» o «Eliminar por lotes» y confirmar.

Los archivos administrados por Automatización están protegidos. Es posible que se rechace la carga o sobrescritura de archivos en `/sdcard/config/automation`, o la eliminación o cambio de nombre de esa carpeta o de una carpeta principal que la contenga. Si el mensaje dice que Automation administra el archivo, solicite a un usuario root que use las páginas de configuración. No utilice la Terminal para evitar la restricción.

### Montar y desmontar la tarjeta SD

Al desmontar la tarjeta SD, sus archivos dejan de estar disponibles hasta volver a montarla. Termine las cargas, descargas y otras operaciones de archivos antes de seleccionar «Desmontar SD».

Desmontar o reemplazar la tarjeta puede cambiar la automatización a su configuración de emergencia interna. Es posible que esa copia sea más antigua y es posible que aún se ejecuten las reglas automáticas habilitadas. Sin una copia utilizable, es posible que la automatización no esté disponible. Pídale a un usuario de root que confirme que el desmontaje es seguro. Las imágenes, fuentes y registros de la tarjeta dejan de estar disponibles.

Cuando la tarjeta SD no está montada, la página muestra "Montar SD". Selecciónelo, espere a que el estado cambie a "Montado" y luego abra nuevamente el directorio de la tarjeta SD.

Montar la tarjeta no significa que Automatización haya cambiado a su configuración. Después de reinsertar una tarjeta, un usuario de root debe elegir qué configuración usar. Nada se sobrescribe ni se fusiona automáticamente.

## 8. Actualizaciones de OTA

En la página "Sistema", seleccione "Actualización OTA" en la sección "Red y hora" para abrir "Actualización de firmware".

<!-- operational-note -->
El dispositivo se reinicia durante una actualización, desconectando temporalmente la WebUI. Guarde el trabajo activo y mantenga estable la energía del dispositivo antes de comenzar. No apague el dispositivo mientras el progreso de la actualización esté incompleto.

### Primera actualización de una versión anterior a 0.6.3

La primera actualización desde una estructura de almacenamiento anterior, como 0.6.2, necesita un paquete USB/serial compatible aprobado por el proveedor. Cargar solo el firmware o WebUI no puede completar esta actualización. Pídale al administrador o proveedor del dispositivo que siga las instrucciones del paquete. No borre toda la memoria flash ni utilice una tabla de particiones antigua.

Guarde los archivos importantes antes de actualizar. La herramienta combinada conserva las claves y la tarjeta SD; No borra la configuración de la tarjeta. El primer inicio aún puede leer o migrar la configuración existente. La entrega al cliente sigue el procedimiento de “borrar la configuración anterior y configurarla nuevamente”. El administrador o proveedor del dispositivo debe seguir las instrucciones de entrega. No borre toda la memoria flash usted mismo ni trate los archivos conservados como una configuración completa.

Mantenga la alimentación conectada durante la actualización y el primer inicio. Luego, verifique el inicio de sesión, las redes, los ventiladores, la iluminación, los hosts SSH y las reglas de automatización. Revise las reglas antes de probar cualquier tarea que controle la energía, reinicie un dispositivo o ejecute comandos remotos.

El paquete compatible actualiza ambas ranuras de aplicaciones. No asuma que la otra ranura todavía contiene la versión anterior. Si se pierde la contraseña root, utilice únicamente un método de recuperación confirmado por el proveedor para que coincida con la estructura de 0.6.3. No instale una imagen antigua para restablecer la contraseña.

Los métodos de actualización web que aparecen a continuación se aplican únicamente a las versiones que el proveedor ha aprobado para OTA. No sustituyen la primera actualización de la estructura de almacenamiento.

### Buscar actualizaciones desde un servidor OTA

1. Revise la “Versión actual”. Dos instalaciones de 0.6.3 pueden ser versiones de revisión diferentes. Consulte la versión completa, el tiempo de compilación y las instrucciones del editor en lugar de solo los tres primeros números.
2. Introduzca la dirección del servidor OTA proporcionada por un administrador o proveedor.
3. Seleccione “Save” y luego seleccione “Check Update”.
4. La página informa “Update Available” “Already up to date” de una versión anterior del servidor o de un error.
5. Confirme la versión de destino, luego seleccione “Upgrade Now” o el control de actualización que se muestra en la página.
6. Espere a que finalice la descarga, la instalación y el reinicio. Para cancelar utilice el botón “Abort” cuando esté disponible. No todas las etapas admiten la cancelación.
7. Espere a que la página confirme el firmware después de la actualización. Vuelva a conectarse al WebUI y verifique el “Current Version” y el estado del dispositivo.

“Upgrade Progress” muestra la etapa actual en su propia sección. Una lectura del 100% o un mensaje de que se escribieron archivos no confirma que se haya completado el reinicio y la verificación de la versión. Si el resultado no está confirmado o el firmware en ejecución difiere del objetivo, conserve el mensaje y verifique la versión actual. No repita la actualización sin verificar. Pídale a un usuario de root o al proveedor que investigue si es necesario.

Cuando “Also upgrade www” está habilitado, el firmware y WebUI se actualizan en secuencia. Utilice firmware coincidente y recursos WebUI de la misma versión. Si la interfaz anterior permanece después de la actualización, fuerce la actualización del navegador y verifique la versión y la página nuevamente.

### Actualización manual

Expanda “Actualización manual” y elija uno de estos métodos:

- “Actualizar desde URL”: Ingrese la URL del firmware, configure “Actualizar también www” de acuerdo con las instrucciones de la versión y luego seleccione “Actualizar”. Aquí, www se refiere a los recursos de la interfaz web del dispositivo.
- “Actualización desde tarjeta SD”: Ingrese una ruta de firmware como `/sdcard/firmware.bin`. Si está habilitado "Actualizar también www", asegúrese de que `www.bin` de la misma versión esté en ese directorio.

Para una actualización desde una URL, "Omitir verificación de certificado" omite la verificación del certificado del servidor HTTPS. Esto elimina la verificación del certificado utilizada para confirmar la identidad del servidor de descarga. Déjelo sin marcar para actualizaciones de rutina. Si ve un error de certificado, solicite a su administrador que verifique la dirección del servidor y el certificado.

### Gestión de particiones y reversión

“Administración de particiones” muestra la partición en ejecución y otras particiones disponibles.

- “Marcar válido” confirma la versión en ejecución y deshabilita la protección de reversión automática para esa versión. Úselo después de confirmar que la versión actual funciona correctamente.
- “Revertir a esta versión” selecciona otra versión de arranque y cambia mediante un reinicio. La reversión interrumpe los servicios actuales. Primero confirme la versión de destino y la compatibilidad de datos.

Una vez completada la operación y el reinicio, vuelva a abrir la WebUI y verifique la versión actual y el estado del dispositivo.

La versión 0.6.3 cambia el almacenamiento de configuración y el diseño de la partición del dispositivo. No vuelva directamente a una versión anterior de firmware incompatible. Si necesita volver a una versión anterior, solicite al proveedor del dispositivo que confirme un procedimiento completo de recuperación de firmware, diseño y configuración.

La reversión no restaura el formato de configuración anterior ni garantiza que las reglas antiguas funcionen.

## 9. Entrada de gestión de seguridad

Seleccione "Seguridad" en la navegación superior para abrir la administración de seguridad. Utilice la Guía de seguridad TianshanOS para claves SSH, hosts remotos, huellas digitales de host conocidos, certificados HTTPS, paquetes de configuración y administración de cuentas. Estos procedimientos no se repiten aquí.

### Operaciones fallidas o no confirmadas

Un error en el campo rojo le indica qué corregir. Arréglelo y luego guárdelo. Una marca de error borrada no confirma que se haya guardado correctamente; revisa el mensaje y la lista.

Compruebe qué operación falló y lea el motivo y el siguiente paso. Si el mensaje no da un motivo, no lo suponga.

Seleccione “Details” cuando esté disponible. Seleccione “Hide” para ocultar los detalles. Si se muestra un botón ×, selecciónelo para descartar el mensaje. Cuando solicite ayuda, mantenga un registro del mensaje y los detalles para que un usuario de root los revise.

Si un mensaje o sus detalles son largos, desplácese dentro de esa área para leer el contenido completo antes de decidir qué hacer a continuación.

Si el resultado no está confirmado, actualice y compruebe el estado del dispositivo, archivo o tarea. Un tiempo de espera agotado o una desconexión no significa que la operación no se haya ejecutado. No repita de inmediato las operaciones de alimentación, eliminación, inicio de tareas o actualización. Pida ayuda a un usuario root si sigue sin poder confirmar el resultado.

Verifique los resultados de los lotes exitosos, fallidos y no confirmados por separado. Confirme los archivos guardados en la lista de descargas del navegador.
