/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from "$service-worker";

declare let self: ServiceWorkerGlobalScope;

const Cache = "cache-" + version;
const Assets = [...build, ...files];

self.addEventListener("install", (event) => {
    async function addFilesToCache() {
        const cache = await caches.open(Cache);
        await cache.addAll(Assets);
    }

    event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== Cache) {
                await caches.delete(key);
            }
        }
    }

    event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(Cache);

        if (Assets.includes(url.pathname)) {
            const cachedResponse = await cache.match(url.pathname);

            if (cachedResponse) return cachedResponse;
        }

        try {
            const response = await fetch(event.request);

            const isHTTPS = url.protocol === "https:";
            const isSuccess = response.status === 200;

            if (isHTTPS && isSuccess) {
                cache.put(event.request, response.clone());
            }

            return response;
        } catch (e) {
            const cachedResponse = await cache.match(url.pathname);

            if (cachedResponse) return cachedResponse;
        }

        return new Response("Not Found", { status: 404 });
    }

    event.respondWith(respond());
});
