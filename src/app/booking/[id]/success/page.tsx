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
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-navratri-accent selection:text-white pt-[80px] relative overflow-hidden">
      {/* Premium ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-[#FF4D6D]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Floating particles background effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      
      <div className="max-w-xl w-full bg-white/[0.08] backdrop-blur-[24px] rounded-[28px] p-8 md:p-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.4)] border border-white/[0.12] relative z-10 animate-fade-in-up">
        {/* Glowing pulsing success icon container */}
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
          <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-25"></div>
        </div>

        <h1 className="text-[36px] font-display font-[850] text-white mb-3 tracking-tight leading-tight">Booking Confirmed!</h1>
        <p className="text-[#CBD5E1] font-[500] text-[16px] leading-relaxed max-w-md mx-auto mb-10">
          Your payment was successful. We've sent a confirmation email with your booking details.
        </p>

        {/* Darker glass booking details box */}
        <div className="bg-white/[0.06] rounded-[24px] p-6 mb-10 border border-white/[0.08] text-left space-y-5 backdrop-blur-md shadow-inner">
          <div className="pb-4 border-b border-white/10">
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-[800] mb-1.5">Booking ID</p>
            <p className="text-xl font-mono font-[800] text-white tracking-wide">{params.id}</p>
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-[800] mb-1.5">Status</p>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] font-[800] uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="w-3.5 h-3.5" /> Paid
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-[800] mb-1.5">Tickets</p>
              <p className="text-[15px] font-[800] text-white flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Ready to use
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/my-tickets" className="w-full bg-gradient-to-r from-[#7C3AED] to-[#FF4D6D] text-white font-[800] py-4.5 rounded-full flex items-center justify-center gap-2.5 hover:shadow-[0_8px_32px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-1 relative overflow-hidden group text-[16px]">
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10 flex items-center gap-2"><Ticket className="w-5 h-5" /> View My Tickets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
