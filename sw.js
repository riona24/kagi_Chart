const CACHE = 'kagi-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      try {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      } catch (err) {}
      return resp;
    })).catch(()=>caches.match('./'))
  );
});