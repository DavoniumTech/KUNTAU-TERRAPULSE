const CACHE = 'terapost-shell-v12-product-studio';
const CORE = [
  './','./index.html','./INSTALL_ON_ANDROID.md','./install.html','./styles.css','./app.js','./globe3d.js','./manifest.webmanifest',
  './assets/icons/icon-32.png?v=090','./assets/icons/icon-192.png?v=090','./assets/icons/icon-512.png?v=090','./assets/icons/apple-touch-icon.png?v=090','./assets/icons/kuntau-academy-crest.png','./assets/icons/brand-mark.svg',
  './assets/hero-terrain.svg','./assets/earth-blue-marble.jpg','./assets/education/river-community-context.webp',
  './assets/education/story-orbit.svg','./assets/education/story-river.svg','./assets/education/story-field-check.svg','./assets/education/radar-echo.svg','./assets/education/compare-dates.svg','./assets/education/field-check.svg',
  './data/kura/README.md','./data/kura/ktp_data_manifest.json',
  './data/kura/overlays/before.png','./data/kura/overlays/after.png','./data/kura/overlays/change.png',
  './data/kura/visualizations/KTP_BEFORE_LABELLED.png','./data/kura/visualizations/KTP_AFTER_LABELLED.png','./data/kura/visualizations/KTP_CHANGE_LABELLED_EXPLORATORY.png',
  './data/kura/catalogue/KTP_NISAR_GRANULES_CORRECTED.csv','./data/kura/catalogue/KTP_NISAR_GRANULE_DETAILS_CORRECTED.json','./data/kura/catalogue/KTP_NISAR_GRANULES_CORRECTED.geojson','./data/kura/catalogue/KTP_ANALYSIS_METADATA.json','./data/kura/catalogue/KTP_ANALYSIS_SUMMARY.csv',
  './data/kura/qa/KTP_QA_OVERVIEW.csv','./data/kura/qa/KTP_QA_CHECKS_CONSOLIDATED.csv',
  './data/kura/source-products/NISAR_SOURCE_PRODUCTS.json','./data/kura/source-products/README_SOURCE_DATA.md'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => (key.startsWith('ktp-shell-') || key.startsWith('terapost-shell-')) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('controllerchange', () => { /* new shell controls the next navigation */ });
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put('./index.html', copy)); }
      return response.status === 404 ? caches.match('./index.html').then(fallback => fallback || response) : response;
    }).catch(async () => (await caches.match('./index.html')) || new Response('Quenta TeraPost is offline and its app shell is not cached yet. Reconnect once, then reopen the app.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
    return;
  }
  if (url.pathname.includes('/data/kura/')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
      return response;
    }).catch(() => new Response('Packaged Quenta TeraPost evidence is unavailable. Reconnect and reopen this section.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
  }).catch(() => caches.match('./index.html'))));
});
