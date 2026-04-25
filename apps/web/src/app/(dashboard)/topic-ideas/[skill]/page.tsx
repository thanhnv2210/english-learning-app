import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TOPICS, SKILLS, SKILL_LABELS, type Skill } from '@/lib/topic-ideas'

type Props = {
  params: Promise<{ skill: string }>
}

export default async function TopicIdeasSkillPage({ params }: Props) {
  const { skill } = await params

  if (!SKILLS.includes(skill as Skill)) {
    notFound()
  }

  const validSkill = skill as Skill
  const skillLabel = SKILL_LABELS[validSkill]

  return (
    <div className="mx-auto max-w-3xl xl:max-w-4xl 2xl:max-w-7xl">
      <div className="mb-6">
        <Link
          href="/topic-ideas"
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ← Topic Ideas
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {skillLabel} — Topic Ideas
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {TOPICS.length} topics · Select one to explore frameworks.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TOPICS.map((topic) => (
          <Link
            key={topic.id}
            href={`/topic-ideas/${validSkill}/${topic.id}`}
            className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <span className="text-3xl">{topic.icon}</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{topic.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{topic.description}</p>
            <p className="mt-auto pt-2 text-xs text-blue-500 dark:text-blue-400">
              {topic.frameworks.length} frameworks →
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
