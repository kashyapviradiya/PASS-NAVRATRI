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
    <div className="bg-[#F7F7F8] pb-20 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-88px)] flex items-center justify-center bg-white pt-10 pb-24 border-b border-gray-100">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left space-y-8"
            >
              <h1 className="text-5xl md:text-[64px] font-sans font-[800] text-[#111111] leading-[1.1] tracking-tight">
                Discover Gujarat’s <br/>
                <span className="text-[#E53935]">Best Events</span>
              </h1>
              
              <p className="text-xl text-[#6B7280] font-[500] max-w-lg leading-relaxed">
                Book tickets instantly, receive secure QR passes, and enjoy seamless entry to Gujarat’s most exciting events.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/events" className="px-8 py-4 bg-[#E53935] text-white font-[800] rounded-2xl hover:bg-[#D32F2F] hover:-translate-y-0.5 transition-all shadow-lg text-[16px] text-center flex items-center justify-center gap-2">
                  Explore Events
                </Link>
                <Link href="/my-tickets" className="px-8 py-4 bg-white border border-gray-200 text-[#111111] font-[800] rounded-2xl hover:bg-gray-50 transition-all text-[16px] text-center">
                  My Tickets
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6">
                {[
                  { text: 'Instant QR Passes' },
                  { text: 'Secure Payments' },
                  { text: 'Fast Event Entry' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#111111] font-[700]">
                    <CheckCircle className="w-5 h-5 text-[#E53935]" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative hidden lg:flex items-center justify-center w-full"
            >
              {/* Scaled wrapper to ensure it fits entirely on screen without cropping */}
              <div className="relative w-full max-w-[340px] xl:max-w-[380px] aspect-[9/18] min-h-[550px] max-h-[650px]">
                {/* Main Phone Mockup */}
                <div className="absolute inset-0 bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-100 overflow-hidden flex flex-col z-10">
                  <div className="h-[35%] bg-gradient-to-br from-[#111111] to-gray-900 relative shrink-0">
                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000" alt="Event Banner" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-xs font-[800] uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">VIP</span>
                      </div>
                      <h3 className="text-white font-[800] text-xl xl:text-2xl tracking-tight leading-tight line-clamp-2">Sunburn Arena<br/>Ahmedabad</h3>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#F7F7F8] p-4 xl:p-6 relative flex flex-col items-center justify-center min-h-0">
                    <div className="bg-white w-full rounded-3xl p-4 xl:p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 xl:w-16 xl:h-16 bg-[#F7F7F8] rounded-full absolute -top-6 -left-6 xl:-top-8 xl:-left-8"></div>
                      <div className="w-12 h-12 xl:w-16 xl:h-16 bg-[#F7F7F8] rounded-full absolute -top-6 -right-6 xl:-top-8 xl:-right-8"></div>
                      <div className="w-24 h-24 xl:w-32 xl:h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 shrink-0">
                        <QrCode className="w-16 h-16 xl:w-20 xl:h-20 text-[#111111]" />
                      </div>
                      <p className="text-[10px] xl:text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1 mt-auto">Pass ID</p>
                      <p className="font-mono text-base xl:text-lg font-[800] text-[#111111]">TK-849201</p>
                    </div>
                  </div>
                </div>

                {/* Floating Payment Success */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -left-8 xl:-left-12 top-24 xl:top-32 z-20 bg-white rounded-2xl p-3 xl:p-4 shadow-xl border border-gray-100 flex items-center gap-3 w-[220px] xl:w-64"
                >
                  <div className="w-8 h-8 xl:w-10 xl:h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 xl:w-5 xl:h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs xl:text-sm font-[800] text-[#111111]">Payment Success</p>
                    <p className="text-[10px] xl:text-xs font-[500] text-[#6B7280]">₹2,500 securely paid</p>
                  </div>
                </motion.div>

                {/* Floating Entry Pass */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 xl:-right-16 bottom-24 xl:bottom-40 z-20 bg-white rounded-2xl p-3 xl:p-4 shadow-xl border border-gray-100 flex items-center gap-3 w-[200px] xl:w-56"
                >
                  <div className="w-8 h-8 xl:w-10 xl:h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-4 h-4 xl:w-5 xl:h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs xl:text-sm font-[800] text-[#111111]">Entry Pass</p>
                    <p className="text-[10px] xl:text-xs font-[500] text-[#6B7280]">Ready to scan</p>
                  </div>
                </motion.div>

                {/* Floating Sold Out Badge */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-2 xl:-right-4 top-16 xl:top-20 z-20 bg-[#111111] text-white rounded-xl px-4 py-2 xl:px-5 xl:py-3 shadow-xl flex items-center gap-2"
                >
                  <Star className="w-3 h-3 xl:w-4 xl:h-4 text-[#E53935] fill-current" />
                  <span className="text-[10px] xl:text-xs font-[800] uppercase tracking-widest">Sold Out</span>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENTS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-sans font-[800] text-[#111111] mb-3 tracking-tight">Popular Events Near You</h2>
            <p className="text-[#6B7280] font-[500] text-lg">Discover the events everyone is talking about.</p>
          </div>
          <Link href="/events" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-[#111111] font-[800] rounded-xl hover:bg-gray-50 transition-colors">
            View All Events
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-sans font-[800] text-[#111111] mb-4 tracking-tight">Book Your Entry in 3 Simple Steps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
                desc: 'Select your ticket type, complete secure payment and receive confirmation instantly.' 
              },
              { 
                step: 'Step 3', 
                title: 'Scan & Enter', 
                icon: QrCode, 
                desc: 'Show your QR pass at the gate and enjoy fast, hassle-free entry.' 
              }
            ].map((s, i) => (
              <div key={i} className="bg-[#F7F7F8] rounded-[2rem] p-10 text-center relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <s.icon className="w-8 h-8 text-[#E53935]" />
                </div>
                <p className="text-[10px] font-[800] text-[#E53935] uppercase tracking-widest mb-2">{s.step}</p>
                <h3 className="text-2xl font-[800] text-[#111111] mb-4">{s.title}</h3>
                <p className="text-[#6B7280] font-[500] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY RAASPASS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-sans font-[800] text-[#111111] tracking-tight">A Better Way to Attend Events</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#F7F7F8] rounded-2xl flex items-center justify-center shrink-0">
                <feature.icon className="w-7 h-7 text-[#111111]" />
              </div>
              <div>
                <h3 className="text-xl font-[800] text-[#111111] mb-2">{feature.title}</h3>
                <p className="text-[#6B7280] font-[500]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { label: 'Tickets Booked', value: '50,000+' },
              { label: 'Events Hosted', value: '100+' },
              { label: 'Cities Covered', value: '10+' },
              { label: 'Customer Rating', value: '4.8/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <p className="text-4xl md:text-5xl font-[800] mb-2">{stat.value}</p>
                <p className="text-white/60 font-[600] text-sm uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TRUST & 7. APP-LIKE PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-sans font-[800] text-[#111111] mb-6 tracking-tight">Made for Seamless Event Experiences</h2>
                <p className="text-lg text-[#6B7280] font-[500] leading-relaxed">
                  From booking to entry, RaasPass keeps every step fast, simple and secure.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { text: 'Secure Payment', icon: Lock },
                  { text: 'Verified Events', icon: CheckCircle },
                  { text: 'Instant Confirmation', icon: Zap },
                  { text: 'Dedicated Support', icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-12 h-12 bg-[#F7F7F8] rounded-full flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#E53935]" />
                    </div>
                    <span className="font-[800] text-[#111111]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F7F7F8] rounded-[3rem] p-12 text-center border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-8 shadow-sm">
                  <Smartphone className="w-10 h-10 text-[#111111]" />
                </div>
                <h2 className="text-3xl font-[800] text-[#111111] mb-4 tracking-tight">Your Pass, Always With You</h2>
                <p className="text-[#6B7280] font-[500] mb-8 max-w-md mx-auto">
                  Access your booking, event details and secure QR pass anytime from your phone.
                </p>
                <Link href="/my-tickets" className="inline-flex items-center justify-center px-8 py-4 bg-[#111111] text-white font-[800] rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-0.5">
                  View My Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-sans font-[800] text-[#111111] tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-[800] text-[#111111] text-lg">{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-6 h-6 text-[#E53935]" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-[#6B7280] font-[500] leading-relaxed">
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
