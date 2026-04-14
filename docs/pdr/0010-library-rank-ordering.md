# PDR-0010: Library Content Rank Ordering

- **Status**: Accepted
- **Date**: 2026-04-15
- **Phase**: 3

## Context

All three content library tables (`reading_passages`, `listening_scripts`, `writing_topics`) initially had no ordering mechanism beyond `createdAt`. As libraries grow, some content will be higher quality, more IELTS-representative, or more appropriate for a given learner level than others. A simple creation-time ordering is insufficient for surfacing the best content.

---

## Decision — Integer Rank Column (1–5) on All Library Tables

**Options considered:**

**Option A — Order by `createdAt DESC` only**: newest content appears first. Simple but conflates "recently added" with "high quality". Auto-generated content is not always better than older content.

**Option B — Weighted random pick**: assign quality weights and use `RANDOM() * weight` for ordering. Flexible but complex to maintain and opaque to the user.

**Option C — Explicit integer rank (1–5)**: a simple editorial signal. Default is 1 for all auto-generated content. Administrators can promote high-quality entries to rank 2–5. Sort order is `rank DESC, createdAt DESC` — higher-ranked content surfaces first; within the same rank, newest first.

**Decision**: Use **Option C** — `rank integer NOT NULL DEFAULT 1 CHECK (rank BETWEEN 1 AND 5)`.

Applied to:
- `reading_passages.rank`
- `listening_scripts.rank`
- `writing_topics.rank`

The DB-level `CHECK` constraint enforces the 1–5 range, preventing invalid values at the storage layer.

---

## Sort Order Applied

| Query | Before | After |
|-------|--------|-------|
| `getTopicsByDomain` (writing library browser) | `createdAt ASC` | `rank DESC, createdAt DESC` |
| `getRandomPassageByDomain` (reading pick) | `RANDOM()` | `rank DESC, createdAt DESC, RANDOM()` |
| `getRandomScriptByDomain` (listening pick) | `RANDOM()` | `rank DESC, createdAt DESC, RANDOM()` |

For random-pick queries, `RANDOM()` is retained as a tiebreaker so entries within the same rank and timestamp bucket are still selected randomly rather than by insertion order.

---

## Consequences

- All auto-generated content starts at rank 1. There is currently no UI to update rank — it requires a direct DB update. An admin interface for rank management is deferred to Phase 4.
- The rank range of 1–5 matches common editorial rating conventions (star ratings) and leaves room for meaningful differentiation without over-engineering a scoring system.
- The `CHECK` constraint is enforced at the DB level, so any future admin UI or seed script that attempts an out-of-range value will receive a clear DB error rather than silently storing bad data.
- Reading and Listening random-pick behaviour is unchanged for end users when all entries share the same rank (the default). The ordering only has visible effect once some entries are promoted above rank 1.
