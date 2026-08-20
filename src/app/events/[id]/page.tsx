'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_EVENTS } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Calendar, Clock, ChevronDown, ChevronUp, Share2, Shield, User, Heart, CheckCircle } from 'lucide-react';
import type { Event } from '@/types';
import toast from 'react-hot-toast';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

export default function EventDetails({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPassId, setSelectedPassId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
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

  useEffect(() => {
    if (event && event.ticketTypes) {
      const activeTickets = event.ticketTypes.filter(t => t.status === 'available');
      if (activeTickets.length > 0 && !selectedPassId) {
        setSelectedPassId(activeTickets[0].id);
      }
    }
  }, [event, selectedPassId]);

  useEffect(() => {
    const selectedTicket = event?.ticketTypes?.find(t => t.id === selectedPassId);
    if (selectedTicket) {
      const maxQty = Math.min(selectedTicket.maxPerBooking, selectedTicket.remainingQuantity);
      if (quantity > maxQty) setQuantity(1);
    }
  }, [selectedPassId, event]);

  const activeTickets = event?.ticketTypes?.filter(t => t.status === 'available') || [];
  const hasTickets = activeTickets.length > 0;
  const minPrice = hasTickets ? Math.min(...activeTickets.map(t => t.price)) : 0;
  const selectedTicket = activeTickets.find(t => t.id === selectedPassId);
  const maxQty = selectedTicket ? Math.min(selectedTicket.maxPerBooking, selectedTicket.remainingQuantity) : 1;
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-navratri-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-navratri-primary/30 border-t-navratri-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.title, text: `Check out ${event.title}!`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFavourite = () => {
    toast.success('Event added to favourites!');
  };

  return (
    <div className="bg-navratri-bg min-h-[calc(100vh-50px)] pb-36 font-sans">
      
      {/* 1. FULL-WIDTH HERO */}
      <div className="w-full relative h-[40vh] md:h-[50vh] bg-slate-100 overflow-hidden">
        <img 
          src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
          alt={event.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Floating Actions on Top */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button onClick={handleFavourite} className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full active:scale-95 transition-transform hover:bg-white/30">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full active:scale-95 transition-transform hover:bg-white/30">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            
            {/* Title & Core Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-navratri-primary/10 text-navratri-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Garba & Navratri</span>
                <span className="bg-white/50 border border-navratri-border text-navratri-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{event.city}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-navratri-dark leading-tight tracking-tight mb-6">
                {event.title}
              </h1>
              
              <div className="flex flex-col gap-4 py-6 border-y border-navratri-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-navratri-border/50 shadow-sm shrink-0">
                    <Calendar className="w-6 h-6 text-navratri-primary" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-navratri-dark">
                      {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-navratri-muted font-medium">
                      {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-navratri-border/50 shadow-sm shrink-0">
                    <MapPin className="w-6 h-6 text-navratri-primary" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-navratri-dark">{event.venue}</p>
                    <p className="text-sm text-navratri-muted font-medium">{event.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-navratri-dark">About This Event</h2>
              <p className="text-navratri-text font-medium leading-relaxed text-base">
                {event.description} Get ready for a premium event experience featuring live performances, vibrant energy and secure digital entry. Book your pass online and receive an instant QR ticket for smooth access at the venue.
              </p>
              
              <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                {['Live performances', 'Premium venue', 'Secure QR entry', 'Food and beverage zone'].map((highlight, i) => (
                  <li key={i} className="flex items-center gap-3 text-navratri-dark font-semibold text-sm">
                    <CheckCircle className="w-5 h-5 text-navratri-primary shrink-0" /> {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Artist Lineup */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-navratri-dark">Artist Lineup</h2>
              <div className="flex items-center gap-4 p-4 card-base rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-200 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${event.bannerUrl || '/demo/events/poster_navratri.jpg'}')` }}></div>
                <div>
                  <h3 className="text-lg font-bold text-navratri-dark">Live Performances</h3>
                  <p className="text-sm font-medium text-navratri-muted">Starts at 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-navratri-dark">Location</h2>
              <div className="w-full h-[200px] bg-white rounded-2xl flex flex-col items-center justify-center text-navratri-muted border border-navratri-border shadow-sm">
                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                <span className="font-semibold text-sm">Map View</span>
              </div>
              <a href={`https://maps.google.com/?q=${event.venue} ${event.city}`} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full inline-flex justify-center items-center gap-2 px-6 py-4 rounded-xl text-base">
                <MapPin className="w-5 h-5" /> Get Directions
              </a>
            </div>

            {/* MOBILE TICKET SELECTION (Inline) */}
            <div className="pt-6 border-t border-navratri-border/40 block lg:hidden">
              <h2 className="text-2xl font-display font-bold text-navratri-dark mb-4">Select Tickets</h2>
              <div className="space-y-3">
                {activeTickets.map(tt => (
                  <label key={tt.id} className={`flex items-start p-4 card-base rounded-2xl cursor-pointer transition-all ${selectedPassId === tt.id ? 'border-navratri-primary ring-1 ring-navratri-primary' : 'border-navratri-border'}`}>
                    <input 
                      type="radio" 
                      name="mobile_ticket" 
                      value={tt.id} 
                      checked={selectedPassId === tt.id} 
                      onChange={() => setSelectedPassId(tt.id)}
                      className="mt-1 mr-4 accent-navratri-primary w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-base text-navratri-dark">{tt.name}</span>
                        <span className="font-extrabold text-lg text-navratri-primary">{formatCurrency(tt.price)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-navratri-muted">
                        {tt.description && <span className="w-full text-sm mb-2 text-navratri-text">{tt.description}</span>}
                        <span className="bg-navratri-bg border border-navratri-border px-2 py-1 rounded-md">{tt.entryCount} Entry</span>
                        {tt.gateNumber && <span className="bg-navratri-bg border border-navratri-border px-2 py-1 rounded-md">Gate {tt.gateNumber}</span>}
                        {tt.remainingQuantity < 50 && <span className="text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-md">Only {tt.remainingQuantity} left</span>}
                      </div>
                    </div>
                  </label>
                ))}
                {!hasTickets && <div className="text-center p-6 card-base rounded-2xl font-bold text-navratri-muted">Sold Out</div>}
              </div>
            </div>

            {/* FAQs */}
            <div className="pt-6 border-t border-navratri-border/40">
              <h2 className="text-2xl font-display font-bold text-navratri-dark mb-4">FAQ</h2>
              <div className="space-y-4">
                {[
                  { q: 'Is the ticket refundable?', a: 'Refunds depend on the event policy. Generally, tickets are non-refundable unless the event is cancelled.' },
                  { q: 'What time should I arrive?', a: 'We recommend arriving at least 30 minutes before the event starts.' },
                ].map((faq, i) => (
                  <details key={i} className="group card-base rounded-2xl overflow-hidden">
                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-base text-navratri-dark">
                      {faq.q}
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="w-5 h-5 text-navratri-muted" />
                      </span>
                    </summary>
                    <div className="text-navratri-text text-sm px-5 pb-5 font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT (lg:col-span-1): STICKY BOOKING PANEL (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <div className="lg:sticky lg:top-24 card-base rounded-3xl p-6">
              <h3 className="text-3xl font-display font-extrabold text-navratri-dark mb-2">
                {hasTickets ? formatCurrency(minPrice) : 'Sold out'}
              </h3>
              <p className="text-sm font-medium text-navratri-muted mb-6">Starting price</p>
              
              <div className="space-y-6 mb-6">
                <div>
                  <label className="text-sm font-bold text-navratri-dark mb-3 block">Select Ticket</label>
                  <div className="space-y-3">
                    {activeTickets.map(tt => (
                      <label key={tt.id} className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${selectedPassId === tt.id ? 'border-navratri-primary bg-navratri-primary/5' : 'border-navratri-border'}`}>
                        <input 
                          type="radio" 
                          name="desktop_ticket" 
                          value={tt.id} 
                          checked={selectedPassId === tt.id} 
                          onChange={() => setSelectedPassId(tt.id)}
                          className="mt-1 mr-3 accent-navratri-primary w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-navratri-dark">{tt.name}</span>
                            <span className="font-extrabold text-sm text-navratri-primary">{formatCurrency(tt.price)}</span>
                          </div>
                          {selectedPassId === tt.id && (
                            <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-navratri-muted mt-2">
                              <span className="bg-white border border-navratri-border px-1.5 py-0.5 rounded">{tt.entryCount} Entry</span>
                              {tt.gateNumber && <span className="bg-white border border-navratri-border px-1.5 py-0.5 rounded">Gate {tt.gateNumber}</span>}
                              {tt.remainingQuantity < 50 && <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Only {tt.remainingQuantity} left</span>}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                    {!hasTickets && <div className="text-center p-4 border border-navratri-border rounded-xl font-bold text-navratri-muted">Sold Out</div>}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-bold text-navratri-dark mb-3 block">Quantity</label>
                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-navratri-bg border border-navratri-border">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!hasTickets || quantity <= 1}
                      className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-navratri-dark border border-navratri-border disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-lg text-navratri-dark">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      disabled={!hasTickets || quantity >= maxQty}
                      className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-navratri-dark border border-navratri-border disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {hasTickets && selectedTicket && (
                <div className="flex justify-between items-center py-5 border-t border-navratri-border/50 mb-4">
                  <span className="text-base font-bold text-navratri-dark">Total</span>
                  <span className="text-2xl font-extrabold text-navratri-dark">{formatCurrency(totalPrice)}</span>
                </div>
              )}

              <button 
                onClick={() => {
                  if (!selectedPassId || !hasTickets) return;
                  localStorage.setItem('checkout_event', JSON.stringify(event));
                  localStorage.setItem('checkout_ticketTypes', JSON.stringify({ [selectedPassId]: quantity }));
                  router.push(`/checkout/${event.id}`);
                }}
                disabled={!hasTickets}
                className="btn-primary w-full py-4 rounded-xl text-lg mb-4"
              >
                {hasTickets ? 'Book Now' : 'Sold Out'}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-navratri-muted">
                <Shield className="w-4 h-4" /> Secure checkout · Instant digital pass
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (TICKET SELECTION & BOOKING CTA) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-navratri-border lg:hidden z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] px-4 flex items-center justify-between">
        <div className="flex flex-col shrink-0">
          <span className="text-xs text-navratri-muted font-bold">Total Price</span>
          <span className="text-xl font-extrabold text-navratri-dark leading-none mt-1">
            {hasTickets ? formatCurrency(totalPrice) : '-'}
          </span>
        </div>
        <button 
          onClick={() => {
            if (!selectedPassId || !hasTickets) return;
            localStorage.setItem('checkout_event', JSON.stringify(event));
            localStorage.setItem('checkout_ticketTypes', JSON.stringify({ [selectedPassId]: quantity }));
            router.push(`/checkout/${event.id}`);
          }}
          disabled={!hasTickets}
          className="btn-primary py-2.5 px-8 rounded-xl flex items-center justify-center text-base"
        >
          {hasTickets ? 'Book Tickets' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}
