'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
// Logo import
import logoImg from '../../logo 1.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'My Tickets', href: '/my-tickets' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b ${
      scrolled
        ? 'shadow-sm border-gray-100 py-2' 
        : 'border-gray-50 py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src={logoImg.src} 
              alt="Raas Pass Logo" 
              className={`h-10 w-auto object-contain transition-all duration-300 drop-shadow-sm`} 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-[15px] font-[700] tracking-wide transition-colors text-[#111111] hover:text-[#E53935]`}>
                {link.name}
              </Link>
            ))}
            <Link href="/events" className="ml-2 px-7 py-2.5 bg-[#E53935] text-white font-[700] rounded-xl hover:shadow-[0_8px_16px_-6px_rgba(229,57,53,0.4)] hover:-translate-y-0.5 transition-all duration-300 text-[15px]">
              Book Pass
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 transition-colors text-[#111111]`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 pt-2 pb-8 space-y-2 shadow-inner">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-[#111111] hover:bg-gray-50 hover:text-[#E53935] rounded-xl font-[800] transition-colors">
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 px-4">
                <Link href="/events" onClick={() => setIsOpen(false)} className="block w-full text-center px-6 py-4 bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-[800] rounded-xl shadow-lg shadow-red-500/20">
                  Book Pass
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
