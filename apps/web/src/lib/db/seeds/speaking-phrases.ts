import { db } from '@/lib/db'
import { speakingPhrases } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

type SeedPhrase = {
  phrase: string
  category: string
  skill: 'speaking' | 'writing'
  note: string | null
}

const SEED_PHRASES: SeedPhrase[] = [
  // ── Opinion ──────────────────────────────────────────────────────────────
  {
    phrase: "From my perspective, this is one of the most significant issues we face today.",
    category: "Opinion",
    skill: "speaking",
    note: "Strong opener for Part 3 opinions",
  },
  {
    phrase: "As far as I'm concerned, the benefits clearly outweigh the drawbacks.",
    category: "Opinion",
    skill: "speaking",
    note: "Use when giving a balanced but decisive view",
  },
  {
    phrase: "Personally, I believe that technology has fundamentally changed the way we communicate.",
    category: "Opinion",
    skill: "speaking",
    note: "Good for Part 1 or Part 3 tech/society topics",
  },
  {
    phrase: "I strongly feel that education should be about developing critical thinking, not just memorising facts.",
    category: "Opinion",
    skill: "speaking",
    note: "Education topic — shows range with 'not just … but'",
  },

  // ── Agreeing ─────────────────────────────────────────────────────────────
  {
    phrase: "That's a fair point, and I'd add that the economic side of things is equally important.",
    category: "Agreeing",
    skill: "speaking",
    note: "Agree then extend — good for Part 3 follow-ups",
  },
  {
    phrase: "I couldn't agree more — especially when you consider how rapidly things have changed.",
    category: "Agreeing",
    skill: "speaking",
    note: "Emphatic agreement with elaboration",
  },
  {
    phrase: "Absolutely, and what makes it even more compelling is the long-term impact on society.",
    category: "Agreeing",
    skill: "speaking",
    note: "Use 'what makes it even more X' to upgrade a point",
  },

  // ── Disagreeing ──────────────────────────────────────────────────────────
  {
    phrase: "I see where you're coming from, but I'd argue that the evidence points in the other direction.",
    category: "Disagreeing",
    skill: "speaking",
    note: "Polite pushback — acknowledge then counter",
  },
  {
    phrase: "I'm not entirely convinced by that argument, because it overlooks the human element.",
    category: "Disagreeing",
    skill: "speaking",
    note: "Softer disagreement — good for Part 3",
  },
  {
    phrase: "That may be true in some cases, but I think we need to look at the bigger picture.",
    category: "Disagreeing",
    skill: "speaking",
    note: "Partial concession then redirect",
  },
  {
    phrase: "While I appreciate that viewpoint, my own experience suggests something quite different.",
    category: "Disagreeing",
    skill: "speaking",
    note: "Use personal experience to counter a general claim",
  },

  // ── Buying Time ──────────────────────────────────────────────────────────
  {
    phrase: "That's an interesting question — let me think about that for a moment.",
    category: "Buying Time",
    skill: "speaking",
    note: "Classic filler — natural and examiner-approved",
  },
  {
    phrase: "I've never really thought about it that way before, but I suppose the key factor is...",
    category: "Buying Time",
    skill: "speaking",
    note: "Shows genuine reflection; leads smoothly into your answer",
  },
  {
    phrase: "It's hard to say off the top of my head, but I'd probably start by considering...",
    category: "Buying Time",
    skill: "speaking",
    note: "Buys time while signalling structured thinking",
  },
  {
    phrase: "That's quite a complex issue, so let me try to break it down.",
    category: "Buying Time",
    skill: "speaking",
    note: "Use for multi-part Part 3 questions",
  },

  // ── Describing ───────────────────────────────────────────────────────────
  {
    phrase: "The best way I can describe it is a kind of controlled chaos — everything seems random but it works.",
    category: "Describing",
    skill: "speaking",
    note: "Vivid, memorable description for Part 2",
  },
  {
    phrase: "It's quite similar to what you'd find in most modern cities, only on a much smaller scale.",
    category: "Describing",
    skill: "speaking",
    note: "'Only on a much X scale' is a clean comparison phrase",
  },
  {
    phrase: "What struck me most was the sheer scale of it — I hadn't expected it to be quite so impressive.",
    category: "Describing",
    skill: "speaking",
    note: "Strong Part 2 detail phrase — shows surprise/reaction",
  },
  {
    phrase: "It has a sort of timeless quality to it — nothing about it feels dated or out of place.",
    category: "Describing",
    skill: "speaking",
    note: "Describing a place, artwork, or cultural item",
  },

  // ── Part 2 Opener ────────────────────────────────────────────────────────
  {
    phrase: "I'd like to talk about a time when I completely stepped out of my comfort zone.",
    category: "Part 2 Opener",
    skill: "speaking",
    note: "Versatile opener — works for many experience-based prompts",
  },
  {
    phrase: "The person I'm going to describe is my former manager, and what stands out most is her ability to stay calm under pressure.",
    category: "Part 2 Opener",
    skill: "speaking",
    note: "Person prompt — lead with the defining trait",
  },
  {
    phrase: "I want to talk about a place that had a surprisingly big impact on me — a small town I visited almost by accident.",
    category: "Part 2 Opener",
    skill: "speaking",
    note: "Place prompt — the 'by accident' hook creates interest",
  },
  {
    phrase: "The object I've chosen is something I use every single day, yet rarely stop to appreciate �� my laptop.",
    category: "Part 2 Opener",
    skill: "speaking",
    note: "Object prompt — reflective angle scores well on LR",
  },

  // ── Speculation ──────────────────────────────────────────────────────────
  {
    phrase: "I suppose it depends on the situation, but generally speaking, I'd lean towards the view that...",
    category: "Speculation",
    skill: "speaking",
    note: "Hedges appropriately before giving a clear stance",
  },
  {
    phrase: "It's difficult to say for certain, but I'd imagine that most people would prioritise stability over adventure.",
    category: "Speculation",
    skill: "speaking",
    note: "Speculating about others' behaviour — useful in Part 3",
  },
  {
    phrase: "If I had to predict, I'd say we'll see a significant shift in how governments approach this over the next decade.",
    category: "Speculation",
    skill: "speaking",
    note: "Future speculation with confident tone",
  },
  {
    phrase: "There's a strong possibility that the trend will continue, though a lot will depend on economic conditions.",
    category: "Speculation",
    skill: "speaking",
    note: "Balanced speculation with a conditional clause",
  },

  // ── Example ──────────────────────────────────────────────────────────────
  {
    phrase: "To give you a concrete example, when I was working on a large-scale project, we faced exactly this kind of challenge.",
    category: "Example",
    skill: "speaking",
    note: "Grounds abstract points in personal experience",
  },
  {
    phrase: "Take remote working, for instance — it's completely transformed people's expectations around flexibility.",
    category: "Example",
    skill: "speaking",
    note: "Current, relatable example for work/technology topics",
  },
  {
    phrase: "A good case in point would be how social media has changed political campaigning beyond recognition.",
    category: "Example",
    skill: "speaking",
    note: "Strong academic-sounding phrase for Part 3 analysis",
  },
  {
    phrase: "This is something I can relate to directly — I remember a situation where I had to make exactly that kind of trade-off.",
    category: "Example",
    skill: "speaking",
    note: "Signals a personal anecdote is coming",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITING PHRASES
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Thesis Statement ─────────────────────────────────────────────────────
  {
    phrase: "This essay will argue that, on balance, the advantages of this development outweigh its disadvantages.",
    category: "Thesis Statement",
    skill: "writing",
    note: "Clear opinion thesis for Task 2 — sets up the whole essay",
  },
  {
    phrase: "While there are valid arguments on both sides, I firmly believe that the long-term benefits far outweigh the short-term costs.",
    category: "Thesis Statement",
    skill: "writing",
    note: "Two-sided discussion with a clear personal stance",
  },
  {
    phrase: "It is my contention that governments, not individuals, bear the primary responsibility for addressing this issue.",
    category: "Thesis Statement",
    skill: "writing",
    note: "'It is my contention that' — formal, high-band register",
  },
  {
    phrase: "Although this is a complex issue with no simple solution, the evidence suggests that a combination of education and policy reform is most effective.",
    category: "Thesis Statement",
    skill: "writing",
    note: "Problem-solution thesis — acknowledges complexity upfront",
  },

  // ── Concession ───────────────────────────────────────────────────────────
  {
    phrase: "While it is true that technology has brought undeniable benefits, it has also introduced a range of unforeseen challenges.",
    category: "Concession",
    skill: "writing",
    note: "'While it is true that X, it has also Y' — classic IELTS concession",
  },
  {
    phrase: "Admittedly, there are those who argue that economic growth should take priority over environmental concerns.",
    category: "Concession",
    skill: "writing",
    note: "'Admittedly' introduces the opposing view you will then counter",
  },
  {
    phrase: "Although this approach has merit, it fails to account for the social consequences of such a policy.",
    category: "Concession",
    skill: "writing",
    note: "Acknowledge strength, then pivot to the weakness",
  },
  {
    phrase: "It cannot be denied that urbanisation has improved living standards for millions; however, it has simultaneously deepened inequality.",
    category: "Concession",
    skill: "writing",
    note: "Semicolon + 'however' structure — shows grammatical range",
  },

  // ── Linking ──────────────────────────────────────────────────────────────
  {
    phrase: "Furthermore, this trend has significant implications for public health, particularly among younger generations.",
    category: "Linking",
    skill: "writing",
    note: "Adding a related point — more formal than 'also'",
  },
  {
    phrase: "In contrast, developing nations face an entirely different set of challenges, with limited resources and infrastructure.",
    category: "Linking",
    skill: "writing",
    note: "Contrast between two groups or situations",
  },
  {
    phrase: "Nevertheless, it would be premature to conclude that this policy has been an unqualified success.",
    category: "Linking",
    skill: "writing",
    note: "'Nevertheless' concedes then pushes back — shows nuance",
  },
  {
    phrase: "With regard to the economic dimension, the evidence points clearly in one direction.",
    category: "Linking",
    skill: "writing",
    note: "Introducing a new angle — more precise than 'about'",
  },

  // ── Giving Examples ──────────────────────────────────────────────────────
  {
    phrase: "A prime example of this can be seen in Scandinavia, where investment in public education has yielded measurable long-term gains.",
    category: "Giving Examples",
    skill: "writing",
    note: "Specific regional example — boosts Task Response score",
  },
  {
    phrase: "This is evidenced by the fact that global carbon emissions have continued to rise despite decades of international agreements.",
    category: "Giving Examples",
    skill: "writing",
    note: "'This is evidenced by the fact that' — academic, precise",
  },
  {
    phrase: "To illustrate this point, consider the rapid adoption of electric vehicles in countries with strong government subsidies.",
    category: "Giving Examples",
    skill: "writing",
    note: "'To illustrate this point, consider...' — clean and formal",
  },
  {
    phrase: "The experience of Singapore serves as a compelling case study, demonstrating how strict urban planning can coexist with economic prosperity.",
    category: "Giving Examples",
    skill: "writing",
    note: "Country as case study — high-band country example structure",
  },

  // ── Hedging ──────────────────────────────────────────────────────────────
  {
    phrase: "It could be argued that the root cause of this problem lies not in individual behaviour, but in systemic inequality.",
    category: "Hedging",
    skill: "writing",
    note: "Presents a position without full commitment — shows academic tone",
  },
  {
    phrase: "There is a strong case to be made for investing in renewable energy as a long-term solution to climate change.",
    category: "Hedging",
    skill: "writing",
    note: "'There is a strong case to be made for' — confident yet measured",
  },
  {
    phrase: "It seems reasonable to suggest that a multi-faceted approach would be more effective than any single intervention.",
    category: "Hedging",
    skill: "writing",
    note: "Useful in conclusions or when proposing a solution",
  },

  // ── Conclusion ───────────────────────────────────────────────────────────
  {
    phrase: "In conclusion, while both sides of the argument have merit, the weight of evidence suggests that the benefits of globalisation outweigh its drawbacks.",
    category: "Conclusion",
    skill: "writing",
    note: "Classic conclusion structure — echo thesis + final judgement",
  },
  {
    phrase: "To summarise, this essay has argued that a combination of individual responsibility and government intervention offers the most viable path forward.",
    category: "Conclusion",
    skill: "writing",
    note: "'To summarise' — slightly less common than 'In conclusion', stands out",
  },
  {
    phrase: "Ultimately, the solution to this issue requires a shift in both policy and public attitude, and neither alone will suffice.",
    category: "Conclusion",
    skill: "writing",
    note: "'Ultimately' — strong closing word, signals your final position",
  },

  // ── Task 1 Trend ─────────────────────────────────────────────────────────
  {
    phrase: "The graph illustrates a marked upward trend in X over the period from 2000 to 2020, rising from approximately Y to Z.",
    category: "Task 1 Trend",
    skill: "writing",
    note: "Overview sentence template — replace X, Y, Z with actual data",
  },
  {
    phrase: "After an initial period of stability, figures rose sharply between 2010 and 2015, before levelling off towards the end of the period.",
    category: "Task 1 Trend",
    skill: "writing",
    note: "Three-phase trend description — shows range of trend vocabulary",
  },
  {
    phrase: "Notably, X experienced the most dramatic increase, more than doubling over the course of the decade.",
    category: "Task 1 Trend",
    skill: "writing",
    note: "'More than doubling' — precise and concise way to show proportional growth",
  },
  {
    phrase: "Overall, the most striking feature of the data is the consistent decline in X, despite a brief recovery in the mid-2010s.",
    category: "Task 1 Trend",
    skill: "writing",
    note: "Overview sentence for declining trends — shows analytical eye",
  },

  // ── Task 1 Comparison ────────────────────────────────────────────────────
  {
    phrase: "By contrast, Y remained relatively stable throughout the period, fluctuating only slightly around the X mark.",
    category: "Task 1 Comparison",
    skill: "writing",
    note: "Contrast a stable line against a changing one",
  },
  {
    phrase: "While X showed a steady increase, Y followed the opposite trajectory, declining consistently over the same period.",
    category: "Task 1 Comparison",
    skill: "writing",
    note: "Direct comparison of two opposing trends in one sentence",
  },
  {
    phrase: "The figures for X and Y were broadly similar at the start of the period, but diverged significantly by 2020.",
    category: "Task 1 Comparison",
    skill: "writing",
    note: "Highlight convergence at start, divergence at end",
  },
]

async function seedSpeakingPhrases() {
  console.log('Seeding speaking + writing phrases...')
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
      skill: data.skill,
      note: data.note,
      isSystem: true,
    })
    inserted++
  }

  const speaking = SEED_PHRASES.filter((p) => p.skill === 'speaking').length
  const writing = SEED_PHRASES.filter((p) => p.skill === 'writing').length
  console.log(`Done — inserted ${inserted}, skipped ${skipped} (already exist). Total: ${speaking} speaking, ${writing} writing.`)
  process.exit(0)
}

seedSpeakingPhrases().catch((err) => {
  console.error(err)
  process.exit(1)
})
