// ===========================
//  LOGICA FINAL
//  ATUALIZAR CONFORME MINHA NECESSIDADE
// ===========================

// ---------- Estado global ----------
const App = {
  mode: "PROVA",          // PROVA | TREINO
  type: "FULL",           // FULL(80) | ESP(40) | ERRADAS
  role: "DES",            // DES | ARQ
  totalQuestions: 0,

  questionsBank: [],      // vindo do questions.json
  exam: [],               // questões sorteadas
  answers: new Map(),     // qid -> optionIndex
  marked: new Set(),      // qid marcadas
  currentIndex: 0,

  timer: {
    running: false,
    startAt: null,
    elapsedMs: 0,
    intervalId: null
  },

  role: "DESENHISTA",          // ou "ARQUITETO" (valor padrão)
  baseHistoryKey: "simulado_history_v1",
  baseWrongKey: "simulado_wrong_ids_v1",
  baseSeenKey: "simulado_seen_ids_v1",
};

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);

function showView(name) {
  ["config", "exam", "result"].forEach(v => $(`view-${v}`).classList.add("hidden"));
  $(`view-${name}`).classList.remove("hidden");
}

function fmtTime(ms) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function setTopPills() {
  $("modePill").textContent = `Modo: ${App.mode}`;
  $("countPill").textContent = `${App.totalQuestions || "—"} questões`;
}

// ---------- Storage ----------
function isGeneralArea(area) {
  return area !== "ESP";
}

function computeScore() {
  const letters = ["A", "B", "C", "D", "E"];

  const byArea = {};       // area -> { correct, total }
  const byTopicEsp = {};   // topic -> { correct, total }
  const wrongDetails = []; // lista de erradas (pra relatório)
  const wrongIds = [];     // ids erradas (pra salvar)

  let total = 0;
  let correct = 0;

  let modIGeneralTotal = 0;
  let modIGeneralCorrect = 0;
  let modIIEspTotal = 0;
  let modIIEspCorrect = 0;

  for (const q of App.exam) {
    total++;

    // área
    if (!byArea[q.area]) byArea[q.area] = { correct: 0, total: 0 };
    byArea[q.area].total++;

    // módulo
    if (isGeneralArea(q.area)) modIGeneralTotal++;
    else modIIEspTotal++;

    const userAns = App.answers.has(q.id) ? App.answers.get(q.id) : null;
    const isCorrect = (userAns !== null && userAns === q.answer);

    if (isCorrect) {
      correct++;
      byArea[q.area].correct++;
      if (isGeneralArea(q.area)) modIGeneralCorrect++;
      else modIIEspCorrect++;
    } else {
      wrongIds.push(q.id);

      wrongDetails.push({
        id: q.id,
        area: q.area,
        topic: q.topic || "—",
        difficulty: q.difficulty ?? null,
        statement: q.statement,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation || "",
        userAnswer: userAns,
        userLetter: userAns === null ? "—" : letters[userAns],
        correctLetter: letters[q.answer]
      });
    }

    // tópico do específico
    if (q.area === "ESP") {
      const t = q.topic || "—";
      if (!byTopicEsp[t]) byTopicEsp[t] = { correct: 0, total: 0 };
      byTopicEsp[t].total++;
      if (isCorrect) byTopicEsp[t].correct++;
    }
  }

  // ---- mínimos proporcionais (se banco ainda é pequeno) ----
  // Base do edital: 12/40, 16/40, 32/80
  // Se o simulado tiver menos questões, ajusta proporcionalmente.
  const reqGeneral = Math.ceil(modIGeneralTotal * 0.30); // 30% do Módulo I
  const reqEsp = Math.ceil(modIIEspTotal * 0.40);        // 40% do Módulo II
  const reqTotal = Math.ceil(total * 0.40);              // 40% do total

  const passedGeneral = modIGeneralCorrect >= reqGeneral;
  const passedEsp = modIIEspCorrect >= reqEsp;
  const passedTotal = correct >= reqTotal;
  const passedAll = passedGeneral && passedEsp && passedTotal;

  return {
    total,
    correct,
    percent: total ? Math.round((correct / total) * 100) : 0,

    byArea,
    byTopicEsp,

    module: {
      general: { correct: modIGeneralCorrect, total: modIGeneralTotal, required: reqGeneral, passed: passedGeneral },
      esp: { correct: modIIEspCorrect, total: modIIEspTotal, required: reqEsp, passed: passedEsp },
      total: { correct, total, required: reqTotal, passed: passedTotal },
      passedAll
    },

    wrongDetails,
    wrongIds
  };
}

function mergeUnique(existingArr, newArr) {
  const set = new Set(Array.isArray(existingArr) ? existingArr : []);
  for (const x of newArr) set.add(x);
  return Array.from(set);
}

function saveResults(scoreObj) {
  // erradas acumuladas
  const existingWrong = readJSON(App.wrongKey, []);
  const mergedWrong = mergeUnique(existingWrong, scoreObj.wrongIds);
  writeJSON(App.wrongKey, mergedWrong);

  // limpar do caderno de erradas aquelas que você acertou neste simulado
  const wrongSet = getWrongIdsSet();

  const correctIdsThisExam = App.exam
    .filter(q => App.answers.has(q.id) && App.answers.get(q.id) === q.answer)
    .map(q => q.id);

  correctIdsThisExam.forEach(id => wrongSet.delete(id));
  setWrongIdsSet(wrongSet);

  // vistas acumuladas
  const existingSeen = readJSON(App.seenKey, []);
  const mergedSeen = mergeUnique(existingSeen, App.exam.map(q => q.id));
  writeJSON(App.seenKey, mergedSeen);

  // histórico
  const history = readJSON(App.historyKey, []);

  const entry = {
    date: new Date().toISOString(),
    total: scoreObj.total,
    correct: scoreObj.correct,
    percent: scoreObj.percent,
    timeMs: App.timer.elapsedMs,

    module: scoreObj.module,
    byArea: scoreObj.byArea,
    byTopicEsp: scoreObj.byTopicEsp
  };

  history.unshift(entry);
  writeJSON(App.historyKey, history);
}

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function clearStorage() {
  localStorage.removeItem(App.historyKey);
  localStorage.removeItem(App.wrongKey);
  localStorage.removeItem(App.seenKey);
}

function getWrongIdsSet() {
  const wrong = readJSON(App.wrongKey, []);
  return new Set(Array.isArray(wrong) ? wrong : []);
}

function setWrongIdsSet(set) {
  writeJSON(App.wrongKey, Array.from(set));
}

function removeFromWrongIds(idsToRemove) {
  const set = getWrongIdsSet();
  idsToRemove.forEach(id => set.delete(id));
  setWrongIdsSet(set);
}

// ---------- Timer ----------
function timerStart() {
  const MAX_TIME_MS = 4 * 60 * 60 * 1000;   // 4 horas
  const WARN_REMAIN_MS = 15 * 60 * 1000;   // aviso faltando 15 minutos

  App.timer.running = true;
  App.timer.startAt = Date.now();
  App.timer.intervalId = setInterval(() => {
    const now = Date.now();
    const ms = App.timer.elapsedMs + (now - App.timer.startAt);
    $("timer").textContent = `⏱️ ${fmtTime(ms)}`;

    const remaining = MAX_TIME_MS - ms;

    // aviso quando faltar 15 minutos
    if (remaining <= WARN_REMAIN_MS && remaining > 0 && !App.timer.warned) {
      App.timer.warned = true;
      alert("⚠️ Atenção: faltam 15 minutos para o fim da prova. Revise suas respostas!");
    }

    // (opcional) quando estourar o tempo máximo
    if (remaining <= 0) {
      alert("⏰ Tempo esgotado! A prova será finalizada.");
      clearInterval(App.timer.intervalId);
      timerStop();
      showView("result");
      renderResult();
    }

  }, 250);
}

function timerStop() {
  if (!App.timer.running) return;
  const now = Date.now();
  App.timer.elapsedMs += (now - App.timer.startAt);
  App.timer.running = false;
  clearInterval(App.timer.intervalId);
  App.timer.intervalId = null;
}
function timerReset() {
  timerStop();
  App.timer.elapsedMs = 0;
  $("timer").textContent = `?? 00:00:00`;
}

// ---------- Placeholder: carregar banco ----------
async function loadQuestionsBank() {
async function loadOne(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar ${path} (${res.status})`);
  const data = await res.json();
  const arr = Array.isArray(data.questions) ? data.questions : [];

  arr.forEach((q, i) => { q._ord = i; });

  return arr;
}
  
  const espPath = (App.role === "ARQ") ? "data/esp_arquiteto.json" : "data/esp_desenhista.json";
  const esp  = await loadOne(espPath);
  const hgr  = await loadOne("data/hgr.json");
  const info = await loadOne("data/info.json");
  const leg  = await loadOne("data/leg.json");
  const port = await loadOne("data/port.json");
  const rlm  = await loadOne("data/rlm.json");

  // junta tudo
  App.questionsBank = [...esp, ...hgr, ...info, ...leg, ...port, ...rlm];

  // validação mínima
  if (App.questionsBank.length === 0) {
    throw new Error("Banco vazio: nenhum arquivo JSON tem questões.");
  }

  const problems = validateBank(App.questionsBank);
  if (problems.length) {
    console.error("Erros no banco:", problems);
    alert("Foram encontrados erros no banco de questões:\n\n" + problems.join("\n"));
    throw new Error("Banco inválido");
  }

}

function validateQuestion(q, idx) {
  const errors = [];

  if (!q.id) errors.push("sem id");
  if (!["ESP","PORT","RLM","INFO","LEG","HGR"].includes(q.area)) errors.push("area inválida");
  if (!q.statement) errors.push("sem statement");
  if (!Array.isArray(q.options) || q.options.length !== 5) errors.push("options deve ter 5 itens");
  if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 4) errors.push("answer fora de 0–4");

  return errors.length ? `Questão ${idx}: ${errors.join(", ")}` : null;
}

function validateBank(questions) {
  const msgs = [];
  const ids = new Set();

  questions.forEach((q, i) => {
    if (ids.has(q.id)) msgs.push(`ID repetido: ${q.id}`);
    else ids.add(q.id);

    const err = validateQuestion(q, i);
    if (err) msgs.push(err);
  });

  return msgs;
}

// ---------- Placeholder: gerar simulado ----------
function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.v);
}

function pickN(pool, n, excludeIds = new Set()) {
  const filtered = pool.filter(q => !excludeIds.has(q.id));
  const picked = shuffle(filtered).slice(0, n);
  picked.forEach(q => excludeIds.add(q.id));
  return picked;
}

function getWrongIdsAllTime() {
  const wrong = readJSON(App.wrongKey, []);
  return new Set(Array.isArray(wrong) ? wrong : []);
}

function groupToBlocks(list) {
  const blocks = [];
  const seenGroups = new Set();

  for (const q of list) {
    if (!q.groupId) {
      blocks.push([q]);
      continue;
    }
    if (seenGroups.has(q.groupId)) continue;

    const group = list
      .filter(x => x.groupId === q.groupId)
      .slice()
      .sort((a,b) => (a._ord ?? 0) - (b._ord ?? 0));

    blocks.push(group);
    seenGroups.add(q.groupId);
  }

  return blocks;
}

function wrapSingles(list) {
  return list.map(q => [q]);
}

function generateExam() {
  const bank = Array.isArray(App.questionsBank) ? App.questionsBank : [];

  const byArea = (area) => bank.filter(q => q.area === area);

  const pick = (area, n) => {
    const pool = shuffle(byArea(area));

    const selected = [];
    const usedGroups = new Set();

    for (const q of pool) {
      if (selected.length >= n) break;

      // sem grupo: entra normal
      if (!q.groupId) {
        selected.push(q);
        continue;
      }

      // com grupo: só entra se ainda não entrou e se couber inteiro
      if (usedGroups.has(q.groupId)) continue;

      const groupQs = byArea(area).filter(x => x.groupId === q.groupId);

      // Ordena pra manter a "base" antes (PORT-106 antes do PORT-107)
      groupQs.sort((a, b) => (a._ord ?? 0) - (b._ord ?? 0));

      if (selected.length + groupQs.length <= n) {
        selected.push(...groupQs);
        usedGroups.add(q.groupId);
      }
    }

    if (selected.length < n) {
      // Aqui evita “silêncio”: se faltou, é porque muitos grupos não couberam ou banco pequeno
      throw new Error(`Insuficiente em ${area}: conseguiu ${selected.length}, precisa ${n}`);
    }

    return selected;
  };


  // 1) Modo "só erradas"
  if (App.type === "ERRADAS") {
    const wrongIds = getWrongIdsSet();
    const wrongQs = bank.filter(q => wrongIds.has(q.id));

    if (wrongQs.length === 0) {
      App.exam = [];
    } else {
      const target = Math.min(80, wrongQs.length);
      App.exam = shuffle(wrongQs).slice(0, target);
    }

    App.totalQuestions = App.exam.length;
    App.answers.clear();
    App.marked.clear();
    App.currentIndex = 0;
    setTopPills();
    return; // IMPORTANTE: não continua
  }

  // 2) Modo específico (40 de ESP)
  if (App.type === "ESP") {
    App.exam = pick("ESP", 40);
  }

  // 3) Prova completa (80)
  else if (App.type === "FULL") {
    const portSel = pick("PORT", 12);
    const rlmSel  = pick("RLM", 6);
    const infoSel = pick("INFO", 6);
    const legSel  = pick("LEG", 8);
    const hgrSel  = pick("HGR", 8);
    const espSel  = pick("ESP", 40);

    const blocks = [
      ...groupToBlocks(portSel),   
      ...wrapSingles(rlmSel),
      ...wrapSingles(infoSel),
      ...wrapSingles(legSel),
      ...wrapSingles(hgrSel),
      ...wrapSingles(espSel),
    ];

    App.exam = shuffle(blocks).flat(); 
  }

  // 4) Fallback (caso App.type venha errado)
  else {
    const target = Math.min(40, bank.length);
    App.exam = shuffle([...bank]).slice(0, target);
  }

  App.totalQuestions = App.exam.length;
  App.answers.clear();
  App.marked.clear();
  App.currentIndex = 0;
  setTopPills();
}

// ---------- UI: renderizar questão ----------
function renderQuestion() {
  const q = App.exam[App.currentIndex];
  if (!q) return;

  $("examMeta").textContent = `Questão ${App.currentIndex + 1}/${App.totalQuestions}`;
  $("qTag").textContent = q.area || "—";
  $("qTopic").textContent = q.topic || "—";
  $("qDiff").textContent = `Nível ${q.difficulty ?? "—"}`;
  $("qStatement").textContent = q.statement || "";

  // imagem
  if (q.image) {
    $("qImage").src = `assets/${q.image}`.replace("assets/assets/", "assets/");
    $("qImageWrap").classList.remove("hidden");
  } else {
    $("qImageWrap").classList.add("hidden");
  }

  // marcar
  $("chkMark").checked = App.marked.has(q.id);

  // opções
  const wrap = $("qOptions");
  wrap.innerHTML = "";
  const letters = ["A", "B", "C", "D", "E"];
  q.options.forEach((opt, idx) => {
    const row = document.createElement("label");
    row.className = "opt";
    row.innerHTML = `
      <input type="radio" name="opt" value="${idx}" ${App.answers.get(q.id) === idx ? "checked" : ""} />
      <span class="letter">${letters[idx]})</span>
      <span>${opt}</span>
    `;
    row.addEventListener("change", () => {
      App.answers.set(q.id, idx);
      updateMap();

      // feedback imediato no modo treino (placeholder)
      if (App.mode === "TREINO") {
        const fb = $("instantFeedback");
        fb.classList.remove("hidden");
        const correct = idx === q.answer;
        fb.classList.toggle("good", correct);
        fb.classList.toggle("bad", !correct);
        fb.innerHTML = `
          <strong>${correct ? "Certa ?" : "Errada ?"}</strong>
          <div class="muted small" style="margin-top:6px;">Gabarito: ${letters[q.answer]}</div>
          <div class="exp">${q.explanation || ""}</div>
        `;
      }
    });
    wrap.appendChild(row);
  });

  // feedback (reset)
  if (App.mode === "PROVA") $("instantFeedback").classList.add("hidden");
}

// ---------- Mapa ----------
function buildMap() {
  const map = $("examMap");
  map.innerHTML = "";
  for (let i = 0; i < App.totalQuestions; i++) {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.title = `Ir para ${i + 1}`;
    dot.addEventListener("click", () => {
      App.currentIndex = i;
      renderQuestion();
      updateMap();
    });
    map.appendChild(dot);
  }
  updateMap();
}
function updateMap() {
  const dots = Array.from($("examMap").children);
  dots.forEach((dot, i) => {
    const q = App.exam[i];
    if (!q) return;
    dot.classList.toggle("answered", App.answers.has(q.id));
    dot.classList.toggle("marked", App.marked.has(q.id));
  });
}

// ---------- Resultado (placeholder) ----------
function pct(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0;
}

function topNFromObject(obj, n, sortAsc = true) {
  const arr = Object.entries(obj || {}).map(([k, v]) => {
    const p = v.total ? (v.correct / v.total) : 0;
    return { key: k, correct: v.correct, total: v.total, percent: Math.round(p * 100) };
  });
  arr.sort((a, b) => sortAsc ? (a.percent - b.percent) : (b.percent - a.percent));
  return arr.slice(0, n);
}

function renderModulesSummary(score) {
  const wrap = document.createElement("div");
  wrap.className = "kpis";

  const m1 = score.module.general;
  const m2 = score.module.esp;
  const mt = score.module.total;

  const k1 = document.createElement("div");
  k1.className = "kpi";
  k1.innerHTML = `<div class="t">Módulo I (Gerais)</div>
                  <div class="v">${m1.correct}/${m1.total} (${pct(m1.correct,m1.total)}%)</div>
                  <div class="muted small">Mínimo: ${m1.required} (30%)</div>`;

  const k2 = document.createElement("div");
  k2.className = "kpi";
  k2.innerHTML = `<div class="t">Módulo II (Específico)</div>
                  <div class="v">${m2.correct}/${m2.total} (${pct(m2.correct,m2.total)}%)</div>
                  <div class="muted small">Mínimo: ${m2.required} (40%)</div>`;

  const k3 = document.createElement("div");
  k3.className = "kpi";
  k3.innerHTML = `<div class="t">Total</div>
                  <div class="v">${mt.correct}/${mt.total} (${pct(mt.correct,mt.total)}%)</div>
                  <div class="muted small">Mínimo: ${mt.required} (40%)</div>`;

  wrap.appendChild(k1);
  wrap.appendChild(k2);
  wrap.appendChild(k3);
  return wrap;
}

function renderWrongOptionsBlock(w) {
  const letters = ["A","B","C","D","E"];
  const box = document.createElement("div");
  box.className = "optlist";

  w.options.forEach((text, idx) => {
    const line = document.createElement("div");
    line.className = "optline";
    const isUser = (w.userAnswer === idx);
    const isCorrect = (w.answer === idx);

    if (isUser) line.classList.add("user");
    if (isCorrect) line.classList.add("correct");

    let badges = "";
    if (isUser) badges += `<span class="badge user">sua</span>`;
    if (isCorrect) badges += `<span class="badge correct">correta</span>`;

    line.innerHTML = `<strong>${letters[idx]})</strong> ${text} ${badges}`;
    box.appendChild(line);
  });

  return box;
}

function aggregateHistory() {
  const hist = readJSON(App.historyKey, []);
  const aggArea = {};
  const aggTopic = {};

  hist.forEach(h => {
    // por matéria
    for (const area in h.byArea) {
      if (!aggArea[area]) aggArea[area] = { correct: 0, total: 0 };
      aggArea[area].correct += h.byArea[area].correct;
      aggArea[area].total += h.byArea[area].total;
    }

    // por tópico do específico
    for (const topic in (h.byTopicEsp || {})) {
      if (!aggTopic[topic]) aggTopic[topic] = { correct: 0, total: 0 };
      aggTopic[topic].correct += h.byTopicEsp[topic].correct;
      aggTopic[topic].total += h.byTopicEsp[topic].total;
    }
  });

  return { aggArea, aggTopic };
}

function worstAndBestFromAgg(obj) {
  const arr = Object.entries(obj).map(([k, v]) => {
    const p = v.total ? Math.round((v.correct / v.total) * 100) : 0;
    return { key: k, percent: p, correct: v.correct, total: v.total };
  });

  arr.sort((a, b) => a.percent - b.percent);

  return {
    worst: arr[0] || null,
    best: arr[arr.length - 1] || null
  };
}

function renderResult() {
  // remove bloco histórico antigo se existir
  const oldHistBlock = document.querySelector("#view-result .card.hist-agg");
  if (oldHistBlock) oldHistBlock.remove();

  const score = computeScore();
  saveResults(score);

  // topo
  $("scoreLine").textContent = `Acertos: ${score.correct} / ${score.total} (${score.percent}%)`;
  $("timeLine").textContent = `Tempo: ${fmtTime(App.timer.elapsedMs)}`;

  const m1 = score.module.general;
  const m2 = score.module.esp;
  const mt = score.module.total;

  const statusOk = score.module.passedAll;
  $("statusLine").textContent = statusOk ? "Status: OK ✅" : "Status: ELIMINADO ❌";
  $("statusLine").className = "pill";
  $("statusLine").classList.add(statusOk ? "good" : "bad");

  // inserir resumo por módulos logo abaixo do topo (no mesmo card do resultado)
  // (a forma mais simples: anexar no card do status)
  const statusCard = $("statusLine").closest(".card");
  // remove resumo anterior (se existir)
  const old = statusCard.querySelector(".kpis");
  if (old) old.remove();
  statusCard.appendChild(renderModulesSummary(score));

  // "piores/melhores" (por matéria e por tópico)
  const worstAreas = topNFromObject(score.byArea, 3, true);
  const bestAreas = topNFromObject(score.byArea, 3, false);
  const worstTopics = topNFromObject(score.byTopicEsp, 3, true);

  // mostrar como pills (no mesmo card)
  const oldPills = statusCard.querySelector(".pills-row");
  if (oldPills) oldPills.remove();

  const pills = document.createElement("div");
  pills.className = "pills-row";
  pills.innerHTML = `
    <span class="pill">Piores matérias: ${worstAreas.map(x => `${x.key} ${x.percent}%`).join(" • ") || "—"}</span>
    <span class="pill">Melhores matérias: ${bestAreas.map(x => `${x.key} ${x.percent}%`).join(" • ") || "—"}</span>
    <span class="pill">Piores tópicos (ESP): ${worstTopics.map(x => `${x.key} ${x.percent}%`).join(" • ") || "—"}</span>
  `;
  statusCard.appendChild(pills);

  // por matéria (ordem fixa e mostrando mesmo se não apareceu)
  const areaOrder = ["ESP", "PORT", "RLM", "INFO", "LEG", "HGR"];
  const byAreaWrap = $("byArea");
  byAreaWrap.innerHTML = "";

  areaOrder.forEach(area => {
    const row = score.byArea[area] || { correct: 0, total: 0 };
    const p = pct(row.correct, row.total);
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `<strong>${area}</strong><span>${row.correct}/${row.total} (${p}%)</span>`;
    byAreaWrap.appendChild(div);
  });

  // por tópico (ESP) — pior->melhor
  const byTopicWrap = $("byTopic");
  byTopicWrap.innerHTML = "";
  const topics = Object.entries(score.byTopicEsp)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total));

  if (topics.length === 0) {
    byTopicWrap.innerHTML = `<div class="muted">Sem questões de específico neste simulado.</div>`;
  } else {
    topics.forEach(([topic, row]) => {
      const p = pct(row.correct, row.total);
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `<strong>${topic}</strong><span>${row.correct}/${row.total} (${p}%)</span>`;
      byTopicWrap.appendChild(div);
    });
  }

  // lista das erradas — agora com alternativas destacadas
  const wrongWrap = $("wrongList");
  wrongWrap.innerHTML = "";
  if (score.wrongDetails.length === 0) {
    wrongWrap.innerHTML = `<div class="muted">Nenhuma errada. Brabo ✅</div>`;
  } else {
    score.wrongDetails.forEach(w => {
      const div = document.createElement("div");
      div.className = "wrong";
      div.innerHTML = `
        <div class="meta">
          <span class="tag">${w.area}</span>
          <span class="tag secondary">${w.topic}</span>
          <span class="tag tertiary">Nível ${w.difficulty ?? "—"}</span>
        </div>
        <div><strong>${w.statement}</strong></div>
        <div class="muted small" style="margin-top:8px;">
          Sua resposta: <strong>${w.userLetter}</strong> • Correta: <strong>${w.correctLetter}</strong>
        </div>
        <div class="exp">${w.explanation}</div>
      `;
      div.appendChild(renderWrongOptionsBlock(w));
      wrongWrap.appendChild(div);
    });
  }

  // histórico (últimos 10)
  const historyWrap = $("history");
  historyWrap.innerHTML = "";
  const hist = readJSON(App.historyKey, []);
  if (!hist.length) {
    historyWrap.innerHTML = `<div class="muted">Sem histórico ainda.</div>`;
  } else {
    hist.slice(0, 10).forEach(h => {
      const dt = new Date(h.date);
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `<strong>${dt.toLocaleString()}</strong><span>${h.correct}/${h.total} (${h.percent}%)</span>`;
      historyWrap.appendChild(div);
    });
  }
  // ===== Histórico acumulado =====
  const histAgg = aggregateHistory();
  const wbArea = worstAndBestFromAgg(histAgg.aggArea);
  const wbTopic = worstAndBestFromAgg(histAgg.aggTopic);

  const histBlock = document.createElement("div");
  histBlock.className = "card hist-agg";
  histBlock.innerHTML = `
    <h2>Desempenho acumulado</h2>
    <div class="kpis">
      <div class="kpi">
        <div class="t">Pior matéria (histórico)</div>
        <div class="v">${wbArea.worst ? wbArea.worst.key + " – " + wbArea.worst.percent + "%" : "—"}</div>
      </div>
      <div class="kpi">
        <div class="t">Melhor matéria (histórico)</div>
        <div class="v">${wbArea.best ? wbArea.best.key + " – " + wbArea.best.percent + "%" : "—"}</div>
      </div>
      <div class="kpi">
        <div class="t">Pior tópico ESP (histórico)</div>
        <div class="v">${wbTopic.worst ? wbTopic.worst.key + " – " + wbTopic.worst.percent + "%" : "—"}</div>
      </div>
    </div>
  `;

  $("view-result").appendChild(histBlock);

  App._lastScore = score;
}

function setRoleStorageKeys(role) {
  const r = String(role || "DESENHISTA").toUpperCase();
  App.historyKey = `${App.baseHistoryKey}__${r}`;
  App.wrongKey   = `${App.baseWrongKey}__${r}`;
  App.seenKey    = `${App.baseSeenKey}__${r}`;
}

// ---------- Eventos ----------
function readConfig() {
  App.mode = document.querySelector('input[name="mode"]:checked')?.value || "PROVA";
  App.type = document.querySelector('input[name="type"]:checked')?.value || "FULL";
  App.role = document.querySelector('input[name="role"]:checked')?.value || "DES";
  setTopPills();
}

$("btnStart").addEventListener("click", async () => {
  try {
    readConfig();
    await loadQuestionsBank();
    generateExam();

    if (App.exam.length === 0) {
      alert("Não há questões suficientes no banco para gerar este tipo de simulado.\nAdicione mais questões ou escolha outro modo.");
      return;
    }

    showView("exam");
    timerReset();
    timerStart();
    buildMap();
    renderQuestion();
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
});

$("btnResetStorage").addEventListener("click", () => {
  clearStorage();
  alert("Histórico local apagado.");
});

$("btnPrev").addEventListener("click", () => {
  if (App.currentIndex > 0) {
    App.currentIndex--;
    renderQuestion();
    updateMap();
  }
});
$("btnNext").addEventListener("click", () => {
  if (App.currentIndex < App.totalQuestions - 1) {
    App.currentIndex++;
    renderQuestion();
    updateMap();
  }
});

$("chkMark").addEventListener("change", (e) => {
  const q = App.exam[App.currentIndex];
  if (!q) return;
  if (e.target.checked) App.marked.add(q.id);
  else App.marked.delete(q.id);
  updateMap();
});

$("btnFinish").addEventListener("click", () => {
  // trava: não deixar finalizar sem responder tudo
  if (App.answers.size < App.totalQuestions) {
    const faltam = App.totalQuestions - App.answers.size;
    const ok = confirm(`Ainda faltam ${faltam} questões sem resposta. Deseja finalizar mesmo assim?`);
    if (!ok) return;
  }

  timerStop();
  showView("result");
  renderResult();
});

$("btnNew").addEventListener("click", () => {
  timerReset();
  showView("config");
});

$("btnRetryWrong").addEventListener("click", async () => {
  try {
    App.mode = "PROVA"; // refazer erradas normalmente é melhor em PROVA; se quiser, trocamos
    App.type = "ERRADAS";
    setTopPills();

    await loadQuestionsBank();
    generateExam();

    if (App.exam.length === 0) {
      alert("Você não tem questões erradas salvas (ou já limpou tudo acertando).");
      showView("config");
      const opt = document.querySelector('input[name="type"][value="FULL"]');
      if (opt) opt.checked = true;
      return;
    }

    showView("exam");
    timerReset();
    timerStart();
    buildMap();
    renderQuestion();
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
});

// Inicial
showView("config");
setTopPills();
$("timer").textContent = `?? 00:00:00`;

document.addEventListener("keydown", (e) => {
  if ($("view-exam").classList.contains("hidden")) return;

  if (e.key === "ArrowRight") {
    $("btnNext").click();
  }
  if (e.key === "ArrowLeft") {
    $("btnPrev").click();
  }
});

window.addEventListener("beforeunload", function (e) {
  if (document.getElementById("view-exam").classList.contains("hidden")) return;
  e.preventDefault();
  e.returnValue = "Você está no meio do simulado. Tem certeza que deseja sair?";
});



