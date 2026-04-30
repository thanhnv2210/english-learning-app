import { getPhrases } from '@/lib/db/speaking-phrases'
import { getDefaultUser } from '@/lib/db/user'
import { PhrasesView } from '@/app/(dashboard)/speaking/phrases/phrases-view'
import Link from 'next/link'

export default async function WritingPhrasesPage() {
  const user = await getDefaultUser()
  const phrases = await getPhrases(user.id, 'writing')

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/writing"
          className="text-xs text-faint hover:text-muted-foreground transition-colors"
        >
          Back to Writing
        </Link>
        <span className="text-xs text-faint">{phrases.length} phrase{phrases.length !== 1 ? 's' : ''} saved</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Writing Phrase Bank</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save sentences and structures you want to mimic and apply in your writing practice.
        </p>
      </div>

      <PhrasesView initialPhrases={phrases} skill="writing" />
    </div>
  )
}
