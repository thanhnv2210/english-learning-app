import Link from 'next/link'
import { LISTENING_GUIDES } from '@/lib/guides/listening'
import { ListeningGuide } from './listening-guide'

export default function ListeningHowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Listening — How to Answer</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {LISTENING_GUIDES.length} question types · Select one to see the full guide.
        </p>
      </div>

      <ListeningGuide guides={LISTENING_GUIDES} />
    </div>
  )
}
