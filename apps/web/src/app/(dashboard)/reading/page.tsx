import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getUserDomains } from '@/lib/db/domains'
import { ReadingTask } from './reading-task'

export default async function ReadingPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const domains = await getUserDomains(user.id)

  return <ReadingTask targetBand={targetBand} domains={domains} />
}
