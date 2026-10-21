import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { MicrosoftClarity } from '@/components/MicrosoftClarity'

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
  description:
    'Instant daily decisions for Gen-Z. Weather-synced, mood-aligned, connected with Zara, H&M, Myntra, ASOS, Uniqlo, Snitch and restaurant reservations.',
  keywords: [
    'vibe check',
    'outfit generator',
    'what to wear',
    'what to eat',
    'what to watch',
    'gen z lifestyle',
    'daily ritual',
    'zara fashion',
    'h&m styles',
    'restaurant recommendations',
  ],
  authors: [{ name: 'Vibe Check' }],
  creator: 'Vibe Check',
  publisher: 'Vibe Check',
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      'fRjW9Kj-vibecheckmood-google-verification',
  },
  openGraph: {
    title: 'Vibe Check ⚡',
    description: 'No scrolling. Just vibes. Daily outfit, meal, and watch in under 10 seconds.',
    url: 'https://vibecheckmood.me',
    siteName: 'Vibe Check',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Vibe Check — Daily Outfit, Meal & Watch',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe Check ⚡ — No scrolling. Just vibes.',
    description: 'Daily outfit, meal, and watch in under 10 seconds.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: 'https://vibecheckmood.me',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Structured JSON-LD schema for Google Search Console & SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vibe Check',
    url: 'https://vibecheckmood.me',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    description:
      'Zero-decision daily ritual: pick your mood, sync live weather, and get one outfit, meal, and watch in seconds.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white min-h-screen relative flex flex-col selection:bg-violet-500 selection:text-white`}
      >
        {/* Floating Moving Aurora Mesh Blobs */}
        <div className="aurora-bg">
          <div className="aurora-blob blob-1" />
          <div className="aurora-blob blob-2" />
          <div className="aurora-blob blob-3" />
        </div>

        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col">{children}</div>

        {/* Microsoft Clarity analytics tracking */}
        <MicrosoftClarity />
      </body>
    </html>
  )
}
