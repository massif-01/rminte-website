// One R2 pointer owns the page, version API and both downloads.
export const CURRENT_KEY = 'firmware/tianshanos/current.json';
export const snapshotKey = id => `firmware/tianshanos/releases/${id}/release.json`;
const GITHUB = 'https://api.github.com/repos/RMinte/TianshanOS/releases/latest';

export async function readRelease(bucket, snapshot) {
  if (snapshot && !/^\d+-[a-f0-9]{12}-[a-f0-9]{12}$/.test(snapshot)) return null;
  const object = await bucket.get(snapshot ? snapshotKey(snapshot) : CURRENT_KEY);
  return object ? object.json() : null;
}

export function firmwareInfo(bytes) {
  // ESP image header (24) + first segment header (8), then esp_app_desc_t.
  const view = new DataView(bytes);
  if (bytes.byteLength < 288 || view.getUint8(0) !== 0xe9 || view.getUint32(32, true) !== 0xabcd5432) {
    throw new Error('Invalid ESP application image');
  }
  const field = (offset, length) => new TextDecoder().decode(new Uint8Array(bytes, offset, length)).split('\0')[0];
  return {
    version: field(48, 32), project_name: field(80, 32),
    compile_time: field(112, 16), compile_date: field(128, 16),
    idf_version: field(144, 32), secure_version: view.getUint32(36, true)
  };
}

export async function syncRelease(bucket, fetcher = fetch) {
  const response = await fetcher(GITHUB, { headers: { 'User-Agent': 'RMinte-OTA', Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`GitHub release lookup: ${response.status}`);
  const release = await response.json();
  if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) throw new Error('Expected a stable TianShanOS release');
  const assets = ['TianShanOS.bin', 'www.bin'].map(name => {
    const asset = release.assets.find(item => item.name === name && item.state === 'uploaded');
    if (!asset || !/^sha256:[a-f0-9]{64}$/.test(asset.digest)) throw new Error(`Release asset not ready: ${name}`);
    return asset;
  });
  const snapshot = `${release.id}-${assets[0].digest.slice(7, 19)}-${assets[1].digest.slice(7, 19)}`;
  const current = await readRelease(bucket);
  if (current?.snapshot === snapshot) return { changed: false, tag: current.tag };
  // A release marked latest must not silently downgrade an already published version.
  const parts = tag => tag.slice(1).split('.').map(Number);
  if (current) {
    const a = parts(release.tag_name), b = parts(current.tag);
    const index = a.findIndex((value, i) => value !== b[i]);
    if (index >= 0 && a[index] < b[index]) throw new Error('Refusing an OTA version downgrade');
  }
  const files = [];
  for (const asset of assets) {
    const download = await fetcher(asset.browser_download_url, { signal: AbortSignal.timeout(120000) });
    if (!download.ok) throw new Error(`Download ${asset.name}: ${download.status}`);
    const bytes = await download.arrayBuffer();
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2, '0')).join('');
    if (bytes.byteLength !== asset.size || `sha256:${hash}` !== asset.digest) throw new Error(`Integrity mismatch: ${asset.name}`);
    files.push({ bytes, key: `firmware/tianshanos/releases/${snapshot}/${asset.name}`, name: asset.name, size: bytes.byteLength, sha256: hash });
  }
  const info = firmwareInfo(files[0].bytes);
  if (info.project_name !== 'TianShanOS' || info.version.split('+')[0] !== release.tag_name.slice(1)) throw new Error('Firmware identity does not match release tag');
  const metadata = {
    ...info, tag: release.tag_name, snapshot, release_url: release.html_url,
    published_at: release.published_at,
    firmware: (({ bytes, ...file }) => file)(files[0]),
    www: (({ bytes, ...file }) => file)(files[1])
  };
  // Never expose a new pointer until both complete files and the snapshot manifest exist.
  for (const file of files) await bucket.put(file.key, file.bytes, { sha256: file.sha256, httpMetadata: { contentType: 'application/octet-stream' } });
  const options = { httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' } };
  await bucket.put(snapshotKey(snapshot), JSON.stringify(metadata), options);
  await bucket.put(CURRENT_KEY, JSON.stringify(metadata), options);
  return { changed: true, tag: metadata.tag, snapshot };
}
