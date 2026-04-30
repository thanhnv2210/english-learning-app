import { db } from '@/lib/db'
import { speakingPhrases } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

type SeedPhrase = {
  phrase: string
  category: string
  note: string | null
}

const SEED_PHRASES: SeedPhrase[] = [
  // ── Opinion ──────────────────────────────────────────────────────────────
  {
    phrase: "From my perspective, this is one of the most significant issues we face today.",
    category: "Opinion",
    note: "Strong opener for Part 3 opinions",
  },
  {
    phrase: "As far as I'm concerned, the benefits clearly outweigh the drawbacks.",
    category: "Opinion",
    note: "Use when giving a balanced but decisive view",
  },
  {
    phrase: "Personally, I believe that technology has fundamentally changed the way we communicate.",
    category: "Opinion",
    note: "Good for Part 1 or Part 3 tech/society topics",
  },
  {
    phrase: "I strongly feel that education should be about developing critical thinking, not just memorising facts.",
    category: "Opinion",
    note: "Education topic — shows range with 'not just … but'",
  },

  // ── Agreeing ─────────────────────────────────────────────────────────────
  {
    phrase: "That's a fair point, and I'd add that the economic side of things is equally important.",
    category: "Agreeing",
    note: "Agree then extend — good for Part 3 follow-ups",
  },
  {
    phrase: "I couldn't agree more — especially when you consider how rapidly things have changed.",
    category: "Agreeing",
    note: "Emphatic agreement with elaboration",
  },
  {
    phrase: "Absolutely, and what makes it even more compelling is the long-term impact on society.",
    category: "Agreeing",
    note: "Use 'what makes it even more X' to upgrade a point",
  },

  // ── Disagreeing ──────────────────────────────────────────────────────────
  {
    phrase: "I see where you're coming from, but I'd argue that the evidence points in the other direction.",
    category: "Disagreeing",
    note: "Polite pushback — acknowledge then counter",
  },
  {
    phrase: "I'm not entirely convinced by that argument, because it overlooks the human element.",
    category: "Disagreeing",
    note: "Softer disagreement — good for Part 3",
  },
  {
    phrase: "That may be true in some cases, but I think we need to look at the bigger picture.",
    category: "Disagreeing",
    note: "Partial concession then redirect",
  },
  {
    phrase: "While I appreciate that viewpoint, my own experience suggests something quite different.",
    category: "Disagreeing",
    note: "Use personal experience to counter a general claim",
  },

  // ── Buying Time ──────────────────────────────────────────────────────────
  {
    phrase: "That's an interesting question — let me think about that for a moment.",
    category: "Buying Time",
    note: "Classic filler — natural and examiner-approved",
  },
  {
    phrase: "I've never really thought about it that way before, but I suppose the key factor is...",
    category: "Buying Time",
    note: "Shows genuine reflection; leads smoothly into your answer",
  },
  {
    phrase: "It's hard to say off the top of my head, but I'd probably start by considering...",
    category: "Buying Time",
    note: "Buys time while signalling structured thinking",
  },
  {
    phrase: "That's quite a complex issue, so let me try to break it down.",
    category: "Buying Time",
    note: "Use for multi-part Part 3 questions",
  },

  // ── Describing ───────────────────────────────────────────────────────────
  {
    phrase: "The best way I can describe it is a kind of controlled chaos — everything seems random but it works.",
    category: "Describing",
    note: "Vivid, memorable description for Part 2",
  },
  {
    phrase: "It's quite similar to what you'd find in most modern cities, only on a much smaller scale.",
    category: "Describing",
    note: "'Only on a much X scale' is a clean comparison phrase",
  },
  {
    phrase: "What struck me most was the sheer scale of it — I hadn't expected it to be quite so impressive.",
    category: "Describing",
    note: "Strong Part 2 detail phrase — shows surprise/reaction",
  },
  {
    phrase: "It has a sort of timeless quality to it — nothing about it feels dated or out of place.",
    category: "Describing",
    note: "Describing a place, artwork, or cultural item",
  },

  // ── Part 2 Opener ────────────────────────────────────────────────────────
  {
    phrase: "I'd like to talk about a time when I completely stepped out of my comfort zone.",
    category: "Part 2 Opener",
    note: "Versatile opener — works for many experience-based prompts",
  },
  {
    phrase: "The person I'm going to describe is my former manager, and what stands out most is her ability to stay calm under pressure.",
    category: "Part 2 Opener",
    note: "Person prompt — lead with the defining trait",
  },
  {
    phrase: "I want to talk about a place that had a surprisingly big impact on me — a small town I visited almost by accident.",
    category: "Part 2 Opener",
    note: "Place prompt — the 'by accident' hook creates interest",
  },
  {
    phrase: "The object I've chosen is something I use every single day, yet rarely stop to appreciate — my laptop.",
    category: "Part 2 Opener",
    note: "Object prompt — reflective angle scores well on LR",
  },

  // ── Speculation ──────────────────────────────────────────────────────────
  {
    phrase: "I suppose it depends on the situation, but generally speaking, I'd lean towards the view that...",
    category: "Speculation",
    note: "Hedges appropriately before giving a clear stance",
  },
  {
    phrase: "It's difficult to say for certain, but I'd imagine that most people would prioritise stability over adventure.",
    category: "Speculation",
    note: "Speculating about others' behaviour — useful in Part 3",
  },
  {
    phrase: "If I had to predict, I'd say we'll see a significant shift in how governments approach this over the next decade.",
    category: "Speculation",
    note: "Future speculation with confident tone",
  },
  {
    phrase: "There's a strong possibility that the trend will continue, though a lot will depend on economic conditions.",
    category: "Speculation",
    note: "Balanced speculation with a conditional clause",
  },

  // ── Example ──────────────────────────────────────────────────────────────
  {
    phrase: "To give you a concrete example, when I was working on a large-scale project, we faced exactly this kind of challenge.",
    category: "Example",
    note: "Grounds abstract points in personal experience",
  },
  {
    phrase: "Take remote working, for instance — it's completely transformed people's expectations around flexibility.",
    category: "Example",
    note: "Current, relatable example for work/technology topics",
  },
  {
    phrase: "A good case in point would be how social media has changed political campaigning beyond recognition.",
    category: "Example",
    note: "Strong academic-sounding phrase for Part 3 analysis",
  },
  {
    phrase: "This is something I can relate to directly — I remember a situation where I had to make exactly that kind of trade-off.",
    category: "Example",
    note: "Signals a personal anecdote is coming",
  },
]

async function seedSpeakingPhrases() {
  console.log('Seeding speaking phrases...')
  let inserted = 0
  let skipped = 0

  for (const data of SEED_PHRASES) {
    const existing = await db
      .select({ id: speakingPhrases.id })
      .from(speakingPhrases)
      .where(
        and(
          eq(speakingPhrases.phrase, data.phrase),
          eq(speakingPhrases.isSystem, true),
        )
      )
      .limit(1)

    if (existing.length > 0) {
      skipped++
      continue
    }

    await db.insert(speakingPhrases).values({
      userId: null,
      phrase: data.phrase,
      category: data.category,
      note: data.note,
      isSystem: true,
    })
    inserted++
  }

  console.log(`Done — inserted ${inserted}, skipped ${skipped} (already exist).`)
  process.exit(0)
}

seedSpeakingPhrases().catch((err) => {
  console.error(err)
  process.exit(1)
})
