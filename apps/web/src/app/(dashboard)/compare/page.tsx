import { getAllComparisons } from '@/lib/db/comparisons'
import { ComparisonSearch } from './comparison-search'
import { ComparisonList } from './comparison-list'

export default async function ComparePage() {
  const saved = await getAllComparisons()

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Word Comparison</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare near-synonyms side by side — register, IELTS fit, intensity, and contrastive examples. Know exactly when to use which word.
        </p>
      </div>

      <ComparisonSearch />

      <ComparisonList initialItems={saved} />
    </div>
  )
}
