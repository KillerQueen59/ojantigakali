import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
})

export const metadata: Metadata = {
  title: 'Muhammad Fauzan Ramadhan | Portfolio',
  description: 'Software Engineer specializing in backend systems, fintech, and full-stack development.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={pressStart.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
