# Keep an integration running

## Manage login state

Keep one session per client process and reuse it for requests. Schedule renewal from expires_in; log in again after a clear authentication failure rather than on every poll. There are eight session slots shared by scripts and browsers. When slots are full, a new login may invalidate an older session for the same account.

Normal sessions expire after 86400 seconds in this build. Restart, logout, password changes, and revocation require reauthentication. Treat tokens as opaque credentials, not values to parse or construct.

## Poll or subscribe

Use HTTP for occasional reads and WebSocket for a continuously displayed dashboard. Subscribe only to required topics and unsubscribe when leaving a view. Display update intervals do not change hardware sampling or fan control periods.

After a disconnect, reconnect, authenticate, and restore subscriptions. Do not automatically repeat power commands, SSH execution, or updates. Telemetry and logs missed during disconnection are not guaranteed to be replayed.

## Track one operation

Streaming SSH uses session_id+boot_id+result_key; the execution session_id differs from the login session_id. OTA uses device-wide progress without a private operation receipt.

SSH result queries require the complete receipt and initiating login; cancellation may use just the execution session_id from that same login. Do not share receipts. Restart, replacement, or limited retention can make results unavailable; inspect the remote state then. Coordinate OTA start, cancellation, and progress through one maintenance process, since global state is not an exclusive private task.

## Timeouts and retries

Set connection and execution deadlines separately. Scans, network diagnostics, remote commands, and updates may take longer than ordinary reads. An HTTP timeout does not cancel server-side work.

Retry queries with bounded concurrency and increasing delay. For an uncertain write, inspect state first; repeat only when you know it did not start and still need it. Prefer an explicit desired state over toggle.

## Configuration changes

Read active_version before writing and refresh after a conflict. Rules may also require expected_revision. Do not overwrite complete objects from a filtered list response.

Record application version, build date/time, and the capabilities used by your integration. Identical version strings can identify different repaired builds. After an upgrade, review method, role, field, and deprecation changes.

## Operational records

Record time, target, operation type, business code, a brief reason, and non-secret operation identifiers. Store result credentials in controlled storage if retention is necessary. Ordinary logs should not contain Authorization, login bodies, private keys, or package secrets.
