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
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-4 selection:bg-[#9333EA] selection:text-white pt-[60px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white max-w-md w-full rounded-[2rem] p-8 shadow-xl shadow-black/5 border border-gray-100"
        >
          <div className="w-16 h-16 bg-[#9333EA]/10 rounded-2xl flex items-center justify-center mb-8 relative">
            <Lock className="w-8 h-8 text-[#9333EA]" />
            {isDemo && (
              <span className="absolute -top-2 -right-12 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                DEMO
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-sans font-[800] text-[#111111] mb-2 tracking-tight">
            {isDemo ? 'Demo Ticket Lookup' : (step === 'phone' ? 'My Tickets' : 'Verify Identity')}
          </h1>
          <p className="text-[#6B7280] font-[500] mb-8">
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
                  <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-[800]">+91</span>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                      placeholder="Enter 10 digits" 
                      className="w-full pl-14 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/50 font-[600] text-lg text-[#111111] tracking-wider" 
                    />
                  </div>
                </div>
                {isDemo && (
                  <div>
                    <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">Booking ID</label>
                    <input 
                      type="text" 
                      value={otp} // Reusing OTP state for Booking ID
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="e.g. RP-2026-123456" 
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/50 font-[600] text-lg text-[#111111]" 
                    />
                  </div>
                )}
                <button type="submit" disabled={loading || phone.length !== 10 || (isDemo && !otp)} className="w-full bg-[#9333EA] text-white font-[800] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#7E22CE] hover:shadow-[0_10px_20px_-10px_rgba(229,57,53,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isDemo ? <>View Tickets <ArrowRight className="w-5 h-5" /></> : <>Request OTP <ArrowRight className="w-5 h-5" /></>)}
                </button>
              </motion.form>
            ) : (
              <motion.form key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">6-Digit OTP</label>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="• • • • • •" 
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/50 font-[800] text-3xl text-center text-[#111111] tracking-[0.5em]" 
                    autoFocus
                  />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-[#111111] text-white font-[800] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-60 shadow-lg hover:-translate-y-0.5 disabled:hover:translate-y-0">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Login <ShieldCheck className="w-5 h-5" /></>}
                </button>
                <button type="button" onClick={() => setStep('phone')} className="w-full text-center text-[#6B7280] text-sm font-[600] hover:text-[#111111] transition-colors pt-2">
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
    <div className="bg-[#F7F7F8] min-h-screen pb-20 pt-[80px] font-sans selection:bg-[#9333EA] selection:text-white">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 mt-8">
          <div>
            <h1 className="text-4xl font-sans font-[800] text-[#111111] tracking-tight mb-2">My Tickets</h1>
            <p className="text-[#6B7280] font-[500] text-lg">Manage your event bookings and QR passes.</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-[600] text-gray-500 hover:text-[#9333EA] bg-white px-4 py-2 rounded-xl border border-gray-200 transition-colors self-start sm:self-auto">
            Log out
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-sans font-[800] text-[#111111] mb-2">No Bookings Found</h2>
            <p className="text-[#6B7280] font-[500] max-w-sm mb-8">You haven't booked any tickets yet. Explore our premium events and book your passes.</p>
            <button onClick={() => router.push('/')} className="bg-[#9333EA] text-white font-[800] px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-[0_10px_20px_-10px_rgba(229,57,53,0.5)] hover:-translate-y-0.5 transition-all">
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const totalTickets = booking.tickets ? booking.tickets.length : 0;
              
              return (
                <div key={booking.id} onClick={() => router.push(`/tickets/${booking.id}`)} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col md:flex-row gap-6 md:items-center">
                  
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {booking.tickets[0]?.eventBanner ? (
                      <img src={booking.tickets[0].eventBanner} alt={booking.eventName} className="w-full h-full object-cover" />
                    ) : (
                      <Ticket className="w-8 h-8 text-[#9333EA]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] bg-green-100 text-green-700 font-[800] uppercase tracking-widest px-2.5 py-1 rounded-full">Confirmed</span>
                      <span className="text-xs text-gray-400 font-[600] uppercase tracking-wider">Ref: {booking.id}</span>
                    </div>
                    <h3 className="text-xl font-sans font-[800] text-[#111111] mb-2">{booking.eventName}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[#6B7280] font-[500]">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> {new Date(booking.eventDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {booking.venue}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 md:border-l md:border-gray-100 md:pl-6">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mb-0.5">Tickets</p>
                      <p className="font-[800] text-[#111111] text-lg">{totalTickets} Pass{totalTickets > 1 ? 'es' : ''}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#9333EA] group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
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
