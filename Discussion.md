# Project Discussion: IELTS 6.5 Accelerator (Dev Edition)

## 1. Primary Objective: IELTS 6.5
The immediate goal is to help the user achieve an overall Band 6.5. This requires ~27-29 correct answers in Reading/Listening and a "Competent User" status in Speaking/Writing (addressing all tasks with some complex structures).

## 2. Niche: Technical IELTS
We will use technical topics (System Design, AI ethics, Remote Work) as the training ground. This makes preparation high-utility for a Senior Engineer's career while meeting IELTS criteria.

## 3. Decision Points for IELTS Focus
- **Marking Logic**: The AI must grade responses against the four IELTS criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.
- **"Target 6.5" Guardrails**: At this level, the AI should encourage "controlled complexity"—using complex sentences even if minor errors occur, rather than playing it too safe with simple English.
- **Future Flexibility**: The `TargetProfile` schema should be designed to switch between `IELTS_6.5`, `IELTS_7.5`, or `Business_Fluent` later.

## 4. Feature Priorities
- **Speaking Mock**: Voice-based Part 2 "Cue Cards" but themed around technical projects.
- **Writing Task 2**: Essay drafting on tech-society topics with band-specific feedback.
- **Vocabulary**: Focus on "Academic Word List" (AWL) instead of just "Tech Slang".
