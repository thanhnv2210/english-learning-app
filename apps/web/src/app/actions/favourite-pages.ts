'use server'

import { getDefaultUser } from '@/lib/db/user'
import { toggleFavouritePage } from '@/lib/db/user'
import { revalidatePath } from 'next/cache'

export async function toggleFavouritePageAction(href: string): Promise<void> {
  const user = await getDefaultUser()
  await toggleFavouritePage(user.id, href)
  revalidatePath('/', 'layout')
}
