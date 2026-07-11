'use client';

import { Shield, QrCode, Zap, BarChart3, Users, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForOrganizers() {
  return (
    <div className="bg-[#FFFAF0] min-h-screen pt-20 pb-20 font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#F5E6D3]/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#8A2323]/20 bg-white mb-6">
            <span className="text-[#8A2323] text-sm font-bold tracking-wide">Elevate Your Event</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#8A2323] leading-tight max-w-4xl mx-auto mb-6">
            The Ultimate Ticketing Platform for Garba Organizers
          </h1>
          
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage inventory, prevent ticket duplication with secure QR codes, and gain real-time insights with our premium organizer dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/organizer/login" className="px-8 py-4 bg-[#8A2323] text-[#FFFAF0] font-bold rounded-full hover:bg-[#5a0000] hover:scale-105 transition-all shadow-xl shadow-[#8A2323]/20 text-lg w-full sm:w-auto">
              Organizer Login
            </Link>
            <a href="#contact-sales" className="px-8 py-4 bg-white text-[#8A2323] border border-[#F0E6D2] font-bold rounded-full hover:bg-gray-50 transition-all text-lg w-full sm:w-auto">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Shield, 
                title: 'Bank-Grade Security', 
                desc: 'Prevent unauthorized entry and fake tickets with our dynamic, cryptographically secure QR system.'
              },
              { 
                icon: Zap, 
                title: 'Lightning Fast Check-in', 
                desc: 'Our proprietary staff scanner app processes entries in milliseconds, keeping queues moving.'
              },
              { 
                icon: BarChart3, 
                title: 'Real-time Analytics', 
                desc: 'Monitor ticket sales, live entry counts, and revenue on a beautiful, easy-to-use dashboard.'
              }
            ].map((feat, i) => (
              <div key={i} className="bg-[#FFFAF0] rounded-3xl p-8 border border-[#F0E6D2] hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#F0E6D2]">
                  <feat.icon className="w-7 h-7 text-[#8A2323]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feat.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-[#8A2323] text-[#FFFAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Complete Control in Your Hands</h2>
              <p className="text-[#F5E6D3] font-light text-lg mb-8 leading-relaxed">
                Everything you need to run a successful Navratri event is just a click away. Give restricted access to your staff for scanning, while you monitor the big picture.
              </p>
              
              <div className="space-y-4">
                {[
                  'Live inventory management',
                  'Staff account creation',
                  'Exportable attendee data',
                  'Automated payout settlements'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#F3C623]" />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-[#F3C623]/20 blur-3xl rounded-full"></div>
              <div className="bg-[#FFFAF0] p-4 rounded-[2rem] shadow-2xl relative z-10 border-4 border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-inner border border-[#F0E6D2]">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <div className="font-bold text-[#8A2323]">Dashboard</div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Total Sales</div>
                      <div className="text-2xl font-bold text-gray-900">₹4,50,000</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Checked In</div>
                      <div className="text-2xl font-bold text-gray-900">1,240 / 2,000</div>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-end p-4 gap-2">
                    {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#8A2323]/20 rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="w-full bg-[#8A2323] rounded-t-sm" style={{ height: '20%' }}></div>
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
      <section id="contact-sales" className="py-24 bg-[#FFFAF0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-[#8A2323] mb-6">Ready to upgrade your event?</h2>
          <p className="text-gray-600 font-light text-xl mb-10">
            Join the most exclusive Navratri events in Gujarat. Fill out the form below and our team will get in touch with you.
          </p>
          
          <form className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#F0E6D2] text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Name</label>
                <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#8A2323]/20 focus:border-[#8A2323] outline-none transition-all" placeholder="E.g. Royal Events" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#8A2323]/20 focus:border-[#8A2323] outline-none transition-all" placeholder="John Doe" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#8A2323]/20 focus:border-[#8A2323] outline-none transition-all" placeholder="+91 00000 00000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#8A2323]/20 focus:border-[#8A2323] outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
              <textarea rows={4} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#8A2323]/20 focus:border-[#8A2323] outline-none transition-all resize-none" placeholder="Tell us about your event size, location, and expected crowd..."></textarea>
            </div>
            <button type="button" onClick={() => alert("Thank you! Our sales team will contact you shortly.")} className="w-full py-4 bg-[#8A2323] text-[#FFFAF0] font-bold rounded-xl hover:bg-[#5a0000] transition-colors text-lg">
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
