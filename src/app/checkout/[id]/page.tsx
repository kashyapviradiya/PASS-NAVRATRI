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
  const [coupon, setCoupon] = useState('');
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
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E1B4B] pb-24 font-sans text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
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
          eventName: event.name,
          eventDate: event.dates,
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
          eventName: event.name,
          eventDate: event.dates,
          venue: event.venue,
          ticketTypes: bookingPasses,
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
    <div className="bg-navratri-bg min-h-screen pb-20 pt-[100px] font-sans selection:bg-navratri-primary selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-navratri-muted hover:text-navratri-text mb-8 font-[600] transition-colors hover:-translate-x-1 duration-300">
          <ChevronLeft className="w-5 h-5" /> Back to Event
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-[20px] bg-navratri-primary/10 flex items-center justify-center border border-navratri-primary/20 shadow-card">
            <Shield className="w-7 h-7 text-navratri-primary" />
          </div>
          <div>
            <h1 className="text-[32px] md:text-[40px] font-display font-[800] text-navratri-text tracking-tight">Secure Checkout</h1>
            <p className="text-navratri-muted text-[15px] font-[500]">Encrypted processing & instant delivery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Event Summary Card */}
            <div className="rounded-[24px] p-8 text-white relative overflow-hidden shadow-premium" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-navratri-primary/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-[800] tracking-widest uppercase mb-2 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-navratri-accent" /> Selected Event
                </div>
                <h2 className="text-[28px] md:text-[32px] font-display font-[800] tracking-tight">{event.name}</h2>
                <p className="text-slate-300 flex items-center gap-2 font-[500] text-[15px]"><MapPin className="w-4 h-4 text-navratri-accent" /> {event.venue}, {event.city}</p>
                <p className="text-slate-300 flex items-center gap-2 font-[500] text-[15px]"><Calendar className="w-4 h-4 text-navratri-accent" /> {event.dates} &bull; {event.timings}</p>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white/[0.03] backdrop-blur-[24px] rounded-card p-8 shadow-glass border border-white/10 relative z-10 overflow-hidden">
              <h2 className="text-[24px] font-display font-[700] text-white mb-6">Guest Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-[800] text-slate-400 uppercase tracking-widest mb-2">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00E5FF] transition-colors" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-[16px] focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 bg-white/5 font-[500] text-white placeholder-slate-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-[800] text-slate-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00E5FF] transition-colors" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-[16px] focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 bg-white/5 font-[500] text-white placeholder-slate-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-[800] text-slate-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00E5FF] transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-[16px] focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 bg-white/5 font-[500] text-white placeholder-slate-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-[800] text-slate-400 uppercase tracking-widest mb-2">City *</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00E5FF] transition-colors" />
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-12 pr-10 py-4 border border-white/10 rounded-[16px] focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 appearance-none cursor-pointer bg-white/5 font-[500] text-white placeholder-slate-500 transition-all shadow-inner [&>option]:bg-[#1E1B4B] [&>option]:text-white">
                      <option value="">Select city</option>
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Order Summary */}
          <div>
            <div className="lg:sticky lg:top-28 bg-white/[0.03] backdrop-blur-[24px] rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-premium"></div>
              <h2 className="text-[24px] font-display font-[700] text-white">Order Summary</h2>

              <div className="space-y-5">
                {bookingPasses.map(pass => (
                  <div key={pass.ticketTypeId} className="flex justify-between items-start text-[15px]">
                    <div>
                      <span className="text-white font-[700]">{pass.ticketTypeName}</span>
                      <p className="text-[#00E5FF] mt-1 font-[600]">Qty: {pass.quantity}</p>
                    </div>
                    <span className="font-[700] text-white">{formatCurrency(pass.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-slate-300 font-[500]">Subtotal</span>
                  <span className="font-[700] text-white">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-slate-300 font-[500] flex items-center gap-1.5">Convenience Fee <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">i</span></span>
                  <span className="font-[700] text-white">{formatCurrency(convenienceFee)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 pb-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-[800] text-slate-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-[32px] font-display font-[800] text-transparent bg-clip-text bg-gradient-premium tracking-tight">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-4 cursor-pointer bg-white/5 p-5 rounded-[20px] border border-white/10 hover:border-[#00E5FF]/50 hover:bg-white/10 transition-all">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-5 h-5 accent-[#00E5FF] rounded border-white/20 bg-white/10" />
                <span className="text-[12px] text-slate-300 font-[500] leading-relaxed">
                  I agree to the <span className="text-white font-[700] underline">Terms & Conditions</span>. Tickets are non-transferable.
                </span>
              </label>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-premium text-white font-[700] py-4 rounded-button flex items-center justify-center gap-2 hover:shadow-premium transition-all hover:-translate-y-1 text-[16px] disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                {processing ? (
                  <span className="relative z-10 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
                ) : (
                  <span className="relative z-10 flex items-center gap-2"><Lock className="w-4 h-4" /> Confirm & Pay</span>
                )}
              </button>

              <div className="bg-emerald-500/10 rounded-[16px] p-4 flex flex-col gap-3 border border-emerald-500/20 shadow-inner">
                <div className="flex items-center gap-2 text-[12px] text-emerald-400 font-[700]">
                  <Shield className="w-4 h-4" />
                  100% Safe & Secure Payments
                </div>
                <div className="flex items-center gap-2 text-[12px] text-emerald-400 font-[700]">
                  <CheckCircle2 className="w-4 h-4" />
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
