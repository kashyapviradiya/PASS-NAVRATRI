import Link from 'next/link';
import logoImg from '../../logo 1.png';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navratri-primary border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="block mb-6">
              <img src={logoImg.src} alt="RasPass Logo" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-navratri-muted font-[500] text-[15px] leading-relaxed max-w-sm">
              Scan. Enter. Celebrate.<br />
              Your premium pass to unforgettable events.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-display font-[700] text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Home</Link></li>
              <li><Link href="/events" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Events</Link></li>
              <li><Link href="/my-tickets" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">My Tickets</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="font-display font-[700] text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Help Centre</Link></li>
              <li><Link href="/refund-policy" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="font-display font-[700] text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-navratri-muted hover:text-white text-[14px] font-[500] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-navratri-muted text-[13px] font-[500]">
            © {new Date().getFullYear()} RasPass. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-navratri-muted hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-navratri-muted hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-navratri-muted hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
