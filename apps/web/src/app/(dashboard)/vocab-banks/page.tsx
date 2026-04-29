import Link from 'next/link'
import { getAllBanks } from '@/lib/db/vocab-banks'
import { BankList } from './bank-list'

export default async function VocabBanksPage() {
  const banks = await getAllBanks()

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vocabulary Banks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Focused word sets for IELTS topics. Browse any bank to study words, or generate a new topic with AI.
          </p>
        </div>
        <Link
          href="/vocab-banks/new"
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + New Bank
        </Link>
      </div>

      <BankList initialBanks={banks} />
    </div>
  )
}
