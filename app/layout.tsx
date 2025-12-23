import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Kurs Dünyası',
    default: 'Kurs Dünyası - Online Eğitim Platformu',
  },
  description: 'En iyi kurslar, sınavlar ve topluluk ile kariyerinizi ilerletin.',
  keywords: ['nextjs', 'react', 'eğitim', 'online kurs', 'lms'],
  authors: [{ name: 'Kurs Dünyası Ekibi' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://kursdunyasi.com',
    title: 'Kurs Dünyası',
    description: 'Online Eğitim Platformu',
    siteName: 'Kurs Dünyası',
  }
};

export const viewport: Viewport = {
  themeColor: 'white',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents zooming on inputs in iOS
}

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
