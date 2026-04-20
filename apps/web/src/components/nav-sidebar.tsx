'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type NavItem = { href: string; label: string; icon: string }
type NavGroup = { label: string; items: NavItem[] }

const STANDALONE: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
]

const GROUPS: NavGroup[] = [
  {
    label: 'Practice',
    items: [
      { href: '/speaking/session', label: 'Speaking (Full)', icon: '🎙' },
      { href: '/speaking', label: 'Speaking Pt 1', icon: '🎤' },
      { href: '/speaking/part2', label: 'Speaking Pt 2', icon: '🎤' },
      { href: '/writing', label: 'Writing', icon: '✍' },
      { href: '/reading', label: 'Reading', icon: '📖' },
      { href: '/listening', label: 'Listening', icon: '🎧' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/vocabulary', label: 'Vocabulary', icon: '📚' },
      { href: '/collocations', label: 'Collocations', icon: '🧩' },
      { href: '/connected-speech', label: 'Connected Speech', icon: '🔗' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { href: '/how-to-answer', label: 'How to Answer', icon: '💡' },
      { href: '/topic-ideas', label: 'Topic Ideas', icon: '🗂️' },
    ],
  },
]

const STANDALONE_BOTTOM: NavItem[] = [
  { href: '/history', label: 'History', icon: '🕐' },
]

function isActive(href: string, pathname: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
}

function groupContainsActive(group: NavGroup, pathname: string) {
  return group.items.some((item) => isActive(item.href, pathname))
}

export function NavSidebar() {
  const pathname = usePathname()

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.label, groupContainsActive(g, pathname)])),
  )

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="flex h-screen w-52 shrink-0 flex-col border-r border-gray-200 bg-white px-3 py-6">
      <p className="mb-6 px-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        IELTS 6.5
      </p>

      <nav className="flex flex-col gap-0.5 overflow-y-auto flex-1">
        {/* Standalone top items */}
        {STANDALONE.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* Collapsible groups */}
        {GROUPS.map((group) => {
          const open = openGroups[group.label] ?? false
          const hasActive = groupContainsActive(group, pathname)

          return (
            <div key={group.label} className="mt-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  hasActive
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {group.label}
                <span
                  className={`text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>

              {open && (
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} indent />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Standalone bottom items */}
        <div className="mt-2">
          {STANDALONE_BOTTOM.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      <div className="mt-4 rounded-lg bg-gray-50 px-3 py-3">
        <p className="text-xs text-gray-500">Target</p>
        <p className="text-sm font-semibold text-gray-800">Band 6.5</p>
      </div>
    </aside>
  )
}

function NavLink({
  item,
  pathname,
  indent = false,
}: {
  item: NavItem
  pathname: string
  indent?: boolean
}) {
  const active = isActive(item.href, pathname)
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors ${
        indent ? 'px-4' : 'px-3'
      } ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className="text-base">{item.icon}</span>
      {item.label}
    </Link>
  )
}
