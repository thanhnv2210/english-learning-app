export type Platform = 'claude' | 'chatgpt' | 'gemini'
export type Skill = 'speaking' | 'writing' | 'reading' | 'listening'

export type PromptCard = {
  id: string
  title: string
  description: string
  text: Record<Platform, string>
}

export type SkillSection = {
  skill: Skill
  label: string
  icon: string
  prompts: PromptCard[]
}

export const PLATFORM_META: Record<Platform, { label: string; icon: string; tip: string }> = {
  claude: {
    label: 'Claude',
    icon: '◆',
    tip: 'Works best with Projects — paste into the System Prompt field for a persistent examiner session.',
  },
  chatgpt: {
    label: 'ChatGPT',
    icon: '◉',
    tip: 'Use GPT-4o for best results. Paste into a new chat and press Enter.',
  },
  gemini: {
    label: 'Gemini',
    icon: '✦',
    tip: 'Use Gemini 1.5 Pro or Gemini Advanced. Paste as your first message.',
  },
}

export function getPromptLibrary(targetBand: number, targetProfile: string): SkillSection[] {
  const isBusiness = targetProfile === 'Business_Fluent'
  const bandLabel = isBusiness ? 'professional business English' : `IELTS Academic Band ${targetBand}`
  const goalLine = isBusiness
    ? 'The goal is professional clarity, conciseness, and appropriate business register.'
    : `The goal is to reach ${bandLabel}. Apply IELTS Academic scoring descriptors strictly.`

  return [
    // ─── SPEAKING ─────────────────────────────────────────────────────────────
    {
      skill: 'speaking',
      label: 'Speaking',
      icon: '🎤',
      prompts: [
        {
          id: 'spk-1',
          title: 'Part 1 Question Generator',
          description: 'Get 5 examiner-style Part 1 questions on any topic to practise answering aloud.',
          text: {
            claude: `You are a strict IELTS Academic examiner. Generate exactly 5 Part 1 interview questions about [YOUR TOPIC, e.g. Technology / Work / Travel / Food].

Requirements:
- Each question must be short (one sentence), conversational, and open-ended
- Questions should progress from simple to slightly more complex
- Do not include sample answers or explanations
- Output a numbered list only

Target level: ${bandLabel}
${goalLine}`,

            chatgpt: `Act as an IELTS Academic examiner. Give me 5 Part 1 speaking questions about [YOUR TOPIC, e.g. Technology / Work / Travel].

Rules:
- Short, conversational questions only
- Numbered list, no extra text
- Progress from easy to slightly harder

Target level: ${bandLabel}`,

            gemini: `Generate 5 IELTS Academic Speaking Part 1 questions on [YOUR TOPIC].

- Numbered list only
- One sentence per question, conversational tone
- Easy → harder order
- No sample answers

Target level: ${bandLabel}`,
          },
        },

        {
          id: 'spk-2',
          title: 'Part 2 Cue Card',
          description: 'Generate a cue card topic with bullet points to prepare your 2-minute talk.',
          text: {
            claude: `You are an IELTS Academic examiner. Create one Part 2 cue card on the theme of [YOUR THEME, e.g. Technology / A Person You Admire / A Difficult Decision].

Format exactly like the real exam:
"Describe [topic].
You should say:
• [point 1]
• [point 2]
• [point 3]
And explain [final reflection point]."

After the card, add 2 Part 3 follow-up questions on the same theme.
Target level: ${bandLabel}`,

            chatgpt: `Create an IELTS Speaking Part 2 cue card on [YOUR THEME, e.g. Technology / A Memorable Experience].

Use this exact format:
"Describe [topic].
You should say:
• [point 1]
• [point 2]
• [point 3]
And explain [final point]."

Then give 2 Part 3 discussion questions on the same theme.
Target: ${bandLabel}`,

            gemini: `Create one IELTS Academic Part 2 cue card on [YOUR THEME].

Format:
"Describe [topic].
You should say:
• ...
• ...
• ...
And explain ..."

Add 2 Part 3 follow-up questions.
Target: ${bandLabel}`,
          },
        },

        {
          id: 'spk-3',
          title: 'Part 3 Discussion Questions',
          description: 'Get 4 abstract, opinion-based Part 3 questions to practise extended answers.',
          text: {
            claude: `You are an IELTS Academic examiner. Generate 4 Part 3 discussion questions on the topic of [YOUR TOPIC, e.g. Artificial Intelligence / Remote Work / Education Reform].

Requirements:
- Abstract, societal-level questions (not personal experience)
- Require the candidate to compare, evaluate, or speculate
- Numbered list, no sample answers
- Suitable for ${bandLabel} practice`,

            chatgpt: `Act as an IELTS examiner. Give me 4 Part 3 speaking questions about [YOUR TOPIC, e.g. AI / Climate Change / Education].

- Abstract, opinion-based questions only
- No personal experience questions
- Numbered list, no answers
- Level: ${bandLabel}`,

            gemini: `Generate 4 IELTS Academic Speaking Part 3 questions on [YOUR TOPIC].

- Abstract, societal perspective
- Opinion and evaluation focus
- Numbered list only
- Level: ${bandLabel}`,
          },
        },

        {
          id: 'spk-4',
          title: 'Vocabulary for a Topic',
          description: '10 Band-appropriate collocations and phrases for a speaking topic.',
          text: {
            claude: `You are an IELTS vocabulary coach. Give me 10 high-value collocations and phrases for discussing [YOUR TOPIC, e.g. Technology / Environment / Health] in IELTS Speaking.

For each phrase provide:
1. The phrase in bold
2. One example sentence using it in a speaking context
3. The collocation type (e.g. verb+noun, adjective+noun)

Target: ${bandLabel}. Focus on phrases that sound natural when spoken, not overly academic.`,

            chatgpt: `Give me 10 collocations and phrases for IELTS Speaking on [YOUR TOPIC].

For each:
- The phrase
- One spoken example sentence
- Collocation type

Target: ${bandLabel}. Natural spoken English, not written academic style.`,

            gemini: `List 10 collocations for IELTS Speaking on [YOUR TOPIC].

Format per item:
- **Phrase** (type): example sentence

Target: ${bandLabel}. Spoken register, not academic writing style.`,
          },
        },

        {
          id: 'spk-5',
          title: 'Full Speaking Mock (Parts 1 + 2 + 3)',
          description: 'A complete 11–14 minute mock session outline ready to run in one prompt.',
          text: {
            claude: `You are a strict IELTS Academic examiner running a full Speaking test. Follow this structure exactly:

PART 1 (4–5 minutes): Ask 4 questions on [TOPIC 1, e.g. Work] and 3 questions on [TOPIC 2, e.g. Technology]. Wait for my response after each. Do not give feedback yet.

PART 2 (3–4 minutes): Create a cue card on [THEME]. Say "You have 1 minute to prepare." Then say "Please begin." Wait for my 2-minute talk.

PART 3 (4–5 minutes): Ask 4 discussion questions related to the Part 2 theme.

After Part 3, give a brief band estimate per criterion: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.
Target: ${bandLabel}. ${goalLine}

Start with: "Good morning. My name is [Examiner]. Can you tell me your full name please?"`,

            chatgpt: `Run a full IELTS Speaking mock test. Follow this structure:

Part 1: Ask 4 questions on [TOPIC 1] then 3 on [TOPIC 2]. Wait for each answer.
Part 2: Give a cue card on [THEME]. Say "1 minute to prepare" then "Please begin."
Part 3: Ask 4 discussion questions on the Part 2 theme.
After: Brief feedback per criterion (FC / LR / GRA / Pronunciation).

Target: ${bandLabel}
Start: "Good morning. Can you tell me your full name?"`,

            gemini: `Act as IELTS examiner. Run a full Speaking test:

Part 1: 4 questions on [TOPIC 1], 3 on [TOPIC 2]. One at a time, wait for reply.
Part 2: Cue card on [THEME]. "1 minute prep → begin."
Part 3: 4 discussion questions on Part 2 theme.
End: Band estimate for FC / LR / GRA / Pronunciation.

Target: ${bandLabel}
Open with: "Good morning. What is your full name?"`,
          },
        },
      ],
    },

    // ─── WRITING ──────────────────────────────────────────────────────────────
    {
      skill: 'writing',
      label: 'Writing',
      icon: '✍️',
      prompts: [
        {
          id: 'wrt-1',
          title: 'Task 2 — Opinion Essay Prompt',
          description: 'Generate a To what extent do you agree? question on a tech or society topic.',
          text: {
            claude: `Generate one IELTS Academic Writing Task 2 opinion essay question on the topic of [YOUR DOMAIN, e.g. Artificial Intelligence / Remote Work / Digital Privacy].

Requirements:
- Essay type: "To what extent do you agree or disagree?"
- Question must present a clear, debatable statement
- 40–50 words in length
- Do not include a sample answer
- Add a word count reminder: "Write at least 250 words."

Target: ${bandLabel}`,

            chatgpt: `Give me one IELTS Academic Writing Task 2 opinion question on [YOUR DOMAIN, e.g. AI / Education / Technology].

- "To what extent do you agree or disagree?" format
- 40–50 words
- Debatable statement, no sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            gemini: `Create one IELTS Academic Task 2 opinion question on [YOUR DOMAIN].

Type: agree/disagree
Length: 40–50 words
No sample answer
Add: "Write at least 250 words."
Target: ${bandLabel}`,
          },
        },

        {
          id: 'wrt-2',
          title: 'Task 2 — Discussion Essay Prompt',
          description: 'Generate a Discuss both views question for a balanced-argument essay.',
          text: {
            claude: `Generate one IELTS Academic Writing Task 2 discussion essay question on [YOUR DOMAIN, e.g. Automation / Social Media / Urban Development].

Requirements:
- Essay type: "Discuss both views and give your own opinion."
- Present two clearly opposing perspectives in the question
- 40–50 words
- No sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            chatgpt: `One IELTS Academic Task 2 discussion question on [YOUR DOMAIN].

- Type: "Discuss both views and give your opinion."
- Two opposing perspectives in the question
- 40–50 words, no sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            gemini: `IELTS Academic Task 2 discussion question on [YOUR DOMAIN].

Type: both views + opinion
Two opposing views in the stem
40–50 words, no answer
Add: "Write at least 250 words."
Target: ${bandLabel}`,
          },
        },

        {
          id: 'wrt-3',
          title: 'Task 2 — Problem & Solution Prompt',
          description: 'Generate a problem/solution question — a common Task 2 variant.',
          text: {
            claude: `Generate one IELTS Academic Writing Task 2 problem and solution question on [YOUR DOMAIN, e.g. Cybersecurity / Climate Change / Remote Work].

Requirements:
- Essay type: "What are the main causes of this problem and what measures could be taken to address it?"
- Or: "What problems does this cause, and what solutions can you suggest?"
- 40–55 words
- No sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            chatgpt: `One IELTS Academic Task 2 problem/solution question on [YOUR DOMAIN].

- Problem + solution structure
- 40–55 words
- No sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            gemini: `IELTS Academic Task 2 problem/solution question on [YOUR DOMAIN].

Causes + solutions structure
40–55 words, no answer
Add: "Write at least 250 words."
Target: ${bandLabel}`,
          },
        },

        {
          id: 'wrt-4',
          title: 'Task 2 — Two-Part Question Prompt',
          description: 'Generate a two-part question requiring two distinct answers in one essay.',
          text: {
            claude: `Generate one IELTS Academic Writing Task 2 two-part question on [YOUR DOMAIN, e.g. Data Privacy / Online Education / Automation].

Requirements:
- Must contain exactly two questions the candidate must address
- e.g. "Why is this happening? What are the consequences?"
- 40–55 words
- No sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            chatgpt: `One IELTS Academic Task 2 two-part question on [YOUR DOMAIN].

- Exactly two distinct questions to address
- 40–55 words
- No sample answer
- End with: "Write at least 250 words."

Target: ${bandLabel}`,

            gemini: `IELTS Academic Task 2 two-part question on [YOUR DOMAIN].

Exactly 2 questions in the stem
40–55 words, no answer
Add: "Write at least 250 words."
Target: ${bandLabel}`,
          },
        },

        {
          id: 'wrt-5',
          title: 'Task 1 — Data Description Prompt',
          description: 'Generate a Task 1 graph or chart question with a described dataset to write about.',
          text: {
            claude: `Generate one IELTS Academic Writing Task 1 data description question. Choose one chart type: bar chart / line graph / pie chart / table.

The question should:
- Describe a dataset about [YOUR DOMAIN, e.g. internet usage / energy consumption / employment rates]
- Include specific data points (percentages, figures, years) in the description
- Ask the candidate to "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
- End with: "Write at least 150 words."

Target: ${bandLabel}`,

            chatgpt: `Create an IELTS Academic Task 1 question with a described dataset on [YOUR DOMAIN].

- Chart type: bar / line / pie / table (choose one)
- Include specific figures and a time period
- End with: "Summarise the main features and make comparisons. Write at least 150 words."

Target: ${bandLabel}`,

            gemini: `IELTS Academic Task 1 question on [YOUR DOMAIN].

Chart type: bar / line / pie / table
Include specific data points and years
End: "Summarise main features, make comparisons. Write at least 150 words."
Target: ${bandLabel}`,
          },
        },
      ],
    },

    // ─── READING ──────────────────────────────────────────────────────────────
    {
      skill: 'reading',
      label: 'Reading',
      icon: '📖',
      prompts: [
        {
          id: 'rdg-1',
          title: 'Passage with True / False / Not Given',
          description: 'Generate a ~700-word passage with 6 T/F/NG questions and an answer key.',
          text: {
            claude: `Generate an IELTS Academic Reading passage on [YOUR TOPIC, e.g. Machine Learning / Climate Science / Behavioural Economics].

Requirements:
- Length: 650–750 words, formal academic register
- 6 True / False / Not Given questions based strictly on the passage text
- Include the answer key at the end with a one-line justification per answer
- Do not use bullet points in the passage — continuous paragraphs only

Target: ${bandLabel}`,

            chatgpt: `Write an IELTS Academic reading passage on [YOUR TOPIC], 650–750 words, academic style.

Then write 6 True / False / Not Given questions.
End with an answer key (answer + one-line justification).

No bullet points in the passage.
Target: ${bandLabel}`,

            gemini: `IELTS Academic reading passage on [YOUR TOPIC].

- 650–750 words, academic register
- 6 T/F/NG questions
- Answer key with justification
- Continuous paragraphs only

Target: ${bandLabel}`,
          },
        },

        {
          id: 'rdg-2',
          title: 'Passage with Matching Headings',
          description: 'A 5-paragraph passage with 6 heading options — practise the hardest question type.',
          text: {
            claude: `Generate an IELTS Academic Reading passage on [YOUR TOPIC, e.g. Urban Planning / Renewable Energy / Cognitive Science].

Requirements:
- 5 clearly distinct paragraphs (label them A–E)
- Each paragraph has one clear main idea
- Provide 6 heading options (two are distractors)
- Answer key: correct heading per paragraph with a one-sentence explanation of why

Target: ${bandLabel}`,

            chatgpt: `IELTS Academic reading passage on [YOUR TOPIC].

- 5 paragraphs, labelled A–E, each with a clear main idea
- 6 heading options (2 distractors)
- Answer key with one-sentence explanations

Target: ${bandLabel}`,

            gemini: `IELTS Academic reading passage on [YOUR TOPIC].

5 paragraphs (A–E), distinct main idea per paragraph
6 heading options, 2 are distractors
Answer key + brief explanation per paragraph
Target: ${bandLabel}`,
          },
        },

        {
          id: 'rdg-3',
          title: 'Passage with Short-Answer Questions',
          description: 'A passage with 5 short-answer questions requiring 1–3 word answers from the text.',
          text: {
            claude: `Generate an IELTS Academic Reading passage on [YOUR TOPIC, e.g. Neuroscience / Digital Privacy / Supply Chains].

Requirements:
- 500–650 words, formal academic register
- 5 short-answer questions where answers must be taken verbatim from the passage
- Each answer is 1–3 words maximum
- Questions must follow the order of information in the passage
- Answer key at the end

Target: ${bandLabel}`,

            chatgpt: `IELTS Academic reading passage on [YOUR TOPIC], 500–650 words.

5 short-answer questions:
- Answers taken word-for-word from the passage
- Max 3 words per answer
- Questions in passage order

Include answer key.
Target: ${bandLabel}`,

            gemini: `IELTS Academic reading passage on [YOUR TOPIC], 500–650 words.

5 short-answer questions
- Verbatim answers from text, max 3 words
- In passage order
Answer key at end
Target: ${bandLabel}`,
          },
        },

        {
          id: 'rdg-4',
          title: 'Mixed Question Types Passage',
          description: 'A full-length passage combining T/F/NG, matching, and short answer — closest to the real exam.',
          text: {
            claude: `Generate an IELTS Academic Reading passage on [YOUR TOPIC] with three question sets:

Section 1 — 4 True / False / Not Given questions
Section 2 — Match each paragraph (A–D) to its correct summary (provide 5 summaries, one distractor)
Section 3 — 3 short-answer questions (max 3 words from the text)

Requirements:
- Passage: 700–800 words, academic register
- Maintain question order relative to the passage
- Full answer key at the end

Target: ${bandLabel}`,

            chatgpt: `IELTS Academic reading passage on [YOUR TOPIC], 700–800 words.

Question set 1: 4 T/F/NG questions
Question set 2: Match 4 paragraphs to summaries (5 options, 1 distractor)
Question set 3: 3 short-answer questions (max 3 words)

Answer key at the end.
Target: ${bandLabel}`,

            gemini: `IELTS Academic reading passage on [YOUR TOPIC], 700–800 words.

Q1: 4 T/F/NG
Q2: 4 paragraphs → summaries (5 options, 1 distractor)
Q3: 3 short answers (max 3 words)
Answer key at end
Target: ${bandLabel}`,
          },
        },

        {
          id: 'rdg-5',
          title: 'Timed Reading Challenge',
          description: 'A passage + question set designed to be completed in 20 minutes with self-scoring.',
          text: {
            claude: `Set up a 20-minute IELTS Academic Reading timed challenge on [YOUR TOPIC].

Step 1 — Show the passage only (700 words, academic register). Tell me to read it, then tell you when ready.
Step 2 — After I say ready, show all questions at once: 4 T/F/NG + 4 short-answer (max 3 words). Tell me I have 20 minutes.
Step 3 — When I submit answers, score each one and give: score (X/8), estimated band, and the correct answers for any I missed.

Target: ${bandLabel}`,

            chatgpt: `Run a 20-minute IELTS reading practice on [YOUR TOPIC]:

1. Show a 700-word academic passage. Wait for me to say "ready".
2. Show 4 T/F/NG + 4 short-answer questions. Say "You have 20 minutes."
3. When I submit, score and show correct answers for misses. Estimate band.

Target: ${bandLabel}`,

            gemini: `20-minute IELTS reading challenge on [YOUR TOPIC]:

Step 1: Show 700-word academic passage, wait for "ready"
Step 2: Show 4 T/F/NG + 4 short-answer questions, "20 minutes starts now"
Step 3: On submission — score, band estimate, correct answers

Target: ${bandLabel}`,
          },
        },
      ],
    },

    // ─── LISTENING ────────────────────────────────────────────────────────────
    {
      skill: 'listening',
      label: 'Listening',
      icon: '🎧',
      prompts: [
        {
          id: 'lst-1',
          title: 'Note Completion Exercise',
          description: 'A transcript + 8 fill-in-the-blank questions you can read aloud to yourself.',
          text: {
            claude: `Generate an IELTS Listening note-completion exercise on [YOUR TOPIC, e.g. a university orientation / a job interview / a product demonstration].

Requirements:
- A two-person dialogue of 250–300 words (Speaker A and Speaker B)
- 8 note-completion questions with a blank (___) for a 1–3 word answer taken verbatim from the transcript
- Present the questions first, then the full transcript below
- Answer key at the end

Target: ${bandLabel}. Note: Read the transcript aloud to simulate listening.`,

            chatgpt: `Create an IELTS Listening note-completion exercise on [YOUR TOPIC].

- Two-person dialogue, 250–300 words
- 8 fill-in-the-blank questions (1–3 word answers from the transcript)
- Show questions first, transcript second, answer key at the end

Target: ${bandLabel}. Tip: read the transcript aloud to yourself.`,

            gemini: `IELTS Listening note completion on [YOUR TOPIC].

- 2-person dialogue, 250–300 words
- 8 blanks, 1–3 word answers from transcript
- Order: questions → transcript → answer key

Target: ${bandLabel}`,
          },
        },

        {
          id: 'lst-2',
          title: 'Form Completion Exercise',
          description: 'A phone/reception dialogue with a form to complete — Section 1 style.',
          text: {
            claude: `Generate an IELTS Listening Section 1 form-completion exercise on [YOUR SCENARIO, e.g. booking an appointment / registering for a course / a customer enquiry].

Requirements:
- Two speakers: a customer and a receptionist/adviser
- 200–250 words of dialogue
- A partially completed form with 6 blanks to fill in (name, date, number, address-style details)
- Show the blank form first, transcript second, completed form at the end

Target: ${bandLabel}`,

            chatgpt: `IELTS Listening Section 1 form-completion on [YOUR SCENARIO, e.g. booking / registration / enquiry].

- Customer + receptionist dialogue, 200–250 words
- Partially filled form with 6 blanks
- Order: blank form → dialogue → completed form

Target: ${bandLabel}`,

            gemini: `IELTS Listening Section 1 form completion on [YOUR SCENARIO].

- 2 speakers, 200–250 words
- Form with 6 blanks
- Order: blank form → transcript → answers

Target: ${bandLabel}`,
          },
        },

        {
          id: 'lst-3',
          title: 'Multiple Choice Questions',
          description: 'A monologue with 5 multiple choice questions — Section 2 or 4 style.',
          text: {
            claude: `Generate an IELTS Listening Section 4 academic monologue on [YOUR TOPIC, e.g. a lecture on renewable energy / a talk on urban design].

Requirements:
- 250–300 word monologue (single speaker, formal register)
- 5 multiple choice questions (A, B, C options) based on the monologue
- Distractors should be plausible but clearly wrong based on the text
- Show questions first, monologue second, answer key at the end

Target: ${bandLabel}`,

            chatgpt: `IELTS Listening Section 4 monologue on [YOUR TOPIC], 250–300 words.

- 5 multiple choice questions (A/B/C), plausible distractors
- Order: questions → monologue → answer key

Target: ${bandLabel}`,

            gemini: `IELTS Listening Section 4 monologue on [YOUR TOPIC], 250–300 words.

5 MCQ (A/B/C), plausible distractors
Order: questions → monologue → answers
Target: ${bandLabel}`,
          },
        },

        {
          id: 'lst-4',
          title: 'Section 3 Discussion (Two Speakers)',
          description: 'A student-tutor or group discussion transcript with matching or MCQ questions.',
          text: {
            claude: `Generate an IELTS Listening Section 3 discussion on [YOUR ACADEMIC CONTEXT, e.g. two students discussing a research project / a student and tutor reviewing an assignment].

Requirements:
- 10–12 dialogue turns, 280–320 words
- 5 questions: mix of matching (match speaker to opinion) and multiple choice
- Show questions first, transcript second, answer key at the end

Target: ${bandLabel}`,

            chatgpt: `IELTS Listening Section 3: student/academic discussion on [YOUR CONTEXT], 280–320 words, 10–12 turns.

- 5 questions: matching (speaker → opinion) + MCQ mix
- Order: questions → transcript → answer key

Target: ${bandLabel}`,

            gemini: `IELTS Listening Section 3 discussion on [YOUR CONTEXT], 280–320 words.

5 questions: matching + MCQ
Order: questions → transcript → answers
Target: ${bandLabel}`,
          },
        },

        {
          id: 'lst-5',
          title: 'Full Section Practice (Sections 1–4)',
          description: 'A complete 4-section listening practice in one prompt — closest to the real exam.',
          text: {
            claude: `Generate a condensed IELTS Listening full practice covering all 4 sections on the theme of [YOUR THEME, e.g. Technology in Education / Workplace Communication].

Section 1: Form completion — 2 speakers, 5 blanks
Section 2: Note completion — monologue, 5 blanks
Section 3: Multiple choice — academic discussion, 5 questions (A/B/C)
Section 4: Short answer — lecture, 5 questions (max 3 words)

For each section: show questions first, then transcript, then answers.
Total: 20 questions. Score out of 20. Estimate band at end.

Target: ${bandLabel}`,

            chatgpt: `Full IELTS Listening practice on [YOUR THEME], all 4 sections:

S1: Form completion, 2 speakers, 5 blanks
S2: Note completion, monologue, 5 blanks
S3: MCQ, academic discussion, 5 questions
S4: Short answer, lecture, 5 questions (max 3 words)

Each: questions → transcript → answers.
Final: score /20 + band estimate.
Target: ${bandLabel}`,

            gemini: `IELTS Listening full practice on [YOUR THEME]:

S1: form completion (5 blanks)
S2: note completion (5 blanks)
S3: MCQ discussion (5 Qs)
S4: short answer lecture (5 Qs)

Each: questions → transcript → answers
End: score /20 + band
Target: ${bandLabel}`,
          },
        },
      ],
    },
  ]
}
