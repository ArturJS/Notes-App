"use strict";var precacheConfig=[["/notes/0.chunk.adf82.js","56000dcfd7e54dff019b1e3da4aef866"],["/notes/22aef6e0d5410415d42f38573a1fe62f.woff","22aef6e0d5410415d42f38573a1fe62f"],["/notes/894c565557093f1f1c7bde9aec40675b.svg","894c565557093f1f1c7bde9aec40675b"],["/notes/8c54fc0973c62b7a45c29cb1f0b65fbc.eot","8c54fc0973c62b7a45c29cb1f0b65fbc"],["/notes/assets/favicon.ico","53ac170e970ad034a55ee15ce198708c"],["/notes/assets/icons/android-chrome-192x192.png","59e221032ab061cad83b6ce2bcddbde8"],["/notes/assets/icons/android-chrome-512x512.png","cf3fdf7af60a294d6d3f48cb7ad82488"],["/notes/assets/icons/apple-touch-icon.png","a0e46feb3cc577478b127936e739dd08"],["/notes/assets/icons/favicon-16x16.png","d712b605ed58419c7e6d4ab885d147b7"],["/notes/assets/icons/favicon-32x32.png","2f7ce797cf8f198dedb9a9f38b7ef13b"],["/notes/assets/icons/mstile-150x150.png","ba817517b2c4e1ba1ce802c4d4fafdb4"],["/notes/bundle.447f2.js","56983c909d5d649cb4ea4b3de9f461b1"],["/notes/c86ff159561a9153514e16d92e74825a.ttf","c86ff159561a9153514e16d92e74825a"],["/notes/favicon.ico","53ac170e970ad034a55ee15ce198708c"],["/notes/index.html","cfd8b37e4a135c5cc58e9e72afa60e52"],["/notes/manifest.json","3ff489bbcec9c51e550050df8d356f22"],["/notes/style.8cea1.css","835c61b7b4a32591fbdc3c1bee0472d8"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=n),t.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,n,t,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(t)),r.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var t=new URL(n).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return n.every(function(n){return!n.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],t=e[1],a=new URL(n,self.location),r=createCacheKey(a,hashParamName,t,!1);return[a.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var a=new Request(t,{credentials:"same-origin"});return fetch(a).then(function(n){if(!n.ok)throw new Error("Request for "+t+" returned a response with status "+n.status);return cleanResponse(n).then(function(n){return e.put(t,n)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!n.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var n,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),a="index.html";(n=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,a),n=urlsToCacheKeys.has(t));var r="index.html";!n&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL(r,self.location).toString(),n=urlsToCacheKeys.has(t)),n&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(n){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,n),fetch(e.request)}))}});