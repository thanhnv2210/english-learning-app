export type QuestionTypeGuide = {
  id: string
  name: string
  description: string
  wordLimit: string
  steps: string[]
  strategies: string[]
  mistakes: string[]
}

export const LISTENING_GUIDES: QuestionTypeGuide[] = [
  {
    id: 'note-completion',
    name: 'Note / Form / Table / Summary Completion',
    description:
      'A partially completed set of notes, a form, a table, or a summary is shown on screen. You type the missing words directly into the input fields using information from the recording. This is the most common question type in IELTS Listening.',
    wordLimit: 'ONE, TWO, or THREE WORDS AND/OR A NUMBER — always check the instruction on screen.',
    steps: [
      'Before the recording starts, read all the gaps on screen carefully. Highlight the key word immediately before each blank (left-click drag → right-click → Highlight) — this marks your listening trigger visually without switching to scratch paper.',
      'Predict the type of word needed for each gap — noun, number, adjective, verb, etc. Jot the predicted type on your scratch paper next to the question number. This narrows your listening focus.',
      'As the recording plays, follow the text on screen and type your answer into each field the moment you hear it.',
      'Type only as many words as the instruction allows. Never paraphrase — use the speaker\'s exact words.',
      'After the recording finishes, use the review time to check spelling, grammar agreement, and that you have not exceeded the word limit in any field.',
    ],
    strategies: [
      'The words on screen are often paraphrases of what the speaker says. Listen for synonyms, not identical wording.',
      'Answers appear in the same order as the recording. If you miss one, move on immediately — do not dwell.',
      'Numbers, dates, names, and prices are common gap-fill answers. Listen carefully to the exact form (e.g. "thirty" vs "13").',
      'In form completion, the category label on screen (e.g. "Name:", "Date of birth:") tells you exactly what type of answer to expect.',
    ],
    mistakes: [
      'Typing more words than the limit allows — even a correct answer is marked wrong if it exceeds the word count.',
      'Spelling errors on simple words like names, places, or days of the week — unlike handwriting, the examiner sees exactly what you typed.',
      'Paraphrasing the answer instead of using the speaker\'s exact words.',
      'Falling behind because you are still typing the previous answer — keep up with the recording and use the review screen time to correct errors.',
    ],
  },
  {
    id: 'sentence-completion',
    name: 'Sentence Completion',
    description:
      'A set of sentences that summarise key information from the recording is shown on screen. Each sentence has one or two words missing. You type into the gap. The completed sentence must be grammatically correct and match the recording.',
    wordLimit: 'ONE, TWO, or THREE WORDS — check the instruction; "AND/OR A NUMBER" may be added.',
    steps: [
      'Read each incomplete sentence on screen and identify the subject and verb to understand what the sentence is about.',
      'Look at what comes directly before and after the gap to predict the grammatical form needed (e.g. a plural noun, an -ing verb, a comparative adjective). Jot your prediction on your scratch paper.',
      'Highlight one key content word from each sentence on screen (left-click drag → right-click → Highlight) — this is the keyword that tells you when the speaker has reached that question.',
      'Listen for the moment the speaker addresses the topic of the sentence, then type the missing word(s) exactly.',
      'After typing, silently re-read the completed sentence on screen to confirm it makes grammatical sense.',
    ],
    strategies: [
      'The sentence on screen is a paraphrase of what is said. Listen for the meaning, not word-for-word matches.',
      'The grammatical structure of the sentence constrains the answer — use this to eliminate wrong words while listening.',
      'Speakers may express the same idea multiple times. The second mention is often cleaner and easier to catch.',
    ],
    mistakes: [
      'Typing words that make the sentence grammatically incorrect even if you heard them in the recording.',
      'Exceeding the word limit by including small words like articles ("a", "the") when they are not necessary.',
      'Confusing similar-sounding words, especially names or technical terms — re-read your typed answer before moving on.',
    ],
  },
  {
    id: 'multiple-choice-single',
    name: 'Multiple Choice — Single Answer',
    description:
      'A question is followed by three options (A, B, C) on screen. You click the one correct answer. The question may be a complete sentence or a sentence stem that the options complete.',
    wordLimit: 'Click one option only (A, B, or C). Do not type — just click.',
    steps: [
      'Read the question stem on screen carefully. Highlight the key topic word in the stem (left-click drag → right-click → Highlight) — this is what you are listening for.',
      'Read all three options before the recording starts. Note the key difference between them on your scratch paper.',
      'As you listen, use your scratch paper to cross off options that are explicitly contradicted or rejected by the speaker. On-screen highlighting is less useful here because you need to track elimination, not just mark words.',
      'The correct option is the one that is confirmed — not just mentioned — by the speaker. Click it.',
      'If unsure between two remaining options after the relevant section, commit to one, click it, and move on.',
    ],
    strategies: [
      'All three options are usually mentioned in the recording. The speaker will confirm one and reject or qualify the others.',
      'Listen for confirmation language: "actually", "in fact", "what we found was", "the main reason is".',
      'Distractors are often mentioned first. The correct answer tends to come after a contrast word like "but", "however", or "actually".',
      'Negative questions ("Which option is NOT…") require you to identify two confirmed options to eliminate, then click the third.',
    ],
    mistakes: [
      'Clicking the first option mentioned — this is often a distractor.',
      'Not reading all three options before the recording starts, leading to confusion when unfamiliar options appear.',
      'Missing the contrast word that signals the speaker is correcting or rejecting an option.',
    ],
  },
  {
    id: 'multiple-choice-multiple',
    name: 'Multiple Choice — Multiple Answers',
    description:
      'A question is followed by five or more options on screen. You must click two or three correct answers. The instruction states exactly how many to select.',
    wordLimit: 'Select the exact number of options stated in the instruction — no more, no less.',
    steps: [
      'Read the instruction on screen carefully and note exactly how many answers are required.',
      'Read all options before the recording and group them mentally by theme to make comparison easier.',
      'On your scratch paper, track options with ✓ (confirmed) and ✗ (eliminated) as you listen. Click on screen only when you are confident.',
      'Do not click an option until the speaker clearly confirms it — early mentions may be rejected later.',
      'After the relevant section ends, check your scratch paper tally and verify your on-screen selections match the required count.',
    ],
    strategies: [
      'Each correct answer will be explicitly confirmed, not just mentioned in passing.',
      'The recording often addresses the options in a different order from how they appear on screen.',
      'Listen carefully to the full sentence — a speaker may say something positive then immediately correct themselves.',
    ],
    mistakes: [
      'Selecting too many options — any count above the required number results in the whole question being marked wrong.',
      'Clicking options that were mentioned but not confirmed as correct.',
      'Not using scratch paper to track confirmed vs. eliminated options, leading to confusion mid-recording.',
    ],
  },
  {
    id: 'matching',
    name: 'Matching',
    description:
      'You are shown a list of items (e.g. people, places, events) and a set of options (e.g. opinions, features, activities) on screen. You select or type the matching option for each item. Options may be used more than once.',
    wordLimit: 'Select or type the letter of the matching option — check whether the interface uses a dropdown, click, or text field.',
    steps: [
      'Read the full list of items and all options on screen before the recording starts.',
      'For each item, highlight one key word on screen or jot it on your scratch paper — this is the anchor word that tells you when the recording has reached that item.',
      'As each item is addressed in the recording, listen carefully for the matching description — which will be paraphrased, not word-for-word identical to the option.',
      'Select or type your answer and move on immediately — do not dwell on previous items while the recording continues.',
      'If an option can be reused, stay alert even after you have already matched it once.',
    ],
    strategies: [
      'Options on screen are paraphrases of what the speaker says. If the option says "expensive", the speaker may say "it costs a lot" or "the price is high".',
      'The items in the question appear in recording order. Use them as signposts for where you are in the audio.',
      'When options may be used more than once, do not assume an option is "used up" — check the instruction.',
    ],
    mistakes: [
      'Matching based on a single keyword heard in passing rather than the full meaning confirmed by the speaker.',
      'Assuming each option is used exactly once when the instructions say otherwise.',
      'Falling behind on one item and missing the next one while trying to catch up.',
    ],
  },
  {
    id: 'plan-map-diagram',
    name: 'Plan / Map / Diagram Labelling',
    description:
      'A visual — a floor plan, a map, or a technical diagram — is displayed on screen with some labels already given. You type the missing labels into the fields on the image using words from the recording.',
    wordLimit: 'ONE, TWO, or THREE WORDS — check the instruction.',
    steps: [
      'Study the visual on screen carefully before the recording starts. Identify reference points that are already labelled (e.g. "Entrance", "North"). On your scratch paper, sketch a quick rough copy to orientate yourself — this lets you add directional notes and arrows alongside your rough sketch while the recording plays.',
      'Understand the orientation of the visual — which direction is up, where the starting point is.',
      'As the recording begins, locate the speaker\'s starting point on the visual and follow their directions step by step.',
      'Type the label for each location or part as it is named, using exact words from the recording.',
      'Use already-labelled items on screen as anchors if you lose your place — the speaker will reference them.',
    ],
    strategies: [
      'Directional language is key: "opposite", "next to", "between", "on the left", "at the end of", "facing". Practise recognising these instantly.',
      'The speaker usually moves through the visual in a logical sequence (left-to-right, clockwise, room by room). Anticipate the direction.',
      'For diagrams, technical part names are often spelled out or repeated — listen for the repetition to confirm your spelling before typing.',
    ],
    mistakes: [
      'Not studying the visual on screen before the recording plays — you cannot orientate yourself while simultaneously listening.',
      'Confusing "left" and "right" from the speaker\'s perspective vs. the map\'s orientation on screen.',
      'Typing a nearby label into the wrong field because the visual features look similar — double-check which field is active before typing.',
    ],
  },
  {
    id: 'short-answer',
    name: 'Short Answer Questions',
    description:
      'Direct questions about specific facts in the recording are shown on screen. You type short answers — typically one to three words taken directly from what the speaker says.',
    wordLimit: 'ONE, TWO, or THREE WORDS AND/OR A NUMBER — check the instruction.',
    steps: [
      'Read each question on screen and identify the question word (Who, What, Where, When, How many, etc.) — this tells you exactly what type of information to listen for.',
      'Highlight the key content word from each question on screen (left-click drag → right-click → Highlight) — this is your trigger for when the recording reaches that question.',
      'Listen for the answer and type it using the exact words from the recording — no synonyms, no paraphrasing.',
      'Keep your answer concise. If the answer is a name or place, double-check your spelling before moving to the next question.',
      'After the recording, use the review screen to verify each typed answer answers the specific question asked and does not exceed the word limit.',
    ],
    strategies: [
      '"Who" → a name or job title. "Where" → a place or location. "When" → a time or date. "How many" → a number. Use the question word to narrow your focus before listening.',
      'Answers are given in the same order as the questions. Use each answer as a marker that you are moving to the next question.',
      'Short answer questions often target specific factual details — numbers, names, and objects — which the speaker states clearly.',
    ],
    mistakes: [
      'Typing a full sentence instead of the specific word or phrase asked for.',
      'Answering a different question word — e.g. typing a "what" answer when the question asks "when".',
      'Including unnecessary articles or prepositions that push the answer over the word limit.',
    ],
  },
]
