// Menyeimbangkan posisi kunci jawaban (A-E) untuk file bank tambahan (x2_*.js) dengan rotasi opsi.
// Soal dengan pembahasan yang menyebut huruf pilihan atau opsi berurutan (angka/ordinal) tidak diubah.
// Pemakaian: node tools/rebalance.js .
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = process.argv[2] || '.';
const bankDir = path.join(root, 'js/bank');
const all = fs.readdirSync(bankDir).filter(f => f.endsWith('.js'));
const isMov = f => (f.startsWith('x2_') || f.startsWith('bkn_')) && f !== 'bkn_form.js';
const files = all.filter(f => !isMov(f) && f !== 'bkn_form.js').concat(all.filter(isMov)).concat(all.filter(f => f === 'bkn_form.js'));
const ctx = { window: {} }; vm.createContext(ctx);
const fileParts = {}; const headers = {};
for (const f of files) {
  const src = fs.readFileSync(path.join(bankDir, f), 'utf8');
  headers[f] = src.split('\n').filter(l => l.startsWith('//')).join('\n');
  const before = {}; for (const k in (ctx.window.BANK || {})) before[k] = ctx.window.BANK[k].length;
  ctx.window.BANK = ctx.window.BANK || {};
  for (const m of src.matchAll(/window\.BANK\.(\w+)\.push/g)) ctx.window.BANK[m[1]] = ctx.window.BANK[m[1]] || [];
  vm.runInContext(src, ctx, { filename: f });
  const parts = [];
  for (const k in ctx.window.BANK) { const n0 = before[k] || 0; if (ctx.window.BANK[k].length > n0) parts.push({ key: k, qs: ctx.window.BANK[k].slice(n0) }); }
  fileParts[f] = parts;
}
const order = files.flatMap(f => fileParts[f].flatMap(p => p.qs));
// Opsional: berkas JSON {id: {q?, o?, a?, e?, src?}} untuk mengoreksi soal sebelum penyeimbangan
if (process.argv[3]) { const ov = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); let n = 0; order.forEach(q => { if (ov[q.id]) { Object.assign(q, ov[q.id]); n++; } }); console.log('opsi ditimpa:', n); }
// Pilihan berurutan (ordinal/Romawi/angka) dikembalikan ke urutan wajar dan tidak dirotasi
const ORD = ["pertama", "kedua", "ketiga", "keempat", "kelima"], ROM = ["I", "II", "III", "IV", "V", "I dan IV", "Semua alinea"];
const rankOf = s => { const t = s.trim(); if (ORD.includes(t.toLowerCase())) return ORD.indexOf(t.toLowerCase()); if (ROM.includes(t)) return ROM.indexOf(t); if (/^\d+$/.test(t)) return Number(t); return null; };
order.forEach(q => { const r = q.o.map(rankOf); if (r.some(x => x === null)) return; const ans = q.o[q.a]; const idx = q.o.map((o, i) => i).sort((i, j) => r[i] - r[j]); q.o = idx.map(i => q.o[i]); q.a = q.o.indexOf(ans); });
const x2 = new Set(files.filter(isMov).flatMap(f => fileParts[f].flatMap(p => p.qs)));
const letterRef = /\b(pilihan|kalimat|opsi|jawaban)\s+[A-E]\b|\([A-E]\)|\b[A-E]\s*(dan|,|-|serta)\s*[A-E]\b/i;
const ordered = q => q.o.every(s => rankOf(s) !== null) || q.o.every(s => /^\d/.test(s)) || q.o.every(s => /^(Satu|Dua|Tiga|Empat|Lima|Enam|Tujuh|Delapan|Sembilan|Sepuluh|Sila |Alinea |Pasal |Arah kebijakan|Misi |Tipe |Inspektorat Wilayah)/.test(s)) || q.o.every(s => s.length < 22 && /\d/.test(s));
const cnt = [0, 0, 0, 0, 0];
const before = [0, 0, 0, 0, 0]; order.forEach(q => before[q.a]++);
order.forEach(q => { if (!x2.has(q) || letterRef.test(q.e) || ordered(q)) cnt[q.a]++; });
const target = Math.ceil(order.length / 5);
// hanya rotasi soal 5 opsi; soal 4 opsi tetap

let moved = 0;
order.forEach(q => {
  if (!x2.has(q) || letterRef.test(q.e) || ordered(q)) return;
  let best = q.a;
  if (cnt[q.a] >= target) best = cnt.indexOf(Math.min(...cnt));
  if (best >= q.o.length) best = q.a; // soal 4 opsi tidak bisa ke posisi E
  if (best !== q.a) { const L = q.o.length; const shift = (best - q.a + L) % L; const n = new Array(L); q.o.forEach((o, i) => n[(i + shift) % L] = o); q.o = n; q.a = best; moved++; }
  cnt[best]++;
});
const after = [0, 0, 0, 0, 0]; order.forEach(q => after[q.a]++);
console.log('sebelum:', before.join(' '), '| sesudah:', after.join(' '), '| dirotasi:', moved);
const js = s => JSON.stringify(s);
for (const f of files) {
  if (!isMov(f)) continue;
  let out = headers[f] + '\nwindow.BANK = window.BANK || {};\n';
  for (const { key, qs } of fileParts[f]) {
    if (f.startsWith('bkn_')) qs.forEach(q => { if (!q.set) q.set = 'bkn'; });
    out += 'window.BANK.' + key + ' = window.BANK.' + key + ' || [];\n';
    out += 'window.BANK.' + key + '.push(\n' + qs.map(q => `  {\n    id: ${js(q.id)},${q.set ? ' set: ' + js(q.set) + ',' : ''}${q.imi ? ' imi: true,' : ''} topic: ${js(q.topic)},\n    q: ${js(q.q)},\n    o: [${q.o.map(js).join(', ')}],\n    a: ${q.a},\n    e: ${js(q.e)},\n    src: ${js(q.src)}\n  }`).join(',\n') + '\n);\n\n';
  }
  fs.writeFileSync(path.join(bankDir, f), out, 'utf8');
}
