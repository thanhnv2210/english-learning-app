import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { seedDefaultDomains } from '@/lib/db/domains'

const DEFAULT_EMAIL = 'default@local.dev'

export async function getDefaultUser() {
  const existing = await db.select().from(users).where(eq(users.email, DEFAULT_EMAIL)).limit(1)
  if (existing[0]) return existing[0]

  const [created] = await db
    .insert(users)
    .values({ email: DEFAULT_EMAIL, targetProfile: 'IELTS_6.5' })
    .returning()

  await seedDefaultDomains(created.id)
  return created
}

export function parseTargetBand(profile: string): number {
  // 'IELTS_6.5' → 6.5, 'IELTS_7.5' → 7.5
  const match = profile.match(/(\d+\.\d+|\d+)$/)
  return match ? parseFloat(match[1]) : 6.5
}
