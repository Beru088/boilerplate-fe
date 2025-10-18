import './globals.css'
import type { Metadata } from 'next'
import { AppProvider } from './provider'
import { Figtree } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree'
})

export const metadata: Metadata = {
  icons: '/images/favicon.ico',
  title: 'Samudera Cockpit',
  description: 'Cockpit is a platform for managing and exploring Samudera Data Dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${figtree.variable} font-sans`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
