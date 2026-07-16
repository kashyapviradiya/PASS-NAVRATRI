'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, QrCode, Zap, ChevronDown, ChevronUp, CheckCircle, Ticket, ArrowRight, Smartphone, Star, Lock, Heart, PlayCircle } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { DEMO_EVENTS } from '@/lib/demo-data';
import type { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-navratri-primary pt-10 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-navratri-accent/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-navratri-darkAccent/5 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 text-left space-y-8"
            >
              <h1 className="text-[56px] md:text-[72px] lg:text-[84px] font-display font-[700] text-white leading-[1.05] tracking-tight">
                Your Pass to <br/>
                <span className="text-navratri-accent">Unforgettable</span> Events
              </h1>
              
              <p className="text-[18px] md:text-[20px] text-navratri-muted font-[500] max-w-xl leading-relaxed">
                Discover premium events, book your pass, and enter seamlessly with secure digital QR tickets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/events" className="px-8 py-4 bg-navratri-accent text-white font-[700] rounded-button hover:bg-navratri-darkAccent hover:-translate-y-0.5 transition-all shadow-sm text-[16px] text-center flex items-center justify-center gap-2">
                  Explore Events
                </Link>
                <Link href="/my-tickets" className="px-8 py-4 bg-transparent border border-white/20 text-white font-[700] rounded-button hover:bg-white/5 transition-all text-[16px] text-center">
                  View My Tickets
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10">
                {[
                  { text: 'Secure Booking', icon: Shield },
                  { text: 'Instant QR Ticket', icon: QrCode },
                  { text: 'Fast Entry', icon: Zap },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[14px] text-navratri-muted font-[600]">
                    <badge.icon className="w-5 h-5 text-navratri-accent" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative hidden lg:flex items-center justify-center w-full"
            >
              <div className="relative w-full max-w-[340px] aspect-[9/18] min-h-[550px]">
                {/* Main Phone Mockup */}
                <div className="absolute inset-0 bg-navratri-secondary rounded-[40px] shadow-2xl border-[8px] border-navratri-primary overflow-hidden flex flex-col z-10 ring-1 ring-white/10">
                  <div className="h-[40%] bg-[#0A0A0A] relative shrink-0">
                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000" alt="Event Banner" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-[10px] font-[800] uppercase tracking-widest bg-navratri-accent px-3 py-1.5 rounded-full">VIP PASS</span>
                      </div>
                      <h3 className="text-white font-display font-[700] text-[24px] tracking-tight leading-tight line-clamp-2">Sunburn Arena</h3>
                    </div>
                  </div>
                  <div className="flex-1 bg-navratri-bg p-6 relative flex flex-col items-center justify-center min-h-0">
                    <div className="bg-white w-full rounded-[24px] p-6 shadow-sm border border-navratri-lightGrey text-center relative flex-1 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-navratri-bg rounded-full absolute -top-8 -left-8 border border-navratri-lightGrey"></div>
                      <div className="w-16 h-16 bg-navratri-bg rounded-full absolute -top-8 -right-8 border border-navratri-lightGrey"></div>
                      <div className="w-32 h-32 mx-auto bg-navratri-bg rounded-[20px] flex items-center justify-center mb-6 shrink-0 border border-navratri-lightGrey">
                        <QrCode className="w-20 h-20 text-navratri-text" />
                      </div>
                      <p className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1 mt-auto">Booking ID</p>
                      <p className="font-mono text-[18px] font-[700] text-navratri-text tracking-wider">TK-849201</p>
                    </div>
                  </div>
                </div>

                {/* Floating Payment Success */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -left-12 top-32 z-20 bg-white rounded-[16px] p-4 shadow-elevated border border-navratri-lightGrey flex items-center gap-4 w-64"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-[700] text-navratri-text">Payment Success</p>
                    <p className="text-[12px] font-[500] text-navratri-muted">₹2,500 securely paid</p>
                  </div>
                </motion.div>

                {/* Floating Entry Pass */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-16 bottom-32 z-20 bg-navratri-secondary rounded-[16px] p-4 shadow-elevated border border-white/10 flex items-center gap-4 w-56"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[14px] font-[700] text-white">Entry Pass</p>
                    <p className="text-[12px] font-[500] text-navratri-muted">Ready to scan</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENTS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-[36px] font-display font-[700] text-navratri-text mb-4 tracking-tight">Popular Events Near You</h2>
            <p className="text-navratri-muted font-[500] text-[18px]">Discover the events everyone is talking about.</p>
          </div>
          <Link href="/events" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-navratri-lightGrey text-navratri-text font-[700] rounded-button hover:bg-navratri-bg transition-colors shadow-sm text-[15px]">
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
      <section className="py-24 bg-white border-y border-navratri-lightGrey">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-[36px] font-display font-[700] text-navratri-text mb-4 tracking-tight">Book Your Entry in 3 Simple Steps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Desktop Connectors */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-navratri-lightGrey z-0"></div>

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
                <div className="w-[88px] h-[88px] mx-auto bg-white rounded-[24px] border border-navratri-lightGrey flex items-center justify-center mb-8 shadow-sm group-hover:-translate-y-2 group-hover:shadow-elevated transition-all duration-300">
                  <s.icon className="w-8 h-8 text-navratri-accent" />
                </div>
                <p className="text-[12px] font-[700] text-navratri-accent uppercase tracking-widest mb-3">{s.step}</p>
                <h3 className="text-[24px] font-display font-[700] text-navratri-text mb-4">{s.title}</h3>
                <p className="text-navratri-muted font-[500] leading-relaxed text-[16px] max-w-sm mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY RASPASS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="mb-16">
          <h2 className="text-[36px] font-display font-[700] text-navratri-text tracking-tight">A Better Way to Attend Events</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: 'Instant Digital Pass', 
              icon: Zap, 
              desc: 'Receive your QR ticket immediately after successful booking.' 
            },
            { 
              title: 'Secure Booking', 
              icon: Shield, 
              desc: 'Your payment and booking information stay protected.' 
            },
            { 
              title: 'Faster Entry', 
              icon: QrCode, 
              desc: 'Skip manual verification and enter with one quick scan.' 
            },
            { 
              title: 'Easy Ticket Access', 
              icon: Smartphone, 
              desc: 'View all upcoming and past bookings inside My Tickets.' 
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 md:p-10 border border-navratri-lightGrey flex flex-col sm:flex-row gap-8 hover:shadow-card transition-shadow">
              <div className="w-16 h-16 bg-navratri-bg rounded-[20px] flex items-center justify-center shrink-0 border border-navratri-lightGrey/50">
                <feature.icon className="w-8 h-8 text-navratri-accent" />
              </div>
              <div>
                <h3 className="text-[22px] font-display font-[700] text-navratri-text mb-3">{feature.title}</h3>
                <p className="text-navratri-muted font-[500] text-[16px] leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-24 bg-navratri-primary text-white border-y border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-x divide-white/10">
            {[
              { label: 'Tickets Booked', value: '50,000+' },
              { label: 'Events Hosted', value: '100+' },
              { label: 'Cities Covered', value: '10+' },
              { label: 'Customer Rating', value: '4.8/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <p className="text-[40px] md:text-[56px] font-display font-[700] mb-4">{stat.value}</p>
                <p className="text-navratri-muted font-[600] text-[12px] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. APP-LIKE PREVIEW */}
      <section className="py-32 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-[40px] font-display font-[700] text-navratri-text mb-6 tracking-tight leading-[1.1]">Made for Seamless Event Experiences</h2>
                <p className="text-[18px] text-navratri-muted font-[500] leading-relaxed max-w-lg">
                  From booking to entry, RasPass keeps every step fast, simple and secure. Access everything from your phone.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-10">
                {[
                  { text: 'Secure Payment', icon: Lock },
                  { text: 'Verified Events', icon: CheckCircle },
                  { text: 'Instant Confirmation', icon: Zap },
                  { text: 'Dedicated Support', icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-navratri-bg rounded-[16px] border border-navratri-lightGrey flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-navratri-accent" />
                    </div>
                    <span className="font-display font-[700] text-navratri-text text-[16px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navratri-bg rounded-[40px] p-16 text-center border border-navratri-lightGrey relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-[24px] mx-auto flex items-center justify-center mb-10 shadow-sm border border-navratri-lightGrey">
                  <Smartphone className="w-12 h-12 text-navratri-text" />
                </div>
                <h2 className="text-[32px] font-display font-[700] text-navratri-text mb-6 tracking-tight">Your Pass, Always With You</h2>
                <p className="text-navratri-muted font-[500] mb-12 max-w-md mx-auto text-[16px] leading-relaxed">
                  Access your booking, event details and secure QR pass anytime from your phone.
                </p>
                <Link href="/my-tickets" className="inline-flex items-center justify-center px-8 py-4 bg-navratri-text text-white font-[700] rounded-button hover:bg-black transition-all shadow-sm hover:-translate-y-0.5 text-[16px]">
                  View My Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[800px] mx-auto border-t border-navratri-lightGrey">
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-display font-[700] text-navratri-text tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-[20px] overflow-hidden border border-navratri-lightGrey hover:border-[#D4D4D4] transition-colors shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className="font-display font-[700] text-navratri-text text-[18px]">{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-6 h-6 text-navratri-accent" /> : <ChevronDown className="w-6 h-6 text-navratri-muted" />}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-8 text-navratri-muted font-[500] text-[16px] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
