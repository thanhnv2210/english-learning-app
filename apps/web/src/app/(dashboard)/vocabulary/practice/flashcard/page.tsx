import Link from 'next/link'
import { getVocabPracticeItems } from '@/lib/db/word-sentences'
import { FlashcardGame } from '@/components/games/flashcard-game'

export default async function VocabFlashcardPage() {
  const items = await getVocabPracticeItems()
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/vocabulary/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>
      <div>
        <h1 className="text-xl font-bold text-foreground">Flashcard</h1>
        <p className="text-sm text-muted-foreground mt-1">Reveal the answer, then rate yourself honestly.</p>
      </div>
      <FlashcardGame
        items={items}
        backHref="/vocabulary/practice"
        backLabel="Back to Practice"
        emptyMessage="Save at least 3 sentences from your vocabulary cards to start."
        gameType="vocab_flashcard"
      />
    </div>
  )
}
