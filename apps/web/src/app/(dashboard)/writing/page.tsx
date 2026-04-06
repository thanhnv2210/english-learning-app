import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getUserDomains } from '@/lib/db/domains'
import { WritingTask } from './writing-task'

export default async function WritingPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const domains = await getUserDomains(user.id)

  return <WritingTask targetBand={targetBand} domains={domains} />
}
