// Register approved previews here. Never put private demo files in website/.
// Private: demoPath (Worker directory) + demoEntry (relative entry, may include ?embed=1).
// Website: demoUrl (fixed HTTPS entry, displayed directly). Exactly one source.
// fileKey/fileName independently grant access to downloads; download-only entries are valid.
export const resources = {
  'digital-toll': {demoPath:'/digital-toll/public/', demoEntry:'index.html?embed=1'},
  'voxdock': {demoPath:'/voxdock/public/', demoEntry:'index.html?embed=1', allowDownloads:true},
  'highway-coordination': {demoUrl:'https://sdgs.botropy.com/'},
  'industrial-modeling': {demoPath:'/industrial-modeling/public/', demoEntry:'index.html?embed=1'}
};
