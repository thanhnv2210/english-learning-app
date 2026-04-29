import Link from 'next/link'
import { getGrammarTrapPracticeItems } from '@/lib/db/grammar-traps'

const GAMES = [
  { href: '/grammar-traps/practice/flashcard',       icon: '🃏', title: 'Flashcard',         description: 'Reveal the answer and self-rate. Best for relaxed review.' },
  { href: '/grammar-traps/practice/multiple-choice', icon: '🔤', title: 'Multiple Choice',    description: 'Pick the correct form from 4 options.' },
  { href: '/grammar-traps/practice/fill-blank',      icon: '✏️', title: 'Fill in the Blank',  description: 'Type the missing correct form from memory.' },
]

export default async function GrammarTrapsPracticeHub() {
  const items = await getGrammarTrapPracticeItems()
  const hasEnough = items.length >= 3

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/grammar-traps" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Grammar Traps
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Grammar Trap Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} practice item{items.length !== 1 ? 's' : ''} from your library — choose a game mode.
        </p>
      </div>

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
          Add at least 3 entries with examples to unlock practice.
        </p>
      )}
    </div>
  )
}
