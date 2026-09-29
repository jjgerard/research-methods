// ---------------------------------------------------------------------------
// The quiz modal every sub-level runs in, and the question types.
//
// A question type is a function that deals one question:
//
//   { key, prompt, question, options: [{ value, label | node }], answer,
//     layout, explain(value) }
//
// and the modal does the rest the same way for all of them -- the streak,
// the points, marking the buttons, the feedback line, and the Next button.
// `explain` is what makes a wrong answer worth having: it says why the one
// picked was wrong, never just "no".
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

// ---------------- 1a. variable or not ----------------
function sortQuestion(recent) {
  // Half and half, whatever the pool sizes: there are more variables than
  // non-variables, and a quiz that's mostly "yes" is one you can win by
  // always saying yes.
  const wantVariable = Math.random() < 0.5;
  const item = pickFresh(SORT_ITEMS.filter(i => i.variable === wantVariable), recent, i => i.label);
  return {
    key: item.label,
    prompt: { big: item.label },
    question: 'Is this a variable?',
    layout: 'pair',
    options: [
      { value: true, label: 'Variable' },
      { value: false, label: 'Not a variable' },
    ],
    answer: item.variable,
    explain: () => item.why,
  };
}

// ---------------- 1b / 1c. which one changes the other ----------------
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

// ---------------- 1d. match the graph ----------------
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
    if (chosen.dir !== rel.dir) {
      parts.push(rel.dir === 'up'
        ? `Its line goes down, but the statement says ${rel.dv} goes UP as ${rel.iv} goes up — the line should rise.`
        : `Its line goes up, but the statement says ${rel.dv} goes DOWN as ${rel.iv} goes up — the line should fall.`);
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

const QUESTION_TYPES = { sort: sortQuestion, roles: rolesQuestion, graph: graphQuestion };

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
  document.getElementById('quiz-streak-label').textContent =
    `${quizGame.streak} / ${quizGame.target} in a row — ${quizGame.multiplier()}x bonus`;
}

function setFeedback(text, kind) {
  const el = document.getElementById('quiz-feedback');
  el.textContent = text || '';
  el.className = 'quiz-feedback' + (kind ? ` ${kind}` : '');
}

function nextQuestion() {
  clearTimeout(quizAdvanceTimer);
  document.getElementById('quiz-next').classList.add('hidden');
  setFeedback('');

  const q = QUESTION_TYPES[quizSub.kind](quizRecent, quizSub);
  quizQuestion = q;
  quizAnswered = false;
  quizRecent = [q.key, ...quizRecent].slice(0, RECENT_MEMORY);

  const prompt = document.getElementById('quiz-prompt');
  prompt.innerHTML = '';
  const p = document.createElement('div');
  if (q.prompt.big) { p.className = 'prompt-big'; p.textContent = q.prompt.big; }
  else { p.className = 'prompt-quote'; p.textContent = q.prompt.quote; }
  prompt.appendChild(p);

  document.getElementById('quiz-question').innerHTML = q.question;

  const answers = document.getElementById('quiz-answers');
  answers.innerHTML = '';
  answers.className = `quiz-answers layout-${q.layout}`;
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-btn';
    btn.dataset.value = String(opt.value);
    if (opt.node) {
      const letter = document.createElement('span');
      letter.className = 'answer-letter';
      letter.textContent = opt.letter;
      btn.appendChild(letter);
      btn.appendChild(opt.node);
      btn.setAttribute('aria-label', `Graph ${opt.letter}: ${opt.node.getAttribute('aria-label')}`);
    } else {
      btn.textContent = opt.label;
    }
    btn.addEventListener('click', () => answerQuestion(opt.value));
    answers.appendChild(btn);
  });
  if (q.layout === 'graphs') fitGraphLabels(answers);
}

function answerQuestion(value) {
  if (!quizQuestion || quizAnswered) return;
  quizAnswered = true;
  const q = quizQuestion;
  const correct = value === q.answer;
  const result = quizGame.answer(correct);
  state.points = Math.max(0, state.points + result.pointsDelta);
  saveState();
  updateHeader();
  renderStreakBar();

  document.querySelectorAll('#quiz-answers .answer-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.value === String(q.answer)) btn.classList.add('is-answer');
    if (btn.dataset.value === String(value) && !correct) btn.classList.add('is-wrong');
  });

  if (correct) {
    setFeedback(`Correct! +${result.pointsDelta} pts`, 'ok');
    playCorrectSound();
    if (!result.complete) celebrateCorrect();
  } else {
    setFeedback(`Not quite (${result.pointsDelta} pts). ${q.explain(value)}`, 'err');
    playWrongSound();
  }

  if (result.complete) { markSubDone(quizSub); return; }
  if (correct) quizAdvanceTimer = setTimeout(nextQuestion, QUIZ_CORRECT_DELAY_MS);
  else {
    const next = document.getElementById('quiz-next');
    next.classList.remove('hidden');
    // Under four graphs on a small phone, the explanation lands below the
    // fold -- and an explanation nobody scrolls to might as well not exist.
    next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function openQuiz(sub) {
  quizSub = sub;
  quizGame = new StreakGame(sub.target || STREAK_TARGET);
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
