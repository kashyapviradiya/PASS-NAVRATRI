'use client';

import { useEffect, useState } from 'react';
import { Download, Share2, Calendar, Clock, Loader2, ShieldCheck, ShieldAlert, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingTicketsPage({ params }: { params: { id: string } }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [downloading, setDownloading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, [params.id]);

  const fetchTickets = async () => {
    try {
      const normalizedId = decodeURIComponent(params.id).replace(/\s+/g, '-');
      const res = await fetch(`/api/get-tickets?bookingId=${normalizedId}`);
      const data = await res.json();
      
      if (data.success && data.tickets.length > 0) {
        setTickets(data.tickets);
        
        // Generate QR Code data URLs for all tickets
        const newQrCodes: Record<string, string> = {};
        for (const t of data.tickets) {
          const qr = await QRCode.toDataURL(t.qrValue || t.ticketId, {
            width: 320,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
          });
          newQrCodes[t.ticketId] = qr;
        }
        setQrCodes(newQrCodes);
      } else {
        setTickets([]);
      }
    } catch (error) {
      toast.error('Network Error');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPass = async (ticket: any) => {
    if (downloading === ticket.ticketId) return;
    setDownloading(ticket.ticketId);
    const toastId = toast.loading('Preparing pass...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => reject(new Error('Failed to load QR image'));
        qrImg.src = qrCodes[ticket.ticketId];
      });

      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#1E1B4B');
      bgGrad.addColorStop(1, '#312E81');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 229, 255, 0.06)';
      ctx.beginPath(); ctx.arc(200, 300, 400, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 77, 109, 0.06)';
      ctx.beginPath(); ctx.arc(700, 1200, 450, 0, Math.PI * 2); ctx.fill();

      const ticketX = 50;
      const ticketY = 80;
      const ticketW = 800;
      const ticketH = 1440;
      const ticketR = 40;

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
      
      const notchY = 700;
      const notchR = 30;
      
      ctx.beginPath();
      ctx.moveTo(ticketX + ticketR, ticketY);
      ctx.lineTo(ticketX + ticketW - ticketR, ticketY);
      ctx.arcTo(ticketX + ticketW, ticketY, ticketX + ticketW, ticketY + ticketR, ticketR);
      
      ctx.lineTo(ticketX + ticketW, notchY - notchR);
      ctx.arc(ticketX + ticketW, notchY, notchR, -Math.PI / 2, Math.PI / 2, true);
      
      ctx.lineTo(ticketX + ticketW, ticketY + ticketH - ticketR);
      ctx.arcTo(ticketX + ticketW, ticketY + ticketH, ticketX + ticketW - ticketR, ticketY + ticketH, ticketR);
      ctx.lineTo(ticketX + ticketR, ticketY + ticketH);
      ctx.arcTo(ticketX, ticketY + ticketH, ticketX, ticketY + ticketH - ticketR, ticketR);
      
      ctx.lineTo(ticketX, notchY + notchR);
      ctx.arc(ticketX, notchY, notchR, Math.PI / 2, -Math.PI / 2, true);
      
      ctx.lineTo(ticketX, ticketY + ticketR);
      ctx.arcTo(ticketX, ticketY, ticketX + ticketR, ticketY, ticketR);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 42px "Inter", "Plus Jakarta Sans", sans-serif';
      ctx.fillText('RaasPass', ticketX + 60, ticketY + 80);
      
      ctx.fillStyle = '#FF4D6D';
      ctx.beginPath();
      ctx.arc(ticketX + 235, ticketY + 68, 8, 0, Math.PI * 2);
      ctx.fill();

      const isExpired = new Date(ticket.eventEndDate || ticket.eventDate) < new Date();
      const statusText = isExpired ? 'EXPIRED' : ticket.status.toUpperCase();
      let badgeBg = '#22C55E';
      if (statusText === 'USED' || statusText === 'CHECKED IN') badgeBg = '#3B82F6';
      else if (statusText === 'CANCELLED') badgeBg = '#EF4444';
      else if (statusText === 'EXPIRED') badgeBg = '#6B7280';
      
      ctx.fillStyle = badgeBg;
      ctx.beginPath();
      ctx.roundRect(ticketX + ticketW - 240, ticketY + 45, 180, 50, 25);
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(statusText === 'USED' ? 'USED' : statusText, ticketX + ticketW - 150, ticketY + 76);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 40px sans-serif';
      
      const eventName = ticket.eventName || 'Navratri Event';
      let eventLines = [];
      if (eventName.length > 25) {
        eventLines = [eventName.slice(0, 25) + '...', eventName.slice(25)];
      } else {
        eventLines = [eventName];
      }
      ctx.fillText(eventLines[0], ticketX + 60, ticketY + 160);
      
      ctx.fillStyle = '#7C3AED';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(ticket.ticketType?.toUpperCase() || 'PASS', ticketX + 60, ticketY + 220);

      ctx.fillStyle = '#475569';
      ctx.font = '600 22px sans-serif';
      const isCouple = ticket.ticketType?.toLowerCase().includes('couple');
      const entryCountNum = ticket.entryCount || (isCouple ? 2 : 1);
      const quantityText = `Total Entry: ${entryCountNum} ${entryCountNum > 1 ? 'People' : 'Person'}`;
      ctx.fillText(quantityText, ticketX + 60, ticketY + 260);

      const qrW = 300;
      const qrH = 300;
      const qrX = ticketX + (ticketW - qrW) / 2;
      const qrY = ticketY + 310;

      ctx.fillStyle = '#F8FAFC';
      ctx.shadowColor = 'rgba(0,0,0,0.06)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.roundRect(qrX - 30, qrY - 30, qrW + 60, qrH + 90, 28);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.drawImage(qrImg, qrX, qrY, qrW, qrH);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN AT ENTRY', qrX + qrW / 2, qrY + qrH + 25);
      
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(ticket.ticketId, qrX + qrW / 2, qrY + qrH + 50);
      ctx.textAlign = 'left';

      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 12]);
      ctx.beginPath();
      ctx.moveTo(ticketX + notchR + 10, notchY);
      ctx.lineTo(ticketX + ticketW - notchR - 10, notchY);
      ctx.stroke();
      ctx.setLineDash([]); 

      const metaY = notchY + 70;
      
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('GUEST NAME', ticketX + 60, metaY);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(ticket.customerName, ticketX + 60, metaY + 35);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('BOOKING ID', ticketX + 440, metaY);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(ticket.bookingId, ticketX + 440, metaY + 35);

      const timeY = metaY + 110;
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('DATE & TIME', ticketX + 60, timeY);
      
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      ctx.fillText(`${formattedDate} • 7:00 PM`, ticketX + 60, timeY + 35);

      const gateY = timeY + 110;
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('GATE ASSIGNMENT', ticketX + 60, gateY);
      
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      const gateText = ticket.gateName ? `${ticket.gateName} (Gate ${ticket.gateNumber || 'N/A'})` : 'Gate Announced at Venue';
      ctx.fillText(gateText, ticketX + 60, gateY + 35);

      const venueY = gateY + 110;
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('VENUE LOCATION', ticketX + 60, venueY);
      
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      const venueStr = ticket.venue || '';
      let venueLines = [];
      if (venueStr.length > 40) {
        venueLines = [venueStr.slice(0, 40), venueStr.slice(40)];
      } else {
        venueLines = [venueStr];
      }
      ctx.fillText(venueLines[0], ticketX + 60, venueY + 35);
      if (venueLines[1]) {
        ctx.fillText(venueLines[1], ticketX + 60, venueY + 65);
      }

      const instY = venueY + 110;
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(ticketX + 40, instY, ticketW - 80, 160, 20);
      ctx.fill();
      
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('IMPORTANT INSTRUCTIONS', ticketX + 65, instY + 40);
      
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#64748B';
      const instructions = [
        '• Keep screen brightness high during scanning',
        '• Carry a valid government ID',
        '• QR code can be scanned only once',
        '• Screenshot of QR is not recommended',
        '• Reach venue 30 minutes before event time'
      ];
      
      instructions.forEach((inst, idx) => {
        ctx.fillText(inst, ticketX + 65, instY + 70 + (idx * 20));
      });

      const holoY = ticketY + ticketH - 12;
      const holoGrad = ctx.createLinearGradient(ticketX, holoY, ticketX + ticketW, holoY);
      holoGrad.addColorStop(0, '#7C3AED');
      holoGrad.addColorStop(0.5, '#00E5FF');
      holoGrad.addColorStop(1, '#FF4D6D');
      
      ctx.fillStyle = holoGrad;
      ctx.beginPath();
      ctx.roundRect(ticketX + ticketR, holoY, ticketW - (ticketR * 2), 12, {bl: ticketR, br: ticketR});
      ctx.fill();

      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      
      const cleanEventName = ticket.eventName.replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `RaasPass-${cleanEventName}-${ticket.ticketId}.png`;

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Pass downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate image pass.', { id: toastId });
    } finally {
      setDownloading(null);
    }
  };

  const handleShare = async (ticket: any) => {
    // Generate URL for single ticket
    const ticketUrl = `${window.location.origin}/ticket/${ticket.ticketId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Navratri Pass',
          text: `Here is my ticket for ${ticket.eventName}`,
          url: ticketUrl,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(ticketUrl);
      toast.success('Ticket link copied to clipboard!');
    }
  };

  const openMaps = (venue: string) => {
    const query = encodeURIComponent(venue);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-navratri-accent bg-[#07070F]">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-white font-medium">Loading Tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#07070F]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">Invalid Booking</h1>
        <p className="text-gray-400 max-w-md mb-8">This booking link is invalid or no tickets were found. Please contact the organizer.</p>
        <button onClick={() => router.push('/my-tickets')} className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full font-bold transition-all">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 pt-8 px-4 flex flex-col items-center bg-[#07070F] print:bg-white print:p-0 print:m-0 relative overflow-x-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none fixed"></div>
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[#00E5FF]/10 rounded-full blur-[120px] pointer-events-none fixed"></div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #7C3AED 0%, #00E5FF 25%, #FF4D6D 50%, #00E5FF 75%, #7C3AED 100%);
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
      `}} />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-12 print:gap-4 print:w-full print:max-w-none">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-2"
        >
           <h1 className="text-white text-2xl font-bold font-display tracking-tight">Your Tickets</h1>
           <p className="text-gray-400 text-sm mt-1">{tickets.length} pass{tickets.length > 1 ? 'es' : ''} in booking</p>
        </motion.div>

        {tickets.map((ticket, index) => {
          const isExpired = new Date(ticket.eventEndDate || ticket.eventDate) < new Date();
          const isUsed = ticket.status === 'used' || ticket.checkedIn;
          const isCancelled = ticket.status === 'cancelled';
          const isValid = ticket.status === 'valid' && !isExpired && !isUsed;

          const isCouple = ticket.ticketType?.toLowerCase().includes('couple');
          const entryCountNum = ticket.entryCount || (isCouple ? 2 : 1);
          const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          const codeUrl = qrCodes[ticket.ticketId];

          return (
            <div 
              key={ticket.ticketId} 
              className="w-full relative"
            >
              
              {/* Boarding Pass Ticket Card */}
              <div className="relative bg-[#ffffff] text-slate-900 rounded-[2.5rem] overflow-hidden shadow-premium border border-slate-100 print:border-none print:bg-white print:shadow-none flex flex-col">
                
                {/* Event Banner */}
                {ticket.eventBanner && (
                  <div className="h-40 w-full relative">
                    <img src={ticket.eventBanner} alt="Event Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
                  </div>
                )}

                <div className="p-6 md:p-8 flex flex-col bg-[#FDFDFF] border-b border-dashed border-slate-200 relative">
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-display font-[850] text-[#0F172A] tracking-tight flex items-center gap-1.5">
                      RaasPass<span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    </span>
                    
                    <div>
                      {isValid && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-[800] tracking-wider uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" /> VALID PASS
                        </span>
                      )}
                      {isUsed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full text-xs font-[800] tracking-wider uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CHECKED IN
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 border border-red-500/20 rounded-full text-xs font-[800] tracking-wider uppercase">
                          <ShieldAlert className="w-3.5 h-3.5" /> CANCELLED
                        </span>
                      )}
                      {isExpired && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 text-gray-600 border border-gray-500/20 rounded-full text-xs font-[800] tracking-wider uppercase">
                          <ShieldAlert className="w-3.5 h-3.5" /> EXPIRED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-8 text-left">
                    <h1 className="text-[26px] md:text-[32px] font-display font-[850] text-slate-900 leading-tight mb-3 tracking-tight">{ticket.eventName}</h1>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[12px] font-[800] uppercase tracking-wider rounded-md border border-purple-100">
                        {ticket.ticketType}
                      </span>
                      <span className="text-[13px] text-slate-500 font-semibold">
                        Total Entry: {entryCountNum} {entryCountNum > 1 ? 'People' : 'Person'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-[24px] border border-slate-100 relative group overflow-hidden">
                    <div className="p-3 bg-white rounded-[20px] shadow-sm border border-slate-200/60 relative z-10 isolate">
                      {codeUrl ? (
                        <img src={codeUrl} alt="QR Code" className="w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] md:w-[280px] md:h-[280px] object-contain block mix-blend-multiply" />
                      ) : (
                        <div className="w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] md:w-[280px] md:h-[280px] bg-slate-100 animate-pulse rounded-xl"></div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-[800] uppercase tracking-widest mt-4">Scan at Entry</p>
                    <p className="font-mono text-[13px] font-[800] text-slate-700 tracking-wider mt-1.5">{ticket.ticketId}</p>
                  </div>
                  
                  <div className="absolute -left-4 bottom-0 w-8 h-8 bg-[#07070F] rounded-full transform translate-y-1/2 border-r border-slate-100 print:hidden"></div>
                  <div className="absolute -right-4 bottom-0 w-8 h-8 bg-[#07070F] rounded-full transform translate-y-1/2 border-l border-slate-100 print:hidden"></div>
                </div>

                <div className="p-6 md:p-8 bg-[#FFFFFF] space-y-6">
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-left text-sm">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-[800] mb-1">Guest Name</p>
                      <p className="text-slate-900 font-semibold truncate text-[15px]">{ticket.customerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-[800] mb-1">Booking ID</p>
                      <p className="text-slate-900 font-semibold truncate font-mono text-[15px]">{ticket.bookingId}</p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-[800] mb-1">Date & Time</p>
                      <p className="text-slate-900 font-semibold text-[15px]">
                        {formattedDate} • 7:00 PM
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-[800] mb-1">Gate Assignment</p>
                      <p className="text-slate-900 font-semibold text-[15px]">
                        {ticket.gateName ? `${ticket.gateName} (Gate ${ticket.gateNumber || 'N/A'})` : 'Gate Announced at Venue'}
                      </p>
                    </div>

                    {ticket.gateInstructions && (
                      <div className="col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-[800] mb-1">Gate Instructions</p>
                        <p className="text-slate-700 text-xs font-[500] leading-relaxed">{ticket.gateInstructions}</p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-[800] mb-1">Venue</p>
                      <p className="text-slate-900 font-semibold text-[14px] leading-snug">{ticket.venue}</p>
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-between text-[11px] text-slate-500 pt-2">
                      <span>Reporting Time: Arrive 30 min before event</span>
                      <span>support@raaspass.in</span>
                    </div>
                  </div>

                  {isUsed && ticket.checkedInAt && (
                    <div className="bg-blue-50 text-blue-700 rounded-2xl p-4 border border-blue-100 text-xs font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Checked in on {new Date(ticket.checkedInAt).toLocaleString('en-IN')}
                    </div>
                  )}
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-4">
                    <h3 className="text-[11px] uppercase tracking-widest font-[800] text-slate-600 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Important Instructions
                    </h3>
                    <ul className="text-[11px] text-slate-500 space-y-1.5 font-medium">
                      <li>• Keep screen brightness high during scanning</li>
                      <li>• Carry a valid government ID</li>
                      <li>• QR code can be scanned only once</li>
                      <li>• Screenshot of QR is not recommended</li>
                      <li>• Reach venue 30 minutes before event time</li>
                    </ul>
                  </div>
                </div>
                
                <div className="h-2 w-full animate-shimmer print:hidden"></div>

                {/* Inline Ticket Actions */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between gap-3 print:hidden">
                  <button 
                    onClick={() => handleDownloadPass(ticket)} 
                    disabled={downloading === ticket.ticketId || isCancelled}
                    className="flex-1 bg-white hover:bg-slate-100 active:scale-95 transition-all text-slate-800 font-[800] py-3 rounded-xl flex items-center justify-center gap-2 text-sm border border-slate-200 shadow-sm disabled:opacity-55"
                  >
                    {downloading === ticket.ticketId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download
                  </button>
                  <button onClick={() => handleShare(ticket)} disabled={isCancelled} className="p-3 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-xl border border-slate-200 shadow-sm transition-all" title="Share Pass">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openMaps(ticket.venue)} className="p-3 bg-white hover:bg-slate-100 active:scale-95 text-[#00E5FF] rounded-xl border border-slate-200 shadow-sm transition-all" title="Directions">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
