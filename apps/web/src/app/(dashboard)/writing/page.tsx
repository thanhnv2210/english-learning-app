import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getUserDomains } from '@/lib/db/domains'
import { getWritingTopicLibraryCounts } from '@/lib/db/writing'
import { WritingTask } from './writing-task'

export default async function WritingPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const [domains, libraryCounts] = await Promise.all([
    getUserDomains(user.id),
    getWritingTopicLibraryCounts(),
  ])

  return <WritingTask targetBand={targetBand} domains={domains} libraryCounts={libraryCounts} />
}
