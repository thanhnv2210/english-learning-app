import { DrillView } from './drill-view'
import { getAllDrillTexts } from '@/lib/db/drill'
import Link from 'next/link'

export default async function DrillPage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string }>
}) {
  const { text = '' } = await searchParams
  const initialText = text ? decodeURIComponent(text) : ''
  const drillTexts = await getAllDrillTexts()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/speaking/phrases"
          className="text-xs text-faint hover:text-muted-foreground transition-colors"
        >
          ← Speaking Phrases
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Read-Aloud Drill</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a paragraph or paste your own text, speak it aloud, and get instant feedback
          on pronunciation mistakes — mapped to connected speech patterns.
        </p>
      </div>

      <DrillView initialText={initialText} drillTexts={drillTexts} />
    </div>
  )
}
