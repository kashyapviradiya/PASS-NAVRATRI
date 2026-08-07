'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Ticket } from 'lucide-react';
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
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-b border-white/20' 
        : 'bg-white/70 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px] sm:h-[76px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src={logoImg.src} 
              alt="RaasPass Logo" 
              className="h-9 sm:h-11 w-auto object-contain transition-all duration-300 transform group-hover:scale-[1.02]" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-[14px] tracking-wide transition-colors ${pathname === link.href ? 'text-navratri-primary font-[700]' : 'text-navratri-muted font-[600] hover:text-navratri-text'}`}>
                {link.name}
              </Link>
            ))}
            <Link href="/events" className="ml-4 px-6.5 py-2.5 bg-gradient-premium text-white font-[800] rounded-full hover:shadow-[0_8px_24px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-[14px] shadow-sm">
              Explore Events
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3.5 lg:hidden">
            <Link href="/events" className="px-5 py-2.5 bg-gradient-premium text-white font-[800] rounded-full hover:shadow-[0_8px_24px_rgba(124,58,237,0.25)] active:scale-95 transition-all text-[13px] shadow-sm flex items-center justify-center">
              Explore
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100/50 rounded-xl transition-all text-navratri-text flex items-center justify-center"
            >
              {isOpen ? <X className="w-5.5 h-5.5 text-navratri-text" /> : <Menu className="w-5.5 h-5.5 text-navratri-text" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden bg-white/95 backdrop-blur-xl border-b border-navratri-lightGrey transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 pt-3 pb-8 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3.5 rounded-xl transition-colors text-[15px] ${
                pathname === link.href 
                  ? 'text-navratri-primary font-[800] bg-navratri-primary/5' 
                  : 'text-navratri-muted font-[600] hover:bg-navratri-lightGrey/50 hover:text-navratri-text'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
