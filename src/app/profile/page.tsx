'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, Ticket, CalendarDays, HelpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-50px)] flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-50px)] pt-24 pb-12 flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-card border border-gray-100 shadow-sm text-center">
          <div className="w-24 h-24 bg-navratri-bg border border-navratri-lightGrey rounded-full flex items-center justify-center mx-auto mb-6 p-4">
            <img src="/brand/raaspass-logo.svg" alt="RaasPass Logo" className="w-full h-auto object-contain" />
          </div>
          <h1 className="text-2xl font-[800] text-gray-900 mb-2">Welcome to RaasPass</h1>
          <p className="text-sm text-gray-500 font-medium mb-8">Sign in to book tickets and manage your passes effortlessly.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-[700] py-3.5 rounded-[12px] transition-colors active:scale-95 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-50px)] bg-gray-50 pt-20 pb-24 font-sans px-4">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-card p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-[800] text-gray-900 truncate">{user.displayName || 'RaasPass User'}</h2>
            <p className="text-sm text-gray-500 font-medium truncate">{user.email}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-card border border-gray-100 shadow-sm overflow-hidden">
          <Link href="/my-tickets" className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-[700] text-gray-900">My Tickets</h3>
              <p className="text-xs text-gray-500 font-medium">View and manage your bookings</p>
            </div>
          </Link>

          <Link href="/events" className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-[700] text-gray-900">Explore Events</h3>
              <p className="text-xs text-gray-500 font-medium">Discover new events to attend</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-[700] text-gray-900">Help & Support</h3>
              <p className="text-xs text-gray-500 font-medium">Contact organizer or support</p>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <button 
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 font-[700] py-3.5 rounded-card transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

      </div>
    </div>
  );
}
