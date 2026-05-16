# PDR-0001: Target Audience and Content Strategy

- **Status**: Revised
- **Date**: 2026-04-06
- **Revised**: 2026-05-16

## Context

Most IELTS preparation apps are designed for general learners. They use everyday topics — hometown, hobbies, travel — which are irrelevant to professionals who spend their days thinking in a specific domain. Low engagement from mismatched content leads to inconsistent practice.

The core insight: **people learn faster when the examples and topics map to knowledge they already own**. A software engineer understands microservices. A nurse understands patient care. A business analyst understands financial modelling. Forcing any of them to prepare IELTS through generic travel or food topics wastes the most powerful learning accelerant they have — existing expertise.

The original product was built for software engineers (the author's own domain) and they remain the best-understood and most prominent example use case. But the underlying approach — domain-adaptive content that meets the user where their knowledge already lives — applies to any professional preparing for IELTS under time pressure.

## Decision

Design content to be **domain-adaptive**: the platform generates essay prompts, cue cards, speaking topics, and vocabulary examples that match the user's professional background and learning context.

Software engineering is the primary initial domain set and the reference implementation:

| Domain | Example use |
|--------|------------|
| AI & Automation | Writing Task 2 essay prompts, Part 2 cue cards |
| Remote Work | Discussion topics for Part 1 & 3 |
| Cybersecurity | Writing Task 2 essay prompts |
| System Design | Part 2 cue card ("Describe a complex technical problem you solved") |
| Open Source | Part 3 discussion questions |
| Climate Tech | Writing Task 2 essay prompts |

Other supported domain clusters include: business & finance, healthcare, education, and public policy. The domain is a parameter passed into the AI content generation pipeline, not hardcoded per feature.

The target audience is anyone who:
- Has an existing professional domain with real vocabulary and conceptual depth
- Has a specific IELTS band target and a defined timeline (visa, job, study abroad)
- Prefers self-directed, feedback-driven practice over structured courses with fixed schedules
- Is time-poor and needs every practice session to be directly applicable

Software engineers are the **primary beachhead segment** — concentrated in communities, high willingness to pay, and the domain the product knows most deeply. They are not the only audience.

## Consequences

- AI-generated content uses a `domain` parameter that the user selects (or the platform infers from their onboarding profile). Generic holiday/food topics remain out of scope unless embedded within a domain-relevant frame.
- Writing domain list (`WRITING_DOMAINS`) remains curated; new domain clusters are added as real users from those backgrounds are onboarded and validated.
- Vocabulary suggestions prioritise AWL (Academic Word List) replacements that are contextually relevant to the user's domain — not generic everyday language, and not exclusively tech slang.
- Marketing, community seeding, and initial B2B targets remain focused on the software engineering segment for Phase 1. Expansion to adjacent segments (healthcare, finance) begins in Phase 2 once product-market fit is confirmed with engineers.
- The onboarding flow already collects the user's background and goals — this data should drive domain defaults, not require manual selection on every session.
