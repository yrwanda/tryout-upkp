// Hapus penyebutan "Kisi-kisi BKN hal. X" dari pembahasan (e); halaman sudah ada di Rujukan (src).
// Halaman yang belum tercantum di src ditambahkan ke src agar informasinya tidak hilang.
const fs = require("fs");
const WRITE = process.argv[2] === "--write";
const PG = "[\\d][\\d\\s\\-–,]*(?:\\s*dan\\s*\\d[\\d\\-–]*)?";
const pagesOf = str => {
  const out = new Set();
  for (const m of str.matchAll(/(\d+)\s*[-–]\s*(\d+)|(\d+)/g)) {
    if (m[3]) out.add(+m[3]); else for (let i = +m[1]; i <= +m[2]; i++) out.add(i);
  }
  return out;
};
const srcPages = src => { const s = new Set(); for (const m of (src || "").matchAll(new RegExp("hal\\.\\s*(" + PG + ")", "gi"))) pagesOf(m[1]).forEach(p => s.add(p)); return s; };
const cap = t => t.replace(/^(\s*)(\S)/, (_, a, b) => a + b.toUpperCase());

function transform(e) {
  const found = [];
  const note = pg => { found.push(pg.trim().replace(/[,\s]+$/, "")); return ""; };
  let t = e;
  // perbaikan manual beberapa kalimat yang halamannya menjadi bagian isi
  t = t.replace(/^Kisi-kisi BKN kisi-kisi \(hal\. (\d+)\):\s*/, (_, pg) => { note(pg); return ""; });
  t = t.replace("adalah dasar AD/ART KORPRI yang disebut hal. 106.", () => { note("106"); return "adalah dasar AD/ART KORPRI yang juga disebut di kisi-kisi."; });
  t = t.replace("Catatan: hal. 150 hanya berisi", "Catatan: kisi-kisi hanya berisi");
  t = t.replace("(hal. 144 hanya menguraikan partisipasi, kepastian hukum, dan transparansi)", () => { note("144"); return "(uraiannya hanya untuk partisipasi, kepastian hukum, dan transparansi)"; });
  // 1. di awal: "Kisi-kisi BKN hal. X (label): isi" / "Kisi-kisi BKN hal. X: isi" / "Kisi-kisi BKN hal. X kaidah 4: isi"
  t = t.replace(new RegExp("^(?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")\\s*\\(([^)]*)\\)\\s*:\\s*"), (_, pg, lab) => { note(pg); return cap(lab) + ": "; });
  t = t.replace(new RegExp("^(?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")\\s*:\\s*"), (_, pg) => { note(pg); return ""; });
  t = t.replace(new RegExp("^(?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")\\s*(kaidah [\\d\\-–]+)\\s*:\\s*"), (_, pg, k) => { note(pg); return cap(k) + ": "; });
  // 2. dalam kurung: "(kisi-kisi BKN hal. 132)", "(kisi-kisi BKN hal. 85 dan KBBI)", "(kisi-kisi BKN hal. 39: democracy)"
  t = t.replace(new RegExp("\\s*\\((?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")\\)", "g"), (_, pg) => note(pg));
  t = t.replace(new RegExp("\\((?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(\\d+) dan ([^)]*)\\)", "g"), (_, pg, rest) => { note(pg); return "(" + rest + ")"; });
  t = t.replace(new RegExp("\\((?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")\\s*:\\s*", "g"), (_, pg) => { note(pg); return "("; });
  // 3. akhir isi kurung: "(Pasal 4 UU 25/2009, kisi-kisi BKN hal. 125)"
  t = t.replace(new RegExp(",\\s*(?:PPT )?[Kk]isi-kisi(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")\\)", "g"), (_, pg) => { note(pg); return ")"; });
  // 4. sebagai subjek/objek kalimat: "Kisi-kisi BKN hal. 131 mengutip ..." -> "Kisi-kisi mengutip ..."
  t = t.replace(new RegExp("((?:PPT )?[Kk]isi-kisi)(?: BKN)? hal(?:aman)?\\.? ?(" + PG + ")", "g"), (_, k, pg) => { note(pg); return k + (/\s$/.test(pg) ? " " : ""); });
  // rujukan halaman tanpa kata kisi-kisi: "(hal. 62)", "(6M, hal. 160)"
  t = t.replace(new RegExp("\\s*\\(hal\\.\\s*(" + PG + ")\\)", "g"), (_, pg) => note(pg));
  t = t.replace(new RegExp(",\\s*hal\\.\\s*(" + PG + ")\\)", "g"), (_, pg) => { note(pg); return ")"; });
  if (found.length) t = t.replace(/ +([.,;])(?![.])/g, "$1").replace(/ {2,}/g, " ").replace(/\(\s*\)/g, "").trim();
  if (found.length) t = cap(t);
  return { t, found };
}

const files = fs.readdirSync("js/bank").map(f => "js/bank/" + f);
let changed = 0, srcAdded = 0; const leftovers = [];
for (const f of files) {
  let s = fs.readFileSync(f, "utf8"), out = "", pos = 0;
  const reQ = /id: "([^"]+)"/g; let m;
  const ids = []; while ((m = reQ.exec(s))) ids.push({ id: m[1], at: m.index });
  for (let k = 0; k < ids.length; k++) {
    const start = ids[k].at, end = k + 1 < ids.length ? ids[k + 1].at : s.length;
    let chunk = s.slice(start, end);
    const em = chunk.match(/\be: "((?:[^"\\]|\\.)*)"/), sm = chunk.match(/\bsrc: "((?:[^"\\]|\\.)*)"/);
    if (!em) continue;
    const e = JSON.parse('"' + em[1] + '"'), src = sm ? JSON.parse('"' + sm[1] + '"') : "";
    const { t, found } = transform(e);
    if (/hal\.\s*\d/.test(t) && /isi-kisi/.test(t)) leftovers.push(ids[k].id + " | " + t.slice(0, 160));
    if (t === e) continue;
    changed++;
    const have = srcPages(src), miss = [];
    found.forEach(pg => { const ps = pagesOf(pg); if ([...ps].some(p => !have.has(p))) { miss.push(pg); ps.forEach(p => have.add(p)); } });
    let nsrc = src;
    if (miss.length) {
      const seg = new RegExp("(^|; )(Kisi-kisi BKN hal\. " + PG + ")(?=;|$)");
      const tok = str => str.split(/,\s*|\s+dan\s+/).map(x => x.trim()).filter(Boolean);
      const merge = (...lists) => [...new Set(lists.flat())].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join(", ");
      const add = merge(miss.flatMap(tok));
      nsrc = seg.test(src) ? src.replace(seg, (_, a, b) => a + "Kisi-kisi BKN hal. " + merge(tok(b.replace(/^Kisi-kisi BKN hal\.\s*/, "")), miss.flatMap(tok))) : (src ? src + "; " : "") + "Kisi-kisi BKN hal. " + add;
      srcAdded++;
    }
    if (!WRITE) console.log(ids[k].id + "\n  - " + e.slice(0, 170) + "\n  + " + t.slice(0, 170) + (miss.length ? "\n  src+ " + nsrc : ""));
    chunk = chunk.replace(em[0], () => "e: " + JSON.stringify(t));
    if (sm && nsrc !== src) chunk = chunk.replace(sm[0], () => "src: " + JSON.stringify(nsrc));
    s = s.slice(0, start) + chunk + s.slice(end);
    // posisi id berikutnya bergeser
    const d = chunk.length - (end - start); for (let j = k + 1; j < ids.length; j++) ids[j].at += d;
  }
  if (WRITE) fs.writeFileSync(f, s);
}
console.log("\nchanged", changed, "src ditambah halaman", srcAdded);
console.log("sisa penyebutan halaman kisi-kisi:", leftovers.length); leftovers.forEach(x => console.log("  " + x));
