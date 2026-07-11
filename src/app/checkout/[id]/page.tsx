'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, calculateConvenienceFee, generateBookingId } from '@/lib/utils';
import { CITIES } from '@/lib/demo-data';
import { CreditCard, Shield, Lock, ChevronLeft, User, Phone, Mail, MapPin, Tag, Loader2, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import type { Event, BookingPass } from '@/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
  const [coupon, setCoupon] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const savedEvent = localStorage.getItem('checkout_event');
    const savedPasses = localStorage.getItem('checkout_passes');
    if (savedEvent && savedPasses) {
      setEvent(JSON.parse(savedEvent));
      setSelectedPasses(JSON.parse(savedPasses));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const bookingPasses: BookingPass[] = event.passes
    .filter(p => (selectedPasses[p.id] || 0) > 0)
    .map(p => ({
      passTypeId: p.id,
      passName: p.name,
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
          eventName: event.name,
          eventDate: event.dates,
          venue: `${event.venue}, ${event.city}`,
          city: event.city,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          customerCity: city,
          passes: bookingPasses,
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
          eventName: event.name,
          eventDate: event.dates,
          venue: event.venue,
          passes: bookingPasses,
          totalAmount: grandTotal,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('mock_bookings', JSON.stringify(pastBookings));

        router.push(`/booking/${bookingId}/success`);
      } else {
        toast.error(verifyData.message || 'Demo booking failed.');
      }
    } catch (error) {
      toast.error('Something went wrong during demo booking.');
    }
    setProcessing(false);
  };

  return (
    <div className="bg-[#F7F7F8] min-h-screen pb-20 pt-[80px] font-sans selection:bg-[#E53935] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#6B7280] hover:text-[#111111] mb-8 font-[600] transition-colors">
          <ChevronLeft className="w-5 h-5" /> Back to Event
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#E53935]/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#E53935]" />
          </div>
          <div>
            <h1 className="text-3xl font-sans font-[800] text-[#111111] tracking-tight">Secure Checkout</h1>
            <p className="text-[#6B7280] text-sm font-[500]">Encrypted processing & instant delivery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Event Summary Card */}
            <div className="bg-[#111111] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-black/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E53935]/20 border border-[#E53935]/30 text-[#E53935] text-[10px] font-[800] tracking-widest uppercase mb-2">
                  <Sparkles className="w-3 h-3" /> Selected Event
                </div>
                <h2 className="text-3xl font-sans font-[800] tracking-tight">{event.name}</h2>
                <p className="text-white/80 flex items-center gap-2 font-[500]"><MapPin className="w-4 h-4 text-[#E53935]" /> {event.venue}, {event.city}</p>
                <p className="text-white/80 flex items-center gap-2 font-[500]"><Calendar className="w-4 h-4 text-[#E53935]" /> {event.dates} &bull; {event.timings}</p>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-sans font-[800] text-[#111111] mb-6">Guest Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent bg-gray-50/50 font-[500]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent bg-gray-50/50 font-[500]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent bg-gray-50/50 font-[500]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent appearance-none cursor-pointer bg-gray-50/50 text-[#111111] font-[500]">
                      <option value="">Select city</option>
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-sans font-[800] text-[#111111] mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-[#E53935]" /> Gift Card or Coupon</h2>
              <div className="flex gap-3">
                <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] bg-gray-50/50 font-[500]" />
                <button onClick={() => toast('Coupon feature coming soon!', { icon: '🎫' })} className="px-8 py-4 bg-gray-50 text-[#111111] font-[800] rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors">Apply</button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-4 cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 accent-[#E53935] rounded border-gray-300" />
              <span className="text-sm text-[#6B7280] font-[500] leading-relaxed">
                By proceeding, I agree to the <span className="text-[#E53935] font-[800] underline">Terms & Conditions</span> and <span className="text-[#E53935] font-[800] underline">Privacy Policy</span>. I understand that tickets are non-transferable and subject to organizer guidelines.
              </span>
            </label>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="lg:sticky lg:top-28 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-8">
              <h2 className="text-2xl font-sans font-[800] text-[#111111]">Order Summary</h2>

              <div className="space-y-4">
                {bookingPasses.map(pass => (
                  <div key={pass.passTypeId} className="flex justify-between items-start text-sm">
                    <div>
                      <span className="text-[#111111] font-[800]">{pass.passName}</span>
                      <p className="text-[#6B7280] mt-1 font-[500]">Qty: {pass.quantity}</p>
                    </div>
                    <span className="font-[800] text-[#111111]">{formatCurrency(pass.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280] font-[600]">Subtotal</span>
                  <span className="font-[800] text-[#111111]">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280] font-[600] flex items-center gap-1">Convenience Fee <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">i</span></span>
                  <span className="font-[800] text-[#111111]">{formatCurrency(convenienceFee)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-[800] text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-4xl font-sans font-[800] text-[#E53935] tracking-tight">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-[#E53935] text-white font-[800] py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#D32F2F] hover:shadow-[0_10px_20px_-10px_rgba(229,57,53,0.5)] hover:-translate-y-0.5 transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                ) : (
                  <><Lock className="w-5 h-5" /> Confirm & Pay</>
                )}
              </button>

              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-[#6B7280] font-[600]">
                  <Shield className="w-4 h-4 text-green-500" />
                  100% Safe & Secure Payments
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280] font-[600]">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Instant QR Ticket Generation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
