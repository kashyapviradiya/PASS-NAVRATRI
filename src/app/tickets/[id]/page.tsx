'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Download, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DigitalTicketPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`/api/get-tickets?bookingId=${params.id}`);
        const data = await res.json();
        if (data.success && data.tickets.length > 0) {
          setTickets(data.tickets);
          
          // Generate local QR Code
          import('qrcode').then(async (QRCode) => {
            const dataUrl = await QRCode.default.toDataURL(data.tickets[0].qrValue, {
              width: 150,
              margin: 1,
              color: { dark: '#111111', light: '#00000000' }
            });
            setQrCodeDataUrl(dataUrl);
          });
        } else {
          router.push('/my-tickets');
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center pt-[80px]">
        <div className="w-16 h-16 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (tickets.length === 0) return null;

  const firstTicket = tickets[0];
  const totalTickets = tickets.length;

  return (
    <div className="bg-[#111111] min-h-screen pt-[100px] pb-20 font-sans selection:bg-[#E53935] selection:text-white flex flex-col">
      <div className="max-w-md mx-auto w-full px-4 flex-1 flex flex-col">
        
        <div className="mb-6 flex items-center justify-between">
          <Link href="/my-tickets" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-[600] text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2 text-xs font-[800] text-white/60 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full">
            <Shield className="w-3 h-3 text-green-400" /> Confirmed
          </div>
        </div>

        {/* BOARDING PASS STYLE TICKET */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-[#F7F7F8] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Top Half: Event & QR */}
          <div className="bg-white p-8 relative flex-1">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#E53935]"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-[800] text-[#111111] leading-tight mb-2 tracking-tight">{firstTicket.eventName}</h2>
              <p className="text-[#6B7280] font-[600] text-sm">RaasPass Live Experience</p>
            </div>

            <div className="bg-[#F7F7F8] w-48 h-48 mx-auto rounded-3xl p-4 flex items-center justify-center border border-gray-100 shadow-inner relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#E53935]/50 animate-scan"></div>
              {/* Render real QR code locally */}
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Ticket QR Code" 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Pass Type</p>
                <p className="font-[800] text-[#111111] text-sm">{firstTicket.ticketType}</p>
              </div>
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Total Entry</p>
                <p className="font-[800] text-[#111111] text-sm">{totalTickets} Person(s)</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-0 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#111111] rounded-full z-10"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-[#111111] rounded-full z-10"></div>
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 border-dashed border-t-2 border-[#111111]/20"></div>
          </div>

          {/* Bottom Half: Details */}
          <div className="bg-[#F7F7F8] p-8 pb-10">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                <p className="font-[800] text-[#111111] text-sm">{new Date(firstTicket.eventDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
                <p className="font-[800] text-[#111111] text-sm">{new Date(firstTicket.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Venue</p>
              <p className="font-[800] text-[#111111] text-sm leading-snug mb-1">{firstTicket.venue}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Name</p>
                <p className="font-[800] text-[#111111] text-sm truncate">{firstTicket.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-mono font-[800] text-[#111111] text-sm">{firstTicket.bookingId}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <button className="mt-8 w-full bg-white/10 text-white font-[800] py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md">
          <Download className="w-5 h-5" /> Download Pass
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}} />
    </div>
  );
}
