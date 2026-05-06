'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { toggleFavouritePageAction } from '@/app/actions/favourite-pages'
import {
  type NavItem,
  type PageConfigs,
  STANDALONE,
  NAV_GROUPS,
  ADMIN_GROUP,
  ALL_NAV_ITEMS,
  TAG_STYLES,
} from '@/lib/nav-config'

const ALL_ITEMS: NavItem[] = ALL_NAV_ITEMS

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
  isAdmin = false,
  userEmail,
  userName,
  userImage,
  pageConfigs = {},
}: {
  targetProfile?: string
  favouritePages?: string[]
  isAdmin?: boolean
  userEmail?: string
  userName?: string
  userImage?: string
  pageConfigs?: PageConfigs
}) {
  const [open, setOpen] = useState(false)
  const [favs, setFavs] = useState<string[]>(favouritePages)
  const [allPagesOpen, setAllPagesOpen] = useState(false)
  const pathname = usePathname()

  const visibleGroups = isAdmin ? [...NAV_GROUPS, ADMIN_GROUP] : NAV_GROUPS
  const visibleItems = (isAdmin ? ALL_NAV_ITEMS : ALL_NAV_ITEMS.filter((item) => !item.href.startsWith('/admin')))
    .filter((item) => !pageConfigs[item.href]?.isDisabled)

  const hasPins = favs.length > 0
  const pinnedItems = visibleItems.filter((item) => favs.includes(item.href))

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
      <header className="sm:hidden fixed top-0 inset-x-0 z-40 flex h-12 items-center justify-between bg-card border-b border-border px-4">
        <span className="text-sm font-semibold text-foreground">IELTS 6.5</span>
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-subtle transition-colors"
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
          <div className="w-72 max-w-[85vw] h-[100dvh] bg-card flex flex-col border-r border-border">

            {/* Drawer header — fixed, never scrolls */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-faint">
                {formatTarget(targetProfile)}
              </span>
              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-faint hover:bg-subtle transition-colors"
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
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-faint hover:text-muted-foreground transition-colors min-h-[44px]"
                >
                  All Pages
                  <span className={`text-[10px] transition-transform duration-200 ${allPagesOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
              )}

              {/* ── Full page list (always shown when no pins, collapsible when pins exist) ── */}
              {(!hasPins || allPagesOpen) && (
                <>
                  <DrawerLink
                    item={STANDALONE[0]}
                    pathname={pathname}
                    isFav={favs.includes(STANDALONE[0].href)}
                    onToggleFav={handleToggleFav}
                    onClose={handleClose}
                  />
                  {visibleGroups.map((group) => (
                    <div key={group.label} className="mt-3">
                      <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-faint">
                        {group.label}
                      </p>
                      {group.items.filter((item) => !pageConfigs[item.href]?.isDisabled).map((item) => (
                        <DrawerLink
                          key={item.href}
                          item={item}
                          pathname={pathname}
                          indent
                          isFav={favs.includes(item.href)}
                          onToggleFav={handleToggleFav}
                          tag={pageConfigs[item.href]?.tag}
                          onClose={handleClose}
                        />
                      ))}
                    </div>
                  ))}
                </>
              )}
            </nav>

            {/* Bottom: Settings + user row */}
            <div className="shrink-0 border-t border-border px-3 py-2 flex flex-col gap-1">
              <DrawerLink
                item={{ href: '/settings', label: 'Settings', icon: '⚙️' }}
                pathname={pathname}
                isFav={favs.includes('/settings')}
                onToggleFav={handleToggleFav}
                onClose={handleClose}
              />
              {userEmail && (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 mt-1">
                  {userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userImage} alt="" className="h-7 w-7 rounded-full shrink-0 ring-1 ring-border" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {(userName || userEmail)[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                    {userName || userEmail}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    title="Sign out"
                    className="shrink-0 rounded p-1 text-xs text-faint hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                  >
                    ↩
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Backdrop — tap to close */}
          <div className="flex-1 bg-black/40" onClick={handleClose} />
        </div>
      )}
    </>
  )
}

function TagBadge({ tag }: { tag: string }) {
  const style = TAG_STYLES[tag]
  if (!style) return null
  return (
    <span className={`ml-auto shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase leading-none ${style.className}`}>
      {style.label}
    </span>
  )
}

function DrawerLink({
  item,
  pathname,
  indent = false,
  isFav,
  onToggleFav,
  onClose,
  tag,
}: {
  item: NavItem
  pathname: string
  indent?: boolean
  isFav: boolean
  onToggleFav: (href: string) => void
  onClose: () => void
  tag?: string | null
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
            : 'text-muted-foreground hover:bg-subtle hover:text-foreground'
        }`}
      >
        <span className="text-base">{item.icon}</span>
        <span className="truncate">{item.label}</span>
        {tag && <TagBadge tag={tag} />}
      </Link>
      <button
        onClick={() => onToggleFav(item.href)}
        title={isFav ? 'Unpin' : 'Pin to top'}
        className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-sm leading-none transition-all ${
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
