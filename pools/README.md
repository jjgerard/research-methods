# Subject pools

Every example in the game comes from a **pool**: a set of items from one area of study.
Each discipline in the picker draws on one or more pools (its own, plus neighbours), so
adjacent disciplines share examples. The mapping is `DISCIPLINES` in `disciplines.js`.

Each pool is one file here, `pools/<id>.js`, which adds itself to the global `POOLS`:

```js
POOLS.physical = { sortItems: [...], relations: [...], ... };
```

A pool file contains data only — no functions, no references to other files (except
that it may define its own `const` helpers for aliases it reuses, with names prefixed by
the pool id, e.g. `PHYS_TIME`, to avoid clashing with other pools).

`node tools/check-pools.js` checks every pool and every discipline against the rules
below. Run it after any change.

---

## Rules for content

These matter more than anything else in this file.

1. **Obvious to a second-year in the subject.** Every example should be something a
   second-year undergraduate in that discipline would find intuitive and familiar —
   textbook-standard, not cutting-edge.
2. **Nothing contested, nothing that could mislead.** No claim that could be read as
   advice or spread misinformation. In particular, nothing about:
   - screen time, social media or technology harming people;
   - diet, supplements, drugs, alcohol or treatments and health outcomes (beyond the
     plainly mechanical — "exercise intensity raises heart rate" is fine; "this diet
     prevents disease" is not);
   - vaccines, medicines or therapies working or not working;
   - differences between groups of people defined by sex, gender, ethnicity, nationality,
     religion, class, disability or sexuality;
   - politics, policy, crime rates, immigration, or anything a newspaper would argue about.
   Physical and biological mechanisms that are not in dispute (temperature and reaction
   rate, light and photosynthesis, practice and skill) are the ideal.
3. **Every statement is true as written.** The game asks what a statement claims, but a
   student will remember it, so it must be accurate.
4. **British spelling** (behaviour, colour, practise as a verb, analyse, centre).
5. **Plain, short sentences.** One or two sentences per description, three at most.
6. **Every item explains itself.** `why` says why the answer is right in terms a student
   can use next time, never just "this is correct".
7. **Match the house style** of the Language pool (`pools/language.js` points at the
   original arrays in `data.js` and `data2.js` — read them before writing).

---

## The format

A pool is an object with these keys. Minimum counts are per pool; a pool that is
someone's main pool should comfortably exceed them.

Any item may have `for: ['chemistry', 'physics']`: it's then used only by those
disciplines (ids from `disciplines.js`). Items without `for` are used by every discipline
that draws on the pool. Use `for` to give disciplines that share a pool their own
flavour — e.g. in the physical pool, reaction rates for chemistry, circuits for physics,
beam loading for engineering — alongside shared general items.

### `sortItems` — 1a, variable or not (≥ 14 variables, ≥ 10 not)

```js
{ label: 'reaction rate', variable: true,
  why: 'Reactions go faster or slower depending on conditions, and the rate can be measured.' },
{ label: 'the periodic table', variable: false,
  why: 'The periodic table is one particular thing, not a measurement. (The number of elements in a sample would be a variable.)' },
```
Not-variables are **one particular thing** (name the variable hiding inside it) or a
**constant** (measurable but only ever one value — include 2–3 of these).

### `relations` — 1b, 1c, 1d, 2b, 2c (≥ 14, of which ≥ 5 with `dir: 'down'`)

```js
{ id: 'temp-rate',                     // unique across ALL pools: prefix with pool id if in doubt
  iv: 'temperature', dv: 'reaction rate',          // button labels, lower case
  ivNP: 'the temperature', dvNP: 'the reaction rate',  // mid-sentence noun phrases, singular,
                                                       // so "Does X affect Y?" is grammatical
  hyp: ['temperature', 'reaction rate'],           // very short, for "Increasing X increases Y."
                                                   // (both together ≤ 36 characters)
  ivAxis: 'Temperature', dvAxis: 'Reaction rate',  // graph axis labels, ≤ 16 characters
  dir: 'up',                                       // 'up': more IV → more DV; 'down': more IV → less DV
  says: ['Reactions go faster at higher temperatures.',
         'The reaction rate goes up as the temperature rises.'],  // 2 phrasings; at least one
                                                                   // mentions the DV first
  why: 'The temperature is set before the reaction runs; the rate is the result. A fast reaction can\'t change the temperature it was set at.' },
```
The `why` says which variable does the changing and why the backwards version doesn't
hold. Relations must be genuinely causal in the direction given, and true.

### `validity` — 2a (≥ 3 of each of the 4 combinations)

```js
{ valid: true, reliable: false,
  text: 'Two sentences describing how something is measured, and what happens when it is repeated.',
  whyValid: 'lower-case clause completing "It IS valid: ..." or "It is NOT valid: ..."',
  whyReliable: 'lower-case clause completing "It IS reliable: ..."' },
```
Valid = measures the intended effect. Reliable = repeating it gives the same result.
Include reliability problems from too few participants/samples and from a procedure
described too vaguely to repeat.

### `continuity` — 2d (≥ 8 continuous, ≥ 8 discrete)

```js
{ cat: 'cont', label: 'mass of a sample',
  why: 'It can take any value on a scale, including every value in between — 2.5 g, 2.51 g...' },
{ cat: 'disc', label: 'number of seeds that germinate',
  why: 'It only comes in separate values, with nothing in between — seeds are counted.' },
```
Numeric variables only (no categories). Start each `why` with one of those two openings.

### `measurement` — 2e (≥ 4 of each: categorical, ordinal, interval, ratio)

```js
{ cat: 'ratio', label: 'mass in grams',
  why: 'Ratio: ranked, constant steps AND a natural zero, so "twice as much" makes sense. 0 g is no mass at all.' },
```
Openings (copy exactly): `Categorical: distinct outcomes with no order. `,
`Ordinal: the outcomes are ranked, but the difference between steps is arbitrary. `,
`Interval: ranked, with a constant difference between steps, but no natural zero — so values aren't "twice as much". `,
`Ratio: ranked, constant steps AND a natural zero, so "twice as much" makes sense. `
Course conventions: a numbered rating scale (1–7) and dates are **interval**; labelled
steps (strongly disagree … strongly agree) are **ordinal**; °C is interval, kelvin ratio.

### `confounds` — 2g (≥ 6 with a confound, ≥ 6 without)

```js
{ iv: 'light intensity', dv: 'growth rate', confound: 'temperature',
  vars: ['light intensity', 'growth rate', 'temperature', 'the type of seed'],  // IV, DV, confound, + one
                                                   // thing mentioned that does NOT differ
  text: 'Two or three sentences describing the study.',
  why: 'Why the confound is one: it changes along with the IV.' },
{ iv: '...', dv: '...', confound: null,
  text: 'The same kind of study, done properly (random assignment, same conditions).',
  why: 'Why nothing else differs.' },
```
Ideally pair them: the same study done badly and then done properly.

### Design items — used by `designs` and `crosslong`

```js
{ cat: 'within',                                // see each list below for the cats
  label: 'A description of the study, 1-3 sentences, that says what is MEASURED.',
  ivs: [{ name: 'fertiliser (with or without)', aliases: ['fertiliser', 'with or without fertiliser', 'fertilizer', 'treatment', 'feed'] }],
  dv: { name: 'plant height', aliases: ['height', 'how tall', 'growth', 'plant growth', 'size'] },
  others: [{ name: 'the seedlings', aliases: ['seedlings', 'plants', 'the plants'] }] },
```
- `ivs`: usually one; two for two-factor and panel designs. `dv`: exactly one.
- `others`: 1–2 things the description mentions that are NOT variables here (the
  participants, the samples, the equipment) — students often type these.
- `aliases`: the ways a student might name it in their own words — 4–10 short phrases,
  lower case. Word endings, small typos and extra words are handled automatically, so
  don't list plurals or misspellings. Avoid giving two candidates in the same item the
  same alias.
- Every description must say what is measured, since students have to name the DV.

#### `designs` — 2j, within or between (≥ 6 within, ≥ 6 between)
`cat: 'within'` (the same participants/samples in every condition) or `'between'`
(different ones in each). Pair them where you can (the same study both ways).

#### `crosslong` — 2f–2h, an object with three lists
- `single` (≥ 3 `cat: 'cross'`, ≥ 3 `cat: 'long'`): one IV. Cross-sectional = different
  groups measured at one point in time (IV is the grouping); longitudinal = the same
  group measured repeatedly over time (IV is time).
- `multi` (≥ 3 cross, ≥ 3 long): two IVs — the grouping or time, plus a second factor.
- `panel` (≥ 4, `cat: 'both'`): several groups, each followed over time. Two IVs: the
  grouping and time.
For time IVs, include plenty of aliases: 'time', 'over time', 'week', 'weeks', 'month',
'months', 'year', 'years', 'day', 'days', 'when it was measured', 'time point',
'session', 'age' (where relevant), 'before and after'.

### `factors` — Level 3 box notation (≥ 8)

```js
{ name: 'Temperature', levels: { 2: ['20°C', '40°C'], 3: ['20°C', '40°C', '60°C'], 4: ['20°C', '30°C', '40°C', '50°C'] } },
```
At least 3 factors with a 4-level version, 3 with a 3-level version, and every factor
with a 2-level version where it makes sense. Level labels short (≤ 14 characters).
