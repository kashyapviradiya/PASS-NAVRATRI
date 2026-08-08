'use client';
import { Mail, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="bg-navratri-bg min-h-screen pt-[120px] pb-32 font-sans selection:bg-navratri-primary selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[36px] md:text-[44px] font-display font-[800] text-navratri-text mb-4 tracking-tight">Contact Us</h1>
          <p className="text-[18px] text-navratri-muted font-[500]">We're here to help you with your booking and event queries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-card p-10 border border-navratri-border shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-primary/5 rounded-[16px] flex items-center justify-center shrink-0 border border-navratri-primary/10">
                  <Mail className="w-6 h-6 text-navratri-primary" />
                </div>
                <div>
                  <h3 className="text-[12px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Email Support</h3>
                  <p className="font-[600] text-navratri-text">support@raaspass.com</p>
                  <p className="text-[13px] text-navratri-muted mt-1 font-[500]">We aim to reply within 2 hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-primary/5 rounded-[16px] flex items-center justify-center shrink-0 border border-navratri-primary/10">
                  <Phone className="w-6 h-6 text-navratri-primary" />
                </div>
                <div>
                  <h3 className="text-[12px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Phone Support</h3>
                  <p className="font-[600] text-navratri-text">+91 98765 43210</p>
                  <p className="text-[13px] text-navratri-muted mt-1 font-[500]">Mon-Sat, 9AM to 8PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-primary/5 rounded-[16px] flex items-center justify-center shrink-0 border border-navratri-primary/10">
                  <MapPin className="w-6 h-6 text-navratri-primary" />
                </div>
                <div>
                  <h3 className="text-[12px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Office Address</h3>
                  <p className="font-[600] text-navratri-text leading-relaxed">
                    RaasPass HQ<br/>
                    12th Floor, Titanium Business Park<br/>
                    SG Highway, Ahmedabad<br/>
                    Gujarat 380015
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card p-10 border border-navratri-border shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Full Name</label>
                <input required type="text" className="w-full px-5 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-border focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary focus:shadow-[0_0_0_3px_rgba(1,69,242,0.1)] outline-none transition-all font-[500] text-[15px]" placeholder="Your Name" />
              </div>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Email Address</label>
                <input required type="email" className="w-full px-5 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-border focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary focus:shadow-[0_0_0_3px_rgba(1,69,242,0.1)] outline-none transition-all font-[500] text-[15px]" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Message</label>
                <textarea required rows={4} className="w-full px-5 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-border focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary focus:shadow-[0_0_0_3px_rgba(1,69,242,0.1)] outline-none transition-all font-[500] text-[15px]" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full px-8 py-4 bg-navratri-primary hover:opacity-90 text-white font-[700] rounded-button hover:shadow-premium transition-all shadow-sm hover:-translate-y-0.5 active:scale-[0.98] mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
