// ---------------------------------------------------------------------------
// The disciplines a student can choose at the start, and which pools of
// examples each one draws on (see pools/README.md).
//
// The first pool is the discipline's own; the others are neighbours it
// shares examples with. A discipline is playable once its first pool
// exists -- until then the picker lists it as coming soon.
//
// `subjects` is what the studies are done on: 'participants' (people) or
// 'samples' (things -- solutions, specimens, plots, components). It changes
// the wording of within/between designs, which assume people otherwise.
// ---------------------------------------------------------------------------
const DISCIPLINE_GROUPS = [
  { name: 'Social sciences', ids: ['linguistics', 'psychology', 'sociology', 'education', 'economics', 'business', 'criminology', 'human-geography', 'anthropology', 'media', 'social-work'] },
  { name: 'Life & health sciences', ids: ['biology', 'ecology', 'biomedical', 'neuroscience', 'nursing', 'sport', 'nutrition', 'physiotherapy', 'slt', 'agriculture'] },
  { name: 'Physical sciences & engineering', ids: ['chemistry', 'physics', 'earth-sciences', 'physical-geography', 'environmental', 'engineering', 'computer-science'] },
];

const DISCIPLINES = {
  linguistics:          { name: 'Linguistics', pools: ['language', 'mind'], subjects: 'participants' },
  psychology:           { name: 'Psychology', pools: ['mind'], subjects: 'participants' },
  sociology:            { name: 'Sociology', pools: ['society'], subjects: 'participants' },
  education:            { name: 'Education', pools: ['education', 'mind'], subjects: 'participants' },
  economics:            { name: 'Economics', pools: ['econ'], subjects: 'participants' },
  business:             { name: 'Business & marketing', pools: ['econ', 'mind'], subjects: 'participants' },
  criminology:          { name: 'Criminology', pools: ['society'], subjects: 'participants' },
  'human-geography':    { name: 'Human geography', pools: ['society', 'earth'], subjects: 'participants' },
  anthropology:         { name: 'Anthropology', pools: ['society', 'language'], subjects: 'participants' },
  media:                { name: 'Media & communication', pools: ['society', 'mind'], subjects: 'participants' },
  'social-work':        { name: 'Social work', pools: ['society', 'health'], subjects: 'participants' },

  biology:              { name: 'Biology', pools: ['life'], subjects: 'samples' },
  ecology:              { name: 'Ecology', pools: ['life', 'earth'], subjects: 'samples' },
  biomedical:           { name: 'Biomedical science', pools: ['life', 'health'], subjects: 'samples' },
  neuroscience:         { name: 'Neuroscience', pools: ['mind', 'life'], subjects: 'participants' },
  nursing:              { name: 'Nursing', pools: ['health'], subjects: 'participants' },
  sport:                { name: 'Sport & exercise science', pools: ['health', 'life'], subjects: 'participants' },
  nutrition:            { name: 'Nutrition & dietetics', pools: ['health', 'life'], subjects: 'participants' },
  physiotherapy:        { name: 'Physiotherapy', pools: ['health'], subjects: 'participants' },
  slt:                  { name: 'Speech & language therapy', pools: ['health', 'language'], subjects: 'participants' },
  agriculture:          { name: 'Agriculture & animal science', pools: ['life', 'earth'], subjects: 'samples' },

  chemistry:            { name: 'Chemistry', pools: ['physical'], subjects: 'samples' },
  physics:              { name: 'Physics', pools: ['physical'], subjects: 'samples' },
  'earth-sciences':     { name: 'Earth sciences & geology', pools: ['earth', 'physical'], subjects: 'samples' },
  'physical-geography': { name: 'Physical geography', pools: ['earth'], subjects: 'samples' },
  environmental:        { name: 'Environmental science', pools: ['earth', 'life'], subjects: 'samples' },
  engineering:          { name: 'Engineering', pools: ['physical', 'computing'], subjects: 'samples' },
  'computer-science':   { name: 'Computer science', pools: ['computing', 'mind'], subjects: 'participants' },
};

// What each pool's studies are done on. Design questions (within/between,
// cross-sectional/longitudinal, confounds) only come from pools that study
// the same kind of thing as the discipline, so a sport scientist isn't
// asked about pondweed under a "within subjects" heading. Every other kind
// of question can mix freely.
const POOL_SUBJECTS = {
  language: 'participants', mind: 'participants', health: 'participants', society: 'participants',
  education: 'participants', econ: 'participants', computing: 'participants',
  life: 'samples', physical: 'samples', earth: 'samples',
};

// Pools register themselves here as their files load.
const POOLS = {};
