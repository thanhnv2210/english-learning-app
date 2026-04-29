# Deployment Roadmap

## Overview

Deploy the IELTS 6.5 Accelerator as a hosted web app with AI features initially disabled (free-tier/internal Ollama only), focusing on getting the core app stable on the cloud first.

---

## Phase 1 — Hosted Database (Data Migration)

Goal: move local PostgreSQL data to a managed cloud database.

### Recommended: Neon (free tier, serverless Postgres, compatible with existing schema)

**Neon connection string format:**
```
postgresql://<user>:<password>@ep-<endpoint-id>.<region>.aws.neon.tech/<dbname>?sslmode=require
```
Example:
```
postgresql://alice:abc123xyz@ep-cool-forest-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require
```
Find it in Neon dashboard → your project → **Connection Details** → copy the connection string.

**Prerequisite — Postgres client tools:**
```bash
pg_dump --version && psql --version
# if missing on macOS:
brew install libpq && brew link --force libpq
```

**Steps:**

1. Create a Neon project at neon.tech → copy the connection string
2. Export local data:
   ```bash
   # load DATABASE_URL from .env if not already exported
   export $(grep DATABASE_URL apps/web/.env | xargs)
   pg_dump $DATABASE_URL --no-owner --no-acl -F p -f local_dump.sql
   ```
3. Import directly to Neon — **do NOT run `pnpm db:push` first**:
   ```bash
   psql "<neon-url>" < local_dump.sql 2>&1 | tee tmp/db_migration.log
   ```
   The dump file exports schema → data → constraints in the correct order. Running `db:push` beforehand creates FK constraints before data is loaded, causing FK violation errors on every table that references `users` or other parent tables.
4. Check the log — you should see only `COPY N`, `CREATE TABLE`, `ALTER TABLE`, `setval`. No errors.
5. Verify — temporarily point local app at Neon and run:
   ```bash
   # in apps/web/.env, swap DATABASE_URL to <neon-url>, then:
   pnpm dev
   ```
   Check vocabulary browser, project board, and wrong decisions history all load with your data.

**If you already ran `db:push` before importing (causes FK errors):**

Reset the Neon schema first, then re-import:
```sql
-- run in Neon SQL editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Then repeat from step 3.

> **Note:** Seeds are not needed if the local DB was fully seeded before dumping — all data is already in the dump. Only run seeds manually if you know something is missing.

**Alternatives:**
| Provider | Free Tier | Notes |
|----------|-----------|-------|
| Neon | 0.5 GB storage, 100 hrs compute/mo | Best DX, serverless |
| Supabase | 500 MB, 2 projects | Includes auth if needed later |
| Railway | $5/mo credit | Simple but limited free |

---

## Phase 2 — App Deployment

### Recommended: Vercel (Next.js 15 App Router, pnpm monorepo — native support)

**Steps:**

1. Push repo to GitHub
2. Import project in Vercel → set **Root Directory** to `apps/web`
3. Set environment variables:
   ```
   DATABASE_URL=<neon-url>
   NEXT_PUBLIC_OLLAMA_ENABLED=false
   ```
4. Deploy → Vercel auto-detects Next.js, runs `pnpm build`

**Key config to verify:**
- `apps/web/package.json` has correct `build` script (`next build`)
- No hardcoded `localhost` references in non-AI code paths
- All server actions use `DATABASE_URL` from env (not hardcoded)

**Alternatives:**
| Provider | Notes |
|----------|-------|
| Vercel | Best fit for Next.js, free hobby tier |
| Railway | Full-stack (app + DB on same platform), simpler networking |
| Fly.io | More control, requires Dockerfile |

---

## Phase 3 — AI Features (Deferred)

Current state: `NEXT_PUBLIC_OLLAMA_ENABLED=false` disables all AI routes and shows an amber banner. No action needed at deployment.

### Option A — Keep Ollama Internal
Run Ollama on a home server or VPS and expose via a private URL.
- Set `OLLAMA_BASE_URL` to the internal/VPN endpoint
- Set `OLLAMA_MODEL` to the desired model (default: `qwen2.5-coder:7b`)
- Keep `NEXT_PUBLIC_OLLAMA_ENABLED=true`

### Option B — Migrate to Claude API (Recommended for production)
Replace the Ollama client with Anthropic's API for reliability and quality.
- Swap `lib/ai-client.ts` to use `@anthropic-ai/sdk` or Vercel AI SDK's Anthropic provider
- Free tier: none (pay-per-token), but cost is low for personal use
- Model suggestion: `claude-haiku-4-5-20251001` for speed/cost; `claude-sonnet-4-6` for scoring quality

### Option C — OpenRouter (Current: free-tier models)
Route requests through openrouter.ai for access to free models (Llama, Mistral, etc.).

**Setup:**
1. Sign up at openrouter.ai → create an API key
2. Add to Vercel environment variables:
   ```
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
   NEXT_PUBLIC_OLLAMA_ENABLED=true
   ```
3. When `OPENROUTER_API_KEY` is set, the app automatically uses OpenRouter instead of Ollama. No code changes needed.

**Recommended free models:**
| Model | Notes |
|-------|-------|
| `meta-llama/llama-3.3-70b-instruct:free` | Good general quality, default |
| `google/gemma-3-12b-it:free` | Stronger reasoning |
| `mistralai/mistral-7b-instruct:free` | Fast, lightweight |

Free models have rate limits (typically 20 req/min). Upgrade to a paid model if you hit limits.

---

## Checklist

### Before Deploy
- [ ] Remove any `console.log` with sensitive data
- [ ] Confirm `DATABASE_URL` is never exposed to the client (no `NEXT_PUBLIC_DATABASE_URL`)
- [ ] Verify `NEXT_PUBLIC_OLLAMA_ENABLED=false` suppresses AI routes gracefully
- [ ] Test `pnpm build` locally with production env vars

### After Deploy
- [ ] Smoke test: login, dashboard, vocabulary browser, project board
- [ ] Confirm amber "AI disabled" banner shows on AI-dependent pages
- [ ] Check DB connection (create a ticket, add a sentence)
- [ ] Validate seed data migrated (vocabulary words, speaking topics, projects)

---

## Data Migration Notes

- `users` table: single-user app currently — migrate as-is, note the `id` used in all foreign keys
- `favouritePages` jsonb: export preserves structure, no transformation needed
- `essay_builder_configs` composite PK (`userId + domain + skill`): safe to migrate directly
- `reading_passages`, `listening_scripts`: AI-generated content — can re-seed or migrate; migrating is faster
- `wrong_decision_logs`, `sentence_practice_results`: personal data — must migrate to preserve history

---

## Open Questions

- [ ] Authentication: currently single-user (`getDefaultUser()`). Multi-user needs auth (NextAuth or Supabase Auth) before public deployment.
- [ ] AI strategy: Ollama internal vs Claude API vs disabled — decide before enabling AI features.
- [ ] Domain: custom domain or Vercel subdomain (`*.vercel.app`)?
