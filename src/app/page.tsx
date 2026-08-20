'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, QrCode, Shield, Zap, Calendar, MapPin, ChevronRight, ArrowRight, Smartphone } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { formatCurrency } from '@/lib/utils';

export default function Home() {
  const [popularEvents, setPopularEvents] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setPopularEvents(data.events.slice(0, 8));
          setFeaturedEvents(data.events.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = featuredEvents[0];

  return (
    <div className="min-h-screen pb-16 md:pb-0 overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-navratri-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {featured && (
            <img
              src={featured.bannerImage || featured.bannerUrl || '/demo/events/poster_navratri.jpg'}
              alt="" aria-hidden="true"
              className="w-full h-full object-cover blur-[100px] opacity-10 scale-150"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navratri-bg/60 to-navratri-bg" />
        </div>

        {/* Mobile Hero */}
        <div className="relative z-10 md:hidden pt-6 pb-8">
          <div className="px-5 mb-6">
            <h1 className="text-3xl font-display font-extrabold text-navratri-dark tracking-tight leading-tight">
              Discover. Book.<br />Celebrate.
            </h1>
            <p className="text-sm text-navratri-muted font-medium mt-2 max-w-xs">
              Premium digital passes for India's best cultural events.
            </p>
            <div className="flex gap-3 mt-5">
              <Link href="/events" className="btn-primary text-sm px-5 py-2.5">
                Explore Events
              </Link>
              <Link href="/contact" className="btn-secondary text-sm px-5 py-2.5">
                Host an Event
              </Link>
            </div>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory px-5 gap-4 pb-2 hide-scrollbar">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="w-[75vw] shrink-0 snap-center">
                  <div className="w-full aspect-[3/4] rounded-2xl skeleton" />
                </div>
              ))
            ) : (
              featuredEvents.map(event => (
                <Link href={`/events/${event.id}`} key={event.id} className="w-[75vw] shrink-0 snap-center group block">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-card-hover">
                    <img
                      src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-lg font-display font-extrabold text-white leading-tight line-clamp-2">{event.title}</h2>
                      <p className="text-xs text-white/80 font-medium mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        <span className="mx-1">·</span>
                        <MapPin className="w-3 h-3" />
                        {event.city || 'Ahmedabad'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Desktop Hero */}
        <div className="relative z-10 hidden md:block py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-16">
            <div className="flex-1 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-navratri-primary mb-4">India's Premium Event Ticketing</p>
              <h1 className="text-display-xl font-display text-navratri-dark mb-6">
                Discover. Book.<br />Celebrate.
              </h1>
              <p className="text-lg text-navratri-muted font-medium leading-relaxed mb-8 max-w-md">
                Premium digital passes for Navratri, Garba nights, concerts and cultural events across India.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/events" className="btn-primary px-8 py-3.5 text-base">
                  Explore Events <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/for-organizers" className="btn-secondary px-6 py-3.5">
                  Host Your Event
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-navratri-muted font-medium">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-navratri-primary" /> Secure QR Entry</span>
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-navratri-primary" /> Instant Passes</span>
              </div>
            </div>

            {featured ? (
              <Link href={`/events/${featured.id}`} className="w-[380px] lg:w-[420px] shrink-0 group">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-elevated border border-white/50">
                  <img
                    src={featured.bannerImage || featured.bannerUrl || '/demo/events/poster_navratri.jpg'}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="badge-primary mb-2 inline-block">{featured.category || 'Featured'}</span>
                    <h3 className="text-xl font-display font-extrabold text-white leading-tight">{featured.title}</h3>
                    <p className="text-sm text-white/80 font-medium mt-1">
                      {new Date(featured.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · {featured.venue}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-[400px] aspect-[3/4] rounded-2xl skeleton" />
            )}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR EVENTS ═══ */}
      <section className="py-section-sm md:py-section-md bg-navratri-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="section-heading">Popular Events</h2>
              <p className="section-subheading hidden sm:block">Don't miss the most in-demand experiences</p>
            </div>
            <Link href="/events" className="flex items-center gap-1 text-navratri-primary font-semibold text-sm hover:gap-2 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i}>
                  <div className="w-full aspect-[3/4] rounded-2xl skeleton mb-3" />
                  <div className="h-4 skeleton w-3/4 mb-2" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {popularEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-section-sm md:py-section-md bg-white border-y border-navratri-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="section-heading">How RaasPass Works</h2>
            <p className="section-subheading mt-2">Three simple steps to your event</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Browse Events', desc: 'Discover Garba nights, concerts, festivals and cultural events happening near you.', icon: Ticket },
              { step: '02', title: 'Book Instantly', desc: 'Select your passes, pay securely, and receive your digital ticket with a unique QR code.', icon: QrCode },
              { step: '03', title: 'Scan & Enter', desc: 'Show your QR code at the gate for instant verification and hassle-free entry.', icon: Smartphone },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-navratri-primary/8 border border-navratri-primary/10 flex items-center justify-center group-hover:bg-navratri-primary/12 transition-colors">
                  <item.icon className="w-7 h-7 text-navratri-primary" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-navratri-primary mb-2">Step {item.step}</p>
                <h3 className="text-lg font-display font-bold text-navratri-dark mb-2">{item.title}</h3>
                <p className="text-sm text-navratri-muted font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-section-sm md:py-section-md bg-navratri-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-6">Explore Categories</h2>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: 'Garba', img: '/demo/categories/cat_navratri.jpg' },
              { name: 'Concerts', img: '/demo/categories/cat_music.jpg' },
              { name: 'Comedy', img: '/demo/events/poster_comedy.jpg' },
              { name: 'Cultural', img: '/demo/categories/cat_cultural.jpg' },
              { name: 'Party', img: '/demo/categories/cat_party.jpg' },
              { name: 'Festival', img: '/demo/categories/cat_festival.jpg' },
            ].map((cat, i) => (
              <Link href="/events" key={i} className="relative w-[130px] md:w-[160px] aspect-[4/5] shrink-0 rounded-2xl overflow-hidden group">
                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute bottom-3.5 left-3.5 font-display font-bold text-white text-sm drop-shadow-md">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARTISTS ═══ */}
      <section className="py-section-sm md:py-section-md bg-white border-y border-navratri-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-6">Popular Artists</h2>
          <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: 'Aishwarya Majmudar', img: '/demo/artists/artist_1.jpg' },
              { name: 'Falguni Pathak', img: '/demo/artists/artist_2.jpg' },
              { name: 'Kinjal Dave', img: '/demo/artists/artist_3.jpg' },
              { name: 'Darshan Raval', img: '/demo/artists/artist_4.jpg' },
              { name: 'Aditya Gadhvi', img: '/demo/artists/artist_5.jpg' },
            ].map((artist, i) => (
              <div key={i} className="group shrink-0 w-20 sm:w-24 text-center cursor-pointer">
                <div className="relative aspect-square w-full overflow-hidden rounded-full mb-2 ring-2 ring-navratri-border group-hover:ring-navratri-primary/30 transition-all">
                  <img src={artist.img} alt={artist.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xs font-semibold text-navratri-dark group-hover:text-navratri-primary transition-colors leading-tight line-clamp-2">{artist.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST / STATS ═══ */}
      <section className="py-section-sm md:py-section-md bg-navratri-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading mb-3">Trusted by Thousands</h2>
          <p className="text-sm text-navratri-muted font-medium max-w-md mx-auto mb-10">
            RaasPass delivers a seamless, secure, and instant booking experience for the best events across India.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '10k+', label: 'Tickets Sold' },
              { value: '100+', label: 'Organizers' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-display font-extrabold text-navratri-primary mb-1">{stat.value}</span>
                <span className="text-xs font-semibold text-navratri-muted uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOR ORGANIZERS CTA ═══ */}
      <section className="py-section-sm md:py-section-md bg-navratri-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-navratri-gold mb-3">For Event Organizers</p>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold leading-tight mb-4">
                Host your event on India's premium ticketing platform
              </h2>
              <p className="text-white/60 font-medium leading-relaxed mb-6 max-w-lg">
                End-to-end event management — from ticket sales and real-time analytics to QR-powered gate scanning. Everything you need to run a successful event.
              </p>
              <ul className="space-y-3 mb-8">
                {['Instant event setup & ticket creation', 'Real-time sales dashboard & analytics', 'QR scanner app for gate management', 'Dedicated support team'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                    <div className="w-5 h-5 rounded-full bg-navratri-gold/20 flex items-center justify-center shrink-0">
                      <ChevronRight className="w-3 h-3 text-navratri-gold" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link href="/for-organizers" className="inline-flex items-center gap-2 bg-white text-navratri-dark font-semibold px-6 py-3 rounded-button text-sm hover:bg-white/90 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-button text-sm hover:bg-white/10 transition-colors">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="w-full md:w-80 lg:w-96 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                {[
                  { icon: Ticket, title: 'Event Ticketing', desc: 'Create & sell tickets instantly' },
                  { icon: QrCode, title: 'QR Gate Entry', desc: 'Digital pass with scanner app' },
                  { icon: Shield, title: 'Secure & Reliable', desc: 'Anti-fraud QR technology' },
                  { icon: Zap, title: 'Real-time Analytics', desc: 'Live sales & check-in data' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-navratri-gold/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-navratri-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                      <p className="text-xs text-white/50 font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEO CONTENT ═══ */}
      <section className="py-section-sm bg-navratri-softBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h3 className="text-base font-bold text-navratri-dark mb-2">Discover the Best Events in Your City</h3>
            <p className="text-sm text-navratri-muted font-medium leading-relaxed mb-4">
              RaasPass is your premium destination for discovering and booking top-tier events, from massive Navratri Garba nights and live music concerts to cultural festivals and exclusive parties. We focus on providing a seamless digital ticketing experience, ensuring your entry is fast, secure, and hassle-free with our unique QR technology.
            </p>
            <h3 className="text-base font-bold text-navratri-dark mb-2">Secure Ticketing & Gate Management</h3>
            <p className="text-sm text-navratri-muted font-medium leading-relaxed">
              For event organizers, RaasPass offers an end-to-end event management platform. Create your event, manage inventory, and use our dedicated scanner tools to validate digital passes in real-time, completely eliminating duplicate entries and long queues.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
