'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, Ticket, CheckCircle2, Wifi, WifiOff, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);

  // 1. Fetch Events (once or real-time)
  useEffect(() => {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('status', 'in', ['published', 'draft', 'sold_out']));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const evts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(evts);
      if (evts.length > 0 && !selectedEventId) {
        setSelectedEventId(evts[0].id);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedEventId]);

  // 2. Real-time Listeners for the Selected Event
  useEffect(() => {
    if (!selectedEventId) return;
    setIsLive(false);

    // Listen to Tickets
    const ticketsQ = query(collection(db, 'tickets'), where('eventId', '==', selectedEventId));
    const unsubTickets = onSnapshot(ticketsQ, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLive(true);
    }, () => setIsLive(false));

    // Listen to Bookings (Orders)
    const bookingsQ = query(collection(db, 'orders'), where('eventId', '==', selectedEventId));
    const unsubBookings = onSnapshot(bookingsQ, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to Check-ins (Recent)
    const checkinsQ = query(
      collection(db, 'checkins'), 
      where('eventId', '==', selectedEventId),
      orderBy('scannedAt', 'desc'),
      limit(20)
    );
    const unsubCheckins = onSnapshot(checkinsQ, (snapshot) => {
      setCheckins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTickets();
      unsubBookings();
      unsubCheckins();
    };
  }, [selectedEventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-navratri-bg">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-accent" />
      </div>
    );
  }

  // Calculate Real-Time Stats
  const totalTickets = tickets.length;
  const validTickets = tickets.filter(t => t.status === 'valid').length;
  const checkedInTickets = tickets.filter(t => t.checkedIn === true || t.status === 'used').length;
  const remainingTickets = totalTickets - checkedInTickets;
  const revenue = bookings.reduce((sum, b) => sum + (b.totalAmount || b.grandTotal || b.amount || 0), 0);
  const checkinPercentage = totalTickets > 0 ? ((checkedInTickets / totalTickets) * 100).toFixed(1) : '0.0';

  // Calculate Gate-wise Stats
  const gateStats = tickets.reduce((acc: any, t) => {
    const gateId = t.gateId || 'unknown';
    const gateName = t.gateName || 'Assigned Gate';
    if (!acc[gateId]) acc[gateId] = { name: gateName, total: 0, checkedIn: 0 };
    acc[gateId].total += 1;
    if (t.checkedIn || t.status === 'used') acc[gateId].checkedIn += 1;
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto selection:bg-navratri-accent selection:text-white">
      
      {/* Header & Connection Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-display font-[800] text-navratri-text tracking-tight">Live Operations</h1>
          <div className="flex items-center gap-3 mt-2">
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[12px] font-[800] uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <Wifi className="w-3.5 h-3.5" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[12px] font-[800] uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                <WifiOff className="w-3.5 h-3.5" /> Offline
              </span>
            )}
            <p className="text-navratri-muted font-[500] text-[14px]">Real-time dashboard</p>
          </div>
        </div>

        {/* Event Selector */}
        <div className="bg-white px-4 py-2.5 rounded-[12px] border border-navratri-lightGrey shadow-sm flex items-center gap-3 w-full md:w-auto">
          <span className="text-[11px] font-[800] uppercase tracking-widest text-navratri-muted whitespace-nowrap">Event:</span>
          <select 
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-transparent text-navratri-text font-[800] text-[14px] outline-none w-full md:w-48 cursor-pointer"
          >
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title || ev.name}</option>)}
          </select>
        </div>
      </div>

      {/* Check-in Progress Bar */}
      <div className="bg-white p-6 rounded-[24px] border border-navratri-lightGrey shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[12px] font-[800] uppercase tracking-widest text-navratri-muted mb-1">Total Check-ins</p>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={checkedInTickets} className="text-[40px] font-display font-[800] text-navratri-text leading-none" />
              <span className="text-[20px] font-display font-[700] text-navratri-muted">/ {totalTickets}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[24px] font-display font-[800] text-navratri-primary">{checkinPercentage}%</p>
            <p className="text-[11px] font-[800] uppercase tracking-widest text-navratri-muted">Checked In</p>
          </div>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-premium"
            initial={{ width: 0 }}
            animate={{ width: `${checkinPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <StatCard label="Tickets Sold" value={totalTickets.toLocaleString()} icon={Ticket} color="bg-indigo-50 text-indigo-600 border-indigo-100" />
        <StatCard label="Remaining" value={remainingTickets.toLocaleString()} icon={Users} color="bg-orange-50 text-orange-600 border-orange-100" />
        <StatCard label="Checked In" value={checkedInTickets.toLocaleString()} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600 border-emerald-100" />
        <StatCard label="Revenue" value={formatCurrency(revenue)} icon={IndianRupee} color="bg-rose-50 text-rose-600 border-rose-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gate Statistics */}
        <div className="card-base overflow-hidden flex flex-col">
          <div className="p-6 border-b border-navratri-lightGrey bg-slate-50/50">
            <h3 className="text-[20px] font-display font-[800] text-navratri-text">Gate Statistics</h3>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {Object.keys(gateStats).length === 0 ? (
              <p className="text-center text-navratri-muted text-[14px] font-[600] py-10">No gate data available</p>
            ) : (
              Object.keys(gateStats).map(gateId => {
                const gate = gateStats[gateId];
                const pct = gate.total > 0 ? ((gate.checkedIn / gate.total) * 100).toFixed(1) : 0;
                return (
                  <div key={gateId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-[800] text-[14px] text-navratri-text">{gate.name}</p>
                      <p className="text-[12px] font-[800] text-navratri-muted"><AnimatedNumber value={gate.checkedIn} /> / {gate.total}</p>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-navratri-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="lg:col-span-2 card-base overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-navratri-lightGrey bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-[20px] font-display font-[800] text-navratri-text">Recent Check-ins (Live)</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div className="flex-1 overflow-auto p-0">
            {checkins.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-navratri-muted">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-50 text-navratri-primary" />
                <p className="text-[14px] font-[600] uppercase tracking-widest">Waiting for scans...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-navratri-lightGrey">
                  <tr className="text-navratri-muted font-[800] text-[10px] uppercase tracking-widest">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Ticket Type</th>
                    <th className="px-6 py-4">Gate</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navratri-lightGrey text-[14px]">
                  <AnimatePresence>
                    {checkins.map((checkin) => (
                      <motion.tr 
                        key={checkin.id}
                        initial={{ opacity: 0, backgroundColor: '#f0fdf4' }}
                        animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                        transition={{ duration: 1 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-[800] text-navratri-text flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {checkin.customerName}
                          </p>
                          <p className="text-[11px] text-navratri-muted font-mono mt-0.5 ml-6">{checkin.ticketId}</p>
                        </td>
                        <td className="px-6 py-4 font-[700] text-navratri-text">{checkin.ticketType}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-[800] uppercase tracking-widest bg-slate-100 text-slate-600">
                            {checkin.gateName}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-[600] text-navratri-muted">
                          {new Date(checkin.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-[8px] text-[10px] font-[800] uppercase tracking-widest">
                             Checked In
                           </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function StatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="card-base p-6 hover:-translate-y-1 transition-all duration-300">
      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-4 border ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display font-[800] text-[28px] text-navratri-text tracking-tight mb-1">
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </div>
      <p className="text-[11px] font-[800] uppercase tracking-widest text-navratri-muted">{label}</p>
    </div>
  );
}

function AnimatedNumber({ value, className = "" }: { value: number, className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.span
      key={displayValue}
      initial={{ opacity: 0.5, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
}

