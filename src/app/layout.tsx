import type { Metadata } from 'next';
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
  title: 'hit2u.store — Pokémon TCG Pack Opening & AI Real-Time Valuation',
  description: 'Sube videos de apertura de sobres de cartas Pokémon. La IA reconoce automáticamente las cartas y busca su valor en TCGPlayer, PriceCharting y eBay en tiempo real.',
  keywords: ['Pokemon TCG', 'Pack Opening', 'AI Card Scanner', 'TCGPlayer', 'PriceCharting', 'hit2u.store', 'PSA Grading'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070a0f] text-slate-100">{children}</body>
    </html>
  );
}
