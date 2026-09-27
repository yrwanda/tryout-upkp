// Pendaftaran service worker (dipisah dari index.html agar Content Security Policy tidak perlu mengizinkan skrip inline).
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  // Versi baru aktif (service worker berganti) -> muat ulang sekali agar kode lama di tab ini tidak terus dipakai.
  // Bila sedang di tengah simulasi, latihan, atau mini game, muat ulang ditunda sampai pindah ke halaman yang aman (lihat go() di app.js).
  const hadCtrl = !!navigator.serviceWorker.controller; let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadCtrl || reloaded || window.upkpUpdateReady) return;
    if (window.upkpBusy && window.upkpBusy()) { window.upkpUpdateReady = true; window.dispatchEvent(new Event("upkp-update")); return; }
    reloaded = true; location.reload();
  });
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
  
