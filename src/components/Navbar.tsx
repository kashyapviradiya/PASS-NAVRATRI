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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all py-3 duration-300 bg-[#1E1B4B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-[40px]">
        
        {/* Left Side: Logo & Mobile City */}
        <div className="flex flex-col">
          <Link href="/" className="block">
            <span className="text-[20px] font-display font-[850] tracking-tight text-white">RaasPass</span>
          </Link>
          <button type="button" aria-label="Open city selection" className="md:hidden mt-0.5 flex h-[20px] items-center gap-1 cursor-pointer group">
            <span className="text-[12px] font-[600] text-white/80">Ahmedabad</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>

        {/* Right Side: City, CTA, Icons */}
        <div className="flex gap-2 justify-center items-center">
          
          <div className="hidden md:flex h-[40px] px-4 rounded-[12px] items-center justify-center border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <span className="text-[14px] font-[600] text-white">Ahmedabad</span>
            <ChevronDown className="w-4 h-4 text-white ml-2" />
          </div>
          
          <Link href="/contact" className="hidden md:flex rounded-[12px] items-center bg-white text-[#1E1B4B] text-[14px] font-[700] tracking-wide whitespace-nowrap cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors">
            List Your Event
          </Link>
          
          <button type="button" aria-label="Search" className="flex w-[40px] h-[40px] rounded-[12px] justify-center items-center cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Search className="w-[18px] h-[18px] text-white/90" />
          </button>
          
          <Link href="/profile" aria-label="Log in" className="flex w-[40px] h-[40px] rounded-[12px] justify-center items-center cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <User className="w-[18px] h-[18px] text-white/90" />
          </Link>

        </div>
      </div>
    </header>
  );
}
