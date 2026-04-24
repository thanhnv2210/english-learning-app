import { db } from '@/lib/db'
import { userSkillTopics } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getDefaultUser } from '@/lib/db/user'

// Default pinned topics per skill — used to seed on first fetch
const SKILL_DEFAULTS: Record<string, string[]> = {
  vocabulary: ['Technology', 'Environment', 'Education', 'Health', 'Economy', 'Work'],
  // speaking, writing, listening, reading — backlog
}

export async function getSkillFavorites(skill: string): Promise<string[]> {
  const user = await getDefaultUser()

  const rows = await db
    .select({ topicName: userSkillTopics.topicName })
    .from(userSkillTopics)
    .where(and(eq(userSkillTopics.userId, user.id), eq(userSkillTopics.skill, skill)))

  if (rows.length > 0) return rows.map((r) => r.topicName)

  // First visit — seed defaults so the user has a starting set
  const defaults = SKILL_DEFAULTS[skill] ?? []
  if (defaults.length > 0) {
    await db
      .insert(userSkillTopics)
      .values(defaults.map((topicName) => ({ userId: user.id, skill, topicName })))
      .onConflictDoNothing()
  }
  return defaults
}

export async function toggleSkillFavorite(skill: string, topicName: string): Promise<void> {
  const user = await getDefaultUser()

  const existing = await db
    .select()
    .from(userSkillTopics)
    .where(
      and(
        eq(userSkillTopics.userId, user.id),
        eq(userSkillTopics.skill, skill),
        eq(userSkillTopics.topicName, topicName),
      ),
    )
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(userSkillTopics)
      .where(
        and(
          eq(userSkillTopics.userId, user.id),
          eq(userSkillTopics.skill, skill),
          eq(userSkillTopics.topicName, topicName),
        ),
      )
  } else {
    await db
      .insert(userSkillTopics)
      .values({ userId: user.id, skill, topicName })
      .onConflictDoNothing()
  }
}
