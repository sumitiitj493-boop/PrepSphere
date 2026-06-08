const CACHE_NAME = 'prepsphere-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/01-DBMS.html',
  '/02-OOPs.html',
  '/03-Computer-Networks.html',
  '/04-Operating-System.html',
  '/05-Language-Core-CPP.html',
  '/05-Language-Core-Java.html',
  '/05-Language-Core-Python.html',
  '/06-Puzzles.html',
  '/07-Linux.html',
  '/08-Git.html',
  '/09-SQL.html',
  '/10-Projects-Behavioral.html',
  '/11-System-Design.html',
  '/12-DSA-Concepts.html',
  '/search-index.js',
  '/global-search.js',
  '/feedback.js',
  '/manifest.json',
  '/logo.png'
];

// Install: precache core pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (like Three.js CDN)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request).then(cached => {
          return cached || new Response('Offline', { status: 503 });
        });
      })
  );
});
