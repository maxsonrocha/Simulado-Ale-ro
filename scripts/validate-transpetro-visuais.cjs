const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {createRuntime,select,root}=require('./lib/runtime.cjs');const {loadRows,normalize}=require('./validate-transpetro.cjs');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),qs=read('data/transpetro/pilotos_visuais.json'),models=read('docs/transpetro-visuais-dados.json');
const r=createRuntime();select(r);assert.deepEqual(Array.from(r.validateBank(qs)),[]);assert.equal(qs.length,20);assert.equal(new Set(qs.map(q=>q.id)).size,20);
const old=Array.from(loadRows(),x=>x.q),results=[];const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
for(const q of qs){assert(/^TP26-VIS-ESP-\d{4}$/.test(q.id));assert(q.piloto_visual===true&&!old.some(x=>x.id===q.id));assert(q.referencias.length&&q.fontes.every(f=>fs.existsSync(path.join(root,f))));assert.equal(new Set(q.options.map(normalize)).size,5);assert(q.explanation.length>40);
 for(const im of q.imagens){assert(fs.existsSync(path.join(root,im.src)));const svg=fs.readFileSync(path.join(root,im.src),'utf8');assert(svg.includes('viewBox="0 0 900 500"'));assert(svg.includes('<title')&&svg.includes('<desc'));assert(!/<script|<foreignObject|\son\w+=|(?:href|src)=["'](?:https?:|data:|\/\/)/i.test(svg));assert(im.alt.length>60&&im.legenda);}
}
assert.deepEqual(['media','alta','muito_alta'].map(d=>qs.filter(q=>q.difficulty===d).length),[4,9,7]);assert.deepEqual([0,1,2,3,4].map(a=>qs.filter(q=>q.answer===a).length),[4,4,4,4,4]);
// Resultados da segunda resolução editorial; os dados brutos são recalculados abaixo.
const expected = {
  1:{total:6,fraction:1/6}, 2:{IQRs:[10,30],medians:[20,20]}, 3:{first:7},
  4:{inside:['Q']}, 5:{ratios:[2,2,2,2],differences:[5,10,15,20]},
  6:{outside:true}, 7:{cuts:[['C','T']]}, 8:{conditional:45/70},
  9:{A:[1,2,0]}, 10:{above:[1]}, 11:{b:25,percent:50}, 12:{uncovered:['R']},
  13:{effectiveLengths:[3,2],ratio:2.25}, 14:{integral:56,mean:5.6},
  15:{lengths:[10,8]}, 16:{energy:2900,area:30,density:2900/30},
  17:{N:20,ranked:[{bin:[0,5],from:1,to:9},{bin:[5,10],from:10,to:11},{bin:[10,20],from:12,to:19},{bin:[20,40],from:20,to:20}],medianRanks:[10,11]},
  18:{costs:[16,17,26]}, 19:{balance:0,intensity:4}, 20:{amplitudes:[10,2,5]}
};
function check(n,calculation,accept){assert.deepEqual(calculation,expected[n],`Segunda resolução: piloto ${n}`);const q=qs[n-1],matches=q.options.flatMap((s,i)=>accept(s)?[i]:[]);assert.deepEqual(matches,[q.answer],q.id);results.push({id:q.id,calculation,matches,answer:q.answer,sha256:sha(q),figuras:q.imagens.map(i=>({src:i.src,sha256:sha(fs.readFileSync(path.join(root,i.src),'utf8'))}))});}
const d=n=>models[n-1].dados;
check(1,{total:d(1).hours.reduce((a,b)=>a+b),fraction:d(1).hours[2]/d(1).hours.reduce((a,b)=>a+b)},s=>s.startsWith('1/6,'));
check(2,{IQRs:[d(2).A,d(2).B].map(a=>a[3]-a[1]),medians:[d(2).A[2],d(2).B[2]]},s=>s.startsWith('Mesma mediana; amplitude interquartil de B é tripla'));
let run=0,first;d(3).values.forEach((v,i)=>{run=v>d(3).baseline?run+1:0;if(run===6&&!first)first=i+1;});check(3,{first},s=>s===`Na ${first}.`);
const m4=d(4),inside=Object.entries(m4.points).filter(([,p])=>Math.hypot(p[0]-m4.center[0],p[1]-m4.center[1])<m4.radius).map(([s])=>s);check(4,{inside},s=>s==='Somente Q.'&&inside.join('')==='Q');
check(5,{ratios:d(5).pairs.map(([a,b])=>b/a),differences:d(5).pairs.map(([a,b])=>b-a)},s=>s.startsWith('Há relação linear forte, masB registra o dobro'));
check(6,{outside:d(6).target>d(6).calibrationRange[1]},s=>s.startsWith('É extrapolação;'));
function reaches(edges){const todo=['S'],seen=new Set();while(todo.length){const v=todo.pop();if(v==='T')return true;if(seen.has(v))continue;seen.add(v);for(const [a,b]of edges)if(a===v)todo.push(b);}return false;}
const cuts=d(7).openEdges.filter(e=>!reaches(d(7).openEdges.filter(x=>x!==e)));check(7,{cuts},s=>s==='C→T.'&&cuts.length===1&&cuts[0].join('')==='CT');
check(8,{conditional:d(8).counts[1]/(d(8).counts[0]+d(8).counts[1])},s=>s.startsWith('45/70'));
check(9,{A:[0,1,2].map(c=>d(9).matrix.filter(row=>row[c]==='A').length)},s=>s.startsWith('T 2 por duplicidade'));
check(10,{above:d(10).observed.flatMap((v,i)=>v>d(10).limits[i]?[i]:[])},s=>s==='Somente B.');
const m11=d(11),b=m11.initial[1]+m11.AtoB-m11.BtoA;check(11,{b,percent:b/(m11.initial[0]+m11.initial[1])*100},s=>s==='25 registros; 50%.');
const m12=d(12),inRect=(p,b)=>p[0]>=b[0]&&p[0]<=b[1]&&p[1]>=b[2]&&p[1]<=b[3],out=Object.entries(m12.points).filter(([,p])=>!inRect(p,m12.A)&&!inRect(p,m12.B)).map(([k])=>k);check(12,{uncovered:out},s=>s==='R.'&&out.join('')==='R');
const le=d(13).L.map((x,i)=>x*d(13).K[i]);check(13,{effectiveLengths:le,ratio:(le[0]/le[1])**2},s=>s.startsWith('2,25; a comparação ideal'));
const points=d(14).points;let integral=0;for(let i=1;i<points.length;i++)integral+=(points[i][0]-points[i-1][0])*(points[i][1]+points[i-1][1])/2;check(14,{integral,mean:integral/(points.at(-1)[0]-points[0][0])},s=>s==='5,6 mg/m³.');
function distance(p){return p.slice(1).reduce((sum,v,i)=>sum+Math.hypot(v[0]-p[i][0],v[1]-p[i][1]),0);}
check(15,{lengths:[distance(d(15).routeA),distance(d(15).routeB)]},s=>s.startsWith('B com 8 m; a rota até A mede 10 m'));
const f=d(16),energy=f.count*f.massEach*f.heat1+f.mass2*f.heat2;check(16,{energy,area:f.area[0]*f.area[1],density:energy/(f.area[0]*f.area[1])},s=>s.startsWith('Aproximadamente 96,7 MJ/m²;'));
const f17=d(17),N=f17.frequencies.reduce((a,b)=>a+b);let sum=0;const ranked=f17.frequencies.map((n,i)=>({bin:f17.bins[i],from:sum+1,to:(sum+=n)}));check(17,{N,ranked,medianRanks:[N/2,N/2+1]},s=>s.startsWith('Está em[5,10), mas seu valor exato'));
check(18,{costs:d(18).false.map((x,i)=>x*d(18).weights[0]+d(18).miss[i]*d(18).weights[1])},s=>s==='10, com custo 16.');
check(19,{balance:d(19).intake-d(19).evaporation-d(19).discharge,intensity:d(19).intake/d(19).production},s=>s.startsWith('4 m³/t; 20=12+8'));
check(20,{amplitudes:d(20).ranges.map(([a,b])=>b-a)},s=>s.startsWith('Pressão, amplitude 10;'));
// Triagem contra os700 e os19 demais; não confundir com prova semântica absoluta.
const words=s=>new Set(normalize(s).split(' ').filter(w=>w.length>3)),jaccard=(a,b)=>[...a].filter(x=>b.has(x)).length/(new Set([...a,...b]).size||1),pairs=[];
for(let i=0;i<qs.length;i++)for(const q of [...old,...qs.slice(i+1)]){const score=jaccard(words(qs[i].statement),words(q.statement));if(score>.6)pairs.push({a:qs[i].id,b:q.id,score});}
assert.deepEqual(pairs,[]);
console.log(JSON.stringify({passed:true,manifestSha256:sha(fs.readFileSync(path.join(root,'docs/transpetro-visuais-dados.json'),'utf8')),total:20,figuras:20,resolucoes:results,comparacoesLexicais:14190,alertas:pairs,limitacao:'Revisão editorial dirigida, não garantia automática de originalidade semântica. Referências externas identificáveis; acesso externo403 registrado.'},null,2));
