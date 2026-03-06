const CACHE_NAME = "anagram-cache-v4";

const CORE_ASSETS = [
"/",
"/index.html",
"/script.js",
"/manifest.json",
"/static/dictionary.txt",
"/static/icon-192.png",
"/static/icon-512.png",
"/static/images/lklogo.png",
"/static/js/darkreader.min.js"
];

/* install */

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(CORE_ASSETS))
.then(()=>self.skipWaiting())

);

});

/* activate */

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys =>
Promise.all(
keys
.filter(k => k !== CACHE_NAME)
.map(k => caches.delete(k))
)
).then(()=>self.clients.claim())

);

});

/* fetch */

self.addEventListener("fetch", event => {

if(event.request.method !== "GET") return;

event.respondWith(

fetch(event.request)
.then(response=>{

const clone=response.clone();

caches.open(CACHE_NAME)
.then(cache=>cache.put(event.request,clone));

return response;

})
.catch(()=>caches.match(event.request))

);

});