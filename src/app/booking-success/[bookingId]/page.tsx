'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Ticket, Home, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function BookingSuccess({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/booking-success?id=${params.bookingId}`);
        const data = await res.json();
        if (data.success) {
          setOrderDetails(data.booking);
        } else {
          // Fallback to local storage if API fails (e.g. non-demo mock order)
          const localData = localStorage.getItem('success_booking');
          if (localData) setOrderDetails(JSON.parse(localData));
          else router.push('/');
        }
      } catch (error) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [params.bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-navratri-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orderDetails) return null;

  const { event, customerName, totalAmount, bookingId, passes, demo } = orderDetails;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-navratri-accent selection:text-white py-20 pt-[100px] relative overflow-hidden">
      {/* Premium ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/25 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-[#FF4D6D]/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Floating particles background effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      <div className="max-w-[600px] w-full bg-white/[0.08] backdrop-blur-[24px] rounded-[28px] p-8 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.4)] border border-white/[0.12] relative overflow-hidden animate-fade-in-up z-10">
        
        {demo && (
          <div className="absolute top-4 right-4 bg-orange-500/10 text-orange-400 text-[11px] font-[800] px-3.5 py-1.5 rounded-[12px] uppercase tracking-wider border border-orange-500/20 backdrop-blur-md">
            Demo Booking
          </div>
        )}
        <div className="text-center mb-10 mt-4">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_32px_rgba(16,185,129,0.35)] animate-[pulse_3s_ease-in-out_infinite]">
            <CheckCircle className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]" />
            <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-25"></div>
          </div>
          <h1 className="text-[36px] font-display font-[850] text-white tracking-tight leading-tight mb-3">Booking Confirmed!</h1>
          <p className="text-[#CBD5E1] font-[500] text-[16px] leading-relaxed max-w-md mx-auto">
            Thank you, {customerName}. Your payment of <strong className="text-white font-[800]">{formatCurrency(totalAmount)}</strong> was successful.
          </p>
        </div>

        {/* Premium ticket-graphic box */}
        <div className="bg-white/[0.06] rounded-[24px] p-6 md:p-8 border border-white/[0.08] mb-8 relative overflow-hidden backdrop-blur-md shadow-inner">
          {/* Ticket styling edges */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#1E1B4B] rounded-full -translate-y-1/2 border-r border-white/[0.08] z-20"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#1E1B4B] rounded-full -translate-y-1/2 border-l border-white/[0.08] z-20"></div>
          <div className="absolute top-1/2 left-4 right-4 h-px bg-transparent border-dashed border-t-2 border-white/10 z-10"></div>
          
          <div className="pb-6 relative z-10 border-b border-white/5">
            <div className="flex gap-4 text-left">
              <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-[16px] border border-white/10" />
              <div>
                <h3 className="font-display font-[850] text-white text-[18px] leading-tight mb-2 line-clamp-2">{event.title}</h3>
                <div className="flex items-center gap-1.5 text-[13px] text-[#CBD5E1] font-[600] mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" /> {new Date(event.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[#CBD5E1] font-[600]">
                  <Clock className="w-3.5 h-3.5 text-[#00E5FF]" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10 text-left">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-[800] text-[#94A3B8] uppercase tracking-widest mb-1.5">Booking ID</p>
                <p className="font-mono font-[800] text-white text-[15px] tracking-wider">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-[800] text-[#94A3B8] uppercase tracking-widest mb-1.5">Venue</p>
                <p className="font-[800] text-white text-[14px] max-w-[150px] truncate">{event.venue}</p>
              </div>
            </div>

            <div className="space-y-3">
              {passes && passes.map((pass: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-[15px] bg-white/[0.04] p-4 rounded-[16px] border border-white/[0.06] shadow-sm hover:border-white/[0.12] transition-colors">
                  <span className="font-[800] text-white">{pass.passName}</span>
                  <span className="text-white font-[800] text-[13px] px-3.5 py-1 bg-white/[0.08] rounded-[10px] border border-white/10">Qty: {pass.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <Link href="/my-tickets" className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[#7C3AED] to-[#FF4D6D] text-white font-[800] py-4 rounded-full flex justify-center items-center gap-2 hover:shadow-[0_8px_32px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-[15px]">
            <Ticket className="w-5 h-5" /> View My Tickets
          </Link>
          <Link href="/" className="w-full sm:w-auto flex-1 bg-white/[0.08] border border-white/[0.12] text-white font-[800] py-4 rounded-full flex justify-center items-center gap-2 hover:bg-white/[0.15] active:scale-[0.98] transition-all text-[15px] backdrop-blur-md">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
