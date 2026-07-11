'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, XCircle, LogOut, Camera, X, ScanLine, Clock, Ticket, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

type ScanResult = {
  status: 'valid' | 'used' | 'invalid' | 'wrong_event';
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
  const [staffName, setStaffName] = useState('Staff');
  const [gates, setGates] = useState<string[]>(['Main Entry']);
  const [events, setEvents] = useState<string[]>(['evt-ahmedabad-royal-garba']);
  
  const [selectedGate, setSelectedGate] = useState('Main Entry');
  const [selectedEvent, setSelectedEvent] = useState('evt-ahmedabad-royal-garba');
  
  const [isScanning, setIsScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<ScanStats>({ total: 0, vip: 0, regular: 0 });
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanRegionId = "qr-reader";

  useEffect(() => {
    // Load staff session data
    const name = localStorage.getItem('scanner_staff_name');
    if (name) setStaffName(name);
    
    const savedGates = localStorage.getItem('scanner_gates');
    if (savedGates) {
      try {
        const parsed = JSON.parse(savedGates);
        if (parsed.length > 0) {
          setGates(parsed);
          setSelectedGate(parsed[0]);
        }
      } catch (e) {}
    }

    const savedEvents = localStorage.getItem('scanner_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        if (parsed.length > 0) {
          setEvents(parsed);
          setSelectedEvent(parsed[0]);
        }
      } catch (e) {}
    }

    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchStats();
    }
  }, [selectedEvent]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/scan-stats?eventId=${selectedEvent}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          gateName: selectedGate,
          eventId: selectedEvent
        })
      });

      const data = await res.json();
      
      let result: ScanResult;

      if (data.success) {
        playSound('success');
        result = { status: 'valid', ticket: data.ticket, timestamp: new Date().toISOString() };
        
        // Update stats locally
        setStats(prev => ({
          total: prev.total + 1,
          vip: prev.vip + (data.ticket.ticketType?.toLowerCase().includes('vip') ? 1 : 0),
          regular: prev.regular + (data.ticket.ticketType?.toLowerCase().includes('vip') ? 0 : 1)
        }));

      } else if (data.code === 'ALREADY_USED') {
        playSound('error');
        result = { status: 'used', ticket: data.ticket, message: data.message, timestamp: new Date().toISOString() };
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
        <div className="fixed inset-0 bg-green-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-[900] tracking-tight mb-2">Entry Approved</h1>
          <p className="text-xl font-[600] opacity-90 mb-10">Pass successfully scanned.</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm space-y-4 text-left border border-white/20">
            <div>
              <p className="text-green-100 text-xs font-[700] uppercase tracking-wider mb-1">Customer Name</p>
              <p className="font-[800] text-2xl">{scanResult.ticket?.customerName}</p>
            </div>
            <div>
              <p className="text-green-100 text-xs font-[700] uppercase tracking-wider mb-1">Pass Type</p>
              <p className="font-[800] text-xl">{scanResult.ticket?.ticketType}</p>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/20">
              <div>
                <p className="text-green-100 text-[10px] font-[700] uppercase tracking-wider mb-1">Booking ID</p>
                <p className="font-mono font-[800] text-lg">{scanResult.ticket?.bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-[10px] font-[700] uppercase tracking-wider mb-1">Gate</p>
                <p className="font-[800] text-lg">{selectedGate}</p>
              </div>
            </div>
            <div>
                <p className="text-green-100 text-[10px] font-[700] uppercase tracking-wider mb-1 mt-2">Scan Time</p>
                <p className="font-[600] text-sm">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          
          <button onClick={dismissResult} className="mt-12 bg-white text-green-600 px-10 py-5 rounded-2xl font-[900] text-xl shadow-2xl active:scale-95 transition-transform w-full max-w-sm">
            Scan Next Pass
          </button>
        </div>
      );
    }

    if (scanResult.status === 'used') {
      return (
        <div className="fixed inset-0 bg-[#E53935] z-50 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-[900] tracking-tight mb-2">Ticket Already Used</h1>
          <p className="text-xl font-[600] opacity-90 mb-10">This pass has already been scanned.</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm space-y-4 text-left border border-white/20">
            <div>
              <p className="text-red-200 text-xs font-[700] uppercase tracking-wider mb-1">Customer</p>
              <p className="font-[800] text-2xl">{scanResult.ticket?.customerName}</p>
            </div>
            <div>
              <p className="text-red-200 text-xs font-[700] uppercase tracking-wider mb-1">Booking ID</p>
              <p className="font-mono font-[800] text-xl">{scanResult.ticket?.bookingId}</p>
            </div>
          </div>
          
          <button onClick={dismissResult} className="mt-12 bg-white text-[#E53935] px-10 py-5 rounded-2xl font-[900] text-xl shadow-2xl active:scale-95 transition-transform w-full max-w-sm">
            Dismiss
          </button>
        </div>
      );
    }

    if (scanResult.status === 'wrong_event') {
      return (
        <div className="fixed inset-0 bg-orange-600 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-[900] tracking-tight mb-2">Wrong Event</h1>
          <p className="text-xl font-[600] opacity-90 mb-10">This pass is not for the current event.</p>
          
          <button onClick={dismissResult} className="mt-12 bg-white text-orange-600 px-10 py-5 rounded-2xl font-[900] text-xl shadow-2xl active:scale-95 transition-transform w-full max-w-sm">
            Dismiss
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-[#111111] z-50 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-28 h-28 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-20 h-20 text-[#E53935]" />
        </div>
        <h1 className="text-5xl font-[900] tracking-tight mb-2 text-[#E53935]">Invalid Ticket</h1>
        <p className="text-xl font-[600] text-gray-400 mb-10">{scanResult.message || 'This pass is not recognized.'}</p>
        
        <button onClick={dismissResult} className="mt-12 bg-[#E53935] text-white px-10 py-5 rounded-2xl font-[900] text-xl shadow-2xl active:scale-95 transition-transform w-full max-w-sm">
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col w-full">
      {/* Dedicated Header */}
      <header className="bg-[#111111] text-white px-4 py-4 flex flex-col shadow-md z-10 w-full relative shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-[900] text-xl flex items-center gap-2 tracking-tight">
            <ScanLine className="w-6 h-6 text-[#E53935]" /> RaasPass Scanner
          </h1>
          <button onClick={handleLogout} className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white flex items-center gap-2 text-sm font-[600] pr-4">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="bg-transparent border-b border-gray-700 text-white text-sm font-[700] py-1 outline-none w-full"
            >
              {events.map(ev => <option key={ev} value={ev} className="text-black">{ev}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="bg-transparent border-b border-gray-700 text-white text-sm font-[700] py-1 outline-none w-full"
            >
              {gates.map(gate => <option key={gate} value={gate} className="text-black">{gate}</option>)}
            </select>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-[600]">
          Staff: {staffName}
        </div>
      </header>

      {/* Live Stats */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2 shrink-0 overflow-x-auto hide-scrollbar">
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 shrink-0">
          <p className="text-[10px] uppercase font-[800] text-gray-400 tracking-wider">Today's Check-ins</p>
          <p className="text-xl font-[900] text-[#111111]">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2 shrink-0">
          <p className="text-[10px] uppercase font-[800] text-yellow-600 tracking-wider">VIP</p>
          <p className="text-xl font-[900] text-yellow-800">{stats.vip}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 shrink-0">
          <p className="text-[10px] uppercase font-[800] text-blue-600 tracking-wider">Regular</p>
          <p className="text-xl font-[900] text-blue-800">{stats.regular}</p>
        </div>
      </div>

      {/* Dominant Full-Width Scanner */}
      <div className="flex-1 bg-black relative flex flex-col justify-center overflow-hidden">
        {isScanning ? (
          <>
            <div id="qr-reader" className="w-full h-full object-cover"></div>
            {processing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20">
                <div className="w-16 h-16 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-[900] text-xl mt-4">Verifying Pass...</p>
              </div>
            )}
            <button 
              onClick={stopScanner}
              className="absolute top-6 right-6 bg-black/50 text-white p-3 rounded-full backdrop-blur-md z-30"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
              <div className="bg-black/50 backdrop-blur-md text-white px-6 py-2 rounded-full font-[600] text-sm">
                Point camera at QR code
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-[900] text-white mb-2">Scanner Ready</h3>
            <p className="text-gray-400 font-[500] mb-8 text-lg">Tap below to open camera</p>
            <button 
              onClick={startScanner}
              className="bg-[#E53935] text-white px-10 py-5 rounded-2xl font-[900] text-xl shadow-[0_0_40px_rgba(229,57,53,0.3)] hover:bg-[#D32F2F] active:scale-95 transition-all flex items-center gap-3 w-full max-w-sm justify-center"
            >
              <ScanLine className="w-7 h-7" /> Start Scanning
            </button>
          </div>
        )}
      </div>

      {/* Recent Scans */}
      <div className="bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 z-10 max-h-[30vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-md">
          <h3 className="text-sm font-[800] text-[#111111] flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Recent Scans
          </h3>
        </div>
        <div className="p-2 space-y-2">
          {recentScans.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 font-[500]">No passes scanned yet.</p>
            </div>
          ) : (
            recentScans.map((scan, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  {scan.status === 'valid' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : scan.status === 'used' ? (
                    <XCircle className="w-6 h-6 text-[#E53935]" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  )}
                  <div>
                    <p className="font-[800] text-sm text-[#111111] leading-tight">
                      {scan.ticket?.customerName || 'Unknown Pass'}
                    </p>
                    <p className="text-[10px] font-[600] text-gray-500 uppercase tracking-widest mt-0.5">
                      {scan.ticket?.ticketType || scan.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-[700] text-[#111111]">
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
