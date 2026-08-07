'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, QrCode, Zap, ChevronDown, ChevronUp, CheckCircle, Ticket, ArrowRight, Smartphone, Star, Lock, Heart, PlayCircle } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { DEMO_EVENTS } from '@/lib/demo-data';
import type { Event } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/get-events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setEvents(data.events.slice(0, 4));
        }
      })
      .catch(console.error);
  }, []);

  const faqs = [
    { q: 'How will I receive my ticket?', a: 'Your ticket will be available instantly after payment and can also be accessed from My Tickets.' },
    { q: 'Can I use a screenshot of the QR code?', a: 'Yes, but the QR must be clearly visible and unused at the time of entry.' },
    { q: 'Can the same QR code be used twice?', a: 'No. Each QR ticket is valid for one successful entry only.' },
    { q: 'What happens if my payment fails?', a: 'No ticket will be generated for a failed payment. You can retry the payment safely.' },
    { q: 'Can I cancel or transfer my ticket?', a: 'Cancellation and transfer rules depend on the individual event policy.' },
  ];

  if (!mounted) return null;

  return (
    <div className="bg-navratri-bg pb-24 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] pt-24 lg:min-h-[calc(100vh-76px)] lg:pt-[110px] pb-6 sm:pb-16 md:py-24 overflow-hidden border-b border-white/5">
        {/* Subtle animated gradient mesh and floating glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] md:w-[800px] md:h-[800px] bg-navratri-primary/20 rounded-full blur-[100px] md:blur-[140px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-navratri-accent/10 rounded-full blur-[90px] md:blur-[120px] animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-navratri-secondary/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse-slow"></div>
        </div>
        
        {/* Floating particles background effect */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-left space-y-3 sm:space-y-5 lg:space-y-7 animate-fade-in-up mt-1 lg:mt-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/12 backdrop-blur-md shadow-inner-glow">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
                </span>
                <span className="text-white text-[12px] font-[700] tracking-wider uppercase">Premium Ticketing Experience</span>
              </div>
 
              <h1 className="text-[36px] sm:text-[46px] md:text-[68px] lg:text-[80px] font-display font-[850] text-white leading-[1.15] lg:leading-[1.1] tracking-tight">
                Your Pass to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-premium">Unforgettable</span> Events
              </h1>
              
              <p className="text-[14px] sm:text-[16px] md:text-[19px] text-[#CBD5E1] font-[500] max-w-[90%] sm:max-w-xl leading-relaxed mt-1 mb-2 lg:my-0">
                Discover premium events, book your pass, and enter seamlessly with secure digital QR tickets.
              </p>
 
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-1 lg:pt-2 w-full sm:w-auto">
                <Link href="/events" className="h-[48px] sm:h-[54px] w-full sm:w-auto bg-gradient-to-r from-[#7C3AED] to-[#FF4D6D] text-white font-[800] rounded-full shadow-[0_8px_32px_rgba(124,58,237,0.35)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-[15px] sm:text-[16px] text-center flex items-center justify-center gap-2 px-8 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10 flex items-center gap-2">Explore Events <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link href="/my-tickets" className="h-[48px] sm:h-[54px] w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-[800] rounded-full border border-white/12 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all text-[15px] sm:text-[16px] text-center flex items-center justify-center px-8 backdrop-blur-md">
                  View My Tickets
                </Link>
              </div>
 
              {/* Feature glass pills under CTAs */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 lg:pt-6 border-t border-white/10 mt-2">
                {[
                  { text: 'Secure Booking', icon: Shield },
                  { text: 'Instant QR Ticket', icon: QrCode },
                  { text: 'Fast Entry', icon: Zap },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4.5 py-1.5 sm:py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[11px] sm:text-[13px] text-[#CBD5E1] font-[700] hover:bg-white/[0.1] transition-all">
                    <badge.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF] shrink-0" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Right Mockup */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center w-full animate-fade-in-up">
              <div className="relative w-full max-w-[340px] aspect-[9/18] min-h-[550px]">
                {/* Main Phone Mockup */}
                <div className="absolute inset-0 bg-slate-900 rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col z-10 ring-1 ring-white/10 relative">
                  <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-black/20 to-transparent z-20"></div>
                  <div className="h-[45%] bg-[#0A0A0A] relative shrink-0">
                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000" alt="Event Banner" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-white text-[10px] font-[800] uppercase tracking-widest bg-gradient-premium px-3 py-1.5 rounded-full shadow-lg">VIP PASS</span>
                      </div>
                      <h3 className="text-white font-display font-[700] text-[28px] tracking-tight leading-tight line-clamp-2 drop-shadow-md">Sunburn Arena</h3>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-900 p-6 relative flex flex-col items-center justify-center min-h-0">
                    <div className="bg-white w-full rounded-[24px] p-6 shadow-xl text-center relative flex-1 flex flex-col items-center justify-center border-t-4 border-navratri-primary overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-navratri-secondary/10 rounded-full blur-xl"></div>
                      <div className="w-8 h-8 bg-slate-900 rounded-full absolute -left-4 top-1/2 -translate-y-1/2"></div>
                      <div className="w-8 h-8 bg-slate-900 rounded-full absolute -right-4 top-1/2 -translate-y-1/2"></div>
                      
                      <div className="w-32 h-32 mx-auto bg-slate-50 rounded-[20px] flex items-center justify-center mb-6 shrink-0 shadow-inner">
                        <QrCode className="w-20 h-20 text-slate-800" />
                      </div>
                      <p className="text-[11px] font-[700] text-slate-400 uppercase tracking-widest mb-1 mt-auto">Booking ID</p>
                      <p className="font-mono text-[18px] font-[700] text-slate-800 tracking-wider">TK-849201</p>
                    </div>
                  </div>
                </div>
 
                {/* Floating Payment Success */}
                <div 
                  className="absolute -left-12 top-32 z-20 glass rounded-card p-4 shadow-glass flex items-center gap-4 w-64 animate-float"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[14px] font-[700] text-navratri-text">Payment Success</p>
                    <p className="text-[12px] font-[500] text-navratri-muted">₹2,500 securely paid</p>
                  </div>
                </div>
 
                {/* Floating Entry Pass */}
                <div 
                  style={{ animationDelay: '1s' }}
                  className="absolute -right-16 bottom-32 z-20 glass-dark rounded-card p-4 shadow-glass flex items-center gap-4 w-56 animate-float"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[14px] font-[700] text-white">Entry Pass</p>
                    <p className="text-[12px] font-[500] text-slate-400">Ready to scan</p>
                  </div>
                </div>
              </div>
            </div>
 
          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENTS SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <h2 className="text-[32px] sm:text-[36px] font-display font-[800] text-navratri-text mb-3 tracking-tight">Popular Events Near You</h2>
            <p className="text-navratri-muted font-[500] text-[16px] sm:text-[18px]">Discover the events everyone is talking about.</p>
          </div>
          <Link href="/events" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-navratri-lightGrey text-navratri-text font-[700] rounded-button hover:bg-slate-50 transition-colors shadow-sm text-[15px] w-full sm:w-auto text-center">
            View All Events &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 md:py-24 bg-white border-y border-navratri-lightGrey relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-navratri-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-[36px] font-display font-[800] text-navratri-text mb-4 tracking-tight">Book Your Entry in 3 Simple Steps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Desktop Connectors */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-navratri-primary/20 to-transparent z-0"></div>

            {[
              { 
                step: 'Step 1', 
                title: 'Choose Your Event', 
                icon: Search, 
                desc: 'Browse upcoming events and select the experience you love.' 
              },
              { 
                step: 'Step 2', 
                title: 'Book Your Pass', 
                icon: Ticket, 
                desc: 'Select your ticket type, complete secure payment and receive confirmation.' 
              },
              { 
                step: 'Step 3', 
                title: 'Scan & Enter', 
                icon: QrCode, 
                desc: 'Show your digital QR pass at the gate and enjoy fast entry.' 
              }
            ].map((s, i) => (
              <div key={i} className="text-center relative z-10 group">
                <div className="w-20 h-20 mx-auto bg-white rounded-card border border-navratri-lightGrey flex items-center justify-center mb-8 shadow-sm group-hover:-translate-y-2 group-hover:shadow-premium group-hover:border-navratri-primary/30 transition-all duration-500">
                  <s.icon className="w-8 h-8 text-navratri-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="text-[12px] font-[700] text-transparent bg-clip-text bg-gradient-premium uppercase tracking-[0.2em] mb-3">{s.step}</p>
                <h3 className="text-[22px] font-display font-[700] text-navratri-text mb-4">{s.title}</h3>
                <p className="text-navratri-muted font-[500] leading-relaxed text-[16px] max-w-sm mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY RAASPASS SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="mb-12">
          <h2 className="text-[32px] sm:text-[36px] font-display font-[800] text-navratri-text tracking-tight">A Better Way to Attend Events</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: 'Instant Digital Pass', 
              icon: Zap, 
              desc: 'Receive your QR ticket immediately after successful booking.',
              color: 'text-navratri-primary',
              bg: 'bg-purple-50'
            },
            { 
              title: 'Secure Booking', 
              icon: Shield, 
              desc: 'Your payment and booking information stay protected.',
              color: 'text-navratri-success',
              bg: 'bg-green-50'
            },
            { 
              title: 'Faster Entry', 
              icon: QrCode, 
              desc: 'Skip manual verification and enter with one quick scan.',
              color: 'text-navratri-secondary',
              bg: 'bg-pink-50'
            },
            { 
              title: 'Easy Ticket Access', 
              icon: Smartphone, 
              desc: 'View all upcoming and past bookings inside My Tickets.',
              color: 'text-navratri-accent',
              bg: 'bg-cyan-50'
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-card p-8 border border-navratri-lightGrey flex flex-col sm:flex-row gap-6 hover:shadow-premium transition-all duration-500 hover:-translate-y-1 group">
              <div className={`w-14 h-14 ${feature.bg} rounded-[20px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <div>
                <h3 className="text-[20px] sm:text-[22px] font-display font-[700] text-navratri-text mb-2.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-premium transition-all">{feature.title}</h3>
                <p className="text-navratri-muted font-[500] text-[15px] sm:text-[16px] leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-16 md:py-24 text-white relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)' }}>
        <div className="absolute inset-0 bg-gradient-premium opacity-10"></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Tickets Booked', value: '50,000+' },
              { label: 'Events Hosted', value: '100+' },
              { label: 'Cities Covered', value: '10+' },
              { label: 'Customer Rating', value: '4.8/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4 bg-white/5 backdrop-blur-sm rounded-card p-8 border border-white/10">
                <p className="text-[36px] md:text-[48px] font-display font-[800] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">{stat.value}</p>
                <p className="text-slate-400 font-[700] text-[12px] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. APP-LIKE PREVIEW */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-navratri-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <div className="space-y-10">
              <div>
                <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-display font-[800] text-navratri-text mb-5 tracking-tight leading-[1.15]">Made for Seamless Event Experiences</h2>
                <p className="text-[16px] sm:text-[18px] text-navratri-muted font-[500] leading-relaxed max-w-lg">
                  From booking to entry, RaasPass keeps every step fast, simple and secure. Access everything from your phone.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:gap-10">
                {[
                  { text: 'Secure Payment', icon: Lock },
                  { text: 'Verified Events', icon: CheckCircle },
                  { text: 'Instant Confirmation', icon: Zap },
                  { text: 'Dedicated Support', icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-12 h-12 bg-white rounded-[16px] border border-navratri-lightGrey shadow-sm flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-navratri-primary" />
                    </div>
                    <span className="font-display font-[700] text-navratri-text text-[15px] sm:text-[16px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-card p-10 md:p-16 text-center border border-navratri-lightGrey relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-premium opacity-5"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-card mx-auto flex items-center justify-center mb-8 shadow-premium border border-white">
                  <Smartphone className="w-12 h-12 text-navratri-primary" />
                </div>
                <h2 className="text-[28px] sm:text-[32px] font-display font-[800] text-navratri-text mb-4 tracking-tight">Your Pass, Always With You</h2>
                <p className="text-navratri-muted font-[500] mb-8 max-w-md mx-auto text-[15px] sm:text-[16px] leading-relaxed">
                  Access your booking, event details and secure QR pass anytime from your phone.
                </p>
                <Link href="/my-tickets" className="inline-flex items-center justify-center px-8 h-[52px] bg-gradient-premium text-white font-[700] rounded-full hover:shadow-premium transition-all hover:-translate-y-0.5 active:scale-95 text-[15px] sm:text-[16px] w-full sm:w-auto">
                  View My Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[800px] mx-auto border-t border-navratri-lightGrey">
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-display font-[800] text-navratri-text tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-card overflow-hidden border border-navratri-lightGrey hover:border-navratri-primary/50 transition-colors shadow-card">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-7 md:p-8 text-left"
              >
                <span className="font-display font-[700] text-navratri-text text-[18px]">{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-6 h-6 text-navratri-primary" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </button>
              <div 
                className={`overflow-hidden transition-all duration-350 ease-in-out ${
                  openFaq === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="px-7 md:px-8 pb-8 text-navratri-muted font-[500] text-[16px] leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
