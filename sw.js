const limitInCache = (key, size) => {
    caches.open(key).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitInCache(key, size));
            }
        })
    })
}

const cacheVersion = 2;

const activeCaches = {
    static: `static-v${cacheVersion}`,
    dynamic: `dynamic-v${cacheVersion}`,
};

self.addEventListener("install", (event) => {
    console.log("Service Worker Installed Successfully :))");

    event.waitUntil(
        caches.open(activeCaches["static"]).then((cache) => {
            cache.addAll([
                "/",
                "/fallback.html",
                "js/App.js",
                "js/code.js",
                "css/app.css",
            ]);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated Successfully :))");

    const activeCacheNames = Object.values(activeCaches);

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.forEach((cacheName) => {
                    if (!activeCacheNames.includes(cacheName)) {
                        return caches.delete(cacheName); // :))
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log(event.request);

    // 1. First Cache, second network

    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request).then((serverResponse) => {
            caches.open([activeCaches["dynamic"]]).then((cache) => {
              cache.put(event.request, serverResponse.clone());
              limitInCache(activeCaches['dynamic'], 5);
              return serverResponse;
            });
          }).catch((err) => {
              return caches.match('/fallback.html')
          })
        }
      })
    );

    // 2. Network Only
    // event.respondWith(fetch(event.request));

    // 3. Cache Only
    // event.respondWith(caches.match(event.request));

    // 4. First Network, second Cache
    // return event.respondWith(
    //     fetch(event.request)
    //         .then((response) => {
    //             return caches.open(activeCaches["dynamic"]).then((cache) => {
    //                 cache.put(event.request, response.clone());
    //                 return response;
    //             });
    //         })
    //         .catch((err) => {
    //             return caches.match(event.request);
    //         })
    // );
});
