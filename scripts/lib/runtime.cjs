// Harness de leitura/teste: executa o mesmo app.js sem navegador nem dependências.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
function createRuntime() {
  const storage = new Map();
  const element = () => ({ classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {}, replaceChildren() {}, appendChild() {}, append() {} });
  const context = vm.createContext({ console, setInterval, clearInterval,
    document: { getElementById: element, createElement: element, addEventListener() {} },
    window: { addEventListener() {} },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) },
    fetch: async file => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '')) })
  });
  const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  vm.runInContext(source + `\nglobalThis.api = { App, CONCURSOS, evaluateTranspetro, evaluateAlero,
    computeScore, saveResults, validateQuestion, validateBank, loadQuestionsBank, generateExam, groupToBlocks,
    setRoleStorageKeys, readJSON, writeJSON, getCycleIds, clearStorage, aggregateHistory };`, context);
  return { ...context.api, context, storage };
}
function select(r, contest = 'TRANSPETRO', role = 'ENG_SEG', type = 'FULL') {
  Object.assign(r.App, { contest, role, type }); r.setRoleStorageKeys();
}
module.exports = { createRuntime, select, root };
