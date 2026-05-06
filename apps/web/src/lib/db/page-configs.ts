import { db } from '@/lib/db'
import { pageConfigs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { PageConfigs } from '@/lib/nav-config'

/** Load all page configs into a lookup map keyed by href. */
export async function getAllPageConfigs(): Promise<PageConfigs> {
  const rows = await db.select().from(pageConfigs)
  return Object.fromEntries(
    rows.map((r) => [r.href, { tag: r.tag, isDisabled: r.isDisabled }])
  )
}

/**
 * Set tag and/or disabled state for a page.
 * If both are defaults (no tag, not disabled), the row is deleted to keep the table clean.
 */
export async function upsertPageConfig(
  href: string,
  tag: string | null,
  isDisabled: boolean
): Promise<void> {
  if (!tag && !isDisabled) {
    await db.delete(pageConfigs).where(eq(pageConfigs.href, href))
    return
  }
  await db
    .insert(pageConfigs)
    .values({ href, tag, isDisabled, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: pageConfigs.href,
      set: { tag, isDisabled, updatedAt: new Date() },
    })
}
