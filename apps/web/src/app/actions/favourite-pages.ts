'use server'

import { getDefaultUser, toggleFavouritePage, reorderFavouritePages } from '@/lib/db/user'
import { revalidatePath } from 'next/cache'

export async function toggleFavouritePageAction(href: string): Promise<void> {
  const user = await getDefaultUser()
  await toggleFavouritePage(user.id, href)
  revalidatePath('/', 'layout')
}

export async function reorderFavouritePagesAction(orderedPages: string[]): Promise<void> {
  const user = await getDefaultUser()
  await reorderFavouritePages(user.id, orderedPages)
  revalidatePath('/', 'layout')
}
