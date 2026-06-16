import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'OpenInsight | Precision Clinical AI for Indian Doctors',
  description: 'Clinical knowledge when it matters most. Evidence-backed AI assistant for Indian healthcare professionals.',
  icons: {
    icon: '/logos/DarkGrey.png',
  },
  openGraph: {
    title: 'OpenInsight | Precision Clinical AI',
    description: 'Clinical knowledge when it matters most.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1C1B1A" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
