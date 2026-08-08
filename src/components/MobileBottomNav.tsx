'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, Menu as MenuIcon, PlusCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/events', icon: Compass },
  ];
  
  const rightItems = [
    { name: 'Tickets', href: '/my-tickets', icon: Ticket },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between h-[56px] px-2">
        {/* Left Items */}
        <div className="flex flex-1 justify-around h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive 
                    ? 'text-navratri-primary' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] tracking-wide ${
                  isActive ? 'font-[700]' : 'font-[600]'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Center Emphasized Host Action */}
        <div className="flex shrink-0 justify-center px-1">
          <Link
            href="/contact"
            className="flex flex-col items-center justify-center -mt-4"
          >
            <div className="w-[46px] h-[46px] bg-gray-900 rounded-full flex items-center justify-center shadow-md border-[4px] border-white active:scale-95 transition-transform">
              <PlusCircle className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-[9px] tracking-wide font-[700] mt-0.5 text-gray-900">Host</span>
          </Link>
        </div>

        {/* Right Items */}
        <div className="flex flex-1 justify-around h-full">
          {rightItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive 
                    ? 'text-navratri-primary' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] tracking-wide ${
                  isActive ? 'font-[700]' : 'font-[600]'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              pathname === '/profile' 
                ? 'text-navratri-primary' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname === '/profile' ? 'scale-110' : ''}`} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
            <span className={`text-[9px] tracking-wide ${pathname === '/profile' ? 'font-[700]' : 'font-[600]'}`}>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
