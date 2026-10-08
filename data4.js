// ---------------------------------------------------------------------------
// Level 4 -- averages and variation. Following the week 4 lecture: central
// tendency, then variation (the standard deviation as "average arrow
// length"), then distributions, z-scores, and the normal distribution.
//
// Heights are in centimetres (the slides use feet and inches, but this is a
// UK class). Everything is generated; 4a's see-saw is in visual.js.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Generated groups of heights.
// ---------------------------------------------------------------------------
function normalSample() {
  // Box-Muller.
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// n heights with EXACTLY the given mean and standard deviation (before
// rounding to the nearest cm), so the picture always matches the numbers
// the explanation quotes.
function heightsWith(n, mean, sd) {
  const z = Array.from({ length: n }, normalSample);
  const m = z.reduce((s, x) => s + x, 0) / n;
  const s = Math.sqrt(z.reduce((t, x) => t + (x - m) ** 2, 0) / n) || 1;
  return z.map(x => Math.round(mean + ((x - m) / s) * sd));
}

function statsOf(xs) {
  const n = xs.length;
  const mean = xs.reduce((s, x) => s + x, 0) / n;
  // The population SD (divide by n): "the average arrow length" of the
  // lecture, near enough, and what these pictures show.
  const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n);
  return { mean, sd, min: Math.min(...xs), max: Math.max(...xs) };
}

const randBetween = (lo, hi) => lo + Math.random() * (hi - lo);
const randInt = (lo, hi) => Math.floor(randBetween(lo, hi + 1));

// 4b: two groups, one clearly more spread out than the other (at least
// 2.5 times the SD). Their means are chosen independently, so the more
// varied group is as often the shorter one as the taller one -- "taller"
// and "more varied" have to come apart.
function makeVariationPair() {
  const lowSd = randBetween(2.5, 4.5);
  const highSd = lowSd * randBetween(2.5, 3.3);
  const moreVaried = Math.random() < 0.5 ? 0 : 1;
  const groups = [0, 1].map(g => {
    const sd = g === moreVaried ? highSd : lowSd;
    const heights = heightsWith(randInt(6, 9), randBetween(150, 172), sd);
    return { heights, ...statsOf(heights) };
  });
  return { groups, moreVaried };
}

// 4c: one group, and three arrows: half the SD, the SD, and double it.
// The lecture's "average arrow length" is a close cousin of the SD rather
// than the SD itself (the SD comes out a little longer), so the wrong
// arrows are far enough off that the intuition always picks the right one.
function makeSigmaGroup() {
  const heights = heightsWith(randInt(8, 11), randBetween(155, 170), randBetween(5, 11));
  const st = statsOf(heights);
  const factors = shuffle([0.5, 1, 2]);
  return { heights, ...st, arrows: factors.map((f, i) => ({ letter: 'ABC'[i], factor: f, length: st.sd * f })) };
}

// 4d and 4e ask for a whole or half number of SDs from the mean. Zero is
// left out: "where is the mean?" is already marked on the line.
const Z_TARGETS = [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];

// 4d: a crowd of heights for the dot plot, plus the line's mean and SD.
function makeHeightLine() {
  const mean = randInt(155, 172);
  const sd = randInt(5, 10);
  const heights = heightsWith(24, mean, sd).filter(h => Math.abs(h - mean) <= 2.2 * sd);
  return { mean, sd, heights, z: pick(Z_TARGETS) };
}

// 4e: one participant's 1-7 ratings, as in the lecture: every participant
// has their own mean and SD, and the z-scale lines up differently for each.
// Ratings stop at 7 (and 1), so the mean and SD are chosen to keep the
// whole of -2 to +2 SDs on the scale.
function makeRatingLine() {
  // No smaller than 0.75: below that, half an SD is a sliver of the 1-7
  // line, too small to see or to aim at on a phone.
  const sd = pick([0.75, 1, 1.25, 1.5]);
  const lo = 1 + 2 * sd;
  const hi = 7 - 2 * sd;
  const steps = Math.round((hi - lo) / 0.25);
  const mean = lo + 0.25 * randInt(0, steps);
  return { mean, sd, z: pick(Z_TARGETS) };
}

// ---------------------------------------------------------------------------
// 4f. Normal or skewed. Histograms over 13 bins.
//
// The normal ones come narrow and wide and sit left, centre or right --
// the lecture's own slide of four normal curves makes the point that
// normal is a SHAPE, not a width or a position. The skewed ones have a
// clearly longer tail on one side, either side.
// ---------------------------------------------------------------------------
const HIST_BINS = 13;

function makeDistribution() {
  const skewed = Math.random() < 0.5;
  let counts;
  let tail = null;
  if (!skewed) {
    // Wide ones only near the middle: a wide curve by the edge would have a
    // tail cut off by the end of the scale, and look skewed when it isn't.
    const centre = randInt(4, 8);
    const room = Math.min(centre, HIST_BINS - 1 - centre) / 2.8;
    const width = randBetween(1.1, Math.max(1.2, Math.min(2.4, room)));
    counts = Array.from({ length: HIST_BINS }, (_, i) => Math.round(30 * Math.exp(-(((i - centre) / width) ** 2) / 2)));
  } else {
    // A gamma shape: a peak near one end and a long tail towards the other.
    const k = randBetween(1.6, 2.4);
    const theta = randBetween(1.3, 2.1);
    const raw = Array.from({ length: HIST_BINS }, (_, i) => {
      const x = i + 0.6;
      return x ** (k - 1) * Math.exp(-x / theta);
    });
    const peak = Math.max(...raw);
    counts = raw.map(v => Math.round(30 * v / peak));
    tail = Math.random() < 0.5 ? 'right' : 'left';
    if (tail === 'left') counts.reverse();
  }
  return { counts, skewed, tail };
}
