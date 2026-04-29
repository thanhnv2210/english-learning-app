/**
 * Set password for the default user.
 * Run with: pnpm db:set-password
 *
 * Usage:
 *   ADMIN_PASSWORD=yourpassword pnpm db:set-password
 *   If ADMIN_PASSWORD is not set, defaults to 'admin123' (change after first login)
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'
import { eq } from 'drizzle-orm'

const DEFAULT_EMAIL = 'default@local.dev'
const password = process.env.ADMIN_PASSWORD ?? 'admin123'

async function main() {
  const client = postgres(process.env.DATABASE_URL!)
  const db = drizzle(client, { schema })

  const hash = await bcrypt.hash(password, 12)

  const result = await db
    .update(schema.users)
    .set({ passwordHash: hash })
    .where(eq(schema.users.email, DEFAULT_EMAIL))
    .returning({ id: schema.users.id, email: schema.users.email })

  if (result.length === 0) {
    console.log('No user found — creating default user with password...')
    await db.insert(schema.users).values({
      email: DEFAULT_EMAIL,
      passwordHash: hash,
      tier: 'vip',
    })
    console.log(`Created user: ${DEFAULT_EMAIL}`)
  } else {
    console.log(`Password set for: ${result[0].email}`)
  }

  await client.end()
}

main().catch(console.error)
