import Link from 'next/link'

type Task = {
  href: string
  icon: string
  label: string
  description: string
}

type Week = {
  number: number
  theme: string
  goal: string
  color: string
  borderColor: string
  bgColor: string
  labelColor: string
  tasks: Task[]
  habit: string
  target: string
}

const WEEKS: Week[] = [
  {
    number: 1,
    theme: 'Diagnose',
    goal: 'Find your baseline — understand where you are before trying to improve.',
    color: 'blue',
    borderColor: 'border-blue-200 dark:border-blue-800',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    labelColor: 'text-blue-700 dark:text-blue-400',
    tasks: [
      { href: '/writing', icon: '✍', label: 'Score your first Writing Task 2', description: 'Submit any essay — get a band score across all 4 IELTS criteria immediately.' },
      { href: '/speaking', icon: '🎤', label: 'Try a Speaking Part 1 session', description: 'Have a 5-minute conversation with the AI examiner. No preparation needed.' },
      { href: '/reading', icon: '📖', label: 'Do one Reading practice', description: 'Generate a tech-topic passage with T/F/NG and short-answer questions.' },
      { href: '/listening', icon: '🎧', label: 'Try one Listening script', description: 'Listen to a tech dialogue and fill in the note-completion form.' },
      { href: '/vocabulary', icon: '📚', label: 'Browse the Vocabulary list and save 5 words', description: 'Pick 5 Academic Word List entries relevant to your domain. Save them to your library.' },
    ],
    habit: '20–25 min/day. Do not try to be perfect — just complete each activity once.',
    target: '1 scored Writing essay · 1 Speaking session · baseline band recorded in Analytics',
  },
  {
    number: 2,
    theme: 'Build',
    goal: 'Repeat core practice and start using the vocabulary tools.',
    color: 'emerald',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    labelColor: 'text-emerald-700 dark:text-emerald-400',
    tasks: [
      { href: '/writing', icon: '✍', label: 'Write 2 more Task 2 essays', description: 'Read the examiner feedback carefully — focus on whichever criterion scored lowest.' },
      { href: '/speaking/part2', icon: '🎤', label: 'Practice Speaking Part 2', description: 'Respond to a 1-minute cue card. Aim for 1–2 minutes of fluent speech.' },
      { href: '/collocations', icon: '🧩', label: 'Search and save 10 collocations', description: 'Search for phrases related to your essay topics. Save the ones you want to use.' },
      { href: '/essay-builder', icon: '✍️', label: 'Generate an Essay Builder sample', description: 'Select your saved vocabulary and collocations — see them used naturally in a model essay.' },
      { href: '/vocabulary/review', icon: '🔁', label: 'Review your saved words (SRS)', description: 'Spaced repetition: the app schedules which words are due today. Takes 5 minutes.' },
    ],
    habit: '25–30 min/day. Split between practice (Writing/Speaking) and tools (Vocabulary/Collocations).',
    target: '3 scored essays total · 3 Speaking sessions · 10 collocations saved · first SRS review done',
  },
  {
    number: 3,
    theme: 'Deepen',
    goal: 'Learn from your mistakes and expand your toolkit.',
    color: 'violet',
    borderColor: 'border-violet-200 dark:border-violet-800',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    labelColor: 'text-violet-700 dark:text-violet-400',
    tasks: [
      { href: '/wrong-decisions', icon: '❌', label: 'Log your first wrong decision', description: 'Record any mistake from Reading or Listening — let the AI explain why you got it wrong.' },
      { href: '/how-to-answer', icon: '💡', label: 'Read the strategy guide for your weakest skill', description: 'Each skill has a step-by-step guide for every question type. Read the one you struggle most with.' },
      { href: '/paraphrase', icon: '🔄', label: 'Study the Paraphrase guide', description: 'Paraphrasing questions is the #1 skill for Reading and Listening. Practice all 4 skill levels.' },
      { href: '/speaking/session', icon: '🎙', label: 'Do a full Speaking mock (Part 1+2+3)', description: 'Simulate the full 14-minute exam. Review your filler word count afterwards.' },
      { href: '/grammar-traps', icon: '⚠️', label: 'Skim the Grammar Traps list', description: 'Uncountable nouns, false singulars, and number agreement errors cost band marks. Learn the patterns.' },
    ],
    habit: '30 min/day. Alternate between practice sessions and reviewing mistakes in the Wrong Decisions log.',
    target: '5 scored essays total · 1 full Speaking mock · first wrong decision analysed',
  },
  {
    number: 4,
    theme: 'Consolidate',
    goal: 'Measure your progress, fix remaining gaps, and plan the next month.',
    color: 'amber',
    borderColor: 'border-amber-200 dark:border-amber-800',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    labelColor: 'text-amber-700 dark:text-amber-400',
    tasks: [
      { href: '/analytics', icon: '📊', label: 'Check your Analytics', description: 'See your band score trend across all sessions. Identify which criterion improved most and which is still lagging.' },
      { href: '/vocabulary/review', icon: '🔁', label: 'Complete all overdue SRS reviews', description: 'Any words you saved in Week 1–3 that are due today. Clear the queue before moving on.' },
      { href: '/cheat-sheet', icon: '🗺️', label: 'Review the Cheat Sheet', description: 'A condensed one-page reference covering the most common errors across all 4 skills.' },
      { href: '/wrong-decisions', icon: '❌', label: 'Re-read all your wrong decision logs', description: 'Read every entry you logged. Look for a pattern — is there one question type you always miss?' },
      { href: '/projects', icon: '📋', label: 'Plan your sprint for Month 2', description: 'Create a new sprint in Projects. Set a clear goal: which band score you want to hit and when.' },
    ],
    habit: '30–40 min/day. Simulate exam conditions: write essays without stopping to look things up.',
    target: 'Clear Analytics picture of your Band trend · Month 2 sprint created with a specific goal',
  },
]

const FEATURE_MAP: { group: string; items: { href: string; icon: string; label: string; description: string }[] }[] = [
  {
    group: 'Practice',
    items: [
      { href: '/writing', icon: '✍', label: 'Writing Task 2', description: 'Submit an essay → get a band score with examiner feedback across 4 criteria.' },
      { href: '/writing/task1', icon: '📊', label: 'Writing Task 1', description: 'Describe a chart, graph, or process in 150 words — scored the same way.' },
      { href: '/speaking', icon: '🎤', label: 'Speaking Part 1', description: 'Short-answer questions on everyday topics. 5-minute session.' },
      { href: '/speaking/part2', icon: '🎤', label: 'Speaking Part 2', description: 'Long turn: 1-minute prep, 2-minute response to a cue card prompt.' },
      { href: '/speaking/session', icon: '🎙', label: 'Speaking (Full Mock)', description: 'Full Part 1 + Part 2 + Part 3 in one session. Includes filler word detection.' },
      { href: '/reading', icon: '📖', label: 'Reading', description: 'AI-generated tech passages with T/F/NG and short-answer questions.' },
      { href: '/listening', icon: '🎧', label: 'Listening', description: 'Tech dialogue scripts with note-completion questions. Browser TTS playback.' },
    ],
  },
  {
    group: 'Tools',
    items: [
      { href: '/vocabulary', icon: '📚', label: 'Vocabulary (AWL)', description: 'Academic Word List browser. Save words to your personal library.' },
      { href: '/vocabulary/review', icon: '🔁', label: 'Vocab Review (SRS)', description: 'Spaced repetition system — shows you words due for review today.' },
      { href: '/collocations', icon: '🧩', label: 'Collocations', description: 'Search and save word combinations that score highly in IELTS.' },
      { href: '/idioms', icon: '💬', label: 'Idioms', description: 'IELTS-appropriate idiom library with usage context per skill.' },
      { href: '/essay-builder', icon: '✍️', label: 'Essay Builder', description: 'Select saved vocab + collocations → AI generates a model essay using all of them.' },
      { href: '/vocab-banks', icon: '🏦', label: 'Vocab Banks', description: 'Topic-focused word sets (travel, health, environment, etc.).' },
      { href: '/compare', icon: '⚖️', label: 'Word Compare', description: 'Side-by-side comparison of similar words: register, IELTS suitability, examples.' },
      { href: '/word-pairs', icon: '⇄', label: 'Word Pairs', description: 'Interchangeable pairs explained: regional, register, formality differences.' },
      { href: '/connected-speech', icon: '🔗', label: 'Connected Speech', description: 'Analyse spoken text for linking, elision, assimilation and other phenomena.' },
      { href: '/grammar-traps', icon: '⚠️', label: 'Grammar Traps', description: 'Common noun-form errors: uncountable nouns, false singulars, number agreement.' },
    ],
  },
  {
    group: 'Guides',
    items: [
      { href: '/how-to-answer', icon: '💡', label: 'How to Answer', description: 'Step-by-step strategies for every question type across all 4 skills.' },
      { href: '/how-to-answer/question-anatomy', icon: '🔍', label: 'Question Anatomy', description: 'Dissect any question into 7 roles before you read the passage or listen.' },
      { href: '/paraphrase', icon: '🔄', label: 'Paraphrase', description: '4 skills × 3 levels of paraphrase techniques with worked examples.' },
      { href: '/cheat-sheet', icon: '🗺️', label: 'Cheat Sheet', description: 'One-page condensed reference for the most common IELTS pitfalls.' },
      { href: '/topic-ideas', icon: '🗂️', label: 'Topic Ideas', description: '10 common IELTS topics with arguments and vocabulary for each side.' },
      { href: '/language-comparison', icon: '🧬', label: 'Language DNA', description: 'Structural differences between Vietnamese and English — why certain errors happen.' },
      { href: '/exam-countdown', icon: '⏱️', label: 'Exam Sprint', description: 'Set your exam date and get a day-by-day countdown plan.' },
    ],
  },
  {
    group: 'Progress',
    items: [
      { href: '/analytics', icon: '📊', label: 'Analytics', description: 'Band score trend across all sessions. Criteria breakdown and gap analysis.' },
      { href: '/wrong-decisions', icon: '❌', label: 'Wrong Decisions', description: 'Journal of mistakes with AI-generated root cause analysis and prevention tips.' },
      { href: '/projects', icon: '📋', label: 'Projects', description: 'Personal kanban board. Plan your study sprints with IELTS task templates.' },
      { href: '/history', icon: '🕐', label: 'History', description: 'Full archive of all practice sessions and scored essays.' },
    ],
  },
]

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground">Your First 30 Days</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A week-by-week plan to go from zero to a consistent Band 6.5 practice routine.
        Each week builds on the last — complete the tasks in order.
      </p>

      {/* Daily habit callout */}
      <div className="mt-6 rounded-xl border border-border bg-card px-5 py-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Before you start</p>
        <p className="text-sm text-foreground">
          You do not need to use every feature. This app has a lot — start with{' '}
          <Link href="/writing" className="text-blue-600 dark:text-blue-400 underline underline-offset-2">Writing</Link>{' '}
          and{' '}
          <Link href="/speaking" className="text-blue-600 dark:text-blue-400 underline underline-offset-2">Speaking</Link>.
          Everything else exists to support those two core skills.
          20–30 minutes a day is enough to improve — consistency matters more than session length.
        </p>
      </div>

      {/* Weekly plan */}
      <div className="mt-8 flex flex-col gap-6">
        {WEEKS.map((week) => (
          <div key={week.number} className={`rounded-xl border ${week.borderColor} ${week.bgColor} p-5`}>
            {/* Header */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className={`text-xs font-bold uppercase tracking-widest ${week.labelColor}`}>
                Week {week.number}
              </span>
              <span className="text-base font-semibold text-foreground">{week.theme}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{week.goal}</p>

            {/* Tasks */}
            <div className="flex flex-col gap-2">
              {week.tasks.map((task) => (
                <Link
                  key={task.href}
                  href={task.href}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted transition-colors"
                >
                  <span className="mt-0.5 text-base shrink-0">{task.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  </div>
                  <span className="ml-auto shrink-0 self-center text-xs text-muted-foreground">→</span>
                </Link>
              ))}
            </div>

            {/* Habit + target */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 rounded-lg bg-card border border-border px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Daily habit</p>
                <p className="text-xs text-foreground">{week.habit}</p>
              </div>
              <div className="flex-1 rounded-lg bg-card border border-border px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Week target</p>
                <p className="text-xs text-foreground">{week.target}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature map */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">What every feature does</h2>
        <p className="mt-1 text-sm text-muted-foreground mb-6">Quick reference — click any feature to open it.</p>

        <div className="flex flex-col gap-8">
          {FEATURE_MAP.map((group) => (
            <div key={group.group}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{group.group}</p>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <span className="mt-0.5 text-base shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <span className="ml-auto shrink-0 self-center text-xs text-muted-foreground">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card px-5 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          After 30 days, check your{' '}
          <Link href="/analytics" className="text-blue-600 dark:text-blue-400 underline underline-offset-2">Analytics</Link>{' '}
          — you should see a clear band score trend.
          Then plan Month 2 using{' '}
          <Link href="/projects" className="text-blue-600 dark:text-blue-400 underline underline-offset-2">Projects</Link>.
        </p>
      </div>
    </div>
  )
}
