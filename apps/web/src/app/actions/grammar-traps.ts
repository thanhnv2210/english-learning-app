'use server'

import { deleteGrammarTrap, updateGrammarTrapRank } from '@/lib/db/grammar-traps'
import { revalidatePath } from 'next/cache'

export async function deleteGrammarTrapAction(id: number): Promise<void> {
  await deleteGrammarTrap(id)
  revalidatePath('/grammar-traps')
}

export async function updateGrammarTrapRankAction(id: number, rank: number): Promise<void> {
  await updateGrammarTrapRank(id, rank)
  revalidatePath('/grammar-traps')
}
