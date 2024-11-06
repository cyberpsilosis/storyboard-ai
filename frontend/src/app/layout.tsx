import { Providers } from '../providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Storyboard',
  description: 'Create storyboards with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 