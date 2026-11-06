# Guía de la API de TianshanOS

Conecta tus scripts y sistemas para supervisar el dispositivo, controlar sus ordenadores, recibir información en tiempo real, ejecutar tareas remotas y gestionar la configuración y las actualizaciones. Esta guía presupone conocimientos de HTTP, JSON y administración básica de servidores; no requiere conocimientos de circuitos electrónicos ni del firmware.

Esta guía se basa en **TianshanOS 0.6.4**.

## Elige tu tarea

| Tarea | Empieza aquí |
| --- | --- |
| Realizar la primera llamada a la API | [Inicio rápido](quickstart.md) |
| Identificar el controlador y los dos ordenadores | [Dispositivos y nombres](devices.md) |
| Supervisar temperaturas, ventiladores, alimentación y ordenadores | [Supervisión](scenarios.md#monitor-the-device) |
| Controlar la alimentación o cambiar la conexión USB | [Control de dispositivos](scenarios.md#control-a-computer) |
| Iniciar un servicio remoto y comprobar su estado | [Tareas remotas](scenarios.md#manage-remote-tasks) |
| Configurar variables, fuentes, acciones y reglas | [Automatización](scenarios.md#configure-automation) y [Modelos de configuración](configuration-models.md) |
| Transferir archivos o actualizar el firmware | [Mantenimiento](scenarios.md#maintain-the-device) y [Transferencias](transfers.md) |
| Recibir el estado y los resultados en tiempo real | [WebSocket](websocket.md) |
| Consultar una API | [Referencia completa](reference/README.md) |
| Resolver errores o mantener una integración en funcionamiento | [Resolución de problemas](troubleshooting.md) y [Operaciones](operations.md) |

## Orden de lectura

Empieza por una consulta de solo lectura en la guía de inicio. Después, sigue el escenario de tu tarea, incluidas las comprobaciones del resultado y los pasos de recuperación. Consulta la referencia cuando necesites los detalles de los parámetros.

Las cuentas admin/root y la contraseña inicial rm01 documentadas son los valores predeterminados del producto. Las demás direcciones, nombres de archivo, tokens y valores de respuesta son ejemplos. Usa la dirección real y la contraseña actual de un dispositivo que gestiones. Los ejemplos no contienen tokens privados, contraseñas modificadas ni registros reales de aplicaciones.

La referencia abarca 277 nombres registrados en 28 grupos funcionales, incluido config.pack.apply, que conserva su nombre, pero no aplica una configuración genérica. Las rutas específicas de archivos e imágenes y los mensajes WebSocket tienen capítulos propios. Que un nombre esté registrado no garantiza que el hardware, el almacenamiento, las credenciales o el servicio remoto necesarios estén listos.
