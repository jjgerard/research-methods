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
// At least four of each combination. The "reliable but not valid" ones are the
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

  // the lecture's two further points about reliability: enough participants
  // for the size of the effect, and a description full enough to repeat
  { valid: true, reliable: true,
    text: 'To find out whether "Boy the ball kicked the" is grammatical, researchers ask 5 native speakers of English. When they ask another 5 speakers, they get the same answer.',
    whyValid: 'asking native speakers whether a sentence is grammatical is the right way to find out.',
    whyReliable: 'another 5 speakers give the same answer. With an effect this big, 5 people is enough.' },
  { valid: true, reliable: false,
    text: 'To find out whether students prefer books or TV, researchers ask 5 students. When they ask another 5 students, the answer comes out the other way.',
    whyValid: 'asking students which they prefer is the right question.',
    whyReliable: 'repeating it with another 5 people gives a different result. For a small difference like this, 5 participants is far too few.' },
  { valid: true, reliable: false,
    text: 'Researchers test children\'s word learning with a well-designed picture task, but their report doesn\'t say which words they used or how the children were tested. Other researchers who try to repeat the study get different results.',
    whyValid: 'a picture task is a sensible way to test word learning.',
    whyReliable: 'without a full "recipe" — procedure, materials, participants — nobody can repeat the study and get the same result.' },

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
// 2d. Continuous or discrete -- the lecture's "contrast 1".
//
// Continuous: infinite values, no gaps in the scale.
// Discrete: finite or countable values, which can't be divided up.
//
// Only numeric variables and yes/no answers here. Categories (first
// language, handedness) are discrete too, but they're 2e's business, and
// mixing them in would make this a question about numbers versus words.
// "Average number of people" is the lecture's own trap: people are
// discrete, an average of them isn't.
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
  { cat: 'cont', label: 'average number of people in a class', why: CONT + 'a single class can\'t have 20.3 people, but an average across classes can.' },
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
  { cat: 'disc', label: 'year of birth', why: DISC + 'you can\'t be born partly in 2002 and partly in 2003.' },
  { cat: 'disc', label: 'answer to a true/false question', why: DISC + 'it\'s true or false, with nothing in between.' },
  { cat: 'disc', label: 'number of questions answered correctly', why: DISC + 'each question is either right or not, so the total is a whole number.' },
];

// ---------------------------------------------------------------------------
// 2e. Levels of measurement -- the lecture's "contrast 2", in its terms:
// categorical, ordinal, interval, ratio.
//
// Following the lecture, a NUMBERED rating scale ("rate 1-7") is interval
// and a scale of labelled steps ("strongly disagree ... strongly agree") is
// ordinal. Both appear, so the difference between them is part of the
// question. Dates are interval too.
//
// Temperature appears twice on purpose: °C is interval (zero is arbitrary),
// kelvin is ratio (zero really is no heat). The clearest case there is of
// the SAME thing measured at two different levels.
// ---------------------------------------------------------------------------
const NOM = 'Categorical: distinct outcomes with no order. ';
const ORD = 'Ordinal: the outcomes are ranked, but the difference between steps is arbitrary. ';
const INT = 'Interval: ranked, with a constant difference between steps, but no natural zero — so values aren\'t "twice as much". ';
const RAT = 'Ratio: ranked, constant steps AND a natural zero, so "twice as much" makes sense. ';
const MEASUREMENT_ITEMS = [
  { cat: 'categorical', label: 'first language', why: NOM + 'Polish isn\'t more or less than Irish, just different.' },
  { cat: 'categorical', label: 'eye colour', why: NOM + 'Blue, brown and green have no order.' },
  { cat: 'categorical', label: 'blood type', why: NOM + 'A, B, AB and O are different outcomes, not ranked ones.' },
  { cat: 'categorical', label: 'place of birth', why: NOM + 'Places are different, not more or less.' },
  { cat: 'categorical', label: 'handedness (left or right)', why: NOM + 'Left isn\'t more than right.' },
  { cat: 'categorical', label: 'word class (noun, verb, adjective)', why: NOM + 'A verb isn\'t more than a noun.' },
  { cat: 'categorical', label: 'which experimental group someone is in', why: NOM + 'Group A and group B are labels, not amounts.' },
  { cat: 'categorical', label: 'dialect region', why: NOM + 'Ulster English isn\'t more or less than Scottish English, just different.' },
  { cat: 'categorical', label: 'type of school (state, grammar, private)', why: NOM + 'These are kinds of school, not amounts of school.' },

  { cat: 'ordinal', label: 'finishing position in a race (1st, 2nd, 3rd)', why: ORD + 'The gap between 1st and 2nd could be a second; between 2nd and 3rd, a minute.' },
  { cat: 'ordinal', label: 'agreement from "strongly disagree" to "strongly agree"', why: ORD + 'The answers are in order, but nothing says the steps are the same size.' },
  { cat: 'ordinal', label: 'language proficiency level (A1 to C2)', why: ORD + 'C1 is above B2, but the levels aren\'t equal-sized steps.' },
  { cat: 'ordinal', label: 'degree classification (First, 2:1, 2:2, Third)', why: ORD + 'They\'re ranked, but a First isn\'t "one more" than a 2:1 in any measurable way.' },
  { cat: 'ordinal', label: 'T-shirt size (S, M, L, XL)', why: ORD + 'In order, but the jump from S to M needn\'t match the jump from L to XL.' },
  { cat: 'ordinal', label: 'ranking sentences from most to least natural', why: ORD + 'A ranking gives the order, not how far apart the sentences are.' },
  { cat: 'ordinal', label: 'highest qualification (GCSE, A-level, degree)', why: ORD + 'The qualifications are in order, but not equally spaced.' },


  { cat: 'interval', label: 'temperature in °C', why: INT + '0°C isn\'t "no temperature", so 20°C isn\'t twice as hot as 10°C.' },
  { cat: 'interval', label: 'calendar year (e.g. 1998, 2024)', why: INT + 'The gap between years is equal, but year 0 isn\'t the beginning of time, so 2000 isn\'t "twice" 1000.' },
  { cat: 'interval', label: 'acceptability rating on a 1–7 scale', why: INT + 'The numbered steps are treated as equal, but there\'s no zero on the scale, so a 6 isn\'t "twice as acceptable" as a 3.' },
  { cat: 'interval', label: 'agreement rated on a scale of 1–7', why: INT + 'A numbered scale has constant steps, but no natural zero.' },
  { cat: 'interval', label: 'date of an exam', why: INT + 'Days are equal steps, but the calendar\'s starting point is arbitrary.' },
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
// 2g. Confounds.
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
// 2h. Within or between subjects -- and, typed in the student's own words,
// the IV and the DV.
//
// Pairs again: most studies appear once each way, so what decides the
// design is visibly who takes part in which condition, not the topic.
//
// Every description says what is measured, because the student is asked
// to name it: a DV that has to be guessed at isn't a fair question.
//
// `ivs`, `dv` and `others` are the candidates parser.js chooses between.
// `others` are the things in the description that AREN'T variables being
// manipulated or measured -- the participants, the materials -- because
// "the sentences" is exactly what a student unsure of the IV types, and it
// deserves an answer about why that isn't it, not "I didn't understand".
// Aliases are the ways a student might name each one; the parser copes with
// word endings, small typos and extra words, so they needn't be exhaustive.
// ---------------------------------------------------------------------------
const WITHIN_WHY = 'Within subjects: the same people take part in every condition, so each person is compared with themselves.';
const BETWEEN_WHY = 'Between subjects: each person is in only one condition, so different groups of people are compared.';

const V_READING_TIME = { name: 'reading time', aliases: ['time to read', 'how long it takes to read', 'reading speed', 'how fast they read', 'reading', 'speed', 'time', 'reading times'] };
const V_FONT_SIZE = { name: 'font size', aliases: ['font', 'size', 'print size', 'large or small', 'large', 'small', 'big', 'letter size'] };
const V_VOICE = { name: 'sentence voice (active or passive)', aliases: ['voice', 'active or passive', 'active', 'passive', 'sentence type', 'type of sentence', 'sentence structure', 'construction'] };
const V_NOISE = { name: 'background noise (quiet or noisy)', aliases: ['noise', 'background noise', 'quiet or noise', 'quiet', 'noisy', 'sound level', 'listening condition', 'loud'] };
const V_COMPREHENSION = { name: 'comprehension', aliases: ['understanding', 'how much they understand', 'how well they understand', 'understand', 'comprehension score'] };
const V_RATING = { name: 'acceptability rating', aliases: ['rating', 'ratings', 'acceptability', 'judgment', 'judgement', 'score', 'how acceptable'] };
const P_PARTICIPANTS = { name: 'the participants', aliases: ['participants', 'people', 'subjects', 'person'] };

const DESIGN_ITEMS = [
  { cat: 'within',
    label: 'Every participant reads 40 sentences, half active and half passive, and their reading times for the two types are compared.',
    ivs: [V_VOICE], dv: V_READING_TIME,
    others: [P_PARTICIPANTS, { name: 'the number of sentences', aliases: ['number of sentences', '40 sentences', 'sentences', 'amount of sentences'] }] },
  { cat: 'within',
    label: 'Each child is tested on both nouns and verbs, and their scores for the two word types are compared.',
    ivs: [{ name: 'word type (nouns or verbs)', aliases: ['word type', 'type of word', 'nouns or verbs', 'nouns', 'verbs', 'word class', 'part of speech', 'grammatical category', 'category'] }],
    dv: { name: 'test score', aliases: ['score', 'scores', 'how many they get right', 'accuracy', 'performance', 'result', 'results', 'correct'] },
    others: [{ name: 'the children', aliases: ['children', 'child', 'kids', 'age'] }] },
  { cat: 'within',
    label: 'The same listeners hear one story in quiet and another with background noise, and their comprehension of the two is compared.',
    ivs: [V_NOISE], dv: V_COMPREHENSION,
    others: [{ name: 'the listeners', aliases: ['listeners', 'people', 'participants'] }, { name: 'the stories', aliases: ['story', 'stories', 'text'] }] },
  { cat: 'within',
    label: 'Participants do a memory task once after drinking coffee and again, a week later, after drinking water, and their two memory scores are compared.',
    ivs: [{ name: 'the drink (coffee or water)', aliases: ['coffee', 'water', 'caffeine', 'coffee or water', 'drink', 'what they drink', 'type of drink', 'beverage'] }],
    dv: { name: 'memory score', aliases: ['memory', 'memory task', 'how much they remember', 'remember', 'recall', 'memory performance', 'score'] },
    others: [P_PARTICIPANTS, { name: 'the week between sessions', aliases: ['week', 'a week later', 'week between', 'gap'] }] },
  { cat: 'within',
    label: 'Each participant rates both grammatical and ungrammatical sentences, and their ratings for the two kinds are compared.',
    ivs: [{ name: 'grammaticality', aliases: ['grammatical or ungrammatical', 'grammatical', 'ungrammatical', 'whether the sentence is grammatical', 'sentence type', 'type of sentence', 'correctness', 'grammar'] }],
    dv: V_RATING,
    others: [P_PARTICIPANTS] },
  { cat: 'within',
    label: 'Readers see some words in large font and other words in small font, and their reading times for the two sizes are compared.',
    ivs: [V_FONT_SIZE], dv: V_READING_TIME,
    others: [{ name: 'the readers', aliases: ['readers', 'participants', 'people'] }, { name: 'the words', aliases: ['words', 'word'] }] },
  { cat: 'within',
    label: 'A group of learners takes a pronunciation test before a six-week course and the same test after it.',
    ivs: [{ name: 'the course (before or after)', aliases: ['course', 'before or after', 'before and after', 'training', 'instruction', 'teaching', 'lessons', 'when they take the test', 'timing'] }],
    dv: { name: 'pronunciation score', aliases: ['pronunciation', 'pronunciation test', 'how well they pronounce', 'accent', 'test score', 'score'] },
    others: [{ name: 'the learners', aliases: ['learners', 'students', 'people', 'group'] }] },
  { cat: 'within',
    label: 'Every participant names the same pictures in their first language and again in their second language, and how quickly they name them is compared.',
    ivs: [{ name: 'language (first or second)', aliases: ['language', 'first or second language', 'first language', 'second language', 'which language', 'l1', 'l2', 'native language'] }],
    dv: { name: 'naming speed', aliases: ['naming', 'naming time', 'how quickly they name', 'how fast', 'speed', 'reaction time', 'time', 'quickly'] },
    others: [P_PARTICIPANTS, { name: 'the pictures', aliases: ['pictures', 'images', 'picture'] }] },

  { cat: 'between',
    label: 'One group of participants reads only active sentences, and a different group reads only passive sentences. The two groups\' reading times are compared.',
    ivs: [V_VOICE], dv: V_READING_TIME,
    others: [{ name: 'the groups of participants', aliases: ['participants', 'people', 'group', 'groups'] }] },
  { cat: 'between',
    label: 'Children from a bilingual school and children from a monolingual school do the same attention task, and their scores are compared.',
    ivs: [{ name: 'type of school (bilingual or monolingual)', aliases: ['school', 'type of school', 'bilingual or monolingual', 'bilingual', 'monolingual', 'bilingualism', 'language background', 'number of languages'] }],
    dv: { name: 'attention score', aliases: ['attention', 'attention task', 'performance', 'score', 'scores'] },
    others: [{ name: 'the children', aliases: ['children', 'child', 'kids', 'age'] }] },
  { cat: 'between',
    label: 'Half the participants are randomly assigned to learn new words with an app, and the other half with flashcards. The number of words each group learns is compared.',
    ivs: [{ name: 'learning method (app or flashcards)', aliases: ['app', 'flashcards', 'app or flashcards', 'method', 'learning method', 'how they learn', 'study method', 'technique'] }],
    dv: { name: 'number of words learned', aliases: ['words learned', 'number of words', 'vocabulary', 'how many words', 'learning', 'score', 'words'] },
    others: [P_PARTICIPANTS] },
  { cat: 'between',
    label: 'Listeners are split into two groups: one hears a story in quiet, and the other hears it with background noise. The two groups\' comprehension is compared.',
    ivs: [V_NOISE], dv: V_COMPREHENSION,
    others: [{ name: 'the listeners', aliases: ['listeners', 'people', 'participants', 'groups'] }, { name: 'the story', aliases: ['story', 'text'] }] },
  { cat: 'between',
    label: 'Left-handed and right-handed participants do a verbal fluency task, and their fluency scores are compared.',
    ivs: [{ name: 'handedness', aliases: ['left or right handed', 'left handed', 'right handed', 'left', 'right', 'hand', 'which hand', 'dominant hand'] }],
    dv: { name: 'verbal fluency', aliases: ['fluency', 'fluency task', 'verbal', 'fluency score', 'score', 'performance'] },
    others: [P_PARTICIPANTS] },
  { cat: 'between',
    label: 'One group sleeps after learning new words, and a different group stays awake. The next day, the two groups\' recall of the words is compared.',
    ivs: [{ name: 'sleep (sleep or stay awake)', aliases: ['sleep', 'sleeping', 'awake', 'sleep or stay awake', 'staying awake', 'rest'] }],
    dv: { name: 'recall of the words', aliases: ['recall', 'remember', 'memory', 'words remembered', 'how many words', 'number of words remembered', 'score'] },
    others: [{ name: 'the new words', aliases: ['new words', 'the words learned', 'words'] }] },
  { cat: 'between',
    label: 'Native speakers and learners of English rate the same set of sentences, and the two groups\' ratings are compared.',
    ivs: [{ name: 'native speaker or learner', aliases: ['native', 'native speaker', 'learner', 'native or learner', 'language background', 'speaker type', 'first language', 'proficiency', 'nativeness', 'english speakers'] }],
    dv: V_RATING,
    others: [{ name: 'the sentences', aliases: ['sentences', 'sentence set', 'set of sentences'] }] },
  { cat: 'between',
    label: 'Each participant is randomly assigned to read a text in one of three font sizes, and their reading times are compared.',
    ivs: [V_FONT_SIZE], dv: V_READING_TIME,
    others: [P_PARTICIPANTS, { name: 'the text', aliases: ['text', 'passage'] }] },
].map(d => ({ ...d, why: d.cat === 'within' ? WITHIN_WHY : BETWEEN_WHY }));

// ---------------------------------------------------------------------------
// 2f-2h. Cross-sectional, longitudinal, or both -- then the IV(s) and DV,
// typed. Three parts, in order: one factor, two factors, then both (panel
// designs). Cross-sectional and longitudinal are mixed in every part.
//
// From the lecture:
//   cross-sectional  a snapshot: how do 2+ groups differ at one time?
//   longitudinal     repeated measures from the SAME group over time (a
//                    cohort design: one group, followed)
//   both             a panel design: several groups, each followed over
//                    time -- the teaching-methods example
//
// The IVs follow from the design, which is the point of asking for them
// here: in a cross-sectional study the IV is the grouping (age group,
// language background); in a longitudinal one it's time; in a panel design
// it's both, so the student has to find two. The lecture's own examples are
// used where it has them (vocabulary at 6-24 months, a language class
// tested across a year, teaching methods A-C); its phone-use panel is left
// out, as asked.
//
// Time gets named in many ways -- age, months, "before and after", "over
// the year" -- so its alias list is long on purpose.
// ---------------------------------------------------------------------------
const TIME_WORDS = ['time', 'over time', 'when they are tested', 'testing time', 'point in time', 'time point', 'session', 'months', 'years', 'year', 'how long', 'duration', 'before and after', 'pretest', 'post test', 'semester', 'stage'];
const V_AGE_TIME = { name: 'age (the time of testing)', aliases: ['age', 'how old they are', 'getting older', 'months old', 'age in months', 'development', ...TIME_WORDS] };
const V_VOCAB = { name: 'vocabulary size', aliases: ['vocabulary', 'number of words', 'words known', 'how many words', 'words they know', 'word knowledge', 'lexicon'] };

// Part 1: one factor. Cross-sectional and longitudinal mixed, one IV each.
const CROSSLONG_SINGLE = [
  // cross-sectional: different groups, one point in time
  { cat: 'cross',
    label: 'In the same week, researchers measure the vocabulary of 50 two-year-olds and 50 four-year-olds, and compare the two age groups.',
    ivs: [{ name: 'age group', aliases: ['age', 'age group', 'two or four year olds', 'how old they are', 'years old', 'group'] }],
    dv: V_VOCAB,
    others: [{ name: 'the week of testing', aliases: ['week', 'same week', 'time'] }] },
  { cat: 'cross',
    label: 'In one survey in March, researchers ask teenagers, adults and older adults how often they use slang, and compare the three groups.',
    ivs: [{ name: 'age group', aliases: ['age', 'age group', 'teenagers adults or older adults', 'how old they are', 'generation', 'group'] }],
    dv: { name: 'how often they use slang', aliases: ['slang', 'slang use', 'use of slang', 'how much slang', 'frequency of slang'] },
    others: [{ name: 'the month of the survey', aliases: ['march', 'month', 'survey date', 'time'] }] },
  { cat: 'cross',
    label: 'A single questionnaire asks first-, second- and third-year students how confident they feel speaking in class, and compares the year groups.',
    ivs: [{ name: 'year group', aliases: ['year', 'year group', 'year of study', 'first second or third year', 'which year', 'group'] }],
    dv: { name: 'confidence speaking in class', aliases: ['confidence', 'how confident', 'speaking confidence', 'confident'] },
    others: [{ name: 'the questionnaire', aliases: ['questionnaire', 'survey'] }] },
  { cat: 'cross',
    label: 'Researchers test the reading speed of monolingual and bilingual adults, each in a single session, and compare the two groups.',
    ivs: [{ name: 'language background (monolingual or bilingual)', aliases: ['bilingual', 'monolingual', 'bilingual or monolingual', 'language background', 'number of languages', 'bilingualism', 'group'] }],
    dv: { name: 'reading speed', aliases: ['reading', 'reading time', 'how fast they read', 'speed', 'reading rate'] },
    others: [{ name: 'the testing session', aliases: ['session', 'single session', 'time'] }] },
  { cat: 'cross',
    label: 'In one afternoon of testing, researchers count how many past-tense errors 3-, 4- and 5-year-olds make, and compare the age groups.',
    ivs: [{ name: 'age group', aliases: ['age', 'age group', 'how old they are', 'years old', 'group'] }],
    dv: { name: 'number of past-tense errors', aliases: ['errors', 'past tense errors', 'mistakes', 'number of errors', 'how many errors', 'past tense'] },
    others: [{ name: 'the afternoon of testing', aliases: ['afternoon', 'testing session', 'time'] }] },

  // longitudinal (cohort): one group, followed over time
  { cat: 'long',
    label: 'Researchers measure the vocabulary of the same 30 children at 6, 12, 18 and 24 months old.',
    ivs: [V_AGE_TIME],
    dv: V_VOCAB,
    others: [{ name: 'the children', aliases: ['children', 'kids', 'babies', 'number of children'] }] },
  { cat: 'long',
    label: 'A class learning Spanish takes the same speaking test at the start of the course, at the end of each semester, and again one year later.',
    ivs: [{ name: 'time (point in the course)', aliases: ['point in the course', 'start or end', 'course', 'progress', ...TIME_WORDS] }],
    dv: { name: 'speaking test score', aliases: ['speaking', 'speaking score', 'test score', 'score', 'spanish speaking', 'speaking ability', 'proficiency'] },
    others: [{ name: 'the class', aliases: ['class', 'students', 'learners'] }] },
  { cat: 'long',
    label: 'The same group of older adults is tested on finding words every two years for ten years.',
    ivs: [V_AGE_TIME],
    dv: { name: 'word-finding score', aliases: ['word finding', 'finding words', 'word retrieval', 'naming', 'score', 'performance'] },
    others: [{ name: 'the older adults', aliases: ['older adults', 'adults', 'participants', 'elderly'] }] },
  { cat: 'long',
    label: 'One primary-school class writes a story every September from age 7 to age 11, and the length of their stories is compared across the years.',
    ivs: [V_AGE_TIME],
    dv: { name: 'story length', aliases: ['length', 'length of story', 'how long the stories are', 'number of words', 'words written', 'story'] },
    others: [{ name: 'the class', aliases: ['class', 'pupils', 'children'] }] },
  { cat: 'long',
    label: 'Researchers follow 20 international students through their first year at university, testing their English listening every three months.',
    ivs: [{ name: 'time at university', aliases: ['time at university', 'first year', 'three months', 'every three months', 'time in the country', ...TIME_WORDS] }],
    dv: { name: 'English listening score', aliases: ['listening', 'listening score', 'english listening', 'listening comprehension', 'score', 'english'] },
    others: [{ name: 'the international students', aliases: ['students', 'international students', 'participants'] }] },

];

// Part 2: two factors. Still only cross-sectional or longitudinal, but each
// design has a second IV alongside the grouping or the time -- a
// within-subjects one (nouns and verbs; easy and hard texts) or a second
// way of grouping people. Two IVs is new; the design choice isn't.
const CROSSLONG_MULTI = [
  // cross-sectional, two factors: still one point in time
  { cat: 'cross',
    label: 'In the same week, researchers measure the vocabulary of monolingual and bilingual children aged 3 and aged 5, and compare all four groups.',
    ivs: [
      { name: 'language background (monolingual or bilingual)', aliases: ['bilingual', 'monolingual', 'bilingual or monolingual', 'language background', 'number of languages', 'bilingualism'] },
      { name: 'age group', aliases: ['age', 'age group', 'how old they are', 'years old', '3 or 5'] },
    ],
    dv: V_VOCAB,
    others: [{ name: 'the week of testing', aliases: ['week', 'same week'] }] },
  { cat: 'cross',
    label: 'In a single session, native speakers and learners of English each rate grammatical and ungrammatical sentences.',
    ivs: [
      { name: 'native speaker or learner', aliases: ['native', 'native speaker', 'learner', 'native or learner', 'language background', 'speaker type', 'first language', 'proficiency'] },
      { name: 'grammaticality', aliases: ['grammatical or ungrammatical', 'grammatical', 'ungrammatical', 'sentence type', 'type of sentence', 'correctness', 'grammar'] },
    ],
    dv: { name: 'acceptability rating', aliases: ['rating', 'ratings', 'acceptability', 'judgment', 'judgement', 'score'] },
    others: [{ name: 'the session', aliases: ['session', 'single session'] }] },
  { cat: 'cross',
    label: 'One survey asks people in cities and in the countryside, in three age groups, how often they use dialect words, and compares the groups.',
    ivs: [
      { name: 'where they live (city or countryside)', aliases: ['city', 'countryside', 'city or countryside', 'urban', 'rural', 'location', 'where they live', 'place'] },
      { name: 'age group', aliases: ['age', 'age group', 'how old they are', 'generation'] },
    ],
    dv: { name: 'how often they use dialect words', aliases: ['dialect', 'dialect words', 'dialect use', 'use of dialect', 'how often', 'frequency'] },
    others: [{ name: 'the survey', aliases: ['survey', 'questionnaire'] }] },
  { cat: 'cross',
    label: 'In one afternoon, first-year and third-year students read texts in large and in small font, and their reading speeds are compared.',
    ivs: [
      { name: 'year group', aliases: ['year', 'year group', 'year of study', 'first or third year', 'which year'] },
      V_FONT_SIZE,
    ],
    dv: { name: 'reading speed', aliases: ['reading', 'reading time', 'how fast they read', 'speed', 'reading rate'] },
    others: [{ name: 'the texts', aliases: ['texts', 'text', 'passages'] }] },
  { cat: 'cross',
    label: 'On one testing day, left-handed and right-handed children aged 6 and aged 9 take the same spelling test.',
    ivs: [
      { name: 'handedness', aliases: ['left or right handed', 'left handed', 'right handed', 'hand', 'which hand', 'handed'] },
      { name: 'age group', aliases: ['age', 'age group', 'how old they are', 'years old', '6 or 9'] },
    ],
    dv: { name: 'spelling score', aliases: ['spelling', 'spelling test', 'score', 'spelling ability'] },
    others: [{ name: 'the testing day', aliases: ['day', 'testing day'] }] },

  // longitudinal, two factors: one group, followed over time, plus a
  // second IV that every member of the group experiences
  { cat: 'long',
    label: 'The same 25 children are tested on how many nouns and how many verbs they know at 18, 24 and 30 months old.',
    ivs: [
      V_AGE_TIME,
      { name: 'word type (nouns or verbs)', aliases: ['word type', 'type of word', 'nouns or verbs', 'nouns', 'verbs', 'word class', 'part of speech'] },
    ],
    dv: { name: 'number of words known', aliases: ['words known', 'number of words', 'how many words', 'vocabulary', 'how many they know'] },
    others: [{ name: 'the children', aliases: ['children', 'kids', 'toddlers'] }] },
  { cat: 'long',
    label: 'One class of Spanish learners is tested on both speaking and listening at the start and the end of each semester.',
    ivs: [
      { name: 'time (point in the course)', aliases: ['point in the course', 'start or end', 'progress', ...TIME_WORDS] },
      { name: 'skill (speaking or listening)', aliases: ['skill', 'speaking or listening', 'speaking', 'listening', 'type of test', 'which skill'] },
    ],
    dv: { name: 'test score', aliases: ['score', 'test score', 'results', 'performance', 'marks'] },
    others: [{ name: 'the class', aliases: ['class', 'learners', 'students'] }] },
  { cat: 'long',
    label: 'The same group of older adults reads easy and difficult texts every two years for ten years, and their reading times are recorded.',
    ivs: [
      V_AGE_TIME,
      { name: 'text difficulty (easy or difficult)', aliases: ['difficulty', 'text difficulty', 'easy or difficult', 'easy', 'difficult', 'hard', 'type of text'] },
    ],
    dv: { name: 'reading time', aliases: ['reading', 'time to read', 'how long they take to read', 'reading speed', 'speed'] },
    others: [{ name: 'the older adults', aliases: ['older adults', 'adults', 'participants', 'elderly'] }] },
  { cat: 'long',
    label: 'During a year abroad, 20 students are tested every month on how well they understand speech in quiet and in noise.',
    ivs: [
      { name: 'time abroad', aliases: ['time abroad', 'year abroad', 'month', 'every month', 'months abroad', ...TIME_WORDS] },
      { name: 'background noise (quiet or noisy)', aliases: ['noise', 'background noise', 'quiet or noise', 'quiet', 'noisy', 'listening condition'] },
    ],
    dv: { name: 'listening comprehension', aliases: ['comprehension', 'understanding', 'how well they understand', 'understand', 'listening'] },
    others: [{ name: 'the students', aliases: ['students', 'participants'] }] },
  { cat: 'long',
    label: 'The same children write a story and a letter every September from age 7 to age 11, and the length of each piece is measured.',
    ivs: [
      V_AGE_TIME,
      { name: 'type of writing (story or letter)', aliases: ['story or letter', 'story', 'letter', 'type of writing', 'genre', 'writing type', 'kind of text'] },
    ],
    dv: { name: 'length of the writing', aliases: ['length', 'how long', 'number of words', 'words written', 'word count'] },
    others: [{ name: 'the children', aliases: ['children', 'pupils', 'class'] }] },
];

// Part 3: both. Panel designs -- several groups, each followed over time --
// so there are always two IVs, the grouping and the time.
const CROSSLONG_PANEL = [
  { cat: 'both',
    label: 'Three classes are each taught with a different method (A, B or C). Every class takes the same test before teaching starts, after year 1 and after year 2.',
    ivs: [
      { name: 'teaching method', aliases: ['method', 'teaching method', 'a b or c', 'how they are taught', 'teaching', 'class'] },
      { name: 'time (pretest, year 1, year 2)', aliases: ['year 1 year 2', 'pretest', ...TIME_WORDS] },
    ],
    dv: { name: 'test score', aliases: ['test', 'score', 'test score', 'results', 'performance', 'learning'] },
    others: [] },
  { cat: 'both',
    label: 'Children from bilingual and monolingual homes have their vocabulary measured at ages 2, 3 and 4, and the two groups are compared at each age.',
    ivs: [
      { name: 'home language (bilingual or monolingual)', aliases: ['bilingual', 'monolingual', 'bilingual or monolingual', 'home language', 'language background', 'home', 'group'] },
      V_AGE_TIME,
    ],
    dv: V_VOCAB,
    others: [] },
  { cat: 'both',
    label: 'One group of learners uses an app and another uses a textbook. Both groups take the same grammar test every month for six months.',
    ivs: [
      { name: 'learning method (app or textbook)', aliases: ['app', 'textbook', 'app or textbook', 'method', 'learning method', 'group'] },
      { name: 'time (month of testing)', aliases: ['month', 'six months', 'every month', ...TIME_WORDS] },
    ],
    dv: { name: 'grammar test score', aliases: ['grammar', 'grammar score', 'grammar test', 'test score', 'score'] },
    others: [] },
  { cat: 'both',
    label: 'Two groups of people with aphasia, one having speech therapy and one not, have their naming accuracy tested every month for a year.',
    ivs: [
      { name: 'therapy (or no therapy)', aliases: ['therapy', 'speech therapy', 'therapy or not', 'treatment', 'group'] },
      { name: 'time (month of testing)', aliases: ['month', 'every month', 'a year', ...TIME_WORDS] },
    ],
    dv: { name: 'naming accuracy', aliases: ['naming', 'accuracy', 'naming score', 'how many they name', 'correct'] },
    others: [] },
  { cat: 'both',
    label: 'Researchers follow a group of left-handed and a group of right-handed children, testing their reading every year from age 5 to age 8.',
    ivs: [
      { name: 'handedness', aliases: ['left or right handed', 'left handed', 'right handed', 'hand', 'which hand', 'handed'] },
      V_AGE_TIME,
    ],
    dv: { name: 'reading score', aliases: ['reading', 'reading ability', 'reading test', 'score'] },
    others: [] },
  { cat: 'both',
    label: 'Researchers follow two groups of toddlers, one in full-time nursery and one cared for at home, measuring their vocabulary every six months from age 1 to age 3.',
    ivs: [
      { name: 'childcare (nursery or home)', aliases: ['nursery', 'home', 'nursery or home', 'childcare', 'care', 'where they are looked after', 'group'] },
      V_AGE_TIME,
    ],
    dv: V_VOCAB,
    others: [] },
  { cat: 'both',
    label: 'Students on an Irish immersion course and students at a weekly evening class take the same speaking test at the start, middle and end of the year.',
    ivs: [
      { name: 'type of course (immersion or evening class)', aliases: ['course', 'type of course', 'immersion', 'evening class', 'immersion or evening class', 'class type', 'group'] },
      { name: 'time (start, middle or end of the year)', aliases: ['start middle or end', 'point in the year', ...TIME_WORDS] },
    ],
    dv: { name: 'speaking score', aliases: ['speaking', 'speaking test', 'score', 'irish speaking', 'fluency'] },
    others: [] },
  { cat: 'both',
    label: 'Three age groups of adults (in their 20s, 40s and 60s) are each tested on word recall once a year for five years.',
    ivs: [
      { name: 'age group', aliases: ['age group', '20s 40s or 60s', 'generation', 'group'] },
      { name: 'time (year of testing)', aliases: ['once a year', 'five years', ...TIME_WORDS] },
    ],
    dv: { name: 'word recall', aliases: ['recall', 'memory', 'words recalled', 'how many words', 'remember', 'score'] },
    others: [] },
];

// Part 3 isn't only panel designs: a third of it is drawn from parts 1 and 2,
// so "both" is something to recognise rather than an answer that's always
// right.
const CROSSLONG_PART3 = [
  ...CROSSLONG_PANEL,
  ...CROSSLONG_SINGLE.filter((_, i) => i % 3 === 0),
  ...CROSSLONG_MULTI.filter((_, i) => i % 3 === 1),
];
