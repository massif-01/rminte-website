# Common calling rules

## Paths and methods

Business URLs have the form `http://10.10.99.97/api/v1/...`. Dots in a logical name become path separators: fan.status maps to /api/v1/fan/status. Preserve case, including key.exportPrivate and log.setLevel.

Use only the methods listed for each API. Read operations usually allow GET/POST; writes usually allow POST/PUT/DELETE, with some POST-only endpoints. This guide generally uses GET for simple queries and POST for actions. A disallowed method returns HTTP405.

Names and parameters determine the action. Do not infer that DELETE always deletes an object or POST always creates one.

## Sessions and roles

Protected requests carry `Authorization: Bearer <token>`. Do not place tokens in URLs. A role or session_id supplied in ordinary request JSON does not establish that identity.

| Access label | Meaning |
| --- | --- |
| Public | This capability can be accessed without login; resource conditions still apply |
| READ | At least read permission; authorized admin/root sessions normally qualify |
| ADMIN | Routine device operations; admin or root required |
| ROOT | Raw command execution, automation definition writes, and selected account management; root required |
| Body token | Authentication APIs validate the token JSON field; this is not anonymous permission to change accounts |

Default accounts are admin/root, both with initial password rm01. The policy distinguishes READ/WRITE/ADMIN/ROOT, but this does not imply an API for creating arbitrary accounts at all levels. No registered endpoint has minimum WRITE in this version.

Some resources or parameters add checks: ordinary file reads may allow READ; sensitive paths require ADMIN. config.get exposes only the language preference publicly; other keys require ADMIN. Full SSH host/command, rule, and action reads normally require ADMIN; secrets in automation.sources.list still require ROOT. temp.bind queries allow ADMIN, while binding changes require ROOT. automation.proxy.fetch inherits destination permissions for local APIs and requires ROOT for external services. restricted:true means fields were filtered; never save omitted fields back as empty values.

## Parameters

Use Content-Type: application/json and a JSON object body. Arrays belong inside object fields. Avoid duplicate keys and overlapping query/body parameter names; conflicts are rejected.

Query values are decoded once and may be interpreted as integers or booleans. Prefer JSON for objects, arrays, floating-point values, null, and identifiers whose leading zeroes must be preserved. Do not URL-encode twice.

Optional means that omission is permitted; null is not generally equivalent to omission. Some binding APIs explicitly use null to clear a binding. Time units are field-specific: milliseconds, seconds, or Unix time.

## Determine the result

Usual success:

```json
{"code":0,"data":{"example":"value"}}
```

Business errors can still use HTTP200:

```json
{"code":1,"error":"invalid_request"}
```

Explanations may be in error or message. data may be an object, an array, or absent. A successful response need not contain message.

1. Handle non-success HTTP status as a transport, authorization, format, or service failure.
2. If code is present and nonzero, handle a business error.
3. Check the endpoint's valid, success, exit_code, persisted, or operation status. A top-level success does not replace these checks.
4. For asynchronous work, use the completion flow specified by that API; retain a receipt when one is returned. After a disconnect or result_unknown, inspect state before retrying.

Login, logout, binary uploads, and downloads have dedicated formats. A successful download body contains file bytes, not JSON.

## Error codes

| code | Name | Suggested response |
| --- | --- | --- |
| 0 | OK | Check the endpoint's completion conditions |
| 1 | INVALID_ARG | Check fields, types, ranges, and version conditions |
| 2 | NOT_FOUND | Refresh object/operation information; do not invent or reuse stale IDs |
| 3 | NO_PERMISSION | Check role, sensitive resources, and export conditions |
| 4 | BUSY | Inspect active work and wait before retrying |
| 5 | TIMEOUT | Determine whether a result exists before repeating a write |
| 6 | NO_MEM | Reduce request size or load; preserve known results |
| 7 | INTERNAL | Retain the reason; investigate state if result_unknown |
| 8 | NOT_SUPPORTED | Use a supported entry point |
| 9 | HARDWARE | Inspect the device, sensor, and configuration |
| 10 | CONNECTION | Check network, remote host, fingerprint, and service |
| 11 | AUTH | Reauthenticate or complete the required verification |

SSH trust flows also use1001/1002 for unknown/changed host fingerprints and provide fingerprint details. Verify through a trusted channel before confirming; deleting trust records is not identity verification.

## Effects and persistence

applied reports an applied setting; persisted or saved reports storage success. They can differ. An error may occur after an earlier stage has taken effect: retain its details and read back state.

Toggles, rule triggers, remote execution, and updates are not guaranteed safe to repeat. Read-only queries may be retried with appropriate load control. After a write timeout, query state or the receipt first.

## Limits

Connections, bodies, receive times, and task slots are bounded. Identity and size checks can reject a request before consuming its entire body. Avoid replacing live subscriptions with large numbers of concurrent polls.

This version allows up to 1 MiB for the generic JSON route with a30-second receive budget; authentication requests are limited to 16 KiB/10 seconds. Configuration packages themselves are limited to 64 KiB. Individual APIs can impose smaller limits. See [Transfers](transfers.md) for binary routes.

JSON nesting is limited to 32. Embedded NUL, trailing garbage, and duplicate keys are rejected. For HTTP413, reduce the request or use the feature's designated upload route.
