import Link from 'next/link'
import { getVocabPracticeItems } from '@/lib/db/word-sentences'
import { FillBlankGame } from '@/components/games/fill-blank-game'

export default async function VocabFillBlankPage() {
  const items = await getVocabPracticeItems()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/vocabulary" className="text-xs text-faint hover:text-muted-foreground transition-colors">
          ← Vocabulary
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-foreground">Fill in the Blank</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Type the missing vocabulary word from your saved sentences.
        </p>
      </div>

      <FillBlankGame
        items={items}
        backHref="/vocabulary"
        backLabel="Back to Vocabulary"
        emptyMessage="Save at least 3 sentences from your vocabulary cards to start practising."
        gameType="vocab_fill_blank"
      />
    </div>
  )
}
