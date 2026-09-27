const fs = require("fs");
const src = fs.readFileSync(require("path").join(__dirname, "../js/app.js"), "utf8");
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i); if (i < 0 || j < 0) throw new Error("marker " + a); return src.slice(i, j); };
const code = cut("  const defaults = () =>", "  const store = {") + cut("  const BAD_KEYS", "  function load()") + cut("  function mergeState", "  const syncStatusText") + "\nmodule.exports = { sanitize, mergeState };";
fs.writeFileSync(require("path").join(require("os").tmpdir(), "upkp_merge_mod.js"), code);
const { sanitize, mergeState } = require(require("path").join(require("os").tmpdir(), "upkp_merge_mod.js"));
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log("GAGAL:", m); } else console.log("ok  ", m); };
const H = (ts) => ({ ts, mode: "upkp", durationSec: 60, timeout: false, total: { n: 1, correct: 1, score: 5, max: 5 }, qids: ["a"], answers: { a: 0 }, flags: {}, perm: {}, rows: [] });
const base = () => sanitize({});
// 1. statistik: catatan terbaru menang, soal dari dua perangkat digabung
let A = base(), B = base();
A.stats = { q1: { seen: 1, correct: 1, wrong: 0, lastWrong: false, t: 100, okDays: [] }, q2: { seen: 2, correct: 0, wrong: 2, lastWrong: true, t: 300, okDays: [] } };
B.stats = { q1: { seen: 3, correct: 2, wrong: 1, lastWrong: true, t: 200, okDays: [] }, q3: { seen: 1, correct: 1, wrong: 0, lastWrong: false, t: 50, okDays: [] } };
A.savedAt = 300; B.savedAt = 200;
let M = mergeState(A, B);
ok(Object.keys(M.stats).length === 3 && M.stats.q1.t === 200 && M.stats.q2.t === 300, "statistik: union, catatan terbaru menang");
// 2. riwayat disatukan tanpa duplikat
A.history = [H(1), H(2)]; B.history = [H(2), H(3)]; M = mergeState(A, B);
ok(M.history.map(h => h.ts).join() === "1,2,3", "riwayat: disatukan tanpa duplikat, urut waktu");
// 3. bug lama: pengaturan dari laptop (metaAt baru) tidak tertimpa HP yang hanya menjawab soal lebih akhir
A = base(); B = base();
A.settings.examDate = "2026-11-20"; A.bookmarks = ["q9"]; A.metaAt = 500; A.savedAt = 500;   // laptop ubah tanggal + tandai soal
B.settings.examDate = "2026-10-01"; B.metaAt = 100; B.savedAt = 900;                          // HP cuma menjawab soal (savedAt lebih baru)
M = mergeState(B, A);
ok(M.settings.examDate === "2026-11-20" && M.bookmarks.join() === "q9", "pengaturan & tanda soal: yang diubah terakhir menang, bukan yang disimpan terakhir");
// 4. data lama tanpa metaAt: jatuh ke savedAt
A = base(); B = base(); A.settings.theme = "dark"; A.savedAt = 10; B.settings.theme = "light"; B.savedAt = 20;
M = mergeState(A, B); ok(M.settings.theme === "light", "data lama tanpa metaAt: memakai yang tersimpan terakhir");
// 5. reset menghapus data lama perangkat lain
A = base(); B = base();
A.resetAt = 1000; A.savedAt = 1001; A.stats = { q5: { seen: 1, correct: 1, wrong: 0, lastWrong: false, t: 1500, okDays: [] } };
B.savedAt = 900; B.stats = { q1: { seen: 9, correct: 9, wrong: 0, lastWrong: false, t: 800, okDays: [] } }; B.history = [H(700)]; B.days = { "2026-09-20": 30 };
M = mergeState(B, A);
ok(!M.stats.q1 && M.stats.q5 && M.history.length === 0 && !M.days["2026-09-20"] && M.resetAt === 1000, "reset: data sebelum reset dari perangkat lain tidak kembali");
// 6. rekor: terbaik
A = base(); B = base(); A.kilatBest = 12; B.kilatBest = 20; A.kpBest = { poin: 1000, lv: 5, at: 1 }; B.kpBest = { poin: 500, lv: 3, at: 2 };
A.jodohBest = { x: { time: 50, err: 1 } }; B.jodohBest = { x: { time: 70, err: 0 } };
M = mergeState(A, B); ok(M.kilatBest === 20 && M.kpBest.poin === 1000 && M.jodohBest.x.err === 0, "rekor mini game: yang terbaik dipakai");
// 7. idempoten: gabung dengan diri sendiri tidak mengubah apa pun (tidak ada render ulang sia-sia)
A = base(); A.stats = { q1: { seen: 1, correct: 1, wrong: 0, lastWrong: false, t: 5, okDays: ["2026-09-27"] } }; A.history = [H(9)]; A.days = { "2026-09-27": 3 }; A.savedAt = 9; A.metaAt = 4; A.kpRound = 2; A.kpSeen = { q1: 2 }; A.jodoh = { "s|i": { r: 1, w: 0, lastW: false, t: 3 } };
const S = sanitize(JSON.parse(JSON.stringify(A)));
ok(JSON.stringify(mergeState(S, S)) === JSON.stringify(S), "idempoten: gabung dengan salinan sendiri tidak mengubah data");
ok(JSON.stringify(mergeState(S, base())) !== "" && JSON.stringify(mergeState(S, sanitize({ savedAt: 1 }))).length > 0, "gabung dengan server kosong aman");
// 8. hari belajar: nilai terbesar
A = base(); B = base(); A.days = { d1: 5, d2: 1 }; B.days = { d1: 3, d3: 7 }; M = mergeState(A, B);
ok(M.days.d1 === 5 && M.days.d2 === 1 && M.days.d3 === 7, "hari belajar: digabung, nilai terbesar");
console.log(fail ? `${fail} GAGAL` : "SEMUA LOLOS");
