/* Service worker: cache semua aset agar aplikasi bisa dipakai offline. Naikkan VERSION setiap kali bank soal/aplikasi berubah. */
const VERSION = "upkp-v38";
const ASSETS = [
  "./", "./index.html", "./manifest.json", "./css/style.css",
  "./js/materi.js", "./js/app.js", "./js/boot.js",
  "./js/bank/bkn_twk.js", "./js/bank/bkn_tkt.js", "./js/bank/bkn_tsi_tkp.js", "./js/bank/bkn_ekstra.js",
  "./js/bank/bkn_x3_twk.js", "./js/bank/bkn_x3_tkt.js", "./js/bank/bkn_x3_lain.js", "./js/bank/bkn_x4.js", "./js/bank/bkn_x5.js", "./js/bank/bkn_form.js", "./js/jodoh.js", "./js/kelompok.js", "./js/urut.js", "./js/tebak.js", "./js/detektif.js",
  "./icons/logo.svg", "./icons/favicon.svg", "./icons/favicon-32.png", "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Strategi: network-first untuk HTML/JS/CSS (agar pembaruan cepat terlihat), fallback ke cache saat offline.
// cache "no-cache": selalu cek ke server (304 bila sama), jangan pakai salinan HTTP cache browser yang bisa basi 10 menit.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // hanya berkas aplikasi ini (origin github.io dipakai bersama repo lain milik akun yang sama)
  if (url.origin !== location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(res => {
      // hanya respons sukses yang disimpan; halaman error tidak boleh masuk cache
      if (res.ok && res.type === "basic") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === "navigate" ? caches.match("./index.html") : Response.error())))
  );
});
