import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const THREE_DAYS = 60 * 60 * 24 * 3 // seconds

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const normalizedEmail = (credentials.email as string).toLowerCase().trim()
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1)

        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return { id: String(user.id), email: user.email, tier: user.tier }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: THREE_DAYS,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tier = (user as { tier?: string }).tier ?? 'free'
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.tier = token.tier as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
