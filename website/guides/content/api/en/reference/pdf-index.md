# Complete API index

All 277 registered names are included. Select a name to jump to an entry. Each entry lists the allowed methods, minimum access level, parameters, and checks for completion.

Send the reference request examples as POST JSON. Save an example as request.json, replace the placeholders, and call the listed path. Public calls may omit Authorization.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

Writes have real effects. Obtain the required versions, object IDs, certificates, or release materials first. Use GET only where it is explicitly allowed; use POST JSON for complex parameters.

## Alphabetical locator

The labels indicate the minimum access level for an entry. Resource, session, and feature requirements still apply. Retained but unsupported entries are marked in the reference.
