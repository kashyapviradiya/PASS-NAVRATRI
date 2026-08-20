'use client';
import { Mail, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="bg-navratri-bg min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-heading mb-4">Contact Us</h1>
          <p className="section-subheading text-lg">We're here to help you with your booking and event queries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="card-base p-8 md:p-10 hover:shadow-card-hover transition-shadow duration-300">
            <h2 className="text-2xl font-display font-bold text-navratri-dark mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-navratri-primary/10">
                  <Mail className="w-5 h-5 text-navratri-primary" />
                </div>
                <div>
                  <h3 className="input-label">Email Support</h3>
                  <p className="font-semibold text-navratri-text">support@raaspass.com</p>
                  <p className="text-sm text-navratri-muted mt-1 font-medium">We aim to reply within 2 hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-navratri-primary/10">
                  <Phone className="w-5 h-5 text-navratri-primary" />
                </div>
                <div>
                  <h3 className="input-label">Phone Support</h3>
                  <p className="font-semibold text-navratri-text">+91 98765 43210</p>
                  <p className="text-sm text-navratri-muted mt-1 font-medium">Mon-Sat, 9AM to 8PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-navratri-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-navratri-primary/10">
                  <MapPin className="w-5 h-5 text-navratri-primary" />
                </div>
                <div>
                  <h3 className="input-label">Office Address</h3>
                  <p className="font-semibold text-navratri-text leading-relaxed">
                    RaasPass HQ<br/>
                    12th Floor, Titanium Business Park<br/>
                    SG Highway, Ahmedabad<br/>
                    Gujarat 380015
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-base p-8 md:p-10 hover:shadow-card-hover transition-shadow duration-300">
            <h2 className="text-2xl font-display font-bold text-navratri-dark mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="input-label">Full Name</label>
                <input required type="text" className="input-field" placeholder="Your Name" />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <input required type="email" className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="input-label">Message</label>
                <textarea required rows={4} className="input-field resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
