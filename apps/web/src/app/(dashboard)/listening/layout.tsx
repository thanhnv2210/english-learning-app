import { UnlockPageTrigger } from '@/components/unlock-page-trigger'

export default function ListeningLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnlockPageTrigger href="/listening" />
      {children}
    </>
  )
}
