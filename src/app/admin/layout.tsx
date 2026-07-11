'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, CalendarDays, Ticket, Users, 
  Settings, LogOut, Sparkles, Menu, X, Bell, Search
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not show sidebar on login page
  if (pathname === '/admin/login') {
    return <div className="bg-navratri-bg min-h-screen">{children}</div>;
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events Hub', href: '/admin/events', icon: CalendarDays },
    // Later we can add Orders, Check-ins, Organizers
  ];

  return (
    <div className="min-h-screen bg-navratri-bg font-sans flex flex-col md:flex-row">
      
      {/* Mobile Header & Menu Toggle */}
      <div className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navratri-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-navratri-gold" />
          </div>
          <span className="font-serif font-bold text-navratri-text text-lg leading-none">PASS<br/><span className="text-[10px] text-gray-400 tracking-widest uppercase font-sans">Admin</span></span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 bg-gray-50 rounded-lg">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-40 shadow-sm transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-navratri-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-navratri-gold" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-navratri-text leading-tight">PASS NAVRATRI</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-navratri-primary text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-navratri-primary'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link href="/" target="_blank" className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
            View Public Site
          </Link>
          <button onClick={() => router.push('/admin/login')} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 items-center justify-between shrink-0">
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-96">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Search events, bookings..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-navratri-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-navratri-text leading-none">Super Admin</p>
                <p className="text-xs text-gray-400 font-medium mt-1">admin@passnavratri.com</p>
              </div>
              <div className="w-10 h-10 bg-navratri-gold/20 rounded-full flex items-center justify-center border border-navratri-gold/30">
                <span className="font-serif font-bold text-navratri-gold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
