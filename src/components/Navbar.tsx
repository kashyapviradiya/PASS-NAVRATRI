'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, X } from 'lucide-react';
import GlobalSearch from './GlobalSearch';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const isAdminRoute = pathname?.startsWith('/admin');
  const isScanRoute = pathname?.startsWith('/scan');
  
  if (isAdminRoute || isScanRoute) return null;

  const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'For Organizers', href: '/for-organizers' },
    { name: 'Help', href: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-navratri-bg/95 backdrop-blur-md border-b border-navratri-border h-16">
        <nav className="w-full h-full px-4 md:px-6 flex justify-between items-center max-w-[1440px] mx-auto">
          
          {/* Left Side: Logo */}
          <div className="flex-shrink-0 flex items-center h-full">
            <Link href="/" className="flex items-center h-full">
              <img src="/brand/raaspass-logo.svg" alt="RaasPass Logo" className="h-[36px] md:h-[44px] w-auto object-contain" />
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex h-full items-center justify-center absolute left-1/2 -translate-x-1/2">
            <ul className="flex space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-[15px] font-medium transition-colors hover:text-navratri-primary ${
                        isActive ? 'text-navratri-primary' : 'text-navratri-text'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Side: Icons & CTA */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              type="button" 
              onClick={() => setSearchOpen(true)}
              aria-label="Search" 
              className="flex w-10 h-10 rounded-full justify-center items-center text-navratri-text hover:bg-black/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link 
              href="/profile" 
              aria-label="Profile" 
              className="hidden md:flex w-10 h-10 rounded-full justify-center items-center text-navratri-text hover:bg-black/5 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link 
              href="/events" 
              className="hidden md:flex items-center justify-center bg-navratri-primary text-white text-[15px] font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Find Events
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden flex w-10 h-10 rounded-full justify-center items-center text-navratri-text hover:bg-black/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
        
        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-navratri-bg border-b border-navratri-border shadow-md">
            <ul className="flex flex-col px-4 py-4 space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-[16px] font-medium transition-colors ${
                        isActive ? 'text-navratri-primary' : 'text-navratri-text'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-4 border-t border-navratri-border/50">
                <Link 
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-[16px] font-medium text-navratri-text"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
              </li>
              <li className="pt-2">
                <Link 
                  href="/events" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center bg-navratri-primary text-white text-[16px] font-semibold py-3 rounded-full hover:opacity-90 transition-opacity w-full"
                >
                  Find Events
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
      
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
