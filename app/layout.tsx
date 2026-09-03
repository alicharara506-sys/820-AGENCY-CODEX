import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agency-820.alicharara506.chatgpt.site'),
  title: '820 Agency — Creative Technology Agency',
  description: '820 builds brands, digital experiences, intelligent systems, and data-driven growth engines.',
  openGraph: {
    title: '820 Agency — Creative Technology Agency',
    description: 'We build the algorithm behind growth.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '820 Agency — We build the algorithm behind growth.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '820 Agency — Creative Technology Agency',
    description: 'We build the algorithm behind growth.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
