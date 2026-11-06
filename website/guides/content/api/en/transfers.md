# File transfer and updates

Ordinary files and APP/WWW images use dedicated binary routes. Bodies contain original file bytes; successful responses do not necessarily include code. These routes are separate from the 277 logical API names.

## Ordinary files

| Route | Method/access | Request and result |
| --- | --- | --- |
| /api/v1/file/download | GET, READ; ADMIN for sensitive paths | Absolute path in query; response is file bytes, not a directory |
| /api/v1/file/upload | POST, ADMIN | Destination path in query, original bytes in body; success returns path/size/status=uploaded |

HTTP uploads only allow validated ordinary files under `/sdcard/`. Other file operations, such as storage.rename/delete, have a different path scope; they do not allow HTTP upload to `/spiffs/` or `/www/`. Sensitive configuration and private-key reads require ADMIN. Managed automation directories, aliases, backups, and temporary files remain protected; edit them through object configuration APIs.

Uploads allow at most 16 MiB with a 300-second receive budget, also limited by memory, free space, and storage state. Supply one complete nonempty file. Repeated requests do not append chunks. Upload replaces an existing destination; preserve needed content first. URL-encode paths once.

Configure TS_BASE and TS_TOKEN before running:

```sh
curl --connect-timeout 5 --max-time 330 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @example.txt \
  "$TS_BASE/api/v1/file/upload?path=/sdcard/example.txt"

curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  --get --data-urlencode 'path=/sdcard/example.txt' \
  "$TS_BASE/api/v1/file/download" -o downloaded-example.txt
```

A .tscfg upload adds config_pack.valid/reason/signature information. uploaded means saved, not trusted or applied. Preview and apply through the object-specific import; config.pack.apply does not apply generic configuration. Ordinary data packages and command-bearing rule packages have different signing-usage checks; ordinary validation does not replace rule-import validation.

For file_replace_uncertain or a lost connection, inspect file metadata and download its contents before retrying.

## Prepare images

Obtain a complete APP firmware image and matching www.bin for the hardware, partition layout, and firmware version. A WWW image is not an individual HTML file. Back up configuration, ensure stable power and a maintenance window, and prepare a recovery path.

Downloads accept HTTP and HTTPS. HTTPS uses system certificate trust by default. skip_verify is a download option; it cannot fix damaged or incompatible images or insufficient capacity. Normally keep it false. Current start APIs do not accept a private-CA cert_pem parameter.

## Choose a transfer method

| Method | API | Requirements |
| --- | --- | --- |
| Device downloads | ota.start_url / ota.www.start | Device can reach the image server; check network and storage |
| SD file | ota.start_file / ota.www.start_sdcard | Mounted SD with complete image files |
| Client uploads | Dedicated binary routes below | Client has complete files; device has writable SD for staging and recovery cache |

| Route | Method/access | Options and success |
| --- | --- | --- |
| /api/v1/ota/firmware | POST, ADMIN | Complete APP body; auto_reboot query defaults true; status=success, size, message, reboot_pending, auto_reboot_requested |
| /api/v1/ota/www | POST, ADMIN | Complete www.bin body; status=success, size, message; no automatic restart |

Both allow at most 16 MiB with a 300-second receive budget, subject to target-partition capacity and memory. Firmware headers and installation completeness are checked. Successful upload saves SD recovery files and a manifest with automatic recovery disabled; application acceptance after restart remains a separate step.

This example disables automatic restart so the maintenance process can inspect the result first:

```sh
curl --connect-timeout 5 --max-time 600 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @firmware.bin \
  "$TS_BASE/api/v1/ota/firmware?auto_reboot=false"
```

firmware.bin is a client-side filename; replace it with the complete firmware image. This request writes to the device. With auto_reboot=true, restart is requested about 2 seconds after a successful response and the connection may close.

## Confirm progress and completion

After URL or SD initiation, read ota.progress, or ota.www.progress for WWW. Progress is device-wide without a private per-login task receipt. Coordinate updates through one maintenance process to avoid concurrent starts or cancelling another update.

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/ota/progress"
```

APP progress has state/percent/received_size/total_size/message. WWW uses received/total and adds running. pending_reboot means a restart is needed; error means failure. 100 percent alone does not prove the new version is running. To cancel, POST an empty object to ota.abort or ota.www.abort, then confirm state before starting again.

For binary uploads, use the HTTP response rather than assuming global progress identifies this request. HTTP409 with status=partial, error=recovery_cache_failed, and flash_written=true means Flash was written but the SD recovery cache was not fully saved. Inspect partitions and recovery files. A lost response also does not establish that no write occurred.

After firmware installation, restart as planned, log in again, inspect ota.status/partitions, and verify application health. ota.validate confirms the current firmware; call it after health checks.

## Rollback and SD recovery

Check ota.partitions.can_rollback before ota.rollback. Rollback may restart immediately. Reconnect and verify version, configuration compatibility, and application state.

SD recovery uses TianShanOS.bin, www.bin, and manifest.json under `/sdcard/recovery/`. armed controls whether recovery is enabled; force controls version comparison. Existing files do not establish enabled recovery. Follow the publisher's recovery procedure because recovery affects a later boot and persistent storage; uploading files alone does not prove success.

No recovery preparation, status, or authorization API is exposed. Do not invent routes or treat ota.upload_begin/end/abort as a complete segmented-transfer protocol. Ordinary integrations should use the binary routes above.
