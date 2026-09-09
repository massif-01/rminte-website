# Guía de configuración de red de RM-01

Los nombres de botones y secciones se conservan en inglés para que puedas localizarlos en el dispositivo. La WebUI del dispositivo admite chino e inglés; cambiar el idioma de este sitio no cambia los idiomas del dispositivo.

## 1. Comprender las dos vías de conexión

RM-01 ofrece dos vías de red mediante USB-C, denominadas en esta guía **puerto C1** y **puerto C3**. Ambas transportan conexiones de red, pero conectan equipos distintos y crean topologías diferentes:

| Puerto | Uso principal | Relación de red tras la conexión |
| --- | --- | --- |
| C1 | Conectar un ordenador, una tableta, un teléfono u otro dispositivo de usuario a RM-01 | El dispositivo se incorpora como nodo a la red del conmutador interno de RM-01 |
| C3 | Conectar RM-01 a la red local existente del usuario | LPMU enruta el tráfico de los demás nodos internos y permite incorporar todo el sistema a la red del conmutador o rúter ascendente |

## 2. Identificar C1 y C3

### Puerto C1

C1 se encuentra en la parte trasera de la carcasa. Es el superior de los dos puertos USB-C dispuestos en vertical. Un símbolo de conexión grabado debajo permite identificarlo.

### Puerto C3

C3 está en la parte superior de la carcasa. Levanta la tapa magnética para acceder a este puerto USB-C. C3 es el puerto USB superior compartido, cuyo destino puede cambiarse entre ESP, AGX y LPMU desde TianshanOS.

## 3. Conectar un dispositivo de usuario mediante C1

Utiliza un cable USB-C con transferencia de datos para conectar un iPad, ordenador, teléfono u otro dispositivo a C1. RM-01 proporciona la configuración DHCP; no hace falta introducir manualmente una dirección IP, una puerta de enlace ni un servidor DNS.

El dispositivo suele detectar una interfaz de red cableada denominada `AX88179` o USB Ethernet. Después se incorpora a la red del conmutador interno de RM-01 y puede comunicarse con sus equipos.

> C1 conecta el dispositivo de usuario directamente a la red interna de RM-01. Conecta solo dispositivos de confianza y no conectes equipos sin gestionar a C1 en entornos públicos o no fiables.

## 4. Mantener el acceso a internet y compartirlo con RM-01

### Qué puede ocurrir con la conexión a internet del usuario

Al conectar C1, algunos sistemas operativos pueden dar prioridad a `AX88179`. Como C1 ofrece acceso a la red interna de RM-01, no acceso directo a internet, la conexión a internet existente del dispositivo puede interrumpirse.

Si el dispositivo debe seguir utilizando Wi-Fi, Ethernet u otra conexión para acceder a internet, mantén esa conexión con mayor prioridad que `AX88179`:

| Sistema | Término del sistema | Criterio de configuración |
| --- | --- | --- |
| macOS | Orden de servicios de red (Service Order) | Sitúa el servicio Wi-Fi o Ethernet que proporciona internet por encima de `AX88179` |
| Windows | Métrica de interfaz | Los valores menores tienen mayor prioridad; asigna a la interfaz de internet una métrica inferior a la de `AX88179` |
| Linux | Métrica de ruta | Los valores menores tienen mayor prioridad; asigna a la ruta predeterminada de internet una métrica inferior a la de `AX88179` |

### Utilizar la herramienta de conexión de red de RM-01

Para compartir la conexión a internet del dispositivo con RM-01, obtén la **Herramienta de conexión de red de RM-01** en la página de descargas del sitio web. Configura DHCP, el enrutamiento y las reglas de conexión compartida entre el dispositivo del usuario y C1 para reenviar el tráfico de internet a la red interna de RM-01.

Sistemas admitidos actualmente:

- macOS
- Linux
- Windows Pro

Windows Home no es compatible actualmente.

> La herramienta modifica las direcciones de red, el enrutamiento y los ajustes de conexión compartida del dispositivo del usuario. Las conexiones existentes pueden interrumpirse brevemente. Guarda el trabajo de las descargas, sesiones remotas y demás tareas que dependan de la red antes de empezar.

## 5. Configurar con IA la conexión compartida de C1

Un entorno de ejecución de agentes con capacidad para ejecutar comandos locales, como Codex o Hermes, puede inspeccionar la topología a partir de instrucciones en lenguaje natural y ayudar a configurar el reenvío y la conexión compartida desde el ordenador del usuario a la red interna de RM-01. La IA debe poder ejecutar comandos del sistema en el ordenador de destino. Una IA limitada al chat puede dar instrucciones, pero no aplicar la configuración.

### Dónde ejecutar el agente de IA

Siempre que sea posible, ejecuta el agente directamente en el ordenador conectado a C1. Ese ordenador controla la salida a internet, la ruta predeterminada y las reglas de conexión compartida; el agente necesita acceso de administrador en él para realizar la configuración.

Si Codex, Hermes u otro agente se ejecuta dentro de RM-01, ya debe disponer de autorización para ejecutar comandos remotos y de acceso de administrador al ordenador del usuario. Sin ese acceso no puede modificar su conexión compartida, sus rutas ni su cortafuegos.

### Comprobaciones previas

- El ordenador está conectado a RM-01 por C1 y detecta una interfaz denominada `AX88179` o USB Ethernet.
- La dirección C1 del ordenador es `10.10.99.100/24`; los nodos internos de RM-01 conservan `10.10.99.99`, `10.10.99.98` y `10.10.99.97`.
- El ordenador ya tiene acceso a internet mediante Wi-Fi, Ethernet u otra interfaz.
- El entorno de agentes puede ejecutar comandos en el ordenador y solicitar privilegios de administrador cuando sean necesarios.
- Se ha guardado el trabajo de las descargas, sesiones remotas y otras tareas que dependen de la red, y existe una vía local para recuperar la configuración si hace falta.

### Instrucciones para enviar al agente

El siguiente texto conserva la topología de fábrica de RM-01, exige inspeccionar antes de modificar y solicita comprobaciones e instrucciones de reversión. Cópialo en Codex, Hermes u otro entorno de agentes capaz de ejecutar comandos:

```text
Ayúdame a configurar la conexión compartida a internet de C1 para RM-01. Inspecciona primero el sistema operativo, las interfaces de red, las direcciones, las rutas predeterminadas y el estado del cortafuegos. Modifica la configuración solo después de confirmar que coincide con la topología siguiente. No deduzcas la función de una interfaz solo por su nombre ni cambies las direcciones fijas de los nodos internos de RM-01.

Topología actual:
- El ordenador del usuario está conectado por USB-C al puerto C1 de RM-01. En el ordenador, esta conexión suele aparecer como AX88179 o USB Ethernet y utiliza 10.10.99.100/24.
- La red interna de RM-01 es 10.10.99.0/24.
- El ordenador de aplicaciones (LPMU) es 10.10.99.99.
- El ordenador de inferencia (AGX) es 10.10.99.98.
- El ordenador de gestión fuera de banda es 10.10.99.97.
- El ordenador del usuario también tiene acceso a internet mediante otra interfaz de red.

Mi objetivo es conservar la conexión a internet existente del ordenador y compartirla por la interfaz AX88179 / USB Ethernet asociada a C1, para que 10.10.99.99, 10.10.99.98 y 10.10.99.97 puedan acceder a internet.

Respeta estas condiciones:
1. Identifica el sistema operativo, la salida real a internet y la interfaz asociada a C1; explica después qué vas a cambiar.
2. Utiliza el método nativo de conexión compartida menos invasivo del sistema operativo para configurar únicamente el reenvío IP, NAT, el enrutamiento o la Conexión compartida a Internet que sean necesarios.
3. No cambies la prioridad ni la ruta predeterminada de la interfaz de internet existente. No cambies las direcciones de los nodos RM-01 indicadas arriba ni vacíes o sobrescribas reglas del cortafuegos ajenas a esta tarea.
4. Si necesitas privilegios de administrador, explica el motivo antes de solicitarlos. Si el sistema o los permisos actuales no permiten completar la configuración de forma segura, detente e indica el motivo.
5. Después de aplicar la configuración, verifica que el ordenador sigue teniendo internet; que 10.10.99.99, 10.10.99.98 y 10.10.99.97 son accesibles; y que los nodos internos de RM-01 alcanzan una IP pública y resuelven nombres DNS.
6. Por último, enumera los comandos o ajustes modificados, los resultados de la validación y los pasos de reversión necesarios para restaurar la configuración original.
```

macOS suele utilizar Compartir Internet y las funciones de enrutamiento del sistema; Linux, reenvío IP con nftables o iptables; Windows Pro, Conexión compartida a Internet (ICS). Los comandos y nombres de interfaz concretos deben basarse en la inspección del ordenador actual. Windows Home no es compatible actualmente.

### Comprobar el resultado

Tras la configuración deben cumplirse todas estas condiciones:

1. La conexión original del ordenador a internet sigue disponible.
2. El ordenador puede alcanzar `10.10.99.99`, `10.10.99.98` y `10.10.99.97`.
3. Los nodos internos de RM-01 pueden alcanzar direcciones IP públicas y nombres de host de internet mediante DNS.
4. El agente detalla los cambios realizados y proporciona pasos de reversión ejecutables, en lugar de limitarse a afirmar que la configuración ha terminado correctamente.

### Aviso de seguridad

> Conceder acceso de administrador o root a un agente para configurar la red le permite modificar rutas, reenvío IP, NAT, Conexión compartida a Internet y reglas del cortafuegos. Utiliza solo un entorno de agentes de confianza y revisa las acciones propuestas antes de autorizarlas. Si el ordenador mantiene una sesión remota u otra tarea de red crítica, asegúrate primero de poder recuperar la configuración de forma local.

## 6. Conectar RM-01 a una red ascendente mediante C3

En esta guía, «red ascendente» es la red local existente del usuario, por ejemplo, la proporcionada por un conmutador o rúter.

### Preparar el adaptador

El usuario debe disponer de:

- Un adaptador Ethernet de USB-C a RJ45.
- Un cable Ethernet RJ45 conectado al conmutador o rúter.

Conecta el extremo USB-C a C3 y el cable RJ45 al conmutador o rúter. La conexión física no completa por sí sola la configuración DHCP ni el enrutamiento. Después hay que ejecutar el programa de configuración de red integrado en RM-01.

### Cambiar el destino del USB superior a LPMU

1. Abre la página de inicio de TianshanOS.
2. Busca «USB Switch».
3. Selecciona el botón «USB» y cambia el destino actual del puerto superior a `LPMU`.
4. Comprueba que la página muestra `LPMU` como destino actual antes de continuar.

<!-- operational-note -->

El cambio de destino puede interrumpir brevemente el enlace actual. No cambies el destino mientras se transfieren datos por ese puerto.

## 7. Conectar todo el sistema a través de LPMU

RM-01 incorpora el proyecto de automatización de red preinstalado en LPMU. Una vez que LPMU dispone de conexión ascendente, utiliza enrutamiento interno y NAT para reenviar el tráfico de AGX y de los demás nodos internos e incorporar todo el sistema a la red ascendente del usuario.

### Ubicación del proyecto y tareas del usuario

El proyecto está en el **directorio personal del usuario actual de LPMU**, en `~/network-setup/`. Los scripts específicos de LPMU se encuentran en `~/network-setup/lpmu/`.

En un dispositivo con la configuración de fábrica, no vuelvas a descargar el proyecto ni repitas los pasos de despliegue técnico del README del repositorio, como `scp`, `chmod` o la instalación de servicios. El usuario habitual debe iniciar la configuración desde TianshanOS. Accede al directorio del proyecto solo para diagnosticar problemas o desarrollar.

> No muevas, cambies de nombre ni elimines `~/network-setup/`. El flujo de configuración de red de TianshanOS depende de esa ruta y de los scripts de fábrica.

### Qué configura el proyecto de automatización

Al iniciarse, el proyecto realiza estas operaciones en LPMU:

1. Detecta las interfaces con puerta de enlace y realiza pruebas de conectividad para seleccionar una salida ascendente utilizable.
2. Sustituye la ruta predeterminada de LPMU para que el tráfico utilice la interfaz seleccionada.
3. Activa el reenvío IPv4 y configura reglas NAT y FORWARD de `iptables`.
4. Permite que AGX, cuya dirección interna predeterminada es `10.10.99.98`, alcance la red ascendente a través de LPMU en `10.10.99.99`.
5. Añade reglas de reenvío de puertos para los servicios alojados en AGX.

El proyecto también incluye un servicio opcional de supervisión inteligente de rutas. Si se activa, comprueba la salida ascendente cada 30 segundos, intenta cambiar a otra cuando se pierde la conectividad y vuelve a la interfaz preferida cuando esta se recupera.

### Ejecutar la configuración desde TianshanOS

1. Comprueba que C3 está conectado al conmutador o rúter mediante el adaptador Ethernet USB-C a RJ45.
2. Comprueba que el destino del USB superior en la página de inicio de TianshanOS es `LPMU`.
3. Abre «Network» en la navegación superior de TianshanOS.
4. Busca «Upstream Network Access».
5. Selecciona «Access via LPMU».
6. Espera a que el estado pase de «Processing» a «Success» o «Failed». No vuelvas a iniciar la operación mientras se procesa.

«Success» significa que el script ha encontrado una salida ascendente utilizable, ha configurado la ruta de LPMU y ha ejecutado la configuración de reenvío interno y NAT. Comprueba después la conectividad IP y la resolución DNS de AGX; el estado del botón no basta como prueba de conectividad.

### Comprobar la conexión

Confirma primero que TianshanOS indica «Success». Si dispones de acceso al terminal de AGX, ejecuta estas comprobaciones en AGX:

```bash
ping -c 3 10.10.99.99  # Comprobar la conexión de AGX a LPMU
ping -c 3 8.8.8.8       # Comprobar el acceso a una IP de internet
ping -c 3 google.com    # Comprobar la resolución DNS
```

Estas pruebas distinguen el enlace interno, el reenvío a internet y DNS. Si falla la primera, revisa el enlace interno y las direcciones. Si la primera funciona y la segunda falla, revisa la conexión ascendente de LPMU, la ruta predeterminada y NAT. Si solo falla la tercera, revisa DNS.

### Reenvío de puertos y límites de seguridad

El proyecto actual configura estos reenvíos en la interfaz ascendente de LPMU:

| Entrada en LPMU | Destino del reenvío | Función |
| --- | --- | --- |
| TCP `58022` | AGX TCP `22` | Acceder al servicio SSH de AGX a través de LPMU |
| TCP/UDP `58000–58999` | Los mismos puertos de AGX | Acceder a los servicios de aplicaciones ejecutados en AGX |

Para SSH, el cliente se conecta a la dirección ascendente de LPMU, pero el nombre de usuario y las credenciales pertenecen a AGX:

```bash
ssh -p 58022 <AGX_USERNAME>@<LPMU_IP>
```

> El reenvío de puertos hace que los servicios de AGX sean más accesibles desde la red ascendente. Actívalo solo en una LAN de confianza y restringe las direcciones de origen mediante el conmutador, el rúter o el cortafuegos ascendente. No expongas estos puertos directamente a internet.

### Riesgos y resolución de problemas

> «Access via LPMU» elimina las rutas predeterminadas anteriores de LPMU, vacía la tabla NAT y la cadena FORWARD de `iptables`, establece DROP como política predeterminada de FORWARD y escribe las reglas de enrutamiento, NAT y reenvío de puertos de RM-01. Esto puede interrumpir sesiones remotas de inmediato y sobrescribir configuraciones personalizadas de red o cortafuegos. Si LPMU se ha personalizado, exporta primero sus rutas y reglas actuales y asegúrate de contar con una vía de recuperación local.

Si la operación falla, comprueba lo siguiente en este orden:

1. El adaptador USB-C a RJ45 y el cable Ethernet conectados a C3 están bien sujetos.
2. El puerto del conmutador o rúter está habilitado.
3. La página de inicio de TianshanOS muestra `LPMU` como destino actual del USB superior.
4. La red ascendente proporciona a LPMU una dirección, una puerta de enlace y una configuración DNS válidas.
5. Lee el error y la salida de «Upstream Network Access».
6. Comprueba que AGX sigue alcanzando la dirección interna de LPMU, `10.10.99.99`.
7. Busca reglas personalizadas de LPMU que entren en conflicto con la ruta predeterminada, NAT, la cadena FORWARD o el reenvío de puertos.
