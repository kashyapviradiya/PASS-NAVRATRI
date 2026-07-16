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
    <div className="bg-navratri-bg min-h-[calc(100vh-64px)] pb-32 lg:pb-24 font-sans">
      
      {/* 1. TOP SECTION (HERO) */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-navratri-primary">
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navratri-primary via-navratri-primary/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navratri-primary/90 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-12 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto z-10 flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-navratri-accent text-white text-[10px] font-[700] px-3 py-1.5 rounded-full tracking-widest uppercase">Garba & Navratri</span>
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-[700] px-3 py-1.5 rounded-full tracking-widest uppercase">{event.city}</span>
            </div>
            
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-display font-[700] text-white leading-[1.05] tracking-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-white/90 text-[15px] font-[500]">
                <Calendar className="w-5 h-5 text-navratri-accent" /> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-white/90 font-[500] text-[15px]">
                <Clock className="w-5 h-5 text-navratri-accent" /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="flex items-center gap-2 text-white/90 font-[500] text-[15px]">
                <MapPin className="w-5 h-5 text-navratri-accent" /> {event.venue}
              </div>
              <div className="flex items-center gap-2 text-white/90 font-[500] text-[15px]">
                <User className="w-5 h-5 text-navratri-accent" /> All Ages
              </div>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-3">
            <button onClick={handleFavourite} className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-navratri-accent hover:border-transparent transition-all shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white hover:text-navratri-text hover:border-transparent transition-all shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 2. EVENT DESCRIPTION */}
            <div className="bg-white rounded-card p-8 md:p-10 shadow-sm border border-navratri-lightGrey">
              <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-4">About This Event</h2>
              <p className="text-navratri-muted font-[500] leading-relaxed text-[16px] mb-8">
                {event.description} Get ready for a premium event experience featuring live performances, vibrant energy and secure digital entry. Book your pass online and receive an instant QR ticket for smooth access at the venue.
              </p>
              
              <h3 className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-4">Event Highlights</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {['Live performances', 'Premium venue', 'Secure QR entry', 'Food and beverage zone', 'Dedicated support desk'].map((highlight, i) => (
                  <li key={i} className="flex items-center gap-3 text-navratri-text font-[500] text-[15px]">
                    <CheckCircle className="w-5 h-5 text-navratri-accent shrink-0" /> {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. ARTIST LINEUP */}
            <div className="bg-white rounded-card p-8 md:p-10 shadow-sm border border-navratri-lightGrey">
              <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-6">Artist Lineup</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-[20px] border border-navratri-lightGrey bg-navratri-bg hover:bg-white hover:shadow-sm transition-all">
                <div className="w-24 h-24 rounded-[16px] bg-cover bg-center border border-navratri-lightGrey shrink-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1974&auto=format&fit=crop')` }}></div>
                <div>
                  <h3 className="text-[18px] font-display font-[700] text-navratri-text mb-1">Live Performances</h3>
                  <p className="text-[14px] font-[500] text-navratri-accent">Performance Time: 9:00 PM onwards</p>
                </div>
              </div>
            </div>

            {/* 4. VENUE */}
            <div className="bg-white rounded-card p-8 md:p-10 shadow-sm border border-navratri-lightGrey">
              <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-6">Venue</h2>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                  <h3 className="text-[18px] font-[700] text-navratri-text mb-2">{event.venue}</h3>
                  <p className="text-navratri-muted font-[500] max-w-sm text-[15px]">{event.address}</p>
                </div>
                <a href={`https://maps.google.com/?q=${event.venue} ${event.city}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-navratri-primary text-white font-[700] rounded-button text-[14px] flex items-center gap-2 hover:bg-black transition-colors shrink-0">
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-navratri-lightGrey pt-6">
                <div>
                  <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Parking</p>
                  <p className="text-[14px] font-[500] text-navratri-text">Valet & Self-parking available</p>
                </div>
                <div>
                  <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Entry Gate</p>
                  <p className="text-[14px] font-[500] text-navratri-text">Use Gate 1 for VIP, Gate 3 for General</p>
                </div>
              </div>
            </div>

            {/* 5. IMPORTANT INFORMATION */}
            <div className="bg-navratri-primary rounded-card p-8 md:p-10 shadow-sm border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-navratri-accent" />
                <h2 className="text-[24px] font-display font-[700] text-white">Before You Attend</h2>
              </div>
              <ul className="space-y-4">
                {[
                  'Carry a valid government photo ID.',
                  'QR pass must be clearly visible at the gate.',
                  'Re-entry may not be allowed.',
                  'Outside food and beverages may be restricted.',
                  'Event rules are subject to organizer policy.'
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/80 font-[500] text-[15px]">
                    <span className="w-1.5 h-1.5 bg-navratri-accent rounded-full mt-2 shrink-0"></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. FAQ */}
            <div className="bg-white rounded-card p-8 md:p-10 shadow-sm border border-navratri-lightGrey">
              <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-6">FAQ</h2>
              <div className="space-y-3">
                {eventFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-navratri-bg rounded-[20px] overflow-hidden border border-navratri-lightGrey hover:border-[#D4D4D4] transition-colors">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                    >
                      <span className="font-[600] text-navratri-text text-[15px]">{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="w-5 h-5 text-navratri-accent" /> : <ChevronDown className="w-5 h-5 text-navratri-muted" />}
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 md:px-6 pb-6 text-navratri-muted text-[15px] font-[500] leading-relaxed border-t border-navratri-lightGrey pt-4">
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
              <div className="bg-white rounded-card p-8 shadow-card border border-navratri-lightGrey text-center">
                <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2">Tickets Starting From</p>
                <h3 className="text-[36px] font-display font-[700] text-navratri-text mb-8 tracking-tight">₹499</h3>
                
                <div className="space-y-5 mb-8 text-left">
                  <div>
                    <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Select Date</label>
                    <select className="w-full px-4 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-lightGrey font-[500] text-navratri-text outline-none text-[15px] appearance-none">
                      <option>Oct 3, 2026</option>
                      <option>Oct 4, 2026</option>
                      <option>Oct 5, 2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Select Ticket Type</label>
                    <select className="w-full px-4 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-lightGrey font-[500] text-navratri-text outline-none text-[15px] appearance-none">
                      <option>Regular Pass</option>
                      <option>VIP Pass</option>
                      <option>Couple Pass</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Quantity</label>
                    <div className="flex items-center justify-between p-2 rounded-[14px] bg-navratri-bg border border-navratri-lightGrey">
                      <button className="w-10 h-10 rounded-[10px] bg-white shadow-sm flex items-center justify-center font-[700] border border-navratri-lightGrey hover:bg-gray-50">-</button>
                      <span className="font-[700] text-[18px]">2</span>
                      <button className="w-10 h-10 rounded-[10px] bg-white shadow-sm flex items-center justify-center font-[700] border border-navratri-lightGrey hover:bg-gray-50">+</button>
                    </div>
                  </div>
                </div>

                <Link href={`/events/${event.id}/book`} className="w-full bg-navratri-accent text-white font-[700] py-4 rounded-button flex justify-center items-center gap-2 hover:bg-navratri-darkAccent transition-all shadow-sm hover:-translate-y-0.5 text-[16px]">
                  Book Now
                </Link>
                <p className="text-[11px] text-navratri-muted uppercase tracking-widest font-[700] mt-4 flex items-center justify-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Secure checkout
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 7. RELATED EVENTS */}
        <div className="mt-24 border-t border-navratri-lightGrey pt-16">
          <h2 className="text-[28px] font-display font-[700] text-navratri-text mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DEMO_EVENTS.slice(0, 4).map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-navratri-lightGrey p-4 lg:hidden z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700]">Starting From</span>
            <span className="text-[24px] font-display font-[700] text-navratri-text tracking-tight">₹499</span>
          </div>
          <Link href={`/events/${event.id}/book`} className="bg-navratri-accent text-white font-[700] px-8 py-3.5 rounded-button flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-transform text-[15px]">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
