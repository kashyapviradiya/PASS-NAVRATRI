import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-navratri-bg min-h-screen pt-[120px] pb-32 font-sans selection:bg-navratri-accent selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[40px] md:text-[48px] font-display font-[700] text-navratri-text mb-4 tracking-tight">Contact Us</h1>
          <p className="text-[18px] text-navratri-muted font-[500]">We're here to help you with your booking and event queries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-card p-10 border border-navratri-lightGrey shadow-sm">
            <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-accent/5 rounded-[16px] flex items-center justify-center shrink-0 border border-navratri-accent/10">
                  <Mail className="w-6 h-6 text-navratri-accent" />
                </div>
                <div>
                  <h3 className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Email Support</h3>
                  <p className="font-[600] text-navratri-text">support@raaspass.com</p>
                  <p className="text-[13px] text-navratri-muted mt-1 font-[500]">We aim to reply within 2 hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-accent/5 rounded-[16px] flex items-center justify-center shrink-0 border border-navratri-accent/10">
                  <Phone className="w-6 h-6 text-navratri-accent" />
                </div>
                <div>
                  <h3 className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Phone Support</h3>
                  <p className="font-[600] text-navratri-text">+91 98765 43210</p>
                  <p className="text-[13px] text-navratri-muted mt-1 font-[500]">Mon-Sat, 9AM to 8PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-accent/5 rounded-[16px] flex items-center justify-center shrink-0 border border-navratri-accent/10">
                  <MapPin className="w-6 h-6 text-navratri-accent" />
                </div>
                <div>
                  <h3 className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-1">Office Address</h3>
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

          <div className="bg-white rounded-card p-10 border border-navratri-lightGrey shadow-sm">
            <h2 className="text-[24px] font-display font-[700] text-navratri-text mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Full Name</label>
                <input type="text" className="w-full px-5 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-lightGrey focus:border-navratri-accent focus:ring-1 focus:ring-navratri-accent outline-none transition-all font-[500] text-[15px]" placeholder="Your Name" />
              </div>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Email Address</label>
                <input type="email" className="w-full px-5 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-lightGrey focus:border-navratri-accent focus:ring-1 focus:ring-navratri-accent outline-none transition-all font-[500] text-[15px]" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Message</label>
                <textarea rows={4} className="w-full px-5 py-3.5 rounded-[14px] bg-navratri-bg border border-navratri-lightGrey focus:border-navratri-accent focus:ring-1 focus:ring-navratri-accent outline-none transition-all font-[500] text-[15px]" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full px-8 py-4 bg-navratri-primary text-white font-[700] rounded-button hover:bg-black transition-all shadow-sm hover:-translate-y-0.5 mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
