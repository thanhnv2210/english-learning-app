import { UnlockPageTrigger } from '@/components/unlock-page-trigger'

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnlockPageTrigger href="/reading" />
      {children}
    </>
  )
}
