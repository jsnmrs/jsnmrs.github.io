"use strict";var version="v1::",offlineFundamentals=["/index.html","/fonts/ssp.woff","/img/jason-iceland-320.jpg"];self.addEventListener("install",function(e){e.waitUntil(caches.open(version+"fundamentals").then(function(e){return e.addAll(offlineFundamentals)}).then(function(){}))}),self.addEventListener("fetch",function(e){"GET"===e.request.method&&e.respondWith(caches.match(e.request).then(function(n){var t=fetch(e.request).then(function(n){var t=n.clone();return caches.open(version+"pages").then(function(n){n.put(e.request,t)}).then(function(){}),n},s).catch(s);return n||t;function s(){return new Response("<h1>Service Unavailable</h1>",{status:503,statusText:"Service Unavailable",headers:new Headers({"Content-Type":"text/html"})})}}))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.filter(function(e){return!e.startsWith(version)}).map(function(e){return caches.delete(e)}))}).then(function(){}))});