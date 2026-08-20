'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, LogOut, CheckCircle, XCircle, Camera, Calendar, Ticket, X, Clock, AlertTriangle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type ScanResult = {
  status: 'valid' | 'used' | 'invalid' | 'wrong_event' | 'wrong_gate';
  ticket?: any;
  message?: string;
  timestamp: string;
};

type ScanStats = {
  total: number;
  vip: number;
  regular: number;
};

export default function ScannerDashboard() {
  const router = useRouter();
  const [staffName, setStaffName] = useState('Staff Member');
  const [gates, setGates] = useState<{id: string, name: string}[]>([]);
  const [events, setEvents] = useState<{id: string, name: string}[]>([]);
  
  const [selectedGateId, setSelectedGateId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanRegionId = "qr-reader";

  useEffect(() => {
    const name = localStorage.getItem('scanner_staff_name');
    if (name) setStaffName(name);

    // Fetch available events (for demo, just query the API which returns DEMO_EVENTS)
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/get-events');
        const data = await res.json();
        if (data.success && data.events && data.events.length > 0) {
          const loadedEvents = data.events.map((e: any) => ({ id: e.id, name: e.title || e.name }));
          setEvents(loadedEvents);
          
          const savedEvent = localStorage.getItem('scanner_event_id');
          const initialEvent = loadedEvents.find((e: any) => e.id === savedEvent) ? savedEvent : loadedEvents[0].id;
          setSelectedEventId(initialEvent);
        }
      } catch (e) {
        console.error('Failed to load events', e);
      }
    };
    loadEvents();

    return () => {
      stopScanner();
    };
  }, []);

  const [stats, setStats] = useState({ total: 0, checkedIn: 0, remaining: 0, vip: 0, regular: 0 });

  // Update gates when event changes
  useEffect(() => {
    if (!selectedEventId) return;
    localStorage.setItem('scanner_event_id', selectedEventId);

    const loadGates = async () => {
      try {
        const res = await fetch(`/api/get-events?id=${selectedEventId}`);
        const data = await res.json();
        if (data.success && data.event) {
          const eventGates = data.event.gates || [{ id: 'gate_default', name: 'Main Entry' }];
          setGates(eventGates);
          
          const savedGate = localStorage.getItem('scanner_gate_id');
          const initialGate = eventGates.find((g: any) => g.id === savedGate) ? savedGate : eventGates[0].id;
          setSelectedGateId(initialGate);
        }
      } catch (e) {}
    };
    loadGates();

    // Real-time listener for the event tickets
    import('@/lib/firebase').then(({ db }) => {
      import('firebase/firestore').then(({ collection, query, where, onSnapshot }) => {
        const q = query(collection(db, 'tickets'), where('eventId', '==', selectedEventId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let total = 0, checkedIn = 0, vip = 0, regular = 0;
          
          snapshot.forEach((doc) => {
            const t = doc.data();
            total++;
            
            const isUsed = t.checkedIn === true || t.status === 'used';
            if (isUsed) {
              checkedIn++;
              const type = (t.ticketType || '').toLowerCase();
              if (type.includes('vip') || type.includes('gold')) {
                vip++;
              } else {
                regular++;
              }
            }
          });

          setStats({
            total,
            checkedIn,
            remaining: total - checkedIn,
            vip,
            regular
          });
        });
        
        // Save unsubscribe to cleanup later if needed, but here it's fine
        // Actually, we should clean up if eventId changes
        return () => unsubscribe();
      });
    });
  }, [selectedEventId]);

  const playSound = (type: 'success' | 'error') => {
    try {
      const audio = new Audio(type === 'success' ? '/success.mp3' : '/error.mp3');
      audio.play().catch(e => {});
    } catch (e) {}
  };

  const startScanner = async () => {
    if (scannerRef.current) return;

    try {
      setIsScanning(true);
      const html5QrCode = new Html5Qrcode(scanRegionId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast.error("Could not start camera.");
      setIsScanning(false);
      scannerRef.current = null;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {}
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (processing) return;
    setProcessing(true);
    
    if (scannerRef.current) {
      scannerRef.current.pause(true);
    }

    try {
      const res = await fetch('/api/scan-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qrValue: decodedText, 
          gateId: selectedGateId,
          eventId: selectedEventId
        })
      });

      const data = await res.json();
      
      let result: ScanResult;

      if (data.success) {
        playSound('success');
        result = { status: 'valid', ticket: data.ticket, timestamp: new Date().toISOString() };
        
        setStats(prev => ({
          total: prev.total + 1,
          vip: prev.vip + (data.ticket.ticketType?.toLowerCase().includes('vip') ? 1 : 0),
          regular: prev.regular + (data.ticket.ticketType?.toLowerCase().includes('vip') ? 0 : 1)
        }));

      } else if (data.code === 'ALREADY_USED') {
        playSound('error');
        result = { status: 'used', ticket: data.ticket, message: data.message, timestamp: new Date().toISOString() };
      } else if (data.code === 'WRONG_GATE') {
        playSound('error');
        result = { status: 'wrong_gate', message: `Wrong Gate – Please go to ${data.ticket?.correctGate || 'the assigned gate'}`, ticket: data.ticket, timestamp: new Date().toISOString() };
      } else if (data.code === 'WRONG_EVENT') {
        playSound('error');
        result = { status: 'wrong_event', message: data.message, timestamp: new Date().toISOString() };
      } else {
        playSound('error');
        result = { status: 'invalid', message: data.message || 'Invalid Ticket', timestamp: new Date().toISOString() };
      }

      setScanResult(result);
      setRecentScans(prev => [result, ...prev].slice(0, 10));

      if (result.status === 'valid') {
        setTimeout(() => dismissResult(), 3000);
      }

    } catch (error) {
      toast.error('Network error during scan');
      if (scannerRef.current) scannerRef.current.resume();
    } finally {
      setProcessing(false);
    }
  };

  const onScanFailure = (error: any) => {};

  const dismissResult = () => {
    setScanResult(null);
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('scanner_staff_name');
    router.push('/scan/login');
  };

  if (scanResult) {
    if (scanResult.status === 'valid') {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-green-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center selection:bg-white/20 selection:text-white"
        >
          <motion.div 
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(255,255,255,0.2)]"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-[40px] font-display font-[850] tracking-tight mb-2">Entry Approved</h1>
          <p className="text-[18px] font-[500] opacity-90 mb-10">Pass successfully scanned.</p>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.2 }}
            className="bg-black/20 backdrop-blur-md rounded-[24px] p-6 w-full max-w-sm space-y-4 text-left border border-white/25 shadow-2xl"
          >
            <div>
              <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Customer Name</p>
              <p className="font-display font-[800] text-[24px]">{scanResult.ticket?.customerName}</p>
            </div>
            <div>
              <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Pass Type</p>
              <p className="font-display font-[800] text-[20px]">{scanResult.ticket?.ticketType}</p>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/20">
              <div>
                <p className="text-white/70 text-[10px] font-[800] uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-mono font-[800] text-[16px]">{scanResult.ticket?.bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-[10px] font-[800] uppercase tracking-widest mb-1">Gate</p>
                <p className="font-[800] text-[16px]">{gates.find(g => g.id === selectedGateId)?.name || selectedGateId}</p>
              </div>
            </div>
            <div>
                <p className="text-white/70 text-[10px] font-[800] uppercase tracking-widest mb-1 mt-2">Scan Time</p>
                <p className="font-[500] text-[14px]">{new Date().toLocaleTimeString()}</p>
            </div>
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            onClick={dismissResult} className="mt-12 bg-white text-green-600 px-10 py-4 rounded-xl font-[800] text-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full max-w-sm"
          >
            Scan Next Pass
          </motion.button>
        </motion.div>
      );
    }

    if (scanResult.status === 'used') {
      return (
        <div className="fixed inset-0 bg-red-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center selection:bg-white/20 selection:text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(255,255,255,0.2)]">
            <XCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-[40px] font-display font-[850] tracking-tight mb-2">Ticket Already Used</h1>
          <p className="text-[18px] font-[500] opacity-90 mb-10">This pass has already been scanned.</p>
          
          <div className="bg-black/20 backdrop-blur-md rounded-[24px] p-6 w-full max-w-sm space-y-4 text-left border border-white/25 shadow-2xl">
            <div>
              <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Customer</p>
              <p className="font-display font-[800] text-[24px]">{scanResult.ticket?.customerName}</p>
            </div>
            <div>
              <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Booking ID</p>
              <p className="font-mono font-[800] text-[20px]">{scanResult.ticket?.bookingId}</p>
            </div>
          </div>
          
          <button onClick={dismissResult} className="mt-12 bg-white text-red-600 px-10 py-4 rounded-xl font-[800] text-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full max-w-sm">
            Dismiss Alert
          </button>
        </div>
      );
    }

    if (scanResult.status === 'wrong_event') {
      return (
        <div className="fixed inset-0 bg-yellow-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center selection:bg-white/20 selection:text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(255,255,255,0.2)]">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-[40px] font-display font-[850] tracking-tight mb-2">Wrong Event</h1>
          <p className="text-[18px] font-[500] opacity-90 mb-10">This pass is not configured for the current event.</p>
          
          <button onClick={dismissResult} className="mt-12 bg-white text-yellow-600 px-10 py-4 rounded-xl font-[800] text-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full max-w-sm">
            Dismiss
          </button>
        </div>
      );
    }

    if (scanResult.status === 'wrong_gate') {
      return (
        <div className="fixed inset-0 bg-yellow-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center selection:bg-white/20 selection:text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(255,255,255,0.2)]">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-[40px] font-display font-[850] tracking-tight mb-2">Wrong Gate</h1>
          <p className="text-[18px] font-[500] opacity-90 mb-10">{scanResult.message}</p>
          
          <div className="bg-black/20 backdrop-blur-md rounded-[24px] p-6 w-full max-w-sm space-y-4 text-left border border-white/25 shadow-2xl">
            <div>
              <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Customer</p>
              <p className="font-display font-[800] text-[24px]">{scanResult.ticket?.customerName}</p>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/20">
               <div>
                  <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Pass Type</p>
                  <p className="font-display font-[800] text-[16px]">{scanResult.ticket?.ticketType}</p>
               </div>
               <div className="text-right">
                  <p className="text-white/70 text-[11px] font-[800] uppercase tracking-widest mb-1">Correct Gate</p>
                  <p className="font-display font-[800] text-[16px]">{scanResult.ticket?.correctGate || 'N/A'}</p>
               </div>
            </div>
          </div>
          
          <button onClick={dismissResult} className="mt-12 bg-white text-yellow-600 px-10 py-4 rounded-xl font-[800] text-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full max-w-sm">
            Dismiss
          </button>
        </div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-red-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center selection:bg-white/20 selection:text-white"
      >
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/25">
          <XCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-[40px] font-display font-[850] tracking-tight mb-2 text-white">Invalid Ticket</h1>
        <p className="text-[18px] font-[500] text-white/90 mb-10">{scanResult.message || 'This pass is not recognized.'}</p>
        
        <button onClick={dismissResult} className="mt-12 bg-white text-red-600 px-10 py-4 rounded-xl font-[800] text-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full max-w-sm">
          Dismiss
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col w-full selection:bg-[#00E5FF] selection:text-white">
      {/* Dedicated Header */}
      <header className="bg-gradient-to-b from-[#0F172A] to-[#1E1B4B] text-white px-4 py-4 flex flex-col shadow-premium z-10 w-full relative shrink-0 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-[800] text-[22px] flex items-center gap-2 tracking-tight">
            <ScanLine className="w-6 h-6 text-[#00E5FF] animate-pulse" /> RaasPass Scanner
          </h1>
          <button onClick={handleLogout} className="px-3.5 py-2 bg-white/10 rounded-[12px] text-white/80 hover:text-white hover:bg-white/20 flex items-center gap-2 text-[12px] font-[700] transition-all border border-white/10">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 bg-white/5 px-3.5 py-2.5 rounded-[12px] border border-white/10">
            <Calendar className="w-4 h-4 text-[#FF4D6D]" />
            <select 
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-transparent text-white text-[14px] font-[700] py-1 outline-none w-full cursor-pointer"
            >
              {events.map(ev => <option key={ev.id} value={ev.id} className="text-black">{ev.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2.5 bg-white/5 px-3.5 py-2.5 rounded-[12px] border border-white/10">
            <Ticket className="w-4 h-4 text-[#00E5FF]" />
            <select 
              value={selectedGateId}
              onChange={(e) => {
                setSelectedGateId(e.target.value);
                localStorage.setItem('scanner_gate_id', e.target.value);
              }}
              className="bg-transparent text-white text-[14px] font-[700] py-1 outline-none w-full cursor-pointer"
            >
              {gates.map(gate => <option key={gate.id} value={gate.id} className="text-black">{gate.name}</option>)}
            </select>
          </div>
        </div>
        <div className="absolute top-5 right-4 text-[10px] text-white/40 font-[800] uppercase tracking-widest mt-10 pointer-events-none">
          Staff: {staffName}
        </div>
      </header>

      {/* Live Stats */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 flex gap-3 shrink-0 overflow-x-auto hide-scrollbar sticky top-0 z-20 shadow-lg">
        <div className="bg-slate-800 border border-slate-700 rounded-[18px] px-5 py-3.5 shrink-0 flex-1 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
          <p className="text-[10px] uppercase font-[800] text-slate-400 tracking-widest mb-1">Checked In</p>
          <p className="text-[22px] font-display font-[800] text-white">{stats.checkedIn}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-[18px] px-5 py-3.5 shrink-0 flex-1 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>
          <p className="text-[10px] uppercase font-[800] text-slate-400 tracking-widest mb-1">Remaining</p>
          <p className="text-[22px] font-display font-[800] text-white">{stats.remaining}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-[18px] px-5 py-3.5 shrink-0 flex-1 text-center shadow-sm">
          <p className="text-[10px] uppercase font-[800] text-slate-400 tracking-widest mb-1">Total</p>
          <p className="text-[22px] font-display font-[800] text-white">{stats.total}</p>
        </div>
      </div>

      {/* Dominant Full-Width Scanner */}
      <div className="flex-1 bg-black relative flex flex-col justify-center overflow-hidden">
        {isScanning ? (
          <>
            <div id="qr-reader" className="w-full h-full object-cover"></div>
            
            {/* Animated Scan Line Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center p-6">
              <div className="w-64 h-64 relative">
                {/* Corner frames */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00E5FF] rounded-br-xl"></div>
                
                {/* Scanning Laser Line */}
                <motion.div 
                  animate={{ y: ["0%", "100%", "0%"] }} 
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="w-full h-0.5 bg-[#00E5FF] shadow-[0_0_12px_2px_#00E5FF] absolute top-0 left-0" 
                />
              </div>
            </div>
            {processing && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                <div className="w-16 h-16 border-4 border-navratri-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-display font-[800] text-[20px] mt-4">Verifying Pass...</p>
              </div>
            )}
            <button 
              onClick={stopScanner}
              className="absolute top-6 right-6 bg-white/10 text-white p-3 rounded-full backdrop-blur-md z-30 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full font-[600] text-[13px] border border-white/10">
                Point camera at QR code
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center mb-8">
              <Camera className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-[28px] font-display font-[800] text-white mb-2">Scanner Ready</h3>
            <p className="text-white/60 font-[500] mb-8 text-[15px]">Tap below to open camera</p>
            <button 
              onClick={startScanner}
              className="bg-gradient-premium text-white px-8 py-4 rounded-button font-[800] text-[15px] hover:shadow-premium active:scale-95 transition-all flex items-center justify-center gap-2 w-full max-w-[280px]"
            >
              <ScanLine className="w-5 h-5" /> Start Scanning
            </button>
          </div>
        )}
      </div>

      {/* Recent Scans */}
      <div className="bg-slate-900 shrink-0 border-t border-slate-800 z-10 max-h-[30vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <h3 className="text-[12px] font-[800] text-white flex items-center gap-2 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-[#00E5FF] animate-pulse" /> Recent Scans
          </h3>
        </div>
        <div className="p-3 space-y-2">
          {recentScans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[14px] text-slate-500 font-[500]">No passes scanned yet.</p>
            </div>
          ) : (
            recentScans.map((scan, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-[18px] bg-slate-800 border border-slate-700">
                <div className="flex items-center gap-3">
                  {scan.status === 'valid' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  ) : scan.status === 'used' ? (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-[800] text-[14px] text-white leading-tight truncate max-w-[180px]">
                      {scan.ticket?.customerName || 'Unknown Pass'}
                    </p>
                    <p className="text-[10px] font-[800] text-slate-400 uppercase tracking-widest mt-0.5">
                      {scan.ticket?.ticketType || scan.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-[700] text-slate-400">
                    {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
