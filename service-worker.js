// Define the files to cache
const cacheName = 'portfolio-site-v1'
const filesToCache = [
  '/',
  '/index.html',
  '/style.css.gz?v=1.1',
  '/script.js.gz?v=1.1',
  '/images/favicon.ico',
  '/images/html-css.png',
  '/images/js.png',
  '/images/bash.png',
  '/images/py.png',
  '/images/java.png',
  '/images/bootstrap.png',
  '/images/profile.jpg',
  '/images/freecodecamp.png',
  '/images/georgiatech.png',
  '/images/codewars.png',
  '/images/sololearn.png',
  '/images/mimo2.png',
  '/images/udemy.png'
]

// Install the service worker and cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  )
})

// Fetch the cached files or make a network request if not in cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// Update the cache when new version is available
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
