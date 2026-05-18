import { UnlockPageTrigger } from '@/components/unlock-page-trigger'

export default function CollocationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnlockPageTrigger href="/collocations" />
      {children}
    </>
  )
}
