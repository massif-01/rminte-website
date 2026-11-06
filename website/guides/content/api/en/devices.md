# Devices and names

TianshanOS manages both its controller and the connected computers. Identify the target before calling an API: their status values describe different things.

| User-facing name | API identifier | Purpose |
| --- | --- | --- |
| Management controller | system.* | TianshanOS version, memory, tasks, and controller restart |
| Inference computer | device:"agx" | Power state, power control, and reset; monitor.* provides compute telemetry |
| Application computer | device:"lpmu" | Power state, power control, reset, and upper-level network access setup |
| Cooling fans | fan.* and numeric id | RPM, control mode, temperature curve, and output limits |
| Touch light, board light, matrix display | touch, board, matrix | Colors, effects, images, QR codes, and text |
| Local storage | /sdcard/... and other supported paths | Files, configuration packages, and supported update materials |
| Remote host | Saved SSH host id/host | Server commands or managed processes; not necessarily one of the built-in computers |

Use agx and lpmu exactly as the API identifiers. For example, the application computer is still addressed as `{"device":"lpmu"}`.

## Interpret measurements correctly

- **Fan duty** is the output percentage, from 0 to 100. RPM is rotational speed. Unknown duty may be null; also check duty_valid.
- **Temperature source** may be a local sensor, compute telemetry, a variable, or a manual test value. Check the source, valid flag, and timestamp.
- **power_good** is a hardware power indication. It does not establish that the operating system or application is ready.
- **USB target** selects a shared USB route. Switching it can interrupt traffic on the previous route.
- **run_id** identifies a managed remote service run. A retained record does not establish that its process is still running; verify its status.
- **Operation receipt** contains an operation identifier and result credentials. Preserve the complete receipt rather than just a display name.

## Three stages of completion

1. The API accepts the request, for example by returning started:true.
2. The device action or remote process reaches the requested state.
3. Your application becomes ready, for example by passing a health check.

Confirm the stage your task requires. Restarting the controller, powering a computer, and starting its application are separate operations.
