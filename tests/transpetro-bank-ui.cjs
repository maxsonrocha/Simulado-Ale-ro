// Integração com os JSONs reais do lote, sem interceptar suas respostas.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
 try {
  const page = await browser.newPage(); const errors = [], failed = [], dialogs = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) failed.push(r.url()); });
  page.on('dialog', async d => { dialogs.push(d.message()); await d.accept(); });
  await page.goto(process.env.SIMULADO_URL || 'http://127.0.0.1:8000');
  await page.getByRole('button', { name: 'Transpetro 2026', exact: true }).click();
  await page.getByRole('button', { name: 'Engenharia de Segurança do Trabalho', exact: true }).click();
  await page.locator('#btnStart').click(); await page.locator('#view-exam').waitFor({ state: 'visible' });
  const before = await page.evaluate(() => ({ size: App.exam.length, bank: App.questionsBank.length,
   counts: App.exam.reduce((a, q) => (a[q.area] = (a[q.area] || 0) + 1, a), {}), ids: App.exam.map(q => q.id) }));
  assert.equal(before.size, 70); assert.equal(before.bank, 300); assert.equal(new Set(before.ids).size, 70);
  assert.deepEqual(before.counts, { ...before.counts, PORT: 10, ING: 10, ESP: 50 });
  assert(await page.locator('#qDiff').innerText().then(x => /Média|Alta|Muito alta/.test(x)));
  await page.locator('#chkMark').check(); assert(await page.locator('#examMap .dot').first().evaluate(e => e.classList.contains('marked')));
  const answer = await page.evaluate(() => App.exam[0].answer);
  await page.locator(`#qOptions input[value="${answer}"]`).check();
  assert(await page.locator('#instantFeedback').isHidden());
  await page.locator('#btnNext').click(); await page.locator('#btnPrev').click();
  assert(await page.locator(`#qOptions input[value="${answer}"]`).isChecked());
  await page.evaluate(() => {
   App.currentIndex = App.exam.findIndex(q => q.groupId && App.questionsBank.find(x => x.groupId === q.groupId).id !== q.id);
   renderQuestion();
  });
  assert(await page.locator('#qContext').isVisible());
  await page.evaluate(() => { App.timer.startAt = Date.now() - 255 * 60000; }); await page.waitForTimeout(350);
  assert(dialogs.some(t => t.includes('faltam 15 minutos')));
  await page.evaluate(() => { App.answers = new Map(App.exam.map(q => [q.id, q.answer])); App.timer.startAt = Date.now() - 270 * 60000; });
  await page.locator('#view-result').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#statusLine').innerText(), 'Situação: APROVADO');
  assert((await page.locator('#scoreLine').innerText()).includes('70 / 70 (100%)'));
  const saved = await page.evaluate(() => readJSON(App.historyKey, [])[0]);
  assert.equal(saved.contest, 'TRANSPETRO'); assert.equal(saved.role, 'ENG_SEG'); assert.equal(saved.points, 70); assert.equal(saved.errors, 0);
  assert(saved.bySubject.ESP); assert(saved.timeMs >= 270 * 60000);
  // Regressão de contexto tanto no grupo antigo quanto no grupo novo.
  for(const pair of [['0001','0002'],['0021','0022'],['0041','0042']]){
   await page.evaluate(id => writeJSON(App.wrongKey, [id]), `TP26-ENGSEG-PORT-${pair[1]}`);
   await page.locator('#btnRetryWrong').click(); await page.locator('#view-exam').waitFor({ state: 'visible' });
   assert.deepEqual(await page.evaluate(() => App.exam.map(q => q.id)), pair.map(n=>`TP26-ENGSEG-PORT-${n}`));
   const explanation=await page.evaluate(()=>App.exam[1].explanation);
   await page.locator('#btnNext').click(); assert(await page.locator('#qContext').isVisible());
   await page.evaluate(() => { App.answers = new Map(App.exam.map((q,i) => [q.id, i===1 ? (q.answer + 1) % 5 : q.answer])); });
   await page.locator('#btnFinish').click();
   assert(await page.locator('#wrongList .feedback:not(.hidden)').count() === 1);
   assert((await page.locator('#wrongList').innerText()).includes(explanation));
  }
  await page.locator('#btnNew').click();
  await page.locator('input[name=mode][value=TREINO]').check(); await page.locator('input[name=type][value=ESP]').check();
  await page.locator('#btnStart').click(); await page.locator('#view-exam').waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => App.exam.length), 50);
  const first = await page.evaluate(() => ({ answer: App.exam[0].answer, explanation: App.exam[0].explanation }));
  await page.locator(`#qOptions input[value="${first.answer}"]`).check();
  assert(await page.locator('#instantFeedback').isVisible()); assert((await page.locator('#instantFeedback').innerText()).includes(first.explanation));
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []); assert.deepEqual(failed, []);
  console.log('PASS: 300 itens reais; 70=10/10/50, específico 50, PROVA/TREINO, mapa, marcação, timer 4h30, resultado, histórico, erradas e contexto.');
 } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
