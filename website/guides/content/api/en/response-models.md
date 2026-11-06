# Common response models

These fields are inside `data`. Handle HTTP status and `code` as described in [Common rules](conventions.md). Fields vary with device state, initialization, and role. Preserve unknown when a field is missing; do not fill it with `0` or `false`.

## temperature

| Field | Interpretation |
| --- | --- |
| `temperature_c` | Celsius. Both fields represent the same measurement. |
| `temperature_01c` | Tenths of a degree Celsius. The same measurement as `temperature_c`. |
| `valid` | Whether the value is usable; `false` must not be treated as normal temperature |
| `source` | Source of this reading; interpretation depends on the API. |
| `active_source` | Actual source; interpretation depends on the API. |
| `preferred_source` | Preferred source; interpretation depends on the API. |
| `timestamp_ms`, `last_update_ms` | Milliseconds since device start, not Unix time |
| `stale`, `age_ms` | Staleness / age in milliseconds; `null` may mean never updated |
| `partial_stale`, `valid_count`, `stale_count` | Partial failure of a multi-variable binding; inspect more than its average |

The implementation bounds valid temperature values. Inputs can come from local sensors, compute telemetry, variables, or manual tests. A manual value does not establish the physical temperature.

## fan

`fan.status` returns a different shape depending on whether you supply `id`:

- With `id`: one fan.
- Without `id`: `fans`, plus `temperature`, `temp_valid`, and `temp_source`.

| Field | Type, unit, or meaning |
| --- | --- |
| `id` | Fan number. |
| `mode` | Control mode: `off`, `manual`, `auto`, or `curve`. |
| `duty_valid` | Whether the output is valid. |
| `duty` | Known actual duty, in percent. Unknown duty is `null`. |
| `target_duty` | Target output percentage; can differ from actual `duty` |
| `rpm` | Revolutions per minute; interpret with tachometer capability and faults |
| `enabled` | Whether the fan is enabled. |
| `running` | Whether the fan is running. Unknown running state can be `null`. |
| `fault` | Fault state. |
| `temperature` | Relevant control temperature, in Celsius |
| `control_temperature` | Control temperature, in Celsius. |
| `guard_temperature` | Protection temperature, in Celsius. |
| `predicted_temperature` | Predicted temperature, in Celsius. |
| `slope_c_per_min` | Temperature slope in Celsius per minute |
| `auto_state` | Automatic-control stage. |
| `guard_active` | Whether protection is active. |
| `temp_stale` | Whether temperature data is stale. |
| `controller_gain`, `cooling_response` | Diagnostic values, not RPM or temperatures |

`applied` and `persisted` distinguish application from storage. Requesting `50`% does not establish a valid physical `50`% output.

## power

`power.status` combines voltage, chip measurements, protection, and statistics. Use the specific voltage/chip/`protection.status` APIs for details.

| Field | Unit or meaning |
| --- | --- |
| `voltage_v` | Voltage, in V. |
| `current_a` | Current, in A. |
| `power_w` | Power, in W. |
| `voltage_mv` | mV; convert before comparing to V |
| `valid` | Data validity. Check both fields for chip measurements. |
| `crc_valid` | Communication integrity. Check both fields for chip measurements. |
| `timestamp_ms` | Milliseconds since start |
| `state` | Protection stage. |
| `countdown_remaining_sec` | Remaining countdown, in seconds. |
| `initialized` | Whether initialization is complete. |
| `running` | Whether protection is running. |

`device.power.status` reports measurements for individual power rails instead:

| Field | Meaning |
| --- | --- |
| `voltage_mv` | Rail voltage, in mV. |
| `current_ma` | Rail current, in mA. |
| `power_mw` | Rail power, in mW. |
| `total_power_mw` | Total power, in mW. |

Compute telemetry can also use mW. Follow each field's unit.

## config-result

Configuration writes and source selection return a set of state flags; not every response contains all of them.

| Field | Meaning |
| --- | --- |
| `active_version` | Current configuration version; use the new returned value for the next write |
| `source` | Active configuration source |
| `loaded` | Loaded state. Separate from the other state flags. |
| `configured` | Configured state. Separate from the other state flags. |
| `enabled` | Enabled state. Separate from the other state flags. |
| `paused` | Paused state. Separate from the other state flags. |
| `saved` | Storage completed. |
| `uncertain` | Outcome uncertain. |
| `load_error` | Active-configuration error. |
| `internal_error` | Internal-backup error. |
| `sd_available` | Whether SD is available. |
| `internal_exists` | Whether an internal backup exists. |
| `internal_valid` | Whether the internal backup is valid. |
| `comparison_known` | Whether comparison is possible. |
| `backup_matches` | Whether the backup matches. Unknown is not a match. |
| `awaiting_sd_choice` | An SD selection is required |
| `internal_saved_at` | Internal backup save-time information |
| `collection` | Collection location. |
| `id` | Object location. |
| `dependency` | Dependency location. |
| `impact` | References and runs affected by deletion/replacement |

Preview `package_digest` and `credential_generation` are apply preconditions, not reusable global authorization. `restart_required:false` does not replace `loaded`/`enabled` or runtime checks.

## variable

Variables include `name` and `type`/`value_type`. The following fields may also be present:

| Field | Meaning |
| --- | --- |
| `value` | Variable value. |
| `source_id` | Source identifier. |
| `persistent` | Persistence information. |
| `readonly` | Whether the variable is read-only. |
| `flags` | Variable flags. |
| `last_change_ms`, `last_update_ms` | Change and update time fields. |
| `age_ms`, `stale` | Age and staleness information. |

For `variables.list`, use `include_value` to request values and `include_meta` to request metadata. A missing `value` field is different from a `null` value.

## certificate

`cert.status` reports the following separately:

| Field | Meaning |
| --- | --- |
| `has_private_key` | Whether a private key is present. |
| `has_certificate` | Whether a certificate is present. |
| `has_ca_chain` | Whether a CA chain is present. |
| Certificate information | Information about the certificate. |
| HTTPS diagnostic-service status | Status of the separate diagnostic service. |

Certificate validity may depend on `time_ready`. An undetermined result must not be treated as valid.

An installed identity, the identity loaded by the separate HTTPS diagnostic service, and diagnostic-client trust are separate checks. Inspect service status after installation. Business APIs remain on HTTP; their Bearer roles are separate from mTLS certificate roles.

## color

RGB components range from `0` to `255`. Direct color APIs accept:

- A supported color string.
- An object with `r`, `g`, and `b`.
- A decimal integer equivalent to `0xRRGGBB`.

JSON does not allow hexadecimal numeric literals. `led.color.hsv` uses different ranges:

| Field | Meaning |
| --- | --- |
| `h` | `0`–`359` degrees. |
| `s`, `v` | `0`–`255`, not percentages. |

Color correction is an object with the following structure:

| Field | Meaning |
| --- | --- |
| `enabled` | Overall enablement. |
| `white_point` | Nested `enabled`, `red_scale`, `green_scale`, and `blue_scale`. Scales range from `0` to `2`. |
| `gamma` | Nested `enabled` and `gamma`. The gamma range is `0.1`–`4`. |
| `brightness`, `saturation` | Each contains nested `enabled` and `factor`. |

Send the corresponding nested objects when modifying them. Device brightness (`0`–`255`) and a correction factor use different units.

## ota

After starting an update from a URL or SD, read `ota.progress`. It reports device-wide state; there is no private receipt for each login.

| Field | Meaning |
| --- | --- |
| APP progress | `state`, `percent`, `total_size`, `received_size`, `message`. |
| WWW progress | `state`, `percent`, `total`, `received`, `message`, `running`. |

- APP: `pending_reboot` means a restart is needed.
- WWW: completion is indicated by `state=completed` and `running=false`.

`100` percent alone does not prove the new version is running.

Partition information includes:

| Field | Meaning |
| --- | --- |
| `label`, `address`, `size` | Partition label, address, and size. |
| Bootability | Whether the partition is bootable. |
| `version`, `project` | Version and project information, when available. |
| `can_rollback` | Whether rollback is currently available. |

`aborted` acknowledges the cancellation call. Continue checking progress and actual state.

Binary uploads use a separate response. The following combination means that Flash was written but the SD recovery cache was not fully saved:

- HTTP `409`.
- `status=partial`.
- `error=recovery_cache_failed`.
- `flash_written=true`.

Inspect partitions and recovery files before retrying.

## network

Ethernet reports interface and configuration state separately:

| Field | Meaning |
| --- | --- |
| `interface_present` | Whether the interface exists. |
| `link_up` | Physical link state. |
| `config_error`, `config_error_name` | Configuration-application errors. |

A connected cable does not establish that IP configuration succeeded.

Distinguish actual state, requested state, and the stage at which an error occurred:

| Field | Meaning |
| --- | --- |
| DHCP `running` | Actual state. |
| Ethernet `want_running` | Requested state. |
| `restore_error` | Configuration-restoration error. |
| `apply_error` | Configuration-application error. |
| `resume_error` | Service-resumption error. |

`0` means that the corresponding step reported no error. Check the interface and link state before deciding whether the service should run.
