# Troubleshooting

Record method, path, HTTP status, business code, reason, and operation receipt. Keep passwords, tokens, private keys, and full authorization headers out of support tickets.

## Cannot connect

Use the current HTTP device address, such as http://10.10.99.97. The default port is80 and need not be written explicitly. Check the address, network reachability, and WebUI service state.

A working mTLS diagnostic page on443 does not prove the business API is running. Once the public system.info request works, investigate login and the target feature.

## Authentication or permission failure

HTTP401 usually means a missing, invalid, or expired session;403 usually means insufficient privilege. Some handlers report authorization errors as business errors within HTTP200.

Log in again and inspect data.level. Admin can use ADMIN configuration and maintenance APIs; raw SSH execution, automation definition writes, and selected account management still require ROOT. Initial default passwords are rm01; use the current password if it has been changed. Password changes revoke affected sessions. Wait out login lockout instead of launching repeated concurrent retries.

## Missing temperatures or telemetry

Inspect temp.sources for validity, update time, age, and source. Variable temperature input can be partly stale, so check valid weights/counts. monitor.data depends on a monitoring service on the compute host; inspect monitor connection and address configuration. Powered-on hardware does not guarantee telemetry has arrived.

## Accepted but unfinished

Preserve and query the receipt or run record. SSH requires final status, exit code, and output completeness; managed services require verified state; OTA requires device-wide progress, partition state, and the running version after restart. started, cancel_requested, or a historical record alone is insufficient.

## Configuration changed

For configuration_changed or a version conflict, reread current state and the relevant object. Compare and merge your unsaved input before submitting the new version. Do not simply replace the version token and repeat a delete/import/overwrite request.

## Save failed or outcome unknown

Inspect applied, persisted, saved, uncertain, result_unknown, and the reason. Runtime state can change even when persistence fails. Read it back, then check saved startup configuration or backups as applicable. A network failure does not establish that the request had no effect.

## SSH fingerprint changed

Stop automatic retries and obtain the current fingerprint from the server administrator. Check for reinstall, replacement, or address reassignment. Use the documented confirmation fields only after verification. An identical address does not guarantee the same host.

## Busy or at capacity

Reduce concurrency, reuse sessions, and close unused subscriptions or terminals. Inspect active work. Tasks cannot queue indefinitely because a client keeps retrying. Wait for your own task's stop sequence; do not take over another connection's work.

## Upload or update failed

Check role, complete request delivery, path, SD status, free capacity, target partition size, and complete images for the hardware/partition layout. Uploaded does not mean package validation or installation succeeded. For SSH, query the retained receipt; for OTA, inspect global progress and partition state before retrying, rolling back, or deleting recovery material.
