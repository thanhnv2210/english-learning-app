'use server'

import { revalidatePath } from 'next/cache'
import { upsertCampaignConfig, getCampaignConfig, autoApprovePendingUsers } from '@/lib/db/campaign'

export async function updateCampaignConfigAction(data: {
  isActive: boolean
  userLimit: number
}): Promise<void> {
  const current = await getCampaignConfig()

  await upsertCampaignConfig(data)

  // Auto-approve pending users when limit increases (or config is first created)
  const prevLimit = current?.userLimit ?? 0
  if (data.isActive && data.userLimit > prevLimit) {
    await autoApprovePendingUsers(data.userLimit)
  }

  revalidatePath('/admin/campaign')
  revalidatePath('/admin/users')
}
