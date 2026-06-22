import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import CookieConsent from '@/components/CookieConsent'
import BackToTop from '@/components/BackToTop'

const SITE_URL = 'https://openinsight.in'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OpenInsight | Precision Clinical AI for Indian Doctors',
    template: '%s | OpenInsight',
  },
  description:
    'OpenInsight is an AI-powered clinical decision support platform for Indian doctors. Evidence-backed answers grounded in ICMR guidelines, CDSCO approvals, NTEP protocols, and India-specific clinical evidence — at the point of care.',
  applicationName: 'OpenInsight',
  authors: [{ name: 'SentArc Labs', url: SITE_URL }],
  creator: 'SentArc Labs',
  publisher: 'SentArc Labs',
  keywords: [
    'clinical AI India',
    'AI for doctors India',
    'clinical decision support',
    'ICMR guidelines',
    'CDSCO drug database',
    'NTEP protocols',
    'evidence-based medicine India',
    'medical AI assistant',
    'Indian healthcare AI',
    'differential diagnosis AI',
    'drug interaction checker India',
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
    title: 'OpenInsight | Precision Clinical AI for Indian Doctors',
    description:
      'Clinical knowledge when it matters most. AI-powered clinical decision support built on ICMR guidelines, CDSCO approvals, and Indian clinical evidence.',
    url: SITE_URL,
    siteName: 'OpenInsight',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/logos/DarkGrey.png',
        width: 1200,
        height: 630,
        alt: 'OpenInsight — Precision Clinical AI for Indian Doctors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenInsight | Precision Clinical AI for Indian Doctors',
    description:
      'Clinical knowledge when it matters most. Evidence-backed AI assistant built on ICMR, CDSCO, and NTEP for Indian healthcare.',
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
      { url: '/logos/DarkGrey.png', type: 'image/png' },
    ],
    apple: '/logos/DarkGrey.png',
    shortcut: '/logos/DarkGrey.png',
  },
  manifest: undefined,
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
    'AI-powered clinical decision support platform for Indian doctors, delivering evidence-backed answers grounded in ICMR guidelines, CDSCO approvals, NTEP protocols, and India-specific clinical evidence.',
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
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  knowsAbout: [
    'Clinical decision support',
    'Evidence-based medicine',
    'ICMR guidelines',
    'CDSCO drug approvals',
    'NTEP protocols',
    'Indian healthcare',
    'Artificial intelligence in medicine',
    'Retrieval-augmented generation',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@openinsight.in',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@openinsight.in',
      areaServed: 'IN',
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
        <meta
          name="keywords"
          content="clinical AI India, AI for doctors India, clinical decision support, ICMR guidelines, CDSCO drug database, NTEP protocols, evidence-based medicine India, medical AI assistant, Indian healthcare AI, differential diagnosis AI, drug interaction checker India, PubMed clinical search, Cochrane reviews, doctor decision support, point of care AI"
        />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/logos/DarkGrey.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/DarkGrey.png" />
        <link rel="shortcut icon" href="/logos/DarkGrey.png" />
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
        <AnnouncementBanner />
        <Nav />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  )
}
