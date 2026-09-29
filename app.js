// ---------------------------------------------------------------------------
// App orchestration: the name gate, the level select, each level's list of
// sub-levels, points, help, the menu, the mascot, and localStorage.
//
// Built on the same shell as Shapes and Language, so a student who has
// played one already knows how the other works.
// ---------------------------------------------------------------------------

const POINTS_SUB_COMPLETE = 50;
const STORAGE_PREFIX = 'rm:';

let player = null; // {name, code, key}
// { points, done: [sub ids ever finished], introsSeen: [sub ids] }
let state = null;

// ---------------- storage ----------------
function storageKey(name, code) {
  return `${STORAGE_PREFIX}${name.trim().toLowerCase()}|${code.trim().toLowerCase()}`;
}
function loadState(key) {
  let parsed = null;
  try { parsed = JSON.parse(localStorage.getItem(key) || 'null'); } catch { parsed = null; }
  return {
    points: Number(parsed?.points) || 0,
    done: Array.isArray(parsed?.done) ? parsed.done : [],
    introsSeen: Array.isArray(parsed?.introsSeen) ? parsed.introsSeen : [],
    // Which discipline's examples to use. Progress and points are shared
    // across disciplines: switching changes the examples, not what's done.
    discipline: DISCIPLINES[parsed?.discipline] ? parsed.discipline : null,
  };
}
// Storage can be full or switched off (private browsing on some phones).
// Losing a save is bad; the whole game stopping dead mid-question because
// of it would be worse.
function saveState() {
  try { localStorage.setItem(player.key, JSON.stringify(state)); } catch { /* keep playing */ }
}

// ---------------- navigation / browser back button ----------------
// On a phone, the system back gesture is the instinctive "get me out of
// here" -- and without this it leaves the site entirely from the middle of
// a quiz. Every forward step registers an undo, so back always walks one
// step back through the app instead.
const navStack = [];
function pushNav(undo) {
  navStack.push(undo);
  history.pushState({ depth: navStack.length }, '');
}
// Every close/back control routes through here rather than closing things
// directly, so our stack and the browser's history can't drift apart.
function navBack() {
  if (navStack.length) history.back();
}
function resetNav() { navStack.length = 0; }
window.addEventListener('popstate', () => {
  const undo = navStack.pop();
  if (undo) undo();
});

// ---------------- screens ----------------
const SCREEN_SPEECH = {
  disciplines: 'What do you study? The examples will come from your subject.',
  name: '',
  levels: 'Pick a level to start!',
  level: 'Choose a sub-level below!',
};
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(`screen-${id}`).classList.remove('hidden');
  document.body.classList.toggle('on-welcome', id === 'name');
  window.scrollTo(0, 0);
  setMascotSpeech(SCREEN_SPEECH[id] || '');
}
function gotoLevels() { renderLevelSelect(); showScreen('levels'); }

// ---------------- progress ----------------
function isSubDone(sub) { return state.done.includes(sub.id); }
function isLevelDone(level) { return level.subs.every(isSubDone); }

function markSubDone(sub) {
  if (!isSubDone(sub)) {
    state.done.push(sub.id);
    state.points += POINTS_SUB_COMPLETE;
    saveState();
    flashMascotSpeech(`✓ ${sub.name} complete — +${POINTS_SUB_COMPLETE} pts!`, 5000);
  } else {
    flashMascotSpeech(`✓ ${sub.name} — already done, nice practice!`, 5000);
  }
  celebrateComplete();
  updateHeader();
  renderSubGrid();
  setModalDoneState(true);
}

// ---------------- mascot ----------------
function mascotPulse(className, duration) {
  const el = document.getElementById('mascot');
  el.classList.remove(className);
  void el.offsetWidth; // restart the animation mid-streak
  el.classList.add(className);
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove(className), duration);
}
function celebrateCorrect() { mascotPulse('jumping', 650); }
function celebrateComplete() { mascotPulse('dancing', 1350); playChimeSound(); }

// The mascot bar carries two kinds of message: a standing instruction for
// wherever you are (the base), and a passing reaction to what you just did
// (a flash), which hands the bar back to the base when it expires.
let mascotBase = '';
let mascotFlashTimer = null;

function renderMascotBubble(text) {
  const bubble = document.getElementById('mascot-bubble');
  bubble.textContent = text || '';
  bubble.classList.toggle('visible', !!text);
  syncMascotBarHeight();
}
function setMascotSpeech(text) {
  mascotBase = text || '';
  if (mascotFlashTimer) return;
  renderMascotBubble(mascotBase);
}
function flashMascotSpeech(text, ms = 3400) {
  if (!text) return;
  clearTimeout(mascotFlashTimer);
  renderMascotBubble(text);
  // Marked so CSS can tell a reaction from the standing instruction: on a
  // phone, inside a quiz, only reactions are shown (see style.css).
  document.getElementById('mascot-bubble').classList.add('flash');
  mascotFlashTimer = setTimeout(() => {
    mascotFlashTimer = null;
    document.getElementById('mascot-bubble').classList.remove('flash');
    renderMascotBubble(mascotBase);
  }, ms);
}
function clearMascotFlash() {
  clearTimeout(mascotFlashTimer);
  document.getElementById('mascot-bubble').classList.remove('flash');
  mascotFlashTimer = null;
  renderMascotBubble(mascotBase);
}
function toast(msg) { flashMascotSpeech(msg, 3800); }

// The bar's real height (it varies with the length of its text) feeds
// --mascot-bar-h, which main and the overlays use to keep clear of it.
function syncMascotBarHeight() {
  const el = document.querySelector('.mascot-wrap');
  document.documentElement.style.setProperty('--mascot-bar-h', el.offsetHeight + 'px');
}
window.addEventListener('resize', syncMascotBarHeight);

// ---------------- header ----------------
function updateHeader() {
  const pts = document.getElementById('player-points');
  pts.classList.toggle('hidden', !player);
  if (player) pts.textContent = `${state.points} pts`;
  const who = document.getElementById('menu-player');
  who.classList.toggle('hidden', !player);
  if (player) who.textContent = `Playing as ${player.name} — class ${player.code}`;
  document.getElementById('menu-switch').classList.toggle('hidden', !player);
  const subj = document.getElementById('menu-subject');
  subj.classList.toggle('hidden', !player || !state.discipline);
  if (player && state.discipline) subj.textContent = `📚 Subject: ${DISCIPLINES[state.discipline].name} — change`;
  const tag = document.getElementById('subject-tag');
  if (tag) {
    tag.classList.toggle('hidden', !player || !state.discipline);
    if (player && state.discipline) tag.innerHTML = `Examples from <strong>${DISCIPLINES[state.discipline].name}</strong> · <button class="link-btn" id="subject-change">change</button>`;
    const btn = document.getElementById('subject-change');
    if (btn) btn.addEventListener('click', () => { pushNav(gotoLevels); gotoDisciplines(); });
  }
}

function loginAs(name, code) {
  player = { name, code, key: storageKey(name, code) };
  state = loadState(player.key);
  try { localStorage.setItem(`${STORAGE_PREFIX}lastPlayer`, JSON.stringify({ name, code })); } catch { /* fine */ }
  updateHeader();
  resetNav();
  if (state.discipline && isPlayable(state.discipline)) gotoLevels();
  else gotoDisciplines();
}

// ---------------- disciplines ----------------
// Every example comes from the chosen discipline's pools (disciplines.js,
// pools/). content() merges them -- the discipline's own pool first, then
// its neighbours -- and drops items marked `for` other disciplines. It must
// stay in step with merged() in tools/check-pools.js.
function isPlayable(id) { return !!POOLS[DISCIPLINES[id].pools[0]]; }
function onSamples() { return DISCIPLINES[state.discipline]?.subjects === 'samples'; }

let contentCache = { id: null, value: null };
function content() {
  const id = state.discipline && isPlayable(state.discipline) ? state.discipline : 'linguistics';
  if (contentCache.id === id) return contentCache.value;
  const keep = it => !it.for || it.for.includes(id);
  const out = { sortItems: [], relations: [], validity: [], continuity: [], measurement: [], confounds: [], designs: [], single: [], multi: [], panel: [], factors: [] };
  const disc = DISCIPLINES[id];
  disc.pools.forEach((pid, i) => {
    const P = POOLS[pid];
    if (!P) return;
    const sameKind = i === 0 || POOL_SUBJECTS[pid] === disc.subjects;
    for (const k of ['sortItems', 'relations', 'validity', 'continuity', 'measurement', 'factors']) out[k].push(...P[k].filter(keep));
    if (!sameKind) return;
    for (const k of ['confounds', 'designs']) out[k].push(...P[k].filter(keep));
    for (const k of ['single', 'multi', 'panel']) out[k].push(...(P.crosslong[k] || []).filter(keep));
  });
  // Part 3 of cross-sectional/longitudinal: the panel designs, plus a third
  // as many from parts 1 and 2, so "both" has to be recognised.
  out.part3 = [...out.panel, ...out.single.filter((_, i) => i % 3 === 0), ...out.multi.filter((_, i) => i % 3 === 1)];
  contentCache = { id, value: out };
  return out;
}

// A sub-level with every function-valued field called -- see levels.js.
const RESOLVED_FIELDS = ['items', 'name', 'desc', 'choices', 'choiceWhy', 'choiceQuestion', 'question', 'categories', 'speech', 'help'];
function resolveSub(sub) {
  const out = { ...sub };
  for (const k of RESOLVED_FIELDS) if (typeof out[k] === 'function') out[k] = out[k]();
  return out;
}

function gotoDisciplines() {
  renderDisciplines();
  showScreen('disciplines');
}

function renderDisciplines() {
  const wrap = document.getElementById('discipline-groups');
  wrap.innerHTML = '';
  DISCIPLINE_GROUPS.forEach(g => {
    const h = document.createElement('h2');
    h.className = 'discipline-group-name';
    h.textContent = g.name;
    const grid = document.createElement('div');
    grid.className = 'discipline-grid';
    g.ids.forEach(id => {
      const d = DISCIPLINES[id];
      const ok = isPlayable(id);
      const b = document.createElement('button');
      b.className = 'discipline-btn' + (state.discipline === id ? ' current' : '');
      b.disabled = !ok;
      b.innerHTML = `${d.name}${ok ? '' : '<span>coming soon</span>'}`;
      b.addEventListener('click', () => chooseDiscipline(id));
      grid.appendChild(b);
    });
    wrap.append(h, grid);
  });
}

function chooseDiscipline(id) {
  state.discipline = id;
  saveState();
  contentCache = { id: null, value: null };
  updateHeader();
  resetNav();
  gotoLevels();
  toast(`Examples will now come from ${DISCIPLINES[id].name}.`);
}

// ---------------- level select ----------------
// Each level unlocks when the one before it is finished. A locked card
// shows nothing but its number -- its title would name what it teaches.
function renderLevelSelect() {
  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  LEVELS.forEach((level, i) => {
    const locked = i > 0 && !isLevelDone(LEVELS[i - 1]);
    const done = !locked && isLevelDone(level);
    const card = document.createElement('button');
    card.className = 'level-card' + (locked ? ' locked' : '') + (done ? ' level-done' : '');
    card.innerHTML = `<div class="level-num">Level ${level.n}</div>`;
    if (locked) {
      card.insertAdjacentHTML('beforeend', '<div class="lock-badge">🔒 Locked</div>');
    } else {
      const title = document.createElement('div');
      title.className = 'level-title';
      title.textContent = (done ? '✓ ' : '') + level.title;
      const blurb = document.createElement('p');
      blurb.textContent = level.blurb;
      const progress = document.createElement('div');
      progress.className = 'level-progress';
      progress.textContent = `${level.subs.filter(isSubDone).length} / ${level.subs.length} sub-levels done`;
      card.append(title, blurb, progress);
    }
    card.addEventListener('click', () => {
      // A tap that does nothing reads as a broken button, so say why.
      if (locked) { toast(`Level ${level.n} unlocks when every part of Level ${level.n - 1} is done.`); return; }
      openLevel(level);
    });
    grid.appendChild(card);
  });

  const roadmap = document.getElementById('roadmap');
  roadmap.innerHTML = '';
  ROADMAP.forEach((_, i) => {
    const card = document.createElement('div');
    card.className = 'level-card locked';
    card.innerHTML = `<div class="level-num">Level ${LEVELS.length + i + 1}</div><div class="lock-badge">🔒 Coming soon</div>`;
    roadmap.appendChild(card);
  });
}

// ---------------- one level's sub-levels ----------------
let currentLevel = null;

function openLevel(level) {
  currentLevel = level;
  document.getElementById('level-heading').textContent = `Level ${level.n} — ${level.title}`;
  document.getElementById('level-intro').textContent = level.intro;
  renderSubGrid();
  pushNav(gotoLevels);
  showScreen('level');
}

function renderSubGrid() {
  if (!currentLevel) return;
  const grid = document.getElementById('sub-grid');
  grid.innerHTML = '';
  currentLevel.subs.forEach((sub, i) => {
    const done = isSubDone(sub);
    const locked = i > 0 && !isSubDone(currentLevel.subs[i - 1]);
    const card = document.createElement('div');
    card.className = 'target-card' + (done ? ' done' : '') + (locked ? ' locked' : '');
    const letter = 'abcdefghijklmnop'[i];
    const h3 = document.createElement('h3');
    // Locked cards keep their name hidden: "Independent and dependent"
    // sitting on screen during 1b would hand over 1c's new words early.
    const shown = resolveSub(sub);
    h3.textContent = locked ? `${letter}. Locked` : `${letter}. ${done ? '✓ ' : ''}${shown.name}`;
    card.appendChild(h3);
    const p = document.createElement('p');
    p.textContent = locked ? 'Finish the one before to unlock this.' : shown.desc;
    if (locked) p.className = 'lock-note';
    card.appendChild(p);
    if (!locked) {
      const btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.textContent = done ? 'Practise again' : 'Start';
      btn.addEventListener('click', () => openQuiz(sub));
      card.appendChild(btn);
    }
    grid.appendChild(card);
  });
}

// ---------------- confirm dialog ----------------
// Instead of the browser's own confirm(), which looks like a security
// warning and is exactly the sort of thing that makes a nervous user leave.
let confirmResolver = null;
function askConfirm({ title, message, okLabel = 'Yes', cancelLabel = 'No, go back' }) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  document.getElementById('confirm-ok').textContent = okLabel;
  document.getElementById('confirm-cancel').textContent = cancelLabel;
  document.getElementById('confirm-overlay').classList.remove('hidden');
  return new Promise(resolve => { confirmResolver = resolve; });
}
function settleConfirm(answer) {
  document.getElementById('confirm-overlay').classList.add('hidden');
  const resolve = confirmResolver;
  confirmResolver = null;
  if (resolve) resolve(answer);
}
document.getElementById('confirm-ok').addEventListener('click', () => settleConfirm(true));
document.getElementById('confirm-cancel').addEventListener('click', () => settleConfirm(false));

// ---------------- how to play ----------------
const HELP = {
  // Openable from the welcome screen, so it's written for someone who has
  // no idea what this is yet.
  about: {
    title: 'About Research Methods',
    html: `<ul>
      <li>This is a puzzle game for practising <strong>research methods</strong>: what a
          variable is, which one changes which, how studies are designed, and how to
          describe data.</li>
      <li>You choose your subject at the start, from linguistics to chemistry, and every
          example comes from it. You can change subject at any time from the menu.</li>
      <li>It goes with a research methods module rather than replacing it. The game is
          where you practise the ideas enough times for them to stick.</li>
      <li>There are <strong>four levels</strong> so far, each split into short sub-levels.
          Early questions are a single tap. Later ones ask you to type answers in your
          own words.</li>
      <li><strong>Nothing here is graded and nothing is watched.</strong> Your points and
          anything you type stay on this device. Nobody else can see them, including
          your lecturer.</li>
      <li>There's no account, no email and no password. The class code keeps your points
          separate from anyone else's on a shared device.</li>
      <li>You can <strong>add it to your home screen</strong> and it opens like an app.
          On iPhone: <em>Share</em>, then <em>Add to Home Screen</em>. On Android: the
          <em>⋮</em> menu, then <em>Install app</em> or <em>Add to Home screen</em>.</li>
      <li>It's free, and the code is open for anyone to read or reuse:
          <a href="https://github.com/jjgerard/research-methods" target="_blank" rel="noopener">github.com/jjgerard/research-methods</a>.
          It's a sister game to
          <a href="https://jjgerard.github.io/shapes/" target="_blank" rel="noopener">Shapes and Language</a>.</li>
    </ul>`,
  },
  general: {
    title: 'How Research Methods works',
    html: `<ul>
      <li>Work through the levels in order. Each is split into sub-levels, and each one
          unlocks when you finish the one before it.</li>
      <li>A sub-level is finished when you get <strong>5 answers in a row</strong> (10 in a few, marked on the bar). The bar at the top shows how far you are.</li>
      <li>You have <strong>two hearts</strong> (♥♥) per run. A wrong answer costs a heart and
          tells you why it was wrong, but your run carries on. A third wrong answer starts the
          run again, with your hearts refilled.</li>
      <li>Every 3 in a row doubles the points each answer is worth. A wrong answer loses
          points at the same rate, so a guess is a gamble.</li>
      <li>Your points are saved automatically on this device, under your name and class code.
          You can close the page at any time and pick up where you left off.</li>
      <li><strong>Nothing you do here can break anything.</strong></li>
      <li>Tap <strong>?</strong> inside any sub-level to see the idea it's practising.
          Tap <strong>☰ Menu</strong> to turn sounds off or switch player.</li>
    </ul>`,
  },
};

// Takes a key into HELP, or a {title, html} entry directly (each sub-level
// carries its own in data.js).
function openHelp(keyOrEntry) {
  const entry = typeof keyOrEntry === 'string' ? (HELP[keyOrEntry] || HELP.general) : keyOrEntry;
  document.getElementById('help-title').textContent = entry.title;
  document.getElementById('help-body').innerHTML = entry.html;
  document.getElementById('help-overlay').classList.remove('hidden');
}
function closeHelp() { document.getElementById('help-overlay').classList.add('hidden'); }
document.getElementById('help-close').addEventListener('click', closeHelp);
document.querySelectorAll('[data-help]').forEach(btn => {
  btn.addEventListener('click', (ev) => { ev.stopPropagation(); openHelp(btn.dataset.help); });
});
document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Escape') return;
  if (!document.getElementById('help-overlay').classList.contains('hidden')) { closeHelp(); return; }
  if (!document.getElementById('menu-overlay').classList.contains('hidden')) { closeMenu(); return; }
  if (!document.getElementById('confirm-overlay').classList.contains('hidden')) settleConfirm(false);
});

// ---------------- menu ----------------
// Says what the setting IS, not what tapping does -- "Sound is off" can't be
// misread the way a lone speaker icon can.
function renderSoundButton() {
  document.getElementById('menu-sound').textContent = isSoundMuted() ? '🔇 Sound is off' : '🔊 Sound is on';
}
function openMenu() { renderSoundButton(); document.getElementById('menu-overlay').classList.remove('hidden'); }
function closeMenu() { document.getElementById('menu-overlay').classList.add('hidden'); }
document.getElementById('btn-menu').addEventListener('click', openMenu);
document.getElementById('menu-close').addEventListener('click', closeMenu);
document.getElementById('menu-sound').addEventListener('click', () => {
  setSoundMuted(!isSoundMuted());
  renderSoundButton();
  if (!isSoundMuted()) playCorrectSound();
});
document.getElementById('menu-help').addEventListener('click', () => { closeMenu(); openHelp('general'); });
document.getElementById('menu-about').addEventListener('click', () => { closeMenu(); openHelp('about'); });

document.getElementById('menu-subject').addEventListener('click', () => {
  closeMenu();
  if (quizSub) navBack();
  pushNav(gotoLevels);
  gotoDisciplines();
});

document.getElementById('menu-switch').addEventListener('click', async () => {
  closeMenu();
  const ok = await askConfirm({
    title: 'Switch to a different player?',
    message: `${player.name}'s ${state.points} points stay saved on this device under class ${player.code}. Typing the same name and class code again brings them straight back.`,
    okLabel: 'Yes, switch player',
    cancelLabel: 'No, stay here',
  });
  if (!ok) return;
  if (quizSub) closeQuiz();
  try { localStorage.removeItem(`${STORAGE_PREFIX}lastPlayer`); } catch { /* fine */ }
  player = null; state = null;
  updateHeader();
  resetNav();
  document.getElementById('input-name').value = '';
  document.getElementById('input-code').value = '';
  clearNameError();
  showScreen('name');
});

// ---------------- name gate ----------------
function showNameError(msg, focusEl) {
  const el = document.getElementById('name-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  if (focusEl) { focusEl.classList.add('invalid'); focusEl.focus(); }
}
function clearNameError() {
  document.getElementById('name-error').classList.add('hidden');
  document.getElementById('input-name').classList.remove('invalid');
  document.getElementById('input-code').classList.remove('invalid');
}
function attemptStart() {
  const nameEl = document.getElementById('input-name');
  const codeEl = document.getElementById('input-code');
  const name = nameEl.value.trim();
  const code = codeEl.value.trim();
  clearNameError();
  if (!name) return showNameError('Type your name in the first box, then press Start.', nameEl);
  if (!code) return showNameError('You still need the class code — your lecturer will have given you one.', codeEl);
  loginAs(name, code);
}
document.getElementById('btn-start').addEventListener('click', attemptStart);
['input-name', 'input-code'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') attemptStart(); });
  el.addEventListener('input', clearNameError);
});

document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', navBack));

// ---------------- boot ----------------
(function boot() {
  history.replaceState({ depth: 0 }, '');
  renderSoundButton();
  let last = null;
  try { last = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}lastPlayer`) || 'null'); } catch { last = null; }
  if (last && last.name && last.code) {
    document.getElementById('input-name').value = last.name;
    document.getElementById('input-code').value = last.code;
    loginAs(last.name, last.code);
  } else {
    showScreen('name');
  }
})();
