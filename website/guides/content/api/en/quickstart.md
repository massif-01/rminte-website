# Quick start

Connect, log in, and read a protected measurement. Apart from creating and closing a login session, this sequence only reads status.

## Set the device address

Use the device's current IP address. WebUI and business APIs use HTTP port 80 by default, so no explicit port is normally needed. The API prefix is `/api/v1`. Replace the example address with your own device address:

```sh
export TS_BASE='http://10.10.99.97'
```

For connection problems, check the IP address, network, and service state. See [Troubleshooting](troubleshooting.md#cannot-connect).

## Read controller information

```sh
curl --connect-timeout 5 --max-time 15 \
  "$TS_BASE/api/v1/system/info"
```

Illustrative response excerpt:

```json
{"code":0,"data":{"app":{"name":"TianShanOS","version":"0.6.4","compile_date":"Nov 5 2026","compile_time":"10:00:00"},"chip":{"model":"ESP32-S3","cores":2},"uptime_ms":123456}}
```

Check HTTP status and then code. Version is at data.app.version; uptime_ms is milliseconds. Do not assume a top-level data.version field.

## Log in and retain the session

The default accounts are `admin` and `root`, both with initial password `rm01`. Log in and use the APIs permitted for that account. If you have changed the password, use your current password.

Set `umask 077` before creating login.json and restrict access to the file. This example uses the default admin account:

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

Successful data contains token, session_id, username, level, expires_in in seconds, and password_changed. Use token as the credential; session_id is only an identifier.

Use the returned token for subsequent calls. Access follows data.level and endpoint authorization. Password changes are an optional account-management operation through auth.change_password.

Handle password files, login responses, and tokens as credentials. Remove temporary credential files after use.

## Read a protected temperature

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
```

Illustrative excerpt:

```json
{"code":0,"data":{"temperature_c":42.5,"temperature_01c":425,"source":"variable","timestamp_ms":120000,"valid":true}}
```

temperature_c is Celsius; temperature_01c is tenths of a degree. Only use the reading as valid when valid:true. Missing or invalid data must not become 0 degrees in your monitoring system.

## Log out

```sh
curl --connect-timeout 5 --max-time 15 \
  -X POST -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/auth/logout"
unset TS_TOKEN
```

POST logout returns `{"success":true}`, rather than the usual code/data envelope. Scripts and connections using the session need a valid session again.

Next, choose a [task scenario](scenarios.md) or use the read-only Python example supplied with the editable documentation.
