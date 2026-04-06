# ADR-0002: Monorepo — Single Repository for Frontend and Backend

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

The project needs both a user-facing frontend and backend API logic (IELTS evaluation engine, feedback generation, timer service). Keeping them in separate repositories would introduce coordination overhead (versioning shared types, syncing deploys) that is not justified for a single-developer project at this stage.

Next.js 15 with the App Router natively supports API routes (`app/api/`), making it possible to co-locate frontend and backend code in one Next.js application without running a second service. This is the Backend-for-Frontend (BFF) pattern.

## Decision

Use a **single repository** with an `apps/web` workspace containing the Next.js 15 app. The App Router's `app/api/` directory serves as the backend layer. Core domain logic is isolated in `src/lib/` so it is not coupled to the HTTP layer and can be extracted later if needed.

A `packages/shared` workspace is included from the start to hold TypeScript types and Zod schemas that would need to be shared if a standalone backend service is ever introduced.

```
english-learning-app/
├── apps/
│   └── web/                        # Next.js 15 — UI + API routes
│       ├── public/
│       └── src/
│           ├── app/                # App Router (pages + API)
│           │   ├── (auth)/         # Route group: sign-in / sign-up
│           │   ├── (dashboard)/    # Route group: main learning UI
│           │   │   ├── writing/
│           │   │   ├── speaking/
│           │   │   └── vocabulary/
│           │   └── api/            # Backend API endpoints
│           │       ├── evaluate/   # POST /api/evaluate — writing scorer
│           │       ├── speaking/   # POST /api/speaking — speaking session
│           │       └── writing/    # POST /api/writing — multi-pass auditor
│           ├── components/         # Reusable React components
│           ├── lib/                # Domain logic (framework-agnostic)
│           │   ├── ai/             # AI SDK config, model client, prompt templates
│           │   ├── db/             # PostgreSQL client and query helpers
│           │   └── ielts/          # Core IELTS domain
│           │       ├── examiner/   # IELTS_Examiner prompt & protocol
│           │       ├── feedback/   # FeedbackGenerator, gap analysis
│           │       ├── timer/      # TimerService, part transitions
│           │       └── vocabulary/ # AWL matcher, Vocabulary Replacer
│           └── types/              # App-local TypeScript types
├── packages/
│   └── shared/                     # Cross-workspace types & Zod schemas
│       └── src/
│           └── types/              # TargetProfile, FeedbackSchema, etc.
├── docs/
│   └── adr/
├── docker/
│   └── docker-compose.yml          # PostgreSQL service definition
└── package.json                    # pnpm workspace root
```

### Workspace tooling

Use **pnpm workspaces** as the package manager. pnpm's content-addressable store avoids duplicate `node_modules` installs across workspaces, which reduces disk usage and install time on the M1.

```json
// package.json (root)
{
  "name": "english-learning-app",
  "private": true,
  "packageManager": "pnpm@latest",
  "workspaces": ["apps/*", "packages/*"]
}
```

## Consequences

- All development (`next dev --turbo`) runs from `apps/web/`. There is no second process to start for the backend.
- `src/lib/ielts/` contains pure domain logic with no Next.js imports — keeping it portable and independently testable.
- API route handlers in `app/api/` are thin: validate input → call `lib/ielts/` → return response. Business logic must not live inside route files.
- `packages/shared` is the only place to define types used by more than one workspace. Do not duplicate type definitions.
- If a standalone backend service is introduced later, the migration path is: extract `src/lib/` into a new `apps/api` workspace and point the Next.js API routes at it.
