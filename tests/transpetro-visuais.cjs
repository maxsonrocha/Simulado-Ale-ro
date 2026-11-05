const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {execFileSync}=require('node:child_process'),{createRuntime,select,root}=require('../scripts/lib/runtime.cjs');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
test('preserva integralmente bancos700/ALERO e mantém boas-vindas desativadas',()=>{
 for(const file of execFileSync('git',['ls-tree','-r','--name-only','3869ce2','data'],{cwd:root,encoding:'utf8'}).trim().split('\n'))assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`3869ce2:${file}`],{cwd:root}));
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),before=execFileSync('git',['show','3869ce2:index.html'],{cwd:root,encoding:'utf8'});const welcome=s=>s.slice(s.indexOf('    <!-- Mensagem de boas-vindas'),s.indexOf('    <!-- VIEW: CONFIG -->'));assert.equal(welcome(html),welcome(before));assert(fs.readFileSync(path.join(root,'app.js'),'utf8').includes('const welcomeEnabled = false;'));
});
test('20 pilotos:JSONs/SVGs íntegros, cinco opções e20 resoluções independentes',()=>{const q=JSON.parse(execFileSync(process.execPath,['scripts/validate-transpetro-visuais.cjs'],{cwd:root,encoding:'utf8'}));assert(q.passed);assert.equal(q.total,20);assert.equal(q.resolucoes.length,20);assert.equal(q.comparacoesLexicais,14190);assert.deepEqual(q.alertas,[]);});
test('hashes vinculam revisão aos20 enunciados, gráficos e manifesto',()=>{const audit=read('docs/transpetro-visuais-auditoria.json'),qs=read('data/transpetro/pilotos_visuais.json');assert.equal(audit.manifestSha256,sha(fs.readFileSync(path.join(root,'docs/transpetro-visuais-dados.json'),'utf8')));for(const q of qs){const a=audit.resolucoes.find(x=>x.id===q.id);assert.equal(a.sha256,sha(JSON.stringify(q)));for(const f of a.figuras)assert.equal(f.sha256,sha(fs.readFileSync(path.join(root,f.src),'utf8')));}});
test('imagens é opcional e aceita múltiplos formatos locais com alt',()=>{const r=createRuntime();select(r);const q=read('data/transpetro/pilotos_visuais.json')[0];assert.equal(r.validateQuestion({...q,imagens:undefined},0),null);for(const ext of ['svg','png','jpg','jpeg','webp','PNG'])assert.equal(r.validateQuestion({...q,imagens:[{src:`assets/a.${ext}`,alt:'Dados da figura'}]},0),null);assert.equal(r.validateQuestion({...q,imagens:[]},0),null);for(const imgs of [null])assert.equal(r.validateQuestion({...q,imagens:imgs},0),null);for(const im of [[{src:'https://externo/a.svg',alt:'x'}],[{src:'../a.svg',alt:'x'}],[{src:'/a.svg',alt:'x'}],[{src:'assets/a.svg',alt:''}],[{src:'assets/a.svg',alt:'x',largura:0}],['assets/a.svg']])assert(r.validateQuestion({...q,imagens:im},0));});
test('campo legadoimage mantém convençãoassets; imagens tem precedência',()=>{const r=createRuntime();const images=vm.runInContext('questionImages',r.context);assert.equal(images({image:'legado.png'})[0].src,'assets/legado.png');assert.equal(images({image:'assets/legado.png'})[0].src,'assets/legado.png');assert.equal(images({image:'legado.png',imagens:[{src:'assets/novo.svg',alt:'x'}]})[0].src,'assets/novo.svg');assert.equal(images({imagens:[]}).length,0);});
test('pilotos integrados: IDs históricos recuperam imagens no caderno regular',async()=>{
 const r=createRuntime();select(r);await r.loadQuestionsBank();assert.equal(r.App.questionsBank.length,920);assert(!r.CONCURSOS.TRANSPETRO.formatos.VISUAIS);
 const pilot=r.App.questionsBank.find(q=>q.piloto_visual);r.writeJSON(r.App.wrongKey,[pilot.id]);
 r.writeJSON(r.App.historyKey,[{contest:'TRANSPETRO',role:'ENG_SEG',type:'VISUAIS',correct:19,total:20,percent:95,timeMs:1000}]);
 select(r,'TRANSPETRO','ENG_SEG','ERRADAS');await r.loadQuestionsBank();r.generateExam();assert.deepEqual(Array.from(r.App.exam,q=>q.id),[pilot.id]);
 assert.equal(r.App.exam[0].imagens[0].src,pilot.imagens[0].src);r.App.answers=new Map([[pilot.id,(pilot.answer+1)%5]]);
 const score=r.computeScore();assert.equal(score.wrongDetails[0].imagens[0].src,pilot.imagens[0].src);r.saveResults(score);
 assert(r.readJSON(r.App.historyKey,[]).some(x=>x.type==='VISUAIS'));assert.equal(r.readJSON(r.App.historyKey,[])[0].type,'ERRADAS');
});
test('pilotos e novos participam do ciclo regular, com isolamento de cargo',async()=>{
 const r=createRuntime();select(r,'TRANSPETRO','ENG_SEG','ESP');await r.loadQuestionsBank();const ids=new Set();
 for(let i=0;i<12;i++){r.generateExam();for(const q of r.App.exam){assert(!ids.has(q.id));ids.add(q.id);}}
 assert([...ids].some(id=>id.startsWith('TP26-VIS-')));assert([...ids].some(id=>id.startsWith('TP26-E2L1-')));
 select(r,'ALERO','DES');assert.equal(r.getCycleIds().size,0);await r.loadQuestionsBank();assert(r.App.questionsBank.every(q=>!q.piloto_visual&&!q.etapa));
});
