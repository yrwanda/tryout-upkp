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
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
  };
  const icon = (name, label) => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "ic"); s.setAttribute("aria-hidden", label ? "false" : "true"); if (label) s.setAttribute("aria-label", label); s.innerHTML = ICONS[name] || ""; return s; };

  // ---------- Penyimpanan ----------
  const KEY = "upkp-app-v1", EXAM_KEY = "upkp-exam-v2";
  const defaults = () => ({ settings: { examDate: "", durationMin: 90, thresholds: { TWK: "", TKT: "", TSI: "", TKP: "" }, theme: "auto" }, stats: {}, history: [], bookmarks: [], days: {} });
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };
  function load() {
    const d = defaults();
    try { const s = JSON.parse(store.get(KEY) || "null"); if (s) return Object.assign(d, s, { settings: Object.assign(d.settings, s.settings || {}, { thresholds: Object.assign(d.settings.thresholds, (s.settings || {}).thresholds || {}) }), days: s.days || {} }); } catch (e) { }
    return d;
  }
  let state = load();
  const save = () => store.set(KEY, JSON.stringify(state));

  // ---------- Data ----------
  const BANK = window.BANK || {}, TOPICS = window.TOPICS || [], TESTS = window.TESTS || {}, MATERI = window.MATERI || {};
  const topicById = id => TOPICS.find(t => t.id === id);
  const pool = tid => BANK[tid] || [];
  const ALL = TOPICS.flatMap(t => pool(t.id));
  const qById = {}; ALL.forEach(q => { qById[q.id] = q; });
  const formSet = () => ALL.filter(q => q.set === "form").sort((a, b) => a.id.localeCompare(b.id));
  const CORE = TOPICS.filter(t => !t.extra);
  const TEST_ORDER = ["TWK", "TKT", "TSI", "TKP"];
  const MONO = { pancasila: "PS", uud: "UUD", sejarah: "SJ", bindo: "BI", kepegawaian: "KP", yanlik: "PL", gg: "GG", kebijakan: "KB", renstra: "RS", sotk: "SO", inggris: "EN", literasi: "LD", perkantoran: "PK", manajemen: "MJ" };
  const tcOf = t => "tc" + ((TESTS[t.test] || {}).color || 1);

  function recordAnswer(q, ok) {
    const s = state.stats[q.id] || { seen: 0, correct: 0, wrong: 0, lastWrong: false };
    s.seen++; ok ? s.correct++ : s.wrong++; s.lastWrong = !ok; state.stats[q.id] = s;
    const k = dayKey(); state.days[k] = (state.days[k] || 0) + 1;
    save();
  }
  function topicStat(tid) {
    let seen = 0, correct = 0, done = 0;
    pool(tid).forEach(q => { const s = state.stats[q.id]; if (s) { seen += s.seen; correct += s.correct; done++; } });
    return { total: pool(tid).length, done, acc: seen ? correct / seen : null };
  }
  function overall() {
    let seen = 0, correct = 0, done = 0;
    ALL.forEach(q => { const s = state.stats[q.id]; if (s) { seen += s.seen; correct += s.correct; done++; } });
    return { total: ALL.length, done, seen, correct, acc: seen ? correct / seen : null };
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
    if (q.set === "form") return el("span", { class: "stamp" }, [icon("award"), `Resmi BKN · no. ${parseInt(q.id.split("-")[1], 10)}`]);
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
  let current = "home", timerInt = null, drill = null, exam = null;
  const routes = { home: renderHome, materi: renderMateri, latihan: renderLatihan, simulasi: renderSimulasi, riwayat: renderRiwayat, pengaturan: renderPengaturan };
  function renderNav() {
    const side = $("#sideNav"), tab = $("#tabbar"); side.innerHTML = ""; tab.innerHTML = "";
    NAV.forEach(([id, label, ic]) => {
      const cur = id === current ? "page" : null;
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
    if (drill && drill.active && name !== "latihan") drill.active = false;
    go(name, arg);
  }
  function go(name, arg) {
    current = name; view.innerHTML = ""; renderNav();
    routes[name](arg);
    if (location.hash.slice(1) !== name) { try { history.replaceState(null, "", "#" + name); } catch (e) { } }
    window.scrollTo({ top: 0 });
  }

  // ---------- Beranda ----------
  function ring(value, label) {
    const r = 58, c = 2 * Math.PI * r, off = c * (1 - value);
    const w = el("div", { class: "ring-wrap", role: "img", "aria-label": `${Math.round(value * 100)}% ${label}` });
    w.innerHTML = `<svg viewBox="0 0 148 148"><circle class="track" cx="74" cy="74" r="${r}" fill="none" stroke-width="14"/><circle class="val" cx="74" cy="74" r="${r}" fill="none" stroke-width="14" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>`;
    w.appendChild(el("div", { class: "ring-label" }, [el("b", { class: "num" }, [Math.round(value * 100) + "%"]), el("span", null, [label])]));
    return w;
  }
  function renderHome() {
    const o = overall(), d = daysLeft(), hist = validHistory();
    const best = hist.filter(h => h.mode !== "form").reduce((m, h) => Math.max(m, h.total.score), -1);
    view.append(el("section", { class: "hero" }, [
      el("div", { class: "stack", style: "position:relative;z-index:1;gap:14px" }, [
        el("span", { class: "eyebrow" }, ["UPKP S1 Kemenimipas 2026"]),
        el("h1", null, [d !== null && d >= 0 ? (d === 0 ? "Hari ujian. Tetap tenang." : `H-${d} menuju ujian`) : "Belajar dari kisi-kisi resmi BKN"]),
        el("p", null, [`${o.total} soal, semuanya bersumber dari PPT kisi-kisi PPSS BKN 2025 (hal. 18-172) dan 50 soal latihan resmi BKN. Tidak dicampur soal dari sumber lain.`]),
        el("div", { class: "row" }, [
          el("button", { class: "btn btn-light", onclick: () => { simMode = "upkp"; nav("simulasi"); } }, [icon("timer"), "Simulasi 100 soal"]),
          el("button", { class: "btn btn-outline", onclick: () => startDrill(formSet(), "50 soal resmi BKN 2025") }, [icon("award"), "50 soal resmi BKN"])
        ])
      ]),
      ring(o.total ? o.done / o.total : 0, "soal sudah dicoba")
    ]));
    view.append(el("div", { class: "stats" }, [
      el("div", { class: "stat" }, [el("b", null, [o.acc === null ? "-" : pct(o.correct, o.seen) + "%"]), el("span", null, ["Akurasi jawaban"])]),
      el("div", { class: "stat" }, [el("b", null, [`${o.done}`]), el("span", null, [`dari ${o.total} soal dicoba`])]),
      el("div", { class: "stat" }, [el("b", null, [`${streak()} hari`]), el("span", null, ["Belajar beruntun"])]),
      el("div", { class: "stat" }, [el("b", null, [best < 0 ? "-" : `${best}`]), el("span", null, [best < 0 ? "Belum ada simulasi" : "Skor simulasi terbaik /500"])])
    ]));
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
    // per jenis tes
    view.append(el("div", { class: "sec-head" }, [el("h2", null, ["Penguasaan per topik"]), el("span", { class: "small muted" }, ["Bar = persentase soal yang sudah dicoba; angka = akurasi"])]));
    const groups = {}; TOPICS.forEach(t => (groups[t.test] = groups[t.test] || []).push(t));
    Object.keys(groups).forEach(k => {
      const T = TESTS[k];
      view.append(el("div", { class: "test-group" }, [
        el("div", { class: "test-head tc" + T.color }, [el("span", { class: "swatch" }), el("h3", null, [T.label]), k !== "EKSTRA" ? el("span", { class: "chip" }, [`${groups[k].reduce((a, t) => a + t.n, 0)} soal di ujian`]) : el("span", { class: "chip" }, ["tidak masuk 100 soal UPKP"])]),
        el("div", { class: "topic-grid" }, groups[k].map(topicCard))
      ]));
    });
  }
  function topicCard(t) {
    const s = topicStat(t.id), cov = pct(s.done, s.total);
    return el("article", { class: "topic-card " + tcOf(t) }, [
      el("div", { class: "t-top" }, [el("div", { class: "mono" }, [MONO[t.id]]), el("div", null, [el("h3", null, [t.label]), el("div", { class: "meta" }, [`Kisi-kisi hal. ${t.pages} · ${s.total} soal${t.n ? ` · ${t.n} di ujian` : ""}`])])]),
      el("div", { class: "stack", style: "gap:6px" }, [
        el("div", { class: "row between xs" }, [el("span", { class: "muted" }, [`${s.done}/${s.total} dicoba (${cov}%)`]), el("b", null, [s.acc === null ? "belum ada" : `akurasi ${Math.round(s.acc * 100)}%`])]),
        el("div", { class: "meter", role: "progressbar", "aria-valuenow": cov, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": t.label }, [el("i", { style: `width:${cov}%` })])
      ]),
      el("div", { class: "t-actions" }, [el("button", { class: "btn btn-sm", onclick: () => nav("materi", { topic: t.id }) }, ["Materi"]), el("button", { class: "btn btn-sm btn-primary", onclick: () => startDrill(pickFrom([t.id], 10, "unseen"), t.label) }, ["Latih"])])
    ]);
  }

  // ---------- Materi ----------
  function renderMateri(arg) {
    let cur = (arg && arg.topic) || (renderMateri.last) || TOPICS[0].id;
    const toc = el("nav", { class: "toc", "aria-label": "Daftar topik" });
    const art = el("article", { class: "panel article" });
    const draw = () => {
      renderMateri.last = cur;
      toc.innerHTML = ""; let lastTest = null;
      TOPICS.forEach(t => {
        if (t.test !== lastTest) { toc.appendChild(el("div", { class: "grp eyebrow" }, [TESTS[t.test].label])); lastTest = t.test; }
        toc.appendChild(el("button", { class: tcOf(t), "aria-current": t.id === cur ? "true" : null, onclick: () => { cur = t.id; draw(); window.scrollTo({ top: 0 }); } }, [t.label]));
      });
      const t = topicById(cur), n = pool(cur).length;
      art.innerHTML = "";
      art.append(
        el("div", { class: "stack", style: "gap:10px;margin-bottom:18px" }, [
          el("div", { class: "row" }, [testChip(t), el("span", { class: "chip chip-page" }, [`Kisi-kisi hal. ${t.pages}`]), t.n ? el("span", { class: "chip" }, [`${t.n} soal di UPKP`]) : el("span", { class: "chip chip-warn" }, ["Materi tambahan kisi-kisi"])]),
          el("h1", null, [t.label])
        ]),
        el("div", { class: "prose", html: md(MATERI[cur] || "Materi belum tersedia.") }),
        el("div", { class: "row", style: "margin-top:24px" }, [el("button", { class: "btn btn-primary", onclick: () => startDrill(pickFrom([cur], 20, "unseen"), t.label) }, [icon("pen"), `Latih topik ini (${n} soal)`])])
      );
    };
    draw();
    view.append(el("div", { class: "materi" }, [toc, art]));
  }

  // ---------- Latihan ----------
  let pickSel = new Set(), pickCount = 20, pickOrder = "unseen", pickSrc = "all";
  function pickFrom(tids, n, order, src) {
    let list = tids.flatMap(pool);
    if (src === "form") list = list.filter(q => q.set === "form"); else if (src === "kisi") list = list.filter(q => q.set !== "form");
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
  function startDrill(qs, title) {
    if (!qs.length) return toast("Tidak ada soal untuk pilihan ini.");
    if (exam && !exam.finished) return toast("Selesaikan simulasi yang sedang berjalan dulu.");
    drill = { active: true, qs, i: 0, answers: {}, correct: 0, title };
    go("latihan");
  }
  function renderLatihan(arg) {
    if (drill && drill.active) return drill.i >= drill.qs.length ? renderDrillSummary() : renderDrillQ();
    if (arg && arg.topics) pickSel = new Set(arg.topics);
    const avail = () => { let l = [...pickSel].flatMap(pool); if (pickSrc === "form") l = l.filter(q => q.set === "form"); else if (pickSrc === "kisi") l = l.filter(q => q.set !== "form"); return l.length; };
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
      el("section", { class: "panel stack", style: "gap:20px" }, [
        el("div", { class: "sec-head" }, [el("h2", null, ["Susun latihan sendiri"]), el("div", { class: "row", style: "gap:4px" }, [el("button", { class: "btn btn-sm btn-ghost", onclick: () => selAll(true) }, ["Pilih semua"]), el("button", { class: "btn btn-sm btn-ghost", onclick: () => selAll(false) }, ["Kosongkan"])])]),
        picker,
        el("div", { class: "opts-row" }, [
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Jumlah soal"]), seg([[10, "10"], [20, "20"], [30, "30"], [50, "50"]], () => pickCount, v => pickCount = v)]),
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Prioritas"]), seg([["unseen", "Belum dicoba"], ["wrong", "Pernah salah"], ["random", "Acak"]], () => pickOrder, v => pickOrder = v)]),
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Jenis soal"]), seg([["all", "Semua"], ["kisi", "Dari materi kisi-kisi"], ["form", "Resmi saja"]], () => pickSrc, v => pickSrc = v)])
        ]),
        el("div", { class: "row" }, [startBtn])
      ])
    );
    refresh();
  }
  function renderDrillQ() {
    view.innerHTML = "";
    const q = drill.qs[drill.i], t = topicById(q.topic), answered = q.id in drill.answers;
    const top = el("div", { class: "q-top" }, [
      el("button", { class: "btn btn-ghost icon-btn", "aria-label": "Hentikan latihan", onclick: () => confirmBox("Hentikan latihan?", "Jawaban yang sudah masuk tetap tercatat di statistik.", "Hentikan", () => { drill.i = drill.qs.length; renderDrillSummary(); }) }, [icon("x")]),
      el("div", { class: "q-progress", role: "progressbar", "aria-valuenow": drill.i + 1, "aria-valuemax": drill.qs.length }, [el("i", { style: `width:${pct(drill.i + (answered ? 1 : 0), drill.qs.length)}%` })]),
      el("span", { class: "small num muted" }, [`${drill.i + 1}/${drill.qs.length}`]),
      el("span", { class: "chip chip-ok num" }, [icon("check"), `${drill.correct}`])
    ]);
    const opts = el("div", { class: "options", role: "group", "aria-label": "Pilihan jawaban" });
    const fb = el("div");
    const act = el("div", { class: "q-actions" });
    const bm = () => el("button", { class: "btn btn-ghost btn-sm", "aria-pressed": state.bookmarks.includes(q.id) ? "true" : "false", onclick: e => { toggleBookmark(q.id); e.currentTarget.replaceWith(bm()); } }, [icon("bookmark"), state.bookmarks.includes(q.id) ? "Ditandai" : "Tandai"]);
    const choose = idx => {
      if (q.id in drill.answers) return;
      const ok = idx === q.a; recordAnswer(q, ok); drill.answers[q.id] = idx; if (ok) drill.correct++;
      paintOpts(); fb.appendChild(feedback(q, idx)); drawAct();
      top.querySelector(".chip-ok").lastChild.textContent = String(drill.correct);
      top.querySelector(".q-progress i").style.width = pct(drill.i + 1, drill.qs.length) + "%";
      const nx = act.querySelector(".btn-primary"); if (nx) nx.focus();
    };
    const paintOpts = () => {
      opts.innerHTML = ""; const ch = drill.answers[q.id], done = ch !== undefined;
      q.o.forEach((o, i) => opts.appendChild(el("button", {
        class: "opt" + (done ? (i === q.a ? " correct" : i === ch ? " wrong" : " dim") : ""), disabled: done, onclick: () => choose(i), "aria-label": `${L[i]}. ${o}`
      }, [el("span", { class: "k" }, [L[i]]), el("span", null, [o]), el("span", { class: "mk" }, [done && i === q.a ? icon("check") : done && i === ch ? icon("x") : ""])])));
    };
    const drawAct = () => {
      act.innerHTML = "";
      const doneQ = q.id in drill.answers;
      act.append(el("div", { class: "row" }, [bm(), el("span", { class: "kbd-hint" }, [el("span", { class: "kbd" }, ["A-" + L[q.o.length - 1]]), " pilih  ", el("span", { class: "kbd" }, ["Enter"]), " lanjut"])]),
        doneQ ? el("button", { class: "btn btn-primary", onclick: nextDrill }, [drill.i + 1 < drill.qs.length ? "Soal berikutnya" : "Lihat ringkasan", icon("right")]) : el("span", { class: "small muted" }, ["Pilih satu jawaban"]));
    };
    paintOpts(); drawAct();
    if (answered) fb.appendChild(feedback(q, drill.answers[q.id]));
    view.append(el("div", { class: "stack", style: "gap:6px" }, [el("span", { class: "eyebrow" }, [drill.title || "Latihan"]), top]),
      el("section", { class: "panel lift q-card" }, [el("div", { class: "q-meta" }, [testChip(t), el("span", { class: "chip" }, [t.label]), srcTag(q)]), el("div", { class: "q-text" }, [q.q]), opts, fb]),
      el("div", { class: "sticky-act" }, [act]));
    drill.choose = choose;
  }
  function nextDrill() { drill.i++; drill.i >= drill.qs.length ? renderDrillSummary() : renderDrillQ(); }
  function feedback(q, ch) {
    const ok = ch === q.a, skip = ch === null || ch === undefined;
    return el("div", { class: "feedback " + (ok ? "ok" : "bad") }, [
      el("div", { class: "fb-title" }, [icon(ok ? "check" : skip ? "alert" : "x"), ok ? `Benar, jawabannya ${L[q.a]}.` : skip ? `Tidak dijawab. Jawaban benar: ${L[q.a]}.` : `Kurang tepat. Kamu memilih ${L[ch]}, jawaban benar ${L[q.a]}.`]),
      el("div", { class: "fb-body" }, [q.e]),
      el("div", { class: "fb-src" }, ["Rujukan: " + q.src])
    ]);
  }
  function toggleBookmark(id) { const i = state.bookmarks.indexOf(id); if (i >= 0) { state.bookmarks.splice(i, 1); toast("Tanda dihapus"); } else { state.bookmarks.push(id); toast("Soal ditandai"); } save(); }
  function renderDrillSummary() {
    view.innerHTML = ""; drill.active = false;
    const done = Object.keys(drill.answers).length, wrong = drill.qs.filter(q => q.id in drill.answers && drill.answers[q.id] !== q.a);
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
      wrong.length ? el("div", { class: "stack" }, [el("h2", null, ["Soal yang salah"]), el("div", { class: "review" }, wrong.map(q => reviewItem(q, drill.answers[q.id], false)))]) : null
    );
  }
  function reviewItem(q, ch, flagged, no) {
    const t = topicById(q.topic), st = ch === null || ch === undefined ? "skip" : ch === q.a ? "ok" : "bad";
    return el("article", { class: "review-item " + st }, [
      el("div", { class: "q-meta" }, [no ? el("span", { class: "chip num" }, [`No. ${no}`]) : null, testChip(t), el("span", { class: "chip" }, [t.label]), srcTag(q), flagged ? el("span", { class: "chip chip-warn" }, [icon("flag"), "Ragu-ragu"]) : null]),
      el("div", { class: "q-text" }, [q.q]),
      el("div", { class: "options" }, q.o.map((o, i) => el("div", { class: "opt" + (i === q.a ? " correct" : i === ch ? " wrong" : " dim") }, [el("span", { class: "k" }, [L[i]]), el("span", null, [o]), el("span", { class: "mk" }, [i === q.a ? icon("check") : i === ch ? icon("x") : ""])]))),
      feedback(q, st === "skip" ? null : ch)
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
  function persistExam() { if (!exam || exam.finished) return store.del(EXAM_KEY); store.set(EXAM_KEY, JSON.stringify({ mode: exam.mode, ids: exam.qs.map(q => q.id), sections: exam.sections, i: exam.i, answers: exam.answers, flags: exam.flags, endAt: exam.endAt, startedAt: exam.startedAt })); }
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
      exam = { mode: simMode, qs: b.qs, sections: b.sections, i: 0, answers: {}, flags: {}, startedAt: Date.now(), endAt: Date.now() + secs * 1000, finished: false };
      persistExam(); startTimer(); renderExamQ(); window.scrollTo({ top: 0 });
    };
    view.append(
      el("div", null, [el("h1", null, ["Simulasi CAT"]), el("p", { class: "muted", style: "margin-top:6px;max-width:64ch" }, ["Kondisi seperti CAT BKN: pembahasan baru muncul setelah selesai. Benar bernilai 5, salah atau kosong 0, jadi jawab semua soal. Progres tersimpan otomatis bila halaman tertutup."])]),
      modes,
      el("section", { class: "panel stack", style: "gap:16px" }, [
        el("h2", null, ["Komposisi"]), comp,
        el("details", { class: "more" }, [el("summary", null, ["Durasi dan nilai ambang batas"]), el("div", { class: "stack", style: "margin-top:12px" }, [
          el("div", { class: "field", style: "max-width:200px" }, [el("label", { for: "durInput" }, ["Durasi (menit)"]), dur]),
          el("p", { class: "small muted" }, ["Ambang batas UPKP ditetapkan PPK Kemenimipas sebelum ujian. Isi bila sudah diumumkan; hasil akan menandai lulus/belum per jenis tes. Skor maks: TWK 150, TKT 125, TSI 150, TKP 75."]),
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
      el("div", { class: "options", role: "radiogroup" }, q.o.map((o, i) => el("button", { class: "opt" + (exam.answers[q.id] === i ? " chosen" : ""), role: "radio", "aria-checked": exam.answers[q.id] === i ? "true" : "false", onclick: () => set(i) }, [el("span", { class: "k" }, [L[i]]), el("span", null, [o]), el("span", { class: "mk" })])))
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
      for (let i = s.start; i < s.end; i++) { const q = exam.qs[i], ok = exam.answers[q.id] === q.a; recordAnswer(q, ok); r.n++; if (ok) r.correct++; }
    });
    const rows = Object.values(agg).map(r => Object.assign(r, { score: r.correct * 5, max: r.n * 5, th: exam.mode === "form" ? "" : state.settings.thresholds[r.key] }));
    const total = rows.reduce((a, r) => ({ n: a.n + r.n, correct: a.correct + r.correct, score: a.score + r.score, max: a.max + r.max }), { n: 0, correct: 0, score: 0, max: 0 });
    exam.result = { rows, total, timeout };
    state.history.push({ ts: exam.finishedAt, mode: exam.mode, durationSec: Math.round((Math.min(exam.finishedAt, exam.endAt) - exam.startedAt) / 1000), rows, total, timeout, qids: exam.qs.map(q => q.id), answers: exam.answers, flags: exam.flags });
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
        el("div", { class: "row", style: "gap:8px;justify-content:flex-end" }, [el("b", { class: "num" }, [`${r.score}/${r.max}`]), pass === null ? null : el("span", { class: "chip " + (pass ? "chip-ok" : "chip-bad") }, [icon(pass ? "check" : "x"), pass ? "Lulus" : `Ambang ${th}`])])
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
      ex.qs.forEach((q, i) => { const ch = ex.answers[q.id], st = ch === undefined ? "skip" : ch === q.a ? "ok" : "bad"; if (filter !== "all" && !(filter === "flag" ? ex.flags[q.id] : st === filter)) return; list.appendChild(reviewItem(q, ch === undefined ? null : ch, !!ex.flags[q.id], i + 1)); });
      if (!list.children.length) list.appendChild(el("div", { class: "empty" }, ["Tidak ada soal untuk filter ini."]));
    };
    const cnt = { bad: ex.qs.filter(q => q.id in ex.answers && ex.answers[q.id] !== q.a).length, skip: ex.qs.filter(q => !(q.id in ex.answers)).length, flag: ex.qs.filter(q => ex.flags[q.id]).length };
    const chips = el("div", { class: "seg" });
    const drawChips = () => { chips.innerHTML = ""; [["all", `Semua (${ex.qs.length})`], ["bad", `Salah (${cnt.bad})`], ["skip", `Kosong (${cnt.skip})`], ["flag", `Ragu (${cnt.flag})`]].forEach(([v, l]) => chips.appendChild(el("button", { "aria-pressed": filter === v ? "true" : "false", onclick: () => { filter = v; drawChips(); drawList(); } }, [l]))); };
    drawChips(); drawList();
    const wrong = ex.qs.filter(q => ex.answers[q.id] !== q.a);
    view.append(
      el("section", { class: "panel lift stack", style: "gap:22px" }, [
        el("div", { class: "row between" }, [el("div", null, [el("span", { class: "eyebrow" }, [MODES[ex.mode || "upkp"].title]), el("h1", { style: "margin-top:4px" }, ["Hasil simulasi"])]), el("div", { class: "row" }, [r.timeout ? el("span", { class: "chip chip-warn" }, ["Waktu habis"]) : el("span", { class: "chip chip-ok" }, ["Selesai"]), anyTh ? el("span", { class: "chip " + (allPass ? "chip-ok" : "chip-bad") }, [allPass ? "Memenuhi semua ambang" : "Belum memenuhi ambang"]) : null])]),
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
      const h = arg.attempt, ex = { mode: h.mode, qs: h.qids.map(id => qById[id]).filter(Boolean), answers: h.answers || {}, flags: h.flags || {}, result: { rows: rowsOf(h), total: h.total, timeout: h.timeout } };
      renderResult(ex);
      view.insertBefore(el("div", null, [el("button", { class: "btn btn-sm btn-ghost", onclick: () => go("riwayat") }, [icon("left"), "Kembali ke riwayat"])]), view.firstChild);
      return;
    }
    const hist = validHistory();
    const wrongIds = Object.keys(state.stats).filter(id => qById[id] && state.stats[id].lastWrong);
    const bm = state.bookmarks.map(id => qById[id]).filter(Boolean);
    view.append(el("h1", null, ["Riwayat & pengulangan"]),
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
    view.append(el("h1", null, ["Pengaturan"]),
      el("div", { class: "grid-2" }, [
        el("section", { class: "panel stack", style: "gap:16px" }, [
          el("div", { class: "field" }, [el("label", { for: "examDate" }, ["Tanggal ujian (untuk hitung mundur)"]), date]),
          el("div", { class: "stack", style: "gap:8px" }, [el("span", { class: "label" }, ["Nilai ambang batas per jenis tes"]), el("p", { class: "xs muted" }, ["Ditetapkan PPK Kemenimipas. Skor maks: TWK 150, TKT 125, TSI 150, TKP 75."]), el("div", { class: "grid-3", style: "grid-template-columns:repeat(4,minmax(0,1fr))" }, TEST_ORDER.map(k => el("div", { class: "field" }, [el("label", { for: "set" + k }, [k]), th[k]])))]),
          el("div", { class: "field" }, [el("span", { class: "label" }, ["Tema tampilan"]), themeSeg]),
          el("div", null, [saveBtn])
        ]),
        el("section", { class: "panel stack", style: "gap:14px" }, [
          el("h2", null, ["Bank soal"]),
          el("p", { class: "small" }, [`${ALL.length} soal: ${ALL.filter(q => q.set !== "form").length} soal dari materi PPT kisi-kisi PPSS BKN 2025 dan ${formSet().length} soal resmi Google Form BKN 2025.`]),
          el("p", { class: "xs muted" }, [counts]),
          el("p", { class: "xs muted" }, ["Kunci 50 soal resmi disusun aplikasi (form tidak memuat kunci). Bila kisi-kisi berbeda dari peraturan primer, pembahasan mencatat keduanya. Materi SOTK dan Renstra instansi di kisi-kisi hanya berupa judul subtopik, sehingga soalnya dilengkapi dari Permenimipas 1/2024, 2/2024, dan 11/2025."]),
          el("h3", null, ["Data progres"]),
          el("p", { class: "xs muted" }, ["Tersimpan di browser ini saja. Ekspor untuk pindah perangkat."]),
          el("div", { class: "row" }, [el("button", { class: "btn btn-sm", onclick: exportData }, ["Ekspor JSON"]), el("button", { class: "btn btn-sm", onclick: importData }, ["Impor"]), el("button", { class: "btn btn-sm btn-danger", onclick: () => confirmBox("Hapus semua progres?", "Statistik, riwayat simulasi, dan tanda soal dihapus. Pengaturan tetap.", "Hapus progres", () => { state.stats = {}; state.history = []; state.bookmarks = []; state.days = {}; save(); toast("Progres dihapus"); go("pengaturan"); }, true) }, ["Reset progres"])])
        ])
      ]));
  }
  function exportData() { const a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })), download: "upkp-progres-" + dayKey() + ".json" }); document.body.appendChild(a); a.click(); a.remove(); }
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
    const k = e.key.toUpperCase(), idx = L.indexOf(k);
    if (current === "latihan" && drill && drill.active && drill.i < drill.qs.length) {
      const q = drill.qs[drill.i];
      if (idx >= 0 && idx < q.o.length && !(q.id in drill.answers)) { e.preventDefault(); drill.choose(idx); }
      else if ((e.key === "Enter" || e.key === "ArrowRight") && q.id in drill.answers && !(e.target && e.target.tagName === "BUTTON" && e.key === "Enter")) { e.preventDefault(); nextDrill(); }
    } else if (current === "simulasi" && exam && !exam.finished) {
      const q = exam.qs[exam.i];
      if (idx >= 0 && idx < q.o.length) { exam.answers[q.id] = idx; persistExam(); renderExamQ(); }
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
