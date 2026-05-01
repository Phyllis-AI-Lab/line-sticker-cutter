const CACHE = 'line-sticker-cutter-v3';
const APP_SHELL = ['./index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(req).then(res => { const clone = res.clone(); caches.open(CACHE).then(c => c.put(req, clone)); return res; }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(cached => { if (cached) return cached; return fetch(req).then(res => { const clone = res.clone(); caches.open(CACHE).then(c => c.put(req, clone)); return res; }); }));
});
