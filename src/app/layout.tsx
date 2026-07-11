import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToasterWrapper from '@/components/ToasterWrapper';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'PASS NAVRATRI | Premium Garba Event Booking',
  description: 'Book your Navratri passes for the best Garba events in Gujarat. Premium, secure, and fast ticketing experience.',
  keywords: 'navratri, garba, dandiya, gujarati, festival, tickets, booking, pass, ahmedabad, surat, vadodara',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`font-sans min-h-screen flex flex-col bg-[#F7F7F8] text-[#111111]`}>
        <ToasterWrapper />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
