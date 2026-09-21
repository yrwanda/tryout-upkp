# Patch sekali pakai: menambahkan pemilihan sumber soal (kurasi / kisi-kisi BKN / keduanya),
# topik baru (perkantoran, manajemen), dan mode simulasi 50 soal latihan resmi BKN.
import re
p = "js/app.js"; s = open(p, encoding="utf-8").read()

def rep(old, new, count=1):
    global s
    assert old in s, "tidak ditemukan: " + old[:60]
    s = s.replace(old, new, count)

rep('settings: { includeImi: false, examDate: "", durationMin: 90, thresholds: { TWK: "", TKT: "", TSI: "", TKP: "" }, theme: "auto" },',
    'settings: { includeImi: false, examDate: "", durationMin: 90, thresholds: { TWK: "", TKT: "", TSI: "", TKP: "" }, theme: "auto", source: "all" },')

rep('''  const includeImi = () => !!state.settings.includeImi;
  const visibleTopics = () => TOPICS.filter(t => !t.optional || includeImi());
  const pool = topicId => (BANK[topicId] || []).filter(q => includeImi() || !q.imi);''',
'''  const includeImi = () => !!state.settings.includeImi;
  // Sumber soal: "kurasi" (bank hasil riset), "bkn" (kisi-kisi BKN + latihan resmi), "all" (keduanya)
  const SOURCES = { kurasi: "Kurasi (riset)", bkn: "Kisi-kisi BKN", all: "Semua sumber" };
  const source = () => state.settings.source || "all";
  const inSource = q => source() === "all" ? true : source() === "bkn" ? (q.set === "bkn" || q.set === "form") : !q.set;
  const visibleTopics = () => TOPICS.filter(t => (!t.optional || includeImi()) && (!t.bkn || source() !== "kurasi") && pool(t.id).length > 0);
  const pool = topicId => (BANK[topicId] || []).filter(q => (includeImi() || !q.imi) && inSource(q));
  const formSet = () => allQuestions().filter(q => q.set === "form");''')

# Latihan: tombol set resmi
rep('''      el("div", { class: "actions", style: "margin:0 0 6px" }, [
        el("button", { class: "btn btn-sm", onclick: () => vt.forEach(t => boxes[t.id].checked = true) }, ["Pilih semua"]),''',
'''      source() !== "kurasi" ? el("div", { class: "feedback", style: "margin:0 0 12px" }, [
        el("div", { class: "title" }, ["Latihan Resmi BKN 2025 (50 soal asli)"]),
        el("div", { class: "small muted" }, ["Soal dari Google Form resmi BKN untuk Kemenimipas (tautan di kisi-kisi hal. 172), urutan asli, 4 opsi. Kunci dan pembahasan disusun aplikasi ini."]),
        el("div", { class: "actions", style: "margin-top:8px" }, [el("button", { class: "btn btn-primary btn-sm", onclick: () => { drill = { active: true, qs: formSet(), i: 0, answers: {}, correct: 0 }; renderDrillQuestion(); } }, ["Kerjakan 50 soal resmi (urut, dengan pembahasan)"])])
      ]) : null,
      el("div", { class: "actions", style: "margin:0 0 6px" }, [
        el("button", { class: "btn btn-sm", onclick: () => vt.forEach(t => boxes[t.id].checked = true) }, ["Pilih semua"]),''')

# Simulasi: mode
rep('''  function buildExam(withBonus) {
    const qs = []; const sections = [];''',
'''  function buildFormExam() {
    // 50 soal resmi BKN dalam urutan asli, dikelompokkan per jenis tes
    const qs = formSet(); const sections = []; let start = 0;
    const testOf = q => (topicById(q.topic) || {}).test || "TKT";
    qs.forEach((q, i) => { const t = testOf(q); const last = sections[sections.length - 1]; if (!last || last.test !== t) { if (last) last.end = i; sections.push({ test: t, start: i, end: i + 1 }); } });
    if (sections.length) sections[sections.length - 1].end = qs.length;
    return { qs, sections };
  }
  function buildExam(withBonus) {
    const qs = []; const sections = [];''')

rep('''    const bonus = el("input", { type: "checkbox" }); bonus.checked = false;
    const start = () => {
      state.settings.durationMin = parseInt(dur.value, 10) || 90;
      ["TWK", "TKT", "TSI", "TKP"].forEach(k => state.settings.thresholds[k] = th[k].value); save();
      const b = buildExam(includeImi() && bonus.checked);
      exam = { active: true, finished: false, qs: b.qs, sections: b.sections, i: 0, answers: {}, flags: {}, remaining: state.settings.durationMin * 60, startedAt: Date.now() };''',
'''    const bonus = el("input", { type: "checkbox" }); bonus.checked = false;
    const modeSel = el("select", null, [el("option", { value: "upkp" }, ["UPKP D3-S3: 100 soal, komposisi SE BKN 10/2024"]), el("option", { value: "form" }, ["Latihan Resmi BKN 2025: 50 soal asli (urutan asli)"])]);
    modeSel.addEventListener("change", () => { dur.value = modeSel.value === "form" ? 45 : (state.settings.durationMin || 90); });
    const start = () => {
      const isForm = modeSel.value === "form";
      if (!isForm) state.settings.durationMin = parseInt(dur.value, 10) || 90;
      ["TWK", "TKT", "TSI", "TKP"].forEach(k => state.settings.thresholds[k] = th[k].value); save();
      const b = isForm ? buildFormExam() : buildExam(includeImi() && bonus.checked);
      const secs = (parseInt(dur.value, 10) || (isForm ? 45 : 90)) * 60;
      exam = { active: true, finished: false, mode: modeSel.value, qs: b.qs, sections: b.sections, i: 0, answers: {}, flags: {}, remaining: secs, startedAt: Date.now() };''')

rep('''        el("h2", null, ["Simulasi UPKP (CAT)"]),
        el("p", { class: "muted small" }, ["Komposisi mengikuti Lampiran III SE BKN 10/2024 untuk UPKP D3-S3: 100 soal, urut TWK - TKT - TSI - TKP, waktu 90 menit. Pembahasan tampil setelah ujian selesai, seperti kondisi CAT sesungguhnya."]),''',
'''        el("h2", null, ["Simulasi UPKP (CAT)"]),
        el("p", { class: "muted small" }, ["Komposisi mengikuti Lampiran III SE BKN 10/2024 untuk UPKP D3-S3: 100 soal, urut TWK - TKT - TSI - TKP, waktu 90 menit. Pembahasan tampil setelah ujian selesai, seperti kondisi CAT sesungguhnya."]),
        el("div", { class: "field" }, [el("label", null, ["Sumber soal saat ini"]), el("div", null, [el("span", { class: "badge" }, [SOURCES[source()]]), " ", el("span", { class: "small muted" }, ["(ubah di menu atas atau Pengaturan)"])])]),
        source() !== "kurasi" ? el("div", { class: "field" }, [el("label", null, ["Mode simulasi"]), modeSel]) : null,
        source() === "bkn" ? el("p", { class: "small muted" }, ["Catatan: bank Kisi-kisi BKN untuk beberapa topik (misalnya SOTK) lebih sedikit dari kuota resmi, sehingga simulasi 100 soal bisa terisi kurang dari 100. Pakai \\"Semua sumber\\" untuk komposisi penuh."]) : null,''')

# Pengaturan: source select
rep('''    const theme = el("select", null, [["auto", "Ikuti sistem"], ["light", "Terang"], ["dark", "Gelap"]].map(([v, l]) => el("option", { value: v }, [l]))); theme.value = state.settings.theme;''',
'''    const theme = el("select", null, [["auto", "Ikuti sistem"], ["light", "Terang"], ["dark", "Gelap"]].map(([v, l]) => el("option", { value: v }, [l]))); theme.value = state.settings.theme;
    const srcSel = el("select", null, Object.keys(SOURCES).map(v => el("option", { value: v }, [SOURCES[v]]))); srcSel.value = source();''')
rep('''state.settings.theme = theme.value; save(); applyTheme(); toast("Pengaturan disimpan"); } }, ["Simpan"]);''',
    '''state.settings.theme = theme.value; state.settings.source = srcSel.value; save(); applyTheme(); syncSourceSel(); toast("Pengaturan disimpan"); } }, ["Simpan"]);''')
rep('''        el("div", { class: "field", style: "margin-top:10px" }, [el("label", null, ["Tema tampilan"]), theme]),''',
'''        el("div", { class: "field", style: "margin-top:10px" }, [el("label", null, ["Sumber soal"]), srcSel, el("div", { class: "small muted" }, ["Kurasi = bank hasil riset regulasi primer. Kisi-kisi BKN = soal yang disusun dari deck kisi-kisi resmi PPSS BKN (2025) + 50 soal latihan resmi BKN. Kedua bank tidak dicampur agar bisa dibandingkan; statistik per topik mengikuti sumber yang dipilih."])]),
        el("div", { class: "field", style: "margin-top:10px" }, [el("label", null, ["Tema tampilan"]), theme]),''')

# Header select binding + sync
rep('''  $("#themeBtn").addEventListener("click", () => {''',
'''  const sourceSel = $("#sourceSel");
  function syncSourceSel() { if (sourceSel) sourceSel.value = source(); }
  if (sourceSel) { Object.keys(SOURCES).forEach(v => sourceSel.appendChild(el("option", { value: v }, [SOURCES[v]]))); syncSourceSel(); sourceSel.addEventListener("change", () => { if (exam && exam.active && !exam.finished) { syncSourceSel(); return toast("Selesaikan simulasi dulu."); } state.settings.source = sourceSel.value; save(); drill = null; toast("Sumber soal: " + SOURCES[source()]); go(current); }); }
  $("#themeBtn").addEventListener("click", () => {''')

# Riwayat wrongIds respects source
rep('''const wrongIds = Object.keys(state.stats).filter(id => qById[id] && state.stats[id].lastWrong && (includeImi() || !qById[id].imi) && (includeImi() || qById[id].topic !== "imigrasi"));''',
    '''const wrongIds = Object.keys(state.stats).filter(id => qById[id] && state.stats[id].lastWrong && (includeImi() || !qById[id].imi) && (includeImi() || qById[id].topic !== "imigrasi") && inSource(qById[id]));''')

# Badge set pada soal (drill & review): tampilkan sumber
rep('''      el("div", null, [el("span", { class: "badge" }, [t.test]), " ", el("span", { class: "badge badge-muted" }, [t.label])]),
      el("div", { class: "small muted mono" }, [`Soal ${drill.i + 1} / ${drill.qs.length} - benar ${drill.correct}`])''',
'''      el("div", null, [el("span", { class: "badge" }, [t.test]), " ", el("span", { class: "badge badge-muted" }, [t.label]), " ", el("span", { class: "badge " + (q.set ? "badge-warn" : "badge-ok") }, [q.set === "form" ? "Resmi BKN" : q.set === "bkn" ? "Kisi-kisi BKN" : "Kurasi"])]),
      el("div", { class: "small muted mono" }, [`Soal ${drill.i + 1} / ${drill.qs.length} - benar ${drill.correct}`])''')
rep('''      el("div", { class: "q-head" }, [el("div", null, [el("span", { class: "badge badge-muted" }, [t.label]), flagged ? el("span", { class: "badge badge-warn", style: "margin-left:6px" }, ["Ragu-ragu"]) : null]), el("span", { class: "small muted" }, [q.id])]),''',
'''      el("div", { class: "q-head" }, [el("div", null, [el("span", { class: "badge badge-muted" }, [t.label]), " ", el("span", { class: "badge " + (q.set ? "badge-warn" : "badge-ok") }, [q.set === "form" ? "Resmi BKN" : q.set === "bkn" ? "Kisi-kisi BKN" : "Kurasi"]), flagged ? el("span", { class: "badge badge-warn", style: "margin-left:6px" }, ["Ragu-ragu"]) : null]), el("span", { class: "small muted" }, [q.id])]),''')

# Riwayat: simpan mode simulasi & tampilkan
rep('''state.history.push({ ts: exam.finishedAt,''', '''state.history.push({ ts: exam.finishedAt, mode: exam.mode || "upkp", source: source(),''')
rep('''el("div", null, [el("strong", null, [`${h.total.score}/${h.total.max}`]), ` - ${h.total.correct} benar`,''',
    '''el("div", null, [el("strong", null, [`${h.total.score}/${h.total.max}`]), ` - ${h.total.correct} benar`, el("span", { class: "badge badge-muted", style: "margin-left:6px" }, [h.mode === "form" ? "50 soal resmi BKN" : (SOURCES[h.source] || "Kurasi")]),''')

open(p, "w", encoding="utf-8").write(s)

# materi.js: topik baru + TPM
m = open("js/materi.js", encoding="utf-8").read()
m = m.replace('''  { id: "imigrasi", label: "Substansi Keimigrasian (opsional)", test: "BONUS", n: 0, optional: true }
];''', '''  { id: "perkantoran", label: "Perkantoran (materi kisi-kisi BKN)", test: "TKT", n: 0, bkn: true },
  { id: "manajemen", label: "Manajemen & Kepemimpinan (materi kisi-kisi BKN)", test: "TPM", n: 0, bkn: true },
  { id: "imigrasi", label: "Substansi Keimigrasian (opsional)", test: "BONUS", n: 0, optional: true }
];''')
m = m.replace('''  TKP: { label: "Tes Kompetensi Penunjang", short: "TKP" },''', '''  TKP: { label: "Tes Kompetensi Penunjang", short: "TKP" },
  TPM: { label: "Tes Pengetahuan Manajerial (Ujian Dinas Tk. II)", short: "TPM" },''')
open("js/materi.js", "w", encoding="utf-8").write(m)

# index.html: select sumber di header, skrip baru, versi
h = open("index.html", encoding="utf-8").read()
h = h.replace('''      <button id="installBtn"''', '''      <select id="sourceSel" class="btn btn-sm" title="Sumber soal" aria-label="Sumber soal"></select>
      <button id="installBtn"''')
h = h.replace('''  <script src="js/bank/x2_tkp.js?v=3"></script>''', '''  <script src="js/bank/x2_tkp.js?v=3"></script>
  <script src="js/bank/bkn_twk.js?v=4"></script>
  <script src="js/bank/bkn_tkt.js?v=4"></script>
  <script src="js/bank/bkn_tsi_tkp.js?v=4"></script>
  <script src="js/bank/bkn_ekstra.js?v=4"></script>
  <script src="js/bank/bkn_form.js?v=4"></script>''')
h = h.replace("?v=3", "?v=4")
open("index.html", "w", encoding="utf-8").write(h)

# sw.js
w = open("sw.js", encoding="utf-8").read()
w = w.replace('const VERSION = "upkp-v3";', 'const VERSION = "upkp-v4";')
w = w.replace('"./js/bank/x2_tkp.js",', '"./js/bank/x2_tkp.js", "./js/bank/bkn_twk.js", "./js/bank/bkn_tkt.js", "./js/bank/bkn_tsi_tkp.js", "./js/bank/bkn_ekstra.js", "./js/bank/bkn_form.js",')
open("sw.js", "w", encoding="utf-8").write(w)
print("patched")
