import Link from 'next/link'
import { SPEAKING_GUIDES } from '@/lib/guides/speaking'
import { SpeakingGuideClient } from './speaking-guide'

export default function SpeakingHowToAnswerPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-gray-400 hover:text-gray-600">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Speaking — How to Answer</h1>
        <p className="mt-1 text-sm text-gray-500">
          {SPEAKING_GUIDES.length} parts · Select one to see the full guide.
        </p>
      </div>

      <SpeakingGuideClient guides={SPEAKING_GUIDES} />
    </div>
  )
}
