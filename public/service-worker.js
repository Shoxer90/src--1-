// /* eslint-disable no-restricted-globals */
// const CACHE_NAME = 'your-cache-name-v1';

// self.addEventListener('install', (event) => {
//     self.skipWaiting();
// });

// self.addEventListener('install', (event) => {
//     self.skipWaiting();
// });

// self.addEventListener('activate', (event) => {
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (cacheName !== CACHE_NAME) {
//                         return caches.delete(cacheName); 
//                     }
//                 })
//             );
//         }).then(() => {
//             return self.clients.claim();
//         })
//     );
// });

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });

// self.addEventListener('message', (event) => {
//     if (event.data.action === 'skipWaiting') {
//         self.skipWaiting();
//     }
// });


