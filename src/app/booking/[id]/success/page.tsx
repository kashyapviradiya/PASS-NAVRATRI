'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Ticket, ArrowRight, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-navratri-darkBg flex items-center justify-center p-4 selection:bg-navratri-primary selection:text-white pt-[60px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-premium opacity-10 blur-3xl z-0"></div>
      
      <div className="glass max-w-lg w-full rounded-[24px] p-8 md:p-12 text-center shadow-premium border border-white/20 relative z-10 animate-fade-in-up">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative border border-green-500/30 shadow-[0_0_32px_rgba(34,197,94,0.15)]">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
          <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping opacity-20"></div>
        </div>

        <h1 className="text-[32px] font-display font-[800] text-white mb-2 tracking-tight">Booking Confirmed!</h1>
        <p className="text-slate-300 font-[500] mb-8">
          Your payment was successful. We've sent a confirmation email with your booking details.
        </p>

        <div className="bg-white/5 rounded-[20px] p-6 mb-8 border border-white/10 text-left space-y-4 backdrop-blur-md">
          <div>
            <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[800]">Booking ID</p>
            <p className="text-lg font-mono font-[700] text-white">{params.id}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[800]">Status</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[11px] font-[800] uppercase mt-1">
                Paid
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[800]">Tickets</p>
              <p className="text-sm font-[700] text-white mt-1">Ready to use</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/my-tickets" className="w-full bg-gradient-premium text-white font-[800] py-4 rounded-button flex items-center justify-center gap-2 hover:shadow-premium transition-all hover:-translate-y-1 relative overflow-hidden group">
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10 flex items-center gap-2"><Ticket className="w-5 h-5" /> View My Tickets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
