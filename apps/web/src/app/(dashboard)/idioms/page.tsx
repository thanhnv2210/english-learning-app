import Link from 'next/link'
import { getAllIdioms, getIdiomPracticeItems } from '@/lib/db/idioms'
import { getCurrentUser } from '@/lib/db/user'
import { IdiomSearch } from './idiom-search'
import { IdiomList } from './idiom-list'

export default async function IdiomsPage() {
  const user = await getCurrentUser()
  const [saved, practiceItems] = await Promise.all([
    getAllIdioms(user.id, user.role === 'admin', user.showSystemData),
    getIdiomPracticeItems(user.id, user.role === 'admin', user.showSystemData),
  ])

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Idiom Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log idioms you encounter — AI fills in the meaning and examples. Tag by skill and context, then practise with games.
          </p>
        </div>
        {practiceItems.length >= 3 && (
          <Link
            href="/idioms/practice"
            className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            ✏️ Practice ({practiceItems.length} sentences)
          </Link>
        )}
      </div>

      <IdiomSearch />

      {saved.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No idioms saved yet.{!user.showSystemData && ' Enable system data in Settings to see built-in idioms, or'} Search above to add your first idiom.
        </p>
      )}
      <IdiomList initialItems={saved} isAdmin={user.role === 'admin'} />
    </div>
  )
}
