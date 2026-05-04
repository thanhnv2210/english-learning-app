import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { seedDefaultDomains } from '@/lib/db/domains'
import { auth } from '@/auth'

const DEFAULT_EMAIL = 'default@local.dev'

/**
 * Returns the currently authenticated user from the NextAuth session.
 * Throws if not authenticated. Use this in server actions and pages.
 */
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  const userId = parseInt(session.user.id)
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user) throw new Error('User not found')
  return user
}

export async function getDefaultUser() {
  const existing = await db.select().from(users).where(eq(users.email, DEFAULT_EMAIL)).limit(1)
  if (existing[0]) return existing[0]

  const [created] = await db
    .insert(users)
    .values({ email: DEFAULT_EMAIL, targetProfile: 'IELTS_Academic_6.5' })
    .returning()

  await seedDefaultDomains(created.id)
  return created
}

export function parseTargetBand(profile: string): number {
  // 'IELTS_6.5' → 6.5, 'IELTS_7.5' → 7.5
  const match = profile.match(/(\d+\.\d+|\d+)$/)
  return match ? parseFloat(match[1]) : 6.5
}

export async function updateTargetProfile(userId: number, profile: string): Promise<void> {
  await db
    .update(users)
    .set({ targetProfile: profile })
    .where(eq(users.id, userId))
}

/**
 * Returns the user's effective AI context (tier + modelPreference).
 * Use this in API routes instead of calling auth() + getCurrentUser() separately.
 */
export async function getUserAIContext(): Promise<{ tier: string; modelPreference: 'auto' | 'free' }> {
  const user = await getCurrentUser()
  return {
    tier: user.tier ?? 'free',
    modelPreference: (user.modelPreference ?? 'auto') as 'auto' | 'free',
  }
}

export async function updateModelPreference(userId: number, preference: 'auto' | 'free'): Promise<void> {
  await db.update(users).set({ modelPreference: preference }).where(eq(users.id, userId))
}

export async function toggleFavouritePage(userId: number, href: string): Promise<void> {
  const [user] = await db
    .select({ favouritePages: users.favouritePages })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const current = (user?.favouritePages ?? []) as string[]
  const next = current.includes(href)
    ? current.filter((p) => p !== href)
    : [...current, href]

  await db.update(users).set({ favouritePages: next }).where(eq(users.id, userId))
}

export async function reorderFavouritePages(userId: number, orderedPages: string[]): Promise<void> {
  await db.update(users).set({ favouritePages: orderedPages }).where(eq(users.id, userId))
}

export async function updateShowSystemData(userId: number, showSystemData: boolean): Promise<void> {
  await db.update(users).set({ showSystemData }).where(eq(users.id, userId))
}
