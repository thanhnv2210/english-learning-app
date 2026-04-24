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
  skill: 'writing' | 'reading' | 'speaking' | 'listening'
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

// ── Speaking Guide ────────────────────────────────────────────────────────────

const SPEAKING_LEVELS: ParaphraseLevel[] = [
  {
    level: 1,
    badge: 'Beginner',
    title: 'Restating the Question with Synonyms',
    focus: 'Open your answer by reformulating the examiner\'s question using synonym swaps',
    techniques: [
      {
        name: 'Reformulate before answering',
        description:
          'Never repeat the question word-for-word when you begin your answer. Paraphrase it in your opening sentence — this immediately signals Lexical Resource to the examiner and buys you 2–3 seconds to think.',
        examples: [
          {
            label: 'Part 1 — preference question',
            original:   'Examiner: Do you enjoy reading books?',
            paraphrased: 'Answer opening: Reading is something I find genuinely enjoyable, yes…',
            changes: [
              { from: 'Do you enjoy', to: 'is something I find … enjoyable', reason: 'Question → statement; verb form shifted' },
              { from: 'reading books', to: 'Reading',                          reason: 'Gerund kept, "books" implied — avoids word-for-word echo' },
            ],
          },
          {
            label: 'Part 1 — frequency question',
            original:   'Examiner: How often do you use public transport?',
            paraphrased: 'Answer opening: In terms of how frequently I rely on public transit…',
            changes: [
              { from: 'How often',        to: 'how frequently',  reason: 'Synonym adverb' },
              { from: 'do you use',       to: 'I rely on',       reason: 'Question → statement; verb synonym' },
              { from: 'public transport', to: 'public transit',  reason: 'Synonym (British/American variant)' },
            ],
          },
        ],
      },
      {
        name: 'Cue card bullet paraphrase (Part 2)',
        description:
          'In Part 2, your cue card gives bullet points. Do not read them aloud — paraphrase each one when you address it. This shows range throughout your 2-minute talk.',
        examples: [
          {
            label: 'Part 2 — cue card bullet',
            original:   'Cue card bullet: Who you were with',
            paraphrased: 'In your talk: I was in the company of my closest colleague at the time…',
            changes: [
              { from: 'Who you were with', to: 'in the company of',  reason: 'Prepositional phrase → more formal expression' },
              { from: 'you were',          to: 'I was',              reason: 'Second person → first person (you are describing your experience)' },
            ],
          },
        ],
      },
    ],
    examTip:
      'Examiners notice when you begin every answer with the exact question words. Even one synonym swap in your opening sentence signals awareness of Lexical Resource. Practice restarting sentences with "In terms of…", "When it comes to…", "As for…" + paraphrased subject.',
  },
  {
    level: 2,
    badge: 'Intermediate',
    title: 'Structural Reformulation',
    focus: 'Change the grammatical structure of the question — not just the words — in your opening',
    techniques: [
      {
        name: 'Clause restructuring',
        description:
          'Convert a direct question into a complex noun phrase or subordinate clause. This demonstrates grammatical range from your very first sentence.',
        examples: [
          {
            label: 'Part 3 — comparison question',
            original:   'Examiner: How has technology changed the way people communicate?',
            paraphrased: 'Answer opening: The question of how communication has been transformed by technological advances is one I find fascinating…',
            changes: [
              { from: 'How has technology changed',       to: 'how … has been transformed by technological advances', reason: 'Active → passive; question clause → embedded noun clause' },
              { from: 'the way people communicate',       to: 'communication',                                        reason: 'Relative clause → nominalisation' },
              { from: 'How has [question form]',          to: 'The question of how [noun phrase]',                    reason: 'Question → noun phrase — allows complex sentence opening' },
            ],
          },
          {
            label: 'Part 3 — opinion question',
            original:   'Examiner: Do you think governments should invest more in public transport?',
            paraphrased: 'Answer opening: Whether greater government investment in public transportation is warranted is something many people debate…',
            changes: [
              { from: 'Do you think [question]', to: 'Whether … is something [noun clause]', reason: 'Yes/no question → embedded whether-clause' },
              { from: 'governments should',      to: 'government investment … is warranted', reason: 'Modal verb → passive adjective (nominalisation)' },
              { from: 'invest more',             to: 'greater … investment',                reason: 'Verb phrase → noun phrase' },
            ],
          },
        ],
      },
      {
        name: 'Active ↔ Passive in your response',
        description:
          'When elaborating on a point, alternate between active and passive constructions to avoid repetition and show grammatical range.',
        examples: [
          {
            label: 'Part 3 — elaboration with voice change',
            original:   'Technology has changed communication.',
            paraphrased: 'Communication has been fundamentally reshaped by the rapid advancement of technology.',
            changes: [
              { from: 'Technology [subject] has changed communication [object]', to: 'Communication [subject] has been reshaped by technology', reason: 'Perspective swap via passive — foregrounds the effect' },
              { from: 'changed',   to: 'fundamentally reshaped', reason: 'Adverb added + stronger verb — more precise' },
              { from: 'technology', to: 'the rapid advancement of technology',  reason: 'Noun → noun phrase — more academic' },
            ],
          },
        ],
      },
    ],
    examTip:
      'In Part 3, the examiner expects extended, structured answers. Opening with a paraphrased noun clause ("The extent to which…", "Whether … is debatable") signals Band 7+ grammatical range before you have even made your first point.',
  },
  {
    level: 3,
    badge: 'Advanced',
    title: 'Concept-Level Reformulation for Fluency',
    focus: 'Rephrase mid-answer when you lose a word — and restate conclusions without repeating yourself',
    techniques: [
      {
        name: 'Self-correction paraphrase (repair strategy)',
        description:
          'When you cannot recall a word mid-sentence, immediately restate the concept using different vocabulary. This is a natural fluency strategy — examiners view smooth repairs positively. Never stop and say "I don\'t know the word".',
        examples: [
          {
            label: 'Part 3 — mid-answer repair',
            original:   'I think this has led to … um … [word forgotten] … I mean, it has made society more divided — people tend to only interact with those who share the same views.',
            paraphrased: 'Smooth repair: I think this has contributed to a kind of fragmentation of society — people increasingly gravitate towards those with similar perspectives.',
            changes: [
              { from: 'um … [word forgotten]', to: 'a kind of fragmentation of society', reason: 'Repair — noun phrase replaces forgotten word; "kind of" softens while buying time' },
              { from: 'interact with',         to: 'gravitate towards',                  reason: 'Synonym — more sophisticated verb' },
              { from: 'share the same views',  to: 'similar perspectives',               reason: 'Clause → noun phrase — more concise' },
            ],
            trap: 'Do not repeat "I mean" or "you know" as fillers — use phrase-level paraphrase instead: "in other words", "that is to say", "or rather".',
          },
        ],
      },
      {
        name: 'Conclusion restatement without repetition',
        description:
          'When the examiner signals wrap-up ("And finally…"), restate your position using entirely different vocabulary from your opening. This bookends your answer and demonstrates range.',
        examples: [
          {
            label: 'Part 3 — wrap-up restatement',
            original:   'Opening: I believe technology has fundamentally changed how people communicate.',
            paraphrased: 'Closing: So overall, the way we exchange information has been irrevocably altered by digital innovation — and I think that shift is only going to accelerate.',
            changes: [
              { from: 'I believe',              to: 'So overall … I think',              reason: 'Direct assertion → reflective summary marker + personal view' },
              { from: 'technology',             to: 'digital innovation',                reason: 'Synonym — more specific, avoids word repetition' },
              { from: 'has fundamentally changed', to: 'has been irrevocably altered',   reason: 'Active → passive; adverb + verb synonym' },
              { from: 'how people communicate', to: 'the way we exchange information',   reason: 'Clause → noun phrase; pronoun shift (people → we)' },
            ],
          },
        ],
      },
    ],
    examTip:
      'Fluency & Coherence rewards self-correction that does NOT break flow. The key is to not pause — replace the lost word immediately with a paraphrase. Practice the phrase "or rather…" followed by a concept-level restatement. It buys thinking time and sounds fluent.',
  },
]

// ── Listening Guide ───────────────────────────────────────────────────────────

const LISTENING_LEVELS: ParaphraseLevel[] = [
  {
    level: 1,
    badge: 'Beginner',
    title: 'Recognising Spoken Synonyms',
    focus: 'Match what you hear to the written question using synonym recognition',
    techniques: [
      {
        name: 'Audio → question synonym mapping',
        description:
          'The recording never uses the exact words from the question. Before the audio plays, identify the key content words in the question and predict their spoken synonyms. When you hear a synonym, that sentence contains your answer.',
        examples: [
          {
            label: 'Note completion — synonym trigger',
            original:   'Question: The workshop begins at ___ o\'clock.',
            paraphrased: 'Recording: "The session kicks off at nine in the morning."',
            changes: [
              { from: 'workshop', to: 'session',    reason: 'Synonym — your trigger word in the audio' },
              { from: 'begins',   to: 'kicks off',  reason: 'Informal synonym — common in conversational recordings' },
              { from: '___',      to: 'nine',       reason: 'The answer — written as "9" or "nine" depending on instruction' },
            ],
            trap: 'If you hear "workshop" mentioned later in the recording, it may be a different context. Always verify the full sentence matches the question\'s meaning before writing the answer.',
          },
          {
            label: 'Multiple choice — correct option paraphrased',
            original:   'Question: Why did the speaker choose the hotel? A) It was affordable. B) It was close to the venue. C) It had good reviews.',
            paraphrased: 'Recording: "I went with that place mainly because it wasn\'t far from the conference centre."',
            changes: [
              { from: 'close to the venue',      to: 'wasn\'t far from the conference centre', reason: 'Synonym + negation: close = not far; venue = conference centre → correct answer is B' },
              { from: 'affordable',              to: '[not mentioned in recording]',            reason: 'Distractor — sounds plausible but speaker does not say this' },
              { from: 'had good reviews',        to: '[not mentioned in recording]',            reason: 'Distractor — mentioned in a different context elsewhere' },
            ],
          },
        ],
      },
    ],
    examTip:
      'Use the 30–60 seconds before the audio plays to underline question keywords and mentally predict their synonyms. The audio always paraphrases — your job is to map heard words back to written options before the recording moves on.',
  },
  {
    level: 2,
    badge: 'Intermediate',
    title: 'Structural Paraphrase in Audio',
    focus: 'Recognise when the recording expresses the same fact in a different grammatical structure',
    techniques: [
      {
        name: 'Active ↔ Passive in speech',
        description:
          'Spoken English frequently shifts between active and passive. The question may frame information actively; the speaker states it passively (or vice versa). The fact is the same — the structure is different.',
        examples: [
          {
            label: 'Note completion — voice shift',
            original:   'Question: The report was written by ___.',
            paraphrased: 'Recording: "Dr. Hansen produced the final report after six months of research."',
            changes: [
              { from: 'was written by [agent]', to: '[Agent] produced',  reason: 'Passive question → active statement; agent is the answer' },
              { from: 'report',                 to: 'final report',      reason: 'Same noun; adjective added in recording' },
            ],
            trap: 'When the question uses passive voice, the answer is always the agent (the "by whom"). In the recording, that agent will usually be the sentence subject.',
          },
        ],
      },
      {
        name: 'Cause-effect paraphrase in diagrams and maps',
        description:
          'Map/diagram questions describe spatial relationships. The recording paraphrases directions using different prepositions or landmarks. Match the concept — not the exact words.',
        examples: [
          {
            label: 'Map labelling — spatial paraphrase',
            original:   'Question label position: opposite the main entrance.',
            paraphrased: 'Recording: "If you\'re facing the front door, you\'ll see it directly ahead."',
            changes: [
              { from: 'opposite the main entrance', to: 'facing the front door … directly ahead', reason: 'Spatial synonym: opposite = facing + directly ahead; main entrance = front door' },
            ],
            trap: 'Compass directions ("north of", "to the left") and landmark-based directions ("next to the café") can both describe the same location. Pre-read labels carefully and hold both concepts in mind.',
          },
        ],
      },
      {
        name: 'Number and quantity paraphrase',
        description:
          'Quantities in the recording are often paraphrased as fractions, percentages, or approximate expressions in the question — or vice versa.',
        examples: [
          {
            label: 'Multiple choice — quantity equivalence',
            original:   'Question: What proportion of students passed the test? A) About half. B) A quarter. C) The majority.',
            paraphrased: 'Recording: "Roughly 48% of participants achieved a passing grade."',
            changes: [
              { from: 'Roughly 48%',   to: 'About half',   reason: '48% ≈ 50% = half → correct answer is A' },
              { from: 'A quarter',     to: '25%',           reason: 'Distractor — 48% ≠ 25%' },
              { from: 'The majority',  to: 'over 50%',      reason: 'Distractor — 48% is less than half, not a majority' },
            ],
            trap: '"Roughly", "approximately", "around", and "about" signal that the number will be paraphrased as a fraction or rounded figure in the options.',
          },
        ],
      },
    ],
    examTip:
      'For map and diagram questions, label ALL positions on the diagram during pre-reading — not just the gaps. Knowing where the other fixed labels are helps you triangulate position from the spoken description, even when the recording uses completely different spatial vocabulary.',
  },
  {
    level: 3,
    badge: 'Advanced',
    title: 'Distractor Traps & Concept-Level Paraphrase',
    focus: 'Recognise distractors that use recording words deceptively and multi-sentence concept paraphrase',
    techniques: [
      {
        name: 'The distractor trap: same words, wrong relationship',
        description:
          'The most dangerous Listening trap: a wrong option uses words you just heard, but misrepresents the relationship between them. Test-takers who write what sounds familiar — rather than what is accurate — fall for this every time.',
        examples: [
          {
            label: 'Multiple choice — reversed relationship',
            original:   'Option B: Stress causes people to exercise less.',
            paraphrased: 'Recording: "Interestingly, a lack of exercise has been shown to increase stress levels in office workers."',
            changes: [
              { from: 'Stress [cause] → exercise less [effect]',    to: 'lack of exercise [cause] → stress [effect]',  reason: 'TRAP — same words (stress, exercise), completely reversed causal direction. Option B is WRONG.' },
            ],
            trap: 'When you hear key words from an option in the recording, DO NOT write it down immediately. Listen for the full sentence to confirm the relationship — cause vs. effect, agent vs. recipient, positive vs. negative.',
          },
          {
            label: 'Multiple choice — partial match distractor',
            original:   'Option A: The library closes at 6pm on Fridays.',
            paraphrased: 'Recording: "On Fridays the library has extended hours — it stays open until eight."',
            changes: [
              { from: 'closes at 6pm on Fridays', to: 'stays open until eight [on Fridays]', reason: 'TRAP — "Fridays" matches, but the time is wrong. Option A is FALSE.' },
            ],
            trap: 'Partial matches are deliberate. The recording mentions the day (Friday) to make option A seem correct — but the time contradicts it. Always verify every element of a multiple-choice option against the recording.',
          },
        ],
      },
      {
        name: 'Multi-sentence concept paraphrase',
        description:
          'Sometimes a single question answer is spread across two or three spoken sentences. The full concept only becomes clear once all parts are heard. Premature answers (written after one sentence) are often wrong.',
        examples: [
          {
            label: 'Note completion — answer built across two sentences',
            original:   'Question: The main advantage of the new system is ___.',
            paraphrased: 'Recording: "The old method was slow and prone to errors. The new approach, by contrast, processes data in real time without any manual input."',
            changes: [
              { from: 'main advantage',         to: 'processes data in real time without manual input', reason: 'The advantage is stated in sentence 2 — sentence 1 provides contrast context only' },
              { from: '[listening only to first sentence]', to: '[incorrect answer: "slow and prone to errors"]', reason: 'TRAP — first sentence describes the old system\'s disadvantage, not the new system\'s advantage' },
            ],
            trap: 'When a question asks for a "main advantage" or "key reason", wait for the full contrast or explanation before writing. The answer often comes after a contrast signal: "however", "by contrast", "instead", "on the other hand".',
          },
        ],
      },
    ],
    examTip:
      'In Section 3 and Section 4 (the hardest recordings), every wrong option is designed to sound plausible from the audio. The only defence is to verify the complete fact — not just matching words. Practice "listen for the verb": the relationship word (causes, prevents, leads to, results in) tells you which direction the meaning goes.',
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
  {
    skill: 'speaking',
    label: 'Speaking',
    icon: '🎤',
    intro:
      'In IELTS Speaking, paraphrase serves two purposes: it demonstrates Lexical Resource and Grammatical Range to the examiner, and it gives you thinking time before you answer. Every time you open an answer by restating the question in your own words, you signal vocabulary breadth. Every time you rephrase mid-answer instead of stopping to find a word, you protect your Fluency & Coherence score.',
    purpose: [
      'Part 1: paraphrase the question in your opening sentence to show lexical range',
      'Part 2: paraphrase cue card bullets when addressing them — never read them verbatim',
      'Part 3: open complex answers with a restructured noun clause to signal grammatical range',
      'All parts: use concept-level repair when you lose a word — never pause in silence',
    ],
    levels: SPEAKING_LEVELS,
  },
  {
    skill: 'listening',
    label: 'Listening',
    icon: '🎧',
    intro:
      'In IELTS Listening, paraphrase is the mechanism of every question and every distractor. The recording never uses the exact words from the question — it paraphrases them. Wrong answer options use words you just heard but in a different relationship. Your job is to pre-read questions, predict synonyms, listen for meaning — not words — and verify the full fact before writing.',
    purpose: [
      'Note completion: the recording paraphrases the gap word — listen for the synonym trigger',
      'Multiple choice: the correct option paraphrases what you hear; distractors use familiar words deceptively',
      'Map/diagram: directions are paraphrased spatially — match concept, not vocabulary',
      'Sections 3–4: answers may span multiple sentences — wait for contrast signals before writing',
    ],
    levels: LISTENING_LEVELS,
  },
]
