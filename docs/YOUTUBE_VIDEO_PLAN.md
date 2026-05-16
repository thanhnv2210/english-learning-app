# YouTube Video Plan — IELTS Accelerator (Primary audience: software engineers)

---

## Format: No Camera Required

You do not need to appear on screen. The entire series can be done with:

- **Screen recording** — your browser, terminal, or a slides deck
- **Voiceover** — just speak naturally while the screen plays
- **No face, no webcam, no studio setup**

This format is actually more credible for a developer audience. Engineers trust people
who show their work, not people who perform for a camera.

### Tools
- **Screen recorder:** macOS built-in — press `Cmd+Shift+5`, choose "Record Selected Portion"
- **Microphone:** Use your phone as a mic (plug in with headphone jack) or buy a $30 USB mic.
  The built-in laptop mic is the only thing to avoid.
- **Editing:** iMovie (free on Mac) is enough. Cut silences, that is all you need to do.
- **Slides (optional):** Use a plain dark-background Google Slides or Notion page when you
  want to show text or diagrams without the app.

### How to record naturally without a script
1. Write 3–5 bullet points of what you want to say — not full sentences, just ideas
2. Start the screen recording
3. Talk to the screen as if explaining to a teammate over Zoom
4. Record in short segments (30–60 sec each) — easier to re-do one segment than a whole video
5. Paste segments together in iMovie

---

## Series Goal

Two goals running in parallel:

**Goal 1 — Practical:** Show professionals (engineers first, others to follow) that IELTS prep can be done using the domain they already know — with real AI feedback, not generic drills. The hook is engineers; the message scales to anyone with deep expertise and an IELTS deadline.

**Goal 2 — Long-term mindset:** Inspire viewers to build their own version — or at least take ownership of their learning process. Not clone-and-use — clone-and-modify. The long-term idea is that building a personal learning tool compounds in a way that using someone else's tool never does.

---

## Posting Order

Clip 1 → Clip 4 → Clip 2 → Clip 3 → Clip 5 → Clip 6

---

## Clip 1 — "Who Is This For?"

**Length:** 60–90 seconds
**Format:** Screen recording of app homepage + voiceover (no face needed)

### What to show on screen
Slowly scroll through the app — speaking page, writing page, vocabulary, kanban board.
Let the UI speak. You just narrate over it.

### What to say
> "You've built production systems. Why are you still studying English like a student?"

Then:
- "Generic IELTS apps are built for 18-year-olds. The topics are travel, food, family.
  The feedback is vague. The vocabulary is not yours."
- "This app is for senior software engineers who have a deadline — visa, job, university —
  and want to study the way they already work: with real feedback, technical topics,
  and a system they can control."
- "In the next clips I'll show you what it does, how to run it, and most importantly
  why you should think about building your own version."

---

## Clip 2 — "The 5-Minute Feature Tour"

**Length:** 3–4 minutes
**Format:** Screen recording — just click through the app and talk

### What to show and say (spend 20–30 seconds per section)

**Speaking**
- Open speaking page, pick "System Design" topic, show Part 1
- Say: "It acts as a strict IELTS examiner. No encouragement, no hints. Just the next question."

**Writing**
- Paste a prepared 150-word essay, run audit, run score
- Say: "Three passes — grammar audit, vocabulary upgrade suggestions, then a band score
  broken down by the four IELTS criteria."

**Vocabulary**
- Search "infrastructure", show the word detail, show the sentence library
- Say: "Every word has example sentences you can save and practice. You build your own
  sentence bank from things you actually read and hear."

**Essay Builder**
- Generate a sample essay, show the colour highlights
- Say: "It generates model essays and highlights academic vocabulary and collocations
  so you can see how good writing is structured — not just read it passively."

**Wrong Decisions**
- Show one log entry with AI analysis
- Say: "When you get something wrong, you log it here. The AI explains the mistake pattern
  and gives you the corrected version. Over time this becomes your personal error dictionary."

**Projects / Kanban**
- Show the sprint board
- Say: "There is a kanban board pre-loaded with IELTS practice tasks. You run your
  English prep like a sprint. That is not a metaphor — it is literally a sprint board."

### Closing line
> "All of this uses technical topics — system design, databases, DevOps, product management.
> Nothing about holidays or describing a photograph."

---

## Clip 3 — "Why I Built This Myself"

**Length:** 2–3 minutes
**Format:** Screen recording of the codebase or a simple dark slide deck + voiceover

### What to show on screen
Option A: Slowly scroll through the GitHub repo while you talk.
Option B: A dark slide with 3–4 bullet points per section, auto-advance as you speak.

### What to say

**The trigger**
> "I had an IELTS deadline. I tried three popular apps. They all felt wrong —
> generic topics, vague scoring, no feedback I could act on."

**The experiment**
> "I had a Claude API key and I knew Next.js. I spent a Saturday building a writing scorer.
> Just a text box, a prompt, and a band score. That one afternoon was more useful
> than three weeks on any other platform."

**The compounding**
> "Once I had a scorer I wanted speaking. Then vocabulary lookup. Then a sentence library.
> Each feature I built forced me to understand IELTS more deeply — because I had to
> write the prompts that teach the AI how to grade."

**The insight**
> "The act of building your own prep tool is itself a form of deep study.
> You can't write a good scoring prompt without understanding what IELTS actually tests.
> You can't outsource that thinking — and you wouldn't want to."

**Closing**
> "You don't need a $200 IELTS course. You need a weekend, a Claude API key,
> and a problem you actually care about solving."

---

## Clip 4 — "Clone and Run in 10 Minutes"

**Length:** 5–7 minutes
**Format:** Screen recording — terminal + browser only

### Steps to record (do a dry run first)

Open a clean terminal. Make the font large (Cmd+= several times).

```bash
# Step 1 — clone
git clone <your repo URL>
cd english-learning-app
pnpm install
```
Say: "Standard pnpm monorepo. Install takes about a minute."

```
# Step 2 — env file
cp apps/web/.env.example apps/web/.env.local
```
Open `.env.local` in your editor, fill in three values:
```
ANTHROPIC_API_KEY=...
DATABASE_URL=...
NEXT_PUBLIC_OLLAMA_ENABLED=false
```
Say: "Anthropic API key from console.anthropic.com. Haiku model is cheap —
a full day of practice costs less than a coffee. You need a Postgres database;
I use a free Neon.tech instance for local dev."

```bash
# Step 3 — database
cd apps/web
pnpm db:push
pnpm db:seed:vocabulary
pnpm db:seed:speaking-topics
pnpm db:seed:projects
```
Say: "Push the schema, then seed the starter data. Takes 30 seconds."

```bash
# Step 4 — start
PORT=3000 pnpm dev:clean
```
Open browser at `http://localhost:3000`.

Run one writing score and one speaking round to show it working.

**Closing**
> "That is it. You have your own IELTS prep tool running locally.
> Now fork it and change something — that is where it gets interesting."

---

## Clip 5 — "The Real Reason This Works"

**Length:** 60–90 seconds
**Format:** Dark slides or just the app on screen + voiceover

### What to say (slow and clear)

> "Passive tools create passive learners. You click through flashcards,
> you feel like you're studying, you don't improve much."

> "When you run your own tool you own the feedback loop.
> When you disagree with a score, you can read the prompt and understand why.
> When the vocabulary suggestions feel wrong, you can change them."

> "IELTS 6.5 is not a high bar for engineers who already think clearly.
> The gap is almost always vocabulary range and speaking under pressure.
> Both improve faster when you practice on topics you actually care about."

> "Build something small. Use it every day. The score follows."

**Call to action**
> "Repo link is in the description. If you fork it and change something,
> I'd like to see what you built."

---

## Clip 6 — "The Long Game: Build Your Own" (NEW)

**Length:** 4–5 minutes
**Format:** Screen recording — switch between app, code editor, and a simple diagram

This is the most important clip for the long-term message.
It is aimed at students, not just engineers with an IELTS deadline.

### Core idea
Most people treat learning tools as something to consume.
The better approach is to treat them as something to build — incrementally, over months.
A personal learning tool built over 6 months is worth more than any commercial product
because it encodes your specific weaknesses, your vocabulary gaps, your mistake patterns.

### What to say

**Section 1 — The consumption trap (60 sec)**
> "Most learning tools are designed for you to consume them. Open the app, do the exercise,
> close the app. The company improves their product. You do not improve yours."

> "This is a subtle problem. The feedback loop is optimised for engagement,
> not for your specific gaps. A product built for a million people cannot be
> optimised for you."

**Section 2 — The building alternative (60 sec)**
> "What if instead of consuming a tool, you built one?
> Not a finished product — just a small tool for your specific problem."

> "Start with one feature. A writing scorer. A vocabulary flashcard set.
> A sentence library for words you keep forgetting. Something you use every day."

Show the app code briefly — just the folder structure, not deep code.

> "This entire app started as one text box and one API call.
> Every other feature was added because I needed it."

**Section 3 — Why building compounds (90 sec)**
> "When you build a learning tool you are forced to think about the subject deeply.
> To write a scoring prompt you have to understand what IELTS actually tests.
> To build a vocabulary feature you have to think about how vocabulary is learned —
> not just what words to study."

> "You are learning the subject in order to build the tool.
> Then you are using the tool to practice the subject.
> These two loops reinforce each other."

> "Six months of this produces something no commercial app can replicate:
> a tool that knows exactly which mistakes you make, which vocabulary you avoid,
> which sentence patterns you overuse. Because you built it to track those things."

**Section 4 — The concrete path (60 sec)**
> "Here is a concrete starting point. Fork this repo.
> Pick one feature and make it yours. Change the topics to match your job.
> Change the scoring criteria to focus on your weakest area.
> Add a feature you wish existed."

> "You do not need to finish it. You need to start it and use it.
> The building is the studying."

**Closing**
> "The engineers I know who improved fastest did not find the best app.
> They built a small tool, used it obsessively, and improved it as they improved.
> That is the long game."

---

## How to Record Without Feeling Awkward

The biggest reason people avoid voiceover is that hearing your own voice feels strange.
Here is how to get past it:

1. **Talk to one person, not an audience.** Imagine a junior colleague asked you to
   explain this. Talk to them, not to "viewers."

2. **Record in short segments.** Do 30–60 seconds, stop, re-do if needed.
   You do not have to record a whole video in one take.

3. **Use bullet points, not a script.** Reading a script sounds like reading a script.
   Bullet points force you to form sentences naturally — which sounds more human.

4. **Do not edit your accent or hesitation out.** Small pauses and natural speech patterns
   build trust. Over-edited voiceover sounds like a corporate tutorial.

5. **Your first recording will feel bad. Record it anyway.** The second one will be better.
   Publish the third one.

---

## Production Checklist

### Equipment (no camera needed)
- [ ] Screen recorder: macOS `Cmd+Shift+5` → Record Selected Portion
- [ ] Microphone: phone headphones plugged in, mic near your mouth; avoid laptop built-in mic
- [ ] Quiet room: early morning or late at night
- [ ] Large terminal font: press `Cmd+=` several times before recording

### Before each session
- [ ] App running locally and tested end to end
- [ ] Terminal history cleared (no API keys visible)
- [ ] Browser: only the app open, no personal tabs
- [ ] Bullet points written and visible on a second screen or phone

### Editing (iMovie is enough)
- [ ] Cut silences longer than 1.5 seconds
- [ ] No intro animation, no countdown
- [ ] Add subtitles: upload to YouTube, use auto-captions, fix errors manually
- [ ] End with one slide: repo URL only

### Thumbnails (no face required)
Use a terminal screenshot or app screenshot as background. Add bold text.

- Clip 1: "IELTS prep for engineers who hate IELTS prep"
- Clip 2: "Every feature in 5 minutes"
- Clip 3: "I built my own IELTS app — here's why"
- Clip 4: "Clone and run in 10 minutes"
- Clip 5: "Why building beats drilling"
- Clip 6: "Build your own learning tool — the long game"

---

## YouTube Descriptions (paste and edit)

**Clip 1**
```
Senior software engineer preparing for IELTS? Generic prep apps are designed for a different kind of learner.
This app is built for engineers — technical topics, AI-powered feedback, a workflow that mirrors how you already work.

Repo: <link>
```

**Clip 4**
```
Full walkthrough: clone the IELTS 6.5 Accelerator, configure your environment, and run your first session in under 10 minutes.
Prerequisites: Node.js, pnpm, PostgreSQL (free Neon.tech works), Anthropic API key.

Repo: <link>
```

**Clip 6**
```
Most learning tools are built for you to consume. This video is about building your own — incrementally, over months — and why that compounds in a way no commercial product can match.
A concrete starting point using this open-source IELTS app as a base.

Repo: <link>
```

---

## Timeline

| Week | Action |
|------|--------|
| Week 1 | Record Clip 1 (90 sec, easy). Publish it. |
| Week 2 | Record Clip 4 (setup walkthrough). Publish it. |
| Week 3 | Record Clip 2 (feature tour). Publish it. |
| Week 4 | Record Clip 3 (why I built it). Publish it. |
| Week 5 | Record Clip 5 (90 sec, easy). Publish it. |
| Week 6 | Record Clip 6 (the long game — most important). Publish it. |

Start with Clip 1 because it is short, requires no preparation, and you can re-record it
in 10 minutes if the first take is bad. Build confidence before tackling the longer ones.
