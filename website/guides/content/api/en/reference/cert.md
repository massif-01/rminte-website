# Device certificates APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [cert.delete](#certdelete) | Delete all PKI credentials |
| [cert.generate_csr](#certgenerate_csr) | Generate Certificate Signing Request |
| [cert.generate_keypair](#certgenerate_keypair) | Generate ECDSA P-256 key pair |
| [cert.get_certificate](#certget_certificate) | Get device certificate PEM |
| [cert.install](#certinstall) | Install signed certificate |
| [cert.install_ca](#certinstall_ca) | Install CA certificate chain |
| [cert.status](#certstatus) | Read certificate and diagnostic-service status |

<a id="certdelete"></a>

## cert.delete

Delete all PKI credentials

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/cert/delete`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `confirm` | boolean | Required | Explicit true confirms deletion of local PKI material. | No default |

### Request example

```json
{
  "confirm": true
}
```

### Response and completion

data.success/message.

### Usage notes

Can change the separate HTTPS diagnostic-service identity or return it to an initial-certificate state. Does not revoke a certificate at its issuer.

<a id="certgenerate_csr"></a>

## cert.generate_csr

Generate Certificate Signing Request

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/cert/generate_csr`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `device_id` | string | Optional | Device identifier for the certificate subject. | Build-configured device ID |
| `organization` | string | Optional | Organization name. | RMinte |
| `org_unit` | string | Optional | Organizational unit. | Device |

### Request example

```json
{
  "device_id": "YOUR_DEVICE_ID",
  "organization": "YOUR_ORG",
  "org_unit": "Device"
}
```

### Response and completion

data.success/csr_pem. Give the CSR to a trusted issuer; it contains no private key.

<a id="certgenerate_keypair"></a>

## cert.generate_keypair

Generate ECDSA P-256 key pair

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/cert/generate_keypair`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `force` | boolean | Optional | Request regeneration when identity material already exists. | false |

### Request example

```json
{}
```

### Response and completion

data.success/message.

### Usage notes

Replacing the identity key can invalidate the existing certificate match. Plan maintenance first. This is not a key.* SSH key.

<a id="certget_certificate"></a>

## cert.get_certificate

Get device certificate PEM

**Methods**: GET / POST
**Path**: `/api/v1/cert/get_certificate`
**Minimum access**: Public

### Parameters

No business parameters.

### Request example

```json
{}
```

### Response and completion

data.cert_pem is the device certificate PEM, without private key.

<a id="certinstall"></a>

## cert.install

Install signed certificate

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/cert/install`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `cert_pem` | string | Required | PEM certificate, at most 3999 content bytes; must match the existing device private key. | No default |

### Request example

```json
{
  "cert_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### Response and completion

data.success/message/cert_info with subject_cn/issuer_cn/not_before/not_after/validity/time_ready and expiry information.

### Usage notes

Check certificate storage, validity, and loading by the separate HTTPS diagnostic service independently. Business APIs remain on HTTP80. Read cert.status after installation.

<a id="certinstall_ca"></a>

## cert.install_ca

Install CA certificate chain

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/cert/install_ca`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `ca_pem` | string | Required | Trusted CA-chain PEM; parsing and capacity checks apply. | No default |

### Request example

```json
{
  "ca_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### Response and completion

data.success/message.

### Usage notes

CA material affects trust. Install only administrator-verified chains.

<a id="certstatus"></a>

## cert.status

Read certificate and diagnostic-service status

**Methods**: GET / POST
**Path**: `/api/v1/cert/status`
**Minimum access**: Public

### Parameters

No business parameters.

See the shared [data model](../response-models.md#certificate).

### Request example

```json
{}
```

### Response and completion

data.has_private_key/has_certificate/has_ca_chain; certificate information, time_ready/validity/blocked_by, and the separate HTTPS diagnostic-service runtime are reported independently. See the certificate response model.
