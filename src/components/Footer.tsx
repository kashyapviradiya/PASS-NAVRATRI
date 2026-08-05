import Link from 'next/link';
import logoImg from '../../logo 1.png';

export default function Footer() {
  return (
    <footer
      className="relative pt-20 pb-10 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)',
      }}
    >
      {/* ── Gradient top border ────────────────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #7C3AED 25%, #FF4D6D 50%, #00E5FF 75%, transparent 100%)',
        }}
      />

      {/* ── Decorative blurred orbs ───────────────────────────── */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-600/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand column */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <img
                src={logoImg.src}
                alt="RasPass Logo"
                className="h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-[#CBD5E1] font-[500] text-[15px] leading-[1.75] max-w-sm">
              Scan. Enter. Celebrate.<br />
              Your premium pass to unforgettable events.
            </p>

            {/* Social icons – inline under the tagline on mobile */}
            <div className="flex items-center gap-3 mt-8">
              {[
                {
                  label: 'Instagram',
                  href: '#',
                  path: (
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  ),
                },
                {
                  label: 'Twitter / X',
                  href: '#',
                  path: (
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  ),
                },
                {
                  label: 'Facebook',
                  href: '#',
                  path: (
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="
                    group/icon relative w-10 h-10 rounded-full flex items-center justify-center
                    bg-white/[0.06] border border-white/10 backdrop-blur-sm
                    hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]
                    hover:scale-110 transition-all duration-300
                  "
                >
                  <svg
                    className="w-[18px] h-[18px] text-[#94A3B8] group-hover/icon:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {social.path}
                  </svg>
                  {/* Gradient glow ring on hover */}
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 -z-10 blur-md"
                    style={{
                      background:
                        'linear-gradient(135deg, #7C3AED 0%, #00E5FF 100%)',
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-display font-[800] text-[#F8FAFC] text-[14px] uppercase tracking-widest mb-6">
              Explore
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/events', label: 'Events' },
                { href: '/my-tickets', label: 'My Tickets' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      text-[#CBD5E1] hover:text-transparent hover:bg-clip-text
                      text-[14px] font-[500] transition-all duration-300
                      hover:pl-1
                    "
                    style={{
                      /* Applied only on hover via the class above for text-transparent */
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundImage =
                        'linear-gradient(90deg, #A78BFA, #00E5FF)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundImage = 'none';
                      (e.currentTarget as HTMLElement).style.color = '#CBD5E1';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="font-display font-[800] text-[#F8FAFC] text-[14px] uppercase tracking-widest mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/contact', label: 'Help Centre' },
                { href: '/refund-policy', label: 'Refund Policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="
                      text-[#CBD5E1] hover:text-transparent hover:bg-clip-text
                      text-[14px] font-[500] transition-all duration-300
                      hover:pl-1
                    "
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundImage =
                        'linear-gradient(90deg, #A78BFA, #00E5FF)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundImage = 'none';
                      (e.currentTarget as HTMLElement).style.color = '#CBD5E1';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="font-display font-[800] text-[#F8FAFC] text-[14px] uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="
                      text-[#CBD5E1] hover:text-transparent hover:bg-clip-text
                      text-[14px] font-[500] transition-all duration-300
                      hover:pl-1
                    "
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundImage =
                        'linear-gradient(90deg, #A78BFA, #00E5FF)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundImage = 'none';
                      (e.currentTarget as HTMLElement).style.color = '#CBD5E1';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Gradient divider ────────────────────────────────── */}
        <div
          className="h-px w-full mb-8"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 20%, rgba(255,77,109,0.3) 50%, rgba(0,229,255,0.4) 80%, transparent 100%)',
          }}
        />

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-[#94A3B8] text-[13px] font-[500] tracking-wide">
            © {new Date().getFullYear()} RasPass. All rights reserved.
          </p>

          <p className="text-[#64748B] text-[12px] font-[500] tracking-wide hidden md:block">
            Built with ♥ for unforgettable nights
          </p>
        </div>
      </div>
    </footer>
  );
}
