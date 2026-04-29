# Deployment Roadmap

## Overview

Deploy the IELTS 6.5 Accelerator as a hosted web app with AI features initially disabled (free-tier/internal Ollama only), focusing on getting the core app stable on the cloud first.

---

## Phase 1 — Hosted Database (Data Migration)

Goal: move local PostgreSQL data to a managed cloud database.

### Recommended: Neon (free tier, serverless Postgres, compatible with existing schema)

**Steps:**

1. Create a Neon project at neon.tech → get `DATABASE_URL`
2. Export local data:
   ```bash
   pg_dump $LOCAL_DATABASE_URL --no-owner --no-acl -F p -f local_dump.sql
   ```
3. Push schema to Neon:
   ```bash
   # from apps/web/
   DATABASE_URL=<neon-url> pnpm db:push
   ```
4. Import data:
   ```bash
   psql $NEON_DATABASE_URL < local_dump.sql
   ```
5. Re-run seeds to patch any missing/idempotent data:
   ```bash
   DATABASE_URL=<neon-url> pnpm db:seed:vocabulary
   DATABASE_URL=<neon-url> pnpm db:seed:domains
   DATABASE_URL=<neon-url> pnpm db:seed:speaking-topics
   DATABASE_URL=<neon-url> pnpm db:seed:projects
   ```

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

### Option C — OpenRouter (Free-tier models)
Route requests through openrouter.ai for access to free models (Llama, Mistral, etc.).
- Compatible with Vercel AI SDK's OpenAI-compatible interface
- Some free models have rate limits and quality trade-offs

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
