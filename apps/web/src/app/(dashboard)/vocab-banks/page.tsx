import Link from 'next/link'
import { getAllBanks } from '@/lib/db/vocab-banks'
import { getCurrentUser } from '@/lib/db/user'
import { BankList } from './bank-list'

export default async function VocabBanksPage() {
  const user = await getCurrentUser()
  const banks = await getAllBanks(user.id, user.role === 'admin', user.showSystemData)

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

      {banks.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No vocabulary banks yet.{!user.showSystemData && ' Enable system data in Settings to browse the built-in banks, or'} Create your first bank with the button above.
        </p>
      )}
      <BankList initialBanks={banks} />
    </div>
  )
}
