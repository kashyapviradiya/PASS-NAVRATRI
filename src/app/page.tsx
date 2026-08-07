'use client';

import { useState, useEffect } from 'react';
import { Shield, QrCode, Zap, ArrowRight, ChevronRight, Music, Users, Sparkles, MapPin, Calendar, Search, Ticket, CheckCircle, Smartphone, Star } from 'lucide-react';
import EventCard from '@/components/EventCard';
import type { Event } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch('/api/get-events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          // --- DEMO ASSETS OVERRIDE START ---
          // DO NOT modify the real database. Just mapping generated UI demo images for visual review.
          const demoImages = [
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_poster_navratri_1786101204234.jpg'),
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_poster_dj_1786101242672.jpg'),
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_poster_livemusic_1786101218071.jpg'),
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_poster_cultural_1786101255678.jpg'),
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_poster_bollywood_1786101269642.jpg'),
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_poster_comedy_1786101284911.jpg')
          ];
          
          const demoBanners = [
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_banner_navratri_1786101179726.jpg'),
            '/api/demo-image?file=' + encodeURIComponent('C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1\\demo_banner_dj_1786101191047.jpg')
          ];

          const eventsWithDemoImages = data.events.map((event: any, index: number) => {
            return {
              ...event,
              // Use demo banners for the first two featured items, and posters for everything else
              bannerImage: index < 2 ? demoBanners[index % demoBanners.length] : demoImages[index % demoImages.length]
            };
          });
          
          setEvents(eventsWithDemoImages);
          // --- DEMO ASSETS OVERRIDE END ---
        }
      })
      .catch(console.error);
  }, []);

  // Auto-rotate featured banner
  useEffect(() => {
    if (events.length <= 1) return;
    const total = Math.min(events.length, 5);
    const interval = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  if (!mounted) return null;

  const featuredEvents = events.slice(0, 5);
  const popularEvents = events.slice(0, 8);
  const upcomingEvents = events.length > 4 ? events.slice(4, 12) : events.slice(0, 8);
  const uniqueArtists = Array.from(new Set(events.filter(e => e.artist).map(e => e.artist as string))).filter(Boolean);

  const categories = [
    { name: 'Navratri', icon: Sparkles, bg: 'bg-purple-100', color: 'text-purple-600' },
    { name: 'Music', icon: Music, bg: 'bg-blue-100', color: 'text-blue-600' },
    { name: 'Cultural', icon: Star, bg: 'bg-amber-100', color: 'text-amber-600' },
    { name: 'Festival', icon: Zap, bg: 'bg-green-100', color: 'text-green-600' },
    { name: 'Party', icon: Users, bg: 'bg-pink-100', color: 'text-pink-600' },
  ];

  const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className="bg-gradient-to-b from-purple-50 via-purple-50/30 to-white pb-20 md:pb-0 overflow-x-hidden min-h-screen">

      {/* ═══════════════════════════════════════════════════
          1. FEATURED EVENT BANNER — compact, rounded, with blurred bg
         ═══════════════════════════════════════════════════ */}
      {featuredEvents.length > 0 && (
        <section className="relative px-4 pt-3 pb-4">
          {/* Blurred background visual (like Showmates) */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img
              src={featuredEvents[activeBanner]?.bannerImage || ''}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-110 blur-md brightness-75 opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-purple-200/30 to-purple-50"></div>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            {featuredEvents.map((event, idx) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className={`block relative w-full transition-all duration-500 ${
                  idx === activeBanner ? '' : 'hidden'
                }`}
              >
                {/* Banner image — 16:9 compact aspect ratio */}
                <div className="relative w-full pb-[50%] overflow-hidden bg-gray-200">
                  <img
                    src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1200&auto=format&fit=crop'}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Minimal bottom gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Overlay text — compact */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h2 className="text-white text-[16px] sm:text-[20px] md:text-[28px] font-bold leading-tight line-clamp-2 drop-shadow-sm mb-1">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-2 text-white/85 text-[11px] sm:text-[12px] font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/50"></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Carousel dots */}
            {featuredEvents.length > 1 && (
              <div className="absolute bottom-2 right-3 z-10 flex gap-1">
                {featuredEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.preventDefault(); setActiveBanner(idx); }}
                    className={`rounded-full transition-all duration-300 ${
                      idx === activeBanner ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          2. POPULAR EVENTS — 2-column GRID (like reference)
         ═══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-0.5">Popular Events</h2>
              <p className="text-gray-500 text-[12px] md:text-[14px]">Popular events to attend with friends</p>
            </div>
            <Link href="/events" className="flex items-center gap-1 text-navratri-primary hover:underline font-semibold text-[13px]">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2-column grid on mobile, 3-col md, 4-col lg */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-x-5 md:gap-y-6">
            {popularEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. EXPLORE BY CATEGORY — compact row
         ═══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-4">Explore by Category</h2>
          <div className={`flex overflow-x-auto ${hideScrollbar} gap-3 pb-1`}>
            {categories.map((cat, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm shrink-0 active:scale-95 transition-all hover:border-navratri-primary/30 hover:shadow-md"
              >
                <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                  <cat.icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <span className="font-semibold text-[13px] text-gray-800">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. UPCOMING EVENTS — 2-column grid
         ═══════════════════════════════════════════════════ */}
      {upcomingEvents.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-0.5">Upcoming Events</h2>
                <p className="text-gray-500 text-[12px] md:text-[14px]">Don&apos;t miss out on what&apos;s coming up</p>
              </div>
              <Link href="/events" className="flex items-center gap-1 text-navratri-primary hover:underline font-semibold text-[13px]">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-x-5 md:gap-y-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          5. POPULAR ARTISTS — horizontal scroll (only if real data)
         ═══════════════════════════════════════════════════ */}
      {uniqueArtists.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-0.5">
                Events by <span className="text-transparent bg-clip-text bg-gradient-premium">Artist</span>
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px]">Discover events by your favourite artists</p>
            </div>
            <div className={`flex overflow-x-auto ${hideScrollbar} gap-5 pb-2`}>
              {uniqueArtists.map((artist, i) => (
                <div key={i} className="flex flex-col items-center shrink-0 w-20 sm:w-24 text-center group cursor-pointer">
                  <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden mb-2 shadow-md bg-gray-100 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-gradient-to-br from-navratri-primary to-navratri-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-[28px] sm:text-[32px]">{artist.charAt(0)}</span>
                    </div>
                  </div>
                  <h3 className="truncate text-[12px] sm:text-[13px] font-semibold text-gray-900 w-full">{artist}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          6. WHY RAASPASS — compact trust strip
         ═══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-4 text-center">Why RaasPass?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Shield, title: 'Secure Booking', desc: 'Protected data & payments' },
              { icon: QrCode, title: 'Instant QR Pass', desc: 'Digital ticket in seconds' },
              { icon: Zap, title: 'Fast Entry', desc: 'Quick scan at gates' },
              { icon: CheckCircle, title: 'Verified Events', desc: 'Authentic & trusted' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-navratri-primary" />
                </div>
                <h3 className="font-bold text-[13px] text-gray-900 mb-0.5">{item.title}</h3>
                <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. HOW IT WORKS — compact 3-step
         ═══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-4 text-center">Book in 3 Steps</h2>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {[
              { icon: Search, title: 'Discover', desc: 'Find events you love' },
              { icon: Ticket, title: 'Book Pass', desc: 'Pick your ticket type' },
              { icon: Smartphone, title: 'Get QR', desc: 'Show at gate & enter' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-2 shadow-sm">
                  <s.icon className="w-5 h-5 md:w-6 md:h-6 text-navratri-primary" />
                </div>
                <h3 className="text-[13px] md:text-[15px] font-bold text-gray-900 mb-0.5">{s.title}</h3>
                <p className="text-[11px] md:text-[13px] text-gray-500 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. HOST YOUR EVENT — compact dark CTA
         ═══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#1a1c24] to-[#23262f] p-6 md:p-8 rounded-2xl shadow-lg">
            <h2 className="text-[20px] md:text-[28px] font-bold text-white mb-2 leading-tight">
              Host Your Event With RaasPass
            </h2>
            <p className="text-gray-300 text-[13px] md:text-[15px] font-medium mb-4 max-w-lg">
              Manage ticket sales, QR check-in, gate management and live analytics from one dashboard.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {['Ticketing', 'QR Entry', 'Gate Mgmt', 'Analytics'].map((f, i) => (
                <span key={i} className="bg-white/10 border border-white/10 text-white/80 text-[11px] font-semibold px-3 py-1 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-bold rounded-full text-[13px] hover:bg-gray-50 transition-colors shadow-sm">
              Partner With RaasPass <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
