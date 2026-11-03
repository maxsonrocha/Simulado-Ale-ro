const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { validate, loadRows, read } = require('../scripts/validate-transpetro.cjs');
const { createRuntime, select, root } = require('../scripts/lib/runtime.cjs');
const clone = x => JSON.parse(JSON.stringify(x));

test('lote parcial é declarado, íntegro, carregável e vinculado à auditoria dos 200 itens', () => {
  const result = validate({ partial: true });
  assert.deepEqual(result.errors, []); assert.equal(result.total, 200);
  assert.deepEqual(result.areas, { PORT: 40, ING: 40, ESP: 120 });
  assert.equal(result.groups, 40); assert.equal(result.independentQuestions, 120);
  assert.equal(result.warnings.length, 1);
});
test('liberação da Etapa 1 FALHA enquanto faltarem 500 questões', () => {
  const result = validate(); assert(result.errors.includes('total: 200; necessário 700'));
  const command = spawnSync(process.execPath, ['scripts/validate-transpetro.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(command.status, 1); assert(command.stdout.includes('necessário 700'));
});
for (const [name, change, expected] of [
  ['campo obrigatório', q => delete q.subassunto, /subassunto/],
  ['dificuldade', q => q.difficulty = 'baixa', /dificuldade/],
  ['ID duplicado', (q, rows) => q.id = rows[1].q.id, /duplicado/],
  ['ID ALERO', q => q.id = 'PORT-001', /colisão ALERO/],
  ['área', q => q.area = 'RLM', /área/],
  ['assunto', q => q.assunto = 'desconhecido', /assunto/],
  ['cargo', q => q.cargo = 'DES', /identidade/],
  ['concurso', q => q.concurso = 'ALERO', /identidade/],
  ['cinco alternativas', q => q.options.pop(), /cinco alternativas/],
  ['alternativa vazia', q => q.options[0] = '', /cinco alternativas/],
  ['alternativa duplicada', q => q.options[1] = q.options[0], /alternativas duplicadas/],
  ['índice fracionário', q => q.answer = 1.5, /gabarito/],
  ['índice fora da faixa', q => q.answer = 5, /gabarito/],
  ['explicação', q => q.explanation = '', /explanation/],
  ['gabarito alterado após revisão', q => q.answer = (q.answer + 1) % 5, /auditoria\/gabarito/],
  ['grupo inexistente', q => q.groupId = 'TP26-PORT-999', /órfão/],
  ['base sem contexto', q => q.statement = q.statement.split('\n\n').at(-1), /base textual/],
  ['ordem de grupo', q => q.id = 'TP26-ENGSEG-PORT-9999', /ordem interna/],
  ['mudança pós-auditoria', q => q.statement += ' Texto adicional.', /após revisão/],
  ['fonte normativa não verificada', q => q.statement += ' Conforme NR-01.', /fonte/]
]) test(`validador reprova corrupção: ${name}`, () => {
  const rows = clone(loadRows()); change(rows[0].q, rows);
  assert(validate({ partial: true, rows }).errors.some(s => expected.test(s)));
});
test('validador detecta grupo intercalado e alteração de quantidade', () => {
  const rows = clone(loadRows()); rows[1].index = 50;
  assert(validate({ partial: true, rows }).errors.some(s => s.includes('intercalado')));
  rows.pop(); assert(validate({ partial: true, rows }).errors.some(s => s.startsWith('total:')));
});
test('as 30 resoluções quantitativas recalculadas encontram exatamente uma alternativa', () => {
  const output = JSON.parse(execFileSync(process.execPath, ['scripts/audit-transpetro-calculations.cjs'], { cwd: root, encoding: 'utf8' }));
  assert.equal(output.checked, 30); assert(output.passed); assert(output.results.every(r => r.matches.length === 1));
});
test('triagem lexical global não encontra pares acima do limiar', () => {
  const output = JSON.parse(execFileSync(process.execPath, ['scripts/audit-transpetro-similarity.cjs'], { cwd: root, encoding: 'utf8' }));
  assert.equal(output.comparedPairs, 19900); assert.deepEqual(output.flagged, []);
});
test('motor real em dez provas: evita repetição quando há inéditas suficientes e preserva todo grupo', async () => {
  const r = createRuntime(); select(r); await r.loadQuestionsBank();
  const reports = [];
  for (let attempt = 0; attempt < 10; attempt++) {
    const cycle = r.getCycleIds();
    const before = Object.fromEntries(['PORT', 'ING', 'ESP'].map(area => [area, r.App.questionsBank.filter(q => q.area === area && !cycle.has(q.id)).length]));
    r.generateExam(); assert.equal(r.App.exam.length, 70); assert.equal(new Set(r.App.exam.map(q => q.id)).size, 70);
    const fresh = {};
    for (const [area, needed] of Object.entries({ PORT: 10, ING: 10, ESP: 50 })) {
      const selected = r.App.exam.filter(q => q.area === area);
      assert.equal(selected.length, needed); fresh[area] = selected.filter(q => !cycle.has(q.id)).length;
      if (before[area] >= needed) assert.equal(fresh[area], needed);
      else if (before[area] > 0) assert.equal(fresh[area], before[area]);
    }
    for (const q of r.App.exam.filter(q => q.groupId)) {
      const group = r.App.questionsBank.filter(x => x.groupId === q.groupId), start = r.App.exam.findIndex(x => x.id === group[0].id);
      assert(start >= 0); assert.deepEqual(Array.from(r.App.exam.slice(start, start + group.length), x => x.id), Array.from(group, x => x.id));
    }
    reports.push({ attempt: attempt + 1, before, fresh });
  }
  assert.equal(reports[0].fresh.ESP, 50);
  assert.equal(reports[1].fresh.PORT, 10); assert.equal(reports[1].fresh.ING, 10); assert.equal(reports[1].fresh.ESP, 50);
  assert.equal(reports[2].fresh.ESP, 20);
  // 200 itens garantem duas completas inéditas por ciclo, não dez.
});
test('bancos ALERO não sofreram alteração de conteúdo nesta branch', () => {
  for (const name of ['port', 'rlm', 'info', 'leg', 'hgr', 'esp_arquiteto', 'esp_desenhista']) {
    const file = `data/${name}.json`;
    assert.deepEqual(fs.readFileSync(path.join(root, file)), execFileSync('git', ['show', `e9c9ef6:${file}`], { cwd: root }));
  }
});

test('leitor rejeita JSON sintaticamente inválido sem tocar nos bancos reais', () => {
 const os = require('node:os'); const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tp-json-'));
 try {
  const file = path.join(dir, 'invalid.json'); fs.writeFileSync(file, '[{"id":]');
  assert.throws(() => read(path.relative(root, file)), SyntaxError);
 } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('validador rejeita cópia com ID novo e opções reordenadas', () => {
 const rows = clone(loadRows());
 rows[2].q = { ...rows[0].q, id: rows[2].q.id, options: rows[0].q.options.slice().reverse() };
 assert(validate({ partial: true, rows }).errors.some(s => s.includes('conteúdo duplicado')));
});

test('lote 2 acrescenta exatamente 100 itens sem alterar ou reordenar os 100 anteriores', () => {
 let preserved=0, added=0;
 for(const file of fs.readdirSync(path.join(root,'data/transpetro/eng_seguranca')).filter(f=>f.endsWith('.json'))){
  const relative=`data/transpetro/eng_seguranca/${file}`;
  const prior=JSON.parse(execFileSync('git',['show',`7a54ee0:${relative}`],{cwd:root,encoding:'utf8'}));
  const current=read(relative);
  assert.deepEqual(current.slice(0,prior.length),prior);preserved+=prior.length;
  const delta=current.slice(prior.length);assert(delta.every(q=>q.lote===2));added+=delta.length;
 }
 assert.equal(preserved,100);assert.equal(added,100);
 for(const name of ['conteudo','estrutura','calculos','similaridade']){
  const file=`docs/auditorias/transpetro-etapa-1-${name}.json`;
  assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`7a54ee0:${file}`],{cwd:root}));
 }
});
test('novas áreas, dificuldades, IDs e gabaritos atendem às cotas próprias do lote 2', () => {
 const qs=loadRows().map(x=>x.q).filter(q=>q.lote===2);
 assert.equal(qs.length,100);
 for(const [area,total,levels,offset] of [['PORT',20,[4,9,7],20],['ING',20,[4,9,7],20],['ESP',60,[12,27,21],60]]){
  const a=qs.filter(q=>q.area===area);assert.equal(a.length,total);
  assert.deepEqual(['media','alta','muito_alta'].map(d=>a.filter(q=>q.difficulty===d).length),levels);
  assert.deepEqual([0,1,2,3,4].map(v=>a.filter(q=>q.answer===v).length),Array(5).fill(total/5));
  const ids=a.map(q=>+q.id.slice(-4)).sort((a,b)=>a-b);assert.deepEqual(Array.from(ids),Array.from({length:total},(_,i)=>offset+i+1));
 }
});
test('as 26 resoluções novas enfrentam as cinco alternativas e a semântica editorial cobre todos os novos itens', () => {
 const r=JSON.parse(execFileSync(process.execPath,['scripts/audit-transpetro-lote2-calculations.cjs'],{cwd:root,encoding:'utf8'}));
 assert.equal(r.checked,26);assert(r.passed);assert(r.results.every(x=>x.matches.length===1));
 const {digest}=require('../scripts/validate-transpetro.cjs');
 const semantic=read('docs/auditorias/transpetro-etapa-1-lote-2-semantica.json');
 const prior=read('docs/auditorias/transpetro-etapa-1-lote-2-previa.json');
 assert.equal(prior.itens.length,100);assert.equal(semantic.revisoes.length,100);
 const newQuestions=loadRows().map(x=>x.q).filter(q=>q.lote===2);
 for(const q of newQuestions){
  const entry=semantic.revisoes.filter(x=>x.id===q.id);assert.equal(entry.length,1);assert.equal(entry[0].sha256,digest(q));
  assert(entry[0].distincao.length>50);assert(entry[0].contrastesAntigos.length);
  for(const id of entry[0].contrastesAntigos)assert(prior.itens.some(x=>x.id===id));
 }
 const similarity=JSON.parse(execFileSync(process.execPath,['scripts/audit-transpetro-similarity.cjs'],{cwd:root,encoding:'utf8'}));
 assert.deepEqual(similarity.scopes,{novas_novas:4950,novas_antigas:10000,antigas_antigas:4950});
 assert.deepEqual(similarity.flagged,[]);
});
test('aplicação, motor e apresentação permanecem exatamente como na main de partida', () => {
 for(const file of ['app.js','index.html','styles.css'])assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`7a54ee0:${file}`],{cwd:root}));
});
