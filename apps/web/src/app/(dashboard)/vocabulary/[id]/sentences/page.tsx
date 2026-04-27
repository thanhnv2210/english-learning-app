import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWordById, getSentencesForWord } from '@/lib/db/word-sentences'
import { SentencesView } from './sentences-view'

export default async function SentencesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wordId = Number(id)
  if (isNaN(wordId)) notFound()

  const [word, sentences] = await Promise.all([
    getWordById(wordId),
    getSentencesForWord(wordId),
  ])

  if (!word) notFound()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/vocabulary"
          className="text-xs text-faint hover:text-muted-foreground transition-colors"
        >
          ← Back to vocabulary
        </Link>
        <Link
          href="/vocabulary/practice/fill-blank"
          className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
        >
          ✏️ Practice →
        </Link>
      </div>

      {/* Word header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-baseline gap-2 mb-1">
          <h1 className="text-2xl font-bold text-foreground">{word.word}</h1>
          {word.wordType && (
            <span className="text-sm italic text-faint">{word.wordType}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {String(word.definition ?? '')}
        </p>
      </div>

      {/* Sentences */}
      <SentencesView wordId={wordId} initialSentences={sentences} />
    </div>
  )
}
