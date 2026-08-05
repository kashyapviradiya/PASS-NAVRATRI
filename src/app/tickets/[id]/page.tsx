'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Download, ArrowLeft, Shield } from 'lucide-react';
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
          
          import('qrcode').then(async (QRCode) => {
            const dataUrl = await QRCode.default.toDataURL(data.tickets[0].qrValue, {
              width: 180,
              margin: 1,
              color: { dark: '#0F172A', light: '#00000000' }
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
      <div className="min-h-screen bg-navratri-bg flex items-center justify-center pt-[80px]">
        <div className="w-16 h-16 border-4 border-navratri-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (tickets.length === 0) return null;

  const firstTicket = tickets[0];
  const totalTickets = tickets.length;

  return (
    <div className="bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] min-h-screen pt-[100px] pb-20 font-sans selection:bg-navratri-accent selection:text-white flex flex-col relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#7C3AED]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#FF4D6D]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md mx-auto w-full px-4 flex-1 flex flex-col relative z-10">
        
        <div className="mb-6 flex items-center justify-between">
          <Link href="/my-tickets" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-[700] text-[14px] transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to My Tickets
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-[800] text-[#00E5FF] uppercase tracking-widest bg-[#00E5FF]/10 px-3 py-1.5 rounded-full border border-[#00E5FF]/20 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Shield className="w-3.5 h-3.5 text-[#00E5FF]" /> Confirmed
          </div>
        </div>

        {/* BOARDING PASS STYLE TICKET */}
        <div className="flex-1 bg-white rounded-[28px] overflow-hidden flex flex-col shadow-float border border-white/10 animate-fade-in-up">
          {/* Top Half: Event & QR */}
          <div className="bg-white p-8 relative flex-1">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-premium"></div>
            
            <div className="text-center mb-8 mt-2">
              <span className="text-[11px] font-[800] text-navratri-primary uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100 mb-3 inline-block">RasPass Official Entry</span>
              <h2 className="text-[24px] font-display font-[850] text-navratri-text leading-tight tracking-tight mt-1">{firstTicket.eventName}</h2>
              <p className="text-navratri-muted font-[600] text-[14px] mt-1">{firstTicket.artist || 'Traditional Garba Celebrations'}</p>
            </div>

            {/* QR Wrapper */}
            <div className="bg-slate-50 w-52 h-52 mx-auto rounded-[24px] p-4 flex items-center justify-center border border-slate-100 shadow-inner relative overflow-hidden mb-8 group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#7C3AED] shadow-[0_0_8px_#7C3AED] animate-scan z-10 pointer-events-none"></div>
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Ticket QR Code" 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-navratri-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1">Pass Type</p>
                <p className="font-[800] text-navratri-primary text-[16px]">{firstTicket.ticketType}</p>
              </div>
              <div>
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1">Total Entry</p>
                <p className="font-[800] text-navratri-text text-[16px]">{totalTickets} Person(s)</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-0 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#1E1B4B] rounded-full z-10"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-[#1E1B4B] rounded-full z-10"></div>
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-transparent border-dashed border-t-2 border-slate-200"></div>
          </div>

          {/* Bottom Half: Details */}
          <div className="bg-slate-50 p-8 pb-10">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-navratri-primary" /> Date</p>
                <p className="font-[800] text-navratri-text text-[14px]">{new Date(firstTicket.eventDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-navratri-primary" /> Time</p>
                <p className="font-[800] text-navratri-text text-[14px]">{new Date(firstTicket.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-navratri-primary" /> Venue</p>
              <p className="font-[800] text-navratri-text text-[14px] leading-snug mb-1">{firstTicket.venue}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div>
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1">Name</p>
                <p className="font-[800] text-navratri-text text-[14px] truncate">{firstTicket.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-mono font-[750] text-navratri-text text-[14px]">{firstTicket.bookingId}</p>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white font-[800] py-4 rounded-button flex justify-center items-center gap-2 transition-all border border-white/15 backdrop-blur-md shadow-card hover:-translate-y-0.5 active:scale-[0.98]">
          <Download className="w-5 h-5" /> Download Digital Pass
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
