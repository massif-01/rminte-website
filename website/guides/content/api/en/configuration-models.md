# Configuration models

These models save hosts, commands, sources, actions, and rules that the device can use at runtime. Save a disabled example and read it back before enabling effects.

## Read the version before writing

With root, read automation.config.status and retain active_version. Put it at the top level of a write. After each successful write, use the new version for the next request. For rule updates, also carry the read revision as expected_revision. A conflict requires rereading and merging, not merely replacing the version token and replaying stale input.

The JSON objects below are complete request-shape examples. Replace CURRENT_VERSION, identifiers, addresses, keys, and variable names. Place model fields at the request top level; do not add a config wrapper except for explicitly shown subobjects.

restricted:true can indicate a metadata-only view. Use ADMIN for complete SSH host/command, rule, and action reads; automation.sources.list secrets still require ROOT. Writing definitions follows each endpoint's required role. Omitted secret fields are not empty values. Host/source updates merge with existing JSON; command/action updates should carry complete definitions. Rules use their own merge/revision checks; do not generalize one family's update behavior.

## SSH hosts

For ssh.hosts.add/update. This records where/how to connect and which key to use; hosts.* stores fingerprints instead.

```json
{"id":"example-host","active_version":"CURRENT_VERSION","host":"192.0.2.20","port":22,"username":"YOUR_USER","auth_type":"key","keyid":"example-key","enabled":true}
```

| Field | Type, limit, and meaning |
| --- | --- |
| id | Stable string, at most 31 bytes; must not already exist for add; must exist for update |
| host | Address string, at most 63 bytes |
| port | SSH integer port, normally22; use1-65535 |
| username | Remote user, at most 31 bytes; distinct from device login |
| auth_type | key/password; key is recommended for persistent definitions |
| keyid | Saved local SSH private-key ID, at most 31 bytes |
| enabled | Boolean, decoding default true |
| created_time | Optional unsigned 32-bit time value; normally retain the existing value |

The persistent model does not store a password field. password mode does not imply a saved remote password; immediate calls supply their own credentials. At most16 hosts. Address, key existence, and remote trust are checked separately.

## SSH commands

For ssh.commands.add/update. Saving does not execute a command. Use service_mode:false for short commands; managed long-running services use true and ssh.services.start.

```json
{"id":"example-command","active_version":"CURRENT_VERSION","host_id":"example-host","name":"Read OS","command":"uname -a","timeout_sec":30,"enabled":true,"service_mode":false}
```

| Field | Type, limit, and meaning |
| --- | --- |
| id / host_id | Strings, at most 31 bytes each; host_id references a saved host |
| name / command | Strings, at most63 /1023 bytes |
| desc / icon | Optional strings, at most127 /63 bytes; icon can be a display icon or path |
| expect_pattern / fail_pattern / extract_pattern | Optional match/extraction patterns, at most 127 bytes each |
| var_name | Optional result-variable prefix, at most 31 bytes |
| timeout_sec | 0-65535 seconds, default 30; not milliseconds |
| stop_on_match / nohup / enabled / service_mode | Booleans; enabled defaults true, others false |
| ready_pattern / service_fail_pattern | Service readiness/failure patterns, at most 127 bytes each |
| ready_timeout_sec / ready_check_interval_ms | Integers0-65535, seconds/milliseconds respectively; configure deliberately for services |
| created_time | Optional unsigned 32-bit time value |

Aliases are timeout, expectPattern, failPattern, extractPattern, varName, stopOnMatch, serviceMode, readyPattern, serviceFailPattern, readyTimeout, readyInterval. Prefer table names; avoid supplying both aliases. _object_id/runtime_instance represent persistent/runtime identity; retain returned values rather than inventing them. At most64 commands.

## Data sources

For automation.sources.add/update. Sources acquire data and map it to variables used by rules.

```json
{"id":"example-source","active_version":"CURRENT_VERSION","label":"Temperature","type":"rest","enabled":false,"poll_interval_ms":5000,"auto_discover":false,"rest_url":"https://example.com/status","rest_method":"GET","mappings":[{"path":"temperature","var":"compute.temperature"}]}
```

| Shared field | Type and meaning |
| --- | --- |
| id / label | Strings, at most63 /47 bytes |
| type | builtin/websocket/socketio/rest/variable strings, or corresponding integers0-4 |
| enabled / auto_discover | Booleans; auto_discover defaults true; example explicitly disables it |
| poll_interval_ms | Integer0-4294967295 milliseconds; update behavior depends on type; zero is not unlimited sampling |
| mappings | At most4: path up to 95 bytes, var up to 63 bytes, optional transform up to 63 bytes |

Mapping path/var also accept json_path/var_name. The path locates a field in data, such as temperature or cpu.cores[0].freq; it is not a URL. Verify transforms with known sample values.

| Type | Type-specific fields |
| --- | --- |
| websocket | ws_uri up to 95 bytes; ws_path legacy single-field path up to 63 bytes; reconnect_ms0-65535 ms |
| socketio | sio_url up to 95 bytes; sio_event up to 63 bytes |
| rest | rest_url up to 95 bytes; rest_method up to 7 bytes; rest_auth up to 47 bytes; rest_path legacy path up to 63 bytes |
| variable | var_name, var_prefix, var_watch_all; SSH data flows also use ssh_host_id, ssh_command, expect_pattern, fail_pattern, extract_pattern, timeout_sec |
| builtin | builtin object: type selects a built-in sample; GPIO uses pin, ADC uses channel/atten, computer state can use device_index |

String-type inputs also accept convenience aliases: WebSocket uri/json_path; Socket.IO url/event; REST url/method/auth_header/json_path. Prefer canonical fields above. Variable-source strings are generally at most 63 bytes, ssh_command 95 bytes, timeout_sec0-65535 seconds. For built-in numeric hardware type/channel IDs, start from existing definitions rather than guessing pins or channels.

## User variables

automation.variables.set writes; get/list reads. Name, source, readonly, and age matter in addition to value.

```json
{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}
```

value supports null, boolean, finite number, or a string up to 63 bytes. Normally omit value_type for inference. Explicit types are0=null,1=bool,2=int,3=float,4=string and must match. Integers use signed 32-bit range; other finite numeric values use floating point.

source_id defaults to user. create_only:true preserves an existing variable, so it does not establish that the new requested value was written. Readonly/system-source variables can reject changes. Temperature binding requires suitable numeric temperature variables; strings, invalid values, and stale data are not normal sensor readings.

## Action templates

automation.actions.add/update saves reusable actions. This example logs a message rather than controlling hardware.

```json
{"id":"example-action","active_version":"CURRENT_VERSION","name":"Record a message","enabled":true,"type":"log","async":false,"delay_ms":0,"log":{"level":3,"message":"Example action"}}
```

Shared fields: id up to 63 bytes, name 47 bytes, description 63 bytes; enabled defaults true, async false; delay_ms0-65535 milliseconds. created_at is an optional nonnegative integer time value, normally retained from the existing object.

| type | Type-specific subobject and fields |
| --- | --- |
| log | log: level, message up to 47 bytes |
| set_var | set_var: variable, value, optional value_type |
| ssh_cmd | ssh: host_ref, command, timeout_ms, async |
| ssh_cmd_ref | ssh_ref: cmd_id referencing a saved command |
| gpio | gpio: pin, level as a **boolean**, pulse_ms |
| device_ctrl | device: device, action using supported actions |
| cli | cli: command, var_name, timeout_ms |
| webhook | webhook: url, method, body_template |
| led | led: device, ctrl_type and fields for that display function |

Host references, variable names, command references, and device/action names are generally up to 63 bytes. Inline SSH/CLI commands and webhook URL are up to 95 bytes, method 7 bytes, body_template 63 bytes. Overlong fields are rejected; do not rely on truncation. Inline action commands have less capacity than saved ssh.commands.

### LED action fields

led.ctrl_type is fill/effect/brightness/off/text/image/qrcode/filter/filter_stop/text_stop. Supply fields for the chosen function, not every parameter from a direct LED API.

Shared display fields: device, index (255=all), color string or r/g/b, brightness0-255, effect, speed, duration_ms0-65535. Matrix fields: text up to 127 bytes, font31, image_path127, qr_text255, qr_ecc string L/M/Q/H, filter31, filter_params, center, loop, scroll, align, x/y, auto_pos for text positioning. scroll is none/left/right/up/down; align left/center/right; x/y signed 16-bit coordinates.

QR foreground uses qr_fg; background uses qr_bg_image. Explicit black is an intentional color, not an omitted value. filter_params uses named numeric options supported by the effect. Execution additionally requires supported hardware and valid paths/configuration. Save/read before deliberately testing an effect.

## Automation rules

automation.rules.add/update saves conditions and actions. Enabled rules can begin executing automatically; initially set enabled:false.

```json
{"id":"example-rule","active_version":"CURRENT_VERSION","name":"Temperature example","enabled":false,"logic":"and","cooldown_ms":10000,"conditions":[{"variable":"example.temperature","operator":"gt","value":50}],"actions":[{"type":"log","level":3,"message":"Temperature high"}]}
```

| Field | Type and meaning |
| --- | --- |
| id / name / icon | Strings, at most63 /47 /63 bytes; ID rejects separators/control characters |
| enabled | Boolean, default true; example explicitly disables it |
| manual_trigger / show_on_dashboard / allow_manual_trigger | Booleans for triggering/presentation, not caller privilege |
| cooldown_ms | Unsigned 32-bit milliseconds |
| revision | Rule revision; use read revision as expected_revision for update conditions |
| logic / conditions | and/or, default and; up to 255 conditions |
| actions | Up to 255 entries; enabled rule cannot have no actions |

A condition is {variable, operator, value}; operators eq/ne/lt/le/gt/ge/contains. Values follow the variable model. conditions:{logic, items:[...]} is also accepted; choose one representation.

Inline rule actions use **flat fields**: log has level/message, SSH has host_ref/command, GPIO has pin/level. Templates use nested subobjects instead. Inline SSH type is ssh; template type is ssh_cmd. A template_id reference takes precedence over cached inline fields.

Shared action fields: delay_ms, async, repeat_mode (once/while_true/count), repeat_count0-255, repeat_interval_ms0-65535, optional condition (condition model; null clears it). Select repetition with the action's effects in mind.

| Inline type | Flat fields |
| --- | --- |
| log / set_var | level/message; or variable/value/value_type |
| ssh / ssh_cmd_ref | host_ref/command/ssh_async/timeout_ms; or cmd_id |
| gpio / device_ctrl | pin/boolean level/pulse_ms; or device/action |
| webhook / cli | url/method/body_template; or command/var_name/timeout_ms |
| led | Flat device/ctrl_type/r/g/b etc.; ctrl_type uses an integer enum rather than template strings |

Prefer referencing a saved template for complex LED rules. Inline ctrl_type:0 fill,1 effect,2 brightness,3 off,4 text,5 image,6 qrcode,7 filter,8 filter_stop,9 text_stop. Inline qr_ecc is a character-code integer: L76/M77/Q81/H72.

filter_params remains its own object. Integer ranges: speed1-100; intensity/density/decay/amplitude0-255; scale1-100; levels 2-16; amount/saturation/frequency0-100; angle0-360; width1-16; wavelength1-32. These template/UI units differ from some direct LED filter units. Do not place an entire API request into the actions array.

## Module configuration

config.module.show returns the module's config object. Read existing fields before config.module.set changes one key. Modules: net/dhcp/wifi/nat/led/fan/device/system. See individual operations for all support. key is local to the module; preserve the value type.

config.module.save and dirty state are separate from automation active_version. Networking changes can interrupt access; record the access route first. WiFi views below ADMIN omit passwords.

## Monitoring widgets

ui.widgets stores frontend layout JSON; it does not create collectors. widgets is a frontend-interpreted array and may initially be empty. Start from ui.widgets.get and retain existing fields/IDs. refresh_interval is milliseconds, default 5000. Whole serialized configuration is limited to 4000 bytes. nvs_saved does not imply that a variable has data.

## Import, deletion, and source selection

Use preview then apply with the preview's preconditions. tscfg is complete package JSON as a **string**, not an arbitrary object. Hosts, commands, sources, and actions import use expected_digest/expected_credential. Rule import has different confirmation fields; see its reference.

Preview deletion impact before selecting ordinary deletion, replacement, or cascade. Deleting definitions does not automatically stop remote processes or revoke remote keys. SD/internal-backup selection replaces the configuration set; use automation.config.preview/apply rather than overwriting protected files.
