import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vibecheckmood.me'),
  title: 'Vibe Check ⚡ — One Outfit. One Meal. One Watch.',
  description: 'Instant daily decisions for Gen-Z. Weather-synced, mood-aligned, connected with Zara, H&M, Myntra, ASOS, Uniqlo, Snitch and restaurant reservations.',
  openGraph: {
    title: 'Vibe Check ⚡',
    description: 'No scrolling. Just vibes. Daily outfit, meal, and watch in under 10 seconds.',
    url: 'https://vibecheckmood.me',
    siteName: 'Vibe Check',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe Check ⚡',
    description: 'No scrolling. Just vibes. What to wear, eat, and watch.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white min-h-screen relative flex flex-col selection:bg-violet-500 selection:text-white`}>
        {/* Floating Moving Aurora Mesh Blobs */}
        <div className="aurora-bg">
          <div className="aurora-blob blob-1" />
          <div className="aurora-blob blob-2" />
          <div className="aurora-blob blob-3" />
        </div>

        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
