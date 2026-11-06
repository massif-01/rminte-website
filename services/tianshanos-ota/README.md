# TianShanOS release synchronization

GitHub `RMinte/TianshanOS` latest stable Release is the approved OTA source. Drafts and prereleases are excluded. A release requires both uploaded `TianShanOS.bin` and `www.bin`, with GitHub SHA-256 digests. The firmware's embedded project/version must match the release. A lower version cannot replace the current version.

Cloudflare runs synchronization every Monday at 00:00 UTC (08:00 Asia/Shanghai), once every seven days. New releases can therefore take up to seven days to reach OTA and the download center. No device flashing is initiated by this service.

Both files are downloaded, checked and stored under a snapshot-specific R2 prefix. Its immutable manifest is written before `firmware/tianshanos/current.json` is replaced. A failed synchronization retains the previous current release; the next weekly run retries. Worker observability records successful changes and synchronization failures.

The OTA page, `/version`, `/info`, `/firmware` and `/www` read the same current record. Existing device endpoints and version-response fields are retained. `/release` exposes the record to the download center, which updates its version, sizes, release-notes URL and both download links. The two links include the same `?release=<snapshot>` so an open page continues downloading its matched pair even after a new version is promoted. Unpinned current downloads use `Cache-Control: no-store`; pinned downloads are immutable.

Bootstrap or retry from the repository root:

```sh
node scripts/sync-tianshanos-release.mjs             # validate latest files without uploads
node scripts/sync-tianshanos-release.mjs --publish   # requires Wrangler R2 access
node --test services/tianshanos-ota/tests/releases.test.mjs
```

The initial current record must be uploaded before deploying the Worker that reads it. Preserve previous snapshots. The main site must be deployed before or alongside OTA when shared font/brand assets change; fonts remain hosted by the main site.
