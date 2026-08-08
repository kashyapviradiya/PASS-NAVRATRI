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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-navratri-primary/30 border-t-navratri-primary rounded-full animate-spin"></div>
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
    <div className="bg-white min-h-[calc(100vh-50px)] pb-32 md:pb-24 font-sans">
      
      {/* 1. FULL-BLEED HERO POSTER ON MOBILE */}
      <div className="w-full relative pb-[100%] md:pb-[40%] bg-slate-100 overflow-hidden">
        <img 
          src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
          alt={event.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Floating Actions on Top */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button onClick={handleFavourite} className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full active:scale-95 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full active:scale-95 transition-transform">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* Title & Core Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-navratri-primary/10 text-navratri-primary text-[10px] font-[800] px-2 py-1 rounded-full uppercase tracking-wider">Garba & Navratri</span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-[800] px-2 py-1 rounded-full uppercase tracking-wider">{event.city}</span>
              </div>
              <h1 className="text-[28px] md:text-[36px] font-[850] text-gray-900 leading-tight tracking-tight mb-4">
                {event.title}
              </h1>
              
              <div className="flex flex-col gap-3 py-4 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-[700] text-gray-900">
                      {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[12px] text-gray-500 font-[500]">
                      {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-[700] text-gray-900">{event.venue}</p>
                    <p className="text-[12px] text-gray-500 font-[500] line-clamp-1">{event.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-[18px] md:text-[20px] font-[800] text-gray-900 mb-2">About This Event</h2>
              <p className="text-gray-600 font-[500] leading-relaxed text-[14px] mb-4">
                {event.description} Get ready for a premium event experience featuring live performances, vibrant energy and secure digital entry. Book your pass online and receive an instant QR ticket for smooth access at the venue.
              </p>
              
              <ul className="grid sm:grid-cols-2 gap-3">
                {['Live performances', 'Premium venue', 'Secure QR entry', 'Food and beverage zone'].map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 font-[600] text-[13px]">
                    <CheckCircle className="w-4 h-4 text-navratri-primary shrink-0" /> {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Artist Lineup */}
            <div>
              <h2 className="text-[18px] md:text-[20px] font-[800] text-gray-900 mb-4">Artist Lineup</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${event.bannerUrl || '/demo/events/poster_navratri.jpg'}')` }}></div>
                <div>
                  <h3 className="text-[16px] font-[800] text-gray-900">Live Performances</h3>
                  <p className="text-[13px] font-[500] text-gray-500">Starts at 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div>
              <h2 className="text-[18px] md:text-[20px] font-[800] text-gray-900 mb-4">Location</h2>
              <div className="w-full h-[200px] bg-slate-100 rounded-[16px] flex flex-col items-center justify-center text-gray-500 mb-4 border border-gray-200">
                <MapPin className="w-8 h-8 mb-2" />
                <span className="font-[600] text-[13px]">Map View</span>
              </div>
              <a href={`https://maps.google.com/?q=${event.venue} ${event.city}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 bg-gray-100 text-gray-900 font-[700] rounded-[12px] text-[14px] active:scale-95 transition-transform">
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
            </div>

            {/* Ticket Selection (Mobile & Desktop) */}
            <div className="pt-4 border-t border-gray-100 block lg:hidden">
              <h2 className="text-[18px] md:text-[20px] font-[800] text-gray-900 mb-4">Select Tickets</h2>
              <div className="space-y-3">
                {activeTickets.map(tt => (
                  <label key={tt.id} className={`flex items-start p-3 border rounded-[12px] cursor-pointer transition-colors ${selectedPassId === tt.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                    <input 
                      type="radio" 
                      name="mobile_ticket" 
                      value={tt.id} 
                      checked={selectedPassId === tt.id} 
                      onChange={() => setSelectedPassId(tt.id)}
                      className="mt-1 mr-3 accent-gray-900 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-[700] text-[14px] text-gray-900">{tt.name}</span>
                        <span className="font-[850] text-[15px] text-gray-900">{formatCurrency(tt.price)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] font-[600] text-gray-500">
                        {tt.description && <span className="w-full text-[12px] mb-1">{tt.description}</span>}
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{tt.entryCount} Entry</span>
                        {tt.gateNumber && <span className="bg-gray-100 px-2 py-0.5 rounded">Gate {tt.gateNumber}</span>}
                        {tt.remainingQuantity < 50 && <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Only {tt.remainingQuantity} left</span>}
                      </div>
                    </div>
                  </label>
                ))}
                {!hasTickets && <div className="text-center p-4 bg-gray-50 rounded-[12px] font-[700] text-gray-500">Sold Out</div>}
              </div>
            </div>

            {/* FAQs */}
            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-[18px] md:text-[20px] font-[800] text-gray-900 mb-4">FAQ</h2>
              <div className="space-y-3">
                {[
                  { q: 'Is the ticket refundable?', a: 'Refunds depend on the event policy. Generally, tickets are non-refundable unless the event is cancelled.' },
                  { q: 'What time should I arrive?', a: 'We recommend arriving at least 30 minutes before the event starts.' },
                ].map((faq, i) => (
                  <details key={i} className="group bg-gray-50 rounded-[12px] overflow-hidden">
                    <summary className="flex justify-between items-center font-[700] cursor-pointer list-none p-4 text-[14px] text-gray-900">
                      {faq.q}
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </span>
                    </summary>
                    <div className="text-gray-600 text-[13px] px-4 pb-4 font-[500]">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* DESKTOP BOOKING PANEL */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-24 bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
              <h3 className="text-[28px] font-[850] text-gray-900 mb-6">
                {hasTickets ? formatCurrency(minPrice) : 'Sold out'}
              </h3>
              
              <div className="space-y-5 mb-6">
                <div>
                  <label className="text-[12px] font-[700] text-gray-900 mb-2 block">Ticket Type</label>
                  <div className="relative">
                    <select 
                      value={selectedPassId}
                      onChange={(e) => setSelectedPassId(e.target.value)}
                      disabled={!hasTickets}
                      className="w-full px-3 py-3 rounded-[12px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-navratri-primary font-[600] text-gray-900 text-[14px] appearance-none"
                    >
                      {activeTickets.map(tt => (
                        <option key={tt.id} value={tt.id}>{tt.name} - {formatCurrency(tt.price)}</option>
                      ))}
                      {!hasTickets && <option value="">No Tickets Available</option>}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-[700] text-gray-900 mb-2 block">Quantity</label>
                  <div className="flex items-center justify-between p-1 rounded-[12px] bg-gray-50 border border-gray-200">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!hasTickets || quantity <= 1}
                      className="w-10 h-10 rounded-[8px] bg-white shadow-sm flex items-center justify-center font-[700] text-gray-900 border border-gray-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="font-[700] text-[16px] text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      disabled={!hasTickets || quantity >= maxQty}
                      className="w-10 h-10 rounded-[8px] bg-white shadow-sm flex items-center justify-center font-[700] text-gray-900 border border-gray-200 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {hasTickets && selectedTicket && (
                <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-4">
                  <span className="text-[14px] font-[700] text-gray-900">Total</span>
                  <span className="text-[20px] font-[850] text-gray-900">{formatCurrency(totalPrice)}</span>
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
                className="w-full bg-gray-900 text-white font-[700] py-3.5 rounded-[12px] flex justify-center items-center text-[15px] active:scale-95 transition-transform disabled:opacity-50"
              >
                {hasTickets ? 'Book Now' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (TICKET SELECTION & BOOKING CTA) */}
      <div className="fixed bottom-[56px] left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 lg:hidden z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        
        {/* Compact Quantity Selector on Mobile */}
        {hasTickets && (
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-[700] text-gray-700">Quantity</span>
            <div className="flex items-center gap-2 bg-gray-100 rounded-[8px] px-1 shrink-0">
               <button 
                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 disabled={quantity <= 1}
                 className="w-7 h-7 flex items-center justify-center font-[700] text-gray-900"
               >-</button>
               <span className="font-[700] text-[13px] text-gray-900 w-3 text-center">{quantity}</span>
               <button 
                 onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                 disabled={quantity >= maxQty}
                 className="w-7 h-7 flex items-center justify-center font-[700] text-gray-900"
               >+</button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-gray-500 uppercase font-[700]">Total</span>
            <span className="text-[18px] font-[850] text-gray-900 leading-none">
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
            className="flex-1 bg-gray-900 text-white font-[700] py-3 rounded-[12px] flex items-center justify-center shadow-sm active:scale-95 transition-transform text-[14px]"
          >
            {hasTickets ? 'Book Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
