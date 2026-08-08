'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isScanRoute = pathname?.startsWith('/scan');
  const isOrganizerRoute = pathname?.startsWith('/organizer');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isAdminRoute || isScanRoute || isOrganizerRoute || pathname?.startsWith('/staff')) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar mobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setIsMobileMenuOpen} />
      <main className="pt-[56px] flex-grow pb-[60px] md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="flex-grow flex flex-col min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileBottomNav onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
    </>
  );
}
