# Ejemplos incluidos

El PDF incluye read_status.py y subscribe.js como archivos adjuntos. Guárdalos con un lector de PDF que admita adjuntos; la documentación editable incluye los mismos archivos. Las direcciones, tokens y rutas de certificados de ejemplo no son valores reales del dispositivo.

## Copiar un ejemplo de código

Los bloques contienen texto seleccionable sin números de línea mezclados con el código. Para conservar exactamente la sangría y los saltos de línea, utiliza el clip de la esquina superior derecha para guardar el archivo de origen indicado, o guárdalo desde el panel de adjuntos del lector de PDF.

Si tu lector no admite adjuntos, el paquete de descarga incluye todos los ejemplos originales en code-examples/en con los mismos nombres de archivo. Guarda el JSON de solicitud de la API correspondiente como request.json. Los ejemplos de respuesta y los mensajes WebSocket cumplen las funciones descritas en cada capítulo. Sustituye las direcciones, tokens y demás valores de ejemplo antes de utilizarlos.

## Consulta de solo lectura en Python

Basta con Python 3 y su biblioteca estándar. Usa la dirección de tu dispositivo y ejecuta:

```sh
python3 read_status.py --base 'http://10.10.99.97' \
  --user admin
```

Introduce la contraseña en el campo oculto, no en el historial de comandos. El script inicia sesión, consulta el estado e intenta cerrar la sesión. No controla el hardware, ejecuta tareas remotas ni realiza actualizaciones. No sigue redirecciones ni reintenta de forma automática. Comprueba valid/duty_valid y los demás indicadores de medición de la salida.

## Suscripción en el navegador

subscribe.js exporta watchTianShan como módulo ES sin bibliotecas de terceros. Usa un navegador con acceso al dispositivo. Obtén primero un token mediante el inicio de sesión HTTP:

```javascript
import {watchTianShan} from './subscribe.js';
const close = watchTianShan({
  baseUrl: 'http://10.10.99.97',
  token: yourLoginToken,
  onData: message => renderYourDashboard(message.data),
  onState: state => showConnectionState(state)
});
```

Tu página debe proporcionar renderYourDashboard/showConnectionState. Llama a close() al salir. Tras una desconexión, marca las mediciones como desactualizadas antes de restablecer la autenticación y las suscripciones. No incluyas tokens en el código fuente, las URL ni los registros ordinarios. El ejemplo no vuelve a conectar automáticamente ni repite acciones.
