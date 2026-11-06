# API: Asignación de direcciones

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [dhcp.clients](#dhcpclients) | Enumerar los clientes DHCP |
| [dhcp.start](#dhcpstart) | Iniciar el servidor DHCP |
| [dhcp.status](#dhcpstatus) | Consultar el estado del servidor DHCP |
| [dhcp.stop](#dhcpstop) | Detener el servidor DHCP |

<a id="dhcpclients"></a>

## dhcp.clients

Enumerar los clientes DHCP

**Métodos**: GET / POST
**Ruta**: `/api/v1/dhcp/clients`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `interface` | string | Opcional | ap/wifi o eth/ethernet. | Información conjunta en las consultas; AP para iniciar o detener |

### Ejemplo de solicitud

```json
{
  "interface": "ap"
}
```

### Respuesta y conclusión

data.clients/count; los arrendamientos incluyen mac/ip/hostname/lease_start/lease_expire/is_static.

<a id="dhcpstart"></a>

## dhcp.start

Iniciar el servidor DHCP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/dhcp/start`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `interface` | string | Opcional | ap/wifi o eth/ethernet. | Información conjunta en las consultas; AP para iniciar o detener |

### Ejemplo de solicitud

```json
{
  "interface": "ap"
}
```

### Respuesta y conclusión

data.interface/started.

<a id="dhcpstatus"></a>

## dhcp.status

Consultar el estado del servidor DHCP

**Métodos**: GET / POST
**Ruta**: `/api/v1/dhcp/status`
**Acceso mínimo**: READ

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `interface` | string | Opcional | ap/wifi o eth/ethernet. | Información conjunta en las consultas; AP para iniciar o detener |

### Ejemplo de solicitud

```json
{
  "interface": "ap"
}
```

### Respuesta y conclusión

data.interfaces o una interfaz individual contiene state/running, pool, gateway/dns/netmask/lease_min y estadísticas. También incluye interface_present/restore_error/apply_error. eth añade want_running/link_up/resume_error; un código de error 0 significa que esa fase no informó de errores.

### Notas de uso

want_running es el estado solicitado, no el estado real running. Comprueba por separado si existe la interfaz, el estado del enlace y los errores de recuperación; obtener una dirección no basta.

<a id="dhcpstop"></a>

## dhcp.stop

Detener el servidor DHCP

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/dhcp/stop`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `interface` | string | Opcional | ap/wifi o eth/ethernet. | Información conjunta en las consultas; AP para iniciar o detener |

### Ejemplo de solicitud

```json
{
  "interface": "ap"
}
```

### Respuesta y conclusión

data.interface/stopped.
