'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isScanRoute = pathname?.startsWith('/scan');
  const isOrganizerRoute = pathname?.startsWith('/organizer');

  if (isAdminRoute || isScanRoute || isOrganizerRoute) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
