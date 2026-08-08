'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Ticket, Home, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orderDetails) return null;

  const { event, customerName, totalAmount, bookingId, passes, demo } = orderDetails;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-[500px] w-full bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-gray-200 relative overflow-hidden z-10"
      >
        
        {demo && (
          <div className="absolute top-4 right-4 bg-orange-50 text-orange-600 text-[10px] font-[800] px-3 py-1 rounded-[8px] uppercase tracking-wider border border-orange-200">
            Demo Booking
          </div>
        )}
        <div className="text-center mb-8 mt-2">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 relative">
            <motion.svg 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="w-10 h-10 text-green-500 z-10"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                d="M20 6L9 17l-5-5"
              />
            </motion.svg>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-[28px] font-[850] text-gray-900 tracking-tight leading-tight mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-gray-500 font-[500] text-[15px] leading-relaxed max-w-sm mx-auto"
          >
            Thank you, {customerName}. Your payment of <strong className="text-gray-900 font-[700]">{formatCurrency(totalAmount)}</strong> was successful.
          </motion.p>
        </div>

        {/* Premium ticket-graphic box */}
        <div className="bg-gray-50 rounded-[20px] p-6 border border-gray-200 mb-8 relative overflow-hidden shadow-sm">
          {/* Ticket styling edges */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border-r border-gray-200 z-20"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border-l border-gray-200 z-20"></div>
          <div className="absolute top-1/2 left-4 right-4 h-px bg-transparent border-dashed border-t border-gray-300 z-10"></div>
          
          <div className="pb-5 relative z-10 border-b border-gray-200/50">
            <div className="flex gap-4 text-left">
              <img src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} alt={event.title || event.name} className="w-16 h-16 object-cover rounded-[12px] border border-gray-200" />
              <div>
                <h3 className="font-[800] text-gray-900 text-[16px] leading-tight mb-1 line-clamp-2">{event.title || event.name}</h3>
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-[600] mb-0.5">
                  <Calendar className="w-3 h-3 text-navratri-primary" /> {new Date(event.startDate || event.dates || Date.now()).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-[600]">
                  <Clock className="w-3 h-3 text-navratri-primary" /> {new Date(event.startDate || event.dates || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 relative z-10 text-left">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-mono font-[800] text-gray-900 text-[14px] tracking-wider">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="font-[800] text-green-600 text-[13px] uppercase">Paid</p>
              </div>
            </div>

            <div className="space-y-2">
              {passes && passes.map((pass: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-[14px] bg-white p-3 rounded-[12px] border border-gray-200 shadow-sm">
                  <span className="font-[800] text-gray-900">{pass.passName || pass.ticketTypeName}</span>
                  <span className="text-gray-900 font-[800] text-[12px] px-2 py-0.5 bg-gray-100 rounded-[6px] border border-gray-200">Qty: {pass.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <Link href="/my-tickets" className="w-full bg-gray-900 text-white font-[800] py-3.5 rounded-[12px] flex justify-center items-center gap-2 shadow-sm active:scale-95 transition-transform text-[15px]">
            <Ticket className="w-5 h-5" /> View My Tickets
          </Link>
          <Link href="/" className="w-full bg-white border border-gray-200 text-gray-900 font-[800] py-3.5 rounded-[12px] flex justify-center items-center gap-2 hover:bg-gray-50 active:scale-95 transition-transform text-[15px]">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
