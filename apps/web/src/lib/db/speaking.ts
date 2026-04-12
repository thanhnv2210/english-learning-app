import { db } from '@/lib/db'
import { speakingTopics, speakingPart2Topics } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export type SpeakingTopic = {
  id: number
  rank: number
  name: string
  description: string
  exampleQuestions: string[]
}

export type SpeakingPart2Topic = {
  id: number
  rank: number
  name: string
  description: string
  examplePrompts: string[]
}

export async function getAllSpeakingTopics(): Promise<SpeakingTopic[]> {
  return db.select().from(speakingTopics).orderBy(asc(speakingTopics.rank))
}

export async function getAllPart2Topics(): Promise<SpeakingPart2Topic[]> {
  return db.select().from(speakingPart2Topics).orderBy(asc(speakingPart2Topics.rank))
}
