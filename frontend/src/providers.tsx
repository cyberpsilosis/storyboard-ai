'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { SessionProvider } from './contexts/session-context'
import { CreditsProvider } from './contexts/credits-context'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  return (
    <ReduxProvider store={store}>
      <NextThemeProvider attribute="class" defaultTheme="dark">
        <SessionProvider session={session}>
          <CreditsProvider session={session}>
            {children}
          </CreditsProvider>
        </SessionProvider>
      </NextThemeProvider>
    </ReduxProvider>
  )
} 