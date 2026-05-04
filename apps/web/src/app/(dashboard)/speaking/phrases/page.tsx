import { getPhrases } from '@/lib/db/speaking-phrases'
import { getCurrentUser } from '@/lib/db/user'
import { PhrasesView } from './phrases-view'
import Link from 'next/link'

export default async function SpeakingPhrasesPage() {
  const user = await getCurrentUser()
  const phrases = await getPhrases(user.id, user.role === 'admin', user.showSystemData, 'speaking')

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/speaking"
          className="text-xs text-faint hover:text-muted-foreground transition-colors"
        >
          Back to Speaking
        </Link>
        <span className="text-xs text-faint">{phrases.length} phrase{phrases.length !== 1 ? 's' : ''} saved</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Speaking Phrase Bank</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save sentences and phrases you want to mimic and apply in your speaking practice.
        </p>
      </div>

      <PhrasesView initialPhrases={phrases} skill="speaking" />
    </div>
  )
}
