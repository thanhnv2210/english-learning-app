import Link from 'next/link'
import { getVocabPracticeItems } from '@/lib/db/word-sentences'
import { MultipleChoiceGame } from '@/components/games/multiple-choice-game'

export default async function VocabMultipleChoicePage() {
  const items = await getVocabPracticeItems()
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/vocabulary/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>
      <div>
        <h1 className="text-xl font-bold text-foreground">Multiple Choice</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick the correct vocabulary word from 4 options.</p>
      </div>
      <MultipleChoiceGame
        items={items}
        backHref="/vocabulary/practice"
        backLabel="Back to Practice"
        emptyMessage="Save at least 4 sentences from your vocabulary cards to start."
        gameType="vocab_multiple_choice"
      />
    </div>
  )
}
