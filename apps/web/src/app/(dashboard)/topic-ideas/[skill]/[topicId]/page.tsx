import { notFound } from 'next/navigation'
import { TOPICS, SKILLS, type Skill } from '@/lib/topic-ideas'
import { TopicDetail } from './topic-detail'

type Props = {
  params: Promise<{ skill: string; topicId: string }>
}

export default async function TopicDetailPage({ params }: Props) {
  const { skill, topicId } = await params

  if (!SKILLS.includes(skill as Skill)) {
    notFound()
  }

  const topic = TOPICS.find((t) => t.id === topicId)
  if (!topic) {
    notFound()
  }

  return <TopicDetail topic={topic} skill={skill as Skill} />
}
