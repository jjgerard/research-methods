#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Checks every subject pool, and every playable discipline, against the
// rules in pools/README.md.
//
//   node tools/check-pools.js            check everything
//   node tools/check-pools.js physical   check one pool (plus the disciplines using it)
//
// It loads the same files the page does, in the same order, so what passes
// here is what the game will see.
// ---------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const only = process.argv[2];
const ctx = { console, Math };
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });

// The page's order: engine helpers, the Language pool's original data, the
// discipline map, then every pool file.
for (const f of ['parser.js', 'data.js', 'data2.js', 'data3.js', 'disciplines.js']) load(f);
const poolFiles = fs.readdirSync(path.join(root, 'pools')).filter(f => f.endsWith('.js')).sort();
for (const f of poolFiles) load(`pools/${f}`);
const { POOLS, DISCIPLINES } = vm.runInContext('({ POOLS, DISCIPLINES })', ctx);
const matchAnswer = vm.runInContext('matchAnswer', ctx);

const problems = [];
const warn = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);

const OPEN = {
  categorical: 'Categorical: distinct outcomes with no order. ',
  ordinal: 'Ordinal: the outcomes are ranked, but the difference between steps is arbitrary. ',
  interval: 'Interval: ranked, with a constant difference between steps, but no natural zero — so values aren\'t "twice as much". ',
  ratio: 'Ratio: ranked, constant steps AND a natural zero, so "twice as much" makes sense. ',
};
const CONT_OPEN = 'It can take any value on a scale, including every value in between';
const DISC_OPEN = 'It only comes in separate values, with nothing in between';
const AMERICAN = /\b(behavior|color|analyze|center|fertilizer|organize|realize|practice (?:for|every|each|the movement)|labor|favor|gray)\b/i;

const str = v => typeof v === 'string' && v.trim().length > 0;
const count = (list, pred) => list.filter(pred).length;

function checkText(where, text) {
  if (AMERICAN.test(text)) warn.push(`${where}: American spelling? "${text.match(AMERICAN)[0]}"`);
}

function checkCandidate(where, c) {
  if (!c || !str(c.name)) return bad(where, 'missing name');
  if (!Array.isArray(c.aliases) || c.aliases.length < 2) bad(where, `"${c.name}" needs aliases (2+)`);
}

function checkDesign(where, d, cats) {
  if (!cats.includes(d.cat)) bad(where, `cat must be one of ${cats.join('/')}, got ${d.cat}`);
  if (!str(d.label)) return bad(where, 'missing label');
  checkText(where, d.label);
  if (!Array.isArray(d.ivs) || !d.ivs.length) return bad(where, 'needs ivs: [...]');
  d.ivs.forEach((v, i) => checkCandidate(`${where} iv${i}`, v));
  checkCandidate(`${where} dv`, d.dv);
  if (!Array.isArray(d.others)) bad(where, 'needs others: [...] (may be empty)');
  // Every correct answer, typed exactly as its own name, must be read as itself.
  const cands = [...d.ivs.map((v, i) => ({ id: `iv${i}`, ...v })), { id: 'dv', ...d.dv }, ...(d.others || []).map((o, i) => ({ id: `o${i}`, ...o }))];
  for (const c of cands) {
    if (!c.name) continue;
    const r = matchAnswer(c.name, cands);
    if (!(r.status === 'match' && r.id === c.id)) bad(where, `typing "${c.name}" isn't read as itself (${r.status}${r.ids ? ' ' + r.ids.join(',') : r.id ? ' ' + r.id : ''}) — its aliases overlap another candidate's`);
  }
}

const relationIds = new Map();

function checkPool(id, P) {
  const W = k => `${id}.${k}`;
  const need = ['sortItems', 'relations', 'validity', 'continuity', 'measurement', 'confounds', 'designs', 'crosslong', 'factors'];
  for (const k of need) if (!P[k]) bad(id, `missing ${k}`);
  if (problems.length && need.some(k => !P[k])) return;

  P.sortItems.forEach((s, i) => {
    if (!str(s.label) || typeof s.variable !== 'boolean' || !str(s.why)) bad(`${W('sortItems')}[${i}]`, 'needs label, variable (true/false), why');
    else checkText(`${W('sortItems')}[${i}]`, s.why);
  });

  P.relations.forEach((r, i) => {
    const w = `${W('relations')}[${i}] ${r.id || ''}`;
    for (const k of ['id', 'iv', 'dv', 'ivAxis', 'dvAxis', 'why']) if (!str(r[k])) bad(w, `missing ${k}`);
    if (!['up', 'down'].includes(r.dir)) bad(w, 'dir must be up or down');
    if (!Array.isArray(r.says) || r.says.length < 2) bad(w, 'says needs 2 phrasings');
    if (!Array.isArray(r.hyp) || r.hyp.length !== 2 || !r.hyp.every(str)) bad(w, 'hyp needs [ivShort, dvShort]');
    // Six hypotheses built from these have to fit on a 360x640 phone.
    else if (r.hyp[0].length + r.hyp[1].length > 36) bad(w, `hyp short names are too long together (${r.hyp[0].length + r.hyp[1].length} > 36 characters)`);
    if ((r.ivAxis || '').length > 16 || (r.dvAxis || '').length > 16) bad(w, 'axis labels must be ≤ 16 characters');
    if (r.id) {
      if (relationIds.has(r.id)) bad(w, `relation id "${r.id}" also used in pool ${relationIds.get(r.id)}`);
      relationIds.set(r.id, id);
    }
    [...(r.says || []), r.why || ''].forEach(t => checkText(w, t));
  });

  P.validity.forEach((v, i) => {
    const w = `${W('validity')}[${i}]`;
    if (typeof v.valid !== 'boolean' || typeof v.reliable !== 'boolean') bad(w, 'needs valid and reliable (true/false)');
    for (const k of ['text', 'whyValid', 'whyReliable']) if (!str(v[k])) bad(w, `missing ${k}`);
    if (str(v.whyValid) && /^[A-Z]/.test(v.whyValid) && !/^[A-Z]{2}|^I\b/.test(v.whyValid)) warn.push(`${w}: whyValid should start lower case (it follows "It IS valid: ")`);
    if (v.text) checkText(w, v.text);
  });

  P.continuity.forEach((c, i) => {
    const w = `${W('continuity')}[${i}] ${c.label || ''}`;
    if (!['cont', 'disc'].includes(c.cat)) bad(w, 'cat must be cont or disc');
    if (!str(c.label) || !str(c.why)) bad(w, 'needs label and why');
    else if (!c.why.startsWith(c.cat === 'cont' ? CONT_OPEN : DISC_OPEN)) bad(w, 'why must start with the standard opening');
  });

  P.measurement.forEach((m, i) => {
    const w = `${W('measurement')}[${i}] ${m.label || ''}`;
    if (!OPEN[m.cat]) bad(w, 'cat must be categorical, ordinal, interval or ratio');
    else if (!str(m.why) || !m.why.startsWith(OPEN[m.cat])) bad(w, 'why must start with the standard opening for its level');
  });

  P.confounds.forEach((c, i) => {
    const w = `${W('confounds')}[${i}]`;
    for (const k of ['iv', 'dv', 'text', 'why']) if (!str(c[k])) bad(w, `missing ${k}`);
    if (c.confound) {
      if (!Array.isArray(c.vars) || c.vars.length < 4) bad(w, 'vars needs 4 entries: IV, DV, confound, one more');
      else for (const k of ['iv', 'dv', 'confound']) if (!c.vars.includes(c[k])) bad(w, `vars must include the ${k} "${c[k]}" exactly`);
    } else if (c.confound !== null) bad(w, 'confound must be a string or null');
    if (c.text) checkText(w, c.text);
  });

  P.designs.forEach((d, i) => checkDesign(`${W('designs')}[${i}]`, d, ['within', 'between']));
  const cl = P.crosslong || {};
  for (const part of ['single', 'multi', 'panel']) {
    if (!Array.isArray(cl[part])) { bad(W('crosslong'), `missing ${part}`); continue; }
    cl[part].forEach((d, i) => {
      checkDesign(`${W('crosslong.' + part)}[${i}]`, d, part === 'panel' ? ['both'] : ['cross', 'long']);
      const n = (d.ivs || []).length;
      if (part === 'single' && n !== 1) bad(`${W('crosslong.single')}[${i}]`, 'single designs have exactly one IV');
      if (part !== 'single' && n !== 2) bad(`${W('crosslong.' + part)}[${i}]`, `${part} designs have exactly two IVs`);
    });
  }

  P.factors.forEach((f, i) => {
    const w = `${W('factors')}[${i}] ${f.name || ''}`;
    if (!str(f.name) || !f.levels) return bad(w, 'needs name and levels');
    for (const [n, labels] of Object.entries(f.levels)) {
      if (!['2', '3', '4'].includes(n) || labels.length !== Number(n)) bad(w, `levels[${n}] must list exactly ${n} labels`);
      labels.forEach(l => { if (l.length > 14) warn.push(`${w}: level label "${l}" is over 14 characters`); });
    }
  });

  // `for` must name real disciplines that actually use this pool.
  const users = Object.entries(DISCIPLINES).filter(([, d]) => d.pools.includes(id)).map(([k]) => k);
  const allItems = [...P.sortItems, ...P.relations, ...P.validity, ...P.continuity, ...P.measurement, ...P.confounds, ...P.designs,
    ...(cl.single || []), ...(cl.multi || []), ...(cl.panel || []), ...P.factors];
  allItems.forEach(it => (it.for || []).forEach(d => {
    if (!DISCIPLINES[d]) bad(id, `for: unknown discipline "${d}"`);
    else if (!users.includes(d)) bad(id, `for: "${d}" doesn't draw on the ${id} pool`);
  }));
}

// What one discipline actually gets: its pools merged, `for` applied. Must
// match content() in app.js.
function merged(discId) {
  const d = DISCIPLINES[discId];
  const keep = it => !it.for || it.for.includes(discId);
  const out = { sortItems: [], relations: [], validity: [], continuity: [], measurement: [], confounds: [], designs: [], single: [], multi: [], panel: [], factors: [] };
  const POOL_SUBJECTS = vm.runInContext('POOL_SUBJECTS', ctx);
  d.pools.forEach((pid, i) => {
    const P = POOLS[pid];
    if (!P) return;
    const sameKind = i === 0 || POOL_SUBJECTS[pid] === d.subjects;
    for (const k of ['sortItems', 'relations', 'validity', 'continuity', 'measurement', 'factors']) out[k].push(...P[k].filter(keep));
    if (!sameKind) return;
    for (const k of ['confounds', 'designs']) out[k].push(...P[k].filter(keep));
    for (const k of ['single', 'multi', 'panel']) out[k].push(...(P.crosslong[k] || []).filter(keep));
  });
  return out;
}

function checkDiscipline(discId) {
  const m = merged(discId);
  const w = `discipline ${discId}`;
  const min = (what, n, got) => { if (got < n) bad(w, `needs at least ${n} ${what}, has ${got}`); };
  min('variables (1a)', 12, count(m.sortItems, s => s.variable));
  min('not-variables (1a)', 8, count(m.sortItems, s => !s.variable));
  min('relations', 12, m.relations.length);
  min('relations going down', 4, count(m.relations, r => r.dir === 'down'));
  for (const [v, r] of [[true, true], [true, false], [false, true], [false, false]]) min(`validity items valid=${v} reliable=${r}`, 2, count(m.validity, x => x.valid === v && x.reliable === r));
  min('continuous', 6, count(m.continuity, c => c.cat === 'cont'));
  min('discrete', 6, count(m.continuity, c => c.cat === 'disc'));
  for (const lvl of Object.keys(OPEN)) min(`${lvl} (2e)`, 3, count(m.measurement, x => x.cat === lvl));
  min('confounded designs', 5, count(m.confounds, c => c.confound));
  min('unconfounded designs', 5, count(m.confounds, c => !c.confound));
  min('within designs', 4, count(m.designs, x => x.cat === 'within'));
  min('between designs', 4, count(m.designs, x => x.cat === 'between'));
  min('cross-sectional single', 2, count(m.single, x => x.cat === 'cross'));
  min('longitudinal single', 2, count(m.single, x => x.cat === 'long'));
  min('two-factor designs', 4, m.multi.length);
  min('panel designs', 4, m.panel.length);
  for (const n of [2, 3, 4]) min(`factors with ${n} levels`, 2, count(m.factors, f => f.levels && f.levels[n]));
}

const poolIds = Object.keys(POOLS).filter(p => !only || p === only);
for (const id of poolIds) checkPool(id, POOLS[id]);
const playable = Object.keys(DISCIPLINES).filter(d => POOLS[DISCIPLINES[d].pools[0]] && (!only || DISCIPLINES[d].pools.includes(only)));
for (const d of playable) checkDiscipline(d);

for (const w of warn) console.log('warning  ' + w);
for (const p of problems) console.log('PROBLEM  ' + p);
console.log(`\nPools checked: ${poolIds.join(', ') || '(none)'}`);
console.log(`Playable disciplines checked: ${playable.join(', ') || '(none)'}`);
console.log(problems.length ? `\n${problems.length} problem(s).` : '\nAll good.');
process.exit(problems.length ? 1 : 0);
