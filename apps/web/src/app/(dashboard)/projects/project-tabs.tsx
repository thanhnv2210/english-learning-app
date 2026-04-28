'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/projects',         label: 'Board' },
  { href: '/projects/backlog', label: 'Backlog' },
  { href: '/projects/sprints', label: 'Sprints' },
]

export function ProjectTabs() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/projects') return pathname === '/projects'
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex gap-1 rounded-xl border border-border bg-subtle p-1">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            isActive(tab.href)
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
