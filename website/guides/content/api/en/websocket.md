# WebSocket integration

Connect to `ws://10.10.99.97/ws`, replacing the address with your device IP. This channel provides telemetry, logs, controller commands, and interactive SSH. A successful connection alone does not authorize private functions.

## Authenticate and subscribe

Obtain token through HTTP login, then send:

```json
{"type":"auth","token":"YOUR_TOKEN"}
```

Wait for auth_ok; failure returns auth_error. Ordinary telemetry topics are currently public, but establishing authentication remains useful for protected functions. Authentication cannot elevate a READ session to ROOT.

```json
{"type":"subscribe","topic":"fan.status","params":{"interval":5000}}
```

Successful acknowledgement:

```json
{"type":"subscribed","topic":"fan.status","success":true}
```

Illustrative data envelope:

```json
{"type":"data","topic":"fan.status","timestamp":123,"data":{"fans":[]}}
```

timestamp is **seconds since start**; HTTP measurements and logs may use milliseconds. Subscription success is not proof that the first reading has arrived. If updates stop, inspect channel/source state and use HTTP readback as needed.

## Topics

| Topic | Default/minimum display interval | Content |
| --- | --- | --- |
| system.dashboard | 1000 ms | cpu/memory/info/network/power/fan/services; unavailable sections may be omitted |
| system.info | 5000 ms | Controller information |
| system.memory | 5000 ms | Controller memory |
| system.cpu | 1000 ms | Controller CPU |
| network.status | 5000 ms | Network status |
| power.status | 5000 ms | Power status |
| fan.status | 5000 ms | Fans |
| service.list | 5000 ms | Controller services |
| device.status | Event-driven, default 2000 ms | Computer state events, not a periodic complete snapshot |
| ota.progress | Event-driven, default 1000 ms | Device-wide progress; check HTTP progress and the version after restart |
| config.pack.validated | Event-driven, default 0 | Uploaded package validation, not configuration application |

params.interval is a nonnegative integer in milliseconds. The first eight periodic topics reject0 and raise smaller intervals to their minimum. An interval does not convert the last three event topics into polling. Re-subscribing to the same topic on a connection updates that subscription; it does not create a history queue.

Unsubscribe with `{"type":"unsubscribe","topic":"fan.status"}` and inspect unsubscribed/success. `{"type":"ping"}` receives pong. Pong does not establish session authorization or healthy telemetry.

## Logs

ADMIN or higher is required. Authenticate, then send log_subscribe. History also requires ADMIN.

| Outgoing type | Fields | Result/effect |
| --- | --- | --- |
| log_subscribe | minLevel, default VERBOSE | log_subscribed/minLevel, then type=log |
| log_set_level | minLevel | Changes this connection's filter, not all module output levels |
| log_get_history | limit default 500; minLevel ERROR; maxLevel VERBOSE | log_history with logs/total, bounded by buffer capacity |
| log_unsubscribe | None | Stops this connection's log stream |

Log entries contain timestamp in milliseconds since start, level, levelName, tag, message, and task. Levels 0-5 are NONE/ERROR/WARN/INFO/DEBUG/VERBOSE. Retention is bounded; reconnect does not automatically replay history.

## Controller command terminal

This terminal controls the management controller, not the Linux system on either computer. ROOT is required and commands can change hardware/configuration.

| Outgoing type | Fields | Result |
| --- | --- | --- |
| terminal_start | token | Binds and requests the terminal; connected includes prompt; occupancy returns terminal_busy/retry_after |
| terminal_input | data: complete command string | output/data messages, then done with code/output_incomplete/stopped |
| terminal_interrupt | None | Requests interruption; command_stopping may precede done |
| terminal_stop | None | Releases this connection's terminal, not a rollback of external effects |

Only one terminal owner is active at a time. Do not take over a live terminal. Missing output does not by itself prove execution failure. Prefer structured HTTP state APIs over parsing terminal output for a first integration.

## Interactive SSH Shell

ROOT is required. ssh_connect carries token and binds the connection. Verify remote fingerprints first; this Shell has no automatic unknown-fingerprint acceptance switch.

| Outgoing type | Fields | Result |
| --- | --- | --- |
| ssh_connect | token, host, user; optional port22/password for this remote login | ssh_status connecting/connected/error; this entry uses password authentication |
| ssh_input | data | Writes text; explicitly include required newlines |
| ssh_resize | width, height | Integers1-65535 for terminal columns/rows |
| ssh_signal | signal | Sends a supported signal; unsupported requests fail |
| ssh_disconnect | None | Disconnects this connection's Shell; observe final ssh_status |

Output uses ssh_output/data, status uses ssh_status/status/message. A connection controls only its own Shell. Do not replay input automatically after a failed control or disconnect; the remote side may have received it.

## HTTP-started streaming SSH

ssh.exec_stream starts through HTTP and returns session_id/boot_id/result_key. It is separate from the interactive Shell. Authenticate WebSocket before starting to avoid missing early events. Private events are delivered only to connections authorized for the initiating session.

| Incoming type | Fields and interpretation |
| --- | --- |
| ssh_exec_start | session_id, command and patterns; started, not completed |
| ssh_exec_output | session_id, output_offset, output_length, is_stderr, data_b64 |
| ssh_exec_match | session_id, expect_matched/fail_matched, optional extracted/is_final |
| ssh_exec_running | In-progress response from HTTP status query |
| ssh_exec_done | session_id, execution_status, exit_code, status/success and matches |
| ssh_exec_cancelled | session_id, execution_status; cancellation does not establish remote process termination |
| ssh_exec_error | session_id, error, optional stage/detail |

Decode data_b64 into bytes, verify output_length, and use output_offset to detect gaps/duplicates. Stream UTF-8 decoding across frames; characters can span messages.

Terminal results may include output_bytes/output_incomplete/collection_truncated/conditions_complete. **Execution completion, condition matching, and output completeness are separate.** exit_code=0 can coexist with missing output; incomplete matching is not a positive result. After disconnect, query ssh.exec_status with the receipt; it does not rerun the command or promise all historical output.

## Capacity and reconnection

This build allows eight WebSocket clients and 32 topic subscriptions service-wide. Large frames, slow clients, exclusive tasks, and shutdown can reject work. Input must be protocol JSON text, at most 64 KiB; do not use fragmentation as a file-upload mechanism. JSON depth limits also apply.

Reconnect with delay, reauthenticate, and restore subscriptions. Do not automatically repeat terminal_input, ssh_input, or HTTP controls. Display last-update age and stale/disconnected state so old values do not appear current.

The companion subscribe.js example uses a browser that can reach the device and needs no third-party libraries.
