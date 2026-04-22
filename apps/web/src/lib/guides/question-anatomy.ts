export type QuestionRole =
  | 'question-word'   // What / Who / Where / When / How many
  | 'category'        // narrows the answer type: "What fruit", "What type of"
  | 'exclusion'       // "other than X" / "apart from Y"
  | 'hedge'           // "is suggested to" / "may be" / "could be"
  | 'relationship'    // verb connecting subject to answer: "was linked to", "evolved to seek"
  | 'target'          // subject being described: "our teeth", "children"
  | 'time'            // "in the past" / "currently" / "historically"

export type QuestionFragment = {
  text: string
  role: QuestionRole
  label: string       // short role name shown on badge
  instruction: string // what this fragment tells you to do
}

export type QuestionExample = {
  question: string
  fragments: QuestionFragment[]
  answerType: string  // e.g. "a noun — a specific fruit name"
  scanPlan: string    // one-sentence action plan
}

export type SkillSection = {
  skill: string
  icon: string
  color: string       // Tailwind accent used for the skill tab
  intro: string
  examples: QuestionExample[]
}

export const ROLE_LABELS: Record<QuestionRole, string> = {
  'question-word': 'Question word',
  'category':      'Category',
  'exclusion':     'Exclusion',
  'hedge':         'Hedge signal',
  'relationship':  'Relationship',
  'target':        'Target',
  'time':          'Time constraint',
}

export const ROLE_DESCRIPTIONS: Record<QuestionRole, string> = {
  'question-word': 'Tells you the grammatical form of the answer — noun, number, place, person, time period.',
  'category':      'Narrows the answer to a specific class of noun. "What fruit" means the answer must be a fruit — nothing else.',
  'exclusion':     'One answer is already named and must be EXCLUDED. Find the excluded item first, then look for the different one.',
  'hedge':         'The answer in the source text will be stated with uncertainty — "may", "could", "is suggested to", not as a fact.',
  'relationship':  'The verb or phrase connecting subject to answer. Scan for this pattern in the text, not just topic keywords.',
  'target':        'The subject being described or affected. Anchors you to the right paragraph or section.',
  'time':          'Filters the answer to a specific time frame. A historical marker eliminates present-tense paragraphs.',
}

// ── Reading examples ──────────────────────────────────────────────────────
const READING_EXAMPLES: QuestionExample[] = [
  {
    question: 'Other than acid-producing bacteria, what is suggested to have a negative effect on our teeth?',
    fragments: [
      {
        text: 'Other than acid-producing bacteria,',
        role: 'exclusion',
        label: 'Exclusion',
        instruction: 'Bacteria is already named — your answer must be something DIFFERENT. Find bacteria in the passage first, then look at the surrounding sentences for a second harmful thing.',
      },
      {
        text: 'what',
        role: 'question-word',
        label: 'Question word',
        instruction: 'Answer is a noun — a thing, substance, or action.',
      },
      {
        text: 'is suggested to',
        role: 'hedge',
        label: 'Hedge signal',
        instruction: 'The answer will NOT be stated as a definite fact. Look for hedging language in the passage: "may", "could", "has been suggested to", "evidence that".',
      },
      {
        text: 'have a negative effect',
        role: 'relationship',
        label: 'Relationship',
        instruction: 'You are looking for a cause of harm — something that damages or worsens the state of teeth.',
      },
      {
        text: 'on our teeth',
        role: 'target',
        label: 'Target',
        instruction: 'Teeth are the subject being harmed. Scan paragraphs about dental health.',
      },
    ],
    answerType: 'a noun — a thing or action that harms teeth (not bacteria)',
    scanPlan: 'Scan for "bacteria" in the passage → read the surrounding expert quote for a second cause stated with hedging language. Answer: brushing.',
  },
  {
    question: 'What type of sugar have humans evolved to seek out?',
    fragments: [
      {
        text: 'What type of sugar',
        role: 'category',
        label: 'Q-word + Category',
        instruction: 'Answer must be a specific NAMED variety of sugar — not just "sugar". If the passage gives a chemical name or subtype (fructose, glucose, sucrose), that is your answer. A general term like "sugar" alone is wrong.',
      },
      {
        text: 'have humans evolved to',
        role: 'relationship',
        label: 'Evolutionary relationship',
        instruction: 'Look for evolutionary or biological language in the passage: "evolved", "naturally", "wired to", "instinctively". This anchors you to the right paragraph.',
      },
      {
        text: 'seek out',
        role: 'relationship',
        label: 'Action',
        instruction: 'Find what humans are drawn to or pursue naturally — not what they are told to eat, but what they are biologically attracted to.',
      },
    ],
    answerType: 'a specific sugar type — a named variety, not a general term',
    scanPlan: 'Scan for evolutionary language → find the specific sugar name in the Evidence zone of that paragraph. Answer: fructose.',
  },
  {
    question: 'What fruit was linked to a serious disease in the past?',
    fragments: [
      {
        text: 'What fruit',
        role: 'category',
        label: 'Q-word + Category',
        instruction: 'Answer must be a fruit name. If you find anything that is not a fruit, it is wrong — even if it appears near disease vocabulary.',
      },
      {
        text: 'was linked to',
        role: 'relationship',
        label: 'Passive relationship',
        instruction: 'Look for passive linking language: "was associated with", "was connected to", "caused", "was blamed for". The fruit is the subject; the disease is the object.',
      },
      {
        text: 'a serious disease',
        role: 'target',
        label: 'Context',
        instruction: 'Scan near disease vocabulary — cancer, illness, infection. The disease name confirms you are in the right sentence.',
      },
      {
        text: 'in the past',
        role: 'time',
        label: 'Time constraint',
        instruction: 'Answer is historical — look for past tense, time markers ("in the 1920s", "in the 80s", "once", "previously"). Skip any paragraphs written in present tense.',
      },
    ],
    answerType: 'a fruit name — a proper noun or common fruit',
    scanPlan: 'Go to the Introduction paragraph (historical anecdotes) → scan for a fruit name in a past-tense sentence near a disease word. Answer: apples.',
  },
  {
    question: 'What may be negatively affected by children consuming too much sugar?',
    fragments: [
      {
        text: 'What',
        role: 'question-word',
        label: 'Question word',
        instruction: 'Answer is a noun — a thing, ability, or body part that can be harmed.',
      },
      {
        text: 'may be',
        role: 'hedge',
        label: 'Hedge signal',
        instruction: 'The harm is not certain or proven. Scan for hedged language in the passage: "may", "might", "could", "has been suggested". A confident definitive claim is likely the wrong sentence.',
      },
      {
        text: 'negatively affected',
        role: 'relationship',
        label: 'Passive harm',
        instruction: 'Something is the VICTIM of harm — find what is damaged, worsened, or impaired. You are looking for the result, not the cause.',
      },
      {
        text: 'by children consuming too much sugar',
        role: 'target',
        label: 'Cause (given)',
        instruction: 'The cause is already given — you do NOT need to find it. Your only job is to find what is harmed. This clause anchors you to the paragraph about children and sugar.',
      },
    ],
    answerType: 'a noun — something that is harmed or impaired',
    scanPlan: 'Go to the paragraph about children and sugar → scan the end of the paragraph for hedged consequence language. Answer: their palate.',
  },
]

// ── Listening examples ─────────────────────────────────────────────────────
const LISTENING_EXAMPLES: QuestionExample[] = [
  {
    question: 'What time does the last bus leave the city centre?',
    fragments: [
      {
        text: 'What time',
        role: 'question-word',
        label: 'Q-word + Category',
        instruction: 'Answer is a specific time — hours and minutes. Write it in the format you hear (e.g. 10:45 or half past ten). A day name or date is wrong.',
      },
      {
        text: 'does the last bus',
        role: 'target',
        label: 'Target',
        instruction: '"Last bus" — listen specifically for the final departure, not the first or the most frequent one. If multiple times are mentioned, you want the latest.',
      },
      {
        text: 'leave',
        role: 'relationship',
        label: 'Relationship',
        instruction: 'Listen for departure language: "departs", "goes", "sets off". An arrival time is the wrong answer.',
      },
      {
        text: 'the city centre',
        role: 'target',
        label: 'Location',
        instruction: 'The city centre is the origin, not the destination. If the speaker mentions times for both directions, you need the one departing FROM the city centre.',
      },
    ],
    answerType: 'a time — hours and minutes (e.g. 10:45)',
    scanPlan: 'Pre-read "last bus" and "city centre" as listening triggers → when the speaker reaches departures, hold for the FINAL time mentioned.',
  },
  {
    question: 'Apart from cost, what other factor does the speaker say influenced her choice?',
    fragments: [
      {
        text: 'Apart from cost,',
        role: 'exclusion',
        label: 'Exclusion',
        instruction: 'Cost will be mentioned in the recording — it is NOT the answer. Your answer is a DIFFERENT factor. If you hear "cost" or "price", keep listening.',
      },
      {
        text: 'what other factor',
        role: 'question-word',
        label: 'Q-word + Category',
        instruction: 'Answer is a single factor — a noun or noun phrase representing a reason or consideration.',
      },
      {
        text: 'does the speaker say',
        role: 'hedge',
        label: 'Attribution',
        instruction: 'The answer is the speaker\'s own stated reason — not a fact from elsewhere. Listen for first-person language: "I chose it because", "what really mattered to me was".',
      },
      {
        text: 'influenced her choice',
        role: 'relationship',
        label: 'Relationship',
        instruction: 'Listen for decision language: "influenced", "decided", "made me choose", "was a factor". The answer is what drove the decision.',
      },
    ],
    answerType: 'a noun or noun phrase — a reason or consideration (not cost)',
    scanPlan: 'Pre-read "cost" as the excluded trigger → when cost is mentioned, keep listening for the NEXT factor the speaker gives. Write that factor.',
  },
]

// ── Speaking examples ─────────────────────────────────────────────────────
const SPEAKING_EXAMPLES: QuestionExample[] = [
  {
    question: 'Do you prefer spending time indoors or outdoors? Why?',
    fragments: [
      {
        text: 'Do you prefer',
        role: 'question-word',
        label: 'Preference question',
        instruction: 'Answer requires a CHOICE — pick one option and commit to it. Saying "both" without a preference is a non-answer. Start: "I tend to prefer…" or "I\'d say indoors, because…"',
      },
      {
        text: 'spending time indoors or outdoors',
        role: 'category',
        label: 'Options given',
        instruction: 'The two options ARE the question — do not introduce a third option or change the frame. Choose one and extend with a reason.',
      },
      {
        text: 'Why?',
        role: 'relationship',
        label: 'Reason required',
        instruction: '"Why" is mandatory here — a bare preference without a reason scores lower for Coherence. Give at least one reason using "because", "mainly because", or "the main reason is".',
      },
    ],
    answerType: 'a stated preference + at least one reason (2–4 sentences total)',
    scanPlan: 'Choose indoors or outdoors → give one concrete reason → optionally add a contrast or example. Do NOT say "it depends" without immediately choosing a side.',
  },
  {
    question: 'How has technology changed the way people communicate compared to the past?',
    fragments: [
      {
        text: 'How',
        role: 'question-word',
        label: 'Question word',
        instruction: 'Answer describes a MANNER or PROCESS of change — not a yes/no, not a list of technologies. Start with "Technology has changed communication by…" or "One major shift is…"',
      },
      {
        text: 'has technology changed',
        role: 'relationship',
        label: 'Change relationship',
        instruction: 'You must describe a CHANGE — something that is different now from before. A description of current technology alone does not answer this.',
      },
      {
        text: 'the way people communicate',
        role: 'target',
        label: 'Target',
        instruction: 'Communication is the focus — not technology itself, not society generally. Your answer must connect technology to a specific change in HOW people talk or interact.',
      },
      {
        text: 'compared to the past',
        role: 'time',
        label: 'Comparison required',
        instruction: 'A before/after contrast is required. Use "whereas before…, now…" or "in the past… but today…". An answer without the contrast misses the question\'s core requirement.',
      },
    ],
    answerType: 'a description of change — how (manner), not what technology exists',
    scanPlan: 'Pick one specific change (e.g. instant messaging vs. letter writing) → describe the before/after contrast → add a brief evaluation of the effect.',
  },
]

// ── Writing examples ─────────────────────────────────────────────────────
const WRITING_EXAMPLES: QuestionExample[] = [
  {
    question: 'To what extent do you agree or disagree with this statement?',
    fragments: [
      {
        text: 'To what extent',
        role: 'question-word',
        label: 'Degree question',
        instruction: '"To what extent" asks HOW MUCH you agree — not simply whether you do. A partial agreement ("I largely agree, but…") is perfectly valid and often stronger than a binary position. Avoid: "I completely agree" with no nuance.',
      },
      {
        text: 'do you agree or disagree',
        role: 'category',
        label: 'Position required',
        instruction: 'You must state a clear position in your introduction and maintain it throughout. Switching sides in your body paragraphs without signalling it confuses the reader and lowers Task Response.',
      },
      {
        text: 'with this statement',
        role: 'target',
        label: 'Scope',
        instruction: 'Every paragraph must relate back to the specific statement given — not the general topic. If the statement is about urban green spaces, an essay about pollution without mentioning green spaces is off-topic.',
      },
    ],
    answerType: 'a clear position (agree / partially agree / disagree) + degree of that position',
    scanPlan: 'Decide your position before writing → state it in sentence 2 of your introduction → ensure every body paragraph supports or qualifies it → restate in conclusion.',
  },
  {
    question: 'Discuss both views and give your own opinion.',
    fragments: [
      {
        text: 'Discuss both views',
        role: 'relationship',
        label: 'Two-sided requirement',
        instruction: 'BOTH views must be discussed with roughly equal weight — one body paragraph each. Giving 80% of your essay to one view and a single sentence to the other fails Task Response.',
      },
      {
        text: 'and give your own opinion',
        role: 'question-word',
        label: 'Opinion required',
        instruction: 'Your personal opinion is MANDATORY — not optional. It must be clearly stated (usually in the introduction and conclusion). An essay that only presents both sides without taking a position is incomplete.',
      },
    ],
    answerType: 'View A (1 body paragraph) + View B (1 body paragraph) + your position (intro + conclusion)',
    scanPlan: 'Introduction: paraphrase + state your opinion. Body 1: first view + evidence. Body 2: second view + evidence. Conclusion: restate your opinion.',
  },
]

// ── All skill sections ────────────────────────────────────────────────────
export const QUESTION_SKILL_SECTIONS: SkillSection[] = [
  {
    skill: 'Reading',
    icon: '📖',
    color: 'blue',
    intro:
      'Reading questions often contain exclusion clauses ("other than X"), hedge signals ("is suggested to"), and category constraints ("what type of") that tell you exactly which sentence in the passage holds the answer — before you read a single word of the passage.',
    examples: READING_EXAMPLES,
  },
  {
    skill: 'Listening',
    icon: '🎧',
    color: 'purple',
    intro:
      'Listening questions must be decoded BEFORE the audio plays — you have limited time to pre-read. Exclusion clauses ("apart from cost") are especially dangerous: the excluded item WILL appear in the recording as a distractor. Identifying it in advance keeps you from writing it as your answer.',
    examples: LISTENING_EXAMPLES,
  },
  {
    skill: 'Speaking',
    icon: '🎤',
    color: 'green',
    intro:
      'Speaking questions tell you exactly how to structure your answer. "Do you prefer…?" requires a choice + reason. "How has X changed…?" requires a before/after contrast. "To what extent…?" requires a degree, not a binary yes/no. Decoding the question in your 1-second pause before answering saves you from giving a correct-sounding but incomplete response.',
    examples: SPEAKING_EXAMPLES,
  },
  {
    skill: 'Writing',
    icon: '✍️',
    color: 'amber',
    intro:
      'Writing task questions contain mandatory structural requirements hidden in plain sight. "To what extent" demands a degree, not just a position. "Discuss both views AND give your opinion" makes your opinion non-optional. Missing any part of the instruction is a Task Response failure — the single most common reason for Band 5 Writing.',
    examples: WRITING_EXAMPLES,
  },
]
