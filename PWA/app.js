if ('serviceWorker' in navigator) {
    console.log("SERVICE WORKER REGISTERED")
    navigator.serviceWorker.register('../sw.js')
        .then(reg => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err));
}