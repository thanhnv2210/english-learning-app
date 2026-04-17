# Running on GitHub Codespaces — Step-by-Step Guide

This guide walks you through launching the IELTS Learning App in a GitHub Codespace from scratch. No local installs required (except ngrok if you want AI features).

---

## What happens automatically

When the Codespace starts, the devcontainer runs these steps for you:

| Step | What runs | When |
|------|-----------|------|
| Install pnpm + dependencies | `sudo corepack enable && pnpm install` | On container create |
| Create `.env.local` with DB connection | `printf ... > apps/web/.env.local` | On container create |
| Start PostgreSQL (Docker-in-Docker) | `docker compose up -d` | On container start |
| Push DB schema | `cd apps/web && pnpm db:push` | On container start |
| Set AI flag | `NEXT_PUBLIC_OLLAMA_ENABLED=false` | Environment variable |

You only need to follow the steps below.

---

## Step 1 — Open the Codespace

1. Go to the repository on GitHub
2. Click **Code → Codespaces → Create codespace on master**
3. Wait for the container to build and all automatic steps to complete (~3–5 minutes)

> Watch the terminal — it will run `docker compose up -d` and `pnpm db:push` automatically. Wait for both to finish before continuing.

---

## Step 2 — Verify the setup

Open a terminal and run:

```bash
pnpm --version          # should print e.g. 10.x.x
cat apps/web/.env.local # should show DATABASE_URL and NEXT_PUBLIC_OLLAMA_ENABLED
docker ps               # should show a running postgres:16-alpine container
```

If `pnpm` is not found (older Codespace created before this fix):

```bash
sudo corepack enable && corepack prepare pnpm@latest --activate
```

If `.env.local` is missing (older Codespace):

```bash
printf 'DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ielts_dev\nNEXT_PUBLIC_OLLAMA_ENABLED=false\n' > apps/web/.env.local
```

If PostgreSQL is not running:

```bash
docker compose -f docker/docker-compose.yml up -d
sleep 3 && cd apps/web && pnpm db:push
```

---

## Step 3 — Seed the database

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
  "SELECT 'writing_domains' AS tbl, count(*)::text FROM writing_domains
   UNION ALL SELECT 'vocabulary_words', count(*)::text FROM vocabulary_words
   UNION ALL SELECT 'speaking_topics', count(*)::text FROM speaking_topics;"
```

Expected output:
```
      tbl        | count
-----------------+-------
 writing_domains |    50
vocabulary_words |   ...
 speaking_topics |    10
```

---

## Step 4 — Start the app

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

## Step 5 (optional) — Enable AI features via ngrok

AI features (Speaking, Writing, Reading, Listening generation) require Ollama. Since Ollama cannot run inside a Codespace, connect it from your local machine via ngrok.

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
printf 'DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ielts_dev\nOLLAMA_BASE_URL=https://abc123.ngrok-free.app/api\nOLLAMA_MODEL=qwen2.5-coder:7b\nNEXT_PUBLIC_OLLAMA_ENABLED=true\n' > apps/web/.env.local
```

Restart the dev server to pick up the new env vars:

```bash
# Ctrl+C to stop pnpm dev, then:
cd apps/web && pnpm dev:clean
```

The amber banner disappears and all AI features become available.

> **Note:** The ngrok URL changes every time you restart ngrok (free plan). Update `OLLAMA_BASE_URL` in `.env.local` and restart the dev server each session.

---

## Troubleshooting

### Container creation failed — Docker-in-Docker / moby error

```
Feature "Docker (Docker-in-Docker)" failed to install!
The 'moby' option is not supported on Debian 'trixie'
```

Fixed in the current `devcontainer.json` (`"moby": false`). Delete the Codespace and create a new one.

---

### `db:push` fails — "connection url required"

```
Error  Either connection "url" or "host", "database" are required
```

`.env.local` was missing when `postStartCommand` ran. Create it now and re-push:

```bash
printf 'DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ielts_dev\nNEXT_PUBLIC_OLLAMA_ENABLED=false\n' > apps/web/.env.local
cd apps/web && pnpm db:push
```

---

### "Internal Server Error" on first page load

```bash
cd apps/web && pnpm dev:clean
```

---

### Port 3000 not forwarded

Go to the **Ports** tab in VS Code (bottom panel), find port 3000, right-click → **Open in Browser**.

---

### AI routes return 503

1. `NEXT_PUBLIC_OLLAMA_ENABLED=true` is in `.env.local`
2. `OLLAMA_BASE_URL` ends with `/api` and uses your current ngrok HTTPS URL
3. Ollama is running locally (`ollama serve`)
4. The model is installed (`ollama list` — should show `qwen2.5-coder:7b`)
5. Dev server was restarted after editing `.env.local`

Test the Ollama connection directly:

```bash
curl https://abc123.ngrok-free.app/api/tags   # replace with your ngrok URL
```

Should return a JSON list of installed models.

---

## Quick reference — ports

| Port | Service |
|------|---------|
| 3000 | Next.js app (auto-forwarded by Codespaces) |
| 5433 | PostgreSQL (Docker-in-Docker, host-side mapping) |
