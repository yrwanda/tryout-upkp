/* Aplikasi belajar UPKP - vanilla JS, tanpa dependensi. Data tersimpan di localStorage browser. */
(function () {
  "use strict";

  // ---------- Util ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, attrs, children) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => { if (c === null || c === undefined) return; n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pad = n => String(n).padStart(2, "0");
  const fmtTime = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  const fmtDate = ts => new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  const LETTERS = ["A", "B", "C", "D", "E"];

  // ---------- Storage ----------
  const KEY = "upkp-app-v1";
  const defaultState = () => ({
    settings: { includeImi: false, examDate: "", durationMin: 90, thresholds: { TWK: "", TKT: "", TSI: "", TKP: "" }, theme: "auto", source: "all" },
    stats: {},      // id -> { seen, correct, wrong, lastWrong(bool) }
    history: [],    // tryout attempts
    bookmarks: []
  });
  let state = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); return Object.assign(defaultState(), s, { settings: Object.assign(defaultState().settings, s.settings || {}) }); } } catch (e) { }
    return defaultState();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }

  // ---------- Data ----------
  const BANK = window.BANK || {};
  const TOPICS = window.TOPICS || [];
  const TESTS = window.TESTS || {};
  const topicById = id => TOPICS.find(t => t.id === id);
  const allQuestions = () => TOPICS.flatMap(t => (BANK[t.id] || []));
  const qById = {}; allQuestions().forEach(q => qById[q.id] = q);
  const includeImi = () => !!state.settings.includeImi;
  // Sumber soal: "kurasi" (bank hasil riset), "bkn" (kisi-kisi BKN + latihan resmi), "all" (keduanya)
  const SOURCES = { kurasi: "Kurasi (riset)", bkn: "Kisi-kisi BKN", all: "Semua sumber" };
  const source = () => state.settings.source || "all";
  const inSource = q => source() === "all" ? true : source() === "bkn" ? (q.set === "bkn" || q.set === "form") : !q.set;
  const visibleTopics = () => TOPICS.filter(t => (!t.optional || includeImi()) && (!t.bkn || source() !== "kurasi") && pool(t.id).length > 0);
  const pool = topicId => (BANK[topicId] || []).filter(q => (includeImi() || !q.imi) && inSource(q));
  const formSet = () => allQuestions().filter(q => q.set === "form");

  function recordAnswer(q, correct) {
    const s = state.stats[q.id] || { seen: 0, correct: 0, wrong: 0, lastWrong: false };
    s.seen++; if (correct) s.correct++; else s.wrong++; s.lastWrong = !correct;
    state.stats[q.id] = s; save();
  }
  function pickQuestions(topicId, n, mode) {
    const list = pool(topicId);
    if (mode === "weak") {
      const score = q => { const s = state.stats[q.id]; if (!s) return 0; return (s.lastWrong ? 3 : 0) + s.wrong - s.correct * 0.5 + 1 + Math.random() * 0.5; };
      // belum pernah dikerjakan dan yang salah didahulukan
      return list.slice().sort((a, b) => { const sa = state.stats[a.id], sb = state.stats[b.id]; if (!sa && sb) return -1; if (sa && !sb) return 1; return score(b) - score(a); }).slice(0, n);
    }
    return shuffle(list).slice(0, n);
  }
  function topicAccuracy(topicId) {
    let seen = 0, correct = 0, answeredQ = 0;
    pool(topicId).forEach(q => { const s = state.stats[q.id]; if (s) { seen += s.seen; correct += s.correct; answeredQ++; } });
    return { seen, correct, answeredQ, total: pool(topicId).length, acc: seen ? correct / seen : null };
  }

  // ---------- Markdown mini ----------
  function md(src) {
    const lines = src.trim().split("\n"); let out = [], inList = false, inTable = false;
    const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code>$1</code>");
    const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };
    const closeTable = () => { if (inTable) { out.push("</tbody></table>"); inTable = false; } };
    lines.forEach(line => {
      const t = line.trim();
      if (t.startsWith("|")) {
        closeList();
        const cells = t.split("|").slice(1, -1).map(c => c.trim());
        if (cells.every(c => /^-+$/.test(c))) return;
        if (!inTable) { out.push("<table><thead><tr>" + cells.map(c => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>"); inTable = true; return; }
        out.push("<tr>" + cells.map(c => `<td>${inline(c)}</td>`).join("") + "</tr>"); return;
      }
      closeTable();
      if (t.startsWith("## ")) { closeList(); out.push(`<h2>${inline(t.slice(3))}</h2>`); }
      else if (t.startsWith("# ")) { closeList(); out.push(`<h1>${inline(t.slice(2))}</h1>`); }
      else if (t.startsWith("- ")) { if (!inList) { out.push("<ul>"); inList = true; } out.push(`<li>${inline(t.slice(2))}</li>`); }
      else if (t === "") { closeList(); }
      else { closeList(); out.push(`<p>${inline(t)}</p>`); }
    });
    closeList(); closeTable();
    return out.join("\n");
  }

  // ---------- Theme ----------
  function applyTheme() {
    const t = state.settings.theme;
    const dark = t === "dark" || (t === "auto" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  // ---------- Toast / modal ----------
  let toastT;
  function toast(msg) { let t = $("#toast"); if (!t) { t = el("div", { id: "toast", class: "toast" }); document.body.appendChild(t); } t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200); }
  function confirmBox(title, body, okLabel, onOk, danger) {
    const bg = el("div", { class: "modal-bg" });
    const box = el("div", { class: "modal" }, [
      el("h2", null, [title]), el("p", { class: "muted" }, [body]),
      el("div", { class: "actions" }, [
        el("button", { class: "btn btn-ghost", onclick: () => bg.remove() }, ["Batal"]),
        el("button", { class: "btn " + (danger ? "btn-danger" : "btn-primary"), onclick: () => { bg.remove(); onOk(); } }, [okLabel])
      ])
    ]);
    bg.appendChild(box); document.body.appendChild(bg);
  }

  // ---------- Router ----------
  const view = $("#view");
  let current = "home";
  let examTimer = null;
  const routes = { home: renderHome, materi: renderMateri, latihan: renderLatihan, simulasi: renderSimulasi, riwayat: renderRiwayat, pengaturan: renderPengaturan };
  function go(name, arg) {
    if (examTimer && name !== "simulasi") { clearInterval(examTimer); examTimer = null; }
    current = name; view.innerHTML = "";
    document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.route === name));
    routes[name](arg);
    window.scrollTo({ top: 0 });
  }
  document.querySelectorAll(".nav button").forEach(b => b.addEventListener("click", () => {
    if (exam && exam.active && !exam.finished) { confirmBox("Keluar dari simulasi?", "Jawaban yang sudah diisi tidak akan dinilai.", "Keluar", () => { exam = null; go(b.dataset.route); }, true); return; }
    go(b.dataset.route);
  }));
  const sourceSel = $("#sourceSel");
  function syncSourceSel() { if (sourceSel) sourceSel.value = source(); }
  if (sourceSel) { Object.keys(SOURCES).forEach(v => sourceSel.appendChild(el("option", { value: v }, [SOURCES[v]]))); syncSourceSel(); sourceSel.addEventListener("change", () => { if (exam && exam.active && !exam.finished) { syncSourceSel(); return toast("Selesaikan simulasi dulu."); } state.settings.source = sourceSel.value; save(); drill = null; toast("Sumber soal: " + SOURCES[source()]); go(current); }); }
  $("#themeBtn").addEventListener("click", () => { const order = ["auto", "light", "dark"]; state.settings.theme = order[(order.indexOf(state.settings.theme) + 1) % 3]; save(); applyTheme(); toast("Tema: " + state.settings.theme); });

  // ---------- Home ----------
  function renderHome() {
    const vt = visibleTopics();
    const totalQ = vt.reduce((a, t) => a + pool(t.id).length, 0);
    const answered = Object.keys(state.stats).filter(id => qById[id]).length;
    const seen = Object.values(state.stats).reduce((a, s) => a + s.seen, 0);
    const correct = Object.values(state.stats).reduce((a, s) => a + s.correct, 0);
    const last = state.history[state.history.length - 1];

    let countdown = null;
    if (state.settings.examDate) {
      const d = Math.ceil((new Date(state.settings.examDate + "T00:00:00") - new Date(new Date().toDateString())) / 86400000);
      countdown = d > 0 ? `${d} hari lagi` : d === 0 ? "Hari ini!" : "Sudah lewat";
    }

    const weak = vt.map(t => ({ t, a: topicAccuracy(t.id) })).filter(x => x.a.seen >= 3 && x.a.acc < 0.7).sort((x, y) => x.a.acc - y.a.acc).slice(0, 3);

    view.append(
      el("div", { class: "grid grid-3" }, [
        el("div", { class: "card stat" }, [el("div", { class: "v" }, [countdown || "-"]), el("div", { class: "l" }, [countdown ? "Menuju hari ujian (" + state.settings.examDate + ")" : "Atur tanggal ujian di Pengaturan"])]),
        el("div", { class: "card stat" }, [el("div", { class: "v" }, [`${answered}/${totalQ}`]), el("div", { class: "l" }, ["Soal sudah pernah dikerjakan"])]),
        el("div", { class: "card stat" }, [el("div", { class: "v" }, [seen ? Math.round(correct / seen * 100) + "%" : "-"]), el("div", { class: "l" }, [`Akurasi keseluruhan (${correct}/${seen} jawaban)`])]),
      ]),
      el("div", { class: "grid grid-2", style: "margin-top:16px" }, [
        el("div", { class: "card" }, [
          el("div", { class: "card-head" }, [el("h2", null, ["Mulai belajar"])]),
          el("p", { class: "muted small" }, ["Alur yang disarankan: baca Materi topik lemah, kerjakan Latihan dengan umpan balik langsung, lalu uji diri dengan Simulasi 100 soal / 90 menit."]),
          el("div", { class: "actions" }, [
            el("button", { class: "btn btn-primary", onclick: () => go("simulasi") }, ["Simulasi ujian"]),
            el("button", { class: "btn", onclick: () => go("latihan") }, ["Latihan per topik"]),
            el("button", { class: "btn", onclick: () => go("materi") }, ["Baca materi"]),
          ]),
          last ? el("p", { class: "small muted", style: "margin-top:12px" }, [`Simulasi terakhir: ${fmtDate(last.ts)} - skor ${last.total.score}/${last.total.max} (${last.total.correct} benar).`]) : null,
          weak.length ? el("div", { style: "margin-top:12px" }, [
            el("h3", null, ["Topik yang perlu diperkuat"]),
            ...weak.map(x => el("div", { class: "topic-row" }, [
              el("span", null, [x.t.label]), el("span", { class: "small muted" }, [Math.round(x.a.acc * 100) + "%"]),
              el("div", { class: "bar bad" }, [el("i", { style: `width:${Math.round(x.a.acc * 100)}%` })])
            ])),
            el("div", { class: "actions" }, [el("button", { class: "btn btn-sm", onclick: () => go("latihan", { topics: weak.map(x => x.t.id), mode: "weak" }) }, ["Latih topik lemah"])])
          ]) : null
        ]),
        el("div", { class: "card" }, [
          el("div", { class: "card-head" }, [el("h2", null, ["Struktur UPKP D3-S3"]), el("span", { class: "badge" }, ["SE BKN 10/2024"])]),
          structureTable(),
          el("p", { class: "small muted", style: "margin-top:8px" }, ["100 soal pilihan ganda, 90 menit, CAT BKN. Benar = 5, salah/kosong = 0 (maksimal 500). Nilai ambang batas UPKP ditetapkan PPK Kemenimipas dan disampaikan sebelum ujian; tidak ada pengurangan nilai, jadi jawab semua soal."])
        ])
      ]),
      el("div", { class: "card", style: "margin-top:16px" }, [
        el("div", { class: "card-head" }, [el("h2", null, ["Penguasaan per topik"])]),
        ...vt.map(t => { const a = topicAccuracy(t.id); const p = a.acc === null ? 0 : Math.round(a.acc * 100); const cls = a.acc === null ? "" : p >= 80 ? "ok" : p >= 60 ? "warn" : "bad"; return el("div", { class: "topic-row" }, [
          el("span", null, [el("span", { class: "badge badge-muted", style: "margin-right:6px" }, [t.test]), t.label]),
          el("span", { class: "small muted" }, [a.acc === null ? `0/${a.total} dikerjakan` : `${p}% - ${a.answeredQ}/${a.total} soal`]),
          el("div", { class: "bar " + cls }, [el("i", { style: `width:${p}%` })])
        ]); })
      ])
    );
  }
  function structureTable() {
    const rows = TOPICS.filter(t => !t.optional);
    const byTest = {}; rows.forEach(t => { (byTest[t.test] = byTest[t.test] || []).push(t); });
    const tb = el("table", { class: "tbl" }, [el("thead", null, [el("tr", null, [el("th", null, ["Jenis tes"]), el("th", null, ["Materi"]), el("th", { class: "num" }, ["Soal"])])])]);
    const body = el("tbody");
    Object.keys(byTest).forEach(k => {
      byTest[k].forEach((t, i) => body.appendChild(el("tr", null, [el("td", null, [i === 0 ? el("strong", null, [k]) : ""]), el("td", null, [t.label]), el("td", { class: "num" }, [String(t.n)])])));
      body.appendChild(el("tr", null, [el("td"), el("td", { class: "muted small" }, ["Subtotal " + k]), el("td", { class: "num" }, [String(byTest[k].reduce((a, t) => a + t.n, 0))])]));
    });
    body.appendChild(el("tr", { class: "total" }, [el("td", null, ["Total"]), el("td"), el("td", { class: "num" }, ["100"])]));
    tb.appendChild(body); return tb;
  }

  // ---------- Materi ----------
  function renderMateri(arg) {
    const vt = visibleTopics();
    let cur = (arg && arg.topic) || vt[0].id;
    const nav = el("div", { class: "materi-nav" });
    const content = el("div", { class: "card prose" });
    const draw = () => {
      nav.innerHTML = ""; let lastTest = null;
      vt.forEach(t => {
        if (t.test !== lastTest) { nav.appendChild(el("div", { class: "grp" }, [TESTS[t.test].label])); lastTest = t.test; }
        nav.appendChild(el("button", { class: t.id === cur ? "active" : "", onclick: () => { cur = t.id; draw(); window.scrollTo({ top: 0 }); } }, [t.label]));
      });
      const t = topicById(cur);
      content.innerHTML = `<div class="card-head"><h2>${esc(t.label)}</h2><span class="badge">${esc(t.test)}${t.n ? " - " + t.n + " soal" : ""}</span></div>` + md(window.MATERI[cur] || "Materi belum tersedia.");
      content.appendChild(el("div", { class: "actions" }, [el("button", { class: "btn btn-primary", onclick: () => go("latihan", { topics: [cur] }) }, ["Latihan soal topik ini"])]));
    };
    draw();
    view.append(el("div", { class: "materi-layout" }, [el("div", { class: "card", style: "align-self:start" }, [nav]), content]));
  }

  // ---------- Latihan ----------
  let drill = null;
  function renderLatihan(arg) {
    if (drill && drill.active) return renderDrillQuestion();
    const vt = visibleTopics();
    const pre = (arg && arg.topics) || [];
    const boxes = {};
    const group = el("div", { class: "check-group" });
    let lastTest = null;
    vt.forEach(t => {
      if (t.test !== lastTest) { group.appendChild(el("h3", null, [TESTS[t.test].label])); lastTest = t.test; }
      const cb = el("input", { type: "checkbox" }); cb.checked = pre.length ? pre.includes(t.id) : false; boxes[t.id] = cb;
      const a = topicAccuracy(t.id);
      group.appendChild(el("label", { class: "check" }, [cb, el("span", null, [t.label, " ", el("span", { class: "small muted" }, [`(${pool(t.id).length} soal${a.acc !== null ? ", akurasi " + Math.round(a.acc * 100) + "%" : ""})`])])]));
    });
    const count = el("select", null, [10, 15, 20, 30, 50].map(n => el("option", { value: n }, [n + " soal"])));
    count.value = "20";
    const mode = el("select", null, [el("option", { value: "random" }, ["Acak"]), el("option", { value: "weak" }, ["Prioritaskan soal belum dikerjakan & pernah salah"])]);
    if (arg && arg.mode) mode.value = arg.mode;
    const start = () => {
      const chosen = vt.filter(t => boxes[t.id].checked).map(t => t.id);
      if (!chosen.length) return toast("Pilih minimal satu topik.");
      const n = parseInt(count.value, 10);
      // bagi rata antar topik, lalu isi sisa
      let qs = []; const per = Math.max(1, Math.floor(n / chosen.length));
      chosen.forEach(tid => qs.push(...pickQuestions(tid, per, mode.value)));
      if (qs.length < n) { const rest = chosen.flatMap(tid => pool(tid)).filter(q => !qs.includes(q)); qs.push(...(mode.value === "weak" ? rest : shuffle(rest)).slice(0, n - qs.length)); }
      qs = shuffle(qs).slice(0, n);
      if (!qs.length) return toast("Tidak ada soal untuk topik tersebut.");
      drill = { active: true, qs, i: 0, answers: {}, correct: 0 };
      renderDrillQuestion();
    };
    view.append(el("div", { class: "card" }, [
      el("div", { class: "card-head" }, [el("h2", null, ["Latihan dengan pembahasan langsung"])]),
      el("p", { class: "muted small" }, ["Setiap jawaban langsung diperiksa. Benar maupun salah, pembahasan dan rujukannya ditampilkan."]),
      source() !== "kurasi" ? el("div", { class: "feedback", style: "margin:0 0 12px" }, [
        el("div", { class: "title" }, ["Latihan Resmi BKN 2025 (50 soal asli)"]),
        el("div", { class: "small muted" }, ["Soal dari Google Form resmi BKN untuk Kemenimipas (tautan di kisi-kisi hal. 172), urutan asli, 4 opsi. Kunci dan pembahasan disusun aplikasi ini."]),
        el("div", { class: "actions", style: "margin-top:8px" }, [el("button", { class: "btn btn-primary btn-sm", onclick: () => { drill = { active: true, qs: formSet(), i: 0, answers: {}, correct: 0 }; renderDrillQuestion(); } }, ["Kerjakan 50 soal resmi (urut, dengan pembahasan)"])])
      ]) : null,
      el("div", { class: "actions", style: "margin:0 0 6px" }, [
        el("button", { class: "btn btn-sm", onclick: () => vt.forEach(t => boxes[t.id].checked = true) }, ["Pilih semua"]),
        el("button", { class: "btn btn-sm", onclick: () => vt.forEach(t => boxes[t.id].checked = false) }, ["Kosongkan"]),
      ]),
      group,
      el("div", { class: "inline", style: "margin-top:14px" }, [
        el("div", { class: "field", style: "margin:0" }, [el("label", null, ["Jumlah soal"]), count]),
        el("div", { class: "field", style: "margin:0;min-width:260px" }, [el("label", null, ["Urutan"]), mode]),
      ]),
      el("div", { class: "actions" }, [el("button", { class: "btn btn-primary", onclick: start }, ["Mulai latihan"])])
    ]));
  }
  function renderDrillQuestion() {
    view.innerHTML = "";
    if (drill.i >= drill.qs.length) return renderDrillSummary();
    const q = drill.qs[drill.i]; const t = topicById(q.topic);
    const card = el("div", { class: "card" });
    const head = el("div", { class: "q-head" }, [
      el("div", null, [el("span", { class: "badge" }, [t.test]), " ", el("span", { class: "badge badge-muted" }, [t.label]), " ", el("span", { class: "badge " + (q.set ? "badge-warn" : "badge-ok") }, [q.set === "form" ? "Resmi BKN" : q.set === "bkn" ? "Kisi-kisi BKN" : "Kurasi"])]),
      el("div", { class: "small muted mono" }, [`Soal ${drill.i + 1} / ${drill.qs.length} - benar ${drill.correct}`])
    ]);
    const opts = el("div", { class: "opts" });
    const fb = el("div");
    const btnRow = el("div", { class: "actions" });
    const bmBtn = el("button", { class: "btn btn-sm btn-ghost", onclick: () => toggleBookmark(q.id, bmBtn) }, [state.bookmarks.includes(q.id) ? "Hapus tanda" : "Tandai soal"]);
    q.o.forEach((o, idx) => {
      opts.appendChild(el("button", { class: "opt", onclick: () => {
        const correct = idx === q.a; recordAnswer(q, correct); drill.answers[q.id] = idx; if (correct) drill.correct++;
        head.lastChild.textContent = `Soal ${drill.i + 1} / ${drill.qs.length} - benar ${drill.correct}`;
        opts.querySelectorAll(".opt").forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add("correct"); if (j === idx && !correct) b.classList.add("wrong"); });
        fb.appendChild(feedbackBox(q, idx));
        btnRow.innerHTML = ""; btnRow.append(bmBtn, el("button", { class: "btn btn-primary", onclick: () => { drill.i++; renderDrillQuestion(); } }, [drill.i + 1 < drill.qs.length ? "Soal berikutnya" : "Lihat ringkasan"]));
      } }, [el("span", { class: "k" }, [LETTERS[idx]]), el("span", null, [o])]));
    });
    btnRow.append(bmBtn, el("button", { class: "btn btn-ghost", onclick: () => confirmBox("Hentikan latihan?", "Progres soal yang sudah dijawab tetap tersimpan.", "Hentikan", () => { drill.active = false; renderDrillSummary(); }) }, ["Hentikan"]));
    card.append(head, el("div", { class: "q-text" }, [q.q]), opts, fb, btnRow);
    view.appendChild(card);
  }
  function feedbackBox(q, chosen) {
    const ok = chosen === q.a;
    return el("div", { class: "feedback " + (ok ? "ok" : "bad") }, [
      el("div", { class: "title " + (ok ? "ok" : "bad") }, [ok ? `Benar. Jawaban: ${LETTERS[q.a]}.` : chosen === null || chosen === undefined ? `Tidak dijawab. Jawaban yang benar: ${LETTERS[q.a]}.` : `Kurang tepat. Kamu memilih ${LETTERS[chosen]}, jawaban yang benar ${LETTERS[q.a]}.`]),
      el("div", null, [q.e]),
      el("div", { class: "src" }, ["Rujukan: " + q.src])
    ]);
  }
  function toggleBookmark(id, btn) {
    const i = state.bookmarks.indexOf(id);
    if (i >= 0) { state.bookmarks.splice(i, 1); toast("Tanda dihapus"); } else { state.bookmarks.push(id); toast("Soal ditandai"); }
    save(); if (btn) btn.textContent = state.bookmarks.includes(id) ? "Hapus tanda" : "Tandai soal";
  }
  function renderDrillSummary() {
    view.innerHTML = "";
    const done = Object.keys(drill.answers).length;
    const wrong = drill.qs.filter(q => q.id in drill.answers && drill.answers[q.id] !== q.a);
    drill.active = false;
    view.append(el("div", { class: "card" }, [
      el("h2", null, ["Ringkasan latihan"]),
      el("div", { class: "grid grid-3" }, [
        el("div", { class: "stat" }, [el("div", { class: "v" }, [String(done)]), el("div", { class: "l" }, ["Dijawab"])]),
        el("div", { class: "stat" }, [el("div", { class: "v" }, [String(drill.correct)]), el("div", { class: "l" }, ["Benar"])]),
        el("div", { class: "stat" }, [el("div", { class: "v" }, [done ? Math.round(drill.correct / done * 100) + "%" : "-"]), el("div", { class: "l" }, ["Akurasi"])]),
      ]),
      el("div", { class: "actions" }, [
        wrong.length ? el("button", { class: "btn btn-primary", onclick: () => { drill = { active: true, qs: shuffle(wrong), i: 0, answers: {}, correct: 0 }; renderDrillQuestion(); } }, [`Ulangi ${wrong.length} soal yang salah`]) : null,
        el("button", { class: "btn", onclick: () => { drill = null; renderLatihan(); } }, ["Latihan baru"]),
        el("button", { class: "btn btn-ghost", onclick: () => go("home") }, ["Beranda"])
      ]),
      wrong.length ? el("div", { style: "margin-top:16px" }, [el("h3", null, ["Soal yang salah"]), ...wrong.map(q => reviewItem(q, drill.answers[q.id], false))]) : null
    ]));
  }
  function reviewItem(q, chosen, flagged) {
    const t = topicById(q.topic);
    const status = chosen === null || chosen === undefined ? "skip" : chosen === q.a ? "ok" : "bad";
    return el("div", { class: "review-item " + status }, [
      el("div", { class: "q-head" }, [el("div", null, [el("span", { class: "badge badge-muted" }, [t.label]), " ", el("span", { class: "badge " + (q.set ? "badge-warn" : "badge-ok") }, [q.set === "form" ? "Resmi BKN" : q.set === "bkn" ? "Kisi-kisi BKN" : "Kurasi"]), flagged ? el("span", { class: "badge badge-warn", style: "margin-left:6px" }, ["Ragu-ragu"]) : null]), el("span", { class: "small muted" }, [q.id])]),
      el("div", { class: "q-text" }, [q.q]),
      el("div", { class: "opts" }, q.o.map((o, i) => el("div", { class: "opt" + (i === q.a ? " correct" : i === chosen ? " wrong" : "") }, [el("span", { class: "k" }, [LETTERS[i]]), el("span", null, [o])]))),
      feedbackBox(q, chosen)
    ]);
  }

  // ---------- Simulasi ----------
  let exam = null;
  function buildFormExam() {
    // 50 soal resmi BKN dalam urutan asli, dikelompokkan per jenis tes
    const qs = formSet(); const sections = []; let start = 0;
    const testOf = q => (topicById(q.topic) || {}).test || "TKT";
    qs.forEach((q, i) => { const t = testOf(q); const last = sections[sections.length - 1]; if (!last || last.test !== t) { if (last) last.end = i; sections.push({ test: t, start: i, end: i + 1 }); } });
    if (sections.length) sections[sections.length - 1].end = qs.length;
    return { qs, sections };
  }
  function buildExam(withBonus) {
    const qs = []; const sections = [];
    ["TWK", "TKT", "TSI", "TKP"].forEach(test => {
      const start = qs.length;
      TOPICS.filter(t => t.test === test).forEach(t => { const picked = pickQuestions(t.id, t.n, "random"); if (picked.length < t.n) toast(`Bank soal ${t.label} kurang dari ${t.n}.`); qs.push(...shuffle(picked)); });
      sections.push({ test, start, end: qs.length });
    });
    if (withBonus) { const start = qs.length; qs.push(...pickQuestions("imigrasi", 10, "random")); sections.push({ test: "BONUS", start, end: qs.length }); }
    return { qs, sections };
  }
  function renderSimulasi() {
    if (exam && exam.active) return exam.finished ? renderExamResult(exam) : renderExamQuestion();
    const dur = el("input", { type: "number", min: 10, max: 240, value: state.settings.durationMin || 90 });
    const th = {}; ["TWK", "TKT", "TSI", "TKP"].forEach(k => th[k] = el("input", { type: "number", min: 0, max: 250, placeholder: "kosong", value: state.settings.thresholds[k] }));
    const bonus = el("input", { type: "checkbox" }); bonus.checked = false;
    const modeSel = el("select", null, [el("option", { value: "upkp" }, ["UPKP D3-S3: 100 soal, komposisi SE BKN 10/2024"]), el("option", { value: "form" }, ["Latihan Resmi BKN 2025: 50 soal asli (urutan asli)"])]);
    modeSel.addEventListener("change", () => { dur.value = modeSel.value === "form" ? 45 : (state.settings.durationMin || 90); });
    const start = () => {
      const isForm = modeSel.value === "form";
      if (!isForm) state.settings.durationMin = parseInt(dur.value, 10) || 90;
      ["TWK", "TKT", "TSI", "TKP"].forEach(k => state.settings.thresholds[k] = th[k].value); save();
      const b = isForm ? buildFormExam() : buildExam(includeImi() && bonus.checked);
      const secs = (parseInt(dur.value, 10) || (isForm ? 45 : 90)) * 60;
      exam = { active: true, finished: false, mode: modeSel.value, qs: b.qs, sections: b.sections, i: 0, answers: {}, flags: {}, remaining: secs, startedAt: Date.now() };
      examTimer = setInterval(() => { exam.remaining--; const tEl = $("#timer"); if (tEl) { tEl.textContent = fmtTime(Math.max(0, exam.remaining)); tEl.classList.toggle("low", exam.remaining < 300); } if (exam.remaining <= 0) { finishExam(true); } }, 1000);
      renderExamQuestion();
    };
    view.append(el("div", { class: "grid grid-2" }, [
      el("div", { class: "card" }, [
        el("h2", null, ["Simulasi UPKP (CAT)"]),
        el("p", { class: "muted small" }, ["Komposisi mengikuti Lampiran III SE BKN 10/2024 untuk UPKP D3-S3: 100 soal, urut TWK - TKT - TSI - TKP, waktu 90 menit. Pembahasan tampil setelah ujian selesai, seperti kondisi CAT sesungguhnya."]),
        el("div", { class: "field" }, [el("label", null, ["Sumber soal saat ini"]), el("div", null, [el("span", { class: "badge" }, [SOURCES[source()]]), " ", el("span", { class: "small muted" }, ["(ubah di menu atas atau Pengaturan)"])])]),
        source() !== "kurasi" ? el("div", { class: "field" }, [el("label", null, ["Mode simulasi"]), modeSel]) : null,
        source() === "bkn" ? el("p", { class: "small muted" }, ["Catatan: bank Kisi-kisi BKN untuk beberapa topik (misalnya SOTK) lebih sedikit dari kuota resmi, sehingga simulasi 100 soal bisa terisi kurang dari 100. Pakai \"Semua sumber\" untuk komposisi penuh."]) : null,
        el("div", { class: "field" }, [el("label", null, ["Durasi (menit)"]), dur]),
        el("h3", { style: "margin-top:10px" }, ["Nilai ambang batas (opsional)"]),
        el("p", { class: "small muted" }, ["Isi sesuai pengumuman PPK/panitia jika sudah ada. Kosongkan jika belum ditetapkan; hasil tetap menampilkan skor per jenis tes. Skor maksimal: TWK 150, TKT 125, TSI 150, TKP 75."]),
        el("div", { class: "grid grid-3", style: "gap:8px" }, ["TWK", "TKT", "TSI", "TKP"].map(k => el("div", { class: "field", style: "margin:0" }, [el("label", null, [k]), th[k]]))),
        includeImi() ? el("label", { class: "check", style: "margin-top:10px" }, [bonus, el("span", null, ["Tambahkan bagian bonus: 10 soal substansi keimigrasian (dinilai terpisah, tidak masuk 100 soal resmi)"])]) : el("p", { class: "small muted" }, ["Soal keimigrasian tidak disertakan (aktifkan di Pengaturan bila ingin)."]),
        el("div", { class: "actions" }, [el("button", { class: "btn btn-primary", onclick: start }, ["Mulai simulasi"])])
      ]),
      el("div", { class: "card" }, [el("h2", null, ["Komposisi soal"]), structureTable(),
        el("p", { class: "small muted", style: "margin-top:8px" }, ["Tips: soal tanpa pengurangan nilai, jadi jangan ada yang kosong. Gunakan tombol Ragu-ragu untuk kembali sebelum waktu habis."])])
    ]));
  }
  function sectionOf(i) { return exam.sections.find(s => i >= s.start && i < s.end); }
  function renderExamQuestion() {
    view.innerHTML = "";
    const q = exam.qs[exam.i]; const t = topicById(q.topic); const sec = sectionOf(exam.i);
    const answeredCount = Object.keys(exam.answers).length;
    const bar = el("div", { class: "exam-bar" }, [
      el("span", { id: "timer", class: "timer" + (exam.remaining < 300 ? " low" : "") }, [fmtTime(exam.remaining)]),
      el("span", { class: "badge" }, [TESTS[sec.test].short]),
      el("span", { class: "small muted" }, [`Soal ${exam.i + 1}/${exam.qs.length} - dijawab ${answeredCount}`]),
      el("span", { style: "margin-left:auto" }),
      el("button", { class: "btn btn-sm btn-danger", onclick: () => { const left = exam.qs.length - Object.keys(exam.answers).length; confirmBox("Selesaikan ujian?", left ? `Masih ada ${left} soal belum dijawab.` : "Semua soal sudah dijawab.", "Selesai & nilai", () => finishExam(false)); } }, ["Selesai"])
    ]);
    const opts = el("div", { class: "opts" }, q.o.map((o, idx) => el("button", { class: "opt" + (exam.answers[q.id] === idx ? " chosen" : ""), onclick: () => { exam.answers[q.id] = idx; renderExamQuestion(); } }, [el("span", { class: "k" }, [LETTERS[idx]]), el("span", null, [o])])));
    const qcard = el("div", { class: "card" }, [
      el("div", { class: "q-head" }, [el("div", null, [el("span", { class: "badge badge-muted" }, [t.label])]), el("span", { class: "small muted mono" }, [`No. ${exam.i + 1}`])]),
      el("div", { class: "q-text" }, [q.q]), opts,
      el("div", { class: "actions" }, [
        el("button", { class: "btn", disabled: exam.i === 0 ? "" : null, onclick: () => { exam.i--; renderExamQuestion(); } }, ["Sebelumnya"]),
        el("button", { class: "btn " + (exam.flags[q.id] ? "btn-primary" : ""), onclick: () => { exam.flags[q.id] = !exam.flags[q.id]; renderExamQuestion(); } }, [exam.flags[q.id] ? "Hapus ragu-ragu" : "Ragu-ragu"]),
        el("button", { class: "btn btn-primary", disabled: exam.i === exam.qs.length - 1 ? "" : null, onclick: () => { exam.i++; renderExamQuestion(); } }, ["Berikutnya"]),
      ])
    ]);
    const nav = el("div", { class: "card", style: "align-self:start" });
    exam.sections.forEach(s => {
      nav.appendChild(el("div", { class: "section-title" }, [TESTS[s.test].label]));
      const g = el("div", { class: "navgrid" });
      for (let i = s.start; i < s.end; i++) { const qq = exam.qs[i]; g.appendChild(el("button", { class: (exam.flags[qq.id] ? "flag" : qq.id in exam.answers ? "answered" : "") + (i === exam.i ? " current" : ""), onclick: () => { exam.i = i; renderExamQuestion(); } }, [String(i + 1)])); }
      nav.appendChild(g);
    });
    nav.appendChild(el("div", { class: "legend" }, [el("span", null, [el("i", { style: "background:var(--primary-soft)" }), "dijawab"]), el("span", null, [el("i", { style: "background:var(--warn-soft)" }), "ragu-ragu"]), el("span", null, [el("i"), "kosong"])]));
    view.append(bar, el("div", { class: "exam-layout" }, [qcard, nav]));
  }
  function finishExam(timeout) {
    if (examTimer) { clearInterval(examTimer); examTimer = null; }
    exam.finished = true; exam.finishedAt = Date.now();
    const perTest = {};
    exam.sections.forEach(s => {
      let correct = 0, n = s.end - s.start;
      for (let i = s.start; i < s.end; i++) { const q = exam.qs[i]; const ch = exam.answers[q.id]; const ok = ch === q.a; recordAnswer(q, ok); if (ok) correct++; }
      // satu jenis tes bisa terpecah jadi beberapa bagian (set resmi 50 soal: TKT muncul dua kali), jadi diakumulasi
      const acc = perTest[s.test] || { n: 0, correct: 0, score: 0, max: 0 };
      perTest[s.test] = { n: acc.n + n, correct: acc.correct + correct, score: acc.score + correct * 5, max: acc.max + n * 5 };
    });
    const official = ["TWK", "TKT", "TSI", "TKP"].filter(k => perTest[k]);
    const total = official.reduce((a, k) => ({ correct: a.correct + perTest[k].correct, score: a.score + perTest[k].score, max: a.max + perTest[k].max }), { correct: 0, score: 0, max: 0 });
    exam.result = { perTest, total, timeout, thresholds: Object.assign({}, state.settings.thresholds) };
    state.history.push({ ts: exam.finishedAt, mode: exam.mode || "upkp", source: source(), durationSec: Math.round((exam.finishedAt - exam.startedAt) / 1000), perTest, total, timeout, thresholds: exam.result.thresholds, qids: exam.qs.map(q => q.id), answers: exam.answers, flags: exam.flags });
    if (state.history.length > 50) state.history.shift();
    save();
    renderExamResult(exam);
  }
  function resultTable(perTest, thresholds) {
    const rows = ["TWK", "TKT", "TSI", "TKP", "BONUS"].filter(k => perTest[k]);
    const tb = el("table", { class: "tbl" }, [el("thead", null, [el("tr", null, [el("th", null, ["Jenis tes"]), el("th", { class: "num" }, ["Soal"]), el("th", { class: "num" }, ["Benar"]), el("th", { class: "num" }, ["Skor"]), el("th", { class: "num" }, ["Maks"]), el("th", null, ["Ambang"]), el("th", null, ["Status"])])])]);
    const body = el("tbody"); let allPass = true, anyTh = false;
    rows.forEach(k => {
      const r = perTest[k]; const th = thresholds && thresholds[k] !== "" && thresholds[k] !== undefined && k !== "BONUS" ? Number(thresholds[k]) : null;
      let status = el("span", { class: "badge badge-muted" }, [r.n ? Math.round(r.correct / r.n * 100) + "%" : "-"]);
      if (th !== null) { anyTh = true; const pass = r.score >= th; if (!pass) allPass = false; status = el("span", { class: "badge " + (pass ? "badge-ok" : "badge-bad") }, [pass ? "Lulus" : "Belum"]); }
      body.appendChild(el("tr", null, [el("td", null, [k === "BONUS" ? "Bonus keimigrasian" : TESTS[k].label]), el("td", { class: "num" }, [String(r.n)]), el("td", { class: "num" }, [String(r.correct)]), el("td", { class: "num" }, [String(r.score)]), el("td", { class: "num" }, [String(r.max)]), el("td", null, [th === null ? "-" : String(th)]), el("td", null, [status])]));
    });
    const official = rows.filter(k => k !== "BONUS");
    const tot = official.reduce((a, k) => ({ n: a.n + perTest[k].n, c: a.c + perTest[k].correct, s: a.s + perTest[k].score, m: a.m + perTest[k].max }), { n: 0, c: 0, s: 0, m: 0 });
    body.appendChild(el("tr", { class: "total" }, [el("td", null, ["Total resmi"]), el("td", { class: "num" }, [String(tot.n)]), el("td", { class: "num" }, [String(tot.c)]), el("td", { class: "num" }, [String(tot.s)]), el("td", { class: "num" }, [String(tot.m)]), el("td"), el("td", null, [anyTh ? el("span", { class: "badge " + (allPass ? "badge-ok" : "badge-bad") }, [allPass ? "Memenuhi" : "Belum memenuhi"]) : ""])]));
    tb.appendChild(body); return tb;
  }
  function renderExamResult(ex) {
    view.innerHTML = "";
    const r = ex.result;
    const filter = el("select", null, [el("option", { value: "all" }, ["Semua soal"]), el("option", { value: "bad" }, ["Hanya yang salah"]), el("option", { value: "skip" }, ["Hanya yang kosong"]), el("option", { value: "flag" }, ["Hanya ragu-ragu"])]);
    const list = el("div");
    const drawList = () => {
      list.innerHTML = "";
      ex.qs.forEach((q, i) => {
        const ch = ex.answers[q.id]; const status = ch === undefined ? "skip" : ch === q.a ? "ok" : "bad";
        if (filter.value === "bad" && status !== "bad") return; if (filter.value === "skip" && status !== "skip") return; if (filter.value === "flag" && !ex.flags[q.id]) return;
        const item = reviewItem(q, ch === undefined ? null : ch, !!ex.flags[q.id]);
        item.querySelector(".q-head .small").textContent = `No. ${i + 1}`;
        list.appendChild(item);
      });
      if (!list.children.length) list.appendChild(el("div", { class: "empty" }, ["Tidak ada soal untuk filter ini."]));
    };
    filter.addEventListener("change", drawList); drawList();
    const pct = r.total.max ? Math.round(r.total.score / r.total.max * 100) : 0;
    view.append(
      el("div", { class: "card" }, [
        el("div", { class: "card-head" }, [el("h2", null, ["Hasil simulasi"]), r.timeout ? el("span", { class: "badge badge-warn" }, ["Waktu habis"]) : el("span", { class: "badge badge-ok" }, ["Selesai"])]),
        el("div", { class: "grid grid-3", style: "margin-bottom:12px" }, [
          el("div", { class: "stat" }, [el("div", { class: "v" }, [`${r.total.score}`]), el("div", { class: "l" }, [`Skor total dari ${r.total.max}`])]),
          el("div", { class: "stat" }, [el("div", { class: "v" }, [`${r.total.correct}`]), el("div", { class: "l" }, ["Jawaban benar (resmi)"])]),
          el("div", { class: "stat" }, [el("div", { class: "v" }, [pct + "%"]), el("div", { class: "l" }, ["Persentase"])]),
        ]),
        resultTable(r.perTest, r.thresholds),
        el("div", { class: "actions" }, [
          el("button", { class: "btn btn-primary", onclick: () => { exam = null; renderSimulasi(); } }, ["Simulasi baru"]),
          el("button", { class: "btn", onclick: () => { const wrong = ex.qs.filter(q => ex.answers[q.id] !== q.a); if (!wrong.length) return toast("Tidak ada yang salah."); drill = { active: true, qs: shuffle(wrong), i: 0, answers: {}, correct: 0 }; exam = null; go("latihan"); } }, ["Latih soal yang salah"]),
          el("button", { class: "btn btn-ghost", onclick: () => { exam = null; go("home"); } }, ["Beranda"])
        ])
      ]),
      el("div", { class: "card", style: "margin-top:16px" }, [
        el("div", { class: "card-head" }, [el("h2", null, ["Pembahasan"]), filter]), list
      ])
    );
  }

  // ---------- Riwayat ----------
  function renderRiwayat(arg) {
    if (arg && arg.attempt) {
      const h = arg.attempt;
      const ex = { qs: h.qids.map(id => qById[id]).filter(Boolean), answers: h.answers, flags: h.flags || {}, result: { perTest: h.perTest, total: h.total, timeout: h.timeout, thresholds: h.thresholds } };
      renderExamResult(ex);
      view.insertBefore(el("div", { class: "actions", style: "margin:0 0 12px" }, [el("button", { class: "btn btn-sm", onclick: () => go("riwayat") }, ["Kembali ke riwayat"])]), view.firstChild);
      return;
    }
    const hist = state.history.slice().reverse();
    const wrongIds = Object.keys(state.stats).filter(id => qById[id] && state.stats[id].lastWrong && (includeImi() || !qById[id].imi) && (includeImi() || qById[id].topic !== "imigrasi") && inSource(qById[id]));
    const bm = state.bookmarks.map(id => qById[id]).filter(Boolean);
    view.append(
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card" }, [
          el("h2", null, ["Soal yang terakhir dijawab salah"]),
          el("p", { class: "muted small" }, [`${wrongIds.length} soal. Kerjakan ulang sampai benar; daftar ini otomatis berkurang.`]),
          el("div", { class: "actions" }, [el("button", { class: "btn btn-primary", disabled: wrongIds.length ? null : "", onclick: () => { drill = { active: true, qs: shuffle(wrongIds.map(id => qById[id])), i: 0, answers: {}, correct: 0 }; go("latihan"); } }, ["Latih soal yang salah"])])
        ]),
        el("div", { class: "card" }, [
          el("h2", null, ["Soal yang ditandai"]),
          el("p", { class: "muted small" }, [`${bm.length} soal ditandai.`]),
          el("div", { class: "actions" }, [el("button", { class: "btn", disabled: bm.length ? null : "", onclick: () => { drill = { active: true, qs: shuffle(bm), i: 0, answers: {}, correct: 0 }; go("latihan"); } }, ["Latih soal bertanda"])])
        ])
      ]),
      el("div", { class: "card", style: "margin-top:16px" }, [
        el("h2", null, ["Riwayat simulasi"]),
        hist.length ? el("div", { class: "list" }, hist.map(h => el("div", { class: "list-item" }, [
          el("div", null, [el("div", null, [el("strong", null, [`${h.total.score}/${h.total.max}`]), ` - ${h.total.correct} benar`, el("span", { class: "badge badge-muted", style: "margin-left:6px" }, [h.mode === "form" ? "50 soal resmi BKN" : (SOURCES[h.source] || "Kurasi")]), h.timeout ? el("span", { class: "badge badge-warn", style: "margin-left:6px" }, ["waktu habis"]) : null]),
            el("div", { class: "small muted" }, [fmtDate(h.ts) + " - " + Math.round(h.durationSec / 60) + " menit - " + ["TWK", "TKT", "TSI", "TKP"].map(k => h.perTest[k] ? `${k} ${h.perTest[k].score}` : "").filter(Boolean).join(", ")])]),
          el("button", { class: "btn btn-sm", onclick: () => go("riwayat", { attempt: h }) }, ["Lihat pembahasan"])
        ]))) : el("div", { class: "empty" }, ["Belum ada simulasi."])
      ])
    );
  }

  // ---------- Pengaturan ----------
  function renderPengaturan() {
    const imi = el("input", { type: "checkbox" }); imi.checked = includeImi();
    const date = el("input", { type: "date", value: state.settings.examDate || "" });
    const th = {}; ["TWK", "TKT", "TSI", "TKP"].forEach(k => th[k] = el("input", { type: "number", min: 0, max: 250, placeholder: "kosong", value: state.settings.thresholds[k] }));
    const theme = el("select", null, [["auto", "Ikuti sistem"], ["light", "Terang"], ["dark", "Gelap"]].map(([v, l]) => el("option", { value: v }, [l]))); theme.value = state.settings.theme;
    const srcSel = el("select", null, Object.keys(SOURCES).map(v => el("option", { value: v }, [SOURCES[v]]))); srcSel.value = source();
    const saveBtn = el("button", { class: "btn btn-primary", onclick: () => { state.settings.includeImi = imi.checked; state.settings.examDate = date.value; ["TWK", "TKT", "TSI", "TKP"].forEach(k => state.settings.thresholds[k] = th[k].value); state.settings.theme = theme.value; state.settings.source = srcSel.value; save(); applyTheme(); syncSourceSel(); toast("Pengaturan disimpan"); } }, ["Simpan"]);
    const counts = TOPICS.map(t => `${t.label}: ${(BANK[t.id] || []).length}`).join(" | ");
    view.append(el("div", { class: "grid grid-2" }, [
      el("div", { class: "card" }, [
        el("h2", null, ["Pengaturan"]),
        el("label", { class: "check" }, [imi, el("span", null, [el("strong", null, ["Sertakan soal substansi keimigrasian"]), el("div", { class: "small muted" }, ["Materi ini di luar komposisi resmi SE BKN 10/2024 (soal UPKP disusun BKN). Jika diaktifkan, muncul sebagai kategori opsional di Materi dan Latihan, serta bagian bonus terpisah di Simulasi. Beberapa soal umum berkonteks keimigrasian juga hanya tampil saat opsi ini aktif."])])]),
        el("div", { class: "field", style: "margin-top:10px" }, [el("label", null, ["Tanggal ujian (untuk hitung mundur)"]), date]),
        el("h3", null, ["Nilai ambang batas per jenis tes"]),
        el("p", { class: "small muted" }, ["Isi sesuai pengumuman PPK. Skor maksimal: TWK 150, TKT 125, TSI 150, TKP 75."]),
        el("div", { class: "grid grid-3", style: "gap:8px" }, ["TWK", "TKT", "TSI", "TKP"].map(k => el("div", { class: "field", style: "margin:0" }, [el("label", null, [k]), th[k]]))),
        el("div", { class: "field", style: "margin-top:10px" }, [el("label", null, ["Sumber soal"]), srcSel, el("div", { class: "small muted" }, ["Kurasi = bank hasil riset regulasi primer. Kisi-kisi BKN = soal yang disusun dari deck kisi-kisi resmi PPSS BKN (2025) + 50 soal latihan resmi BKN. Kedua bank tidak dicampur agar bisa dibandingkan; statistik per topik mengikuti sumber yang dipilih."])]),
        el("div", { class: "field", style: "margin-top:10px" }, [el("label", null, ["Tema tampilan"]), theme]),
        el("div", { class: "actions" }, [saveBtn])
      ]),
      el("div", { class: "card" }, [
        el("h2", null, ["Data & bank soal"]),
        el("p", { class: "small muted" }, ["Progres tersimpan di browser ini (localStorage). Menghapus data browser akan menghapus progres."]),
        el("p", { class: "small" }, [`Total soal: ${allQuestions().length}.`]),
        el("p", { class: "small muted" }, [counts]),
        el("div", { class: "actions" }, [
          el("button", { class: "btn", onclick: exportData }, ["Ekspor progres (JSON)"]),
          el("button", { class: "btn", onclick: importData }, ["Impor progres"]),
          el("button", { class: "btn btn-danger", onclick: () => confirmBox("Hapus semua progres?", "Statistik, riwayat simulasi, dan tanda soal akan dihapus. Pengaturan tetap.", "Hapus", () => { state.stats = {}; state.history = []; state.bookmarks = []; save(); toast("Progres dihapus"); }, true) }, ["Reset progres"])
        ]),
        el("h3", { style: "margin-top:16px" }, ["Sumber materi"]),
        el("ul", { class: "small muted", style: "padding-left:18px;margin:4px 0" }, [
          "SE Kepala BKN No. 10 Tahun 2024 (struktur & penilaian ujian)",
          "Permenimipas No. 1 Tahun 2024 (OTK Kementerian), No. 2 Tahun 2024 (OTK Kanwil Ditjen Imigrasi), No. 11 Tahun 2025 (Renstra 2025-2029)",
          "UU No. 20 Tahun 2023 (ASN), PP No. 94 Tahun 2021 (Disiplin PNS), Peraturan BKN No. 4 Tahun 2023",
          "UU No. 25 Tahun 2009, UU No. 30 Tahun 2014, UU No. 28 Tahun 1999, UU No. 6 Tahun 2011 jo. UU No. 63 Tahun 2024",
          "UUD NRI 1945, UU No. 12 Tahun 2011, EYD Edisi V (2022)"
        ].map(s => el("li", null, [s])))
      ])
    ]));
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "upkp-progres-" + new Date().toISOString().slice(0, 10) + ".json" }); document.body.appendChild(a); a.click(); a.remove();
  }
  function importData() {
    const inp = el("input", { type: "file", accept: "application/json" });
    inp.addEventListener("change", () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const s = JSON.parse(r.result); if (!s.stats || !s.history) throw 0; state = Object.assign(defaultState(), s); save(); applyTheme(); toast("Progres diimpor"); go("home"); } catch (e) { toast("Berkas tidak valid"); } }; r.readAsText(f); });
    inp.click();
  }

  // ---------- PWA: tombol pasang di layar utama ----------
  let installEvt = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; const b = $("#installBtn"); if (b) b.hidden = false; });
  window.addEventListener("appinstalled", () => { installEvt = null; const b = $("#installBtn"); if (b) b.hidden = true; toast("Aplikasi terpasang"); });
  $("#installBtn").addEventListener("click", async () => { if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; $("#installBtn").hidden = true; });

  // ---------- Init ----------
  applyTheme();
  if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
  window.addEventListener("beforeunload", e => { if (exam && exam.active && !exam.finished) { e.preventDefault(); e.returnValue = ""; } });
  document.addEventListener("keydown", e => {
    if (!exam || !exam.active || exam.finished) return;
    if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
    const idx = LETTERS.indexOf(e.key.toUpperCase());
    if (idx >= 0 && idx < exam.qs[exam.i].o.length) { exam.answers[exam.qs[exam.i].id] = idx; renderExamQuestion(); }
    else if (e.key === "ArrowRight" && exam.i < exam.qs.length - 1) { exam.i++; renderExamQuestion(); }
    else if (e.key === "ArrowLeft" && exam.i > 0) { exam.i--; renderExamQuestion(); }
  });
  go("home");
})();
