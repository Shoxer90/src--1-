// /* eslint-disable no-restricted-globals */
// const CACHE_NAME = 'your-cache-name-v1';

// self.addEventListener('install', (event) => {
//     self.skipWaiting();
// });

// self.addEventListener('install', (event) => {
//     console.log('Resource was fetched from server1');
//     self.skipWaiting();
// });

// self.addEventListener('activate', (event) => {
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     console.log(cacheName,"cacheName");
//                     if (cacheName !== CACHE_NAME) {
//                         console.log('Resource was fetched from server2');
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
//             console.log('Resource was fetched from server3');
//             return response || fetch(event.request);
//         })
//     );
// });

// self.addEventListener('message', (event) => {
//     if (event.data.action === 'skipWaiting') {
//         console.log('Resource was fetched from server4');
//         self.skipWaiting();
//     }
// });


