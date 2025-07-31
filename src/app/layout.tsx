import './globals.css'
import type { Metadata } from 'next'
import { AppProvider } from './provider'
import { Figtree } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
})

export const metadata: Metadata = {
  icons: '/images/favicon.ico',
  title: 'Historia',
  description: 'Historia is a platform for managing and exploring Samudera Asset Archive'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={figtree.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
