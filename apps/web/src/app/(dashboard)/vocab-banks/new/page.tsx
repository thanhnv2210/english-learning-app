import { NewBankForm } from './new-bank-form'

export default function NewBankPage() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Vocabulary Bank</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a topic and let AI generate 15–20 key IELTS vocabulary items for it.
        </p>
      </div>
      <NewBankForm />
    </div>
  )
}
