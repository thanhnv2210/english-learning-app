export type PeelPart = 'P' | 'E-evidence' | 'E-explanation' | 'E-example' | 'L' | 'intro' | 'conclusion'

export type SampleQuestion = {
  num: number
  question: string
  peelPart: PeelPart
  lookFor: string   // signal words / text patterns that mark this zone
  hint: string      // what to do once you land there
}

export type ReadingGuide = {
  id: string
  name: string
  description: string
  answerFormat: string
  steps: string[]
  strategies: string[]
  mistakes: string[]
  tip?: {
    label: string
    text: string
  }
  decisionTip?: {
    label: string
    text: string
  }
  sampleAnalysis?: SampleQuestion[]
}

export const READING_GUIDES: ReadingGuide[] = [
  // ── 0. Meta-strategy — applies to every question type ─────────────────────
  {
    id: 'peel',
    name: 'Paragraph Structure — PEEL Navigation',
    description:
      'Most IELTS academic passages use structured body paragraphs. The most common framework is PEEL: Point → Evidence → Explanation → Link. Knowing which zone holds which type of information lets you skip directly to the right sentence instead of reading the whole paragraph for every question. However, not every paragraph follows PEEL — introduction and conclusion paragraphs use different structures and require a different scanning approach.',
    answerFormat:
      'P = Point (topic sentence — main claim)  ·  E = Evidence (specific facts, named things, statistics, quotes)  ·  E = Explanation (consequences, "why it matters", hedged effects)  ·  L = Link (summary — skip)  ·  INTRO = hook with examples  ·  CONCLUSION = recommendation list',
    steps: [
      'First identify the paragraph TYPE. Does it open with a topic sentence making a claim? → PEEL body paragraph. Does it open with historical anecdotes or a hook? → Introduction paragraph. Does it open with a rhetorical question like "So what can we do…"? → Conclusion/advice paragraph.',
      'For PEEL body paragraphs: decide what TYPE of information the question asks for. A specific named thing (a fruit, a chemical, a person)? → Evidence zone. A consequence or effect? → Explanation zone. The main claim of the paragraph? → Point (first sentence only).',
      'For Introduction paragraphs: do not expect a topic sentence. They list historical examples and anecdotes as a hook. Scan for the specific named thing (a fruit name, a product, a substance) directly — the answer is embedded in one of the examples.',
      'For Conclusion/advice paragraphs: they contain a list of practical recommendations. The answer is usually the first or second item in the advice list — read each sentence as a standalone tip rather than as part of a PEEL structure.',
      'Skip the Link sentence in any body paragraph — it paraphrases the Point and almost never introduces new information that could be an answer.',
    ],
    strategies: [
      'Signal words reveal which PEEL zone you are in: "For example / such as / including" → Evidence or Example zone; "Therefore / as a result / this means / consequently" → Explanation zone; "In summary / overall / this shows" → Link zone (skip).',
      'Specific named things — a fruit, a sugar type, a chemical — are almost always in the Evidence zone, never in the Point sentence, even if the question makes them sound like a major claim.',
      'Questions about what "may", "could", or "is suggested to" happen are answered in the Explanation zone — look for hedged causal language, not hard facts.',
      'When a question says "other than X" or "apart from Y", find X first in the passage, then read the sentences immediately around it — the answer is adjacent.',
      '"So what can we/you do?" or "What should we…?" in a paragraph opening signals a Conclusion paragraph. Do not apply PEEL logic here — read each advice sentence individually.',
    ],
    mistakes: [
      'Assuming every paragraph follows PEEL — Introduction and Conclusion paragraphs do not, and forcing PEEL logic onto them sends you to the wrong sentence.',
      'Treating specific named things (a particular sugar, a specific fruit) as Point-level claims — even important-sounding specifics live in the Evidence zone.',
      'Stopping at the first sentence for every question — the Point only holds the paragraph\'s main claim, not the specific details that questions usually target.',
    ],
    sampleAnalysis: [
      {
        num: 1,
        question: 'What fruit was linked to a serious disease in the past?',
        peelPart: 'intro',
        lookFor: 'Introduction paragraph — scan for a fruit name near disease vocabulary; no topic sentence exists here',
        hint: 'Answer: apples (Para A — "chemicals on apples caused cancer"). Para A is an Introduction paragraph listing historical health scares as a hook — it has no PEEL structure. Do not look for a topic sentence. Scan each anecdote directly for a fruit name.',
      },
      {
        num: 2,
        question: 'What type of sugar have humans evolved to seek out?',
        peelPart: 'E-evidence',
        lookFor: 'Para B Evidence zone — look for a sugar name (fructose, glucose, sucrose) several sentences after the topic sentence',
        hint: 'Answer: fructose (Para B — "tongue receptors that responded positively to the taste of fructose"). The Point of Para B is "Humans naturally have a sweet tooth." Fructose is a specific named detail — always Evidence, not Point — even though the question sounds like a major claim.',
      },
      {
        num: 3,
        question: 'What may be negatively affected by children consuming too much sugar?',
        peelPart: 'E-explanation',
        lookFor: '"may", "could", "might" near consequence language ("ruining", "damage", "affect") in the second half of Para C',
        hint: 'Answer: their palate (Para C — "fizzy drinks and sweets may be ruining their palate"). The word "may" marks this as a consequence — Explanation zone. Skip the early evidence sentences and look at the latter half of Para C.',
      },
      {
        num: 4,
        question: 'Other than acid-producing bacteria, what is suggested to have a negative effect on our teeth?',
        peelPart: 'E-evidence',
        lookFor: 'Find "bacteria" in Para F, then read the surrounding expert quote for the second negative factor',
        hint: 'Answer: brushing (Para F — "brushing may be causing more harm than good"). Find "bacteria" first, then look at the professor\'s quote immediately after — the answer is embedded in the expert evidence adjacent to the bacteria mention.',
      },
      {
        num: 5,
        question: 'What do some customers find confusing?',
        peelPart: 'conclusion',
        lookFor: 'Conclusion/advice paragraph (Para H) — read each recommendation sentence; the answer is in the first few pieces of advice',
        hint: 'Answer: ingredient labels (Para H — "Ingredient labels can be misleading"). Para H opens with "So what can we do…" — a Conclusion paragraph. Do not apply PEEL. Read each advice sentence individually; the answer is the second tip in the list.',
      },
    ],
  },
  // ── 1. Most common ────────────────────────────────────────────────────────
  {
    id: 'tfng',
    name: 'True / False / Not Given',
    description:
      'Statements about factual information in the passage are given. You decide: True (the statement agrees with the passage), False (the statement contradicts the passage), or Not Given (the information is not in the passage).',
    answerFormat: 'Type T, F, or NG. In some interfaces, select from a dropdown.',
    steps: [
      'Read the statement carefully and identify its key claim — the specific fact being asserted. Highlight the key noun or verb in the statement (left-click drag → right-click → Highlight).',
      'Scan the passage for the section that discusses the same topic. When you find the relevant sentence, highlight it in the passage so you can compare side by side.',
      'Compare the statement with what the passage actually says — word for word if needed.',
      'Decide: if the passage explicitly confirms the claim → True; if the passage explicitly contradicts it → False; if the passage simply does not address it → Not Given.',
      'Type your answer. If uncertain between False and Not Given, ask: does the passage actively say the opposite? If yes → False. If the passage just stays silent → Not Given.',
    ],
    strategies: [
      'Use only information in the passage. Your general knowledge is irrelevant — even if a statement is factually wrong in real life, mark it True if the passage says it.',
      'Not Given does not mean the statement is false — it means the passage neither confirms nor denies it.',
      'Statements follow the order of the passage. Once you find the relevant section, re-read that paragraph carefully rather than the whole text.',
      'Qualifying words (always, never, only, mainly, some) are frequently the deciding factor. Highlight these words in both the statement and the passage to compare them directly.',
    ],
    mistakes: [
      'Confusing Not Given with False — the passage must actively contradict the statement for it to be False.',
      'Using outside knowledge instead of the passage text.',
      'Rushing past qualifying words (e.g. the passage says "some studies" but the statement says "all studies" — this is False, not True).',
    ],
    tip: {
      label: 'Lost in the passage?',
      text: 'Statements follow the passage order. If you lose your place, take the last statement you answered correctly and resume scanning from that point forward — never restart from the top.',
    },
    decisionTip: {
      label: 'Decision trap: absolute words',
      text: 'Watch for absolute words in the statement — "always", "never", "all", "every", "daily", "must". If the passage uses a softer word like "often", "regular", "may", or "some", the statement is almost never True. If the passage does not address the specific frequency or scope at all, it is NOT GIVEN — not False. Only mark False when the passage actively says the opposite.',
    },
  },
  // ── 2 ────────────────────────────────────────────────────────────────────
  {
    id: 'matching-headings',
    name: 'Matching Headings',
    description:
      'A list of headings (more than the number of paragraphs) is given. You match one heading to each paragraph or section. Some headings will not be used.',
    answerFormat: 'Type or select the Roman numeral (i, ii, iii…) of the matching heading.',
    steps: [
      'Read all the headings first to understand the range of topics on offer.',
      'For each paragraph, read the first and last sentence — the topic sentence and the concluding idea often reveal the main point.',
      'Identify the central idea of the paragraph in your own words. Highlight the sentence that best captures the main point — this helps you compare it against headings without re-reading.',
      'Eliminate headings that clearly do not match and focus your comparison on two or three candidates.',
      'Confirm your choice: the heading should cover the whole paragraph\'s main point, not just a detail mentioned in passing.',
    ],
    strategies: [
      'Headings summarise the main idea of a paragraph — they do not match every detail. A heading that matches only one sentence is likely wrong.',
      'Distractor headings often use words that appear in the paragraph but refer to a secondary point, not the main idea.',
      'If you are unsure, leave the paragraph and complete the ones you are confident about first — process of elimination then helps.',
      'Some paragraphs begin with a contrasting idea before stating the main point. Read to the end before committing.',
    ],
    mistakes: [
      'Matching based on a single keyword that appears in both the paragraph and the heading, without checking the main idea.',
      'Not reading the whole paragraph before choosing — topic sentences are not always at the start.',
      'Using a heading that is too specific (it describes a supporting detail, not the overall point).',
    ],
    tip: {
      label: 'Can\'t hold the whole passage in your head?',
      text: 'Write the paragraph letter next to each heading as you work (e.g. "A = intro, B = problem, C = solutions"). This one-line map prevents you from re-reading already-processed paragraphs and keeps your working memory free for comparing the remaining headings.',
    },
    decisionTip: {
      label: 'Decision trap: keyword match ≠ main idea',
      text: 'Distractor headings deliberately contain a keyword that appears in the paragraph — but refers to a supporting detail, not the main point. If you find a heading that fits one sentence perfectly but the rest of the paragraph is about something else, that heading is wrong. The correct heading must summarise what the whole paragraph is doing. When two headings both seem to fit, ask: which one covers the paragraph\'s purpose from start to finish?',
    },
  },
  // ── 3 ────────────────────────────────────────────────────────────────────
  {
    id: 'matching-info',
    name: 'Matching Information / Features / Sentence Endings',
    description:
      'You match a list of statements, features, or sentence halves to a set of options (e.g. paragraphs, researchers, theories, time periods). Unlike Matching Headings, you are matching specific details, not main ideas. Options may be used more than once.',
    answerFormat: 'Type or select the letter of the matching option (A, B, C… or a paragraph letter).',
    steps: [
      'Read the list of options first (e.g. the names of researchers or the paragraph letters). Understand what each option represents.',
      'Read the first statement and highlight its key content word on screen. Scan the passage for that specific detail.',
      'When you find the relevant section, highlight it in the passage — this lets you confirm the match visually and return to it quickly if needed.',
      'Record your answer and move to the next statement. Answers do not necessarily follow the order of the passage for this question type.',
      'If options can be used more than once, do not assume an option is exhausted after you have used it.',
    ],
    strategies: [
      'This question type requires scanning, not sequential reading — practise moving your eyes quickly across the passage to find specific information.',
      'For Matching Sentence Endings, the completed sentence must be both factually accurate (matching the passage) and grammatically correct.',
      'For Matching Features (e.g. matching opinions to researchers), look for attribution language: "According to X", "X argues that", "X\'s study showed".',
    ],
    mistakes: [
      'Reading the passage from start to finish for each statement — this wastes time. Scan for keywords instead.',
      'Matching based on proximity (the statement mentions something near the keyword) without confirming the full meaning matches.',
      'Assuming each option is used only once when the instruction says options may be used more than once.',
    ],
    tip: {
      label: 'Losing track of which statement you\'re on?',
      text: 'Work through the statements one at a time and highlight the paragraph letter in the passage margin once matched. If a statement sends you to a completely different part of the passage, jot that paragraph letter beside the statement before moving on — this builds a quick reference map so you never search the same section twice.',
    },
    decisionTip: {
      label: 'Decision trap: two paragraphs, same topic',
      text: 'Some topics appear in more than one paragraph. When two paragraphs both seem to contain your statement, check which one contains it as a specific, concrete detail — not just a passing mention. Match to where the detail is the focus, not where the topic word happens to appear. For Matching Sentence Endings specifically, also test grammatical fit: the completed sentence must read naturally in English — if it sounds awkward, it is the wrong ending even if the content seems right.',
    },
  },
  // ── 4 ────────────────────────────────────────────────────────────────────
  {
    id: 'ynng',
    name: 'Yes / No / Not Given',
    description:
      'Similar to True/False/Not Given, but tests the writer\'s views or claims rather than factual information. Yes = the statement agrees with the writer\'s opinion; No = the statement contradicts the writer\'s opinion; Not Given = the writer does not express a view on this.',
    answerFormat: 'Type Y, N, or NG. In some interfaces, select from a dropdown.',
    steps: [
      'Identify whether the question is asking about a fact (→ use T/F/NG logic) or the writer\'s opinion/claim (→ use Y/N/NG logic).',
      'Find the relevant section of the passage where the writer discusses this topic.',
      'Determine what the writer\'s position is — look for opinion markers: "argues", "believes", "suggests", "it is clear that", "unfortunately".',
      'Compare the statement with the writer\'s expressed view: agrees → Yes; contradicts → No; writer does not express a view → Not Given.',
    ],
    strategies: [
      'Focus on the writer\'s own voice, not facts cited from other sources. A fact the writer quotes from a study is not necessarily the writer\'s own view.',
      'Not Given is common when the topic is mentioned but the writer\'s stance on the specific point is neutral or absent.',
      'Look for hedging language: "may", "might", "could suggest" — this indicates the writer is tentative, which can affect whether a strong statement qualifies as Yes or No.',
    ],
    mistakes: [
      'Treating this as a True/False/Not Given question — the key difference is opinion vs. fact.',
      'Marking Yes when the passage mentions the topic but the writer does not express a clear view.',
      'Ignoring tone indicators like "unfortunately" or "surprisingly" that reveal the writer\'s opinion.',
    ],
    decisionTip: {
      label: 'Decision trap: hedging language',
      text: 'If the writer uses "may", "might", "could", or "it is possible that", they are expressing uncertainty — not a clear opinion. A statement that says the writer "believes" something strongly is likely NOT GIVEN if the passage only hedges. Also, a fact the writer quotes from another source (a study, an expert) is not the writer\'s own view — do not treat attributed evidence as a Yes/No answer.',
    },
  },
  // ── 5 ────────────────────────────────────────────────────────────────────
  {
    id: 'multiple-choice',
    name: 'Multiple Choice',
    description:
      'A question is followed by three or four options (A, B, C, D). You choose the one correct answer, or — when specified — two or three correct answers. Questions may test understanding of detail, main idea, or the writer\'s purpose.',
    answerFormat: 'Click or type the letter of the correct option. For multiple answers, select the stated number.',
    steps: [
      'Read the question stem and highlight its key topic word on screen (left-click drag → right-click → Highlight). This marks what you are looking for in the passage.',
      'Read all options before looking at the passage. Note key differences between them — often one word distinguishes correct from incorrect.',
      'Locate the relevant section of the passage using keywords from the question stem.',
      'Read that section carefully and eliminate options that are contradicted or not supported by the passage.',
      'Select the option that is directly supported by the passage — not inferred, not assumed, directly supported.',
    ],
    strategies: [
      'All options often use words from the passage — this is intentional. Read for meaning, not word matching.',
      'Distractors frequently combine two true pieces of information that do not belong together, or add a detail that is not in the passage.',
      'For questions about the writer\'s purpose or attitude, look at the whole relevant paragraph rather than a single sentence.',
      'For "two correct answers" variants, both answers must be individually verifiable in the passage.',
    ],
    mistakes: [
      'Choosing an option because it contains words found in the passage, without checking whether the passage actually supports the claim.',
      'Selecting the most detailed or specific-sounding option — correctness is not determined by specificity.',
      'Not reading all options before going to the passage.',
    ],
    decisionTip: {
      label: 'Decision trap: Frankenstein options',
      text: 'The most common wrong answer combines two true pieces of information from the passage that do not belong together — for example, a cause from one sentence joined to an effect from a different sentence. Before selecting, verify that the passage explicitly links the two ideas in the option. Also watch for scope changes: the passage may say "some researchers" but an option says "most researchers" — this small shift makes it wrong. Always re-read the exact passage sentence that supports your choice before clicking.',
    },
  },
  // ── 6 ────────────────────────────────────────────────────────────────────
  {
    id: 'completion',
    name: 'Summary / Note / Table / Flow-chart Completion',
    description:
      'A summary, set of notes, a table, or a flow-chart based on the passage is given with gaps. You fill in the missing words using words from the passage. The completed text must be factually correct and grammatically consistent.',
    answerFormat: 'ONE, TWO, or THREE WORDS from the passage — always check the instruction.',
    steps: [
      'Read the whole summary, table, or flow-chart first to understand what section of the passage it covers.',
      'Identify the keywords around each gap. Highlight them on screen — these are your search anchors for finding the relevant section of the passage.',
      'Scan the passage to find the relevant section, then read it carefully to identify the exact words that fill the gap.',
      'Type the words exactly as they appear in the passage. Do not paraphrase.',
      'Re-read the completed sentence to confirm it is factually correct and within the word limit.',
    ],
    strategies: [
      'The summary is a paraphrase of the passage — the words around the gap are synonyms or restructured versions of the passage text. Expect paraphrasing.',
      'The gap will almost always be a noun, noun phrase, adjective, or number — use the surrounding grammar to predict the word type before scanning.',
      'For flow-charts, follow the arrows to understand the sequence. Gaps usually represent key steps or outcomes.',
    ],
    mistakes: [
      'Using words from the summary (the question itself) rather than words from the passage.',
      'Paraphrasing instead of copying exact words from the passage.',
      'Exceeding the word limit — include only the words needed to fill the gap, not the surrounding context.',
    ],
    tip: {
      label: 'Can\'t follow the long passage to find each gap?',
      text: 'Use the words immediately before AND after the gap as a two-word anchor. These surrounding words are rarely paraphrased — search the passage for that exact phrase pair (e.g. "solar energy _____ cities" → find "solar energy" near "cities"). Once you land on the right line, the answer is right there. Never scan the whole passage for each gap — pin the section first, then extract.',
    },
    decisionTip: {
      label: 'Decision trap: articles and word limits',
      text: 'If the instruction says ONE WORD, the answer cannot include "the" or "a" — even if those words appear in the passage before the answer. For example, if the passage says "the reduction in costs" and the answer is one word, write "reduction", not "the reduction". Also, the summary is a paraphrase of the passage, so the words around the gap will look different — do not try to match the gap\'s surrounding words directly; match the meaning, then find the exact word from the passage to fill it.',
    },
  },
  // ── 7 ────────────────────────────────────────────────────────────────────
  {
    id: 'sentence-completion',
    name: 'Sentence Completion',
    description:
      'Incomplete sentences based on the passage are given. You complete them using words from the passage. The completed sentence must be grammatically correct and factually match the passage.',
    answerFormat: 'ONE, TWO, or THREE WORDS from the passage — check the instruction.',
    steps: [
      'Read the incomplete sentence and identify its subject, verb, and what is missing (object, complement, modifier).',
      'Use the grammar of the sentence to predict the word type needed: a noun, adjective, verb form, etc.',
      'Highlight the key content word in the sentence on screen, then scan the passage for that section.',
      'Find the exact words in the passage that complete the sentence grammatically and factually.',
      'Confirm the completed sentence reads naturally and does not exceed the word limit.',
    ],
    strategies: [
      'The sentence is a paraphrase of the passage — look for meaning matches, not identical phrasing.',
      'The grammatical structure is a strong constraint: if the gap follows "a", the answer is a singular noun; if it follows "is", the answer likely describes a state or characteristic.',
      'Sentences follow the order of the passage — once you find the section for one sentence, the next sentence\'s answer is nearby.',
    ],
    mistakes: [
      'Ignoring grammatical constraints and typing words that do not fit the sentence structure.',
      'Including the word that comes just before or after the gap in the passage, pushing the answer over the word limit.',
      'Paraphrasing the passage instead of copying the exact words.',
    ],
    tip: {
      label: 'Sentence too long to track where it maps in the passage?',
      text: 'Underline the main verb of the incomplete sentence — it is almost always kept the same (or closely synonymised) in the passage. Searching for that verb anchors you to the right line instantly, even in a dense paragraph. Once found, read that sentence only, not the surrounding text.',
    },
    decisionTip: {
      label: 'Decision trap: grammatical fit',
      text: 'The grammar of the incomplete sentence is a hard constraint — not a hint. If the gap follows "a", the answer must be a singular countable noun. If the gap follows "is", the answer is likely an adjective or noun phrase describing a state. Even if you find the right section in the passage, if the word does not fit the grammar of the incomplete sentence, keep reading. Also, never use the word immediately after the gap in the passage as part of your answer — that word already appears in the question, and copying it would put you over the word limit.',
    },
  },
  // ── 8 ────────────────────────────────────────────────────────────────────
  {
    id: 'short-answer',
    name: 'Short Answer Questions',
    description:
      'Direct questions about specific factual details in the passage. Answers come directly from the passage text and are kept short — usually one to three words.',
    answerFormat: 'ONE, TWO, or THREE WORDS from the passage — check the instruction.',
    steps: [
      'Read the question and identify the question word: Who, What, Where, When, Why, How many, How much. This tells you exactly the type of information to find.',
      'Highlight the key content word from the question on screen (left-click drag → right-click → Highlight) — this is your search anchor for scanning the passage.',
      'Scan the passage for that anchor, then read the surrounding sentences carefully.',
      'Extract the exact words from the passage that answer the specific question. Do not paraphrase.',
      'Check: does your answer directly answer the question word? Check the word count.',
    ],
    strategies: [
      '"Who" → a name or role. "Where" → a place. "When" → a time, date, or period. "How many/much" → a number or quantity. Use the question word to narrow your focus before scanning.',
      'Answers appear in the same order as the questions — use each found answer as a signpost to the next section.',
      'The question is usually a paraphrase of the passage. Your search keyword will often not appear word-for-word; scan for synonyms.',
    ],
    mistakes: [
      'Typing a full sentence instead of the specific word or phrase the question asks for.',
      'Including unnecessary words (articles, prepositions) that push the answer over the word limit.',
      'Answering with outside knowledge rather than words from the passage.',
    ],
    decisionTip: {
      label: 'Decision trap: question word type',
      text: 'The question word tells you the exact category of answer — not just the topic. "How many" demands a number; "several" or "a few" are wrong even if that is what the passage implies. "Where" demands a place name; a description like "near the coast" may be incorrect if the passage gives an actual location name. "When" demands a time or period — not a reason or condition. If your answer does not match the category the question word demands, you have found the right section but the wrong sentence. Read more carefully within that section.',
    },
  },
  // ── 9. Least common ───────────────────────────────────────────────────────
  {
    id: 'diagram-labelling',
    name: 'Diagram Label Completion',
    description:
      'A diagram (often of a process, an object, or a structure) is shown with numbered blanks. You label the diagram using words from the passage. The diagram usually illustrates a specific section of the passage.',
    answerFormat: 'ONE, TWO, or THREE WORDS from the passage — check the instruction.',
    steps: [
      'Study the diagram on screen before reading the passage. Understand what it shows — a process, a physical object, a structure.',
      'Identify any labels already given — these are reference points that tell you which section of the passage the diagram corresponds to.',
      'Read the relevant section of the passage carefully, following the description of the diagram step by step.',
      'Match each numbered blank to the corresponding part of the passage and type the exact words used.',
      'Check that your labels make sense in context of the diagram — a label for a component should name that component, not describe an unrelated process.',
    ],
    strategies: [
      'The passage will describe the diagram in sequence. Follow the same direction the passage moves (e.g. left to right, top to bottom, input to output).',
      'Technical terms are often used exactly in the passage — listen carefully for repeated or spelled-out terms.',
      'If the diagram shows a process, look for sequence language in the passage: "first", "then", "subsequently", "finally".',
    ],
    mistakes: [
      'Not orienting yourself to the diagram before reading — without understanding the diagram\'s structure, it is impossible to know which part of the passage is relevant.',
      'Clicking the wrong blank on screen because the diagram labels look similar — confirm which number is active before typing.',
      'Using a term from a different part of the passage that sounds plausible but does not match the specific diagram element.',
    ],
    tip: {
      label: 'Can\'t match the diagram to the right part of the passage?',
      text: 'Find one label that is already filled in on the diagram (or the diagram\'s title) and search the passage for that exact term — this pins you to the correct paragraph immediately. All other blanks are in the same paragraph or the next one. Work outward from this anchor rather than scanning the whole passage for each blank separately.',
    },
    decisionTip: {
      label: 'Decision trap: direction and order',
      text: 'If you label the diagram in the wrong order (e.g. output before input, or bottom before top), every answer shifts and they all appear wrong. Before filling any blank, trace the diagram\'s flow direction — follow the arrows, numbered sequence, or spatial layout. If the passage describes a left-to-right process, work through the blanks left to right on the diagram, not by their number order if the numbers are not sequential. Also, technical terms in diagrams are rarely paraphrased — if the passage uses "condenser", the blank wants "condenser", not a synonym.',
    },
  },
]
