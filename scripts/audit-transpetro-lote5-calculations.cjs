// Segunda resolução independente da autoria temporária. Não altera os bancos.
const {loadRows}=require('./validate-transpetro.cjs');const qs=new Map(loadRows().map(x=>[x.q.id,x.q]));const results=[];
const nums=s=>(s.match(/\d+(?:[.,]\d+)*/g)||[]).map(v=>Number(v.includes(',')?v.replace(/\./g,'').replace(',','.'):/^[1-9]\d{0,2}(?:\.\d{3})+$/.test(v)?v.replace(/\./g,''):v));
const equal=(a,b,t=1e-7)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<t);
function check(n,calculation,accept){const q=qs.get(`TP26-ENGSEG-ESP-${String(n).padStart(4,'0')}`);const matches=q.options.flatMap((s,i)=>accept(s)?[i]:[]);results.push({id:q.id,segundaResolucao:calculation,matches,answer:q.answer,passed:matches.length===1&&matches[0]===q.answer});}
function values(n,out,method){check(n,{out,method},s=>equal(nums(s),out));}
// Conservação da quantidade proporcional a PV/T, não relação com pressão manométrica.
const amount=(200+100)*1/(27+273),p2=amount*(127+273)/1.2-100;
values(249,[+p2.toFixed(2)],'Quantidade PV/T e conversão de referência de pressão antes e depois.');
const heads=[30000,50000].map(pv=>(110000-pv)/10000+2-3);
check(250,{heads,margins:heads.map(h=>h-6)},s=>equal(nums(s),heads)&&s.includes('não atende'));
const natural=[100,400].map(m=>Math.sqrt(40000/m)/6.28),ratios=[3.2/natural[0],1.6/natural[1]];
check(251,{natural,forcing:[3.2,1.6],ratios},s=>equal(nums(s),natural.map(v=>+v.toFixed(2)))&&s.includes('mesma proximidade relativa')&&Math.abs(ratios[0]-ratios[1])<1e-10);
// Enumeração espacial em vez da equação isolada: diferença entre duas distâncias/c.
const acoustic=[];for(let x=0;x<=1000;x++)if(Math.abs(((1000-x)-x)/1000-.30)<1e-10)acoustic.push(x);
check(252,{locations:acoustic,checkTimes:[350/1000,650/1000]},s=>acoustic.length===1&&equal(nums(s),acoustic));
const candidates=[10,11,12,14,15].map(mm=>({mm,circ:2/(2*mm/1000),long:2/(4*mm/1000)}));const feasible=candidates.filter(p=>p.circ<=90&&p.long<=60);
values(253,[100,50,feasible[0].mm],'Enumera espessuras comerciais e verifica os dois esforços em cada uma.');
let consumed=0;for(const block of [{n:20000,N:100000},{n:30000,N:60000}])consumed+=block.n/block.N;
const extra=(1-consumed)*20000;values(254,[Math.round(extra)],'Orçamento de dano já usado e recomposição por um terceiro nível.');
const vx=2*1.5,vz=4,index=Math.hypot(vx,vz);check(270,{index,criterion:index<=4.5},s=>equal(nums(s),[5])&&s.includes('não atende'));
values(272,[40/(1+(4-1)*.5),40],'Modelo de tamanho efetivo com quatro replicações por grupo.');
// Busca de solução inteira e confirmação das duas respostas; não importa a solução da autoria.
const solutions=[];for(let a=0;a<=14;a++)for(let b=0;b<=17;b++)if(2*a+b===14&&a+3*b===17)solutions.push({a,b,total:a+b});
check(273,{solutions},s=>solutions.length===1&&equal(nums(s),[solutions[0].a,solutions[0].b,solutions[0].total]));
// Ajusta reta no domínio log e inverte por busca numérica.
const intercept=2,slope=(6-2)/(Math.log10(100)-Math.log10(1));let lo=1,hi=100;
for(let k=0;k<70;k++){const c=(lo+hi)/2;if(intercept+slope*Math.log10(c)<5)lo=c;else hi=c;}
values(274,[+((lo+hi)/2).toFixed(2)],'Calibração em coordenada logarítmica e inversão por bisseção.');
const planA=Array.from({length:60},(_,k)=>(60*k)%60),planB=Array.from({length:60},(_,k)=>(17*k)%60),emits=phase=>phase>=10&&phase<20;
check(275,{A:planA.filter(emits).length,B:planB.filter(emits).length,distinctB:new Set(planB).size},s=>s.startsWith('A: 0; B: 10,')&&planA.filter(emits).length===0&&planB.filter(emits).length===10);
values(277,[+(1000/1010*100).toFixed(2),+(1000/1100*100).toFixed(2)],'Tempo operacional dividido pelo ciclo operação+reparo.');
const probs={A:.1,B:.6,C:.3},costs={A:1,B:2,C:4},orders=[];
for(const a of ['A','B','C'])for(const b of ['A','B','C'])if(a!==b)orders.push({a,b,cost:probs[a]*costs[a]+(1-probs[a])*(costs[a]+costs[b])});
const minimum=Math.min(...orders.map(o=>o.cost));check(282,{orders,minimum},s=>s.startsWith('B depois A,')&&equal(nums(s),[minimum]));
const majority=p=>{let sum=0;for(let mask=0;mask<8;mask++){let failed=0,weight=1;for(let b=0;b<3;b++){const on=!!(mask&(1<<b));if(on)failed++;weight*=on?p:1-p;}if(failed>=2)sum+=weight;}return sum;};
values(283,[majority(.1),majority(.02)],'Enumera os oito estados de três canais para cada modo de erro.');
const without=Math.min(12,.2*100),perfect=.2*Math.min(12,100)+.8*Math.min(12,0);values(284,[without-perfect,perfect+8],'Otimiza ação em cada estado e compara com a melhor ação sem informação.');
const table=[[35,5],[5,5]],total=table.flat().reduce((s,x)=>s+x,0),po=(35+5)/total,row=table.map(r=>r.reduce((s,x)=>s+x,0)/total),col=[(35+5)/total,(5+5)/total],pe=row.reduce((s,v,i)=>s+v*col[i],0);
values(287,[(po-pe)/(1-pe)],'Marginais da tabela, probabilidade de acordo ao acaso e normalização de kappa.');
const suppliers=[{name:'A',T:10,E:10,eligible:false},{name:'B',T:8,E:7,eligible:true},{name:'C',T:7,E:9,eligible:true},{name:'D',T:6,E:10,eligible:true}].filter(x=>x.eligible).map(x=>({...x,score:.6*x.T+.4*x.E}));
const winner=suppliers.reduce((a,b)=>a.score>b.score?a:b);check(289,{suppliers,winner},s=>s.startsWith(winner.name+',')&&equal(nums(s),[winner.score]));
let accumulator=0;const path=[1,-2,2,1,2].map(x=>(accumulator=Math.max(0,accumulator+x-.5)));const first=path.findIndex(v=>v>=3)+1;
check(290,{path,first},s=>first===5&&s.startsWith('Na quinta,')&&equal(nums(s),[path[first-1]]));
// Encontra a raiz vertical por bisseção e verifica a posição horizontal no instante.
lo=0;hi=10;for(let k=0;k<60;k++){const t=(lo+hi)/2;if(20-10*t*t/2>0)lo=t;else hi=t;}const fall=(lo+hi)/2;
values(293,[Math.round(fall),Math.round(3*fall)],'Busca de instante de impacto e avaliação independente do movimento horizontal.');
const coverage={A:[1,2,3],B:[3,4],C:[4,5,6],D:[1,5,6]},pairs=[];const names=Object.keys(coverage);
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const pair=[names[i],names[j]],cover=new Set(pair.flatMap(n=>coverage[n]));pairs.push({pair,complete:[1,2,3,4,5,6].every(z=>cover.has(z))});}
const possible=pairs.filter(p=>p.complete);check(295,{pairs,possible},s=>possible.length===1&&(s.match(/\b[ABCD]\b/g)||[]).join('')===possible[0].pair.join(''));
check(297,{pA:-5,pB:-15,difference:(-5)-(-15),direction:'A→B'},s=>s.includes('A→B')&&s.includes('atrair fumaça'));
const conditions=Array.from({length:3},(_,priority)=>[0,1].map(equipment=>({priority,equipment}))).flat(),minShapes=Math.ceil(conditions.length/2);
check(298,{conditions:conditions.length,positions:2,minShapes,oldCapacity:2*2,newCapacity:minShapes*2},s=>s.startsWith('Passar a 3 formas')&&equal(nums(s),[minShapes,2]));
let stock=100;const stocks=[];for(let year=0;year<2;year++){const regen=stock*.1;stock=stock+regen-15;stocks.push(stock);}
values(300,[stocks[1]],'Simula separadamente regeneração e retirada em cada estoque anual.');
const passed=results.every(x=>x.passed);console.log(JSON.stringify({checked:results.length,passed,results,limites:'19 verificações numéricas e quatro discretas/geométricas/de direção. Modelos e dados dos enunciados; não se apresentam como limites legais, métodos NHO integralmente verificados ou condições suficientes de segurança real.'},null,2));process.exitCode=passed?0:1;
