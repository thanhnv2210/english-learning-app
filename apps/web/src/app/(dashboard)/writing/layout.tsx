import { UnlockPageTrigger } from '@/components/unlock-page-trigger'

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnlockPageTrigger href="/writing" />
      {children}
    </>
  )
}
