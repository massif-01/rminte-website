# API: Wi-Fi

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [wifi.connect](#wificonnect) | Conectar a una red WiFi |
| [wifi.disconnect](#wifidisconnect) | Desconectar de WiFi |
| [wifi.scan](#wifiscan) | Buscar redes WiFi |
| [wifi.status](#wifistatus) | Consultar el estado de WiFi |

<a id="wificonnect"></a>

## wifi.connect

Conectar a una red WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/wifi/connect`
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

<a id="wifidisconnect"></a>

## wifi.disconnect

Desconectar de WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/wifi/disconnect`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.disconnected. La conectividad de gestión también puede terminar.

<a id="wifiscan"></a>

## wifi.scan

Buscar redes WiFi

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/wifi/scan`
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

<a id="wifistatus"></a>

## wifi.status

Consultar el estado de WiFi

**Métodos**: GET / POST
**Ruta**: `/api/v1/wifi/status`
**Acceso mínimo**: Público

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.ap/sta con state/has_ip e ip cuando esté disponible; STA puede añadir gateway/rssi. La estructura es distinta de network.status.
