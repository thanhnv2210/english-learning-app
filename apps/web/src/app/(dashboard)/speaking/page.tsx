import { db } from '@/lib/db'
import { mockExams } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { SpeakingChat } from './speaking-chat'
import { getCurrentUser, parseTargetBand } from '@/lib/db/user'
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

  const [user, topics] = await Promise.all([getCurrentUser(), getAllSpeakingTopics()])

  if (params.examId) {
    const id = parseInt(params.examId)
    const exam = await db.query.mockExams.findFirst({
      where: and(eq(mockExams.id, id), eq(mockExams.userId, user.id)),
    })
    if (exam) {
      initialMessages = exam.transcript
      resumeExamId = exam.id
    }
  }
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
