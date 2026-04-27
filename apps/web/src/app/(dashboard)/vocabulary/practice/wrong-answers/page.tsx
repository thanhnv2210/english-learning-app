import Link from 'next/link'
import { getWrongVocabPracticeItems } from '@/lib/db/word-sentences'
import { FlashcardGame } from '@/components/games/flashcard-game'
import { MultipleChoiceGame } from '@/components/games/multiple-choice-game'
import { FillBlankGame } from '@/components/games/fill-blank-game'

export default async function WrongAnswersPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  const items = await getWrongVocabPracticeItems()

  const backHref = '/vocabulary/practice/wrong-answers'
  const backLabel = 'Back to Wrong Answers'
  const emptyMessage = 'No wrong answers yet — keep practising and mistakes will appear here.'
  const gameType = `vocab_wrong_${mode ?? 'hub'}`

  // Game mode selected
  if (mode === 'flashcard') {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href={backHref} className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
          ← Wrong answers
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Flashcard · Wrong Answers</h1>
          <p className="text-sm text-muted-foreground mt-1">Review the sentences you got wrong.</p>
        </div>
        <FlashcardGame items={items} backHref={backHref} backLabel={backLabel} emptyMessage={emptyMessage} gameType={gameType} />
      </div>
    )
  }

  if (mode === 'multiple-choice') {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href={backHref} className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
          ← Wrong answers
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Multiple Choice · Wrong Answers</h1>
          <p className="text-sm text-muted-foreground mt-1">Pick the correct word for sentences you got wrong.</p>
        </div>
        <MultipleChoiceGame items={items} backHref={backHref} backLabel={backLabel} emptyMessage={emptyMessage} gameType={gameType} />
      </div>
    )
  }

  if (mode === 'fill-blank') {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href={backHref} className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
          ← Wrong answers
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Fill in the Blank · Wrong Answers</h1>
          <p className="text-sm text-muted-foreground mt-1">Type the missing word for sentences you got wrong.</p>
        </div>
        <FillBlankGame items={items} backHref={backHref} backLabel={backLabel} emptyMessage={emptyMessage} gameType={gameType} />
      </div>
    )
  }

  // Hub — pick game mode
  const GAMES = [
    { mode: 'flashcard', icon: '🃏', title: 'Flashcard', description: 'Reveal and self-rate.' },
    { mode: 'multiple-choice', icon: '🔤', title: 'Multiple Choice', description: 'Pick from 4 options.' },
    { mode: 'fill-blank', icon: '✏️', title: 'Fill in the Blank', description: 'Type the answer.' },
  ]

  const hasEnough = items.length >= 3

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/vocabulary/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Wrong Answers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} sentence{items.length !== 1 ? 's' : ''} where your last attempt was wrong.
          They clear automatically once you get them right.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-2xl mb-3">🎉</p>
          <p className="text-sm font-semibold text-foreground">No wrong answers!</p>
          <p className="text-xs text-faint mt-1">Keep practising to build up your review list.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {GAMES.map((game) => (
            <Link
              key={game.mode}
              href={hasEnough ? `?mode=${game.mode}` : '#'}
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
          {!hasEnough && (
            <p className="text-xs text-faint text-center">Need at least 3 wrong answers to play.</p>
          )}
        </div>
      )}
    </div>
  )
}
