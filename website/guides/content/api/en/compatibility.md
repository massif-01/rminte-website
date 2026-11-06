# Version and compatibility

This guide is based on **TianshanOS 0.6.4**. It remains useful for later versions where interfaces and procedures are unchanged. If parameters or results differ, follow the documentation for your installed version.

## Connections and accounts

| Item | Usage |
| --- | --- |
| Business API | HTTP, default port 80, prefix /api/v1; e.g. http://10.10.99.97 |
| Live messages | WebSocket, ws://device-address/ws |
| Default accounts | admin/root, both initially rm01; use the current password if changed |
| Session authentication | Login token in Authorization: Bearer |
| Access control | Minimum role per endpoint, with additional resource/version/ownership checks |

## Feature prerequisites

An available endpoint does not establish that all runtime dependencies are ready. Inspect the relevant status before use.

| Feature | Prerequisites |
| --- | --- |
| Temperature, fans, power, computers | Initialized drivers, existing targets, valid measurements |
| Compute telemetry | Running monitor, reachable host service, fresh valid data |
| Files and SD updates | Required storage mounted, file present, sufficient capacity; direct upload has a separate flow |
| SSH/SFTP and managed services | Network, credentials, host fingerprints, keys, saved configuration, task capacity |
| Automation | Loaded/enabled configuration, correct engine state, valid references, matching write versions |
| Configuration packages | Device/recipient identity and publisher trust; export also requires Developer capability |
| Device PKI and updates | Valid PKI material/time for diagnostics; complete compatible APP/WWW images for updates |
| Matrix content | Supported target and usable font/image files |

## Aliases and unsupported entries

config.pack.apply is retained but does not apply generic configuration; use the object-specific import. led.set writes pixel ranges. ota.upload_begin/end/abort control an upload, but no public upload_write data API is provided; ordinary integrations should use complete-image binary upload.

OTA retains upgrade_url/start_url and upgrade_file/start_file aliases. Prefer start_url/start_file for new integrations.

## mTLS diagnostic service

This separate certificate-authenticated service defaults to 443. It is not another port for /api/v1. Availability depends on PKI material, configuration, and service state. Bearer tokens do not replace client certificates.

| Method/path | Minimum certificate role | Purpose |
| --- | --- | --- |
| GET / | anonymous | Health |
| GET /api/auth/whoami | viewer | Certificate identity |
| GET /api/test/viewer | viewer | Read-role test |
| GET /api/test/operator | operator | Operator-role test |
| GET /api/test/admin | admin | Admin read test |
| POST /api/test/admin-action | admin | Admin write test |

These endpoints diagnose health, identity, and permissions rather than performing device business actions. Certificate viewer/operator/admin and business READ/ADMIN/ROOT belong to separate identity systems and cannot be interchanged.
