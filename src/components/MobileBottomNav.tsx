'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, Menu as MenuIcon } from 'lucide-react';

export default function MobileBottomNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Compass },
    { name: 'Tickets', href: '/my-tickets', icon: Ticket },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[60px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isActive ? 'text-navratri-primary scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-[22px] h-[22px] ${isActive ? 'fill-navratri-primary/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] tracking-wide ${isActive ? 'font-[800]' : 'font-[600]'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400 hover:text-slate-600 transition-all"
        >
          <MenuIcon className="w-[22px] h-[22px]" strokeWidth={2} />
          <span className="text-[10px] tracking-wide font-[600]">Menu</span>
        </button>
      </div>
    </div>
  );
}
