import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToasterWrapper from '@/components/ToasterWrapper';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'RasPass | Premium Event Ticketing',
  description: 'Book your passes for the best events. Premium, secure, and fast ticketing experience.',
  keywords: 'events, tickets, booking, pass, premium, concerts, nightlife',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className={`font-sans min-h-screen flex flex-col bg-[#F8F7F4] text-[#111111]`}>
        <ToasterWrapper />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
