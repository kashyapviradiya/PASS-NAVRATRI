import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-[#F7F7F8] min-h-screen pt-[120px] pb-32 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-[800] text-[#111111] mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg text-[#6B7280] font-[500]">We're here to help you with your booking and event queries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-[800] text-[#111111] mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#9333EA]" />
                </div>
                <div>
                  <h3 className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Email Support</h3>
                  <p className="font-[600] text-[#111111]">support@raaspass.com</p>
                  <p className="text-sm text-[#6B7280] mt-1 font-[500]">We aim to reply within 2 hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#9333EA]" />
                </div>
                <div>
                  <h3 className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Phone Support</h3>
                  <p className="font-[600] text-[#111111]">+91 98765 43210</p>
                  <p className="text-sm text-[#6B7280] mt-1 font-[500]">Mon-Sat, 9AM to 8PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#9333EA]" />
                </div>
                <div>
                  <h3 className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-1">Office Address</h3>
                  <p className="font-[600] text-[#111111] leading-relaxed">
                    RaasPass HQ<br/>
                    12th Floor, Titanium Business Park<br/>
                    SG Highway, Ahmedabad<br/>
                    Gujarat 380015
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-[800] text-[#111111] mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                <input type="text" className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="Your Name" />
              </div>
              <div>
                <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                <input type="email" className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 block">Message</label>
                <textarea rows={4} className="w-full px-5 py-4 rounded-xl bg-[#F7F7F8] border border-gray-100 focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] outline-none transition-all font-[600]" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full px-8 py-4 bg-[#111111] text-white font-[800] rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
