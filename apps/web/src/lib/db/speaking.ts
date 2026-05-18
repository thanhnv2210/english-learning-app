import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { CACHE_REVALIDATE_SECONDS } from '@/lib/cache-config'
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

export const getAllSpeakingTopics = unstable_cache(
  async (): Promise<SpeakingTopic[]> => db.select().from(speakingTopics).orderBy(asc(speakingTopics.rank)),
  ['speaking-topics'],
  { tags: ['speaking-topics'], revalidate: CACHE_REVALIDATE_SECONDS },
)

export const getAllPart2Topics = unstable_cache(
  async (): Promise<SpeakingPart2Topic[]> => db.select().from(speakingPart2Topics).orderBy(asc(speakingPart2Topics.rank)),
  ['speaking-part2-topics'],
  { tags: ['speaking-part2-topics'], revalidate: CACHE_REVALIDATE_SECONDS },
)
