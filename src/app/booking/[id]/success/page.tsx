'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Ticket, ArrowRight, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BookingSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-4 selection:bg-[#9333EA] selection:text-white pt-[60px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white max-w-lg w-full rounded-[2rem] p-8 md:p-12 text-center shadow-xl shadow-black/5 border border-gray-100"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping opacity-20"></div>
        </div>

        <h1 className="text-3xl font-sans font-[800] text-[#111111] mb-2 tracking-tight">Booking Confirmed!</h1>
        <p className="text-[#6B7280] font-[500] mb-8">
          Your payment was successful. We've sent a confirmation email with your booking details.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left space-y-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800]">Booking ID</p>
            <p className="text-lg font-mono font-[700] text-[#111111]">{params.id}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800]">Status</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-[800] uppercase mt-1">
                Paid
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800]">Tickets</p>
              <p className="text-sm font-[700] text-[#111111] mt-1">Ready to use</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href={`/ticket/${params.id}`} className="w-full bg-[#111111] text-white font-[800] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:-translate-y-0.5">
            <Ticket className="w-5 h-5" /> View QR Tickets
          </Link>
          <Link href="/my-tickets" className="w-full bg-white text-[#111111] font-[800] py-4 rounded-2xl flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition-all">
            Go to My Tickets <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
