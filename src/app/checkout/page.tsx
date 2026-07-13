'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, calculateConvenienceFee } from '@/lib/utils';
import type { Event } from '@/types';
import { CheckCircle, Shield, CreditCard, Smartphone, Building, ArrowLeft, Ticket, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const passesData = localStorage.getItem('checkout_passes');
    if (eventData && passesData) {
      setEvent(JSON.parse(eventData));
      setSelectedPasses(JSON.parse(passesData));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!event) return null;

  const ticketSubtotal = event.passes.reduce((sum, pass) => sum + pass.price * (selectedPasses[pass.id] || 0), 0);
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
            passes: selectedPasses,
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

    // Normal mock processing for non-demo (or real gateway logic would go here)
    setTimeout(() => {
      localStorage.setItem('recent_order', JSON.stringify({
        event,
        passes: selectedPasses,
        customer: formData,
        amount: totalAmount
      }));
      router.push('/payment-processing');
    }, 1500);
  };

  return (
    <div className="bg-[#F7F7F8] min-h-screen pt-[100px] pb-32 font-sans selection:bg-[#9333EA] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href={`/events/${event.id}/book`} className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#111111] font-[600] text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Ticket Selection
            </Link>
            <h1 className="text-3xl font-[800] text-[#111111] tracking-tight">Secure Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-[800] text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <Shield className="w-4 h-4 text-green-500" />
            256-bit Encryption
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: WIZARD */}
          <div className="lg:col-span-2">
            
            {/* Step Indicators */}
            <div className="flex items-center mb-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-[800] text-sm ${step >= num ? 'bg-[#9333EA] text-white' : 'bg-gray-200 text-gray-400'} transition-colors`}>
                    {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  {num < 3 && (
                    <div className={`w-12 h-1 ${step > num ? 'bg-[#9333EA]' : 'bg-gray-200'} transition-colors mx-2 rounded-full`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: CUSTOMER DETAILS */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-2xl font-[800] text-[#111111] mb-6">Customer Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input type="text" className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="Rahul Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input type="email" className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="rahul@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <input type="tel" className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest">City</label>
                        <input type="text" className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="Ahmedabad" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                      </div>
                    </div>
                    <button onClick={handleNextStep} className="mt-8 px-8 py-4 bg-[#111111] text-white font-[800] rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 w-full sm:w-auto">
                      Continue to Order Summary
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: ORDER SUMMARY */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-2xl font-[800] text-[#111111] mb-6">Order Confirmation</h2>
                    
                    <div className="bg-[#F7F7F8] p-6 rounded-2xl border border-gray-100 mb-6 space-y-4">
                      {event.passes.map(pass => {
                        const qty = selectedPasses[pass.id] || 0;
                        if (qty === 0) return null;
                        return (
                          <div key={pass.id} className="flex justify-between items-center text-sm pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <div>
                              <p className="font-[800] text-[#111111] text-base">{pass.name}</p>
                              <p className="text-gray-500 font-[500]">{qty} x {formatCurrency(pass.price)}</p>
                            </div>
                            <p className="font-[800] text-[#111111] text-base">{formatCurrency(qty * pass.price)}</p>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t border-gray-200">
                         <div className="flex justify-between items-center text-sm py-2">
                          <p className="text-gray-500 font-[600]">Convenience Fee</p>
                          <p className="font-[800] text-[#111111]">{formatCurrency(convenienceFee)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#9333EA]/5 p-6 rounded-2xl border border-[#9333EA]/10 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-[800] text-[#9333EA] uppercase tracking-widest mb-1">Total Payable</p>
                        <p className="text-3xl font-[800] text-[#111111] tracking-tight">{formatCurrency(totalAmount)}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                      <button onClick={handleNextStep} className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-white font-[800] rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-0.5">
                        Proceed to Payment
                      </button>
                      <button onClick={() => setStep(1)} className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-[#111111] font-[800] rounded-2xl hover:bg-gray-50 transition-colors">
                        Edit Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PAYMENT METHOD */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-2xl font-[800] text-[#111111] mb-6">Select Payment Method</h2>
                    
                    <div className="space-y-4 mb-8">
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#9333EA] bg-red-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#9333EA] focus:ring-[#9333EA]" />
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <Smartphone className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-[800] text-[#111111]">UPI</p>
                          <p className="text-xs text-gray-500 font-[500]">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </label>

                      <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#9333EA] bg-red-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#9333EA] focus:ring-[#9333EA]" />
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <CreditCard className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-[800] text-[#111111]">Credit / Debit Card</p>
                          <p className="text-xs text-gray-500 font-[500]">Visa, Mastercard, RuPay</p>
                        </div>
                      </label>

                      <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-[#9333EA] bg-red-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                        <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#9333EA] focus:ring-[#9333EA]" />
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <Building className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-[800] text-[#111111]">Net Banking</p>
                          <p className="text-xs text-gray-500 font-[500]">All Indian Banks supported</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={handleCheckout} 
                        disabled={isProcessing}
                        className="w-full sm:w-auto px-10 py-4 bg-[#9333EA] text-white font-[800] rounded-2xl hover:bg-[#7E22CE] transition-all shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {isProcessing ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Processing Securely...</>
                        ) : (
                          <>{process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'Complete Demo Booking' : `Pay ${formatCurrency(totalAmount)}`}</>
                        )}
                      </button>
                      {!isProcessing && (
                        <button onClick={() => setStep(2)} className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-[#111111] font-[800] rounded-2xl hover:bg-gray-50 transition-colors">
                          Back
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: ORDER OVERVIEW */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 lg:sticky lg:top-28">
              <h3 className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-6">Booking Details</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-2xl" />
                <div>
                  <h4 className="font-[800] text-[#111111] leading-tight mb-2">{event.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-[600] mb-1">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-[600]">
                    <Clock className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-[800] text-[#9333EA] tracking-tight">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl text-xs text-gray-500 font-[500] leading-relaxed">
                <Shield className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p>Your payment is processed securely. We never store your card details.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
