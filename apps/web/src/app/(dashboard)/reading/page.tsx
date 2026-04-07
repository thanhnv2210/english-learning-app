import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getUserDomains } from '@/lib/db/domains'
import { getLibraryCounts } from '@/lib/db/reading'
import { ReadingTask } from './reading-task'

export default async function ReadingPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const [domains, libraryCounts] = await Promise.all([
    getUserDomains(user.id),
    getLibraryCounts(),
  ])

  return <ReadingTask targetBand={targetBand} domains={domains} libraryCounts={libraryCounts} />
}
