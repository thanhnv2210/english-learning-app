import { db } from '@/lib/db'
import { mockExams, examTags, tags } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { HistoryView } from '@/components/history-view'
import { DrillHistoryView } from '@/components/drill-history-view'
import { getCurrentUser } from '@/lib/db/user'
import { getDrillResults } from '@/lib/db/drill'
import Link from 'next/link'

type Filters = {
  skill?: string
  favorites?: boolean
  tag?: string
}

async function fetchExams(userId: number, filters: Filters) {
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
      eq(mockExams.userId, userId),
      filters.skill ? eq(mockExams.skill, filters.skill) : undefined,
      filters.favorites ? eq(mockExams.isFavorite, true) : undefined,
      filteredExamIds ? inArray(mockExams.id, filteredExamIds) : undefined
    ),
    with: { examTags: { with: { tag: true } } },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  })

  return exams
}

const EXAM_SKILLS = ['speaking', 'speaking_part2', 'writing']

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

  const user = await getCurrentUser()
  const isDrillTab = filters.skill === 'drill'
  const isAllTab = !filters.skill && !filters.favorites && !filters.tag
  const activeTag = filters.tag

  const [exams, drillRecords] = await Promise.all([
    isDrillTab ? [] : fetchExams(user.id, filters),
    isDrillTab || isAllTab ? getDrillResults(user.id) : [],
  ])

  const totalCount = (isDrillTab ? drillRecords.length : exams.length) + (isAllTab ? drillRecords.length : 0)

  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground">History</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isDrillTab
          ? `${drillRecords.length} drill result${drillRecords.length !== 1 ? 's' : ''}`
          : isAllTab
          ? `${exams.length} session${exams.length !== 1 ? 's' : ''} · ${drillRecords.length} drill result${drillRecords.length !== 1 ? 's' : ''}`
          : `${exams.length} session${exams.length !== 1 ? 's' : ''}`}
      </p>

      {/* Filter bar */}
      <div className="mt-5 flex flex-wrap gap-2">
        <FilterChip label="All" href="/history" active={isAllTab} />
        <FilterChip label="★ Favorites" href="/history?favorites=true" active={!!filters.favorites} />
        {EXAM_SKILLS.map((s) => (
          <FilterChip
            key={s}
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            href={`/history?skill=${s}`}
            active={filters.skill === s}
          />
        ))}
        <FilterChip label="Read-Aloud Drill" href="/history?skill=drill" active={isDrillTab} />
        {activeTag && (
          <FilterChip label={`#${activeTag}`} href={`/history?tag=${activeTag}`} active />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {isDrillTab ? (
          <DrillHistoryView records={drillRecords} />
        ) : (
          <>
            <HistoryView exams={exams} />
            {isAllTab && drillRecords.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-foreground">Read-Aloud Drill</h2>
                  <span className="text-xs text-faint">{drillRecords.length} result{drillRecords.length !== 1 ? 's' : ''}</span>
                </div>
                <DrillHistoryView records={drillRecords} />
              </div>
            )}
          </>
        )}
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
          : 'bg-subtle text-muted-foreground hover:bg-muted'
      }`}
    >
      {label}
    </Link>
  )
}
