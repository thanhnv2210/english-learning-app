import Link from 'next/link'
import { getCollocationPracticeItems } from '@/lib/db/collocations'

const GAMES = [
  {
    href: '/collocations/practice/flashcard',
    icon: '🃏',
    title: 'Flashcard',
    description: 'Reveal the answer and self-rate. Best for relaxed review.',
  },
  {
    href: '/collocations/practice/multiple-choice',
    icon: '🔤',
    title: 'Multiple Choice',
    description: 'Pick the correct phrase from 4 options. Good for recognition.',
  },
  {
    href: '/collocations/practice/fill-blank',
    icon: '✏️',
    title: 'Fill in the Blank',
    description: 'Type the missing phrase from memory. Hardest mode.',
  },
]

export default async function CollocPracticeHub() {
  const items = await getCollocationPracticeItems()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/collocations" className="text-xs text-faint hover:text-muted-foreground transition-colors">
          ← Collocations
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-foreground">Collocation Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} sentence{items.length !== 1 ? 's' : ''} from your library · choose a game mode.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {GAMES.map((game) => (
          <Link
            key={game.href}
            href={items.length >= 3 ? game.href : '#'}
            className={`rounded-xl border border-border bg-card p-5 flex items-start gap-4 transition-colors ${
              items.length >= 3 ? 'hover:bg-muted cursor-pointer' : 'opacity-50 cursor-not-allowed'
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

      {items.length < 3 && (
        <p className="text-xs text-faint text-center">
          Save at least 3 collocations with examples to unlock practice.
        </p>
      )}
    </div>
  )
}
