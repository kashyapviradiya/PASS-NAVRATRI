'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, calculateConvenienceFee, generateBookingId } from '@/lib/utils';
import { CITIES } from '@/lib/demo-data';
import { CreditCard, Shield, Lock, ChevronLeft, ChevronDown, User, Phone, Mail, MapPin, Tag, Loader2, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import type { Event, BookingPass } from '@/types';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedPasses, setSelectedPasses] = useState<Record<string, number>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const savedEvent = localStorage.getItem('checkout_event');
    const savedPasses = localStorage.getItem('checkout_ticketTypes') || localStorage.getItem('checkout_passes');
    if (savedEvent && savedPasses) {
      setEvent(JSON.parse(savedEvent));
      setSelectedPasses(JSON.parse(savedPasses));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const ticketTypesList = event.ticketTypes || event.passes || [];
  const bookingPasses: BookingPass[] = ticketTypesList
    .filter(p => (selectedPasses[p.id] || 0) > 0)
    .map(p => ({
      ticketTypeId: p.id,
      ticketTypeName: p.name,
      quantity: selectedPasses[p.id],
      unitPrice: p.price,
      subtotal: p.price * selectedPasses[p.id],
    }));

  const totalAmount = bookingPasses.reduce((sum, p) => sum + p.subtotal, 0);
  const convenienceFee = calculateConvenienceFee(totalAmount);
  const grandTotal = totalAmount + convenienceFee;

  const validate = (): boolean => {
    if (!name.trim()) { toast.error('Please enter your full name'); return false; }
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Please enter a valid 10-digit mobile number'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Please enter a valid email address'); return false; }
    if (!city) { toast.error('Please select your city'); return false; }
    if (!agreed) { toast.error('Please agree to the terms & conditions'); return false; }
    return true;
  };

  const handlePayment = async () => {
    if (!validate()) return;
    setProcessing(true);
    try {
      const bookingId = generateBookingId();
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: `order_mock_${Date.now()}`,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'demo_signature',
          bookingId,
          eventId: event.id,
          eventName: event.name || event.title,
          eventDate: event.dates || event.startDate,
          venue: `${event.venue}, ${event.city}`,
          city: event.city,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          customerCity: city,
          ticketTypes: bookingPasses,
          totalAmount,
          convenienceFee,
          grandTotal,
        }),
      });
      const verifyData = await verifyRes.json();
      
      if (verifyData.success) {
        localStorage.setItem(`tickets_${bookingId}`, JSON.stringify(verifyData.tickets));
        
        // Add to mock "upcoming bookings" for My Tickets
        const pastBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        pastBookings.push({
          id: bookingId,
          eventId: event.id,
          eventName: event.name || event.title,
          eventDate: event.dates || event.startDate,
          venue: event.venue,
          ticketTypes: bookingPasses,
          totalAmount: grandTotal,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('mock_bookings', JSON.stringify(pastBookings));

        router.push(`/booking-success/${bookingId}`);
      } else {
        toast.error(verifyData.message || 'Demo booking failed.');
      }
    } catch (error) {
      toast.error('Something went wrong during demo booking.');
    }
    setProcessing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-[120px] md:pb-20 pt-[80px] md:pt-[100px] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 mb-6 font-[700] text-[13px] transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Event
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-[24px] md:text-[28px] font-[800] text-gray-900 tracking-tight">Checkout</h1>
            
            {/* Customer Details */}
            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-200">
              <h2 className="text-[18px] font-[800] text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-[700] text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-navratri-primary bg-gray-50 focus:bg-white font-[500] text-[14px] text-gray-900 transition-colors" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-[700] text-gray-700 mb-1.5">Mobile Number *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className="w-full px-4 py-3 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-navratri-primary bg-gray-50 focus:bg-white font-[500] text-[14px] text-gray-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-[700] text-gray-700 mb-1.5">Email Address *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-navratri-primary bg-gray-50 focus:bg-white font-[500] text-[14px] text-gray-900 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-[700] text-gray-700 mb-1.5">City *</label>
                  <div className="relative">
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-navratri-primary appearance-none cursor-pointer bg-gray-50 focus:bg-white font-[500] text-[14px] text-gray-900 transition-colors">
                      <option value="">Select city</option>
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="bg-gray-100 rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 justify-around border border-gray-200">
              <div className="flex items-center gap-2 text-[12px] text-gray-700 font-[700]">
                <Shield className="w-4 h-4 text-green-600" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-700 font-[700]">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Instant Digital Pass
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 bg-white rounded-[16px] p-6 shadow-sm border border-gray-200">
              <h2 className="text-[18px] font-[800] text-gray-900 mb-4 pb-4 border-b border-gray-100">Order Summary</h2>

              <div className="mb-6 space-y-2">
                <h3 className="font-[800] text-[16px] text-gray-900 leading-tight">{event.title || event.name}</h3>
                <p className="text-gray-500 font-[600] text-[13px]">{event.venue}, {event.city}</p>
                <p className="text-gray-500 font-[600] text-[13px]">{new Date(event.startDate || event.dates || Date.now()).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <div className="space-y-4 mb-6">
                {bookingPasses.map(pass => (
                  <div key={pass.ticketTypeId} className="flex justify-between items-start text-[14px]">
                    <div>
                      <span className="text-gray-900 font-[700]">{pass.ticketTypeName}</span>
                      <p className="text-gray-500 font-[600] text-[12px] mt-0.5">{pass.quantity} Ticket{pass.quantity > 1 ? 's' : ''}</p>
                    </div>
                    <span className="font-[700] text-gray-900">{formatCurrency(pass.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6 text-[13px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-[600]">Subtotal</span>
                  <span className="font-[700] text-gray-900">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-[600]">Convenience Fee</span>
                  <span className="font-[700] text-gray-900">{formatCurrency(convenienceFee)}</span>
                </div>
              </div>

              <div className="border-t border-gray-900 pt-4 pb-6">
                <div className="flex justify-between items-end">
                  <span className="text-[14px] font-[800] text-gray-900">Total Amount</span>
                  <span className="text-[24px] font-[850] text-gray-900 tracking-tight">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-gray-900 rounded border-gray-300" />
                <span className="text-[12px] text-gray-600 font-[500] leading-tight">
                  I agree to the <span className="text-gray-900 font-[700] underline">Terms & Conditions</span>. Tickets are non-transferable.
                </span>
              </label>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gray-900 text-white font-[700] py-3.5 rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Pay {formatCurrency(grandTotal)}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
