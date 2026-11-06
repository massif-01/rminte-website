# SSH keys APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [key.delete](#keydelete) | Delete a key |
| [key.export](#keyexport) | Export public key |
| [key.exportPrivate](#keyexportprivate) | Export private key (only for exportable keys) |
| [key.generate](#keygenerate) | Generate a new key |
| [key.info](#keyinfo) | Get key info |
| [key.list](#keylist) | List all stored keys |

<a id="keydelete"></a>

## key.delete

Delete a key

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/key/delete`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Local key ID. | No default |
| `preview` | boolean | Optional | true previews associated hosts/runs; false deletes. | false |

### Request example

```json
{
  "id": "example-key",
  "preview": true
}
```

### Response and completion

Preview: data.hosts/runs/complete. Delete: data.id/deleted.

### Usage notes

Does not stop remote processes or remove public keys from authorized_keys. Deletion may remove the ability to verify/stop an existing run.

<a id="keyexport"></a>

## key.export

Export public key

**Methods**: GET / POST
**Path**: `/api/v1/key/export`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Local key ID. | No default |

### Request example

```json
{
  "id": "example-key"
}
```

### Response and completion

data.id/type/public_key/comment; public_key is OpenSSH text.

### Usage notes

Hidden-key reads require the appropriate role.

<a id="keyexportprivate"></a>

## key.exportPrivate

Export private key (only for exportable keys)

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/key/exportPrivate`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Local key ID. | No default |

### Request example

```json
{
  "id": "example-key"
}
```

### Response and completion

data.id/type/private_key/comment/warning.

### Usage notes

Requires ADMIN and exportable=true; keys are non-exportable by default. Treat the response as secret, not ordinary log content.

<a id="keygenerate"></a>

## key.generate

Generate a new key

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/key/generate`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Local key ID. | No default |
| `type` | string | Optional | rsa2048/rsa4096/ec256/ecdsa/ec384. | rsa2048 |
| `comment` | string | Optional | Public-key comment. | Empty |
| `alias` | string | Optional | Display alias. | Empty |
| `hidden` | boolean | Optional | Hide the key. | false |
| `exportable` | boolean | Optional | Permit later private-key export. | false |
| `request_id` | string | Optional | Optional request correlation value, fewer than 32 bytes, alphanumeric/hyphen only. | None |

### Request example

```json
{
  "id": "example-key",
  "type": "ec256",
  "exportable": false
}
```

### Response and completion

data.generated/id/type; failure may include failed_stage/esp_error/cleanup_complete/cleanup_error.

### Usage notes

Check generated. Existing IDs and generation failures are errors; keys are not automatically overwritten.

<a id="keyinfo"></a>

## key.info

Get key info

**Methods**: GET / POST
**Path**: `/api/v1/key/info`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Local key ID. | No default |

### Request example

```json
{
  "id": "example-key"
}
```

### Response and completion

data.id/type/type_desc/comment/alias/created/last_used/has_public_key/exportable/hidden.

<a id="keylist"></a>

## key.list

List all stored keys

**Methods**: GET / POST
**Path**: `/api/v1/key/list`
**Minimum access**: READ

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.keys/count/max_keys; metadata id/type/type_desc/comment/alias/created/last_used/has_pubkey/exportable/hidden.

### Usage notes

Below-ADMIN receives permitted key metadata only. Lists contain no private keys.
