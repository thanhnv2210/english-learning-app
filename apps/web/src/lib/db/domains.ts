import { db } from '@/lib/db'
import { writingDomains, userDomainPreferences } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

/** All 50 domains ordered by rank. */
export async function getAllDomains() {
  return db.select().from(writingDomains).orderBy(asc(writingDomains.rank))
}

/** Domains selected by a given user, ordered by rank. */
export async function getUserDomains(userId: number) {
  return db
    .select({
      id: writingDomains.id,
      rank: writingDomains.rank,
      name: writingDomains.name,
      description: writingDomains.description,
      category: writingDomains.category,
    })
    .from(userDomainPreferences)
    .innerJoin(writingDomains, eq(userDomainPreferences.domainId, writingDomains.id))
    .where(eq(userDomainPreferences.userId, userId))
    .orderBy(asc(writingDomains.rank))
}

/**
 * Replace a user's domain selection with a new set of domain IDs.
 * Runs in a transaction: deletes old prefs, inserts new ones.
 */
export async function setUserDomains(userId: number, domainIds: number[]) {
  await db.transaction(async (tx) => {
    await tx
      .delete(userDomainPreferences)
      .where(eq(userDomainPreferences.userId, userId))

    if (domainIds.length > 0) {
      await tx.insert(userDomainPreferences).values(
        domainIds.map((domainId) => ({ userId, domainId }))
      )
    }
  })
}

/**
 * Seed default top-10 domains for a newly created user.
 * No-op if the user already has preferences.
 */
export async function seedDefaultDomains(userId: number) {
  const existing = await db
    .select()
    .from(userDomainPreferences)
    .where(eq(userDomainPreferences.userId, userId))
    .limit(1)

  if (existing.length > 0) return // already configured

  const top10 = await db
    .select({ id: writingDomains.id })
    .from(writingDomains)
    .orderBy(asc(writingDomains.rank))
    .limit(10)

  if (top10.length === 0) return // domains not seeded yet

  await db.insert(userDomainPreferences).values(
    top10.map(({ id: domainId }) => ({ userId, domainId }))
  )
}
