# Device files APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [storage.delete](#storagedelete) | Delete file or directory |
| [storage.info](#storageinfo) | Get file info |
| [storage.list](#storagelist) | List directory contents |
| [storage.mkdir](#storagemkdir) | Create directory |
| [storage.mount](#storagemount) | Mount SD card |
| [storage.read](#storageread) | Read file content |
| [storage.rename](#storagerename) | Rename/move file |
| [storage.status](#storagestatus) | Get storage status |
| [storage.unmount](#storageunmount) | Unmount SD card |

<a id="storagedelete"></a>

## storage.delete

Delete file or directory

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/storage/delete`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |

### Request example

```json
{
  "path": "/sdcard/example.txt"
}
```

### Response and completion

data.deleted contains the deleted path.

### Usage notes

Allows permitted paths under /sdcard/, /spiffs/, and /www/. Directories may be deleted recursively; managed configuration and storage roots remain protected.

<a id="storageinfo"></a>

## storage.info

Get file info

**Methods**: GET / POST
**Path**: `/api/v1/storage/info`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |

### Request example

```json
{
  "path": "/sdcard/example.txt"
}
```

### Response and completion

data.path/name/type/size/modified. modified is filesystem Unix seconds.

<a id="storagelist"></a>

## storage.list

List directory contents

**Methods**: GET / POST
**Path**: `/api/v1/storage/list`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Optional | Absolute directory path. | /sdcard |
| `recursive` | boolean | Optional | Recursion is unimplemented; even true lists only this directory. Prefer omission. | false |

### Request example

```json
{
  "path": "/sdcard"
}
```

### Response and completion

data.path/entries with name/type/size etc. Sensitive-directory listing requires ADMIN.

<a id="storagemkdir"></a>

## storage.mkdir

Create directory

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/storage/mkdir`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |

### Request example

```json
{
  "path": "/sdcard/example"
}
```

### Response and completion

data.created contains the directory path.

<a id="storagemount"></a>

## storage.mount

Mount SD card

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/storage/mount`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.status; mount also includes path.

### Usage notes

Affects operations using SD. End file/update work before unmounting.

<a id="storageread"></a>

## storage.read

Read file content

**Methods**: GET / POST
**Path**: `/api/v1/storage/read`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `path` | string | Required | Absolute device path; managed configuration and sensitive files have additional restrictions. | No default |

### Request example

```json
{
  "path": "/sdcard/example.txt"
}
```

### Response and completion

data.path/size/type/content; content is parsed JSON for type=json, a string for type=text.

### Usage notes

Maximum 8192-byte file. Sensitive paths require ADMIN. Use dedicated download for binary/large files.

<a id="storagerename"></a>

## storage.rename

Rename/move file

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/storage/rename`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `from` | string | Required | Original absolute path. | No default |
| `to` | string | Required | Destination absolute path. | No default |

### Request example

```json
{
  "from": "/sdcard/example.txt",
  "to": "/sdcard/renamed.txt"
}
```

### Response and completion

data.from/to.

### Usage notes

Both paths must be within permitted /sdcard/, /spiffs/, or /www/ locations and pass managed-path checks. Filesystem and mount state can still limit moves.

<a id="storagestatus"></a>

## storage.status

Get storage status

**Methods**: GET / POST
**Path**: `/api/v1/storage/status`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.sd/spiffs with mounted and available path.

<a id="storageunmount"></a>

## storage.unmount

Unmount SD card

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/storage/unmount`
**Minimum access**: ADMIN

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.status; mount also includes path.

### Usage notes

Affects operations using SD. End file/update work before unmounting.
