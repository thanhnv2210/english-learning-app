import { db } from '@/lib/db'
import { mockExams, examTags, tags } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { HistoryView } from '@/components/history-view'
import Link from 'next/link'

type Filters = {
  skill?: string
  favorites?: boolean
  tag?: string
}

async function fetchExams(filters: Filters) {
  // If filtering by tag name, resolve it to a tag id first
  let filteredExamIds: number[] | undefined

  if (filters.tag) {
    const [tag] = await db.select().from(tags).where(eq(tags.name, filters.tag.toLowerCase()))
    if (!tag) return []

    const links = await db.select().from(examTags).where(eq(examTags.tagId, tag.id))
    filteredExamIds = links.map((l) => l.examId)
    if (filteredExamIds.length === 0) return []
  }

  const exams = await db.query.mockExams.findMany({
    where: and(
      filters.skill ? eq(mockExams.skill, filters.skill) : undefined,
      filters.favorites ? eq(mockExams.isFavorite, true) : undefined,
      filteredExamIds ? inArray(mockExams.id, filteredExamIds) : undefined
    ),
    with: { examTags: { with: { tag: true } } },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  })

  return exams
}

const SKILLS = ['speaking', 'speaking_part2', 'writing']

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const filters: Filters = {
    skill: params.skill,
    favorites: params.favorites === 'true',
    tag: params.tag,
  }

  const exams = await fetchExams(filters)
  const activeTag = filters.tag

  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">History</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{exams.length} session{exams.length !== 1 ? 's' : ''}</p>

      {/* Filter bar */}
      <div className="mt-5 flex flex-wrap gap-2">
        <FilterChip label="All" href="/history" active={!filters.skill && !filters.favorites && !activeTag} />
        <FilterChip label="★ Favorites" href="/history?favorites=true" active={!!filters.favorites} />
        {SKILLS.map((s) => (
          <FilterChip
            key={s}
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            href={`/history?skill=${s}`}
            active={filters.skill === s}
          />
        ))}
        {activeTag && (
          <FilterChip label={`#${activeTag}`} href={`/history?tag=${activeTag}`} active />
        )}
      </div>

      <div className="mt-6">
        <HistoryView exams={exams} />
      </div>
    </div>
  )
}

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </Link>
  )
}
