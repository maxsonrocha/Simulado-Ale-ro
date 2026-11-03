// Segunda resolução: dados fixados a partir dos enunciados, sem importar a autoria.
// Confere também os distratores e raciocínios discretos presentes neste lote.
const { loadRows } = require('./validate-transpetro.cjs');
const all = new Map(loadRows().map(x => [x.q.id, x.q]));
const results=[];
function check(n,resolution,accept){
 const q=all.get(`TP26-ENGSEG-ESP-${String(n).padStart(4,'0')}`);
 const matches=q.options.flatMap((s,i)=>accept(s)?[i]:[]);
 results.push({id:q.id,segundaResolucao:resolution,matches,answer:q.answer,passed:matches.length===1&&matches[0]===q.answer});
}
// Fração molar de 15/10^6: em 1 m³ há 1000/Vm mol de gás total.
const fraction=15/1e6, molecularMassMg=98000;
const concentrations=[24.5,30].map(vm=>fraction*(1000/vm)*molecularMassMg);
check(156,{method:'Balanço molar em 1 m³, conversão g→mg, não reaplicação cega do fator pronto.',concentrations,units:'mg/m³'},s=>/^60 mg\/m³ e 49 mg\/m³\.$/.test(s)&&Math.abs(concentrations[0]-60)<1e-9&&Math.abs(concentrations[1]-49)<1e-9);
// Tempo é ida e volta da perturbação; impulso por área = rho * deltaV * a.
const roundTrip=2*(200/1000), riseMPa=(1000*1*1000)/1e6;
check(163,{roundTripSeconds:roundTrip,closingSeconds:0.2,rapid:0.2<roundTrip,riseMPa},s=>s.includes('condição rápida de 0,40 s')&&s.includes('1 MPa')&&riseMPa===1);
// Enumeração de todos os 16 estados e remoção de elementos de conjuntos suficientes.
const top=mask=>Boolean((mask&1)&&((mask&2)||(mask&4)));
const sufficient=Array.from({length:16},(_,i)=>i).filter(top);
const minimal=sufficient.filter(mask=>[1,2,4,8].every(bit=>!(mask&bit)||!top(mask^bit)));
check(168,{sufficient,minimal:minimal.map(m=>['A','B','C','D'].filter((_,i)=>m&(1<<i)))},s=>{
 const sets=[...s.matchAll(/\{([^}]+)\}/g)].map(m=>m[1].split(',').reduce((mask,k)=>mask|(1<<'ABCD'.indexOf(k)),0));
 return sets.length===minimal.length&&sets.every(x=>minimal.includes(x));
});
const points={P:[2,9],Q:[4,5],R:[5,7],S:[3,10]};
const frontier=Object.keys(points).filter(k=>!Object.keys(points).some(j=>j!==k&&points[j].every((v,i)=>v<=points[k][i])&&points[j].some((v,i)=>v<points[k][i])));
check(169,{frontier,method:'Comparação de todos os pares de vetores, sem soma ou pesos.'},s=>{
 const names=s.match(/\b[PQRS]\b/g)||[];return names.length===frontier.length&&names.every(n=>frontier.includes(n));
});
const scenarios=[{team:true,conditions:true},{team:false,conditions:true},{team:true,conditions:false}];
const possible=scenarios.flatMap((x,i)=>x.team&&x.conditions?[i+1]:[]);
check(144,{possible,method:'Conjunção das duas condições para revalidação, não duração ilimitada.'},s=>possible.length===1&&possible[0]===1&&s.startsWith('Apenas I '));
const reference=new Date('2026-11-03T00:00:00Z'), start1=new Date('2026-05-26T00:00:00Z'), start10=new Date('2027-06-01T00:00:00Z');
check(145,{nr01Effective:reference>=start1,newNr10Effective:reference>=start10,reference:reference.toISOString()},s=>s.includes('NR-01: vigente desde 26/05/2026')&&s.includes('nova NR-10: vigência em 01/06/2027')&&reference>=start1&&reference<start10);
const friday=new Date('2026-11-06T00:00:00Z');let next=new Date(friday);do{next.setUTCDate(next.getUTCDate()+1);}while([0,6].includes(next.getUTCDay()));
check(147,{method:'Calendário de exemplo sem feriados, como explicitado; ramo morte não espera dia útil.',firstWorkingDay:next.toISOString(),death:'imediato'},s=>s.startsWith('Não fatal: até segunda; fatal: de imediato.')&&next.getUTCDay()===1);
check(174,{observedFraction:8/10,observedPercent:100*8/10,populationEstimate:'Não identificável por extrapolação simples da seleção dirigida.'},s=>s.startsWith('Manter os oito achados, sem extrapolar 80%'));
const passed=results.every(r=>r.passed);
console.log(JSON.stringify({checked:results.length,passed,results,limitation:'Dois cálculos físicos e seis verificações quantitativas/discretas. Datas e PT usam apenas o corpus; parâmetros dos modelos físicos são fornecidos nos enunciados, não limites legais.'},null,2));
process.exitCode=passed?0:1;
