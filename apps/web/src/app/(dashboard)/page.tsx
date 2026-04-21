import Link from 'next/link'

const MODULES = [
  {
    href: '/speaking',
    title: 'Speaking',
    icon: '🎙',
    description: 'Part 1 interview with an AI examiner. Get real-time questions on personal and tech topics.',
    status: 'active' as const,
  },
  {
    href: '/writing',
    title: 'Writing Task 2',
    icon: '✍',
    description: 'Draft essays on tech-society topics with multi-pass band-level feedback.',
    status: 'coming-soon' as const,
  },
  {
    href: '/vocabulary',
    title: 'Vocabulary',
    icon: '📚',
    description: 'Replace dev slang with Academic Word List alternatives for a Band 7+ boost.',
    status: 'coming-soon' as const,
  },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Target: <span className="font-semibold text-blue-600">IELTS Band 6.5</span>
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {MODULES.map(({ href, title, icon, description, status }) => (
          <Link
            key={href}
            href={status === 'active' ? href : '#'}
            className={`flex items-start gap-4 rounded-xl border p-5 transition-shadow ${
              status === 'active'
                ? 'border-gray-200 bg-white hover:shadow-md cursor-pointer'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{title}</p>
                {status === 'coming-soon' && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
