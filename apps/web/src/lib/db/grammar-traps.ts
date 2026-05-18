import { unstable_cache, revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { grammarTrapEntries } from '@/lib/db/schema'
import type { GrammarTrapExample } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

const GRAMMAR_TRAPS_TAG = 'grammar-traps'

// Re-export client-safe constants so server code can import from one place.
// Client components must import directly from lib/ielts/grammar-traps/constants.ts
import { CATEGORY_LABELS, CATEGORY_COLORS, ALL_CATEGORIES } from '@/lib/ielts/grammar-traps/constants'
export { CATEGORY_LABELS, CATEGORY_COLORS, ALL_CATEGORIES }

export type { GrammarTrapExample }

export type GrammarTrapCard = {
  id: number
  phrase: string
  correction: string
  category: string
  explanation: string
  examples: GrammarTrapExample[]
  rank: number
  createdAt: Date
}

export const getAllGrammarTraps = unstable_cache(
  async (): Promise<GrammarTrapCard[]> => db
    .select()
    .from(grammarTrapEntries)
    .orderBy(desc(grammarTrapEntries.rank), asc(grammarTrapEntries.phrase)),
  [GRAMMAR_TRAPS_TAG],
  { tags: [GRAMMAR_TRAPS_TAG] },
)

export async function findGrammarTrap(phrase: string): Promise<GrammarTrapCard | null> {
  const rows = await db
    .select()
    .from(grammarTrapEntries)
    .where(eq(grammarTrapEntries.phrase, phrase.toLowerCase()))
    .limit(1)
  return rows[0] ?? null
}

export async function saveGrammarTrap(data: {
  phrase: string
  correction: string
  category: string
  explanation: string
  examples: GrammarTrapExample[]
  rank?: number
}): Promise<GrammarTrapCard> {
  const [row] = await db
    .insert(grammarTrapEntries)
    .values({ ...data, phrase: data.phrase.toLowerCase(), rank: data.rank ?? 3 })
    .onConflictDoUpdate({
      target: grammarTrapEntries.phrase,
      set: {
        correction: data.correction,
        category: data.category,
        explanation: data.explanation,
        examples: data.examples,
        rank: data.rank ?? 3,
      },
    })
    .returning()
  revalidateTag(GRAMMAR_TRAPS_TAG)
  return row
}

export async function deleteGrammarTrap(id: number): Promise<void> {
  await db.delete(grammarTrapEntries).where(eq(grammarTrapEntries.id, id))
  revalidateTag(GRAMMAR_TRAPS_TAG)
}

export async function updateGrammarTrapRank(id: number, rank: number): Promise<void> {
  await db
    .update(grammarTrapEntries)
    .set({ rank })
    .where(eq(grammarTrapEntries.id, id))
  revalidateTag(GRAMMAR_TRAPS_TAG)
}

export const getGrammarTrapPracticeItems = unstable_cache(
  async (): Promise<PracticeItem[]> => {
    const rows = await db
      .select()
      .from(grammarTrapEntries)
      .orderBy(desc(grammarTrapEntries.rank), asc(grammarTrapEntries.phrase))

    const items: PracticeItem[] = []
    for (const row of rows) {
      for (let i = 0; i < row.examples.length; i++) {
        const ex = row.examples[i]
        if (!ex.correct) continue
        items.push({
          id: `grammar_trap_${row.id}_${i}`,
          sentence: ex.correct,
          answer: row.correction,
          hint: CATEGORY_LABELS[row.category] ?? row.category,
          context: 'Grammar',
          source: 'grammar_trap',
        })
      }
    }
    return items
  },
  [`${GRAMMAR_TRAPS_TAG}-practice`],
  { tags: [GRAMMAR_TRAPS_TAG] },
)
