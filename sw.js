const CACHE = "anagram-cache-v1";

self.addEventListener("install", e => {

self.skipWaiting();

});

self.addEventListener("activate", e => {

e.waitUntil(

caches.keys().then(keys =>
Promise.all(keys.map(k => caches.delete(k)))
)

);

self.clients.claim();

});

self.addEventListener("fetch", event => {

if(event.request.method !== "GET") return;

event.respondWith(

caches.match(event.request).then(cache => {

return cache || fetch(event.request).then(response => {

const clone = response.clone();

caches.open(CACHE).then(c => c.put(event.request, clone));

return response;

});

})

);

});