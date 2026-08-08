'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-navratri-bg flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-[80px] relative overflow-hidden">
      {/* Premium ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-navratri-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-navratri-accent/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      <div className="max-w-xl w-full bg-white rounded-card p-8 md:p-12 text-center shadow-premium border border-navratri-lightGrey relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/brand/raaspass-logo.svg" alt="RaasPass Logo" className="h-10 md:h-12 w-auto object-contain" />
        </div>
        {/* Glowing pulsing success icon container */}
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
          <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-25"></div>
        </div>

        <h1 className="text-[36px] font-display font-[850] text-navratri-dark mb-3 tracking-tight leading-tight">Booking Confirmed!</h1>
        <p className="text-navratri-muted font-[500] text-[16px] leading-relaxed max-w-md mx-auto mb-10">
          Your payment was successful. We've sent a confirmation email with your booking details.
        </p>

        {/* Details box */}
        <div className="bg-navratri-softBg rounded-[24px] p-6 mb-10 border border-navratri-lightGrey text-left space-y-5 shadow-sm">
          <div className="pb-4 border-b border-navratri-lightGrey">
            <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[800] mb-1.5">Booking ID</p>
            <p className="text-xl font-mono font-[800] text-navratri-text tracking-wide">{params.id}</p>
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-[800] mb-1.5">Status</p>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] font-[800] uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="w-3.5 h-3.5" /> Paid
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[800] mb-1.5">Tickets</p>
              <p className="text-[15px] font-[800] text-navratri-text flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready to use
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/my-tickets" className="w-full bg-navratri-primary text-white font-[800] py-4 rounded-[16px] flex items-center justify-center gap-2.5 hover:opacity-90 transition-all active:scale-[0.98] shadow-md text-[16px]">
            <Ticket className="w-5 h-5" /> View My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
