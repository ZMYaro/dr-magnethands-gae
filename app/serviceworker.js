'use strict';

const CACHE_VERSION = '2016-10-22, v1';

this.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_VERSION).then(function (cache) {
			cache.addAll([
				'/static/images/header_bg.png',
				'/static/images/icon_back.png',
				'/static/images/icon_close.png',
				'/static/images/header_bg.png',
				'/static/images/silhouette.png',
				'/static/images/title.png'
			]);
			
			return cache.addAll([
				'/static/manifest.webmanifest',
				'/static/offline.html',
				'/static/images/favicon.ico',
				'/static/images/icon.png',
				'/static/images/offline.png',
				'/static/scripts/libs/material-touch.js',
				'/static/styles/libs/material-elements.css',
				'/static/styles/libs/material-depth.css',
				'/static/styles/libs/material-widgets.css',
				'/static/styles/styles.css'
			]);
		})
	);
});

this.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheList) {
			return Promise.all(cacheList.map(function (cacheKey) {
				if (cacheKey !== CACHE_VERSION) {
					return caches.delete(cacheKey);
				}
			}));
		})
	);
});

this.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				// If cached, serve from cache.
				console.log('Serving cached file: ' + response.url);
				return response;
			}
			return fetch(event.request).then(function (response) {
				// If not cached, attempt to load from server.
				return response;
			}).catch(function (error) {
				// If unable to load, return the offline page.
				return caches.match('/static/offline.html');
			})
		})
	);
});
