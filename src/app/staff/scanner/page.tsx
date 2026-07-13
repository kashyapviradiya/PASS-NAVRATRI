'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, XCircle, AlertTriangle, QrCode, RotateCcw, ShieldCheck, User, Ticket, Clock, Ban, LogOut, MapPin } from 'lucide-react';
import type { Ticket as TicketType } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type ScanResult = 'idle' | 'scanning' | 'valid' | 'invalid' | 'already_used' | 'cancelled';

export default function ScannerDashboard() {
  const scannerRef = useRef<any>(null);
  const [scanResult, setScanResult] = useState<ScanResult>('idle');
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [message, setMessage] = useState('');
  const [gateName, setGateName] = useState('VIP Gate 1');
  const [processing, setProcessing] = useState(false);
  const [counts, setCounts] = useState({ total: 0, valid: 0, invalid: 0, duplicate: 0 });
  const [scannerActive, setScannerActive] = useState(false);
  const router = useRouter();

  const startScanner = () => {
    setScanResult('scanning');
    setTicket(null);
    setMessage('');
    setScannerActive(true);

    setTimeout(() => {
      const { Html5QrcodeScanner } = require('html5-qrcode');
      
      if (scannerRef.current) {
        try { scannerRef.current.clear(); } catch (e) {}
      }

      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      }, false);

      scanner.render(
        async (decodedText: string) => {
          try { scanner.clear(); } catch (e) {}
          setScannerActive(false);
          await handleScanResult(decodedText);
        },
        (error: any) => {}
      );

      scannerRef.current = scanner;
    }, 100);
  };

  const handleScanResult = async (decodedText: string) => {
    try {
      let payload;
      try {
        payload = JSON.parse(decodedText);
      } catch {
        setScanResult('invalid');
        setMessage('Invalid QR code format. Not a recognized pass.');
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
        return;
      }

      const { ticketId, token } = payload;

      const res = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, token }),
      });

      const data = await res.json();
      setTicket(data.ticket || null);
      setMessage(data.message);

      if (data.status === 'valid') {
        setScanResult('valid');
        setCounts(prev => ({ ...prev, total: prev.total + 1, valid: prev.valid + 1 }));
      } else if (data.status === 'already_used') {
        setScanResult('already_used');
        setCounts(prev => ({ ...prev, total: prev.total + 1, duplicate: prev.duplicate + 1 }));
      } else if (data.status === 'cancelled') {
        setScanResult('cancelled');
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
      } else {
        setScanResult('invalid');
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
      }
    } catch (error) {
      setScanResult('invalid');
      setMessage('Network error verifying pass. Please check connection.');
      setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
    }
  };

  const handleAllowEntry = async () => {
    if (!ticket) return;
    setProcessing(true);

    try {
      const res = await fetch('/api/mark-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.id, scannedBy: 'staff-web', gateName }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Access Granted!');
        setMessage('Entry Confirmed! Guest may proceed.');
        setScanResult('already_used');
        setTicket(data.ticket);
      } else {
        toast.error(data.message);
        setMessage(data.message);
      }
    } catch (error) {
      toast.error('Failed to register entry.');
    }
    setProcessing(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.clear(); } catch (e) {}
      }
    };
  }, []);

  const getStatusColor = () => {
    switch (scanResult) {
      case 'valid': return 'from-green-500 to-green-600 shadow-green-500/20';
      case 'invalid': return 'from-red-500 to-red-600 shadow-purple-500/20';
      case 'already_used': return 'from-amber-500 to-amber-600 shadow-amber-500/20';
      case 'cancelled': return 'from-gray-500 to-gray-600 shadow-gray-500/20';
      default: return 'from-navratri-primary to-navratri-text shadow-navratri-primary/20';
    }
  };

  const getStatusIcon = () => {
    switch (scanResult) {
      case 'valid': return <CheckCircle2 className="w-16 h-16 text-white drop-shadow-md" />;
      case 'invalid': return <XCircle className="w-16 h-16 text-white drop-shadow-md" />;
      case 'already_used': return <AlertTriangle className="w-16 h-16 text-white drop-shadow-md" />;
      case 'cancelled': return <Ban className="w-16 h-16 text-white drop-shadow-md" />;
      default: return <QrCode className="w-16 h-16 text-white drop-shadow-md" />;
    }
  };

  return (
    <div className="min-h-screen bg-navratri-bg font-sans pb-20">
      
      {/* Scanner Header */}
      <div className="bg-navratri-primary text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-navratri-gold" />
            <h1 className="text-lg font-serif font-bold">Access Control</h1>
          </div>
          <button onClick={() => router.push('/staff/login')} className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        
        {/* Gate Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Assigned Gate</label>
            <select value={gateName} onChange={(e) => setGateName(e.target.value)} className="w-full bg-transparent font-bold text-navratri-text focus:outline-none appearance-none cursor-pointer">
              <option>VIP Gate 1</option>
              <option>Main Entrance A</option>
              <option>Main Entrance B</option>
              <option>Artists & Crew</option>
            </select>
          </div>
          <div className="w-10 h-10 bg-navratri-gold/10 rounded-xl flex items-center justify-center shrink-0 border border-navratri-gold/20">
            <MapPin className="w-5 h-5 text-navratri-gold" />
          </div>
        </div>

        {scanResult === 'idle' || scanResult === 'scanning' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {scanResult === 'idle' && (
              <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-navratri-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode className="w-12 h-12 text-navratri-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-navratri-text mb-2">Ready to Scan</h2>
                <p className="text-gray-500 font-light mb-8">Position the QR code within the frame to verify entry.</p>
                <button onClick={startScanner} className="w-full bg-navratri-primary text-navratri-gold font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-xl shadow-navratri-primary/20 hover:scale-[1.02] transition-transform">
                  <Camera className="w-6 h-6" /> Activate Scanner
                </button>
              </div>
            )}
            <div id="qr-reader" className="rounded-[2rem] overflow-hidden shadow-lg border-2 border-navratri-primary/20 bg-black"></div>
            {scanResult === 'scanning' && (
              <p className="text-center text-sm font-bold text-navratri-primary animate-pulse tracking-wide uppercase">Scanning for passes...</p>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            
            {/* Result Status Card */}
            <div className={`bg-gradient-to-br ${getStatusColor()} rounded-[2rem] p-8 text-center text-white shadow-xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4">{getStatusIcon()}</div>
                <h2 className="text-2xl font-serif font-bold mb-2">
                  {scanResult === 'valid' && 'Access Granted'}
                  {scanResult === 'invalid' && 'Access Denied'}
                  {scanResult === 'already_used' && 'Already Scanned'}
                  {scanResult === 'cancelled' && 'Pass Cancelled'}
                </h2>
                <p className="text-white/80 font-medium">{message}</p>
              </div>
            </div>

            {/* Pass Details */}
            {ticket && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pass ID</p>
                    <p className="font-mono font-bold text-navratri-primary">{ticket.id}</p>
                  </div>
                  <div className="px-3 py-1 bg-navratri-gold/20 text-navratri-gold rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {ticket.passType}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-navratri-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Guest Name</p>
                      <p className="font-bold text-gray-900">{ticket.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-navratri-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Event</p>
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{ticket.eventName}</p>
                    </div>
                  </div>
                  {ticket.entryTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Time of Entry</p>
                        <p className="font-bold text-gray-900 text-sm">{new Date(ticket.entryTime).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {scanResult === 'valid' && ticket && !ticket.isUsed && (
              <button
                onClick={handleAllowEntry}
                disabled={processing}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-xl shadow-green-500/20 hover:bg-green-600 transition-colors disabled:opacity-60"
              >
                {processing ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Registering...</>
                ) : (
                  <><ShieldCheck className="w-6 h-6" /> Confirm Entry</>
                )}
              </button>
            )}

            <button onClick={startScanner} className="w-full bg-white border-2 border-navratri-primary/20 text-navratri-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg hover:bg-navratri-primary/5 transition-colors">
              <RotateCcw className="w-5 h-5" /> Scan Another Pass
            </button>
          </motion.div>
        )}

        {/* Live Session Stats */}
        <div className="mt-8">
          <h3 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest text-center">Live Gate Statistics</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-xl font-bold text-navratri-text">{counts.total}</p>
              <p className="text-[9px] text-gray-400 uppercase font-bold mt-1">Total</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
              <p className="text-xl font-bold text-green-600">{counts.valid}</p>
              <p className="text-[9px] text-green-600/70 uppercase font-bold mt-1">Valid</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-3 text-center border border-red-100">
              <p className="text-xl font-bold text-red-600">{counts.invalid}</p>
              <p className="text-[9px] text-red-600/70 uppercase font-bold mt-1">Invalid</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
              <p className="text-xl font-bold text-amber-600">{counts.duplicate}</p>
              <p className="text-[9px] text-amber-600/70 uppercase font-bold mt-1">Dupes</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
