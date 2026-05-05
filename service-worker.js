/**
 * service-worker.js
 * PWA - Calendário da Copa 2026
 *
 * Estratégia:
 * - HTML: tenta buscar da rede primeiro e usa cache se estiver offline.
 * - CSS/JS/JSON/imagens: usa cache primeiro e atualiza em segundo plano.
 * - Vídeos/áudios: NÃO entram no cache, para evitar erro 206 Partial Content.
 */

const CACHE_NAME = "copa-2026-v2";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./login.html",
  "./grupos.html",
  "./estadios.html",
  "./favoritos.html",
  "./perfil.html",
  "./noticias.html",

  "./copa.json",
  "./manifest.json",

  "./css/stayle.css",
  "./css/login.css",
  "./css/grupos.css",
  "./css/estadios.css",
  "./css/favoritos.css",
  "./css/perfil.css",
  "./css/noticias.css",

  "./js/auth.js",
  "./js/authGuard.js",
  "./js/userData.js",
  "./js/supabaseClient.js",
  "./js/index.js",
  "./js/login.js",
  "./js/grupos.js",
  "./js/estadios.js",
  "./js/favoritos.js",
  "./js/perfil.js",
  "./js/noticias.js",
  "./js/pwa.js",

  "./img/mapa-estadios.png",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

const EXTENSOES_NAO_CACHEAR = [
  ".mp4",
  ".webm",
  ".ogg",
  ".mp3",
  ".wav",
  ".mov"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.warn("Service Worker: erro ao salvar cache inicial:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

function deveIgnorarCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  if (request.method !== "GET") {
    return true;
  }

  if (url.origin !== self.location.origin) {
    return true;
  }

  if (request.headers.has("range")) {
    return true;
  }

  return EXTENSOES_NAO_CACHEAR.some((extensao) => pathname.endsWith(extensao));
}

function respostaPodeSerCacheada(response) {
  if (!response) {
    return false;
  }

  if (response.status !== 200) {
    return false;
  }

  return response.type === "basic" || response.type === "cors";
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    if (respostaPodeSerCacheada(response)) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return cache.match("./index.html");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    fetch(request)
      .then((response) => {
        if (respostaPodeSerCacheada(response)) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});

    return cached;
  }

  const response = await fetch(request);

  if (respostaPodeSerCacheada(response)) {
    await cache.put(request, response.clone());
  }

  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (deveIgnorarCache(request)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});