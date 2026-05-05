/**
 * pwa.js
 * Registra o Service Worker para transformar o projeto em PWA/mobile instalável.
 */

(function registrarPWA() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("service-worker.js");
      console.log("PWA: service worker registrado com sucesso.");
    } catch (error) {
      console.warn("PWA: não foi possível registrar o service worker.", error);
    }
  });
})();
