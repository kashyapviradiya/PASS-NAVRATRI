'use client';

import { useEffect, useState } from 'react';
import { getTicketStore } from '@/lib/ticket-store';
import { Ticket } from '@/types';
import { CheckCircle2, MessageCircle, QrCode, Calendar, MapPin, User, Ticket as TicketIcon, Copy, Printer, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';

export default function TicketPage({ params }: { params: { id: string } }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`/api/get-tickets?bookingId=${params.id}`);
        const data = await res.json();
        
        let foundTickets = data.tickets || [];

        // Fallback to local storage for local demo testing if API is empty
        if (foundTickets.length === 0) {
          const savedTickets = localStorage.getItem(`tickets_${params.id}`);
          if (savedTickets) {
            foundTickets = JSON.parse(savedTickets);
          }
        }

        setTickets(foundTickets);

        const codes: Record<string, string> = {};
        for (const ticket of foundTickets) {
          const payload = JSON.stringify({ ticketId: ticket.id, token: ticket.secureToken });
          codes[ticket.id] = await QRCode.toDataURL(payload, {
            width: 250,
            margin: 2,
            color: { dark: '#111111', light: '#ffffff' }, // Charcoal QR
          });
        }
        setQrCodes(codes);
      } catch (error) {
        console.error('Failed to load tickets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#111111] font-sans font-[800] text-xl">Minting your exclusive passes...</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-sans font-[800] text-[#111111]">No Tickets Found</h2>
          <p className="text-[#6B7280] font-[500]">This booking ID does not exist or has expired.</p>
        </div>
      </div>
    );
  }

  const shareOnWhatsApp = (ticket: Ticket) => {
    const text = `✨ *RaasPass - Premium Access Confirmed!*\n\n🎪 *${ticket.eventName}*\n📅 ${ticket.eventDate}\n📍 ${ticket.venue}\n👤 ${ticket.customerName}\n🎫 ${ticket.passType}\n🔖 Pass ID: ${ticket.id}\n\nPresent this at the gate for entry.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyTicketId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Pass ID copied to clipboard!');
  };

  return (
    <div className="bg-[#F7F7F8] min-h-screen pb-20 pt-[80px] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-green-100">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-sans font-[800] text-[#111111] mt-6 tracking-tight">Booking Confirmed</h1>
          <p className="text-[#6B7280] font-[500] text-lg">Your {tickets.length} premium pass{tickets.length > 1 ? 'es are' : ' is'} ready.</p>
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 mt-4">
            <span className="text-xs font-[800] text-gray-400 uppercase tracking-widest">Booking Ref</span>
            <span className="text-[#E53935] font-[800]">{params.id}</span>
            <button onClick={() => copyTicketId(params.id)} className="text-[#111111] hover:text-[#E53935] transition-colors ml-2"><Copy className="w-4 h-4" /></button>
          </div>
        </motion.div>

        <div className="space-y-12">
          {tickets.map((ticket, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={ticket.id} 
              className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative"
            >
              {/* Premium Ticket Header */}
              <div className="bg-[#111111] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute top-4 right-4 opacity-10">
                  <QrCode className="w-32 h-32" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E53935]/20 border border-[#E53935]/30 text-[#E53935] text-[10px] font-[800] tracking-widest uppercase mb-4">
                      <Sparkles className="w-3 h-3" /> Pass {idx + 1} of {tickets.length}
                    </div>
                    <h2 className="text-3xl font-sans font-[800] text-white drop-shadow-sm tracking-tight">{ticket.eventName}</h2>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-right shrink-0">
                    <p className="text-white/60 text-[10px] font-[800] uppercase tracking-widest mb-1">Pass ID</p>
                    <p className="font-mono font-[800] text-white text-xl tracking-wider">{ticket.id}</p>
                  </div>
                </div>
              </div>

              {/* Cutout Effect (Visual Only) */}
              <div className="flex justify-between items-center -mt-4 relative z-20">
                <div className="w-8 h-8 bg-[#F7F7F8] rounded-full -ml-4 shadow-inner"></div>
                <div className="flex-1 border-t-2 border-dashed border-gray-200"></div>
                <div className="w-8 h-8 bg-[#F7F7F8] rounded-full -mr-4 shadow-inner"></div>
              </div>

              <div className="p-8 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
                  
                  {/* Left Details */}
                  <div className="md:col-span-3 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mb-1">Date</p>
                        <p className="font-[800] text-[#111111] text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-[#E53935]" /> {ticket.eventDate}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mb-1">Pass Type</p>
                        <p className="font-[800] text-[#E53935] text-sm flex items-center gap-2"><TicketIcon className="w-4 h-4 text-[#E53935]" /> {ticket.passType}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mb-1">Guest Name</p>
                      <p className="font-[800] text-[#111111] text-lg flex items-center gap-2"><User className="w-4 h-4 text-[#E53935]" /> {ticket.customerName}</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mb-1">Venue</p>
                      <p className="font-[800] text-[#111111] text-sm flex items-start gap-2"><MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" /> {ticket.venue}</p>
                    </div>
                  </div>

                  {/* Right QR */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center">
                    <div className="p-4 bg-white border border-gray-200 rounded-3xl shadow-sm">
                      {qrCodes[ticket.id] ? (
                        <img src={qrCodes[ticket.id]} alt={`QR Code for ${ticket.id}`} className="w-48 h-48 rounded-xl" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-xs font-[800] text-gray-400 uppercase tracking-widest mt-4 text-center">Scan at entry</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#E53935] font-[800] uppercase tracking-widest mb-2">Important Instructions</p>
                    <ul className="text-sm text-[#6B7280] font-[500] space-y-1.5">
                      <li>&bull; Present this digital pass at the venue entrance.</li>
                      <li>&bull; A valid Government ID is required matching the guest name.</li>
                      <li>&bull; This QR code allows a single entry. Do not share it online.</li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={() => window.print()} className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-[#111111] rounded-2xl font-[800] text-sm hover:bg-gray-50 transition-colors">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button onClick={() => shareOnWhatsApp(ticket)} className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-[800] text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                    <MessageCircle className="w-4 h-4" /> Send to WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
