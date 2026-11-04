const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync,spawnSync}=require('node:child_process');
const {loadRows,read,digest,validate}=require('../scripts/validate-transpetro.cjs');
const {root,createRuntime,select}=require('../scripts/lib/runtime.cjs');
const run=file=>JSON.parse(execFileSync(process.execPath,[file],{cwd:root,encoding:'utf8'}));
test('lote 4 conserva exatamente os 300 itens anteriores e suas auditorias históricas',()=>{
 let preserved=0,added=0;
 for(const name of fs.readdirSync(path.join(root,'data/transpetro/eng_seguranca')).filter(f=>f.endsWith('.json'))){
  const file=`data/transpetro/eng_seguranca/${name}`,before=JSON.parse(execFileSync('git',['show',`5b51b64:${file}`],{cwd:root,encoding:'utf8'})),now=read(file).filter(q=>(q.lote||1)<=4);
  assert.deepEqual(now.slice(0,before.length),before);preserved+=before.length;
  const delta=now.slice(before.length);assert(delta.every(q=>q.lote===4));added+=delta.length;
 }
 assert.equal(preserved,300);assert.equal(added,100);
 const oldFiles=execFileSync('git',['ls-tree','-r','--name-only','5b51b64','docs/auditorias','references/transpetro'],{cwd:root,encoding:'utf8'}).trim().split('\n');
 for(const file of oldFiles)assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`5b51b64:${file}`],{cwd:root}));
});
test('400 itens e cotas exatas de área, assunto, dificuldade, grupos e gabaritos do lote 4',()=>{
 const snapshotPlan=JSON.parse(execFileSync('git',['show','9c7d51d:docs/transpetro-etapa-1-plano.json'],{cwd:root,encoding:'utf8'}));
 const report=validate({partial:true,rows:loadRows().filter(x=>(x.q.lote||1)<=4),plan:snapshotPlan});assert.deepEqual(report.errors,[]);assert.equal(report.total,400);assert.equal(report.groups,80);assert.equal(report.linkedQuestions,160);assert.equal(report.independentQuestions,240);
 const qs=Array.from(loadRows(),x=>x.q).filter(q=>q.lote===4);
 for(const [area,n,offset,levels]of[['PORT',20,60,[4,9,7]],['ING',20,60,[4,9,7]],['ESP',60,180,[12,27,21]]]){
  const a=qs.filter(q=>q.area===area);assert.equal(a.length,n);
  assert.deepEqual(['media','alta','muito_alta'].map(l=>a.filter(q=>q.difficulty===l).length),levels);
  assert.deepEqual([0,1,2,3,4].map(v=>a.filter(q=>q.answer===v).length),Array(5).fill(n/5));
  assert.deepEqual(a.map(q=>+q.id.slice(-4)).sort((a,b)=>a-b),Array.from({length:n},(_,i)=>offset+i+1));
 }
 const counts=Object.fromEntries(Object.keys(read('docs/transpetro-etapa-1-plano.json').metaAssuntosESP).map(s=>[s,qs.filter(q=>q.assunto===s).length]));
 assert.deepEqual(counts,{prevencao_riscos:14,legislacao_nr:14,higiene_ocupacional:11,gerenciamento_riscos:8,gestao_sms:3,acidentes:4,emergencias:2,incendio:2,ergonomia:1,saude_ocupacional:1,desenvolvimento_sustentavel:0});
});
test('17 segundas resoluções selecionam alternativa única nos dados reais',()=>{
 const r=run('scripts/audit-transpetro-lote4-calculations.cjs');assert.equal(r.checked,17);assert(r.passed);assert(r.results.every(x=>x.matches.length===1));
});
test('34.950 confrontos novos e regressão dos 44.850 pares antigos não têm alertas lexicais finais',()=>{
 const r=JSON.parse(execFileSync(process.execPath,['scripts/audit-transpetro-similarity.cjs','--lote','4'],{cwd:root,encoding:'utf8'}));assert.equal(r.lote,4);assert.equal(r.comparedPairs,79800);assert.deepEqual(r.scopes,{novas_novas:4950,novas_antigas:30000,antigas_antigas:44850});assert.deepEqual(r.flagged,[]);
});
test('100 pareceres editoriais, 500 alternativas e fontes estão ligados aos hashes atuais',()=>{
 const semantic=read('docs/auditorias/transpetro-etapa-1-lote-4-semantica.json'),review=read('docs/auditorias/transpetro-etapa-1-lote-4-conteudo.json'),sources=read('docs/auditorias/transpetro-etapa-1-lote-4-fontes.json');
 assert.equal(semantic.inventarioAnterior.length,300);assert.equal(semantic.revisoes.length,100);assert.equal(review.itens.length,100);assert.equal(review.itens.reduce((n,x)=>n+x.alternativas.length,0),500);
 for(const {q}of loadRows().filter(x=>x.q.lote===4)){
  const s=semantic.revisoes.find(x=>x.id===q.id);assert(s);assert.equal(s.sha256,digest(q));assert(s.operacao.length>15);
  for(const id of s.contrastesAntigos)assert(semantic.inventarioAnterior.some(x=>x.id===id));
  if(q.fontes){const entry=sources.itens.find(x=>x.id===q.id);assert(entry);assert.deepEqual(entry.fontes.map(x=>x.arquivo),Array.from(q.fontes));
   for(const source of entry.fontes){const raw=fs.readFileSync(path.join(root,source.arquivo));assert.equal(source.sha256Fonte,crypto.createHash('sha256').update(raw).digest('hex'));assert(source.fichas.every(f=>raw.toString().includes(f)));}
  }
  if(q.assunto==='legislacao_nr')assert(q.fontes?.length);
 }
 const sections=sources.itens.flatMap(x=>x.fontes.flatMap(f=>f.fichas));for(const required of ['NR-18','NR-23','NR-33'])assert(sections.includes(required));
});
test('caderno real recupera contexto e ordem dos dois novos grupos sem avançar o ciclo',async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();
 for(const area of ['PORT','ING']){
  r.App.type='ERRADAS';const wrong=`TP26-ENGSEG-${area}-0062`;r.writeJSON(r.App.wrongKey,[wrong]);const cycle=Array.from(r.getCycleIds());r.generateExam();
  assert.deepEqual(Array.from(r.App.exam,q=>q.id),[`TP26-ENGSEG-${area}-0061`,wrong]);assert(r.App.exam[0].statement.includes('\n\n'));assert.deepEqual(Array.from(r.getCycleIds()),cycle);assert.deepEqual(Array.from(r.readJSON(r.App.wrongKey,[])),[wrong]);
 }
});
test('motor real confirma quatro provas inéditas em dez sementes e o gate integral aprova as700 atuais',()=>{
 const r=run('scripts/audit-transpetro-lote4-engine.cjs');assert(r.passed);assert.equal(r.completeFreshExams,4);assert.equal(r.runs.length,10);
 const gate=spawnSync(process.execPath,['scripts/validate-transpetro.cjs'],{cwd:root,encoding:'utf8'});assert.equal(gate.status,0);assert.equal(JSON.parse(gate.stdout).total,700);
});
