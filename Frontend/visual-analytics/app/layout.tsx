import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Visual Experience Analytics - AI-Powered Website Analysis',
  description: 'Transform your website\'s visual experience with AI-powered accessibility, readability, and attention analysis. Get comprehensive insights and actionable recommendations.',
  keywords: ['website analysis', 'accessibility', 'visual analytics', 'AI', 'UX', 'design'],
  authors: [{ name: 'Visual Experience Analytics' }],
  creator: 'Visual Experience Analytics',
  publisher: 'Visual Experience Analytics',
  robots: 'index, follow',
  openGraph: {
    title: 'Visual Experience Analytics - AI-Powered Website Analysis',
    description: 'Transform your website\'s visual experience with AI-powered accessibility, readability, and attention analysis.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visual Experience Analytics',
    description: 'AI-powered website analysis for accessibility, readability, and visual attention.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
