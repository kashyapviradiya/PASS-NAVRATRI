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
    <div className="min-h-screen bg-[#F7F7F8] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/organizer/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E53935] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-bold text-xl text-[#111111] leading-none">PASS<br/><span className="text-[10px] text-gray-400 tracking-widest uppercase font-sans">Organizer</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-[600] text-sm ${
                  isActive 
                    ? 'bg-[#E53935] text-white shadow-md shadow-[#E53935]/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#E53935]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full bg-red-50 text-[#E53935] hover:bg-red-100 rounded-xl transition-colors font-[700] text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 min-w-64">
               {/* Context switch placeholder */}
               <span className="text-sm font-[600] text-gray-400">All Assigned Events</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E53935] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-[800] text-[#111111] leading-none">Organizer</p>
                <p className="text-xs text-gray-500 font-[600] mt-1">Dashboard</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shrink-0">
                <span className="font-serif font-bold text-gray-600">O</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
