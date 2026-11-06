# API: Reenvío de red

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [nat.disable](#natdisable) | Deshabilitar la pasarela NAT |
| [nat.enable](#natenable) | Habilitar la pasarela NAT |
| [nat.save](#natsave) | Guardar la configuración de NAT |
| [nat.status](#natstatus) | Consultar el estado de la pasarela NAT |

<a id="natdisable"></a>

## nat.disable

Deshabilitar la pasarela NAT

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/nat/disable`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.success.

### Notas de uso

Habilitarlo requiere una conexión WiFi STA. Guarda los cambios de ejecución con nat.save.

<a id="natenable"></a>

## nat.enable

Habilitar la pasarela NAT

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/nat/enable`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.success.

### Notas de uso

Habilitarlo requiere una conexión WiFi STA. Guarda los cambios de ejecución con nat.save.

<a id="natsave"></a>

## nat.save

Guardar la configuración de NAT

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/nat/save`
**Acceso mínimo**: ADMIN

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.success.

### Notas de uso

Habilitarlo requiere una conexión WiFi STA. Guarda los cambios de ejecución con nat.save.

<a id="natstatus"></a>

## nat.status

Consultar el estado de la pasarela NAT

**Métodos**: GET / POST
**Ruta**: `/api/v1/nat/status`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.enabled/state/wifi_connected/eth_up.

### Notas de uso

Habilitarlo requiere una conexión WiFi STA. Guarda los cambios de ejecución con nat.save.
