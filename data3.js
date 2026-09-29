// ---------------------------------------------------------------------------
// Level 3 -- factorial designs and interactions.
//
// Nothing here is a fixed list of questions: every box and every graph is
// generated, so the level can't be learned by recognising pictures.
// ---------------------------------------------------------------------------

// Factors for the box notation (3a), in the style of the lecture's own:
// Prime (passive / active / silence) x Priming context (speaking /
// listening). Each has its levels for however many it can sensibly have,
// so a random "3 x 4" can always be filled with a real design.
const FACTOR_POOL = [
  { name: 'Prime', levels: { 2: ['passive', 'active'], 3: ['passive', 'active', 'silence'] } },
  { name: 'Priming context', levels: { 2: ['speaking', 'listening'] } },
  { name: 'wh-word', levels: { 2: ['what', 'which'] } },
  { name: 'Item type', levels: { 2: ['test', 'control'], 3: ['test', 'control', 'filler'] } },
  { name: 'Proficiency', levels: { 2: ['learner', 'native'], 3: ['beginner', 'advanced', 'native'], 4: ['beginner', 'intermediate', 'advanced', 'native'] } },
  { name: 'Age group', levels: { 2: ['5 years', '8 years'], 3: ['3 years', '5 years', '7 years'], 4: ['3 years', '5 years', '7 years', '9 years'] } },
  { name: 'Word frequency', levels: { 2: ['low', 'high'], 3: ['low', 'medium', 'high'] } },
  { name: 'Font size', levels: { 2: ['small', 'large'], 3: ['small', 'medium', 'large'] } },
  { name: 'Language', levels: { 2: ['English', 'Irish'], 3: ['English', 'Irish', 'Polish'], 4: ['English', 'Irish', 'Polish', 'Spanish'] } },
  { name: 'Teaching method', levels: { 2: ['A', 'B'], 3: ['A', 'B', 'C'], 4: ['A', 'B', 'C', 'D'] } },
  { name: 'Background noise', levels: { 2: ['quiet', 'noisy'], 3: ['quiet', 'moderate', 'loud'] } },
  { name: 'Sentence voice', levels: { 2: ['active', 'passive'] } },
  { name: 'Testing time', levels: { 3: ['pretest', 'year 1', 'year 2'], 4: ['pretest', 'term 1', 'term 2', 'term 3'] } },
  { name: 'Response type', levels: { 2: ['yes/no', '1–7 scale'] } },
];

const FACTOR_LEVEL_COUNTS = [2, 3, 4];

// Two different factors, one with nA levels and one with nB.
function pickFactorPair(nA, nB) {
  const a = pick(FACTOR_POOL.filter(f => f.levels[nA]));
  const b = pick(FACTOR_POOL.filter(f => f !== a && f.levels[nB]));
  return [{ name: a.name, levels: a.levels[nA] }, { name: b.name, levels: b.levels[nB] }];
}

// ---------------------------------------------------------------------------
// Bar-graph data for 3b and 3c. Each cell (level i of A, level j of B) is
//
//   base + aEffect[i] + bEffect[j] + interaction[i][j]
//
// built so that each of the three things is either clearly there or
// exactly absent -- never a borderline case the game couldn't mark fairly:
//
//   - A main effect, when present, spreads the averages over at least 4
//     points (8 in 3c); when absent, every level averages exactly the same.
//   - The interaction is "double-centred": every row and every column of it
//     sums to zero. That's what lets it change the pattern WITHOUT moving
//     any average -- so an interaction never fakes a main effect, and a
//     graph can show an interaction with no main effects at all.
//   - When present, the interaction is scaled so the gap between colours
//     visibly changes (by at least 3 points) from one group to the next.
// ---------------------------------------------------------------------------
const BAR_BASE = 13;

function mainEffectOffsets(n, spread, ordered) {
  // Evenly spaced values, centred on zero. In the hard version they come
  // in a random order -- an effect doesn't have to go up with the level
  // number -- and in the easy one they run steadily up or down.
  const raw = Array.from({ length: n }, (_, i) => (i / (n - 1) - 0.5) * spread);
  if (ordered) return Math.random() < 0.5 ? raw : raw.reverse();
  return shuffle(raw);
}

function interactionMatrix(nA, nB, size) {
  for (;;) {
    const m = Array.from({ length: nA }, () => Array.from({ length: nB }, () => Math.random() * 2 - 1));
    const rowMean = m.map(r => r.reduce((s, x) => s + x, 0) / nB);
    const colMean = Array.from({ length: nB }, (_, j) => m.reduce((s, r) => s + r[j], 0) / nA);
    const all = rowMean.reduce((s, x) => s + x, 0) / nA;
    const c = m.map((r, i) => r.map((x, j) => x - rowMean[i] - colMean[j] + all));
    const big = Math.max(...c.flat().map(Math.abs));
    if (big > 0.3) return c.map(r => r.map(x => x / big * size));
  }
}

// `easy` (3c): main effects are big -- a spread of 8 or more points, the
// size of the interaction at most -- so "is there a main effect?" can be
// answered by eye; A's run steadily up or down. The size-of-design
// sub-level (3b) uses the harder, more varied version, since there the
// heights don't matter.
function makeFactorialData(nA, nB, effects, easy = false) {
  const spread = easy ? randBetween3(8, 9) : randBetween3(4.2, 7);
  const a = effects.mainA ? mainEffectOffsets(nA, spread, easy) : Array(nA).fill(0);
  const b = effects.mainB ? mainEffectOffsets(nB, easy ? randBetween3(7, 8) : spread, easy) : Array(nB).fill(0);
  const ab = effects.interaction ? interactionMatrix(nA, nB, easy ? 2 : 3) : Array.from({ length: nA }, () => Array(nB).fill(0));
  const cells = a.map((ai, i) => b.map((bj, j) => BAR_BASE + ai + bj + ab[i][j]));
  const meansA = cells.map(r => r.reduce((s, x) => s + x, 0) / nB);
  const meansB = Array.from({ length: nB }, (_, j) => cells.reduce((s, r) => s + r[j], 0) / nA);
  return { nA, nB, cells, meansA, meansB, effects };
}

function randBetween3(lo, hi) { return lo + Math.random() * (hi - lo); }

function randomEffects() {
  return { mainA: Math.random() < 0.5, mainB: Math.random() < 0.5, interaction: Math.random() < 0.5 };
}
