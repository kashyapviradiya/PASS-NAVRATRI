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
        <div className="w-16 h-16 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
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
    <div className="bg-[#F7F7F8] min-h-screen pt-[100px] pb-32 font-sans selection:bg-[#E53935] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-[800] text-[#111111] mb-2 tracking-tight">Choose Your Pass</h1>
          <p className="text-lg text-[#6B7280] font-[500]">Select your ticket type and quantity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: TICKET OPTIONS */}
          <div className="lg:col-span-2 space-y-6">
            {(event.passes || []).filter(p => p.enabled !== false).map((pass) => (
              <motion.div 
                key={pass.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-6 md:p-8 border ${selectedPasses[pass.id] > 0 ? 'border-[#E53935] shadow-md shadow-red-500/5' : 'border-gray-200'} transition-all`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-[800] text-[#111111]">{pass.name}</h3>
                      {pass.available < 100 && (
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md">Only {pass.available} Left</span>
                      )}
                    </div>
                    <p className="text-[#E53935] font-[800] text-xl mb-4">{formatCurrency(pass.price)}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {(pass.benefits || []).map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[#6B7280] font-[500]">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between md:border-l border-gray-100 md:pl-6 shrink-0">
                    <div className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-4">Select Quantity</div>
                    <div className="flex items-center gap-4 bg-[#F7F7F8] p-2 rounded-2xl border border-gray-200">
                      <button 
                        onClick={() => handleDecrement(pass.id)}
                        disabled={!selectedPasses[pass.id]}
                        className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-[800] text-xl disabled:opacity-50 disabled:shadow-none hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-[800] text-xl w-6 text-center">{selectedPasses[pass.id] || 0}</span>
                      <button 
                        onClick={() => handleIncrement(pass.id)}
                        disabled={pass.available === 0}
                        className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-[800] text-xl disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
            <div className="bg-white rounded-3xl p-6 border border-gray-200">
              <h3 className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-4">Event Summary</h3>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} alt={event.title} className="w-20 h-20 object-cover rounded-2xl" />
                <div>
                  <h4 className="font-[800] text-[#111111] leading-tight mb-2">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-[600] text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-[#F7F7F8] p-3 rounded-xl border border-gray-100">
                <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <p className="text-xs font-[600] text-[#111111]">{event.venue}</p>
              </div>
            </div>

            {/* BILLING SUMMARY */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 lg:sticky lg:top-28">
              <h3 className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-6">Order Summary</h3>
              
              {totalSelected === 0 ? (
                <div className="text-center py-6 border-b border-gray-100 mb-6">
                  <Ticket className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-[600] text-gray-400">No passes selected</p>
                </div>
              ) : (
                <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                  {(event.passes || []).map(pass => {
                    const qty = selectedPasses[pass.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <div key={pass.id} className="flex justify-between items-start text-sm">
                        <div>
                          <p className="font-[800] text-[#111111]">{pass.name}</p>
                          <p className="text-gray-500 font-[500]">{qty} x {formatCurrency(pass.price)}</p>
                        </div>
                        <p className="font-[800] text-[#111111]">{formatCurrency(qty * pass.price)}</p>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between items-center text-sm pt-2">
                    <p className="text-gray-500 font-[600] flex items-center gap-1">Convenience Fee <Info className="w-3 h-3 text-gray-400" /></p>
                    <p className="font-[800] text-[#111111]">{formatCurrency(convenienceFee)}</p>
                  </div>
                  {taxes > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-500 font-[600]">Taxes</p>
                      <p className="font-[800] text-[#111111]">{formatCurrency(taxes)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-[800] text-[#E53935] tracking-tight">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                disabled={totalSelected === 0}
                className="w-full bg-[#111111] text-white font-[800] py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none shadow-lg hover:-translate-y-0.5"
              >
                Continue to Checkout <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-[800]">{totalSelected} Ticket{totalSelected > 1 ? 's' : ''}</span>
              <span className="text-2xl font-[800] text-[#111111] tracking-tight">{formatCurrency(totalAmount)}</span>
            </div>
            <button onClick={handleProceed} className="bg-[#111111] text-white font-[800] px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-transform">
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
