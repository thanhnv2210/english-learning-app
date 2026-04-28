import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { WritingTask1 } from './writing-task1'

export default async function WritingTask1Page() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)

  return <WritingTask1 targetBand={targetBand} />
}
