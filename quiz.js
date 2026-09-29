// ---------------------------------------------------------------------------
// The quiz modal every sub-level runs in, and the question types.
//
// A question type is a function that deals one question. The simple kind
// is a single tap:
//
//   { key, prompt, question, layout, options: [{ value, label | node }],
//     answer, explain(value) }
//
// and the modal draws the buttons, marks them, and grades the tap itself.
// Anything more involved -- pick several, answer two things at once, a
// follow-up question -- draws its own answer area instead:
//
//   { key, prompt, question, layout, answer, render(el, submit), grade(value) }
//
// where grade returns { correct, explain } and marks its own buttons, and
// `answer` records what the right answer is, in the question's own terms.
// Either way the modal does the rest identically for every sub-level: the
// streak, the points, the feedback line, and the Next button. The explain
// text is what makes a wrong answer worth having -- it always says why,
// never just "no".
// ---------------------------------------------------------------------------

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Pick from `pool`, avoiding anything asked recently. Seeing the same item
// twice in quick succession reads as the quiz being broken; with a pool this
// size there's always something fresh, but it falls back rather than loop.
function pickFresh(pool, recent, keyOf) {
  const fresh = pool.filter(x => !recent.includes(keyOf(x)));
  return pick(fresh.length ? fresh : pool);
}

function makeButton(label, className = 'answer-btn') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.textContent = label;
  return btn;
}

// A choice that stays selected until the student presses Check -- for the
// questions with more than one thing to decide, where a single tap can't be
// the answer.
function makeToggle(label, onToggle) {
  const btn = makeButton(label, 'answer-btn toggle-btn');
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => onToggle(btn));
  return btn;
}
function setPressed(btn, on) {
  btn.classList.toggle('selected', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}
function disableAll(el) { el.querySelectorAll('button').forEach(b => { b.disabled = true; }); }

// ---------------- sorting into categories ----------------
// Level 1's variable-or-not, and every other "which kind is this?" question.
// The category is picked first and the item second, so each category comes
// up equally often whatever the pool sizes -- a quiz that's mostly one
// answer is one you can win by always giving that answer.
function classifyQuestion(recent, sub) {
  const cat = pick(sub.categories);
  const item = pickFresh(sub.items.filter(i => i.cat === cat.value), recent, i => i.label);
  return {
    key: item.label,
    prompt: item.label.length > 60 ? { desc: item.label } : { big: item.label },
    question: sub.question,
    layout: sub.categories.length === 2 ? 'pair' : 'grid',
    options: sub.categories.map(c => ({ value: c.value, label: c.label })),
    answer: item.cat,
    explain: () => item.why,
  };
}

// ---------------- which variable changes the other ----------------
const ROLE_TERMS = {
  plain:  { changer: 'changer', changee: 'change-ee' },
  formal: { changer: 'independent variable', changee: 'dependent variable' },
};

function rolesQuestion(recent, sub) {
  const rel = pickFresh(RELATIONS, recent, r => r.id);
  const terms = ROLE_TERMS[sub.terms];
  // Asking for the change-ee half the time means tapping "whichever one
  // did the changing" can't become a reflex that skips the reading.
  const askChanger = Math.random() < 0.5;
  const wanted = askChanger ? terms.changer : terms.changee;
  return {
    key: rel.id,
    prompt: { quote: pick(rel.says) },
    question: `Which is the <strong>${wanted}</strong>?`,
    layout: 'pair',
    options: shuffle([
      { value: 'iv', label: rel.iv },
      { value: 'dv', label: rel.dv },
    ]),
    answer: askChanger ? 'iv' : 'dv',
    explain: () => `${cap(rel.iv)} is the ${terms.changer} and ${rel.dv} is the ${terms.changee}. ${rel.why}`,
  };
}

// ---------------- match the graph ----------------
function graphQuestion(recent) {
  const rel = pickFresh(RELATIONS, recent, r => r.id);
  const flip = d => (d === 'up' ? 'down' : 'up');
  const combos = [
    { forwards: true, dir: rel.dir },
    { forwards: true, dir: flip(rel.dir) },
    { forwards: false, dir: rel.dir },
    { forwards: false, dir: flip(rel.dir) },
  ];
  const options = shuffle(combos).map((c, i) => ({
    value: `${c.forwards ? 'f' : 'b'}-${c.dir}`,
    combo: c,
    letter: 'ABCD'[i],
    node: drawGraph({
      xLabel: c.forwards ? rel.ivAxis : rel.dvAxis,
      yLabel: c.forwards ? rel.dvAxis : rel.ivAxis,
      dir: c.dir,
    }),
  }));

  const explain = (value) => {
    const chosen = options.find(o => o.value === value).combo;
    const parts = [];
    if (!chosen.forwards) {
      parts.push(`That graph is backwards: it puts ${rel.dv} along the bottom, as if it were doing the changing. The changer (${rel.iv}) goes along the bottom.`);
    }
    // "Has X rising" rather than "says X goes up": some variables are
    // plural ("ice cream sales"), and this phrasing agrees with either.
    if (chosen.dir !== rel.dir) {
      const iv = rel.ivNP || rel.iv;
      const dv = rel.dvNP || rel.dv;
      parts.push(rel.dir === 'up'
        ? `Its line goes down, but the statement has ${dv} RISING as ${iv} increases — the line should rise.`
        : `Its line goes up, but the statement has ${dv} FALLING as ${iv} increases — the line should fall.`);
    }
    return parts.join(' ');
  };

  return {
    key: rel.id,
    prompt: { quote: pick(rel.says) },
    question: 'Which graph shows this?',
    layout: 'graphs',
    options,
    answer: `f-${rel.dir}`,
    explain,
  };
}

// ---------------- hypotheses ----------------
// The Level 1 relations again, now as research questions. The options are
// the four graphs from 1d put into words -- forwards or backwards, up or
// down -- plus, in the second sub-level, a "no effect" version each way.
//
// The right answers keep the direction of cause the question asks about and
// differ only in which way the effect goes: that's what makes two
// hypotheses opposing, rather than just different. The backwards ones are
// there because they're what a student who has the causal direction the
// wrong way round will reach for.
function hypothesisTexts(rel) {
  const iv = rel.ivNP || rel.iv;
  const dv = rel.dvNP || rel.dv;
  // "Increasing X" and "Changing X" are singular whatever X is, so one
  // template stays grammatical across every relation.
  return {
    'f-up':   `Increasing ${iv} increases ${dv}.`,
    'f-down': `Increasing ${iv} decreases ${dv}.`,
    'b-up':   `Increasing ${dv} increases ${iv}.`,
    'b-down': `Increasing ${dv} decreases ${iv}.`,
    'f-null': `Changing ${iv} has no effect on ${dv}.`,
    'b-null': `Changing ${dv} has no effect on ${iv}.`,
  };
}

function hypothesisQuestion(recent, sub) {
  const rel = pickFresh(RELATIONS, recent, r => r.id);
  const iv = rel.ivNP || rel.iv;
  const dv = rel.dvNP || rel.dv;
  const texts = hypothesisTexts(rel);
  const ids = sub.withNull
    ? ['f-up', 'f-down', 'b-up', 'b-down', 'f-null', 'b-null']
    : ['f-up', 'f-down', 'b-up', 'b-down'];
  const correctIds = sub.withNull ? ['f-up', 'f-down', 'f-null'] : ['f-up', 'f-down'];
  const need = correctIds.length;
  const order = shuffle(ids);
  let buttons = {};

  const render = (el, submit) => {
    const chosen = new Set();
    const check = makeButton(`Check`, 'btn-primary check-btn');
    const refresh = () => {
      check.disabled = chosen.size !== need;
      check.textContent = chosen.size === need ? 'Check' : `Pick ${need} (${chosen.size} so far)`;
    };
    order.forEach(id => {
      const btn = makeToggle(texts[id], (b) => {
        if (chosen.has(id)) chosen.delete(id);
        // Picking one more than allowed swaps out nothing silently: it's
        // simply refused until one is deselected.
        else if (chosen.size < need) chosen.add(id);
        setPressed(b, chosen.has(id));
        refresh();
      });
      buttons[id] = btn;
      el.appendChild(btn);
    });
    check.addEventListener('click', () => submit([...chosen]));
    el.appendChild(check);
    refresh();
  };

  const grade = (picked) => {
    disableAll(document.getElementById('quiz-answers'));
    for (const id of ids) {
      if (correctIds.includes(id)) buttons[id].classList.add('is-answer');
      else if (picked.includes(id)) buttons[id].classList.add('is-wrong');
    }
    const wrong = picked.filter(id => !correctIds.includes(id));
    const correct = wrong.length === 0;
    const parts = [];
    if (wrong.some(id => id.startsWith('b-'))) {
      parts.push(`The question asks about the effect OF ${iv} ON ${dv}, so ${iv} should be the cause in every hypothesis. The ones that start "Increasing ${dv}…" or "Changing ${dv}…" are backwards.`);
    }
    if (wrong.includes('f-null') || wrong.includes('b-null')) {
      parts.push('"No effect" isn\'t one of a pair of opposing hypotheses — it\'s the null hypothesis.');
    }
    // "Will increase" rather than "goes up": several of these are plural
    // ("acceptability ratings"), and a modal agrees with either.
    parts.push(sub.withNull
      ? `The three are: ${dv} will increase, ${dv} will decrease, and the null hypothesis — that changing ${iv} makes no difference at all.`
      : `The two opposing hypotheses keep the same cause and effect, and differ only in direction: ${dv} will increase, or ${dv} will decrease.`);
    return { correct, explain: parts.join(' ') };
  };

  return {
    key: rel.id,
    prompt: { quote: `Research question: Does ${iv} affect ${dv}?` },
    question: sub.withNull
      ? 'Pick the <strong>3</strong> hypotheses: the two opposing ones, and the null.'
      : 'Pick the <strong>2</strong> opposing hypotheses.',
    layout: 'list',
    answer: correctIds.map(id => texts[id]),
    render,
    grade,
  };
}

// ---------------- validity and reliability ----------------
// Two separate judgments about the same design, answered together: a
// design can have either, both, or neither, and the point is to see that
// they're independent questions. Graded as one answer -- both have to be
// right -- but the explanation speaks to each half separately.
function validityQuestion(recent) {
  const item = pickFresh(VALIDITY_ITEMS, recent, i => i.text);
  const rows = [
    { key: 'valid', label: 'Is it valid?', help: 'Does it measure what it\'s meant to?' },
    { key: 'reliable', label: 'Is it reliable?', help: 'Would it give the same result again?' },
  ];
  const buttons = {};

  const render = (el, submit) => {
    const chosen = {};
    const check = makeButton('Check', 'btn-primary check-btn');
    const refresh = () => {
      const done = rows.every(r => r.key in chosen);
      check.disabled = !done;
      check.textContent = done ? 'Check' : 'Answer both, then check';
    };
    rows.forEach(r => {
      const row = document.createElement('div');
      row.className = 'judge-row';
      row.innerHTML = `<div class="judge-label">${r.label}<span>${r.help}</span></div>`;
      const pair = document.createElement('div');
      pair.className = 'judge-pair';
      buttons[r.key] = {};
      [true, false].forEach(v => {
        const btn = makeToggle(v ? 'Yes' : 'No', () => {
          chosen[r.key] = v;
          Object.entries(buttons[r.key]).forEach(([k, b]) => setPressed(b, String(v) === k));
          refresh();
        });
        buttons[r.key][String(v)] = btn;
        pair.appendChild(btn);
      });
      row.appendChild(pair);
      el.appendChild(row);
    });
    check.addEventListener('click', () => submit({ ...chosen }));
    el.appendChild(check);
    refresh();
  };

  const grade = (ans) => {
    disableAll(document.getElementById('quiz-answers'));
    const parts = [];
    rows.forEach(r => {
      const right = item[r.key];
      buttons[r.key][String(right)].classList.add('is-answer');
      if (ans[r.key] !== right) {
        buttons[r.key][String(ans[r.key])].classList.add('is-wrong');
        parts.push(`It ${right ? 'IS' : 'is NOT'} ${r.key}: ${r.key === 'valid' ? item.whyValid : item.whyReliable}`);
      }
    });
    return { correct: parts.length === 0, explain: parts.join(' ') };
  };

  return {
    key: item.text,
    prompt: { desc: item.text },
    question: 'Is this design valid? Is it reliable?',
    layout: 'judge',
    answer: { valid: item.valid, reliable: item.reliable },
    render,
    grade,
  };
}

// ---------------- confounds ----------------
// Two steps, one answer: is there a confound, and if so, which variable is
// it? The second step only appears after a "yes", so saying yes can't be
// used to fish for a list of suspects -- but the whole item still counts as
// a single answer to the streak, right only if both steps are.
function confoundQuestion(recent) {
  const item = pickFresh(CONFOUND_ITEMS, recent, i => i.text);
  let stage2 = null;
  let yesNo = {};

  const render = (el, submit) => {
    ['Yes, there\'s a confound', 'No confound'].forEach((label, i) => {
      const saidYes = i === 0;
      const btn = makeButton(label);
      yesNo[saidYes] = btn;
      btn.addEventListener('click', () => {
        if (!saidYes || !item.confound) { submit({ saidYes }); return; }
        // A correct "yes": on to naming it.
        disableAll(el);
        btn.classList.add('is-answer');
        document.getElementById('quiz-question').innerHTML = 'Which variable is the <strong>confound</strong>?';
        stage2 = {};
        const list = document.createElement('div');
        list.className = 'quiz-answers layout-list stage2';
        shuffle(item.vars).forEach(v => {
          const b = makeButton(v);
          stage2[v] = b;
          b.addEventListener('click', () => submit({ saidYes, picked: v }));
          list.appendChild(b);
        });
        el.after(list);
      });
      el.appendChild(btn);
    });
  };

  const grade = (ans) => {
    document.querySelectorAll('.quiz-body button.answer-btn').forEach(b => { b.disabled = true; });
    if (!item.confound) {
      yesNo[false].classList.add('is-answer');
      if (ans.saidYes) yesNo[true].classList.add('is-wrong');
      return { correct: !ans.saidYes, explain: `There's no confound here. ${item.why}` };
    }
    if (!ans.saidYes) {
      yesNo[true].classList.add('is-answer');
      yesNo[false].classList.add('is-wrong');
      return { correct: false, explain: `There is one: ${item.confound}. ${item.why}` };
    }
    stage2[item.confound].classList.add('is-answer');
    if (ans.picked !== item.confound) stage2[ans.picked].classList.add('is-wrong');
    return {
      correct: ans.picked === item.confound,
      explain: ans.picked === item.iv
        ? `${cap(ans.picked)} is what the study is testing — the independent variable — not the confound. The confound is ${item.confound}. ${item.why}`
        : ans.picked === item.dv
          ? `${cap(ans.picked)} is what's being measured — the dependent variable. The confound is ${item.confound}. ${item.why}`
          : `The confound is ${item.confound}. ${item.why}`,
    };
  };

  return {
    key: item.text,
    prompt: { desc: item.text },
    question: 'Is there a <strong>confound</strong>?',
    layout: 'pair',
    answer: item.confound,
    render,
    grade,
  };
}

const QUESTION_TYPES = {
  classify: classifyQuestion,
  roles: rolesQuestion,
  graph: graphQuestion,
  hypotheses: hypothesisQuestion,
  validity: validityQuestion,
  confound: confoundQuestion,
};

// ---------------- the modal ----------------
// Correct answers get just enough of a beat to see the "+N pts" land, then
// move on by themselves; a wrong one waits for Next, so the explanation stays
// up until it has actually been read.
const QUIZ_CORRECT_DELAY_MS = 900;
const RECENT_MEMORY = 6;

let quizSub = null;
let quizGame = null;
let quizQuestion = null;
let quizAnswered = false;
let quizRecent = [];
let quizAdvanceTimer = null;

function renderStreakBar() {
  document.getElementById('quiz-streak-fill').style.width =
    `${Math.round(quizGame.streak / quizGame.target * 100)}%`;
  let label = `${quizGame.streak} / ${quizGame.target} in a row — ${quizGame.multiplier()}x bonus`;
  if (quizGame.allowedMisses) {
    const left = quizGame.missesLeft;
    label += ` ${'♥'.repeat(left)}${'♡'.repeat(quizGame.allowedMisses - left)}`;
  }
  document.getElementById('quiz-streak-label').textContent = label;
}

function setFeedback(text, kind) {
  const el = document.getElementById('quiz-feedback');
  el.textContent = text || '';
  el.className = 'quiz-feedback' + (kind ? ` ${kind}` : '');
}

function renderPrompt(prompt) {
  const el = document.getElementById('quiz-prompt');
  el.innerHTML = '';
  const p = document.createElement('div');
  if (prompt.big) { p.className = 'prompt-big'; p.textContent = prompt.big; }
  else if (prompt.desc) { p.className = 'prompt-desc'; p.textContent = prompt.desc; }
  else { p.className = 'prompt-quote'; p.textContent = prompt.quote; }
  el.appendChild(p);
}

function renderOptions(q, el) {
  q.options.forEach(opt => {
    const btn = makeButton(opt.label || '');
    btn.dataset.value = String(opt.value);
    if (opt.node) {
      btn.textContent = '';
      const letter = document.createElement('span');
      letter.className = 'answer-letter';
      letter.textContent = opt.letter;
      btn.appendChild(letter);
      btn.appendChild(opt.node);
      btn.setAttribute('aria-label', `Graph ${opt.letter}: ${opt.node.getAttribute('aria-label')}`);
    }
    btn.addEventListener('click', () => answerQuestion(opt.value));
    el.appendChild(btn);
  });
}

// The grading a single-tap question gets for free.
function gradeOptions(q, value) {
  const correct = value === q.answer;
  document.querySelectorAll('#quiz-answers .answer-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.value === String(q.answer)) btn.classList.add('is-answer');
    if (btn.dataset.value === String(value) && !correct) btn.classList.add('is-wrong');
  });
  return { correct, explain: correct ? '' : q.explain(value) };
}

function nextQuestion() {
  clearTimeout(quizAdvanceTimer);
  document.getElementById('quiz-next').classList.add('hidden');
  document.querySelectorAll('.quiz-body .stage2').forEach(el => el.remove());
  setFeedback('');

  const q = QUESTION_TYPES[quizSub.kind](quizRecent, quizSub);
  quizQuestion = q;
  quizAnswered = false;
  quizRecent = [q.key, ...quizRecent].slice(0, RECENT_MEMORY);

  renderPrompt(q.prompt);
  document.getElementById('quiz-question').innerHTML = q.question;
  const answers = document.getElementById('quiz-answers');
  answers.innerHTML = '';
  answers.className = `quiz-answers layout-${q.layout}`;
  if (q.render) q.render(answers, answerQuestion);
  else renderOptions(q, answers);
  if (q.layout === 'graphs') fitGraphLabels(answers);
  document.querySelector('.quiz-body').scrollTop = 0;
}

function answerQuestion(value) {
  if (!quizQuestion || quizAnswered) return;
  quizAnswered = true;
  const q = quizQuestion;
  const { correct, explain } = q.grade ? q.grade(value) : gradeOptions(q, value);
  const result = quizGame.answer(correct);
  state.points = Math.max(0, state.points + result.pointsDelta);
  saveState();
  updateHeader();
  renderStreakBar();

  if (correct) {
    setFeedback(`Correct! +${result.pointsDelta} pts`, 'ok');
    playCorrectSound();
    if (!result.complete) celebrateCorrect();
  } else if (result.forgiven) {
    const left = quizGame.missesLeft;
    setFeedback(`Not quite (${result.pointsDelta} pts) — that cost a heart (${left} left), but your run carries on. ${explain}`, 'err');
    playWrongSound();
  } else {
    const lostHearts = quizGame.allowedMisses ? ' Out of hearts, so the run starts again.' : '';
    setFeedback(`Not quite (${result.pointsDelta} pts).${lostHearts} ${explain}`, 'err');
    playWrongSound();
  }

  if (result.complete) { markSubDone(quizSub); return; }
  if (correct) quizAdvanceTimer = setTimeout(nextQuestion, QUIZ_CORRECT_DELAY_MS);
  else {
    const next = document.getElementById('quiz-next');
    next.classList.remove('hidden');
    // Under four graphs, or a long description, the explanation lands below
    // the fold on a small phone -- and an explanation nobody scrolls to
    // might as well not exist.
    next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function openQuiz(sub) {
  quizSub = sub;
  quizGame = new StreakGame(sub.target || STREAK_TARGET, sub.allowedMisses || 0);
  quizRecent = [];
  document.getElementById('quiz-title').textContent = sub.name;
  setModalDoneState(false);
  renderStreakBar();
  document.getElementById('quiz-overlay').classList.remove('hidden');
  setMascotSpeech(sub.speech);
  nextQuestion();
  pushNav(closeQuiz);
  // The idea a sub-level practises, shown before its first question the
  // first time through -- and after that, one tap away on the ? button.
  if (!state.introsSeen.includes(sub.id)) {
    state.introsSeen.push(sub.id);
    saveState();
    openHelp(sub.help);
  }
}

function closeQuiz() {
  clearTimeout(quizAdvanceTimer);
  document.getElementById('quiz-overlay').classList.add('hidden');
  quizSub = null;
  quizQuestion = null;
  clearMascotFlash();
  setMascotSpeech(SCREEN_SPEECH.level);
}

// The close link becomes a big, obvious button once the sub-level is done:
// the small "x close" is fine mid-quiz, but once there's nothing left to do
// the exit should be the obvious next tap.
function setModalDoneState(done) {
  const btn = document.getElementById('quiz-close');
  btn.textContent = done ? 'Done — back to the list' : '× close';
  btn.className = done ? 'btn-primary btn-return' : 'link-btn';
  document.getElementById('quiz-help').classList.toggle('hidden', done);
}

// Wrapped, not passed directly: navBack lives in app.js, which loads after this file.
document.getElementById('quiz-close').addEventListener('click', () => navBack());
document.getElementById('quiz-next').addEventListener('click', nextQuestion);
document.getElementById('quiz-help').addEventListener('click', () => { if (quizSub) openHelp(quizSub.help); });
