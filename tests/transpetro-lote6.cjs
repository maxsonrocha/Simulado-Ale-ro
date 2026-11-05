const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync,spawnSync}=require('node:child_process');const {loadRows,read,digest,validate}=require('../scripts/validate-transpetro.cjs');const {root,createRuntime,select}=require('../scripts/lib/runtime.cjs');
const run=file=>JSON.parse(execFileSync(process.execPath,[file],{cwd:root,encoding:'utf8'}));
test('lote6 preserva os500 anteriores, a ordem, ALERO, línguas e auditorias',()=>{
 let preserved=0,added=0;
 for(const name of fs.readdirSync(path.join(root,'data/transpetro/eng_seguranca')).filter(f=>f.endsWith('.json'))){
  const file=`data/transpetro/eng_seguranca/${name}`,raw=execFileSync('git',['show',`538307c:${file}`],{cwd:root}),before=JSON.parse(raw),now=read(file).filter(q=>(q.lote||1)<=6);
  assert.deepEqual(now.slice(0,before.length),before);preserved+=before.length;const delta=now.slice(before.length);assert(delta.every(q=>q.lote===6&&q.area==='ESP'));added+=delta.length;
  if(['portugues.json','ingles.json'].includes(name))assert.deepEqual(fs.readFileSync(path.join(root,file)),raw);
 }
 assert.equal(preserved,500);assert.equal(added,100);
 const files=execFileSync('git',['ls-tree','-r','--name-only','538307c','docs/auditorias','references/transpetro','data'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(f=>!f.startsWith('data/transpetro/'));
 for(const file of files)assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`538307c:${file}`],{cwd:root}));
});
test('600 acumuladas, +100ESP 0301..0400, dificuldade20/45/35 e20gabaritos por letra',()=>{
 const snapshotPlan=JSON.parse(execFileSync('git',['show','673ebc6:docs/transpetro-etapa-1-plano.json'],{cwd:root,encoding:'utf8'}));const r=validate({partial:true,rows:loadRows().filter(x=>(x.q.lote||1)<=6),plan:snapshotPlan});assert.deepEqual(r.errors,[]);assert.equal(r.total,600);assert.deepEqual(r.areas,{PORT:100,ING:100,ESP:400});assert.equal(r.groups,102);assert.equal(r.linkedQuestions,204);assert.equal(r.independentQuestions,396);
 const qs=Array.from(loadRows(),x=>x.q).filter(q=>q.lote===6);assert.equal(qs.length,100);assert(qs.every(q=>q.area==='ESP'));
 assert.deepEqual(qs.map(q=>+q.id.slice(-4)).sort((a,b)=>a-b),Array.from({length:100},(_,i)=>301+i));
 assert.deepEqual(['media','alta','muito_alta'].map(l=>qs.filter(q=>q.difficulty===l).length),[20,45,35]);assert.deepEqual([0,1,2,3,4].map(a=>qs.filter(q=>q.answer===a).length),[20,20,20,20,20]);
 const counts=Object.fromEntries(Object.keys(read('docs/transpetro-etapa-1-plano.json').metaAssuntosESP).map(s=>[s,qs.filter(q=>q.assunto===s).length]));assert.deepEqual(counts,{prevencao_riscos:22,legislacao_nr:20,higiene_ocupacional:17,gerenciamento_riscos:15,gestao_sms:7,acidentes:6,emergencias:4,incendio:3,ergonomia:3,saude_ocupacional:2,desenvolvimento_sustentavel:1});
});
test('65 segundas resoluções verificam resposta única nos dados reais',()=>{const r=run('scripts/audit-transpetro-lote6-calculations.cjs');assert.equal(r.checked,65);assert(r.passed);assert(r.results.every(x=>x.matches.length===1));});
test('179700 pares incluem4950 novos/novos e50000 novos/antigos sem alerta lexical',()=>{
 const r=JSON.parse(execFileSync(process.execPath,['scripts/audit-transpetro-similarity.cjs','--lote','6'],{cwd:root,encoding:'utf8'}));assert.equal(r.lote,6);assert.equal(r.comparedPairs,179700);assert.deepEqual(r.scopes,{novas_novas:4950,novas_antigas:50000,antigas_antigas:124750});assert.deepEqual(r.flagged,[]);
});
test('100 pareceres e500 alternativas têm hashes atuais;20normativas possuem fonte rastreável',()=>{
 const s=read('docs/auditorias/transpetro-etapa-1-lote-6-semantica.json'),review=read('docs/auditorias/transpetro-etapa-1-lote-6-conteudo.json'),sources=read('docs/auditorias/transpetro-etapa-1-lote-6-fontes.json'),all=loadRows();assert.equal(s.inventarioAnterior.length,500);assert.equal(s.revisoes.length,100);assert.equal(review.itens.reduce((n,x)=>n+x.alternativas.length,0),500);
 for(const {q}of all.filter(x=>x.q.lote===6)){
  const a=s.revisoes.find(x=>x.id===q.id);assert(a);assert.equal(a.sha256,digest(q));assert(a.operacao.length>15&&a.parecer.length>25);for(const id of a.contrastes)assert(all.some(x=>x.q.id===id));
  if(q.fontes){const entry=sources.itens.find(x=>x.id===q.id);assert(entry);assert.deepEqual(entry.fontes.map(f=>f.arquivo),q.fontes);for(const f of entry.fontes){const raw=fs.readFileSync(path.join(root,f.arquivo));assert.equal(f.sha256Fonte,crypto.createHash('sha256').update(raw).digest('hex'));assert(f.fichas.every(h=>raw.toString().includes(h)));}}
  if(q.assunto==='legislacao_nr')assert(q.fontes?.length);
 }
 assert.equal(sources.itens.length,20);
});
test('caderno restaura os dois grupos ESP novos sem mudar ciclo ou IDs errados',async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();for(const [a,b]of[[315,316],[383,384]]){
  const ids=[a,b].map(n=>`TP26-ENGSEG-ESP-${String(n).padStart(4,'0')}`);r.App.type='ERRADAS';r.writeJSON(r.App.wrongKey,[ids[1]]);const cycle=Array.from(r.getCycleIds());r.generateExam();assert.deepEqual(Array.from(r.App.exam,q=>q.id),ids);assert(r.App.exam[0].statement.includes('\n\n'));assert.deepEqual(Array.from(r.getCycleIds()),cycle);assert.deepEqual(Array.from(r.readJSON(r.App.wrongKey,[])),[ids[1]]);
 }
});
test('oito provas completas inéditas em dez sementes; meta integral segue exigindo700',()=>{
 const r=run('scripts/audit-transpetro-lote6-engine.cjs');assert(r.passed);assert.equal(r.completeFreshExams,8);assert.equal(r.runs.length,10);
 const gate=spawnSync(process.execPath,['scripts/validate-transpetro.cjs'],{cwd:root,encoding:'utf8'});assert.equal(gate.status,0);assert.equal(JSON.parse(gate.stdout).total,700);assert.deepEqual(read('docs/transpetro-etapa-1-plano.json').metaAreas,{PORT:100,ING:100,ESP:500});
});
