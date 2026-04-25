import Link from 'next/link'
import { READING_GUIDES } from '@/lib/guides/reading'
import { ReadingGuide } from './reading-guide'

export default function ReadingHowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-faint hover:text-muted-foreground">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Reading — How to Answer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {READING_GUIDES.length} question types · Select one to see the full guide.
        </p>
      </div>

      <ReadingGuide guides={READING_GUIDES} />
    </div>
  )
}
