// Auditoria separada da autoria Python; somente leitura.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {createRuntime,select,root}=require('./lib/runtime.cjs');const {loadRows,read,digest,normalize}=require('./validate-transpetro.cjs');
const fresh=read('data/transpetro/etapa2/lote2.json'),models=read('docs/transpetro-etapa2-lote2-modelos.json');
const near=(a,b)=>{if(Array.isArray(a)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else if(typeof a==='number')assert(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),`${a} != ${b}`);else assert.deepEqual(a,b);};
const calculations=[];
const functions={
 powerRatio:([r,n])=>r**n,overlapBenefit:([a,b,c])=>[a+b-c,b-c],scale:([n,d,k])=>n/d*k,
 tailMean:([p,a,q,b,s])=>(p*a+q*b)/s,
 absorption:([gg,gd,dg,dd])=>{const eg=(1+gd/(1-dd))/((1-gg)-gd*dg/(1-dd));return[eg,(1+dg*eg)/(1-dd)];},
 boundTwo:p=>[0,p.reduce((s,v)=>s+v)/2],mad:a=>{const median=x=>x.toSorted((a,b)=>a-b)[Math.floor(x.length/2)],m=median(a);return median(a.map(x=>Math.abs(x-m)));},
 correlatedEstimate:([a,b,va,vb,c])=>{const D=va+vb-2*c,w=(vb-c)/D;return[w*a+(1-w)*b,(va*vb-c*c)/D,1-w];},
 dryVolume:([v,f,m])=>[v*(1-f),m/(v*(1-f)/1000)],censored:([a,b,u,v])=>[(a+b)/4,(a+b+u+v)/4,.5],twoModes:([a,b,k])=>(a+b/k)/(2*a),
 choked:a=>a.map(p=>p<=4?10:18-2*p),arcEnergy:([v,k,a,b])=>[v*a*k/(a*a),v*b*k/(b*b)],stability:([a,b,c])=>[-1,-1+Math.sqrt(1-(b-c))],
 mixedProtocol:([a,b,limit])=>{const A=a/10,B=(b-10)/2;return[(A+B)/2,B>=limit?'B':'nenhum'];},
 familyFalse:([p,n])=>1-p**n,
 flowshop:jobs=>[[0,1,2],[1,0,2],[2,0,1],[1,2,0],[2,1,0]].map(order=>{let p=0,v=0;for(const i of order){p+=jobs[i][0];v=Math.max(p,v)+jobs[i][1];}return v;}),
 inclusion:a=>[a.reduce((s,[y,p])=>s+y/p,0),a.reduce((s,[y,p])=>s+y*y*(1-p)/(p*p),0)],
 transmit:([bits,rate,delay])=>bits/rate+delay,sorbent:([a,ca,b,cb])=>a/ca+b/cb,
 uniformRoutes:([low,high,a,da,b,db])=>{const cdf=t=>Math.max(0,Math.min(1,(t-low)/(high-low)));return[cdf(da-a),cdf(db-b),cdf(da-a+1),cdf(db-b+1)];},
 allNegative:([p,n])=>[n/(p+n),0],twoEvidence:([a,b,c,d])=>a*c/(a*c+b*d),errorGain:([k,n])=>(1-k)**n,
 alarmOdds:([p,fn,fp,...LR])=>LR.map(l=>l*p/(1-p)>fp/fn),heatCapacity:([q,a,b])=>[q/a,q/b],
 radiativeExchange:([a,b,f,t,u,k])=>[a*f/b,k*a*f*(t**4-u**4)],verificationBound:([tp,neg])=>[tp/(tp+neg),1],stockService:([s,t])=>s*t,
 costRobust:([lo,hi,budget])=>{const A=4000+50*hi,B=8000+10*Math.min(hi,100)+25*Math.max(hi-100,0);return[A,B,B<=budget?'B':'nenhum'];},
 exactOne:([n,p])=>n*p*(1-p)**(n-1),sobol:([a,b,ab])=>[a/(a+b+ab),(a+ab)/(a+b+ab)],
 robustExpectation:([a,b,budget,cap,y])=>{const p2=cap,p1=budget-2*cap,worst=a*p1+b*p2;return[worst,worst<y?'X':'Y'];},
 constrainedInterval:([a,b,lo,hi])=>{const opt=Math.max(lo,Math.min(hi,Math.sqrt(a/b)));return[opt,a/opt+b*opt];},
 roundInterval:([a,b])=>b-a,deadTime:([n,t])=>[n/(1-n*t),1/(1-n*t)-1],filteredPulse:([c,d,e])=>[c*(1-e),c*d],
 rim:([d,n,v,pi])=>[pi*d*n/60,v*60/(pi*d)],gaussian:([p,w,pi,f])=>2*p/(pi*w*w)/f,threeClasses:()=>6/27,
 portfolioUnion:([a,b,c,ab,ac,bc,abc])=>[a+b+c-ab-ac-bc+abc,'BC',14],vector:a=>Math.hypot(...a),jointReady:([a,b,cond])=>[a*cond,a+b-a*cond],
 circularHour:hours=>{const angle=Math.atan2(hours.reduce((s,h)=>s+Math.sin(2*Math.PI*h/24),0),hours.reduce((s,h)=>s+Math.cos(2*Math.PI*h/24),0));return Math.abs(angle)<1e-12?0:(angle*12/Math.PI+24)%24;},
 betaPredict:([a,b])=>a*(a+1)/((a+b)*(a+b+1)),orderPercentile:([a,p])=>a[Math.ceil(a.length*p)-1],dualTask:([a,b,c])=>c-Math.max(a,b),
 dualExposure:rows=>'XYZ'[rows.findIndex(([pow,t,c])=>pow*t<=1&&c*t<=1)],standardCross:([[a,b],[c,d]])=>(d-b)/((a-b)-(c-d)),
 serviceEmission:rows=>{const a=rows.map(([e,p,f,n])=>e/p+f/n);return[...a,a[0]<a[1]?'A':'B'];},
 reachability:d=>{const q=[d.start],seen=new Set(q);for(const x of q)for(const [a,b]of d.edges)if(a===x&&!seen.has(b)){seen.add(b);q.push(b);}return [...seen].filter(x=>x!==d.start).sort();},
 forkAdjustment:d=>d.edges.filter(([a,b])=>b==='X').map(([a])=>a).find(a=>d.edges.some(([u,v])=>u===a&&v==='Y')),
 successAbsorb:([gg,gd,gs,dg,dd])=>{const G=gs/((1-gg)-gd*dg/(1-dd));return[G,dg*G/(1-dd)];},
 partition:([vg,vl,m,k])=>{const l=m/(vl+k*vg);return[k*l,l];},rankChannel:([a,b,c])=>{assert.equal(a/2,b/3);return[(a/2+2*c)/3,(a/2-c)/3];},
 rolling:([v,w,r])=>v+w*r,bridge:([v,a,b])=>[v*b/(a+b),v*b/(a+b)],
 partialOrder:edges=>{const names=[...new Set(edges.flat())].sort(),reaches=(a,b)=>{const q=[a],seen=new Set(q);for(const x of q){if(x===b)return true;for(const [u,v]of edges)if(u===x&&!seen.has(v)){seen.add(v);q.push(v);}}return false;};return names.flatMap((a,i)=>names.slice(i+1).filter(b=>!reaches(a,b)&&!reaches(b,a)).map(b=>a+b)).join(',');},
 vertexCover:d=>{const n=Object.keys(d.costs);let best=Infinity;for(let bits=0;bits<1<<n.length;bits++){const s=new Set(n.filter((_,i)=>bits&(1<<i)));if(d.edges.every(([a,b])=>s.has(a)||s.has(b)))best=Math.min(best,[...s].reduce((sum,x)=>sum+d.costs[x],0));}return best;},
 grade:([h,d,max])=>[h/d,h/d<=max],bufferGap:([a,b,q,stock])=>[(b-a)*q,Math.max(0,b-a-stock/q)],
 clockOrders:d=>{const orders=new Set();for(let delta=d.A[2];delta<=d.A[3];delta++)for(let eps=d.B[1];eps<=d.B[2];eps++){const ts=[['E',d.A[0]+delta],['F',d.A[1]+delta],['G',d.B[0]+eps]].sort((a,b)=>a[1]-b[1]);if(new Set(ts.map(x=>x[1])).size===3)orders.add(ts.map(x=>x[0]).join(''));}return['EF',orders.size];},
 layoutRegret:([lo,hi])=>[Math.max(0,6-2*lo),Math.max(0,2*hi-6),'X'],thermalLink:([tau,ln2,d])=>[tau*ln2,tau*ln2<=d],
 delayedEntry:rows=>{let S=1;const result=[];for(const time of [2,3,4]){const risk=rows.filter(([a,b])=>a<time&&b>=time).length,events=rows.filter(([,b,type])=>b===time&&type==='event').length;if(events)S*=1-events/risk;if(time>=3)result.push(S);}return result;},
 liquidSeal:([rho,g,h,p])=>[rho*g*h,p<=rho*g*h],legMargins:([r,f,lim])=>['esquerda',r[0]*f-lim[0]],
 timezones:([[h,m,z],[H,M,Z]])=>{const a=h*60+m-z*60,b=H*60+M-Z*60;return[a<b?'N':'S',Math.abs(a-b)];},
 visibility:d=>Object.keys(d).find(k=>d[k]==='clear'),inelastic:([a,b,v])=>{const u=(a+b)*v/a;return[u,.5*a*u*u-.5*(a+b)*v*v];},
 oppositeViews:d=>d.views==='opostas'?'anti-horario':d.A,spray:([a,b,t,min])=>[a*t,b*t,a*t>=min&&b*t<min?'A':'outro'],
 dust:([A,thick,rho,f,V,v])=>[A*thick*rho*f/V*1000,A*thick*rho*f/v*1000],
 biomarker:([c0,c,f,t,target,ln2])=>{const k=-Math.log((c-f)/(c0-f))/t;return[Math.log(2)/k,(target-f)*ln2/t];},
 neutralize:([v,a,w,b,eq,m])=>{const n=(v*a-w*b)/eq;return[n,n*m];}
};
for(const m of models){assert(functions[m.op],m.op);const result=functions[m.op](m.input);near(result,m.expected);calculations.push({id:m.id,operation:m.op,result});}
(async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();const all=Array.from(r.App.questionsBank,q=>{const {_ord,...raw}=q;return raw;});
 assert.equal(all.length,920);assert.equal(new Set(all.map(q=>q.id)).size,920);assert.deepEqual(Array.from(r.validateBank(all)),[]);assert.equal(fresh.length,100);
 const count=qs=>qs.reduce((out,q)=>(out[q]=(out[q]||0)+1,out),{});assert.deepEqual(count(all.map(q=>q.area)),{PORT:100,ING:100,ESP:720});
 assert.deepEqual(count(fresh.map(q=>q.difficulty)),{media:20,alta:45,muito_alta:35});
 assert.deepEqual(count(fresh.map(q=>'ABCDE'[q.answer])),{A:20,B:20,C:20,D:20,E:20});
 assert.deepEqual(count(fresh.map(q=>q.assunto)),{legislacao_nr:20,gerenciamento_riscos:15,higiene_ocupacional:10,prevencao_riscos:10,gestao_sms:10,emergencias:8,acidentes:7,ergonomia:6,incendio:6,saude_ocupacional:5,desenvolvimento_sustentavel:3});
 assert.deepEqual(count(fresh.map(q=>q.formato_recurso)),{textual:55,grafico_tabela:20,diagrama:15,ilustracao:10});
 const files=cp.execFileSync('git',['ls-tree','-r','--name-only','18d1aa8','data','assets'],{cwd:root,encoding:'utf8'}).trim().split('\n');
 for(const f of files)assert.deepEqual(fs.readFileSync(path.join(root,f)),cp.execFileSync('git',['show',`18d1aa8:${f}`],{cwd:root}),f);
 for(const [i,q] of fresh.entries()){
  assert.equal(q.id,`TP26-E2L2-ESP-${String(i+1).padStart(4,'0')}`);assert.equal(q.etapa,2);assert.equal(q.lote,2);
  for(const field of ['assunto','subassunto','difficulty','explanation','referencia'])assert(typeof q[field]==='string'&&q[field].trim());
  assert(q.fontes.length&&q.fontes.every(f=>fs.existsSync(path.join(root,f))));assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase().replace(/\s+/g,' '))).size,5);
  assert.equal(Boolean(q.imagens),q.formato_recurso!=='textual');
  for(const img of q.imagens||[]){assert(fs.existsSync(path.join(root,img.src)));assert(img.alt.length>50&&img.legenda);const svg=fs.readFileSync(path.join(root,img.src),'utf8');assert(svg.includes('<title')&&svg.includes('<desc'));assert(!/<script|<foreignObject|\son\w+=|(?:href|src)=["'](?:https?:|data:|\/\/)/i.test(svg));}
 }
 assert(!r.CONCURSOS.TRANSPETRO.formatos.VISUAIS);assert.deepEqual({...r.CONCURSOS.TRANSPETRO.formatos.FULL.quantidades},{PORT:10,ING:10,ESP:50});
 // 86.950 pares: novas x820 anteriores e novas xnovas. TF/IDF não prova semântica.
 const previous=all.filter(q=>!q.id.startsWith('TP26-E2L2-')),tokens=s=>normalize(s).split(' ').filter(w=>w.length>3),df=new Map();
 for(const q of all)for(const w of new Set(tokens(q.statement)))df.set(w,(df.get(w)||0)+1);
 const vector=q=>{const v=new Map();for(const w of tokens(q.statement))v.set(w,(v.get(w)||0)+1);for(const [w,n]of v)v.set(w,n*Math.log(1+all.length/df.get(w)));return v;};
 const vectors=new Map(all.map(q=>[q.id,vector(q)])),cos=(a,b)=>{let sum=0,aa=0,bb=0;for(const [w,n]of a){sum+=n*(b.get(w)||0);aa+=n*n;}for(const n of b.values())bb+=n*n;return sum/Math.sqrt(aa*bb);};
 let pairs=0;const closest=[],alerts=[];
 fresh.forEach((q,i)=>{const list=[];for(const other of [...previous,...fresh.slice(i+1)]){pairs++;const score=cos(vectors.get(q.id),vectors.get(other.id));list.push({id:other.id,score});if(score>.65)alerts.push({a:q.id,b:other.id,score});}closest.push({id:q.id,neighbors:list.sort((a,b)=>b.score-a.score).slice(0,3)});});
 assert.equal(pairs,86950);assert.deepEqual(alerts,[],'Triagem lexical: revisar e substituir pares excessivos');
 console.log(JSON.stringify({passed:true,total:all.length,areas:count(all.map(q=>q.area)),assuntosNovos:count(fresh.map(q=>q.assunto)),difficulty:count(fresh.map(q=>q.difficulty)),resources:count(fresh.map(q=>q.formato_recurso)),answers:count(fresh.map(q=>'ABCDE'[q.answer])),preservedFiles:files.length,sourceHashes:[...new Set(fresh.flatMap(q=>q.fontes))].sort().map(file=>({file,sha256:require("crypto").createHash("sha256").update(fs.readFileSync(path.join(root,file))).digest("hex")})),calculations,pairs,alerts,closest,items:fresh.map(q=>({id:q.id,sha256:digest(q),answer:q.answer,figuras:(q.imagens||[]).map(i=>({src:i.src,sha256:require('crypto').createHash('sha256').update(fs.readFileSync(path.join(root,i.src))).digest('hex')}))})),limitations:['TF/IDF é triagem lexical, não prova de originalidade semântica.','Fontes externas403; proposições normativas limitadas ao corpus local.']},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
