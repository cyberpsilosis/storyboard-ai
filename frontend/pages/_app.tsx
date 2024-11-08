import React from 'react'
import type { AppProps } from 'next/app'
import { Providers } from '../src/providers'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  )
} 