import Link from 'next/link'
import { getCollocationPracticeItems } from '@/lib/db/collocations'
import { FlashcardGame } from '@/components/games/flashcard-game'

export default async function CollocFlashcardPage() {
  const items = await getCollocationPracticeItems()
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/collocations/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>
      <div>
        <h1 className="text-xl font-bold text-foreground">Flashcard</h1>
        <p className="text-sm text-muted-foreground mt-1">Reveal the answer, then rate yourself honestly.</p>
      </div>
      <FlashcardGame
        items={items}
        backHref="/collocations/practice"
        backLabel="Back to Practice"
        emptyMessage="Save at least 3 collocations with examples to start."
        gameType="colloc_flashcard"
      />
    </div>
  )
}
