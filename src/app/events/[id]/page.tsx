'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_EVENTS } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Calendar, Clock, Music, AlertCircle, ChevronRight, ChevronDown, ChevronUp, ExternalLink, Share2, Shield, Users, User, Star, Image as ImageIcon, Heart, CheckCircle } from 'lucide-react';
import type { Event } from '@/types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

export default function EventDetails({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const eventFaqs = [
    { q: 'Is the ticket refundable?', a: 'Refunds depend on the event policy. Generally, tickets are non-refundable unless the event is cancelled.' },
    { q: 'Can I transfer the ticket?', a: 'Tickets are usually non-transferable. Please bring a valid ID matching the name on the ticket.' },
    { q: 'Is parking available?', a: 'Yes, premium valet and self-parking are available at the venue.' },
    { q: 'What time should I arrive?', a: 'We recommend arriving at least 30 minutes before the event starts.' },
    { q: 'Can children attend?', a: 'Yes, but age restrictions apply as per the event guidelines.' },
  ];

  return (
    <div className="bg-[#F7F7F8] min-h-screen pb-32 lg:pb-20 font-sans pt-[60px]">
      
      {/* 1. TOP SECTION (HERO) */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-[#111111]">
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-12 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto z-10 flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#9333EA] text-white text-[10px] font-[800] px-3 py-1 rounded-full tracking-widest uppercase">Garba & Navratri</span>
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-[800] px-3 py-1 rounded-full tracking-widest uppercase">{event.city}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-[800] text-white leading-tight tracking-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-white/90 text-sm font-[600]">
                <Calendar className="w-5 h-5 text-[#9333EA]" /> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-3 text-white/90 font-[500] text-lg">
                <Clock className="w-5 h-5 text-[#9333EA]" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="flex items-center gap-3 text-white/90 font-[500] text-lg">
                <MapPin className="w-5 h-5 text-[#9333EA]" /> {event.venue}
              </div>
              <div className="flex items-center gap-3 text-white/90 font-[500] text-lg">
                <User className="w-5 h-5 text-[#9333EA]" /> All Ages
              </div>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-3">
            <button onClick={handleFavourite} className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-[#9333EA] hover:border-transparent transition-all shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white hover:text-[#111111] hover:border-transparent transition-all shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 2. EVENT DESCRIPTION */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-[800] text-[#111111] mb-4">About This Event</h2>
              <p className="text-[#6B7280] font-[500] leading-relaxed text-lg mb-8">
                {event.description} Get ready for a premium event experience featuring live performances, vibrant energy and secure digital entry. Book your pass online and receive an instant QR ticket for smooth access at the venue.
              </p>
              
              <h3 className="text-sm font-[800] text-gray-400 uppercase tracking-widest mb-4">Event Highlights</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {['Live performances', 'Premium venue', 'Secure QR entry', 'Food and beverage zone', 'Dedicated support desk'].map((highlight, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#111111] font-[600]">
                    <CheckCircle className="w-5 h-5 text-[#9333EA]" /> {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. ARTIST LINEUP */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-[800] text-[#111111] mb-6">Artist Lineup</h2>
              <div className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="w-24 h-24 rounded-2xl bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1974&auto=format&fit=crop')` }}></div>
                <div>
                  <h3 className="text-xl font-[800] text-[#111111] mb-1">Live Performances</h3>
                  <p className="text-sm font-[600] text-[#9333EA]">Performance Time: 9:00 PM onwards</p>
                </div>
              </div>
            </div>

            {/* 4. VENUE */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-[800] text-[#111111] mb-6">Venue</h2>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-[800] text-[#111111] mb-2">{event.venue}</h3>
                  <p className="text-[#6B7280] font-[500] max-w-sm">{event.address}</p>
                </div>
                <a href={`https://maps.google.com/?q=${event.venue} ${event.city}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#111111] text-white font-[800] rounded-xl text-sm flex items-center gap-2 hover:bg-black transition-colors shrink-0">
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Parking</p>
                  <p className="text-sm font-[600] text-[#111111]">Valet & Self-parking available</p>
                </div>
                <div>
                  <p className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Entry Gate</p>
                  <p className="text-sm font-[600] text-[#111111]">Use Gate 1 for VIP, Gate 3 for General</p>
                </div>
              </div>
            </div>

            {/* 5. IMPORTANT INFORMATION */}
            <div className="bg-[#111111] rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-[#9333EA]" />
                <h2 className="text-2xl font-[800] text-white">Before You Attend</h2>
              </div>
              <ul className="space-y-4">
                {[
                  'Carry a valid government photo ID.',
                  'QR pass must be clearly visible at the gate.',
                  'Re-entry may not be allowed.',
                  'Outside food and beverages may be restricted.',
                  'Event rules are subject to organizer policy.'
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/80 font-[500]">
                    <span className="w-1.5 h-1.5 bg-[#9333EA] rounded-full mt-2 shrink-0"></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. FAQ */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-[800] text-[#111111] mb-6">FAQ</h2>
              <div className="space-y-3">
                {eventFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-[#F7F7F8] rounded-2xl overflow-hidden border border-gray-50">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-[800] text-[#111111] text-sm">{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#9333EA]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-[#6B7280] text-sm font-[500] leading-relaxed border-t border-gray-200 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: BOOKING PANEL */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 text-center">
                <p className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2">Tickets Starting From</p>
                <h3 className="text-4xl font-[800] text-[#111111] mb-6 tracking-tight">₹499</h3>
                
                <div className="space-y-4 mb-8 text-left">
                  <div>
                    <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1.5 block">Select Date</label>
                    <select className="w-full p-4 rounded-xl bg-[#F7F7F8] border border-gray-100 font-[600] text-[#111111] outline-none">
                      <option>Oct 3, 2026</option>
                      <option>Oct 4, 2026</option>
                      <option>Oct 5, 2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1.5 block">Select Ticket Type</label>
                    <select className="w-full p-4 rounded-xl bg-[#F7F7F8] border border-gray-100 font-[600] text-[#111111] outline-none">
                      <option>Regular Pass</option>
                      <option>VIP Pass</option>
                      <option>Couple Pass</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1.5 block">Quantity</label>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7F7F8] border border-gray-100">
                      <button className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-[800]">-</button>
                      <span className="font-[800] text-lg">2</span>
                      <button className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-[800]">+</button>
                    </div>
                  </div>
                </div>

                <Link href={`/events/${event.id}/book`} className="w-full bg-[#9333EA] text-white font-[800] py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-[#7E22CE] transition-all shadow-lg hover:-translate-y-0.5 text-lg">
                  Book Now
                </Link>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mt-4 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Secure checkout
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 7. RELATED EVENTS */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-[800] text-[#111111] mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_EVENTS.slice(0, 4).map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-[800]">Starting From</span>
            <span className="text-2xl font-[800] text-[#111111] tracking-tight">₹499</span>
          </div>
          <Link href={`/events/${event.id}/book`} className="bg-[#9333EA] text-white font-[800] px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-transform">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
