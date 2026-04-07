import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// In development, hot-module-replacement re-executes this file on every reload.
// Without the singleton, each reload opens a new connection pool and the old one
// is never closed, exhausting the PostgreSQL connection limit quickly.
// The global object survives HMR, so we reuse the existing client across reloads.
const globalForDb = global as unknown as {
  client: ReturnType<typeof postgres> | undefined
}

const client = globalForDb.client ?? postgres(process.env.DATABASE_URL!)

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
}

export const db = drizzle(client, { schema })
