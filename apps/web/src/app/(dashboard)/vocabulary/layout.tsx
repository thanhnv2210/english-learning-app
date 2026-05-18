import { UnlockPageTrigger } from '@/components/unlock-page-trigger'

export default function VocabularyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnlockPageTrigger href="/vocabulary" />
      {children}
    </>
  )
}
