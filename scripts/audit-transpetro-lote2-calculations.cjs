// Recálculos do lote 2, separados da autoria; examina todas as alternativas.
const { loadRows } = require('./validate-transpetro.cjs');
const all = new Map(loadRows().map(x => [x.q.id, x.q]));
const rawNumbers = s => (s.replace(/CO2/g, 'CO₂').match(/\d+(?:[.,]\d+)*/g) || []).map(v => Number(v.includes(',') ? v.replace(/\./g, '').replace(',', '.') : /^\d{1,3}(?:\.\d{3})+$/.test(v) ? v.replace(/\./g, '') : v));
const numberList = s => {
 const values=rawNumbers(s);
 if(/margem negativa/.test(s)&&values.length) values[values.length-1]*=-1;
 return values;
};
const same = (a,b) => a.length === b.length && a.every((v,i) => Math.abs(v-b[i]) < 1e-7);
const choose = (n, k) => { let v=1; for(let i=1;i<=k;i++)v=v*(n-k+i)/i; return v; };
const cases = [
 [75, [(12000+80*50-3000)]], [79, [(5+5), (8-1+1)]],

 [81, [3/30000,3/60000]], [84, [48-8+6-44]],
 [95, [800-100-180,800-100-180-450]],
 [98, [+Math.sqrt((60-10)/(0.02+0.03)).toFixed(2),60-0.02*((60-10)/(0.02+0.03))]],
 [99, [120-(6-2)*10-8*5,120-(6-2)*10-8*5-30]],
 [106, [0.20+0.15*Math.log2(16),2*(0.20+0.15*Math.log2(4))+0.25]],
 [107, [4/500*800, 4, (4/800)/(4/500)*100]],
 [110, [90/(90+10)*100]],
 [114, [+(180/(180+980)*100).toFixed(2)]],
 [115, [8+0.5+0.25,+(1/(8+0.5+0.25)).toFixed(4)]],
 [116, [20/100*100,+(10/90*100).toFixed(2)]],
 [118, [30*44/12*(1-0.20)]], [120, [(6-(6-2)*0.75)*0.5]]
];
const results = [];
function check(n, result, predicate) {
 const q=all.get(`TP26-ENGSEG-ESP-${String(n).padStart(4,'0')}`);
 const matches=q.options.map((s,i)=>predicate(s)?i:-1).filter(i=>i>=0);
 results.push({id:q.id,recalculated:result,matches,answer:q.answer,passed:matches.length===1&&matches[0]===q.answer});
}
for(const [n,expected] of cases)check(n,expected,s=>same(numberList(s),expected));
// Frações, números por extenso e lógicas discretas também são verificados.
const captured=30+40-20, estimated=30*40/20;
check(80,{estimated,observed:captured,extra:estimated-captured},s=>same(numberList(s),[estimated,captured])&&s.includes('dez além'));
const p=1-choose(8,2)/choose(10,2);
check(70,{pairs:choose(10,2),withoutError:choose(8,2),probability:p},s=>s.startsWith('17/45')&&s.includes((p*100).toFixed(2).replace('.',',')));
check(74,{events:2,injured:3},s=>s==='Dois eventos e três pessoas lesionadas.');
check(89,{before:Math.min(30,20+25),after:Math.min(30,35+25)},s=>same(numberList(s),[30])&&s.includes('nos dois casos'));
check(90,{freeAt10:6-3-2,firstPossible:20},s=>s.startsWith('Um módulo')&&same(numberList(s),[20]));
const losses={A:[2,20],B:[8,10],C:[15,4]};const worst=Object.fromEntries(Object.entries(losses).map(([k,v])=>[k,Math.max(...v)]));
const winner=Object.keys(worst).sort((a,b)=>worst[a]-worst[b])[0];check(92,{worst,winner},s=>s.startsWith(winner+',')&&same(numberList(s),[worst[winner]]));
const eligibleRoles={elabora:['Elisa','Fábio'],verifica:['Fábio'],aprova:['Elisa','Hugo']};
const validAssignments=[];
for(const a of eligibleRoles.elabora) for(const b of eligibleRoles.verifica) for(const c of eligibleRoles.aprova) {
 if(new Set([a,b,c]).size===3)validAssignments.push({elabora:a,verifica:b,aprova:c});
}
check(72,{validAssignments},s=>{
 const names=[...s.matchAll(/(\p{L}+) (elabora|verifica|aprova)/gu)];
 return names.length===3&&new Set(names.map(m=>m[1])).size===3&&names.every(m=>eligibleRoles[m[2]].includes(m[1]));
});
check(82,{distinctX:new Set([0,0,1]).size,distinctY:new Set([0,1,2]).size},s=>s.startsWith('Y,')&&s.includes('uma a uma'));
check(85,{eligible:[{name:'A',connection:'P',flow:120},{name:'B',connection:'Q',flow:150},{name:'C',connection:'P',flow:80}].filter(x=>x.connection==='P'&&x.flow>=100).map(x=>x.name)},s=>s.startsWith('A,'));
check(102,{covering:[{name:'A',lo:80,hi:100},{name:'B',lo:85,hi:110},{name:'C',lo:80,hi:110}].filter(x=>[82,91,104].every(h=>h>=x.lo&&h<=x.hi)).map(x=>x.name)},s=>s.startsWith('C,'));
check(108,{coverage:16,maxConsecutive:6,minRecovery:2},s=>{
 const spans=[...s.matchAll(/([AB]) de (\d+) a (\d+)/g)].map(m=>({person:m[1],from:+m[2],to:+m[3]}));
 let end=0;const last={};
 for(const span of spans){if(span.from!==end||span.to<=span.from||span.to-span.from>6||(last[span.person]!=null&&span.from-last[span.person]<2))return false;end=span.to;last[span.person]=span.to;}
 return spans.length>0&&end===16;
});
console.log(JSON.stringify({checked:results.length,passed:results.every(r=>r.passed),results,limitation:'Modelos e premissas dos enunciados; não são limites normativos. Regras discretas foram reavaliadas além dos cálculos numéricos.'},null,2));
process.exitCode=results.every(r=>r.passed)?0:1;
