// ---------------------------------------------------------------------------
// Everything a student is asked, and every explanation they're given when
// they get it wrong. The engine (quiz.js, app.js) knows nothing about
// research methods; adding a level is adding data here.
//
// Level 1 follows the "Defining variables" slides of the first CMM378
// lecture, in the order they go:
//
//   1a  what a variable IS    -- a measurable feature with different
//                                possible values (slide 29)
//   1b  changer and change-ee -- which variable changes the other (slide 32)
//   1c  independent/dependent -- the same thing, with the proper names
//                                (slides 33-34)
//   1d  the graph             -- a relation drawn, and drawn backwards
//
// 1b and 1c ask the identical question about the identical statements, and
// that is the point: the idea gets practised in plain words first, and the
// formal terms arrive as a new name for something already understood rather
// than as two more words to memorise. Nothing in 1a or 1b says "independent"
// or "dependent" anywhere, so the payoff isn't spent early.
// ---------------------------------------------------------------------------

// Locked, numbered cards after the last live level, so the growth path
// stays visible. Only the COUNT is shown -- a title would name what a later
// level exists to teach. Add an entry per level as the outline arrives.
const ROADMAP = [];

// ---------------------------------------------------------------------------
// 1a. Variable or not?
//
// Every item carries its own reason, shown when it's answered wrongly --
// a student is never told just "no". The reasons for the non-variables
// almost always name a variable hiding inside the same thing (the Titanic
// isn't one; ship size is), because the commonest mistake here isn't
// failing to spot a thing, it's not seeing that a thing and a measurement
// of it are different kinds of object.
//
// A handful are constants -- measurable, but with only one possible value
// (the speed of light, days in a week). They exist to test the second half
// of the definition: being measurable isn't enough on its own.
// ---------------------------------------------------------------------------
const SORT_ITEMS = [
  // --- variables ---
  { label: 'age', variable: true,
    why: 'People are different ages, and age can be measured — in years, or in months for young children.' },
  { label: 'vocabulary size', variable: true,
    why: 'Different people know different numbers of words, and you can count them.' },
  { label: 'time', variable: true,
    why: 'Time can be measured, and it takes different values — seconds, weeks, years.' },
  { label: 'screen time', variable: true,
    why: 'Some people spend more hours a day on screens than others, and the hours can be measured.' },
  { label: 'height', variable: true,
    why: 'People are different heights, and height is measured in centimetres.' },
  { label: 'sentence complexity', variable: true,
    why: 'Some sentences are more complex than others, and it can be measured — for example by counting clauses.' },
  { label: 'grammaticality judgment', variable: true,
    why: 'People rate sentences as more or less acceptable, and the ratings differ from sentence to sentence and person to person.' },
  { label: 'reading time', variable: true,
    why: 'How long something takes to read differs between readers and between sentences. It is measured in milliseconds.' },
  { label: 'reaction time', variable: true,
    why: 'How quickly someone responds can be measured, and it changes from one attempt to the next.' },
  { label: 'word frequency', variable: true,
    why: 'Some words are far more common than others. Frequency is counted, usually per million words of text.' },
  { label: 'word length', variable: true,
    why: 'Words have different numbers of letters and syllables.' },
  { label: 'speech rate', variable: true,
    why: 'People speak at different speeds, measured in syllables per second.' },
  { label: 'number of errors', variable: true,
    why: 'Different people, and different attempts, produce different numbers of errors — and errors can be counted.' },
  { label: 'exam mark', variable: true,
    why: 'Marks differ from student to student and from exam to exam.' },
  { label: 'hours of sleep', variable: true,
    why: 'People sleep for different lengths of time, and it can be measured in hours.' },
  { label: 'temperature', variable: true,
    why: 'Temperature is measured in degrees, and it changes all the time.' },
  { label: 'accent strength', variable: true,
    why: 'Listeners can rate how strong an accent sounds, and accents differ in strength.' },
  { label: 'sentence length', variable: true,
    why: 'Sentences have different numbers of words.' },
  { label: 'number of siblings', variable: true,
    why: 'Some people have no siblings and some have five — it can be counted, and it differs.' },
  { label: 'years of language study', variable: true,
    why: 'People have studied a language for different numbers of years.' },
  { label: 'comprehension accuracy', variable: true,
    why: 'The percentage of questions answered correctly differs between people and between texts.' },
  { label: 'mood rating', variable: true,
    why: 'People can rate how they feel on a scale, and the rating changes from day to day.' },
  { label: 'background noise level', variable: true,
    why: 'Noise is measured in decibels, and some rooms are louder than others.' },
  { label: 'number of books at home', variable: true,
    why: 'Homes have different numbers of books, and they can be counted.' },
  { label: 'price', variable: true,
    why: 'Prices go up and down, and they are measured in pounds and pence.' },

  // --- not variables: one particular thing ---
  { label: 'Ulster University', variable: false,
    why: 'Ulster University is one particular university — a thing, not a measurement. (The number of students at Ulster would be a variable.)' },
  { label: 'the iPad mini', variable: false,
    why: 'The iPad mini is one particular product. (How long someone spends on it — screen time — would be a variable.)' },
  { label: 'the big fish', variable: false,
    why: 'The big fish is one particular fish. (How much a fish weighs would be a variable.)' },
  { label: 'the Titanic', variable: false,
    why: 'The Titanic is one particular ship — it doesn\'t take different values. (Ship size would be a variable.)' },
  { label: 'Belfast', variable: false,
    why: 'Belfast is one particular city. (Its population would be a variable.)' },
  { label: 'the Eiffel Tower', variable: false,
    why: 'The Eiffel Tower is one particular building. (Building height would be a variable.)' },
  { label: 'the Oxford English Dictionary', variable: false,
    why: 'It\'s one particular book. (How many words a person knows would be a variable.)' },
  { label: 'Shakespeare', variable: false,
    why: 'Shakespeare is one particular person. (How many plays a writer wrote would be a variable.)' },
  { label: 'the Mona Lisa', variable: false,
    why: 'The Mona Lisa is one particular painting. (How long visitors look at it would be a variable.)' },
  { label: 'Mount Everest', variable: false,
    why: 'Mount Everest is one particular mountain. (Mountain height would be a variable.)' },
  { label: 'the moon', variable: false,
    why: 'The moon is one particular object. (Its distance from Earth does change, and that would be a variable.)' },
  { label: 'the letter A', variable: false,
    why: 'The letter A is one particular letter. (How often a letter is used would be a variable.)' },
  { label: 'Harry Potter and the Philosopher\'s Stone', variable: false,
    why: 'It\'s one particular book. (How long it takes someone to read it would be a variable.)' },

  // --- not variables: measurable, but only one possible value ---
  { label: 'the speed of light', variable: false,
    why: 'It can be measured, but it only ever has one value. A variable needs different possible values — this is a constant.' },
  { label: 'the number of days in a week', variable: false,
    why: 'It\'s always seven. Something that can only ever have one value is a constant, not a variable.' },
  { label: 'the number of letters in the English alphabet', variable: false,
    why: 'It\'s always 26 — only one possible value, so it\'s a constant, not a variable.' },
  { label: 'the boiling point of water at sea level', variable: false,
    why: 'At sea level it\'s always 100°C. It can be measured, but it doesn\'t vary.' },
];

// ---------------------------------------------------------------------------
// 1b-1d. Relations between two variables.
//
//   iv / dv        how the two variables are named on the answer buttons.
//                  (Named for the terms 1c introduces, but never shown as
//                  such before it.)
//   ivAxis/dvAxis  the same two, short enough to label a graph axis.
//   ivNP/dvNP      the same two as they'd appear mid-sentence in a
//                  hypothesis ("Increasing THE SPEED LIMIT increases..."),
//                  where that differs from the button label. Always
//                  singular, so "Does X affect..." agrees. Level 2.
//   dir            'up' if more of the changer means more of the change-ee,
//                  'down' if it means less. Used only by 1d.
//   says           ways of stating it. Several deliberately mention the
//                  change-ee FIRST ("Reading time goes up as..."), so that
//                  "the first thing mentioned is the changer" never works
//                  as a shortcut.
//   why            shown after a wrong answer: which one does the changing,
//                  and why the backwards version doesn't hold.
//
// These are the claims as stated, not findings -- the game only asks what a
// statement says changes what, never whether it's true. Some are well
// established and some are contested (screen time), which is a later
// level's business.
//
// A deliberate spread of 'down' relations, because 1d is only a real
// question if a falling line is as likely as a rising one. The reaction
// time one is the trap: faster responding is a SHORTER time, so the line
// falls even though the sentence sounds like an improvement.
// ---------------------------------------------------------------------------
const RELATIONS = [
  { id: 'age-vocab', iv: 'age', dv: 'vocabulary size', ivAxis: 'Age', dvAxis: 'Vocabulary', dir: 'up',
    says: ['As children get older, they know more words.',
           'Children\'s vocabulary grows as they get older.'],
    why: 'Getting older is what gives children the time to learn words. Learning words doesn\'t make anyone older — that would be the backwards relation.' },
  { id: 'study-mark', ivNP: 'time spent studying', dvNP: 'exam marks', iv: 'time spent studying', dv: 'exam mark', ivAxis: 'Study time', dvAxis: 'Exam mark', dir: 'up',
    says: ['Students who spend longer studying get higher exam marks.',
           'Exam marks go up the more time students spend studying.'],
    why: 'The studying happens before the exam, so it\'s the studying that changes the mark — the mark can\'t go back and change how long you studied.' },
  { id: 'age-height', iv: 'age', dv: 'height', ivAxis: 'Age', dvAxis: 'Height', dir: 'up',
    says: ['Children grow taller as they get older.',
           'A child\'s height goes up with age.'],
    why: 'Growing older is what makes children taller. Getting taller doesn\'t make anyone older.' },
  { id: 'screen-vocab', iv: 'screen time', dv: 'vocabulary size', ivAxis: 'Screen time', dvAxis: 'Vocabulary', dir: 'down',
    says: ['Toddlers who have more screen time learn fewer words.',
           'Toddlers learn fewer words the more screen time they have.'],
    why: 'The claim is that screen time changes how many words toddlers learn — not that learning words changes how much screen time they get.' },
  { id: 'complexity-rt', iv: 'sentence complexity', dv: 'reading time', ivAxis: 'Complexity', dvAxis: 'Reading time', dir: 'up',
    says: ['More complex sentences take longer to read.',
           'Reading time goes up as sentences get more complex.'],
    why: 'The sentence is what the reader is given; how long they take is the result. Reading slowly doesn\'t make a sentence more complex.' },
  { id: 'complexity-acc', iv: 'sentence complexity', dv: 'comprehension accuracy', ivAxis: 'Complexity', dvAxis: 'Accuracy', dir: 'down',
    says: ['The more complex a sentence is, the fewer comprehension questions readers get right.',
           'Comprehension accuracy drops as sentences get more complex.'],
    why: 'The complexity is built into the sentence before anyone reads it. Getting questions wrong can\'t make the sentence more complex.' },
  { id: 'freq-rt', iv: 'word frequency', dv: 'reading time', ivAxis: 'Frequency', dvAxis: 'Reading time', dir: 'down',
    says: ['The more common a word is, the less time it takes to read.',
           'Reading time goes down as word frequency goes up.'],
    why: 'How common a word is was settled long before this reader met it, so frequency is the changer. One person reading a word slowly can\'t make it rarer.' },
  { id: 'length-rt', iv: 'word length', dv: 'reading time', ivAxis: 'Word length', dvAxis: 'Reading time', dir: 'up',
    says: ['Longer words take longer to read.',
           'Reading time increases with the number of letters in a word.'],
    why: 'The word\'s length is fixed; the reading time is how readers respond to it. Reading slowly doesn\'t add letters.' },
  { id: 'sleep-recall', ivNP: 'the amount of sleep', dvNP: 'the number of new words remembered', iv: 'hours of sleep', dv: 'words remembered', ivAxis: 'Sleep', dvAxis: 'Words recalled', dir: 'up',
    says: ['People who sleep longer remember more of the new words they learned the day before.',
           'The number of new words people remember goes up with how many hours they slept.'],
    why: 'The sleep comes before the memory test, so sleep is the changer. Remembering words the next day can\'t change how long you already slept.' },
  { id: 'noise-comp', iv: 'background noise', dv: 'listening comprehension', ivAxis: 'Noise', dvAxis: 'Comprehension', dir: 'down',
    says: ['The louder the background noise, the less listeners understand.',
           'Listeners understand less as background noise gets louder.'],
    why: 'The noise is what gets in the way. Understanding less can\'t make a room louder.' },
  { id: 'rate-comp', dvNP: 'comprehension scores', iv: 'speech rate', dv: 'comprehension score', ivAxis: 'Speech rate', dvAxis: 'Comprehension', dir: 'down',
    says: ['The faster someone speaks, the lower their listeners\' comprehension scores.',
           'Listeners\' comprehension scores drop as speakers talk faster.'],
    why: 'How fast the speaker talks is what the listener has to cope with. The listener\'s score can\'t change how fast someone already spoke.' },
  { id: 'readto-vocab', iv: 'time spent being read to', dv: 'vocabulary size', ivAxis: 'Reading aloud', dvAxis: 'Vocabulary', dir: 'up',
    says: ['Children who are read to more often know more words.',
           'Children know more words the more often they are read to.'],
    why: 'The claim is that being read to is what builds vocabulary — the words come from the books.' },
  { id: 'years-prof', ivNP: 'the number of years of study', dvNP: 'proficiency scores', iv: 'years of study', dv: 'proficiency score', ivAxis: 'Years of study', dvAxis: 'Proficiency', dir: 'up',
    says: ['The more years someone has studied French, the higher their French proficiency score.',
           'French proficiency scores go up with years of study.'],
    why: 'The years of study come first and the proficiency test comes after, so the study is the changer.' },
  { id: 'aoa-accent', ivNP: 'the age of starting a second language', dvNP: 'the native-likeness of pronunciation', iv: 'starting age', dv: 'native-like pronunciation', ivAxis: 'Starting age', dvAxis: 'Native-likeness', dir: 'down',
    says: ['The later people start learning a second language, the less native-like their pronunciation.',
           'Pronunciation is less native-like the older people are when they start learning a second language.'],
    why: 'The age someone started at is fixed in the past. How they sound now can\'t change when they started.' },
  { id: 'errors-rating', ivNP: 'the number of grammatical errors', dvNP: 'acceptability ratings', iv: 'number of grammatical errors', dv: 'acceptability rating', ivAxis: 'Errors', dvAxis: 'Acceptability', dir: 'down',
    says: ['Sentences with more grammatical errors get lower acceptability ratings.',
           'Acceptability ratings go down as the number of errors in a sentence goes up.'],
    why: 'The errors are in the sentence before anyone rates it. The rating is how people respond to them — it can\'t put errors in.' },
  { id: 'input-vocab', ivNP: 'the amount of English heard', dvNP: 'the number of English words learned', iv: 'hours of English heard', dv: 'vocabulary size', ivAxis: 'English heard', dvAxis: 'Vocabulary', dir: 'up',
    says: ['Children who hear more English each week learn more English words.',
           'The number of English words children learn goes up with how much English they hear.'],
    why: 'Hearing the language is where the words come from, so the input is the changer.' },
  { id: 'coffee-rt', ivNP: 'coffee intake', iv: 'cups of coffee', dv: 'reaction time', ivAxis: 'Coffee', dvAxis: 'Reaction time', dir: 'down',
    says: ['The more coffee people drink, the faster they respond — their reaction times get shorter.',
           'Reaction times get shorter as people drink more coffee.'],
    why: 'The coffee is drunk first and the reactions are measured after, so coffee is the changer. Careful with the graph: responding faster means the reaction TIME goes down.' },
  { id: 'temp-icecream', ivNP: 'the temperature', iv: 'temperature', dv: 'ice cream sales', ivAxis: 'Temperature', dvAxis: 'Sales', dir: 'up',
    says: ['On hotter days, more ice cream is sold.',
           'Ice cream sales go up as the temperature rises.'],
    why: 'The weather makes people want ice cream. Selling ice cream can\'t heat up the day.' },
  { id: 'speed-accidents', ivNP: 'the speed limit', dvNP: 'the number of accidents', iv: 'speed limit', dv: 'number of accidents', ivAxis: 'Speed limit', dvAxis: 'Accidents', dir: 'up',
    says: ['Roads with higher speed limits have more accidents.',
           'The number of accidents goes up as the speed limit goes up.'],
    why: 'The claim is that the speed limit changes how many accidents happen.' },
  { id: 'price-sales', ivNP: 'the price', dvNP: 'the number sold', iv: 'price', dv: 'number sold', ivAxis: 'Price', dvAxis: 'Number sold', dir: 'down',
    says: ['When the price of a coffee goes up, fewer coffees are sold.',
           'Fewer coffees are sold the higher the price.'],
    why: 'The shop sets the price and customers respond to it, so price is the changer.' },
  { id: 'load-errors', dvNP: 'the number of errors', iv: 'memory load', dv: 'number of errors', ivAxis: 'Memory load', dvAxis: 'Errors', dir: 'up',
    says: ['The more words people have to hold in memory, the more errors they make.',
           'People make more errors as the number of words they must remember goes up.'],
    why: 'The researcher decides how many words to give people; the errors are the result. Making errors can\'t change how many words you were given.' },
  { id: 'exercise-hr', iv: 'weekly exercise', dv: 'resting heart rate', ivAxis: 'Exercise', dvAxis: 'Heart rate', dir: 'down',
    says: ['People who exercise more have a lower resting heart rate.',
           'Resting heart rate goes down as weekly exercise goes up.'],
    why: 'The claim is that exercise changes the heart rate — not that a lower heart rate makes people exercise.' },
  { id: 'practice-typing', ivNP: 'the amount of practice', iv: 'hours of practice', dv: 'typing speed', ivAxis: 'Practice', dvAxis: 'Typing speed', dir: 'up',
    says: ['The more hours people practise, the faster they type.',
           'Typing speed goes up with hours of practice.'],
    why: 'The practice is what builds the speed, so practice is the changer.' },
  { id: 'length-recall', iv: 'sentence length', dv: 'recall accuracy', ivAxis: 'Sentence length', dvAxis: 'Recall', dir: 'down',
    says: ['The longer a sentence is, the less of it people can repeat back correctly.',
           'Recall accuracy drops as sentences get longer.'],
    why: 'The sentence\'s length is fixed before anyone tries to repeat it. Repeating it badly can\'t make it longer.' },
  { id: 'choc-mood', ivNP: 'the amount of chocolate eaten', dvNP: 'mood ratings', iv: 'chocolate eaten', dv: 'mood rating', ivAxis: 'Chocolate', dvAxis: 'Mood', dir: 'up',
    says: ['People who eat more chocolate give higher mood ratings.',
           'Mood ratings go up the more chocolate people eat.'],
    why: 'As stated, the chocolate is what changes the mood. (The backwards version — a good mood making people eat more chocolate — is a different claim.)' },
];
