// Resoluções refeitas, separadas da autoria. Cada regra confronta as CINCO
// alternativas e exige correspondência numérica única com o valor recalculado.
const { loadRows } = require('./validate-transpetro.cjs');
const all = new Map(loadRows().map(x => [x.q.id, x.q]));
const numbers = s => (s.match(/\d+(?:[.,]\d+)*/g) || []).map(v => Number(v.includes(',') ? v.replace(/\./g, '').replace(',', '.') : /^\d{1,3}(?:\.\d{3})+$/.test(v) ? v.replace(/\./g, '') : v));
const eq = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-8);
const cases = [
 ['ESP', 1, [0.02 * 100 ** 2 / 2]], ['ESP', 3, [800 * 10 * 1 / 4]],
 ['ESP', 9, [(300000 / 2) * 3.14 * (0.2 * 2) ** 2 / 4]],
 ['ESP', 10, [1200 * 10 * 0.6 / 1.5, 1200 * 10 * 0.4 / 2]],
 ['ESP', 13, [2 * 120 / 1000]], ['ESP', 14, [(2.4 - 0.4) / 0.5]],
 ['ESP', 15, [(2 * 2 + 6 * 6) / 8]], ['ESP', 16, [+((70 + 10 * Math.log10(2))).toFixed(0)]],
 ['ESP', 17, [30 / 0.5]], ['ESP', 23, [(0.96 - 0.06) / (2 * 150 / 1000), +((0.96 - 0.06) / (1.8 * 150 / 1000)).toFixed(2)]],
 ['ESP', 24, [(20 * 3 + 30 * 1) / (20 + 30 + 10)]], ['ESP', 25, [+(-10 * Math.log10(0.8 / 4 + 0.2)).toFixed(2)]],
 ['ESP', 26, [(2 + 4) / 4, (2 + 4 + 1 + 1) / 4]],
 ['ESP', 27, [400 - 50 + 20 + (30 - 20) - (250 + 40), (20 + 40) / 150 * 100, 400 - 50 + 20 + 30 - 250]],
 ['ESP', 29, [0.02 * 5000000 / 1000, 0.10 * 400000 / 1000]],
 ['ESP', 32, [10 * 2 * 2]], ['ESP', 33, [0.02 + 0.03 - 0.02 * 0.03]],
 ['ESP', 37, [0.2 * 0.1 * 0.2, 0.2 * 0.1 * 0.8]],
 ['ESP', 38, [0.1 * 0.4, 0.1 * 0.4 + 0.9 * 0.02]],
 ['ESP', 39, [0.06 * (400 - 100) / 10, (0.04 - 0.01) * 1000 / 20]],
 ['ESP', 40, [0.01 + (1 - 0.01) * 0.02 ** 2]],
 ['ESP', 44, [90 / 100 * 100, 40 / 50 * 100, 90 / 100 * 0.5 * 100, 40 / 50 * 0.9 * 100]],
 ['ESP', 46, [6 / 300000 * 1e6, 8 / 800000 * 1e6]],
 ['ESP', 48, [(1 * 900000 + 4 * 100000) / 1e6, (1 * 500000 + 4 * 500000) / 1e6]],
 ['ESP', 52, [Math.max(8, 4 + 5), Math.max(8 - 3, 4 + 5)]],
 ['ESP', 58, [20 / 100 * 100, 15 / 300 * 100, (20 / 100) / (15 / 300)]],
 ['ESP', 59, [Math.floor(12 / (1 - 0.2)) + 1]],
 ['ESP', 60, [(1 - (600 / 15000) / (500 / 10000)) * 100, (600 / 500 - 1) * 100, (1 - 900 / 1000) * 100, (1 - (900 / 15000) / (1000 / 10000)) * 100]],
 ['PORT', 10, [(90 / 60 - 1) * 100, 60 / 100 * 100, 90 / 200 * 100]]
];
const results = cases.map(([area, number, expected]) => {
 const id = `TP26-ENGSEG-${area}-${String(number).padStart(4, '0')}`, q = all.get(id);
 const matches = q.options.map((s, i) => eq(numbers(s), expected) ? i : -1).filter(i => i >= 0);
 return { id, recalculated: expected, matches, answer: q.answer, passed: matches.length === 1 && matches[0] === q.answer };
});
// Tempo e distância: opções escritas como frações, comparadas ao cálculo físico.
const dose = all.get('TP26-ENGSEG-ESP-0028'), expectedDose = (1 / 3 ** 2) * (9 / 4);
const fractions = { 'Um quarto da dose inicial.': 1 / 4, 'Um nono da dose inicial.': 1 / 9, 'Três quartos da dose inicial.': 3 / 4, 'A mesma dose inicial.': 1, 'Nove quartos da dose inicial.': 9 / 4 };
const matches = dose.options.map((s, i) => Math.abs(fractions[s] - expectedDose) < 1e-8 ? i : -1).filter(i => i >= 0);
results.push({ id: dose.id, recalculated: expectedDose, matches, answer: dose.answer, passed: matches.length === 1 && matches[0] === dose.answer });
console.log(JSON.stringify({ checked: results.length, passed: results.every(r => r.passed), results }, null, 2));
process.exitCode = results.every(r => r.passed) ? 0 : 1;
