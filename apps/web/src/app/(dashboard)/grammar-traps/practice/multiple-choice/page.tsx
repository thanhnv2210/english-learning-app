import Link from 'next/link'
import { getGrammarTrapPracticeItems } from '@/lib/db/grammar-traps'
import { MultipleChoiceGame } from '@/components/games/multiple-choice-game'

export default async function GrammarTrapsMultipleChoicePage() {
  const items = await getGrammarTrapPracticeItems()
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/grammar-traps/practice" className="self-start text-xs text-faint hover:text-muted-foreground transition-colors">
        ← Practice modes
      </Link>
      <div>
        <h1 className="text-xl font-bold text-foreground">Multiple Choice</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick the correct noun form from 4 options.</p>
      </div>
      <MultipleChoiceGame
        items={items}
        backHref="/grammar-traps/practice"
        backLabel="Back to Practice"
        emptyMessage="Add at least 3 entries with examples to start practising."
        gameType="grammar_trap_multiple_choice"
      />
    </div>
  )
}
