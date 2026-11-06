# Configuration packages APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [config.pack.apply](#configpackapply) | Unsupported generic configuration application |
| [config.pack.content](#configpackcontent) | Decrypt and get content of imported config pack |
| [config.pack.export](#configpackexport) | Export configuration as encrypted .tscfg |
| [config.pack.export_cert](#configpackexport_cert) | Export device certificate for encryption |
| [config.pack.import](#configpackimport) | Validate an uploaded .tscfg file in place |
| [config.pack.info](#configpackinfo) | Get config pack system information |
| [config.pack.list](#configpacklist) | List .tscfg files in directory |
| [config.pack.verify](#configpackverify) | Verify a .tscfg package signature |

<a id="configpackapply"></a>

## config.pack.apply

Unsupported generic configuration application

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/pack/apply`
**Minimum access**: ADMIN

**Unsupported operation.** The name is retained to explicitly reject obsolete calls.

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |

### Request example

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Response and completion

data.success=false with unsupported result_code/reason. No configuration is applied even if top-level code=0.

### Usage notes

Generic apply is unsupported. Use the object's dedicated import flow.

<a id="configpackcontent"></a>

## config.pack.content

Decrypt and get content of imported config pack

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/pack/content`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Package name as used by package storage. | No default |

### Request example

```json
{
  "name": "example"
}
```

### Response and completion

data.name/content/content_raw; content is structured when parseable JSON.

### Usage notes

Trusted administrative reads only. Keep configuration secrets out of public logs.

<a id="configpackexport"></a>

## config.pack.export

Export configuration as encrypted .tscfg

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/pack/export`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `name` | string | Required | Package name. | No default |
| `content` | object / string | Required | Configuration content to encrypt; must be JSON-encodable. | No default |
| `recipient_cert` | string | Required | Recipient device certificate PEM. | No default |
| `description` | string | Optional | Package description. | Empty |
| `save_path` | string | Optional | Optional SD save path. | Do not save a device file |

### Request example

```json
{
  "name": "example",
  "content": {
    "example": true
  },
  "recipient_cert": "RECIPIENT_CERTIFICATE_PEM"
}
```

### Response and completion

data.tscfg/filename/size; successful requested file save also includes saved_path.

### Usage notes

Requires local Developer export capability. The destination still validates and explicitly imports the package.

<a id="configpackexport_cert"></a>

## config.pack.export_cert

Export device certificate for encryption

**Methods**: GET / POST
**Path**: `/api/v1/config/pack/export_cert`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.certificate/fingerprint/cn; public material for encrypting to this device, not a private key.

<a id="configpackimport"></a>

## config.pack.import

Validate an uploaded .tscfg file in place

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/pack/import`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `content` | string | content or path required | Raw package JSON text, not an arbitrary Base64 payload. | No default |
| `path` | string | content or path required | Absolute path of an uploaded package on the device. | No default |

### Request example

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Response and completion

Success data:valid/result_code/result_message/reason/path/saved_path,name/description/source_file/target_device/created_at,signature. Invalid packages return a business error.

### Usage notes

content can save a verified package to package storage; path validates in place. Neither applies business configuration. Use the relevant object's import.

<a id="configpackinfo"></a>

## config.pack.info

Get config pack system information

**Methods**: GET / POST
**Path**: `/api/v1/config/pack/info`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.can_export/device_type/cert_fingerprint/cert_cn/cert_ou/pack_version/algorithm.

<a id="configpacklist"></a>

## config.pack.list

List .tscfg files in directory

**Methods**: GET / POST
**Path**: `/api/v1/config/pack/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Optional | Absolute directory path. | /sdcard/config |

### Request example

```json
{
  "path": "/sdcard/config"
}
```

### Response and completion

data.files/count; entries name/path/size/mtime/valid and available issuer information.

<a id="configpackverify"></a>

## config.pack.verify

Verify a .tscfg package signature

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/config/pack/verify`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `content` | string | content or path required | Raw package JSON text, not an arbitrary Base64 payload. | No default |
| `path` | string | content or path required | Absolute path of an uploaded package on the device. | No default |

### Request example

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Response and completion

data.valid/result_code/result_message/reason/signature. Signature has valid/is_official/signer_cn/signer_ou/signed_at.

### Usage notes

Check nested valid/reason. Generic validation does not establish configuration import.
