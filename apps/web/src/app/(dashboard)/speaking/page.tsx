import { db } from '@/lib/db'
import { mockExams } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { SpeakingChat } from './speaking-chat'
import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getAllSpeakingTopics } from '@/lib/db/speaking'
import type { TranscriptMessage } from '@/lib/db/schema'

export default async function SpeakingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  let initialMessages: TranscriptMessage[] | undefined
  let resumeExamId: number | undefined

  if (params.examId) {
    const id = parseInt(params.examId)
    const exam = await db.query.mockExams.findFirst({ where: eq(mockExams.id, id) })
    if (exam) {
      initialMessages = exam.transcript
      resumeExamId = exam.id
    }
  }

  const [user, topics] = await Promise.all([getDefaultUser(), getAllSpeakingTopics()])
  const targetBand = parseTargetBand(user.targetProfile)

  return (
    <SpeakingChat
      initialMessages={initialMessages}
      resumeExamId={resumeExamId}
      targetBand={targetBand}
      topics={topics}
    />
  )
}
