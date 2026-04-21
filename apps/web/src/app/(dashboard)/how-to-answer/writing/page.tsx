import Link from 'next/link'
import { WRITING_TASK1_GUIDES, WRITING_TASK2_GUIDES } from '@/lib/guides/writing'
import { WritingGuideClient } from './writing-guide'

export default function WritingHowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-gray-400 hover:text-gray-600">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Writing — How to Answer</h1>
        <p className="mt-1 text-sm text-gray-500">
          {WRITING_TASK1_GUIDES.length} Task 1 types · {WRITING_TASK2_GUIDES.length} Task 2 types · Select one to see the full guide.
        </p>
      </div>

      <WritingGuideClient task1Guides={WRITING_TASK1_GUIDES} task2Guides={WRITING_TASK2_GUIDES} />
    </div>
  )
}
