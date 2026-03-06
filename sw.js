const CACHE_NAME = "anagram-v2";

/* files required for the app */

const CORE_ASSETS = [
"/",
"/index.html",
"/script.js",
"/manifest.json",
"/static/dictionary.txt",
"/static/icon-192.png",
"/static/icon-512.png",
"/static/images/lklogo.png"
];

/* install */

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(CORE_ASSETS))
.then(() => self.skipWaiting())

);

});

/* activate */

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys
.filter(key => key !== CACHE_NAME)
.map(key => caches.delete(key))

);

})

);

self.clients.claim();

});

/* fetch */

self.addEventListener("fetch", event => {

if(event.request.method !== "GET") return;

event.respondWith(

caches.match(event.request).then(cache => {

if(cache) return cache;

return fetch(event.request).then(response => {

const clone = response.clone();

caches.open(CACHE_NAME).then(c => c.put(event.request, clone));

return response;

});

})

);

});