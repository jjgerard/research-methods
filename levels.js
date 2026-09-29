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
const LEVELS = [
  {
    n: 1, title: 'Variables',
    blurb: 'What counts as a variable, which one changes the other, and what that looks like on a graph.',
    intro: 'Each sub-level asks one kind of question. Get 10 in a row to finish it and unlock the next.',
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
            <li>Get <strong>10 in a row</strong> to finish. A wrong answer starts the run again,
                and tells you why.</li>
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
    intro: 'Each sub-level asks one kind of question. Get 10 in a row to finish it and unlock the next.',
    subs: [
      {
        id: '2-validity', kind: 'validity', name: 'Valid? Reliable?',
        desc: 'Short descriptions of how something is measured. Is it valid, and is it reliable?',
        speech: 'Two questions each time: does it measure the right thing, and would it give the same result again?',
        help: {
          title: 'Validity and reliability',
          html: `<ul>
            <li>A measure is <strong>valid</strong> if it measures <strong>what it's meant to
                measure</strong>. Measuring head size to find out how intelligent someone is
                isn't valid — it's measuring something else.</li>
            <li>A measure is <strong>reliable</strong> if it gives <strong>the same result when
                it's done again</strong>. A tape measure round the same head gives the same
                number every time, so it's reliable — even though it isn't valid.</li>
            <li>They're separate questions. A design can have both, either one, or neither.</li>
            <li>Answer both, then press <strong>Check</strong>. Both have to be right to count.</li>
          </ul>`,
        },
      },
      {
        id: '2-hyp', kind: 'hypotheses', name: 'Hypotheses',
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
        id: '2-hyp-null', kind: 'hypotheses', withNull: true, name: 'Hypotheses with the null',
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
            <li>A <strong>continuous</strong> variable can take <strong>any value</strong> on
                its scale, including every value in between: 172 cm, 172.5 cm, 172.55 cm...</li>
            <li>A <strong>discrete</strong> variable only comes in <strong>separate
                values</strong>, with nothing in between: you can have 2 siblings or 3, but
                not 2.5.</li>
            <li>A quick test: can you sensibly add another decimal place? Then it's continuous.
                If the values are counted, it's discrete.</li>
          </ul>`,
        },
      },
      {
        id: '2-noir', kind: 'classify', name: 'Levels of measurement',
        desc: 'Nominal, ordinal, interval or ratio? You can make 2 mistakes per run.',
        question: 'What level of measurement is this?',
        categories: [
          { value: 'nominal', label: 'Nominal' },
          { value: 'ordinal', label: 'Ordinal' },
          { value: 'interval', label: 'Interval' },
          { value: 'ratio', label: 'Ratio' },
        ],
        items: MEASUREMENT_ITEMS,
        allowedMisses: 2,
        speech: 'Nominal, ordinal, interval or ratio? You have two hearts: two mistakes won\'t reset your run.',
        help: {
          title: 'Levels of measurement',
          html: `<ul>
            <li><strong>Nominal</strong>: categories with no order. <em>First language,
                eye colour.</em></li>
            <li><strong>Ordinal</strong>: the values are in order, but the gaps between them
                aren't equal. <em>1st, 2nd, 3rd in a race.</em></li>
            <li><strong>Interval</strong>: equal gaps, but no true zero. <em>Temperature in
                °C</em> — 0°C isn't "no temperature", so 20°C isn't twice as hot as 10°C.</li>
            <li><strong>Ratio</strong>: equal gaps <em>and</em> a true zero, so "twice as
                much" makes sense. <em>Reaction time</em> — 400 ms is twice 200 ms.</li>
            <li>Four choices makes this harder, so you get <strong>two hearts</strong> per run:
                a mistake costs points and a heart, but your run carries on. Lose a third time
                and the run starts again.</li>
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
        id: '2-withinbetween', kind: 'classify', name: 'Within or between subjects?',
        desc: 'Does everyone take part in every condition, or only one?',
        question: 'Is this a within-subjects or a between-subjects design?',
        categories: [{ value: 'within', label: 'Within subjects' }, { value: 'between', label: 'Between subjects' }],
        items: DESIGN_ITEMS,
        speech: 'Same people in every condition, or different people in each?',
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
          </ul>`,
        },
      },
    ],
  },
];
