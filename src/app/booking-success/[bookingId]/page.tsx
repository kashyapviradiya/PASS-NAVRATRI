'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Ticket, Home, ShieldCheck, MapPin, Share2, Download } from 'lucide-react';
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

  const { event, customerName, totalAmount, demo } = orderDetails;
  const actualBookingId = orderDetails.bookingId || orderDetails.id || params.bookingId;
  const passesList = orderDetails.passes || orderDetails.ticketTypes || orderDetails.tickets || [];

  return (
    <div className="min-h-screen bg-navratri-bg flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-[560px] w-full card-base p-8 md:p-12 relative overflow-hidden z-10 text-center"
      >
        
        {demo && (
          <div className="absolute top-4 right-4 bg-navratri-gold/10 text-navratri-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-navratri-gold/20">
            Demo Booking
          </div>
        )}

        <div className="mb-8 mt-2">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-display font-bold text-navratri-text mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-navratri-muted">
            Thank you, {customerName}. Your payment of <strong className="text-navratri-text font-bold">{formatCurrency(totalAmount)}</strong> was successful.
          </p>
        </div>

        {/* Event Card */}
        <div className="bg-white rounded-2xl p-6 border border-navratri-border mb-8 text-left shadow-sm">
          <div className="flex gap-4 mb-6 pb-6 border-b border-navratri-border">
            <img src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} alt={event.title || event.name} className="w-20 h-20 object-cover rounded-xl border border-navratri-border shadow-sm" />
            <div>
              <h3 className="font-display font-bold text-navratri-text text-lg leading-tight mb-2 line-clamp-2">{event.title || event.name}</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-navratri-muted">
                  <Calendar className="w-4 h-4 text-navratri-primary" /> {new Date(event.startDate || event.dates || Date.now()).toLocaleDateString()}
                </div>
                <div className="flex items-start gap-2 text-sm text-navratri-muted">
                  <MapPin className="w-4 h-4 shrink-0 text-navratri-primary mt-0.5" /> <span className="line-clamp-1">{event.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-navratri-muted uppercase tracking-widest mb-1">Booking ID</p>
              <p className="font-mono font-bold text-navratri-text">{actualBookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-navratri-muted uppercase tracking-widest mb-1">Status</p>
              <p className="font-bold text-green-600 uppercase text-sm">Paid</p>
            </div>
          </div>

          <div className="space-y-3">
            {passesList && passesList.map((pass: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-navratri-bg p-4 rounded-xl border border-navratri-border">
                <span className="font-bold text-navratri-text">{pass.passName || pass.ticketTypeName}</span>
                <span className="text-navratri-primary font-bold bg-navratri-primary/10 px-3 py-1 rounded-lg border border-navratri-primary/20">Qty: {pass.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm font-medium text-navratri-muted mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" /> Your digital pass has been generated
        </p>

        <div className="space-y-4">
          <Link href={`/tickets/${actualBookingId}`} className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2">
            <Ticket className="w-5 h-5" /> View Digital Ticket
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="btn-secondary w-full py-3 flex justify-center items-center gap-2 text-sm bg-white hover:bg-slate-50 transition-colors border border-navratri-border">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
