// Integração futura do resultado/timer: mocks só nas respostas interceptadas
// do navegador isolado. Nenhum mock é salvo nos bancos reais.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage(); const errors = []; const dialogs = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', async d => { dialogs.push(d.message()); await d.accept(); });
    await page.route('**/data/transpetro/eng_seguranca/*.json', route => {
      const file = route.request().url().split('/').pop();
      const area = file === 'portugues.json' ? 'PORT' : file === 'ingles.json' ? 'ING' : 'ESP';
      const count = area !== 'ESP' ? 10 : file === 'ergonomia.json' ? 50 : 0;
      const qs = Array.from({ length: count }, (_, i) => ({
        id: `MOCK-${area}-${i}`, concurso: 'TRANSPETRO', cargo: 'ENG_SEG', area,
        assunto: area === 'ESP' ? 'ergonomia' : 'teste_interno', statement: 'mock interno',
        options: ['A', 'B', 'C', 'D', 'E'], answer: 0, explanation: '',
        ...(area === 'ING' && i < 2 ? { groupId: 'MOCK-TEXTO' } : {})
      }));
      return route.fulfill({ json: qs });
    });
    await page.goto(process.env.SIMULADO_URL || 'http://127.0.0.1:8000');
    await page.getByRole('button', { name: 'Transpetro 2026', exact: true }).click();
    await page.getByRole('button', { name: 'Engenharia de Segurança do Trabalho', exact: true }).click();
    assert((await page.locator('#selectionMeta').innerText()).includes('Fundação Cesgranrio'));
    for (const mode of ['PROVA', 'TREINO']) {
      for (const type of ['FULL', 'ESP']) {
        await page.locator(`input[name=mode][value=${mode}]`).check();
        await page.locator(`input[name=type][value=${type}]`).check();
        await page.locator('#btnStart').click(); await page.locator('#view-exam').waitFor({ state: 'visible' });
        assert.equal(await page.evaluate(() => App.exam.length), type === 'FULL' ? 70 : 50);
        await page.locator('#qOptions input').first().check();
        assert.equal(await page.locator('#instantFeedback').isVisible(), mode === 'TREINO');
        await page.locator('#btnNext').click(); assert(await page.locator('#instantFeedback').isHidden());
        await page.locator('#btnPrev').click();
        assert.equal(await page.locator('#instantFeedback').isVisible(), mode === 'TREINO');
        if (type === 'FULL') {
          await page.evaluate(() => { App.currentIndex = App.exam.findIndex(q => q.id === 'MOCK-ING-1'); renderQuestion(); });
          assert(await page.locator('#qContext').isVisible());
          assert((await page.locator('#qContext').innerText()).includes('mock interno'));
        }
        // 45 pontos, mas Inglês zerado: reprovação obrigatória.
        await page.evaluate(() => {
          App.answers = new Map(App.exam.map(q => [q.id, q.area === 'ING' || (q.area === 'ESP' && Number(q.id.split('-').pop()) >= 35) ? 1 : 0]));
        });
        await page.locator('#btnFinish').click(); await page.locator('#view-result').waitFor({ state: 'visible' });
        if (type === 'FULL') {
          assert((await page.locator('#scoreLine').innerText()).includes('45 / 70'));
          assert.equal(await page.locator('#statusLine').innerText(), 'Situação: REPROVADO');
          assert((await page.locator('#view-result .kpis').first().innerText()).includes('Nota zero em Língua Inglesa.'));
          assert(await page.locator('#wrongList .feedback:not(.hidden)').count() > 0);
          assert((await page.locator('#errorsLine').innerText()).includes('Erros: 25'));
        } else assert((await page.locator('#statusLine').innerText()).includes('NÃO APLICÁVEL'));
        const history = await page.evaluate(() => readJSON(App.historyKey, [])[0]);
        assert.equal(history.mode, mode); assert.equal(history.type, type); assert(history.bySubject.ESP.ergonomia);
        await page.locator('#btnRetryWrong').click(); await page.locator('#view-exam').waitFor({ state: 'visible' });
        assert(await page.evaluate(() => groupToBlocks(App.exam).every(b => b.some(q => getWrongIdsSet().has(q.id)))));
        await page.evaluate(() => { App.answers = new Map(App.exam.map(q => [q.id, q.answer])); });
        await page.locator('#btnFinish').click(); assert.equal(await page.evaluate(() => getWrongIdsSet().size), 0);
        await page.locator('#btnNew').click();
      }
    }
    // Approval display and Transpetro timer: no 4h ALERO timeout; warning at 4h15.
    await page.locator('input[name=type][value=FULL]').check(); await page.locator('#btnStart').click();
    await page.locator('#view-exam').waitFor({ state: 'visible' });
    await page.evaluate(() => { App.timer.startAt = Date.now() - 240 * 60000; }); await page.waitForTimeout(350);
    assert(await page.locator('#view-exam').isVisible()); assert.equal(dialogs.filter(t => t.includes('faltam 15 minutos')).length, 0);
    await page.evaluate(() => { App.timer.startAt = Date.now() - 255 * 60000; }); await page.waitForTimeout(350);
    assert(dialogs.some(t => t.includes('faltam 15 minutos')));
    await page.evaluate(() => { App.answers = new Map(App.exam.map(q => [q.id, q.answer])); App.timer.startAt = Date.now() - 270 * 60000; });
    await page.locator('#view-result').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#statusLine').innerText(), 'Situação: APROVADO');
    assert.equal(await page.evaluate(() => App.timer.running), false);
    assert.equal(await page.evaluate(() => readJSON(App.historyKey, [])[0].points), 70);
    assert(!((await page.locator('#view-result').innerText()).includes('NaN')));
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log('PASS: Transpetro UI, PROVA/TREINO, FULL/ESP/ERRADAS, criteria, context, subjects, history and 4h30 timer (memory mocks only).');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
