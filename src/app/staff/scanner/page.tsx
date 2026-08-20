'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, XCircle, AlertTriangle, QrCode, RotateCcw, ShieldCheck, User, Ticket, Clock, Ban, LogOut, MapPin, Loader2, Volume2, VolumeX, AlertOctagon } from 'lucide-react';
import type { Ticket as TicketType } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

  const checkGateMatch = (ticket: any, currentGate: string) => {
    if (!ticket.gateRestriction) return true;
    return ticket.gateName === currentGate;
  };

  const handleScanResult = async (decodedText: string) => {
    try {
      let ticketId = '';
      let token = '';

      // 1. Try parsing as JSON
      try {
        const payload = JSON.parse(decodedText);
        if (payload.p && payload.s) {
          // Demo format: {"p":"{\"v\":1,\"ticketId\":\"...\"}","s":"..."}
          const pObj = typeof payload.p === 'string' ? JSON.parse(payload.p) : payload.p;
          ticketId = pObj.ticketId;
          token = payload.s;
        } else {
          // Standard format: {"ticketId":"...","token":"..."}
          ticketId = payload.ticketId;
          token = payload.token;
        }
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
        body: JSON.stringify({ ticketId, token, gateName }),
      });

      const data = await res.json();
      setTicket(data.ticket || null);
      
      stopScanner(); // Stop camera only after we get a response to display result full screen
      setVerifying(false);
      
      if (data.status === 'valid') {
        const isCorrectGate = checkGateMatch(data.ticket, gateName);
        
        if (!isCorrectGate) {
          playBeep('error');
          setScanResult('wrong_gate');
          setMessage(`Wrong Gate – Please go to ${data.ticket.gateName || 'the assigned gate'}`);
          setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
        } else {
          playBeep('success');
          setScanResult('valid');
          setMessage('Ticket is Valid. Ready for Check-in.');
          setCounts(prev => ({ ...prev, total: prev.total + 1, valid: prev.valid + 1 }));
        }
      } else if (data.status === 'wrong_gate') {
        playBeep('error');
        setScanResult('wrong_gate');
        setMessage(data.message || `Wrong Gate – Please go to ${data.ticket?.gateName || 'the assigned gate'}`);
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
      } else if (data.status === 'already_used') {
        playBeep('error');
        setScanResult('already_used');
        setMessage(data.message || 'ALREADY_USED');
        setCounts(prev => ({ ...prev, total: prev.total + 1, duplicate: prev.duplicate + 1 }));
      } else if (data.status === 'cancelled') {
        playBeep('error');
        setScanResult('cancelled');
        setMessage(data.message || 'CANCELLED');
        setCounts(prev => ({ ...prev, total: prev.total + 1, invalid: prev.invalid + 1 }));
      } else {
        playBeep('error');
        setScanResult('invalid');
        
        const reasonMap: Record<string, string> = {
          'EVENT_MISMATCH': 'EVENT_MISMATCH (Wrong Event)',
          'WRONG_GATE': 'WRONG_GATE (Incorrect Entry Point)',
          'BOOKING_NOT_CONFIRMED': 'BOOKING_NOT_CONFIRMED',
          'PAYMENT_NOT_PAID': 'PAYMENT_NOT_PAID',
          'INVALID_SIGNATURE': 'INVALID_SIGNATURE (Counterfeit QR)',
          'TICKET_NOT_FOUND': 'TICKET_NOT_FOUND'
        };
        
        setMessage(reasonMap[data.message] || data.message || 'Counterfeit or Invalid Ticket.');
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
      case 'valid': return 'from-green-500 to-green-600 shadow-green-500/30';
      case 'invalid': return 'from-red-500 to-red-600 shadow-red-500/30';
      case 'already_used': return 'from-red-500 to-red-600 shadow-red-500/30';
      case 'cancelled': return 'from-gray-600 to-gray-700 shadow-gray-500/30';
      case 'wrong_gate': return 'from-yellow-500 to-yellow-600 shadow-yellow-500/30';
      case 'expired': return 'from-slate-500 to-slate-600 shadow-slate-500/30';
      default: return 'from-slate-800 to-slate-900 shadow-slate-900/30';
    }
  };

  const getStatusIcon = () => {
    switch (scanResult) {
      case 'valid': return <CheckCircle2 className="w-16 h-16 text-white drop-shadow-md" />;
      case 'invalid': return <XCircle className="w-16 h-16 text-white drop-shadow-md" />;
      case 'already_used': return <CheckCircle2 className="w-16 h-16 text-white drop-shadow-md" />; // Using check for used because it's technically valid just already redeemed
      case 'cancelled': return <Ban className="w-16 h-16 text-white drop-shadow-md" />;
      case 'wrong_gate': return <AlertOctagon className="w-16 h-16 text-white drop-shadow-md" />;
      case 'expired': return <Clock className="w-16 h-16 text-white drop-shadow-md" />;
      default: return <QrCode className="w-16 h-16 text-white drop-shadow-md" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans pb-20 selection:bg-[#00E5FF] selection:text-white">
      
      {/* Scanner Header */}
      <div className="bg-slate-900/90 text-white sticky top-0 z-30 shadow-premium border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
            <h1 className="text-[18px] font-display font-[800] tracking-tight">Access Control</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-700">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00E5FF]" /> : <VolumeX className="w-4 h-4 text-white/50" />}
            </button>
            <button onClick={() => router.push('/staff/login')} className="flex items-center gap-2 text-[12px] font-[600] text-white hover:text-[#00E5FF] transition-colors bg-slate-800 px-3.5 py-2 rounded-full border border-slate-700 hover:bg-slate-700">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        
        {/* Gate Selection */}
        <div className="bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-800 mb-6 flex items-center justify-between gap-4 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-2xl -z-10"></div>
          <div className="flex-1 relative z-10">
            <label className="block text-[11px] uppercase tracking-widest font-[800] text-slate-500 mb-1.5">Assigned Gate</label>
            <select value={gateName} onChange={(e) => setGateName(e.target.value)} className="w-full bg-transparent font-[700] text-[16px] text-white focus:outline-none appearance-none cursor-pointer">
              <option className="text-black">Main Entrance A</option>
              <option className="text-black">Main Entrance B</option>
              <option className="text-black">VIP Gate 1</option>
              <option className="text-black">Gate 3</option>
              <option className="text-black">Artists & Crew</option>
            </select>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-[14px] flex items-center justify-center shrink-0 border border-slate-700 group-hover:bg-slate-700 group-hover:shadow-sm transition-all relative z-10">
            <MapPin className="w-5 h-5 text-[#00E5FF]" />
          </div>
        </div>

        <div className="transition-all duration-300">
          {scanResult === 'idle' || scanResult === 'scanning' ? (
            <div key="scanner" className="space-y-6 animate-fade-in-up">
              
              {cameraError && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-[16px] border border-red-500/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-[700] text-[14px]">{cameraError}</p>
                    <button onClick={startScanner} className="mt-2 text-[12px] font-[700] bg-red-500/20 px-4 py-2 rounded-[10px] hover:bg-red-500/30 transition-colors">
                      Retry Camera
                    </button>
                  </div>
                </div>
              )}

              <div id="qr-reader" className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-black w-full min-h-[450px] flex items-center justify-center relative">
                {scanResult === 'scanning' && !cameraError && (
                  <div className="absolute inset-0 border-[6px] border-[#00E5FF]/20 z-10 pointer-events-none rounded-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                )}
                {verifying && (
                  <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center backdrop-blur-md rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 flex items-center justify-center mb-4">
                      <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
                    </div>
                    <p className="text-white font-[800] tracking-widest uppercase text-[12px] animate-pulse">Verifying Pass...</p>
                  </div>
                )}
              </div>
              
              {scanResult === 'scanning' && !cameraError && !verifying && (
                <div className="bg-navratri-primary/10 border border-navratri-primary/20 rounded-full px-6 py-3 mx-auto w-fit">
                  <p className="text-center text-[12px] font-[800] text-navratri-primary tracking-widest uppercase animate-pulse flex items-center gap-2">
                    <QrCode className="w-4 h-4" /> Aim camera at Ticket QR Code
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div key="result" className="space-y-6 animate-fade-in-up">
              
              {/* Result Status Card */}
              <div className={`bg-gradient-to-br ${getStatusColor()} rounded-[24px] p-8 text-center text-white shadow-premium relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">{getStatusIcon()}</div>
                  <h2 className="text-[28px] md:text-[32px] font-display font-[800] mb-2 tracking-tight">
                    {scanResult === 'valid' && 'Access Granted'}
                    {scanResult === 'invalid' && 'Access Denied'}
                    {scanResult === 'already_used' && 'Already Checked In'}
                    {scanResult === 'cancelled' && 'Pass Cancelled'}
                    {scanResult === 'wrong_gate' && 'Wrong Gate'}
                    {scanResult === 'expired' && 'Pass Expired'}
                  </h2>
                  <p className="text-white/90 font-[600] text-[16px]">{message}</p>
                </div>
              </div>

              {/* Pass Details */}
              {ticket && (
                <div className="bg-slate-900 rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-800 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-premium"></div>
                  <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1.5">Pass ID</p>
                      <p className="font-mono font-[700] text-white text-[15px]">{ticket.ticketId || (ticket as any).id}</p>
                    </div>
                    <div className="px-4 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] rounded-full text-[11px] font-[800] uppercase tracking-widest border border-[#00E5FF]/20">
                      {ticket.ticketType || (ticket as any).passType}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                        <User className="w-5 h-5 text-[#00E5FF]" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1">Guest Name</p>
                        <p className="font-[700] text-white text-[16px]">{ticket.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                        <Ticket className="w-5 h-5 text-[#00E5FF]" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1">Event</p>
                        <p className="font-[700] text-white text-[15px] line-clamp-1">{ticket.eventName}</p>
                      </div>
                    </div>

                    {/* Entry Count */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                        <User className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1">Entry Count</p>
                        <p className="font-[700] text-white text-[15px]">
                          {(() => {
                            const count = (ticket as any).entryCount || ((ticket.ticketType || '').toLowerCase().includes('couple') ? 2 : 1);
                            return `${count} ${count > 1 ? 'People' : 'Person'}`;
                          })()}
                        </p>
                      </div>
                    </div>

                    {/* Gate Assignment */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                        <MapPin className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1">Gate Assignment</p>
                        <p className="font-[700] text-white text-[15px]">
                          {(ticket as any).gateName ? `${(ticket as any).gateName}${(ticket as any).gateNumber ? ` (Gate ${(ticket as any).gateNumber})` : ''}` : 'No Gate Restriction'}
                        </p>
                      </div>
                    </div>

                    {/* Scan Timestamp */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                        <Clock className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1">Scan Time</p>
                        <p className="font-[700] text-white text-[15px]">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                      </div>
                    </div>

                    {(ticket as any).entryTime && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                          <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-[800] mb-1">Original Entry Time</p>
                          <p className="font-[700] text-white text-[15px]">{new Date((ticket as any).entryTime).toLocaleString('en-IN')}</p>
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
                  className="w-full bg-green-500 text-white font-[800] py-4 rounded-button flex items-center justify-center gap-2 text-[16px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-60 disabled:hover:translate-y-0 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  {processing ? (
                    <span className="relative z-10 flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Registering...</span>
                  ) : (
                    <span className="relative z-10 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Confirm Entry</span>
                  )}
                </button>
              )}

              <button onClick={startScanner} className="w-full bg-white border border-navratri-lightGrey text-navratri-text font-[800] py-4 rounded-button flex items-center justify-center gap-2 text-[16px] hover:bg-slate-50 hover:-translate-y-0.5 shadow-sm transition-all">
                <RotateCcw className="w-5 h-5 text-navratri-muted" /> Scan Another Pass
              </button>
            </div>
          )}
        </div>

        {/* Live Session Stats */}
        <div className="mt-10">
          <h3 className="text-[12px] font-[800] text-slate-400 mb-5 uppercase tracking-widest text-center flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-[#00E5FF]" /> Live Gate Statistics</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-900 rounded-[16px] p-4 text-center shadow-card border border-slate-800 hover:border-slate-700 transition-colors">
              <p className="text-[24px] font-display font-[800] text-white">{counts.total}</p>
              <p className="text-[10px] text-slate-500 uppercase font-[800] tracking-widest mt-1">Total</p>
            </div>
            <div className="bg-slate-900 rounded-[16px] p-4 text-center border border-slate-800 shadow-card hover:border-slate-700 transition-colors">
              <p className="text-[24px] font-display font-[800] text-green-500">{counts.valid}</p>
              <p className="text-[10px] text-green-500/70 uppercase font-[800] tracking-widest mt-1">Valid</p>
            </div>
            <div className="bg-slate-900 rounded-[16px] p-4 text-center border border-slate-800 shadow-card hover:border-slate-700 transition-colors">
              <p className="text-[24px] font-display font-[800] text-red-500">{counts.invalid}</p>
              <p className="text-[10px] text-red-500/70 uppercase font-[800] tracking-widest mt-1">Invalid</p>
            </div>
            <div className="bg-slate-900 rounded-[16px] p-4 text-center border border-slate-800 shadow-card hover:border-slate-700 transition-colors">
              <p className="text-[24px] font-display font-[800] text-blue-500">{counts.duplicate}</p>
              <p className="text-[10px] text-blue-500/70 uppercase font-[800] tracking-widest mt-1">Dupes</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

