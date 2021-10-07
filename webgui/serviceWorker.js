importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

if (!workbox) {
    console.log("Workbox in service worker failed to load!");
}
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener('install', (event) => {
    console.log('installing service worker ...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker active!');
});

workbox.routing.registerRoute(({url, request, event}) => {
    return (url.pathname.indexOf('serviceWorker.js') === -1 && url.pathname.indexOf('workbox-sw.js') === -1); //do not cache serviceWorker.js
}, new workbox.strategies.StaleWhileRevalidate());