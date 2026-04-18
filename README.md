# IELTS 6.5 Accelerator

AI-powered IELTS preparation for software engineers. Uses a local LLM (Ollama) as a strict examiner for Speaking and Writing practice, graded against official IELTS band descriptors.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 20 | Runtime |
| pnpm | 10.33.0 | Package manager |
| PostgreSQL | ≥ 14 | Database (local instance) |
| Ollama | latest | Local LLM inference |

Install pnpm if needed:
```bash
npm install -g pnpm@10.33.0
```

---

## 1. Configuration

### 1.1 Environment variables

Create `apps/web/.env.local` (never commit this file):

```env
# PostgreSQL — local instance (no password on dev machine)
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/ielts_dev

# Ollama
OLLAMA_BASE_URL=http://localhost:11434/api
OLLAMA_MODEL=qwen2.5-coder:7b

# Set to 'false' to disable AI features (e.g. in GitHub Codespaces without local Ollama)
NEXT_PUBLIC_OLLAMA_ENABLED=true

# Optional — Claude API (not used in Phase 1/2, kept for future phases)
ANTHROPIC_API_KEY=sk-ant-...
```

Replace `YOUR_USERNAME` with your macOS username (`whoami` to check).

### 1.2 Ollama model

Pull the model once:
```bash
ollama pull qwen2.5-coder:7b
```

To use a different model, update `OLLAMA_MODEL` in `.env.local`. The model must be available locally via `ollama list`.

### 1.3 Database

Create the database on your local PostgreSQL instance:
```bash
createdb ielts_dev
```

> **Port note:** The Docker PostgreSQL service (optional) maps to port **5433** to avoid conflicts with the local instance on 5432. The app always connects to the `DATABASE_URL` in `.env.local`, so pick one and set the URL accordingly.

---

## 2. Install dependencies

Run once from the repo root:
```bash
pnpm install
```

---

## 3. Database setup

Push the schema to your database (run from `apps/web/`):
```bash
cd apps/web
pnpm db:push
```

This uses `drizzle-kit push` to create all tables. Re-run after any schema change in `src/lib/db/schema.ts`.

To open Drizzle Studio (visual DB browser):
```bash
pnpm db:studio
```

---

## 4. Start the application

### Development (recommended)

```bash
# Terminal 1 — ensure Ollama is running
ollama serve

# Terminal 2 — start the Next.js app (from apps/web/)
cd apps/web
pnpm dev
```

App runs at **http://localhost:3000**

> `pnpm dev` uses `next dev --turbo` (Turbopack). Do **not** use `next dev` without `--turbo` — on M1 with 18 GB RAM, Webpack's memory usage competes with the LLM.

### Production build

```bash
cd apps/web
pnpm build
pnpm start
```

---

## 5. Stop the application

| Process | How to stop |
|---------|-------------|
| Next.js dev server | `Ctrl+C` in the terminal running `pnpm dev` |
| Ollama | `Ctrl+C` in the terminal running `ollama serve` (or leave running — it idles at ~0% CPU) |
| Docker PostgreSQL (if used) | `docker compose -f docker/docker-compose.yml down` |

---

## 6. Optional: Docker PostgreSQL

If you prefer Docker over a local PostgreSQL install:

```bash
# Start (maps to port 5433)
docker compose -f docker/docker-compose.yml up -d

# Stop (keeps data)
docker compose -f docker/docker-compose.yml stop

# Stop and remove data volume
docker compose -f docker/docker-compose.yml down -v
```

Update `.env.local` to use port 5433:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ielts_dev
```

---

## 7. Database commands (reference)

All run from `apps/web/`:

```bash
pnpm db:push      # sync schema to DB (dev — no migration files)
pnpm db:generate  # generate migration SQL files (for production)
pnpm db:studio    # open Drizzle Studio at http://localhost:4983
```

---

## 8. Project structure (quick reference)

```
apps/web/src/
├── app/
│   ├── (dashboard)/         # Speaking, Writing, History, Vocabulary pages
│   └── api/
│       ├── chat/            # Speaking examiner — streaming chat
│       ├── feedback/        # Post-session band scoring
│       └── writing/
│           ├── audit/       # Pass 1 — structural check
│           ├── vocabulary/  # Pass 2 — AWL vocabulary analysis
│           ├── score/       # Pass 3 — band scoring
│           ├── gap/         # On-demand gap analysis
│           └── outline/     # Drafting mode outline critique
├── components/              # Shared UI components
└── lib/
    ├── db/                  # Drizzle ORM client + schema
    └── ielts/
        ├── examiner/        # IELTS examiner prompts (Speaking)
        ├── timer/           # useTimer hook
        └── writing/         # Writing prompts (all passes)
```

Full architecture: [CLAUDE.md](./CLAUDE.md) · Design decisions: [docs/adr/](./docs/adr/) · Product decisions: [docs/pdr/](./docs/pdr/)

---

## 9. GitHub Codespaces

The project ships with a `.devcontainer/` configuration for GitHub Codespaces. PostgreSQL starts automatically via Docker-in-Docker; no local install is needed.

### What works out of the box

| Feature | Status |
|---------|--------|
| Next.js app on port 3000 | Auto-forwarded, opens in browser |
| PostgreSQL (Docker-in-Docker) | Starts automatically on port 5432 |
| Schema push (`pnpm db:push`) | Runs automatically on container start |
| Static pages (How to Answer, Topic Ideas) | Full functionality |
| AI features (Speaking, Writing, Reading, Listening) | Disabled by default |

### Enabling AI features via ngrok

Ollama cannot run inside a Codespace. To re-enable AI, point the app at an Ollama instance on your local machine:

**Step 1 — on your local machine:**

```bash
ollama pull qwen2.5-coder:7b
OLLAMA_ORIGINS='*' OLLAMA_HOST=0.0.0.0 ollama serve
ngrok http 11434          # in a separate terminal — copy the HTTPS forwarding URL
```

**Step 2 — in your Codespace terminal:**

```bash
# Create or edit apps/web/.env.local
echo "OLLAMA_BASE_URL=https://<your-ngrok-id>.ngrok-free.app/api" >> apps/web/.env.local
echo "NEXT_PUBLIC_OLLAMA_ENABLED=true" >> apps/web/.env.local

# Restart with a clean cache to pick up the new env vars
cd apps/web && pnpm dev:clean
```

The amber "AI features are disabled" banner disappears once `NEXT_PUBLIC_OLLAMA_ENABLED=true` is set and the server restarts.

> **Note:** The ngrok URL changes every session on the free plan. Update `OLLAMA_BASE_URL` in `.env.local` each time.

Full setup details: [`.devcontainer/README.md`](./.devcontainer/README.md)

---

## 10. Troubleshooting

**Ollama not responding**
```bash
ollama list          # check model is downloaded
ollama serve         # start if not running
```

**Database connection error**
```bash
psql ielts_dev       # verify DB exists and is accessible
pnpm db:push         # re-sync schema if tables are missing
```

**Port 5432 already in use (Docker)**
The Docker service maps to 5433 by default — no change needed. If you're running Docker and see this error, another container may be occupying 5432. Check with `lsof -i :5432`.

**`next dev` is slow / high memory**
Ensure you're running `pnpm dev` (uses `--turbo`), not `next dev` directly.
