'use server'

import { saveWritingTopic, getRandomTopicByDomain, getTopicsByDomain, type LibraryTopic } from '@/lib/db/writing'

export async function saveTopicToLibrary(data: {
  domain: string
  prompt: string
  taskType: string
}): Promise<number> {
  return saveWritingTopic(data)
}

export async function pickRandomTopic(domain: string): Promise<LibraryTopic | null> {
  return getRandomTopicByDomain(domain)
}

export async function listTopicsByDomain(domain: string): Promise<LibraryTopic[]> {
  return getTopicsByDomain(domain)
}
