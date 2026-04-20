'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
  { href: '/speaking/session', label: 'Speaking (Full)', icon: '🎙' },
  { href: '/speaking', label: 'Speaking Pt 1', icon: '🎤' },
  { href: '/speaking/part2', label: 'Speaking Pt 2', icon: '🎤' },
  { href: '/writing', label: 'Writing', icon: '✍' },
  { href: '/reading', label: 'Reading', icon: '📖' },
  { href: '/listening', label: 'Listening', icon: '🎧' },
  { href: '/vocabulary', label: 'Vocabulary', icon: '📚' },
  { href: '/history', label: 'History', icon: '🕐' },
  { href: '/how-to-answer', label: 'How to Answer', icon: '💡' },
  { href: '/topic-ideas', label: 'Topic Ideas', icon: '🗂️' },
  { href: '/connected-speech', label: 'Connected Speech', icon: '🔗' },
  { href: '/collocations', label: 'Collocations', icon: '🧩' },
]

export function NavSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-52 shrink-0 flex-col border-r border-gray-200 bg-white px-3 py-6">
      <p className="mb-8 px-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        IELTS 6.5
      </p>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-lg bg-gray-50 px-3 py-3">
        <p className="text-xs text-gray-500">Target</p>
        <p className="text-sm font-semibold text-gray-800">Band 6.5</p>
      </div>
    </aside>
  )
}
