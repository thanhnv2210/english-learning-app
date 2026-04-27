import Link from 'next/link'
import { getAllCollocations, getCollocationPracticeItems } from '@/lib/db/collocations'
import { CollocationSearch } from './collocation-search'
import { CollocationList } from './collocation-list'

export default async function CollocationPage() {
  const [saved, practiceItems] = await Promise.all([
    getAllCollocations(),
    getCollocationPracticeItems(),
  ])

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collocation Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search collocations by word or phrase — AI suggests relevant IELTS skills, you can
            adjust before saving.
          </p>
        </div>
        {practiceItems.length >= 3 && (
          <Link
            href="/collocations/practice/fill-blank"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            ✏️ Practice ({practiceItems.length} sentences)
          </Link>
        )}
      </div>

      <CollocationSearch />

      <CollocationList initialItems={saved} />
    </div>
  )
}
