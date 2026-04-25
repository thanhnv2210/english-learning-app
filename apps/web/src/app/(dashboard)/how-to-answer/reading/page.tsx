import Link from 'next/link'
import { READING_GUIDES } from '@/lib/guides/reading'
import { ReadingGuide } from './reading-guide'

export default function ReadingHowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Reading — How to Answer</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {READING_GUIDES.length} question types · Select one to see the full guide.
        </p>
      </div>

      <ReadingGuide guides={READING_GUIDES} />
    </div>
  )
}
