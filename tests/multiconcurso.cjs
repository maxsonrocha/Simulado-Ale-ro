const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const baseline=execFileSync('git',['show','74e41d2:app.js'],{encoding:'utf8'});
const originalScore=baseline.slice(baseline.indexOf('function computeScore()'),baseline.indexOf('function mergeUnique'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage(); const errors=[];const dialogs=[]; const failed=[];
 page.on('pageerror',e=>errors.push(e.message)); page.on('dialog',async d=>{dialogs.push(d.message());await d.accept()});
 page.on('response',r=>{if(r.status()>=400 && !r.url().endsWith('favicon.ico')) failed.push(r.url())});
 await page.goto(process.env.SIMULADO_URL || 'http://127.0.0.1:8000');
 await page.addScriptTag({content:`window.originalComputeScore = ${originalScore};`});
 assert(await page.locator('#view-contest').isVisible());
 await page.evaluate(()=>{localStorage.setItem('undefined','["legado-ambiguo"]');const h={date:'2026-01-01T00:00:00Z',total:40,correct:20,percent:50,timeMs:1000,byArea:{ESP:{correct:20,total:40}},byTopicEsp:{}};localStorage.setItem('simulado_history_v1__DESENHISTA',JSON.stringify([h]));localStorage.setItem('simulado_wrong_ids_v1__DES',JSON.stringify(['ESP-001']));localStorage.setItem('simulado_seen_ids_v1__DES',JSON.stringify(['ESP-002']))});
 async function select(role){await page.getByRole('button',{name:'ALERO',exact:true}).click();await page.getByRole('button',{name:role,exact:true}).click()}
 await select('Desenhista');
 assert.equal(await page.evaluate(()=>readJSON(App.historyKey,[]).length),1);
 assert.deepEqual(await page.evaluate(()=>readJSON(App.wrongKey,[])),['ESP-001']);
 await page.getByRole('button',{name:'Trocar cargo',exact:true}).click();await page.getByRole('button',{name:'Desenhista',exact:true}).click();
 assert.equal(await page.evaluate(()=>readJSON(App.historyKey,[]).length),1);
 for(const role of ['Desenhista','Arquiteto']){
  if(role==='Arquiteto'){await page.locator('#btnChangeContest').click();await select(role)}
  for(const mode of ['PROVA','TREINO']){
   for(const type of ['FULL','ESP']){
    await page.locator(`input[name=mode][value=${mode}]`).check(); await page.locator(`input[name=type][value=${type}]`).check();
    await page.locator('#btnStart').click();await page.locator('#view-exam').waitFor({state:'visible'});
    const info=await page.evaluate(()=>({n:App.exam.length,areas:App.exam.reduce((a,q)=>(a[q.area]=(a[q.area]||0)+1,a),{}),unique:new Set(App.exam.map(q=>q.id)).size,groups:App.exam.filter(q=>q.groupId).every(q=>App.questionsBank.filter(x=>x.groupId===q.groupId&&x.area===q.area).every(x=>App.exam.includes(x))),prefix:App.historyKey,valid:validateBank(App.questionsBank)}));
    assert.equal(info.n,type==='FULL'?80:40);assert.equal(info.unique,info.n);assert(info.groups);assert.deepEqual(info.valid,[]);
    if(type==='FULL')assert.deepEqual(info.areas,{...info.areas,PORT:12,RLM:6,INFO:6,LEG:8,HGR:8,ESP:40});
    await page.locator('#chkMark').check();
    assert(await page.locator('#examMap .dot').first().evaluate(e=>e.classList.contains('marked')));
    await page.locator('#btnNext').click();assert.equal(await page.evaluate(()=>App.currentIndex),1);
    await page.locator('#btnPrev').click();assert(await page.locator('#chkMark').isChecked());
    await page.locator('#qOptions input').first().check();
    assert(await page.locator('#examMap .dot').first().evaluate(e=>e.classList.contains('answered')));
    assert.equal(await page.locator('#instantFeedback').isVisible(),mode==='TREINO');
    // Verify threshold boundaries and all score fields against original implementation.
    const score=await page.evaluate(()=>{App.answers=new Map(App.exam.map((q,i)=>[q.id,i%2?q.answer:(q.answer+1)%5]));return computeScore()});
    const original=await page.evaluate(()=>window.originalComputeScore());
    for(const key of ['total','correct','percent','byArea','byTopicEsp','module','wrongIds']) assert.deepEqual(score[key],original[key]);
    assert.equal(score.correct,info.n/2);assert.equal(score.module.general.required,type==='FULL'?12:0);assert.equal(score.module.esp.required,16);assert.equal(score.module.total.required,type==='FULL'?32:16);
    await page.locator('#btnFinish').click();await page.locator('#view-result').waitFor({state:'visible'});
    const saved=await page.evaluate(()=>({h:readJSON(App.historyKey,[])[0],w:readJSON(App.wrongKey,[]),seen:readJSON(App.seenKey,[])}));
    assert.equal(saved.h.role,role==='Desenhista'?'DES':'ARQ');assert.equal(saved.h.contest,'ALERO');assert(saved.h.date);assert(saved.h.timeMs>=0);assert(saved.w.length);assert(saved.seen.length>=info.n);
    assert((await page.locator('#history').innerText()).includes(role));
    // Retry errors and clear them by answering correctly.
    await page.locator('#btnRetryWrong').click();await page.locator('#view-exam').waitFor({state:'visible'});
    assert(await page.evaluate(()=>App.type==='ERRADAS'&&groupToBlocks(App.exam).every(block=>block.some(q=>getWrongIdsSet().has(q.id)))));
    await page.evaluate(()=>App.answers=new Map(App.exam.map(q=>[q.id,q.answer])));
    await page.locator('#btnFinish').click();assert.equal(await page.evaluate(()=>getWrongIdsSet().size),0);
    await page.locator('#btnNew').click();
   }
  }
 }
 // Regressão de banco vazio preservada por interceptação só neste teste.
 await page.route('**/data/transpetro/**', route=>route.fulfill({json:[]}));
 const alero=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('simulado_ALERO'))));
 await page.locator('#btnChangeContest').click();await page.getByRole('button',{name:'Transpetro 2026',exact:true}).click();await page.getByRole('button',{name:'Engenharia de Segurança do Trabalho',exact:true}).click();
 assert(await page.locator('#btnStart').isEnabled());
 for(const type of ['FULL','ESP','ERRADAS']){
  await page.locator(`input[name=type][value=${type}]`).check();
  await page.locator('#btnStart').click();await page.waitForFunction(()=>!document.getElementById('btnStart').disabled);
  assert(await page.locator('#view-config').isVisible());assert.equal(await page.evaluate(()=>App.timer.running),false);
  if(type!=='ERRADAS'){
   assert((await page.locator('#bankNotice').innerText()).includes('disponíveis: 0'));
   assert((await page.locator('#bankNotice').innerText()).includes('necessárias: 50'));
  }
 }
 assert.equal(await page.evaluate(()=>App.questionsBank.length),0);
 assert.equal(await page.locator('#rulesList li').count(),5);
 assert((await page.title()).includes('Cesgranrio'));assert.equal(await page.evaluate(()=>App.historyKey),'simulado_TRANSPETRO_ENG_SEG_history');
 await page.locator('#btnResetStorage').click();
 assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('simulado_ALERO')))),alero);
 await page.locator('#btnChangeContest').click();await select('Desenhista');await page.locator('#btnResetStorage').click();
 await page.locator('#btnChangeRole').click();await page.getByRole('button',{name:'Desenhista',exact:true}).click();assert.equal(await page.evaluate(()=>readJSON(App.historyKey,[]).length),0);
 assert.equal(await page.evaluate(()=>localStorage.getItem('undefined')),'["legado-ambiguo"]');
 assert(await page.evaluate(()=>readJSON('simulado_ALERO_ARQ_history',[]).length>0));
 // Timer warning, timeout, reset, and active-exam switch.
 await page.locator('#btnStart').click();await page.locator('#view-exam').waitFor({state:'visible'});
 await page.evaluate(()=>App.timer.startAt=Date.now()-(4*60-15)*60000); await page.waitForTimeout(350);
 assert(dialogs.some(x=>x.includes('faltam 15 minutos')));
 await page.evaluate(()=>App.timer.startAt=Date.now()-4*60*60*1000);await page.locator('#view-result').waitFor({state:'visible'});
 assert(await page.evaluate(()=>!App.timer.running));
 await page.locator('#btnNew').click(); assert.equal(await page.evaluate(()=>App.timer.warned),false);
 await page.locator('#btnStart').click();await page.locator('#view-exam').waitFor({state:'visible'});await page.locator('#btnChangeContest').click();
 assert(await page.locator('#view-contest').isVisible());assert(await page.evaluate(()=>!App.timer.running&&App.exam.length===0));
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 console.log('PASS: 8 ALERO combinations, banks, scoring, groups, feedback, retry, history, migration, isolation, clear, Transpetro, timer and mobile.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
