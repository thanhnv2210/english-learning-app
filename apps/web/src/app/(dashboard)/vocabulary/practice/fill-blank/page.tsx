import Link from 'next/link'
import { getAllSentences } from '@/lib/db/word-sentences'
import { FillBlankGame } from './fill-blank-game'

export default async function FillBlankPage() {
  const sentences = await getAllSentences()

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
          Type the missing word from your saved sentences.
        </p>
      </div>

      <FillBlankGame sentences={sentences} />
    </div>
  )
}
