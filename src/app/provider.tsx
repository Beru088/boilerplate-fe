'use client'
import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryConfig } from '@/lib/react-query'
import { ThemeProvider } from '@/components/themeProvider'
import { Toaster } from 'sonner'
import GlobalAuthHandler from '@/components/auth/global-auth-handler'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <GlobalAuthHandler>
          {children}
          <Toaster position='top-right' richColors />
          {process.env.NEXT_PUBLIC_ENV !== 'PROD' && <ReactQueryDevtools initialIsOpen={false} />}
        </GlobalAuthHandler>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
