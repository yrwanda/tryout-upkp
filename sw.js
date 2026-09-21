/* Service worker: cache semua aset agar aplikasi bisa dipakai offline. Naikkan VERSION setiap kali bank soal/aplikasi berubah. */
const VERSION = "upkp-v5";
const ASSETS = [
  "./", "./index.html", "./manifest.json", "./css/style.css",
  "./js/materi.js", "./js/app.js",
  "./js/bank/twk_pancasila.js", "./js/bank/twk_uud.js", "./js/bank/twk_sejarah.js", "./js/bank/twk_bindo.js",
  "./js/bank/tkt_kepegawaian.js", "./js/bank/tkt_yanlik.js", "./js/bank/tkt_gg.js", "./js/bank/tkt_kebijakan.js",
  "./js/bank/tsi_renstra.js", "./js/bank/tsi_sotk.js", "./js/bank/tkp_inggris.js", "./js/bank/tkp_literasi.js",
  "./js/bank/bonus_imigrasi.js", "./js/bank/x2_twk.js", "./js/bank/x2_tkt.js", "./js/bank/x2_tsi.js", "./js/bank/x2_tkp.js", "./js/bank/bkn_twk.js", "./js/bank/bkn_tkt.js", "./js/bank/bkn_tsi_tkp.js", "./js/bank/bkn_ekstra.js", "./js/bank/bkn_form.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Strategi: network-first untuk HTML/JS/CSS (agar pembaruan cepat terlihat), fallback ke cache saat offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
