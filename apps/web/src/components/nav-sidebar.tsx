'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toggleFavouritePageAction } from '@/app/actions/favourite-pages'

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
      { href: '/essay-builder', label: 'Essay Builder', icon: '✍️' },
      { href: '/connected-speech', label: 'Connected Speech', icon: '🔗' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { href: '/how-to-answer', label: 'How to Answer', icon: '💡' },
      { href: '/how-to-answer/question-anatomy', label: 'Question Anatomy', icon: '🔍' },
      { href: '/paraphrase', label: 'Paraphrase', icon: '🔄' },
      { href: '/language-comparison', label: 'Language DNA', icon: '🧬' },
      { href: '/topic-ideas', label: 'Topic Ideas', icon: '🗂️' },
      { href: '/prompt-library', label: 'AI Prompts', icon: '🤖' },
      { href: '/exam-countdown', label: 'Exam Sprint', icon: '⏱️' },
    ],
  },
]

const STANDALONE_BOTTOM: NavItem[] = [
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/wrong-decisions', label: 'Wrong Decisions', icon: '❌' },
  { href: '/history', label: 'History', icon: '🕐' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

const ALL_NAV_ITEMS: NavItem[] = [
  ...STANDALONE,
  ...GROUPS.flatMap((g) => g.items),
  ...STANDALONE_BOTTOM,
]

function formatTargetLabel(profile: string): string {
  if (profile === 'Business_Fluent') return 'Business'
  const match = profile.match(/(\d+\.\d+|\d+)$/)
  const band = match ? parseFloat(match[1]) : 6.5
  return `IELTS ${band}`
}

const FONT_LEVELS = [100, 125, 155] as const
type FontLevel = 0 | 1 | 2

const FONT_LEVEL_SIZES  = ['text-xs', 'text-sm', 'text-base']
const FONT_STORAGE = 'ielts-font-scale'
const COLLAPSE_STORAGE = 'ielts-sidebar-collapsed'

function isActive(href: string, pathname: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
}

function groupContainsActive(group: NavGroup, pathname: string) {
  return group.items.some((item) => isActive(item.href, pathname))
}

export function NavSidebar({
  targetProfile = 'IELTS_Academic_6.5',
  favouritePages = [],
}: {
  targetProfile?: string
  favouritePages?: string[]
}) {
  const pathname = usePathname()

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.label, groupContainsActive(g, pathname)])),
  )
  const [userCollapsed, setUserCollapsed] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const [fontLevel, setFontLevel] = useState(0)
  const [favs, setFavs] = useState<string[]>(favouritePages)

  const isCollapsed = isNarrow || userCollapsed

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

  function handleToggleFav(href: string) {
    setFavs((prev) =>
      prev.includes(href) ? prev.filter((f) => f !== href) : [...prev, href],
    )
    toggleFavouritePageAction(href)
  }

  const favouritedItems = ALL_NAV_ITEMS.filter((item) => favs.includes(item.href))

  // ── Collapsed: icon-only rail ────────────────────────────────────────────────
  if (isCollapsed) {
    const nonFavItems = ALL_NAV_ITEMS.filter((item) => !favs.includes(item.href))
    const orderedItems = [...favouritedItems, ...nonFavItems]

    return (
      <aside className="flex h-screen w-14 shrink-0 flex-col items-center border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4 gap-0.5">
        {!isNarrow && (
          <button
            onClick={toggleCollapse}
            title="Expand sidebar"
            className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <span className="text-sm">›</span>
          </button>
        )}

        {favouritedItems.length > 0 && (
          <div className="flex flex-col items-center gap-0.5 mb-1 pb-1 border-b border-amber-200 dark:border-amber-800 w-10">
            {favouritedItems.map((item) => {
              const active = isActive(item.href, pathname)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={`★ ${item.label}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {item.icon}
                </Link>
              )
            })}
          </div>
        )}

        {nonFavItems.map((item) => {
          const active = isActive(item.href, pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors ${
                active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {item.icon}
            </Link>
          )
        })}

        <div className="mt-auto flex flex-col items-center gap-0.5 pb-2">
          {([0, 1, 2] as FontLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFont(lvl)}
              title={`Text ${FONT_LEVELS[lvl]}%`}
              className={`flex h-7 w-7 items-center justify-center rounded font-bold transition-colors ${FONT_LEVEL_SIZES[lvl]} ${
                fontLevel === lvl
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
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
    <aside className="flex h-screen w-52 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-6 2xl:w-64">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {formatTargetLabel(targetProfile)}
        </p>
        {!isNarrow && (
          <button
            onClick={toggleCollapse}
            title="Collapse sidebar"
            className="flex h-6 w-6 items-center justify-center rounded text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <span className="text-xs">‹</span>
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 overflow-y-auto flex-1">

        {/* Favourites section */}
        {favouritedItems.length > 0 && (
          <div className="mb-2">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400">
              ★ Favourites
            </p>
            <div className="flex flex-col gap-0.5">
              {favouritedItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  isFav
                  onToggleFav={handleToggleFav}
                />
              ))}
            </div>
            <div className="mt-2 mb-1 mx-3 border-t border-border" />
          </div>
        )}

        {/* Standalone top */}
        {STANDALONE.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            isFav={favs.includes(item.href)}
            onToggleFav={handleToggleFav}
          />
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
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {group.label}
                <span className={`text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {open && (
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      indent
                      isFav={favs.includes(item.href)}
                      onToggleFav={handleToggleFav}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Standalone bottom */}
        <div className="mt-2">
          {STANDALONE_BOTTOM.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              isFav={favs.includes(item.href)}
              onToggleFav={handleToggleFav}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-4 space-y-3 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatTargetLabel(targetProfile)}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">Text size</span>
          <div className="flex items-center gap-1">
            {([0, 1, 2] as FontLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFont(lvl)}
                title={`${FONT_LEVELS[lvl]}%`}
                className={`flex h-6 w-6 items-center justify-center rounded font-bold transition-colors ${FONT_LEVEL_SIZES[lvl]} ${
                  fontLevel === lvl
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
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
  isFav,
  onToggleFav,
}: {
  item: NavItem
  pathname: string
  indent?: boolean
  isFav: boolean
  onToggleFav: (href: string) => void
}) {
  const active = isActive(item.href, pathname)
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors pr-7 ${
          indent ? 'px-4' : 'px-3'
        } ${
          active
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        <span className="text-base">{item.icon}</span>
        {item.label}
      </Link>
      <button
        onClick={() => onToggleFav(item.href)}
        title={isFav ? 'Remove from favourites' : 'Add to favourites'}
        className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-sm leading-none transition-all ${
          isFav
            ? 'text-amber-400 opacity-100'
            : 'text-faint opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFav ? '★' : '☆'}
      </button>
    </div>
  )
}
