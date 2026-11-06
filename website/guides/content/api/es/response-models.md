# Modelos de respuesta

Estos campos están dentro de `data`. Gestiona el estado HTTP y `code` como se explica en [Reglas comunes](conventions.md). Los campos dependen del estado del dispositivo, la inicialización y el rol. Si falta un campo, conserva el estado desconocido; no lo sustituyas por `0` o `false`.

## Temperatura

| Campo | Interpretación |
| --- | --- |
| `temperature_c` / `temperature_01c` | Grados Celsius / décimas de grado; representan la misma medición |
| `valid` | Indica si la medición se puede utilizar; `false` no debe interpretarse como una temperatura normal |
| `source` / `active_source` / `preferred_source` | Fuente de esta medición / fuente real / fuente preferida, según la API |
| `timestamp_ms` / `last_update_ms` | Milisegundos desde el arranque del dispositivo, no tiempo Unix |
| `stale` / `age_ms` | Dato desactualizado / antigüedad en milisegundos; `null` puede significar que nunca se ha actualizado |
| `partial_stale` / `valid_count` / `stale_count` | Fallo parcial de una vinculación con varias variables; no te limites a comprobar el promedio |

La implementación limita el rango de temperaturas válidas. Las entradas pueden proceder de sensores locales, telemetría de cómputo, variables o pruebas manuales. Un valor introducido manualmente no demuestra cuál es la temperatura física.

## Ventiladores

`fan.status` con `id` devuelve un ventilador; sin `id` devuelve `fans` junto con `temperature`/`temp_valid`/`temp_source`.

| Campo | Tipo, unidad o significado |
| --- | --- |
| `id` / `mode` | Número del ventilador / `off`, `manual`, `auto`, `curve` |
| `duty_valid` / `duty` | Validez de la salida / porcentaje de salida real conocido; si se desconoce, `duty` es `null` |
| `target_duty` | Porcentaje de salida objetivo; puede diferir de la salida real |
| `rpm` | Revoluciones por minuto; interprétalas según la capacidad de medición de velocidad y los fallos |
| `enabled` / `running` / `fault` | Habilitado / en funcionamiento / fallo; si `running` es desconocido, puede ser `null` |
| `temperature` | Temperatura de control correspondiente, en grados Celsius |
| `control_temperature` / `guard_temperature` / `predicted_temperature` | Temperatura de control, de protección y prevista, en grados Celsius |
| `slope_c_per_min` | Variación de temperatura en grados Celsius por minuto |
| `auto_state` / `guard_active` / `temp_stale` | Fase automática, protección activa, temperatura desactualizada |
| `controller_gain` / `cooling_response` | Valores de diagnóstico; no son RPM ni temperaturas |

`applied` y `persisted` distinguen la aplicación del ajuste de su almacenamiento. Solicitar un `50` % no demuestra que la salida física real sea un `50` % válido.

## Alimentación

`power.status` combina tensión, mediciones del chip, protección y estadísticas. Usa las API específicas `power.voltage`, `power.chip` y `power.protection.status` para obtener los detalles.

| Campo | Unidad o significado |
| --- | --- |
| `voltage_v` / `current_a` / `power_w` | V / A / W |
| `voltage_mv` | mV; convierte la unidad antes de comparar con V |
| `valid` / `crc_valid` | Validez de los datos / integridad de la comunicación; comprueba ambos para las mediciones del chip |
| `timestamp_ms` | Milisegundos desde el arranque |
| `state` / `countdown_remaining_sec` | Fase de protección / segundos restantes de la cuenta atrás |
| `initialized` / `running` | Inicialización completada / protección en funcionamiento |

`device.power.status` devuelve, en cambio, líneas de alimentación con `voltage_mv`/`current_ma`/`power_mw` y `total_power_mw`. La telemetría de cómputo también puede utilizar mW; respeta la unidad de cada campo.

## Resultado de configuración

Las escrituras de configuración y la selección de fuente devuelven varios indicadores de estado; no todas las respuestas los incluyen todos.

| Campo | Significado |
| --- | --- |
| `active_version` | Versión actual de la configuración; utiliza el nuevo valor devuelto para la siguiente escritura |
| `source` | Fuente de configuración activa |
| `loaded` / `configured` / `enabled` / `paused` | Cargada / configurada / habilitada / en pausa; son estados distintos |
| `saved` / `uncertain` | Almacenamiento completado / resultado incierto |
| `load_error` / `internal_error` | Error de configuración activa o de la copia de seguridad interna |
| `sd_available` / `internal_exists` / `internal_valid` | SD disponible / existe copia interna / copia válida |
| `comparison_known` / `backup_matches` | Es posible comparar / la copia coincide; desconocido no significa que coincida |
| `awaiting_sd_choice` | Se requiere seleccionar una opción de SD |
| `internal_saved_at` | Información sobre la hora de guardado de la copia interna |
| `collection` / `id` / `dependency` | Colección, objeto o ubicación de una dependencia |
| `impact` | Referencias y ejecuciones afectadas por una eliminación o sustitución |

`package_digest` y `credential_generation` de la vista previa son condiciones previas para aplicar el cambio, no una autorización global reutilizable. `restart_required:false` no sustituye las comprobaciones de `loaded`/`enabled` ni del estado de ejecución.

## Variables

Las variables incluyen los siguientes campos; algunos pueden no aparecer en la respuesta:

| Campos | Contenido |
| --- | --- |
| `name`, `type`, `value_type` | Nombre y tipo |
| `value` | Valor, si se incluye en la respuesta |
| `source_id` | Identificador de la fuente |
| `persistent`, `readonly`, `flags` | Persistencia, estado de solo lectura e indicadores |
| `last_change_ms`, `last_update_ms`, `age_ms`, `stale` | Información sobre cambios, actualizaciones y antigüedad |

`variables.list` utiliza `include_value` para incluir valores e `include_meta` para los metadatos. Que falte el campo `value` no significa que su valor sea `null`.

## Certificados

`cert.status` informa por separado de:

- `has_private_key`, `has_certificate` y `has_ca_chain`.
- La información del certificado.
- El estado del servicio de diagnóstico HTTPS independiente.

La validez del certificado puede depender de `time_ready`; un resultado indeterminado no equivale a válido.

La identidad instalada, la identidad que carga el servicio de diagnóstico HTTPS independiente y la confianza del cliente de diagnóstico son comprobaciones distintas. Comprueba el estado del servicio después de instalar la identidad. Las API de gestión siguen utilizando HTTP; sus roles Bearer son distintos de los roles de certificado mTLS.

## Color

Los componentes RGB van de `0` a `255`. Las API de color directo aceptan:

- Cadenas compatibles.
- Objetos con los componentes `r`, `g` y `b`.
- El entero decimal equivalente a `0xRRGGBB`.

JSON no admite literales numéricos hexadecimales. `led.color.hsv` utiliza `h` de `0` a `359` grados y `s` y `v` de `0` a `255`, no porcentajes.

La corrección de color es un objeto con esta estructura:

| Campo | Campos del objeto anidado |
| --- | --- |
| `enabled` | Indicador del objeto principal |
| `white_point` | `enabled`, `red_scale`, `green_scale`, `blue_scale` |
| `gamma` | `enabled`, `gamma` |
| `brightness`, `saturation` | Cada objeto contiene `enabled` y `factor` |

Las escalas van de `0` a `2` y `gamma` de `0.1` a `4`. Envía objetos anidados para modificarlos. El brillo del dispositivo de `0` a `255` y un factor de corrección son unidades distintas.

## OTA

Después de iniciar una actualización por URL o SD, consulta `ota.progress`. Devuelve el estado de todo el dispositivo, sin datos de seguimiento privados por sesión.

| Actualización | Campos de progreso | Cómo comprobar la finalización |
| --- | --- | --- |
| APP | `state`, `percent`, `total_size`, `received_size`, `message` | `pending_reboot` indica que hay que reiniciar |
| WWW | `state`, `percent`, `total`, `received`, `message`, `running` | `state=completed` y `running=false` |

Llegar al `100` % no demuestra por sí solo que la nueva versión esté en ejecución.

Las particiones informan de `label`, `address` y `size`, de la posibilidad de arrancar y de los campos `version` y `project` disponibles. `can_rollback` indica si la reversión está disponible en ese momento. `aborted` confirma la llamada de cancelación; sigue comprobando el progreso y el estado real.

Las cargas binarias usan una respuesta distinta. HTTP409 con `status=partial`, `error=recovery_cache_failed` y `flash_written=true` significa que se ha escrito la memoria Flash, pero no se ha guardado por completo la caché de recuperación de la SD. Comprueba las particiones y los archivos de recuperación antes de reintentar.

## Red

Los campos distinguen la existencia de una interfaz, su conexión física y los estados solicitado y real:

| Campo | Interpretación |
| --- | --- |
| `interface_present` de Ethernet | Indica que la interfaz existe |
| `link_up` de Ethernet | Indica el enlace físico |
| `config_error`, `config_error_name` | Informan de errores al aplicar la configuración |
| `running` de DHCP | Estado real |
| `want_running` de Ethernet | Estado solicitado |
| `restore_error` | Error al restaurar la configuración |
| `apply_error` | Error al aplicar la configuración |
| `resume_error` | Error al reanudar el servicio |

Tener un cable conectado no demuestra que la configuración IP sea correcta. Cero en los campos de error significa que esa fase no ha informado de ningún `error`. Comprueba el estado de la interfaz y del enlace antes de decidir si el servicio debería estar ejecutándose.
