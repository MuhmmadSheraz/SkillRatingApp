const siteVersion = 'v9'
const siteContent = [
    '/',
    '/Authentication/index.html',
    '/Pwa/app.js',
    '/Authentication/style.css',
    '/Home/welcome.html',
    '/Home/style.css',
    '/Home/welcome.js',
];
// INstalling 

self.addEventListener('install', e => {
    console.log("service Worker Installed ")
    e.waitUntil(
        caches.open(siteVersion).then(cache => {
            console.log("Getting Caches")
            cache.addAll(siteContent)
        })
    )
})

// activating
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key =>
                    key !== siteVersion
                )
                .map(key => caches.delete(key)))
        })
    )
})

self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request);
            })
        );
    }
});