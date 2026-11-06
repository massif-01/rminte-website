# Task scenarios

Examples use TS_BASE and TS_TOKEN from the [quick start](quickstart.md). Replace addresses, object IDs, configuration versions, and receipts with actual values. Control examples have real effects: use only the task you intend to perform.

## Monitor the device

Read temperatures, cooling, power, and computer status into your monitoring system. Log in for READ capabilities; some overview endpoints are public.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/temp/read"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/fan/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/power/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/device/status?device=agx"
```

Retain temperature valid, fan duty_valid, power valid/crc_valid, and last update times. Display invalid or disconnected states explicitly. duty is a percentage; rpm is rotational speed. Computer state=on does not establish application readiness. See [Response models](response-models.md).

Successful monitoring means valid readings that keep updating. Use WebSocket for a continuous dashboard. For invalid temperatures, inspect temp.sources; for compute telemetry problems, inspect monitor.status. Do not replace missing values with zero. The supplied Python example performs login, reads, and logout only.

## Control a computer

ADMIN is required. First read device.status to identify agx or lpmu and its current state. Use an explicit on/off action rather than repeating toggle after a timeout.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"agx","action":"on"}' \
  "$TS_BASE/api/v1/device/power"
```

Then GET device.status and inspect state/power_good. Confirm application readiness on the target computer or through a business health endpoint. For normal shutdown use off. force_off/reset interrupt work and can lose data; arrange target-system maintenance first.

To switch USB, POST device.usb.set with `{"target":"agx"}`, then GET device.usb.status. Other targets are esp32/lpmu/disconnect. The old route may disconnect during the switch; that alone is not a device fault.

After a timeout, query state before retrying. Preserve error state, power indication, and details if the target does not reach the expected state.

## Adjust lights and fans

Routine LED operations need ADMIN. GET led.list to obtain a device name, then fill it:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"board","color":"#00A0FF"}' \
  "$TS_BASE/api/v1/led/fill"
```

Read led.list again. To use the display after restart, separately POST led.save with `{"device":"board"}` and inspect saved. Displaying and saving startup settings are different steps.

For fans, read fan.status/config first. POST fan.set with `{"id":0,"duty":50}` only after obtaining the actual fan ID. fan.mode selects off/manual/auto/curve. Curve, limits, and persistence permissions are listed in the [Fan reference](reference/fan.md).

Check duty_valid/duty/target_duty, temperature, and faults after changing output. Restore the intended control mode after a temporary manual setting.

## Manage remote tasks

Use ssh.exec/exec_stream for a one-off command; use a saved SSH command and run record for a continuously managed service. Raw command execution requires ROOT; starting an existing managed service requires at least ADMIN.

Before starting, confirm reachability, a verified host fingerprint, and a saved host referencing a valid SSH key. Unknown/changed fingerprints are verified through ssh.test and trusted information, not by clearing trust or automatically accepting.

1. With root, read ssh.hosts and ssh.commands. Check host, command, service_mode, and readiness matching. See [Configuration models](configuration-models.md).
2. Read the latest active_version and start the saved service:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"command_id":"YOUR_SERVICE_COMMAND_ID","active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/ssh/services/start"
```

3. Retain run_id and operation_id. POST automation.services.status with `{"run_id":"YOUR_RUN_ID","verify":true}`. Inspect operation_phase, busy, and state. verify connects to the original host; it is not just a local cache read.
4. Verify application health/readiness. To stop, POST automation.services.stop with the original run_id and continue querying status.

A run_id is not a ready indication; last_known is a previous observation. Deleting configuration or a local key does not stop remote processes. Use the original run identity rather than guessing a process by name.

For a one-off stream, authenticate WebSocket before POST ssh.exec_stream. Keep the complete receipt and use ssh.exec_status after interruption. Never rerun a command merely to retrieve missing output. See [Streaming SSH](websocket.md#http-started-streaming-ssh) for execution, matching, and output completeness.

## Configure automation

The flow is: acquire data, map it into variables, then execute an action when conditions hold. With root, read automation.status/config.status first. Resolve loading, enablement, pause, or SD-source selection issues before editing.

Start with a saved user variable:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/automation/config/status"
```

Use its active_version in the next request:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/automation/variables/set"
```

Read automation.variables.get with root to confirm value, readonly, and source_id. Retain the new active_version. Create an enabled:false rule from the [rule model](configuration-models.md#automation-rules); use a log action before adding power or remote-execution effects.

Add a real data source only when needed. Verify data arrival, variable updates, and stale status before enabling the rule. Saving a definition, enabling configuration, starting the engine, and executing actions are separate states; saved:true alone is insufficient.

Refresh and merge after a conflict. Preview deletion impact. Preview/apply SD or backup selection. Respect pause/busy results rather than overwriting managed files.

## Maintain the device

Choose one maintenance goal at a time so its effects can be checked.

| Goal | Sequence | Completion |
| --- | --- | --- |
| Back up an object | Export with the role required by that object; save tscfg; preview any later import | Complete package retained and verifiable; export is not recovery |
| Save a file | Upload, inspect attributes, download and compare | Intended path, length, and bytes |
| Update firmware/WWW | Check matching images, transfer, read global progress, confirm state, restart if needed | Correct running identity/version and working application |
| Change networking | Record old access/configuration, change, save, reconnect | Management and target networking both work |
| Change a password | change_password, log in again, update client sessions | New credentials work; old sessions are no longer assumed valid |
| Install identity certificate | Check CSR/key match, install, inspect cert.status and client trust | Correct material, actual loaded identity, and verified client connection |

See [Transfers and updates](transfers.md) for complete requests and capacity limits. cert.* manages device identity, key.* manages SSH keys, and hosts.* manages remote fingerprints. After failure, establish which stages took effect before retrying or recovering.
