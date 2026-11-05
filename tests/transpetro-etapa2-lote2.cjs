const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),vm=require('node:vm');
const {createRuntime,select,root}=require('../scripts/lib/runtime.cjs');const {read,digest}=require('../scripts/validate-transpetro.cjs');
test('auditoria920: 100novas, 45figuras, 76verificações, 86950pares e preservação820',()=>{
 const audit=JSON.parse(cp.execFileSync(process.execPath,['scripts/audit-transpetro-etapa2-lote2.cjs'],{cwd:root,encoding:'utf8'}));assert(audit.passed);assert.equal(audit.total,920);assert.equal(audit.calculations.length,76);assert.equal(audit.pairs,86950);assert.deepEqual(audit.alerts,[]);
 const reviewed=read('docs/transpetro-etapa2-lote2-auditoria.json');assert.deepEqual(audit,reviewed);
 const qs=read('data/transpetro/etapa2/lote2.json');for(const q of qs){const item=reviewed.items.find(x=>x.id===q.id);assert.equal(item.sha256,digest(q));}
});
test('920 carregados uma única vez em FULL/ESP/ERRADAS; sem formato VISUAIS',async()=>{
 const r=createRuntime();for(const type of ['FULL','ESP','ERRADAS']){select(r,'TRANSPETRO','ENG_SEG',type);await r.loadQuestionsBank();assert.equal(r.App.questionsBank.length,920);assert.equal(new Set(r.App.questionsBank.map(q=>q.id)).size,920);assert.equal(r.App.questionsBank.filter(q=>q.piloto_visual).length,20);}
 assert(!r.CONCURSOS.TRANSPETRO.formatos.VISUAIS);select(r,'TRANSPETRO','ENG_SEG','VISUAIS');assert.throws(()=>r.generateExam(),/Tipo de simulado inválido/);
});
test('dez completas inéditas em dez sementes; matriz e grupos preservados; pilotos/newESP sorteáveis',async()=>{
 for(let seed=1;seed<=10;seed++){
  const r=createRuntime();select(r);vm.runInContext(`{let s=${seed};Math.random=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}`,r.context);await r.loadQuestionsBank();const seen=new Set();
  for(let i=0;i<10;i++){r.generateExam();assert.equal(r.App.exam.length,70);assert.equal(r.App.exam.filter(q=>q.area==='PORT').length,10);assert.equal(r.App.exam.filter(q=>q.area==='ING').length,10);assert.equal(r.App.exam.filter(q=>q.area==='ESP').length,50);
   for(const q of r.App.exam){assert(!seen.has(q.id));seen.add(q.id);if(q.groupId){const g=r.App.questionsBank.filter(x=>x.groupId===q.groupId),start=r.App.exam.findIndex(x=>x.id===g[0].id);assert.deepEqual(Array.from(r.App.exam.slice(start,start+g.length),x=>x.id),Array.from(g,x=>x.id));}}
  }
  assert([...seen].some(id=>id.startsWith('TP26-VIS-')));assert([...seen].some(id=>id.startsWith('TP26-E2L2-')));
  r.generateExam();assert(r.App.exam.filter(q=>q.area==='PORT'||q.area==='ING').every(q=>seen.has(q.id)));assert(r.App.exam.filter(q=>q.area==='ESP').every(q=>!seen.has(q.id)));
 }
});
test('histórico VISUAIS e IDs vistos/errados antigos sobrevivem à integração',async()=>{
 const r=createRuntime();select(r);const old={contest:'TRANSPETRO',role:'ENG_SEG',type:'VISUAIS',mode:'TREINO',date:'2026-01-01',correct:19,total:20,percent:95,timeMs:1000,byArea:{ESP:{correct:19,total:20}},bySubject:{ESP:{higiene_ocupacional:{correct:19,total:20}}}};
 r.writeJSON(r.App.historyKey,[old]);r.writeJSON(r.App.wrongKey,['TP26-VIS-ESP-0001']);r.writeJSON(r.App.seenKey,['TP26-VIS-ESP-0002']);
 const saved=new Map(r.storage);await r.loadQuestionsBank();for(const [key,value] of saved)assert.equal(r.storage.get(key),value);
 assert.deepEqual({...r.aggregateHistory().aggArea.ESP},{correct:19,total:20});
 r.App.type='ESP';r.generateExam();assert(r.App.exam.every(q=>q.id!=='TP26-VIS-ESP-0002'));assert(r.readJSON(r.App.seenKey,[]).includes('TP26-VIS-ESP-0002'));
 select(r,'TRANSPETRO','ENG_SEG','ERRADAS');r.generateExam();assert.equal(r.App.exam[0].id,'TP26-VIS-ESP-0001');assert(r.App.exam[0].imagens.length);
 r.App.answers=new Map();r.saveResults(r.computeScore());assert.deepEqual(JSON.parse(JSON.stringify(r.readJSON(r.App.historyKey,[])[1])),old);
 select(r,'ALERO','ARQ');assert.deepEqual(Array.from(r.readJSON(r.App.historyKey,[])),[]);assert.equal(r.getCycleIds().size,0);
});
test('caderno recupera IDs do lote2, imagem, pontuação e estatística por assunto',async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();const qs=r.App.questionsBank.filter(q=>q.id.startsWith('TP26-E2L2-'));
 const visual=qs.find(q=>q.imagens?.length),norm=qs.find(q=>q.assunto==='legislacao_nr');r.writeJSON(r.App.wrongKey,[visual.id,norm.id]);select(r,'TRANSPETRO','ENG_SEG','ERRADAS');r.generateExam();
 assert.equal(r.App.exam.length,2);r.App.answers=new Map([[norm.id,norm.answer],[visual.id,(visual.answer+1)%5]]);const score=r.computeScore();assert.equal(score.correct,1);assert.equal(score.total,2);assert.equal(score.wrongDetails[0].imagens[0].src,visual.imagens[0].src);r.saveResults(score);
 assert.deepEqual(Array.from(r.readJSON(r.App.wrongKey,[])),[visual.id]);assert.equal(r.aggregateHistory().aggSubject.ESP.legislacao_nr.correct,1);
});
test('quatorze específicos inéditos em cinco sementes com720ESP e grupos íntegros',async()=>{
 for(let seed=1;seed<=5;seed++){const r=createRuntime();select(r,'TRANSPETRO','ENG_SEG','ESP');vm.runInContext(`{let s=${seed};Math.random=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}`,r.context);await r.loadQuestionsBank();const seen=new Set();for(let k=0;k<14;k++){r.generateExam();assert.equal(r.App.exam.length,50);for(const q of r.App.exam){assert(!seen.has(q.id));seen.add(q.id);if(q.groupId){const block=r.App.questionsBank.filter(x=>x.groupId===q.groupId),start=r.App.exam.findIndex(x=>x.id===block[0].id);assert.deepEqual(Array.from(r.App.exam.slice(start,start+block.length),x=>x.id),Array.from(block,x=>x.id));}}}assert.equal(seen.size,700);}
});
