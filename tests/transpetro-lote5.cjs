const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync,spawnSync}=require('node:child_process');const {loadRows,read,digest,validate}=require('../scripts/validate-transpetro.cjs');const {root,createRuntime,select}=require('../scripts/lib/runtime.cjs');
const run=file=>JSON.parse(execFileSync(process.execPath,[file],{cwd:root,encoding:'utf8'}));
test('lote 5 preserva os 400 itens na ordem e todos os pareceres/corpus anteriores',()=>{
 let preserved=0,added=0;
 for(const name of fs.readdirSync(path.join(root,'data/transpetro/eng_seguranca')).filter(f=>f.endsWith('.json'))){
  const file=`data/transpetro/eng_seguranca/${name}`,before=JSON.parse(execFileSync('git',['show',`9c7d51d:${file}`],{cwd:root,encoding:'utf8'})),now=read(file).filter(q=>(q.lote||1)<=5);assert.deepEqual(now.slice(0,before.length),before);preserved+=before.length;
  const delta=now.slice(before.length);assert(delta.every(q=>q.lote===5));added+=delta.length;
 }
 assert.equal(preserved,400);assert.equal(added,100);
 const files=execFileSync('git',['ls-tree','-r','--name-only','9c7d51d','docs/auditorias','references/transpetro'],{cwd:root,encoding:'utf8'}).trim().split('\n');
 for(const file of files)assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`9c7d51d:${file}`],{cwd:root}));
});
test('lote 5 cumpre áreas, assuntos, dificuldades, letras e IDs; acumulado é 500',()=>{
 const snapshotPlan=JSON.parse(execFileSync('git',['show','538307c:docs/transpetro-etapa-1-plano.json'],{cwd:root,encoding:'utf8'}));const r=validate({partial:true,rows:loadRows().filter(x=>(x.q.lote||1)<=5),plan:snapshotPlan});assert.deepEqual(r.errors,[]);assert.equal(r.total,500);assert.deepEqual(r.areas,{PORT:100,ING:100,ESP:300});assert.equal(r.groups,100);assert.equal(r.linkedQuestions,200);assert.equal(r.independentQuestions,300);
 const qs=Array.from(loadRows(),x=>x.q).filter(q=>q.lote===5);
 for(const [area,n,offset,levels]of[['PORT',20,80,[4,9,7]],['ING',20,80,[4,9,7]],['ESP',60,240,[12,27,21]]]){
  const a=qs.filter(q=>q.area===area);assert.equal(a.length,n);assert.deepEqual(['media','alta','muito_alta'].map(l=>a.filter(q=>q.difficulty===l).length),levels);assert.deepEqual([0,1,2,3,4].map(v=>a.filter(q=>q.answer===v).length),Array(5).fill(n/5));assert.deepEqual(a.map(q=>+q.id.slice(-4)).sort((a,b)=>a-b),Array.from({length:n},(_,i)=>offset+i+1));
 }
 const counts=Object.fromEntries(Object.keys(read('docs/transpetro-etapa-1-plano.json').metaAssuntosESP).map(s=>[s,qs.filter(q=>q.assunto===s).length]));
 assert.deepEqual(counts,{prevencao_riscos:14,legislacao_nr:10,higiene_ocupacional:11,gerenciamento_riscos:9,gestao_sms:6,acidentes:3,emergencias:2,incendio:2,ergonomia:1,saude_ocupacional:1,desenvolvimento_sustentavel:1});
});
test('23 segundas resoluções novas validam uma única alternativa real',()=>{const r=run('scripts/audit-transpetro-lote5-calculations.cjs');assert.equal(r.checked,23);assert(r.passed);assert(r.results.every(x=>x.matches.length===1));});
test('124750 pares incluem os 40000 novos/antigos e 4950 novos/novos',()=>{
 const r=JSON.parse(execFileSync(process.execPath,['scripts/audit-transpetro-similarity.cjs','--lote','5'],{cwd:root,encoding:'utf8'}));assert.equal(r.lote,5);assert.equal(r.comparedPairs,124750);assert.deepEqual(r.scopes,{novas_novas:4950,novas_antigas:40000,antigas_antigas:79800});assert.deepEqual(r.flagged,[]);
});
test('100 pareceres e 500 alternativas estão vinculados a fontes e conteúdo atuais',()=>{
 const semantic=read('docs/auditorias/transpetro-etapa-1-lote-5-semantica.json'),review=read('docs/auditorias/transpetro-etapa-1-lote-5-conteudo.json'),sources=read('docs/auditorias/transpetro-etapa-1-lote-5-fontes.json'),all=loadRows();
 assert.equal(semantic.inventarioAnterior.length,400);assert.equal(semantic.revisoes.length,100);assert.equal(review.itens.reduce((n,x)=>n+x.alternativas.length,0),500);
 for(const {q}of all.filter(x=>x.q.lote===5)){
  const s=semantic.revisoes.find(x=>x.id===q.id);assert(s);assert.equal(s.sha256,digest(q));assert(s.operacao.length>15);for(const id of s.contrastes)assert(all.some(x=>x.q.id===id));
  if(q.fontes){const entry=sources.itens.find(x=>x.id===q.id);assert(entry);assert.deepEqual(entry.fontes.map(x=>x.arquivo),Array.from(q.fontes));for(const f of entry.fontes){const raw=fs.readFileSync(path.join(root,f.arquivo));assert.equal(f.sha256Fonte,crypto.createHash('sha256').update(raw).digest('hex'));assert(f.fichas.every(x=>raw.toString().includes(x)));}}
  if(q.assunto==='legislacao_nr')assert(q.fontes?.length);
 }
 assert.equal(sources.itens.length,10);
});
test('caderno recupera o novo grupo em cada língua, sem mudar ciclo ou IDs errados',async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();for(const area of['PORT','ING']){
  r.App.type='ERRADAS';const wrong=`TP26-ENGSEG-${area}-0082`;r.writeJSON(r.App.wrongKey,[wrong]);const cycle=Array.from(r.getCycleIds());r.generateExam();assert.deepEqual(Array.from(r.App.exam,q=>q.id),[`TP26-ENGSEG-${area}-0081`,wrong]);assert(r.App.exam[0].statement.includes('\n\n'));assert.deepEqual(Array.from(r.getCycleIds()),cycle);assert.deepEqual(Array.from(r.readJSON(r.App.wrongKey,[])),[wrong]);
 }
});
test('motor confirma seis completas inéditas em dez sementes e meta integral aprova700',()=>{
 const r=run('scripts/audit-transpetro-lote5-engine.cjs');assert(r.passed);assert.equal(r.completeFreshExams,6);assert.equal(r.runs.length,10);
 const gate=spawnSync(process.execPath,['scripts/validate-transpetro.cjs'],{cwd:root,encoding:'utf8'});assert.equal(gate.status,0);assert.equal(JSON.parse(gate.stdout).total,700);
 const plan=read('docs/transpetro-etapa-1-plano.json');assert.deepEqual(plan.metaAreas,{PORT:100,ING:100,ESP:500});
});
