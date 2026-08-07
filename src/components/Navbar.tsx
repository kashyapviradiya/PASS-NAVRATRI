'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Ticket, Search, User, MapPin, ChevronDown } from 'lucide-react';
// Logo import
import logoImg from '../../logo 1.png';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (val: boolean) => void }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = mobileMenuOpen !== undefined ? mobileMenuOpen : internalIsOpen;
  const setIsOpen = setMobileMenuOpen !== undefined ? setMobileMenuOpen : setInternalIsOpen;
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
        ? 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] border-b border-gray-100' 
        : 'bg-white border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[56px] md:h-[64px]">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <img 
                src={logoImg.src} 
                alt="RaasPass Logo" 
                className="h-8 sm:h-10 w-auto object-contain transition-all duration-300 transform group-hover:scale-[1.02]" 
              />
            </Link>
            
            {/* Location Selector (Visual only as requested) */}
            <div className="hidden sm:flex md:hidden lg:flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full cursor-pointer transition-colors ml-2">
              <MapPin className="w-3.5 h-3.5 text-navratri-primary" />
              <span className="text-[12px] font-[700] text-navratri-text">Ahmedabad</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            {/* Extremely compact mobile location */}
            <div className="flex sm:hidden items-center gap-1 cursor-pointer transition-colors ml-1">
              <span className="text-[13px] font-[800] text-navratri-text tracking-tight">Ahmedabad</span>
              <ChevronDown className="w-3.5 h-3.5 text-navratri-primary" />
            </div>
          </div>

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

          {/* Mobile Actions - Compact Version */}
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-slate-600 hover:text-navratri-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <User className="w-4 h-4" />
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
