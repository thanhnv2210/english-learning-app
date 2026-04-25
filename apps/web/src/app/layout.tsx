import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IELTS 6.5 Accelerator',
  description: 'IELTS preparation tool for software engineers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Prevent flash of unstyled content — runs before hydration */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
