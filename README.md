# Trial and Error

A browser game for practising research methods, for second-year undergraduates in any of
27 disciplines, from linguistics and psychology to chemistry and engineering. Students pick
their subject at the start, and every example comes from it. It was written to go
alongside the Research Methods module CMM378 (linguistics), rather than replace it.

It runs on a phone, needs no account, stores nothing on a server, and has no build step.
It's the sister game to [Shapes and Language](https://github.com/jjgerard/shapes).

**Play it:** https://jjgerard.github.io/trial-and-error/

## Get it on a phone

There is no app store. Open the link above and add it to the home screen. It then opens
full-screen with its own icon, like any other app.

| Phone | How |
|---|---|
| **iPhone / iPad** | Open the link in Safari → **Share** → **Add to Home Screen** |
| **Android** | Open the link in Chrome → **⋮** → **Install app** (or **Add to Home screen**) |

The same instructions are in the game, under **Menu → About this game**.

It needs a connection each time. That's deliberate: there's no offline cache, so nobody
can end up on an old copy without knowing.

---

## What it's for

A few things in a first research methods course tend not to stick:

- **Which variable is which.** Students can define "independent variable" and still pick
  the wrong one in a real study, especially when the sentence mentions the outcome first.
- **Measure versus thing.** The Titanic isn't a variable; ship size is. The difference is
  easy to agree with and hard to apply.
- **Design vocabulary.** Valid, reliable, confound, within, between, cross-sectional,
  longitudinal. Each one is simple on its own, but they blur together.

These aren't hard ideas. They're under-practised ones. A seminar might give a student
five examples; this gives them hundreds, with a reason every time they get one wrong.

## The design, and why

**Five in a row, with two hearts.** A sub-level is finished with 5 right answers in a row
(10 for Variable or not?, Match the graph, all of Level 3, and Level 4's b–f;
Level 4e also gets three hearts instead of two).
Each run allows two mistakes: a mistake costs a heart, and a third one starts the run
again. Every third right answer doubles what each answer is worth, and what a wrong one
costs, so guessing doesn't pay.

**Never just "no".** Every wrong answer says what was right and why.

**The idea before its name.** Level 1 asks which variable is the *changer* and which the
*change-ee* before it uses the words *independent* and *dependent*. The formal terms
arrive as new names for something the student can already do.

**No shortcuts through the wording.** Many statements mention the outcome first
("Reading time goes up as sentences get more complex"), so "the first thing mentioned is
the cause" never works as a rule.

**Answers in your own words.** Later sub-levels ask students to type the independent and
dependent variables. The game shows how it read the answer ("Read as: font size") before
marking it, and asks when it isn't sure. Typed answers are read on the device and never
sent anywhere.

**Built for phones, and for nervous users.** Large text and buttons, a visible way back
from everything, the phone's back gesture works, and nothing destructive happens without
asking first.

## The levels

### Level 1: Variables

| | Sub-level | What it asks |
|---|---|---|
| **a** | Variable or not? | Is this a measurable feature with different possible values? |
| **b** | Changer and change-ee | In this statement, which variable changes the other? |
| **c** | Independent and dependent | The same question, with the proper names. |
| **d** | Match the graph | Which of four graphs shows this statement? Forwards or backwards, increasing or decreasing. |

### Level 2: Research design fundamentals

| | Sub-level | What it asks |
|---|---|---|
| **a** | Valid? Reliable? | Is this design valid? Is it reliable? Both at once. |
| **b** | Hypotheses | Pick the two opposing hypotheses for a research question. |
| **c** | Hypotheses with the null | The same, plus the null hypothesis. Pick three. |
| **d** | Continuous or discrete? | Can the variable take any value, or only separate ones? |
| **e** | Levels of measurement | Categorical, ordinal, interval or ratio? |
| **f** | Cross-sectional or longitudinal? | Snapshot or over time? Then type the IV and DV. One factor each. |
| **g** | Two factors | The same, with two independent variables to find. |
| **h** | Both: panel designs | Several groups followed over time, mixed with designs from f and g. |
| **i** | Confounds | Is there a confound? If so, which variable is it? |
| **j** | Within or between subjects? | Type the IV, choose the design, then type the DV. |

### Level 3: Factorial designs and interactions

Every box and graph is generated fresh, so nothing can be memorised.

| | Sub-level | What it asks |
|---|---|---|
| **a** | What by what? | Read the size of a design (2×3, 4×2…) from its box notation. Either order is accepted. |
| **b** | What by what? From a graph | The same, from a bar graph: A along the bottom, B as colours. |
| **c** | Main effects and interactions | Is there a main effect of A? Of B? An interaction? All three at once, on small graphs (2 or 3 groups, 2 colours) with big, easy-to-see main effects. |

The graphs are built so each effect is either clearly there or exactly absent, never
borderline: an absent main effect has identical averages, and an interaction changes the
gap between colours without moving any average.

### Level 4: Averages and variation

| | Sub-level | What it asks |
|---|---|---|
| **a** | Mean, median or mode? | Which average does this description of a calculation give? |
| **b** | Which varies more? | Two groups of people drawn by height. Whose heights are more spread out? The more varied group is as often the shorter one. |
| **c** | Which arrow is σ? | Arrows from the mean to each person, and three candidates: half σ, σ and twice σ. |
| **d** | Standard deviations: heights | Drag a marker to the height that's a given number of σ from the mean. |
| **e** | Standard deviations: ratings | The same on a 1–7 scale lined up with the z-scale, with a new participant (mean and σ) each time. |
| **f** | Normal or skewed? | Normal curves come narrow or wide and anywhere on the scale; skewed ones have a long tail on either side. |

Everything except 4a is generated. Heights are in centimetres.

### Level 5: Real or coincidence?

| | Sub-level | What it asks |
|---|---|---|
| **a** | Real effect or coincidence? | A real effect from your subject, or an everyday coincidence? |
| **b** | H0 or H1? | Null or alternative hypothesis, about your subject. |
| **c** | Likely or unlikely by chance? | Coins, dice and cards: 6 heads in 10 flips, or 20 heads in a row? |
| **d** | Keep or reject H0? Coins and dice | The same events with an H0 ("the coin is fair"). |
| **e** | Keep or reject H0? Your subject | An experiment where nearly every trial goes the same way, or splits evenly. |
| **f** | The 5% line | "If H0 were true, the chance of results like these would be 30% / 2%": below 5%, reject; above, keep. |
| **g** | Which error? | Type 1, Type 2, or correct? |
| **h** | False alarms | One significant result among 20 tests, or a result found again and again? |

No arithmetic anywhere: the level builds the idea that we reject H0 when results would
hardly ever happen by chance *if H0 were true*, from coins and dice to the student's own
subject, and then shows the price of the 5% rule (about 1 false alarm in 20 tests).

## Fits on a phone

Every question, including its Check button, fits on a small phone screen (360×640)
without scrolling. That's checked for every sub-level, and at the last step of the
multi-step ones.

## Disciplines and subject pools

The examples come from **subject pools** (`pools/`), and each discipline draws on its own
pool plus one or two neighbours (`disciplines.js`), so adjacent subjects share examples.
Items can be marked for particular disciplines, so chemistry and physics share a pool but
still get their own examples.

| Pool | Main pool for |
|---|---|
| Language | Linguistics (the original content), Speech & language therapy (with Health) |
| Mind & behaviour | Psychology, Neuroscience |
| Society | Sociology, Criminology, Human geography, Anthropology, Media & communication, Social work |
| Education | Education |
| Economics & business | Economics, Business & marketing |
| Life sciences | Biology, Ecology, Biomedical science, Agriculture & animal science |
| Health & exercise | Nursing, Sport & exercise science, Nutrition & dietetics, Physiotherapy |
| Physical sciences | Chemistry, Physics, Engineering |
| Earth & environment | Earth sciences, Physical geography, Environmental science |
| Computing | Computer science |

All 27 disciplines are playable.

Every example has to be obvious to a second-year in the subject, true as written, and
uncontroversial: no health or treatment claims, no screen-time or social-media effects, no
differences between groups of people, nothing a newspaper would argue about. The full
rules and the format are in [`pools/README.md`](pools/README.md), and
`node tools/check-pools.js` checks every pool and every discipline against them.

Studies on samples rather than people (chemistry, biology, geology…) get sample wording
for within/between designs, and design questions only come from pools that study the same
kind of thing as the discipline.

## Running it

It's a static site with no dependencies:

```sh
git clone https://github.com/jjgerard/trial-and-error
cd trial-and-error
python3 -m http.server 8123      # then open http://localhost:8123
```

It's published with GitHub Pages from `main`. Files are loaded with a `?v=N` version
number in `index.html`. Raise it on every change so nobody gets a cached old copy.

## The code

| File | What's in it |
|---|---|
| `levels.js` | The levels and sub-levels: names, help text, and which question type each uses. |
| `disciplines.js` | The 27 disciplines, and which pools each draws on. |
| `pools/` | The subject pools, their rules and format. |
| `tools/check-pools.js` | Checks every pool and discipline against the rules. |
| `data.js` | Level 1's items, and the relations Level 2's hypotheses reuse. |
| `data2.js` | Level 2's items, with every explanation. |
| `data3.js` | Level 3's factors, and the generator for its graphs. |
| `data4.js` | Level 4's descriptions, and the generators for its groups, lines and distributions. |
| `data5.js` | Level 5's coincidences, chance events, the 5% line and the false alarms. |
| `quiz.js` | The question types, and the quiz screen they all share. |
| `parser.js` | Works out which part of a study description a typed answer means. |
| `graphs.js` | Every figure: line graphs, bar graphs, people, number lines and histograms. |
| `app.js` | Players, points, screens, menu, help and the mascot. |
| `streak.js` | The 10-in-a-row scoring. |
| `sound.js` | Sound effects, made in code with no audio files. |
| `logo.svg` | The source for `logo.png` and the `icon-*.png` files. |

Adding a level means adding its items to a data file and its entry to `levels.js`. The
engine knows nothing about research methods.

Comments explain why, not what. If a change makes a comment untrue, the change probably
needs rethinking.
