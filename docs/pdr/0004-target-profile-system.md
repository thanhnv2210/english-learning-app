# PDR-0004: Target Profile System Design

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

The initial goal is IELTS Band 6.5. However, the same user may later want to aim for Band 7.5 after passing 6.5, or switch to a "Business Fluent" profile that deprioritises IELTS formality and focuses on professional communication.

Three options were considered for storing the target:

**Option A — Hardcode `6.5` everywhere**: Simple but creates scattered magic numbers that are hard to update later.

**Option B — `user_config.json` on disk**: File-based config, easy to read/write, but not queryable and not multi-user.

**Option C — `users.targetProfile` in the database**: Stored per-user in PostgreSQL, supports future UI to change it, and flows cleanly through server components.

## Decision

Use **Option C**. The `users` table holds a `targetProfile` text column (e.g., `'IELTS_6.5'`, `'IELTS_7.5'`, `'Business_Fluent'`).

For Phase 1, authentication is skipped. A single default user is upserted on first page load via `getDefaultUser()` in `src/lib/db/user.ts`. The profile is hardcoded to `'IELTS_6.5'` at insert time.

`parseTargetBand(profile: string): number` converts the profile string to the numeric band used in feedback prompts:

```ts
'IELTS_6.5'  → 6.5
'IELTS_7.5'  → 7.5
```

`targetBand` flows from the server component (`speaking/page.tsx`, `speaking/part2/page.tsx`, `writing/page.tsx`) down to client components as a prop, and is injected into every feedback API call (`/api/feedback`, `/api/writing/evaluate`).

## Consequences

- Changing the target band in the future requires only a DB update to the user row — no code changes.
- `getDefaultUser()` uses upsert (`onConflictDoNothing`-equivalent) so it is safe to call on every page load in Phase 1.
- When auth is introduced (Phase 3+), `getDefaultUser()` is replaced with `getSessionUser()` — the prop-passing pattern in server components does not need to change.
- The `'Business_Fluent'` profile will require a separate prompt template that de-emphasises IELTS band descriptors. That template does not exist yet; `parseTargetBand` returns `6.5` as a fallback for any profile it cannot parse.
- Do not embed `targetBand` in client component state initialisation — always derive it from the server-passed prop so that it stays consistent with the DB value.
