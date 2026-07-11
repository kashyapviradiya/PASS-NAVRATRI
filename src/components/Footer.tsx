import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-[800] text-[#111111] tracking-tight block mb-4">
              રાસPass
            </Link>
            <p className="text-[#6B7280] font-[500] text-sm">
              Scan. Enter. Celebrate.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-[800] text-[#111111] mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Home</Link></li>
              <li><Link href="/events" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Events</Link></li>
              <li><Link href="/my-tickets" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">My Tickets</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-[800] text-[#111111] mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Help Centre</Link></li>
              <li><Link href="/refund-policy" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-[800] text-[#111111] mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#6B7280] hover:text-[#E53935] text-sm font-[500] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6B7280] text-sm font-[500]">
            © 2026 RaasPass. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[#6B7280] text-sm font-[500]">Made for seamless event experiences.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
