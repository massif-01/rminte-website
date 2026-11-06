# API: Red

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [network.eth.status](#networkethstatus) | Consultar el estado de Ethernet |
| [network.hostname](#networkhostname) | Consultar o establecer el nombre del host |
| [network.status](#networkstatus) | Consultar el estado general de la red |
| [network.wifi.ap.config](#networkwifiapconfig) | Configurar el punto de acceso WiFi |
| [network.wifi.ap.stations](#networkwifiapstations) | Consultar las estaciones conectadas al punto de acceso |
| [network.wifi.connect](#networkwificonnect) | Conectar a una red WiFi |
| [network.wifi.disconnect](#networkwifidisconnect) | Desconectar de WiFi |
| [network.wifi.mode](#networkwifimode) | Consultar o establecer el modo WiFi |
| [network.wifi.scan](#networkwifiscan) | Buscar redes WiFi |

<a id="networkethstatus"></a>

## network.eth.status

Consultar el estado de Ethernet

**Métodos**: GET / POST
**Ruta**: `/api/v1/network/eth/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.status/link_up, config_error/config_error_name/interface_present, IP/netmask/gateway/dns1/dns2 disponibles y estadísticas de transmisión y recepción.

<a id="networkhostname"></a>

## network.hostname

Consultar o establecer el nombre del host

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/hostname`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `hostname` | string | Opcional | Nuevo nombre de host del dispositivo. | Solo consulta |

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.hostname.

### Notas de uso

Puede cambiar las direcciones de acceso y la coincidencia de nombres de certificados. Los clientes deben verificar la dirección real.

<a id="networkstatus"></a>

## network.status

Consultar el estado general de la red

**Métodos**: GET / POST
**Ruta**: `/api/v1/network/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.hostname/wifi_mode, ethernet, wifi_sta y wifi_ap. ethernet también incluye config_error/config_error_name/interface_present. Los campos de IP y pasarela dependen del estado de conexión.

<a id="networkwifiapconfig"></a>

## network.wifi.ap.config

Configurar el punto de acceso WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/wifi/ap/config`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `ssid` | string | Obligatorio | SSID del punto de acceso. | Sin valor predeterminado |
| `password` | string | Opcional | Contraseña del punto de acceso; omitirla o dejarla vacía crea un punto de acceso abierto. | Cadena vacía |
| `channel` | integer | Opcional | Canal de punto de acceso. | Valor inicial de la implementación |
| `hidden` | boolean | Opcional | Ocultar el SSID. | false |

### Ejemplo de solicitud

```json
{
  "ssid": "TianShanOS",
  "password": "REPLACE_WITH_STRONG_PASSWORD",
  "channel": 6,
  "hidden": false
}
```

### Respuesta y conclusión

data.ssid/auth/channel/hidden/configured.

### Notas de uso

Cambiar el punto de acceso puede afectar la conectividad actual.

<a id="networkwifiapstations"></a>

## network.wifi.ap.stations

Consultar las estaciones conectadas al punto de acceso

**Métodos**: GET / POST
**Ruta**: `/api/v1/network/wifi/ap/stations`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.count/stations con clientes asociados e información de señal disponible.

<a id="networkwificonnect"></a>

## network.wifi.connect

Conectar a una red WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/wifi/connect`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `ssid` | string | Obligatorio | SSID de la red de destino. | Sin valor predeterminado |
| `password` | string | Opcional | Contraseña de red. | Cadena vacía |

### Ejemplo de solicitud

```json
{
  "ssid": "YOUR_SSID",
  "password": "YOUR_WIFI_PASSWORD"
}
```

### Respuesta y conclusión

data.ssid/connecting. Consulta el estado de WiFi hasta que obtenga una dirección.

### Notas de uso

Puede cambiar la conexión de red activa; prepara otra vía de acceso.

<a id="networkwifidisconnect"></a>

## network.wifi.disconnect

Desconectar de WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/wifi/disconnect`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.disconnected. La conectividad de gestión también puede terminar.

<a id="networkwifimode"></a>

## network.wifi.mode

Consultar o establecer el modo WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/wifi/mode`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `mode` | string | Opcional | off/sta/ap/apsta. | Solo consulta |

### Ejemplo de solicitud

```json
{
  "mode": "apsta"
}
```

### Respuesta y conclusión

data.mode.

### Notas de uso

sta conecta a una red; ap ofrece un punto de acceso. El cambio puede interrumpir el acceso de gestión.

<a id="networkwifiscan"></a>

## network.wifi.scan

Buscar redes WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/network/wifi/scan`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.count/networks; entradas ssid/rssi/channel/auth, más bssid para wifi.scan. RSSI es dBm.

### Notas de uso

Inicia una búsqueda real de redes. Ambas entradas tienen los mismos requisitos de acceso, pero distintos textos o campos de autenticación.
