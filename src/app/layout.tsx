import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, Pixelify_Sans, Nunito, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
})

// Farm theme faces — titles/labels (Pixelify), body (Nunito), data/meta (Plex Mono)
const pixelify = Pixelify_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-pixelify',
})
const nunito = Nunito({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nunito',
})
const plexMono = IBM_Plex_Mono({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: "Ojan's Farm — Muhammad Fauzan Ramadhan",
  description:
    'Software Engineer specializing in backend systems, fintech, and full-stack development — explored as a Stardew Valley farm.',
  icons: {
    icon: '/ojantigakali-animated-round.gif',
  },
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
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${pressStart.variable} ${pixelify.variable} ${nunito.variable} ${plexMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
