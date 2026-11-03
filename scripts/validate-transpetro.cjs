// Por padrão exige a ETAPA 1 inteira. --partial verifica só o lote declarado,
// sem baixar a meta de 700. Sem dependências; não modifica bancos ou navegador.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRuntime, select, root } = require('./lib/runtime.cjs');
const planPath = 'docs/transpetro-etapa-1-plano.json';
const normalize = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const digest = q => crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
function loadRows() {
  const r = createRuntime(); select(r);
  const sources = r.CONCURSOS.TRANSPETRO.cargos.ENG_SEG.bancos;
  const configured = new Set(sources.map(s => s.path));
  for (const name of fs.readdirSync(path.join(root, 'data/transpetro/eng_seguranca')).filter(n => n.endsWith('.json'))) {
    if (!configured.has(`data/transpetro/eng_seguranca/${name}`)) throw new Error(`JSON sem cadastro no carregador: ${name}`);
  }
  return sources.flatMap(source => {
    const data = read(source.path);
    if (!Array.isArray(data)) throw new Error(`${source.path}: esperado array`);
    return data.map((q, index) => ({ q, source, index }));
  });
}
function validate({ partial = false, rows = loadRows(), plan = read(planPath), audit = true } = {}) {
  const errors = [], warnings = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const r = createRuntime(); select(r);
  const areas = { PORT: 0, ING: 0, ESP: 0 }, subjects = {}, difficulties = {}, answers = {}, groups = new Map();
  const ids = new Set(), uniqueContent = new Map(), legacyIds = new Set();
  for (const file of fs.readdirSync(path.join(root, 'data')).filter(x => x.endsWith('.json'))) {
    for (const q of read(`data/${file}`).questions || []) legacyIds.add(q.id);
  }
  for (const { q, source, index } of rows) {
    if (!q || typeof q !== 'object') { errors.push(`${source.path}:${index}: objeto inválido`); continue; }
    const id = q.id || `${source.path}:${index}`;
    check(/^TP26-ENGSEG-(PORT|ING|ESP)-\d{4}$/.test(q.id), `${id}: padrão de ID`);
    check(!ids.has(q.id), `${id}: ID duplicado global`); ids.add(q.id);
    check(!legacyIds.has(q.id), `${id}: colisão ALERO`);
    check(q.concurso === 'TRANSPETRO' && q.cargo === 'ENG_SEG', `${id}: identidade`);
    check(q.etapa === 1, `${id}: etapa`);
    check(['PORT', 'ING', 'ESP'].includes(q.area) && q.area === source.area, `${id}: área/arquivo`);
    const validSubjects = q.area === 'ESP' ? Object.keys(plan.metaAssuntosESP) : plan.assuntosLinguas[q.area] || [];
    check(validSubjects.includes(q.assunto), `${id}: assunto inválido`);
    if (source.assunto) check(source.assunto === q.assunto, `${id}: assunto/arquivo`);
    for (const field of ['subassunto', 'statement', 'explanation']) check(typeof q[field] === 'string' && q[field].trim().length > 0, `${id}: ${field} vazio`);
    check(Object.hasOwn(plan.proporcoesDificuldade, q.difficulty), `${id}: dificuldade`);
    check(Array.isArray(q.options) && q.options.length === 5 && q.options.every(x => typeof x === 'string' && x.trim()), `${id}: cinco alternativas não vazias`);
    if (!Array.isArray(q.options) || q.options.some(x => typeof x !== 'string')) continue;
    check(new Set(q.options.map(normalize)).size === 5, `${id}: alternativas duplicadas`);
    check(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 5, `${id}: índice único de gabarito`);
    const canonical = normalize((q.statement || '').split('\n\n').at(-1)) + '|' + q.options.map(normalize).sort().join('|');
    check(!uniqueContent.has(canonical), `${id}: conteúdo duplicado de ${uniqueContent.get(canonical)}`); uniqueContent.set(canonical, id);
    for (const msg of r.validateBank([q])) errors.push(`${id}: motor: ${msg}`);
    areas[q.area] = (areas[q.area] || 0) + 1;
    if (q.area === 'ESP') subjects[q.assunto] = (subjects[q.assunto] || 0) + 1;
    difficulties[q.area] ||= {}; difficulties[q.area][q.difficulty] = (difficulties[q.area][q.difficulty] || 0) + 1;
    answers[q.area] ||= [0, 0, 0, 0, 0]; answers[q.area][q.answer]++;
    if (q.groupId) {
      check(new RegExp(`^TP26-${q.area}-\\d{3}$`).test(q.groupId), `${id}: groupId`);
      if (!groups.has(q.groupId)) groups.set(q.groupId, []);
      groups.get(q.groupId).push({ q, source, index });
    } else check(!/(texto-base|texto acima|\bpassage\b|no texto apresentado)/i.test(q.statement), `${id}: referência contextual sem grupo`);
    check(!Object.hasOwn(q, 'groupOrder'), `${id}: mecanismo de ordenação incompatível`);
    const normative = /\b(NR[-\s]?\d+|NHO[-\s]?\d+|ISO\s*\d+|CLT|[Ll]ei\s+\d|[Dd]ecreto\s+\d|artigo\s+\d)/.test(q.statement + ' ' + q.explanation);
    if (normative) check(Array.isArray(q.fontes) && q.fontes.length > 0, `${id}: referência normativa sem referência de fonte`);
  }
  for (const [groupId, entries] of groups) {
    check(entries.length >= 2, `${groupId}: grupo órfão`);
    const first = entries[0];
    check(entries.every(x => x.source.path === first.source.path && x.q.area === first.q.area), `${groupId}: grupo distribuído entre arquivos/áreas`);
    check(entries.every((x, i) => x.index === first.index + i), `${groupId}: grupo intercalado`);
    check(entries.every((x, i) => !i || x.q.id > entries[i - 1].q.id), `${groupId}: ordem interna`);
    check(first.q.statement.includes('\n\n') && first.q.statement.split('\n\n')[0].length >= 150, `${groupId}: base textual ausente`);
    check(entries.slice(1).every(x => !x.q.statement.includes('\n\n')), `${groupId}: contexto repetido nas dependentes`);
    check(entries.length <= (first.q.area === 'ESP' ? 50 : 10), `${groupId}: excede cota de área`);
  }
  const targetAreas = partial ? plan.loteAreas : plan.metaAreas;
  const targetSubjects = partial ? plan.loteAssuntosESP : plan.metaAssuntosESP;
  check(rows.length === (partial ? plan.loteTotal : 700), `total: ${rows.length}; necessário ${partial ? plan.loteTotal : 700}`);
  check(plan.metaTotal === 700 && plan.metaAreas.PORT === 100 && plan.metaAreas.ING === 100 && plan.metaAreas.ESP === 500, 'meta de 700 foi alterada');
  for (const area of ['PORT', 'ING', 'ESP']) {
    check(areas[area] === targetAreas[area], `${area}: ${areas[area]}; necessário ${targetAreas[area]}`);
    check(areas[area] <= plan.metaAreas[area], `${area}: extrapola etapa 1`);
    for (const [level, percent] of Object.entries(plan.proporcoesDificuldade)) check((difficulties[area]?.[level] || 0) * 100 === areas[area] * percent, `${area}: proporção ${level}`);
    if (answers[area]) check(Math.max(...answers[area]) - Math.min(...answers[area]) <= 1, `${area}: gabaritos desequilibrados`);
  }
  for (const subject of Object.keys(plan.metaAssuntosESP)) {
    check((subjects[subject] || 0) === (targetSubjects[subject] || 0), `${subject}: ${subjects[subject] || 0}; necessário ${targetSubjects[subject] || 0}`);
    check((subjects[subject] || 0) <= plan.metaAssuntosESP[subject], `${subject}: extrapola meta`);
  }
  if (audit) {
    const reviews = read('docs/auditorias/transpetro-etapa-1-conteudo.json');
    check(reviews.itens.length === rows.length, 'auditoria de conteúdo: cobertura');
    for (const { q } of rows) {
      const found = reviews.itens.filter(x => x.id === q.id);
      check(found.length === 1, `${q.id}: auditoria ausente/duplicada`);
      const a = found[0]; if (!a) continue;
      check(a.sha256 === digest(q), `${q.id}: conteúdo alterado após revisão`);
      check(a.correctOption === q.answer, `${q.id}: auditoria/gabarito divergentes`);
      check(a.alternativas?.length === 5 && a.alternativas.every(x => typeof x === 'string' && x.length >= 8), `${q.id}: análise das cinco alternativas incompleta`);
      check(typeof a.dificuldade === 'string' && a.dificuldade.length > 15, `${q.id}: revisão de dificuldade ausente`);
    }
  }
  if (partial) warnings.push(`LOTE PARCIAL: ${rows.length}/700; faltam ${700 - rows.length}. Não libera a Etapa 1.`);
  return { mode: partial ? 'lote_parcial' : 'etapa_completa', total: rows.length, areas, subjects, difficulties, answers,
    groups: groups.size, linkedQuestions: [...groups.values()].reduce((n, g) => n + g.length, 0), independentQuestions: rows.filter(x => !x.q.groupId).length,
    errors, warnings, semanticLimit: 'Estrutura e índice único não provam unicidade semântica: ela exige a auditoria de conteúdo e revisão humana.' };
}
if (require.main === module) {
  try {
    const result = validate({ partial: process.argv.includes('--partial'), audit: !process.argv.includes('--structure-only') });
    console.log(JSON.stringify(result, null, 2)); process.exitCode = result.errors.length ? 1 : 0;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { validate, loadRows, read, normalize, digest };
