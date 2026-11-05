// Auditoria separada da autoria Python; somente leitura.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {createRuntime,select,root}=require('./lib/runtime.cjs');const {loadRows,read,digest,normalize}=require('./validate-transpetro.cjs');
const fresh=read('data/transpetro/etapa2/lote1.json'),models=read('docs/transpetro-etapa2-lote1-modelos.json');
const near=(a,b)=>{if(Array.isArray(a)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else if(typeof a==='number')assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);else assert.deepEqual(a,b);};
const calculations=[];const functions={
 hysteresis:a=>Math.max(...a.map(([u,v])=>Math.abs(u-v))),
 crossing:d=>d.t[1]+(d.threshold-d.c[1])*(d.t[2]-d.t[1])/(d.c[2]-d.c[1])+d.delay,
 dot:([a,b])=>a.reduce((s,v,i)=>s+v*b[i],0),interaction:a=>(a[1][1]-a[0][1])-(a[1][0]-a[0][0]),
 norm:a=>Math.sqrt(a.reduce((s,v)=>s+v*v,0)),sound:([a,b])=>10*Math.log10(10**(a/10)-10**(b/10)),
 linearLife:d=>d.t[2]+(d.v[2]-d.ref)/((d.v[1]-d.v[2])/(d.t[2]-d.t[1])),
 allocation:d=>d.sizes.map(v=>d.n*v/d.sizes.reduce((a,b)=>a+b)),confusion:([tp,fn,fp,tn])=>[tp/(tp+fn),tp/(tp+fp)],
 uncertainty:([a,b,r])=>Math.sqrt(a*a+b*b+2*r*a*b),tolerance:([s,h])=>[h[0]-s[1],h[1]-s[0]],
 regret:matrix=>{const mins=[0,1].map(i=>Math.min(...matrix.map(row=>row[i])));const worst=matrix.map(row=>Math.max(...row.map((v,i)=>v-mins[i])));return worst.indexOf(Math.min(...worst));},
 assignment:a=>Math.min(Math.max(a[0][0],a[1][1]),Math.max(a[0][1],a[1][0])),
 pairedMedian:([a,b])=>{const d=a.map((v,i)=>b[i]-v).sort((x,y)=>x-y);return(d[1]+d[2])/2;},
 contributions:([a,b])=>{const c=a.map((v,i)=>v*b[i]);return c.indexOf(Math.max(...c));},
 failureDifference:([[n1,t1],[n2,t2]])=>(n2-t2)/n2-(n1-t1)/n1,
 drying:([m,w1,w2])=>m-m*(1-w1)/(1-w2),geometric:p=>[1/p,1/p-1],prefix:([p,n])=>p.reduce((s,v,i)=>s+v*n[i],0),
 requirements:a=>a.filter(row=>row.every(Boolean)).length,hydrostatic:([p,rho,g,h])=>p+rho*g*h/1000,
 permissive:([a,b])=>[Number(Boolean(a&&!b)),0],parallelCurrent:([v,r1,r2])=>[v/r1+v/r2,r1>r2?2:1],
 fan:([a,b,c])=>[a/(b+c),a*c/(b+c)],isolation:()=>['V fechado','D aberto'],
 xor:([a,b])=>a*(1-b)+b*(1-a),supportSegments:([p,n])=>p/n,
 heatParallel:([dt,r1,r2])=>[dt/r1+dt/r2,(dt/r1)/(dt/r1+dt/r2)],residence:([v1,v2,q])=>(v1+v2)/q,
 barrierRole:()=> 'dependencia',automaton:commands=>{let state='PARADO';for(const c of commands){if(c==='Reset'&&state==='PARADO')state='PRONTO';else if(c==='Partida'&&state==='PRONTO')state='OPERANDO';}return state;},
 sling:([p,sine])=>p/(2*sine),routeTimes:a=>Math.min(...a.map(route=>route.reduce((s,v)=>s+v))),twoZone:([a,b])=>[a,a+b],
 intervals:([a,b])=>[Math.max(0,Math.min(a[1],b[1])-Math.max(a[0],b[0])),Math.max(0,a[1]-b[0])],
 ladder:([a,b])=>Math.hypot(a,b),clearance:([gap,h,motion])=>gap-h-motion,
 stratification:d=>d.probe==='topo'&&d.agent==='inferior'?'nao_representativa':null,
 reactions:([p,L,x])=>[p-p*x/L,p*x/L],entanglement:d=>d.overlap&&d.rotation?'arraste':null,
 overlap:([a,b])=>a-b,passage:([a,b])=>b-a,recirculation:d=>d.return&&!d.treatment?'sem_remocao_liquida':null,
 darcy:([a,b])=>(b[0]*b[1]/b[2])/(a[0]*a[1]/a[2]),
 inclinedImpact:([h,gHalf,v,intercept,slope])=>v*((-slope*v+Math.sqrt((slope*v)**2+4*gHalf*(h-intercept)))/(2*gHalf))
};
// Gabaritos quantitativos/textuais foram resolvidos editorialmente de novo.
const textCalculations=[
 {n:1,result:[2,8],calc:()=>[.02*.01*100**2,.02*.01*200**2]},
 {n:2,result:2,calc:()=>3-1},{n:3,result:[.5,.25],calc:()=>[2/4,2/8]},
 {n:4,result:200,calc:()=>200e3*1e-5*100},{n:5,result:80,calc:()=>40+10+30},
 {n:6,result:2000,calc:()=>1000*10*.8-6000},{n:7,result:[10,30],calc:()=>[100-90,60-30]},
 {n:9,result:[300,.5],calc:()=>[(2*2-1)*340/(4*.85),.85/(2*.85)]},
 {n:10,result:[2,.5],calc:()=>[(16/4)**.5,(16/4)**.5/(16/4)]},
 {n:11,result:6,calc:()=>20*30*10/1000},{n:12,result:[true,false],calc:()=>[.12<.15,.12<.08]},
 {n:13,result:[50,5],calc:()=>{const v=.002*100/.004;return[v,.5*.002*100**2-.5*.004*v*v];}},
 {n:14,result:[100,250],calc:()=>[10000/100,10000/100*2.5]},
 {n:15,result:[4,6],calc:()=>[10*.4/1,.6*10]},
 {n:18,result:[10,-1],calc:()=>[10/(3-2),2-3]},
{n:8,result:[.9,.5,20,80],calc:()=>[18/20,10/20,18+2,10+70]},
 {n:21,result:.75,calc:()=>.6/(.6+.2)},{n:23,result:[8,20,80,20],calc:()=>[.1*80,20,80,20]},
 {n:24,result:.75,calc:()=> (180-30)/200},{n:25,result:.5,calc:()=>(1-.5)/(1-0)},
 {n:27,result:15,calc:()=>3/(2/10)},{n:33,result:40,calc:()=>(50-10)/100000*100000},
 {n:46,result:6,calc:()=>(16-Math.sqrt(16**2-4*60))/2},{n:50,result:[10,20],calc:()=>[100*.02/(100-80)*100,100-80]},
 {n:53,result:[2,.4],calc:()=>[5*4*20/200,(5*4*20/200)/5]},{n:54,result:[1,.81125],calc:()=>[2-(2/4*1+2/4*1),2-(1/4*0+3/4*1.585)]}];
for(const m of models){assert(functions[m.operation],m.operation);const value=functions[m.operation](m.inputs);near(value,m.result);calculations.push({id:m.id,operation:m.operation,result:value});}
for(const m of textCalculations){const value=m.calc();near(value,m.result);calculations.push({id:fresh[m.n-1].id,operation:'segunda_resolucao_textual',result:value});}
(async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();const all=Array.from(r.App.questionsBank,q=>{const {_ord,...raw}=q;return raw;});
 assert.equal(all.length,820);assert.equal(new Set(all.map(q=>q.id)).size,820);assert.deepEqual(Array.from(r.validateBank(all)),[]);assert.equal(fresh.length,100);
 const count=qs=>qs.reduce((out,q)=>(out[q]=(out[q]||0)+1,out),{});assert.deepEqual(count(all.map(q=>q.area)),{PORT:100,ING:100,ESP:620});
 assert.deepEqual(count(fresh.map(q=>q.formato_recurso)),{textual:55,grafico_tabela:20,diagrama:15,ilustracao:10});
 const files=cp.execFileSync('git',['ls-tree','-r','--name-only','1cfabbf','data','assets'],{cwd:root,encoding:'utf8'}).trim().split('\n');
 for(const f of files)assert.deepEqual(fs.readFileSync(path.join(root,f)),cp.execFileSync('git',['show',`1cfabbf:${f}`],{cwd:root}),f);
 for(const [i,q] of fresh.entries()){
  assert.equal(q.id,`TP26-E2L1-ESP-${String(i+1).padStart(4,'0')}`);assert.equal(q.etapa,2);assert.equal(q.lote,1);
  for(const field of ['assunto','subassunto','difficulty','explanation','referencia'])assert(typeof q[field]==='string'&&q[field].trim());
  assert(q.fontes.length&&q.fontes.every(f=>fs.existsSync(path.join(root,f))));assert.equal(new Set(q.options.map(normalize)).size,5);
  assert.equal(Boolean(q.imagens),q.formato_recurso!=='textual');
  for(const img of q.imagens||[]){assert(fs.existsSync(path.join(root,img.src)));assert(img.alt.length>50&&img.legenda);const svg=fs.readFileSync(path.join(root,img.src),'utf8');assert(svg.includes('<title')&&svg.includes('<desc'));assert(!/<script|<foreignObject|\son\w+=|(?:href|src)=["'](?:https?:|data:|\/\/)/i.test(svg));}
 }
 assert(!r.CONCURSOS.TRANSPETRO.formatos.VISUAIS);assert.deepEqual({...r.CONCURSOS.TRANSPETRO.formatos.FULL.quantidades},{PORT:10,ING:10,ESP:50});
 // 76.950 pares: novas x720 anteriores e novas xnovas. TF/IDF não prova semântica.
 const previous=all.filter(q=>!q.id.startsWith('TP26-E2L1-')),tokens=s=>normalize(s).split(' ').filter(w=>w.length>3),df=new Map();
 for(const q of all)for(const w of new Set(tokens(q.statement)))df.set(w,(df.get(w)||0)+1);
 const vector=q=>{const v=new Map();for(const w of tokens(q.statement))v.set(w,(v.get(w)||0)+1);for(const [w,n]of v)v.set(w,n*Math.log(1+all.length/df.get(w)));return v;};
 const vectors=new Map(all.map(q=>[q.id,vector(q)])),cos=(a,b)=>{let sum=0,aa=0,bb=0;for(const [w,n]of a){sum+=n*(b.get(w)||0);aa+=n*n;}for(const n of b.values())bb+=n*n;return sum/Math.sqrt(aa*bb);};
 let pairs=0;const closest=[],alerts=[];
 fresh.forEach((q,i)=>{const list=[];for(const other of [...previous,...fresh.slice(i+1)]){pairs++;const score=cos(vectors.get(q.id),vectors.get(other.id));list.push({id:other.id,score});if(score>.65)alerts.push({a:q.id,b:other.id,score});}closest.push({id:q.id,neighbors:list.sort((a,b)=>b.score-a.score).slice(0,3)});});
 assert.equal(pairs,76950);assert.deepEqual(alerts,[],'Triagem lexical: revisar e substituir pares excessivos');
 console.log(JSON.stringify({passed:true,total:all.length,areas:count(all.map(q=>q.area)),assuntosNovos:count(fresh.map(q=>q.assunto)),difficulty:count(fresh.map(q=>q.difficulty)),resources:count(fresh.map(q=>q.formato_recurso)),answers:count(fresh.map(q=>'ABCDE'[q.answer])),preservedFiles:files.length,calculations,pairs,alerts,closest,items:fresh.map(q=>({id:q.id,sha256:digest(q),answer:q.answer,figuras:(q.imagens||[]).map(i=>({src:i.src,sha256:require('crypto').createHash('sha256').update(fs.readFileSync(path.join(root,i.src))).digest('hex')}))})),limitations:['TF/IDF é triagem lexical, não prova de originalidade semântica.','Fontes externas403; proposições normativas limitadas ao corpus local.']},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
