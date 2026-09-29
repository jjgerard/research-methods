// ---------------------------------------------------------------------------
// Level 2 -- research design fundamentals. Like data.js: everything asked,
// and why each answer is right. The hypothesis sub-levels reuse RELATIONS
// from Level 1, so they aren't here.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 2a. Validity and reliability.
//
// Validity: does it measure what it's meant to measure?
// Reliability: would it give the same result if it were done again?
//
// Four of each combination. The "reliable but not valid" ones are the
// important ones: a measure can be perfectly consistent and still be
// measuring the wrong thing (head size for intelligence). The "valid but
// not reliable" ones follow the dartboard picture -- aimed at the right
// thing, but scattered -- and each is unreliable for a reason a student can
// point to: one rater, one trial, a hand-held stopwatch.
// ---------------------------------------------------------------------------
const VALIDITY_ITEMS = [
  // valid and reliable
  { valid: true, reliable: true,
    text: 'To measure children\'s vocabulary, researchers show each child 100 pictures and count how many they can name. When the same children are tested again a week later, their scores are almost identical.',
    whyValid: 'naming pictures is a direct test of which words a child knows.',
    whyReliable: 'the same children got almost the same scores a week later.' },
  { valid: true, reliable: true,
    text: 'To measure reading time, a computer records the milliseconds between a sentence appearing and the reader pressing a button. Running the same sentences with the same readers gives very similar times.',
    whyValid: 'the time between a sentence appearing and the button press is exactly how long it took to read.',
    whyReliable: 'running it again gives very similar times.' },
  { valid: true, reliable: true,
    text: 'To measure how fast people speak, researchers record them and count the syllables per second. Two researchers who count the same recordings separately get the same numbers.',
    whyValid: 'syllables per second is a direct measure of speaking speed.',
    whyReliable: 'two people counting separately get the same result.' },
  { valid: true, reliable: true,
    text: 'Researchers measure spelling ability with a 50-word spelling test. Students who take it twice, a few days apart, get nearly the same score both times.',
    whyValid: 'a spelling test measures spelling.',
    whyReliable: 'taking it twice gives nearly the same score.' },

  // reliable, not valid
  { valid: false, reliable: true,
    text: 'To measure intelligence, researchers measure the distance around each person\'s head. The tape measure gives the same result every time.',
    whyValid: 'head size isn\'t a measure of intelligence — it measures something else entirely.',
    whyReliable: 'measuring the same head gives the same number every time. Consistent, but consistently measuring the wrong thing.' },
  { valid: false, reliable: true,
    text: 'To measure how well students understand a novel, researchers count how many pages each student has read. The page counts come out exactly the same whoever does the counting.',
    whyValid: 'pages read isn\'t understanding — a student can read every page and understand little.',
    whyReliable: 'anyone who counts gets the same number.' },
  { valid: false, reliable: true,
    text: 'To measure how fluent someone\'s second language is, researchers record how many years they have lived abroad. People give the same number every time they\'re asked.',
    whyValid: 'years abroad isn\'t fluency — people can live abroad for years without speaking the language much.',
    whyReliable: 'the number is the same every time.' },
  { valid: false, reliable: true,
    text: 'To measure how much children enjoy reading, researchers count the books in their school library. The count is the same every time it\'s done.',
    whyValid: 'the size of the library says nothing about how much any one child enjoys reading.',
    whyReliable: 'counting the library again gives the same number.' },

  // valid, not reliable
  { valid: true, reliable: false,
    text: 'To measure how acceptable a sentence sounds, researchers ask one person to rate it once. When the same person rates the same sentence the next day, they often give a very different score.',
    whyValid: 'asking people how acceptable a sentence sounds is the right thing to ask.',
    whyReliable: 'the same person gives different ratings on different days, so a single rating can\'t be trusted.' },
  { valid: true, reliable: false,
    text: 'To measure reaction time, a researcher uses a hand-held stopwatch while watching each participant press a button. The same response gets quite different times depending on how alert the researcher is.',
    whyValid: 'timing how long someone takes to respond is the right thing to measure.',
    whyReliable: 'the times depend on the researcher\'s thumb, not just on the participant.' },
  { valid: true, reliable: false,
    text: 'To measure how well learners pronounce English vowels, one untrained listener rates each recording. When the same recordings are played again later, the listener\'s ratings change a lot.',
    whyValid: 'rating pronunciation is the right way to get at pronunciation.',
    whyReliable: 'the same recording gets a different rating each time.' },
  { valid: true, reliable: false,
    text: 'To measure vocabulary, researchers ask each child to name just two pictures. A child who names both on one day often names neither the next.',
    whyValid: 'naming pictures does test word knowledge.',
    whyReliable: 'two pictures is far too few — the score swings from day to day on luck alone.' },

  // neither
  { valid: false, reliable: false,
    text: 'To measure how good people are at learning languages, researchers ask them to guess a number between 1 and 100. People guess a different number every time they\'re asked.',
    whyValid: 'a random guess has nothing to do with language-learning ability.',
    whyReliable: 'people give a different number every time.' },
  { valid: false, reliable: false,
    text: 'To measure children\'s grammar, researchers note what colour T-shirt each child wears on test day. Children wear different colours on different days.',
    whyValid: 'a T-shirt colour has nothing to do with grammar.',
    whyReliable: 'the same child gets a different "score" every day.' },
  { valid: false, reliable: false,
    text: 'To measure how stressful an exam is, researchers record the weather outside the exam hall. The weather is different every time the same exam is sat.',
    whyValid: 'the weather isn\'t a measure of how stressful the exam is.',
    whyReliable: 'the same exam gets a different result every sitting.' },
  { valid: false, reliable: false,
    text: 'To measure reading ability, researchers time how long each child takes to walk to the library. The same child\'s time varies a lot from day to day.',
    whyValid: 'walking speed isn\'t reading ability.',
    whyReliable: 'the same child gets very different times on different days.' },
];

// ---------------------------------------------------------------------------
// 2d. Continuous or discrete.
//
// Continuous: any value on a scale, including every value in between.
// Discrete: separate values, with nothing in between -- you can't have
// 2.5 siblings.
//
// Only numeric variables here. Categories (first language, handedness) are
// discrete too, but they're 2e's business as nominal variables, and mixing
// them in here would make this a question about numbers vs words instead.
// ---------------------------------------------------------------------------
const CONT = 'It can take any value on a scale, including every value in between — ';
const DISC = 'It only comes in separate values, with nothing in between — ';
const CONTINUITY_ITEMS = [
  { cat: 'cont', label: 'height', why: CONT + '172 cm, 172.5 cm, 172.55 cm...' },
  { cat: 'cont', label: 'weight', why: CONT + 'however precisely you weigh something, there\'s always a value between two others.' },
  { cat: 'cont', label: 'reaction time', why: CONT + '412 ms, 412.3 ms... time can always be divided further.' },
  { cat: 'cont', label: 'reading time', why: CONT + 'time can always be measured more finely.' },
  { cat: 'cont', label: 'temperature', why: CONT + '20°C, 20.5°C, 20.51°C...' },
  { cat: 'cont', label: 'age', why: CONT + 'we usually round it to whole years, but someone can be 7 years, 3 months and 2 days old.' },
  { cat: 'cont', label: 'speech rate (syllables per second)', why: CONT + '4.2, 4.25, 4.3 syllables per second...' },
  { cat: 'cont', label: 'distance travelled to school', why: CONT + 'distance can always be measured more finely.' },
  { cat: 'cont', label: 'vowel duration', why: CONT + 'a vowel can last 83 ms, 83.4 ms, 83.42 ms...' },
  { cat: 'cont', label: 'pitch of a speaker\'s voice', why: CONT + 'pitch in hertz can be any value — 180 Hz, 180.6 Hz...' },
  { cat: 'cont', label: 'loudness of background noise', why: CONT + 'decibels can be any value on the scale.' },
  { cat: 'cont', label: 'time spent studying', why: CONT + 'you can study for 2 hours, 2.5 hours, 2 hours and 31 minutes...' },

  { cat: 'disc', label: 'number of siblings', why: DISC + 'you can have 2 siblings or 3, but not 2.5.' },
  { cat: 'disc', label: 'number of errors', why: DISC + 'errors are counted: 4 or 5, never 4.3.' },
  { cat: 'disc', label: 'number of words a child knows', why: DISC + 'words are counted one by one.' },
  { cat: 'disc', label: 'number of books at home', why: DISC + 'books are counted in whole numbers.' },
  { cat: 'disc', label: 'number of syllables in a word', why: DISC + 'a word has 2 or 3 syllables, not 2.7.' },
  { cat: 'disc', label: 'number of participants in a study', why: DISC + 'people are counted in whole numbers.' },
  { cat: 'disc', label: 'number of letters in a word', why: DISC + 'a word has 5 letters or 6, nothing in between.' },
  { cat: 'disc', label: 'rating on a 1–7 scale', why: DISC + 'people choose 1, 2, 3... 7, and there\'s no 4.5 on the scale.' },
  { cat: 'disc', label: 'number of languages someone speaks', why: DISC + 'you speak 2 languages or 3 — they\'re counted.' },
  { cat: 'disc', label: 'number of times a word appears in a text', why: DISC + 'each appearance is counted once.' },
  { cat: 'disc', label: 'number of children in a class', why: DISC + 'children are counted in whole numbers.' },
  { cat: 'disc', label: 'number of questions answered correctly', why: DISC + 'each question is either right or not, so the total is a whole number.' },
];

// ---------------------------------------------------------------------------
// 2e. Levels of measurement.
//
// Rating scales are treated as ordinal throughout. There's a long argument
// about treating them as interval, but nothing guarantees the step from 3
// to 4 is the same size as the step from 6 to 7, and ordinal is the answer
// a first course gives.
//
// Temperature appears three times on purpose: °C and °F are interval (zero
// is arbitrary), kelvin is ratio (zero really is no heat). It's the clearest
// case there is of the SAME thing measured at two different levels.
// ---------------------------------------------------------------------------
const NOM = 'Nominal: the values are just categories with no order. ';
const ORD = 'Ordinal: the values have an order, but the gaps between them aren\'t equal. ';
const INT = 'Interval: equal gaps between values, but no true zero. ';
const RAT = 'Ratio: equal gaps AND a true zero, so "twice as much" makes sense. ';
const MEASUREMENT_ITEMS = [
  { cat: 'nominal', label: 'first language', why: NOM + 'Polish isn\'t more or less than Irish, just different.' },
  { cat: 'nominal', label: 'eye colour', why: NOM + 'Blue, brown and green have no order.' },
  { cat: 'nominal', label: 'handedness (left or right)', why: NOM + 'Left isn\'t more than right.' },
  { cat: 'nominal', label: 'country of birth', why: NOM + 'Countries can be counted up, but not put in order.' },
  { cat: 'nominal', label: 'word class (noun, verb, adjective)', why: NOM + 'A verb isn\'t more than a noun.' },
  { cat: 'nominal', label: 'which experimental group someone is in', why: NOM + 'Group A and group B are labels, not amounts.' },
  { cat: 'nominal', label: 'dialect region', why: NOM + 'Ulster English isn\'t more or less than Scottish English, just different.' },
  { cat: 'nominal', label: 'type of school (state, grammar, private)', why: NOM + 'These are kinds of school, not amounts of school.' },

  { cat: 'ordinal', label: 'finishing position in a race (1st, 2nd, 3rd)', why: ORD + 'The gap between 1st and 2nd could be a second; between 2nd and 3rd, a minute.' },
  { cat: 'ordinal', label: 'agreement from "strongly disagree" to "strongly agree"', why: ORD + 'The answers are in order, but nothing says the steps are the same size.' },
  { cat: 'ordinal', label: 'language proficiency level (A1 to C2)', why: ORD + 'C1 is above B2, but the levels aren\'t equal-sized steps.' },
  { cat: 'ordinal', label: 'degree classification (First, 2:1, 2:2, Third)', why: ORD + 'They\'re ranked, but a First isn\'t "one more" than a 2:1 in any measurable way.' },
  { cat: 'ordinal', label: 'T-shirt size (S, M, L, XL)', why: ORD + 'In order, but the jump from S to M needn\'t match the jump from L to XL.' },
  { cat: 'ordinal', label: 'ranking sentences from most to least natural', why: ORD + 'A ranking gives the order, not how far apart the sentences are.' },
  { cat: 'ordinal', label: 'highest qualification (GCSE, A-level, degree)', why: ORD + 'The qualifications are in order, but not equally spaced.' },
  { cat: 'ordinal', label: 'acceptability rating on a 1–7 scale', why: ORD + 'The numbers are in order, but nothing guarantees the step from 3 to 4 equals the step from 6 to 7.' },

  { cat: 'interval', label: 'temperature in °C', why: INT + '0°C isn\'t "no temperature", so 20°C isn\'t twice as hot as 10°C.' },
  { cat: 'interval', label: 'temperature in °F', why: INT + '0°F is just a point on the scale, not an absence of heat.' },
  { cat: 'interval', label: 'calendar year (e.g. 1998, 2024)', why: INT + 'The gap between years is equal, but year 0 isn\'t the beginning of time, so 2000 isn\'t "twice" 1000.' },
  { cat: 'interval', label: 'time of day on a clock', why: INT + 'The minutes are equal, but midnight isn\'t "no time", so 4 o\'clock isn\'t twice 2 o\'clock.' },

  { cat: 'ratio', label: 'reaction time in milliseconds', why: RAT + '0 ms is no time at all, and 400 ms is twice 200 ms.' },
  { cat: 'ratio', label: 'height in cm', why: RAT + '0 cm is no height, and 180 cm is twice 90 cm.' },
  { cat: 'ratio', label: 'number of words known', why: RAT + '0 words is none at all, and 2,000 words is twice 1,000.' },
  { cat: 'ratio', label: 'number of errors', why: RAT + 'Zero errors means none, and 6 errors is twice 3.' },
  { cat: 'ratio', label: 'age in years', why: RAT + 'Age 0 is the start, and a 40-year-old is twice as old as a 20-year-old.' },
  { cat: 'ratio', label: 'temperature in kelvin', why: RAT + 'Unlike °C, 0 kelvin really is no heat at all — so 200 K is twice 100 K.' },
  { cat: 'ratio', label: 'reading time in seconds', why: RAT + '0 seconds is no time, and 10 seconds is twice 5.' },
  { cat: 'ratio', label: 'income in pounds', why: RAT + '£0 is no income, and £40,000 is twice £20,000.' },
];

// ---------------------------------------------------------------------------
// 2f. Confounds.
//
// Half the designs have one, half don't. The two halves are mostly the same
// studies, done badly and then done properly, so the difference between a
// confounded design and a controlled one is the only thing that changes.
//
// `vars` is the list offered after a correct "yes": the IV and DV are always
// in it (they're the commonest wrong answer, and get their own explanation),
// plus the confound and one more thing from the description that doesn't
// differ between the groups.
// ---------------------------------------------------------------------------
const CONFOUND_ITEMS = [
  { iv: 'background music', dv: 'reading speed', confound: 'time of day',
    vars: ['background music', 'reading speed', 'time of day', 'the texts they read'],
    text: 'Researchers want to know whether background music affects reading speed. One group reads with music at 9am; another group reads the same texts in silence at 9pm, after a full day of classes.',
    why: 'The music group also read in the morning, and the silent group late at night when they were tired. Any difference could come from the time of day, not the music.' },
  { iv: 'using the app', dv: 'number of words known', confound: 'age',
    vars: ['using the app', 'number of words known', 'age', 'length of the term'],
    text: 'To test a new vocabulary app, researchers give it to a class of 15-year-olds and compare them with a class of 10-year-olds who don\'t use it. At the end of term, the app users know more words.',
    why: 'The app users are also five years older, and older children know more words anyway.' },
  { iv: 'font size', dv: 'reading time', confound: 'sentence length',
    vars: ['font size', 'reading time', 'sentence length', 'the room they read in'],
    text: 'Researchers test whether font size affects reading time, with everyone reading in the same room. All the large-font sentences are short, and all the small-font sentences are long.',
    why: 'Long sentences take longer to read whatever the font, so a difference could come from sentence length rather than font size.' },
  { iv: 'sleep', dv: 'words remembered', confound: 'the teacher',
    vars: ['sleep', 'words remembered', 'the teacher', 'the words taught'],
    text: 'Researchers test whether sleeping after learning helps people remember new words. Both groups learn the same words, but the sleep group is taught by an experienced teacher and the stay-awake group by a trainee on their first day.',
    why: 'The sleep group also had the better teacher, so they might remember more because of the teaching, not the sleep.' },
  { iv: 'caffeine', dv: 'reaction time', confound: 'noise',
    vars: ['caffeine', 'reaction time', 'noise', 'the reaction task'],
    text: 'To see whether caffeine speeds up reactions, one group drinks coffee and another drinks water, then both do the same reaction task. The coffee group is tested in a quiet lab; the water group in a noisy corridor.',
    why: 'The water group was also tested in noise, which could slow anyone down. The difference might be the noise, not the caffeine.' },
  { iv: 'speaking two languages', dv: 'attention score', confound: 'type of school',
    vars: ['speaking two languages', 'attention score', 'type of school', 'the attention task'],
    text: 'Researchers compare the attention scores of bilingual and monolingual children on the same task. All the bilingual children go to one private school, and all the monolingual children go to state schools.',
    why: 'The bilingual children also all go to a private school. Any difference in attention could come from their schooling rather than from speaking two languages.' },
  { iv: 'word frequency', dv: 'reading time', confound: 'word length',
    vars: ['word frequency', 'reading time', 'word length', 'the readers\' age'],
    text: 'To test whether word frequency affects reading time, researchers ask adults of the same age to read common words that are all short and rare words that are all long.',
    why: 'The rare words are also the long ones, and long words take longer to read. The difference could be length, not frequency.' },
  { iv: 'the reading programme', dv: 'spelling score', confound: 'motivation',
    vars: ['the reading programme', 'spelling score', 'motivation', 'the spelling test'],
    text: 'To test whether a summer reading programme improves spelling, researchers compare students who volunteered for it with students who didn\'t. Everyone takes the same spelling test in September, and the volunteers score higher.',
    why: 'Students who volunteer for extra reading are likely to be keener to begin with. That motivation alone could explain the better spelling.' },

  { iv: 'background music', dv: 'reading speed', confound: null,
    text: 'Researchers want to know whether background music affects reading speed. Participants are randomly assigned to read with or without music, in the same room, at the same time of day.',
    why: 'Random assignment, the same room and the same time of day mean the music is the only thing that systematically differs between the groups.' },
  { iv: 'using the app', dv: 'number of words known', confound: null,
    text: 'To test a new vocabulary app, researchers randomly split one class of 12-year-olds into two groups: one uses the app and one doesn\'t. At the end of term they compare how many words each group knows.',
    why: 'Same age, same class, split at random — the only systematic difference is the app.' },
  { iv: 'font size', dv: 'reading time', confound: null,
    text: 'Researchers test whether font size affects reading time. Every sentence is shown in large font to half the participants and in small font to the other half.',
    why: 'The sentences are identical in both conditions, so only the font size differs.' },
  { iv: 'sleep', dv: 'words remembered', confound: null,
    text: 'To test whether sleep helps word learning, participants are randomly split into a sleep group and a stay-awake group. The same teacher teaches both groups the same words, in the same way.',
    why: 'Same teacher, same words, random groups — only the sleep differs.' },
  { iv: 'caffeine', dv: 'reaction time', confound: null,
    text: 'To see whether caffeine speeds up reactions, participants are randomly given coffee or water. Everyone is tested in the same quiet lab, on the same task.',
    why: 'Random assignment and identical testing conditions leave the drink as the only difference.' },
  { iv: 'word frequency', dv: 'reading time', confound: null,
    text: 'To test whether word frequency affects reading time, researchers pick common words and rare words that all have exactly the same number of letters.',
    why: 'Matching the words for length removes the obvious other difference between common and rare words.' },
  { iv: 'background noise', dv: 'listening comprehension', confound: null,
    text: 'Researchers test whether background noise affects listening comprehension. Participants are randomly assigned to hear the same recording either in quiet or with background noise, in the same room.',
    why: 'Same recording, same room, random groups — the noise is the only difference.' },
  { iv: 'sentence voice', dv: 'reading time', confound: null,
    text: 'Researchers compare how quickly people read active and passive sentences. Each sentence appears in both versions with the same words, and every participant sees the versions in a random order.',
    why: 'The words are the same in both versions and the order is random, so only active versus passive differs.' },
];

// ---------------------------------------------------------------------------
// 2g. Within or between subjects.
//
// Pairs again: most studies appear once each way, so what decides the
// answer is visibly who takes part in which condition, not the topic.
// `iv`/`dv` are recorded for when this sub-level also asks for them.
// ---------------------------------------------------------------------------
const WITHIN_WHY = 'Within subjects: the same people take part in every condition, so each person is compared with themselves.';
const BETWEEN_WHY = 'Between subjects: each person is in only one condition, so different groups of people are compared.';
const DESIGN_ITEMS = [
  { cat: 'within', iv: 'sentence voice', dv: 'reading time',
    label: 'Every participant reads 40 sentences, half active and half passive, and their reading times for the two types are compared.' },
  { cat: 'within', iv: 'word type', dv: 'test score',
    label: 'Each child is tested on both nouns and verbs, and their scores for the two word types are compared.' },
  { cat: 'within', iv: 'background noise', dv: 'comprehension',
    label: 'The same listeners hear one story in quiet and another with background noise, and their comprehension of the two is compared.' },
  { cat: 'within', iv: 'caffeine', dv: 'memory score',
    label: 'Participants do a memory task once after drinking coffee and again, a week later, after drinking water.' },
  { cat: 'within', iv: 'grammaticality', dv: 'acceptability rating',
    label: 'Each participant rates both grammatical and ungrammatical sentences, and their ratings for the two kinds are compared.' },
  { cat: 'within', iv: 'font size', dv: 'reading time',
    label: 'Readers see some words in large font and other words in small font, and their reading times for the two sizes are compared.' },
  { cat: 'within', iv: 'the course', dv: 'pronunciation score',
    label: 'A group of learners takes a pronunciation test before a six-week course and the same test after it.' },
  { cat: 'within', iv: 'language', dv: 'naming speed',
    label: 'Every participant names the same pictures in their first language and again in their second language.' },

  { cat: 'between', iv: 'sentence voice', dv: 'reading time',
    label: 'One group of participants reads only active sentences, and a different group reads only passive sentences.' },
  { cat: 'between', iv: 'type of school', dv: 'attention score',
    label: 'Children from a bilingual school and children from a monolingual school do the same attention task.' },
  { cat: 'between', iv: 'learning method', dv: 'words learned',
    label: 'Half the participants are randomly assigned to learn new words with an app, and the other half with flashcards.' },
  { cat: 'between', iv: 'background noise', dv: 'comprehension',
    label: 'Listeners are split into two groups: one hears a story in quiet, and the other hears it with background noise.' },
  { cat: 'between', iv: 'handedness', dv: 'verbal fluency',
    label: 'Left-handed and right-handed participants are compared on a verbal fluency task.' },
  { cat: 'between', iv: 'sleep', dv: 'words remembered',
    label: 'One group sleeps after learning new words, and a different group stays awake.' },
  { cat: 'between', iv: 'native language', dv: 'acceptability rating',
    label: 'Native speakers and learners of English rate the same set of sentences, and the two groups\' ratings are compared.' },
  { cat: 'between', iv: 'font size', dv: 'reading time',
    label: 'Each participant is randomly assigned to read a text in one of three font sizes.' },
].map(d => ({ ...d, why: d.cat === 'within' ? WITHIN_WHY : BETWEEN_WHY }));
