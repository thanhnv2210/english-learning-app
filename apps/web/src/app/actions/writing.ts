'use server'

import { saveWritingTopic, getRandomTopicByDomain, getTopicsByDomain, type LibraryTopic } from '@/lib/db/writing'
import { getCurrentUser } from '@/lib/db/user'

export async function saveTopicToLibrary(data: {
  domain: string
  prompt: string
  taskType: string
}): Promise<number> {
  const user = await getCurrentUser()
  return saveWritingTopic({ ...data, userId: user.id })
}

export async function pickRandomTopic(domain: string): Promise<LibraryTopic | null> {
  const user = await getCurrentUser()
  return getRandomTopicByDomain(domain, user.id, user.role === 'admin', user.showSystemData)
}

export async function listTopicsByDomain(domain: string): Promise<LibraryTopic[]> {
  const user = await getCurrentUser()
  return getTopicsByDomain(domain, user.id, user.role === 'admin', user.showSystemData)
}
