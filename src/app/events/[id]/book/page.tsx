'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_EVENTS } from '@/lib/demo-data';
import { formatCurrency, calculateConvenienceFee } from '@/lib/utils';
import { MapPin, Calendar, Clock, ChevronRight, AlertCircle, Ticket, Info } from 'lucide-react';
import type { Event, PassType } from '@/types';
import toast from 'react-hot-toast';

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
        <div className="min-h-screen bg-navratri-bg flex items-center justify-center pt-[80px]">
          <div className="w-16 h-16 border-4 border-navratri-primary border-t-transparent rounded-full animate-spin"></div>
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
    <div className="bg-navratri-bg min-h-screen pb-32 font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navratri-text mb-4 tracking-tight">Choose Your Pass</h1>
          <p className="text-lg text-navratri-muted">Select your ticket type and quantity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: TICKET OPTIONS */}
          <div className="lg:col-span-2 space-y-6">
            {(event.passes || []).filter(p => p.enabled !== false).map((pass) => {
              const isSelected = selectedPasses[pass.id] > 0;
              return (
                <div 
                  key={pass.id}
                  className={`card-base p-6 md:p-8 border-2 transition-all duration-300 hover:shadow-card-hover ${isSelected ? 'border-navratri-primary bg-navratri-primary/5' : 'border-navratri-border bg-white'}`}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-display font-bold text-navratri-text">{pass.name}</h3>
                        {pass.available < 100 && (
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Only {pass.available} Left</span>
                        )}
                      </div>
                      <p className="text-navratri-primary font-extrabold text-2xl mb-4">{formatCurrency(pass.price)}</p>
                      
                      <ul className="space-y-2 mb-6 md:mb-0">
                        {(pass.benefits || []).map((benefit: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-navratri-muted">
                            <span className="w-1.5 h-1.5 bg-navratri-gold rounded-full mt-1.5 shrink-0"></span> 
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col items-start md:items-end justify-between md:border-l border-navratri-border md:pl-6 shrink-0">
                      <div className="text-xs font-bold text-navratri-muted uppercase tracking-widest mb-4">Quantity</div>
                      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-navratri-border shadow-sm">
                        <button 
                          onClick={() => handleDecrement(pass.id)}
                          disabled={!selectedPasses[pass.id]}
                          className="w-10 h-10 rounded-lg bg-navratri-bg flex items-center justify-center font-bold text-xl disabled:opacity-50 hover:bg-gray-100 transition-colors text-navratri-text"
                        >
                          -
                        </button>
                        <span className="font-bold text-xl w-6 text-center text-navratri-text">{selectedPasses[pass.id] || 0}</span>
                        <button 
                          onClick={() => handleIncrement(pass.id)}
                          disabled={pass.available === 0}
                          className="w-10 h-10 rounded-lg bg-navratri-bg flex items-center justify-center font-bold text-xl disabled:opacity-50 hover:bg-gray-100 transition-colors text-navratri-text"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="card-base p-6 md:p-8 border border-navratri-border bg-white lg:sticky lg:top-24">
              <h3 className="text-xl font-display font-bold text-navratri-text mb-6">Order Summary</h3>
              
              {/* Event Info */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-navratri-border">
                <img src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} alt={event.title || event.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                <div>
                  <h4 className="font-display font-bold text-navratri-text leading-tight mb-2 text-lg line-clamp-2">{event.title}</h4>
                  <div className="flex flex-col gap-1 text-sm text-navratri-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 shrink-0 text-navratri-primary" /> {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 shrink-0 text-navratri-primary mt-0.5" /> <span className="line-clamp-2">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Line Items */}
              {totalSelected === 0 ? (
                <div className="text-center py-6 mb-6">
                  <Ticket className="w-8 h-8 text-navratri-border mx-auto mb-2" />
                  <p className="text-sm font-medium text-navratri-muted">No passes selected yet</p>
                </div>
              ) : (
                <div className="space-y-4 pb-6 mb-6 border-b border-navratri-border">
                  {(event.passes || []).map(pass => {
                    const qty = selectedPasses[pass.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <div key={pass.id} className="flex justify-between items-start text-sm">
                        <div>
                          <p className="font-bold text-navratri-text">{pass.name}</p>
                          <p className="text-navratri-muted">{qty} x {formatCurrency(pass.price)}</p>
                        </div>
                        <p className="font-bold text-navratri-text">{formatCurrency(qty * pass.price)}</p>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between items-center text-sm pt-2">
                    <p className="text-navratri-muted flex items-center gap-1">Convenience Fee <Info className="w-3.5 h-3.5" /></p>
                    <p className="font-bold text-navratri-text">{formatCurrency(convenienceFee)}</p>
                  </div>
                  {taxes > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-navratri-muted">Taxes</p>
                      <p className="font-bold text-navratri-text">{formatCurrency(taxes)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-end mb-8">
                <p className="text-sm font-bold text-navratri-muted uppercase tracking-widest">Total</p>
                <p className="text-3xl font-display font-bold text-navratri-primary tracking-tight">{formatCurrency(totalAmount)}</p>
              </div>

              <button 
                onClick={handleProceed}
                disabled={totalSelected === 0}
                className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-navratri-border p-4 lg:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-navratri-muted uppercase tracking-widest font-bold">{totalSelected} Ticket{totalSelected > 1 ? 's' : ''}</span>
              <span className="text-2xl font-display font-bold text-navratri-primary tracking-tight">{formatCurrency(totalAmount)}</span>
            </div>
            <button onClick={handleProceed} className="btn-primary px-8 py-3.5 flex items-center gap-2 text-base">
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
