'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, calculateConvenienceFee } from '@/lib/utils';
import type { Event } from '@/types';
import { CheckCircle, Shield, CreditCard, Smartphone, Building, ArrowLeft, Ticket, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedPasses, setSelectedPasses] = useState<Record<string, number>>({});
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const eventData = localStorage.getItem('checkout_event');
    const passesData = localStorage.getItem('checkout_ticketTypes') || localStorage.getItem('checkout_passes');
    if (eventData && passesData) {
      setEvent(JSON.parse(eventData));
      setSelectedPasses(JSON.parse(passesData));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!event) return null;

  const ticketSubtotal = event.ticketTypes.reduce((sum, pass) => sum + pass.price * (selectedPasses[pass.id] || 0), 0);
  const convenienceFee = calculateConvenienceFee(ticketSubtotal);
  const totalAmount = ticketSubtotal + convenienceFee;

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.city) {
        alert('Please fill all details');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      try {
        const res = await fetch('/api/checkout/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            ticketTypes: selectedPasses,
            customer: formData,
            paymentMode: paymentMethod
          })
        });
        const data = await res.json();
        
        if (data.success) {
          router.push(`/booking-success/${data.bookingId}`);
        } else {
          alert('Demo Booking Failed: ' + data.message);
          setIsProcessing(false);
        }
      } catch (error) {
        alert('Network error during demo booking');
        setIsProcessing(false);
      }
      return;
    }

    setTimeout(() => {
      localStorage.setItem('recent_order', JSON.stringify({
        event,
        ticketTypes: selectedPasses,
        customer: formData,
        amount: totalAmount
      }));
      router.push('/payment-processing');
    }, 1500);
  };

  return (
    <div className="bg-navratri-bg min-h-[calc(100vh-64px)] pb-32 font-sans selection:bg-navratri-accent selection:text-white pt-10">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-navratri-muted hover:text-navratri-primary font-[700] text-[14px] mb-2 transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Event details
            </Link>
            <h1 className="text-[36px] font-display font-[800] text-navratri-text tracking-tight">Secure Checkout</h1>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-[800] text-navratri-primary uppercase tracking-widest bg-white px-5 py-2.5 rounded-full shadow-card border border-slate-100 self-start sm:self-auto">
            <Shield className="w-4 h-4 text-emerald-500" />
            256-bit Encryption
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: WIZARD */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step Indicators */}
            <div className="flex items-center mb-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-[800] text-[14px] border ${step >= num ? 'bg-navratri-primary text-white border-navratri-primary shadow-premium' : 'bg-white text-slate-400 border-slate-200'} transition-all duration-300`}>
                    {step > num ? <CheckCircle className="w-5 h-5 text-white" /> : num}
                  </div>
                  {num < 3 && (
                    <div className={`w-16 h-[2px] ${step > num ? 'bg-navratri-primary' : 'bg-slate-200'} transition-colors mx-2 rounded-full`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-card p-8 md:p-10 border border-slate-100 shadow-card relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-premium"></div>
              
              {/* STEP 1: CUSTOMER DETAILS */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-6">Customer Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Full Name</label>
                      <input type="text" className="w-full px-5 py-3.5 rounded-[16px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary/30 outline-none transition-all font-[500] text-[15px] text-navratri-text" placeholder="Rahul Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Email Address</label>
                      <input type="email" className="w-full px-5 py-3.5 rounded-[16px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary/30 outline-none transition-all font-[500] text-[15px] text-navratri-text" placeholder="rahul@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Phone Number</label>
                      <input type="tel" className="w-full px-5 py-3.5 rounded-[16px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary/30 outline-none transition-all font-[500] text-[15px] text-navratri-text" placeholder="Enter 10 digits" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">City</label>
                      <input type="text" className="w-full px-5 py-3.5 rounded-[16px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary/30 outline-none transition-all font-[500] text-[15px] text-navratri-text" placeholder="Ahmedabad" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    </div>
                  </div>
                  <button onClick={handleNextStep} className="mt-8 px-8 py-4 bg-gradient-premium text-white font-[700] rounded-button hover:shadow-premium hover:-translate-y-0.5 active:scale-[0.98] transition-all w-full sm:w-auto text-[15px]">
                    Continue to Order Summary
                  </button>
                </div>
              )}

              {/* STEP 2: ORDER SUMMARY */}
              {step === 2 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-6">Order Confirmation</h2>
                  
                  <div className="bg-slate-50 p-6 rounded-[20px] border border-slate-100 mb-6 space-y-4">
                    {event.ticketTypes.map(pass => {
                      const qty = selectedPasses[pass.id] || 0;
                      if (qty === 0) return null;
                      return (
                        <div key={pass.id} className="flex justify-between items-center text-[15px] pb-4 border-b border-slate-200/60 last:border-0 last:pb-0">
                          <div>
                            <p className="font-[800] text-navratri-text">{pass.name}</p>
                            <p className="text-navratri-muted font-[500]">{qty} x {formatCurrency(pass.price)}</p>
                          </div>
                          <p className="font-[800] text-navratri-text">{formatCurrency(qty * pass.price)}</p>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-slate-200/60">
                       <div className="flex justify-between items-center text-[15px] py-2">
                        <p className="text-navratri-muted font-[600]">Convenience Fee</p>
                        <p className="font-[800] text-navratri-text">{formatCurrency(convenienceFee)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50/50 p-6 rounded-[20px] border border-purple-100 flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[11px] font-[800] text-navratri-primary uppercase tracking-widest mb-1">Total Payable</p>
                      <p className="text-[32px] font-display font-[800] text-navratri-text tracking-tight">{formatCurrency(totalAmount)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={handleNextStep} className="w-full sm:w-auto px-8 py-4 bg-gradient-premium text-white font-[700] rounded-button hover:shadow-premium hover:-translate-y-0.5 active:scale-[0.98] transition-all text-[15px]">
                      Proceed to Payment
                    </button>
                    <button onClick={() => setStep(1)} className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-navratri-text font-[700] rounded-button hover:bg-slate-50 transition-colors text-[15px]">
                      Edit Details
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-6">Select Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className={`flex items-center gap-4 p-5 rounded-[20px] border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-navratri-primary bg-purple-50/20' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-navratri-primary focus:ring-navratri-primary" />
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shrink-0">
                        <Smartphone className="w-5 h-5 text-navratri-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-[800] text-navratri-text text-[15px]">UPI</p>
                        <p className="text-[13px] text-navratri-muted font-[500]">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-5 rounded-[20px] border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-navratri-primary bg-purple-50/20' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-navratri-primary focus:ring-navratri-primary" />
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shrink-0">
                        <CreditCard className="w-5 h-5 text-navratri-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-[800] text-navratri-text text-[15px]">Credit / Debit Card</p>
                        <p className="text-[13px] text-navratri-muted font-[500]">Visa, Mastercard, RuPay</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-5 rounded-[20px] border-2 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-navratri-primary bg-purple-50/20' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-navratri-primary focus:ring-navratri-primary" />
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shrink-0">
                        <Building className="w-5 h-5 text-navratri-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-[800] text-navratri-text text-[15px]">Net Banking</p>
                        <p className="text-[13px] text-navratri-muted font-[500]">All Indian Banks supported</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleCheckout} 
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-premium text-white font-[700] rounded-button hover:shadow-premium hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 text-[15px]"
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing Securely...</>
                      ) : (
                        <>{process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'Complete Demo Booking' : `Pay ${formatCurrency(totalAmount)}`}</>
                      )}
                    </button>
                    {!isProcessing && (
                      <button onClick={() => setStep(2)} className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-navratri-text font-[700] rounded-button hover:bg-slate-50 transition-colors text-[15px]">
                        Back
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ORDER OVERVIEW */}
          <div className="space-y-6">
            <div className="bg-white rounded-card p-6 md:p-8 border border-slate-100 lg:sticky lg:top-28 shadow-card">
              <h3 className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest mb-6">Booking Details</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
                <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-[16px] border border-slate-100" />
                <div>
                  <h4 className="font-display font-[800] text-navratri-text leading-tight mb-2 text-[16px] line-clamp-2">{event.title}</h4>
                  <div className="flex items-center gap-1.5 text-[13px] text-navratri-muted font-[600] mb-1">
                    <Calendar className="w-3.5 h-3.5 text-navratri-primary" /> {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-navratri-muted font-[600]">
                    <Clock className="w-3.5 h-3.5 text-navratri-primary" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-[32px] font-display font-[800] text-navratri-text tracking-tight leading-none">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-[16px] text-[13px] text-navratri-muted font-[500] leading-relaxed border border-slate-100">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>Your payment is processed securely. We never store your card details.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
