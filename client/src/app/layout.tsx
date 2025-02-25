import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import './globals.css';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vorcl Test Task',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-dvh bg-[#121212] antialiased`}>
        <Header>
          <Navigation />
        </Header>
        <main className="px-20">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
