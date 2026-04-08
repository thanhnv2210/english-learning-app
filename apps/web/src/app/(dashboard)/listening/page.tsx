import { getDefaultUser } from '@/lib/db/user'
import { getUserDomains } from '@/lib/db/domains'
import { getListeningLibraryCounts } from '@/lib/db/listening'
import { parseTargetBand } from '@/lib/db/user'
import { ListeningTask } from './listening-task'

export default async function ListeningPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const [domains, libraryCounts] = await Promise.all([
    getUserDomains(user.id),
    getListeningLibraryCounts(),
  ])

  return <ListeningTask domains={domains} targetBand={targetBand} libraryCounts={libraryCounts} />
}
