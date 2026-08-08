'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Ticket, QrCode, Shield, Zap, Search, Calendar, MapPin, ChevronRight, ChevronDown, BarChart3, Smartphone, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from '@/components/EventCard';

export default function Home() {
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/get-events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setPopularEvents(data.events.slice(0, 8));
          setFeaturedEvents(data.events.slice(0, 3));
          setUpcomingEvents(data.events.slice(2, 6)); // Just for demo
        }
      })
      .catch(console.error);
  }, []);

  const hideScrollbar = "scrollbar-width: none; -ms-overflow-style: none; [&::-webkit-scrollbar]:hidden";

  return (
    <div className="bg-gray-50 min-h-screen pb-[60px] md:pb-0 overflow-x-hidden font-sans">
      
      {/* 1. HERO CAROUSEL SECTION */}
      <div className="relative overflow-hidden px-0 pt-[40px] md:pt-[64px] pb-2 bg-[#1E1B4B]">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 mt-14">
          <img 
            alt="background blur"
            src="https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop"
            className="scale-110 object-cover blur-md brightness-90 absolute inset-0 w-full h-full opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B4B] via-[#1E1B4B]/40 to-transparent mix-blend-normal"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 sm:h-72 lg:h-80 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-50"></div>
        </div>

        {/* Carousel Content */}
        <div className="w-full px-0 max-w-full md:px-4 mt-6 lg:mt-8 relative z-10">
          <div className="flex overflow-x-auto snap-x snap-mandatory px-4 md:px-0 gap-3 pb-2" style={{ scrollbarWidth: 'none' }}>
            {featuredEvents.length > 0 ? featuredEvents.map((event, i) => (
              <Link href={`/events/${event.id}`} key={event.id} className="w-[85vw] md:w-[60vw] lg:w-[45vw] shrink-0 snap-center group">
                <div className="relative w-full pb-[60%] md:pb-[40%] rounded-[16px] overflow-hidden shadow-lg border border-white/10 mb-3">
                  <img 
                    src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Metadata below poster */}
                <div className="px-2">
                  <h2 className="text-[18px] md:text-[22px] font-[800] text-gray-900 leading-tight mb-1 truncate">{event.title}</h2>
                  <div className="flex items-center gap-3 text-[13px] text-gray-600 font-[600]">
                    <span className="flex items-center gap-1 text-navratri-primary">
                      {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      {event.venue}
                    </span>
                  </div>
                </div>
              </Link>
            )) : (
              [1,2,3].map(i => (
                <div key={i} className="w-[85vw] md:w-[60vw] lg:w-[45vw] shrink-0 snap-center">
                  <div className="relative w-full pb-[60%] md:pb-[40%] rounded-2xl bg-white/10 animate-pulse border border-white/5 mb-3"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2 mx-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-2"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-4 lg:pb-0 lg:pt-0">
        
        {/* 1. POPULAR EVENTS */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative py-2"
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h2 className="text-[20px] md:text-[24px] font-[800] text-gray-900 tracking-tight">Popular Events</h2>
              </div>
              <Link href="/events" className="flex items-center gap-1 text-navratri-primary hover:underline font-[700] text-[13px] tracking-wide uppercase">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
              {popularEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 2. COMPACT TRUST BANNER */}
        <div className="relative py-4 mt-2 border-y border-gray-200/60 bg-white">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="bg-[#1E1B4B] rounded-[12px] p-4 flex flex-col md:flex-row items-center justify-between text-white shadow-sm">
              <div className="mb-3 md:mb-0 text-center md:text-left">
                <h3 className="text-[16px] md:text-[18px] font-[800] tracking-tight">Book. Scan. Enter.</h3>
                <p className="text-[13px] text-white/80 font-[500]">Fast, Secure Event Entry with RaasPass</p>
              </div>
              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <Smartphone className="w-5 h-5 text-navratri-secondary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700]">Digital Pass</span>
                </div>
                <div className="flex flex-col items-center">
                  <QrCode className="w-5 h-5 text-navratri-secondary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700]">Unique QR</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-5 h-5 text-navratri-secondary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700]">Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <Zap className="w-5 h-5 text-navratri-secondary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700]">Fast Entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. EVENTS BY ARTIST */}
        <motion.section 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="py-6 border-b border-gray-200/60 bg-white"
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-3">
              <h2 className="text-[20px] md:text-[24px] font-[800] text-gray-900 tracking-tight">Events by Artist</h2>
              <p className="text-[13px] text-gray-500 font-[500]">Catch your favorite stars live</p>
            </div>
            
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { name: 'Aishwarya Majmudar', img: '/demo/artists/artist_1.jpg' },
                { name: 'Falguni Pathak', img: '/demo/artists/artist_2.jpg' },
                { name: 'Kinjal Dave', img: '/demo/artists/artist_3.jpg' },
                { name: 'Darshan Raval', img: '/demo/artists/artist_4.jpg' },
                { name: 'Aditya Gadhvi', img: '/demo/artists/artist_5.jpg' }
              ].map((artist, i) => (
                <div key={i} className="group block shrink-0 w-[72px] sm:w-[84px] text-center cursor-pointer">
                  <div className="relative aspect-square w-full overflow-hidden rounded-full mb-1 shadow-sm border border-gray-200 bg-gray-100">
                    <img 
                      src={artist.img} 
                      alt={artist.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[11px] font-[700] text-gray-900 group-hover:text-navratri-primary transition-colors leading-tight line-clamp-2">{artist.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 4. EXPLORE CATEGORIES */}
        <motion.section 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="py-6 border-b border-gray-200/60 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-3">
              <h2 className="text-[20px] md:text-[24px] font-[800] text-gray-900 tracking-tight">Explore Categories</h2>
            </div>
            
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { name: 'Garba', img: '/demo/categories/cat_navratri.jpg' },
                { name: 'Concerts', img: '/demo/categories/cat_music.jpg' },
                { name: 'Comedy', img: '/demo/events/poster_comedy.jpg' },
                { name: 'Cultural', img: '/demo/categories/cat_cultural.jpg' },
                { name: 'Party', img: '/demo/categories/cat_party.jpg' },
                { name: 'Festival', img: '/demo/categories/cat_festival.jpg' }
              ].map((cat, i) => (
                <div key={i} className="relative w-[120px] md:w-[150px] aspect-[4/5] shrink-0 rounded-[12px] overflow-hidden group cursor-pointer shadow-sm border border-gray-200">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 right-3 font-[800] text-[14px] md:text-[16px] text-white drop-shadow-md leading-tight">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 5. POPULAR SERVICES */}
        <section className="py-6 bg-white border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-[18px] md:text-[22px] font-[800] text-gray-900 mb-3 tracking-tight">Platform Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {[
                { title: 'Event Ticketing', desc: 'Setup & sell instantly', icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'QR Entry', desc: 'Digital pass standard', icon: QrCode, color: 'text-purple-600', bg: 'bg-purple-50' },
                { title: 'Gate Management', desc: 'Scanner app included', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Event Analytics', desc: 'Real-time sales data', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((svc, i) => (
                <div key={i} className="rounded-[10px] p-3 border border-gray-100 shadow-sm flex flex-col bg-white hover:border-gray-200 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${svc.bg} flex items-center justify-center mb-2 ${svc.color}`}>
                    <svc.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[13px] font-[800] text-gray-900 mb-0.5">{svc.title}</h3>
                  <p className="text-[11px] text-gray-500 font-[500] leading-tight">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HELPFUL GUIDES */}
        <section className="py-6 bg-gray-50 border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-[18px] md:text-[22px] font-[800] text-gray-900 mb-3 tracking-tight">Helpful Guides</h2>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { title: 'How Digital Tickets Work', desc: 'A quick guide to finding and using your pass.', icon: Smartphone },
                { title: 'QR Entry Guide', desc: 'Best practices for smooth gate entry.', icon: QrCode },
                { title: 'Booking Tips', desc: 'How to secure tickets for high-demand events.', icon: Zap },
              ].map((guide, i) => (
                <div key={i} className="flex gap-3 items-center w-[260px] shrink-0 bg-white p-3 rounded-[10px] border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                    <guide.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-[700] text-gray-900 leading-tight mb-0.5">{guide.title}</h4>
                    <p className="text-[11px] text-gray-500 font-[500] line-clamp-2 leading-tight">{guide.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. WHY RAASPASS */}
        <section className="py-8 bg-white border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[20px] md:text-[24px] font-[800] text-gray-900 mb-2 tracking-tight">Trusted by Thousands</h2>
            <p className="text-[13px] text-gray-500 font-[500] max-w-lg mx-auto mb-6">
              RaasPass provides a seamless, secure, and instant booking experience for the best events in your city. 
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto">
              <div className="flex flex-col items-center p-2">
                <span className="text-[24px] font-[800] text-navratri-primary mb-1">10k+</span>
                <span className="text-[11px] font-[700] text-gray-500 uppercase tracking-wide">Tickets Sold</span>
              </div>
              <div className="flex flex-col items-center p-2 border-x border-gray-100">
                <span className="text-[24px] font-[800] text-navratri-primary mb-1">100+</span>
                <span className="text-[11px] font-[700] text-gray-500 uppercase tracking-wide">Organizers</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <span className="text-[24px] font-[800] text-navratri-primary mb-1">24/7</span>
                <span className="text-[11px] font-[700] text-gray-500 uppercase tracking-wide">Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. SEO / INFORMATIONAL CONTENT */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h3 className="text-[14px] font-[800] text-gray-900 mb-2">Discover the Best Events in Your City</h3>
              <p className="text-[12px] text-gray-500 font-[500] leading-relaxed mb-4">
                RaasPass is your premium destination for discovering and booking top-tier events, from massive Navratri Garba nights and live music concerts to cultural festivals and exclusive parties. We focus on providing a seamless digital ticketing experience, ensuring your entry is fast, secure, and hassle-free with our unique QR technology.
              </p>
              <h3 className="text-[14px] font-[800] text-gray-900 mb-2">Secure Ticketing & Gate Management</h3>
              <p className="text-[12px] text-gray-500 font-[500] leading-relaxed">
                For event organizers, RaasPass offers an end-to-end event management platform. Create your event, manage inventory, and use our dedicated scanner tools to validate digital passes in real-time, completely eliminating duplicate entries and long queues.
              </p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
