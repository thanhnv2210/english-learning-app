import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { seedDefaultDomains } from '@/lib/db/domains'

declare module 'next-auth' {
  interface Session {
    user: { id: string; tier: string } & DefaultSession['user']
  }
}


const THREE_DAYS = 60 * 60 * 24 * 3

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
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

        return { id: String(user.id), email: user.email, name: user.name, tier: user.tier }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: THREE_DAYS,
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Auto-provision Google users in our users table
      if (account?.provider === 'google' && profile?.email) {
        const [existing] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, profile.email))
          .limit(1)
        if (!existing) {
          const [created] = await db
            .insert(users)
            .values({
              email: profile.email,
              name: (profile as { name?: string }).name ?? null,
              image: (profile as { picture?: string }).picture ?? null,
              targetProfile: 'IELTS_Academic_6.5',
            })
            .returning()
          await seedDefaultDomains(created.id)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'credentials') {
          // Credentials: user.id is already the DB row id
          token.id = user.id
          token.tier = (user as { tier?: string }).tier ?? 'free'
        } else if (user.email) {
          // Google (and other OAuth): look up DB id by email
          const [dbUser] = await db
            .select({ id: users.id, tier: users.tier })
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1)
          if (dbUser) {
            token.id = String(dbUser.id)
            token.tier = dbUser.tier
          }
        }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.tier = (token.tier ?? 'free') as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
