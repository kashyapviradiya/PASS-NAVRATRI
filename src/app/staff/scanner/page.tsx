'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, XCircle, AlertTriangle, QrCode, RotateCcw, ShieldCheck, User, Ticket, Clock, Ban, LogOut, MapPin, Loader2, Volume2, VolumeX, AlertOctagon } from 'lucide-react';
import type { Ticket as TicketType } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type ScanResult = 'idle' | 'scanning' | 'valid' | 'invalid' | 'already_used' | 'cancelled' | 'wrong_gate';

export default function ScannerDashboard() {
  const scannerRef = useRef<any>(null);
  const [scanResult, setScanResult] = useState<ScanResult>('idle');
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [message, setMessage] = useState('');
  const [gateName, setGateName] = useState('VIP Gate 1');
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [counts, setCounts] = useState({ total: 0, valid: 0, invalid: 0, duplicate: 0 });
  const [cameraError, setCameraError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const router = useRouter();

  // Audio Context for beeps
  const playBeep = (type: 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio fallback or ignore
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
      if (type === 'success') navigator.vibrate([100]);
      else navigator.vibrate([200, 100, 200]);
    }
  };

  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Auto-start camera on mount
    startScanner();
    return () => stopScanner();
  }, []);

  const stopScanner = () => {
    if (scannerRef.current) {
      try { 
        if (typeof scannerRef.current.stop === 'function') {
          scannerRef.current.stop().then(() => {
            scannerRef.current.clear();
          }).catch((e: any) => {});
        } else {
          scannerRef.current.clear(); 
        }
      } catch (e) {}
      scannerRef.current = null;
    }
  };

  const startScanner = () => {
    setScanResult('scanning');
    setTicket(null);
    setMessage('');
    setCameraError('');
    setVerifying(false);
    isProcessingRef.current = false;

    setTimeout(() => {
      const { Html5Qrcode } = require('html5-qrcode');
      
      stopScanner();

      const html5QrCode = new Html5Qrcode("qr-reader");

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          // Removing aspectRatio and fixed qrbox to ensure native detection works across all devices.
          // The library will automatically use the full frame to detect QR codes.
        },
        async (decodedText: string) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;
          setVerifying(true);
          console.log("QR Detected:", decodedText);
          await handleScanResult(decodedText);
        },
        (error: any) => {
          // Ignore frequent frame-level detection errors
        }
      ).catch((err: any) => {
        setScanResult('idle');
        setCameraError('Camera access denied or no camera found. Please check permissions.');
      });

      scannerRef.current = html5QrCode;
    }, 100);
  };

  const checkGateMatch = (ticketType: string, currentGate: string) => {
    const isVipTicket = ticketType.toLowerCase().includes('vip');
    const isVipGate = currentGate.toLowerCase().includes('vip');
    return isVipTicket === isVipGate;
  };

  const handleScanResult = async (decodedText: string) => {
    try {
      let ticketId = '';
      let token = '';

      // 1. Try parsing as JSON
      try {
        const payload = JSON.parse(decodedText);
        ticketId = payload.ticketId;
        token = payload.token;
      } catch (e) {
        // Not JSON
      }

      // 2. Try parsing as URL (e.g., https://demo.passnavratri.com/ticket/12345)
      if (!ticketId && decodedText.includes('/ticket/')) {
        const parts = decodedText.split('/ticket/');
        if (parts.length > 1) {
          ticketId = parts[1].split('/')[0].split('?')[0]; // Extract ID
          token = ticketId; // Fallback token
        }
      }

      // 3. Fallback to raw string
      if (!ticketId) {
        token = decodedText;
        ticketId = decodedText; // Backend will try to match this
      }

      console.log("Extracted Ticket ID:", ticketId);

      if (!ticketId) {
        playBeep('error');
        setScanResult('invalid');
        setMessage('Malformed QR Code. Could not extract ticket data.');
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
        stopScanner();
        setVerifying(false);
        return;
      }

      const res = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, token }),
      });

      const data = await res.json();
      setTicket(data.ticket || null);
      
      stopScanner(); // Stop camera only after we get a response to display result full screen
      setVerifying(false);
      
      if (data.status === 'valid') {
        const isCorrectGate = checkGateMatch(data.ticket.ticketType, gateName);
        
        if (!isCorrectGate) {
          playBeep('error');
          setScanResult('wrong_gate');
          setMessage(`Wrong Gate! This is a ${data.ticket.ticketType}. Please direct them to the correct gate.`);
          setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
        } else {
          playBeep('success');
          setScanResult('valid');
          setMessage('Ticket is Valid. Ready for Check-in.');
          setCounts(prev => ({ ...prev, total: prev.total + 1, valid: prev.valid + 1 }));
        }
      } else if (data.status === 'already_used') {
        playBeep('error');
        setScanResult('already_used');
        setMessage(data.message);
        setCounts(prev => ({ ...prev, total: prev.total + 1, duplicate: prev.duplicate + 1 }));
      } else if (data.status === 'cancelled') {
        playBeep('error');
        setScanResult('cancelled');
        setMessage(data.message);
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
      } else {
        playBeep('error');
        setScanResult('invalid');
        setMessage(data.message || 'Counterfeit or Invalid Ticket.');
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
      }
    } catch (error) {
      stopScanner();
      setVerifying(false);
      playBeep('error');
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
        body: JSON.stringify({ ticketId: ticket.ticketId || ticket.id, scannedBy: 'staff-web', gateName }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Access Granted!');
        playBeep('success');
        setMessage('Entry Confirmed! Guest may proceed.');
        setScanResult('already_used');
        setTicket(data.ticket);
      } else {
        toast.error(data.message);
        playBeep('error');
        setMessage(data.message);
      }
    } catch (error) {
      toast.error('Failed to register entry.');
    }
    setProcessing(false);
  };

  const getStatusColor = () => {
    switch (scanResult) {
      case 'valid': return 'from-green-500 to-green-600 shadow-green-500/20';
      case 'invalid': return 'from-red-500 to-red-600 shadow-red-500/20';
      case 'already_used': return 'from-blue-500 to-blue-600 shadow-blue-500/20';
      case 'cancelled': return 'from-gray-600 to-gray-700 shadow-gray-500/20';
      case 'wrong_gate': return 'from-orange-500 to-orange-600 shadow-orange-500/20';
      default: return 'from-navratri-primary to-navratri-text shadow-navratri-primary/20';
    }
  };

  const getStatusIcon = () => {
    switch (scanResult) {
      case 'valid': return <CheckCircle2 className="w-16 h-16 text-white drop-shadow-md" />;
      case 'invalid': return <XCircle className="w-16 h-16 text-white drop-shadow-md" />;
      case 'already_used': return <CheckCircle2 className="w-16 h-16 text-white drop-shadow-md" />; // Using check for used because it's technically valid just already redeemed
      case 'cancelled': return <Ban className="w-16 h-16 text-white drop-shadow-md" />;
      case 'wrong_gate': return <AlertOctagon className="w-16 h-16 text-white drop-shadow-md" />;
      default: return <QrCode className="w-16 h-16 text-white drop-shadow-md" />;
    }
  };

  return (
    <div className="min-h-screen bg-navratri-bg font-sans pb-20 selection:bg-navratri-accent selection:text-white">
      
      {/* Scanner Header */}
      <div className="bg-navratri-primary text-white sticky top-0 z-30 shadow-sm border-b border-navratri-lightGrey/10">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-navratri-accent" />
            <h1 className="text-[18px] font-display font-[700] tracking-tight">Access Control</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/50" />}
            </button>
            <button onClick={() => router.push('/staff/login')} className="flex items-center gap-2 text-[12px] font-[600] text-white/70 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-[8px] border border-white/10 hover:bg-white/20">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        
        {/* Gate Selection */}
        <div className="bg-white rounded-[16px] p-4 shadow-sm border border-navratri-lightGrey mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest font-[700] text-navratri-muted mb-1">Assigned Gate</label>
            <select value={gateName} onChange={(e) => setGateName(e.target.value)} className="w-full bg-transparent font-[700] text-[15px] text-navratri-text focus:outline-none appearance-none cursor-pointer">
              <option>Main Entrance A</option>
              <option>Main Entrance B</option>
              <option>VIP Gate 1</option>
              <option>VIP Gate 2</option>
              <option>Artists & Crew</option>
            </select>
          </div>
          <div className="w-10 h-10 bg-navratri-bg rounded-[12px] flex items-center justify-center shrink-0 border border-navratri-lightGrey">
            <MapPin className="w-5 h-5 text-navratri-accent" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {scanResult === 'idle' || scanResult === 'scanning' ? (
            <motion.div key="scanner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              
              {cameraError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[700] text-sm">{cameraError}</p>
                    <button onClick={startScanner} className="mt-2 text-xs font-[700] bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200">
                      Retry Camera
                    </button>
                  </div>
                </div>
              )}

              <div id="qr-reader" className="rounded-card overflow-hidden shadow-sm border border-navratri-lightGrey bg-black w-full min-h-[300px] flex items-center justify-center relative">
                {scanResult === 'scanning' && !cameraError && (
                  <div className="absolute inset-0 border-4 border-navratri-accent/50 z-10 pointer-events-none rounded-card">
                    <div className="absolute top-0 left-0 w-full h-1 bg-navratri-accent shadow-[0_0_15px_rgba(224,36,84,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                )}
                {verifying && (
                  <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm rounded-card">
                    <Loader2 className="w-10 h-10 text-navratri-accent animate-spin mb-4" />
                    <p className="text-white font-[700] tracking-widest uppercase text-sm animate-pulse">Verifying Pass...</p>
                  </div>
                )}
              </div>
              
              {scanResult === 'scanning' && !cameraError && !verifying && (
                <p className="text-center text-[12px] font-[700] text-navratri-accent animate-pulse tracking-widest uppercase mt-4">Aim camera at Ticket QR Code</p>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              
              {/* Result Status Card */}
              <div className={`bg-gradient-to-br ${getStatusColor()} rounded-card p-8 text-center text-white shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-4">{getStatusIcon()}</div>
                  <h2 className="text-[28px] font-display font-[700] mb-2 tracking-tight">
                    {scanResult === 'valid' && 'Access Granted'}
                    {scanResult === 'invalid' && 'Access Denied'}
                    {scanResult === 'already_used' && 'Already Checked In'}
                    {scanResult === 'cancelled' && 'Pass Cancelled'}
                    {scanResult === 'wrong_gate' && 'Wrong Gate'}
                  </h2>
                  <p className="text-white/90 font-[500] text-[15px]">{message}</p>
                </div>
              </div>

              {/* Pass Details */}
              {ticket && (
                <div className="bg-white rounded-card p-6 shadow-sm border border-navratri-lightGrey space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-navratri-lightGrey">
                    <div>
                      <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700] mb-1">Pass ID</p>
                      <p className="font-mono font-[700] text-navratri-text">{ticket.ticketId || (ticket as any).id}</p>
                    </div>
                    <div className="px-3 py-1 bg-navratri-accent/10 text-navratri-accent rounded-full text-[10px] font-[700] uppercase tracking-widest border border-navratri-accent/10">
                      {ticket.ticketType || (ticket as any).passType}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-navratri-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700] mb-1">Guest Name</p>
                        <p className="font-[700] text-navratri-text text-[15px]">{ticket.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Ticket className="w-5 h-5 text-navratri-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700] mb-1">Event</p>
                        <p className="font-[700] text-navratri-text text-[14px] line-clamp-1">{ticket.eventName}</p>
                      </div>
                    </div>
                    {(ticket as any).entryTime && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700] mb-1">Time of Entry</p>
                          <p className="font-[700] text-navratri-text text-[14px]">{new Date((ticket as any).entryTime).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {scanResult === 'valid' && ticket && !ticket.checkedIn && (
                <button
                  onClick={handleAllowEntry}
                  disabled={processing}
                  className="w-full bg-green-500 text-white font-[700] py-4 rounded-button flex items-center justify-center gap-2 text-[15px] shadow-sm hover:-translate-y-0.5 hover:bg-green-600 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {processing ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Registering...</>
                  ) : (
                    <><ShieldCheck className="w-5 h-5" /> Confirm Entry</>
                  )}
                </button>
              )}

              <button onClick={startScanner} className="w-full bg-white border border-navratri-lightGrey text-navratri-text font-[700] py-4 rounded-button flex items-center justify-center gap-2 text-[15px] hover:bg-navratri-bg hover:-translate-y-0.5 shadow-sm transition-all">
                <RotateCcw className="w-5 h-5" /> Scan Another Pass
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Session Stats */}
        <div className="mt-8">
          <h3 className="text-[11px] font-[700] text-navratri-muted mb-4 uppercase tracking-widest text-center flex items-center justify-center gap-2"><Clock className="w-3.5 h-3.5" /> Live Gate Statistics</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-[16px] p-3 text-center shadow-sm border border-navratri-lightGrey">
              <p className="text-[20px] font-display font-[700] text-navratri-text">{counts.total}</p>
              <p className="text-[9px] text-navratri-muted uppercase font-[700] tracking-widest mt-1">Total</p>
            </div>
            <div className="bg-green-50 rounded-[16px] p-3 text-center border border-green-100">
              <p className="text-[20px] font-display font-[700] text-green-600">{counts.valid}</p>
              <p className="text-[9px] text-green-600/70 uppercase font-[700] tracking-widest mt-1">Valid</p>
            </div>
            <div className="bg-red-50 rounded-[16px] p-3 text-center border border-red-100">
              <p className="text-[20px] font-display font-[700] text-red-600">{counts.invalid}</p>
              <p className="text-[9px] text-red-600/70 uppercase font-[700] tracking-widest mt-1">Invalid</p>
            </div>
            <div className="bg-blue-50 rounded-[16px] p-3 text-center border border-blue-100">
              <p className="text-[20px] font-display font-[700] text-blue-600">{counts.duplicate}</p>
              <p className="text-[9px] text-blue-600/70 uppercase font-[700] tracking-widest mt-1">Dupes</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

