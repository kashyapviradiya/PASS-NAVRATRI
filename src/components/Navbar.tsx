'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, ChevronDown } from 'lucide-react';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isScanRoute = pathname?.startsWith('/scan');
  
  if (isAdminRoute || isScanRoute) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all py-2 duration-300 bg-navratri-card border-b border-navratri-border">
      <div className="w-full px-4 md:px-6 flex justify-between items-center min-h-[50px]">
        
        {/* Left Side: Logo & Mobile City */}
        <div className="flex flex-col justify-center">
          <Link href="/" className="block">
            <img src="/brand/raaspass-logo.svg" alt="RaasPass Logo" className="h-[52px] md:h-[72px] w-auto object-contain scale-[1.15] md:scale-[1.25] origin-left mb-1.5 md:mb-0" />
          </Link>
          <button type="button" aria-label="Open city selection" className="md:hidden flex h-[18px] items-center gap-1 cursor-pointer group mt-0.5">
            <span className="text-[11px] font-[600] text-navratri-muted">Ahmedabad</span>
            <ChevronDown className="w-3 h-3 text-navratri-muted" />
          </button>
        </div>

        {/* Right Side: City, CTA, Icons */}
        <div className="flex gap-2 justify-center items-center">
          
          <div className="hidden md:flex h-[40px] px-4 rounded-[12px] items-center justify-center border border-navratri-border bg-navratri-softBg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-[14px] font-[600] text-navratri-dark">Ahmedabad</span>
            <ChevronDown className="w-4 h-4 text-navratri-dark ml-2" />
          </div>
          
          <Link href="/contact" className="hidden md:flex rounded-[12px] items-center bg-navratri-primary text-white text-[14px] font-[700] tracking-wide whitespace-nowrap cursor-pointer px-4 py-2 hover:opacity-90 transition-all shadow-sm">
            List Your Event
          </Link>
          
          <button type="button" aria-label="Search" className="flex w-[40px] h-[40px] rounded-[12px] justify-center items-center cursor-pointer bg-navratri-softBg border border-navratri-border hover:bg-gray-100 transition-colors">
            <Search className="w-[18px] h-[18px] text-navratri-dark" />
          </button>
          
          <Link href="/profile" aria-label="Log in" className="flex w-[40px] h-[40px] rounded-[12px] justify-center items-center cursor-pointer bg-navratri-softBg border border-navratri-border hover:bg-gray-100 transition-colors">
            <User className="w-[18px] h-[18px] text-navratri-dark" />
          </Link>

        </div>
      </div>
    </header>
  );
}
