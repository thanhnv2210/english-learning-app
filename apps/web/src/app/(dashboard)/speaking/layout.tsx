import { UnlockPageTrigger } from '@/components/unlock-page-trigger'

export default function SpeakingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnlockPageTrigger href="/speaking" />
      {children}
    </>
  )
}
