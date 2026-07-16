'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_EVENTS } from '@/lib/demo-data';
import { formatCurrency, calculateConvenienceFee } from '@/lib/utils';
import { MapPin, Calendar, Clock, ChevronRight, AlertCircle, Ticket, Info } from 'lucide-react';
import type { Event, PassType } from '@/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function TicketSelectionPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPasses, setSelectedPasses] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/get-events?id=${params.id}`);
        const data = await res.json();
        if (data.success) {
          setEvent(data.event);
        } else {
          const found = DEMO_EVENTS.find(e => e.id === params.id);
          setEvent(found || DEMO_EVENTS[0]);
        }
      } catch (error) {
        const found = DEMO_EVENTS.find(e => e.id === params.id);
        setEvent(found || DEMO_EVENTS[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center pt-[80px]">
        <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  const handleIncrement = (passId: string) => {
    const pass = (event.passes || []).find(p => p.id === passId)!;
    const current = selectedPasses[passId] || 0;
    const maxPerUser = 6;
    if (current < maxPerUser && current < pass.available) {
      setSelectedPasses({ ...selectedPasses, [passId]: current + 1 });
    } else {
      toast.error(`Maximum ${maxPerUser} passes allowed per user or sold out.`);
    }
  };

  const handleDecrement = (passId: string) => {
    const current = selectedPasses[passId] || 0;
    if (current > 0) {
      setSelectedPasses({ ...selectedPasses, [passId]: current - 1 });
    }
  };

  const totalSelected = Object.values(selectedPasses).reduce((a, b) => a + b, 0);
  const ticketSubtotal = (event.passes || []).reduce((sum, pass) => sum + pass.price * (selectedPasses[pass.id] || 0), 0);
  const convenienceFee = calculateConvenienceFee(ticketSubtotal);
  const taxes = 0; // Assuming inclusive of GST for now, or you can add logic
  const totalAmount = ticketSubtotal + convenienceFee + taxes;

  const handleProceed = () => {
    if (totalSelected === 0) {
      toast.error('Please select at least one pass to continue.');
      return;
    }
    localStorage.setItem('checkout_event', JSON.stringify(event));
    localStorage.setItem('checkout_passes', JSON.stringify(selectedPasses));
    router.push(`/checkout`); // Exact route matching spec
  };

  return (
    <div className="bg-navratri-bg min-h-[calc(100vh-64px)] pb-32 font-sans selection:bg-navratri-accent selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[40px] font-display font-[700] text-navratri-text mb-2 tracking-tight">Choose Your Pass</h1>
          <p className="text-[18px] text-navratri-muted font-[500]">Select your ticket type and quantity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: TICKET OPTIONS */}
          <div className="lg:col-span-2 space-y-6">
            {(event.passes || []).filter(p => p.enabled !== false).map((pass) => (
              <motion.div 
                key={pass.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-card p-6 md:p-8 border ${selectedPasses[pass.id] > 0 ? 'border-navratri-accent shadow-sm' : 'border-navratri-lightGrey'} transition-all`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[24px] font-display font-[700] text-navratri-text">{pass.name}</h3>
                      {pass.available < 100 && (
                        <span className="bg-red-50 text-navratri-accent text-[11px] font-[700] px-3 py-1.5 rounded-[10px] tracking-wider uppercase">Only {pass.available} Left</span>
                      )}
                    </div>
                    <p className="text-navratri-text font-[700] text-[24px] mb-4">{formatCurrency(pass.price)}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {(pass.benefits || []).map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-[15px] text-navratri-muted font-[500]">
                          <span className="w-1.5 h-1.5 bg-navratri-lightGrey rounded-full"></span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between md:border-l border-navratri-lightGrey md:pl-6 shrink-0">
                    <div className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-4">Select Quantity</div>
                    <div className="flex items-center gap-4 bg-navratri-bg p-2 rounded-[16px] border border-navratri-lightGrey">
                      <button 
                        onClick={() => handleDecrement(pass.id)}
                        disabled={!selectedPasses[pass.id]}
                        className="w-12 h-12 rounded-[12px] bg-white shadow-sm flex items-center justify-center font-[700] text-[20px] disabled:opacity-50 disabled:shadow-none hover:bg-gray-50 transition-colors border border-navratri-lightGrey"
                      >
                        -
                      </button>
                      <span className="font-[700] text-[20px] w-6 text-center">{selectedPasses[pass.id] || 0}</span>
                      <button 
                        onClick={() => handleIncrement(pass.id)}
                        disabled={pass.available === 0}
                        className="w-12 h-12 rounded-[12px] bg-white shadow-sm flex items-center justify-center font-[700] text-[20px] disabled:opacity-50 hover:bg-gray-50 transition-colors border border-navratri-lightGrey"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="space-y-6">
            
            {/* EVENT SUMMARY */}
            <div className="bg-white rounded-card p-6 md:p-8 border border-navratri-lightGrey shadow-sm">
              <h3 className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-4">Event Summary</h3>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-navratri-lightGrey">
                <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-[16px]" />
                <div>
                  <h4 className="font-display font-[700] text-navratri-text leading-tight mb-2 text-[18px]">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-[13px] font-[600] text-navratri-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-navratri-bg p-4 rounded-[16px] border border-navratri-lightGrey">
                <MapPin className="w-4 h-4 text-navratri-accent shrink-0 mt-0.5" />
                <p className="text-[13px] font-[600] text-navratri-text">{event.venue}</p>
              </div>
            </div>

            {/* BILLING SUMMARY */}
            <div className="bg-white rounded-card p-6 md:p-8 border border-navratri-lightGrey shadow-sm lg:sticky lg:top-28">
              <h3 className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-6">Order Summary</h3>
              
              {totalSelected === 0 ? (
                <div className="text-center py-6 border-b border-navratri-lightGrey mb-6">
                  <Ticket className="w-8 h-8 text-navratri-muted/50 mx-auto mb-2" />
                  <p className="text-[14px] font-[600] text-navratri-muted">No passes selected</p>
                </div>
              ) : (
                <div className="space-y-4 border-b border-navratri-lightGrey pb-6 mb-6">
                  {(event.passes || []).map(pass => {
                    const qty = selectedPasses[pass.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <div key={pass.id} className="flex justify-between items-start text-[15px]">
                        <div>
                          <p className="font-[600] text-navratri-text">{pass.name}</p>
                          <p className="text-navratri-muted font-[500]">{qty} x {formatCurrency(pass.price)}</p>
                        </div>
                        <p className="font-[700] text-navratri-text">{formatCurrency(qty * pass.price)}</p>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between items-center text-[15px] pt-2">
                    <p className="text-navratri-muted font-[600] flex items-center gap-1">Convenience Fee <Info className="w-3 h-3 text-navratri-muted/70" /></p>
                    <p className="font-[700] text-navratri-text">{formatCurrency(convenienceFee)}</p>
                  </div>
                  {taxes > 0 && (
                    <div className="flex justify-between items-center text-[15px]">
                      <p className="text-navratri-muted font-[600]">Taxes</p>
                      <p className="font-[700] text-navratri-text">{formatCurrency(taxes)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-[32px] font-display font-[700] text-navratri-text tracking-tight">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                disabled={totalSelected === 0}
                className="w-full bg-navratri-primary text-white font-[700] py-4 rounded-button flex justify-center items-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none shadow-sm hover:-translate-y-0.5 text-[16px]"
              >
                Continue to Checkout <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-navratri-lightGrey p-4 lg:hidden z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700]">{totalSelected} Ticket{totalSelected > 1 ? 's' : ''}</span>
              <span className="text-[24px] font-display font-[700] text-navratri-text tracking-tight">{formatCurrency(totalAmount)}</span>
            </div>
            <button onClick={handleProceed} className="bg-navratri-primary text-white font-[700] px-8 py-3.5 rounded-button flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-transform text-[15px]">
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
