'use client';

import { useState } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, Ban, Ticket, QrCode, User, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import type { Ticket as TicketType } from '@/types';

export default function VerifyPage({ params }: { params: { id: string } }) {
  const [ticketId, setTicketId] = useState(params.id || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; message: string; ticket?: TicketType } | null>(null);

  const handleVerify = async () => {
    if (!ticketId.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticketId.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'error', message: 'Failed to verify. Please try again.' });
    }
    setLoading(false);
  };

  const getStatusConfig = () => {
    if (!result) return null;
    switch (result.status) {
      case 'valid': return { icon: CheckCircle2, label: 'Valid Ticket', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50/50 border-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.08)]' };
      case 'already_used': return { icon: AlertTriangle, label: 'Already Used', textColor: 'text-amber-600', bgLight: 'bg-amber-50/50 border-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.08)]' };
      case 'cancelled': return { icon: Ban, label: 'Cancelled', textColor: 'text-slate-650', bgLight: 'bg-slate-50 border-slate-200' };
      default: return { icon: XCircle, label: 'Invalid Ticket', textColor: 'text-red-650', bgLight: 'bg-red-50/50 border-red-100 shadow-[0_0_24px_rgba(239,68,68,0.08)]' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="max-w-xl mx-auto px-4 py-12 selection:bg-navratri-accent selection:text-white pt-[60px] animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100 shadow-[0_0_24px_rgba(124,58,237,0.1)]">
          <ShieldCheck className="w-8 h-8 text-navratri-primary" />
        </div>
        <h1 className="text-3xl font-display font-[850] text-navratri-text tracking-tight">Verify Ticket</h1>
        <p className="text-navratri-muted font-[500] mt-2">Enter a ticket ID or verify code to check its live validity status</p>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            placeholder="e.g. PN-AHM-3K81"
            className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-white rounded-2xl focus:outline-none focus:border-navratri-primary focus:ring-1 focus:ring-navratri-primary/30 outline-none transition-all font-mono text-lg text-navratri-text"
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
        </div>
        <button onClick={handleVerify} disabled={loading} className="bg-gradient-premium text-white px-6 rounded-2xl font-[800] hover:shadow-premium hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </div>

      {statusConfig && result && (
        <div className="space-y-4">
          <div className={`${statusConfig.bgLight} rounded-card p-6 text-center border animate-fade-in-up`}>
            <statusConfig.icon className={`w-16 h-16 ${statusConfig.textColor} mx-auto mb-3`} />
            <h2 className={`text-2xl font-display font-[800] ${statusConfig.textColor}`}>{statusConfig.label}</h2>
            <p className="text-navratri-muted font-[500] mt-2">{result.message}</p>
          </div>

          {result.ticket && (
            <div className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover border border-slate-100 space-y-4 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                  <Ticket className="w-5 h-5 text-navratri-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Event</p>
                  <p className="font-[800] text-navratri-text">{result.ticket.eventName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-navratri-primary" />
                  <div>
                    <p className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Name</p>
                    <p className="font-[600] text-navratri-text">{result.ticket.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-navratri-primary" />
                  <div>
                    <p className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Pass Type</p>
                    <p className="font-[600] text-navratri-text">{result.ticket.passType}</p>
                  </div>
                </div>
              </div>
              {result.ticket.entryTime && (
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">Entry Time</p>
                    <p className="font-[600] text-navratri-text">{new Date(result.ticket.entryTime).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
