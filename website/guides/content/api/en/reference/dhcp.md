# Address allocation APIs

[Complete index](README.md) | [Common rules](../conventions.md) | [Troubleshooting](../troubleshooting.md)

Examples are POST JSON bodies with illustrative values. Response descriptions refer to data unless explicitly stated otherwise.

| API | Purpose |
| --- | --- |
| [dhcp.clients](#dhcpclients) | List DHCP clients |
| [dhcp.start](#dhcpstart) | Start DHCP server |
| [dhcp.status](#dhcpstatus) | Get DHCP server status |
| [dhcp.stop](#dhcpstop) | Stop DHCP server |

<a id="dhcpclients"></a>

## dhcp.clients

List DHCP clients

**Methods**: GET / POST
**Path**: `/api/v1/dhcp/clients`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `interface` | string | Optional | ap/wifi or eth/ethernet. | Aggregate for queries; AP for start/stop |

### Request example

```json
{
  "interface": "ap"
}
```

### Response and completion

data.clients/count; leases include mac/ip/hostname/lease_start/lease_expire/is_static.

<a id="dhcpstart"></a>

## dhcp.start

Start DHCP server

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/dhcp/start`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `interface` | string | Optional | ap/wifi or eth/ethernet. | Aggregate for queries; AP for start/stop |

### Request example

```json
{
  "interface": "ap"
}
```

### Response and completion

data.interface/started.

<a id="dhcpstatus"></a>

## dhcp.status

Get DHCP server status

**Methods**: GET / POST
**Path**: `/api/v1/dhcp/status`
**Minimum access**: READ

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `interface` | string | Optional | ap/wifi or eth/ethernet. | Aggregate for queries; AP for start/stop |

### Request example

```json
{
  "interface": "ap"
}
```

### Response and completion

data.interfaces or one interface contains state/running, pool, gateway/dns/netmask/lease_min, and statistics. It also includes interface_present/restore_error/apply_error. eth adds want_running/link_up/resume_error; error code 0 means that step reported no error.

### Usage notes

want_running is the requested state, not running. Check interface presence, link state, and recovery errors separately; obtaining an address alone is insufficient.

<a id="dhcpstop"></a>

## dhcp.stop

Stop DHCP server

**Methods**: POST / PUT / DELETE
**Path**: `/api/v1/dhcp/stop`
**Minimum access**: ADMIN

### Parameters

| Field | Type | Requirement | Meaning | If omitted |
| --- | --- | --- | --- | --- |
| `interface` | string | Optional | ap/wifi or eth/ethernet. | Aggregate for queries; AP for start/stop |

### Request example

```json
{
  "interface": "ap"
}
```

### Response and completion

data.interface/stopped.
