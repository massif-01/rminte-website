# Versión y compatibilidad

Esta guía se basa en **TianshanOS 0.6.4**. También sirve para versiones posteriores si las interfaces y los procedimientos no han cambiado. Si los parámetros o resultados son distintos, sigue la documentación de la versión instalada.

## Conexiones y cuentas

| Elemento | Uso |
| --- | --- |
| API de gestión | HTTP, puerto predeterminado 80, prefijo /api/v1; por ejemplo, http://10.10.99.97 |
| Mensajes en tiempo real | WebSocket, ws://device-address/ws |
| Cuentas predeterminadas | admin/root, ambas con contraseña inicial rm01; si se ha cambiado, usa la contraseña actual |
| Autenticación de sesión | Token de inicio de sesión en Authorization: Bearer |
| Control de acceso | Rol mínimo por endpoint, con comprobaciones adicionales de recursos, versión y propiedad |

## Requisitos de las funciones

Que una API esté disponible no demuestra que todas sus dependencias estén listas. Comprueba el estado correspondiente antes de usarla.

| Función | Requisitos |
| --- | --- |
| Temperatura, ventiladores, alimentación y ordenadores | Controladores inicializados, destinos existentes y mediciones válidas |
| Telemetría de cómputo | Monitor en ejecución, servicio del host accesible y datos recientes y válidos |
| Archivos y actualizaciones desde SD | Almacenamiento requerido montado, archivo existente y capacidad suficiente; la carga directa tiene un flujo independiente |
| SSH/SFTP y servicios gestionados | Red, credenciales, huellas de host, claves, configuración guardada y capacidad para tareas |
| Automatización | Configuración cargada y habilitada, estado correcto del motor, referencias válidas y versiones de escritura coincidentes |
| Paquetes de configuración | Identidad del dispositivo y del destinatario, y confianza en el distribuidor; la exportación también requiere la capacidad Developer |
| PKI del dispositivo y actualizaciones | Material PKI y hora válidos para el diagnóstico; imágenes APP/WWW completas y compatibles para las actualizaciones |
| Contenido de la matriz | Destino compatible y archivos de fuente o imagen utilizables |

## Alias y entradas no admitidas

config.pack.apply conserva su nombre, pero no aplica una configuración genérica; usa la importación específica del objeto. led.set escribe rangos de píxeles. ota.upload_begin/end/abort controlan una carga, pero no existe una API pública upload_write para transferir datos; las integraciones ordinarias deben usar la carga binaria de una imagen completa.

OTA conserva los alias upgrade_url/start_url y upgrade_file/start_file. En integraciones nuevas, usa preferentemente start_url/start_file.

## Servicio de diagnóstico mTLS

Este servicio independiente, autenticado mediante certificados, utiliza el puerto 443 por defecto. No es otro puerto de acceso a /api/v1. Su disponibilidad depende del material PKI, de la configuración y del estado del servicio. Los tokens Bearer no sustituyen los certificados de cliente.

| Método y ruta | Rol mínimo del certificado | Finalidad |
| --- | --- | --- |
| GET / | anonymous | Comprobación de estado |
| GET /api/auth/whoami | viewer | Identidad del certificado |
| GET /api/test/viewer | viewer | Prueba del rol de lectura |
| GET /api/test/operator | operator | Prueba del rol operator |
| GET /api/test/admin | admin | Prueba de lectura de admin |
| POST /api/test/admin-action | admin | Prueba de escritura de admin |

Estas rutas diagnostican el estado, la identidad y los permisos; no ejecutan operaciones de gestión del dispositivo. Los roles de certificado viewer/operator/admin y los roles de gestión READ/ADMIN/ROOT pertenecen a sistemas de identidad distintos y no son intercambiables.
