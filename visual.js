// ---------------------------------------------------------------------------
// The visual sub-levels: questions answered by building, placing or moving
// something on screen rather than by choosing a sentence. They use the
// shapes the sister games are built from -- circles and squares -- with one
// meaning kept throughout: the independent variable is a circle, the
// dependent variable a square.
//
// Each is an ordinary question type (see quiz.js) and replaces the text
// version of the same sub-level in QUESTION_TYPES, so the streak, hearts,
// points and feedback are exactly as before.
// ---------------------------------------------------------------------------
const SHAPE_FILL = { circle: '#e4572e', square: '#2e86ab', triangle: '#5c8a2e' };
let svgIdCounter = 0;

// One shape centred on (cx, cy), r across from the centre to the edge.
function shapeEl(type, cx, cy, r, attrs = {}) {
  const fill = attrs.fill || SHAPE_FILL[type];
  if (type === 'circle') return svgEl('circle', { cx, cy, r, fill, ...attrs });
  if (type === 'square') {
    const s = r * 0.9;
    return svgEl('rect', { x: cx - s, y: cy - s, width: 2 * s, height: 2 * s, rx: s * 0.28, fill, ...attrs });
  }
  const h = r * 1.05;
  return svgEl('polygon', { points: `${cx},${cy - h} ${cx + h},${cy + h * 0.8} ${cx - h},${cy + h * 0.8}`, fill, ...attrs });
}

function shapeIcon(type, size = 26, label = '') {
  const svg = svgEl('svg', { viewBox: '0 0 30 30', width: size, height: size, class: 'shape-icon', 'aria-hidden': 'true' });
  svg.appendChild(shapeEl(type, 15, 15, 12));
  if (label) svg.setAttribute('aria-label', label);
  return svg;
}

// Diagonal stripes for a shape that differs in something extra (2i).
function stripeDefs(svg) {
  const id = `stripes-${++svgIdCounter}`;
  const defs = svgEl('defs');
  defs.innerHTML = `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
    '<rect width="7" height="7" fill="#2e86ab"/><rect width="3" height="7" fill="#ffffff"/></pattern>';
  svg.appendChild(defs);
  return `url(#${id})`;
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// ---------------- 1b / 1c: build the arrow ----------------
// The changer goes in the circle, the change-ee in the square, with an
// arrow from one to the other: the relation is something you build, not a
// word you pick. Half the time the question asks for the change-ee, so
// "tap whichever did the changing" can't become a reflex.
function rolesArrowQuestion(recent, sub) {
  const rel = pickFresh(content().relations, recent, r => r.id);
  const terms = ROLE_TERMS[sub.terms];
  const askChanger = Math.random() < 0.5;
  const wanted = askChanger ? terms.changer : terms.changee;
  const slotNames = sub.terms === 'plain' ? ['changer', 'change-ee'] : ['independent variable', 'dependent variable'];
  const names = { iv: rel.iv, dv: rel.dv };
  let inCircle = null;
  let slots = [];

  const render = (box, submit) => {
    const build = el('div', 'arrow-build');
    slots = ['circle', 'square'].map((type, i) => {
      const s = makeButton('', 'answer-btn role-slot');
      s.dataset.slot = type;
      const head = el('span', 'role-slot-head');
      head.append(shapeIcon(type, 22), el('span', '', slotNames[i]));
      s.append(head, el('span', 'role-slot-name', '…'));
      s.disabled = true;
      // Once both are placed, tapping either swaps them round.
      s.addEventListener('click', () => { place(inCircle === 'iv' ? 'dv' : 'iv'); });
      return s;
    });
    const arrow = el('div', 'role-arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    build.append(slots[0], arrow, slots[1]);

    const tiles = el('div', 'role-tiles');
    shuffle(['iv', 'dv']).forEach(role => {
      const t = makeButton(names[role], 'answer-btn role-tile');
      t.dataset.role = role;
      t.addEventListener('click', () => place(askChanger ? role : (role === 'iv' ? 'dv' : 'iv')));
      tiles.appendChild(t);
    });
    const check = makeButton('Check the arrow', 'btn-primary check-btn');
    check.disabled = true;
    check.addEventListener('click', () => submit(inCircle));

    function place(circleRole) {
      inCircle = circleRole;
      slots[0].querySelector('.role-slot-name').textContent = names[circleRole];
      slots[1].querySelector('.role-slot-name').textContent = names[circleRole === 'iv' ? 'dv' : 'iv'];
      slots.forEach(s => { s.disabled = false; s.classList.add('filled'); s.setAttribute('aria-label', `${s.textContent}. Tap to swap.`); });
      tiles.classList.add('hidden');
      build.classList.add('built');
      check.disabled = false;
    }
    box.append(build, tiles, check);
  };

  const grade = (circleRole) => {
    disableAll(document.getElementById('quiz-answers'));
    const correct = circleRole === 'iv';
    slots.forEach(s => s.classList.add(correct ? 'is-answer' : 'is-wrong'));
    return {
      correct,
      explain: `The arrow goes from ${rel.iv} to ${rel.dv}: ${rel.iv} is the ${terms.changer} (the circle) and ${rel.dv} is the ${terms.changee} (the square). ${rel.why}`,
    };
  };

  return {
    key: rel.id,
    prompt: { quote: pick(rel.says) },
    question: askChanger
      ? `Tap the <strong>${wanted}</strong>: it goes in the circle.`
      : `Tap the <strong>${wanted}</strong>: it goes in the square.`,
    layout: 'arrow',
    // What to tap for the right answer.
    answer: askChanger ? 'iv' : 'dv',
    render,
    grade,
  };
}

// ---------------- 2b / 2c: hypotheses on their graphs ----------------
// A rising line, a falling line and (with the null) a flat one, all with
// the IV along the bottom. Each graph takes one hypothesis. The opposing
// pair is the rising and falling line; the null is the flat line -- "no
// effect" drawn. Backwards hypotheses have no graph here, because every
// graph has the IV along the bottom.
const HYP_GRAPH_WORDS = { up: 'rising line', down: 'falling line', null: 'flat line' };

function miniGraph(kind) {
  const svg = svgEl('svg', { viewBox: '0 0 100 62', class: 'mini-graph', role: 'img', 'aria-label': `A ${HYP_GRAPH_WORDS[kind]}` });
  svg.appendChild(svgEl('path', { d: 'M 10 4 L 10 54 L 96 54', class: 'mini-axes' }));
  const [y0, y1] = kind === 'up' ? [46, 12] : kind === 'down' ? [12, 46] : [29, 29];
  svg.appendChild(svgEl('line', { x1: 18, y1: y0, x2: 90, y2: y1, class: 'mini-line' }));
  [0.1, 0.37, 0.63, 0.9].forEach((t, i) => {
    const x = 18 + t * 72, y = y0 + t * (y1 - y0) + (i % 2 ? 4 : -4);
    svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 3.6, class: 'mini-dot' }));
  });
  return svg;
}

function hypothesisGraphQuestion(recent, sub) {
  const rel = pickFresh(content().relations, recent, r => r.id);
  const iv = rel.ivNP || rel.iv;
  const dv = rel.dvNP || rel.dv;
  const texts = hypothesisTexts(rel);
  const [ivShort, dvShort] = rel.hyp;
  const ids = shuffle(sub.withNull
    ? ['f-up', 'f-down', 'b-up', 'b-down', 'f-null', 'b-null']
    : ['f-up', 'f-down', 'b-up', 'b-down']);
  const graphs = sub.withNull ? ['up', 'down', 'null'] : ['up', 'down'];
  const want = { up: 'f-up', down: 'f-down', null: 'f-null' };
  const onGraph = {};          // graph -> hypothesis id
  let heldTile = null;
  let heldGraph = null;
  const tiles = {};
  const cards = {};

  const render = (box, submit) => {
    const row = el('div', 'hyp-graphs');
    graphs.forEach(g => {
      const c = makeButton('', 'answer-btn hyp-graph');
      c.dataset.graph = g;
      c.appendChild(miniGraph(g));
      c.addEventListener('click', () => {
        if (heldTile) { put(heldTile, g); return; }
        heldGraph = heldGraph === g ? null : g;
        refresh();
      });
      cards[g] = c;
      row.appendChild(c);
    });
    const list = el('div', 'hyp-tiles');
    ids.forEach(id => {
      const t = makeButton('', 'answer-btn hyp-tile');
      t.dataset.id = id;
      t.append(el('span', 'hyp-tile-icon'), el('span', 'hyp-tile-text', texts[id]));
      t.addEventListener('click', () => {
        const at = graphOf(id);
        if (at) { delete onGraph[at]; heldTile = null; refresh(); return; }
        if (heldGraph) { put(id, heldGraph); return; }
        heldTile = heldTile === id ? null : id;
        refresh();
      });
      tiles[id] = t;
      list.appendChild(t);
    });
    const check = makeButton('Check', 'btn-primary check-btn');
    check.addEventListener('click', () => submit({ ...onGraph }));

    function put(id, g) {
      const was = graphOf(id);
      if (was) delete onGraph[was];
      onGraph[g] = id;
      heldTile = null;
      heldGraph = null;
      refresh();
    }
    function refresh() {
      ids.forEach(id => {
        const t = tiles[id];
        const g = graphOf(id);
        const icon = t.querySelector('.hyp-tile-icon');
        icon.innerHTML = '';
        if (g) icon.appendChild(miniGraph(g));
        t.classList.toggle('placed', !!g);
        t.classList.toggle('held', heldTile === id);
        t.setAttribute('aria-pressed', heldTile === id ? 'true' : 'false');
        t.setAttribute('aria-label', g ? `${texts[id]} On the ${HYP_GRAPH_WORDS[g]}. Tap to take it off.` : texts[id]);
      });
      graphs.forEach(g => {
        cards[g].classList.toggle('filled', !!onGraph[g]);
        cards[g].classList.toggle('held', heldGraph === g);
        cards[g].setAttribute('aria-label', `${HYP_GRAPH_WORDS[g]}: ${onGraph[g] ? texts[onGraph[g]] : 'empty'}`);
      });
      const n = Object.keys(onGraph).length;
      check.disabled = n !== graphs.length;
      check.textContent = n === graphs.length ? 'Check' : `One on each graph (${n} of ${graphs.length})`;
    }
    box.append(row, list, check);
    refresh();
  };
  const graphOf = id => graphs.find(g => onGraph[g] === id);

  const grade = (placed) => {
    disableAll(document.getElementById('quiz-answers'));
    const wrongGraphs = graphs.filter(g => placed[g] !== want[g]);
    graphs.forEach(g => cards[g].classList.add(wrongGraphs.includes(g) ? 'is-wrong' : 'is-answer'));
    Object.values(want).filter(id => graphs.some(g => want[g] === id)).forEach(id => tiles[id].classList.add('is-answer'));
    wrongGraphs.forEach(g => { if (placed[g]) tiles[placed[g]].classList.add('is-wrong'); });
    const used = Object.values(placed);
    const parts = [];
    if (used.some(id => id.startsWith('b-'))) {
      parts.push(`Every graph has ${ivShort} along the bottom, as the cause. The hypotheses that start "Increasing ${dvShort}…" or "Changing ${dvShort}…" are backwards: they don't belong on any of them.`);
    }
    const swapped = wrongGraphs.filter(g => placed[g] && !placed[g].startsWith('b-'));
    if (swapped.length) {
      parts.push(`"Increasing ${ivShort} increases ${dvShort}" is the rising line, "…decreases…" the falling line${sub.withNull ? ', and "no effect" the flat line — ' + dvShort + ' stays the same whatever ' + ivShort + ' is' : ''}.`);
    }
    parts.push(sub.withNull
      ? `The rising and falling lines are the two opposing hypotheses; the flat line is the null hypothesis — that changing ${iv} makes no difference to ${dv}.`
      : `The two opposing hypotheses have the same cause and effect and opposite directions: a rising line and a falling line.`);
    return { correct: wrongGraphs.length === 0, explain: parts.join(' ') };
  };

  return {
    key: rel.id,
    // The research question is the question line, so the graphs and all
    // six hypotheses fit on a small phone above the Check button.
    prompt: { node: el('span', 'sr-only', 'Hypotheses') },
    // The short names, as in the hypotheses: "Is there an effect of X on
    // Y?" reads right whether X and Y are singular or plural.
    question: `<strong>Is there an effect of ${ivShort} on ${dvShort}?</strong>`,
    layout: 'hypgraphs',
    answer: want,
    render,
    grade,
  };
}

// ---------------- 2d / 2e: categories as pictures ----------------
// A smooth ramp against a staircase; loose shapes, a podium, a thermometer
// and a ruler. The variable is still read as words; the answer is the
// picture that has the same kind of values.
function categoryPicture(value) {
  const svg = svgEl('svg', { viewBox: '0 0 120 72', class: 'cat-picture', 'aria-hidden': 'true' });
  const add = (tag, a) => svg.appendChild(svgEl(tag, a));
  const text = (x, y, s, cls = 'cat-text') => { const t = svgEl('text', { x, y, class: cls, 'text-anchor': 'middle' }); t.textContent = s; svg.appendChild(t); };
  if (value === 'cont') {
    add('polygon', { points: '8,66 112,66 112,14', class: 'cat-solid' });
    add('circle', { cx: 62, cy: 33, r: 7, fill: SHAPE_FILL.circle });
    add('path', { d: 'M 40 30 L 50 25 M 74 19 L 84 14', class: 'cat-arrow' });
  } else if (value === 'disc') {
    add('path', { d: 'M 8 66 L 8 54 L 34 54 L 34 41 L 60 41 L 60 28 L 86 28 L 86 15 L 112 15 L 112 66 Z', class: 'cat-solid' });
    add('circle', { cx: 47, cy: 34, r: 7, fill: SHAPE_FILL.circle });
  } else if (value === 'categorical') {
    svg.appendChild(shapeEl('circle', 28, 24, 13));
    svg.appendChild(shapeEl('square', 88, 30, 14));
    svg.appendChild(shapeEl('triangle', 54, 52, 13));
  } else if (value === 'ordinal') {
    [[8, 30, '2'], [44, 14, '1'], [80, 42, '3']].forEach(([x, y, n]) => {
      add('rect', { x, y, width: 32, height: 68 - y, class: 'cat-solid' });
      text(x + 16, y + 21, n, 'cat-num');
    });
  } else if (value === 'interval') {
    add('line', { x1: 10, x2: 110, y1: 30, y2: 30, class: 'cat-scale' });
    [['−10', 18], ['0', 46], ['10', 74], ['20', 102]].forEach(([s, x]) => {
      add('line', { x1: x, x2: x, y1: 22, y2: 38, class: 'cat-scale' });
      text(x, 60, s);
    });
    add('circle', { cx: 46, cy: 30, r: 5, fill: SHAPE_FILL.square });
  } else {
    add('rect', { x: 10, y: 14, width: 100, height: 26, rx: 3, class: 'cat-ruler' });
    for (let i = 0; i <= 8; i++) add('line', { x1: 14 + i * 12, x2: 14 + i * 12, y1: 14, y2: i % 2 ? 22 : 28, class: 'cat-scale' });
    [['0', 14], ['2', 62], ['4', 110]].forEach(([s, x]) => text(x, 62, s));
    add('rect', { x: 14, y: 44, width: 60, height: 6, rx: 3, fill: SHAPE_FILL.circle });
  }
  return svg;
}

function pictureClassifyQuestion(recent, sub) {
  const q = classifyQuestion(recent, sub);
  return {
    ...q,
    layout: sub.categories.length === 2 ? 'pictures-pair' : 'pictures',
    render: (box, submit) => {
      q.options.forEach(o => {
        const b = makeButton('', 'answer-btn picture-btn');
        b.dataset.value = o.value;
        b.append(categoryPicture(o.value), el('span', 'picture-label', o.label));
        b.addEventListener('click', () => submit(o.value));
        box.appendChild(b);
      });
    },
  };
}

// ---------------- 2i: confounds, as two groups of shapes ----------------
// Group 1 is circles and group 2 squares: that's the independent variable,
// the one difference the study means to make. Tap a variable and group 2
// turns striped -- "this differs between the groups too". A confound is a
// variable you could stripe; a good design has nothing to stripe.
function confoundGroups() {
  const svg = svgEl('svg', { viewBox: '0 0 320 56', class: 'groups-figure', role: 'img' });
  const stripes = stripeDefs(svg);
  const squares = [];
  [[4, 'circle'], [164, 'square']].forEach(([x, type]) => {
    svg.appendChild(svgEl('rect', { x, y: 2, width: 152, height: 52, rx: 10, class: 'group-panel' }));
    for (let i = 0; i < 4; i++) {
      const s = shapeEl(type, x + 22 + i * 36, 28, 15);
      svg.appendChild(s);
      if (type === 'square') squares.push(s);
    }
  });
  const setStriped = (on) => squares.forEach(s => s.setAttribute('fill', on ? stripes : SHAPE_FILL.square));
  return { svg, setStriped };
}

function confoundGroupsQuestion(recent) {
  const pool = content().confounds;
  const item = pickFresh(pool, recent, i => i.text);
  // A study done properly has no list of suspects of its own; borrow the
  // one from its badly-done twin, so the variable that WOULD have been a
  // confound is there to be ruled out.
  const vars = item.vars
    || (pool.find(o => o.confound && o.iv === item.iv) || {}).vars
    || [item.iv, item.dv];
  const chips = {};
  let picked = null;
  let fig;

  const render = (box, submit) => {
    fig = confoundGroups();
    fig.svg.setAttribute('aria-label', `Two groups: one of circles, one of squares. The groups differ in ${item.iv}.`);
    const chipBox = el('div', 'confound-chips');
    // Not the IV: the picture already shows it as circles and squares.
    [...shuffle(vars.filter(v => v !== item.iv)), 'none'].forEach(v => {
      const c = makeToggle(v === 'none' ? 'Nothing else differs' : v, () => {
        // The picked variable wears the stripes too, so the picture says
        // which variable they stand for.
        picked = v;
        Object.values(chips).forEach(x => { setPressed(x, x === c); x.classList.toggle('striped', x === c && v !== 'none'); });
        fig.setStriped(v !== 'none');
        check.disabled = false;
      });
      c.dataset.value = v;
      c.classList.add('confound-chip');
      chips[v] = c;
      chipBox.appendChild(c);
    });
    const check = makeButton('Check', 'btn-primary check-btn');
    check.disabled = true;
    check.addEventListener('click', () => submit(picked));
    box.append(fig.svg, chipBox, check);
  };

  const grade = (v) => {
    disableAll(document.getElementById('quiz-answers'));
    const right = item.confound || 'none';
    chips[right].classList.add('is-answer');
    if (v !== right) chips[v].classList.add('is-wrong');
    // Leave the true picture up: striped only if there really is a confound.
    fig.setStriped(right !== 'none');
    let explain;
    if (!item.confound) explain = `There's no confound here. ${item.why}`;
    else if (v === 'none') explain = `There is one: ${item.confound}. ${item.why}`;
    else if (v === item.dv) explain = `${cap(v)} is what's being measured — the dependent variable. The confound is ${item.confound}. ${item.why}`;
    else explain = `The confound is ${item.confound}. ${item.why}`;
    return { correct: v === right, explain };
  };

  return {
    key: item.text,
    prompt: { desc: item.text },
    question: `Circles or squares: ${item.iv}. What else <strong>differs</strong>?`,
    layout: 'groups',
    answer: item.confound || 'none',
    render,
    grade,
  };
}

// ---------------- 2j: who takes part in what ----------------
// A grid: three people (or samples), two conditions. Tapping a cell puts
// that person in that condition. Everyone in every condition is a within
// design; everyone in exactly one is a between design.
function designGridStep(box, { samples, onDone }) {
  const who = samples ? 'Sample' : 'Person';
  const types = ['circle', 'square', 'triangle'];
  const on = types.map(() => [false, false]);
  const cells = [];
  const wrap = el('div', 'design-grid');
  const table = el('div', 'design-grid-table');
  table.setAttribute('role', 'group');
  table.setAttribute('aria-label', `${who}s and conditions`);
  table.append(el('span', ''), el('span', 'dg-head', 'Condition 1'), el('span', 'dg-head', 'Condition 2'));
  types.forEach((type, r) => {
    const rowHead = el('span', 'dg-row');
    rowHead.append(shapeIcon(type, 22), el('span', '', `${who} ${r + 1}`));
    table.appendChild(rowHead);
    cells[r] = [0, 1].map(c => {
      const b = makeButton('', 'dg-cell');
      b.dataset.row = r;
      b.dataset.col = c;
      b.setAttribute('aria-label', `${who} ${r + 1} in condition ${c + 1}`);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        on[r][c] = !on[r][c];
        b.setAttribute('aria-pressed', String(on[r][c]));
        b.innerHTML = '';
        if (on[r][c]) b.appendChild(shapeIcon(type, 26));
        refresh();
      });
      table.appendChild(b);
      return b;
    });
  });
  const note = el('div', 'freetext-note');
  const check = makeButton('Check the grid', 'btn-primary check-btn');
  check.addEventListener('click', () => {
    const both = on.every(r => r[0] && r[1]);
    const one = on.every(r => r[0] !== r[1]);
    if (one && !(on.some(r => r[0]) && on.some(r => r[1]))) {
      note.textContent = 'Nobody is in one of the conditions. Every condition needs someone in it.';
      return;
    }
    onDone(both ? 'within' : one ? 'between' : 'mixed');
  });
  function refresh() {
    note.textContent = '';
    const ready = on.every(r => r[0] || r[1]);
    check.disabled = !ready;
    check.textContent = ready ? 'Check the grid' : `Put every ${who.toLowerCase()} in at least one condition`;
  }
  wrap.append(table, note, check);
  box.appendChild(wrap);
  refresh();
  wrap.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  // After marking: show the pattern that was meant.
  const show = (pattern, cls) => {
    cells.forEach((row, r) => row.forEach((b, c) => {
      const want = pattern === 'within' ? true : (r % 2) === c;
      b.disabled = true;
      b.innerHTML = '';
      if (want) b.appendChild(shapeIcon(types[r], 26));
      b.classList.toggle(cls, want);
    }));
    check.classList.add('hidden');
    note.textContent = '';
  };
  const collapse = (text) => {
    wrap.innerHTML = '';
    wrap.className = 'freetext-note read-as';
    wrap.textContent = text;
  };
  return { show, collapse };
}

// ---------------- 4a: mean, median and mode on a see-saw ----------------
// Seven shapes stacked on a number line that is also a plank, resting on a
// ▲ the student moves. The mode is the tallest stack, the median is the
// middle shape, and the mean is where the plank balances -- found by
// watching it level out, not by adding anything up.
function makeCentreData() {
  for (let tries = 0; tries < 20000; tries++) {
    const vals = Array.from({ length: 7 }, () => 1 + Math.floor(Math.random() * 9)).sort((a, b) => a - b);
    const sum = vals.reduce((a, b) => a + b, 0);
    if (sum % 7) continue;
    const counts = {};
    vals.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted[0][1] < 2 || sorted[0][1] > 4 || (sorted[1] && sorted[1][1] === sorted[0][1])) continue;
    const mean = sum / 7, median = vals[3], mode = Number(sorted[0][0]);
    if (new Set([mean, median, mode]).size < 3) continue;
    return { vals, counts, mean, median, mode };
  }
  return { vals: [1, 1, 1, 3, 6, 8, 8], counts: { 1: 3, 3: 1, 6: 1, 8: 2 }, mean: 4, median: 3, mode: 1 };
}

const CENTRE_WORDS = {
  mean: 'where the see-saw balances',
  median: 'the middle shape, with as many on each side',
  mode: 'the tallest stack',
};

function centreQuestion(recent) {
  const d = makeCentreData();
  const which = pickFresh(['mean', 'median', 'mode'], recent.map(k => k.split('-')[0]), x => x);
  const target = d[which];
  const W = 340, H = 184, plankY = 112, groundY = 146;
  const x = v => 30 + (v - 1) * 35;
  let pivot = target === 1 ? 9 : 1;
  let fig, input, readout;

  const render = (box, submit) => {
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'seesaw', role: 'img',
      'aria-label': `Seven shapes on a number line from 1 to 9, at ${d.vals.join(', ')}. The line rests on a pivot like a see-saw.` });
    const plank = svgEl('g', { class: 'seesaw-plank' });
    plank.appendChild(svgEl('line', { x1: x(1) - 16, x2: x(9) + 16, y1: plankY, y2: plankY, class: 'plank' }));
    for (let v = 1; v <= 9; v++) {
      const t = svgEl('text', { x: x(v), y: plankY + 19, class: 'seesaw-num', 'text-anchor': 'middle' });
      t.textContent = v;
      plank.appendChild(t);
      for (let k = 0; k < (d.counts[v] || 0); k++) plank.appendChild(shapeEl('circle', x(v), plankY - 15 - k * 25, 11.5));
    }
    svg.appendChild(plank);
    svg.appendChild(svgEl('line', { x1: 8, x2: W - 8, y1: groundY, y2: groundY, class: 'bar-axis' }));
    const tri = svgEl('polygon', { class: 'seesaw-pivot' });
    svg.appendChild(tri);

    fig = el('div', 'tap-figure seesaw-figure');
    fig.appendChild(svg);
    input = document.createElement('input');
    input.type = 'range';
    input.className = 'z-slider';
    input.min = '1'; input.max = '9'; input.step = '1';
    input.value = String(pivot);
    input.setAttribute('aria-label', 'Position of the pivot');
    input.style.left = `calc(${(x(1) / W) * 100}% - ${SLIDER_THUMB / 2}px)`;
    input.style.width = `calc(${((x(9) - x(1)) / W) * 100}% + ${SLIDER_THUMB}px)`;
    // The handle sits under the ground line, below the ▲ it moves, so it
    // never covers the numbers or the shapes.
    input.style.top = `calc(${((groundY + 20) / H) * 100}% - ${SLIDER_THUMB / 2}px)`;
    fig.appendChild(input);
    readout = el('div', 'slider-readout');

    const update = () => {
      pivot = Number(input.value);
      const px = x(pivot);
      tri.setAttribute('points', `${px},${plankY + 4} ${px - 15},${groundY} ${px + 15},${groundY}`);
      // Heavier side down: the plank tips towards the mean, and is level
      // only when the pivot is right under it.
      const tilt = Math.max(-11, Math.min(11, (d.mean - pivot) * 3.2));
      plank.style.transformOrigin = `${px}px ${plankY}px`;
      plank.style.transform = `rotate(${tilt}deg)`;
      const level = pivot === d.mean ? ' — level' : '';
      readout.textContent = `▲ at ${pivot}${level}`;
      input.setAttribute('aria-valuetext', `pivot at ${pivot}, ${pivot === d.mean ? 'balanced' : (d.mean > pivot ? 'tipping right' : 'tipping left')}`);
    };
    input.addEventListener('input', update);
    update();
    const check = makeButton('Check', 'btn-primary check-btn');
    check.addEventListener('click', () => submit(pivot));
    box.append(fig, readout, check);
  };

  const grade = (v) => {
    disableAll(document.getElementById('quiz-answers'));
    input.disabled = true;
    const correct = v === target;
    const others = ['mean', 'median', 'mode'].filter(m => m !== which && d[m] === v);
    const parts = [`The ${which} is ${target}: ${CENTRE_WORDS[which]}.`];
    if (!correct && others.length) parts.push(`${v} is the ${others[0]} — ${CENTRE_WORDS[others[0]]}.`);
    parts.push(['mean', 'median', 'mode'].filter(m => m !== which && !others.includes(m))
      .map(m => `The ${m} is ${d[m]}.`).join(' '));
    return { correct, explain: correct ? '' : parts.join(' ') };
  };

  return {
    key: `${which}-${Math.random()}`,
    prompt: { node: el('span', 'sr-only', `Find the ${which}.`) },
    question: `Move the ▲ to the <strong>${which}</strong>.`,
    layout: 'figure',
    answer: target,
    render,
    grade,
  };
}

// ---------------- 5c / 5d: draws from a bag of shapes ----------------
// A coin is a bag of one circle and one square; a die is a bag where one
// shape in six is a circle. The draws are laid out in a row, so 20 circles
// in a row LOOKS like 20 circles in a row. The sister game, Bag of Shapes,
// starts from exactly this bag.
function bagSvg(e, sealed) {
  const svg = svgEl('svg', { viewBox: '0 0 84 96', class: 'bag', 'aria-hidden': 'true' });
  svg.appendChild(svgEl('path', { d: 'M 22 22 Q 4 50 10 80 Q 14 92 42 92 Q 70 92 74 80 Q 80 50 62 22 Z', class: 'bag-body' }));
  svg.appendChild(svgEl('path', { d: 'M 24 22 L 30 8 L 54 8 L 60 22', class: 'bag-neck' }));
  if (sealed) {
    const t = svgEl('text', { x: 42, y: 70, class: 'bag-q', 'text-anchor': 'middle' });
    t.textContent = '?';
    svg.appendChild(t);
    return svg;
  }
  const spots = [[26, 46], [42, 42], [58, 46], [26, 70], [42, 66], [58, 70]];
  const nCircles = e.kind === 'half' ? 3 : 1;
  spots.forEach(([cx, cy], i) => svg.appendChild(shapeEl(i < nCircles ? 'circle' : 'square', cx, cy, 8)));
  return svg;
}

function drawsSvg(e) {
  const per = 10, size = 24;
  const rows = Math.ceil(e.n / per);
  const svg = svgEl('svg', { viewBox: `0 0 ${per * size} ${rows * size}`, class: 'draws', role: 'img',
    'aria-label': `${e.n} draws: ${e.k} circle${e.k === 1 ? '' : 's'} and ${e.n - e.k} square${e.n - e.k === 1 ? '' : 's'}.` });
  e.draws.forEach((type, i) => svg.appendChild(shapeEl(type, (i % per) * size + size / 2, Math.floor(i / per) * size + size / 2, 9.5)));
  return svg;
}

function bagFigure(e, caption, sealed) {
  const wrap = el('div', 'bag-figure');
  wrap.appendChild(el('div', 'bag-caption', caption));
  const row = el('div', 'bag-row');
  row.append(bagSvg(e, sealed), drawsSvg(e));
  wrap.appendChild(row);
  return wrap;
}

const drewWords = e => (e.k === e.n ? `a circle every time in ${e.n} draws` : e.k === 0 ? `no circles at all in ${e.n} draws` : `${e.k} circle${e.k === 1 ? '' : 's'} in ${e.n} draws`);

function bagChanceQuestion() {
  const e = makeChanceEvent();
  return {
    key: `chance-${Math.random()}`,
    prompt: { node: bagFigure(e, `${e.n} draws from this bag, putting the shape back each time:`, false) },
    question: 'Could this easily happen <strong>just by chance</strong>?',
    layout: 'pair', options: [{ value: 'likely', label: 'Yes — easily' }, { value: 'unlikely', label: 'No — hardly ever' }],
    answer: e.unlikely ? 'unlikely' : 'likely',
    explain: () => (e.unlikely
      ? `From this bag, ${drewWords(e)} happens ${oneIn(e.prob)}. It's possible, but you'd hardly ever see it.`
      : `From this bag, ${drewWords(e)} happens ${oneIn(e.prob)} — it turns up all the time.`),
  };
}

function bagH0Question() {
  const e = makeChanceEvent();
  return {
    key: `h0c-${Math.random()}`,
    prompt: { node: bagFigure(e, `H0: ${e.h0}. ${e.n} draws, putting the shape back each time:`, true) },
    question: 'Do you <strong>keep</strong> H0 or <strong>reject</strong> it?',
    layout: 'pair', options: [{ value: 'keep', label: 'Keep H0' }, { value: 'reject', label: 'Reject H0' }],
    answer: e.unlikely ? 'reject' : 'keep',
    explain: () => (e.unlikely
      ? `If ${e.h0}, ${drewWords(e)} would happen ${oneIn(e.prob)}. Results that hardly ever happen when H0 is true are a reason to stop believing H0 — so reject it.`
      : `If ${e.h0}, ${drewWords(e)} happens ${oneIn(e.prob)} — all the time. It gives no reason to doubt H0, so keep it.`),
  };
}

// ---------------- 5g: the 2 x 2 of reality and decision ----------------
// The table from the lecture: what's really true down the side, what the
// test decided along the top. Find the scenario's cell.
const ERROR_CELLS = {
  'none-keep': 'Correct', 'none-reject': 'Type 1 error',
  'real-keep': 'Type 2 error', 'real-reject': 'Correct',
};

function errorGridQuestion(recent) {
  const q = errorQuestion(recent);
  const real = /really does affect/.test(q.prompt.quote);
  const found = /finds a significant|reject H0/.test(q.prompt.quote);
  const cell = `${real ? 'real' : 'none'}-${found ? 'reject' : 'keep'}`;
  const rowWords = { none: 'no effect', real: 'a real effect' };
  const colWords = { keep: 'kept H0', reject: 'rejected H0' };
  return {
    ...q,
    question: 'Tap the cell for what happened.',
    layout: 'errgrid',
    answer: cell,
    render: (box, submit) => {
      box.append(el('span', ''), el('span', 'eg-head', 'Keep H0'), el('span', 'eg-head', 'Reject H0'));
      ['none', 'real'].forEach(r => {
        box.appendChild(el('span', 'eg-row', r === 'none' ? 'Really no effect' : 'Really an effect'));
        ['keep', 'reject'].forEach(c => {
          const b = makeButton(ERROR_CELLS[`${r}-${c}`], 'answer-btn eg-cell');
          b.dataset.value = `${r}-${c}`;
          b.setAttribute('aria-label', `In reality ${rowWords[r]}, and the test ${colWords[c]}: ${ERROR_CELLS[`${r}-${c}`]}`);
          b.addEventListener('click', () => submit(`${r}-${c}`));
          box.appendChild(b);
        });
      });
    },
    explain: (v) => {
      const [r, c] = cell.split('-');
      const [vr, vc] = v.split('-');
      const where = vr !== r
        ? `Check the row: in reality there's ${rowWords[r]}.`
        : `Check the column: the test ${colWords[c]}.`;
      return `${where} ${q.explain()}`;
    },
  };
}

// ---------------- 5h: false alarms as jars ----------------
// One jar per test; a lit jar came out significant. Twenty jars with one
// lit is what chance gives at the 5% line. The same result lighting up in
// study after study is not.
function jarsSvg(tests, hits) {
  const per = tests > 20 ? 20 : 10, w = 31, h = 36;
  const rows = Math.ceil(tests / per);
  const big = tests <= 3;
  const vw = big ? tests * 70 : per * w, vh = big ? 62 : rows * h;
  const svg = svgEl('svg', { viewBox: `0 0 ${vw} ${vh}`, class: `jars${big ? ' jars-big' : ''}`, role: 'img',
    'aria-label': `${tests} test${tests === 1 ? '' : 's'}, ${hits.length} significant.` });
  if (big) svg.style.width = `${tests * 54}px`;
  for (let i = 0; i < tests; i++) {
    const lit = hits.includes(i);
    const s = big ? 1.6 : 1;
    const cx = big ? i * 70 + 35 : (i % per) * w + w / 2;
    const top = big ? 4 : Math.floor(i / per) * h + 3;
    const g = svgEl('g', { class: lit ? 'jar lit' : 'jar' });
    g.appendChild(svgEl('rect', { x: cx - 8 * s, y: top, width: 16 * s, height: 5 * s, rx: 1.5, class: 'jar-lid' }));
    g.appendChild(svgEl('rect', { x: cx - 11 * s, y: top + 5 * s, width: 22 * s, height: 24 * s, rx: 5 * s, class: 'jar-body' }));
    if (lit) {
      const t = svgEl('text', { x: cx, y: top + 22 * s, class: 'jar-star', 'text-anchor': 'middle', 'font-size': 15 * s });
      t.textContent = '★';
      g.appendChild(t);
    }
    svg.appendChild(g);
  }
  return svg;
}

function jarFigure(text, tests, hits, what = 'test') {
  const wrap = el('div', 'jar-figure');
  wrap.append(el('div', 'prompt-desc', text), jarsSvg(tests, hits));
  const key = el('div', 'jar-key', `One jar per ${what}. ★ = significant at the 5% level.`);
  wrap.appendChild(key);
  return wrap;
}

function falseAlarmJarsQuestion(recent) {
  const options = [{ value: 'convincing', label: 'Convincing' }, { value: 'false', label: 'Could be a false alarm' }];
  const question = 'Convincing, or could it easily be a <strong>false alarm</strong>?';
  if (Math.random() < 0.5) {
    const c = pickFresh(FALSE_ALARMS, recent, x => x.label);
    let hits;
    if (c.lastHit) hits = [c.tests - 1];
    else hits = shuffle([...Array(c.tests).keys()]).slice(0, c.hits);
    return {
      key: c.label, prompt: { node: jarFigure(c.label, c.tests, hits) }, question,
      layout: 'pair', options, answer: 'false', explain: () => c.why,
    };
  }
  const rel = pickFresh(content().relations, recent, r => r.id);
  const s = `“${rel.says[0]}”`;
  const form = pick([
    { text: `Three different research teams, working separately, each find the same significant result: ${s}`, tests: 3, what: 'team' },
    { text: `Before collecting any data, researchers predict ${s} They run that one test, and if H0 were true, the chance of getting results like theirs would be less than 0.1%.`, tests: 1, what: 'test' },
    { text: `A study finds ${s} A second, larger study set up to check it finds the same significant result.`, tests: 2, what: 'study' },
  ]);
  return {
    key: `${rel.id}-conv`,
    prompt: { node: jarFigure(form.text, form.tests, [...Array(form.tests).keys()], form.what) },
    question, layout: 'pair', options,
    answer: 'convincing',
    explain: () => 'This is convincing. A false alarm happens about 1 time in 20 when H0 is true — but here the result was predicted in advance, or found again and again. Chance alone would hardly ever do that.',
  };
}

Object.assign(QUESTION_TYPES, {
  roles: rolesArrowQuestion,
  hypotheses: hypothesisGraphQuestion,
  pictureClassify: pictureClassifyQuestion,
  confound: confoundGroupsQuestion,
  centre: centreQuestion,
  chance: bagChanceQuestion,
  h0chance: bagH0Question,
  errors: errorGridQuestion,
  falseAlarm: falseAlarmJarsQuestion,
});
