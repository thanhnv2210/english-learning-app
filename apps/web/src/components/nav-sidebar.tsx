'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
      { href: '/exam-countdown', label: 'Exam Sprint', icon: '⏱️' },
    ],
  },
]

const STANDALONE_BOTTOM: NavItem[] = [
  { href: '/history', label: 'History', icon: '🕐' },
]

const FONT_LEVELS = [100, 125, 155] as const
type FontLevel = 0 | 1 | 2

const FONT_LEVEL_LABELS = ['A', 'A', 'A']
const FONT_LEVEL_SIZES  = ['text-xs', 'text-sm', 'text-base']
const FONT_STORAGE = 'ielts-font-scale'
const COLLAPSE_STORAGE = 'ielts-sidebar-collapsed'

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
  // userCollapsed: manual preference; isNarrow: forced by viewport width
  const [userCollapsed, setUserCollapsed] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const [fontLevel, setFontLevel] = useState(0) // index 0 = 100%

  const isCollapsed = isNarrow || userCollapsed

  // Restore persisted state + watch viewport width for auto-collapse
  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_STORAGE)
    if (stored === 'true') setUserCollapsed(true)

    const fontStored = localStorage.getItem(FONT_STORAGE)
    if (fontStored !== null) {
      const level = Number(fontStored) as FontLevel
      if (level >= 0 && level < FONT_LEVELS.length) {
        setFontLevel(level)
        document.documentElement.style.fontSize = `${FONT_LEVELS[level]}%`
      }
    }

    // Auto-collapse below lg (1024px) — covers 200%+ browser zoom
    const mq = window.matchMedia('(max-width: 1023px)')
    setIsNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  function toggleCollapse() {
    // Only let users manually toggle when viewport is wide enough
    if (isNarrow) return
    setUserCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSE_STORAGE, String(next))
      return next
    })
  }

  function setFont(level: FontLevel) {
    setFontLevel(level)
    localStorage.setItem(FONT_STORAGE, String(level))
    document.documentElement.style.fontSize = `${FONT_LEVELS[level]}%`
  }

  // ── Collapsed: icon-only rail ────────────────────────────────────────────────
  if (isCollapsed) {
    const allItems = [
      ...STANDALONE,
      ...GROUPS.flatMap((g) => g.items),
      ...STANDALONE_BOTTOM,
    ]
    return (
      <aside className="flex h-screen w-14 shrink-0 flex-col items-center border-r border-gray-200 bg-white py-4 gap-0.5">
        {/* Expand button — only shown when user manually collapsed (not auto-collapsed by zoom) */}
        {!isNarrow && (
          <button
            onClick={toggleCollapse}
            title="Expand sidebar"
            className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <span className="text-sm">›</span>
          </button>
        )}

        {/* All nav items as icon-only links */}
        {allItems.map((item) => {
          const active = isActive(item.href, pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {item.icon}
            </Link>
          )
        })}

        {/* Font size controls */}
        <div className="mt-auto flex flex-col items-center gap-0.5 pb-2">
          {([0, 1, 2] as FontLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFont(lvl)}
              title={`Text ${FONT_LEVELS[lvl]}%`}
              className={`flex h-7 w-7 items-center justify-center rounded font-bold transition-colors ${FONT_LEVEL_SIZES[lvl]} ${
                fontLevel === lvl
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              A
            </button>
          ))}
        </div>
      </aside>
    )
  }

  // ── Expanded: full sidebar ───────────────────────────────────────────────────
  return (
    <aside className="flex h-screen w-52 shrink-0 flex-col border-r border-gray-200 bg-white px-3 py-6 2xl:w-64">
      {/* Header row: title + collapse button (only shown at wide viewports) */}
      <div className="mb-6 flex items-center justify-between px-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          IELTS 6.5
        </p>
        {!isNarrow && (
          <button
            onClick={toggleCollapse}
            title="Collapse sidebar"
            className="flex h-6 w-6 items-center justify-center rounded text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <span className="text-xs">‹</span>
          </button>
        )}
      </div>

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

      {/* Footer: target band + font size controls */}
      <div className="mt-4 space-y-3 rounded-lg bg-gray-50 px-3 py-3">
        <div>
          <p className="text-xs text-gray-500">Target</p>
          <p className="text-sm font-semibold text-gray-800">Band 6.5</p>
        </div>

        {/* Font size control */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Text size</span>
          <div className="flex items-center gap-1">
            {([0, 1, 2] as FontLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFont(lvl)}
                title={`${FONT_LEVELS[lvl]}%`}
                className={`flex h-6 w-6 items-center justify-center rounded font-bold transition-colors ${FONT_LEVEL_SIZES[lvl]} ${
                  fontLevel === lvl
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                A
              </button>
            ))}
          </div>
        </div>
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
