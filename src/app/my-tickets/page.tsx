'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, Phone, ArrowRight, ShieldCheck, Search, Loader2, Calendar, MapPin, ChevronRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MyTicketsPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'authenticated'>('phone');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const authPhone = sessionStorage.getItem('mock_auth_phone');
    if (authPhone) {
      setPhone(authPhone);
      setStep('authenticated');
      loadBookings(authPhone);
    }
  }, []);

  const loadBookings = async (mobile: string, bookingId?: string) => {
    try {
      let url = `/api/get-tickets?mobile=${mobile}`;
      if (bookingId) url += `&bookingId=${bookingId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        // Group tickets by bookingId for display
        const grouped = data.tickets.reduce((acc: any, ticket: any) => {
          if (!acc[ticket.bookingId]) {
            acc[ticket.bookingId] = {
              id: ticket.bookingId,
              eventName: ticket.eventTitle || ticket.eventName, // handle both old mock and new schema
              eventDate: ticket.createdAt, // since tickets don't store eventDate in new schema directly
              venue: 'Venue', // Would need event fetch to get venue, fallback for now
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
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    }
  };

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success('OTP sent successfully! (Use any 6 digits for demo)');
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (!isDemo && otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    // Mock API call or Demo Booking Lookup
    setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('mock_auth_phone', phone);
      setStep('authenticated');
      if (isDemo) {
        loadBookings(phone, otp);
      } else {
        loadBookings(phone);
      }
      toast.success('Successfully logged in!');
    }, 1500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mock_auth_phone');
    setStep('phone');
    setPhone('');
    setOtp('');
  };

  // UI for Login
  if (step !== 'authenticated') {
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    return (
      <div className="min-h-screen bg-navratri-bg flex items-center justify-center p-4 selection:bg-navratri-accent selection:text-white pt-[60px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white max-w-md w-full rounded-card p-8 md:p-10 shadow-sm border border-navratri-lightGrey relative"
        >
          <div className="w-16 h-16 bg-navratri-accent/5 rounded-[16px] flex items-center justify-center mb-8 relative border border-navratri-accent/10">
            <Lock className="w-8 h-8 text-navratri-accent" />
            {isDemo && (
              <span className="absolute -top-2 -right-12 bg-orange-50 text-orange-600 text-[10px] font-[700] px-2 py-0.5 rounded-full uppercase border border-orange-100 tracking-wider">
                DEMO
              </span>
            )}
          </div>
          
          <h1 className="text-[32px] font-display font-[700] text-navratri-text mb-2 tracking-tight">
            {isDemo ? 'Demo Ticket Lookup' : (step === 'phone' ? 'My Tickets' : 'Verify Identity')}
          </h1>
          <p className="text-[15px] text-navratri-muted font-[500] mb-8">
            {isDemo 
              ? 'Enter your mobile number and Booking ID to view your tickets.' 
              : (step === 'phone' 
                  ? 'Enter your mobile number to view your bookings and tickets.' 
                  : `Enter the 6-digit code sent to +91 ${phone}`)
            }
          </p>

          <AnimatePresence mode="wait">
            {step === 'phone' || isDemo ? (
              <motion.form key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={isDemo ? handleVerifyOTP : handleRequestOTP} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-navratri-muted font-[700]">+91</span>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                      placeholder="Enter 10 digits" 
                      className="w-full pl-14 pr-5 py-4 border border-navratri-lightGrey rounded-[16px] focus:outline-none focus:ring-1 focus:ring-navratri-accent focus:border-navratri-accent bg-navratri-bg font-[600] text-[16px] text-navratri-text tracking-widest transition-all" 
                    />
                  </div>
                </div>
                {isDemo && (
                  <div>
                    <label className="block text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2">Booking ID</label>
                    <input 
                      type="text" 
                      value={otp} // Reusing OTP state for Booking ID
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="e.g. RP-2026-123456" 
                      className="w-full px-5 py-4 border border-navratri-lightGrey rounded-[16px] focus:outline-none focus:ring-1 focus:ring-navratri-accent focus:border-navratri-accent bg-navratri-bg font-[600] text-[16px] text-navratri-text transition-all" 
                    />
                  </div>
                )}
                <button type="submit" disabled={loading || phone.length !== 10 || (isDemo && !otp)} className="w-full bg-navratri-accent text-white font-[700] py-4 rounded-button flex items-center justify-center gap-2 hover:bg-navratri-darkAccent hover:-translate-y-0.5 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-[15px]">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isDemo ? <>View Tickets <ArrowRight className="w-5 h-5" /></> : <>Request OTP <ArrowRight className="w-5 h-5" /></>)}
                </button>
              </motion.form>
            ) : (
              <motion.form key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2">6-Digit OTP</label>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="• • • • • •" 
                    className="w-full px-5 py-4 border border-navratri-lightGrey rounded-[16px] focus:outline-none focus:ring-1 focus:ring-navratri-accent focus:border-navratri-accent bg-navratri-bg font-[700] text-[24px] text-center text-navratri-text tracking-[0.5em] transition-all" 
                    autoFocus
                  />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-navratri-primary text-white font-[700] py-4 rounded-button flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-60 shadow-sm hover:-translate-y-0.5 disabled:hover:translate-y-0 text-[15px]">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Login <ShieldCheck className="w-5 h-5" /></>}
                </button>
                <button type="button" onClick={() => setStep('phone')} className="w-full text-center text-[14px] text-navratri-muted font-[600] hover:text-navratri-text transition-colors pt-2">
                  Change mobile number
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // UI for Authenticated View
  return (
    <div className="bg-navratri-bg min-h-screen pb-20 pt-[80px] font-sans selection:bg-navratri-accent selection:text-white">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 mt-8">
          <div>
            <h1 className="text-[40px] font-display font-[700] text-navratri-text tracking-tight mb-2">My Tickets</h1>
            <p className="text-navratri-muted font-[500] text-[18px]">Manage your event bookings and QR passes.</p>
          </div>
          <button onClick={handleLogout} className="text-[13px] font-[600] text-navratri-muted hover:text-navratri-accent bg-white px-5 py-2.5 rounded-button border border-navratri-lightGrey transition-colors self-start sm:self-auto shadow-sm hover:shadow-md">
            Log out
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-card p-12 text-center border border-navratri-lightGrey shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-navratri-bg rounded-full flex items-center justify-center mb-6 border border-navratri-lightGrey">
              <Ticket className="w-10 h-10 text-navratri-muted/50" />
            </div>
            <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-2">No Bookings Found</h2>
            <p className="text-navratri-muted font-[500] max-w-sm mb-8 text-[15px]">You haven't booked any tickets yet. Explore our premium events and book your passes.</p>
            <button onClick={() => router.push('/')} className="bg-navratri-accent text-white font-[700] px-8 py-3.5 rounded-button shadow-sm hover:bg-navratri-darkAccent hover:-translate-y-0.5 transition-all text-[15px]">
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const totalTickets = booking.tickets ? booking.tickets.length : 0;
              
              return (
                <div key={booking.id} onClick={() => router.push(`/tickets/${booking.id}`)} className="bg-white rounded-card p-6 border border-navratri-lightGrey shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col md:flex-row gap-6 md:items-center">
                  
                  <div className="w-24 h-24 bg-navratri-bg rounded-[16px] border border-navratri-lightGrey flex items-center justify-center shrink-0 overflow-hidden">
                    {booking.tickets[0]?.eventBanner ? (
                      <img src={booking.tickets[0].eventBanner} alt={booking.eventName} className="w-full h-full object-cover" />
                    ) : (
                      <Ticket className="w-8 h-8 text-navratri-accent" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] bg-green-50 border border-green-100 text-green-700 font-[700] uppercase tracking-wider px-2.5 py-1 rounded-[8px]">Confirmed</span>
                      <span className="text-[11px] text-navratri-muted font-[700] uppercase tracking-widest">Ref: {booking.id}</span>
                    </div>
                    <h3 className="text-[20px] font-display font-[700] text-navratri-text mb-2 group-hover:text-navratri-accent transition-colors">{booking.eventName}</h3>
                    <div className="flex flex-wrap gap-4 text-[13px] text-navratri-muted font-[500]">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-navratri-accent/70" /> {new Date(booking.eventDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-navratri-accent/70" /> {booking.venue}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 md:border-l md:border-navratri-lightGrey md:pl-6">
                    <div className="text-left md:text-right">
                      <p className="text-[11px] text-navratri-muted uppercase tracking-widest font-[700] mb-0.5">Tickets</p>
                      <p className="font-[700] text-navratri-text text-[18px]">{totalTickets} Pass{totalTickets > 1 ? 'es' : ''}</p>
                    </div>
                    <div className="w-10 h-10 bg-navratri-bg border border-navratri-lightGrey rounded-full flex items-center justify-center group-hover:bg-navratri-accent transition-colors">
                      <ChevronRight className="w-5 h-5 text-navratri-muted group-hover:text-white transition-colors" />
                    </div>
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
