export type SpeakingGuide = {
  id: string
  name: string
  description: string
  timeAllowed: string
  steps: string[]
  strategies: string[]
  mistakes: string[]
}

export const SPEAKING_GUIDES: SpeakingGuide[] = [
  {
    id: 'part1',
    name: 'Part 1 — Introduction & Interview',
    description:
      'The examiner asks familiar, personal questions about you, your home, your work or study, your hobbies, and everyday topics. Part 1 lasts 4–5 minutes. Questions are short and predictable — the challenge is answering fluently with appropriate length, not memorising scripts.',
    timeAllowed: '4–5 minutes total. Each answer should be 2–4 sentences — not one word, not a monologue.',
    steps: [
      'Listen to the question and identify whether it asks about habit ("Do you…?"), preference ("Do you prefer…?"), frequency ("How often…?"), reason ("Why do you…?"), or past/future ("Did you ever…?", "Would you like to…?"). Your answer structure should match the question type.',
      'Answer directly in your first sentence — do not begin with "Well, that\'s a good question" or hesitate with filler sounds.',
      'Extend your answer by adding a reason, an example, or a contrast: one or two extension sentences are enough. Aim for 2–4 sentences total.',
      'Use natural spoken language — Part 1 does not require complex grammar or formal vocabulary. Fluency and naturalness matter more here than in Part 3.',
      'If you do not understand a question, ask politely: "I\'m sorry, could you repeat that?" or "Do you mean…?" — do not guess silently and give an off-topic answer.',
    ],
    strategies: [
      'Prepare answers for the core Part 1 topics: home, hometown, work or study, free time, daily routine, food, transport, weather, technology. These topics repeat across almost every test.',
      'Use natural linking phrases to extend answers: "…mainly because…", "…for example…", "…although I suppose…", "…compared to before…".',
      'Vary your sentence openings — starting every sentence with "I" sounds monotonous. Use "It\'s…", "There\'s…", "Sometimes…", "One thing I…".',
      'Do not memorise full scripts — an obviously rehearsed answer with unnatural pauses between memorised chunks is marked down for fluency.',
    ],
    mistakes: [
      'One-word or one-sentence answers — always extend with a reason or example.',
      'Answers that are too long — three or four sentences is ideal; a Part 1 monologue disrupts the conversational rhythm the examiner expects.',
      'Using very formal vocabulary ("It is my belief that…") — Part 1 is conversational; match the register.',
      'Starting with filler phrases: "That\'s a great question", "Hmm, let me think" — pause briefly if needed, then answer.',
    ],
  },
  {
    id: 'part2',
    name: 'Part 2 — Individual Long Turn',
    description:
      'You are given a task card describing a topic with 3–4 bullet points. You have exactly 1 minute to prepare notes, then you must speak for 1–2 minutes without interruption. The examiner will stop you at 2 minutes. A rounding-off question follows.',
    timeAllowed: '1 minute preparation. 1–2 minutes speaking. Follow-up question: 1–2 sentences.',
    steps: [
      'Read the task card immediately and identify the topic and the four bullet points. The bullet points are suggestions — you should address them all, but you can add your own details too.',
      'During your 1 minute of preparation, jot 3–4 key words or phrases on your notepad — one per bullet point. Do not write sentences. These are memory triggers, not a script.',
      'Begin speaking immediately when told to. Start with a clear opening sentence that introduces the topic: "I\'d like to talk about…", "The [person/place/event] I\'m going to describe is…".',
      'Work through the bullet points in order, spending roughly 20–25 seconds on each. Use your notes as a guide but speak naturally, not by reading.',
      'If you approach 2 minutes and have covered all points, add a final reflection or personal comment to fill the time: "What I remember most is…", "Looking back, I think…".',
    ],
    strategies: [
      'Speak for the full 2 minutes — stopping at 1 minute is a fluency penalty. Keep talking even if you feel you have covered the main points.',
      'Use past tense naturally if describing a past event or person. This is the most common Part 2 frame.',
      'If you lose your place, refer to your notes — this is expected and does not penalise you.',
      'Add sensory and emotional detail to fill time naturally: "I remember it was quite cold that day", "I felt nervous at first, but then…".',
      'The rounding-off question after your 2 minutes is very short — just 1–2 sentences. Do not over-elaborate.',
      'Your auxiliary verb carries the tense signal for your listener. In connected speech the -d on past participles often reduces or disappears ("have evolve" instead of "have evolved") — this is natural and the examiner follows it. But your auxiliary (have, had, was, were) must be clear and correctly chosen, because that is what your listener uses to identify your tense.',
    ],
    mistakes: [
      'Stopping before 2 minutes and waiting for the examiner to ask a question — keep talking.',
      'Writing full sentences in your notes — this wastes preparation time and leads to unnatural reading-aloud behaviour.',
      'Staying only on the first bullet point and running out of time before reaching the others.',
      'Starting your answer by reading the task card back to the examiner word for word.',
    ],
  },
  {
    id: 'part3',
    name: 'Part 3 — Two-Way Discussion',
    description:
      'The examiner asks abstract, opinion-based questions related to the Part 2 topic — but at a societal or conceptual level, not personal. Questions are more complex: "Why do you think…?", "How has… changed?", "In what ways might…?", "Do you think…?". Part 3 lasts 4–5 minutes.',
    timeAllowed: '4–5 minutes total. Each answer should be 4–6 sentences — substantive and developed.',
    steps: [
      'Listen to the full question before you begin thinking. Part 3 questions are longer and more nuanced than Part 1. Identify: Is it asking for a reason? A comparison? A prediction? An opinion?',
      'Use 1–2 seconds to formulate your answer direction before speaking. A brief pause to think is acceptable and natural — better than a rambling opener.',
      'State your position or main point in the first sentence, then develop it with a reason, an example, or a concession.',
      'Use the full length of your answer — 4–6 sentences. Part 3 is where grammar and vocabulary complexity is most visible to the examiner.',
      'If you do not fully agree or disagree, acknowledge the complexity: "It depends on the context, but in general I would say…", "There are two sides to this, though I tend to think…".',
    ],
    strategies: [
      'Part 3 is where you demonstrate your range of vocabulary and grammar. Use conditionals, passive voice, relative clauses, and hedging language naturally.',
      'Use abstract framing: "In many societies…", "From a wider perspective…", "At an individual level… but at a societal level…".',
      'Use hedging to show academic thinking: "It could be argued that…", "There is evidence to suggest…", "This may be partly due to…".',
      'It is acceptable to change your position mid-answer if the examiner offers a counter-argument — the examiner is not testing whether you are right, but whether you can discuss fluently.',
      'Practise Part 3 answers in the structure: Position → Reason → Example or Concession → Restatement.',
    ],
    mistakes: [
      'Giving a Part 1-length answer (2 sentences) to a Part 3 question — this is the single most common error in Part 3.',
      'Avoiding complex grammar by using only simple sentences — Part 3 is your chance to demonstrate grammatical range.',
      'Saying "I don\'t know about this topic" and stopping — use general reasoning even if you lack specific knowledge.',
      'Giving a personal story or personal example — Part 3 expects general or societal examples, not "My friend once…".',
      'Memorising and delivering scripted answers — the examiner can tell, and delivery sounds unnatural.',
    ],
  },
]
