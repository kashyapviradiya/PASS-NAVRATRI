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
    <div className="bg-[#F7F7F8] min-h-screen flex items-center justify-center p-4 font-sans selection:bg-[#9333EA] selection:text-white py-20 pt-[100px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-8 md:p-12 max-w-xl w-full shadow-xl border border-gray-100 relative"
      >
        {demo && (
          <div className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
            Demo Booking
          </div>
        )}
        <div className="text-center mb-10 mt-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-[800] text-[#111111] tracking-tight mb-2">Booking Confirmed!</h1>
          <p className="text-[#6B7280] font-[500]">
            Thank you, {customerName}. Your payment of <strong className="text-[#111111]">{formatCurrency(totalAmount)}</strong> was successful.
          </p>
        </div>

        <div className="bg-[#F7F7F8] rounded-3xl p-6 md:p-8 border border-gray-100 mb-8 relative overflow-hidden">
          {/* Ticket styling edges */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border-r border-gray-100"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border-l border-gray-100"></div>
          <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-200 border-dashed border-t border-gray-300"></div>
          
          <div className="pb-6 relative z-10">
            <div className="flex gap-4">
              <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-2xl" />
              <div>
                <h3 className="font-[800] text-[#111111] text-lg leading-tight mb-2">{event.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-[600] mb-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-[600]">
                  <Clock className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-mono font-[800] text-[#111111]">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Venue</p>
                <p className="font-[800] text-[#111111] text-xs max-w-[120px] truncate">{event.venue}</p>
              </div>
            </div>

            <div className="space-y-2">
              {passes && passes.map((pass: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="font-[800] text-[#111111]">{pass.passName}</span>
                  <span className="text-[#6B7280] font-[600] text-xs px-2 py-1 bg-gray-50 rounded-md">Qty: {pass.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/my-tickets" className="w-full sm:w-auto flex-1 bg-[#111111] text-white font-[800] py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-black transition-all shadow-lg hover:-translate-y-0.5">
            <Ticket className="w-5 h-5" /> View My Ticket
          </Link>
          <Link href="/" className="w-full sm:w-auto flex-1 bg-white border border-gray-200 text-[#111111] font-[800] py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
