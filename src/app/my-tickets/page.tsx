'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ArrowRight, Calendar, Loader2, Lock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function MyTicketsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadBookings(user);
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadBookings = async (currentUser: any) => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const url = `/api/get-tickets?customerUid=${currentUser.uid}`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        // Group tickets by bookingId for display
        const grouped = data.tickets.reduce((acc: any, ticket: any) => {
          if (!acc[ticket.bookingId]) {
            acc[ticket.bookingId] = {
              id: ticket.bookingId,
              eventName: ticket.eventTitle || ticket.eventName,
              eventDate: ticket.eventDate, 
              eventBanner: ticket.eventBanner,
              tickets: []
            };
          }
          acc[ticket.bookingId].tickets.push(ticket);
          return acc;
        }, {});
        
        const bookingsArray = Object.values(grouped);
        // Sort newest first based on first ticket's creation date
        bookingsArray.sort((a: any, b: any) => new Date(b.tickets[0].createdAt).getTime() - new Date(a.tickets[0].createdAt).getTime());
        setBookings(bookingsArray);
      } else {
        toast.error(data.message || 'Failed to load tickets');
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // UI for Not Logged In
  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-[calc(100vh-50px)] bg-navratri-bg flex items-center justify-center pt-[80px]">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-navratri-bg flex flex-col pt-[80px] px-4 sm:px-6">
        <div className="max-w-md w-full mx-auto animate-fade-in-up">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border border-gray-200 shadow-sm p-3">
            <img src="/brand/raaspass-logo.svg" alt="RaasPass Logo" className="w-full h-auto object-contain" />
          </div>
          
          <h1 className="text-[28px] md:text-[32px] font-[850] text-navratri-dark mb-2 tracking-tight">
            My Tickets
          </h1>
          <p className="text-[14px] text-navratri-muted font-[500] mb-8">
            Sign in to view your bookings and manage your event passes securely.
          </p>

          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-navratri-dark hover:bg-navratri-softBg font-[700] py-3.5 rounded-[12px] transition-colors active:scale-95 shadow-sm"
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

  // UI for Authenticated View
  return (
    <div className="bg-navratri-bg min-h-[calc(100vh-50px)] pb-24 pt-[60px] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] md:text-[28px] font-[850] text-navratri-dark tracking-tight">My Tickets</h1>
          <button onClick={signOut} className="flex items-center gap-2 text-[13px] font-[700] text-navratri-muted hover:text-navratri-dark transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="card-base p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-navratri-softBg rounded-full flex items-center justify-center mb-4 p-3">
              <Ticket className="w-8 h-8 text-navratri-primary" />
            </div>
            <h2 className="text-[18px] font-[800] text-navratri-dark mb-2">No tickets yet — discover events</h2>
            <p className="text-navratri-muted font-[500] max-w-sm mb-6 text-[13px]">You haven't booked any tickets yet. Explore our events and book your passes.</p>
            <button onClick={() => router.push('/events')} className="bg-navratri-primary hover:opacity-90 text-white font-[700] px-6 py-2.5 rounded-[12px] active:scale-95 transition-all text-[13px] shadow-premium">
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const totalTickets = booking.tickets ? booking.tickets.length : 0;
              const bannerImage = booking.eventBanner || booking.tickets[0]?.eventBanner;
              
              return (
                <div key={booking.id} className="card-base hover:shadow-card-hover p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-shadow duration-200">
                  
                  <div className="w-full sm:w-32 h-40 sm:h-24 bg-navratri-softBg rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden">
                    {bannerImage ? (
                      <img src={bannerImage} alt={booking.eventName} className="w-full h-full object-cover" />
                    ) : (
                      <Ticket className="w-8 h-8 text-navratri-muted" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-1">
                      <h3 className="text-[16px] sm:text-[18px] font-[800] text-navratri-dark truncate">{booking.eventName}</h3>
                      <span className="w-fit text-[11px] bg-green-50 border border-green-200 text-green-700 font-[800] uppercase tracking-wider px-2 py-0.5 rounded-[6px]">Paid</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-navratri-muted font-[600]">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(booking.eventDate || booking.tickets[0]?.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                      <span className="flex items-center gap-1.5 bg-navratri-softBg px-2.5 py-0.5 rounded-md text-navratri-dark">{booking.tickets[0]?.ticketType || 'Pass'} × {totalTickets}</span>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-navratri-softBg mt-2 sm:mt-0 flex justify-end">
                    <button 
                      onClick={() => router.push(`/tickets/${booking.id}`)}
                      className="w-full sm:w-auto bg-navratri-primary text-white font-[700] px-5 py-2.5 rounded-[10px] hover:opacity-90 active:scale-95 transition-all text-[13px] shadow-premium flex justify-center items-center gap-2"
                    >
                      View Ticket <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
