import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { WritingTask } from './writing-task'

export default async function WritingPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)

  return <WritingTask targetBand={targetBand} />
}
