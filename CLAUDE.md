# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IELTS 6.5 Accelerator for Software Engineers** — an AI-powered app that helps senior engineers achieve IELTS Band 6.5 using technical topics (System Design, AI ethics, Remote Work) as training content. The evaluation engine uses Claude as an IELTS examiner with strict grading against four official criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.

## Current State

The project is in the planning phase. No code or build system exists yet. See `Discussion.md` for technical design decisions and `RoadMap.md` for the sprint breakdown.

## Planned Architecture

### Core Modules

**IELTS Evaluation Engine** (`IELTS_Examiner` system prompt)
- Acts as a strict examiner (no helping the user, enforces transitions)
- Grades against four criteria; targets "controlled complexity" at Band 6.5 (encourages complex structures even with minor errors)
- `TargetProfile` schema must support switching between `IELTS_6.5`, `IELTS_7.5`, `Business_Fluent`

**Speaking Simulator**
- State machine: `PART_1` → `PART_2_PREP` → `PART_2_SPEAK` → `PART_3`
- Latency target: < 500ms for Parts 1 & 3
- STT via Whisper for hesitation filler detection (`um`, `ah`)
- Evaluation: Fluency (FC), Lexical Resource (LR), Grammatical Range (GRA), Pronunciation (P)

**Writing Evaluator** (multi-pass grading)
- Pass 1: Structural Audit — word count, paragraph count, task fulfillment
- Pass 2: Linguistic Analysis — flag simple vocabulary, suggest academic alternatives
- Pass 3: Scoring & Gap Analysis — assign per-criterion band scores
- Output: strict JSON schema, e.g. `{ "criterion": "Lexical Resource", "score": 6.5, "suggestions": [...] }`

**Vocabulary Builder**
- Academic Word List (AWL) focus, not tech slang
- Real-time suggestions during technical chat sessions

**Target Profile System**
- `user_config.json` stores current goal (hardcoded to `IELTS_6.5` initially)
- Refactored in Phase 3 to load different prompt templates per target

### Key Design Decisions (from Discussion.md)
- Use "Band 6.5 vs 7.0 gap analysis" framing in all feedback (not just scores)
- Writing feedback must include a "Drafting Mode" (outline critique before full essay)
- Vocabulary Replacer identifies dev-slang and suggests formal IELTS-appropriate equivalents
- `FeedbackGenerator` runs *after* a session, not during, to maintain examiner strictness

## Roadmap Summary

| Phase | Weeks | Focus |
|-------|-------|-------|
| 1 | 1–2 | IELTS Scorer MVP: Examiner engine, Writing Task 2, Target Profile |
| 2 | 3–5 | Speaking simulator, Whisper STT, Vocabulary Builder |
| 3 | 6–10 | Target Switcher, Reading/Listening, Progress Analytics |
| 4 | TBD | Peer Review, Official Mock Integration |

Phase 1 sprint tasks are detailed in `RoadMap.md` (Tasks 1.1–1.7).
