# Running on GitHub Codespaces — Step-by-Step Guide

This guide walks you through launching the IELTS Learning App in a GitHub Codespace from scratch. No local installs required (except ngrok if you want AI features).

---

## What happens automatically

When the Codespace starts, the devcontainer runs these steps for you:

| Step | What runs | When |
|------|-----------|------|
| Install pnpm + dependencies | `npm install -g pnpm && pnpm install` | On container create |
| Start PostgreSQL (Docker-in-Docker) | `docker compose up -d` | On container start |
| Push DB schema | `cd apps/web && pnpm db:push` | On container start |
| Set AI flag | `NEXT_PUBLIC_OLLAMA_ENABLED=false` | Environment variable |

You only need to follow the steps below.

---

## Step 1 — Open the Codespace

1. Go to the repository on GitHub
2. Click **Code → Codespaces → Create codespace on master**
3. Wait for the container to build and all automatic steps to complete (~2–3 minutes)

> You will see a terminal running `docker compose up -d` and `pnpm db:push` automatically. Wait for both to finish before continuing.

---

## Step 2 — Verify pnpm is available

Open a terminal and run:

```bash
pnpm --version
```

If you see a version number, skip ahead to Step 3 — Create the environment file.

If you get `bash: pnpm: command not found`, run:

```bash
corepack enable && corepack prepare pnpm@latest --activate
```

Then verify again:

```bash
pnpm --version   # should print e.g. 10.x.x
```

> **Why this happens:** `corepack` is built into Node.js 22 and is the recommended way to install pnpm. If the Codespace was created before this fix was applied, run the two commands above once manually. New Codespaces run this automatically via `postCreateCommand`.

---

## Step 3 — Create the environment file


Open a terminal in the Codespace and run:

```bash
cat > apps/web/.env.local << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ielts_dev
NEXT_PUBLIC_OLLAMA_ENABLED=false
EOF
```

> **Why port 5433?** The Docker-in-Docker PostgreSQL container maps its internal port 5432 to host port 5433. The app connects via the host port.

---

## Step 4 — Seed the database

Run the seed scripts to populate required data:

```bash
cd apps/web

pnpm db:seed:domains          # writing domains (50 rows)
pnpm db:seed:vocabulary       # vocabulary words
pnpm db:seed:speaking-topics  # speaking topics (10 rows)
```

Verify the data was inserted:

```bash
docker exec $(docker ps -q --filter ancestor=postgres:16-alpine) \
  psql -U postgres -d ielts_dev -c \
  "SELECT 'writing_domains' AS table, count(*)::text FROM writing_domains
   UNION ALL SELECT 'vocabulary_words', count(*)::text FROM vocabulary_words
   UNION ALL SELECT 'speaking_topics', count(*)::text FROM speaking_topics;"
```

Expected output:
```
     table       | count
-----------------+-------
 writing_domains |    50
vocabulary_words |   ...
 speaking_topics |    10
```

---

## Step 5 — Start the app

```bash
cd apps/web
pnpm dev
```

GitHub Codespaces will detect port 3000 and show a prompt to **Open in Browser**. Click it, or go to the **Ports** tab and click the globe icon next to port 3000.

The app opens with an amber banner at the top:
> ⚠️ **AI features are disabled.** — this is expected for now.

Static pages work fully without AI:
- `/how-to-answer` — exam guides for all 4 skills
- `/topic-ideas` — topic frameworks for Speaking, Writing, Reading, Listening
- `/vocabulary` — AWL browser (read-only, no generation)

---

## Step 6 (optional) — Enable AI features via ngrok

AI features (Speaking, Writing, Reading, Listening generation) require Ollama. Since Ollama cannot run inside a Codespace, you connect it from your local machine via ngrok.

### On your local machine

```bash
# 1. Make sure Ollama is running with the required model
ollama serve
ollama pull qwen2.5-coder:7b

# 2. Expose port 11434 via ngrok
ngrok http 11434
```

Copy the HTTPS forwarding URL from ngrok output, e.g.:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:11434
```

### In your Codespace terminal

```bash
# Replace the URL with your actual ngrok URL
cat > apps/web/.env.local << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ielts_dev
OLLAMA_BASE_URL=https://abc123.ngrok-free.app/api
OLLAMA_MODEL=qwen2.5-coder:7b
NEXT_PUBLIC_OLLAMA_ENABLED=true
EOF
```

Stop and restart the dev server to pick up the new env vars:

```bash
# Ctrl+C to stop pnpm dev, then:
cd apps/web && pnpm dev:clean
```

The amber banner disappears and all AI features become available.

> **Note:** The ngrok URL changes every time you restart ngrok (free plan). Update `OLLAMA_BASE_URL` in `.env.local` and restart the dev server each session.

---

## Troubleshooting

### "Cannot connect to database"

The PostgreSQL container may not have started yet. Check:

```bash
docker ps   # should show a postgres:16-alpine container
```

If it's not running:

```bash
docker compose -f docker/docker-compose.yml up -d
sleep 3
cd apps/web && pnpm db:push
```

### "Internal Server Error" on first page load

The `.next` cache is stale. Clear it:

```bash
cd apps/web && pnpm dev:clean
```

### Port 3000 not forwarded

Go to the **Ports** tab in VS Code (bottom panel), find port 3000, right-click → **Open in Browser**.

### AI routes return 503

Check that:
1. `NEXT_PUBLIC_OLLAMA_ENABLED=true` is in `.env.local`
2. `OLLAMA_BASE_URL` points to your current ngrok HTTPS URL (with `/api` suffix)
3. Ollama is running locally (`ollama serve`)
4. The model is installed (`ollama list` — should show `qwen2.5-coder:7b`)
5. You restarted the dev server after editing `.env.local`

Test the Ollama connection directly from the Codespace:

```bash
curl https://abc123.ngrok-free.app/api/tags   # replace with your ngrok URL
```

Should return a JSON list of installed models.

---

## Quick reference — ports in use

| Port | Service |
|------|---------|
| 3000 | Next.js app (auto-forwarded by Codespaces) |
| 5433 | PostgreSQL (Docker-in-Docker, host-side mapping) |
