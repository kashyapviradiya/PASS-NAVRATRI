'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Menu, X, Ticket, ScanLine, BarChart3, Sparkles, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  if (pathname === '/organizer/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('organizer_profile');
      toast.success('Logged out successfully');
      router.push('/organizer/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/organizer/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/organizer/events', icon: Calendar },
    { name: 'Bookings', href: '/organizer/bookings', icon: Ticket },
    { name: 'Live Check-ins', href: '/organizer/checkins', icon: ScanLine },
    { name: 'Staff & Gates', href: '/organizer/staff', icon: Users },
    { name: 'Reports', href: '/organizer/reports', icon: BarChart3 },
    { name: 'Settings', href: '/organizer/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-navratri-bg flex selection:bg-navratri-accent selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-navratri-lightGrey z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } flex flex-col shadow-sm`}>
        
        <div className="h-20 flex items-center justify-between px-6 border-b border-navratri-lightGrey">
          <Link href="/organizer/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navratri-accent/10 rounded-[12px] flex items-center justify-center border border-navratri-accent/20 shadow-sm">
              <Sparkles className="w-5 h-5 text-navratri-accent" />
            </div>
            <span className="font-display font-[700] text-[20px] text-navratri-text leading-none tracking-tight">RasPass<br/><span className="text-[10px] text-navratri-muted tracking-widest uppercase font-sans font-[700]">Organizer</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-navratri-muted hover:text-navratri-text transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all font-[600] text-[14px] ${
                  isActive 
                    ? 'bg-navratri-accent text-white shadow-md shadow-navratri-accent/20' 
                    : 'text-navratri-muted hover:bg-navratri-bg hover:text-navratri-accent'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-navratri-muted'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navratri-lightGrey">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3.5 w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-[12px] transition-all font-[700] text-[14px] border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-navratri-bg">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-navratri-lightGrey flex items-center justify-between px-6 lg:px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-navratri-muted hover:text-navratri-text hover:bg-navratri-bg rounded-[10px] transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-navratri-bg px-4 py-2.5 rounded-[12px] border border-navratri-lightGrey min-w-64">
               {/* Context switch placeholder */}
               <span className="text-[13px] font-[600] text-navratri-muted uppercase tracking-widest">All Assigned Events</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-navratri-muted hover:text-navratri-accent hover:bg-navratri-accent/10 rounded-[12px] transition-colors border border-transparent hover:border-navratri-accent/20">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-navratri-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-navratri-lightGrey mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-[700] text-navratri-text leading-none">Organizer</p>
                <p className="text-[11px] text-navratri-muted font-[600] uppercase tracking-widest mt-1">Dashboard</p>
              </div>
              <div className="w-10 h-10 bg-navratri-accent/10 rounded-[12px] flex items-center justify-center border border-navratri-accent/20 shrink-0">
                <span className="font-display font-[700] text-navratri-accent">O</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
