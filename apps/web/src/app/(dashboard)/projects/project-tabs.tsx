'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function ProjectTabs({ projectId }: { projectId: number }) {
  const pathname = usePathname()
  const base = `/projects/${projectId}`

  const TABS = [
    { href: base,                label: 'Board' },
    { href: `${base}/backlog`,   label: 'Backlog' },
    { href: `${base}/sprints`,   label: 'Sprints' },
  ]

  function isActive(href: string) {
    if (href === base) return pathname === base
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
