import Link from 'next/link'
import { getCollocationPracticeItems } from '@/lib/db/collocations'
import { FillBlankGame } from '@/components/games/fill-blank-game'

export default async function CollocFillBlankPage() {
  const items = await getCollocationPracticeItems()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/collocations" className="text-xs text-faint hover:text-muted-foreground transition-colors">
          ← Collocations
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-foreground">Fill in the Blank</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Type the missing collocation phrase from the example sentences.
        </p>
      </div>

      <FillBlankGame
        items={items}
        backHref="/collocations"
        backLabel="Back to Collocations"
        emptyMessage="Save at least 3 collocations with examples to start practising."
        gameType="colloc_fill_blank"
      />
    </div>
  )
}
