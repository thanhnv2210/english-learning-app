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

      {/* Article Structures entry point */}
      <Link
        href="/how-to-answer/reading/article-structures"
        className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Academic Article Structures</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
            7 structures · Predict paragraph roles from the introduction — essential for Matching Headings
          </p>
        </div>
        <span className="shrink-0 text-blue-400 dark:text-blue-500 text-sm ml-4">→</span>
      </Link>

      <ReadingGuide guides={READING_GUIDES} />
    </div>
  )
}
