'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, CalendarDays, Ticket, Users, 
  Settings, LogOut, Sparkles, Menu, X, Bell, Search, ShieldAlert
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
    { name: 'Bookings', href: '/admin/bookings', icon: Ticket },
    { name: 'Audit Logs', href: '/admin/logs', icon: ShieldAlert },
    // Later we can add Organizers, etc.
  ];

  return (
    <div className="min-h-screen bg-navratri-bg font-sans flex flex-col md:flex-row selection:bg-navratri-accent selection:text-white">
      
      {/* Mobile Header & Menu Toggle */}
      <div className="md:hidden bg-[#0F172A] p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00E5FF]/10 rounded-[8px] flex items-center justify-center border border-[#00E5FF]/20">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <span className="font-display font-[700] text-white text-[18px] leading-none tracking-tight">RaasPass<br/><span className="text-[10px] text-slate-400 tracking-widest uppercase font-sans">Admin</span></span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 bg-white/5 rounded-[8px] hover:text-white transition-colors">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] flex flex-col z-40 shadow-xl transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#00E5FF] rounded-[12px] flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-[800] text-[20px] text-white leading-tight tracking-tight">RaasPass</h1>
            <p className="text-[10px] text-[#00E5FF] font-[800] tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all group ${
                  isActive 
                  ? 'bg-gradient-to-r from-[#7C3AED]/20 to-transparent text-[#00E5FF] border-l-4 border-[#00E5FF]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="font-[600] text-[14px]">{link.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0F172A]">
          <Link href="/" target="_blank" className="w-full flex items-center justify-center gap-2 bg-white/5 text-slate-300 px-4 py-3.5 rounded-[12px] text-[14px] font-[700] hover:bg-white/10 hover:text-white transition-colors border border-white/10">
            View Public Site
          </Link>
          <button onClick={() => router.push('/admin/login')} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 px-4 py-3.5 rounded-[12px] text-[14px] font-[700] hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-navratri-lightGrey/50 px-8 items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center bg-navratri-bg px-4 py-2.5 rounded-[16px] border border-navratri-lightGrey w-96 focus-within:ring-2 focus-within:ring-navratri-primary/30 focus-within:border-navratri-primary transition-all">
            <Search className="w-4 h-4 text-navratri-muted mr-3" />
            <input type="text" placeholder="Search events, bookings..." className="bg-transparent border-none outline-none text-[14px] w-full font-[500] placeholder:text-navratri-muted text-navratri-text" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-navratri-muted hover:text-navratri-accent hover:bg-navratri-accent/10 rounded-[12px] transition-colors border border-transparent hover:border-navratri-accent/20">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-navratri-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-navratri-lightGrey mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[14px] font-[700] text-navratri-text leading-none">Super Admin</p>
                <p className="text-[11px] text-navratri-muted font-[600] mt-1">admin@raaspass.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-premium rounded-[12px] flex items-center justify-center shadow-sm">
                <span className="font-display font-[700] text-white">A</span>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
