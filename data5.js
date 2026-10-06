// ---------------------------------------------------------------------------
// Level 5 -- real or coincidence? Following the week 5 lecture on
// hypothesis testing.
//
// The idea the whole level builds towards: we reject H0 when the results
// would hardly ever happen by chance IF H0 WERE TRUE. It's built from
// intuition, not arithmetic -- nobody is asked to multiply probabilities:
//
//   5c  chance events everyone can judge (20 heads in a row? no way)
//   5d  the same events with an H0 attached ("the coin is fair")
//   5e  the same reasoning on an experiment in the student's own subject
//   5f  the 5% line: "1 in 4" keep, "1 in 1000" reject -- a comparison
//       against 1 in 20, not a calculation
//   5h  the price of the 5% line: about 1 test in 20 where H0 is true
//       comes out significant anyway (the lecture's xkcd jelly beans)
//
// The explanations say how often things happen by chance ("about once in
// a million tries") because that IS the point being made; students read
// those numbers, they never compute them.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 5a. Real effect or coincidence? The real effects are the chosen subject's
// own relations (see quiz.js); these are the coincidences -- one-off
// everyday events with no plausible way for one thing to cause the other,
// in the spirit of the lecture's "phone breaks when your second cousin
// looks at it".
// ---------------------------------------------------------------------------
const COINCIDENCES = [
  { label: 'Your phone screen cracked on a day your second cousin looked at it.',
    why: 'There\'s no way a glance can crack a screen. It just happened on the same day — a coincidence.' },
  { label: 'It rained on the afternoon you washed your car.',
    why: 'Washing a car doesn\'t make it rain. The two happened together by chance.' },
  { label: 'You thought about an old friend, and they texted you an hour later.',
    why: 'You think about lots of people every day; now and then one of them happens to get in touch.' },
  { label: 'Your team won on the day you wore your blue socks.',
    why: 'Your socks can\'t reach the pitch. Wins and sock colours line up by chance.' },
  { label: 'The bus came the moment you finished your sandwich.',
    why: 'Finishing a sandwich doesn\'t summon a bus. The timing was chance.' },
  { label: 'You sneezed just as the lights in the room flickered.',
    why: 'A sneeze can\'t affect the electricity. They happened at the same moment by chance.' },
  { label: 'The lift arrived straight away on the morning you wore a new jumper.',
    why: 'Lifts don\'t know what you\'re wearing. It arrived quickly by chance.' },
  { label: 'You stepped on a crack in the pavement, and later that day you missed your train.',
    why: 'A crack in the pavement can\'t make a train leave early. The two are unconnected.' },
  { label: 'A student sat in the third row on the day they got their best mark.',
    why: 'The seat didn\'t write the answers. The good mark and the seat happened to coincide.' },
  { label: 'You found a coin on the ground on the day you got good news by email.',
    why: 'Finding a coin can\'t change what someone emails you. It was chance.' },
  { label: 'The kettle boiled just as the doorbell rang.',
    why: 'A kettle can\'t ring a doorbell. They happened at the same time by chance.' },
  { label: 'Two people in your seminar group share a birthday.',
    why: 'In a group of 20–30 people a shared birthday is more likely than not. Nobody caused it.' },
  { label: 'You dreamt about a song and heard it on the radio the next day.',
    why: 'Popular songs are played over and over; sooner or later one turns up after you\'ve thought of it.' },
  { label: 'Your plant grew a new leaf the week you painted your bedroom.',
    why: 'Painting a room doesn\'t make a plant grow leaves. The two just happened in the same week.' },
  { label: 'The printer jammed right after you said it never jams.',
    why: 'Printers can\'t hear you. It jammed by chance — you just remember the times it does this.' },
  { label: 'It was sunny on the day you remembered to bring sunglasses.',
    why: 'Bringing sunglasses doesn\'t change the weather. Sun and sunglasses lined up by chance.' },
];

// ---------------------------------------------------------------------------
// 5c / 5d. Chance events. Generated from coins, dice and cards, and always
// clearly one thing or the other: "likely" outcomes are the kind that turn
// up at least about 1 time in 6 by chance; "unlikely" ones are 1 in a
// thousand or rarer. Nothing in between, so there's nothing to calculate --
// the only skill being practised is the judgment.
// ---------------------------------------------------------------------------
function binomial(n, k, p) {
  let c = 1;
  for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1);
  return c * p ** k * (1 - p) ** (n - k);
}

// "about 1 in 250", "about 1 in a million" -- readable, never a percentage
// with decimals.
function oneIn(prob) {
  const n = 1 / prob;
  if (n < 1.5) return 'almost every time';
  if (n >= 1e9) return `about 1 in ${Math.round(n / 1e9).toLocaleString('en-GB')} billion tries`;
  if (n >= 1e6) return `about 1 in ${Math.round(n / 1e6).toLocaleString('en-GB')} million tries`;
  const round = n < 20 ? Math.round(n) : n < 1000 ? Math.round(n / 10) * 10 : Math.round(n / 1000) * 1000;
  return `about 1 in ${round.toLocaleString('en-GB')} tries`;
}

const CHANCE_DEVICES = {
  coin: { h0: 'the coin is fair', what: 'heads', p: 1 / 2 },
  die: { h0: 'the die is fair', what: 'sixes', p: 1 / 6 },
  card: { h0: 'the cards are shuffled fairly', what: 'red cards', p: 1 / 2 },
};

// Returns { device, text, unlikely, prob, h0 }.
function makeChanceEvent() {
  const kind = pick(['coin', 'coin', 'die', 'die', 'card']);
  const dev = CHANCE_DEVICES[kind];
  const unlikely = Math.random() < 0.5;
  let n, k, text, prob;
  if (kind === 'coin') {
    if (unlikely) {
      n = pick([10, 12, 15, 20, 25]); k = Math.random() < 0.8 ? n : 0;
      text = `You flip a coin ${n} times and get ${k === n ? `${n} heads` : `no heads at all — ${n} tails`}.`;
      prob = binomial(n, k, 0.5);
    } else {
      n = pick([4, 6, 8, 10]); k = n / 2 + pick([-1, 0, 0, 1]);
      text = `You flip a coin ${n} times and get ${k} heads.`;
      prob = binomial(n, k, 0.5);
    }
  } else if (kind === 'die') {
    if (unlikely) {
      n = pick([5, 6, 8, 10]); k = n;
      text = `You roll a die ${n} times and get a six every time.`;
      prob = binomial(n, k, 1 / 6);
    } else {
      [n, k] = pick([[6, 1], [6, 0], [12, 2], [12, 1], [12, 3], [3, 0]]);
      text = k === 0 ? `You roll a die ${n} times and don't get a single six.` : `You roll a die ${n} times and get ${k === 1 ? 'one six' : `${k} sixes`}.`;
      prob = binomial(n, k, 1 / 6);
    }
  } else {
    if (unlikely) {
      n = pick([10, 12, 15, 20]); k = n;
      text = `You draw a card from a shuffled deck ${n} times, putting it back and reshuffling each time, and every card is red.`;
      prob = binomial(n, k, 0.5);
    } else {
      n = pick([4, 6, 8]); k = n / 2 + pick([-1, 0, 1]);
      text = `You draw a card from a shuffled deck ${n} times, putting it back and reshuffling each time, and ${k} of them are red.`;
      prob = binomial(n, k, 0.5);
    }
  }
  return { kind, text, unlikely, prob, h0: dev.h0 };
}

// ---------------------------------------------------------------------------
// 5e. An experiment in the student's own subject, built from one of its
// relations. The H0 is that the IV makes no difference, so each trial is a
// coin flip: the DV goes up or down by chance. All (or nearly all) trials
// going the same way is the 20-heads-in-a-row of a real experiment; a
// near-even split is what chance gives all the time.
// ---------------------------------------------------------------------------
function makeExperimentResult(rel) {
  const unlikely = Math.random() < 0.5;
  const n = pick([20, 24, 30, 40]);
  const iv = rel.ivNP || rel.iv;
  const dv = cap(rel.dvNP || rel.dv);
  const way = rel.dir === 'up' ? 'up' : 'down';
  const other = way === 'up' ? 'down' : 'up';
  let text, prob;
  if (unlikely) {
    const k = Math.random() < 0.6 ? n : n - 1;
    text = k === n
      ? `In all ${n} trials, ${dv.charAt(0).toLowerCase() + dv.slice(1)} went ${way} as ${iv} increased.`
      : `In ${k} of the ${n} trials, ${dv.charAt(0).toLowerCase() + dv.slice(1)} went ${way} as ${iv} increased; in the other one it went ${other}.`;
    prob = binomial(n, k, 0.5);
  } else {
    const k = n / 2 + pick([-1, 0, 1, 2]);
    text = `In ${k} of the ${n} trials, ${dv.charAt(0).toLowerCase() + dv.slice(1)} went ${way} as ${iv} increased; in the other ${n - k}, it went ${other}.`;
    prob = binomial(n, k, 0.5);
  }
  return { text, unlikely, prob, h0: `Changing ${iv} has no effect on ${rel.dvNP || rel.dv}.` };
}

// ---------------------------------------------------------------------------
// 5f. The 5% line. "If H0 were true, results like these would happen by
// chance ...". Never close to 5% itself -- the point is the rule, not a
// judgment call on the border.
// ---------------------------------------------------------------------------
const FIVE_PERCENT_CHANCES = [
  { text: 'about 1 time in 2', reject: false },
  { text: 'about 1 time in 3', reject: false },
  { text: 'about 1 time in 4', reject: false },
  { text: 'about 1 time in 6', reject: false },
  { text: 'about 1 time in 10', reject: false },
  { text: 'about 30% of the time', reject: false },
  { text: 'about 15% of the time', reject: false },
  { text: 'about half the time', reject: false },
  { text: 'about 1 time in 100', reject: true },
  { text: 'about 1 time in 200', reject: true },
  { text: 'about 1 time in 1,000', reject: true },
  { text: 'about 1 time in a million', reject: true },
  { text: 'about 1% of the time', reject: true },
  { text: 'less than 0.1% of the time', reject: true },
  { text: 'about 1 time in 50', reject: true },
  { text: 'about 2% of the time', reject: true },
];

// ---------------------------------------------------------------------------
// 5h. False alarms. At the 5% level, about 1 test in 20 where H0 is really
// true comes out "significant" by chance anyway -- a Type 1 error. So one
// significant result among many tests is weak evidence; a single planned
// test with a very rare result, or the same result found again and again,
// is strong. The convincing ones are partly built from the student's own
// subject (see quiz.js), so the strong evidence sounds like their field.
// ---------------------------------------------------------------------------
const FALSE_ALARMS = [
  { label: 'Researchers test whether each of 20 colours of jelly bean is linked to spots. One colour comes out significant at the 5% level.',
    why: 'Test 20 things that really have no effect, and about 1 in 20 will come out significant at the 5% level by chance. One out of 20 is exactly what chance alone predicts.' },
  { label: 'A questionnaire asks 40 different questions, and each is tested against exam marks. Two come out significant at the 5% level.',
    why: 'With 40 tests at the 5% level, about 2 would come out significant by chance even if nothing were going on.' },
  { label: 'A researcher reruns the same analysis 15 different ways, and reports only the one version that came out significant.',
    why: 'Try enough versions and one will cross the 5% line by chance. Reporting only that one hides all the times it didn\'t.' },
  { label: 'A study measures 25 different outcomes, and only one of them shows a significant difference between the groups.',
    why: 'With 25 outcomes, at least one significant result is likely by chance alone — about 1 in 20 tests gives a false alarm.' },
  { label: 'Researchers check 30 different foods against how well people sleep. One food comes out significant, and it\'s announced as a sleep aid.',
    why: 'Out of 30 tests, one or two significant results is what chance alone would produce. One hit out of 30 is weak evidence.' },
  { label: 'A study keeps adding participants and testing after each one, and stops as soon as the result is significant.',
    why: 'Testing again and again gives chance many tries to cross the 5% line. Stopping the moment it does makes a false alarm far more likely.' },
  { label: 'A researcher splits the participants into 20 different subgroups. The effect is significant in just one of them.',
    why: 'Twenty subgroups means twenty tests. One significant result among them is about what chance alone gives.' },
  { label: 'Of 20 tests in a study, one is significant at the 5% level — but nobody predicted it, and it has never been repeated.',
    why: 'One unpredicted result among 20 tests, never repeated, is exactly what a false alarm looks like.' },
];
