import Link from 'next/link'

const SKILLS = [
  {
    href: '/how-to-answer/listening',
    label: 'Listening',
    icon: '🎧',
    description: '7 question types — note completion, multiple choice, matching, maps, and more.',
    available: true,
  },
  {
    href: '/how-to-answer/reading',
    label: 'Reading',
    icon: '📖',
    description: '9 question types — True/False/Not Given, matching headings, sentence completion, and more.',
    available: true,
  },
  {
    href: '/how-to-answer/writing',
    label: 'Writing',
    icon: '✍️',
    description: 'Task 1 (6 chart types) + Task 2 (opinion, discussion, problem/solution, two-part).',
    available: true,
  },
  {
    href: '/how-to-answer/speaking',
    label: 'Speaking',
    icon: '🎤',
    description: 'Part 1 short answers, Part 2 long turn, Part 3 discussion — real exam strategies.',
    available: true,
  },
]

export default function HowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">How to Answer</h1>
      <p className="mt-1 text-sm text-gray-500">
        Step-by-step strategies for every IELTS question type, organised by skill.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {SKILLS.map(({ href, label, icon, description, available }) =>
          available ? (
            <Link
              key={label}
              href={href}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{description}</p>
              </div>
              <span className="ml-auto self-center text-xs text-blue-500">→</span>
            </Link>
          ) : (
            <div
              key={label}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5 opacity-60"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-500">{label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{description}</p>
              </div>
              <span className="ml-auto self-center rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                Coming soon
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
