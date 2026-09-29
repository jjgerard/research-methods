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
    intro: 'Each sub-level asks one kind of question. Get 10 in a row to finish it and unlock the next. You have two hearts per run, so two mistakes won\'t reset it.',
    subs: [
      {
        id: '1a', kind: 'classify', name: 'Variable or not?',
        question: 'Is this a variable?',
        categories: [{ value: 'var', label: 'Variable' }, { value: 'not', label: 'Not a variable' }],
        items: SORT_ITEMS.map(i => ({ ...i, cat: i.variable ? 'var' : 'not' })),
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
        help: {
          title: 'Changer and change-ee',
          html: `<ul>
            <li>When two variables are related, it usually <strong>isn't an equal relationship</strong>:
                one of them changes the other.</li>
            <li>The <strong>changer</strong> causes the change. The <strong>change-ee</strong>
                gets changed.</li>
            <li><em>As time goes on, children learn more words:</em> time is the changer,
                vocabulary is the change-ee. That's the <strong>forwards</strong> relation.</li>
            <li>The <strong>backwards</strong> relation — learning words makes time pass — doesn't
                make sense. Checking the backwards version is a good test.</li>
            <li>Read carefully: the changer isn't always mentioned first.</li>
          </ul>`,
        },
      },
      {
        id: '1c', kind: 'roles', terms: 'formal', name: 'Independent and dependent',
        desc: 'The same question, with the proper names.',
        speech: 'Same question, proper names: which is the independent variable, and which is the dependent?',
        help: {
          title: 'New names for what you already know',
          html: `<ul>
            <li>The <strong>changer</strong> has a proper name: the
                <strong>independent variable</strong> (IV). It causes the change.</li>
            <li>The <strong>change-ee</strong> is the <strong>dependent variable</strong> (DV).
                It gets changed — its value <em>depends on</em> the independent variable.</li>
            <li>Time causes the change in vocabulary, so time is the IV and vocabulary is
                the DV.</li>
            <li>Same statements as before, same thinking. Only the names are new.</li>
          </ul>`,
        },
      },
      {
        id: '1d', kind: 'graph', name: 'Match the graph',
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
    intro: 'Each sub-level asks one kind of question. Get 10 in a row to finish it and unlock the next (5 for the hypothesis and cross-sectional/longitudinal sub-levels). You have two hearts per run, so two mistakes won\'t reset it.',
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
        id: '2-hyp', kind: 'hypotheses', target: 5, name: 'Hypotheses',
        desc: 'A research question and four hypotheses. Which two oppose each other?',
        speech: 'Pick the two opposing hypotheses: same cause and effect as the question, opposite directions.',
        help: {
          title: 'Hypotheses',
          html: `<ul>
            <li>A <strong>research question</strong> asks whether one variable affects
                another: <em>Does word frequency affect reading time?</em></li>
            <li>A <strong>hypothesis</strong> is a possible answer that can be tested:
                <em>Increasing word frequency decreases reading time.</em></li>
            <li><strong>Opposing hypotheses</strong> keep the same cause and effect as the
                question — the same independent and dependent variable — and predict opposite
                directions: one says the DV goes up, the other says it goes down.</li>
            <li>Watch for hypotheses that are <strong>backwards</strong>: they have the
                dependent variable doing the changing, like the backwards graphs in Level 1.</li>
            <li>Tap two, then press <strong>Check</strong>.</li>
          </ul>`,
        },
      },
      {
        id: '2-hyp-null', kind: 'hypotheses', target: 5, withNull: true, name: 'Hypotheses with the null',
        desc: 'Six hypotheses now. Pick the two opposing ones and the null.',
        speech: 'Pick three: the two opposing hypotheses, and the null hypothesis.',
        help: {
          title: 'The null hypothesis',
          html: `<ul>
            <li>As well as the two opposing hypotheses, there's always a third possibility:
                the independent variable makes <strong>no difference at all</strong>.</li>
            <li>That's the <strong>null hypothesis</strong>: <em>Changing word frequency has
                no effect on reading time.</em></li>
            <li>The null keeps the same direction of cause as the question, too. "Changing
                reading time has no effect on word frequency" is backwards.</li>
            <li>Tap three, then press <strong>Check</strong>.</li>
          </ul>`,
        },
      },
      {
        id: '2-contdisc', kind: 'classify', name: 'Continuous or discrete?',
        desc: 'Can it take any value, or only separate ones?',
        question: 'Is this variable continuous or discrete?',
        categories: [{ value: 'cont', label: 'Continuous' }, { value: 'disc', label: 'Discrete' }],
        items: CONTINUITY_ITEMS,
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
        items: MEASUREMENT_ITEMS,
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
        id: '2-crosslong', kind: 'design', target: 5, name: 'Cross-sectional or longitudinal?',
        desc: 'A snapshot, or one group followed over time? Then name the IV and DV in your own words.',
        items: CROSSLONG_SINGLE,
        ...CROSSLONG_SHARED,
        choices: CROSSLONG_CHOICES.slice(0, 2),
        choiceQuestion: 'Is this design <strong>cross-sectional</strong> or <strong>longitudinal</strong>?',
        speech: 'Snapshot or over time? Then type the IV and the DV in your own words.',
        help: {
          title: 'Cross-sectional and longitudinal',
          html: `<ul>
            <li>A <strong>cross-sectional</strong> design is a <strong>snapshot</strong>: how do
                two or more groups differ at one point in time? <em>Measure 2-year-olds and
                4-year-olds in the same week.</em></li>
            <li>A <strong>longitudinal</strong> design takes <strong>repeated measures from the same
                group over time</strong>: how does a group change? <em>Measure the same children
                at 6, 12, 18 and 24 months.</em> Following one group like this is a
                <strong>cohort design</strong>.</li>
            <li>Then type the <strong>independent variable</strong> and the <strong>dependent
                variable</strong> in your own words. In a cross-sectional design the IV is usually
                the grouping; in a longitudinal one, it's time.</li>
            <li>You'll see how your answer was read ("Read as: age group") before it's marked.
                If it could mean two things, you'll be asked which.</li>
          </ul>`,
        },
      },
      {
        id: '2-crosslong-multi', kind: 'design', target: 5, name: 'Two factors',
        desc: 'Cross-sectional or longitudinal again, but now each design has two independent variables.',
        items: CROSSLONG_MULTI,
        ...CROSSLONG_SHARED,
        choices: CROSSLONG_CHOICES.slice(0, 2),
        choiceQuestion: 'Is this design <strong>cross-sectional</strong> or <strong>longitudinal</strong>?',
        speech: 'Snapshot or over time? Then find BOTH independent variables, and the DV.',
        help: {
          title: 'Two factors',
          html: `<ul>
            <li>A design can have <strong>more than one factor</strong> — more than one
                independent variable.</li>
            <li><em>Monolingual and bilingual children aged 3 and 5, tested in the same week</em>:
                still a snapshot, so still <strong>cross-sectional</strong>, but with two IVs —
                language background and age group.</li>
            <li><em>The same children tested on nouns and verbs at 18, 24 and 30 months</em>:
                still one group over time, so still <strong>longitudinal</strong>, with two IVs —
                age and word type.</li>
            <li>First choose the design. Then type <strong>both</strong> independent variables,
                in either order, and then the dependent variable.</li>
          </ul>`,
        },
      },
      {
        id: '2-crosslong-both', kind: 'design', target: 5, name: 'Both: panel designs',
        desc: 'Several groups, each followed over time. Plus some from before, so choose carefully.',
        items: CROSSLONG_PART3,
        ...CROSSLONG_SHARED,
        choices: CROSSLONG_CHOICES,
        choiceQuestion: 'Is this design <strong>cross-sectional</strong>, <strong>longitudinal</strong>, or <strong>both</strong>?',
        speech: 'Snapshot, over time, or both? Then type the IVs and the DV.',
        help: {
          title: 'Both: panel designs',
          html: `<ul>
            <li>A <strong>panel design</strong> is cross-sectional and longitudinal at once:
                <strong>several groups</strong>, each <strong>followed over time</strong>.</li>
            <li><em>Classes taught with methods A, B and C, each tested before teaching, after
                year 1 and after year 2.</em> The groups make it cross-sectional; the repeated
                testing makes it longitudinal.</li>
            <li>So a panel design always has at least <strong>two independent variables</strong>:
                which group, and when.</li>
            <li>Not every design here is a panel design — some are from the last two parts. Check
                for both things: different groups <em>and</em> repeated testing.</li>
          </ul>`,
        },
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
        id: '2-withinbetween', kind: 'design', name: 'Within or between subjects?',
        desc: 'Name the IV in your own words, say whether it\'s within or between subjects, then name the DV.',
        items: DESIGN_ITEMS,
        steps: ['iv', 'choice', 'dv'],
        choiceQuestion: 'Is this a <strong>within-subjects</strong> or a <strong>between-subjects</strong> design?',
        choices: [{ value: 'within', label: 'Within subjects' }, { value: 'between', label: 'Between subjects' }],
        choiceWhy: {
          within: 'The same people take part in every condition, so each person is compared with themselves.',
          between: 'Each person is in only one condition, so different groups of people are compared.',
        },
        speech: 'Type the IV in your own words, decide within or between, then type the DV.',
        help: {
          title: 'Within or between subjects?',
          html: `<ul>
            <li>In a <strong>within-subjects</strong> design, <strong>the same people</strong>
                take part in every condition. Each person reads both the active and the passive
                sentences, so each person is compared with themselves.</li>
            <li>In a <strong>between-subjects</strong> design, each person takes part in
                <strong>only one condition</strong>. One group reads active sentences and a
                different group reads passive ones.</li>
            <li>Ask: does any one person experience more than one condition?</li>
            <li>Each question has three steps. First <strong>type the independent
                variable</strong> in your own words — whatever differs between the
                conditions. Then choose within or between. Then <strong>type the dependent
                variable</strong> — whatever gets measured.</li>
            <li>You'll see how your answer was read ("Read as: font size") before it's marked.
                If it could mean two things, you'll be asked which.</li>
          </ul>`,
        },
      },
    ],
  },
  {
    n: 3, title: 'Factorial designs and interactions',
    blurb: 'How big is a design, and what does a graph of it show: main effects, an interaction, both or neither?',
    intro: 'Every design and graph here is generated fresh, so there\'s nothing to memorise, only things to read. Get 10 in a row to finish each sub-level; you have two hearts per run.',
    subs: [
      {
        id: '3-box', kind: 'box', name: 'What by what?',
        desc: 'Read the size of a design from its box notation.',
        speech: 'Count the levels of each factor. What by what?',
        help: {
          title: 'Factorial designs',
          html: `<ul>
            <li>A <strong>factorial design</strong> has more than one factor (independent
                variable), and every level of one is combined with every level of the other.</li>
            <li>The design is named by <strong>how many levels each factor has</strong>. Prime
                (passive, active, silence) × Priming context (speaking, listening) is a
                <strong>3×2 design</strong>, with 3 × 2 = 6 conditions.</li>
            <li>Either order is fine: a 3×2 design is also a 2×3 design.</li>
            <li>Tap the two numbers, then <strong>Check</strong>.</li>
          </ul>`,
        },
      },
      {
        id: '3-bars', kind: 'barDims', name: 'What by what? From a graph',
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
        id: '3-effects', kind: 'effects', name: 'Main effects and interactions',
        desc: 'Is there a main effect of A? Of B? An interaction?',
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
    intro: 'Each sub-level asks one kind of question. Get 10 in a row to finish it and unlock the next. You have two hearts per run, so two mistakes won\'t reset it.',
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
        id: '4-variation', kind: 'variation', name: 'Which varies more?',
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
        id: '4-sigma', kind: 'sigma', name: 'Which arrow is σ?',
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
        id: '4-heightz', kind: 'heightZ', name: 'Standard deviations: heights',
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
        id: '4-ratingz', kind: 'ratingZ', name: 'Standard deviations: ratings',
        desc: 'The same on a 1–7 rating scale, with a different participant each time.',
        speech: 'Every participant has their own mean and σ. Tap the rating for that z.',
        help: {
          title: 'z-scores for ratings',
          html: `<ul>
            <li>Participants use a rating scale differently: some are harsh, some lenient, some
                use the whole scale and some only the middle.</li>
            <li>So each participant has their <strong>own mean and σ</strong>, and their own way
                the 1–7 scale lines up with the z-scale underneath it.</li>
            <li>z = +1 for a lenient participant might be a 7; for a harsh one, a 4.</li>
            <li>Tap the rating that matches the z you're given, for this participant.</li>
          </ul>`,
        },
      },
      {
        id: '4-skew', kind: 'skew', name: 'Normal or skewed?',
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
];

// A stray comma between two levels leaves an empty slot in LEVELS, and the
// level select then dies on it with nothing on screen. Say so plainly.
if (LEVELS.some(level => !level)) console.error('LEVELS has an empty slot: look for ",," between two levels in levels.js');
