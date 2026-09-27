// Pendaftaran service worker (dipisah dari index.html agar Content Security Policy tidak perlu mengizinkan skrip inline).
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  // Versi baru aktif (service worker berganti) -> muat ulang sekali agar kode lama di tab ini tidak terus dipakai.
  const hadCtrl = !!navigator.serviceWorker.controller; let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadCtrl && !reloaded) { reloaded = true; location.reload(); } });
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
  
