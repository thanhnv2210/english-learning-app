import Link from 'next/link'
import { getVocabPracticeItems, getWrongVocabPracticeItems } from '@/lib/db/word-sentences'

const GAMES = [
  {
    href: '/vocabulary/practice/flashcard',
    icon: '🃏',
    title: 'Flashcard',
    description: 'Reveal the answer and self-rate. Best for relaxed review.',
  },
  {
    href: '/vocabulary/practice/multiple-choice',
    icon: '🔤',
    title: 'Multiple Choice',
    description: 'Pick the correct word from 4 options. Good for recognition.',
  },
  {
    href: '/vocabulary/practice/fill-blank',
    icon: '✏️',
    title: 'Fill in the Blank',
    description: 'Type the missing word from memory. Hardest mode.',
  },
]

export default async function VocabPracticeHub() {
  const [items, wrongItems] = await Promise.all([
    getVocabPracticeItems(),
    getWrongVocabPracticeItems(),
  ])

  const hasEnough = items.length >= 3

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/vocabulary" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Vocabulary
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Vocabulary Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} sentence{items.length !== 1 ? 's' : ''} in your library · choose a game mode.
        </p>
      </div>

      {/* Wrong answers banner */}
      {wrongItems.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-red-700">
              {wrongItems.length} wrong answer{wrongItems.length !== 1 ? 's' : ''} to review
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              Practice these until you get them right — they&apos;ll clear automatically.
            </p>
          </div>
          <Link
            href="/vocabulary/practice/wrong-answers"
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Review now →
          </Link>
        </div>
      )}

      {/* Game modes */}
      <div className="flex flex-col gap-3">
        {GAMES.map((game) => (
          <Link
            key={game.href}
            href={hasEnough ? game.href : '#'}
            className={`rounded-xl border border-border bg-card p-5 flex items-start gap-4 transition-colors ${
              hasEnough ? 'hover:bg-muted cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-3xl shrink-0">{game.icon}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{game.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {!hasEnough && (
        <p className="text-xs text-faint text-center">
          Save at least 3 sentences from your vocabulary cards to unlock practice.
        </p>
      )}
    </div>
  )
}
