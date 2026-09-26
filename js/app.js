/* Tryout UPKP - hanya bank kisi-kisi BKN 2025 (soal dari materi kisi-kisi + 50 soal resmi). Vanilla JS, data di localStorage. */
(function () {
  "use strict";

  // ---------- Util ----------
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "style") n.setAttribute("style", v);
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).flat().forEach(c => { if (c === null || c === undefined || c === false) return; n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c); });
    return n;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pad = n => String(n).padStart(2, "0");
  const fmtTime = s => { s = Math.max(0, s); const h = Math.floor(s / 3600); return (h ? h + ":" : "") + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60); };
  const fmtDate = ts => new Date(ts).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const fmtDay = d => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const L = ["A", "B", "C", "D", "E"];
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

  const ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M10 2h4"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16v-9"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.3 1.2 2.3 2.5 2.8Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    pair: '<rect x="2" y="5" width="8" height="14" rx="2"/><rect x="14" y="5" width="8" height="14" rx="2"/><path d="M10 12h4"/>',
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    bins: '<rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/><rect x="13" y="14" width="8" height="7" rx="1.5"/>',
    steps: '<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'
  };
  const icon = (name, label) => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "ic"); s.setAttribute("aria-hidden", label ? "false" : "true"); if (label) s.setAttribute("aria-label", label); s.innerHTML = ICONS[name] || ""; return s; };

  // ---------- Penyimpanan ----------
  const KEY = "upkp-app-v1", EXAM_KEY = "upkp-exam-v2";
  const defaults = () => ({ settings: { examDate: "", durationMin: 90, thresholds: { TWK: "", TKT: "", TSI: "", TKP: "" }, theme: "auto", includeExt: true }, stats: {}, history: [], bookmarks: [], days: {}, doubts: {}, lastExport: 0, exportSnooze: 0 });
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };
  function load() {
    const d = defaults();
    try { const s = JSON.parse(store.get(KEY) || "null"); if (s) return Object.assign(d, s, { settings: Object.assign(d.settings, s.settings || {}, { thresholds: Object.assign(d.settings.thresholds, (s.settings || {}).thresholds || {}) }), days: s.days || {}, doubts: s.doubts || {} }); } catch (e) { }
    return d;
  }
  let state = load();
  const save = () => store.set(KEY, JSON.stringify(state));

  // ---------- Data ----------
  const BANK = window.BANK || {}, TOPICS = window.TOPICS || [], TESTS = window.TESTS || {}, MATERI = window.MATERI || {};
  const topicById = id => TOPICS.find(t => t.id === id);
  // set: "bkn" = dari isi kisi-kisi, "form" = soal resmi BKN, "ext" = pelengkap (isi dari luar PPT kisi-kisi)
  const inScope = q => state.settings.includeExt !== false || q.set !== "ext";
  const pool = tid => (BANK[tid] || []).filter(inScope);
  const ALL = TOPICS.flatMap(t => BANK[t.id] || []);
  const qById = {}; ALL.forEach(q => { qById[q.id] = q; });
  const formSet = () => ALL.filter(q => q.set === "form").sort((a, b) => a.id.localeCompare(b.id));
  const CORE = TOPICS.filter(t => !t.extra);
  const TEST_ORDER = ["TWK", "TKT", "TSI", "TKP"];
  const MONO = { pancasila: "PS", uud: "UUD", sejarah: "SJ", bindo: "BI", kepegawaian: "KP", yanlik: "PL", gg: "GG", kebijakan: "KB", renstra: "RS", sotk: "SO", inggris: "EN", literasi: "LD", perkantoran: "PK", manajemen: "MJ" };
  const tcOf = t => "tc" + ((TESTS[t.test] || {}).color || 1);

  const DAY = 86400000;
  function recordAnswer(q, ok) {
    const s = state.stats[q.id] || { seen: 0, correct: 0, wrong: 0, lastWrong: false };
    const k = dayKey();
    s.seen++; ok ? s.correct++ : s.wrong++; s.lastWrong = !ok; s.t = Date.now();
    // "dikuasai" = benar pada 2 hari berbeda tanpa salah di antaranya
    if (ok) { s.okDays = (s.okDays || []).filter(d => d !== k).concat(k).slice(-3); } else s.okDays = [];
    state.stats[q.id] = s; state.days[k] = (state.days[k] || 0) + 1;
    save();
  }
  const mastered = s => !!s && !s.lastWrong && (s.okDays || []).length >= 2;
  // sudah benar (jawaban terakhir), tapi belum benar di 2 hari berbeda: lapis muda di grafik
  const okOnce = s => !!s && !s.lastWrong && !mastered(s);
  // jadwal ulang sederhana: salah -> besok; benar sekali -> 3 hari; dikuasai -> 14 hari
  const dueAt = s => !s ? 0 : (s.t || 0) + (s.lastWrong ? 1 : mastered(s) ? 14 : 3) * DAY;
  function topicStat(tid) {
    let seen = 0, correct = 0, done = 0, mast = 0, ok = 0;
    pool(tid).forEach(q => { const s = state.stats[q.id]; if (s) { seen += s.seen; correct += s.correct; done++; if (mastered(s)) mast++; else if (okOnce(s)) ok++; } });
    return { total: pool(tid).length, done, mast, ok, acc: seen ? correct / seen : null };
  }
  function overall() {
    let seen = 0, correct = 0, done = 0, mast = 0, ok = 0, total = 0;
    CORE.forEach(t => pool(t.id).forEach(q => { total++; const s = state.stats[q.id]; if (s) { seen += s.seen; correct += s.correct; done++; if (mastered(s)) mast++; else if (okOnce(s)) ok++; } }));
    return { total, done, mast, ok, seen, correct, acc: seen ? correct / seen : null };
  }
  function testReadiness() {
    return TEST_ORDER.map(k => { let total = 0, mast = 0, ok = 0; CORE.filter(t => t.test === k).forEach(t => { const st = topicStat(t.id); total += st.total; mast += st.mast; ok += st.ok; }); return { k, total, mast, ok, r: total ? mast / total : 0, rOk: total ? (mast + ok) / total : 0 }; });
  }
  // Sesi Hari Ini: soal jatuh tempo (salah kemarin, benar sekali 3 hari lalu) + soal baru dari jenis tes terlemah
  function todaySession(n) {
    n = n || 20; const now = Date.now();
    const core = CORE.flatMap(t => pool(t.id));
    const due = core.filter(q => state.stats[q.id] && dueAt(state.stats[q.id]) <= now && !mastered(state.stats[q.id])).sort((a, b) => dueAt(state.stats[a.id]) - dueAt(state.stats[b.id]));
    const out = due.slice(0, Math.min(12, n));
    const weakest = testReadiness().slice().sort((a, b) => a.r - b.r)[0];
    const fresh = shuffle(core.filter(q => !state.stats[q.id]));
    const weakTopics = new Set(CORE.filter(t => t.test === (weakest && weakest.k)).map(t => t.id));
    fresh.sort((a, b) => (weakTopics.has(b.topic) ? 1 : 0) - (weakTopics.has(a.topic) ? 1 : 0));
    for (const q of fresh) { if (out.length >= n) break; out.push(q); }
    if (out.length < n) for (const q of shuffle(core.filter(q => !out.includes(q) && mastered(state.stats[q.id]) && dueAt(state.stats[q.id]) <= now))) { if (out.length >= n) break; out.push(q); }
    if (out.length < n) for (const q of shuffle(core.filter(q => !out.includes(q)))) { if (out.length >= n) break; out.push(q); }
    return { qs: shuffle(out), due: Math.min(due.length, 12), weakest: weakest ? weakest.k : null };
  }
  // Acak urutan pilihan setiap kali soal tampil, agar yang diingat isi jawabannya, bukan posisi hurufnya.
  // Pilihan berurutan (angka, Pertama-Kelima, Romawi) tetap urut; "semua pilihan di atas" tetap di akhir.
  const ORDW = ["pertama", "kedua", "ketiga", "keempat", "kelima"], ROMW = ["I", "II", "III", "IV", "V", "I dan IV", "Semua alinea"];
  const isOrdered = q => q.o.every(x => { const t = x.trim(); return ORDW.includes(t.toLowerCase()) || ROMW.includes(t) || /^\d+([.,]\d+)?$/.test(t); });
  const PIN = /semua (pilihan|jawaban) di atas|di atas (benar|salah)|semua benar|tidak ada yang benar/i;
  function makePerm(q) {
    const idx = q.o.map((_, i) => i);
    if (isOrdered(q)) return idx;
    const pinned = idx.filter(i => PIN.test(q.o[i])), free = idx.filter(i => !PIN.test(q.o[i]));
    const last = (state.pos || {})[q.id]; let p = idx;
    // usahakan huruf kunci berbeda dari saat soal ini terakhir muncul
    for (let t = 0; t < 10; t++) { p = shuffle(free).concat(pinned); if (last === undefined || p.indexOf(q.a) !== last) break; }
    return p;
  }
  const idPerm = q => q.o.map((_, i) => i);
  function rememberPos(q, perm) { state.pos = state.pos || {}; state.pos[q.id] = perm.indexOf(q.a); }
  // soal belum dikuasai yang jatuh tempo paling lambat akhir hari besok
  function dueTomorrow() {
    const end = new Date(); end.setHours(0, 0, 0, 0); const lim = end.getTime() + 2 * DAY;
    return CORE.flatMap(t => pool(t.id)).filter(q => { const st = state.stats[q.id]; return st && !mastered(st) && dueAt(st) < lim; }).length;
  }
  function streak() {
    let n = 0; const d = new Date();
    if (!state.days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (state.days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const validHistory = () => state.history.filter(h => h.qids && h.qids.filter(id => qById[id]).length >= h.qids.length * 0.5);
  const rowsOf = h => h.rows || Object.keys(h.perTest || {}).filter(k => TESTS[k]).map(k => ({ key: k, label: TESTS[k].label, tc: "tc" + TESTS[k].color, n: h.perTest[k].n, correct: h.perTest[k].correct, score: h.perTest[k].score, max: h.perTest[k].max, th: h.thresholds && h.thresholds[k] }));

  function srcTag(q) {
    if (q.set === "form") return el("span", { class: "row", style: "gap:6px" }, [el("span", { class: "stamp" }, [icon("award"), `Soal resmi BKN · no. ${parseInt(q.id.split("-")[1], 10)}`]), el("span", { class: "chip chip-warn", title: "BKN tidak menerbitkan kunci; kunci disusun aplikasi" }, ["kunci disusun AI"])]);
    if (q.set === "ext") return el("span", { class: "chip chip-warn", title: "Isi soal diambil dari luar PPT kisi-kisi" }, ["Pelengkap · di luar isi kisi-kisi"]);
    const m = (q.src || "").match(/hal\.\s*([\d][\d\s\-–,]*)/);
    return el("span", { class: "chip chip-page" }, [m ? `Kisi-kisi hal. ${m[1].trim().replace(/[,\s]+$/, "")}` : "Dari kisi-kisi"]);
  }
  const testChip = t => el("span", { class: "chip chip-test " + tcOf(t) }, [TESTS[t.test].short]);

  // ---------- Markdown ringkas ----------
  function md(src) {
    const out = []; let list = false, table = null;
    const inl = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const endList = () => { if (list) { out.push("</ul>"); list = false; } };
    const endTable = () => { if (table) { out.push(table.join("") + "</tbody></table></div>"); table = null; } };
    src.trim().split("\n").forEach(line => {
      const t = line.trim();
      if (t.startsWith("|")) {
        endList(); const cells = t.split("|").slice(1, -1).map(c => c.trim());
        if (cells.every(c => /^-+$/.test(c))) return;
        if (!table) { table = ['<div class="table-wrap"><table><thead><tr>' + cells.map(c => `<th>${inl(c)}</th>`).join("") + "</tr></thead><tbody>"]; return; }
        table.push("<tr>" + cells.map(c => `<td>${inl(c)}</td>`).join("") + "</tr>"); return;
      }
      endTable();
      if (t.startsWith("## ")) { endList(); out.push(`<h2>${inl(t.slice(3))}</h2>`); }
      else if (t.startsWith("> ")) { endList(); out.push(`<div class="note"><b>Catatan:</b> ${inl(t.slice(2))}</div>`); }
      else if (t.startsWith("- ")) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inl(t.slice(2))}</li>`); }
      else if (/^\d+\.\s/.test(t)) { endList(); out.push(`<p>${inl(t)}</p>`); }
      else if (!t) endList();
      else { endList(); out.push(`<p>${inl(t)}</p>`); }
    });
    endList(); endTable();
    return out.join("");
  }

  // ---------- Tema ----------
  function applyTheme() {
    const t = state.settings.theme;
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    const b = $("#topTheme"); if (b) { b.innerHTML = ""; b.appendChild(icon(t === "dark" ? "moon" : t === "light" ? "sun" : "auto")); }
  }
  const THEME_LABEL = { auto: "Ikuti sistem", light: "Terang", dark: "Gelap" };
  function cycleTheme() { const o = ["auto", "light", "dark"]; state.settings.theme = o[(o.indexOf(state.settings.theme) + 1) % 3]; save(); applyTheme(); renderSideFoot(); toast("Tema: " + THEME_LABEL[state.settings.theme]); }

  // ---------- Toast & modal ----------
  let toastT;
  function toast(msg) { let t = $("#toast"); if (!t) { t = el("div", { id: "toast", class: "toast", role: "status" }); document.body.appendChild(t); } t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200); }
  function confirmBox(title, body, okLabel, onOk, danger) {
    const bg = el("div", { class: "modal-bg", onclick: e => { if (e.target === bg) bg.remove(); } });
    const ok = el("button", { class: "btn " + (danger ? "btn-danger" : "btn-primary"), onclick: () => { bg.remove(); onOk(); } }, [okLabel]);
    bg.appendChild(el("div", { class: "modal", role: "dialog", "aria-modal": "true" }, [el("h2", null, [title]), el("p", { class: "muted" }, [body]), el("div", { class: "row", style: "justify-content:flex-end" }, [el("button", { class: "btn btn-ghost", onclick: () => bg.remove() }, ["Batal"]), ok])]));
    document.body.appendChild(bg); ok.focus();
  }
  function sheet(title, content) {
    const bg = el("div", { class: "sheet-bg", onclick: e => { if (e.target === bg) bg.remove(); } });
    bg.appendChild(el("div", { class: "sheet", role: "dialog", "aria-modal": "true", "aria-label": title }, [el("div", { class: "grab" }), el("div", { class: "row between" }, [el("h2", null, [title]), el("button", { class: "btn btn-ghost icon-btn", "aria-label": "Tutup", onclick: () => bg.remove() }, [icon("x")])]), content]));
    document.body.appendChild(bg); return bg;
  }

  // ---------- Navigasi ----------
  const view = $("#view");
  const NAV = [["home", "Beranda", "home"], ["materi", "Materi", "book"], ["latihan", "Latihan", "pen"], ["simulasi", "Simulasi", "timer"], ["riwayat", "Riwayat", "chart"], ["pengaturan", "Pengaturan", "sliders"]];
  let current = "home", timerInt = null, drill = null, exam = null, jodohInt = null;
  const routes = { home: renderHome, materi: renderMateri, latihan: renderLatihan, simulasi: renderSimulasi, riwayat: renderRiwayat, pengaturan: renderPengaturan, selingan: renderSelingan, jodoh: renderJodoh, kilat: renderKilat, kelompok: renderKelompok, urut: renderUrut, tebak: renderTebak, detektif: renderDetektif };
  function renderNav() {
    const side = $("#sideNav"), tab = $("#tabbar"); side.innerHTML = ""; tab.innerHTML = "";
    NAV.forEach(([id, label, ic]) => {
      const cur = id === current || (id === "latihan" && SEL_ROUTES.includes(current)) ? "page" : null;
      side.appendChild(el("button", { "aria-current": cur, onclick: () => nav(id) }, [icon(ic), label]));
      if (id !== "pengaturan") tab.appendChild(el("button", { "aria-current": cur, onclick: () => nav(id) }, [icon(ic), label]));
    });
  }
  function renderSideFoot() {
    const f = $("#sideFoot"); if (!f) return; f.innerHTML = "";
    const d = daysLeft();
    f.append(
      el("div", { class: "countdown-mini" }, d === null ? [el("div", { class: "xs muted" }, ["Tanggal ujian belum diatur"]), el("button", { class: "btn btn-sm btn-ghost", style: "padding-left:0", onclick: () => nav("pengaturan") }, ["Atur tanggal"])]
        : [el("div", { class: "xs muted" }, ["Menuju ujian"]), el("b", { class: "num" }, [d > 0 ? `H-${d}` : d === 0 ? "Hari ini" : "Selesai"]), el("div", { class: "xs muted" }, [fmtDay(state.settings.examDate)])]),
      el("button", { class: "btn btn-sm btn-ghost", onclick: cycleTheme }, [icon(state.settings.theme === "dark" ? "moon" : state.settings.theme === "light" ? "sun" : "auto"), "Tema: " + THEME_LABEL[state.settings.theme]])
    );
  }
  function daysLeft() { if (!state.settings.examDate) return null; return Math.round((new Date(state.settings.examDate + "T00:00:00") - new Date(dayKey() + "T00:00:00")) / 86400000); }
  function nav(name, arg) {
    if (exam && !exam.finished && name !== "simulasi") return confirmBox("Tinggalkan simulasi?", "Simulasi tetap berjalan dan tersimpan. Kembali lewat menu Simulasi sebelum waktu habis.", "Tinggalkan", () => go(name, arg));
    if (drill && drill.active && name !== "latihan" && !SEL_ROUTES.includes(name)) drill.active = false;
    go(name, arg);
  }
  function go(name, arg) {
    clearInterval(jodohInt); jodohInt = null; gameKey = null;
    current = name; view.innerHTML = ""; renderNav();
    routes[name](arg);
    if (location.hash.slice(1) !== name) { try { history.replaceState(null, "", "#" + name); } catch (e) { } }
    window.scrollTo({ top: 0 });
  }

  // ---------- Beranda ----------
  function ring(value, label, soft) {
    const r = 58, c = 2 * Math.PI * r, arc = (cls, v) => v > 0 ? `<circle class="${cls}" cx="74" cy="74" r="${r}" fill="none" stroke-width="14" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - v)).toFixed(1)}"/>` : "";
    const w = el("div", { class: "ring-wrap", role: "img", "aria-label": `${Math.round(value * 100)}% ${label}` + (soft > value ? `, ${Math.round(soft * 100)}% sudah pernah benar` : "") });
    w.innerHTML = `<svg viewBox="0 0 148 148"><circle class="track" cx="74" cy="74" r="${r}" fill="none" stroke-width="14"/>${arc("val soft", soft || 0)}${arc("val", value)}</svg>`;
    w.appendChild(el("div", { class: "ring-label" }, [el("b", { class: "num" }, [Math.round(value * 100) + "%"]), el("span", null, [label])]));
    return w;
  }
  function onboardingPanel() {
    const d = daysLeft(), base = validHistory().filter(h => h.mode === "form").slice(-1)[0];
    const date = el("input", { id: "obDate", class: "input", type: "date", value: state.settings.examDate || "", style: "max-width:190px" });
    const step = (n, done, title, body, action) => el("li", { class: "ob-step" + (done ? " done" : "") }, [
      el("span", { class: "ob-num", "aria-hidden": "true" }, [done ? icon("check") : String(n)]),
      el("div", { class: "stack", style: "gap:6px;min-width:0" }, [el("h3", null, [title]), el("p", { class: "small muted" }, [body]), action])
    ]);
    return el("section", { class: "panel onboard", "aria-labelledby": "obTitle" }, [
      el("div", { class: "row between" }, [el("div", null, [el("span", { class: "eyebrow" }, ["Mulai dari sini"]), el("h2", { id: "obTitle", style: "margin-top:4px" }, ["Tiga langkah sebelum belajar rutin"])]),
        el("button", { class: "btn btn-sm btn-ghost", onclick: () => { state.onboarded = true; save(); go("home"); } }, ["Tutup panduan"])]),
      el("ol", { class: "ob-list" }, [
        step(1, d !== null, "Isi tanggal ujian", d !== null ? `Tersimpan: ${fmtDay(state.settings.examDate)} (H-${Math.max(0, d)}).` : "Hitung mundur dan porsi belajar harian mengikuti tanggal ini. Perkiraan juga boleh, nanti bisa diganti di Pengaturan.",
          d !== null ? null : el("div", { class: "row" }, [date, el("button", { class: "btn btn-sm btn-primary", onclick: () => { if (!date.value) return toast("Pilih tanggal dulu."); state.settings.examDate = date.value; save(); renderSideFoot(); go("home"); } }, ["Simpan tanggal"])])),
        step(2, !!base, "Kerjakan 50 soal resmi sebagai skor awal", base ? `Skor awal: ${base.total.score}/${base.total.max} (${pct(base.total.score, base.total.max)}%).` : "45 menit, tanpa membuka materi, dan jangan ada yang kosong. Hasilnya jadi titik awal untuk melihat kemajuan.",
          base ? null : el("button", { class: "btn btn-sm btn-primary", onclick: () => { simMode = "form"; nav("simulasi"); } }, [icon("timer"), "Buka simulasi 50 soal"])),
        step(3, state.dailyDone === dayKey(), "Lanjut dengan sesi harian", "20 soal per hari, sekitar 20-25 menit. Soal yang salah muncul lagi besok; soal yang benar diulang beberapa hari kemudian sampai dikuasai.",
          el("button", { class: "btn btn-sm", onclick: () => startDrill(todaySession(20).qs, "Sesi hari ini", { daily: true }) }, [icon("play"), "Mulai sesi hari ini"]))
      ])
    ]);
  }
  function renderHome() {
    const o = overall(), d = daysLeft(), hist = validHistory(), ses = todaySession(20);
    const doneToday = state.dailyDone === dayKey();
    if (!state.onboarded && (d === null || !hist.some(h => h.mode === "form"))) view.append(onboardingPanel());
    const best = hist.filter(h => h.mode !== "form").reduce((m, h) => Math.max(m, h.total.score), -1);
    view.append(el("section", { class: "hero" }, [
      el("div", { class: "stack", style: "position:relative;z-index:1;gap:14px" }, [
        el("span", { class: "eyebrow" }, ["UPKP S1 Kemenimipas 2026"]),
        el("h1", null, [d !== null && d >= 0 ? (d === 0 ? "Hari ujian. Tetap tenang." : `H-${d} menuju ujian`) : "Belajar dari kisi-kisi resmi BKN"]),
        el("p", null, [doneToday ? `Sesi hari ini sudah selesai. Besok ${dueTomorrow()} soal jatuh tempo untuk diulang.` : ses.qs.length ? `Sesi hari ini: ${ses.due ? ses.due + " soal jatuh tempo diulang, " : ""}sisanya soal baru${ses.weakest ? " dari " + TESTS[ses.weakest].short + " (jenis tes terlemah)" : ""}. Sekitar 20-25 menit.` : "Semua soal sudah dikuasai. Pertahankan dengan simulasi."]),
        el("div", { class: "row" }, [
          doneToday ? el("button", { class: "btn btn-light", onclick: () => startDrill(todaySession(10).qs, "Tambahan hari ini", { daily: true }) }, [icon("play"), "Tambah 10 soal"])
            : el("button", { class: "btn btn-light", onclick: () => startDrill(todaySession(20).qs, "Sesi hari ini", { daily: true }) }, [icon("play"), "Mulai sesi hari ini"]),
          el("button", { class: "btn btn-outline", onclick: () => { simMode = "upkp"; nav("simulasi"); } }, [icon("timer"), "Simulasi 100 soal"])
        ])
      ]),
      ring(o.total ? o.mast / o.total : 0, "soal dikuasai", o.total ? (o.mast + o.ok) / o.total : 0)
    ]));
    if (o.done && Date.now() - (state.lastExport || 0) > 7 * DAY && Date.now() > (state.exportSnooze || 0)) view.append(el("div", { class: "note row between", role: "status" }, [
      el("span", null, [el("b", null, ["Cadangkan progres. "]), state.lastExport ? `Terakhir diekspor ${fmtDate(state.lastExport)}.` : "Progres baru tersimpan di browser ini dan bisa hilang bila data browser terhapus."]),
      el("span", { class: "row", style: "gap:6px" }, [el("button", { class: "btn btn-sm btn-primary", onclick: () => { exportData(); go("home"); } }, ["Ekspor sekarang"]), el("button", { class: "btn btn-sm btn-ghost", onclick: () => { state.exportSnooze = Date.now() + 3 * DAY; save(); go("home"); } }, ["Nanti"])])
    ]));
    view.append(el("div", { class: "stats" }, [
      el("div", { class: "stat" }, [el("b", null, [`${o.mast}`]), el("span", null, [`dari ${o.total} soal dikuasai (benar di 2 hari berbeda)` + (o.ok ? `; ${o.ok} lagi sudah benar sekali` : "")])]),
      el("div", { class: "stat" }, [el("b", null, [o.acc === null ? "-" : pct(o.correct, o.seen) + "%"]), el("span", null, [`akurasi dari ${o.done} soal dicoba`])]),
      el("div", { class: "stat" }, [el("b", null, [`${streak()} hari`]), el("span", null, ["Belajar beruntun"])]),
      el("div", { class: "stat" }, [el("b", null, [best < 0 ? "-" : `${best}`]), el("span", null, [best < 0 ? "Belum ada simulasi" : "Skor simulasi terbaik /500"])])
    ]));
    view.append(selinganCard(true));
    // rekomendasi: topik inti dengan akurasi terendah (min. 5 jawaban) atau cakupan terendah
    const cand = CORE.map(t => ({ t, s: topicStat(t.id) }));
    const weak = cand.filter(x => x.s.acc !== null && x.s.done >= 5 && x.s.acc < .75).sort((a, b) => a.s.acc - b.s.acc)[0];
    const fresh = cand.slice().sort((a, b) => a.s.done / a.s.total - b.s.done / b.s.total)[0];
    const rec = weak || fresh;
    if (rec) view.append(el("div", { class: "panel row between" }, [
      el("div", { class: "row", style: "gap:14px;flex-wrap:nowrap" }, [el("div", { class: "mono " + tcOf(rec.t) }, [MONO[rec.t.id]]), el("div", null, [
        el("div", { class: "eyebrow" }, [weak ? "Perlu diperkuat" : "Belum banyak disentuh"]),
        el("h3", null, [rec.t.label]),
        el("p", { class: "small muted" }, [weak ? `Akurasi ${pct(rec.s.acc * 100, 100)}% dari ${rec.s.done} soal yang dicoba.` : `${rec.s.done} dari ${rec.s.total} soal sudah dicoba. Materi di kisi-kisi hal. ${rec.t.pages}.`])
      ])]),
      el("div", { class: "row" }, [el("button", { class: "btn btn-sm", onclick: () => nav("materi", { topic: rec.t.id }) }, ["Baca materi"]), el("button", { class: "btn btn-sm btn-primary", onclick: () => startDrill(pickFrom([rec.t.id], 15, "unseen"), rec.t.label) }, ["Latih 15 soal"])])
    ]));
    // kesiapan per jenis tes (ambang berlaku per jenis tes)
    view.append(el("section", { class: "panel stack", style: "gap:12px" }, [
      el("div", { class: "sec-head" }, [el("h2", null, ["Kesiapan per jenis tes"]), el("span", { class: "small muted" }, ["Persentase soal dikuasai. Ambang berlaku per jenis tes, jadi kejar yang paling rendah."]), legend()]),
      el("div", { class: "bars" }, testReadiness().map(x => el("div", { class: "bar-row tc" + TESTS[x.k].color }, [
        el("div", null, [el("div", { style: "font-weight:700;font-size:.92rem" }, [TESTS[x.k].label]), el("div", { class: "xs muted num" }, [`${x.mast}/${x.total} dikuasai` + (x.ok ? ` · ${x.ok} sudah benar` : "")])]),
        el("div", { class: "bar-track", role: "img", "aria-label": `${TESTS[x.k].label}: ${Math.round(x.r * 100)}% dikuasai, ${x.ok} soal benar menunggu diulang` }, [el("i", { class: "soft", style: `width:${x.rOk * 100}%` }), el("i", { style: `width:${x.r * 100}%` })]),
        el("div", { class: "pct-col" }, [el("div", null, [el("b", { class: "num" }, [Math.round(x.r * 100) + "%"]), el("span", { class: "xs muted" }, [" dikuasai"])]), x.ok ? el("div", { class: "xs muted num" }, [`${Math.round(x.rOk * 100)}% sudah benar`]) : null])
      ])))
    ]));
    view.append(el("div", { class: "sec-head" }, [el("h2", null, ["Penguasaan per topik"]), legend()]));
    const groups = {}; TOPICS.forEach(t => (groups[t.test] = groups[t.test] || []).push(t));
    Object.keys(groups).forEach(k => {
      const T = TESTS[k];
      view.append(el("div", { class: "test-group" }, [
        el("div", { class: "test-head tc" + T.color }, [el("span", { class: "swatch" }), el("h3", null, [T.label]), k !== "EKSTRA" ? el("span", { class: "chip" }, [`${groups[k].reduce((a, t) => a + t.n, 0)} soal di ujian`]) : el("span", { class: "chip chip-warn" }, ["di luar ujian UPKP"])]),
        el("div", { class: "topic-grid" }, groups[k].map(topicCard))
      ]));
    });
  }
  // keterangan dua lapis bar: dikuasai (penuh) dan sudah benar sekali (muda); abu-abu karena warna bar mengikuti jenis tes
  const legend = () => el("div", { class: "legend-bars xs muted" }, [el("span", null, [el("i"), "Warna penuh: dikuasai (benar di 2 hari berbeda)"]), el("span", null, [el("i", { class: "soft" }), "Warna muda: sudah benar, ulang di hari lain"])]);
  function topicCard(t) {
    const s = topicStat(t.id), cov = pct(s.mast, s.total), w = n => s.total ? n / s.total * 100 : 0;
    return el("article", { class: "topic-card " + tcOf(t) }, [
      el("div", { class: "t-top" }, [el("div", { class: "mono" }, [MONO[t.id]]), el("div", null, [el("h3", null, [t.label]), el("div", { class: "meta" }, [`Kisi-kisi hal. ${t.pages} · ${s.total} soal${t.n ? ` · ${t.n} di ujian` : ""}`]), t.extra ? el("span", { class: "chip chip-warn", style: "margin-top:6px" }, ["di luar ujian UPKP"]) : t.note ? el("span", { class: "chip chip-warn", style: "margin-top:6px", title: t.note }, ["cakupan terbatas"]) : null])]),
      el("div", { class: "stack", style: "gap:6px" }, [
        el("div", { class: "row between xs" }, [el("span", { class: "muted" }, [`${s.done} dicoba · ${s.mast + s.ok} benar · ${s.mast} dikuasai`]), el("b", null, [s.acc === null ? "belum ada" : `akurasi ${Math.round(s.acc * 100)}%`])]),
        el("div", { class: "meter", role: "progressbar", "aria-valuenow": cov, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuetext": `${cov}% dikuasai, ${s.ok} soal benar menunggu diulang`, "aria-label": t.label }, [el("i", { class: "soft", style: `width:${w(s.mast + s.ok)}%` }), el("i", { style: `width:${w(s.mast)}%` })])
      ]),
      el("div", { class: "t-actions" }, [el("button", { class: "btn btn-sm", onclick: () => nav("materi", { topic: t.id }) }, ["Materi"]), el("button", { class: "btn btn-sm btn-primary", onclick: () => startDrill(pickFrom([t.id], 10, "unseen"), t.label) }, ["Latih"])])
    ]);
  }

  // ---------- Materi ----------
  function renderMateri(arg) {
    let cur = (arg && arg.topic) || (renderMateri.last) || TOPICS[0].id;
    const toc = el("nav", { class: "toc", "aria-label": "Daftar topik" });
    const art = el("article", { class: "panel article" });
    let draw = () => {
      renderMateri.last = cur;
      toc.innerHTML = ""; let lastTest = null;
      TOPICS.forEach(t => {
        if (t.test !== lastTest) { toc.appendChild(el("div", { class: "grp eyebrow" }, [TESTS[t.test].label])); lastTest = t.test; }
        toc.appendChild(el("button", { class: tcOf(t), "aria-current": t.id === cur ? "true" : null, onclick: () => { cur = t.id; draw(); window.scrollTo({ top: 0 }); } }, [t.label]));
      });
      const t = topicById(cur), n = pool(cur).length;
      const hafal = renderMateri.mode === "hafal";
      const counter = el("span", { class: "small muted num", "aria-live": "polite" });
      const modeBar = () => el("div", { class: "cloze-bar" }, [
        el("div", { class: "seg", role: "group", "aria-label": "Mode materi" }, [["baca", "Baca"], ["hafal", "Hafalan"]].map(([v, l]) => el("button", { "aria-pressed": (renderMateri.mode || "baca") === v ? "true" : "false", onclick: () => { renderMateri.mode = v; draw(); } }, [l]))),
        hafal ? el("div", { class: "row", style: "gap:6px" }, [counter, el("button", { class: "btn btn-sm btn-ghost", onclick: () => setAll(true) }, ["Buka semua"]), el("button", { class: "btn btn-sm btn-ghost", onclick: () => setAll(false) }, ["Tutup semua"])])
          : el("span", { class: "small muted" }, ["Mode Hafalan menyembunyikan kata kunci. Tebak dulu, lalu ketuk untuk mengecek."])
      ]);
      const blanks = () => [...art.querySelectorAll(".cloze")];
      const upd = () => { const b = blanks(); counter.textContent = `${b.filter(x => x.classList.contains("open")).length}/${b.length} dibuka`; };
      const setAll = v => { blanks().forEach(b => { b.classList.toggle("open", v); b.setAttribute("aria-pressed", v); }); upd(); };
      art.innerHTML = "";
      art.append(
        el("div", { class: "stack", style: "gap:10px;margin-bottom:18px" }, [
          el("div", { class: "row" }, [testChip(t), el("span", { class: "chip chip-page" }, [`Kisi-kisi hal. ${t.pages}`]), t.n ? el("span", { class: "chip" }, [`${t.n} soal di UPKP`]) : el("span", { class: "chip chip-warn" }, ["di luar ujian UPKP"]), t.note ? el("span", { class: "chip chip-warn" }, ["cakupan terbatas"]) : null]),
          t.note ? el("p", { class: "small muted" }, [t.note]) : null,
          el("h1", null, [t.label])
        ]),
        modeBar(),
        el("div", { class: "prose", html: md(MATERI[cur] || "Materi belum tersedia.") }),
        el("div", { class: "row", style: "margin-top:24px" }, [el("button", { class: "btn btn-primary", onclick: () => startDrill(pickFrom([cur], 20, "unseen"), t.label) }, [icon("pen"), `Latih topik ini (${n} soal)`])])
      );
    };
    const origDraw = draw;
    draw = () => {
      origDraw();
      if (renderMateri.mode !== "hafal") return;
      art.querySelectorAll(".prose strong").forEach(st => {
        const b = el("button", { class: "cloze", type: "button", "aria-pressed": "false", title: "Ketuk untuk membuka" });
        b.append(...st.childNodes);
        b.addEventListener("click", () => { const o = b.classList.toggle("open"); b.setAttribute("aria-pressed", o); const c = art.querySelector(".cloze-bar .num"); const all = [...art.querySelectorAll(".cloze")]; if (c) c.textContent = `${all.filter(x => x.classList.contains("open")).length}/${all.length} dibuka`; });
        st.replaceWith(b);
      });
      const c = art.querySelector(".cloze-bar .num"), all = [...art.querySelectorAll(".cloze")]; if (c) c.textContent = `0/${all.length} dibuka`;
    };
    draw();
    view.append(el("div", { class: "materi" }, [toc, art]));
  }

  // ---------- Selingan: mini game ----------
  // Semua kartu dari tabel/bagan PPT kisi-kisi (js/jodoh.js, js/kelompok.js, js/urut.js, js/tebak.js, js/detektif.js).
  // Catatan benar/keliru per kartu disimpan di state.jodoh; kartu yang keliru terakhir kali didahulukan di ronde berikutnya.
  const JODOH = window.JODOH || [], KELOMPOK = window.KELOMPOK || [], URUT = window.URUT || [], TEBAK = window.TEBAK || [], DETEKTIF = window.DETEKTIF || [];
  const setInScope = x => state.settings.includeExt !== false || !x.ext;
  const gKey = (x, item) => x.id + "|" + item;
  const gStat = key => (state.jodoh || {})[key];
  const gWeak = st => !!st && st.w > 0 && st.lastW;
  // prioritas: pernah keliru, belum pernah muncul, sisanya acak
  const gRank = key => { const st = gStat(key); return gWeak(st) ? 0 : !st ? 1 : 2; };
  function gRecord(key, wrong) { state.jodoh = state.jodoh || {}; const st = state.jodoh[key] || { r: 0, w: 0 }; wrong ? st.w++ : st.r++; st.lastW = !!wrong; st.t = Date.now(); state.jodoh[key] = st; }
  const kItems = x => x.bins.flatMap((b, bi) => b.items.map(it => ({ it, bi })));
  const GAMES = [
    { id: "jodoh", title: "Jodohkan", icon: "pair", sets: () => JODOH.filter(setInScope), keys: x => x.pairs.map(p => gKey(x, p[0])), count: x => `${x.pairs.length} pasangan`, size: 6,
      desc: "Pasangkan kartu kiri dengan kanan: lambang dan sila, pasal dan isinya, tokoh dan teorinya.", how: "Ketuk satu kartu di kiri, lalu pasangannya di kanan." },
    { id: "kilat", title: "Benar atau Salah", icon: "bolt",
      desc: "60 detik. Pernyataan muncul satu per satu; putuskan benar atau salah secepatnya." },
    { id: "kelompok", title: "Kelompokkan", icon: "bins", sets: () => KELOMPOK.filter(setInScope), keys: x => kItems(x).map(o => gKey(x, o.it)), count: x => `${kItems(x).length} kartu · ${x.bins.length} kelompok`, size: 8,
      desc: "Masukkan kartu ke kelompok yang tepat: hukuman ringan, sedang, atau berat; kapital benar atau salah; asas atau karakteristik.", how: "Baca kartu, lalu ketuk kelompoknya." },
    { id: "urut", title: "Urutkan", icon: "steps", sets: () => URUT.filter(setInScope), keys: x => x.items.map(it => gKey(x, it[0])), count: x => `${x.items.length} langkah`, size: 6,
      desc: "Susun peristiwa dan tahapan ke urutan yang benar: Mei 1998, siklus kebijakan, bab UUD, PN 1 sampai 8.", how: "Ketuk kartu sesuai urutannya, mulai dari yang pertama." },
    { id: "tebak", title: "Tebak dari Petunjuk", icon: "quiz", sets: () => TEBAK.filter(setInScope), keys: x => x.items.map(it => gKey(x, it.a)), count: x => `${x.items.length} teka-teki`, size: 5,
      desc: "Petunjuk dibuka satu per satu, dari yang paling sulit. Tebak presiden, pasal, tokoh, atau istilahnya secepat mungkin.", how: "Makin sedikit petunjuk yang dipakai, makin banyak bintang; tebakan keliru membuka petunjuk berikutnya." },
    { id: "detektif", title: "Detektif Kisi-kisi", icon: "search", sets: () => DETEKTIF.filter(setInScope), keys: x => x.items.map(it => gKey(x, it.find(s => Array.isArray(s))[1])), count: x => `${x.items.length} paragraf`, size: 5,
      desc: "Setiap paragraf menyelipkan satu kesalahan: angka, tanggal, nama, atau istilah yang tertukar. Temukan dan ketuk.", how: "Ketuk bagian yang salah; bagian yang benar akan ditandai aman." }
  ];
  const gameById = id => GAMES.find(g => g.id === id);
  const gMissed = (g, x) => g.keys(x).filter(k => gWeak(gStat(k))).length;
  const SEL_ROUTES = ["selingan", "jodoh", "kilat", "kelompok", "urut", "tebak", "detektif"];
  let gameKey = null; // penangan keyboard milik game yang sedang tampil; dikosongkan setiap pindah halaman
  function selinganCard(compact) {
    const weak = GAMES.filter(g => g.sets).reduce((a, g) => a + g.sets().reduce((b, x) => b + gMissed(g, x), 0), 0);
    return el("section", { class: "panel jodoh-card" }, [
      el("div", { class: "jc-art", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
      el("div", { class: "stack", style: "gap:4px;min-width:0" }, [
        el("span", { class: "eyebrow" }, [compact ? "Lagi jenuh?" : "Selingan"]),
        el("h2", null, ["Mini game kisi-kisi"]),
        el("p", { class: "small muted" }, [(compact ? "Jodohkan, Benar atau Salah, Kelompokkan, Urutkan, Tebak, Detektif. Satu ronde sekitar satu menit." : "Enam mini game dari tabel dan bagan PPT kisi-kisi, satu ronde sekitar satu menit.") + (weak ? ` ${weak} kartu pernah keliru dan akan muncul lagi.` : "")])
      ]),
      el("button", { class: "btn btn-primary", onclick: () => nav("selingan") }, [icon("play"), "Main"])
    ]);
  }
  const resumeBtn = () => drill && drill.active && drill.i < drill.qs.length
    ? el("button", { class: "btn btn-primary", onclick: () => go("latihan") }, [icon("play"), `Lanjut latihan (soal ${drill.i + 1}/${drill.qs.length})`]) : null;
  const backBtn = (label, route) => el("button", { class: "btn btn-ghost btn-sm", style: "padding-left:0;align-self:flex-start", onclick: () => go(route) }, [icon("left"), label]);
  function renderSelingan() {
    view.append(
      el("div", { class: "stack", style: "gap:6px" }, [
        el("span", { class: "eyebrow" }, ["Selingan"]),
        el("h1", null, ["Mini game kisi-kisi"]),
        el("p", { class: "muted" }, ["Jeda dari pilihan ganda tanpa berhenti belajar. Semua kartu diambil dari tabel dan bagan PPT kisi-kisi BKN. Kartu yang keliru di game mana pun akan muncul lagi lebih dulu."])
      ]),
      resumeBtn() ? el("div", { class: "row" }, [resumeBtn()]) : "",
      el("div", { class: "game-grid" }, GAMES.map(g => {
        const sets = g.sets ? g.sets() : null, miss = sets ? sets.reduce((a, x) => a + gMissed(g, x), 0) : 0, kb = state.kilatBest || 0;
        const meta = sets ? `${sets.length} set` + (miss ? ` · ${miss} kartu pernah keliru` : "") : kb ? `Rekor: ${kb} benar dalam 60 detik` : "Belum ada rekor";
        return el("button", { class: "game-card", onclick: () => go(g.id) }, [
          el("span", { class: "game-ic", "aria-hidden": "true" }, [icon(g.icon)]),
          el("span", { class: "stack", style: "gap:4px;min-width:0" }, [el("span", { class: "game-t" }, [g.title]), el("span", { class: "small muted" }, [g.desc]), el("span", { class: "xs faint" }, [meta])]),
          icon("right")
        ]);
      }))
    );
  }
  // daftar set per jenis tes, dipakai Jodohkan, Kelompokkan, Urutkan
  function setMenu(g) {
    const sets = g.sets();
    const pickRandom = () => { const w = sets.filter(x => gMissed(g, x)); const fresh = sets.filter(x => !(state.jodohBest || {})[x.id]); return shuffle(w.length ? w : fresh.length ? fresh : sets)[0]; };
    view.append(
      el("div", { class: "stack", style: "gap:6px" }, [
        backBtn("Semua mini game", "selingan"),
        el("h1", null, [g.title]),
        el("p", { class: "muted" }, [`${g.desc} ${g.how} Tidak ada skor, hanya waktu dan jumlah keliru.`])
      ]),
      el("div", { class: "row" }, [resumeBtn(), el("button", { class: resumeBtn() ? "btn" : "btn btn-primary", onclick: () => go(g.id, { set: pickRandom().id }) }, [icon("shuffle"), "Set acak"])])
    );
    const groups = {}; sets.forEach(x => { const t = topicById(x.topic); (groups[t.test] = groups[t.test] || []).push(x); });
    TEST_ORDER.concat(Object.keys(groups).filter(k => !TEST_ORDER.includes(k))).filter(k => groups[k]).forEach(k => {
      const T = TESTS[k];
      view.append(el("div", { class: "test-group" }, [
        el("div", { class: "test-head tc" + T.color }, [el("span", { class: "swatch" }), el("h3", null, [T.label])]),
        el("div", { class: "jset-grid" }, groups[k].map(x => {
          const t = topicById(x.topic), best = (state.jodohBest || {})[x.id], miss = gMissed(g, x);
          return el("button", { class: "jset " + tcOf(t), onclick: () => go(g.id, { set: x.id }) }, [
            el("span", { class: "jset-top" }, [el("span", { class: "mono" }, [MONO[t.id]]), el("span", { class: "jset-t" }, [x.title])]),
            el("span", { class: "xs muted" }, [`${g.count(x)} · kisi-kisi hal. ${x.pages}`]),
            el("span", { class: "row", style: "gap:6px" }, [
              x.ext ? el("span", { class: "chip chip-warn" }, ["Pelengkap"]) : null,
              miss ? el("span", { class: "chip chip-bad" }, [`${miss} pernah keliru`]) : null,
              best ? el("span", { class: "chip num" }, [icon("award"), `${fmtTime(best.time)} · ${best.err} keliru`]) : el("span", { class: "xs faint" }, ["Belum dimainkan"])
            ])
          ]);
        }))
      ]));
    });
  }
  function playHead(g, x, meter) {
    const t = topicById(x.topic);
    return el("div", { class: "stack", style: "gap:10px" }, [
      el("div", { class: "row between" }, [backBtn("Pilih set", g.id), el("div", { class: "jmeter small muted" }, meter)]),
      el("div", { class: "row", style: "gap:6px" }, [testChip(t), el("span", { class: "chip chip-page" }, [`Kisi-kisi hal. ${x.pages}`]), x.ext ? el("span", { class: "chip chip-warn" }, ["Pelengkap, di luar isi kisi-kisi"]) : null]),
      el("h1", null, [x.title])
    ]);
  }
  function roundClock() {
    const t0 = Date.now(), node = el("span", { class: "num" }, ["00:00"]);
    clearInterval(jodohInt); jodohInt = setInterval(() => { node.textContent = fmtTime(Math.round((Date.now() - t0) / 1000)); }, 1000);
    return { node, secs: () => Math.max(1, Math.round((Date.now() - t0) / 1000)) };
  }
  const meterSpan = (label, node) => el("span", null, [label + " ", node]);
  // o: { secs, errors, full, marks: [[key, keliru]], wrong: [[a, b]], wrongTitle, doneTitle, extra }
  function finishRound(g, x, o) {
    clearInterval(jodohInt); jodohInt = null; gameKey = null;
    state.jodohBest = state.jodohBest || {};
    o.marks.forEach(([k, w]) => gRecord(k, w));
    o.prev = state.jodohBest[x.id];
    o.record = o.full && (!o.prev || o.errors < o.prev.err || (o.errors === o.prev.err && o.secs < o.prev.time));
    if (o.record) state.jodohBest[x.id] = { time: o.secs, err: o.errors };
    const k = dayKey(); state.days[k] = (state.days[k] || 0) + 1; save();
    setTimeout(() => { if (current === g.id) roundResult(g, x, o); }, 450);
  }
  function roundResult(g, x, o) {
    view.innerHTML = "";
    const sets = g.sets(), next = shuffle(sets.filter(s => s.id !== x.id && s.topic !== x.topic))[0] || shuffle(sets.filter(s => s.id !== x.id))[0];
    const prev = o.prev;
    view.append(
      el("section", { class: "panel lift stack", style: "gap:18px" }, [
        el("div", { class: "row", style: "gap:14px;flex-wrap:nowrap" }, [el("span", { class: "done-badge", "aria-hidden": "true" }, [icon(o.errors ? g.icon : "check")]), el("div", null, [el("span", { class: "eyebrow" }, [`${g.title} · ${x.title}`]), el("h1", { style: "margin-top:4px" }, [o.errors ? o.doneTitle : "Sempurna, tanpa keliru"])])]),
        el("div", { class: "stats", style: "grid-template-columns:repeat(3,minmax(0,1fr))" }, [
          el("div", { class: "stat" }, [el("b", { class: "num" }, [fmtTime(o.secs)]), el("span", null, ["waktu"])]),
          el("div", { class: "stat" }, [el("b", { class: "num" }, [String(o.errors)]), el("span", null, ["kali keliru"])]),
          el("div", { class: "stat" }, o.record ? [el("b", null, [prev ? "Rekor baru" : "Tercatat"]), el("span", null, [prev ? `sebelumnya ${fmtTime(prev.time)}, ${prev.err} keliru` : "rekor pertama set ini"])]
            : prev ? [el("b", { class: "num" }, [fmtTime(prev.time)]), el("span", null, [`rekor set ini (${prev.err} keliru)`])] : [el("b", null, ["-"]), el("span", null, ["rekor"])])
        ]),
        o.wrong.length ? el("div", { class: "stack", style: "gap:8px" }, [
          el("h2", null, [o.wrongTitle]),
          el("p", { class: "small muted" }, ["Kartu ini akan didahulukan di ronde berikutnya."]),
          el("ul", { class: "jlist" }, o.wrong.map(pr => el("li", null, [el("b", null, [pr[0]]), el("span", { "aria-hidden": "true" }, ["→"]), el("span", null, [pr[1]])])))
        ]) : "",
        o.extra || "",
        el("p", { class: "xs muted" }, [`Rujukan: PPT kisi-kisi BKN hal. ${x.pages}.`]),
        el("div", { class: "row" }, [
          resumeBtn(),
          el("button", { class: resumeBtn() ? "btn" : "btn btn-primary", onclick: () => go(g.id, { set: x.id }) }, [icon("shuffle"), "Main lagi"]),
          next ? el("button", { class: "btn", onclick: () => go(g.id, { set: next.id }) }, [`Set lain: ${next.title}`]) : null,
          el("button", { class: "btn btn-ghost", onclick: () => go("selingan") }, ["Mini game lain"])
        ])
      ])
    );
    const f = view.querySelector(".btn-primary"); if (f) f.focus();
  }

  // Jodohkan: 6 pasangan per ronde
  function renderJodoh(arg) {
    const x = arg && arg.set && JODOH.find(j => j.id === arg.set);
    return x ? jodohPlay(x) : setMenu(gameById("jodoh"));
  }
  function jodohPlay(x) {
    const g = gameById("jodoh");
    const pairs = shuffle(x.pairs).sort((a, b) => gRank(gKey(x, a[0])) - gRank(gKey(x, b[0]))).slice(0, g.size);
    const L2 = shuffle(pairs.map((_, i) => i)), R2 = shuffle(pairs.map((_, i) => i));
    const done = new Set(), missed = new Set(), clk = roundClock();
    let sel = null, errors = 0, busy = false;
    const errEl = el("span", { class: "num" }, ["0"]), prog = el("span", { class: "num" }, [`0/${pairs.length}`]);
    const live = el("div", { class: "sr-only", "aria-live": "polite" });
    const card = (side, i) => el("button", { class: "jcard" + (side === "R" ? " r" : ""), "data-side": side, "data-i": i, "aria-pressed": "false", onclick: e => tap(side, i, e.currentTarget) }, [el("span", null, [pairs[i][side === "L" ? 0 : 1]])]);
    const colL = el("div", { class: "jcol", role: "group", "aria-label": x.left }, L2.map(i => card("L", i)));
    const colR = el("div", { class: "jcol", role: "group", "aria-label": x.right }, R2.map(i => card("R", i)));
    const board = el("div", { class: "jboard" }, [el("div", { class: "jhead" }, [x.left]), el("div", { class: "jhead" }, [x.right]), colL, colR]);
    const clear = () => { board.querySelectorAll(".jcard[aria-pressed=true]").forEach(b => b.setAttribute("aria-pressed", "false")); sel = null; };
    function tap(side, i, btn) {
      if (busy || done.has(i) && btn.disabled) return;
      if (sel && sel.btn === btn) return clear();
      if (!sel || sel.side === side) { clear(); sel = { side, i, btn }; btn.setAttribute("aria-pressed", "true"); return; }
      const a = sel, li = side === "L" ? i : a.i;
      if (a.i === i) {
        done.add(i); [a.btn, btn].forEach(b => { b.setAttribute("aria-pressed", "false"); b.classList.add("ok"); b.disabled = true; b.prepend(el("span", { class: "jnum" }, [String(done.size)])); });
        sel = null; prog.textContent = `${done.size}/${pairs.length}`; live.textContent = `Cocok: ${pairs[i][0]} dengan ${pairs[i][1]}.`;
        if (done.size === pairs.length) finishRound(g, x, {
          secs: clk.secs(), errors, full: pairs.length === Math.min(g.size, x.pairs.length),
          marks: pairs.map((pr, j) => [gKey(x, pr[0]), missed.has(j)]), wrong: pairs.filter((_, j) => missed.has(j)),
          wrongTitle: "Pasangan yang tadi keliru", doneTitle: "Semua pasangan ketemu"
        });
      } else {
        errors++; errEl.textContent = String(errors); missed.add(li);
        live.textContent = "Belum cocok, coba lagi.";
        busy = true; [a.btn, btn].forEach(b => b.classList.add("bad"));
        setTimeout(() => { [a.btn, btn].forEach(b => b.classList.remove("bad")); clear(); busy = false; }, 520);
      }
    }
    view.append(
      playHead(g, x, [meterSpan("Cocok", prog), meterSpan("Keliru", errEl), el("span", null, [icon("timer"), clk.node])]),
      el("section", { class: "panel jpanel" }, [board, live]),
      el("p", { class: "xs muted" }, ["Ketuk kartu kiri, lalu pasangannya di kanan (urutan sebaliknya juga bisa)."])
    );
  }

  // Kelompokkan: 8 kartu per ronde, diambil bergiliran dari tiap kelompok
  function renderKelompok(arg) {
    const x = arg && arg.set && KELOMPOK.find(j => j.id === arg.set);
    return x ? kelompokPlay(x) : setMenu(gameById("kelompok"));
  }
  function kelompokPlay(x) {
    const g = gameById("kelompok");
    const byBin = x.bins.map((b, bi) => shuffle(b.items).map(it => ({ it, bi })).sort((a, c) => gRank(gKey(x, a.it)) - gRank(gKey(x, c.it))));
    const size = Math.min(g.size, kItems(x).length), deck = [];
    for (let r = 0; deck.length < size; r++) { let added = false; byBin.forEach(l => { if (deck.length < size && l[r]) { deck.push(l[r]); added = true; } }); if (!added) break; }
    const cards = shuffle(deck), missed = new Set(), clk = roundClock();
    let i = 0, errors = 0, busy = false;
    const errEl = el("span", { class: "num" }, ["0"]), prog = el("span", { class: "num" }, [`0/${cards.length}`]);
    const live = el("div", { class: "sr-only", "aria-live": "polite" });
    const cardEl = el("div", { class: "kcard" });
    const bins = x.bins.map((b, bi) => {
      const chips = el("span", { class: "kchips" });
      const btn = el("button", { class: "kbin", onclick: () => place(bi) }, [el("span", { class: "kbin-h" }, [el("span", { class: "kbin-n" }, [String(bi + 1)]), el("span", null, [b.label])]), chips]);
      return { btn, chips };
    });
    const draw = () => {
      cardEl.innerHTML = ""; cardEl.classList.remove("in"); void cardEl.offsetWidth; cardEl.classList.add("in");
      cardEl.append(el("span", { class: "xs muted" }, [`Kartu ${i + 1} dari ${cards.length}`]), el("b", null, [cards[i].it]));
    };
    function place(bi) {
      if (busy || i >= cards.length) return;
      const c = cards[i], ok = bi === c.bi;
      busy = true;
      if (ok) live.textContent = `Tepat: ${x.bins[c.bi].label}.`;
      else {
        errors++; errEl.textContent = String(errors); missed.add(i);
        live.textContent = `Belum tepat. ${c.it} masuk ${x.bins[c.bi].label}.`;
        bins[bi].btn.classList.add("bad"); bins[c.bi].btn.classList.add("hint"); cardEl.classList.add("bad");
        cardEl.append(el("span", { class: "kfix small" }, [`Masuk ke: ${x.bins[c.bi].label}`]));
      }
      setTimeout(() => {
        bins.forEach(b => b.btn.classList.remove("bad", "hint")); cardEl.classList.remove("bad");
        bins[c.bi].chips.append(el("span", { class: "kchip" + (ok ? "" : " miss") }, [c.it]));
        i++; prog.textContent = `${i}/${cards.length}`; busy = false;
        if (i < cards.length) return draw();
        cardEl.innerHTML = ""; cardEl.append(el("b", null, ["Semua kartu sudah masuk"]));
        finishRound(g, x, {
          secs: clk.secs(), errors, full: cards.length === size,
          marks: cards.map((cc, j) => [gKey(x, cc.it), missed.has(j)]), wrong: cards.filter((_, j) => missed.has(j)).map(cc => [cc.it, x.bins[cc.bi].label]),
          wrongTitle: "Kartu yang tadi salah kelompok", doneTitle: "Semua kartu terkelompok"
        });
      }, ok ? 240 : 1300);
    }
    gameKey = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= x.bins.length) { place(n - 1); return true; } return false; };
    view.append(
      playHead(g, x, [meterSpan("Kartu", prog), meterSpan("Keliru", errEl), el("span", null, [icon("timer"), clk.node])]),
      el("section", { class: "panel jpanel stack", style: "gap:14px" }, [x.q ? el("p", { class: "small muted" }, [x.q]) : null, cardEl, el("div", { class: "kbins" }, bins.map(b => b.btn)), live]),
      el("p", { class: "xs muted" }, [(x.note ? x.note + " " : "") + "Di keyboard, tekan angka kelompok."])
    );
    draw();
  }

  // Urutkan: maksimal 6 kartu per ronde; kartu dipilih dengan prioritas lalu diurutkan sesuai urutan aslinya
  function renderUrut(arg) {
    const x = arg && arg.set && URUT.find(j => j.id === arg.set);
    return x ? urutPlay(x) : setMenu(gameById("urut"));
  }
  function urutPlay(x) {
    const g = gameById("urut"), n = Math.min(g.size, x.items.length);
    const pick = shuffle(x.items.map((_, k) => k)).sort((a, b) => gRank(gKey(x, x.items[a][0])) - gRank(gKey(x, x.items[b][0]))).slice(0, n).sort((a, b) => a - b);
    const missed = new Set(), clk = roundClock();
    let pos = 0, errors = 0, tries = 0, busy = false;
    const errEl = el("span", { class: "num" }, ["0"]), prog = el("span", { class: "num" }, [`0/${n}`]);
    const live = el("div", { class: "sr-only", "aria-live": "polite" });
    const slots = pick.map((_, k) => el("li", { class: "uslot" + (k === 0 ? " next" : "") }, [el("span", { class: "unum" }, [String(k + 1)]), el("span", { class: "utext faint" }, [k === 0 ? `Kartu pertama? (${n} kartu)` : ""])]));
    const pool = el("div", { class: "upool", role: "group", "aria-label": "Kartu yang belum diurutkan" }, shuffle(pick.map((_, k) => k)).map(k => el("button", { class: "ucard", "data-k": k, onclick: e => tap(k, e.currentTarget) }, [x.items[pick[k]][0]])));
    function tap(k, btn) {
      if (busy) return;
      if (k === pos) {
        const it = x.items[pick[k]], s = slots[pos];
        s.classList.remove("next"); s.classList.add(missed.has(pos) ? "late" : "ok");
        s.lastChild.replaceWith(el("span", { class: "utext" }, [it[0], it[1] ? el("span", { class: "udet" }, [it[1]]) : null]));
        btn.remove(); pos++; tries = 0; prog.textContent = `${pos}/${n}`;
        live.textContent = `Tepat, urutan ke-${pos}: ${it[0]}.`;
        if (pos < n) { slots[pos].classList.add("next"); slots[pos].lastChild.textContent = `Berikutnya? (${n - pos} kartu lagi)`; return; }
        finishRound(g, x, {
          secs: clk.secs(), errors, full: true,
          marks: pick.map((p, j) => [gKey(x, x.items[p][0]), missed.has(j)]),
          wrong: pick.filter((_, j) => missed.has(j)).map(p => [x.items[p][0], `urutan ke-${pick.indexOf(p) + 1}` + (x.items[p][1] ? ` (${x.items[p][1]})` : "")]),
          wrongTitle: "Posisi yang tadi keliru", doneTitle: "Urutan lengkap tersusun",
          extra: el("div", { class: "stack", style: "gap:8px" }, [el("h2", null, ["Urutan yang benar"]), el("ol", { class: "ulist done" }, pick.map((p, j) => el("li", { class: "uslot " + (missed.has(j) ? "late" : "ok") }, [el("span", { class: "unum" }, [String(j + 1)]), el("span", { class: "utext" }, [x.items[p][0], x.items[p][1] ? el("span", { class: "udet" }, [x.items[p][1]]) : null])])))])
        });
      } else {
        errors++; tries++; errEl.textContent = String(errors); missed.add(pos);
        live.textContent = `Belum. Itu bukan urutan ke-${pos + 1}.`;
        busy = true; btn.classList.add("bad");
        // dua kali keliru di posisi yang sama: tandai kartu yang benar agar tidak buntu
        if (tries >= 2) { const h = pool.querySelector(`[data-k="${pos}"]`); if (h) h.classList.add("hint"); }
        setTimeout(() => { btn.classList.remove("bad"); busy = false; }, 450);
      }
    }
    view.append(
      playHead(g, x, [meterSpan("Tersusun", prog), meterSpan("Keliru", errEl), el("span", null, [icon("timer"), clk.node])]),
      el("section", { class: "panel jpanel stack", style: "gap:14px" }, [
        el("p", { class: "small muted" }, [`${x.dir}. Ketuk kartu yang menempati urutan berikutnya.`]),
        el("ol", { class: "ulist" }, slots),
        el("div", { class: "jhead" }, ["Kartu"]),
        pool, live
      ])
    );
  }

  // Benar atau Salah: 60 detik, pernyataan dibentuk dari pasangan Jodohkan (asli atau ditukar dengan pasangan lain di set yang sama)
  let kilatScope = "all";
  const kilatSets = () => JODOH.filter(setInScope).filter(x => x.pairs.length >= 3 && (kilatScope === "all" || topicById(x.topic).test === kilatScope));
  function renderKilat(arg) { return arg && arg.play ? kilatPlay() : kilatMenu(); }
  function kilatMenu() {
    const all = JODOH.filter(setInScope), tests = TEST_ORDER.concat(["EKSTRA"]).filter(k => all.some(x => topicById(x.topic).test === k));
    if (kilatScope !== "all" && !tests.includes(kilatScope)) kilatScope = "all";
    const info = el("span", { class: "small muted" });
    const upd = () => { const s = kilatSets(); info.textContent = `${s.reduce((a, x) => a + x.pairs.length, 0)} pernyataan dari ${s.length} set.`; };
    const seg = el("div", { class: "seg", role: "group", "aria-label": "Cakupan" });
    const drawSeg = () => { seg.innerHTML = ""; [["all", "Semua"]].concat(tests.map(k => [k, TESTS[k].short])).forEach(([v, l]) => seg.appendChild(el("button", { "aria-pressed": kilatScope === v ? "true" : "false", onclick: () => { kilatScope = v; drawSeg(); upd(); } }, [l]))); };
    drawSeg(); upd();
    const kb = state.kilatBest || 0;
    view.append(
      el("div", { class: "stack", style: "gap:6px" }, [
        backBtn("Semua mini game", "selingan"),
        el("h1", null, ["Benar atau Salah"]),
        el("p", { class: "muted" }, ["Sebuah pasangan muncul, misalnya pasal dan isinya. Putuskan pasangan itu benar atau salah. Salah menjawab tidak mengurangi waktu: jawaban yang benar ditampilkan dulu, lalu waktu berjalan lagi."])
      ]),
      el("section", { class: "panel stack", style: "gap:16px" }, [
        el("div", { class: "field" }, [el("span", { class: "label" }, ["Cakupan"]), seg, info]),
        el("div", { class: "row" }, [resumeBtn(), el("button", { class: resumeBtn() ? "btn" : "btn btn-primary", onclick: () => go("kilat", { play: true }) }, [icon("bolt"), "Mulai 60 detik"])]),
        el("p", { class: "xs muted" }, [kb ? `Rekor: ${kb} jawaban benar dalam 60 detik. ` : "", "Di keyboard: panah kanan atau B = Benar, panah kiri atau S = Salah."])
      ])
    );
  }
  function kilatPlay() {
    const sets = kilatSets(), all = sets.flatMap(x => x.pairs.map(p => ({ x, p })));
    if (!all.length) return kilatMenu();
    const weak = all.filter(o => gWeak(gStat(gKey(o.x, o.p[0]))));
    const used = new Set(), marks = new Map(), wrongs = [];
    const LIMIT = 60000;
    let cur = null, score = 0, answered = 0, streak = 0, bestStreak = 0, left = LIMIT, last = Date.now(), paused = false, done = false, fixT = null;
    const scoreEl = el("span", { class: "num" }, ["0"]), streakEl = el("span", { class: "num" }, ["0"]), secEl = el("span", { class: "num" }, ["60"]);
    const bar = el("i", { style: "width:100%" }), barWrap = el("div", { class: "kbar", role: "progressbar", "aria-label": "Sisa waktu", "aria-valuemin": 0, "aria-valuemax": 60 }, [bar]);
    const qEl = el("div", { class: "kq", "aria-live": "polite" }), fixEl = el("div");
    const bNo = el("button", { class: "kbtn no", onclick: () => answer(false) }, [icon("x"), "Salah"]);
    const bYes = el("button", { class: "kbtn yes", onclick: () => answer(true) }, [icon("check"), "Benar"]);
    function nextQ() {
      let cand = weak.length && Math.random() < 0.35 ? weak.filter(o => !used.has(o)) : [];
      if (!cand.length) cand = all.filter(o => !used.has(o));
      if (!cand.length) { used.clear(); cand = all; }
      const o = cand[Math.floor(Math.random() * cand.length)]; used.add(o);
      const truth = Math.random() < 0.5, others = o.x.pairs.filter(q => q !== o.p);
      cur = { o, truth, shown: truth ? o.p[1] : others[Math.floor(Math.random() * others.length)][1] };
      const t = topicById(o.x.topic);
      qEl.className = "kq"; qEl.innerHTML = "";
      qEl.append(
        el("span", { class: "row", style: "gap:6px" }, [testChip(t), el("span", { class: "xs muted" }, [o.x.title])]),
        el("span", { class: "kq-l" }, [o.x.left]), el("span", { class: "kq-v" }, [o.p[0]]),
        el("span", { class: "kq-l" }, [o.x.right]), el("span", { class: "kq-v" }, [cur.shown])
      );
      fixEl.innerHTML = ""; bNo.disabled = bYes.disabled = false;
    }
    function resume() { clearTimeout(fixT); if (!paused || done) return; paused = false; last = Date.now(); nextQ(); }
    function answer(v) {
      if (done || paused || !cur) return;
      const ok = v === cur.truth, key = gKey(cur.o.x, cur.o.p[0]);
      answered++; marks.set(key, marks.get(key) || !ok);
      if (ok) {
        score++; streak++; bestStreak = Math.max(bestStreak, streak); scoreEl.textContent = String(score); streakEl.textContent = String(streak);
        qEl.classList.add("ok"); bNo.disabled = bYes.disabled = true; paused = true;
        setTimeout(() => { paused = false; last = Date.now(); if (!done) nextQ(); }, 200);
        return;
      }
      streak = 0; streakEl.textContent = "0"; paused = true; wrongs.push(cur);
      qEl.classList.add("bad"); bNo.disabled = bYes.disabled = true;
      fixEl.append(el("div", { class: "kfix" }, [
        el("b", null, [cur.truth ? "Pasangan itu benar." : "Pasangan itu salah."]),
        cur.truth ? null : el("span", null, [` Yang benar: ${cur.o.p[0]} → ${cur.o.p[1]}.`]),
        el("button", { class: "btn btn-sm btn-primary", style: "margin-left:auto", onclick: resume }, ["Lanjut", icon("right")])
      ]));
      const lb = fixEl.querySelector("button"); if (lb) lb.focus();
      fixT = setTimeout(resume, 3200);
    }
    function end() {
      done = true; clearInterval(jodohInt); jodohInt = null; clearTimeout(fixT); gameKey = null;
      marks.forEach((w, k) => gRecord(k, w));
      const prev = state.kilatBest || 0, record = score > prev;
      if (record) state.kilatBest = score;
      const k = dayKey(); state.days[k] = (state.days[k] || 0) + 1; save();
      const seen = new Set(), wl = wrongs.filter(w => { const kk = gKey(w.o.x, w.o.p[0]); if (seen.has(kk)) return false; seen.add(kk); return true; });
      view.innerHTML = "";
      view.append(el("section", { class: "panel lift stack", style: "gap:18px" }, [
        el("div", { class: "row", style: "gap:14px;flex-wrap:nowrap" }, [el("span", { class: "done-badge", "aria-hidden": "true" }, [icon("bolt")]), el("div", null, [el("span", { class: "eyebrow" }, ["Benar atau Salah · " + (kilatScope === "all" ? "Semua" : TESTS[kilatScope].short)]), el("h1", { style: "margin-top:4px" }, [record && prev ? "Rekor baru" : "Waktu habis"])])]),
        el("div", { class: "stats" }, [
          el("div", { class: "stat" }, [el("b", { class: "num" }, [String(score)]), el("span", null, ["jawaban benar"])]),
          el("div", { class: "stat" }, [el("b", { class: "num" }, [answered ? pct(score, answered) + "%" : "-"]), el("span", null, [`akurasi dari ${answered} jawaban`])]),
          el("div", { class: "stat" }, [el("b", { class: "num" }, [String(bestStreak)]), el("span", null, ["benar beruntun terpanjang"])]),
          el("div", { class: "stat" }, [el("b", { class: "num" }, [String(Math.max(prev, score))]), el("span", null, [record ? (prev ? `rekor baru (sebelumnya ${prev})` : "rekor pertama") : "rekor"])])
        ]),
        wl.length ? el("div", { class: "stack", style: "gap:8px" }, [
          el("h2", null, ["Pasangan yang benar untuk jawaban yang keliru"]),
          el("p", { class: "small muted" }, ["Pasangan ini akan lebih sering muncul, juga di Jodohkan."]),
          el("ul", { class: "jlist" }, wl.map(w => el("li", null, [el("b", null, [w.o.p[0]]), el("span", { "aria-hidden": "true" }, ["→"]), el("span", null, [w.o.p[1], el("span", { class: "udet" }, [`${w.o.x.title}, hal. ${w.o.x.pages}`])])])))
        ]) : "",
        el("div", { class: "row" }, [
          resumeBtn(),
          el("button", { class: resumeBtn() ? "btn" : "btn btn-primary", onclick: () => go("kilat", { play: true }) }, [icon("bolt"), "Main lagi"]),
          el("button", { class: "btn", onclick: () => go("kilat") }, ["Ganti cakupan"]),
          el("button", { class: "btn btn-ghost", onclick: () => go("selingan") }, ["Mini game lain"])
        ])
      ]));
      const f = view.querySelector(".btn-primary"); if (f) f.focus();
    }
    gameKey = e => {
      const key = e.key.toLowerCase();
      if (paused && !done && (key === "enter" || key === " ") && fixEl.firstChild) { resume(); return true; }
      if (key === "arrowright" || key === "b") { answer(true); return true; }
      if (key === "arrowleft" || key === "s") { answer(false); return true; }
      return false;
    };
    view.append(
      el("div", { class: "stack", style: "gap:10px" }, [
        el("div", { class: "row between" }, [backBtn("Keluar", "kilat"), el("div", { class: "jmeter small muted" }, [meterSpan("Benar", scoreEl), meterSpan("Beruntun", streakEl), el("span", null, [icon("timer"), secEl])])]),
        barWrap
      ]),
      el("section", { class: "panel jpanel stack", style: "gap:14px" }, [qEl, fixEl, el("div", { class: "kbtns" }, [bNo, bYes])]),
      el("p", { class: "xs muted" }, ["Semua pasangan dari tabel dan bagan PPT kisi-kisi. Pernyataan salah dibuat dengan menukar pasangan di set yang sama."])
    );
    nextQ();
    clearInterval(jodohInt);
    jodohInt = setInterval(() => {
      const now = Date.now(); if (!paused) left -= now - last; last = now;
      const s = Math.max(0, Math.ceil(left / 1000));
      bar.style.width = Math.max(0, left / LIMIT * 100) + "%"; barWrap.classList.toggle("low", left < 10000); barWrap.setAttribute("aria-valuenow", s);
      secEl.textContent = String(s);
      if (left <= 0 && !done) end();
    }, 100);
  }

  // Tebak dari Petunjuk: 5 teka-teki per ronde, 6 pilihan; bintang 3 bila tertebak dengan petunjuk pertama tanpa keliru.
  // Setiap petunjuk tambahan (dibuka sendiri atau karena tebakan keliru) mengurangi satu bintang.
  function renderTebak(arg) {
    const x = arg && arg.set && TEBAK.find(j => j.id === arg.set);
    return x ? tebakPlay(x) : setMenu(gameById("tebak"));
  }
  function tebakPlay(x) {
    const g = gameById("tebak"), answers = x.items.map(it => it.a);
    const qs = shuffle(x.items).sort((a, b) => gRank(gKey(x, a.a)) - gRank(gKey(x, b.a))).slice(0, g.size);
    const clk = roundClock(), res = [];
    let qi = 0, errors = 0, stars = 0, keys = null;
    const prog = el("span", { class: "num" }, [`1/${qs.length}`]), starEl = el("span", { class: "num" }, ["0"]), errEl = el("span", { class: "num" }, ["0"]);
    const box = el("section", { class: "panel jpanel stack", style: "gap:14px" });
    function drawQ() {
      const it = qs[qi], opts = shuffle([it.a].concat(shuffle(answers.filter(a => a !== it.a)).slice(0, 5)));
      let shown = 1, penalty = 0, wrong = 0, solved = false;
      const clues = el("ol", { class: "tclues", "aria-live": "polite" });
      const addClue = k => clues.append(el("li", { class: "tclue" }, [it.c[k]]));
      addClue(0);
      const worth = el("span", { class: "tworth small" });
      const more = el("button", { class: "btn btn-sm", onclick: () => { if (shown < it.c.length && !solved) { addClue(shown); shown++; penalty++; upd(); } } }, ["Buka petunjuk berikutnya"]);
      const next = el("div", { class: "row" });
      const btns = opts.map((a, k) => el("button", { class: "topt", onclick: e => guess(a, e.currentTarget) }, [el("span", { class: "kbin-n" }, [String(k + 1)]), el("span", null, [a])]));
      const starsNow = () => Math.max(0, 3 - penalty);
      function upd() {
        more.disabled = solved || shown >= it.c.length;
        worth.textContent = solved ? "" : `Petunjuk ${shown} dari ${it.c.length} · jika benar sekarang: ${"★".repeat(starsNow()) || "0 bintang"}`;
      }
      function guess(a, btn) {
        if (solved || btn.disabled) return;
        if (a !== it.a) {
          wrong++; errors++; penalty++; errEl.textContent = String(errors);
          btn.classList.add("bad"); btn.disabled = true;
          if (shown < it.c.length) { addClue(shown); shown++; }
          return upd();
        }
        solved = true; const s = starsNow(); stars += s; starEl.textContent = String(stars);
        btn.classList.add("ok"); btns.forEach(b => { b.disabled = true; });
        // setelah tertebak, tampilkan semua petunjuk sebagai ringkasan belajar
        for (let k = shown; k < it.c.length; k++) clues.append(el("li", { class: "tclue rest" }, [it.c[k]]));
        res.push({ it, s, wrong, shown });
        upd();
        const last = qi + 1 >= qs.length;
        next.append(
          el("span", { class: "small" }, [el("b", null, [s ? "★".repeat(s) : "0 bintang"]), ` ${it.a}`]),
          el("button", { class: "btn btn-primary", style: "margin-left:auto", onclick: () => { if (last) return done(); qi++; prog.textContent = `${qi + 1}/${qs.length}`; drawQ(); } }, [last ? "Lihat hasil" : "Teka-teki berikutnya", icon("right")])
        );
        next.querySelector(".btn-primary").focus();
      }
      keys = e => {
        const n = parseInt(e.key, 10);
        if (!solved && n >= 1 && n <= btns.length) { guess(opts[n - 1], btns[n - 1]); return true; }
        if (!solved && e.key.toLowerCase() === "p") { more.click(); return true; }
        return false;
      };
      box.innerHTML = "";
      box.append(el("p", { class: "small muted" }, [x.ask]), clues, el("div", { class: "row between" }, [worth, more]), el("div", { class: "topts" }, btns), next);
      upd();
    }
    function done() {
      finishRound(g, x, {
        secs: clk.secs(), errors, full: qs.length === Math.min(g.size, x.items.length),
        marks: res.map(r => [gKey(x, r.it.a), r.wrong > 0 || r.s < 2]),
        wrong: res.filter(r => r.wrong > 0 || r.s < 2).map(r => [r.it.a, r.it.c[r.it.c.length - 1]]),
        wrongTitle: "Perlu diulang", doneTitle: "Semua teka-teki terjawab",
        extra: el("div", { class: "stack", style: "gap:8px" }, [
          el("h2", null, [`${stars} dari ${qs.length * 3} bintang`]),
          el("ul", { class: "jlist" }, res.map(r => el("li", null, [el("b", null, [r.it.a]), el("span", { "aria-hidden": "true" }, ["★".repeat(r.s) || "·"]), el("span", null, [r.it.c.join(" · ")])])))
        ])
      });
    }
    gameKey = e => keys ? keys(e) : false;
    view.append(
      playHead(g, x, [meterSpan("Teka-teki", prog), meterSpan("Bintang", starEl), meterSpan("Keliru", errEl)]),
      box,
      el("p", { class: "xs muted" }, ["Di keyboard: angka 1-6 memilih jawaban, P membuka petunjuk."])
    );
    drawQ();
  }

  // Detektif Kisi-kisi: 5 paragraf per ronde, masing-masing berisi tepat satu bagian yang salah
  const dErr = it => it.find(s => Array.isArray(s));
  const dFixed = it => it.map(s => Array.isArray(s) ? s[1] : s).join(" ");
  function renderDetektif(arg) {
    const x = arg && arg.set && DETEKTIF.find(j => j.id === arg.set);
    return x ? detektifPlay(x) : setMenu(gameById("detektif"));
  }
  function detektifPlay(x) {
    const g = gameById("detektif");
    const qs = shuffle(x.items).sort((a, b) => gRank(gKey(x, dErr(a)[1])) - gRank(gKey(x, dErr(b)[1]))).slice(0, g.size);
    const clk = roundClock(), res = [];
    let qi = 0, errors = 0, nextBtn = null;
    const prog = el("span", { class: "num" }, [`1/${qs.length}`]), errEl = el("span", { class: "num" }, ["0"]);
    const box = el("section", { class: "panel jpanel stack", style: "gap:14px" });
    function drawQ() {
      const it = qs[qi], [bad, good] = dErr(it);
      let wrong = 0, found = false;
      const fb = el("div", { "aria-live": "polite" }), next = el("div", { class: "row" });
      // span (bukan button) agar potongan mengalir seperti teks biasa; tetap bisa difokus dan diaktifkan dengan Enter/spasi
      const segs = it.map(s => el("span", { class: "dseg", role: "button", tabindex: "0", onclick: e => tap(s, e.currentTarget),
        onkeydown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); tap(s, e.currentTarget); } } }, [Array.isArray(s) ? s[0] : s]));
      const errBtn = segs[it.indexOf(dErr(it))];
      function tap(s, b) {
        if (found || b.classList.contains("clear")) return;
        if (Array.isArray(s)) return reveal(true);
        wrong++; errors++; errEl.textContent = String(errors);
        b.classList.add("clear"); b.setAttribute("aria-label", b.textContent + ", bagian ini benar");
        fb.innerHTML = ""; fb.append(el("p", { class: "small muted" }, [wrong >= 2 ? "Bagian itu juga benar. Kesalahannya ditandai di atas." : "Bagian itu benar. Cari lagi."]));
        if (wrong >= 2) reveal(false);
      }
      function reveal(byUser) {
        found = true; segs.forEach(b => { b.classList.add("off"); b.removeAttribute("tabindex"); b.setAttribute("aria-disabled", "true"); });
        errBtn.classList.add(byUser ? "hit" : "miss"); errBtn.innerHTML = "";
        errBtn.append(el("s", null, [bad]), " ", el("ins", null, [good]));
        res.push({ it, wrong, byUser });
        if (byUser) { fb.innerHTML = ""; fb.append(el("p", { class: "small" }, [el("b", null, ["Ketemu. "]), `Seharusnya: ${good}`])); }
        else fb.append(el("p", { class: "small" }, [el("b", null, ["Seharusnya: "]), good]));
        const last = qi + 1 >= qs.length;
        nextBtn = el("button", { class: "btn btn-primary", style: "margin-left:auto", onclick: () => { if (last) return done(); qi++; prog.textContent = `${qi + 1}/${qs.length}`; drawQ(); } }, [last ? "Lihat hasil" : "Paragraf berikutnya", icon("right")]);
        next.append(nextBtn); nextBtn.focus();
      }
      nextBtn = null;
      box.innerHTML = "";
      box.append(el("p", { class: "small muted" }, ["Ada satu bagian yang salah. Ketuk bagian itu."]), el("p", { class: "dpara" }, segs.flatMap(b => [b, " "])), fb, next);
    }
    function done() {
      finishRound(g, x, {
        secs: clk.secs(), errors, full: qs.length === Math.min(g.size, x.items.length),
        marks: res.map(r => [gKey(x, dErr(r.it)[1]), r.wrong > 0]),
        wrong: res.filter(r => r.wrong > 0).map(r => [dErr(r.it)[0], dErr(r.it)[1]]),
        wrongTitle: "Kesalahan yang terlewat", doneTitle: "Semua kesalahan ketemu",
        extra: el("div", { class: "stack", style: "gap:8px" }, [
          el("h2", null, ["Versi yang benar"]),
          el("ul", { class: "jlist dfix" }, res.map(r => el("li", null, [el("span", null, r.it.map(s => Array.isArray(s) ? el("ins", null, [s[1]]) : s + " ").flatMap(n => typeof n === "string" ? [n] : [n, " "]))])))
        ])
      });
    }
    gameKey = e => { if ((e.key === "Enter" || e.key === " ") && nextBtn && document.activeElement !== nextBtn) { nextBtn.click(); return true; } return false; };
    view.append(
      playHead(g, x, [meterSpan("Paragraf", prog), meterSpan("Keliru", errEl), el("span", null, [icon("timer"), clk.node])]),
      box,
      el("p", { class: "xs muted" }, ["Kesalahan bisa berupa angka, tanggal, nama, atau istilah yang tertukar. Setelah dua kali keliru, kesalahannya ditunjukkan."])
    );
    drawQ();
  }

  // ---------- Latihan ----------
  let pickSel = new Set(), pickCount = 20, pickOrder = "unseen", pickSrc = "all";
  function pickFrom(tids, n, order, src) {
    let list = tids.flatMap(pool);
    if (src === "form") list = list.filter(q => q.set === "form"); else if (src === "kisi") list = list.filter(q => q.set === "bkn");
    const st = id => state.stats[id];
    if (order === "unseen") list = shuffle(list).sort((a, b) => (st(a.id) ? 1 : 0) - (st(b.id) ? 1 : 0));
    else if (order === "wrong") list = shuffle(list).sort((a, b) => { const sa = st(a.id), sb = st(b.id); const w = s => !s ? 1 : s.lastWrong ? 3 + s.wrong : s.wrong > 0 ? 2 : 0; return w(sb) - w(sa); });
    else list = shuffle(list);
    // sebar merata antartopik
    if (tids.length > 1) {
      const by = {}; list.forEach(q => (by[q.topic] = by[q.topic] || []).push(q));
      const out = []; let added = true;
      while (out.length < n && added) { added = false; tids.forEach(t => { if (out.length < n && by[t] && by[t].length) { out.push(by[t].shift()); added = true; } }); }
      return shuffle(out);
    }
    return list.slice(0, n);
  }
  function startDrill(qs, title, opt) {
    if (!qs.length) return toast("Tidak ada soal untuk pilihan ini.");
    if (exam && !exam.finished) return toast("Selesaikan simulasi yang sedang berjalan dulu.");
    drill = { active: true, qs, i: 0, answers: {}, correct: 0, perm: {}, title, daily: !!(opt && opt.daily), mastBefore: overall().mast };
    go("latihan");
  }
  function renderLatihan(arg) {
    if (drill && drill.active) return drill.i >= drill.qs.length ? renderDrillSummary() : renderDrillQ();
    if (arg && arg.topics) pickSel = new Set(arg.topics);
    const avail = () => { let l = [...pickSel].flatMap(pool); if (pickSrc === "form") l = l.filter(q => q.set === "form"); else if (pickSrc === "kisi") l = l.filter(q => q.set === "bkn"); return l.length; };
    const startBtn = el("button", { class: "btn btn-primary", onclick: () => { if (!pickSel.size) return toast("Pilih minimal satu topik."); startDrill(pickFrom([...pickSel], pickCount, pickOrder, pickSrc), [...pickSel].map(id => topicById(id).label).join(", ")); } });
    const refresh = () => { const a = avail(); startBtn.textContent = pickSel.size ? `Mulai ${Math.min(a, pickCount)} soal` : "Pilih topik dulu"; startBtn.disabled = !pickSel.size || !a; };
    const groups = {}; TOPICS.forEach(t => (groups[t.test] = groups[t.test] || []).push(t));
    const picker = el("div", { class: "picker" }, Object.keys(groups).map(k => el("div", { class: "pick-group" }, [
      el("span", { class: "label" }, [TESTS[k].label]),
      el("div", { class: "pick-chips" }, groups[k].map(t => {
        const b = el("button", { class: "pick " + tcOf(t), "aria-pressed": pickSel.has(t.id) ? "true" : "false", onclick: () => { pickSel.has(t.id) ? pickSel.delete(t.id) : pickSel.add(t.id); b.setAttribute("aria-pressed", pickSel.has(t.id)); refresh(); } }, [t.label, el("span", { class: "cnt" }, [pool(t.id).length])]);
        return b;
      }))
    ])));
    const seg = (opts, get, set) => { const w = el("div", { class: "seg", role: "group" }); const draw = () => { w.innerHTML = ""; opts.forEach(([v, l]) => w.appendChild(el("button", { "aria-pressed": get() === v ? "true" : "false", onclick: () => { set(v); draw(); refresh(); } }, [l]))); }; draw(); return w; };
    const selAll = v => { pickSel = new Set(v ? TOPICS.map(t => t.id) : []); picker.querySelectorAll(".pick").forEach((b, i) => b.setAttribute("aria-pressed", v)); refresh(); };
    view.append(
      el("div", null, [el("h1", null, ["Latihan"]), el("p", { class: "muted", style: "margin-top:6px" }, ["Setiap jawaban langsung diperiksa. Benar atau salah, pembahasan dan halaman kisi-kisi rujukannya tampil saat itu juga."])]),
      el("div", { class: "official" }, [
        el("div", { class: "stack", style: "gap:6px" }, [el("span", { class: "stamp", style: "align-self:flex-start" }, [icon("award"), "Resmi BKN 2025"]), el("h2", null, ["50 soal latihan resmi, urutan asli"]), el("p", { class: "small muted" }, ["Dari Google Form BKN yang ditautkan di PPT kisi-kisi hal. 172. Form tidak memuat kunci; kunci dan pembahasan disusun aplikasi dengan rujukan halaman kisi-kisi."])]),
        el("button", { class: "btn btn-primary", onclick: () => startDrill(formSet(), "50 soal resmi BKN 2025") }, [icon("play"), "Kerjakan"])
      ]),
      selinganCard(),
      el("section", { class: "panel stack", style: "gap:20px" }, [
        el("div", { class: "sec-head" }, [el("h2", null, ["Susun latihan sendiri"]), el("div", { class: "row", style: "gap:4px" }, [el("button", { class: "btn btn-sm btn-ghost", onclick: () => selAll(true) }, ["Pilih semua"]), el("button", { class: "btn btn-sm btn-ghost", onclick: () => selAll(false) }, ["Kosongkan"])])]),
        picker,
        el("div", { class: "opts-row" }, [
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Jumlah soal"]), seg([[10, "10"], [20, "20"], [30, "30"], [50, "50"]], () => pickCount, v => pickCount = v)]),
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Prioritas"]), seg([["unseen", "Belum dicoba"], ["wrong", "Pernah salah"], ["random", "Acak"]], () => pickOrder, v => pickOrder = v)]),
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Jenis soal"]), seg([["all", "Semua"], ["kisi", "Isi kisi-kisi saja"], ["form", "Resmi saja"]], () => pickSrc, v => pickSrc = v)])
        ]),
        el("div", { class: "row" }, [startBtn])
      ])
    );
    refresh();
  }
  function renderDrillQ() {
    view.innerHTML = "";
    const q = drill.qs[drill.i], t = topicById(q.topic), answered = q.id in drill.answers;
    const perm = drill.perm[q.id] || (drill.perm[q.id] = makePerm(q));
    const top = el("div", { class: "q-top" }, [
      el("button", { class: "btn btn-ghost icon-btn", "aria-label": "Hentikan latihan", onclick: () => confirmBox("Hentikan latihan?", "Jawaban yang sudah masuk tetap tercatat di statistik.", "Hentikan", () => { drill.i = drill.qs.length; renderDrillSummary(); }) }, [icon("x")]),
      el("div", { class: "q-progress", role: "progressbar", "aria-valuenow": drill.i + 1, "aria-valuemax": drill.qs.length }, [el("i", { style: `width:${pct(drill.i + (answered ? 1 : 0), drill.qs.length)}%` })]),
      el("span", { class: "small num muted" }, [`${drill.i + 1}/${drill.qs.length}`]),
      el("span", { class: "chip chip-ok num" }, [icon("check"), `${drill.correct}`]),
      el("button", { class: "btn btn-ghost icon-btn", "aria-label": "Jeda: main mini game sebentar", title: "Jeda: main mini game sebentar", onclick: () => nav("selingan") }, [icon("pair")])
    ]);
    const opts = el("div", { class: "options", role: "group", "aria-label": "Pilihan jawaban" });
    const fb = el("div");
    const act = el("div", { class: "q-actions" });
    const bm = () => el("button", { class: "btn btn-ghost btn-sm", "aria-pressed": state.bookmarks.includes(q.id) ? "true" : "false", onclick: e => { toggleBookmark(q.id); e.currentTarget.replaceWith(bm()); } }, [icon("bookmark"), state.bookmarks.includes(q.id) ? "Ditandai" : "Tandai"]);
    const choose = idx => {
      if (q.id in drill.answers) return;
      const ok = idx === q.a; rememberPos(q, perm); recordAnswer(q, ok); drill.answers[q.id] = idx; if (ok) drill.correct++;
      paintOpts(); fb.appendChild(feedback(q, idx, perm)); drawAct();
      top.querySelector(".chip-ok").lastChild.textContent = String(drill.correct);
      top.querySelector(".q-progress i").style.width = pct(drill.i + 1, drill.qs.length) + "%";
      const nx = act.querySelector(".btn-primary"); if (nx) nx.focus();
    };
    const paintOpts = () => {
      opts.innerHTML = ""; const ch = drill.answers[q.id], done = ch !== undefined;
      perm.forEach((i, pos) => opts.appendChild(el("button", {
        class: "opt" + (done ? (i === q.a ? " correct" : i === ch ? " wrong" : " dim") : ""), disabled: done, onclick: () => choose(i), "aria-label": `${L[pos]}. ${q.o[i]}`
      }, [el("span", { class: "k" }, [L[pos]]), el("span", null, [q.o[i]]), el("span", { class: "mk" }, [done && i === q.a ? icon("check") : done && i === ch ? icon("x") : ""])])));
    };
    const drawAct = () => {
      act.innerHTML = "";
      const doneQ = q.id in drill.answers;
      act.append(el("div", { class: "row" }, [bm(), doneQ ? doubtBtn(q) : null, el("span", { class: "kbd-hint" }, [el("span", { class: "kbd" }, ["A-" + L[q.o.length - 1]]), " pilih  ", el("span", { class: "kbd" }, ["P"]), " pembahasan  ", el("span", { class: "kbd" }, ["Enter"]), " lanjut"])]),
        doneQ ? el("button", { class: "btn btn-primary", onclick: nextDrill }, [drill.i + 1 < drill.qs.length ? "Soal berikutnya" : "Lihat ringkasan", icon("right")]) : el("span", { class: "small muted" }, ["Pilih satu jawaban"]));
    };
    paintOpts(); drawAct();
    if (answered) fb.appendChild(feedback(q, drill.answers[q.id], perm));
    view.append(el("div", { class: "stack", style: "gap:6px" }, [el("span", { class: "eyebrow" }, [drill.title || "Latihan"]), top]),
      el("section", { class: "panel lift q-card" }, [el("div", { class: "q-meta" }, [testChip(t), el("span", { class: "chip" }, [t.label]), srcTag(q)]), el("div", { class: "q-text" }, [q.q]), opts, fb]),
      el("div", { class: "sticky-act" }, [act]));
    drill.choose = choose;
  }
  function nextDrill() { drill.i++; drill.i >= drill.qs.length ? renderDrillSummary() : renderDrillQ(); }
  // Pembahasan dua lapis: jawaban benar selalu tampil; pembahasan lengkap terbuka otomatis hanya saat salah/kosong
  function feedback(q, ch, perm) {
    perm = perm || idPerm(q);
    const ok = ch === q.a, skip = ch === null || ch === undefined, open = !ok, Lof = i => L[perm.indexOf(i)];
    const more = el("div", { class: "fb-more", hidden: !open }, [
      el("div", { class: "fb-body" }, [q.e]),
      el("div", { class: "fb-src" }, ["Rujukan: " + q.src]),
      q.set === "form" ? el("div", { class: "fb-src" }, ["BKN tidak menerbitkan kunci soal resmi; kunci ini disusun aplikasi. Bila terasa janggal, tekan Ragukan kunci."]) : null
    ]);
    const label = () => more.hidden ? "Lihat pembahasan" : "Sembunyikan pembahasan";
    const tg = el("button", { class: "fb-toggle", type: "button", "aria-expanded": open ? "true" : "false", onclick: () => { more.hidden = !more.hidden; tg.setAttribute("aria-expanded", !more.hidden); tg.lastChild.textContent = label(); } }, [icon("right"), label()]);
    return el("div", { class: "feedback " + (ok ? "ok" : "bad") }, [
      el("div", { class: "fb-title" }, [icon(ok ? "check" : skip ? "alert" : "x"), ok ? "Benar." : skip ? "Tidak dijawab." : `Kurang tepat. Kamu memilih ${Lof(ch)}.`]),
      el("div", { class: "fb-key" }, [el("span", { class: "fb-key-l" }, ["Jawaban"]), el("span", null, [`${Lof(q.a)}. ${q.o[q.a]}`])]),
      tg, more
    ]);
  }
  function doubtBtn(q) {
    const on = !!state.doubts[q.id];
    const b = el("button", { class: "btn btn-ghost btn-sm", "aria-pressed": on ? "true" : "false", title: "Tandai bila kunci jawaban terasa janggal, untuk dicek ulang", onclick: () => { if (state.doubts[q.id]) { delete state.doubts[q.id]; toast("Tanda ragu kunci dihapus"); } else { state.doubts[q.id] = Date.now(); toast("Kunci ditandai untuk dicek ulang (lihat Riwayat)"); } save(); b.replaceWith(doubtBtn(q)); } }, [icon("alert"), on ? "Kunci diragukan" : "Ragukan kunci"]);
    return b;
  }
  function toggleBookmark(id) { const i = state.bookmarks.indexOf(id); if (i >= 0) { state.bookmarks.splice(i, 1); toast("Tanda dihapus"); } else { state.bookmarks.push(id); toast("Soal ditandai"); } save(); }
  function renderDrillSummary() {
    view.innerHTML = ""; drill.active = false;
    const done = Object.keys(drill.answers).length, wrong = drill.qs.filter(q => q.id in drill.answers && drill.answers[q.id] !== q.a);
    if (drill.daily && done) {
      if (state.dailyDone !== dayKey()) { state.dailyDone = dayKey(); save(); }
      const gain = overall().mast - drill.mastBefore, tmr = dueTomorrow(), stk = streak();
      view.append(
        el("section", { class: "panel lift stack daily-done", style: "gap:18px" }, [
          el("div", { class: "row", style: "gap:14px;flex-wrap:nowrap" }, [el("span", { class: "done-badge", "aria-hidden": "true" }, [icon("check")]), el("div", null, [el("span", { class: "eyebrow" }, [drill.title]), el("h1", { style: "margin-top:4px" }, ["Sesi hari ini selesai"])])]),
          el("div", { class: "stats" }, [
            el("div", { class: "stat" }, [el("b", { class: "num" }, [`${drill.correct}/${done}`]), el("span", null, ["jawaban benar"])]),
            el("div", { class: "stat" }, [el("b", { class: "num" }, [gain > 0 ? `+${gain}` : "0"]), el("span", null, [gain > 0 ? "soal naik jadi dikuasai" : "dikuasai butuh benar di 2 hari berbeda, jadi naiknya mulai besok"])]),
            el("div", { class: "stat" }, [el("b", { class: "num" }, [String(tmr)]), el("span", null, ["soal jatuh tempo besok"])]),
            el("div", { class: "stat" }, [el("b", { class: "num" }, [`${stk} hari`]), el("span", null, ["belajar beruntun"])])
          ]),
          el("p", { class: "small muted" }, [wrong.length ? `${wrong.length} soal yang salah akan muncul lagi besok. Baca pembahasannya di bawah sekali lagi sebelum menutup aplikasi.` : "Semua benar. Soal-soal ini akan diulang beberapa hari lagi untuk memastikan benar-benar diingat."]),
          el("div", { class: "row" }, [
            el("button", { class: "btn btn-primary", onclick: () => { drill = null; go("home"); } }, ["Selesai untuk hari ini"]),
            el("button", { class: "btn", onclick: () => startDrill(todaySession(10).qs, "Tambahan hari ini", { daily: true }) }, ["Tambah 10 soal"])
          ])
        ]),
        wrong.length ? el("div", { class: "stack" }, [el("h2", null, ["Soal yang salah"]), el("div", { class: "review" }, wrong.map(q => reviewItem(q, drill.answers[q.id], false, null, drill.perm[q.id])))]) : ""
      );
      return;
    }
    view.append(
      el("section", { class: "panel lift stack", style: "gap:18px" }, [
        el("div", null, [el("span", { class: "eyebrow" }, [drill.title || "Latihan"]), el("h1", { style: "margin-top:6px" }, ["Ringkasan latihan"])]),
        el("div", { class: "stats", style: "grid-template-columns:repeat(3,minmax(0,1fr))" }, [
          el("div", { class: "stat" }, [el("b", null, [done]), el("span", null, ["dijawab"])]),
          el("div", { class: "stat" }, [el("b", null, [drill.correct]), el("span", null, ["benar"])]),
          el("div", { class: "stat" }, [el("b", null, [done ? pct(drill.correct, done) + "%" : "-"]), el("span", null, ["akurasi"])])
        ]),
        el("div", { class: "row" }, [
          wrong.length ? el("button", { class: "btn btn-primary", onclick: () => startDrill(shuffle(wrong), "Ulangi yang salah") }, [`Ulangi ${wrong.length} soal yang salah`]) : null,
          el("button", { class: "btn", onclick: () => { drill = null; go("latihan"); } }, ["Latihan baru"]),
          el("button", { class: "btn btn-ghost", onclick: () => { drill = null; go("home"); } }, ["Beranda"])
        ])
      ]),
      wrong.length ? el("div", { class: "stack" }, [el("h2", null, ["Soal yang salah"]), el("div", { class: "review" }, wrong.map(q => reviewItem(q, drill.answers[q.id], false, null, drill.perm[q.id])))]) : ""
    );
  }
  function reviewItem(q, ch, flagged, no, perm) {
    perm = perm || idPerm(q);
    const t = topicById(q.topic), st = ch === null || ch === undefined ? "skip" : ch === q.a ? "ok" : "bad";
    return el("article", { class: "review-item " + st }, [
      el("div", { class: "q-meta" }, [no ? el("span", { class: "chip num" }, [`No. ${no}`]) : null, testChip(t), el("span", { class: "chip" }, [t.label]), srcTag(q), flagged ? el("span", { class: "chip chip-warn" }, [icon("flag"), "Ragu-ragu"]) : null]),
      el("div", { class: "q-text" }, [q.q]),
      el("div", { class: "options" }, perm.map((i, pos) => el("div", { class: "opt" + (i === q.a ? " correct" : i === ch ? " wrong" : " dim") }, [el("span", { class: "k" }, [L[pos]]), el("span", null, [q.o[i]]), el("span", { class: "mk" }, [i === q.a ? icon("check") : i === ch ? icon("x") : ""])]))),
      feedback(q, st === "skip" ? null : ch, perm),
      el("div", null, [doubtBtn(q)])
    ]);
  }

  // ---------- Simulasi ----------
  let simMode = "upkp";
  const MODES = {
    upkp: { title: "Simulasi UPKP D3-S2", sub: "Komposisi kisi-kisi hal. 6 / SE BKN 10/2024", n: 100, min: 90 },
    form: { title: "Latihan Resmi BKN 2025", sub: "50 soal asli, urutan asli, 4 pilihan", n: 50, min: 45 }
  };
  function buildExam(mode) {
    const qs = [], sections = [];
    if (mode === "form") {
      formSet().forEach(q => { const last = sections[sections.length - 1]; if (!last || last.key !== q.topic) sections.push({ key: q.topic, start: qs.length, end: qs.length + 1 }); else last.end++; qs.push(q); });
    } else {
      TEST_ORDER.forEach(k => {
        const start = qs.length;
        CORE.filter(t => t.test === k).forEach(t => qs.push(...pickFrom([t.id], t.n, "unseen")));
        sections.push({ key: k, start, end: qs.length });
      });
    }
    return { qs, sections };
  }
  const secLabel = (mode, key) => mode === "form" ? topicById(key).label : TESTS[key].label;
  const secTc = (mode, key) => mode === "form" ? tcOf(topicById(key)) : "tc" + TESTS[key].color;
  function persistExam() { if (!exam || exam.finished) return store.del(EXAM_KEY); store.set(EXAM_KEY, JSON.stringify({ mode: exam.mode, ids: exam.qs.map(q => q.id), sections: exam.sections, i: exam.i, answers: exam.answers, flags: exam.flags, perm: exam.perm, endAt: exam.endAt, startedAt: exam.startedAt })); }
  function restoreExam() {
    try {
      const s = JSON.parse(store.get(EXAM_KEY) || "null"); if (!s) return;
      const qs = s.ids.map(id => qById[id]); if (qs.some(q => !q)) return store.del(EXAM_KEY);
      exam = Object.assign(s, { qs, finished: false });
      if (Date.now() >= exam.endAt) finishExam(true, true); else startTimer();
    } catch (e) { store.del(EXAM_KEY); }
  }
  const remaining = () => Math.max(0, Math.round((exam.endAt - Date.now()) / 1000));
  function startTimer() {
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      if (!exam || exam.finished) return clearInterval(timerInt);
      const r = remaining(), t = $("#timer");
      if (t) { t.lastChild.textContent = fmtTime(r); t.classList.toggle("low", r < 300); }
      if (r <= 0) { finishExam(true); if (current === "simulasi") go("simulasi"); else toast("Waktu simulasi habis. Hasil tersimpan di Riwayat."); }
    }, 1000);
  }
  function renderSimulasi() {
    if (exam) return exam.finished ? renderResult(exam) : renderExamQ();
    const dur = el("input", { id: "durInput", class: "input", type: "number", min: 10, max: 240, value: simMode === "form" ? 45 : state.settings.durationMin || 90 });
    const th = {}; TEST_ORDER.forEach(k => th[k] = el("input", { id: "th" + k, class: "input", type: "number", min: 0, max: 250, placeholder: "kosong", value: state.settings.thresholds[k] }));
    const modes = el("div", { class: "modes", role: "radiogroup" });
    const comp = el("div");
    const draw = () => {
      modes.innerHTML = "";
      Object.entries(MODES).forEach(([k, m]) => modes.appendChild(el("button", { class: "mode", role: "radio", "aria-pressed": simMode === k ? "true" : "false", "aria-checked": simMode === k ? "true" : "false", onclick: () => { simMode = k; dur.value = k === "form" ? 45 : state.settings.durationMin || 90; draw(); } }, [
        el("div", { class: "mode-top" }, [k === "form" ? el("span", { class: "stamp" }, [icon("award"), "Resmi"]) : el("span", { class: "chip" }, ["CAT BKN"]), el("span", { class: "radio" })]),
        el("h3", null, [m.title]), el("div", { class: "big" }, [`${m.n} soal · ${m.min} menit`]), el("span", { class: "small muted" }, [m.sub])
      ])));
      comp.innerHTML = "";
      const b = buildExamPreview(simMode);
      comp.appendChild(el("div", { class: "table-wrap" }, [el("table", { class: "tbl" }, [
        el("thead", null, [el("tr", null, [el("th", null, [simMode === "form" ? "Bagian (urutan asli)" : "Jenis tes / materi"]), el("th", { class: "n" }, ["Soal"]), el("th", { class: "n" }, ["Skor maks"])])]),
        el("tbody", null, b.map(r => el("tr", r.sub ? { class: "sub" } : null, [el("td", { style: r.sub ? "padding-left:26px;color:var(--muted)" : "font-weight:700" }, [r.label]), el("td", { class: "n" }, [r.n]), el("td", { class: "n" }, [r.sub ? "" : r.n * 5])])))
      ])]));
    };
    draw();
    const start = () => {
      if (simMode === "upkp") state.settings.durationMin = parseInt(dur.value, 10) || 90;
      TEST_ORDER.forEach(k => state.settings.thresholds[k] = th[k].value); save();
      const b = buildExam(simMode), secs = (parseInt(dur.value, 10) || MODES[simMode].min) * 60;
      exam = { mode: simMode, qs: b.qs, sections: b.sections, i: 0, answers: {}, flags: {}, perm: {}, startedAt: Date.now(), endAt: Date.now() + secs * 1000, finished: false };
      persistExam(); startTimer(); renderExamQ(); window.scrollTo({ top: 0 });
    };
    const short = CORE.filter(t => pool(t.id).length < t.n);
    view.append(
      short.length ? el("div", { class: "note" }, [el("b", null, ["Bank kurang: "]), short.map(t => `${t.label} ${pool(t.id).length}/${t.n}`).join(", ") + ". Aktifkan soal pelengkap di Pengaturan agar simulasi 100 soal terisi penuh."]) :"",
      el("div", null, [el("h1", null, ["Simulasi CAT"]), el("p", { class: "muted", style: "margin-top:6px;max-width:64ch" }, ["Kondisi seperti CAT BKN: pembahasan baru muncul setelah selesai. Benar bernilai 5, salah atau kosong 0, jadi jawab semua soal. Progres tersimpan otomatis bila halaman tertutup."])]),
      modes,
      el("section", { class: "panel stack", style: "gap:16px" }, [
        el("h2", null, ["Komposisi"]), comp,
        el("details", { class: "more" }, [el("summary", null, ["Durasi dan ambang batas (perkiraan)"]), el("div", { class: "stack", style: "margin-top:12px" }, [
          el("div", { class: "field", style: "max-width:200px" }, [el("label", { for: "durInput" }, ["Durasi (menit)"]), dur]),
          el("p", { class: "small muted" }, ["Ambang resmi ditetapkan PPK Kemenimipas dan belum diumumkan. Angka yang diisi di sini adalah perkiraan Anda sendiri; hasil simulasi akan menandainya sebagai perkiraan. Skor maks: TWK 150, TKT 125, TSI 150, TKP 75."]),
          el("div", { class: "grid-3", style: "grid-template-columns:repeat(4,minmax(0,1fr))" }, TEST_ORDER.map(k => el("div", { class: "field" }, [el("label", { for: "th" + k }, [k]), th[k]])))
        ])]),
        el("div", { class: "row" }, [el("button", { class: "btn btn-primary", onclick: start }, [icon("play"), "Mulai simulasi"])])
      ])
    );
  }
  function buildExamPreview(mode) {
    const rows = [];
    if (mode === "form") { const secs = buildExam("form").sections; secs.forEach(s => rows.push({ label: topicById(s.key).label, n: s.end - s.start })); }
    else TEST_ORDER.forEach(k => { const ts = CORE.filter(t => t.test === k); rows.push({ label: TESTS[k].label, n: ts.reduce((a, t) => a + t.n, 0) }); ts.forEach(t => rows.push({ label: t.label, n: t.n, sub: true })); });
    return rows;
  }
  const secOf = i => exam.sections.find(s => i >= s.start && i < s.end);
  function navGrid(onPick) {
    const wrap = el("div", { class: "stack", style: "gap:12px" });
    exam.sections.forEach(s => {
      wrap.appendChild(el("div", { class: "eyebrow" }, [secLabel(exam.mode, s.key)]));
      const g = el("div", { class: "navgrid" });
      for (let i = s.start; i < s.end; i++) { const q = exam.qs[i]; g.appendChild(el("button", { class: (exam.flags[q.id] ? "flag" : q.id in exam.answers ? "ans" : "") + (i === exam.i ? " cur" : ""), "aria-label": `Soal ${i + 1}`, onclick: () => { exam.i = i; persistExam(); onPick(); } }, [i + 1])); }
      wrap.appendChild(g);
    });
    wrap.appendChild(el("div", { class: "legend" }, [el("span", null, [el("i", { style: "background:var(--primary-soft);border-color:var(--primary)" }), "dijawab"]), el("span", null, [el("i", { style: "background:var(--warn-soft);border-color:var(--warn)" }), "ragu-ragu"]), el("span", null, [el("i"), "kosong"])]));
    return wrap;
  }
  function askFinish() { const left = exam.qs.length - Object.keys(exam.answers).length, fl = Object.values(exam.flags).filter(Boolean).length; confirmBox("Selesaikan simulasi?", (left ? `${left} soal belum dijawab. ` : "Semua soal sudah dijawab. ") + (fl ? `${fl} soal masih ditandai ragu-ragu.` : ""), "Selesai dan nilai", () => { finishExam(false); go("simulasi"); }); }
  function renderExamQ() {
    view.innerHTML = "";
    const q = exam.qs[exam.i], t = topicById(q.topic), sec = secOf(exam.i), done = Object.keys(exam.answers).length, r = remaining();
    exam.perm = exam.perm || {};
    const perm = exam.perm[q.id] || (exam.perm[q.id] = makePerm(q));
    const set = idx => { exam.answers[q.id] = idx; persistExam(); renderExamQ(); };
    const bar = el("div", { class: "exam-bar" }, [
      el("span", { id: "timer", class: "timer" + (r < 300 ? " low" : ""), role: "timer", "aria-label": "Sisa waktu" }, [icon("timer"), fmtTime(r)]),
      el("span", { class: "chip chip-test " + secTc(exam.mode, sec.key) }, [exam.mode === "form" ? t.label : TESTS[sec.key].short]),
      el("span", { class: "small muted num" }, [`${done}/${exam.qs.length} dijawab`]),
      el("span", { style: "flex:1" }),
      el("button", { class: "btn btn-sm only-narrow", onclick: () => { const s = sheet("Daftar soal", navGrid(() => { s.remove(); renderExamQ(); })); } }, [icon("grid"), "Daftar"]),
      el("button", { class: "btn btn-sm btn-primary", onclick: askFinish }, ["Selesai"])
    ]);
    const flagged = !!exam.flags[q.id];
    const card = el("section", { class: "panel lift q-card" }, [
      el("div", { class: "q-meta" }, [el("span", { class: "chip num" }, [`No. ${exam.i + 1}`]), el("span", { class: "chip" }, [t.label]), q.set === "form" ? el("span", { class: "stamp" }, [icon("award"), "Resmi BKN"]) : null]),
      el("div", { class: "q-text" }, [q.q]),
      el("div", { class: "options", role: "radiogroup" }, perm.map((i, pos) => el("button", { class: "opt" + (exam.answers[q.id] === i ? " chosen" : ""), role: "radio", "aria-checked": exam.answers[q.id] === i ? "true" : "false", onclick: () => set(i) }, [el("span", { class: "k" }, [L[pos]]), el("span", null, [q.o[i]]), el("span", { class: "mk" })])))
    ]);
    const act = el("div", { class: "q-actions sticky-act" }, [
      el("button", { class: "btn", disabled: exam.i === 0, onclick: () => { exam.i--; persistExam(); renderExamQ(); } }, [icon("left"), "Sebelumnya"]),
      el("button", { class: "btn" + (flagged ? " btn-primary" : ""), "aria-pressed": flagged ? "true" : "false", onclick: () => { exam.flags[q.id] = !flagged; persistExam(); renderExamQ(); } }, [icon("flag"), "Ragu-ragu"]),
      exam.i < exam.qs.length - 1 ? el("button", { class: "btn btn-primary", onclick: () => { exam.i++; persistExam(); renderExamQ(); } }, ["Berikutnya", icon("right")]) : el("button", { class: "btn btn-primary", onclick: askFinish }, ["Selesai"])
    ]);
    view.append(bar, el("div", { class: "exam-layout" }, [el("div", { class: "stack", style: "gap:14px" }, [card, act]), el("aside", { class: "panel navpanel desk" }, [navGrid(renderExamQ)])]));
  }
  function finishExam(timeout, silent) {
    clearInterval(timerInt); exam.finished = true; exam.finishedAt = Date.now();
    const agg = {};
    exam.sections.forEach(s => {
      const r = agg[s.key] || (agg[s.key] = { key: s.key, label: secLabel(exam.mode, s.key), tc: secTc(exam.mode, s.key), n: 0, correct: 0 });
      for (let i = s.start; i < s.end; i++) { const q = exam.qs[i], ok = exam.answers[q.id] === q.a; if (exam.perm && exam.perm[q.id]) rememberPos(q, exam.perm[q.id]); recordAnswer(q, ok); r.n++; if (ok) r.correct++; }
    });
    const rows = Object.values(agg).map(r => Object.assign(r, { score: r.correct * 5, max: r.n * 5, th: exam.mode === "form" ? "" : state.settings.thresholds[r.key] }));
    const total = rows.reduce((a, r) => ({ n: a.n + r.n, correct: a.correct + r.correct, score: a.score + r.score, max: a.max + r.max }), { n: 0, correct: 0, score: 0, max: 0 });
    exam.result = { rows, total, timeout };
    state.history.push({ ts: exam.finishedAt, mode: exam.mode, durationSec: Math.round((Math.min(exam.finishedAt, exam.endAt) - exam.startedAt) / 1000), rows, total, timeout, qids: exam.qs.map(q => q.id), answers: exam.answers, flags: exam.flags, perm: exam.perm || {} });
    if (state.history.length > 60) state.history.shift();
    save(); store.del(EXAM_KEY);
    if (!silent) toast(timeout ? "Waktu habis. Simulasi dinilai." : "Simulasi dinilai.");
  }
  function scoreBars(rows) {
    return el("div", { class: "bars" }, rows.map(r => {
      const th = r.th !== "" && r.th !== undefined && r.th !== null ? Number(r.th) : null, pass = th === null ? null : r.score >= th;
      return el("div", { class: "bar-row " + r.tc }, [
        el("div", null, [el("div", { style: "font-weight:700;font-size:.92rem" }, [r.label]), el("div", { class: "xs muted num" }, [`${r.correct}/${r.n} benar`])]),
        el("div", { class: "bar-track", role: "img", "aria-label": `${r.label}: skor ${r.score} dari ${r.max}` }, [el("i", { style: `width:${pct(r.score, r.max)}%` }), th !== null ? el("span", { class: "th", style: `left:${Math.min(100, pct(th, r.max))}%`, title: `Ambang ${th}` }) : null]),
        el("div", { class: "row", style: "gap:8px;justify-content:flex-end" }, [el("b", { class: "num" }, [`${r.score}/${r.max}`]), pass === null ? null : el("span", { class: "chip " + (pass ? "chip-ok" : "chip-bad") }, [icon(pass ? "check" : "x"), pass ? `Lewat ambang perkiraan ${th}` : `Di bawah ambang perkiraan ${th}`])])
      ]);
    }));
  }
  function renderResult(ex) {
    view.innerHTML = "";
    const r = ex.result, rows = r.rows, anyTh = rows.some(x => x.th !== "" && x.th !== undefined && x.th !== null), allPass = rows.every(x => x.th === "" || x.th === undefined || x.th === null || x.score >= Number(x.th));
    let filter = "all";
    const list = el("div", { class: "review" });
    const drawList = () => {
      list.innerHTML = "";
      ex.qs.forEach((q, i) => { const ch = ex.answers[q.id], st = ch === undefined ? "skip" : ch === q.a ? "ok" : "bad"; if (filter !== "all" && !(filter === "flag" ? ex.flags[q.id] : st === filter)) return; list.appendChild(reviewItem(q, ch === undefined ? null : ch, !!ex.flags[q.id], i + 1, (ex.perm || {})[q.id])); });
      if (!list.children.length) list.appendChild(el("div", { class: "empty" }, ["Tidak ada soal untuk filter ini."]));
    };
    const cnt = { bad: ex.qs.filter(q => q.id in ex.answers && ex.answers[q.id] !== q.a).length, skip: ex.qs.filter(q => !(q.id in ex.answers)).length, flag: ex.qs.filter(q => ex.flags[q.id]).length };
    const chips = el("div", { class: "seg" });
    const drawChips = () => { chips.innerHTML = ""; [["all", `Semua (${ex.qs.length})`], ["bad", `Salah (${cnt.bad})`], ["skip", `Kosong (${cnt.skip})`], ["flag", `Ragu (${cnt.flag})`]].forEach(([v, l]) => chips.appendChild(el("button", { "aria-pressed": filter === v ? "true" : "false", onclick: () => { filter = v; drawChips(); drawList(); } }, [l]))); };
    drawChips(); drawList();
    const wrong = ex.qs.filter(q => ex.answers[q.id] !== q.a);
    view.append(
      el("section", { class: "panel lift stack", style: "gap:22px" }, [
        el("div", { class: "row between" }, [el("div", null, [el("span", { class: "eyebrow" }, [MODES[ex.mode || "upkp"].title]), el("h1", { style: "margin-top:4px" }, ["Hasil simulasi"])]), el("div", { class: "row" }, [r.timeout ? el("span", { class: "chip chip-warn" }, ["Waktu habis"]) : el("span", { class: "chip chip-ok" }, ["Selesai"]), anyTh ? el("span", { class: "chip " + (allPass ? "chip-ok" : "chip-bad") }, [allPass ? "Lewat semua ambang perkiraan" : "Belum lewat ambang perkiraan"]) : null])]),
        el("div", { class: "score-hero" }, [
          el("div", { class: "stack", style: "gap:6px" }, [el("div", { class: "score-big" }, [String(r.total.score), el("small", null, [` / ${r.total.max}`])]), el("span", { class: "muted num" }, [`${r.total.correct} dari ${r.total.n} benar · ${pct(r.total.score, r.total.max)}%`])]),
          scoreBars(rows)
        ]),
        el("div", { class: "row" }, [
          el("button", { class: "btn btn-primary", onclick: () => { exam = null; go("simulasi"); } }, ["Simulasi baru"]),
          wrong.length ? el("button", { class: "btn", onclick: () => { exam = null; startDrill(shuffle(wrong), "Soal salah/kosong dari simulasi"); } }, [`Latih ${wrong.length} soal salah/kosong`]) : null,
          el("button", { class: "btn btn-ghost", onclick: () => { exam = null; go("riwayat"); } }, ["Riwayat"])
        ])
      ]),
      el("div", { class: "sec-head" }, [el("h2", null, ["Pembahasan"]), chips]),
      list
    );
  }

  // ---------- Riwayat ----------
  function scoreChart(hist) {
    const data = hist.slice(-12), W = 640, H = 220, padL = 36, padB = 26, padT = 12, iw = W - padL - 8, ih = H - padB - padT;
    const bw = Math.min(40, iw / data.length * .6), step = iw / data.length;
    const box = el("div", { class: "chart" }), tip = el("div", { class: "tip", hidden: true });
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Skor simulasi terakhir dalam persen">`;
    [0, 50, 100].forEach(v => { const y = padT + ih * (1 - v / 100); svg += `<line class="grid-l" x1="${padL}" x2="${W - 4}" y1="${y}" y2="${y}"/><text class="ax" x="${padL - 8}" y="${y + 4}" text-anchor="end">${v}%</text>`; });
    data.forEach((h, i) => {
      const p = pct(h.total.score, h.total.max), x = padL + step * i + (step - bw) / 2, bh = Math.max(4, ih * p / 100), y = padT + ih - bh;
      const col = h.mode === "form" ? "var(--s2)" : "var(--s1)";
      svg += `<path class="bar-m" tabindex="0" data-i="${i}" fill="${col}" d="M${x},${padT + ih} V${y + 4} a4,4 0 0 1 4,-4 h${bw - 8} a4,4 0 0 1 4,4 V${padT + ih} Z"/>`;
      svg += `<text class="ax" x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${i + 1}</text>`;
      if (i === data.length - 1) svg += `<text class="ax" x="${x + bw / 2}" y="${y - 6}" text-anchor="middle" style="font-weight:700;fill:var(--text)">${p}%</text>`;
    });
    box.innerHTML = svg + "</svg>"; box.appendChild(tip);
    const show = (e, target) => { const i = +target.dataset.i, h = data[i]; tip.hidden = false; tip.textContent = `${fmtDate(h.ts)} · ${h.mode === "form" ? "Resmi 50" : "UPKP 100"} · ${h.total.score}/${h.total.max} (${pct(h.total.score, h.total.max)}%)`; const br = box.getBoundingClientRect(), tr = target.getBoundingClientRect(); tip.style.left = (tr.left - br.left + tr.width / 2) + "px"; tip.style.top = (tr.top - br.top) + "px"; };
    box.querySelectorAll(".bar-m").forEach(b => { b.addEventListener("mouseenter", e => show(e, b)); b.addEventListener("focus", e => show(e, b)); b.addEventListener("mouseleave", () => tip.hidden = true); b.addEventListener("blur", () => tip.hidden = true); });
    return box;
  }
  function renderRiwayat(arg) {
    if (arg && arg.attempt) {
      const h = arg.attempt, ex = { mode: h.mode, qs: h.qids.map(id => qById[id]).filter(Boolean), answers: h.answers || {}, flags: h.flags || {}, perm: h.perm || {}, result: { rows: rowsOf(h), total: h.total, timeout: h.timeout } };
      renderResult(ex);
      view.insertBefore(el("div", null, [el("button", { class: "btn btn-sm btn-ghost", onclick: () => go("riwayat") }, [icon("left"), "Kembali ke riwayat"])]), view.firstChild);
      return;
    }
    const hist = validHistory();
    const wrongIds = Object.keys(state.stats).filter(id => qById[id] && state.stats[id].lastWrong);
    const bm = state.bookmarks.map(id => qById[id]).filter(Boolean);
    const dq = Object.keys(state.doubts).map(id => qById[id]).filter(Boolean);
    const doubtText = () => dq.map(q => `${q.id} | ${q.q} | kunci aplikasi: ${L[q.a]}. ${q.o[q.a]} | rujukan: ${q.src}`).join("\n");
    const copyDoubts = async () => { const t = doubtText(); try { await navigator.clipboard.writeText(t); toast("Daftar disalin. Tempel ke Claude atau kirim ke rekan untuk dicek."); } catch (e) { const ta = el("textarea", { class: "input", style: "min-height:140px", readonly: true }); ta.value = t; sheet("Salin daftar ini", ta); ta.select(); } };
    view.append(el("h1", null, ["Riwayat & pengulangan"]),
      el("section", { class: "panel stack" }, [
        el("div", { class: "row", style: "gap:10px" }, [el("span", { class: "chip chip-warn" }, [icon("alert"), dq.length]), el("h2", null, ["Kunci yang diragukan"])]),
        el("p", { class: "small muted" }, ["Soal yang Mas tandai \"Ragukan kunci\". Salin daftarnya lalu kirim ke Claude atau rekan/alumni UPKP untuk dicek ke sumbernya. Hapus tanda setelah terjawab."]),
        dq.length ? el("div", { class: "list" }, dq.map(q => el("div", { class: "list-item" }, [el("div", { class: "stack", style: "gap:2px;min-width:0;flex:1" }, [el("span", { class: "xs muted" }, [q.id + " · " + topicById(q.topic).label]), el("span", { class: "small" }, [q.q.length > 140 ? q.q.slice(0, 140) + "…" : q.q]), el("span", { class: "xs" }, [`Kunci aplikasi: ${L[q.a]}. ${q.o[q.a]}`])]), el("button", { class: "btn btn-sm btn-ghost", onclick: () => { delete state.doubts[q.id]; save(); go("riwayat"); } }, ["Hapus tanda"])]))) : null,
        el("div", { class: "row" }, [el("button", { class: "btn btn-sm", disabled: !dq.length, onclick: copyDoubts }, ["Salin daftar"]), el("button", { class: "btn btn-sm", disabled: !dq.length, onclick: () => startDrill(dq.slice(), "Kunci yang diragukan") }, ["Buka soalnya"])])
      ]),
      el("div", { class: "grid-2" }, [
        el("section", { class: "panel stack" }, [el("div", { class: "row", style: "gap:10px" }, [el("span", { class: "chip chip-bad" }, [icon("x"), wrongIds.length]), el("h2", null, ["Terakhir dijawab salah"])]), el("p", { class: "small muted" }, ["Daftar berkurang sendiri begitu soalnya dijawab benar."]), el("div", null, [el("button", { class: "btn btn-primary", disabled: !wrongIds.length, onclick: () => startDrill(shuffle(wrongIds.map(id => qById[id])), "Soal yang pernah salah") }, ["Latih ulang"])])]),
        el("section", { class: "panel stack" }, [el("div", { class: "row", style: "gap:10px" }, [el("span", { class: "chip chip-warn" }, [icon("bookmark"), bm.length]), el("h2", null, ["Soal ditandai"])]), el("p", { class: "small muted" }, ["Tandai soal saat latihan untuk dikumpulkan di sini."]), el("div", null, [el("button", { class: "btn", disabled: !bm.length, onclick: () => startDrill(shuffle(bm), "Soal ditandai") }, ["Latih yang ditandai"])])])
      ]),
      el("section", { class: "panel stack", style: "gap:16px" }, [
        el("div", { class: "sec-head" }, [el("h2", null, ["Skor simulasi"]), hist.length ? el("div", { class: "legend-row" }, [el("span", { class: "tc1" }, ["UPKP 100 soal"]), el("span", { class: "tc2" }, ["Resmi 50 soal"])]) : null]),
        hist.length ? scoreChart(hist) : el("div", { class: "empty" }, ["Belum ada simulasi. Hasilnya akan tampil sebagai grafik di sini."]),
        hist.length ? el("div", { class: "list" }, hist.slice().reverse().map(h => el("div", { class: "list-item" }, [
          el("div", { class: "stack", style: "gap:2px" }, [el("div", { class: "row", style: "gap:8px" }, [el("b", { class: "num" }, [`${h.total.score}/${h.total.max}`]), el("span", { class: "chip " + (h.mode === "form" ? "tc2" : "tc1") + " chip-test" }, [h.mode === "form" ? "Resmi 50" : "UPKP 100"]), h.timeout ? el("span", { class: "chip chip-warn" }, ["waktu habis"]) : null]),
            el("span", { class: "xs muted num" }, [`${fmtDate(h.ts)} · ${Math.round(h.durationSec / 60)} menit · ` + rowsOf(h).slice(0, 4).map(r => `${h.mode === "form" ? r.label.split(" ")[0] : r.key} ${r.score}`).join(", ")])]),
          el("button", { class: "btn btn-sm", onclick: () => go("riwayat", { attempt: h }) }, ["Pembahasan"])
        ]))) : null
      ])
    );
  }

  // ---------- Pengaturan ----------
  function renderPengaturan() {
    const date = el("input", { id: "examDate", class: "input", type: "date", value: state.settings.examDate || "" });
    const th = {}; TEST_ORDER.forEach(k => th[k] = el("input", { id: "set" + k, class: "input", type: "number", min: 0, max: 250, placeholder: "kosong", value: state.settings.thresholds[k] }));
    const themeSeg = el("div", { class: "seg" });
    const drawTheme = () => { themeSeg.innerHTML = ""; ["auto", "light", "dark"].forEach(v => themeSeg.appendChild(el("button", { "aria-pressed": state.settings.theme === v ? "true" : "false", onclick: () => { state.settings.theme = v; save(); applyTheme(); renderSideFoot(); drawTheme(); } }, [THEME_LABEL[v]]))); };
    drawTheme();
    const saveBtn = el("button", { class: "btn btn-primary", onclick: () => { state.settings.examDate = date.value; TEST_ORDER.forEach(k => state.settings.thresholds[k] = th[k].value); save(); renderSideFoot(); toast("Pengaturan disimpan"); } }, ["Simpan"]);
    const counts = TOPICS.map(t => `${t.label} ${pool(t.id).length}`).join(" · ");
    const extBox = el("input", { id: "includeExt", type: "checkbox", style: "width:20px;height:20px;margin-top:2px;flex:none", onchange: e => { state.settings.includeExt = e.target.checked; save(); toast(e.target.checked ? "Soal pelengkap disertakan" : "Soal pelengkap disembunyikan"); go("pengaturan"); } });
    extBox.checked = state.settings.includeExt !== false;
    view.append(el("h1", null, ["Pengaturan"]),
      el("div", { class: "grid-2" }, [
        el("section", { class: "panel stack", style: "gap:16px" }, [
          el("div", { class: "field" }, [el("label", { for: "examDate" }, ["Tanggal ujian (untuk hitung mundur)"]), date]),
          el("div", { class: "stack", style: "gap:8px" }, [el("span", { class: "label" }, ["Ambang batas per jenis tes (perkiraan)"]), el("p", { class: "xs muted" }, ["Ambang resmi ditetapkan PPK Kemenimipas dan belum diumumkan. Isi perkiraan Anda; ganti bila sudah ada angka resmi. Skor maks: TWK 150, TKT 125, TSI 150, TKP 75."]), el("div", { class: "grid-3", style: "grid-template-columns:repeat(4,minmax(0,1fr))" }, TEST_ORDER.map(k => el("div", { class: "field" }, [el("label", { for: "set" + k }, [k]), th[k]])))]),
          el("label", { class: "row", style: "gap:10px;align-items:flex-start;flex-wrap:nowrap;cursor:pointer" }, [extBox, el("span", null, [el("b", null, ["Sertakan soal pelengkap"]), el("span", { class: "xs muted", style: "display:block" }, [`${ALL.filter(q => q.set === "ext").length} soal yang isinya dari luar PPT kisi-kisi: SOTK dari Permenimipas 1/2024 dan 2/2024 (kisi-kisi hal. 151 hanya berisi judul subtopik), sistematika Renstra, dan tata bahasa Inggris di luar tenses. Jika dimatikan, SOTK tinggal sedikit dan simulasi 100 soal tidak terisi penuh.`])])]),
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Tema tampilan"]), themeSeg]),
          el("div", null, [saveBtn])
        ]),
        el("section", { class: "panel stack", style: "gap:14px" }, [
          el("h2", null, ["Bank soal"]),
          el("p", { class: "small" }, [`${ALL.length} soal: ${ALL.filter(q => q.set === "bkn").length} dari isi PPT kisi-kisi PPSS BKN 2025, ${formSet().length} soal resmi Google Form BKN 2025, dan ${ALL.filter(q => q.set === "ext").length} soal pelengkap.`]),
          el("p", { class: "xs muted" }, [counts]),
          el("p", { class: "xs muted" }, ["Kunci 50 soal resmi disusun aplikasi (form tidak memuat kunci). Bila kisi-kisi berbeda dari peraturan primer, pembahasan mencatat keduanya. Materi SOTK dan Renstra instansi di kisi-kisi hanya berupa judul subtopik, sehingga soalnya dilengkapi dari Permenimipas 1/2024, 2/2024, dan 11/2025."]),
          el("h3", null, ["Data progres"]),
          el("p", { class: "xs muted" }, ["Tersimpan di browser ini saja. Ekspor seminggu sekali sebagai cadangan" + (state.lastExport ? ` (terakhir ${fmtDate(state.lastExport)}).` : " (belum pernah).")]),
          el("div", { class: "row" }, [el("button", { class: "btn btn-sm", onclick: exportData }, ["Ekspor JSON"]), el("button", { class: "btn btn-sm", onclick: importData }, ["Impor"]), el("button", { class: "btn btn-sm btn-danger", onclick: () => confirmBox("Hapus semua progres?", "Statistik, riwayat simulasi, dan tanda soal dihapus. Pengaturan tetap.", "Hapus progres", () => { state.stats = {}; state.history = []; state.bookmarks = []; state.days = {}; save(); toast("Progres dihapus"); go("pengaturan"); }, true) }, ["Reset progres"])])
        ])
      ]));
  }
  function exportData() { state.lastExport = Date.now(); save(); const a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })), download: "upkp-progres-" + dayKey() + ".json" }); document.body.appendChild(a); a.click(); a.remove(); }
  function importData() {
    const inp = el("input", { type: "file", accept: "application/json" });
    inp.addEventListener("change", () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const s = JSON.parse(r.result); if (!s.stats || !s.history) throw 0; state = Object.assign(defaults(), s); save(); applyTheme(); renderSideFoot(); toast("Progres diimpor"); go("home"); } catch (e) { toast("Berkas tidak valid: bukan hasil ekspor aplikasi ini."); } }; r.readAsText(f); });
    inp.click();
  }

  // ---------- PWA ----------
  let installEvt = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; const b = $("#installBtn"); if (b) b.hidden = false; });
  const ib = $("#installBtn"); if (ib) ib.addEventListener("click", async () => { if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; ib.hidden = true; });

  // ---------- Keyboard ----------
  document.addEventListener("keydown", e => {
    if (e.target && /input|select|textarea/i.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey || document.querySelector(".modal-bg,.sheet-bg")) return;
    if (gameKey && SEL_ROUTES.includes(current) && gameKey(e)) { e.preventDefault(); return; }
    const k = e.key.toUpperCase(), idx = L.indexOf(k);
    if (current === "latihan" && drill && drill.active && drill.i < drill.qs.length) {
      const q = drill.qs[drill.i];
      if (idx >= 0 && idx < q.o.length && !(q.id in drill.answers)) { e.preventDefault(); drill.choose(drill.perm[q.id][idx]); }
      else if (k === "P" && q.id in drill.answers) { const tg = view.querySelector(".fb-toggle"); if (tg) { e.preventDefault(); tg.click(); } }
      else if ((e.key === "Enter" || e.key === "ArrowRight") && q.id in drill.answers && !(e.target && e.target.tagName === "BUTTON" && e.key === "Enter")) { e.preventDefault(); nextDrill(); }
    } else if (current === "simulasi" && exam && !exam.finished) {
      const q = exam.qs[exam.i];
      if (idx >= 0 && idx < q.o.length) { exam.answers[q.id] = (exam.perm && exam.perm[q.id] || idPerm(q))[idx]; persistExam(); renderExamQ(); }
      else if (e.key === "ArrowRight" && exam.i < exam.qs.length - 1) { exam.i++; persistExam(); renderExamQ(); }
      else if (e.key === "ArrowLeft" && exam.i > 0) { exam.i--; persistExam(); renderExamQ(); }
      else if (k === "R") { exam.flags[q.id] = !exam.flags[q.id]; persistExam(); renderExamQ(); }
    }
  });

  // ---------- Mulai ----------
  $("#topTheme").addEventListener("click", cycleTheme);
  $("#topSettings").appendChild(icon("sliders"));
  $("#topSettings").addEventListener("click", () => nav("pengaturan"));
  applyTheme(); renderSideFoot(); restoreExam();
  window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (routes[h] && h !== current) nav(h); });
  const start = location.hash.slice(1);
  go(exam && !exam.finished ? "simulasi" : routes[start] ? start : "home");
})();
