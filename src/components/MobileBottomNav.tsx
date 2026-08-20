'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, User } from 'lucide-react';

export default function MobileBottomNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Compass },
    { name: 'Tickets', href: '/my-tickets', icon: Ticket },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? 'text-navratri-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon 
                className="w-5 h-5 mb-0.5" 
                strokeWidth={isActive ? 2.5 : 2} 
                fill={isActive ? 'currentColor' : 'none'} 
              />
              <span className="text-[10px] font-medium">
                {item.name}
              </span>
              <div className={`mt-0.5 w-1 h-1 rounded-full ${isActive ? 'bg-navratri-primary' : 'bg-transparent'}`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
