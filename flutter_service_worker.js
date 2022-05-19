'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "bfdb9b924d98fe18c01bf12558b96c07",
"index.html": "683a9eba37b43ff2afc6248a1f765156",
"/": "683a9eba37b43ff2afc6248a1f765156",
"main.dart.js": "e638b2240ca5f450f744a971e13bfcd3",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "77ab3fb0e5ab2d52169cff031061cbe8",
"assets/AssetManifest.json": "23474635a11d5a682ad63bce59aa6e89",
"assets/NOTICES": "40f417ca81aa6b7a631d64ae441ee2bf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/assets/level3.png": "e0bd080a5a91b404af416ba96ae4c32f",
"assets/assets/level2.png": "a15b68dc4e0c674305fc7b06549f084c",
"assets/assets/transmission_level1_desc.jpg": "dab5c9993c1444b68a0a93aae30957a0",
"assets/assets/transmission_level2_exclusion.jpg": "4de664bbd4b6b946f835e7af2baf2c64",
"assets/assets/level1.png": "6f65bb87412e2ed13bc63f97e8188e5b",
"assets/assets/transmission_level1_exclusion.jpg": "164f61450605061cc33ab605b5f5142b",
"assets/assets/trans_level2.png": "d673f07fd3d26bc2c65c14f832f806df",
"assets/assets/trans_level1.png": "b5ed70019c157c29369a56d994180334",
"assets/assets/eng_level3_desc.jpg": "bfe8d1ee99dc92e786fe88145aa2767f",
"assets/assets/eng_level2_desc.jpg": "92e17714dae651e3735b6736c857eee4",
"assets/assets/tab_3s.png": "40c45bbb7601c039da61be3e3c0f7520",
"assets/assets/eng_level1_machines.jpg": "591682374eabbee19dcfa69f9d7e9860",
"assets/assets/tab_1.png": "629111ba46f6559071bcf25d2859a7ad",
"assets/assets/tab_3.png": "f679006d5a49884f9ae89628d1d62d88",
"assets/assets/eng_level1_benefits.jpg": "49a0502f692c03c9ad5abffe1ec44212",
"assets/assets/eng_level3_exclusion.jpg": "fba6919cb74665b0312672e39ea957dd",
"assets/assets/transmission_level1_benefits.jpg": "6e247a0e5c9328218a367df6cd526dfd",
"assets/assets/transmission_level1_machines.jpg": "7eadc0d06b68f2c33723a610e3d9676a",
"assets/assets/eng_level1_exclusion.jpg": "e059be786664161a53482df82412044f",
"assets/assets/eng_level1_desc.jpg": "4c400139accb57abd341670596f3f5be",
"assets/assets/tab_1s.png": "fbd3aa5ed884a724f0435521586f6585",
"assets/assets/eng_level2_benefits.jpg": "e8eb0c668a1781fce126c9d9eccb2261",
"assets/assets/transmission_level2_benefits.jpg": "b514aa55dbfe05d2949c0835309eb138",
"assets/assets/eng_level3_benefits.jpg": "20e0b22c0e90416df409207c8a328fd5",
"assets/assets/eng_level2_exclusion.jpg": "22636204e648861748127c62f4a00060",
"assets/assets/transmission_level2_desc.jpg": "61ff1e81efa3648f3ab82467ae48ee9a",
"canvaskit/canvaskit.js": "f00de1f742223b7cf4cec1c2a0cd9764",
"canvaskit/profiling/canvaskit.js": "411ee45f5abb57975ee5243310c6953e",
"canvaskit/profiling/canvaskit.wasm": "c6681b1a749ad902eefcba11fed1cb3f",
"canvaskit/canvaskit.wasm": "efe4a5da0205bb8d8c5aca7dad981abd"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
