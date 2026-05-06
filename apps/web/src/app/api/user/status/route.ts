import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ status: 'unauthenticated' }, { status: 401 })

  const [user] = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)))
    .limit(1)

  if (!user) return NextResponse.json({ status: 'not_found' }, { status: 404 })

  return NextResponse.json({ status: user.status })
}
