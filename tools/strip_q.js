// Hapus frasa "menurut kisi-kisi BKN" dan sejenisnya dari teks soal (q); sumber sudah tampil di label halaman.
const fs = require("fs");
const WRITE = process.argv[2] === "--write";
const MANUAL = {}; // isi {id: "teks soal baru"} bila hasil otomatis janggal
const K = "(?:PPT )?kisi-kisi(?: BKN)?";
function transform(q) {
  let t = q;
  t = t.replace(new RegExp("^Menurut (?:bagan |tabel |materi )?" + K + "(?: \\([^)]*\\))?,\\s*", "i"), "");
  t = t.replace(new RegExp("^Dalam " + K + ",\\s*", "i"), "");
  t = t.replace(new RegExp(",?\\s*(?:sebagaimana|seperti yang|yang) (?:dikutip|dirangkum|disebut|dimuat|tercantum|diuraikan|dijelaskan)(?: dalam| di| oleh)? " + K + "(?= |,|\\?|$)", "gi"), "");
  t = t.replace(new RegExp("\\s+(?:menurut|dalam|pada|di) " + K + "(?= |,|\\?|\\.|$)", "gi"), "");
  t = t.replace(new RegExp("\\s+" + K + "(?= |,|\\?|\\.|$)", "gi"), "");
  t = t.replace(/ {2,}/g, " ").replace(/ ,/g, ",").replace(/^\s+/, "");
  t = t.replace(/^(\S)/, c => c.toUpperCase());
  return t;
}
const files = fs.readdirSync("js/bank").map(f => "js/bank/" + f);
let n = 0; const left = [];
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  s = s.replace(/id: "([^"]+)"([\s\S]*?)\bq: "((?:[^"\\]|\\.)*)"/g, (all, id, mid, lit) => {
    const q = JSON.parse('"' + lit + '"');
    if (!/kisi-kisi/i.test(q) && !MANUAL[id]) return all;
    const t = MANUAL[id] || transform(q);
    if (/kisi-kisi/i.test(t)) left.push(id + " | " + t);
    if (t === q) return all;
    n++;
    if (!WRITE) console.log(id + "\n  - " + q + "\n  + " + t);
    return 'id: "' + id + '"' + mid + "q: " + JSON.stringify(t);
  });
  if (WRITE) fs.writeFileSync(f, s);
}
console.log("\nchanged", n, "| masih ada kisi-kisi:", left.length); left.forEach(x => console.log("  " + x));
