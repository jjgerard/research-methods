// ---------------------------------------------------------------------------
// Reading a typed answer: which of the things in the description did the
// student mean?
//
// This is deliberately NOT "look for the key phrase". Every question that
// takes typed text comes with a short list of candidates -- the handful of
// things its description mentions (the IV, the DV, the participants, the
// materials) -- and the only job here is to decide which one the student is
// talking about. Choosing between four known things is a far easier and far
// more forgiving problem than judging free prose: "whether the sentence was
// passive", "active vs passive" and "voice" all land on the same candidate
// without any of them having been anticipated word for word.
//
// Each candidate has a name and some aliases. A typed answer is split into
// words, the filler is dropped, and each alias is scored on how much of it
// the answer covers. Words that belong to several candidates count for less
// ("sentences" says little when the IV is sentence voice and the materials
// are sentences), so the word that actually tells candidates apart decides.
//
// The result is one of:
//   { status: 'match', id }          one candidate is clearly meant
//   { status: 'ambiguous', ids }     two or more are close -- ask which
//   { status: 'none' }               nothing recognisable -- ask again
// It never says "wrong" by itself: whether the candidate it found is the
// right answer is the question's business, not the parser's.
// ---------------------------------------------------------------------------

const PARSER_STOPWORDS = new Set((
  'the a an of in on at to and or vs versus for with their there they them its it is are was were be been ' +
  'by as that this these those how what which whether who do does did each every both same one two ' +
  'from into about than then i think its thing things whatever ' +
  // Naming the kind of variable isn't naming the variable.
  'variable variables independent dependent iv dv'
).split(' '));

function parserTokens(text) {
  return text.toLowerCase()
    .replace(/[’']s\b/g, '')
    .split(/[^a-z0-9]+/)
    .filter(w => w && !PARSER_STOPWORDS.has(w));
}

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

// Two words are the same word if they're equal, one is the other with an
// ending on ("sentence"/"sentences", "read"/"reading"), one is a clipped
// form of the other ("vocab"), or one is a single typo away from the other
// in a word long enough for that to be safe. Short words only get short
// endings: "rat" mustn't match "rating".
function sameWord(a, b) {
  if (a === b) return true;
  const short = Math.min(a.length, b.length);
  const prefix = a.startsWith(b) || b.startsWith(a);
  if (prefix && (short >= 5 || (short === 4 && Math.abs(a.length - b.length) <= 3))) return true;
  return short >= 5 && editDistance(a, b) <= 1;
}

// candidates: [{ id, name, aliases: [string] }]
function matchAnswer(text, candidates) {
  const answer = parserTokens(text);
  if (!answer.length) return { status: 'none' };

  const phrases = candidates.map(c => [c.name, ...(c.aliases || [])].map(parserTokens).filter(p => p.length));
  // How many candidates a word could belong to; a word shared by three
  // candidates is worth a third of one that picks out a single candidate.
  const spread = (word) => phrases.filter(ps => ps.some(p => p.some(w => sameWord(w, word)))).length || 1;

  const scores = candidates.map((c, i) => {
    let best = 0;
    for (const phrase of phrases[i]) {
      const hit = phrase.filter(w => answer.some(a => sameWord(a, w)));
      const coverage = hit.length / phrase.length;
      if (coverage < 0.5) continue;
      // A word typed exactly counts for more than one matched by its ending
      // or a typo: "readers" is the readers, even if "read" also appears
      // in how the reading time is described.
      const quality = w => (answer.includes(w) ? 1 : 0.6);
      const score = hit.reduce((s, w) => s + quality(w) / spread(w), 0) + 0.1 * coverage;
      best = Math.max(best, score);
    }
    return { id: c.id, score: best };
  }).sort((a, b) => b.score - a.score);

  const top = scores[0].score;
  if (top === 0) return { status: 'none' };
  const close = scores.filter(s => s.score > 0 && s.score >= top * 0.75);
  return close.length === 1 ? { status: 'match', id: close[0].id } : { status: 'ambiguous', ids: close.map(s => s.id) };
}
