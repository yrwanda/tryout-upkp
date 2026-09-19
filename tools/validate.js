const fs=require('fs'),path=require('path'),vm=require('vm');
const root=process.argv[2];
const ctx={window:{}}; vm.createContext(ctx);
const files=['js/materi.js',...fs.readdirSync(path.join(root,'js/bank')).map(f=>'js/bank/'+f)];
for(const f of files){ vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f}); }
const BANK=ctx.window.BANK, TOPICS=ctx.window.TOPICS, MATERI=ctx.window.MATERI;
let problems=[], ids=new Set(), total=0, dist={};
for(const t of TOPICS){
  const qs=BANK[t.id]||[]; total+=qs.length;
  if(!MATERI[t.id]) problems.push(`materi hilang: ${t.id}`);
  if(!t.optional && qs.length < t.n*2) problems.push(`bank ${t.id} hanya ${qs.length} (< 2x ${t.n})`);
  for(const q of qs){
    if(ids.has(q.id)) problems.push('id ganda '+q.id); ids.add(q.id);
    if(q.topic!==t.id) problems.push(`${q.id} topic mismatch`);
    if(!Array.isArray(q.o)||q.o.length!==5) problems.push(`${q.id} opsi != 5`);
    if(typeof q.a!=='number'||q.a<0||q.a>4) problems.push(`${q.id} jawaban invalid`);
    const set=new Set(q.o.map(o=>o.trim().toLowerCase())); if(set.size!==q.o.length) problems.push(`${q.id} opsi duplikat`);
    if(!q.e||q.e.length<40) problems.push(`${q.id} pembahasan pendek`);
    if(!q.src) problems.push(`${q.id} tanpa rujukan`);
    if(!q.q.trim()) problems.push(`${q.id} soal kosong`);
    dist[q.a]=(dist[q.a]||0)+1;
    // opsi yang jauh lebih panjang dari yang lain sering membocorkan jawaban
    const lens=q.o.map(o=>o.length); const maxI=lens.indexOf(Math.max(...lens)); const avgOther=(lens.reduce((a,b)=>a+b,0)-lens[maxI])/4;
    if(maxI===q.a && lens[maxI]>2.2*avgOther && lens[maxI]>90) problems.push(`${q.id}: jawaban benar jauh lebih panjang (${lens[maxI]} vs rata ${avgOther.toFixed(0)})`);
  }
}
console.log('total soal:',total); console.log('distribusi jawaban A-E:',dist);
console.log(problems.length?problems.join('\n'):'OK tidak ada masalah struktural');
