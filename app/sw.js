const CACHE = 'ktp-shell-v9-interactive-globe';
const CORE = [
  './','./index.html','./styles.css','./app.js','./globe3d.js','./manifest.webmanifest',
  './assets/icons/icon.svg?v=080','./assets/icons/icon-32.png?v=080','./assets/icons/icon-192.png?v=080','./assets/icons/icon-512.png?v=080','./assets/icons/brand-mark.svg',
  './assets/hero-terrain.svg','./assets/earth-blue-marble.jpg',
  './assets/education/story-orbit.svg','./assets/education/story-river.svg','./assets/education/story-field-check.svg','./assets/education/radar-echo.svg','./assets/education/compare-dates.svg','./assets/education/field-check.svg',
  './data/kura/README.md','./data/kura/ktp_data_manifest.json',
  './data/kura/overlays/before.png','./data/kura/overlays/after.png','./data/kura/overlays/change.png',
  './data/kura/visualizations/KTP_BEFORE_LABELLED.png','./data/kura/visualizations/KTP_AFTER_LABELLED.png','./data/kura/visualizations/KTP_CHANGE_LABELLED_EXPLORATORY.png',
  './data/kura/catalogue/KTP_NISAR_GRANULES_CORRECTED.csv','./data/kura/catalogue/KTP_NISAR_GRANULE_DETAILS_CORRECTED.json','./data/kura/catalogue/KTP_NISAR_GRANULES_CORRECTED.geojson','./data/kura/catalogue/KTP_ANALYSIS_METADATA.json','./data/kura/catalogue/KTP_ANALYSIS_SUMMARY.csv',
  './data/kura/qa/KTP_QA_OVERVIEW.csv','./data/kura/qa/KTP_QA_CHECKS_CONSOLIDATED.csv',
  './data/kura/qa/2026-10-08/NISAR_L2_PR_GCOV_032_123_D_083_2005_SHSH_A_20261008T175433_20261008T175508_P05023_N_F_J_001.h5.iso.xml',
  './data/kura/qa/2026-10-08/NISAR_L2_PR_GCOV_032_123_D_083_2005_SHSH_A_20261008T175433_20261008T175508_P05023_N_F_J_001_QA_SUMMARY.csv',
  './data/kura/qa/2026-10-20/NISAR_L2_PR_GCOV_033_123_D_083_2005_DHDH_A_20261020T175433_20261020T175508_P05023_N_F_J_001.h5.iso.xml',
  './data/kura/qa/2026-10-20/NISAR_L2_PR_GCOV_033_123_D_083_2005_DHDH_A_20261020T175433_20261020T175508_P05023_N_F_J_001_QA_SUMMARY.csv'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.includes('/data/kura/')) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => new Response('Packaged KTP evidence is unavailable. Reopen the app while its local server is running.', {status:503,headers:{'Content-Type':'text/plain'}}))));
    return;
  }
  if (url.pathname.includes('/data/')) {
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>new Response('Local source data is unavailable. Keep the local server running and retry.',{status:503,headers:{'Content-Type':'text/plain'}})));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match('./index.html'))));
});
