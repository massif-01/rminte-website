# TianShanOS

Versión cubierta: TianshanOS 0.6.4. Revisado el 3 de noviembre de 2026.

Utilice esta guía para cambiar las contraseñas de los dispositivos, conectarse a servidores SSH, verificar las identidades del servidor y administrar certificados y paquetes de configuración. Para la configuración por primera vez, comience con los Capítulos 1, 2 y 3. Trabaje con el administrador de su dispositivo o servidor en la emisión y recuperación de certificados.

> Utilice una red de administración confiable. La interfaz web completa utiliza HTTP; La instalación de un certificado no lo cambia a HTTPS. Algunas operaciones de certificados aún se pueden realizar sin iniciar sesión, por lo que cerrar sesión no reemplaza el aislamiento de la red. No exponga el acceso a la administración de dispositivos a redes públicas.

## 1. Antes de comenzar

### 1.1 Encuentra la tarea que necesitas Tarea

1. Ingrese la dirección IP del dispositivo de destino en su navegador e inicie sesión con la cuenta de su dispositivo.
2. Seleccione Seguridad en la barra de navegación. Verifique la dirección antes de ingresar contraseñas o manipular claves.
3. Utilice la siguiente tabla para encontrar la sección correcta. Root también ve Seguridad de la cuenta.

| Tarea | Dónde ir |
|---|---|
| Cambiar la contraseña root o admin del dispositivo Seguridad de la cuenta | ; Capítulo 2 |
| Conéctese a un servidor usando una clave SSH | Gestión de claves y hosts con claves desplegadas; capítulo 3 |
| Copie claves, edite o elimine un host o verifique huellas digitales | Gestión de claves, hosts implementados y huellas digitales de hosts conocidos; Capítulo 4 |
| Solicitar e instalar certificados de dispositivos | HTTPS; Capítulo 5 Paquetes de configuración cifrados de |
| Inspeccionar o crear paquetes de configuración cifrados generales | Paquete de configuración; Lea primero las limitaciones en el Capítulo 6. |

### 1.2 Cuentas e identidad del dispositivo

- **admin** puede abrir Seguridad y administrar claves SSH, hosts y las funciones de certificado proporcionadas por la página. La seguridad de la cuenta no se muestra.
- **root** también puede establecer las contraseñas de root y admin, recuperar el acceso de admin y gestionar la configuración de Automatización y el terminal web que requieren root. Una sesión admin conserva los controles de servicio de la página de inicio.
- Un **dispositivo de desarrollador** tiene una identidad de desarrollo registrada en su certificado. Esta no es una cuenta de inicio de sesión. La exportación de paquetes de configuración cifrados y configuraciones de host SSH requiere esta identidad; iniciar sesión como root no lo cambia.

Las operaciones que requieren inicio de sesión verifican la cuenta. Algunas consultas y operaciones de certificados aún no requieren inicio de sesión. Un botón visible no significa que se cumplan todos los requisitos de la cuenta o del dispositivo. Si se le niega el permiso, verifique su sesión y los requisitos de la operación antes de volver a intentarlo.

### 1.3 Prepárese para la operación

1. Verifique que su equipo y el dispositivo de destino estén en una red de administración confiable.
2. Confirme la dirección SSH, el puerto, la cuenta y la huella digital del host completo con el administrador del servidor.
3. Implementar o revocar una clave pública a través de la página requiere la contraseña de la cuenta remota y la autenticación de contraseña. El administrador del servidor decide si mantiene habilitada la autenticación de contraseña después.
4. Antes de revocar el acceso, eliminar claves o reemplazar certificados, verifique que otra conexión de administración funcione, como una consola del servidor, otra clave de administrador o la interfaz HTTP del dispositivo.

## 2. Cambiar contraseñas del dispositivo

Estos controles cambian las contraseñas de inicio de sesión de TianshanOS. No cambian la contraseña SSH de un servidor remoto.

### 2.1 El mensaje después del primer inicio de sesión

Aparece un mensaje de cambio de contraseña después de iniciar sesión si la cuenta todavía está marcada como si tuviera una contraseña sin cambios. Establezca una contraseña larga y única. Si elige cambiarlo más tarde, solo se descarta el mensaje.

Este mensaje no es una pantalla de configuración de la cuenta que pueda volver a abrir en cualquier momento. Si el administrador ya cambió su contraseña y necesita otro cambio, solicite al root que la configure desde Seguridad.

### 2.2 Establecer una contraseña como root

1. Inicie sesión como root y abra Seguridad.
2. En Seguridad de la cuenta, busque los controles de contraseña de administrador o root. Ingrese la nueva contraseña y su confirmación.
3. Seleccione Establecer contraseña de root o Establecer contraseña de administrador. Utilice una contraseña única de al menos 12 caracteres. Las letras, números y símbolos en inglés ayudan a evitar diferencias en el conteo de longitud.

La página establece un límite de 4 a 64 caracteres; el dispositivo comprueba los bytes UTF-8. Las letras, los números y los símbolos ASCII comunes en inglés utilizan cada uno un byte. Los caracteres chinos suelen utilizar varios. Cuatro es la longitud mínima aceptada, no una longitud de contraseña recomendada.

**Compruebe el resultado:** inicie sesión con la nueva contraseña en una ventana de navegación privada antes de cerrar sesión en la sesión original. Establecer una nueva contraseña no finaliza automáticamente las sesiones existentes.

**Si falla el inicio de sesión:** verifique la cuenta y la dirección del dispositivo. Cinco fallos consecutivos provocan un bloqueo de unos cinco minutos. Evite conjeturas repetidas.

### 2.3 Restablecer la contraseña de admin

Root puede seleccionar Restablecer admin a los valores predeterminados para restaurar la contraseña a `rm01` y borrar el bloqueo de inicio de sesión. Inicie sesión como admin en una nueva sesión y establezca una contraseña única inmediatamente después.

> Utilice la contraseña predeterminada sólo para recuperar el acceso temporalmente. Cámbielo de inmediato y cierre sesión en las sesiones que ya no necesite.

### 2.4 Si olvidas la contraseña de root

Pida al administrador un método de recuperación adecuado para el dispositivo. El firmware de recuperación actual solo admite el nuevo sistema de almacenamiento de configuración y restablece las contraseñas de root y admin. No instale por su cuenta firmware de recuperación antiguo. Al recuperar el acceso, establezca una contraseña única para cada cuenta.

## 3. Conéctese a un servidor con una clave SSH

Para la configuración inicial, cree una clave RSA, implemente su clave pública, revise el resultado y pruebe la conexión. Verifique la huella digital del servidor como parte de este proceso. Para retirar una clave, revoque el acceso en cada servidor, confirme que la clave anterior ya no funciona y luego elimine la clave local.

### 3.1 Crear una clave

1. En Administración de claves, seleccione Generar nueva clave.
2. Elija una ID de clave no utilizada, como `backup01` . No utilice más de 10 letras o números en inglés, sin comas. El límite real es 10 bytes UTF-8, no 10 caracteres chinos.
3. Elija RSA 2048 o RSA 4096. RSA 2048 es el valor predeterminado. También se muestran las opciones de ECDSA, pero el flujo de trabajo SSH actual no las admite; elija RSA para SSH.
4. Agregue un comentario o alias si es útil. Habilite Exportable solo si necesita realizar una copia de seguridad o migrar la clave privada. No hay ningún control de página para cambiar esta opción después de la creación.
5. Establezca Oculto si es necesario, luego seleccione Generar. Visualización de efectos ocultos; no impide el acceso al ID de clave real o a la clave.

**Compruebe el resultado:** después de que se cierre la ventana y se actualice la lista, busque el ID deseado y el tipo de RSA. Abra Public Key y verifique que el texto completo comience con `ssh-rsa` .

**Mientras espera:** no vuelva a enviar la solicitud. Cerrar la ventana no cancela la generación en el dispositivo.

| Mensaje o situación | Qué hacer |
|---|---|
| El ID ya está en uso | Elija otra identificación. La creación de una nueva clave no puede sobrescribir una existente |
| Se ha alcanzado el límite de recuento de claves. | El dispositivo tiene capacidad para hasta 8 claves SSH. Retire primero una clave no utilizada mediante el proceso de revocación |
| El almacenamiento o la memoria son insuficientes | Resuelva el problema de recursos del dispositivo. No trates el fracaso como una creación exitosa. |
| Se generó la clave, pero la lista no se pudo actualizar | Actualice manualmente y verifique la clave; no lo vuelvas a generar La generación |
| La generación no está confirmada | Espere y verifique el registro. No vuelva a enviar la misma identificación |
| La limpieza no se completó | Pausar la creación de claves y pedirle a un administrador que verifique el almacenamiento |

Un registro con el mismo ID no prueba que este intento se haya completado. Si el resultado es incierto, verifique el registro y el material clave.

### 3.2 Implementar la clave pública

La implementación agrega la clave pública al archivo de autorización de la cuenta remota, `~/.ssh/authorized_keys` , para que la clave privada correspondiente pueda iniciar sesión. No cambia la contraseña del servidor.

1. Seleccione Implementar en la fila de la clave deseada.
2. Ingrese la dirección del servidor, el nombre de usuario, el puerto SSH y la contraseña de inicio de sesión de SSH.
3. Revise la dirección y la cuenta, luego seleccione Iniciar implementación.
4. Lea el resultado y verifique el registro correspondiente en Hosts implementados.

> La implementación verifica la huella digital del host antes de usar la contraseña. Se rechaza una huella digital modificada para un host conocido. Sin embargo, la implementación inicial en un host desconocido todavía guarda y confía en su huella digital sin pedirle que la confirme primero. Utilice una red controlada y verifique la huella digital completa a través de un canal confiable.

### 3.3 Comprender el resultado de la implementación

| Lo que te dice el resultado | Qué hacer a continuación |
|---|---|
| Se implementó la clave, se registró el host y se verificó el inicio de sesión con clave pública | Verifique los detalles del host y luego pruebe la tarea real |
| Se implementó la clave y se registró el host, pero el inicio de sesión no está confirmado | Seleccione Prueba. Si falla, verifique la autorización y la configuración de la cuenta a través de otra conexión |
| La clave se implementó, pero el registro falló o no está confirmado | Verifique la lista local y la autorización remota antes de implementar nuevamente |
| Implementación completada, pero la lista no se pudo actualizar | Actualizar manualmente. Una actualización fallida no significa que la clave remota no se haya instalado |

Cada implementación agrega la clave, por lo que repetirla puede crear líneas duplicadas. Utilice otra conexión de administración para inspeccionar el archivo de autorización cuando el resultado remoto necesite confirmación.

### 3.4 Pruebe la conexión

1. En Hosts implementados, verifique la dirección, el puerto, el nombre de usuario y la ID de clave, luego seleccione Probar.
2. Si aparece una confirmación inicial de la huella digital, compare la huella digital completa como se describe en la Sección 4.3 antes de elegir Confiar y conectar.
3. Si la huella digital ha cambiado, el cuadro de diálogo muestra tanto los valores almacenados como los actuales. Cancele e investigue primero. Seleccione Actualizar clave de host solo después de confirmar un cambio autorizado.

La prueba intenta el comando de eco fijo `echo "TianshanOS SSH Test OK"` . El mensaje de éxito no verifica el estado de salida o la salida del comando. Úselo sólo como verificación de conexión básica; no establece que sudo o los comandos de su aplicación funcionarán.

**Si falla:** verifique la red, el servicio SSH, la cuenta y la autorización remota. Deje de volver a intentarlo si la identidad del servidor es incierta o su huella digital ha cambiado.

### 3.5 Revocar el acceso remoto y luego limpiar los registros locales

> La revocación afecta los inicios de sesión futuros. Verifique que otra conexión de administración funcione y maneje las tareas que aún deben detenerse o verificarse. Revocar una clave pública, eliminar un host o eliminar una clave no detiene automáticamente los programas remotos.

1. Seleccione Revocar en la fila del host, ingrese la contraseña del servidor y luego seleccione Revocar clave pública remota. También puede comenzar desde la fila de claves e ingresar los detalles del objetivo.
2. Lea el resultado remoto. La revocación exitosa abre la verificación de eliminación del host local. La eliminación local aún necesita una decisión por separado; el registro no se ha eliminado automáticamente.
3. A través de una conexión confiable, verifique que la clave pública y cualquier duplicado hayan desaparecido del archivo de autorización. Confirme que la clave anterior ya no funciona. Maneje el `authorized_keys.bak` resultante según la política de respaldo del servidor para que el acceso anterior no se restablezca más adelante.
4. Si desea eliminar la configuración del host local, revise sus referencias y su impacto como se describe en la Sección 4.2 antes de confirmar.
5. Una vez que se hayan manejado todos los servidores de destino y las tareas relacionadas, elimine la clave anterior del dispositivo y las copias de claves privadas innecesarias como se describe en la Sección 4.1.

**Si no se encuentra la clave pública:** compruebe la cuenta de destino y las claves autorizadas en el servidor. «Revisar y eliminar la configuración del host» solo trata el registro local; no sustituye esa comprobación.

**Si la revocación falla o no está confirmada:** inspeccione la autorización remota a través de una conexión confiable. Conserve la clave local hasta que el resultado sea claro. Evaluar la revocación remota y la eliminación local por separado; un fracaso en uno no prueba que el otro nunca sucedió.

## 4. Administrar claves, hosts y huellas digitales

### 4.1 Copiar, exportar y eliminar claves

Siga las instrucciones a continuación para las filas de claves SSH. La fila denominada `https` contiene la clave del certificado del dispositivo. Al eliminar esa fila se borran todas las credenciales del certificado; lea primero la Sección 5.6.

**Copiar una clave pública:** seleccione Clave pública y envíe el valor completo de una sola línea al administrador del servidor. Las claves públicas se pueden compartir. El acceso se otorga cuando un administrador agrega la clave a la lista de autorización de una cuenta.

**Exportar una clave privada:** solo es posible si activó «Exportable» al crearla. Seleccione «Clave privada» desde un equipo de confianza y una red de gestión aislada. Guárdela en un almacén de secretos autorizado. Borre las copias temporales del portapapeles y de la carpeta de descargas. No la pegue en chats, consultas de soporte ni registros.

**Si Copiar no hace nada:** los navegadores pueden restringir el acceso al portapapeles en una página HTTP. Seleccione y copie el texto manualmente, luego verifique que esté completo. No debilite la configuración de seguridad del navegador para permitir la copia.

**Antes de eliminar una clave:** revoque la autorización del servidor y revise los hosts y los registros de ejecución que figuran en la confirmación. Después de la eliminación, este dispositivo no puede usar esa clave para conectarse, verificar o detener tareas relacionadas, mientras que esas tareas pueden seguir ejecutándose de forma remota. Manéjelos primero a través de otra conexión. Una lista de impacto incompleta no significa que no haya referencias.

Después de confirmar la eliminación, actualice y verifique el resultado. Si la eliminación del almacenamiento no se completó, inspeccione el estado actual y solicite a un administrador que lo resuelva. Una entrada faltante en la lista por sí sola no es prueba de finalización.

### 4.2 Eliminar un host y manejar sus referencias

| Acción | que cambia |
|---|---|
| Revocar una clave pública | Elimina la autorización remota correspondiente; requiere la contraseña remota |
| Eliminar un host | Elimina la configuración de su dispositivo y maneja los comandos y reglas relacionados según su elección |
| Eliminar una clave | Elimina material clave en el dispositivo. |
| Eliminar una huella digital de host conocido | Elimina un registro de identidad del servidor guardado en el dispositivo |

Las últimas tres acciones no revocan claves públicas remotas ni detienen programas remotos. Los hosts implementados son solo una lista local; una lista vacía no prueba que se haya eliminado el acceso remoto.

1. Seleccione Eliminar en la fila del host y espere la verificación de Referencia.
2. Revise los comandos, plantillas o reglas afectados. Elija un host de reemplazo o desvincule las referencias y deshabilite la configuración afectada. Un reemplazo debe tener la cuenta, la clave y el entorno de tareas necesarios.
3. Seleccione Eliminar, lea el resultado y verifique los comandos y reglas relacionados. Los comandos desvinculados necesitan que se seleccione un host antes de poder habilitarlos nuevamente.

Forzar eliminación es una decisión deliberada de eliminar la configuración. No requiere detener el servicio remoto ni conocer su estado. Si no se puede establecer el impacto, es posible que deba seleccionar Acepto para pausar la automatización y continuar eliminando. Luego, la automatización permanece en pausa hasta que root verifica la configuración y la habilita explícitamente.

> No fuerce la eliminación sólo para borrar un error. Primero establezca quién gestionará las tareas remotas y qué reglas automáticas se verán afectadas.

Si la configuración ha cambiado, seleccione Revisar el impacto de la eliminación y decida a partir del nuevo resultado. Después de una falla de almacenamiento o un resultado no confirmado, actualice e inspeccione la configuración antes de eliminarla nuevamente.

### 4.3 Verifique la huella digital del servidor SSH

Una huella digital ayuda a identificar el servidor. Esta página muestra un resumen SHA-256 con 64 caracteres hexadecimales. Las herramientas OpenSSH suelen mostrar `SHA256:base64` . Pídale al administrador el mismo formato; Estas cadenas no se pueden comparar directamente.

**Compare el valor completo:** seleccione Ver en Huellas digitales de host conocidas y compárelo con uno de una consola de servidor, registro de activos u otro canal confiable. La tabla muestra solo los primeros 32 caracteres, lo cual es insuficiente para una verificación completa.

**Cuando la prueba solicita confirmación:** un cuadro de diálogo inicial muestra la huella digital actual. Una advertencia de cambio muestra los valores almacenados y actuales y permite la cancelación de forma predeterminada. Verifique el servidor, la dirección, el puerto y el registro de mantenimiento antes de decidir. La confirmación se aplica sólo a la huella digital mostrada; otro cambio requiere otra verificación.

**Si difiere o su fuente no está clara:** cancele e investigue. Si se utilizó una contraseña a través de una conexión sospechosa, cámbiela a través de una conexión confiable y revise los registros de inicio de sesión y la autorización. No envíe una contraseña a través de una conexión sospechosa para revocar una clave.

**Tras una reinstalación o un cambio de clave del host autorizado:** verifique la nueva huella y consulte el registro del cambio. Después, seleccione «Actualizar clave del host» en el diálogo de prueba. No elimine la entrada anterior para saltarse la comprobación: borrarla no hace fiable la siguiente conexión.

Las huellas de los hosts se guardan dentro del dispositivo y ya no se sincronizan con archivos de huellas de la tarjeta SD. Las copias de configuración y la importación de hosts SSH no incluyen estos registros. Vuelva a comprobar la identidad de los servidores tras una recuperación o migración.

### 4.4 Editar un host

1. En Hosts implementados, seleccione Editar.
2. En Editar host SSH, cambie la dirección, el puerto o la cuenta de inicio de sesión. Para la autenticación de clave, también puede cambiar la ID de la clave de inicio de sesión. El puerto debe ser 1-65535.
3. Seleccione Guardar, actualizar y revisar los detalles, luego pruebe la conexión. Verifique la huella digital completa al cambiar el servidor de destino.

Los cambios se aplican a conexiones futuras. Los registros de ejecución de tareas ya iniciadas aún utilizan los detalles del host original. Cambiar la dirección no mueve ni detiene una tarea anterior.

### 4.5 Importar y exportar configuraciones de host SSH

Import Host es un flujo de trabajo dedicado, independiente de los controles generales del paquete de configuración del Capítulo 6. El paquete contiene la dirección, el puerto, la cuenta, el método de autenticación y el ID de clave. No contiene contraseña SSH, clave privada ni huella digital del host guardada, y no otorga acceso al servidor.

**Para exportar:** en un dispositivo de desarrollador, seleccione Exportar en la fila del host. Para otro dispositivo, pegue y verifique su certificado, genere el paquete y seleccione Descargar. Confirme que el archivo se guardó. Iniciar sesión como root no otorga elegibilidad para exportar un dispositivo normal.

**Antes de importar:** verifique la fuente, confirme que el paquete se creó para este dispositivo y verifique que la clave correcta ya esté presente. Una identificación coincidente no es suficiente; su material clave debe coincidir con la autorización remota. La ubicación de configuración actual debe poder escribirse, pero no siempre se requiere una tarjeta SD.

1. Seleccione Importar host, elija el archivo `.tscfg` y espere a que finalicen las comprobaciones.
2. Revise el host, la dirección, la cuenta y los cambios en la vista previa. Habilite la sobrescritura solo cuando desee reemplazar una configuración existente con el mismo ID.
3. Seleccione Confirmar importación. El dispositivo vuelve a verificar el paquete, las credenciales y la configuración actual en lugar de depender de una vista previa desactualizada.
4. Después de guardar correctamente, actualice y verifique la lista de hosts, luego pruebe la conexión. La configuración guardada entra en vigor inmediatamente sin necesidad de reiniciar. Se conserva la configuración de automatización existente habilitada o pausada.

Este flujo de trabajo verifica el dispositivo del destinatario, la firma, el emisor confiable y la elegibilidad del firmante durante la vista previa, luego descifra y verifica el contenido. Confirme también la fuente a través de un canal confiable. Un nombre o sello oficial por sí solo no es suficiente.

**Si las comprobaciones fallan:** siga el mensaje para comprobar la hora del dispositivo, el certificado del dispositivo, la cadena de CA del cliente y la configuración del emisor de confianza. Un certificado aceptado para HTTPS no es necesariamente apto para firmar paquetes de configuración. Pídale al administrador del dispositivo que resuelva este problema; no instale una CA desconocida sólo para importar un paquete desconocido.

**Si la vista previa caduca:** seleccione Verificar paquete nuevamente y revise los cambios. Si es necesario volver a abrir el cuadro de diálogo, conserve primero cualquier entrada necesaria y siga la Sección 7.2.

### 4.6 Qué pueden traer de vuelta la copia de seguridad y la restauración

Los hosts SSH se guardan junto con las reglas, plantillas, comandos y configuraciones relacionadas de automatización. El funcionamiento normal utiliza la configuración SD. En el modo de emergencia interno, las ediciones se guardan dentro del dispositivo. Las importaciones, ediciones y eliminaciones de host se escriben en la configuración actualmente en uso.

Root puede ver la ubicación actual en Configuración y copia de seguridad en la página Automatización. Guardar copia de seguridad de emergencia actualiza manualmente la copia interna completa; no se sincroniza después de cada edición. Restaurar copia de seguridad de emergencia muestra diferencias antes de reemplazar la configuración actual, sin reiniciar.

Una copia anterior puede recuperar hosts, comandos y reglas antiguos, y puede cambiar si la automatización está habilitada. Revise las diferencias antes de restaurar. La restauración no detiene ni reinicia servicios remotos, ni recupera claves privadas o huellas digitales de host conocidas.

Eliminar la configuración actual no elimina la otra copia guardada manualmente. Después de retirar un host, actualice también la copia de emergencia. Reinsertar la tarjeta SD no cambia la configuración de forma automática: root debe elegirla en «Configuración y copia de seguridad». No borre ni sobrescriba desde el gestor de archivos los ficheros internos de Automatización.

## 5. Configurar los certificados HTTPS y mTLS

La configuración de compilación revisada para esta guía no habilita el servicio HTTPS. Los controles de certificados pueden preparar credenciales, pero no establecen que el puerto 443 esté abierto. Si necesita HTTPS, primero pídale al administrador del dispositivo que confirme que el firmware instalado lo habilita.

Cuando está habilitado, el servicio HTTPS actual proporciona puntos finales de prueba de permisos, identidad y estado, no la interfaz web completa. Las pruebas de conexión siguientes se aplican a implementaciones con HTTPS habilitado.

### 5.1 Sepa qué certificado hace qué

- El **certificado del dispositivo y la clave privada** permiten que el dispositivo demuestre su identidad a los clientes.
- Un **certificado de cliente y una clave privada**, en poder de una equipo o servicio, le permiten a ese cliente probar su identidad en el dispositivo.
- La **CA de verificación del cliente en el dispositivo** valida los certificados del cliente. No hace que un navegador confíe automáticamente en el certificado del dispositivo.

Esta autenticación bidireccional se llama mTLS. Los clientes aún deben confiar en el emisor del certificado del dispositivo y verificar sus nombres de acceso, usos permitidos y validez. Una CA es una autoridad certificadora o su certificado.

### 5.2 Lea el estado y configure la hora del dispositivo

«Guardado», «Dentro del periodo de validez» y «HTTPS: En ejecución» describen, por separado, el almacenamiento, las fechas de validez y el servicio. Ninguno demuestra que se cumplan los demás.

| Estado o situación | Qué hacer |
|---|---|
| Falta el certificado del dispositivo, la clave privada o la CA de verificación del cliente | Instalar el material faltante |
| Esperando la hora del dispositivo | Verifique el reloj de su equipo, luego seleccione Establecer la hora del dispositivo desde esta equipo (fuente del navegador) |
| Aún no válido o caducado | Verifique la hora del dispositivo y las fechas del certificado; organizar la renovación si es necesario |
| La validez del tiempo es correcta, pero HTTPS está detenido | Primero confirme que el firmware habilita HTTPS y luego resuelva los problemas de inicio, coincidencia o credenciales mostrados. |
| El servicio en ejecución todavía utiliza material anterior. | Guarde el resto del trabajo, reinicie según las instrucciones y verifique el certificado que realmente está en uso. |
| Guardar o leer no está confirmado | Actualice y verifique antes de instalar o eliminar nuevamente |

Con HTTPS habilitado en el firmware, un servicio detenido intenta iniciarse cuando las credenciales y la hora están listas. Después de configurar la hora, verifique el reloj del dispositivo, el estado de sincronización y el estado HTTPS. El éxito de la instalación por sí solo no demuestra que esté preparado.

### 5.3 Generar una clave de dispositivo y una solicitud de certificado

> Si ya existe una clave, lea primero la sección 5.6. Generarla de nuevo sobrescribe esa clave y puede impedir que siga usando certificados y paquetes anteriores.

1. Seleccione Generar par de claves. Esto crea una clave privada ECDSA P-256 separada, no relacionada con las claves SSH. No se puede exportar a través de esta interfaz.
2. Seleccione Generar CSR. Ingrese el ID del dispositivo (CN), la organización y el departamento, o deje todos los campos en blanco. El departamento corresponde a la unidad organizativa (OU) del certificado.
3. Seleccione Generar solicitud de firma de certificado y envíe la CSR completa al administrador de CA.

Utilice una identificación de dispositivo breve y estable compuesta por letras y números en inglés. Los campos del formulario permiten hasta 63 bytes UTF-8; Los caracteres chinos utilizan varios bytes. Acorte los campos si aparece un error de longitud.

**Verifique los nombres de acceso antes de la emisión:** con campos personalizados, este formulario no genera una lista de Nombres alternativos del sujeto (SAN). Con todos los campos en blanco, el ID del dispositivo se fija en `TIANSHAN-DEVICE-001` . Solo se agrega la IP actual si está disponible; no se agrega ningún nombre DNS. Haga que el administrador de la CA incluya la IP de acceso real o el nombre DNS y verifique los propósitos de autenticación a través de un proceso de emisión controlado. Este formulario no puede editar SAN.

Una CSR es sólo una solicitud. No contiene ninguna clave privada y no instala un certificado. Verifique su clave pública, asunto y nombres de acceso antes de su emisión.

### 5.4 Instalar el certificado del dispositivo

1. Obtenga un certificado PEM que coincida con la clave privada del dispositivo actual. PEM es texto con marcadores de límite COMIENZO/FIN.
2. Seleccione Instalar certificado, pegue el texto completo y luego seleccione Instalar.
3. Verifique el resultado guardado, el asunto, el emisor y la validez, luego verifique el estado HTTPS real.

La instalación comprueba el formato y la coincidencia de claves. Los clientes aún deben verificar la confianza, la dirección de acceso y los usos permitidos por separado.

Para ver el texto del certificado, seleccione Certificado en la fila `https` en Administración de claves. Revisar o copiar el PEM completo. Puede compartir el certificado público con un remitente del paquete de configuración; mantener la clave privada en secreto.

**Si la clave no coincide:** busque el certificado emitido para el CSR actual. No vuelva a generar una clave privada solo para borrar el error. Si el resultado no está confirmado, actualice y verifique lo que se guardó antes de decidir si desea volver a intentarlo.

### 5.5 Instale la cadena de CA del cliente y pruebe

1. Seleccione Instalar CA, pegue uno o más certificados de CA PEM necesarios para validar los clientes y luego seleccione Instalar. Instale únicamente CA aprobadas por su administrador.
2. Verifique el estado. Con HTTPS habilitado, un servicio detenido intenta iniciarse una vez que las credenciales y la hora estén listas. Si un servicio en ejecución necesita aplicar material nuevo, reinicie según las instrucciones.
3. Haga que un administrador acceda a los puntos finales de prueba adecuados con un certificado de cliente confiable cuyo propósito y función sean correctos.
4. Repita con un certificado que no sea de confianza o sin certificado y confirme el rechazo.

**Compruebe el resultado:** confirme que HTTPS funciona con el certificado previsto. Compare «SHA-256 del certificado activo» si aparece. Un cliente de confianza solo debe acceder a los puntos permitidos para su rol. Compruebe en el dispositivo tanto las conexiones que deben aceptarse como las que deben rechazarse.

### 5.6 Renovar, reemplazar o eliminar credenciales

**Caducidad del certificado:** reutilice una clave no comprometida para solicitar un nuevo certificado, instálelo, aplíquelo según las instrucciones y pruébelo. Los paquetes de configuración están vinculados a la huella digital del certificado del destinatario. Incluso con la misma clave privada, un paquete antiguo puede rechazarse cuando se vuelve a cargar después de un cambio de certificado. Organice primero los paquetes de reemplazo.

**Reemplazo de clave privada:** la CSR y el certificado anteriores ya no coinciden. Los paquetes que dependen de la clave anterior pueden ser irrecuperables. Si la clave estuvo expuesta, solicite también al administrador de CA que revoque el certificado. Generar una nueva clave no realiza la revocación.

**Elimine todas las credenciales:** primero verifique que el acceso de administración HTTP funcione y organice los paquetes que aún necesita. Eliminar credenciales elimina la clave del dispositivo, el certificado del dispositivo y la cadena de CA del cliente juntos. Una copia de seguridad de un certificado público no puede recuperar una clave privada.

Después de la eliminación, actualice y verifique que falte material. Es posible que un servicio HTTPS en ejecución aún contenga credenciales antiguas; La eliminación de los datos almacenados no constituye una revocación inmediata. Reinicie según las instrucciones y luego confirme que las credenciales antiguas ya no estén en uso. Para restaurar el servicio, prepare nuevamente una clave, un certificado de dispositivo y una cadena de CA, luego realice la prueba.

## 6. Comprender las limitaciones generales del paquete de configuración

Un paquete de configuración es un archivo `.tscfg` cifrado y firmado. Los controles generales en la sección Paquete de configuración difieren de los de Importar host en la Sección 4.5. No utilice el comportamiento de control general para juzgar importaciones de reglas, comandos, fuentes, plantillas o hosts dedicados.

### 6.1 Qué hacen los controles

| Acción | Resultado actual Certificado de dispositivo de exportación |
|---|---|
| Exportar certificado del dispositivo | Comparte un certificado público para que un remitente pueda crear un paquete para este dispositivo; no exporta su clave privada |
| Verificar solo | Comprueba la estructura y la firma con el certificado incluido; no establece la confianza del firmante ni la coincidencia del destinatario |
| Importar después de seleccionar o pegar en el diálogo general | Este punto de entrada no puede completar la importación actualmente. |
| Importar desde la lista de paquetes | Comprueba un archivo de dispositivo existente sin copiar, descifrar ni aplicar configuración |
| Aplicar | Descifra y enumera categorías de configuración sin escribir sus configuraciones; todavía puede reportar éxito |
| Exportar Config Pack en un dispositivo Developer | Crea y guarda un paquete en la tarjeta SD, luego ofrece una descarga después del éxito |

> No use el botón «Aplicar» de los controles generales para configurar una flota, recuperarse de un desastre ni confirmar que se aplicaron los ajustes. Aunque indique éxito, configure y compruebe cada función desde su página.

### 6.2 Verifique el origen y el destinatario Actualmente,

General Verify Only utiliza el certificado de firmante incluido en el paquete sin verificar que haya sido emitido por una autoridad confiable. La firma protege el contenido cifrado; no hace que todos los campos mostrados sean confiables. Una etiqueta oficial, un nombre de paquete o un nombre de destino no pueden reemplazar una verificación de origen.

Utilice registros de activos o un canal confiable independiente para confirmar la huella digital del certificado del firmante, el certificado del dispositivo del destinatario y el propósito. Un certificado y una huella digital recibidos en el mismo mensaje no constituyen una verificación independiente. Deténgase si la fuente, el objetivo o el propósito no están claros.

### 6.3 Compartir un certificado de dispositivo e inspeccionar un paquete

**Proporcione el certificado de este dispositivo:** seleccione Exportar certificado de dispositivo y copie el PEM completo y la huella digital que se muestra. Envíe el certificado público al remitente y luego confirme la huella digital a través de otro canal confiable.

**Inspeccionar un paquete recibido:** abra Importar paquete de configuración, seleccione o pegue el archivo y luego seleccione Verificar solo. Revise la información de la firma y confirme la fuente. Esto no aplica la configuración ni prueba que este dispositivo es el destinatario.

Incluso después de pasar la verificación, no se puede confiar en Importar y Aplicar generales para configurar el dispositivo. Utilice Import Host para un paquete de host SSH y controles compatibles en las páginas relevantes para otras configuraciones.

### 6.4 Exportar un paquete de configuración general desde un dispositivo de desarrollador

1. Prepare archivos de configuración JSON válidos en la tarjeta SD y obtenga un certificado de dispositivo de destino verificado.
2. Seleccione Exportar paquete de configuración y elija los archivos. Compruebe que se hayan cargado todos los archivos necesarios. Resuelva los errores de lectura en lugar de omitir el contenido requerido.
3. Ingrese un nombre y una descripción, pegue el certificado del destinatario y genere el paquete.
4. Verifique el mensaje de éxito y la ruta para guardar el dispositivo, luego seleccione Descargar. Confirme que el navegador guardó el archivo `.tscfg` .

Los paquetes se guardan en `/sdcard/output_config/`. Si el dispositivo no puede guardarlos, se muestra un error y no se ofrece la descarga del paquete recién generado. No confunda un resultado anterior con el éxito de este intento. Compruebe la tarjeta SD y el resultado del guardado antes de decidir si lo genera de nuevo.

Exportar no cambia los ajustes de origen. Si eligió otro dispositivo o se sustituyó el certificado del destinatario, vuelva a generar el paquete. Que la exportación termine no garantiza que los controles generales permitan aplicar los ajustes en el destinatario.

## 7. Solución de problemas y respuesta a incidentes

### 7.1 Problemas comunes Síntoma de

| Falta la seguridad de la cuenta | Qué hacer |
|---|---|
| No aparece la sección de seguridad de la cuenta | Se muestra sólo a root |
| Se deniega la autenticación o el permiso | Verifique su cuenta y la identidad requerida del dispositivo. Los clics repetidos no pueden eludir los requisitos. |
| La generación o implementación no está confirmada | Verifique los registros locales y el resultado remoto antes de enviar nuevamente |
| No se puede leer una lista | Restaurar la conectividad y actualizar. Un error de lectura no significa que la lista esté vacía |
| La huella digital del host cambia | Cancelar y verificar a través de un canal confiable; ver Sección 4.3 |
| Un host local permanece después de la revocación | Verifique la revocación remota y la eliminación local por separado; ver Sección 3.5 |
| El acceso aún funciona después de eliminar un host | Revocar la clave pública remota por separado; la eliminación local no revoca el acceso |
| Una verificación de eliminación o una vista previa del paquete caduca | Vuelva a verificar y decida a partir del nuevo resultado, no de la vista previa anterior. |
| Se guarda un certificado, pero se detiene HTTPS | Primero confirme que el firmware habilita HTTPS, luego verifique la hora, las credenciales y los mensajes de inicio. |
| Un cliente rechaza el certificado. | Verifique la confianza del cliente, los nombres de acceso, los usos permitidos y la validez. |
| La aplicación general se realiza correctamente, pero la configuración no cambia | Este punto de entrada aún no escribe configuraciones; utilice la página de funciones correspondiente |

### 7.2 Cambios de configuración o resultado incierto

**El editor dice que la configuración ha cambiado:** es posible que su entrada todavía esté en la ventana, pero no se haya guardado como borrador. Copie todo lo que necesite en un lugar seguro, cierre y vuelva a abrir el editor, lea la configuración actual y luego edítela nuevamente. No coloque contraseñas ni claves privadas en notas ordinarias.

**La vista previa del paquete caduca:** seleccione Verificar paquete nuevamente y revise los cambios. Una vista previa antigua no se puede reutilizar después de que las credenciales o la configuración hayan cambiado.

**Un control de eliminación caduca:** seleccione Revisar el impacto de la eliminación y verifique las referencias actuales. Es posible que una operación en otra ventana haya cambiado el resultado.

**Se produce un tiempo de espera, una desconexión o una respuesta incompleta:** primero inspeccione la configuración actual, la clave, el certificado o la autorización remota. Una confirmación faltante no significa que la operación nunca se haya realizado. Verifique antes de decidir si desea volver a intentarlo.

### 7.3 Sospecha de exposición de clave o contraseña

1. Restringir el acceso al dispositivo y al material afectado. Mantenga los registros necesarios para la investigación.
2. Para una clave privada SSH expuesta, revoque su clave pública en cada servidor afectado a través de conexiones confiables. Verifique las copias de seguridad y confirme que la clave anterior ya no funciona.
3. Cree e implemente una nueva clave RSA con una nueva ID. Verifíquelo, luego elimine la clave anterior y las copias exportadas.
4. Para una contraseña SSH expuesta, cámbiela a través de una conexión de administración confiable y revise los registros de inicio de sesión.
5. Para una clave de certificado de dispositivo expuesta, reemplace las credenciales como se describe en la Sección 5.6. Trabaje con el administrador de CA en la revocación y paquetes antiguos.

Es posible que la lista de hosts locales no cubra todos los servidores que otorgaron acceso. También verifique los registros del servidor y de los activos. Antes de compartir registros, revíselos en busca de contraseñas, claves u otra información confidencial.

### 7.4 Límites operativos actuales

Tenga en cuenta HTTP y las limitaciones de acceso en el Capítulo 1, la confianza de implementación inicial en el Capítulo 3 y las limitaciones generales del paquete de configuración en el Capítulo 6. Oculto no es un mecanismo de control de acceso.

La configuración de compilación revisada no activa el cifrado NVS, el cifrado Flash ni Secure Boot. Esto no permite afirmar que las claves almacenadas estén protegidas por cifrado y arranque seguro. Verifique aparte los ajustes reales de firmware y hardware. Si estas limitaciones no son aceptables, pida al responsable de seguridad que organice el aislamiento o la corrección.

## 8. Alcance y glosario

### 8.1 Bases de esta edición

Esta guía cubre TianshanOS 0.6.4. Sus instrucciones siguen el código ascendente y sus interfaces en chino e inglés revisados el 3 de noviembre de 2026. Utilice la implementación revisada para juzgar las características; un número de versión por sí solo es insuficiente.

Las actualizaciones posteriores no invalidan necesariamente esta guía. Si cambian las páginas, los pasos o los resultados, consulte la interfaz real y las notas de actualización. La revisión documental no sustituye la verificación en el dispositivo del acceso SSH, las autorizaciones remotas, las conexiones HTTPS, los reinicios o la recuperación.

### 8.2 Términos utilizados en esta guía

- **Clave pública/clave privada:** comparta la clave pública con la parte que otorga el acceso; mantener la clave privada en secreto. El inicio de sesión utiliza un par coincidente.
- **Huella digital:** un resumen utilizado para comparar identidades de servidores o certificados. Convierta diferentes formatos de visualización antes de comparar.
- **CSR/CA:** una solicitud de firma de certificado y una autoridad de certificación o su certificado.
- **CN/OU:** el nombre y la unidad organizativa en un certificado. El departamento en forma corresponde a OU.
- **SAN:** los nombres DNS o direcciones IP que cubre un certificado.
- **PEM:** certificado, solicitud o texto clave con marcadores de INICIO/FIN.
- **mTLS:** autenticación en la que ambas partes presentan certificados.
- **NVS:** un área de almacenamiento interno para configuraciones y claves del dispositivo. Su nombre no implica cifrado.
