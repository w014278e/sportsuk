var BASE_PATH = '/sportsuk/';
var CACHE_NAME = 'bgPWA-v17';
var TEMP_IMAGE_CACHE_NAME = 'temp-cache-v3';
var footballheadlinesJSON = "https://newsapi.org/v1/articles?source=talksport&sortBy=top&apiKey=2117f72d54d5433eba479863fb7ab3e5";
var CACHED_URLS = [
 // HTML
    BASE_PATH + 'index.html',
    BASE_PATH + 'news.html',
    BASE_PATH + 'results.html',
    BASE_PATH + 'feedback.html',
   
    
    
    // Images for favicons
    BASE_PATH + 'images/icons/android-icon-36x36.png',
    BASE_PATH + 'images/icons/android-icon-48x48.png',
    BASE_PATH + 'images/icons/android-icon-72x72.png',
    BASE_PATH + 'images/icons/android-icon-96x96.png',
    BASE_PATH + 'images/icons/android-icon-144x144.png',
    BASE_PATH + 'images/icons/android-icon-192x192.png',
    BASE_PATH + 'images/icons/favicon-32x32.png',

    //Images for pages
   
    BASE_PATH + 'images/icons/favicon.ico',
    BASE_PATH + 'images/icons/favicon-16x16.png',
    BASE_PATH + 'images/icons/favicon-32x32.png',
    BASE_PATH + 'images/icons/favicon-96x96.png',
    BASE_PATH + 'images/icons/ms-icon-70x70.png',
    BASE_PATH + 'images/icons/ms-icon-144x144.png',
    BASE_PATH + 'images/icons/ms-icon-150x150.png',
    BASE_PATH + 'images/icons/ms-icon-310x310.png',
    BASE_PATH + 'images/icons/favicon.ico',
    BASE_PATH + 'images/eventsimages/event-default.png',
    BASE_PATH + 'images/news-default.jpg',
    BASE_PATH + 'images/offlinemap.jpg',
    BASE_PATH + 'images/premierleaguelogo.jpg',
    BASE_PATH + 'images/skybetleague1logo.jpg',
    BASE_PATH + 'images/skybetleague2logo.jpg',
    BASE_PATH + 'images/chelsealogo.gif',
    BASE_PATH + 'images/arsenallogo.gif',
    BASE_PATH + 'images/eventsimages/article1.jpg',
    BASE_PATH + 'images/eventsimages/article2.jpg',
    BASE_PATH + 'images/eventsimages/article3.jpg',
    BASE_PATH + 'images/eventsimages/article4.jpg',
    BASE_PATH + 'images/eventsimages/article5.jpg',
    BASE_PATH + 'images/eventsimages/article6.jpg',
    
     
    // JavaScript
    BASE_PATH + 'offline-map.js',
    BASE_PATH + 'scripts.js',
    
   
    // Manifest
    BASE_PATH + 'manifest.json',
   
    BASE_PATH + 'footballMatchJSONinfo.json',
  // CSS and fonts
    'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    BASE_PATH + 'min-style.css',
    BASE_PATH + 'styles.css',
   



  
];

var googleMapsAPIJS = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB4r037t9M4xqaHF8RR2p2mQqiWhgmeeAk&callback=initMap';

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  // Handle requests for index.html
  if (requestURL.pathname === BASE_PATH + 'news.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('news.html').then(function(cachedResponse) {
          var fetchPromise = fetch('news.html').then(function(networkResponse) {
            cache.put('news.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
       } else if (requestURL.pathname === BASE_PATH + 'results.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('results.html').then(function(cachedResponse) {
          var fetchPromise = fetch('results.html').then(function(networkResponse) {
            cache.put('results.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );

      
 // Handle requests for Google Maps JavaScript API file
  } else if (requestURL.href === googleMapsAPIJS) {
    event.respondWith(
      fetch(
        googleMapsAPIJS+'&'+Date.now(),
        { mode: 'no-cors', cache: 'no-store' }
      ).catch(function() {
        return caches.match('offline-map.js');
      })
    );
      
    // Handle requests for events JSON file
  } else if (requestURL.pathname === BASE_PATH + 'events.json') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  } else if (requestURL.href === footballheadlinesJSON) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          caches.delete(TEMP_IMAGE_CACHE_NAME);
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  // Handle requests for event images.
  } else if (requestURL.pathname.includes('/eventsimages/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cacheResponse) {
          return cacheResponse||fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match('images/eventsimages/event-default.png');
          });
        });
      })
    );
  // 
  }  else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        });
      })
    );
  }
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('gih-cache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});