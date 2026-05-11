/**
 * Seed the first official IELTS result for the admin user.
 * Safe to re-run — skips if already exists for that exam date.
 * Run: pnpm db:seed:ielts-results
 */

import { db } from '@/lib/db'
import { officialIeltsResults, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

async function seed() {
  const [admin] = await db.select().from(users).where(eq(users.role, 'admin')).limit(1)
  if (!admin) {
    console.error('No admin user found. Run set-password first.')
    process.exit(1)
  }

  const [existing] = await db
    .select()
    .from(officialIeltsResults)
    .where(and(eq(officialIeltsResults.userId, admin.id), eq(officialIeltsResults.examDate, '2026-05-03')))
    .limit(1)

  if (existing) {
    console.log('Result for 2026-05-03 already exists — skipping.')
    process.exit(0)
  }

  await db.insert(officialIeltsResults).values({
    userId: admin.id,
    examDate: '2026-05-03',
    listening: 5.0,
    reading: 6.0,
    writing: 6.0,
    speaking: 6.5,
    overall: 6.0,
    notes: 'First official IELTS Academic attempt.',
  })

  console.log('Seeded official IELTS result for', admin.email)
  process.exit(0)
}

seed()
