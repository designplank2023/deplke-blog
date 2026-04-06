import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.deplke.com';
const blogTitle = process.env.NEXT_PUBLIC_BLOG_TITLE || '디자인플랜케이 블로그';
const blogDescription = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || 'AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 정보를 공유합니다';

export const metadata: Metadata = {
  title: {
    default: blogTitle,
    template: `%s | ${blogTitle}`,
  },
  description: blogDescription,
  keywords: ['AI', '개발', '교육', '광고', '마케팅', '커리어', '기술', '블로그'],
  authors: [{ name: '디자인플랜케이' }],
  creator: '디자인플랜케이',
  publisher: '디자인플랜케이',
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
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: blogTitle,
    title: blogTitle,
    description: blogDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: blogTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: blogTitle,
    description: blogDescription,
    images: [`${siteUrl}/og-image.png`],
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-sans">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: siteUrl,
              name: blogTitle,
              description: blogDescription,
              inLanguage: 'ko',
            }),
          }}
        />
      </body>
    </html>
  );
}
