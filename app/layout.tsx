import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import CookieConsent from '@/components/CookieConsent'
import BackToTop from '@/components/BackToTop'
import { PostHogProviderWrapper } from '@/lib/posthog/provider'
import { ClarityScript } from '@/lib/clarity/script'

const SITE_URL = 'https://openinsight.in'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OpenInsight | AI Medical Search for Clinicians',
    template: '%s | OpenInsight',
  },
  description:
    'OpenInsight is an AI-powered medical search engine and clinical decision-support tool for healthcare professionals. Evidence-backed answers grounded in clinical guidelines, drug databases, and peer-reviewed literature — at the point of care.',
  applicationName: 'OpenInsight',
  authors: [{ name: 'SentArc Labs', url: SITE_URL }],
  creator: 'SentArc Labs',
  publisher: 'SentArc Labs',
  keywords: [
    'clinical AI',
    'AI for doctors',
    'clinical decision support',
    'medical search engine',
    'ICMR guidelines',
    'CDSCO drug database',
    'NTEP protocols',
    'FDA drug labels',
    'NICE guidelines',
    'WHO guidelines',
    'evidence-based medicine',
    'medical AI assistant',
    'healthcare AI',
    'differential diagnosis AI',
    'drug interaction checker',
    'PubMed clinical search',
    'Cochrane reviews',
    'doctor decision support',
    'point of care AI',
  ],
  category: 'Healthcare Technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OpenInsight | AI Medical Search for Clinicians',
    description:
      'Clinical knowledge when it matters most. Evidence-backed AI search for healthcare professionals.',
    url: SITE_URL,
    siteName: 'OpenInsight',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/logos/DarkGrey.png',
        width: 1200,
        height: 630,
        alt: 'OpenInsight — AI Medical Search for Clinicians',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenInsight | AI Medical Search for Clinicians',
    description:
      'Clinical knowledge when it matters most. Evidence-backed AI search for healthcare professionals.',
    images: ['/logos/DarkGrey.png'],
    creator: '@openinsight',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon/favicon-64.png', type: 'image/png', sizes: '64x64' },
      { url: '/favicon/favicon-128.png', type: 'image/png', sizes: '128x128' },
      { url: '/favicon/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon/favicon-256.png', type: 'image/png', sizes: '256x256' },
      { url: '/favicon/favicon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'Organization'],
  '@id': `${SITE_URL}/#organization`,
  name: 'OpenInsight',
  alternateName: 'SentArc Labs OpenInsight',
  description:
    'AI-powered medical search engine and clinical decision-support tool for healthcare professionals, delivering evidence-backed answers grounded in clinical guidelines, drug databases, and peer-reviewed literature.',
  url: SITE_URL,
  logo: `${SITE_URL}/logos/DarkGrey.png`,
  image: `${SITE_URL}/logos/DarkGrey.png`,
  slogan: 'Clinical knowledge, when it matters most.',
  foundingDate: '2024',
  founder: {
    '@type': 'Person',
    name: 'Aditya Singh',
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'SentArc Labs',
    },
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'SentArc Labs',
    url: SITE_URL,
    foundingLocation: {
      '@type': 'Place',
      name: 'Pune, India',
    },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  knowsAbout: [
    'Clinical decision support',
    'Evidence-based medicine',
    'ICMR guidelines',
    'CDSCO drug approvals',
    'NTEP protocols',
    'FDA drug labels',
    'NICE guidelines',
    'WHO guidelines',
    'Clinical medicine',
    'Artificial intelligence in medicine',
    'Retrieval-augmented generation',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@openinsight.in',
      availableLanguage: ['English', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@openinsight.in',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
  sameAs: [
    'https://twitter.com/openinsight',
    'https://linkedin.com/company/openinsight',
    'https://github.com/openinsight',
  ],
  potentialAction: {
    '@type': 'Action',
    target: `${SITE_URL}/early-access`,
    name: 'Request Early Access',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'OpenInsight',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1C1B1A" />
        <meta name="author" content="SentArc Labs" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon-48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="sitemap" href="/sitemap.xml" />
        <meta name="format-detection" content="telephone=no, address=no, email=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <ClarityScript />
        <PostHogProviderWrapper>
          <AnnouncementBanner />
          <Nav />
          <main>{children}</main>
          <Footer />
          <BackToTop />
          <CookieConsent />
        </PostHogProviderWrapper>
      </body>
    </html>
  )
}
