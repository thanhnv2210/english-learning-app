import { getAllGrammarTraps } from '@/lib/db/grammar-traps'
import { GrammarTrapsView } from './grammar-traps-view'

export default async function GrammarTrapsPage() {
  const entries = await getAllGrammarTraps()
  return <GrammarTrapsView initialEntries={entries} />
}
