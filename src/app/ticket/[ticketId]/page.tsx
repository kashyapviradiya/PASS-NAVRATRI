'use client';

import { useEffect, useState } from 'react';
import { Download, Share2, MapPin, Calendar, Clock, Loader2, ShieldCheck, ShieldAlert, CheckCircle2, Navigation } from 'lucide-react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function TicketPage({ params }: { params: { ticketId: string } }) {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [statusState, setStatusState] = useState<'valid' | 'used' | 'cancelled' | 'invalid'>('valid');

  useEffect(() => {
    fetchTicket();
  }, [params.ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${params.ticketId}`);
      const data = await res.json();
      
      if (data.success) {
        setTicket(data.ticket);
        setStatusState(data.ticket.status);
        
        // Generate QR Code data URL
        const qr = await QRCode.toDataURL(data.ticket.qrValue, {
          width: 300,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrCodeUrl(qr);
      } else {
        setStatusState('invalid');
      }
    } catch (error) {
      toast.error('Network Error');
      setStatusState('invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Navratri Pass',
          text: `Here is my ticket for ${ticket.eventName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ticket link copied to clipboard!');
    }
  };

  const handleDownloadIcs = () => {
    const eventDate = new Date(ticket.eventDate);
    // Simple ICS format builder
    const startStr = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endStr = new Date(eventDate.getTime() + 6 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ''); // Assume 6 hours
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${ticket.eventName} - Pass Navratri
DTSTART:${startStr}
DTEND:${endStr}
LOCATION:${ticket.venue}
DESCRIPTION:Ticket ID: ${ticket.ticketId}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'event.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openMaps = () => {
    const query = encodeURIComponent(ticket.venue);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-navratri-accent">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-white font-medium">Verifying Secure Ticket...</p>
      </div>
    );
  }

  if (statusState === 'invalid' || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">Invalid Ticket</h1>
        <p className="text-gray-400 max-w-md">This ticket link is invalid or the ticket could not be found in the system. Please contact the organizer.</p>
      </div>
    );
  }

  const isValid = statusState === 'valid';
  const isUsed = statusState === 'used';
  const isCancelled = statusState === 'cancelled';

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 flex flex-col items-center print:bg-white print:p-0 print:m-0">
      
      {/* Wallet Pass Container */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative print:w-full print:max-w-none print:shadow-none"
      >
        {/* Glow Effect */}
        {isValid && (
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-300 via-navratri-accent to-purple-600 rounded-[2.5rem] blur-xl opacity-30 animate-pulse print:hidden"></div>
        )}

        <div className="relative bg-[#111111] border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl print:border-none print:bg-white print:shadow-none">
          
          {/* Banner Image */}
          <div className="h-48 w-full bg-gray-900 relative">
            <img src={ticket.eventBanner || '/images/hero-bg.jpg'} alt="Event Banner" className="w-full h-full object-cover opacity-80 print:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#111111] print:hidden"></div>
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isValid && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 backdrop-blur-md text-white rounded-full text-xs font-bold shadow-lg print:bg-green-500 print:text-white">
                  <ShieldCheck className="w-3.5 h-3.5" /> VALID PASS
                </div>
              )}
              {isUsed && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600/90 backdrop-blur-md text-white rounded-full text-xs font-bold shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CHECKED IN
                </div>
              )}
              {isCancelled && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 backdrop-blur-md text-white rounded-full text-xs font-bold shadow-lg">
                  <ShieldAlert className="w-3.5 h-3.5" /> CANCELLED
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 relative">
            
            {/* Ticket Cutouts / Notches (Visual only) */}
            <div className="absolute -left-4 top-0 w-8 h-8 bg-[#0a0a0a] rounded-full print:hidden"></div>
            <div className="absolute -right-4 top-0 w-8 h-8 bg-[#0a0a0a] rounded-full print:hidden"></div>
            <div className="absolute left-0 right-0 top-4 h-px border-t-2 border-dashed border-gray-800 print:hidden"></div>

            <div className="text-center mt-6 mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-[800] text-white print:text-black leading-tight mb-1">{ticket.eventName}</h1>
              <p className="text-navratri-accent font-bold uppercase tracking-widest text-sm">{ticket.ticketType}</p>
            </div>

            <div className="flex justify-center mb-8">
              <div className={`p-4 bg-white rounded-2xl ${isValid ? 'shadow-[0_0_30px_rgba(224,36,84,0.3)]' : isCancelled ? 'opacity-30 grayscale' : 'opacity-80 grayscale'}`}>
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 md:w-56 md:h-56 print:w-48 print:h-48" />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-left border-t border-gray-800 pt-6 print:border-gray-200">
              
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1 print:text-gray-500">Name</p>
                <p className="text-white font-medium text-sm truncate print:text-black">{ticket.customerName}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1 print:text-gray-500">Date & Time</p>
                <p className="text-white font-medium text-sm print:text-black">
                  {new Date(ticket.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • 7:00 PM
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1 print:text-gray-500">Venue</p>
                <p className="text-white font-medium text-sm print:text-black line-clamp-2">{ticket.venue}</p>
              </div>

              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1 print:text-gray-500">Ticket ID</p>
                <p className="text-gray-300 font-mono text-xs print:text-gray-800">{ticket.ticketId}</p>
              </div>

              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1 print:text-gray-500">Booking ID</p>
                <p className="text-gray-300 font-mono text-xs print:text-gray-800">{ticket.bookingId}</p>
              </div>

            </div>

          </div>
        </div>
      </motion.div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="w-full max-w-md mt-6 grid grid-cols-4 gap-3 print:hidden">
        <button onClick={handleDownloadPdf} className="flex flex-col items-center justify-center bg-[#111111] border border-gray-800 rounded-2xl p-3 hover:bg-gray-900 transition-colors">
          <Download className="w-5 h-5 text-gray-300 mb-1" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Save PDF</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center justify-center bg-[#111111] border border-gray-800 rounded-2xl p-3 hover:bg-gray-900 transition-colors">
          <Share2 className="w-5 h-5 text-gray-300 mb-1" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Share</span>
        </button>
        <button onClick={handleDownloadIcs} className="flex flex-col items-center justify-center bg-[#111111] border border-gray-800 rounded-2xl p-3 hover:bg-gray-900 transition-colors">
          <Calendar className="w-5 h-5 text-gray-300 mb-1" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add Cal</span>
        </button>
        <button onClick={openMaps} className="flex flex-col items-center justify-center bg-[#111111] border border-gray-800 rounded-2xl p-3 hover:bg-gray-900 transition-colors">
          <Navigation className="w-5 h-5 text-navratri-accent mb-1" />
          <span className="text-[10px] font-bold text-navratri-accent uppercase tracking-wider">Maps</span>
        </button>
      </div>

    </div>
  );
}
