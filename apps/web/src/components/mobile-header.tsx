'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = { href: string; label: string; icon: string }
type NavGroup = { label: string; items: NavItem[] }

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

function isActive(href: string, pathname: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
}

function formatTarget(profile: string): string {
  if (profile === 'Business_Fluent') return 'Business Fluent'
  const match = profile.match(/(\d+\.\d+|\d+)$/)
  return `IELTS ${match ? parseFloat(match[1]) : 6.5}`
}

export function MobileHeader({ targetProfile = 'IELTS_Academic_6.5' }: { targetProfile?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

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
          {/* Drawer panel */}
          <div className="w-72 max-w-[85vw] bg-white dark:bg-gray-900 flex flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-700">
            {/* Drawer header */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {formatTarget(targetProfile)}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
              <DrawerLink href="/" label="Dashboard" icon="⊞" pathname={pathname} onClose={() => setOpen(false)} />
              {GROUPS.map((group) => (
                <div key={group.label} className="mt-3">
                  <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <DrawerLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      pathname={pathname}
                      indent
                      onClose={() => setOpen(false)}
                    />
                  ))}
                </div>
              ))}
            </nav>

            {/* Settings pinned to bottom */}
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 px-3 py-2">
              <DrawerLink href="/settings" label="Settings" icon="⚙️" pathname={pathname} onClose={() => setOpen(false)} />
            </div>
          </div>

          {/* Backdrop — tap to close */}
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

function DrawerLink({
  href,
  label,
  icon,
  pathname,
  indent = false,
  onClose,
}: {
  href: string
  label: string
  icon: string
  pathname: string
  indent?: boolean
  onClose: () => void
}) {
  const active = isActive(href, pathname)
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-3 rounded-lg min-h-[44px] py-2 text-sm font-medium transition-colors ${
        indent ? 'px-4' : 'px-3'
      } ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  )
}
