// ── Types ─────────────────────────────────────────────────────────────────────

export type ParaphraseChange = {
  from: string
  to: string
  reason: string
}

export type ParaphraseExample = {
  label: string          // short name shown on the card header
  original: string
  paraphrased: string
  changes: ParaphraseChange[]
  trap?: string          // common wrong move at this example
}

export type ParaphraseTechnique = {
  name: string
  description: string
  examples: ParaphraseExample[]
}

export type ParaphraseLevel = {
  level: 1 | 2 | 3
  badge: 'Beginner' | 'Intermediate' | 'Advanced'
  title: string          // e.g. "Synonym Substitution"
  focus: string          // one-line what this level trains
  techniques: ParaphraseTechnique[]
  examTip: string
}

export type ParaphraseSkillGuide = {
  skill: 'writing' | 'reading'
  label: string
  icon: string
  intro: string
  purpose: string[]
  levels: ParaphraseLevel[]
}

// ── Writing Guide ─────────────────────────────────────────────────────────────

const WRITING_LEVELS: ParaphraseLevel[] = [
  {
    level: 1,
    badge: 'Beginner',
    title: 'Synonym Substitution',
    focus: 'Replace individual words with synonyms and change word forms',
    techniques: [
      {
        name: 'Swap content words with synonyms',
        description:
          'Replace nouns, verbs, and adjectives with academic synonyms. Aim for at least 3–4 swaps per sentence. Do NOT change grammar — only the vocabulary.',
        examples: [
          {
            label: 'Task 2 prompt paraphrase',
            original:
              'Many people believe that governments should spend more money on public transport.',
            paraphrased:
              'A growing number of individuals argue that authorities ought to invest greater resources in public transportation.',
            changes: [
              { from: 'Many people',   to: 'A growing number of individuals', reason: 'Synonym — avoids copying the exact phrase' },
              { from: 'believe',       to: 'argue',                           reason: 'Synonym verb — slightly stronger register' },
              { from: 'governments',   to: 'authorities',                     reason: 'Synonym — more formal' },
              { from: 'should spend',  to: 'ought to invest',                 reason: 'Synonym modal + verb — same meaning' },
              { from: 'more money',    to: 'greater resources',               reason: 'Synonym — avoids repetition of "money"' },
              { from: 'public transport', to: 'public transportation',        reason: 'British → American variant (acceptable)' },
            ],
          },
          {
            label: 'Word form change (nominalisation)',
            original:  'Technology has rapidly developed and changed the way we communicate.',
            paraphrased: 'The rapid development of technology has transformed communication.',
            changes: [
              { from: 'rapidly developed', to: 'rapid development',          reason: 'Verb → noun (nominalisation) — academic register' },
              { from: 'changed the way we communicate', to: 'transformed communication', reason: 'Clause → noun phrase — more concise' },
            ],
            trap: 'Do not use a thesaurus blindly — "governments" → "regimes" changes meaning (regimes implies authoritarian rule).',
          },
        ],
      },
      {
        name: 'Change word form (same root)',
        description:
          'Keep the same root word but shift its grammatical class: noun → verb, adjective → adverb, verb → noun. This changes sentence structure without needing a synonym.',
        examples: [
          {
            label: 'Adjective → noun',
            original:   'It is important that children exercise regularly.',
            paraphrased: 'The importance of regular exercise for children cannot be overstated.',
            changes: [
              { from: 'important',  to: 'importance',           reason: 'Adjective → noun (nominalisation)' },
              { from: 'exercise regularly', to: 'regular exercise', reason: 'Verb phrase → noun phrase' },
              { from: 'It is … that', to: 'The … cannot be overstated', reason: 'Dummy subject → emphatic structure' },
            ],
          },
        ],
      },
    ],
    examTip:
      'Your Task 2 introduction MUST paraphrase the prompt. Copying it word-for-word is penalised under Task Achievement. Aim for 3+ changes per sentence — synonyms alone at this level are enough for a Band 6 introduction.',
  },
  {
    level: 2,
    badge: 'Intermediate',
    title: 'Structural Restructuring',
    focus: 'Change grammar — voice, clause order, positive/negative — while keeping meaning',
    techniques: [
      {
        name: 'Active ↔ Passive voice',
        description:
          'Swap active and passive to change the sentence focus. Useful when you want to foreground the object or de-emphasise the agent.',
        examples: [
          {
            label: 'Active → Passive',
            original:   'Governments must fund public health campaigns.',
            paraphrased: 'Public health campaigns must be funded by governments.',
            changes: [
              { from: 'Governments must fund [object]', to: '[Object] must be funded by governments', reason: 'Active → passive shifts focus to "campaigns"' },
            ],
          },
          {
            label: 'Passive → Active',
            original:   'It has been argued by researchers that screen time affects sleep.',
            paraphrased: 'Researchers argue that screen time negatively affects sleep.',
            changes: [
              { from: 'It has been argued by researchers', to: 'Researchers argue', reason: 'Passive → active — more direct, concise' },
              { from: 'affects',   to: 'negatively affects', reason: 'Added adverb for precision' },
            ],
          },
        ],
      },
      {
        name: 'Reorder clauses',
        description:
          'Move the cause, result, or condition to a different position in the sentence. Subordinating conjunctions (because, although, since, while) can be repositioned.',
        examples: [
          {
            label: 'Cause clause repositioned',
            original:   'Because pollution levels have risen, many cities are becoming unliveable.',
            paraphrased: 'Many cities are becoming unliveable as a result of rising pollution levels.',
            changes: [
              { from: 'Because pollution levels have risen,', to: 'as a result of rising pollution levels', reason: 'Fronted subordinate clause → end-of-sentence prepositional phrase' },
              { from: 'are becoming unliveable',              to: 'are becoming unliveable',                reason: 'Main clause moved to front — changes emphasis' },
            ],
          },
        ],
      },
      {
        name: 'Positive ↔ Negative equivalence',
        description:
          'Rewrite a positive claim as a negative (or vice versa) using antonyms. "Few people deny…" means the same as "Most people accept…".',
        examples: [
          {
            label: 'Positive → Negative',
            original:   'Most people support stricter environmental laws.',
            paraphrased: 'Few people oppose the introduction of tighter environmental regulations.',
            changes: [
              { from: 'Most people support', to: 'Few people oppose',       reason: 'Positive → negative with antonym subject quantifier' },
              { from: 'stricter',            to: 'tighter',                  reason: 'Synonym adjective' },
              { from: 'environmental laws',  to: 'environmental regulations', reason: 'Synonym noun phrase' },
            ],
            trap: '"Few people deny" ≠ "Few people support" — negating the verb changes meaning. Always check: does the new sentence express the same idea?',
          },
        ],
      },
    ],
    examTip:
      'Structural restructuring is what moves a Band 6 essay to Band 7 under Lexical Resource and Grammatical Range. Use at least one structural change in your introduction paraphrase on top of synonyms.',
  },
  {
    level: 3,
    badge: 'Advanced',
    title: 'Concept-Level Rewrite',
    focus: 'Express the same idea through a completely different lens — perspective, abstraction, or clause fusion',
    techniques: [
      {
        name: 'Change perspective (subject swap)',
        description:
          'Make what was the object the new subject — the information is the same but the sentence is built from a different viewpoint.',
        examples: [
          {
            label: 'Object becomes subject',
            original:   'Technology has made communication faster and more accessible.',
            paraphrased: 'Communication has been accelerated and democratised by advances in technology.',
            changes: [
              { from: 'Technology [subject] has made communication [object]', to: 'Communication [subject] has been … by technology', reason: 'Perspective shift — object promoted to subject; passive required' },
              { from: 'faster',     to: 'accelerated',   reason: 'Adjective → past-participle verb — more dynamic' },
              { from: 'more accessible', to: 'democratised', reason: 'Concept-level synonym — "accessible to all" = "democratised"' },
            ],
          },
        ],
      },
      {
        name: 'Abstract ↔ Concrete reframing',
        description:
          'Translate an abstract statement ("There is a concern…") into a concrete one ("More people worry…") or vice versa. This changes sentence type and register simultaneously.',
        examples: [
          {
            label: 'Abstract → Concrete',
            original:   'There is a growing concern about the impact of social media on mental health.',
            paraphrased: 'More and more people are worried about how social media platforms are affecting psychological wellbeing.',
            changes: [
              { from: 'There is a growing concern', to: 'More and more people are worried',     reason: 'Existential clause → personal subject — more concrete and direct' },
              { from: 'the impact of',              to: 'how … are affecting',                  reason: 'Noun phrase → verb clause — describes the process' },
              { from: 'mental health',              to: 'psychological wellbeing',               reason: 'Synonym — more formal register' },
            ],
          },
          {
            label: 'Concrete → Abstract',
            original:   'Many students spend hours every day on their phones instead of studying.',
            paraphrased: 'Excessive smartphone usage among young learners is increasingly displacing academic engagement.',
            changes: [
              { from: 'Many students spend hours on their phones', to: 'Excessive smartphone usage among young learners', reason: 'Concrete action → abstract noun phrase (nominalisation)' },
              { from: 'instead of studying', to: 'displacing academic engagement', reason: 'Prepositional contrast → verb showing replacement' },
            ],
          },
        ],
      },
      {
        name: 'Clause fusion and splitting',
        description:
          'Merge two short sentences into one complex sentence, or split one long sentence into two focused ones. This demonstrates grammatical range.',
        examples: [
          {
            label: 'Two sentences → one complex sentence',
            original:   'Online learning has grown rapidly. It gives students more flexibility.',
            paraphrased: 'The rapid growth of online learning has afforded students considerably greater flexibility in how and when they study.',
            changes: [
              { from: 'Two separate sentences',        to: 'One complex sentence',          reason: 'Fusion — demonstrates subordination and range' },
              { from: 'has grown rapidly',             to: 'rapid growth of',               reason: 'Verb → noun (nominalisation) to enable fusion' },
              { from: 'It gives … more flexibility',   to: 'has afforded … greater flexibility', reason: 'Simple verb → formal verb + qualifier' },
            ],
            trap: 'Do not try concept-level rewrites under exam pressure without practice — a failed attempt lowers your score more than a safe Level 1 paraphrase.',
          },
        ],
      },
    ],
    examTip:
      'Reserve Level 3 techniques for your introduction paraphrase and conclusion restatement — two sentences where the examiner pays closest attention to paraphrase quality. Never use concept-level rewriting in body paragraphs where clarity is paramount.',
  },
]

// ── Reading Guide ─────────────────────────────────────────────────────────────

const READING_LEVELS: ParaphraseLevel[] = [
  {
    level: 1,
    badge: 'Beginner',
    title: 'Recognising Synonyms',
    focus: 'Spot single-word swaps between the question and the passage',
    techniques: [
      {
        name: 'Direct synonym swap detection',
        description:
          'The question replaces one or more words from the passage with synonyms. Your job: identify the synonym, find the passage word it maps to, and then answer using the passage sentence — not the question wording.',
        examples: [
          {
            label: 'T/F/NG — single swap',
            original:   'Question: Children consume large amounts of sugar daily.',
            paraphrased: 'Passage: Young people ingest excessive quantities of sweeteners every day.',
            changes: [
              { from: 'Children',        to: 'Young people',          reason: 'Age-group synonym' },
              { from: 'consume',         to: 'ingest',                reason: 'Verb synonym — same meaning' },
              { from: 'large amounts of', to: 'excessive quantities of', reason: 'Quantity phrase synonym' },
              { from: 'sugar',           to: 'sweeteners',            reason: 'Hypernym (sweeteners includes sugar)' },
              { from: 'daily',           to: 'every day',             reason: 'Adverb → prepositional phrase' },
            ],
          },
        ],
      },
      {
        name: 'Watch for near-synonyms that shift meaning',
        description:
          'Not every similar word is a true paraphrase. "Suggested" ≠ "proven". "Some" ≠ "most". These near-synonyms are the basis of FALSE and NOT GIVEN traps.',
        examples: [
          {
            label: 'NOT GIVEN trap — hedge word changed',
            original:   'Question: Scientists have proven that sugar causes tooth decay.',
            paraphrased: 'Passage: Research suggests a link between sugar consumption and dental erosion.',
            changes: [
              { from: 'have proven',   to: 'suggests',    reason: 'TRAP — "proven" is definitive; "suggests" is a hedge. The passage does NOT make a definitive claim → answer is NOT GIVEN' },
              { from: 'causes',        to: 'link between', reason: 'TRAP — "causes" implies direct causation; "link" implies correlation only' },
              { from: 'tooth decay',   to: 'dental erosion', reason: 'True synonym — not a trap' },
            ],
            trap: 'When you spot a synonym, also check the hedge words (suggested, may, could, linked to). If the question removes hedging that the passage uses, the statement is FALSE or NOT GIVEN.',
          },
        ],
      },
    ],
    examTip:
      'Before scanning for your answer, underline the content words in the question. Then scan the passage for synonyms of those words — not the words themselves. The answer sentence will almost never use the question\'s exact vocabulary.',
  },
  {
    level: 2,
    badge: 'Intermediate',
    title: 'Structural Paraphrase Recognition',
    focus: 'Recognise the same information repackaged in a different grammatical structure',
    techniques: [
      {
        name: 'Active ↔ Passive recognition',
        description:
          'The question and passage express the same relationship but swap active and passive voice. The agent and object stay the same — only their grammatical roles change.',
        examples: [
          {
            label: 'Matching Headings — voice swap',
            original:   'Question: The government funded the research programme.',
            paraphrased: 'Passage: The study was financed by public authorities.',
            changes: [
              { from: 'The government funded [object]', to: '[Object] was financed by public authorities', reason: 'Active → passive — meaning identical' },
              { from: 'government',  to: 'public authorities', reason: 'Synonym' },
              { from: 'funded',      to: 'financed',           reason: 'Verb synonym' },
              { from: 'research programme', to: 'study',       reason: 'Synonym — narrower term' },
            ],
          },
        ],
      },
      {
        name: 'Clause order reversal',
        description:
          'The passage presents cause then effect; the question presents effect then cause (or vice versa). The relationship is identical — only the order differs.',
        examples: [
          {
            label: 'T/F/NG — reversed clause order',
            original:   'Question: Deforestation has led to a decline in biodiversity.',
            paraphrased: 'Passage: Biodiversity losses in tropical regions are a direct consequence of widespread deforestation.',
            changes: [
              { from: 'Deforestation [cause] → decline [effect]', to: 'Biodiversity losses [effect] ← deforestation [cause]', reason: 'Cause-effect reversed; relationship identical' },
              { from: 'has led to',         to: 'are a direct consequence of', reason: 'Causal verb → noun phrase — same direction' },
              { from: 'decline in biodiversity', to: 'Biodiversity losses', reason: 'Synonym phrase' },
            ],
          },
        ],
      },
      {
        name: 'Noun phrase ↔ relative clause',
        description:
          'A noun with modifiers in the passage becomes a relative clause in the question, or vice versa.',
        examples: [
          {
            label: 'Short Answer — noun phrase vs clause',
            original:   'Question: What has reduced the number of insects that pollinate crops?',
            paraphrased: 'Passage: Crop-pollinating insect populations have declined sharply.',
            changes: [
              { from: 'insects that pollinate crops', to: 'Crop-pollinating insect populations', reason: 'Relative clause → compound noun (pre-modification)' },
              { from: 'the number … reduced',         to: 'populations … declined sharply',      reason: 'Quantity framing → population verb' },
            ],
          },
        ],
      },
    ],
    examTip:
      'For Matching Headings, the heading always paraphrases the paragraph\'s main idea — not a detail. If you find an exact word match between the heading and the paragraph, be suspicious: it may be a detail that appears in the paragraph but is not the main point.',
  },
  {
    level: 3,
    badge: 'Advanced',
    title: 'Concept-Level Paraphrase & Distractor Traps',
    focus: 'Recognise full idea-level rewrites and avoid distractors that use original words deceptively',
    techniques: [
      {
        name: 'Idea-level equivalence (no shared vocabulary)',
        description:
          'The question and passage share almost no common words yet express the same idea. This tests whether you understand meaning rather than pattern-match vocabulary.',
        examples: [
          {
            label: 'T/F/NG — zero vocabulary overlap',
            original:   'Question: People in urban areas are moving away from car ownership.',
            paraphrased: 'Passage: City dwellers are increasingly relying on shared mobility services rather than maintaining personal vehicles.',
            changes: [
              { from: 'People in urban areas', to: 'City dwellers',                      reason: 'Concept synonym — same group' },
              { from: 'moving away from car ownership', to: 'relying on shared mobility … rather than maintaining personal vehicles', reason: 'Concept-level — "car ownership" = "personal vehicles"; "moving away from" = "rather than"' },
            ],
            trap: 'Exam writers craft these to make you think: "I cannot find this in the passage." The answer IS there — you just need to look for the concept, not the words.',
          },
        ],
      },
      {
        name: 'Distractor trap: same words, different meaning',
        description:
          'The most dangerous trap in Multiple Choice and T/F/NG: the passage uses the same words as the question, but the relationship between them is different. Test-takers who scan for vocabulary — not meaning — fall for this every time.',
        examples: [
          {
            label: 'Multiple Choice distractor',
            original:   'Distractor: Scientists discovered that exercise prevents depression.',
            paraphrased: 'Passage: Scientists discovered that depression can reduce motivation to exercise.',
            changes: [
              { from: 'exercise [subject] prevents depression [object]', to: 'depression [subject] reduces exercise [as object]', reason: 'TRAP — same words ("exercise", "depression", "scientists"), completely opposite causal direction. This is FALSE.' },
            ],
            trap: 'When you see familiar vocabulary from the question in the passage, read the FULL sentence around it. Exam writers deliberately place the same words in a different grammatical relationship to create FALSE answers.',
          },
          {
            label: 'NOT GIVEN — plausible but absent',
            original:   'Question: The study found that organic food is more nutritious than conventional food.',
            paraphrased: 'Passage: The study investigated whether organic farming practices affect the nutritional content of produce.',
            changes: [
              { from: 'found that … is more nutritious', to: 'investigated whether … affect',  reason: 'TRAP — the passage only says they investigated; it does not report a finding. Answer: NOT GIVEN.' },
            ],
            trap: 'NOT GIVEN means the passage does not give enough information to confirm OR deny the claim. If you are tempted to guess "TRUE" because it sounds reasonable, stop — reasonable ≠ stated.',
          },
        ],
      },
    ],
    examTip:
      'Practise the "cover test": cover the passage and read only the question. Now ask: if the passage is TRUE, what exact sentence structure would I expect to find? Then uncover and match. This forces you to look for meaning equivalence rather than word matching.',
  },
]

// ── Exported data ─────────────────────────────────────────────────────────────

export const PARAPHRASE_GUIDES: ParaphraseSkillGuide[] = [
  {
    skill: 'writing',
    label: 'Writing',
    icon: '✍️',
    intro:
      'In IELTS Writing, paraphrasing is not optional — it is a marking criterion. Your introduction must restate the task prompt without copying it. Your body paragraphs must vary vocabulary to avoid repetition. Your conclusion must restate your thesis in fresh language. Examiners are specifically trained to identify copied phrases and will penalise Task Achievement and Lexical Resource accordingly.',
    purpose: [
      'Introduction: paraphrase the task prompt (copying = direct penalty)',
      'Body paragraphs: avoid repeating key topic words (Lexical Resource score)',
      'Conclusion: restate thesis and position without echoing your introduction',
    ],
    levels: WRITING_LEVELS,
  },
  {
    skill: 'reading',
    label: 'Reading',
    icon: '📖',
    intro:
      'In IELTS Reading, the question is never written in the same words as the passage. Every question paraphrases the passage content — and every wrong answer (distractor) exploits your expectation of word-matching. Your job is to recognise meaning equivalence, not vocabulary similarity. Students who scan for matching words score lower than students who read for meaning.',
    purpose: [
      'T/F/NG: the statement paraphrases a sentence in the passage — find the equivalent, then verify the claim',
      'Matching Headings: the heading paraphrases the paragraph\'s main idea — not a detail',
      'Multiple Choice: distractors use passage words in the wrong relationship to trap word-matchers',
      'Short Answer: question words will be paraphrased — scan for concept, not vocabulary',
    ],
    levels: READING_LEVELS,
  },
]
