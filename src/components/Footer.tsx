import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative py-12 md:py-16 overflow-hidden bg-[#1A1A1A]">
      {/* ── Top border ────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-white/10" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16 text-left">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <img
                src="/brand/raaspass-logo.svg"
                alt="RaasPass Logo"
                className="h-[48px] md:h-[56px] w-auto object-contain scale-[1.15] origin-left brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-gray-500 font-medium text-sm leading-[1.75] max-w-sm">
              India's premium event ticketing platform.<br />
              Scan. Enter. Celebrate.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-6">
              Events
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/events', label: 'Explore Events' },
                { href: '/for-organizers', label: 'For Organizers' },
                { href: '/contact', label: 'Host an Event' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/contact', label: 'Help Center' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/contact', label: 'FAQs' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/refund-policy', label: 'Refund Policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ────────────────────────────────── */}
        <div className="h-px w-full mb-8 bg-white/10" />

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-gray-500 text-sm tracking-wide">
            © 2026 RaasPass. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm tracking-wide">
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
