import Link from 'next/link'
import { getIdiomPracticeItems } from '@/lib/db/idioms'
import { getCurrentUser } from '@/lib/db/user'

const GAMES = [
  {
    href: '/idioms/practice/flashcard',
    icon: '🃏',
    title: 'Flashcard',
    description: 'Reveal the answer and self-rate. Best for relaxed review.',
  },
  {
    href: '/idioms/practice/multiple-choice',
    icon: '🔤',
    title: 'Multiple Choice',
    description: 'Pick the correct idiom from 4 options. Good for recognition.',
  },
  {
    href: '/idioms/practice/fill-blank',
    icon: '✏️',
    title: 'Fill in the Blank',
    description: 'Type the missing idiom from memory. Hardest mode.',
  },
]

export default async function IdiomPracticeHub() {
  const user = await getCurrentUser()
  const items = await getIdiomPracticeItems(user.id, user.role === 'admin', user.showSystemData)

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/idioms" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Idioms
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Idiom Practice</h1>
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
          Save at least 3 idioms with examples to unlock practice.
        </p>
      )}
    </div>
  )
}
