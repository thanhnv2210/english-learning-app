import Link from 'next/link'
import { getIdiomPracticeItems } from '@/lib/db/idioms'
import { getCurrentUser } from '@/lib/db/user'
import { FillBlankGame } from '@/components/games/fill-blank-game'

export default async function IdiomFillBlankPage() {
  const user = await getCurrentUser()
  const items = await getIdiomPracticeItems(user.id, user.role === 'admin', user.showSystemData)

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/idioms/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Fill in the Blank</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Type the missing idiom from the example sentences.
        </p>
      </div>

      <FillBlankGame
        items={items}
        backHref="/idioms/practice"
        backLabel="Back to Practice"
        emptyMessage="Save at least 3 idioms with examples to start practising."
        gameType="idiom_fill_blank"
      />
    </div>
  )
}
