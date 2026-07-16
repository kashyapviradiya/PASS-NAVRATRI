'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Ticket, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orderDetails) return null;

  const { event, customerName, totalAmount, bookingId, passes, demo } = orderDetails;

  return (
    <div className="bg-navratri-bg min-h-screen flex items-center justify-center p-4 font-sans selection:bg-navratri-accent selection:text-white py-20 pt-[100px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-card p-8 md:p-12 max-w-[600px] w-full shadow-sm border border-navratri-lightGrey relative"
      >
        {demo && (
          <div className="absolute top-4 right-4 bg-orange-50 text-orange-600 text-[11px] font-[700] px-3 py-1.5 rounded-[10px] uppercase tracking-wider border border-orange-100">
            Demo Booking
          </div>
        )}
        <div className="text-center mb-10 mt-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-[32px] font-display font-[700] text-navratri-text tracking-tight mb-3">Booking Confirmed!</h1>
          <p className="text-navratri-muted font-[500] text-[16px]">
            Thank you, {customerName}. Your payment of <strong className="text-navratri-text">{formatCurrency(totalAmount)}</strong> was successful.
          </p>
        </div>

        <div className="bg-navratri-bg rounded-[24px] p-6 md:p-8 border border-navratri-lightGrey mb-8 relative overflow-hidden">
          {/* Ticket styling edges */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border-r border-navratri-lightGrey"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border-l border-navratri-lightGrey"></div>
          <div className="absolute top-1/2 left-4 right-4 h-px bg-transparent border-dashed border-t-2 border-gray-300/50"></div>
          
          <div className="pb-6 relative z-10">
            <div className="flex gap-4">
              <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-[16px]" />
              <div>
                <h3 className="font-display font-[700] text-navratri-text text-[18px] leading-tight mb-2">{event.title}</h3>
                <div className="flex items-center gap-1.5 text-[13px] text-navratri-muted font-[600] mb-1">
                  <Calendar className="w-3.5 h-3.5 text-navratri-accent" /> {new Date(event.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-navratri-muted font-[600]">
                  <Clock className="w-3.5 h-3.5 text-navratri-accent" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-mono font-[700] text-navratri-text text-[15px]">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Venue</p>
                <p className="font-[600] text-navratri-text text-[14px] max-w-[120px] truncate">{event.venue}</p>
              </div>
            </div>

            <div className="space-y-3">
              {passes && passes.map((pass: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-[15px] bg-white p-4 rounded-[16px] border border-navratri-lightGrey shadow-sm">
                  <span className="font-[600] text-navratri-text">{pass.passName}</span>
                  <span className="text-navratri-accent font-[700] text-[13px] px-3 py-1 bg-navratri-accent/5 rounded-[10px]">Qty: {pass.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/my-tickets" className="w-full sm:w-auto flex-1 bg-navratri-primary text-white font-[700] py-4 rounded-button flex justify-center items-center gap-2 hover:bg-black transition-all shadow-sm hover:-translate-y-0.5 text-[15px]">
            <Ticket className="w-5 h-5" /> View My Ticket
          </Link>
          <Link href="/" className="w-full sm:w-auto flex-1 bg-white border border-navratri-lightGrey text-navratri-text font-[700] py-4 rounded-button flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors text-[15px]">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
