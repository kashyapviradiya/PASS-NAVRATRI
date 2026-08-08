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
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden px-0 pt-[60px] md:pt-[100px] pb-6 md:pb-12 bg-navratri-bg">
        {/* Ambient background matching poster style */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {featuredEvents.length > 0 && (
            <img 
              alt="background blur"
              src={featuredEvents[0].bannerImage || '/demo/events/poster_navratri.jpg'}
              className="scale-[1.5] object-cover blur-[100px] opacity-[0.15] absolute inset-0 w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navratri-bg/40 via-navratri-bg/80 to-navratri-bg"></div>
        </div>

        {/* MOBILE CAROUSEL (hidden on desktop) */}
        <div className="w-full relative z-10 md:hidden mt-2">
          <div className="flex overflow-x-auto snap-x snap-mandatory px-8 gap-4 pb-4" style={{ scrollbarWidth: 'none' }}>
            {featuredEvents.length > 0 ? featuredEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="w-[82vw] shrink-0 snap-center group block">
                <div className="relative w-full pb-[125%] rounded-[16px] overflow-hidden shadow-md border border-navratri-border mb-4 bg-white">
                  <img 
                    src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Centered Metadata */}
                <div className="text-center px-1">
                  <h2 className="text-[20px] font-[850] text-navratri-dark leading-tight mb-1 truncate uppercase">{event.title}</h2>
                  <div className="text-[12px] text-navratri-muted font-[600] flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-navratri-primary">
                      {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} - {new Date(event.endDate || event.startDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span>•</span>
                    <span>{event.category || 'Navratri'}</span>
                    <span>•</span>
                    <span>{event.city || 'Ahmedabad'}</span>
                  </div>
                  {event.views && (
                    <div className="text-[11px] text-navratri-muted mt-1.5 font-[700] flex justify-center items-center gap-1">
                       <Zap className="w-3 h-3 text-navratri-primary" /> Views ({event.views})
                    </div>
                  )}
                </div>
              </Link>
            )) : (
              [1,2,3].map(i => (
                <div key={i} className="w-[82vw] shrink-0 snap-center">
                  <div className="relative w-full pb-[125%] rounded-[16px] bg-navratri-softBg animate-pulse mb-4"></div>
                  <div className="h-6 bg-navratri-softBg animate-pulse rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-navratri-softBg animate-pulse rounded w-1/2 mx-auto"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DESKTOP SPLIT HERO (hidden on mobile) */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 lg:px-8 mt-8 relative z-10 items-center justify-between gap-12">
          {featuredEvents.length > 0 ? (
            <>
              {/* Left Info */}
              <div className="flex-1 max-w-xl">
                <h1 className="text-[42px] lg:text-[56px] font-display font-[850] text-navratri-dark leading-[1.1] mb-6 uppercase tracking-tight">
                  {featuredEvents[0].title}
                </h1>
                <div className="flex flex-col gap-3 text-[16px] text-navratri-muted font-[600] mb-8">
                  <span className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-navratri-primary" />
                    {new Date(featuredEvents[0].startDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} - {new Date(featuredEvents[0].endDate || featuredEvents[0].startDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-navratri-primary" />
                    {featuredEvents[0].venue}, {featuredEvents[0].city || 'Ahmedabad'}
                  </span>
                </div>
                <Link href={`/events/${featuredEvents[0].id}`} className="inline-block bg-navratri-primary text-white font-[800] px-10 py-4 rounded-full text-[16px] hover:opacity-90 transition-all shadow-premium hover:-translate-y-1">
                  GET TICKETS
                </Link>
              </div>
              
              {/* Right Poster */}
              <Link href={`/events/${featuredEvents[0].id}`} className="w-[380px] lg:w-[420px] shrink-0 block group">
                <div className="relative w-full pb-[125%] rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(90,33,50,0.4)] border-2 border-white">
                  <img 
                    src={featuredEvents[0].bannerImage || featuredEvents[0].bannerUrl || '/demo/events/poster_navratri.jpg'} 
                    alt={featuredEvents[0].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>
            </>
          ) : (
            <div className="flex-1 h-[400px] bg-navratri-softBg animate-pulse rounded-[24px]"></div>
          )}
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
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-[20px] md:text-[24px] font-[800] text-navratri-dark tracking-tight leading-none">Popular Events</h2>
                <p className="text-[13px] text-navratri-muted font-[500] mt-1 hidden sm:block">Popular events to attend with friends</p>
              </div>
              <Link href="/events" className="flex items-center gap-1 text-navratri-primary hover:underline font-[700] text-[12px] tracking-wider uppercase whitespace-nowrap mb-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="relative py-4 mt-2 border-y border-navratri-border bg-navratri-bg">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="bg-navratri-softBg rounded-[12px] p-4 flex flex-col md:flex-row items-center justify-between text-navratri-dark shadow-sm border border-navratri-border">
              <div className="mb-3 md:mb-0 text-center md:text-left">
                <h3 className="text-[16px] md:text-[18px] font-[800] tracking-tight text-navratri-primary">Book. Scan. Enter.</h3>
                <p className="text-[13px] text-navratri-muted font-[500]">Fast, Secure Event Entry with RaasPass</p>
              </div>
              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <Smartphone className="w-5 h-5 text-navratri-primary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700] text-navratri-muted">Digital Pass</span>
                </div>
                <div className="flex flex-col items-center">
                  <QrCode className="w-5 h-5 text-navratri-primary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700] text-navratri-muted">Unique QR</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-5 h-5 text-navratri-primary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700] text-navratri-muted">Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <Zap className="w-5 h-5 text-navratri-primary mb-1" />
                  <span className="text-[10px] uppercase tracking-wider font-[700] text-navratri-muted">Fast Entry</span>
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
                { title: 'Event Ticketing', desc: 'Setup & sell instantly', icon: Ticket, color: 'text-navratri-primary', bg: 'bg-navratri-primary/10' },
                { title: 'QR Entry', desc: 'Digital pass standard', icon: QrCode, color: 'text-navratri-primary', bg: 'bg-navratri-primary/10' },
                { title: 'Gate Management', desc: 'Scanner app included', icon: CheckSquare, color: 'text-navratri-primary', bg: 'bg-navratri-primary/10' },
                { title: 'Event Analytics', desc: 'Real-time sales data', icon: BarChart3, color: 'text-navratri-primary', bg: 'bg-navratri-primary/10' },
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
