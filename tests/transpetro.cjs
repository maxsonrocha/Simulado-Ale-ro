// Mocks estruturais existem apenas na memória destes testes; nunca em /data.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const clean = value => JSON.parse(JSON.stringify(value));
const { createRuntime: runtime, select } = require('../scripts/lib/runtime.cjs');
function mock(area, index, overrides = {}) {
  return { id: `${area}-${index}`, concurso: 'TRANSPETRO', cargo: 'ENG_SEG', area,
    assunto: area === 'ESP' ? 'ergonomia' : 'teste_interno', statement: 'mock interno',
    options: ['A', 'B', 'C', 'D', 'E'], answer: 0, explanation: '', _ord: index, ...overrides };
}
const pool = (area, count, overrides) => Array.from({ length: count }, (_, i) => mock(area, i, overrides));
function evaluate(r, port, ing, esp, type = 'FULL') {
  const p = { correct: port, total: 10 }, i = { correct: ing, total: 10 }, e = { correct: esp, total: 50 };
  return r.evaluateTranspetro({ correct: port + ing, total: 20 }, e,
    { correct: port + ing + esp, total: 70 }, { PORT: p, ING: i, ESP: e }, { type });
}
function assertGroups(exam, bank) {
  for (const q of exam.filter(q => q.groupId)) {
    const group = bank.filter(x => x.area === q.area && x.groupId === q.groupId).sort((a, b) => a._ord - b._ord);
    const start = exam.findIndex(x => x.id === group[0].id);
    assert(start >= 0); assert.deepEqual(clean(exam.slice(start, start + group.length)).map(x => x.id), clean(group).map(x => x.id));
  }
}

test('concursos, cargos, áreas, formatos e duração independentes', () => {
  const r = runtime(), c = r.CONCURSOS;
  assert(c.ALERO.cargos.DES); assert(c.ALERO.cargos.ARQ); assert(c.TRANSPETRO.cargos.ENG_SEG);
  assert.equal(c.TRANSPETRO.banca, 'Fundação Cesgranrio');
  assert.deepEqual(clean(c.TRANSPETRO.areas), ['PORT', 'ING', 'ESP']);
  assert.deepEqual(clean(c.TRANSPETRO.formatos.FULL.quantidades), { PORT: 10, ING: 10, ESP: 50 });
  assert.deepEqual(clean(c.TRANSPETRO.formatos.ESP.quantidades), { ESP: 50 });
  assert.equal(c.TRANSPETRO.tempo.limiteMs, 270 * 60000); assert.equal(c.TRANSPETRO.tempo.avisoMs, 15 * 60000);
  assert.equal(c.ALERO.tempo.limiteMs, 240 * 60000); assert.notEqual(c.ALERO.avaliar, c.TRANSPETRO.avaliar);
  assert.equal(Object.keys(c.TRANSPETRO.cargos.ENG_SEG.assuntos).length, 11);
});
for (const [port, ing, esp, passed, reasons] of [
  [5, 5, 24, false, ['Específicos']], [5, 5, 25, true, []],
  [4, 5, 50, false, ['Gerais']], [1, 9, 25, true, []],
  [0, 10, 35, false, ['Portuguesa']], [10, 0, 35, false, ['Inglesa']],
  [0, 0, 0, false, ['Específicos', 'Gerais', 'Portuguesa', 'Inglesa']],
  [10, 10, 50, true, []]
]) {
  test(`avaliação PORT=${port} ING=${ing} ESP=${esp}`, () => {
    const r = runtime(); const result = evaluate(r, port, ing, esp);
    assert.equal(result.passedAll, passed); assert.equal(result.status, passed ? 'APROVADO' : 'REPROVADO');
    assert.equal(result.reasons.length, reasons.length);
    for (const reason of reasons) assert(result.reasons.some(text => text.includes(reason)));
    assert.equal(result.general.correct, port + ing); assert.equal(result.total.correct, port + ing + esp);
  });
}
test('simulados parciais não inventam aprovação oficial', () => {
  const r = runtime();
  for (const type of ['ESP', 'ERRADAS']) {
    const result = evaluate(r, 0, 0, 50, type);
    assert.equal(result.passedAll, null); assert.equal(result.criteria.length, 0); assert.equal(result.applicable, false);
  }
});
test('bancos reais carregam isoladamente; banco vazio continua tratado por fixture em memória', async () => {
  const r = runtime(); select(r); const files = r.CONCURSOS.TRANSPETRO.cargos.ENG_SEG.bancos;
  assert.equal(files.length, 16);
  for (const { path: file } of files) assert(Array.isArray(JSON.parse(fs.readFileSync(path.join(root, file)))));
  r.App.questionsBank = pool('ESP', 80, { concurso: 'ALERO' });
  await r.loadQuestionsBank(); assert.equal(r.App.questionsBank.length, 920);
  assert(r.App.questionsBank.every(q => q.concurso === 'TRANSPETRO' && q.cargo === 'ENG_SEG'));
  r.context.fetch = async () => ({ ok: true, json: async () => [] });
  await r.loadQuestionsBank(); assert.equal(r.App.questionsBank.length, 0);
  assert.throws(() => r.generateExam(), /Língua Portuguesa: disponíveis: 0; necessárias: 10/);
  assert.equal(r.App.exam.length, 0); assert.equal(r.App.timer.running, false);
  assert(!r.storage.has(r.App.cycleKey));
});

for (const [port, ing, esp, area, available, required] of [
  [8, 10, 50, 'Língua Portuguesa', 8, 10], [10, 8, 50, 'Língua Inglesa', 8, 10],
  [10, 10, 40, 'Conhecimentos Específicos', 40, 50]
]) {
  test(`banco insuficiente em ${area} não gera tentativa nem avança ciclo`, () => {
    const r = runtime(); select(r); r.App.questionsBank = [...pool('PORT', port), ...pool('ING', ing), ...pool('ESP', esp)];
    const before = [...r.storage];
    assert.throws(() => r.generateExam(), new RegExp(`${area}: disponíveis: ${available}; necessárias: ${required}`));
    assert.equal(r.App.exam.length, 0); assert.deepEqual([...r.storage], before);
  });
}
test('geração completa e específica com mocks somente em memória', () => {
  const r = runtime(); select(r); r.App.questionsBank = [...pool('PORT', 20), ...pool('ING', 20), ...pool('ESP', 100)];
  assert.equal(r.validateBank(r.App.questionsBank).length, 0); r.generateExam();
  assert.equal(r.App.exam.length, 70);
  for (const [area, n] of Object.entries({ PORT: 10, ING: 10, ESP: 50 })) assert.equal(r.App.exam.filter(q => q.area === area).length, n);
  const first = new Set(r.App.exam.map(q => q.id)); r.generateExam();
  assert(r.App.exam.every(q => !first.has(q.id))); // todas as áreas possuem inéditas suficientes
  assert.equal(r.readJSON(r.App.seenKey, []).length, 140);
  r.App.type = 'ESP'; r.generateExam(); assert.equal(r.App.exam.length, 50); assert(r.App.exam.every(q => q.area === 'ESP'));
});
test('ciclo prioriza resto inédito e só renova a área esgotada', () => {
  const r = runtime(); select(r, 'TRANSPETRO', 'ENG_SEG', 'ESP');
  r.App.questionsBank = pool('ESP', 120);
  const used = new Set();
  for (let i = 0; i < 2; i++) { r.generateExam(); for (const q of r.App.exam) { assert(!used.has(q.id)); used.add(q.id); } }
  r.generateExam(); assert.equal(r.App.exam.filter(q => !used.has(q.id)).length, 20);
  assert.equal(r.getCycleIds().size, 120); r.generateExam(); assert.equal(r.getCycleIds().size, 50);
  assert.equal(r.readJSON(r.App.seenKey, []).length, 120);
});
test('histórico de vistas anterior alimenta o primeiro ciclo', () => {
  const r = runtime(); select(r, 'TRANSPETRO', 'ENG_SEG', 'ESP'); r.App.questionsBank = pool('ESP', 100);
  r.writeJSON(r.App.seenKey, r.App.questionsBank.slice(0, 50).map(q => q.id));
  r.generateExam(); assert(r.App.exam.every(q => q._ord >= 50));
});
test('vistas e ciclos são separados por concurso e cargo, mesmo com IDs iguais', () => {
  const r = runtime();
  for (const [contest, role, n] of [['ALERO', 'DES', 40], ['ALERO', 'ARQ', 40], ['TRANSPETRO', 'ENG_SEG', 50]]) {
    select(r, contest, role, 'ESP'); r.App.questionsBank = pool('ESP', 100); r.generateExam();
    assert.equal(r.readJSON(r.App.seenKey, []).length, n); assert.equal(r.getCycleIds().size, n);
  }
  for (const key of ['simulado_ALERO_DES_cycle', 'simulado_ALERO_ARQ_cycle', 'simulado_TRANSPETRO_ENG_SEG_cycle']) assert(r.storage.has(key));
});
test('grupos completos em PORT, ING, ESP e no específico; ordem vem dos JSONs', () => {
  const r = runtime(); select(r);
  r.App.questionsBank = ['PORT', 'ING', 'ESP'].flatMap(area => pool(area, area === 'ESP' ? 80 : 20)
    .map(q => ({ ...q, groupId: `${area}-${Math.floor(q._ord / 2)}` })));
  const orders = new Set();
  for (let i = 0; i < 12; i++) {
    r.generateExam(); assertGroups(r.App.exam, r.App.questionsBank); orders.add(r.App.exam[0].id);
  }
  assert(orders.size > 1);
  r.App.type = 'ESP'; r.generateExam(); assertGroups(r.App.exam, r.App.questionsBank);
});
test('ordem e contiguidade independem da posição de um grupo na lista de entrada', () => {
  const r = runtime(); const a = mock('PORT', 1, { groupId: 'G' }), b = mock('PORT', 2, { groupId: 'G' }), c = mock('PORT', 3);
  assert.deepEqual(clean(r.groupToBlocks([b, c, a])).map(block => block.map(q => q.id)), [['PORT-1', 'PORT-2'], ['PORT-3']]);
});
test('quantidade exata usa blocos inteiros sem falha gulosa nem corte de contexto', () => {
  const r = runtime(); select(r, 'TRANSPETRO', 'ENG_SEG', 'ESP');
  // 17 trincas e 25 duplas: uma combinação de 50 existe independentemente da ordem.
  let id = 0; r.App.questionsBank = [];
  for (let group = 0; group < 42; group++) for (let j = 0; j < (group < 17 ? 3 : 2); j++) r.App.questionsBank.push(mock('ESP', id++, { groupId: `G-${group}` }));
  for (let i = 0; i < 10; i++) { r.generateExam(); assert.equal(r.App.exam.length, 50); assertGroups(r.App.exam, r.App.questionsBank); }
});
test('banco numericamente suficiente mas com grupos incompatíveis não inicia nem altera ciclo', () => {
  const r = runtime(); select(r, 'TRANSPETRO', 'ENG_SEG', 'ESP');
  r.App.questionsBank = pool('ESP', 51).map(q => ({ ...q, groupId: `G-${Math.floor(q._ord / 3)}` }));
  assert.throws(() => r.generateExam(), /sem quebrar grupos/); assert.equal(r.App.exam.length, 0); assert(!r.storage.has(r.App.cycleKey));
});
test('caderno de erradas leva grupo completo como contexto e não avança ciclo', () => {
  const r = runtime(); select(r, 'TRANSPETRO', 'ENG_SEG', 'ERRADAS');
  r.App.questionsBank = pool('ING', 3, { groupId: 'TEXTO' });
  r.writeJSON(r.App.wrongKey, ['ING-2']); r.writeJSON(r.App.cycleKey, ['ESP-0']);
  r.generateExam(); assert.deepEqual(clean(r.App.exam).map(q => q.id), ['ING-0', 'ING-1', 'ING-2']);
  assert.deepEqual(clean(r.readJSON(r.App.wrongKey, [])), ['ING-2']);
  assert.deepEqual(clean(r.readJSON(r.App.cycleKey, [])), ['ESP-0']);
  assertGroups(r.App.exam, r.App.questionsBank);
  r.App.answers = new Map(r.App.exam.map(q => [q.id, 0])); r.saveResults(r.computeScore());
  assert.equal(r.readJSON(r.App.wrongKey, []).length, 0);
});
test('validação retrocompatível aceita ALERO sem campos novos e rejeita identidades/áreas trocadas', async () => {
  const r = runtime();
  for (const role of ['DES', 'ARQ']) { select(r, 'ALERO', role); await r.loadQuestionsBank(); assert.equal(r.validateBank(r.App.questionsBank).length, 0); }
  select(r); const q = mock('ING', 1); assert.equal(r.validateBank([q]).length, 0);
  for (const change of [{ concurso: 'ALERO' }, { cargo: 'DES' }, { area: 'RLM' }, { answer: 0.5 }, { options: ['A'] }, { assunto: '' }]) assert(r.validateBank([{ ...q, ...change }]).length);
  assert(r.validateBank([mock('ESP', 1, { assunto: 'fora_do_cadastro' })]).length);
  assert(r.validateBank([q, q]).some(msg => msg.includes('ID repetido')));
});
test('carregamento rejeita arquivo com identidade alheia e não conserva banco anterior', async () => {
  const r = runtime(); select(r); r.App.questionsBank = pool('ESP', 100);
  r.context.fetch = async file => ({ ok: true, json: async () => file.endsWith('ingles.json') ? [mock('ING', 0, { concurso: 'ALERO' })] : [] });
  await assert.rejects(r.loadQuestionsBank(), /concurso/); assert.equal(r.App.questionsBank.length, 0);
});
test('carregamento rejeita assunto e área incompatíveis com o arquivo', async () => {
  for (const overrides of [{ area: 'PORT' }, { assunto: 'ergonomia' }]) {
    const r = runtime(); select(r);
    r.context.fetch = async file => ({ ok: true, json: async () => file.endsWith('incendio.json') ? [mock('ESP', 0, overrides)] : [] });
    await assert.rejects(r.loadQuestionsBank(), /incompatível/); assert.equal(r.App.questionsBank.length, 0);
  }
});
test('histórico registra modo, formato, notas, erros, situação e desempenho por assunto', () => {
  const r = runtime(); select(r); r.App.mode = 'TREINO';
  r.App.questionsBank = [...pool('PORT', 10), ...pool('ING', 10), ...pool('ESP', 50)]; r.generateExam();
  r.App.answers = new Map(r.App.exam.map(q => [q.id, 0])); r.App.timer.elapsedMs = 1234;
  const score = r.computeScore(); r.saveResults(score); const h = r.readJSON(r.App.historyKey, [])[0];
  assert.equal(h.contest, 'TRANSPETRO'); assert.equal(h.role, 'ENG_SEG'); assert(h.date);
  assert.equal(h.mode, 'TREINO'); assert.equal(h.type, 'FULL'); assert.equal(h.total, 70);
  assert.equal(h.correct, 70); assert.equal(h.errors, 0); assert.equal(h.points, 70); assert.equal(h.percent, 100);
  assert.equal(h.status, 'APROVADO'); assert.equal(h.timeMs, 1234); assert.equal(h.byArea.ING.correct, 10);
  assert.equal(h.bySubject.ESP.ergonomia.correct, 50);
  assert.equal(r.aggregateHistory().aggSubject.ESP.ergonomia.correct, 50);
  select(r, 'ALERO', 'DES'); assert.equal(r.readJSON(r.App.historyKey, []).length, 0);
});
test('banco vazio não produz NaN em percentuais ou agregados', () => {
  const r = runtime(); select(r); const score = r.computeScore();
  assert.equal(score.percent, 0); assert.equal(score.errors, 0); assert.equal(score.points, 0);
  assert.equal(score.module.passedAll, null); assert(!JSON.stringify(score).includes('NaN'));
  assert.deepEqual(clean(r.aggregateHistory()), { aggArea: {}, aggTopic: {}, aggSubject: {} });
});
test('limpeza de um cargo não apaga os demais e preserva chave legada ambígua', () => {
  const r = runtime(); r.storage.set('undefined', 'legado');
  for (const [contest, role] of [['ALERO', 'DES'], ['ALERO', 'ARQ'], ['TRANSPETRO', 'ENG_SEG']]) {
    select(r, contest, role); for (const key of ['historyKey', 'wrongKey', 'seenKey', 'cycleKey']) r.writeJSON(r.App[key], ['interno']);
  }
  r.clearStorage(); assert(r.storage.has('simulado_ALERO_DES_cycle')); assert(r.storage.has('simulado_ALERO_ARQ_history'));
  assert(!r.storage.has('simulado_TRANSPETRO_ENG_SEG_seen')); assert(!r.storage.has('simulado_TRANSPETRO_ENG_SEG_cycle'));
  assert.equal(r.storage.get('undefined'), 'legado');
});

test('ALERO real: duas provas completas sem repetição e sem perder grupos em ambos os cargos', async () => {
  const r = runtime();
  for (const role of ['DES', 'ARQ']) {
    select(r, 'ALERO', role); await r.loadQuestionsBank();
    r.generateExam(); assert.equal(r.App.exam.length, 80); assertGroups(r.App.exam, r.App.questionsBank);
    const first = new Set(r.App.exam.map(q => q.id)); r.generateExam();
    assert.equal(r.App.exam.length, 80); assert(r.App.exam.every(q => !first.has(q.id)));
    assertGroups(r.App.exam, r.App.questionsBank);
    assert.equal(r.readJSON(r.App.seenKey, []).length, 160);
  }
});
test('ALERO real: caderno recupera base e dependente PORT-106/107 na ordem original', async () => {
  const r = runtime(); select(r, 'ALERO', 'DES', 'ERRADAS'); await r.loadQuestionsBank();
  r.writeJSON(r.App.wrongKey, ['PORT-107']); r.generateExam();
  assert.deepEqual(clean(r.App.exam).map(q => q.id), ['PORT-106', 'PORT-107']);
  assertGroups(r.App.exam, r.App.questionsBank);
});

test('caderno Transpetro não inventa limite; limite legado de 80 da ALERO permanece', () => {
  const r = runtime();
  for (const [contest, role, expected] of [['TRANSPETRO', 'ENG_SEG', 100], ['ALERO', 'DES', 80]]) {
    select(r, contest, role, 'ERRADAS'); r.App.questionsBank = pool('ESP', 100);
    r.writeJSON(r.App.wrongKey, r.App.questionsBank.map(q => q.id)); r.generateExam();
    assert.equal(r.App.exam.length, expected);
  }
});
