const CACHE = 'compier-v2';
const SHELL = [
  '/compier-dashboard/',
  '/compier-dashboard/index.html',
  '/compier-dashboard/manifest.json',
  '/compier-dashboard/icons/icon-192.png',
  '/compier-dashboard/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Supabase API calls altijd live halen
  if (e.request.url.includes('supabase.co') || e.request.url.includes('pdok.nl')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
