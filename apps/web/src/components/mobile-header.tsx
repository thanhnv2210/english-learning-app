'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toggleFavouritePageAction } from '@/app/actions/favourite-pages'

type NavItem = { href: string; label: string; icon: string }
type NavGroup = { label: string; items: NavItem[] }

const STANDALONE: NavItem = { href: '/', label: 'Dashboard', icon: '⊞' }

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
  {
    label: 'Progress',
    items: [
      { href: '/projects', label: 'Projects', icon: '📋' },
      { href: '/analytics', label: 'Analytics', icon: '📊' },
      { href: '/wrong-decisions', label: 'Wrong Decisions', icon: '❌' },
      { href: '/history', label: 'History', icon: '🕐' },
    ],
  },
]

const ALL_ITEMS: NavItem[] = [STANDALONE, ...GROUPS.flatMap((g) => g.items)]

function isActive(href: string, pathname: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
}

function formatTarget(profile: string): string {
  if (profile === 'Business_Fluent') return 'Business Fluent'
  const match = profile.match(/(\d+\.\d+|\d+)$/)
  return `IELTS ${match ? parseFloat(match[1]) : 6.5}`
}

export function MobileHeader({
  targetProfile = 'IELTS_Academic_6.5',
  favouritePages = [],
}: {
  targetProfile?: string
  favouritePages?: string[]
}) {
  const [open, setOpen] = useState(false)
  const [favs, setFavs] = useState<string[]>(favouritePages)
  const [allPagesOpen, setAllPagesOpen] = useState(false)
  const pathname = usePathname()

  const hasPins = favs.length > 0
  const pinnedItems = ALL_ITEMS.filter((item) => favs.includes(item.href))

  function handleToggleFav(href: string) {
    setFavs((prev) =>
      prev.includes(href) ? prev.filter((f) => f !== href) : [...prev, href],
    )
    toggleFavouritePageAction(href)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <>
      {/* Fixed top bar — hidden on sm+ where the sidebar takes over */}
      <header className="sm:hidden fixed top-0 inset-x-0 z-40 flex h-12 items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4">
        <span className="text-sm font-semibold text-foreground">IELTS 6.5</span>
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open navigation"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Slide-out drawer overlay */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          {/* Drawer panel — h-screen so it's always scrollable */}
          <div className="w-72 max-w-[85vw] h-[100dvh] bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-700">

            {/* Drawer header — fixed, never scrolls */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {formatTarget(targetProfile)}
              </span>
              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable nav area */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">

              {/* ── Pinned section ── */}
              {hasPins && (
                <>
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400">
                    ★ Pinned
                  </p>
                  {pinnedItems.map((item) => (
                    <DrawerLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      isFav
                      onToggleFav={handleToggleFav}
                      onClose={handleClose}
                    />
                  ))}
                  <div className="my-2 mx-1 border-t border-border" />
                </>
              )}

              {/* ── All Pages toggle (only shown when pins exist) ── */}
              {hasPins && (
                <button
                  onClick={() => setAllPagesOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px]"
                >
                  All Pages
                  <span className={`text-[10px] transition-transform duration-200 ${allPagesOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
              )}

              {/* ── Full page list (always shown when no pins, collapsible when pins exist) ── */}
              {(!hasPins || allPagesOpen) && (
                <>
                  <DrawerLink
                    item={STANDALONE}
                    pathname={pathname}
                    isFav={favs.includes(STANDALONE.href)}
                    onToggleFav={handleToggleFav}
                    onClose={handleClose}
                  />
                  {GROUPS.map((group) => (
                    <div key={group.label} className="mt-3">
                      <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {group.label}
                      </p>
                      {group.items.map((item) => (
                        <DrawerLink
                          key={item.href}
                          item={item}
                          pathname={pathname}
                          indent
                          isFav={favs.includes(item.href)}
                          onToggleFav={handleToggleFav}
                          onClose={handleClose}
                        />
                      ))}
                    </div>
                  ))}
                </>
              )}
            </nav>

            {/* Settings — pinned to bottom, never scrolls */}
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 px-3 py-2">
              <DrawerLink
                item={{ href: '/settings', label: 'Settings', icon: '⚙️' }}
                pathname={pathname}
                isFav={favs.includes('/settings')}
                onToggleFav={handleToggleFav}
                onClose={handleClose}
              />
            </div>
          </div>

          {/* Backdrop — tap to close */}
          <div className="flex-1 bg-black/40" onClick={handleClose} />
        </div>
      )}
    </>
  )
}

function DrawerLink({
  item,
  pathname,
  indent = false,
  isFav,
  onToggleFav,
  onClose,
}: {
  item: NavItem
  pathname: string
  indent?: boolean
  isFav: boolean
  onToggleFav: (href: string) => void
  onClose: () => void
}) {
  const active = isActive(item.href, pathname)
  return (
    <div className="group relative">
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 rounded-lg min-h-[44px] py-2 text-sm font-medium transition-colors pr-8 ${
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
        title={isFav ? 'Unpin' : 'Pin to top'}
        className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-sm leading-none transition-all ${
          isFav
            ? 'text-amber-400 opacity-100'
            : 'text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFav ? '★' : '☆'}
      </button>
    </div>
  )
}
