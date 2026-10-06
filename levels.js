// ---------------------------------------------------------------------------
// The levels. `kind` picks the question type in quiz.js; everything else is
// what the screens say. Each sub-level's `help` is shown automatically the
// first time it's opened (and again from its ? button), so the idea a
// sub-level practises is always one tap away from the question.
//
// Sub-level ids are what progress is saved under, so they never change once
// published -- which is why Level 2's are names rather than letters: a
// sub-level can be inserted in the middle without anyone's progress moving
// to a different card.
// ---------------------------------------------------------------------------
// Any sub-level field can be a function instead of a value: it's called
// when the sub-level opens (resolveSub in app.js), so items and wording can
// depend on the discipline the student chose.

// Examples for the help screens, taken from the chosen discipline's own
// content -- the first of each kind, which comes from its own pool -- so a
// chemist's help screens talk about chemistry.
function exRelation() { return content().relations[0]; }
function exDesign(list, cat) { return content()[list].find(d => d.cat === cat) || content()[list][0]; }
function exFactorPair() {
  const f = content().factors;
  const a = f.find(x => x.levels[3]) || FACTOR_POOL[0];
  const b = f.find(x => x !== a && x.levels[2]) || FACTOR_POOL[1];
  return [{ name: a.name, levels: a.levels[3] }, { name: b.name, levels: b.levels[2] }];
}
const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);
const quoteDesign = d => `<em>${d.label}</em>`;

// Shared by the three cross-sectional/longitudinal sub-levels.
const CROSSLONG_CHOICES = [
  { value: 'cross', label: 'Cross-sectional' },
  { value: 'long', label: 'Longitudinal' },
  { value: 'both', label: 'Both (a panel design)' },
];
const CROSSLONG_SHARED = {
  steps: ['choice', 'iv', 'dv'],
  choiceWhy: {
    cross: 'Different groups are compared at a single point in time — a snapshot. Nobody is tested again later.',
    long: 'The same group is measured repeatedly over time, to see how it changes. That\'s a cohort design.',
    both: 'Several groups are compared, AND each group is measured repeatedly over time. That\'s a panel design: cross-sectional and longitudinal at once.',
  },
};

const LEVELS = [
  {
    n: 1, title: 'Variables',
    blurb: 'What counts as a variable, which one changes the other, and what that looks like on a graph.',
    intro: 'Each sub-level asks one kind of question. Most sub-levels need 5 in a row to finish (the first and last need 10). You have two hearts per run, so two mistakes won\'t reset it.',
    subs: [
      {
        id: '1a', kind: 'classify', target: 10, name: 'Variable or not?',
        question: 'Is this a variable?',
        categories: [{ value: 'var', label: 'Variable' }, { value: 'not', label: 'Not a variable' }],
        items: () => content().sortItems.map(i => ({ ...i, cat: i.variable ? 'var' : 'not' })),
        desc: 'Sort things into variables and not-variables.',
        speech: 'Is it a variable? It needs to be measurable AND have different possible values.',
        help: {
          title: 'Variable or not?',
          html: `<ul>
            <li>A <strong>variable</strong> is a <strong>measurable feature</strong> that has
                <strong>different possible values</strong>.</li>
            <li><em>Height</em> is a variable: you can measure it, and people are different heights.</li>
            <li><em>The Eiffel Tower</em> isn't: it's one particular thing. (Its height is a
                variable, though — the height of buildings differs.)</li>
            <li>Watch out for things that can be measured but only ever have <strong>one</strong>
                value. Those aren't variables either.</li>
            <li>Get <strong>10 in a row</strong> to finish. You have <strong>two hearts</strong>:
                a mistake costs a heart and tells you why, but your run carries on. A third
                mistake starts the run again.</li>
          </ul>`,
        },
      },
      {
        id: '1b', kind: 'roles', terms: 'plain', name: 'Changer and change-ee',
        desc: 'In each statement, which variable is changing the other?',
        speech: 'One variable changes the other. Which one does the changing?',
        help: () => { const r = exRelation(); return {
          title: 'Changer and change-ee',
          html: `<ul>
            <li>When two variables are related, it usually <strong>isn't an equal relationship</strong>:
                one of them changes the other.</li>
            <li>The <strong>changer</strong> causes the change. The <strong>change-ee</strong>
                gets changed.</li>
            <li><em>${r.says[0]}</em> ${ucfirst(r.iv)} is the changer, and ${r.dv} is the
                change-ee. That's the <strong>forwards</strong> relation.</li>
            <li>The <strong>backwards</strong> relation — ${r.dv} changing ${r.iv} — doesn't
                make sense. Checking the backwards version is a good test.</li>
            <li>Read carefully: the changer isn't always mentioned first.</li>
          </ul>`,
        }; },
      },
      {
        id: '1c', kind: 'roles', terms: 'formal', name: 'Independent and dependent',
        desc: 'The same question, with the proper names.',
        speech: 'Same question, proper names: which is the independent variable, and which is the dependent?',
        help: () => { const r = exRelation(); return {
          title: 'New names for what you already know',
          html: `<ul>
            <li>The <strong>changer</strong> has a proper name: the
                <strong>independent variable</strong> (IV). It causes the change.</li>
            <li>The <strong>change-ee</strong> is the <strong>dependent variable</strong> (DV).
                It gets changed — its value <em>depends on</em> the independent variable.</li>
            <li>${ucfirst(r.iv)} causes the change in ${r.dv}, so ${r.iv} is the IV and
                ${r.dv} is the DV.</li>
            <li>Same statements as before, same thinking. Only the names are new.</li>
          </ul>`,
        }; },
      },
      {
        id: '1d', kind: 'graph', target: 10, name: 'Match the graph',
        desc: 'Four graphs, one statement. Which graph shows it?',
        speech: 'Pick the graph that shows the statement. Changer along the bottom, change-ee up the side.',
        help: {
          title: 'Match the graph',
          html: `<ul>
            <li>On a graph, the <strong>independent variable</strong> (the changer) goes along the
                <strong>bottom</strong>, and the <strong>dependent variable</strong> (the change-ee)
                goes <strong>up the side</strong>.</li>
            <li>A graph drawn that way round shows the <strong>forwards</strong> relation. Swap the
                axes and you've drawn it <strong>backwards</strong>.</li>
            <li>If more of the changer means more of the change-ee, the line goes
                <strong>up</strong> (increasing). If it means less, the line goes
                <strong>down</strong> (decreasing).</li>
            <li>So there are four graphs each time — forwards or backwards, increasing or
                decreasing — and only one matches the statement. Check the axis labels
                <em>and</em> the line.</li>
          </ul>`,
        },
      },
    ],
  },
  {
    n: 2, title: 'Research design fundamentals',
    blurb: 'Validity and reliability, hypotheses, levels of measurement, confounds, and who takes part in what.',
    intro: 'Each sub-level asks one kind of question. Get 5 in a row to finish it and unlock the next. You have two hearts per run, so two mistakes won\'t reset it.',
    subs: [
      {
        id: '2-validity', kind: 'validity', name: 'Valid? Reliable?',
        desc: 'Short descriptions of how something is measured. Is it valid, and is it reliable?',
        speech: 'Two questions each time: does it measure the right thing, and would it give the same result again?',
        help: {
          title: 'Validity and reliability',
          html: `<ul>
            <li>A design is <strong>valid</strong> if it measures <strong>the intended
                effect</strong> — what you actually want to ask about. Measuring head size to find out how intelligent someone is
                isn't valid — it's measuring something else.</li>
            <li>A design is <strong>reliable</strong> if <strong>repeating it gives the same
                result</strong>, like a cake recipe that gives the same cake every time. A tape measure round the same head gives the same
                number every time, so it's reliable — even though it isn't valid.</li>
            <li>Reliability also depends on having <strong>enough participants</strong> for the
                size of the effect, and on describing the study clearly enough for someone else
                to repeat it.</li>
            <li>They're separate questions. A design can have both, either one, or neither.</li>
            <li>Answer both, then press <strong>Check</strong>. Both have to be right to count.</li>
          </ul>`,
        },
      },
      {
        id: '2-hyp', kind: 'hypotheses', name: 'Hypotheses',
        desc: 'A research question and four hypotheses. Which two oppose each other?',
        speech: 'Pick the two opposing hypotheses: same cause and effect as the question, opposite directions.',
        help: () => { const r = exRelation(); return {
          title: 'Hypotheses',
          html: `<ul>
            <li>A <strong>research question</strong> asks whether one variable affects
                another: <em>Does ${r.ivNP || r.iv} affect ${r.dvNP || r.dv}?</em></li>
            <li>A <strong>hypothesis</strong> is a possible answer that can be tested:
                <em>Increasing ${r.hyp[0]} ${r.dir === 'up' ? 'increases' : 'decreases'} ${r.hyp[1]}.</em></li>
            <li><strong>Opposing hypotheses</strong> keep the same cause and effect as the
                question — the same independent and dependent variable — and predict opposite
                directions: one says the DV goes up, the other says it goes down.</li>
            <li>Watch for hypotheses that are <strong>backwards</strong>: they have the
                dependent variable doing the changing, like the backwards graphs in Level 1.</li>
            <li>Tap two, then press <strong>Check</strong>.</li>
          </ul>`,
        }; },
      },
      {
        id: '2-hyp-null', kind: 'hypotheses', withNull: true, name: 'Hypotheses with the null',
        desc: 'Six hypotheses now. Pick the two opposing ones and the null.',
        speech: 'Pick three: the two opposing hypotheses, and the null hypothesis.',
        help: () => { const r = exRelation(); return {
          title: 'The null hypothesis',
          html: `<ul>
            <li>As well as the two opposing hypotheses, there's always a third possibility:
                the independent variable makes <strong>no difference at all</strong>.</li>
            <li>That's the <strong>null hypothesis</strong>: <em>Changing ${r.hyp[0]} has
                no effect on ${r.hyp[1]}.</em></li>
            <li>The null keeps the same direction of cause as the question, too. "Changing
                ${r.hyp[1]} has no effect on ${r.hyp[0]}" is backwards.</li>
            <li>Tap three, then press <strong>Check</strong>.</li>
          </ul>`,
        }; },
      },
      {
        id: '2-contdisc', kind: 'classify', name: 'Continuous or discrete?',
        desc: 'Can it take any value, or only separate ones?',
        question: 'Is this variable continuous or discrete?',
        categories: [{ value: 'cont', label: 'Continuous' }, { value: 'disc', label: 'Discrete' }],
        items: () => content().continuity,
        speech: 'Continuous: any value, including in between. Discrete: separate values, nothing in between.',
        help: {
          title: 'Continuous or discrete?',
          html: `<ul>
            <li>A <strong>continuous</strong> variable has <strong>infinite values, with no
                gaps</strong> in the scale: age, time, distance.</li>
            <li>A <strong>discrete</strong> variable has <strong>finite or countable
                values</strong> that can't be divided up: you can't have 20.3 people, or be born
                partly in 2002 and partly in 2003.</li>
            <li>Careful: the <em>average</em> number of people can be 20.3, so an average is
                continuous.</li>
            <li>A quick test: can you sensibly add another decimal place? Then it's continuous.
                If the values are counted, it's discrete.</li>
          </ul>`,
        },
      },
      {
        id: '2-noir', kind: 'classify', name: 'Levels of measurement',
        desc: 'Categorical, ordinal, interval or ratio?',
        question: 'What level of measurement is this?',
        categories: [
          { value: 'categorical', label: 'Categorical' },
          { value: 'ordinal', label: 'Ordinal' },
          { value: 'interval', label: 'Interval' },
          { value: 'ratio', label: 'Ratio' },
        ],
        items: () => content().measurement,
        speech: 'Categorical, ordinal, interval or ratio?',
        help: {
          title: 'Levels of measurement',
          html: `<ul>
            <li><strong>Categorical</strong>: distinct outcomes with no order. <em>Place of
                birth, blood type, handedness.</em></li>
            <li><strong>Ordinal</strong>: the outcomes are ranked, but the difference between
                steps is arbitrary. <em>1st, 2nd, 3rd place; strongly disagree … strongly
                agree.</em></li>
            <li><strong>Interval</strong>: ranked, with a constant difference between steps, but
                no natural zero — values aren't "twice as much". <em>A rating scale of 1–7;
                a date.</em></li>
            <li><strong>Ratio</strong>: ranked, constant steps, <em>and</em> a natural zero.
                <em>Weight; time to do a task</em> — it can take twice as long.</li>
          </ul>`,
        },
      },
      // Cross-sectional and longitudinal, in three parts: one factor, two
      // factors, then both. The design choice, its explanations and the
      // definitions are shared; what changes is how many IVs there are to
      // find, and -- only in part 3 -- whether "both" is on offer at all.
      {
        id: '2-crosslong', kind: 'design', name: 'Cross-sectional or longitudinal?',
        desc: 'A snapshot, or one group followed over time? Then name the IV and DV in your own words.',
        items: () => content().single,
        ...CROSSLONG_SHARED,
        choices: CROSSLONG_CHOICES.slice(0, 2),
        choiceQuestion: 'Is this design <strong>cross-sectional</strong> or <strong>longitudinal</strong>?',
        speech: 'Snapshot or over time? Then type the IV and the DV in your own words.',
        help: () => ({
          title: 'Cross-sectional and longitudinal',
          html: `<ul>
            <li>A <strong>cross-sectional</strong> design is a <strong>snapshot</strong>: how do
                two or more groups differ at one point in time? ${quoteDesign(exDesign('single', 'cross'))}</li>
            <li>A <strong>longitudinal</strong> design takes <strong>repeated measures from the same
                group over time</strong>: how does a group change? ${quoteDesign(exDesign('single', 'long'))}
                Following one group like this is a <strong>cohort design</strong>.</li>
            <li>Then type the <strong>independent variable</strong> and the <strong>dependent
                variable</strong> in your own words. In a cross-sectional design the IV is usually
                the grouping; in a longitudinal one, it's time.</li>
            <li>You'll see how your answer was read before it's marked. If it could mean two
                things, you'll be asked which.</li>
          </ul>`,
        }),
      },
      {
        id: '2-crosslong-multi', kind: 'design', name: 'Two factors',
        desc: 'Cross-sectional or longitudinal again, but now each design has two independent variables.',
        items: () => content().multi,
        ...CROSSLONG_SHARED,
        choices: CROSSLONG_CHOICES.slice(0, 2),
        choiceQuestion: 'Is this design <strong>cross-sectional</strong> or <strong>longitudinal</strong>?',
        speech: 'Snapshot or over time? Then find BOTH independent variables, and the DV.',
        help: () => ({
          title: 'Two factors',
          html: `<ul>
            <li>A design can have <strong>more than one factor</strong> — more than one
                independent variable.</li>
            <li>${quoteDesign(exDesign('multi', 'cross'))} Still a snapshot, so still
                <strong>cross-sectional</strong>, but with two IVs: ${exDesign('multi', 'cross').ivs.map(v => v.name).join(' and ')}.</li>
            <li>${quoteDesign(exDesign('multi', 'long'))} Still one group over time, so still
                <strong>longitudinal</strong>, with two IVs: ${exDesign('multi', 'long').ivs.map(v => v.name).join(' and ')}.</li>
            <li>First choose the design. Then type <strong>both</strong> independent variables,
                in either order, and then the dependent variable.</li>
          </ul>`,
        }),
      },
      {
        id: '2-crosslong-both', kind: 'design', name: 'Both: panel designs',
        desc: 'Several groups, each followed over time. Plus some from before, so choose carefully.',
        items: () => content().part3,
        ...CROSSLONG_SHARED,
        choices: CROSSLONG_CHOICES,
        choiceQuestion: 'Is this design <strong>cross-sectional</strong>, <strong>longitudinal</strong>, or <strong>both</strong>?',
        speech: 'Snapshot, over time, or both? Then type the IVs and the DV.',
        help: () => ({
          title: 'Both: panel designs',
          html: `<ul>
            <li>A <strong>panel design</strong> is cross-sectional and longitudinal at once:
                <strong>several groups</strong>, each <strong>followed over time</strong>.</li>
            <li>${quoteDesign(exDesign('panel', 'both'))} The groups make it cross-sectional; the
                repeated measurements make it longitudinal.</li>
            <li>So a panel design always has at least <strong>two independent variables</strong>:
                which group, and when.</li>
            <li>Not every design here is a panel design — some are from the last two parts. Check
                for both things: different groups <em>and</em> repeated testing.</li>
          </ul>`,
        }),
      },
      {
        id: '2-confound', kind: 'confound', name: 'Confounds',
        desc: 'Is something other than the independent variable changing too?',
        speech: 'Is there a confound? If there is, say which variable it is.',
        help: {
          title: 'Confounds',
          html: `<ul>
            <li>An experiment changes the <strong>independent variable</strong> and measures the
                <strong>dependent variable</strong>. Nothing else should differ between the
                conditions.</li>
            <li>A <strong>confound</strong> is another variable that changes <strong>along
                with</strong> the independent variable. If it does, you can't tell which of the
                two caused any difference in the DV.</li>
            <li>Example: the music group reads in the morning and the silent group at night.
                Time of day is a confound.</li>
            <li>First say whether there is one. If you say yes, you'll be asked which variable
                it is. Both steps have to be right to count.</li>
          </ul>`,
        },
      },
      {
        // Worded for whatever the discipline studies: people take part in
        // conditions, but a chemistry sample or a steel beam doesn't.
        id: '2-withinbetween', kind: 'design',
        name: () => (onSamples() ? 'Within or between samples?' : 'Within or between subjects?'),
        desc: () => `Name the IV in your own words, say whether it's within or between ${onSamples() ? 'samples' : 'subjects'}, then name the DV.`,
        items: () => content().designs,
        steps: ['iv', 'choice', 'dv'],
        choiceQuestion: () => (onSamples()
          ? 'Is each sample tested in <strong>every condition</strong> (within), or are there <strong>different samples</strong> for each (between)?'
          : 'Is this a <strong>within-subjects</strong> or a <strong>between-subjects</strong> design?'),
        choices: () => (onSamples()
          ? [{ value: 'within', label: 'Within (same samples)' }, { value: 'between', label: 'Between (different samples)' }]
          : [{ value: 'within', label: 'Within subjects' }, { value: 'between', label: 'Between subjects' }]),
        choiceWhy: () => (onSamples()
          ? {
            within: 'The same samples are tested under every condition, so each sample is compared with itself.',
            between: 'Each sample is tested under only one condition, so different samples are compared.',
          }
          : {
            within: 'The same people take part in every condition, so each person is compared with themselves.',
            between: 'Each person is in only one condition, so different groups of people are compared.',
          }),
        speech: 'Type the IV in your own words, decide within or between, then type the DV.',
        help: () => ({
          title: onSamples() ? 'Within or between samples?' : 'Within or between subjects?',
          html: `<ul>
            ${onSamples()
              ? `<li>In a <strong>within</strong> design, <strong>the same samples</strong> are
                tested under every condition, so each sample is compared with itself.</li>
            <li>In a <strong>between</strong> design, each sample is tested under
                <strong>only one condition</strong>, and different samples are compared.</li>
            <li>Ask: is any one sample tested under more than one condition?</li>`
              : `<li>In a <strong>within-subjects</strong> design, <strong>the same people</strong>
                take part in every condition, so each person is compared with themselves.</li>
            <li>In a <strong>between-subjects</strong> design, each person takes part in
                <strong>only one condition</strong>, and different groups are compared.</li>
            <li>Ask: does any one person experience more than one condition?</li>`}
            <li>Each question has three steps. First <strong>type the independent
                variable</strong> in your own words — whatever differs between the
                conditions. Then choose within or between. Then <strong>type the dependent
                variable</strong> — whatever gets measured.</li>
            <li>You'll see how your answer was read before it's marked. If it could mean two
                things, you'll be asked which.</li>
          </ul>`,
        }),
      },
    ],
  },
  {
    n: 3, title: 'Factorial designs and interactions',
    blurb: 'How big is a design, and what does a graph of it show: main effects, an interaction, both or neither?',
    intro: 'Every design and graph here is generated fresh, so there\'s nothing to memorise, only things to read. Get 10 in a row to finish each sub-level; you have two hearts per run.',
    subs: [
      {
        id: '3-box', kind: 'box', target: 10, name: 'What by what?',
        desc: 'Read the size of a design from its box notation.',
        speech: 'Count the levels of each factor. What by what?',
        help: () => { const [a, b] = exFactorPair(); return {
          title: 'Factorial designs',
          html: `<ul>
            <li>A <strong>factorial design</strong> has more than one factor (independent
                variable), and every level of one is combined with every level of the other.</li>
            <li>The design is named by <strong>how many levels each factor has</strong>.
                ${a.name} (${a.levels.join(', ')}) × ${b.name} (${b.levels.join(', ')}) is a
                <strong>3×2 design</strong>, with 3 × 2 = 6 conditions.</li>
            <li>Either order is fine: a 3×2 design is also a 2×3 design.</li>
            <li>Tap the two numbers, then <strong>Check</strong>.</li>
          </ul>`,
        }; },
      },
      {
        id: '3-bars', kind: 'barDims', target: 10, name: 'What by what? From a graph',
        desc: 'The same question, read from a bar graph.',
        speech: 'Count the groups along the bottom, and the colours. What by what?',
        help: {
          title: 'Reading a design from a graph',
          html: `<ul>
            <li>In these graphs, factor <strong>A</strong> is along the bottom: each group of
                bars is one level of A.</li>
            <li>Factor <strong>B</strong> is shown by <strong>colour</strong>: each colour is one
                level of B, and the key at the top lists them.</li>
            <li>So the design is (number of groups) × (number of colours). There's one bar for
                every condition.</li>
            <li>Ignore the heights of the bars for now — only the size of the design matters
                here.</li>
          </ul>`,
        },
      },
      {
        id: '3-effects', kind: 'effects', target: 10, name: 'Main effects and interactions',
        desc: 'Is there a main effect of A? Of B? An interaction? Two or three groups, two colours.',
        speech: 'Main effect of A? Of B? An interaction? Answer all three, then check.',
        help: {
          title: 'Main effects and interactions',
          html: `<ul>
            <li>A <strong>main effect of A</strong>: <em>averaged over the colours</em>, do the
                groups along the bottom differ? Picture each group's bars squashed into one
                average bar — are those all the same height?</li>
            <li>A <strong>main effect of B</strong>: <em>averaged over the groups</em>, do the
                colours differ? Is one colour higher than another overall?</li>
            <li>An <strong>interaction</strong>: does the effect of B <strong>depend on</strong>
                the level of A? If the colours follow the same pattern in every group (the
                same gaps between them), there's no interaction. If the pattern changes from
                group to group, there is.</li>
            <li>Each of the three can be there or not, in any combination — even an
                interaction with no main effects at all.</li>
            <li>Answer all three, then press <strong>Check</strong>. All three have to be right.</li>
          </ul>`,
        },
      },
    ],
  },
  {
    n: 4, title: 'Averages and variation',
    blurb: 'Mean, median and mode; how spread out data is; z-scores; and normal versus skewed distributions.',
    intro: 'Each sub-level asks one kind of question. Some sub-levels need 5 in a row to finish and some need 10 (the bar shows which). You have two hearts per run, so two mistakes won\'t reset it.',
    subs: [
      {
        id: '4-central', kind: 'classify', name: 'Mean, median or mode?',
        desc: 'Which average does this calculation give you?',
        question: 'Which average is this?',
        categories: [{ value: 'mean', label: 'Mean' }, { value: 'median', label: 'Median' }, { value: 'mode', label: 'Mode' }],
        items: CENTRAL_ITEMS,
        speech: 'Mean, median or mode? Read how it\'s worked out.',
        help: {
          title: 'Mean, median and mode',
          html: `<ul>
            <li>The <strong>mean</strong>: add up all the values and divide by how many there
                are. Exam marks 80, 77 and 30: 187 ÷ 3 = 62.</li>
            <li>The <strong>median</strong>: put the values in order and take the one in the
                <strong>middle</strong>. 30, 77, 80: the median is 77. Half the values are below
                it and half above.</li>
            <li>The <strong>mode</strong>: the value that appears <strong>most often</strong>.</li>
          </ul>`,
        },
      },
      {
        id: '4-variation', kind: 'variation', target: 10, name: 'Which varies more?',
        desc: 'Two groups of people. Whose heights are more spread out?',
        speech: 'Which group\'s heights are more spread out?',
        help: {
          title: 'Variation',
          html: `<ul>
            <li><strong>Variation</strong> (or dispersion) is how <strong>spread out</strong> the
                values are: how far they tend to be from the mean.</li>
            <li>A group where everyone is about the same height varies little. A group with some
                very short and some very tall people varies a lot.</li>
            <li>The dashed line is each group's mean. Being taller or shorter on average is a
                different question — look at how far people are from their own group's line.</li>
          </ul>`,
        },
      },
      {
        id: '4-sigma', kind: 'sigma', target: 10, name: 'Which arrow is σ?',
        desc: 'Pick the arrow that shows the standard deviation.',
        speech: 'Which arrow is the standard deviation?',
        help: {
          title: 'The standard deviation (σ)',
          html: `<ul>
            <li>Draw an arrow from the mean to each value: how far away from the mean is it?</li>
            <li>The <strong>standard deviation</strong>, σ, is roughly the <strong>average
                arrow length</strong>.</li>
            <li>So σ is longer than the shortest arrows and shorter than the longest ones. One of
                the three arrows fits; the others are half as long and twice as long.</li>
          </ul>`,
        },
      },
      {
        id: '4-heightz', kind: 'heightZ', target: 10, name: 'Standard deviations: heights',
        desc: 'Find the height that\'s a given number of standard deviations from the mean.',
        speech: 'Tap the height that many standard deviations from the mean.',
        help: {
          title: 'Counting in standard deviations',
          html: `<ul>
            <li>Any value can be described by <strong>how many standard deviations</strong> it is
                from the mean. That number is its <strong>z-score</strong>.</li>
            <li>z = 0 is the mean. z = +1 is one σ above it; z = −1 is one σ below it.</li>
            <li>z = +1.5 is one and a half σ above the mean: with a mean of 165 cm and σ = 8 cm,
                that's 165 + 1.5 × 8 = 177 cm.</li>
            <li>The line shows the mean and one σ either side. Tap the point for the z you're
                given.</li>
          </ul>`,
        },
      },
      {
        id: '4-ratingz', kind: 'ratingZ', target: 10, allowedMisses: 3, name: 'Standard deviations: ratings',
        desc: 'The same on a 1–7 rating scale, with a different participant each time. Three hearts for this one.',
        speech: 'Every participant has their own mean and σ. Tap the rating for that z.',
        help: {
          title: 'z-scores for ratings',
          html: `<ul>
            <li>Participants use a rating scale differently: some are harsh, some lenient, some
                use the whole scale and some only the middle.</li>
            <li>So each participant has their <strong>own mean and σ</strong>, and their own way
                the 1–7 scale lines up with the z-scale underneath it.</li>
            <li>z = +1 for a lenient participant might be a 7; for a harsh one, a 4.</li>
            <li>Drag the marker to the rating that matches the z you're given, for this
                participant.</li>
            <li>This one is trickier, so you get <strong>three hearts</strong> per run instead
                of two.</li>
          </ul>`,
        },
      },
      {
        id: '4-skew', kind: 'skew', target: 10, name: 'Normal or skewed?',
        desc: 'Is the distribution symmetrical, or does it have a long tail?',
        speech: 'Normal or skewed? Look at the shape, and at the tails.',
        help: {
          title: 'Normal and skewed distributions',
          html: `<ul>
            <li>A <strong>normal</strong> distribution is a symmetrical bell shape: the same
                amount of the population below the mean as above it. Its mean, median and mode are
                all in the same place.</li>
            <li>It can be narrow or wide, and sit anywhere on the scale. The <strong>shape</strong>
                is what makes it normal.</li>
            <li>A <strong>skewed</strong> distribution has one tail much longer than the other. The
                long tail pulls the mean towards it, so the mean and the median are different.</li>
          </ul>`,
        },
      },
    ],
  },
  {
    n: 5, title: 'Real or coincidence?',
    blurb: 'Is an effect real, or could it be chance? Null hypotheses, the 5% rule, errors and false alarms.',
    intro: 'Each sub-level asks one kind of question. Get 5 in a row to finish it and unlock the next. You have two hearts per run, so two mistakes won\'t reset it.',
    subs: [
      {
        id: '5-real', kind: 'real', name: 'Real effect or coincidence?',
        desc: 'A real effect from your subject, or an everyday coincidence?',
        speech: 'Real effect, or probably just a coincidence?',
        help: {
          title: 'Real effect or coincidence?',
          html: `<ul>
            <li>A <strong>real effect</strong> happens again every time: drop your phone and it falls.
                The chance that it's a coincidence is low.</li>
            <li>A <strong>coincidence</strong> just happened once: your phone broke on a day your
                second cousin looked at it. Do it again and it almost certainly won't happen.</li>
            <li>Ask: is there a way one thing could cause the other — and would it happen again?</li>
          </ul>`,
        },
      },
      {
        id: '5-h0h1', kind: 'h0h1', name: 'H0 or H1?',
        desc: 'The null hypothesis, or the alternative?',
        speech: 'Null hypothesis or alternative hypothesis?',
        help: {
          title: 'H0 and H1',
          html: `<ul>
            <li>The <strong>null hypothesis, H0</strong>: there is <strong>no difference</strong> between
                the conditions — the independent variable has no effect.</li>
            <li>The <strong>alternative hypothesis, H1</strong>: there <strong>is</strong> a difference
                — the independent variable has an effect, in either direction.</li>
            <li>We can never prove H1 is true. What we can do is show that H0 is very hard to believe —
                and then conclude that there is an effect.</li>
          </ul>`,
        },
      },
      {
        id: '5-chance', kind: 'chance', name: 'Likely or unlikely by chance?',
        desc: 'Coins, dice and cards: could this easily happen just by chance?',
        speech: 'Could this easily happen just by chance?',
        help: {
          title: 'Likely or unlikely by chance?',
          html: `<ul>
            <li>Some things happen by chance <strong>all the time</strong>: 6 heads in 10 flips of a coin.</li>
            <li>Others <strong>hardly ever</strong> happen by chance: 20 heads in a row, or a six on every
                one of 10 rolls of a die.</li>
            <li>No calculating needed — just ask: would I be surprised if this happened?</li>
          </ul>`,
        },
      },
      {
        id: '5-h0chance', kind: 'h0chance', name: 'Keep or reject H0? Coins and dice',
        desc: 'The same events, with a null hypothesis: is the coin fair?',
        speech: 'If H0 were true, would this happen by chance? Then keep it or reject it.',
        help: {
          title: 'Keeping or rejecting H0',
          html: `<ul>
            <li>H0 here is that the coin (or die) is <strong>fair</strong>.</li>
            <li>Ask: <strong>if H0 were true</strong>, would results like these happen by chance?</li>
            <li>If they'd happen all the time — <strong>keep H0</strong>. There's no reason to doubt it.</li>
            <li>If they'd hardly ever happen — <strong>reject H0</strong>. A fair coin almost never gives
                20 heads in a row, so we stop believing the coin is fair.</li>
          </ul>`,
        },
      },
      {
        id: '5-h0subject', kind: 'h0subject', name: 'Keep or reject H0? Your subject',
        desc: 'The same reasoning, on an experiment from your subject.',
        speech: 'If the IV made no difference, would results like these happen by chance?',
        help: () => {
          const r = exRelation();
          return {
            title: 'H0 in a real experiment',
            html: `<ul>
              <li>In an experiment, H0 is that the independent variable makes <strong>no
                  difference</strong>: <em>Changing ${r.ivNP || r.iv} has no effect on ${r.dvNP || r.dv}.</em></li>
              <li>If H0 were true, each trial would be like a coin flip: the result would go up or down
                  by chance.</li>
              <li>So nearly every trial going the same way is like getting heads almost every time —
                  it would hardly ever happen by chance. <strong>Reject H0.</strong></li>
              <li>A near-even split is what chance gives all the time. <strong>Keep H0.</strong></li>
            </ul>`,
          };
        },
      },
      {
        id: '5-five', kind: 'five', name: 'The 5% line',
        desc: 'Below 1 in 20, reject H0. Above it, keep it.',
        speech: 'Rarer than 1 in 20 by chance? Then reject H0.',
        help: {
          title: 'The 5% rule',
          html: `<ul>
            <li>How unlikely is unlikely enough? The usual rule is <strong>5%</strong>: 1 time in 20.</li>
            <li>If H0 were true and results like ours would happen by chance <strong>less often than
                1 time in 20</strong>, we reject H0 and call the effect <strong>significant</strong>.</li>
            <li>If they'd happen <strong>more often than that</strong>, we keep H0: the effect is not
                significant.</li>
            <li>No calculating — just compare. 1 in 100 is rarer than 1 in 20: reject. 1 in 4 is far more
                often: keep.</li>
          </ul>`,
        },
      },
      {
        id: '5-errors', kind: 'errors', name: 'Which error?',
        desc: 'Type 1 error, Type 2 error, or the correct conclusion?',
        speech: 'Compare reality with what the experiment found.',
        help: {
          title: 'Type 1 and Type 2 errors',
          html: `<ul>
            <li>An experiment can reach the wrong conclusion, because there's always some chance of a
                misleading result.</li>
            <li><strong>Type 1 error</strong>: the experiment finds an effect, but in reality there isn't
                one. H0 was true but was rejected — a <strong>false alarm</strong>.</li>
            <li><strong>Type 2 error</strong>: there really is an effect, but the experiment doesn't find
                it. H0 was false but was kept — a <strong>miss</strong>.</li>
            <li>Finding a real effect, or finding nothing when there's nothing there, is correct.</li>
          </ul>`,
        },
      },
      {
        id: '5-falsealarm', kind: 'falseAlarm', name: 'False alarms',
        desc: 'Test enough things and something will look significant by chance.',
        speech: 'Convincing, or could it easily be a false alarm?',
        help: {
          title: 'False alarms',
          html: `<ul>
            <li>The 5% rule has a price. Even when H0 is true, results this unlikely still turn up by
                chance <strong>about 1 time in 20</strong>. Each time, that's a false alarm — a Type 1
                error.</li>
            <li>So test 20 things that really have no effect, and you'd expect about
                <strong>one</strong> to come out significant anyway — like the jelly beans in the
                cartoon from the lecture.</li>
            <li>One significant result among many tests is <strong>weak evidence</strong>. A result that
                was predicted in advance, or found again in a new study, is <strong>convincing</strong>.</li>
          </ul>`,
        },
      },
    ],
  },
];

// A stray comma between two levels leaves an empty slot in LEVELS, and the
// level select then dies on it with nothing on screen. Say so plainly.
if (LEVELS.some(level => !level)) console.error('LEVELS has an empty slot: look for ",," between two levels in levels.js');
