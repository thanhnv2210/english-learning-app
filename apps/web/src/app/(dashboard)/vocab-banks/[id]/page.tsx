import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBankById, getWordsByBankId } from '@/lib/db/vocab-banks'
import { BankView } from './bank-view'

export default async function BankDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bankId = parseInt(id, 10)
  if (isNaN(bankId)) notFound()

  const [bank, words] = await Promise.all([getBankById(bankId), getWordsByBankId(bankId)])
  if (!bank) notFound()

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <Link
          href="/vocab-banks"
          className="mt-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Banks
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground capitalize">{bank.topic}</h1>
          {bank.description && (
            <p className="mt-1 text-sm text-muted-foreground">{bank.description}</p>
          )}
        </div>
      </div>

      <BankView bank={bank} initialWords={words} />
    </div>
  )
}
