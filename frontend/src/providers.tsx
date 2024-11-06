'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { SessionProvider } from './contexts/session-context'
import { CreditsProvider } from './contexts/credits-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <NextThemeProvider attribute="class" defaultTheme="dark">
        <SessionProvider>
          <CreditsProvider>
            {children}
          </CreditsProvider>
        </SessionProvider>
      </NextThemeProvider>
    </ReduxProvider>
  )
} 