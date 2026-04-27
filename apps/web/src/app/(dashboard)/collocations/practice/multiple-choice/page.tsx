import Link from 'next/link'
import { getCollocationPracticeItems } from '@/lib/db/collocations'
import { MultipleChoiceGame } from '@/components/games/multiple-choice-game'

export default async function CollocMultipleChoicePage() {
  const items = await getCollocationPracticeItems()
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/collocations/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>
      <div>
        <h1 className="text-xl font-bold text-foreground">Multiple Choice</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick the correct collocation phrase from 4 options.</p>
      </div>
      <MultipleChoiceGame
        items={items}
        backHref="/collocations/practice"
        backLabel="Back to Practice"
        emptyMessage="Save at least 4 collocations with examples to start."
        gameType="colloc_multiple_choice"
      />
    </div>
  )
}
