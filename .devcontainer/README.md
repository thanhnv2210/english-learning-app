# GitHub Codespaces Setup

This project runs fully in GitHub Codespaces. PostgreSQL starts automatically via Docker-in-Docker.

AI features (Ollama) are **disabled by default** in Codespaces because Ollama cannot run inside the container. To enable them, point the app at an Ollama instance running on your local machine via ngrok.

## Enabling AI features via ngrok

### 1. On your local machine

Install the required model and start Ollama with all origins allowed:

```bash
ollama pull qwen2.5-coder:7b
OLLAMA_ORIGINS='*' OLLAMA_HOST=0.0.0.0 ollama serve
```

> `OLLAMA_ORIGINS='*'` — allows requests from the ngrok domain (Ollama blocks non-localhost origins by default).
> `OLLAMA_HOST=0.0.0.0` — binds Ollama to all interfaces so ngrok can forward traffic to it.

Expose Ollama via ngrok:

```bash
ngrok http 11434
```

Copy the HTTPS forwarding URL shown by ngrok (e.g. `https://abc123.ngrok-free.app`).

### 2. In your Codespace

Create or edit `apps/web/.env.local`:

```env
OLLAMA_BASE_URL=https://abc123.ngrok-free.app/api
NEXT_PUBLIC_OLLAMA_ENABLED=true
```

Restart the dev server:

```bash
cd apps/web && pnpm dev:clean
```

The amber "AI features are disabled" banner will disappear once `NEXT_PUBLIC_OLLAMA_ENABLED=true` is set and the server restarts.

## Notes

- The ngrok URL changes every session (free plan). Update `.env.local` each time.
- `NEXT_PUBLIC_OLLAMA_ENABLED` is read at build time by Next.js — a server restart is required after changing it.
- `DATABASE_URL` is set automatically via `remoteEnv` in `devcontainer.json`; you only need to add the Ollama vars.
