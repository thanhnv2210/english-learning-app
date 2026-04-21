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
}

export const READING_GUIDES: ReadingGuide[] = [
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
]
