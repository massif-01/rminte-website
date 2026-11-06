# Inicio rápido

Conecta con el dispositivo, inicia sesión y consulta una medición protegida. Salvo por abrir y cerrar la sesión, este procedimiento solo consulta el estado del dispositivo.

## Establecer la dirección del dispositivo

Usa la dirección IP actual del dispositivo. La interfaz web y las API de gestión utilizan HTTP en el puerto 80 de forma predeterminada, por lo que normalmente no es necesario indicar el puerto. El prefijo de las API es `/api/v1`. Sustituye la dirección del ejemplo por la de tu dispositivo:

```sh
export TS_BASE='http://10.10.99.97'
```

Si tienes problemas de conexión, comprueba la dirección IP, la red y el estado del servicio. Consulta [Solución de problemas](troubleshooting.md#cannot-connect).

## Leer información del controlador

```sh
curl --connect-timeout 5 --max-time 15 \
  "$TS_BASE/api/v1/system/info"
```

Extracto ilustrativo de la respuesta:

```json
{"code":0,"data":{"app":{"name":"TianShanOS","version":"0.6.4","compile_date":"Nov 5 2026","compile_time":"10:00:00"},"chip":{"model":"ESP32-S3","cores":2},"uptime_ms":123456}}
```

Comprueba el estado HTTP y después el valor de code. La versión está en data.app.version; uptime_ms se expresa en milisegundos. No presupongas que existe un campo data.version en el nivel superior.

## Iniciar sesión y conservar la sesión

Las cuentas predeterminadas son `admin` y `root`, ambas con contraseña inicial `rm01`. Inicia sesión y usa las API permitidas para esa cuenta. Si has cambiado la contraseña, usa la actual.

Ejecuta `umask 077` antes de crear login.json para restringir el acceso al archivo. Este ejemplo utiliza la cuenta admin predeterminada:

```json
{"username":"admin","password":"rm01"}
```

```sh
umask 077
curl --connect-timeout 5 --max-time 15 \
  -H 'Content-Type: application/json' --data-binary @login.json \
  "$TS_BASE/api/v1/auth/login" > login-response.json
export TS_TOKEN="$(python3 -c 'import json; r=json.load(open("login-response.json")); assert r["code"] == 0; print(r["data"]["token"])')"
```

Si la operación tiene éxito, data contiene token, session_id, username, level, expires_in (en segundos) y password_changed. Usa token para autenticarte; session_id es solo un identificador de sesión.

Usa el token recibido en las siguientes llamadas. El acceso depende de data.level y de los permisos de cada endpoint. Puedes cambiar la contraseña con auth.change_password; esta operación de gestión de la cuenta es opcional.

Trata los archivos de contraseñas, las respuestas de inicio de sesión y los tokens como credenciales. Elimina los archivos temporales de credenciales después de usarlos.

## Leer una temperatura protegida

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
```

Extracto ilustrativo:

```json
{"code":0,"data":{"temperature_c":42.5,"temperature_01c":425,"source":"variable","timestamp_ms":120000,"valid":true}}
```

temperature_c se expresa en grados Celsius y temperature_01c en décimas de grado. Usa la medición solo si valid:true. Tu sistema de supervisión no debe convertir un dato ausente o inválido en una temperatura de 0 grados.

## Finalizar la sesión

```sh
curl --connect-timeout 5 --max-time 15 \
  -X POST -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/auth/logout"
unset TS_TOKEN
```

La solicitud POST de cierre de sesión devuelve `{"success":true}`, en lugar de la estructura habitual code/data. Los scripts y las conexiones que utilizaban esa sesión necesitarán otra sesión válida.

Después, elige un [escenario de tarea](scenarios.md) o usa el ejemplo Python de solo lectura incluido con la documentación editable.
