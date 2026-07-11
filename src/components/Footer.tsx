import Link from 'next/link';
import logoImg from '../../logo 1.png';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <img src={logoImg.src} alt="RaasPass Logo" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-gray-400 font-[500] text-sm">
              Scan. Enter. Celebrate.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-[800] text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Home</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Events</Link></li>
              <li><Link href="/my-tickets" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">My Tickets</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-[800] text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Help Centre</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-[800] text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm font-[500] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-[500]">
            © 2026 RaasPass. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
          </div>
        </div>
      </div>
    </footer>
  );
}
