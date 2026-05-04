'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { toggleFavouritePageAction, reorderFavouritePagesAction } from '@/app/actions/favourite-pages'

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
      { href: '/writing', label: 'Writing Task 2', icon: '✍' },
      { href: '/writing/task1', label: 'Writing Task 1', icon: '📊' },
      { href: '/reading', label: 'Reading', icon: '📖' },
      { href: '/listening', label: 'Listening', icon: '🎧' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/vocabulary', label: 'Vocabulary', icon: '📚' },
      { href: '/vocabulary/review', label: 'Vocab Review (SRS)', icon: '🔁' },
      { href: '/collocations', label: 'Collocations', icon: '🧩' },
      { href: '/idioms', label: 'Idioms', icon: '💬' },
      { href: '/compare', label: 'Word Compare', icon: '⚖️' },
      { href: '/vocab-banks', label: 'Vocab Banks', icon: '🏦' },
      { href: '/essay-builder', label: 'Essay Builder', icon: '✍️' },
      { href: '/connected-speech', label: 'Connected Speech', icon: '🔗' },
      { href: '/grammar-traps', label: 'Grammar Traps', icon: '⚠️' },
      { href: '/speaking/phrases', label: 'Speaking Phrases', icon: '🗣️' },
      { href: '/writing/phrases', label: 'Writing Phrases', icon: '✍️' },
      { href: '/word-pairs', label: 'Word Pairs', icon: '⇄' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { href: '/cheat-sheet', label: 'Cheat Sheet', icon: '🗺️' },
      { href: '/how-to-answer', label: 'How to Answer', icon: '💡' },
      { href: '/irregular-verbs', label: 'Irregular Verbs', icon: '🔀' },
      { href: '/how-to-answer/question-anatomy', label: 'Question Anatomy', icon: '🔍' },
      { href: '/paraphrase', label: 'Paraphrase', icon: '🔄' },
      { href: '/language-comparison', label: 'Language DNA', icon: '🧬' },
      { href: '/topic-ideas', label: 'Topic Ideas', icon: '🗂️' },
      { href: '/prompt-library', label: 'AI Prompts', icon: '🤖' },
      { href: '/exam-countdown', label: 'Exam Sprint', icon: '⏱️' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { href: '/projects', label: 'Projects', icon: '📋' },
      { href: '/analytics', label: 'Analytics', icon: '📊' },
      { href: '/wrong-decisions', label: 'Wrong Decisions', icon: '❌' },
      { href: '/history', label: 'History', icon: '🕐' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/admin/users', label: 'Users', icon: '👥' },
    ],
  },
]

const SETTINGS_ITEM: NavItem = { href: '/settings', label: 'Settings', icon: '⚙️' }

const ALL_NAV_ITEMS: NavItem[] = [
  ...STANDALONE,
  ...GROUPS.flatMap((g) => g.items),
  SETTINGS_ITEM,
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
const NAV_GROUPS_STORAGE = 'ielts-nav-groups'
const NAV_FAVS_EXPANDED_STORAGE = 'ielts-nav-favs-expanded'

function isActive(href: string, pathname: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
}

function groupContainsActive(group: NavGroup, pathname: string) {
  return group.items.some((item) => isActive(item.href, pathname))
}

export function NavSidebar({
  targetProfile = 'IELTS_Academic_6.5',
  favouritePages = [],
  userEmail,
  userName,
  userImage,
  isAdmin = false,
}: {
  targetProfile?: string
  favouritePages?: string[]
  userEmail?: string
  userName?: string
  userImage?: string
  isAdmin?: boolean
}) {
  const pathname = usePathname()

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(GROUPS.map((g) => [g.label, false])),
  )
  const [userCollapsed, setUserCollapsed] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const [fontLevel, setFontLevel] = useState(0)
  const [favs, setFavs] = useState<string[]>(favouritePages)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [favsExpanded, setFavsExpanded] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

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

    try {
      const groupsStored = localStorage.getItem(NAV_GROUPS_STORAGE)
      if (groupsStored) {
        const parsed = JSON.parse(groupsStored) as Record<string, boolean>
        setOpenGroups((prev) => ({ ...prev, ...parsed }))
      } else {
        // No saved config — open the group that contains the active page
        setOpenGroups((prev) =>
          Object.fromEntries(GROUPS.map((g) => [g.label, prev[g.label] || groupContainsActive(g, pathname)]))
        )
      }
      const favsStored = localStorage.getItem(NAV_FAVS_EXPANDED_STORAGE)
      if (favsStored !== null) setFavsExpanded(favsStored === 'true')
    } catch { /* ignore malformed storage */ }

    const mq = window.matchMedia('(max-width: 1023px)')
    setIsNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function toggleGroup(label: string) {
    setOpenGroups((prev) => {
      const next = { ...prev, [label]: !prev[label] }
      try { localStorage.setItem(NAV_GROUPS_STORAGE, JSON.stringify(next)) } catch { }
      return next
    })
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

  function handleDragStart(index: number) {
    setDragIndex(index)
  }

  function handleDragOver(index: number) {
    if (dragIndex !== null && dragIndex !== index) setDropIndex(index)
  }

  function handleDrop() {
    if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setDropIndex(null)
      return
    }
    const newOrder = [...favs]
    const [moved] = newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, moved)
    setFavs(newOrder)
    reorderFavouritePagesAction(newOrder)
    setDragIndex(null)
    setDropIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null)
    setDropIndex(null)
  }

  function handleMoveToTop(href: string) {
    const newOrder = [href, ...favs.filter((f) => f !== href)]
    setFavs(newOrder)
    reorderFavouritePagesAction(newOrder)
  }

  const visibleNavItems = isAdmin
    ? ALL_NAV_ITEMS
    : ALL_NAV_ITEMS.filter((item) => !item.href.startsWith('/admin'))

  // Preserve order from favs array (order matters for drag-to-reorder)
  const favouritedItems = favs
    .map((href) => visibleNavItems.find((item) => item.href === href))
    .filter((item): item is NavItem => item !== undefined)

  const VISIBLE_COUNT = 5
  const hasMore = favouritedItems.length > VISIBLE_COUNT

  // ── Collapsed: icon-only rail ────────────────────────────────────────────────
  if (isCollapsed) {
    const nonFavItems = visibleNavItems.filter((item) => !favs.includes(item.href))
    const orderedItems = [...favouritedItems, ...nonFavItems]

    return (
      <aside className="hidden sm:flex h-screen w-14 shrink-0 flex-col items-center border-r border-border bg-card py-4 gap-0.5">
        {!isNarrow && (
          <button
            onClick={toggleCollapse}
            title="Expand sidebar"
            className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg text-faint hover:bg-subtle hover:text-muted-foreground transition-colors"
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
                      : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
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
                  : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
              }`}
            >
              {item.icon}
            </Link>
          )
        })}

        <div className="mt-auto flex flex-col items-center gap-0.5 pb-2 border-t border-border pt-2">
          <Link
            href={SETTINGS_ITEM.href}
            title={SETTINGS_ITEM.label}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors ${
              isActive(SETTINGS_ITEM.href, pathname)
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
            }`}
          >
            {SETTINGS_ITEM.icon}
          </Link>
          {([0, 1, 2] as FontLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFont(lvl)}
              title={`Text ${FONT_LEVELS[lvl]}%`}
              className={`flex h-7 w-7 items-center justify-center rounded font-bold transition-colors ${FONT_LEVEL_SIZES[lvl]} ${
                fontLevel === lvl
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-faint hover:bg-subtle hover:text-muted-foreground'
              }`}
            >
              A
            </button>
          ))}
          {userEmail && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title={`Sign out (${userName || userEmail})`}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:ring-2 hover:ring-red-400 transition-all overflow-hidden"
            >
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt="" className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                  {(userName || userEmail)[0].toUpperCase()}
                </div>
              )}
            </button>
          )}
        </div>
      </aside>
    )
  }

  // ── Expanded: full sidebar ───────────────────────────────────────────────────
  return (
    <aside className="hidden sm:flex h-screen w-52 shrink-0 flex-col border-r border-border bg-card px-3 py-6 2xl:w-64">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          {formatTargetLabel(targetProfile)}
        </p>
        {!isNarrow && (
          <button
            onClick={toggleCollapse}
            title="Collapse sidebar"
            className="flex h-6 w-6 items-center justify-center rounded text-faint hover:bg-subtle hover:text-muted-foreground transition-colors"
          >
            <span className="text-xs">‹</span>
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 overflow-y-auto flex-1">

        {/* Favourites section */}
        {favouritedItems.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400">
                ★ Favourites
              </p>
              {hasMore && (
                <button
                  onClick={() => setFavsExpanded((v) => {
                    const next = !v
                    try { localStorage.setItem(NAV_FAVS_EXPANDED_STORAGE, String(next)) } catch { }
                    return next
                  })}
                  title={favsExpanded ? 'Show less' : `Show all ${favouritedItems.length}`}
                  className="text-[10px] text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                >
                  {favsExpanded ? '▲ less' : `▼ +${favouritedItems.length - VISIBLE_COUNT}`}
                </button>
              )}
            </div>
            <div
              className={`flex flex-col gap-0.5 overflow-y-auto ${!favsExpanded ? 'max-h-[185px]' : ''}`}
            >
              {favouritedItems.map((item, index) => (
                <FavDragItem
                  key={item.href}
                  item={item}
                  index={index}
                  pathname={pathname}
                  onToggleFav={handleToggleFav}
                  dragIndex={dragIndex}
                  dropIndex={dropIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onMoveToTop={handleMoveToTop}
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
        {GROUPS.filter((group) => group.label !== 'Admin' || isAdmin).map((group) => {
          const open = openGroups[group.label] ?? false
          const hasActive = groupContainsActive(group, pathname)

          return (
            <div key={group.label} className="mt-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  hasActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-faint hover:text-muted-foreground'
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

      </nav>

      {/* User row — always visible at bottom */}
      {userEmail && (
        <div className="mt-2 border-t border-border pt-2 px-2">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt="" className="h-7 w-7 rounded-full shrink-0 ring-1 ring-border" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {(userName || userEmail)[0].toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">{userName || userEmail}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign out"
              className="shrink-0 rounded p-1 text-xs text-faint hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
            >
              ↩
            </button>
          </div>
        </div>
      )}

      {/* Settings — pinned to bottom */}
      <div className="mt-1 border-t border-border pt-2">
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive(SETTINGS_ITEM.href, pathname)
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-base">{SETTINGS_ITEM.icon}</span>
            {SETTINGS_ITEM.label}
          </span>
          <span className={`text-[10px] transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {settingsOpen && (
          <div className="mx-3 mt-2 mb-1 flex flex-col gap-2 rounded-lg bg-muted px-3 py-3">
            <Link
              href={SETTINGS_ITEM.href}
              className="text-xs font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Open Settings →
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-xs text-faint">Text size</span>
              <div className="flex items-center gap-1">
                {([0, 1, 2] as FontLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFont(lvl)}
                    title={`${FONT_LEVELS[lvl]}%`}
                    className={`flex h-6 w-6 items-center justify-center rounded font-bold transition-colors ${FONT_LEVEL_SIZES[lvl]} ${
                      fontLevel === lvl
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-faint hover:bg-subtle hover:text-muted-foreground'
                    }`}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function FavDragItem({
  item,
  index,
  pathname,
  onToggleFav,
  dragIndex,
  dropIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveToTop,
}: {
  item: NavItem
  index: number
  pathname: string
  onToggleFav: (href: string) => void
  dragIndex: number | null
  dropIndex: number | null
  onDragStart: (i: number) => void
  onDragOver: (i: number) => void
  onDrop: () => void
  onDragEnd: () => void
  onMoveToTop: (href: string) => void
}) {
  const active = isActive(item.href, pathname)
  const isDragging = dragIndex === index
  const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index) }}
      onDrop={(e) => { e.preventDefault(); onDrop() }}
      onDragEnd={onDragEnd}
      className={`group relative transition-opacity ${isDragging ? 'opacity-40' : ''} ${isDropTarget ? 'border-t-2 border-amber-400' : ''}`}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-2 rounded-lg py-2 px-3 text-sm font-medium transition-colors pr-7 ${
          active
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
        }`}
      >
        <span
          className="cursor-grab active:cursor-grabbing text-faint text-xs shrink-0 select-none"
          title="Drag to reorder"
        >
          ⠿
        </span>
        <span className="text-base shrink-0">{item.icon}</span>
        {item.label}
      </Link>
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
        {index > 0 && (
          <button
            onClick={() => onMoveToTop(item.href)}
            title="Move to top"
            className="rounded p-0.5 text-xs leading-none text-faint hover:text-amber-500 transition-colors"
          >
            ⇑
          </button>
        )}
        <button
          onClick={() => onToggleFav(item.href)}
          title="Remove from favourites"
          className="rounded p-0.5 text-sm leading-none text-amber-400 hover:text-red-400 transition-colors"
        >
          ★
        </button>
      </div>
    </div>
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
            : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
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
