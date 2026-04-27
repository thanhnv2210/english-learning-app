import Link from 'next/link'

const SKILLS = [
  {
    href: '/topic-ideas/listening',
    label: 'Listening',
    icon: '🎧',
    description:
      'Follow the framework as you listen — recognise structure in real-time audio.',
  },
  {
    href: '/topic-ideas/reading',
    label: 'Reading',
    icon: '📖',
    description:
      'Use frameworks to navigate passages and predict what comes next.',
  },
  {
    href: '/topic-ideas/writing',
    label: 'Writing',
    icon: '✍️',
    description:
      'Apply frameworks to plan and structure Task 2 essays and Task 1 reports.',
  },
  {
    href: '/topic-ideas/speaking',
    label: 'Speaking',
    icon: '🎤',
    description:
      'Use frameworks to generate ideas instantly in Parts 1, 2, and 3.',
  },
]

export default function TopicIdeasPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground">Topic Ideas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Structured frameworks for IELTS topics — with vocabulary, steps, and skill-specific examples.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {SKILLS.map(({ href, label, icon, description }) => (
          <Link
            key={label}
            href={href}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
            <span className="ml-auto self-center text-xs text-blue-500 dark:text-blue-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
