import Link from 'next/link'
import { READING_GUIDES } from '@/lib/guides/reading'
import { ReadingGuide } from './reading-guide'

export default function ReadingHowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-gray-400 hover:text-gray-600">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Reading — How to Answer</h1>
        <p className="mt-1 text-sm text-gray-500">
          {READING_GUIDES.length} question types · Select one to see the full guide.
        </p>
      </div>

      <ReadingGuide guides={READING_GUIDES} />
    </div>
  )
}
