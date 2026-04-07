import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { SpeakingSession } from './speaking-session'

export default async function SpeakingSessionPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  return <SpeakingSession targetBand={targetBand} />
}
