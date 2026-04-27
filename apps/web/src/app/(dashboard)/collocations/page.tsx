import { getAllCollocations } from '@/lib/db/collocations'
import { CollocationSearch } from './collocation-search'
import { CollocationList } from './collocation-list'

export default async function CollocationPage() {
  const saved = await getAllCollocations()

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Collocation Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search collocations by word or phrase — AI suggests relevant IELTS skills, you can
          adjust before saving.
        </p>
      </div>

      <CollocationSearch />

      <CollocationList initialItems={saved} />
    </div>
  )
}
