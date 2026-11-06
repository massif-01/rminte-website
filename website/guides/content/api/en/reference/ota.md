# Updates and recovery APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [ota.abort](#otaabort) | Request firmware update cancellation |
| [ota.partitions](#otapartitions) | Inspect update partitions |
| [ota.progress](#otaprogress) | Read firmware update progress |
| [ota.rollback](#otarollback) | Roll back firmware |
| [ota.server.get](#otaserverget) | Read update-server configuration |
| [ota.server.set](#otaserverset) | Set update-server configuration |
| [ota.start_file](#otastart_file) | Start firmware update from SD |
| [ota.start_url](#otastart_url) | Start firmware update from a URL |
| [ota.status](#otastatus) | Read firmware update status |
| [ota.test_connection](#otatest_connection) | Probe an update URL |
| [ota.upgrade_file](#otaupgrade_file) | Compatibility alias for ota.start_file |
| [ota.upgrade_url](#otaupgrade_url) | Compatibility alias for ota.start_url |
| [ota.upload_abort](#otaupload_abort) | Abort firmware upload control |
| [ota.upload_begin](#otaupload_begin) | Begin firmware upload control |
| [ota.upload_end](#otaupload_end) | Finish firmware upload control |
| [ota.validate](#otavalidate) | Confirm healthy running firmware |
| [ota.version](#otaversion) | Read firmware version |
| [ota.www.abort](#otawwwabort) | Request WWW update cancellation |
| [ota.www.progress](#otawwwprogress) | Read WWW update progress |
| [ota.www.start](#otawwwstart) | Start WWW update from a URL |
| [ota.www.start_sdcard](#otawwwstart_sdcard) | Start WWW update from SD |

<a id="otaabort"></a>

## ota.abort

Request firmware update cancellation

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/abort`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.aborted=true; read the corresponding progress to confirm state.

### Usage notes

Acts on the current update, not a private task. Do not immediately start another update while state is unclear.

<a id="otapartitions"></a>

## ota.partitions

Inspect update partitions

**Methods**: GET / POST
**Path**: `/api/v1/ota/partitions`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.running/next each contain label/address/size/is_bootable; bootable partitions include version/project. Also includes can_rollback.

<a id="otaprogress"></a>

## ota.progress

Read firmware update progress

**Methods**: GET / POST
**Path**: `/api/v1/ota/progress`
**Minimum access**: READ

### Parameters

No business parameters.

See the shared [data model](../response-models.md#ota).

### Request example

```json
{}
```

### Response and completion

data.state/percent/total_size/received_size/message. state is idle/checking/downloading/verifying/writing/pending_reboot/error.

### Usage notes

This is device-wide progress, not a per-login task result. Poll after starting. 100 percent alone does not prove the device is running the new version.

<a id="otarollback"></a>

## ota.rollback

Roll back firmware

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/rollback`
**Minimum access**: ADMIN

### Parameters

No business parameters.

See the shared [data model](../response-models.md#ota).

### Request example

```json
{}
```

### Response and completion

Attempts to select the rollback partition and restart; the connection may close before a response. If returned, data.rolling_back=true.

### Usage notes

First check ota.partitions.can_rollback. Log in again after rollback and verify version/configuration compatibility. no_reboot is not supported.

<a id="otaserverget"></a>

## ota.server.get

Read update-server configuration

**Methods**: GET / POST
**Path**: `/api/v1/ota/server/get`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

ADMIN can read data.url/configured; lower roles receive configured only.

<a id="otaserverset"></a>

## ota.server.set

Set update-server configuration

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/server/set`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Required | Update-server URL, at most 255 characters; an empty string clears it. | No default |
| `save` | boolean | Optional | Persist the server address. | false |

### Request example

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "save": true
}
```

### Response and completion

data.url/saved.

### Usage notes

Setting the address does not start an update. The WWW URL can be derived from this address.

<a id="otastart_file"></a>

## ota.start_file

Start firmware update from SD

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/start_file`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `file` | string | file or path required | Absolute firmware file path; prefer file. | No default |
| `path` | string | Optional | Alias of file. | Not supplied |
| `auto_reboot` | boolean | Optional | Restart automatically after firmware completion. | true |
| `no_reboot` | boolean | Optional | Inverse alias of auto_reboot; overrides it when supplied. | Do not override |
| `allow_downgrade` | boolean | Optional | Allow an older version; image validation still applies. | false |
| `skip_verify` | boolean | Optional | Compatibility option for SD files. There is no TLS connection; it does not bypass firmware completeness checks. | false |

See the shared [data model](../response-models.md#ota).

### Request example

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### Response and completion

data.started/path.

### Usage notes

Start success means the request began. Read ota.progress and verify ota.status after restart. Use a complete image for this hardware and partition layout.

<a id="otastart_url"></a>

## ota.start_url

Start firmware update from a URL

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/start_url`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Required | HTTP or HTTPS URL of the complete firmware image, at most 2048 bytes. | No default |
| `auto_reboot` | boolean | Optional | Restart automatically after firmware completion. | true |
| `no_reboot` | boolean | Optional | Inverse alias of auto_reboot; overrides it when supplied. | Do not override |
| `allow_downgrade` | boolean | Optional | Allow an older version; image validation still applies. | false |
| `skip_verify` | boolean | Optional | Requests relaxed HTTPS server checks, subject to firmware TLS settings; the connection may still fail. Image completeness checks remain. Normally keep false. | false |

See the shared [data model](../response-models.md#ota).

### Request example

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### Response and completion

data.started/url.

### Usage notes

Start success means the request began. Read ota.progress and verify ota.status after restart. Use a complete image for this hardware and partition layout.

<a id="otastatus"></a>

## ota.status

Read firmware update status

**Methods**: GET / POST
**Path**: `/api/v1/ota/status`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.state/running/next/pending_verify; rollback_timeout when verification is pending. Partitions include label/address/size and available version information.

### Usage notes

size is bytes. After writing, restart and confirm the running version.

<a id="otatest_connection"></a>

## ota.test_connection

Probe an update URL

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/test_connection`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Required | Update-file URL to probe. | No default |

### Request example

```json
{
  "url": "http://updates.example.com/firmware.bin"
}
```

### Response and completion

data contains success and connection diagnostics.

### Usage notes

Makes a real network request. Connectivity does not establish image installability.

<a id="otaupgrade_file"></a>

## ota.upgrade_file

Compatibility alias for ota.start_file

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/upgrade_file`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `file` | string | file or path required | Absolute firmware file path; prefer file. | No default |
| `path` | string | Optional | Alias of file. | Not supplied |
| `auto_reboot` | boolean | Optional | Restart automatically after firmware completion. | true |
| `no_reboot` | boolean | Optional | Inverse alias of auto_reboot; overrides it when supplied. | Do not override |
| `allow_downgrade` | boolean | Optional | Allow an older version; image validation still applies. | false |
| `skip_verify` | boolean | Optional | Compatibility option for SD files. There is no TLS connection; it does not bypass firmware completeness checks. | false |

See the shared [data model](../response-models.md#ota).

### Request example

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### Response and completion

data.started/path.

### Usage notes

Compatibility alias with the parameters, permissions, and results of ota.start_file.

<a id="otaupgrade_url"></a>

## ota.upgrade_url

Compatibility alias for ota.start_url

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/upgrade_url`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Required | HTTP or HTTPS URL of the complete firmware image, at most 2048 bytes. | No default |
| `auto_reboot` | boolean | Optional | Restart automatically after firmware completion. | true |
| `no_reboot` | boolean | Optional | Inverse alias of auto_reboot; overrides it when supplied. | Do not override |
| `allow_downgrade` | boolean | Optional | Allow an older version; image validation still applies. | false |
| `skip_verify` | boolean | Optional | Requests relaxed HTTPS server checks, subject to firmware TLS settings; the connection may still fail. Image completeness checks remain. Normally keep false. | false |

See the shared [data model](../response-models.md#ota).

### Request example

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### Response and completion

data.started/url.

### Usage notes

Compatibility alias with the parameters, permissions, and results of ota.start_url.

<a id="otaupload_abort"></a>

## ota.upload_abort

Abort firmware upload control

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/upload_abort`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.aborted.

<a id="otaupload_begin"></a>

## ota.upload_begin

Begin firmware upload control

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/upload_begin`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `size` | integer | Required | Positive total firmware byte count, also limited by the target partition. | No default |

### Request example

```json
{
  "size": 1048576
}
```

### Response and completion

data.ready/expected_size.

### Usage notes

This controls an upload. There is no public upload_write API for data, so begin/end alone cannot transfer firmware. Ordinary integrations should use the complete-file binary route.

<a id="otaupload_end"></a>

## ota.upload_end

Finish firmware upload control

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/upload_end`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `auto_reboot` | boolean | Optional | Restart automatically on completion. | true |

### Request example

```json
{
  "auto_reboot": false
}
```

### Response and completion

data.completed/reboot_pending.

### Usage notes

Requires an active upload with complete data. Fails when no upload is active.

<a id="otavalidate"></a>

## ota.validate

Confirm healthy running firmware

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/validate`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.validated.

### Usage notes

Confirmation changes rollback state. First confirm the running version and application health.

<a id="otaversion"></a>

## ota.version

Read firmware version

**Methods**: GET / POST
**Path**: `/api/v1/ota/version`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.version/project/compile_date/compile_time/idf_version.

<a id="otawwwabort"></a>

## ota.www.abort

Request WWW update cancellation

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/www/abort`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.aborted=true; read the corresponding progress to confirm state.

### Usage notes

Acts on the current update, not a private task. Do not immediately start another update while state is unclear.

<a id="otawwwprogress"></a>

## ota.www.progress

Read WWW update progress

**Methods**: GET / POST
**Path**: `/api/v1/ota/www/progress`
**Minimum access**: READ

### Parameters

No business parameters.

See the shared [data model](../response-models.md#ota).

### Request example

```json
{}
```

### Response and completion

data.state/percent/total/received/message/running. Completion uses state=completed and running=false.

### Usage notes

This is device-wide progress, not a per-login task result. Poll after starting. 100 percent alone does not prove the device is running the new version.

<a id="otawwwstart"></a>

## ota.www.start

Start WWW update from a URL

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/www/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `url` | string | Optional | HTTP or HTTPS URL of www.bin. Limit the complete URL to 255 bytes; longer input may not be retained in full. | Derived from configured update server |
| `skip_verify` | boolean | Optional | Requests relaxed HTTPS server checks, subject to firmware TLS settings; the connection may still fail. Image completeness checks remain. Normally keep false. | false |

See the shared [data model](../response-models.md#ota).

### Request example

```json
{
  "url": "http://updates.example.com/www.bin"
}
```

### Response and completion

data.status=started/url.

### Usage notes

Use the complete www.bin matching the firmware, not an individual HTML file. Then read ota.www.progress.

<a id="otawwwstart_sdcard"></a>

## ota.www.start_sdcard

Start WWW update from SD

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/ota/www/start_sdcard`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `file` | string | Required | Absolute file path of the WWW image. Limit it to 255 bytes; longer input may not be retained in full. | No default |

See the shared [data model](../response-models.md#ota).

### Request example

```json
{
  "file": "/sdcard/www.bin"
}
```

### Response and completion

data.status=started/file.
