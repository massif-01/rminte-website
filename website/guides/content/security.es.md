# Guía completa de la página de seguridad de TianShanOS

Los nombres de botones y secciones se conservan en inglés para que puedas localizarlos en el dispositivo. La WebUI del dispositivo admite chino e inglés; cambiar el idioma de este sitio no cambia los idiomas del dispositivo.

Utiliza esta guía para cambiar las contraseñas del dispositivo, gestionar el acceso SSH y configurar certificados. Si estás preparando el dispositivo por primera vez, comienza por los capítulos 1 y 2. Los procedimientos de certificados y Config Pack se dirigen a los administradores responsables de la seguridad del dispositivo.

Versión comprobada: copia de trabajo revisada el 7 de septiembre de 2026, basada en el commit `d6ed947`. Esta guía refleja una revisión del código fuente, no pruebas en tu dispositivo. Realiza las comprobaciones de cada apartado en tu propio entorno.

> Utiliza una red de gestión aislada. La interfaz web completa utiliza actualmente HTTP y la mayoría de las operaciones de API carecen de comprobaciones centralizadas y obligatorias de inicio de sesión y permisos. No expongas el dispositivo a internet ni a una red de invitados. Instalar un certificado HTTPS no cambia la interfaz web completa a HTTPS.

## 1. Antes de empezar

### 1.1 Encontrar la tarea que necesitas

| Tarea | Dónde acudir |
| --- | --- |
| Cambiar la contraseña de root o admin del dispositivo | Account Security; capítulo 2 |
| Conectarse a un servidor con una clave SSH | Key Management y Deployed Hosts; capítulo 3 |
| Copiar claves o comprobar la identidad de un servidor | Key Management y huellas de host; capítulo 4 |
| Configurar certificados y autenticación mutua | HTTPS Certificate; capítulo 5 |
| Intercambiar paquetes de configuración cifrados | Config Pack; capítulo 6. La aplicación general de configuraciones aún no está implementada |

### 1.2 Cuentas e identidad del dispositivo

- admin puede abrir Security y ver las claves, los hosts, los certificados y los controles de Config Pack, pero no Account Security.
- root también puede establecer las contraseñas de root y admin, o restablecer la contraseña predeterminada de admin. El servidor exige autorización root para estas operaciones de gestión de contraseñas.
- Un dispositivo Developer se identifica por el campo OU de su certificado. No es una cuenta de usuario. Actualmente, solo estos dispositivos pueden exportar Config Packs y configuraciones de hosts SSH; iniciar sesión como root no cambia la identidad del dispositivo.

Salvo operaciones que comprueban por sí mismas la autorización, como la gestión de contraseñas, una pantalla de inicio de sesión no impide acceder directamente a las API. El aislamiento de red sigue siendo necesario.

### 1.3 Preparar la operación

1. Comprueba que la dirección IP del navegador corresponde al dispositivo previsto y que tu ordenador está en una red de gestión de confianza.
2. Confirma con el administrador del servidor SSH la dirección, el puerto y el nombre de usuario.
3. Para instalar o revocar una clave pública desde esta página, necesitas la contraseña de la cuenta remota y esa cuenta debe admitir autenticación por contraseña. No dejes relajadas las restricciones del servidor solo para resolver un problema.
4. Antes de eliminar claves, revocar accesos o sustituir certificados, asegúrate de disponer de otra vía de acceso: una consola del servidor, otra clave de administrador o la interfaz HTTP de gestión del dispositivo.

## 2. Cambiar las contraseñas del dispositivo

Estos controles modifican las contraseñas de inicio de sesión de TianShanOS, no la contraseña SSH de un servidor remoto.

### 2.1 El aviso de contraseña tras iniciar sesión

Si una cuenta sigue marcada como contraseña sin cambiar, aparece un aviso después de iniciar sesión. Establece una contraseña larga y única. Elegir cambiarla más tarde cierra el aviso; no hace seguro conservar la predeterminada.

Este aviso no es una pantalla de ajustes de cuenta que puedas reabrir en cualquier momento. Si admin ya cambió su contraseña y necesita volver a hacerlo, root puede establecerla desde Security.

### 2.2 Establecer una contraseña como root

1. Inicia sesión como root y abre Security.
2. En Account Security, selecciona Set root password o Set admin password.
3. Introduce dos veces la misma contraseña nueva y envíala. La interfaz admite 4-64 caracteres; cuatro caracteres son un mínimo técnico, no una recomendación de seguridad.

Comprueba el resultado: inicia sesión con la contraseña nueva en una ventana de navegación privada antes de cerrar la sesión original. Cambiar una contraseña no cierra automáticamente las sesiones existentes.

Si no puedes iniciar sesión, comprueba primero la cuenta y la dirección del dispositivo. Cinco intentos fallidos consecutivos provocan un bloqueo de unos cinco minutos. Evita probar contraseñas repetidamente.

### 2.3 Restablecer la contraseña de admin

root puede restablecer la contraseña predeterminada de admin, `rm01`, y quitar su bloqueo de inicio de sesión. Después, inicia una sesión nueva como admin y establece una contraseña nueva de inmediato. El restablecimiento es una medida temporal de recuperación. No conserves la contraseña predeterminada ni supongas que cambiarla cierra todas las sesiones existentes.

## 3. Conectarse a un servidor con una clave SSH

En la primera configuración, crea una clave RSA, instala su clave pública, prueba la conexión y comprueba la huella del servidor. Para retirar una clave, revoca primero el acceso en los servidores, confirma que ya no funciona y solo entonces elimina la clave local.

### 3.1 Crear una clave

1. En Key Management, selecciona Generate New Key.
2. Revisa la lista y elige un ID de clave sin utilizar, como `backup01`. No reutilices un ID: la API de generación no rechaza duplicados y puede sobrescribir la clave existente.
3. Elige RSA 2048 o RSA 4096. RSA 2048 es la opción predeterminada de la interfaz. Se muestran opciones ECDSA, pero la vía actual de autenticación SSH por clave pública no las admite.
4. Añade un comentario o alias si resulta útil. Permite exportar la clave privada solo si lo necesitas para copias de seguridad o migración; no hay una interfaz para cambiar este ajuste más adelante.
5. Selecciona Generate, espera a que termine y actualiza la lista.

Comprueba el resultado: localiza el ID previsto y el tipo RSA. Abre Public Key y comprueba que el texto completo empieza por `ssh-rsa`.

Ten en cuenta que la lista admite ocho entradas. Si está llena, retira una clave que ya no utilices antes de generar otra. El almacenamiento de la clave y su registro en la lista pueden completarse o fallar por separado; comprueba la lista incluso tras un mensaje de éxito. Hide Key ID no impide que la API exponga el ID real.

### 3.2 Instalar la clave pública

La instalación añade la clave pública a `~/.ssh/authorized_keys` de la cuenta remota y permite que esa cuenta acepte la clave privada correspondiente. No cambia la contraseña del servidor.

1. Selecciona Deploy en la fila de la nueva clave.
2. Introduce la dirección del servidor, el usuario, el puerto SSH y la contraseña de esa cuenta.
3. Revisa los datos y selecciona Start Deploy.
4. Comprueba que el servidor aparece en Deployed Hosts y pruébalo como se describe a continuación.

La implementación actual se autentica con la contraseña antes de comprobar la huella del host y confía automáticamente en los hosts desconocidos. No garantiza que la identidad del servidor se verifique antes de enviar la contraseña. Realiza la primera conexión en una red controlada; comprobar la huella después no revierte la exposición de la contraseña. Si la instalación indica éxito, pero falta el registro o falla la prueba, no vuelvas a instalarla de inmediato. La clave pública puede estar instalada aunque haya fallado la prueba posterior con la clave o el guardado del registro local. Comprueba `authorized_keys` mediante otra conexión de gestión. Repetir la instalación puede añadir entradas duplicadas.

### 3.3 Probar la conexión

1. En Deployed Hosts, comprueba la dirección, el puerto, el usuario y el ID de clave.
2. Selecciona Test. El dispositivo intenta ejecutar echo "TianshanOS SSH Test OK".
3. Tras la primera conexión, comprueba la huella guardada del host siguiendo el apartado 4.3.

Qué significa el éxito: la página comprueba si la operación de API se completó, pero no verifica el código de salida ni la salida del comando remoto. Es una comprobación básica de conexión, no una prueba de aceptación completa. No demuestra que sudo ni los comandos de tu aplicación funcionen. Para una tarea importante, verifica la salida, el código de salida y los permisos del comando real.

Si falla, comprueba la conectividad, el servicio SSH, la cuenta y la autorización remota. Deja de reintentar si la huella ha cambiado o la identidad del servidor es incierta; sigue el apartado 4.3.

### 3.4 Revocar el acceso antes de eliminar la clave local

1. Confirma que funciona otra conexión de gestión al servidor y que la clave original sigue en el dispositivo.
2. Selecciona Revoke en la fila del host, introduce la contraseña del servidor y confirma Revoke & Remove. También puedes empezar desde la fila de la clave e introducir los datos del destino.
3. Revisa el resultado y utiliza una conexión de gestión de confianza para comprobar que la clave pública y sus posibles duplicados han desaparecido de `authorized_keys`.
4. Confirma que la clave antigua ya no permite iniciar sesión. La revocación deja una copia `authorized_keys.bak`; gestiónala conforme a la política de copias de seguridad del servidor para no restaurar después una autorización antigua.
5. Actualiza la lista local de hosts. La página intenta eliminar el registro, pero no comprueba el resultado de esa solicitud. Si sigue presente, elimínalo manualmente.
6. Solo después de atender todos los servidores de destino, elimina la clave antigua del dispositivo y las copias de la clave privada que ya no necesites.

Si no se encuentra una clave pública coincidente, confirma en el servidor que has elegido la cuenta correcta y que la clave no está presente antes de optar por eliminar solo el registro local.

Si la revocación falla o el servidor parece sospechoso, conserva la clave local y utiliza una consola de confianza u otra conexión de administrador. No sigas enviando una contraseña a un servidor de identidad dudosa.

## 4. Gestionar claves, hosts y huellas

### 4.1 Copiar una clave pública o exportar una privada

Clave pública: selecciona Public Key y copia el valor completo en una sola línea para el administrador del servidor. Una clave pública no es secreta. Enviarla a la persona equivocada no expone por sí solo la clave privada ni exige sustituir el par. El acceso solo se concede cuando un administrador la añade a la lista de autorizaciones de una cuenta.

Clave privada: solo puede exportarse si se permitió al crearla. Utiliza un ordenador de confianza en una red aislada, guárdala en un almacén de secretos aprobado y elimina las copias temporales del portapapeles y de la carpeta de descargas. No la pegues en chats, incidencias ni registros.

Si Copy no hace nada, puede que el navegador bloquee el portapapeles en una página HTTP. Selecciona y copia el texto visible manualmente; comprueba que el principio, el final y todo el contenido estén intactos. No reduzcas la seguridad del navegador solo para habilitar la copia.

### 4.2 Revocar, quitar y eliminar son operaciones distintas

| Acción | Efecto |
| --- | --- |
| Revocar una clave pública | Intenta quitar la autorización del servidor; requiere la contraseña remota |
| Quitar un host | Elimina el registro local de conexión del dispositivo, no la autorización remota |
| Eliminar una clave | Elimina el material de clave local; no contacta con el servidor ni revoca accesos |
| Eliminar una huella de host | Elimina el registro de identidad guardado del servidor, no el registro de conexión ni la autorización remota |

Deployed Hosts es una lista local, no una vista en tiempo real de las autorizaciones del servidor. Una lista vacía no demuestra que se haya retirado el acceso remoto, ni la presencia de un host garantiza que sea accesible.

### 4.3 Comprobar la huella del servidor SSH

Una huella identifica el servidor al que te conectas. Esta página guarda el resumen SHA-256 como 64 caracteres hexadecimales. Las herramientas OpenSSH suelen mostrar `SHA256:base64`. Pide al administrador el mismo formato antes de comparar; las cadenas no son directamente intercambiables.

Tras la primera conexión, abre la huella completa con View en la sección de huellas de host. Compárala con un valor obtenido desde una consola del servidor, un inventario de activos u otro canal de confianza. La tabla solo muestra los primeros 32 caracteres, insuficientes para una comprobación completa. Si difieren, deja de conectarte e investiga en un entorno aislado. Si introdujiste una contraseña SSH, trátala como posiblemente expuesta. Utiliza una conexión de confianza para cambiarla, revisar los registros de acceso y quitar autorizaciones de clave pública no deseadas. No uses la conexión sospechosa para revocar el acceso desde esta página.

Si cambia una huella guardada:

1. Deja de reintentar. No te limites a eliminar la entrada antigua.
2. Utiliza una consola de confianza para verificar la nueva huella, la dirección IP, el puerto, la identidad del activo y el registro de mantenimiento.
3. Elimina la huella antigua solo después de confirmar una reinstalación autorizada del servidor o un cambio autorizado de su clave de host.
4. Vuelve a conectarte en una red controlada y consulta y comprueba la nueva huella guardada.

La página actual puede mostrar un error genérico de conexión en lugar de un cuadro específico de comparación de huellas.

Protege la tarjeta SD: las huellas se almacenan localmente y se sincronizan en archivos JSON en texto claro en la tarjeta. Al arrancar, las configuraciones de huellas disponibles en SD sustituyen los registros NVS correspondientes. Estos archivos no están firmados; impide su modificación por fuentes no fiables.

### 4.4 Importar y exportar configuraciones de hosts SSH

Este flujo específico de `.tscfg` es independiente de la aplicación general de configuraciones aún incompleta del capítulo 6. Un paquete de host contiene dirección, puerto, usuario, tipo de autenticación e ID de clave. No contiene la contraseña SSH ni la clave privada y no concede acceso en el servidor.

Para exportar, selecciona Export en la fila del host desde un dispositivo Developer. Si el destino es otro dispositivo, facilita y verifica su certificado y descarga el paquete. Un dispositivo normal puede mostrar el botón, pero el backend rechaza su solicitud de exportación.

Para importar:

1. Confirma que el paquete se creó para este dispositivo, que la tarjeta SD admite escritura y que el origen se ha verificado por un canal de confianza.
2. Asegúrate de que este dispositivo ya dispone de la clave correcta referenciada por el paquete. Un ID coincidente no basta; el material de clave debe corresponder a la autorización del servidor.
3. Selecciona Import Host, elige el archivo y revisa la vista previa. Activa la sobrescritura solo si pretendes sustituir una configuración existente con el mismo nombre.
4. Confirma y reinicia cuando se indique. La importación guarda el paquete en SD; la carga y el descifrado se intentan al reiniciar.
5. Comprueba la dirección, el usuario, el puerto y el ID de clave cargados y prueba la conexión. Una vista previa correcta no demuestra que el paquete vaya a funcionar. No establece confianza en el firmante ni comprueba la huella del destinatario. La comprobación del destino se realiza al cargar tras el reinicio. Elimina un registro incorrecto y su paquete SD correspondiente para impedir que vuelva a cargarse. Antes de sustituir el certificado del dispositivo, lee también el apartado 5.5.

## 5. Configurar certificados HTTPS y mTLS

Este capítulo se dirige a los administradores de certificados. El servicio actual del puerto 443 solo ofrece endpoints de salud, identidad y pruebas de permisos, no la interfaz web completa. Con sus ajustes predeterminados, el arranque requiere una clave privada de dispositivo, un certificado de dispositivo y una cadena de CA de clientes.

### 5.1 Función de cada certificado

- El certificado y la clave privada del dispositivo le permiten demostrar su identidad al cliente que se conecta.
- El certificado y la clave privada del cliente, en poder de un ordenador o servicio, permiten que ese cliente demuestre su identidad al dispositivo.
- La cadena de CA instalada en el dispositivo verifica los certificados de los clientes. No hace que un ordenador o navegador confíe automáticamente en el certificado del dispositivo.

Este intercambio de certificados en ambos sentidos se denomina TLS mutuo o mTLS. El cliente debe además confiar en la CA que emitió el certificado del dispositivo y comprobar su nombre y usos permitidos.

### 5.2 Generar una clave de dispositivo y una solicitud de certificado

1. En HTTPS Certificate, selecciona Generate Key Pair. Se crea una clave privada ECDSA P-256 independiente de las claves SSH. No puede exportarse mediante esta interfaz.
2. Si ya existe una clave, detente y revisa el apartado 5.5 antes de continuar. Generar otra sobrescribe la anterior.
3. Selecciona Generate CSR. Introduce el ID del dispositivo (CN), la organización (O) y la unidad organizativa (OU), o deja todos los campos vacíos.
4. Envía el texto completo de la CSR al administrador de tu CA. Una CSR solicita un certificado; no contiene la clave privada ni instala un certificado.

Comprueba los nombres antes de la emisión: el flujo con campos personalizados no genera un SAN. Con todos los campos vacíos, el CN queda fijado en `TIANSHAN-DEVICE-001`; la IP actual solo se incluye como SAN de tipo IP si puede obtenerse. No se añade ningún SAN DNS. Pide al administrador de la CA que inspeccione la CSR y utilice un proceso de emisión controlado para incluir en el SAN del certificado final las IP o los nombres DNS necesarios. Este formulario no permite editar los SAN. Comprueba el resultado: actualiza la página para confirmar que existe la clave privada. El administrador de la CA debe inspeccionar la clave pública, el sujeto y el SAN de la CSR, y comprobar que el certificado emitido tiene el uso requerido de autenticación de servidor (EKU).

### 5.3 Instalar el certificado del dispositivo

1. Obtén un certificado PEM que corresponda a la clave privada actual del dispositivo.
2. Selecciona Install Cert, pega el texto completo con sus delimitadores y envíalo.
3. Consulta el certificado y comprueba su sujeto, emisor y fechas de validez.

El mensaje de éxito solo indica que el certificado puede analizarse y que su clave pública corresponde a la clave privada actual. La instalación no valida por completo la cadena de confianza, SAN, EKU, la vigencia actual ni la política del sujeto.

El cliente real debe comprobar la cadena, el nombre de acceso, los usos y la validez. Si la instalación indica que la clave no coincide, localiza el certificado emitido para la CSR actual. No generes otra clave privada solo para eliminar el error.

### 5.4 Instalar la cadena de CA de clientes y probar

1. Selecciona Install CA y pega uno o varios certificados CA PEM utilizados para confiar en tus clientes.
2. Mantén disponible la interfaz HTTP de gestión y programa un reinicio antes de probar. La instalación actualiza el almacenamiento, pero no reinicia activamente el servicio del puerto 443.
3. Accede a los endpoints de prueba pertinentes con un certificado de cliente de confianza, con el uso y rol correctos.
4. Repite con un certificado no fiable o sin certificado y confirma que se rechaza la conexión.

Comprueba que el dispositivo presenta el nuevo certificado previsto, que los clientes de confianza solo acceden a los endpoints permitidos por su rol y que los demás no pueden conectarse. La negociación y los roles deben probarse en el dispositivo, no deducirse de un mensaje de instalación.

### 5.5 Renovar certificados o eliminar todas las credenciales

<!-- operational-note -->

Si solo caduca el certificado, puedes reutilizar una clave privada no comprometida para solicitar uno nuevo, instalarlo y repetir las pruebas. Sin embargo, los Config Packs están vinculados a la huella del certificado del destinatario. Aunque se conserve la clave privada, una huella distinta hace que, tras reinicializar o reiniciar, los paquetes antiguos se rechacen por pertenecer a otro destinatario. Prepara paquetes de sustitución antes de cambiar el certificado.

Al sustituir la clave privada, la CSR y el certificado anteriores dejan de corresponder a la nueva clave. Eso no revoca el certificado antiguo en la CA. Si la clave anterior estuvo expuesta, gestiona por separado la revocación y la respuesta al incidente. Los paquetes que dependan de una clave privada perdida pueden ser irrecuperables. Para eliminar todas las credenciales PKI, Delete Credentials en la sección de certificados borra conjuntamente la clave privada, el certificado del dispositivo y la cadena de CA de clientes. Verifica tu acceso de recuperación HTTP y prepara paquetes de sustitución antes de confirmar. Una copia del certificado público no puede restaurar una clave privada.

Después de eliminar, actualiza la página y comprueba que aparece un estado sin inicializar. Reinicia y verifica que el puerto 443 ya no utiliza las credenciales antiguas. Para restablecer el servicio, genera una clave nueva, obtén e instala el certificado del dispositivo, instala la cadena de CA y repite las pruebas.

## 6. Comprender las limitaciones de Config Pack

Un Config Pack es un paquete `.tscfg` cifrado y firmado. La implementación actual permite crear e inspeccionar paquetes, pero la aplicación general de configuraciones está incompleta. No dependas de ella para configurar flotas en producción, recuperar el sistema ante desastres ni demostrar que los ajustes han cambiado.

### 6.1 Qué hacen actualmente los controles

| Acción | Resultado actual |
| --- | --- |
| Export Device Certificate | Muestra el certificado público para que un remitente cree un paquete destinado a este dispositivo; no exporta la clave privada |
| Verify | Comprueba la estructura y la firma del texto cifrado con el certificado incluido; no establece confianza en el firmante ni la identidad del destinatario |
| Import tras seleccionar o pegar un paquete | Los parámetros del frontend y del backend no coinciden; este flujo no puede completarse |
| Import desde la lista de paquetes | Valida un archivo existente en el dispositivo; no lo copia, descifra ni aplica |
| Apply | Descifra y enumera los nombres de módulos sin escribir sus ajustes; aun así puede indicar éxito |
| Export Config Pack en un dispositivo Developer | Crea un paquete cifrado y firmado descargable e intenta guardarlo en la tarjeta SD |

### 6.2 Verificar el origen, no solo la firma

Actualmente, el destinatario comprueba la firma con el certificado incluido en el paquete. No está implementada la validación de confianza de la cadena del certificado firmante. La firma cubre el texto cifrado; no supongas que por ello todos los metadatos mostrados están autenticados. La etiqueta Official tampoco demuestra un origen de confianza.

Antes de importar o inspeccionar un paquete, utiliza un sistema de activos o un canal independiente y aprobado para confirmar la huella del certificado firmante, el certificado de destino y el cambio previsto. Recibir un certificado y su huella en el mismo correo no es una comprobación independiente. El nombre de destino de la vista previa no sustituye la verificación de la huella del certificado.

### 6.3 Compartir el certificado del dispositivo e inspeccionar un paquete

Para facilitar el certificado de este dispositivo, selecciona Export Device Certificate, copia el PEM completo y la huella mostrada, y envía el certificado público al remitente. Confirma la huella por otro canal de confianza.

Para inspeccionar un paquete recibido, abre Import Config Pack, selecciona o pega el archivo `.tscfg` y selecciona Verify. Revisa los datos del firmante y comprueba el origen. La verificación no aplica ajustes ni demuestra que este dispositivo sea el destinatario. Detente si el origen, el destino o la finalidad no están claros.

Aunque la verificación sea correcta, no dependas de los controles generales Import y Apply actuales para configurar el dispositivo. Utiliza los controles admitidos de las páginas de cada función y comprueba después los ajustes reales.

### 6.4 Exportar un paquete desde un dispositivo Developer

1. Prepara archivos de configuración JSON válidos en la tarjeta SD y obtén un certificado verificado del dispositivo de destino.
2. Selecciona Export Config Pack, elige los archivos, introduce un nombre y una descripción y pega el certificado de destino.
3. Genera y descarga el archivo `.tscfg`.
4. Comprueba por separado la descarga del navegador y el archivo guardado en `/sdcard/output_config/`. Si falla la escritura en SD, la API puede devolver aun así el paquete para descargarlo.

La exportación no modifica los ajustes de origen. Vuelve a generar un paquete creado para un destino incorrecto o un certificado de destinatario obsoleto. Exportar correctamente no demuestra que funcione toda la distribución: la aplicación general en el dispositivo receptor sigue incompleta.

## 7. Resolución de problemas y respuesta a incidentes

### 7.1 Problemas frecuentes

| Síntoma | Qué hacer |
| --- | --- |
| No aparece Account Security | Inicia sesión como root; admin no ve esta sección |
| La creación indica éxito, pero la clave no aparece | Actualiza la lista y comprueba su capacidad; no reutilices ID ni generes claves repetidamente |
| Falla la instalación de ECDSA | Crea una clave RSA con otro ID; no relajes repetidamente la política del servidor |
| La instalación funciona, pero Test falla | Comprueba la autorización remota por otra conexión antes de reinstalar |
| El acceso sigue funcionando tras quitar un host | Remove solo afecta al registro local; revoca la clave pública remota por separado |
| Cambia una huella o la identidad del servidor no está clara | Deja de conectarte y verifica mediante una consola de confianza; consulta el apartado 4.3 |
| El puerto 443 falla tras instalar certificados | Comprueba la clave, el certificado y la cadena de CA de clientes; reinicia y prueba con un certificado de cliente adecuado |
| Un cliente sigue rechazando el certificado | Comprueba su almacén de confianza, SAN, EKU, validez y cadena; el almacén CA del dispositivo no es el almacén de confianza del navegador |
| Apply indica éxito, pero los ajustes no cambian | La implementación actual no escribe los ajustes de módulos; utiliza las páginas de cada función |

### 7.2 Posible exposición de una clave privada SSH

1. Restringe el acceso al dispositivo y a sus registros. Los registros actuales pueden contener el principio de una clave privada.
2. Revoca la clave pública en todos los servidores afectados mediante conexiones de confianza. Comprueba las copias de seguridad y confirma que la clave antigua ya no funciona.
3. Crea e instala una nueva clave RSA con otro ID. Cuando funcione, elimina la clave antigua y sus copias exportadas.
4. Revisa los registros de acceso. La lista local del dispositivo puede no incluir todos los servidores donde se autorizó la clave.

Si la expuesta es la clave privada HTTPS, sustituye las credenciales del dispositivo según el apartado 5.5 y coordina con el administrador de la CA la revocación del certificado y el tratamiento de los paquetes antiguos.

### 7.3 Otros riesgos de seguridad actuales

Además de las limitaciones de HTTP, autorización, confianza en la primera conexión y paquetes ya descritas, la configuración de compilación inspeccionada no activa NVS Encryption, Flash Encryption ni Secure Boot. No afirmes que estos mecanismos protegen las claves privadas almacenadas o la integridad del arranque. El firmware realmente grabado y los ajustes eFuse de cada dispositivo requieren comprobaciones aparte.

Si tu uso no admite estas limitaciones, mantén el dispositivo fuera de esa red o entorno de confianza hasta que el responsable de seguridad apruebe medidas de aislamiento o una corrección del producto. Las comprobaciones de una guía no sustituyen controles de seguridad ausentes en el producto.

## 8. Alcance de la revisión y glosario

### 8.1 Base de esta guía

La revisión utilizó la copia de trabajo actual basada en `d6ed947`. El comportamiento y los mensajes de la página están en `components/ts_webui/web/js/app.js`; el comportamiento de las API, en `components/ts_api/src/`; el almacenamiento de claves y hosts, en `components/ts_security/src/`. Los certificados, el servicio del puerto 443 y los paquetes se implementan en `components/ts_cert/`, `components/ts_https/` y `components/ts_config_pack/`.

Se comprobaron en particular los ID de clave duplicados, el tratamiento del código de salida de la prueba SSH, la limpieza local tras revocar, las huellas del certificado del destinatario y la lógica incompleta de importación y aplicación de paquetes. Fue una revisión estática: no se conectó a servidores remotos, no cambió credenciales de dispositivos ni realizó pruebas de aceptación de seguridad en hardware.

### 8.2 Términos utilizados

- Clave pública / privada: comparte la pública con un administrador que conceda acceso; mantén la privada en secreto. La autenticación utiliza el par correspondiente.
- NVS: área de almacenamiento Flash para ajustes y claves del dispositivo. El nombre no implica cifrado.
- CSR / CA: solicitud de firma de certificado y autoridad de certificación o su certificado.
- CN / O / OU: campos de nombre común, organización y unidad organizativa del sujeto de un certificado.
- SAN / EKU: nombres o direcciones IP cubiertos por el certificado y usos de autenticación que permite.
- PEM: formato de texto con delimitadores BEGIN/END, utilizado para certificados, CSR y claves.
- PKI / mTLS: sistema de gestión de certificados y confianza, y TLS mutuo, en el que cliente y servidor presentan certificados.
