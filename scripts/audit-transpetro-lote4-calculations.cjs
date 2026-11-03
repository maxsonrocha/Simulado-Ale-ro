// Segunda resolução, independente do script temporário de autoria.
const {loadRows}=require('./validate-transpetro.cjs');
const rows=new Map(loadRows().map(x=>[x.q.id,x.q]));const results=[];
const numbers=s=>(s.match(/\d+(?:[.,]\d+)*/g)||[]).map(v=>Number(v.includes(',')?v.replace(/\./g,'').replace(',','.'):v));
const equal=(a,b)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<1e-7);
function check(n,calculation,predicate){const q=rows.get(`TP26-ENGSEG-ESP-${String(n).padStart(4,'0')}`);const matches=q.options.flatMap((s,i)=>predicate(s)?[i]:[]);results.push({id:q.id,segundaResolucao:calculation,matches,answer:q.answer,passed:matches.length===1&&matches[0]===q.answer});}
function values(n,expected,method){check(n,{expected,method},s=>equal(numbers(s),expected));}
check(186,{hoursBefore:6,requiredBefore:8,missing:8-6,afterCannotSupplyBefore:true},s=>s.includes('pelo menos 8 h antes')&&s.includes('incompleta'));
const last=new Date('2025-03-10T00:00:00Z'),due=new Date(last);due.setUTCFullYear(due.getUTCFullYear()+2);
const proposals=[['P',8,'2027-03-09'],['Q',6,'2027-03-09'],['R',8,'2027-03-11']];
const eligible=proposals.filter(([,h,date])=>h>=8&&new Date(date+'T00:00:00Z')<=due).map(x=>x[0]);
check(191,{due:due.toISOString(),eligible},s=>{const labels=s.match(/\b[PQR]\b/g)||[];return labels.length===eligible.length&&labels.every(x=>eligible.includes(x));});
values(201,[240/150,240/1.2],'Área pelo teto de pressão e teste independente da placa atual.');
// Integração v(t): retângulo durante atraso, triângulo até parar.
const stoppingTime=4/2,distance=4*.5+(4+0)/2*stoppingTime;
values(204,[distance,distance-5],'Área sob velocidade versus tempo, duas fases.');
values(205,[20/(1+1),20/(.5+.5)],'Equilíbrio pela soma das componentes verticais das duas trações.');
const totalFall=[1.8,1.2,1.5,1].reduce((a,b)=>a+b,0);
check(206,{totalFall,before:5-totalFall,after:6-totalFall},s=>equal(numbers(s),[totalFall,.5,.5])&&s.includes('falta 0,5')&&s.includes('sobra 0,5'));
// Busca numérica da raiz por bisseção, em vez da manipulação logarítmica da autoria.
let lo=0,hi=100;for(let i=0;i<70;i++){const t=(lo+hi)/2;if(100*Math.exp(-t/(50000*1e-4))>10)lo=t;else hi=t;}
// ln10 fornecido é arredondado: tolerância de 0,003 s para a aproximação 2,303.
const rcTime=(lo+hi)/2;check(207,{rcTime,roundedInputLn:2.303,toleranceSeconds:.003},s=>numbers(s).length===1&&Math.abs(numbers(s)[0]-rcTime)<.003);
const conflicts=new Set(['AB','BC','CD']);const goodPair=s=>!conflicts.has([...s].sort().join(''));
const schedules=[['AC','BD'],['AB','CD'],['AD','BC'],['AB','CA'],['BC','AD']];
const valid=schedules.filter(ps=>new Set(ps.join('')).size===4&&ps.every(goodPair));
check(208,{valid},s=>{const letters=s.match(/\b[ABCD]\b/g)||[];return letters.length===4&&new Set(letters).size===4&&goodPair(letters.slice(0,2))&&goodPair(letters.slice(2));});
values(214,[40/(.2+.3),40/.2],'Balanço de quedas de temperatura: mesma taxa nas resistências em série.');
const variance=5+5-2*4;check(216,{variance,sd:Math.sqrt(variance)},s=>s.startsWith('√2 unidades')&&variance===2);
const sample=[1,2,2,3,4,5,6,8,20],rank=Math.ceil(.9*sample.length),p90=sample[rank-1],median=sample[(sample.length-1)/2];
check(217,{rank,p90,median,criterion:p90<=12},s=>s.startsWith(`P90=${p90} e o critério não é atendido`)&&s.includes(`mediana ${median} não pode`));
values(218,[60/2*4,50],'Inverte a sensibilidade da leitura não saturada e desfaz diluição; original leitura só dá limite inferior.');
const projects={A:[6,11],B:[5,9],C:[4,7],D:[3,4]},portfolios=[];
for(let mask=1;mask<16;mask++){const names=Object.keys(projects).filter((_,i)=>mask&(1<<i));const cost=names.reduce((v,k)=>v+projects[k][0],0),benefit=names.reduce((v,k)=>v+projects[k][1],0);if(cost<=9)portfolios.push({names,cost,benefit});}
const best=portfolios.filter(p=>p.benefit===Math.max(...portfolios.map(x=>x.benefit)));
check(225,{feasiblePortfolios:portfolios,best},s=>{const names=s.split(',')[0].match(/[ABCD]/g)||[];return best.length===1&&equal(numbers(s),[best[0].cost,best[0].benefit])&&names.join('')===best[0].names.join('');});
const covered=.0002*.8*(100/2),uncovered=.0002*.2*(1000/2);
check(226,{covered,uncovered,total:covered+uncovered},s=>Math.abs(numbers(s)[0]-(covered+uncovered))<1e-9);
const scenarios=[{n:1,f:.030},{n:3,f:.005},{n:10,f:.001}],tail=scenarios.filter(x=>x.n>=3).reduce((v,x)=>v+x.f,0);
check(227,{tail,accepted:tail<=.005},s=>equal(numbers(s),[3,tail])&&s.includes('não é atendido'));
// Reconstrução de conjuntos concretos: 30 em ambos; A somente 20; B somente 10; nenhum 10.
const workers=Array.from({length:70},(_,i)=>({a:i<50,b:i<30||(i>=50&&i<60)}));
const both=workers.filter(w=>w.a&&w.b).length;
values(229,[both,workers.length,+(both/workers.length*100).toFixed(2)],'Contagem por pessoa e interseção, não soma de participações.');
const baseline=40*.5/.04,after=40*.3/.04;
values(239,[baseline,after,100*(1-after/baseline)],'Equilíbrio de momento em duas geometrias e redução relativa à força inicial.');
const passed=results.every(x=>x.passed);console.log(JSON.stringify({checked:results.length,passed,results,limites:'14 recálculos numéricos e três verificações discretas/temporais. Parâmetros físicos são os modelos dos enunciados; horas e intervalo da NR-35 são do corpus. Não atestam condições reais de projeto.'},null,2));process.exitCode=passed?0:1;
