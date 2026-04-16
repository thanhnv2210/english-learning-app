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
      'A partially completed set of notes, a form, a table, or a summary is provided. You fill in the missing words using information from the recording. This is the most common question type in IELTS Listening.',
    wordLimit: 'ONE, TWO, or THREE WORDS AND/OR A NUMBER — always check the instruction.',
    steps: [
      'Before the recording starts, read all the gaps carefully and underline the words immediately before and after each blank.',
      'Predict the type of word needed for each gap — noun, number, adjective, verb, etc. This narrows your listening focus.',
      'As the recording plays, follow the text and fill in each blank with the exact words you hear.',
      'Write only as many words as the instruction allows. Never paraphrase — use the speaker\'s exact words.',
      'After the recording finishes, quickly check spelling, grammar agreement, and that you have not exceeded the word limit.',
    ],
    strategies: [
      'The words in the notes are often paraphrases of what the speaker says. Listen for synonyms, not identical wording.',
      'Answers appear in the same order as the recording. If you miss one, move on immediately — do not dwell.',
      'Numbers, dates, names, and prices are common gap-fill answers. Listen carefully to the exact form (e.g. "thirty" vs "13").',
      'In form completion, the category label (e.g. "Name:", "Date of birth:") tells you exactly what type of answer to expect.',
    ],
    mistakes: [
      'Writing more words than the limit allows — even a correct answer is marked wrong if it exceeds the word count.',
      'Spelling errors on simple words like names, places, or days of the week.',
      'Paraphrasing the answer instead of copying the speaker\'s exact words.',
      'Missing the answer because you are still writing the previous one — always keep up with the recording.',
    ],
  },
  {
    id: 'sentence-completion',
    name: 'Sentence Completion',
    description:
      'A set of sentences that summarise key information from the recording. Each sentence has one or two words missing. The completed sentence must be grammatically correct and match the recording.',
    wordLimit: 'ONE, TWO, or THREE WORDS — check the instruction; "AND/OR A NUMBER" may be added.',
    steps: [
      'Read each incomplete sentence and identify the subject and verb to understand what the sentence is about.',
      'Look at what comes directly before and after the gap to predict the grammatical form needed (e.g. a plural noun, an -ing verb, a comparative adjective).',
      'Underline the key content words in each sentence — these are the "keywords" you will listen for in the recording.',
      'Listen for the moment the speaker addresses the topic of the sentence, then capture the missing word(s) exactly.',
      'After writing, silently re-read the completed sentence to confirm it makes grammatical sense.',
    ],
    strategies: [
      'The sentence in the question is a paraphrase of what is said. Listen for the meaning, not word-for-word matches.',
      'The grammatical structure of the sentence constrains the answer — use this to eliminate wrong options while listening.',
      'Speakers may express the same idea multiple times. The second mention is often cleaner and easier to catch.',
    ],
    mistakes: [
      'Writing words that make the sentence grammatically incorrect even if you heard them in the recording.',
      'Exceeding the word limit by including small words like articles ("a", "the") when they are not necessary.',
      'Confusing similar-sounding words, especially names or technical terms.',
    ],
  },
  {
    id: 'multiple-choice-single',
    name: 'Multiple Choice — Single Answer',
    description:
      'A question is followed by three options (A, B, C). You choose the one correct answer. The question may be a complete sentence or a sentence stem that the options complete.',
    wordLimit: 'Circle or write the letter only (A, B, or C).',
    steps: [
      'Read the question stem carefully and underline the key topic — this tells you what to listen for.',
      'Read all three options before the recording starts. Note key differences between them.',
      'As you listen, cross out options that are explicitly contradicted or not mentioned as correct.',
      'The correct option is the one that is confirmed — not just mentioned — by the speaker.',
      'If unsure between two remaining options after the relevant section, make a decision and move on.',
    ],
    strategies: [
      'All three options are usually mentioned in the recording. The speaker will confirm one and reject or qualify the others.',
      'Listen for confirmation language: "actually", "in fact", "what we found was", "the main reason is".',
      'Distractors are often mentioned first. The correct answer tends to come after a contrast word like "but", "however", or "actually".',
      'Negative questions ("Which option is NOT…") require you to identify two confirmed options to eliminate, then pick the third.',
    ],
    mistakes: [
      'Choosing the first option mentioned — this is often a distractor.',
      'Not reading all three options before the recording starts, leading to surprise at unfamiliar options.',
      'Missing the contrast word that signals the speaker is correcting or rejecting an option.',
    ],
  },
  {
    id: 'multiple-choice-multiple',
    name: 'Multiple Choice — Multiple Answers',
    description:
      'A question is followed by five or more options. You must select two or three correct answers. The instruction will state how many answers are required.',
    wordLimit: 'Write two or three letters (e.g. A, C) — the exact number is stated in the question.',
    steps: [
      'Read the instruction carefully and note exactly how many answers are required.',
      'Read all options before the recording and group them mentally by theme to make comparison easier.',
      'Tick options lightly as they are confirmed by the speaker. Cross out options that are contradicted.',
      'Do not commit to an answer until the speaker clearly confirms it — early mentions may be rejected later.',
      'After the relevant section ends, count your ticked options and verify the number matches the requirement.',
    ],
    strategies: [
      'Each correct answer will be explicitly confirmed, not just mentioned in passing.',
      'The recording often deals with the options in a different order from how they appear on the page.',
      'Listen carefully to the full sentence — a speaker may say something positive then correct themselves.',
    ],
    mistakes: [
      'Selecting too many answers — any extra selection above the required number results in the whole question being marked wrong.',
      'Selecting options that were mentioned but not confirmed as correct.',
      'Not tracking which options are confirmed vs. rejected because you are writing too slowly.',
    ],
  },
  {
    id: 'matching',
    name: 'Matching',
    description:
      'You are given a list of items (e.g. people, places, events) and a set of options (e.g. opinions, features, activities). You match each item to the correct option. Options may be used more than once.',
    wordLimit: 'Write the letter of the matching option.',
    steps: [
      'Read the full list of items and all options before the recording starts.',
      'For each item, identify one or two key words that will help you locate the relevant section in the recording.',
      'As each item is addressed in the recording, listen carefully for the matching description — which will be paraphrased, not identical to the option.',
      'Write your answer and continue — do not re-listen to earlier sections while the recording continues.',
      'If an option can be reused, stay alert even after you have used it once.',
    ],
    strategies: [
      'Options are paraphrases of what the speaker says. If the option says "expensive", the speaker may say "it costs a lot" or "the price is high".',
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
      'A visual — a floor plan, a map, or a technical diagram — is provided with some labels already given. You fill in the missing labels using words from the recording.',
    wordLimit: 'ONE, TWO, or THREE WORDS — check the instruction.',
    steps: [
      'Study the visual carefully before the recording starts. Identify reference points that are already labelled (e.g. "Entrance", "North").',
      'Understand the orientation of the visual — which direction is up, where the starting point is.',
      'As the recording begins, locate the speaker\'s starting point on the visual and follow their directions step by step.',
      'Write the label for each location or part as it is named, using exact words from the recording.',
      'Use already-labelled items as anchors if you lose your place — the speaker will reference them.',
    ],
    strategies: [
      'Directional language is key: "opposite", "next to", "between", "on the left", "at the end of", "facing". Practise recognising these instantly.',
      'The speaker usually moves through the visual in a logical sequence (left-to-right, clockwise, room by room). Anticipate the direction.',
      'For diagrams, technical part names are often spelled out or repeated — listen for the repetition to catch the spelling.',
    ],
    mistakes: [
      'Not familiarising with the visual before the recording plays — you cannot orientate yourself while simultaneously listening.',
      'Confusing "left" and "right" from the speaker\'s perspective vs. the map\'s orientation.',
      'Writing a nearby label in the wrong blank because the visual features look similar.',
    ],
  },
  {
    id: 'short-answer',
    name: 'Short Answer Questions',
    description:
      'Direct questions about specific facts in the recording. Answers are short — typically one to three words taken directly from what the speaker says.',
    wordLimit: 'ONE, TWO, or THREE WORDS AND/OR A NUMBER — check the instruction.',
    steps: [
      'Read each question and identify the question word (Who, What, Where, When, How many, etc.) — this tells you exactly what type of information to listen for.',
      'Underline key content words in the question to know when the relevant section of the recording begins.',
      'Listen for the answer and write it using the exact words from the recording — no synonyms, no paraphrasing.',
      'Keep your answer concise. If the answer is a name or place, check your spelling.',
      'After the recording, verify each answer answers the specific question asked and does not exceed the word limit.',
    ],
    strategies: [
      '"Who" → a name or job title. "Where" → a place or location. "When" → a time or date. "How many" → a number. Use the question word to narrow your focus before listening.',
      'Answers are given in the same order as the questions. Use each answer as a marker that you are moving to the next question.',
      'Short answer questions often target specific factual details — numbers, names, and objects — which the speaker states clearly.',
    ],
    mistakes: [
      'Writing a full sentence instead of the specific word or phrase asked for.',
      'Answering a different question word — e.g. answering "what" when the question asks "when".',
      'Including unnecessary articles or prepositions that push the answer over the word limit.',
    ],
  },
]
