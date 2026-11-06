# Dispositivos y nombres

TianshanOS gestiona tanto su controlador como los ordenadores conectados. Identifica el destino antes de llamar a una API: sus valores de estado describen cosas distintas.

| Nombre para el usuario | Identificador de API | Finalidad |
| --- | --- | --- |
| Controlador de gestión | system.* | Versión de TianshanOS, memoria, tareas y reinicio del controlador |
| Ordenador de inferencia | device:"agx" | Estado y control de alimentación y reinicio; monitor.* proporciona la telemetría de cómputo |
| Ordenador de aplicaciones | device:"lpmu" | Estado y control de alimentación, reinicio y configuración del acceso a la red superior |
| Ventiladores de refrigeración | fan.* and numeric id | RPM, modo de control, curva de temperatura y límites de salida |
| Luz táctil, luz de placa y pantalla de matriz | touch, board, matrix | Colores, efectos, imágenes, códigos QR y texto |
| Almacenamiento local | /sdcard/... and other supported paths | Archivos, paquetes de configuración y materiales de actualización compatibles |
| Host remoto | Saved SSH host id/host | Comandos de servidor o procesos gestionados; no tiene por qué ser uno de los ordenadores integrados |

Usa agx y lpmu exactamente como identificadores de API. Por ejemplo, el ordenador de aplicaciones se sigue indicando mediante `{"device":"lpmu"}`.

## Interpretar las mediciones

- El **ciclo de trabajo del ventilador** es el porcentaje de salida, de 0 a 100. RPM indica la velocidad de giro. Si el porcentaje no se conoce, puede ser null; comprueba también duty_valid.
- La **fuente de temperatura** puede ser un sensor local, telemetría de cómputo, una variable o un valor de prueba manual. Comprueba la fuente, el indicador de validez y la marca de tiempo.
- **power_good** es una indicación física de alimentación. No demuestra que el sistema operativo o la aplicación estén listos.
- El **destino USB** selecciona una ruta USB compartida. Cambiarlo puede interrumpir el tráfico de la ruta anterior.
- **run_id** identifica una ejecución de un servicio remoto gestionado. Conservar un registro no demuestra que su proceso siga en marcha; verifica su estado.
- Los **datos de seguimiento de la operación** contienen un identificador de operación y las credenciales para consultar el resultado. Conserva todos los datos, no solo un nombre que se muestre en pantalla.

## Tres fases de finalización

1. La API acepta la solicitud, por ejemplo, devolviendo started:true.
2. La acción del dispositivo o el proceso remoto alcanza el estado solicitado.
3. Tu aplicación está lista, por ejemplo, tras superar una comprobación de estado.

Confirma la fase que requiere tu tarea. Reiniciar el controlador, encender un ordenador e iniciar su aplicación son operaciones distintas.
