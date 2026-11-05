// Exercita o motor real com dez sequências reproduzíveis, sem modificar app.js.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {createRuntime,select}=require('./lib/runtime.cjs');
(async()=>{
 const runs=[];
 for(let seed=1;seed<=10;seed++){
  const r=createRuntime();select(r);
  vm.runInContext(`{ let state=${seed}; Math.random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;}; }`,r.context);
  await r.loadQuestionsBank();
  // Snapshot histórico do lote 6; bancos posteriores não mudam sua capacidade auditada.
  r.App.questionsBank=r.App.questionsBank.filter(q=>q.etapa!==2&&!q.piloto_visual&&(q.lote||1)<=6);
  const seen=new Set(),exams=[];
  for(let k=0;k<9;k++){
   r.generateExam();assert.equal(r.App.exam.length,70);assert.equal(new Set(r.App.exam.map(q=>q.id)).size,70);
   const fresh={};for(const [area,n] of Object.entries({PORT:10,ING:10,ESP:50})){
    const rows=r.App.exam.filter(q=>q.area===area);assert.equal(rows.length,n);fresh[area]=rows.filter(q=>!seen.has(q.id)).length;
   }
   for(const q of r.App.exam.filter(q=>q.groupId)){
    const group=r.App.questionsBank.filter(x=>x.groupId===q.groupId),start=r.App.exam.findIndex(x=>x.id===group[0].id);
    assert(start>=0);assert.deepEqual(Array.from(r.App.exam.slice(start,start+group.length),x=>x.id),Array.from(group,x=>x.id));
   }
   if(k<8)assert.deepEqual(fresh,{PORT:10,ING:10,ESP:50});else assert.deepEqual(fresh,{PORT:10,ING:10,ESP:0});
   for(const q of r.App.exam)seen.add(q.id);exams.push({prova:k+1,ineditas:fresh});
  }
  runs.push({seed,exams});
 }
 console.log(JSON.stringify({passed:true,completeFreshExams:8,runs,reason:'400 específicas permitem oito completas inéditas, confirmadas em dez sementes com grupos íntegros. Na nona, ESP renova seu ciclo: 50 repetidas no histórico de vida, enquanto PORT/ING ainda usam 10 inéditas cada. Contagem de inéditas usa o conjunto global desta execução, não redefine repetidas como inéditas após renovar o ciclo.'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
