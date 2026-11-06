# Remote files APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [sftp.get](#sftpget) | Download file via SFTP |
| [sftp.ls](#sftpls) | List remote directory via SFTP |
| [sftp.mkdir](#sftpmkdir) | Create remote directory via SFTP |
| [sftp.put](#sftpput) | Upload file via SFTP |
| [sftp.rm](#sftprm) | Delete remote file via SFTP |
| [sftp.stat](#sftpstat) | Get remote file information via SFTP |

<a id="sftpget"></a>

## sftp.get

Download file via SFTP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/sftp/get`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `remote` | string | Required | Absolute remote file path. | No default |
| `local` | string | Required | Absolute local device file path. | No default |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### Response and completion

data.remote/local/success; writes a local device file.

### Usage notes

Requires verified remote host trust and authentication. Failures do not automatically accept fingerprints. get has local write restrictions; put sends local content remotely.

<a id="sftpls"></a>

## sftp.ls

List remote directory via SFTP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/sftp/ls`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `path` | string | Required | Remote directory/file path. | No default |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Response and completion

data.path/files; entries name/size/is_dir/mtime/permissions.

### Usage notes

Requires verified remote host trust and authentication. Failures do not automatically accept fingerprints. get has local write restrictions; put sends local content remotely.

<a id="sftpmkdir"></a>

## sftp.mkdir

Create remote directory via SFTP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/sftp/mkdir`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `path` | string | Required | Remote directory/file path. | No default |
| `mode` | integer | Optional | Permission bits as a decimal JSON integer; octal 0755 is decimal 493. | 493 |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Response and completion

data.path/created.

### Usage notes

Requires verified remote host trust and authentication. Failures do not automatically accept fingerprints. get has local write restrictions; put sends local content remotely.

<a id="sftpput"></a>

## sftp.put

Upload file via SFTP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/sftp/put`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `remote` | string | Required | Absolute remote file path. | No default |
| `local` | string | Required | Absolute local device file path. | No default |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### Response and completion

data.remote/local/success; writes a remote file.

### Usage notes

Requires verified remote host trust and authentication. Failures do not automatically accept fingerprints. get has local write restrictions; put sends local content remotely.

<a id="sftprm"></a>

## sftp.rm

Delete remote file via SFTP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/sftp/rm`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `path` | string | Required | Remote directory/file path. | No default |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Response and completion

data.path/deleted.

### Usage notes

Requires verified remote host trust and authentication. Failures do not automatically accept fingerprints. get has local write restrictions; put sends local content remotely.

<a id="sftpstat"></a>

## sftp.stat

Get remote file information via SFTP

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/sftp/stat`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `host` | string | Required | SSH host address. | No default |
| `user` | string | Required | Remote username. | No default |
| `port` | integer | Optional | Port 1-65535. | 22 |
| `password` | string | Authentication alternative | Password for this remote login, not the TianshanOS account. | None |
| `keyid` | string | Authentication alternative | Saved SSH private-key ID on the device. | None |
| `keypath` | string | Supported immediate-call authentication alternative | Device private-key path; support varies by entry point. | None |
| `path` | string | Required | Remote directory/file path. | No default |

### Request example

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Response and completion

data.path/size/is_dir/is_link/uid/gid/permissions/atime/mtime.

### Usage notes

Requires verified remote host trust and authentication. Failures do not automatically accept fingerprints. get has local write restrictions; put sends local content remotely.
