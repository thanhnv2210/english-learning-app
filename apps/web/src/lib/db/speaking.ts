import { db } from '@/lib/db'
import { speakingTopics } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export type SpeakingTopic = {
  id: number
  rank: number
  name: string
  description: string
  exampleQuestions: string[]
}

export async function getAllSpeakingTopics(): Promise<SpeakingTopic[]> {
  return db.select().from(speakingTopics).orderBy(asc(speakingTopics.rank))
}
