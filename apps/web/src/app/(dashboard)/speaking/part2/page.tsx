import { db } from '@/lib/db'
import { mockExams } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Part2Chat } from './part2-chat'
import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getAllPart2Topics } from '@/lib/db/speaking'
import type { TranscriptMessage } from '@/lib/db/schema'

export default async function SpeakingPart2Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  let initialMessages: TranscriptMessage[] | undefined
  let resumeExamId: number | undefined
  let initialCueCard: { id: number; prompt: string } | undefined

  if (params.examId) {
    const id = parseInt(params.examId)
    const exam = await db.query.mockExams.findFirst({
      where: eq(mockExams.id, id),
      with: { cueCard: true },
    })
    if (exam) {
      initialMessages = exam.transcript
      resumeExamId = exam.id
      if (exam.cueCard) {
        initialCueCard = { id: exam.cueCard.id, prompt: exam.cueCard.prompt }
      }
    }
  }

  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const topics = await getAllPart2Topics()

  return (
    <Part2Chat
      initialMessages={initialMessages}
      resumeExamId={resumeExamId}
      initialCueCard={initialCueCard}
      targetBand={targetBand}
      topics={topics}
    />
  )
}
