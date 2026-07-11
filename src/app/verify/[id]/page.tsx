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
      case 'valid': return { icon: CheckCircle2, label: 'Valid Ticket', textColor: 'text-green-600', bgLight: 'bg-green-50' };
      case 'already_used': return { icon: AlertTriangle, label: 'Already Used', textColor: 'text-amber-600', bgLight: 'bg-amber-50' };
      case 'cancelled': return { icon: Ban, label: 'Cancelled', textColor: 'text-gray-600', bgLight: 'bg-gray-50' };
      default: return { icon: XCircle, label: 'Invalid Ticket', textColor: 'text-red-600', bgLight: 'bg-red-50' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-navratri-maroon/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-navratri-maroon" />
        </div>
        <h1 className="text-3xl font-bold text-navratri-maroon">Verify Ticket</h1>
        <p className="text-gray-500 mt-2">Enter a ticket ID to check its validity</p>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            placeholder="e.g. PN-AHM-3K81"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navratri-gold focus:border-transparent font-mono text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
        </div>
        <button onClick={handleVerify} disabled={loading} className="bg-navratri-maroon text-white px-6 rounded-2xl font-bold hover:bg-navratri-winered transition-colors disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </div>

      {statusConfig && result && (
        <div className="space-y-4">
          <div className={`${statusConfig.bgLight} rounded-2xl p-6 text-center border`}>
            <statusConfig.icon className={`w-16 h-16 ${statusConfig.textColor} mx-auto mb-3`} />
            <h2 className={`text-2xl font-bold ${statusConfig.textColor}`}>{statusConfig.label}</h2>
            <p className="text-gray-600 mt-2">{result.message}</p>
          </div>

          {result.ticket && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-navratri-saffron" />
                <div>
                  <p className="text-xs text-gray-400">Event</p>
                  <p className="font-bold text-gray-900">{result.ticket.eventName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-navratri-saffron" />
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="font-medium">{result.ticket.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-navratri-saffron" />
                  <div>
                    <p className="text-xs text-gray-400">Pass Type</p>
                    <p className="font-medium">{result.ticket.passType}</p>
                  </div>
                </div>
              </div>
              {result.ticket.entryTime && (
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-gray-400">Entry Time</p>
                    <p className="font-medium">{new Date(result.ticket.entryTime).toLocaleString('en-IN')}</p>
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
