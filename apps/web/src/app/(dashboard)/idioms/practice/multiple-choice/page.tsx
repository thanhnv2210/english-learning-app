import Link from 'next/link'
import { getIdiomPracticeItems } from '@/lib/db/idioms'
import { MultipleChoiceGame } from '@/components/games/multiple-choice-game'

export default async function IdiomMultipleChoicePage() {
  const items = await getIdiomPracticeItems()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/idioms/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Multiple Choice</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick the correct idiom from 4 options.</p>
      </div>

      <MultipleChoiceGame
        items={items}
        backHref="/idioms/practice"
        backLabel="Back to Practice"
        emptyMessage="Save at least 4 idioms with examples to start."
        gameType="idiom_multiple_choice"
      />
    </div>
  )
}
