# ADR-0001: Local Development Environment and Tech Stack

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

Development happens on a MacBook M1 with 18GB unified memory. This memory is shared between the OS, browser, IDE, Docker, and any locally running LLM. Every stack choice must minimise RAM pressure to leave headroom for the LLM workload.

The app is an IELTS accelerator that streams AI feedback in real time, requiring a frontend capable of handling streaming responses with low latency and minimal boilerplate.

## Decision

### Frontend — Next.js 15 (App Router)

Use Next.js 15 with the App Router. Start the dev server with `--turbo` to use the Turbopack bundler.

```bash
next dev --turbo
```

Turbopack performs incremental compilation, which significantly reduces cold-start and hot-reload times compared to Webpack, and keeps per-rebuild memory spikes lower on constrained hardware.

### Styling — Tailwind CSS

Use Tailwind CSS for all styling. Avoid heavy component libraries (e.g. MUI, Chakra) that ship large JS bundles and pull in additional runtime dependencies. Tailwind is utility-first and has near-zero JS runtime overhead.

### State & AI Integration — Vercel AI SDK

Use the Vercel AI SDK (`ai` package) to handle all streaming interactions with the evaluation engine. It provides first-class support for streaming from OpenAI-compatible endpoints, which allows the backend to be pointed at a local Ollama instance or the Claude API without changing application code.

Key benefit: the SDK abstracts streaming chunking and state (loading, error, done) out of component code, removing the need for a heavy global state manager for AI interactions.

### Database — PostgreSQL via Docker

Use the existing local PostgreSQL instance running in Docker. No new database process is introduced. Keep the Docker Desktop resource cap configured explicitly (recommended: 4GB max for Docker on this machine) to prevent it from ballooning and competing with LLM RAM.

### Browser — Arc or Brave

Use Arc or Brave as the primary development browser. Both support "Memory Saver" / tab suspension modes that freeze inactive tabs. IELTS research tabs and documentation should be left in suspended state when actively running the LLM to avoid RAM contention.

## Consequences

- `next dev --turbo` is the canonical dev command; `next dev` (Webpack) should not be used during local development.
- Docker Desktop must have a memory limit set explicitly in its settings to avoid unbounded growth.
- The AI SDK's `useChat` / `useCompletion` hooks are the standard pattern for all streaming UI — do not introduce a separate streaming abstraction.
- When switching from Ollama to the Claude API (or vice versa), only the `baseURL` and model name in the SDK config need to change; no component code should require modification.
- Tailwind is the only permitted styling approach; no component library installs without a new ADR.
