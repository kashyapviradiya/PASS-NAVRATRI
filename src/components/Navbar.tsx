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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-navratri-primary/95 backdrop-blur-md shadow-sm border-b border-white/5 py-2' 
        : 'bg-navratri-primary border-b border-transparent py-3'
    }`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src={logoImg.src} 
              alt="RasPass Logo" 
              className={`h-9 w-auto object-contain transition-all duration-300 drop-shadow-sm brightness-0 invert`} 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-[14px] font-[600] tracking-wide transition-colors text-navratri-lightGrey hover:text-white`}>
                {link.name}
              </Link>
            ))}
            <Link href="/events" className="ml-4 px-6 py-2.5 bg-navratri-accent text-white font-[700] rounded-button hover:bg-navratri-darkAccent transition-all duration-300 text-[14px] shadow-sm">
              Explore Events
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/events" className="px-4 py-2 bg-navratri-accent text-white font-[700] rounded-lg hover:bg-navratri-darkAccent transition-colors text-[13px] shadow-sm">
              Explore
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className={`p-1.5 transition-colors text-white`}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navratri-secondary border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 pt-2 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-navratri-bg hover:bg-white/5 hover:text-white rounded-xl font-[600] transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
