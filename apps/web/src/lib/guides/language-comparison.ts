// ── Types ─────────────────────────────────────────────────────────────────────

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

export type LangValue = {
  label: string       // concise tag value
  detail: string      // 1-2 sentence explanation
  examples?: string[] // concrete instances
}

export type ComparisonRow = {
  id: string
  attribute: string
  description: string  // what this attribute measures
  vi: LangValue
  en: LangValue
  risk: RiskLevel      // transfer difficulty for VI→EN IELTS learner
  ieltsTip?: string
}

export type Dimension = {
  id: string
  label: string
  icon: string
  tagline: string
  rows: ComparisonRow[]
}

// ── Schema strings (rendered as code blocks) ──────────────────────────────────

export const VI_SCHEMA = `const Vietnamese: Language = {
  // ── Identity ──────────────────────────
  name:    "Vietnamese",
  iso:     "vi",
  family:  "Austroasiatic → Vietic",
  type:    "Isolating / Analytic",
  speakers: "~97 million",

  // ── Sound System ──────────────────────
  phonology: {
    consonants: 22,
    vowels:     14,   // monophthongs + diphthongs
    tones:       6,   // ngang · huyền · sắc · hỏi · ngã · nặng
    rhythm:    "syllable-timed",
    syllable:  "(C)(G)V(C)",  // max 1 C before/after nucleus
    clusters:  false,
  },

  // ── Word Structure ─────────────────────
  morphology: {
    type:       "isolating",  // words NEVER change form
    inflection: false,
    tense:      "lexical",    // đã (past) · đang (prog) · sẽ (future)
    plural:     "lexical",    // các · những · vài · nhiều
    agreement:  false,        // verb = invariable always
    articles:   false,
    classifiers: true,        // con · cái · cây · chiếc · tờ · bức ...
  },

  // ── Sentence Structure ─────────────────
  syntax: {
    wordOrder:   "SVO",
    adjPosition: "post-nominal",       // người đẹp = person beautiful
    proDropping: true,
    questions:   "sentence-final particle",  // Anh đi không?
    passive:     "bị (adversative) / được (benefactive)",
    negation:    "pre-verbal particle",      // không · chưa
  },

  // ── Writing System ─────────────────────
  orthography: {
    script:        "Quốc ngữ (Latin-based, 17th c.)",
    unit:          "syllable",   // each syllable = separate written token
    regularity:    "high",       // spelling ≈ pronunciation
    toneDiacritics: 5,           // grave huyền · acute sắc · hook hỏi · tilde ngã · dot nặng
    vowelDiacritics: 7,          // â ă ê ô ơ ư đ
  },
}`

export const EN_SCHEMA = `const English: Language = {
  // ── Identity ──────────────────────────
  name:    "English",
  iso:     "en",
  family:  "Indo-European → West Germanic",
  type:    "Analytic (weakly fusional)",
  speakers: "~1.5 billion (L1+L2)",

  // ── Sound System ──────────────────────
  phonology: {
    consonants: 24,
    vowels:     20,   // monophthongs + diphthongs (RP)
    tones:       0,   // intonation only — not lexically contrastive
    rhythm:    "stress-timed",   // unstressed syllables compressed → schwa
    syllable:  "(C³)V(C⁴)",     // up to 7 consonants around nucleus
    clusters:  true,             // strengths /stɹɛŋkθs/ · sixths /sɪksθs/
  },

  // ── Word Structure ─────────────────────
  morphology: {
    type:       "analytic / weakly fusional",
    inflection: "partial",    // -s · -ed · -ing · -er · -est
    tense:      "morphological",  // 12 tense/aspect combinations
    plural:     "morphological",  // -s · -es · irregular (mice, children)
    agreement:  "3sg-pres",   // she go-s, not *she go
    articles:   true,         // a · an · the (complex rules)
    classifiers: false,
  },

  // ── Sentence Structure ─────────────────
  syntax: {
    wordOrder:   "SVO",
    adjPosition: "pre-nominal",    // a beautiful person
    proDropping: false,            // subject always required
    questions:   "aux inversion",  // Do you go? / Are you going?
    passive:     "be + past participle",
    negation:    "aux + not",      // do not · cannot · is not
  },

  // ── Writing System ─────────────────────
  orthography: {
    script:        "Latin",
    unit:          "word",
    regularity:    "low",    // though/through/tough/cough/hiccough
    toneDiacritics: 0,
    vowelDiacritics: 0,      // only in loanwords: café, naïve
  },
}`

// ── Dimension data ─────────────────────────────────────────────────────────────

export const LANGUAGE_DIMENSIONS: Dimension[] = [
  {
    id: 'phonology',
    label: 'Phonology',
    icon: '🔊',
    tagline: 'How the language encodes sound',
    rows: [
      {
        id: 'tonal-system',
        attribute: 'Tonal vs Stress System',
        description: 'How pitch is used to convey information',
        vi: {
          label: '6 lexical tones',
          detail: 'Pitch is phonemic — changing tone changes word meaning entirely. "ba" can mean three, father, aunt, or waste depending on tone.',
          examples: ['ba (three)', 'bà (grandmother)', 'bá (uncle)', 'bả (bait)', 'bã (residue)', 'bạ (random)'],
        },
        en: {
          label: 'Non-tonal; uses stress + intonation',
          detail: 'Pitch is used for pragmatic intonation (rising = question, falling = statement) but never to distinguish individual word meanings.',
          examples: ['REcord (noun) vs reCORD (verb)', 'Rising intonation on questions'],
        },
        risk: 'low',
        ieltsTip: 'Vietnamese tones do not interfere with English — but English rising/falling intonation patterns must be learned separately for Speaking band.',
      },
      {
        id: 'rhythm',
        attribute: 'Speech Rhythm',
        description: 'The timing pattern of syllables in connected speech',
        vi: {
          label: 'Syllable-timed',
          detail: 'Every syllable is approximately equal in length. There is no distinction between strong and weak syllables.',
        },
        en: {
          label: 'Stress-timed',
          detail: 'Stressed syllables occur at roughly equal intervals. Unstressed syllables are compressed and reduced to schwa /ə/ — giving English its characteristic "beat".',
          examples: ['"photography" → pho-TOG-ra-phy (stress on 2nd)', 'Schwa reduction: "the" /ðə/, "of" /əv/'],
        },
        risk: 'high',
        ieltsTip: 'Speaking: equal-weight syllables sound robotic to examiners. Practise word stress and schwa reduction — "important" /ɪmˈpɔːtənt/ not /ɪm-por-tant/.',
      },
      {
        id: 'syllable-structure',
        attribute: 'Syllable Complexity',
        description: 'How many consonants can surround the vowel nucleus',
        vi: {
          label: '(C)(G)V(C) — max 1 C each side',
          detail: 'Vietnamese syllables are simple: at most one consonant before the vowel and one after. No consonant clusters are permitted.',
          examples: ['ba /ɓa/', 'trăng /ʈaŋ/ — "tr" is a single phoneme', 'nghĩ /ŋi/'],
        },
        en: {
          label: '(C³)V(C⁴) — clusters on both sides',
          detail: 'English allows up to 3 consonants before the vowel and 4 after, creating complex clusters that do not exist in Vietnamese.',
          examples: ['strengths /stɹɛŋkθs/ — 3 before, 3 after', 'splash /splæʃ/', 'twelfths /twɛlfθs/'],
        },
        risk: 'high',
        ieltsTip: 'Speaking: avoid inserting helper vowels into clusters ("uh-school" → "school", "de-stress" → "stress"). Practise /sp/, /st/, /str/, /spl/, /skr/ clusters.',
      },
      {
        id: 'final-consonants',
        attribute: 'Word-final Consonants',
        description: 'Which sounds are permitted at the end of a syllable',
        vi: {
          label: 'Only stops + nasals; no voiced finals',
          detail: 'Vietnamese allows only: -p, -t, -c/ch (stops) and -m, -n, -ng/nh (nasals) in final position. No fricatives, no voiced stops finally.',
          examples: ['không /xoŋ/', 'tốt /tot/', 'học /hok/'],
        },
        en: {
          label: 'Any consonant or cluster; voiced finals normal',
          detail: 'English has no restriction on final consonants. Fricatives, affricates, liquids, and complex clusters all occur finally. Voiced/voiceless contrast is maintained.',
          examples: ['loves /lʌvz/', 'health /hɛlθ/', 'change /tʃeɪndʒ/', 'texts /tɛksts/'],
        },
        risk: 'high',
        ieltsTip: 'Speaking: fully pronounce final consonants — they carry grammatical information (-s for plural/3rd person, -ed for past). "walk" ≠ "walked" in English.',
      },
      {
        id: 'vowel-inventory',
        attribute: 'Vowel Inventory',
        description: 'The set of distinct vowel sounds in the language',
        vi: {
          label: '~14 vowels including ơ /əː/, ư /ɨ/, â /ə/',
          detail: 'Vietnamese has unique unrounded back and central vowels (ơ, ư, â) absent from English. Vowels interact with tones to produce a rich phonological space.',
          examples: ['ơ /əː/ — as in "thơ" (poetry)', 'ư /ɨ/ — as in "thư" (letter)', 'â /ə/ — as in "tân" (new)'],
        },
        en: {
          label: '~20 vowels including diphthongs (RP)',
          detail: 'English has a large vowel inventory including 8 monophthongs and 8 diphthongs in Received Pronunciation. Many are absent from Vietnamese.',
          examples: ['/æ/ "cat"', '/ɜː/ "bird"', '/aɪ/ "my"', '/eɪ/ "say"', '/ɔɪ/ "boy"'],
        },
        risk: 'medium',
        ieltsTip: 'Speaking: /æ/ (cat) and /ɑː/ (car) are distinct in English. The /ɜː/ vowel (heard, bird, word) has no Vietnamese equivalent — practise separately.',
      },
    ],
  },
  {
    id: 'morphology',
    label: 'Morphology',
    icon: '🔧',
    tagline: 'How the language builds and modifies words',
    rows: [
      {
        id: 'morph-type',
        attribute: 'Morphological Type',
        description: 'How grammatical meaning is added to words',
        vi: {
          label: 'Isolating (analytic)',
          detail: 'Words are invariable roots. Grammatical meaning is expressed by separate function words placed around the root, never by changing the root itself.',
          examples: ['tôi đi → "I go"', 'tôi đã đi → "I went" (same verb)', 'chúng tôi đi → "we go" (same verb)'],
        },
        en: {
          label: 'Analytic / weakly fusional',
          detail: 'Words change form to encode grammatical relations. Inflectional suffixes attach to roots. Historically fusional (Latin), now mostly analytic with remnant inflection.',
          examples: ['go → went (irregular past)', 'walk → walked → walking', 'child → children'],
        },
        risk: 'critical',
        ieltsTip: 'This single difference causes the majority of Vietnamese grammar errors in IELTS Writing. Every verb, noun, and adjective form change in English must be actively applied.',
      },
      {
        id: 'tense-aspect',
        attribute: 'Tense & Aspect Marking',
        description: 'How time reference is encoded in the grammar',
        vi: {
          label: 'Lexical — time particles (đã/đang/sẽ)',
          detail: 'Time is expressed by optional pre-verbal particles: đã (completed), đang (ongoing/progressive), sẽ (future). The verb itself never changes. Context can omit even these particles.',
          examples: ['Tôi ăn (I eat / I ate / I will eat — context-dependent)', 'Tôi đã ăn (I already ate)', 'Tôi đang ăn (I am eating)'],
        },
        en: {
          label: 'Morphological — 12 tense/aspect combinations',
          detail: 'English grammaticalises tense through verb morphology: -ed (past simple), -ing + be (progressive), has/have + -en (perfect), and combinations thereof. Omitting these changes meaning.',
          examples: ['I eat / I ate / I have eaten / I was eating / I had eaten', 'She works vs She worked — different meaning'],
        },
        risk: 'critical',
        ieltsTip: 'Writing Task 2: use consistent past tense with -ed endings when narrating. Writing Task 1: use present simple for facts, present perfect for trends. Never write "Yesterday I work late."',
      },
      {
        id: 'plural-marking',
        attribute: 'Plural Marking',
        description: 'How quantity of nouns is grammatically encoded',
        vi: {
          label: 'Lexical — quantifiers, no morpheme',
          detail: 'Nouns are invariable regardless of quantity. Plurality is expressed by quantifiers (các, những, vài, nhiều) or numerals. The noun itself never changes.',
          examples: ['một quyển sách / hai quyển sách (same noun)', 'các sinh viên (the students — các adds plural sense)', 'nhiều người (many people)'],
        },
        en: {
          label: 'Morphological — regular -s/-es; irregular forms',
          detail: 'Most nouns require -s or -es in plural. A set of irregular nouns have unpredictable plural forms. Countable and uncountable nouns behave differently.',
          examples: ['book → books', 'child → children', 'person → people', 'information (uncountable — no plural)'],
        },
        risk: 'high',
        ieltsTip: 'Writing: count nouns after numerals must be plural ("three books" not "three book"). Uncountable nouns (information, advice, research, knowledge, evidence) take no -s ever.',
      },
      {
        id: 'subject-verb-agreement',
        attribute: 'Subject-Verb Agreement',
        description: 'Whether the verb changes to match the subject',
        vi: {
          label: 'None — verb is invariable',
          detail: 'Vietnamese verbs never agree with the subject. The same verb form is used regardless of person, number, or tense.',
          examples: ['Tôi đi / Anh đi / Họ đi — all use same verb "đi"'],
        },
        en: {
          label: '3rd-person singular present: -s suffix',
          detail: 'English requires a third-person singular -s on present-tense verbs (he/she/it + verb-s). The plural and other persons take the base form. Past tense is uniform.',
          examples: ['I go / You go / He goes / They go', 'The company produces → company produce-s', '*She go (incorrect)'],
        },
        risk: 'high',
        ieltsTip: 'Writing: check every present-tense verb in sentences with he/she/it/singular noun subjects. "The government spend" → "The government spends".',
      },
      {
        id: 'articles',
        attribute: 'Article System',
        description: 'Grammatical words marking definiteness and specificity of nouns',
        vi: {
          label: 'No articles — definiteness is contextual',
          detail: 'Vietnamese has no article system. Definiteness and specificity are inferred from context, word order, or demonstratives (này/kia). No word equivalent to "the" or "a" exists.',
          examples: ['Con mèo chạy đi. (A cat / The cat ran away — ambiguous without context)', 'cái bàn này (this table) — demonstrative clarifies'],
        },
        en: {
          label: '"a/an" (indefinite), "the" (definite), Ø (zero)',
          detail: 'English has a 3-way article system with complex rules. "a/an" introduces countable singular nouns first-mention. "the" refers to shared knowledge or second-mention. Zero article with uncountable/plural generics.',
          examples: ['I saw a dog. The dog barked.', '"Life is short." (generic — zero article)', '"The water in this bottle" (definite specific)'],
        },
        risk: 'critical',
        ieltsTip: 'Rule of thumb: 1st mention countable singular = "a/an". Same noun 2nd mention = "the". Generic statements use zero article: "Technology changes society" (not "the technology").',
      },
      {
        id: 'classifiers',
        attribute: 'Classifier System',
        description: 'Mandatory categorisation words when counting nouns',
        vi: {
          label: 'Mandatory — 30+ classifiers by semantic class',
          detail: 'Before any counted noun, a classifier must appear that categorises the noun by shape, animacy, or cultural status. Classifiers are not optional.',
          examples: ['con chó (animal classifier + dog)', 'cái bàn (object classifier + table)', 'tờ báo (flat-object classifier + newspaper)', 'bức tranh (framed-art classifier + painting)'],
        },
        en: {
          label: 'None — quasi-classifiers only for uncountable nouns',
          detail: 'English has no classifier system for countable nouns. Uncountable nouns use measure phrases (a piece of, a slice of, a sheet of) but these are not grammatically obligatory classifiers.',
          examples: ['a piece of advice', 'a sheet of paper', 'two dogs (no classifier)'],
        },
        risk: 'low',
        ieltsTip: 'Classifiers cause no errors in English — Vietnamese does not omit classifiers when speaking English. Low transfer risk in this direction.',
      },
    ],
  },
  {
    id: 'syntax',
    label: 'Syntax',
    icon: '🌿',
    tagline: 'How the language assembles words into sentences',
    rows: [
      {
        id: 'word-order',
        attribute: 'Basic Word Order',
        description: 'Default order of Subject, Verb, Object in declarative sentences',
        vi: {
          label: 'SVO',
          detail: 'Vietnamese is consistently SVO like English. The subject precedes the verb, which precedes the object. Topic-fronting is also common for emphasis.',
          examples: ['Tôi ăn cơm. (I eat rice) — S-V-O', 'Cơm, tôi ăn rồi. (Rice, I have eaten) — topic fronted'],
        },
        en: {
          label: 'SVO (rigid)',
          detail: 'English word order is more fixed than Vietnamese due to its reduced case system. SVO is nearly obligatory; deviation signals marked emphasis or questions.',
          examples: ['She reads books. (S-V-O)', 'The man the dog bit. — only in relative clause contexts'],
        },
        risk: 'low',
        ieltsTip: 'Basic word order is not a source of error — both languages share SVO. Transfer is neutral here.',
      },
      {
        id: 'adjective-position',
        attribute: 'Adjective Position',
        description: 'Where attributive adjectives are placed relative to the noun',
        vi: {
          label: 'Post-nominal (noun + adjective)',
          detail: 'In Vietnamese, adjectives typically follow the noun they modify: noun + adjective. This is the opposite of English for most adjectives.',
          examples: ['người đẹp (person beautiful = beautiful person)', 'ngôi nhà lớn (house big = big house)', 'vấn đề quan trọng (issue important = important issue)'],
        },
        en: {
          label: 'Pre-nominal (adjective + noun)',
          detail: 'In English, attributive adjectives precede the noun. When multiple adjectives appear, they follow a fixed order: Opinion-Size-Age-Shape-Colour-Origin-Material.',
          examples: ['a beautiful person', 'a big house', 'a lovely small old rectangular green French silver knife'],
        },
        risk: 'medium',
        ieltsTip: 'Writing: English adjectives come before the noun they describe. Multiple adjectives have an implicit order — Opinion before Size before Colour before Origin before Material.',
      },
      {
        id: 'pro-drop',
        attribute: 'Subject Dropping (Pro-drop)',
        description: 'Whether the subject pronoun can be omitted when inferable',
        vi: {
          label: 'Pro-drop — subject routinely omitted',
          detail: 'When the subject is inferable from context, Vietnamese regularly omits it. This is grammatically correct and stylistically preferred in discourse.',
          examples: ['— Anh có khỏe không? — Khỏe. (How are you? — Fine. [I is omitted])', 'Đến đây rồi làm gì? (Having arrived here, what to do? — subject omitted)'],
        },
        en: {
          label: 'Non-pro-drop — subject always required',
          detail: 'English requires an explicit subject in every finite clause. The only exception is imperative mood. Omitting the subject is ungrammatical.',
          examples: ['*Am going to the store. → I am going to the store.', '"Go!" (imperative — only valid pro-drop context)'],
        },
        risk: 'medium',
        ieltsTip: 'Writing: always include a subject pronoun or noun. Fragment sentences starting with verbs (except imperatives) are grammatically incorrect in formal English.',
      },
      {
        id: 'question-formation',
        attribute: 'Question Formation',
        description: 'How yes/no questions are formed grammatically',
        vi: {
          label: 'Sentence-final particle (không/chưa/à)',
          detail: 'Questions are formed by adding a particle to the end of a declarative sentence. No word order change is needed. Different particles carry different nuances (neutral/experience/softened).',
          examples: ['Anh đi không? (You go [question]? = Are you going?)', 'Em ăn chưa? (You eat [experience-question]? = Have you eaten yet?)', 'Đúng à? (Correct [softened]? = Right?)'],
        },
        en: {
          label: 'Auxiliary inversion / do-support',
          detail: 'English requires inverting the subject and auxiliary verb, or introducing "do" if no auxiliary is present. This obligatory inversion is a major structural difference.',
          examples: ['Are you going? (inversion)', 'Do you go? (do-support for no auxiliary)', 'Have you eaten? (inversion)', '*You go? (incorrect as yes/no question in standard English)'],
        },
        risk: 'high',
        ieltsTip: 'Speaking: avoid "You can tell me why?" (declarative order) — use "Can you tell me why?" (inversion). Indirect questions after "I wonder/know" use declarative order: "I wonder why he left."',
      },
      {
        id: 'passive-voice',
        attribute: 'Passive Voice',
        description: 'How the object of an action becomes the grammatical subject',
        vi: {
          label: 'Lexical — bị (adversative) / được (benefactive)',
          detail: 'Vietnamese uses two separate lexical verbs to mark passive: "bị" implies an undesirable outcome, "được" implies a desirable one. The verb itself does not change.',
          examples: ['Anh ấy bị phạt. (He [adversative] punish = He was punished — bad for him)', 'Cô ấy được khen. (She [benefactive] praise = She was praised — good for her)'],
        },
        en: {
          label: 'Morphological — be + past participle',
          detail: 'English passive uses the auxiliary "be" in any tense + the past participle of the main verb. No valence distinction between good/bad outcomes. Agent can be added with "by".',
          examples: ['He was punished (by the teacher).', 'The report has been written.', 'Mistakes were made.'],
        },
        risk: 'medium',
        ieltsTip: 'Writing Task 1 (charts/processes): passive is common — "The data shows that X has been affected". Task 2: use passive to avoid "I" in formal contexts — "It is widely argued that...".',
      },
      {
        id: 'negation',
        attribute: 'Negation',
        description: 'How negative meaning is grammatically encoded',
        vi: {
          label: 'Pre-verbal particle — không / chưa',
          detail: '"Không" negates general statements; "chưa" negates and implies "not yet" (anticipating future completion). Both precede the verb directly.',
          examples: ['Tôi không đi. (I not go = I do not go)', 'Tôi chưa ăn. (I not-yet eat = I have not eaten yet)'],
        },
        en: {
          label: 'Auxiliary + not (do not / cannot / is not)',
          detail: 'English negation requires an auxiliary verb followed by "not". Without a modal or be-verb, "do/does/did" must be introduced — a process called do-support.',
          examples: ['I do not go.', 'She does not eat.', 'He cannot sleep.', '*I not go. (incorrect)'],
        },
        risk: 'high',
        ieltsTip: 'Speaking/Writing: "I not agree" is incorrect — must be "I do not agree". The auxiliary is not optional in English negation.',
      },
    ],
  },
  {
    id: 'lexicon',
    label: 'Lexicon',
    icon: '📖',
    tagline: 'How the language organises its vocabulary',
    rows: [
      {
        id: 'etymology',
        attribute: 'Vocabulary Sources',
        description: 'Where the bulk of the lexicon originates historically',
        vi: {
          label: '~60% Sino-Vietnamese; native Vietic core',
          detail: 'Approximately 60% of Vietnamese vocabulary is Sino-Vietnamese — words borrowed from Classical Chinese with adapted pronunciation. The emotional/everyday core is native Vietic.',
          examples: ['kinh tế (economy) ← 經濟', 'xã hội (society) ← 社會', 'quốc gia (nation) ← 國家', 'vui/buồn/đau (joy/sadness/pain) — native'],
        },
        en: {
          label: '~60% Latinate (French, Latin, Greek); Germanic core',
          detail: 'About 60% of English vocabulary is Latinate (mostly via Norman French). The emotional/everyday core is Germanic. Technical/academic vocabulary is overwhelmingly Latinate.',
          examples: ['economy ← Greek οἰκονομία', 'society ← Latin societas', 'nation ← Latin natio', 'happy/sad/pain — Germanic'],
        },
        risk: 'low',
        ieltsTip: 'Advantage: Sino-Vietnamese borrowings often parallel Latin-English cognates — kinh tế/economy, văn hóa/culture, khoa học/science. This helps Academic Word List recognition.',
      },
      {
        id: 'pronoun-system',
        attribute: 'Personal Pronoun System',
        description: 'How speakers refer to themselves and others',
        vi: {
          label: 'Kinship-based — 20+ forms encoding social relationship',
          detail: 'Vietnamese has no fixed pronoun set. Kinship terms are repurposed as pronouns: the choice of "I-word" and "you-word" encodes relative age, status, and intimacy. Choosing wrongly is a social error.',
          examples: ['tôi/mình/tao/em/anh/chị (all mean "I" in different contexts)', 'bạn/anh/chị/em/mày (all mean "you" in different contexts)'],
        },
        en: {
          label: 'Fixed — I / you / he / she / it / we / they',
          detail: 'English uses a small, fixed set of personal pronouns. Social register and politeness are expressed through modal verbs and sentence structure, not pronoun choice.',
          examples: ['I (always I, regardless of age/status)', '"Could you...?" (polite) vs "Give me..." (direct) — not "could thou...?"'],
        },
        risk: 'medium',
        ieltsTip: 'Speaking/Writing: use standard English pronouns. Avoid importing kinship-based deference into English (do not say "My teacher thinks..." meaning "I think..."). Academic writing uses "I" or impersonal "it is argued that...".',
      },
      {
        id: 'politeness-encoding',
        attribute: 'Politeness Encoding',
        description: 'Where in the grammar politeness is expressed',
        vi: {
          label: 'Lexical — encoded in pronoun/particle selection',
          detail: 'In Vietnamese, shifting register means choosing different pronouns and sentence-final softening particles (ạ, nhé, nhỉ). Politeness is embedded in vocabulary, not syntax.',
          examples: ['Anh cho em hỏi... (formal request using kinship hierarchy)', '"ạ" particle at end signals deference', '"dạ/vâng" (yes) — register-specific affirmatives'],
        },
        en: {
          label: 'Grammatical — encoded in modality and indirectness',
          detail: 'English politeness is marked by modal verbs (could, would, might), indirect speech acts, and hedging devices. The pronoun system does not shift for politeness.',
          examples: ['"Could you please...?" (modal for politeness)', '"I was wondering if..." (indirect)', '"It might be worth considering..." (hedged)'],
        },
        risk: 'medium',
        ieltsTip: 'Speaking Part 3: use modal hedges for opinions — "I would argue that..." / "It could be suggested that...". Direct assertion sounds blunt in formal English contexts.',
      },
      {
        id: 'academic-vocab',
        attribute: 'Academic Vocabulary Affinity',
        description: 'How accessible English academic vocabulary is to the learner',
        vi: {
          label: 'High affinity via Sino-Vietnamese parallels',
          detail: 'Sino-Vietnamese vocabulary shares Chinese roots with Japanese/Korean academic borrowings, and these Chinese concepts align closely with Latinate English academic terms. This gives Vietnamese learners a structural advantage in IELTS vocabulary.',
          examples: ['kinh tế ↔ economy', 'môi trường ↔ environment', 'phát triển ↔ development', 'giáo dục ↔ education'],
        },
        en: {
          label: 'AWL is predominantly Latinate',
          detail: 'The Academic Word List (AWL) consists of ~570 word families predominantly from Latin and Greek via French. These terms carry the formal register expected in IELTS writing.',
          examples: ['analyse, concept, context, define, emerge, factor, identify, indicate, major, occur'],
        },
        risk: 'low',
        ieltsTip: 'Advantage: use your Sino-Vietnamese background as a bridge. If you know the Chinese-rooted Vietnamese term, the English academic cognate is often structurally similar.',
      },
    ],
  },
  {
    id: 'orthography',
    label: 'Writing System',
    icon: '✍️',
    tagline: 'How the language maps sound to symbol',
    rows: [
      {
        id: 'script-type',
        attribute: 'Script',
        description: 'The writing system used',
        vi: {
          label: 'Quốc ngữ — Latin alphabet with diacritics',
          detail: 'The modern Vietnamese script (Quốc ngữ) uses the Latin alphabet with additional diacritics for tone and modified vowels. Introduced by Portuguese missionaries in the 17th century, standardised in the 19th–20th century.',
          examples: ['26 base letters + 7 modified vowels: ă â ê ô ơ ư đ', '5 tone diacritics: grave (huyền), acute (sắc), hook (hỏi), tilde (ngã), dot-below (nặng)'],
        },
        en: {
          label: 'Latin alphabet, 26 letters, no diacritics',
          detail: 'English uses the 26-letter Latin alphabet without any diacritics for native words. Borrowed words may retain diacritics (café, naive, résumé) but these are increasingly dropped.',
          examples: ['26 letters A–Z', '"Naive" and "naïve" both acceptable', 'No stress or tone marking in standard orthography'],
        },
        risk: 'low',
        ieltsTip: 'Low transfer risk. Both scripts are Latin-based. No script barrier to overcome.',
      },
      {
        id: 'orthographic-unit',
        attribute: 'Orthographic Unit',
        description: 'What a "written word" corresponds to linguistically',
        vi: {
          label: 'Syllable — one syllable = one written token',
          detail: 'In Vietnamese orthography, each syllable is written as a separate token with spaces between syllables. Since each syllable is also a morpheme, this means each written unit = one morpheme.',
          examples: ['học sinh (student) = 2 syllables, 2 written units', 'cảm ơn (thank you) = 2 units, not one "word"', 'Việt Nam = 2 units'],
        },
        en: {
          label: 'Word — multiple syllables written as one unit',
          detail: 'English orthography treats the word (not the syllable) as the unit. Polysyllabic words are written without internal spaces. Compound words may be hyphenated or solid.',
          examples: ['"beautiful" = 3 syllables, 1 written unit', '"self-aware" or "self aware" or "selfaware" — variation in compounds', '"re-evaluate" (hyphen separates prefix + root)'],
        },
        risk: 'low',
        ieltsTip: 'Minor issue: Vietnamese learners sometimes write compound or multi-syllable words with spaces. "every day" (adverb) vs "everyday" (adjective) is an English-specific distinction.',
      },
      {
        id: 'phonological-regularity',
        attribute: 'Spelling Regularity',
        description: 'How consistently spelling predicts pronunciation',
        vi: {
          label: 'High — near-transparent orthography',
          detail: 'Vietnamese spelling is highly regular: given a written syllable, pronunciation is predictable. Diacritics encode tone and vowel quality unambiguously.',
          examples: ['Every written vowel maps to one phoneme', '"ng" = /ŋ/, "nh" = /ɲ/, "ph" = /f/ — consistent digraphs', 'No silent letters (except some dialect variation)'],
        },
        en: {
          label: 'Low — opaque historical orthography',
          detail: 'English spelling preserves historical pronunciation layers (Anglo-Saxon, Norse, Norman French, Latin). The same letter combination can represent multiple sounds, and the same sound can be spelled many ways.',
          examples: ['"ough" = /ʌf/ (rough) / /oʊ/ (though) / /uː/ (through) / /ɒf/ (cough) / /aʊ/ (plough)', '"their/there/they\'re" — same sound, different meanings', '"knight" — silent k and gh'],
        },
        risk: 'medium',
        ieltsTip: 'Writing: English spelling must be memorised, not derived. Common IELTS spelling mistakes: separate, necessary, recommend, government, although, environment, technology.',
      },
      {
        id: 'phoneme-grapheme',
        attribute: 'Phoneme Count vs Letter Count',
        description: 'Mismatch between sounds used and symbols available',
        vi: {
          label: '~22 consonants, 14 vowels — diacritics fill the gap',
          detail: 'The 26-letter base alphabet is insufficient for Vietnamese phonology. Diacritics on vowels and consonant digraphs extend the system to cover all 36–38 phonemes unambiguously.',
          examples: ['ă /aː/ vs â /ə/ vs a /a/ — 3 distinct sounds', '"ngh" before i/e — consistent rule', '"c/k/q" — same sound, positional spelling rules'],
        },
        en: {
          label: '44 phonemes mapped to 26 letters — high ambiguity',
          detail: 'English has ~44 phonemes but only 26 letters and no tone/vowel diacritics. The system relies on multi-letter digraphs, silent letters, and context-dependent rules — making it one of the most opaque alphabetic systems.',
          examples: ['"c" = /k/ (cat) or /s/ (city)', '"th" = /θ/ (thin) or /ð/ (this)', '"ea" = /iː/ (beach) / /ɛ/ (bread) / /eɪ/ (great)'],
        },
        risk: 'medium',
        ieltsTip: 'IELTS Reading: do not read letter-by-letter like Vietnamese — learn whole-word recognition patterns. Pronunciation and spelling diverge widely in English.',
      },
    ],
  },
]

// ── IELTS Transfer Summary ────────────────────────────────────────────────────

export type TransferItem = {
  area: string
  impact: string
  fixes: string[]
}

export const CRITICAL_TRANSFERS: TransferItem[] = [
  {
    area: 'Article system (a/an/the)',
    impact: 'Absent in Vietnamese — leads to systematic omission in all 4 skills',
    fixes: [
      'First mention of a countable singular noun → "a/an"',
      'Second mention or shared reference → "the"',
      'Generic/uncountable/plural → zero article: "Technology is important"',
    ],
  },
  {
    area: 'Tense morphology (-ed, -s, auxiliary)',
    impact: 'Vietnamese marks tense lexically; morphological marking must be actively applied in English',
    fixes: [
      'Past narration: every main verb needs -ed (walked, discussed, implemented)',
      '3rd person singular present: verb + -s (she works, the data shows)',
      'Perfect aspect: have/has + past participle (has increased, have been)',
    ],
  },
  {
    area: 'Plural marking (-s)',
    impact: 'No plural morpheme in Vietnamese; leads to omission of -s on countable nouns',
    fixes: [
      'After numerals: "three factors" not "three factor"',
      'Uncountable nouns never take -s: information, advice, research, knowledge',
      'Irregular plurals must be memorised: criteria, phenomena, analyses',
    ],
  },
  {
    area: 'Question formation (auxiliary inversion)',
    impact: 'Vietnamese uses sentence-final particles; inversion is the opposite structural strategy',
    fixes: [
      'Yes/no questions: "Do you...?", "Are you...?", "Have you...?" — not "You...?"',
      'After "wonder/know/ask" use declarative order: "I wonder why he did this."',
      'Tag questions: "is it?", "don\'t you?" — require auxiliary matching',
    ],
  },
]

export const HIGH_TRANSFERS: TransferItem[] = [
  {
    area: 'Consonant clusters (Speaking/Pronunciation)',
    impact: 'Vietnamese has no clusters; English has up to 7 consonants in sequence',
    fixes: [
      'Do not insert /ə/ between consonants: "school" not "uh-school"',
      'Practise: /sp/, /st/, /str/, /spl/, /skr/, /ks/, /sts/ minimal pairs',
      'Final clusters carry grammar: walk vs walked vs walks',
    ],
  },
  {
    area: 'Stress-timed rhythm (Speaking Fluency)',
    impact: 'Equal-syllable stress sounds monotone and robotic to English listeners',
    fixes: [
      'Reduce unstressed syllables to schwa: "the" /ðə/, "of" /əv/, "and" /ən/',
      'Identify and stress content words: NOUNS, VERBS, ADJECTIVES, ADVERBS',
      'Connected speech: weak forms and elision are expected, not sloppy',
    ],
  },
  {
    area: 'Subject-verb agreement',
    impact: 'No agreement in Vietnamese; "she go" errors are common',
    fixes: [
      'Present tense + 3rd-person subject → add -s: "The data shows..."',
      'Be-verb: "he is/she is/it is" not "he are"',
      'Collective nouns: "The committee has decided" (British) / "have" (American)',
    ],
  },
]
