import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://f2analytics.com'),
  title: {
    default: 'Formula 2 Analytics - Comprehensive F2 Racing Statistics & Analysis',
    template: '%s | Formula 2 Analytics'
  },
  description: 'Get real-time Formula 2 championship statistics, driver performance analysis, and race insights. Your comprehensive platform for F2 racing analytics.',
  keywords: ['Formula 2', 'F2 Racing', 'Motorsport Analytics', 'Driver Statistics', 'Race Analysis', 'F2 Championship'],
  authors: [{ name: 'Ben' }],
  creator: 'Ben',
  publisher: 'Formula 2 Analytics',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://f2analytics.com',
    title: 'Formula 2 Analytics - Comprehensive F2 Racing Statistics & Analysis',
    description: 'Get real-time Formula 2 championship statistics, driver performance analysis, and race insights. Your comprehensive platform for F2 racing analytics.',
    siteName: 'Formula 2 Analytics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formula 2 Analytics - F2 Racing Statistics & Analysis',
    description: 'Get real-time Formula 2 championship statistics, driver performance analysis, and race insights.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
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
        <link rel="canonical" href="https://f2analytics.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} overflow-y-auto`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen bg-background">
            <Sidebar />
            <div className="min-h-screen w-full md:pl-[248px]">
              <main className="w-full pt-24 md:pt-8 px-4 md:px-6 pb-8">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}