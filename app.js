const ASSUNTOS_ENG_SEG = {
  "prevencao_riscos": "Prevenção e Controle de Riscos",
  "gerenciamento_riscos": "Análise e Gerenciamento de Riscos",
  "legislacao_nr": "Legislação e Normas Regulamentadoras",
  "gestao_sms": "Gestão de Segurança, Meio Ambiente e Saúde",
  "emergencias": "Emergências",
  "incendio": "Proteção Contra Incêndio",
  "acidentes": "Acidentes do Trabalho",
  "higiene_ocupacional": "Higiene Ocupacional",
  "saude_ocupacional": "Saúde Ocupacional",
  "ergonomia": "Ergonomia",
  "desenvolvimento_sustentavel": "Desenvolvimento Sustentável"
};

// Configuração de cada concurso: bancos, formatos, avaliação e cronômetro.
const CONCURSOS = {
  ALERO: {
    nome: "ALERO", banca: "FGV",
    cargos: {
      DES: { nome: "Desenhista", banco: "data/esp_desenhista.json", legado: ["DES", "DESENHISTA"] },
      ARQ: { nome: "Arquiteto", banco: "data/esp_arquiteto.json", legado: ["ARQ", "ARQUITETO"] }
    },
    bancosComuns: ["data/hgr.json", "data/info.json", "data/leg.json", "data/port.json", "data/rlm.json"],
    areas: ["ESP", "PORT", "RLM", "INFO", "LEG", "HGR"],
    formatos: {
      FULL: { nome: "Completo (80)", quantidades: { PORT: 12, RLM: 6, INFO: 6, LEG: 8, HGR: 8, ESP: 40 } },
      ESP: { nome: "Específico (40)", quantidades: { ESP: 40 } },
      ERRADAS: { nome: "Só erradas", limite: 80 }
    },
    regras: { general: 0.30, esp: 0.40, total: 0.40 },
    avaliar: evaluateAlero,
    resumo: renderModulesSummary,
    situacao: result => result.passedAll ? "Status: OK ✅" : "Status: ELIMINADO ❌",
    tempo: { limiteMs: 4 * 60 * 60 * 1000, avisoMs: 15 * 60 * 1000 },
    regrasTexto: ["Módulo I (gerais): mínimo 12/40", "Módulo II (específico): mínimo 16/40", "Total: mínimo 32/80"]
  },
  TRANSPETRO: {
    nome: "Transpetro 2026", banca: "Fundação Cesgranrio",
    cargos: {
      ENG_SEG: {
        nome: "Engenharia de Segurança do Trabalho",
        assuntos: ASSUNTOS_ENG_SEG,
        bancos: [
          { path: "data/transpetro/eng_seguranca/portugues.json", area: "PORT" },
          { path: "data/transpetro/eng_seguranca/ingles.json", area: "ING" },
          ...Object.keys(ASSUNTOS_ENG_SEG).map(assunto => ({
            path: `data/transpetro/eng_seguranca/${assunto}.json`, area: "ESP", assunto
          }))
        ]
      }
    },
    bancosComuns: [], areas: ["PORT", "ING", "ESP"],
    nomesAreas: { PORT: "Língua Portuguesa", ING: "Língua Inglesa", ESP: "Conhecimentos Específicos" },
    validarIdentidade: true,
    dificuldades: { media: "Média", alta: "Alta", muito_alta: "Muito alta" },
    formatos: {
      FULL: { nome: "Prova completa (70)", quantidades: { PORT: 10, ING: 10, ESP: 50 } },
      ESP: { nome: "Conhecimentos Específicos (50)", quantidades: { ESP: 50 } },
      ERRADAS: { nome: "Caderno de erradas" }
    },
    regras: { esp: 25, general: 10, minPort: 1, minIng: 1 },
    avaliar: evaluateTranspetro,
    resumo: renderTranspetroSummary,
    situacao: result => `Situação: ${result.status}`,
    tempo: { limiteMs: 270 * 60 * 1000, avisoMs: 15 * 60 * 1000 },
    regrasTexto: [
      "Prova completa: 10 de Português + 10 de Inglês + 50 Específicos; 1 ponto por questão (70 pontos).",
      "Duração: 4h30; aviso nos 15 minutos finais.",
      "Específicos: mínimo de 25/50. Gerais (Português + Inglês): mínimo de 10/20.",
      "Não zerar Português nem Inglês. Todos os critérios devem ser atendidos.",
      "Critérios de aprovação aplicáveis apenas à prova completa; específico e erradas são simulados parciais."
    ]
  }
};

function currentContest() { return CONCURSOS[App.contest]; }
function currentRole() { return currentContest()?.cargos[App.role]; }
function selectionLabel() {
  return `${currentContest().nome} • ${currentRole().nome} • ${currentContest().banca}`;
}
function evaluateAlero(general, esp, total) {
  const rules = CONCURSOS.ALERO.regras;
  const module = {};
  for (const [key, value] of Object.entries({ general, esp, total })) {
    const required = Math.ceil(value.total * rules[key]);
    module[key] = { ...value, required, passed: value.correct >= required };
  }
  module.passedAll = module.general.passed && module.esp.passed && module.total.passed;
  return module;
}

function evaluateTranspetro(general, esp, total, byArea = {}, context = { type: "FULL" }) {
  const rules = CONCURSOS.TRANSPETRO.regras;
  const port = byArea.PORT || { correct: 0, total: 0 };
  const ing = byArea.ING || { correct: 0, total: 0 };
  const basics = { correct: port.correct + ing.correct, total: port.total + ing.total };
  const quantities = CONCURSOS.TRANSPETRO.formatos.FULL.quantidades;
  const applicable = context.type === "FULL" && port.total === quantities.PORT && ing.total === quantities.ING && esp.total === quantities.ESP;
  const criteria = applicable ? [
    { passed: esp.correct >= rules.esp, reason: `Conhecimentos Específicos abaixo do mínimo de ${rules.esp} pontos.` },
    { passed: basics.correct >= rules.general, reason: `Conhecimentos Gerais abaixo do mínimo de ${rules.general} pontos.` },
    { passed: port.correct >= rules.minPort, reason: "Nota zero em Língua Portuguesa." },
    { passed: ing.correct >= rules.minIng, reason: "Nota zero em Língua Inglesa." }
  ] : [];
  const reasons = criteria.filter(c => !c.passed).map(c => c.reason);
  const passedAll = applicable ? reasons.length === 0 : null;
  return {
    port, ing, general: basics, esp, total, criteria, reasons, passedAll, applicable,
    status: applicable ? (passedAll ? "APROVADO" : "REPROVADO") : "NÃO APLICÁVEL (simulado parcial)"
  };
}

function subjectOf(q) { return q.assunto || q.topic || "—"; }
function subjectName(subject) { return currentRole()?.assuntos?.[subject] || subject; }
function areaName(area) { return currentContest().nomesAreas?.[area] || area; }
function bankSources() {
  return currentRole().bancos || [currentRole().banco, ...currentContest().bancosComuns]
    .filter(Boolean).map(path => ({ path }));
}

// ===========================
//  LOGICA FINAL
//  ATUALIZAR CONFORME MINHA NECESSIDADE
// ===========================

// ---------- Estado global ----------
const App = {
  mode: "PROVA",          // PROVA | TREINO
  type: "FULL",           // FULL(80) | ESP(40) | ERRADAS
  contest: null,
  role: null,
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
};

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);

function showView(name) {
  ["contest", "role", "welcome", "config", "exam", "result"].forEach(v => $(`view-${v}`).classList.add("hidden"));
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
  const bySubject = {};
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
        topic: subjectName(subjectOf(q)),
        assunto: q.assunto,
        groupId: q.groupId,
        image: q.image,
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

    const subject = subjectOf(q);
    if (!bySubject[q.area]) bySubject[q.area] = {};
    if (!bySubject[q.area][subject]) bySubject[q.area][subject] = { correct: 0, total: 0 };
    bySubject[q.area][subject].total++;
    if (isCorrect) bySubject[q.area][subject].correct++;

    // tópico do específico
    if (q.area === "ESP") {
      const t = subjectName(subjectOf(q));
      if (!byTopicEsp[t]) byTopicEsp[t] = { correct: 0, total: 0 };
      byTopicEsp[t].total++;
      if (isCorrect) byTopicEsp[t].correct++;
    }
  }

  const module = currentContest().avaliar(
    { correct: modIGeneralCorrect, total: modIGeneralTotal },
    { correct: modIIEspCorrect, total: modIIEspTotal },
    { correct, total },
    byArea,
    { type: App.type }
  );

  return {
    total,
    correct,
    errors: total - correct,
    points: correct,
    bySubject,
    percent: total ? Math.round((correct / total) * 100) : 0,

    byArea,
    byTopicEsp,

    module,

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
    contest: App.contest,
    role: App.role,
    mode: App.mode,
    type: App.type,
    errors: scoreObj.errors,
    points: scoreObj.points,
    status: scoreObj.module.status || (scoreObj.module.passedAll ? "OK" : "ELIMINADO"),
    passed: scoreObj.module.passedAll,
    reasons: scoreObj.module.reasons || [],
    bySubject: scoreObj.bySubject,
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
  localStorage.removeItem(App.cycleKey);
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
  const { limiteMs: MAX_TIME_MS, avisoMs: WARN_REMAIN_MS } = currentContest().tempo;

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
      alert(`⚠️ Atenção: faltam ${WARN_REMAIN_MS / 60000} minutos para o fim da prova. Revise suas respostas!`);
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
  App.timer.warned = false;
  $("timer").textContent = `?? 00:00:00`;
}

// ---------- Carregar bancos configurados ----------
async function loadQuestionsBank() {
  // Nunca conservar banco de uma seleção anterior após erro ou banco vazio.
  App.questionsBank = [];
  const sources = bankSources();
  if (!sources.length) throw new Error("Bancos do concurso ainda não configurados.");
  const banks = await Promise.all(sources.map(async source => {
    const res = await fetch(source.path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao carregar ${source.path} (${res.status})`);
    const data = await res.json();
    const questions = Array.isArray(data) ? data : data?.questions;
    if (!Array.isArray(questions)) throw new Error(`Formato de banco inválido: ${source.path}`);
    for (const q of questions) {
      if (source.area && q.area !== source.area) throw new Error(`Área incompatível em ${source.path}`);
      if (source.assunto && q.assunto !== source.assunto) throw new Error(`Assunto incompatível em ${source.path}`);
    }
    return questions;
  }));
  const bank = banks.flat();
  bank.forEach((q, i) => { q._ord = i; });
  const problems = validateBank(bank);
  if (problems.length) throw new Error("Banco inválido:\n" + problems.join("\n"));
  App.questionsBank = bank; // [] é válido; a suficiência depende do formato.
}

function validateQuestion(q, idx) {
  const errors = [];

  if (!q || typeof q !== "object") return `Questão ${idx}: objeto inválido`;
  if (!q.id || typeof q.id !== "string") errors.push("sem id válido");
  if (!currentContest().areas.includes(q.area)) errors.push("area inválida");
  if (typeof q.statement !== "string" || !q.statement.trim()) errors.push("sem statement");
  if (!Array.isArray(q.options) || q.options.length !== 5 || q.options.some(opt => typeof opt !== "string" || !opt.trim())) errors.push("options deve ter 5 itens");
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 4) errors.push("answer fora de 0–4");

  if (q.concurso && q.concurso !== App.contest) errors.push("concurso incompatível");
  if (q.cargo && q.cargo !== App.role) errors.push("cargo incompatível");
  if (currentContest().validarIdentidade) {
    if (q.concurso !== App.contest) errors.push("concurso obrigatório");
    if (q.cargo !== App.role) errors.push("cargo obrigatório");
    if (typeof q.assunto !== "string" || !q.assunto.trim()) errors.push("assunto obrigatório");
    if (q.area === "ESP" && !Object.hasOwn(currentRole().assuntos, q.assunto)) errors.push("assunto específico inválido");
    if (typeof q.explanation !== "string") errors.push("explanation deve ser texto");
    if (q.difficulty != null && !Object.hasOwn(currentContest().dificuldades, q.difficulty)) errors.push("difficulty inválida");
    if (q.subassunto != null && (typeof q.subassunto !== "string" || !q.subassunto.trim())) errors.push("subassunto inválido");
  }
  if (q.groupId != null && (typeof q.groupId !== "string" || !q.groupId)) errors.push("groupId inválido");

  return errors.length ? `Questão ${idx}: ${errors.join(", ")}` : null;
}

function validateBank(questions) {
  const msgs = [];
  const ids = new Set();

  questions.forEach((q, i) => {
    if (ids.has(q?.id)) msgs.push(`ID repetido: ${q?.id}`);
    else ids.add(q?.id);

    const err = validateQuestion(q, i);
    if (err) msgs.push(err);
  });

  return msgs;
}

// ---------- Sorteio por blocos e ciclo de questões ----------
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
    const key = `${q.area}::${q.groupId}`;
    if (seenGroups.has(key)) continue;

    const group = list
      .filter(x => x.groupId === q.groupId && x.area === q.area)
      .slice()
      .sort((a,b) => (a._ord ?? 0) - (b._ord ?? 0));

    blocks.push(group);
    seenGroups.add(key);
  }

  return blocks;
}

function wrapSingles(list) {
  return list.map(q => [q]);
}

function getCycleIds() {
  // A primeira versão registrava vistas sem controlar ciclos. Usá-las na transição.
  const ids = readJSON(App.cycleKey, readJSON(App.seenKey, []));
  return new Set(Array.isArray(ids) ? ids : []);
}

function insufficientBank(area, available, required, grouped = false) {
  const suffix = grouped ? " Não é possível completar a quantidade sem quebrar grupos vinculados." : "";
  const deficit = `${areaName(area)}: disponíveis: ${available}; necessárias: ${required}.${suffix}`;
  const error = new Error(`Banco de questões de ${currentContest().nome} ainda não possui questões suficientes para este simulado.\n${deficit}`);
  error.deficit = deficit;
  return error;
}

function pickAreaBlocks(pool, required, cycle) {
  if (pool.length < required) throw insufficientBank(pool[0]?.area || "ESP", pool.length, required);
  const blocks = shuffle(groupToBlocks(pool));
  // Programação dinâmica: quantidade exata sem cortar grupos; maximiza inéditas.
  // O embaralhamento existente desempata somente entre blocos inteiros.
  const choices = Array(required + 1).fill(null);
  choices[0] = { fresh: 0, blocks: [] };
  for (const block of blocks) {
    const size = block.length;
    const fresh = block.filter(q => !cycle.has(q.id)).length;
    for (let n = required; n >= size; n--) {
      const prev = choices[n - size];
      if (prev && (!choices[n] || prev.fresh + fresh > choices[n].fresh)) {
        choices[n] = { fresh: prev.fresh + fresh, blocks: [...prev.blocks, block] };
      }
    }
  }
  if (!choices[required]) throw insufficientBank(pool[0]?.area || "ESP", pool.length, required, true);
  return choices[required].blocks;
}

function wrongExamBlocks(bank) {
  const wrong = getWrongIdsSet();
  const candidates = shuffle(groupToBlocks(bank).filter(block => block.some(q => wrong.has(q.id))));
  const limit = currentContest().formatos.ERRADAS.limite ?? bank.length;
  const selected = [];
  let count = 0;
  for (const block of candidates) {
    if (block.length > limit) throw insufficientBank(block[0].area, limit, block.length, true);
    if (count + block.length > limit) continue;
    selected.push(block); count += block.length;
  }
  return selected;
}

function generateExam() {
  const bank = Array.isArray(App.questionsBank) ? App.questionsBank : [];
  // Limpa a tentativa anterior inclusive se este sorteio falhar.
  App.exam = []; App.totalQuestions = 0; App.answers.clear(); App.marked.clear(); App.currentIndex = 0;
  setTopPills();
  let blocks = [];
  const cycle = getCycleIds();
  if (App.type === "ERRADAS") {
    blocks = wrongExamBlocks(bank);
  } else {
    const format = currentContest().formatos[App.type];
    if (!format?.quantidades) throw new Error("Tipo de simulado inválido.");
    const shortages = Object.entries(format.quantidades).filter(([area, n]) => bank.filter(q => q.area === area).length < n);
    if (shortages.length) {
      const errors = shortages.map(([area, n]) => insufficientBank(area, bank.filter(q => q.area === area).length, n));
      throw new Error([errors[0].message, ...errors.slice(1).map(error => error.deficit)].join("\n"));
    }
    for (const [area, n] of Object.entries(format.quantidades)) {
      const pool = bank.filter(q => q.area === area);
      const applicable = groupToBlocks(pool).filter(block => block.length <= n).flat();
      // Renovação só da área esgotada; histórico e vistas acumuladas não são apagados.
      if (applicable.length && applicable.every(q => cycle.has(q.id))) pool.forEach(q => cycle.delete(q.id));
      blocks.push(...pickAreaBlocks(pool, n, cycle));
    }
    blocks = shuffle(blocks);
  }
  const exam = blocks.flat();
  if (!exam.length) return;
  // Confirma o ciclo somente após conseguir gerar a prova inteira.
  // Erradas são uma revisão deliberada e não avançam nem reiniciam o ciclo.
  if (App.type !== "ERRADAS") {
    exam.forEach(q => cycle.add(q.id));
    writeJSON(App.cycleKey, Array.from(cycle));
  } else if (localStorage.getItem(App.cycleKey) === null) {
    writeJSON(App.cycleKey, Array.from(cycle));
  }
  writeJSON(App.seenKey, mergeUnique(readJSON(App.seenKey, []), exam.map(q => q.id)));
  App.exam = exam; App.totalQuestions = exam.length;
  setTopPills();
}

function fillGroupContext(container, q) {
  container.replaceChildren();
  const base = q.groupId ? groupToBlocks(App.questionsBank.filter(x => x.area === q.area && x.groupId === q.groupId))[0]?.[0] : null;
  container.classList.toggle("hidden", !base || base.id === q.id);
  if (!base || base.id === q.id) return;
  const title = document.createElement("strong"); title.textContent = "Contexto da questão-base";
  const text = document.createElement("p"); text.textContent = base.statement;
  container.append(title, text);
  if (base.image) {
    const wrap = document.createElement("div"); wrap.className = "q-image";
    const img = document.createElement("img"); img.src = `assets/${base.image}`.replace("assets/assets/", "assets/");
    img.alt = "Imagem da questão-base"; wrap.appendChild(img); container.appendChild(wrap);
  }
}

// ---------- UI: renderizar questão ----------
function renderQuestion() {
  const q = App.exam[App.currentIndex];
  if (!q) return;

  $("examMeta").textContent = `Questão ${App.currentIndex + 1}/${App.totalQuestions}`;
  $("qTag").textContent = q.area || "—";
  $("qTopic").textContent = subjectName(subjectOf(q));
  fillGroupContext($("qContext"), q);
  $("qDiff").textContent = `Nível ${currentContest().dificuldades?.[q.difficulty] ?? q.difficulty ?? "—"}`;
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
  $("instantFeedback").classList.add("hidden");
  if (App.mode === "TREINO" && App.answers.has(q.id)) {
    wrap.children[App.answers.get(q.id)].dispatchEvent(new Event("change"));
  }
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
                  <div class="muted small">Mínimo: ${m1.required} (${currentContest().regras.general * 100}%)</div>`;

  const k2 = document.createElement("div");
  k2.className = "kpi";
  k2.innerHTML = `<div class="t">Módulo II (Específico)</div>
                  <div class="v">${m2.correct}/${m2.total} (${pct(m2.correct,m2.total)}%)</div>
                  <div class="muted small">Mínimo: ${m2.required} (${currentContest().regras.esp * 100}%)</div>`;

  const k3 = document.createElement("div");
  k3.className = "kpi";
  k3.innerHTML = `<div class="t">Total</div>
                  <div class="v">${mt.correct}/${mt.total} (${pct(mt.correct,mt.total)}%)</div>
                  <div class="muted small">Mínimo: ${mt.required} (${currentContest().regras.total * 100}%)</div>`;

  wrap.appendChild(k1);
  wrap.appendChild(k2);
  wrap.appendChild(k3);
  return wrap;
}

function renderTranspetroSummary(score) {
  const wrap = document.createElement("div"); wrap.className = "kpis";
  for (const [label, value] of [
    ["Língua Portuguesa", score.module.port], ["Língua Inglesa", score.module.ing],
    ["Conhecimentos Gerais (Português + Inglês)", score.module.general],
    ["Conhecimentos Específicos", score.module.esp], ["Pontuação total", score.module.total]
  ]) {
    const kpi = document.createElement("div"); kpi.className = "kpi";
    const title = document.createElement("div"); title.className = "t"; title.textContent = label;
    const number = document.createElement("div"); number.className = "v";
    number.textContent = `${value.correct}/${value.total} (${pct(value.correct, value.total)}%)`;
    kpi.append(title, number); wrap.appendChild(kpi);
  }
  for (const reason of score.module.reasons) {
    const text = document.createElement("p"); text.textContent = reason; wrap.appendChild(text);
  }
  if (!score.module.applicable) {
    const text = document.createElement("p"); text.textContent = "Critérios oficiais de aprovação aplicáveis apenas à prova completa.";
    wrap.appendChild(text);
  }
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
  const aggSubject = {};

  hist.forEach(h => {
    // por matéria
    for (const area in h.byArea) {
      if (!aggArea[area]) aggArea[area] = { correct: 0, total: 0 };
      aggArea[area].correct += h.byArea[area].correct;
      aggArea[area].total += h.byArea[area].total;
    }

    for (const [area, subjects] of Object.entries(h.bySubject || {})) {
      if (!aggSubject[area]) aggSubject[area] = {};
      for (const [subject, counts] of Object.entries(subjects)) {
        if (!aggSubject[area][subject]) aggSubject[area][subject] = { correct: 0, total: 0 };
        aggSubject[area][subject].correct += counts.correct;
        aggSubject[area][subject].total += counts.total;
      }
    }

    // por tópico do específico
    for (const topic in (h.byTopicEsp || {})) {
      if (!aggTopic[topic]) aggTopic[topic] = { correct: 0, total: 0 };
      aggTopic[topic].correct += h.byTopicEsp[topic].correct;
      aggTopic[topic].total += h.byTopicEsp[topic].total;
    }
  });

  return { aggArea, aggTopic, aggSubject };
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
  $("resultMeta").textContent = `${selectionLabel()} • ${new Date().toLocaleString()}`;
  $("scoreLine").textContent = `Acertos: ${score.correct} / ${score.total} (${score.percent}%)`;
  $("errorsLine").textContent = `Erros: ${score.errors} • Pontuação: ${score.points}/${score.total}`;
  $("timeLine").textContent = `Tempo: ${fmtTime(App.timer.elapsedMs)}`;

  const statusOk = score.module.passedAll;
  $("statusLine").textContent = currentContest().situacao(score.module);
  $("statusLine").className = "pill";
  if (statusOk !== null) $("statusLine").classList.add(statusOk ? "good" : "bad");

  // inserir resumo por módulos logo abaixo do topo (no mesmo card do resultado)
  // (a forma mais simples: anexar no card do status)
  const statusCard = $("statusLine").closest(".card");
  // remove resumo anterior (se existir)
  const old = statusCard.querySelector(".kpis");
  if (old) old.remove();
  statusCard.appendChild(currentContest().resumo(score));

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
  const areaOrder = currentContest().areas;
  const byAreaWrap = $("byArea");
  byAreaWrap.innerHTML = "";

  areaOrder.forEach(area => {
    const row = score.byArea[area] || { correct: 0, total: 0 };
    const p = pct(row.correct, row.total);
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `<strong>${areaName(area)}</strong><span>${row.correct}/${row.total} (${p}%)</span>`;
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
          <span class="tag tertiary">Nível ${currentContest().dificuldades?.[w.difficulty] ?? w.difficulty ?? "—"}</span>
        </div>
        <div><strong>${w.statement}</strong></div>
        <div class="muted small" style="margin-top:8px;">
          Sua resposta: <strong>${w.userLetter}</strong> • Correta: <strong>${w.correctLetter}</strong>
        </div>
        <div class="exp">${w.explanation}</div>
      `;
      const context = document.createElement("div"); context.className = "feedback";
      fillGroupContext(context, w); div.prepend(context);
      if (w.image) {
        const imageWrap = document.createElement("div"); imageWrap.className = "q-image";
        const image = document.createElement("img"); image.src = `assets/${w.image}`.replace("assets/assets/", "assets/");
        image.alt = "Imagem da questão"; imageWrap.appendChild(image); div.appendChild(imageWrap);
      }
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
      div.textContent = `${currentContest().nome} • ${currentRole().nome} • ${dt.toLocaleString()} • ${h.correct}/${h.total} (${h.percent}%) • Tempo: ${fmtTime(h.timeMs || 0)}${h.mode ? ` • ${h.mode} • ${h.type} • ${h.status}` : ""}`;
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

function setRoleStorageKeys() {
  const prefix = `simulado_${App.contest}_${App.role}`;
  App.historyKey = `${prefix}_history`;
  App.wrongKey = `${prefix}_wrong`;
  App.seenKey = `${prefix}_seen`;
  App.cycleKey = `${prefix}_cycle`;
  migrateLegacyStorage();
}

function migrateLegacyStorage() {
  // Só migra dados que identificam o cargo. A chave "undefined" permanece intacta.
  if (App.contest !== "ALERO") return;
  for (const [kind, base] of Object.entries({ history: "simulado_history_v1", wrong: "simulado_wrong_ids_v1", seen: "simulado_seen_ids_v1" })) {
    const target = App[`${kind}Key`];
    const marker = `${target}_migrated_v1`;
    if (localStorage.getItem(marker)) continue;
    let data = readJSON(target, []);
    for (const alias of currentRole().legado) {
      const legacy = readJSON(`${base}__${alias}`, []);
      if (!Array.isArray(legacy)) continue;
      if (kind === "history") {
        const entries = [...data, ...legacy].map(h => ({ ...h, contest: "ALERO", role: App.role }));
        data = Array.from(new Map(entries.map(h => [JSON.stringify(h), h])).values())
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      } else data = mergeUnique(data, legacy);
    }
    if (data.length) writeJSON(target, data);
    localStorage.setItem(marker, "1");
  }
}

function renderChoices(container, entries, select) {
  $(container).replaceChildren();
  for (const [id, config] of Object.entries(entries)) {
    const button = document.createElement("button");
    button.className = "card choice";
    button.textContent = config.nome;
    button.addEventListener("click", () => select(id));
    $(container).appendChild(button);
  }
}

function selectContest(contest) {
  App.contest = contest;
  App.role = null;
  $("selectionMeta").textContent = currentContest().nome;
  document.title = `Simulados - ${currentContest().nome}`;
  $("btnChangeContest").classList.remove("hidden");
  renderChoices("roleChoices", currentContest().cargos, selectRole);
  showView("role");
}

function selectRole(role) {
  App.role = role;
  setRoleStorageKeys();
  $("selectionMeta").textContent = selectionLabel();
  document.title = `Simulados - ${selectionLabel()}`;
  const ready = Boolean(bankSources().length && currentContest().avaliar && currentContest().tempo);
  $("examSettings").classList.toggle("hidden", !ready);
  $("btnStart").disabled = !ready;
  $("bankNotice").textContent = ready ? "" : currentContest().mensagem;
  $("bankNotice").classList.toggle("hidden", ready);
  $("rulesList").replaceChildren();
  for (const text of currentContest().regrasTexto) {
    const li = document.createElement("li"); li.textContent = text; $("rulesList").appendChild(li);
  }
  $("typeChoices").replaceChildren();
  for (const [value, format] of Object.entries(currentContest().formatos)) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio"; input.name = "type"; input.value = value; input.checked = value === "FULL";
    label.append(input, ` ${format.nome}`); $("typeChoices").appendChild(label);
  }
  const welcomeKey = "simulado_transpetro_eng_seg_welcome_seen_v1";
  if (App.contest === "TRANSPETRO" && role === "ENG_SEG" && localStorage.getItem(welcomeKey) !== "1") {
    showView("welcome");
  } else {
    showView("config");
  }
}

function changeContest() {
  if (!$("view-exam").classList.contains("hidden") && !confirm("Trocar de concurso encerra o simulado atual sem salvar o resultado. Continuar?")) return;
  timerReset();
  App.contest = null; App.role = null;
  App.questionsBank = []; App.exam = []; App.answers.clear(); App.marked.clear();
  App.totalQuestions = 0; App.currentIndex = 0; App._lastScore = null;
  App.historyKey = null; App.wrongKey = null; App.seenKey = null; App.cycleKey = null;
  $("selectionMeta").textContent = "Escolha seu concurso";
  document.title = "Simulados";
  $("btnChangeContest").classList.add("hidden");
  setTopPills(); showView("contest");
}

// ---------- Eventos ----------
function readConfig() {
  App.mode = document.querySelector('input[name="mode"]:checked')?.value || "PROVA";
  App.type = document.querySelector('input[name="type"]:checked')?.value || "FULL";
  setRoleStorageKeys();
  setTopPills();
}

$("btnStart").addEventListener("click", async () => {
  try {
    readConfig();
    $("bankNotice").classList.add("hidden");

    $("btnStart").disabled = true;
    $("btnChangeRole").disabled = true;
    $("btnResetStorage").disabled = true;
    $("btnChangeContest").disabled = true;
    await loadQuestionsBank();
    generateExam();

    if (App.exam.length === 0) {
      alert("Não há questões erradas disponíveis para este concurso e cargo. Disponíveis: 0.");
      return;
    }

    showView("exam");
    timerReset();
    timerStart();
    buildMap();
    renderQuestion();
  } catch (err) {
    $("bankNotice").innerText = err.message;
    $("bankNotice").classList.remove("hidden");
  } finally {
    $("btnStart").disabled = false;
    $("btnChangeRole").disabled = false;
    $("btnResetStorage").disabled = false;
    $("btnChangeContest").disabled = false;
  }
});

$("btnResetStorage").addEventListener("click", () => {
  clearStorage();
  alert(`Histórico, erradas e vistas de ${currentContest().nome} • ${currentRole().nome} apagados.`);
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
    $("btnRetryWrong").disabled = true;
    $("btnChangeContest").disabled = true;
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
  } finally {
    $("btnRetryWrong").disabled = false;
    $("btnChangeContest").disabled = false;
  }
});

// Inicial
$("btnChangeContest").addEventListener("click", changeContest);
$("btnWelcomeContinue").addEventListener("click", () => {
  if (App.contest !== "TRANSPETRO" || App.role !== "ENG_SEG") return;
  localStorage.setItem("simulado_transpetro_eng_seg_welcome_seen_v1", "1");
  showView("config");
});
$("btnChangeRole").addEventListener("click", () => selectContest(App.contest));
renderChoices("contestChoices", CONCURSOS, selectContest);
showView("contest");
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



