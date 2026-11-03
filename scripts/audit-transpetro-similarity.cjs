const { loadRows, normalize } = require('./validate-transpetro.cjs');
const allRows = loadRows();
const requested = process.argv.indexOf('--lote');
const batch = requested < 0 ? Math.max(...allRows.map(x => x.q.lote || 1)) : Number(process.argv[requested + 1]);
if (!Number.isInteger(batch) || batch < 1) throw new Error('Lote inválido');
const rows = allRows.filter(x => (x.q.lote || 1) <= batch);
const grams = text => {
  const words = normalize(text).replace(/\d+(?:[.,]\d+)*/g, '#').split(' ');
  return new Set(words.slice(0, -2).map((_, i) => words.slice(i, i + 3).join(' ')));
};
const jaccard = (a, b) => {
  const common = [...a].filter(x => b.has(x)).length;
  return common / (a.size + b.size - common || 1);
};
const features = rows.map(({ q }) => ({ q, stem: grams(q.statement.split('\n\n').at(-1)), options: grams(q.options.slice().sort().join(' ')) }));
const pairs = [];
for (let i = 0; i < features.length; i++) for (let j = i + 1; j < features.length; j++) {
  const a = features[i], b = features[j];
  const stem = jaccard(a.stem, b.stem), options = jaccard(a.options, b.options);
  pairs.push({ a: a.q.id, b: b.q.id, stem: +stem.toFixed(4), options: +options.toFixed(4), score: +(0.6 * stem + 0.4 * options).toFixed(4), scope: (a.q.lote || 1) === batch && (b.q.lote || 1) === batch ? 'novas_novas' : (a.q.lote || 1) === batch || (b.q.lote || 1) === batch ? 'novas_antigas' : 'antigas_antigas' });
}
pairs.sort((a, b) => b.score - a.score);
const flagged = pairs.filter(p => p.score >= 0.55 || p.stem >= 0.8);
const lengths = {};
for (const area of ['PORT', 'ING', 'ESP']) {
  const qs = rows.map(x => x.q).filter(q => q.area === area);
  lengths[area] = { total: qs.length,
    correctLongerThanDistractorMedian: qs.filter(q => { const ls = q.options.filter((_, i) => i !== q.answer).map(s => s.length).sort((a, b) => a - b); return q.options[q.answer].length > (ls[1] + ls[2]) / 2; }).length };
}
let maxRun = 0, run = 0, last;
for (const { q } of rows) { run = q.answer === last ? run + 1 : 1; last = q.answer; maxRun = Math.max(maxRun, run); }
const scopes = { novas_novas: 0, novas_antigas: 0, antigas_antigas: 0 };
for (const pair of pairs) scopes[pair.scope]++;
const result = { lote: batch, scopes, comparedPairs: pairs.length, flagged, topPairs: pairs.slice(0, 15), lengths, maxSameAnswerRun: maxRun,
  limitation: 'Triagem lexical com números neutralizados e contexto compartilhado excluído. Não detecta toda paráfrase semântica; exige revisão editorial de cenários/raciocínios.' };
console.log(JSON.stringify(result, null, 2));
process.exitCode = flagged.length ? 1 : 0;
