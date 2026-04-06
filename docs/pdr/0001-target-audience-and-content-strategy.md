# PDR-0001: Target Audience and Content Strategy

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

Most IELTS preparation apps are designed for general learners. They use everyday topics — hometown, hobbies, travel — which are low-stakes for a senior software engineer who finds those domains boring and hard to connect with. Low engagement leads to inconsistent practice.

The user is a senior software engineer who already communicates in English daily (code reviews, Slack, technical specs) but has not practised formal academic English. The goal is a specific certification outcome: **IELTS Band 6.5**, which requires reaching "Competent User" level across all four skills.

## Decision

Design all content — essay prompts, cue cards, speaking topics, vocabulary sets — around software engineering domains:

| Domain | Example use |
|--------|------------|
| AI & Automation | Writing Task 2 essay prompts, Part 2 cue cards |
| Remote Work | Discussion topics for Part 1 & 3 |
| Cybersecurity | Writing Task 2 essay prompts |
| System Design | Part 2 cue card ("Describe a complex technical problem you solved") |
| Open Source | Part 3 discussion questions |
| Climate Tech | Writing Task 2 essay prompts |

This "Technical IELTS" niche makes every practice session dual-purpose: the user reinforces IELTS English while also exercising domain knowledge they genuinely care about.

The target audience is a **single, well-defined persona**:
- Native spoken language: Vietnamese (or other East/Southeast Asian language)
- Occupation: Senior software engineer
- English use: Daily technical English (reading docs, writing tickets), not formal academic English
- IELTS goal: Band 6.5 (threshold for many visa and university applications)

## Consequences

- All AI-generated prompts (topics, cue cards, essay questions) must reference software or tech-society themes. Generic everyday topics (pets, holidays) are out of scope unless used as examples inside a tech-framed prompt.
- Writing domain list is curated and hardcoded in Phase 1 (`WRITING_DOMAINS` in `src/lib/ielts/writing/prompts.ts`). A domain management UI is deferred to Phase 3.
- Vocabulary suggestions prioritise AWL (Academic Word List) replacements for common tech-slang, not general everyday language.
- If the product is later opened to a wider audience, a topic-profile layer is needed — but that must not be retrofitted at the expense of engineer-specific depth.
