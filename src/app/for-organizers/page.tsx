'use client';

import { Shield, QrCode, Zap, BarChart3, Users, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForOrganizers() {
  return (
    <div className="bg-navratri-bg min-h-screen pb-20 font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-navratri-dark">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-navratri-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-navratri-accent/10 rounded-full blur-[80px] animate-pulse-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-navratri-gold text-xs font-bold tracking-widest uppercase">Elevate Your Event</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-tight max-w-4xl mx-auto mb-6">
            The Ultimate Ticketing Platform for <span className="text-transparent bg-clip-text bg-gradient-premium">Event Organizers</span>
          </h1>
          
          <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage inventory, prevent ticket duplication with secure QR codes, and gain real-time insights with our premium organizer dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/organizer/login" className="btn-primary px-8 py-4 text-base w-full sm:w-auto">
              Organizer Login
            </Link>
            <a href="#contact-sales" className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out active:scale-[0.97] px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/15 rounded-button hover:bg-white/10 text-base w-full sm:w-auto">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-section-md px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { 
              icon: Shield, 
              title: 'Bank-Grade Security', 
              desc: 'Prevent unauthorized entry and fake tickets with our dynamic, cryptographically secure QR system.',
              color: 'text-navratri-primary',
              bg: 'bg-navratri-primary/5'
            },
            { 
              icon: Zap, 
              title: 'Lightning Fast Check-in', 
              desc: 'Our proprietary staff scanner app processes entries in milliseconds, keeping queues moving.',
              color: 'text-navratri-primary',
              bg: 'bg-navratri-primary/5'
            },
            { 
              icon: BarChart3, 
              title: 'Real-time Analytics', 
              desc: 'Monitor ticket sales, live entry counts, and revenue on a beautiful, easy-to-use dashboard.',
              color: 'text-navratri-primary',
              bg: 'bg-navratri-primary/5'
            }
          ].map((feat, i) => (
            <div key={i} className="card-interactive p-8 group">
              <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center mb-6 border border-navratri-primary/10 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <h3 className="text-2xl font-display font-bold text-navratri-text mb-4">{feat.title}</h3>
              <p className="text-navratri-muted font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-section-lg relative overflow-hidden bg-navratri-dark">
        <div className="absolute inset-0 bg-gradient-premium opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white">Complete Control in Your Hands</h2>
              <p className="text-white/70 font-medium text-lg leading-relaxed">
                Everything you need to run a successful event is just a click away. Give restricted access to your staff for scanning, while you monitor the big picture.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  'Live inventory management',
                  'Staff account creation',
                  'Exportable attendee data',
                  'Automated payout settlements'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-navratri-gold" />
                    <span className="text-lg font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-navratri-gold/10 blur-3xl rounded-full"></div>
              <div className="glass-dark p-6 rounded-[2rem] shadow-2xl relative z-10 border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                    <div className="font-bold text-white text-[14px]">Live Organizer Dashboard</div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-[11px] font-[800] uppercase tracking-widest text-slate-500 mb-1">Total Sales</div>
                      <div className="text-2xl font-display font-extrabold text-white">₹4,50,000</div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-[11px] font-[800] uppercase tracking-widest text-slate-500 mb-1">Checked In</div>
                      <div className="text-2xl font-display font-extrabold text-white">1,240 / 2,000</div>
                    </div>
                  </div>
                  <div className="h-32 bg-slate-950 rounded-xl border border-slate-800 flex items-end p-4 gap-2">
                    {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-navratri-primary/30 rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="w-full bg-gradient-premium rounded-t-sm" style={{ height: '30%' }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact-sales" className="py-section-lg max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-heading mb-4">Ready to upgrade your event?</h2>
        <p className="section-subheading text-lg mb-10 max-w-2xl mx-auto">
          Join the most exclusive events. Fill out the form below and our team will get in touch with you.
        </p>
        
        <form className="card-base p-8 md:p-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="input-label">Organizer Name</label>
              <input type="text" className="input-field" placeholder="E.g. Royal Events" />
            </div>
            <div>
              <label className="input-label">Contact Person</label>
              <input type="text" className="input-field" placeholder="John Doe" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="input-label">Phone Number</label>
              <input type="tel" className="input-field" placeholder="+91 00000 00000" />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" className="input-field" placeholder="john@example.com" />
            </div>
          </div>
          <div className="mb-8">
            <label className="input-label">Event Details</label>
            <textarea rows={4} className="input-field resize-none" placeholder="Tell us about your event size, location, and expected crowd..."></textarea>
          </div>
          <button type="button" onClick={() => alert("Thank you! Our sales team will contact you shortly.")} className="btn-primary w-full py-4 text-base">
            Submit Inquiry
          </button>
        </form>
      </section>
    </div>
  );
}
