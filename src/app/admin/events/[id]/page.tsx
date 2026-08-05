'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BarChart3, Ticket, IndianRupee, Users, Ban, Percent, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import type { Event } from '@/types';

export default function EventAnalyticsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventAndAnalytics();
  }, [params.id]);

  const fetchEventAndAnalytics = async () => {
    try {
      const eventRes = await fetch(`/api/admin/events/${params.id}`);
      const eventData = await eventRes.json();
      
      if (eventData.success) {
        setEvent(eventData.event);
        
        const analyticsRes = await fetch(`/api/admin/events/${params.id}/analytics`);
        const analyticsData = await analyticsRes.json();
        
        if (analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        } else {
          toast.error('Failed to load analytics data');
        }
      } else {
        toast.error('Failed to load event details');
      }
    } catch (error) {
      toast.error('Network error loading event data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-navratri-bg">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-accent" />
      </div>
    );
  }

  if (!event || !analytics) {
    return (
      <div className="p-8 text-center text-navratri-muted">
        <h2 className="text-xl font-bold">Failed to load analytics.</h2>
        <button onClick={() => router.back()} className="mt-4 text-navratri-primary underline font-[600]">Go Back</button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tickets Issued', value: (analytics.totalTicketsIssued || 0).toLocaleString(), icon: Ticket, borderClass: 'bg-[#7C3AED]' },
    { label: 'Valid / Unused', value: (analytics.validTickets || 0).toLocaleString(), icon: Ticket, borderClass: 'bg-[#00E5FF]' },
    { label: 'Scanned / Used', value: (analytics.scannedTickets || 0).toLocaleString(), icon: Users, borderClass: 'bg-[#22C55E]' },
    { label: 'Cancelled Tickets', value: (analytics.cancelledTickets || 0).toLocaleString(), icon: Ban, borderClass: 'bg-[#64748B]' },
    { label: 'Check-in Percentage', value: `${analytics.checkinPercentage || 0}%`, icon: Percent, borderClass: 'bg-[#FF4D6D]' },
    { label: 'Duplicate Scans', value: (analytics.duplicateScanAttempts || 0).toLocaleString(), icon: Ticket, borderClass: 'bg-[#EF4444]' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto selection:bg-navratri-accent selection:text-white space-y-8">
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-navratri-muted hover:text-navratri-text font-[700] text-[14px] transition-colors group">
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Events Hub
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-display font-[800] text-navratri-text tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-navratri-primary/10 rounded-[14px] flex items-center justify-center border border-navratri-primary/20 shadow-sm">
              <BarChart3 className="w-6 h-6 text-navratri-primary" />
            </div>
            Event Analytics
          </h1>
          <p className="text-navratri-muted font-[500] text-[15px] mt-2">
            Performance metrics for <span className="font-bold text-navratri-text">{event.title}</span>
          </p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-[12px] border border-navratri-lightGrey shadow-sm flex items-center gap-3 self-start md:self-auto">
          <span className="text-[11px] font-[800] uppercase tracking-widest text-navratri-muted">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-[800] uppercase tracking-widest border ${
            event.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 shadow-[0_0_12px_rgba(34,197,94,0.1)]' :
            event.status === 'sold_out' ? 'bg-orange-50 text-orange-700 border-orange-200' :
            'bg-slate-50 text-slate-650 border-slate-200'
          }`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-card p-6 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.borderClass}`} />
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-50 rounded-[12px] flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                <stat.icon className="w-5 h-5 text-navratri-primary" />
              </div>
              <div>
                <p className="text-[12px] font-[800] text-navratri-muted uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-[28px] font-display font-[800] text-navratri-text leading-none">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-card border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
        <h2 className="text-[18px] font-display font-[800] text-navratri-text p-6 bg-slate-50/50 border-b border-slate-100">Ticket Type Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-[800] text-navratri-muted uppercase tracking-widest">
                <th className="px-6 py-5">Ticket Name</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Sold</th>
                <th className="px-6 py-5">Remaining</th>
                <th className="px-6 py-5">Total Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(event.ticketTypes || []).map((tt) => (
                <tr key={tt.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5 font-[800] text-navratri-text text-[15px]">{tt.name}</td>
                  <td className="px-6 py-5 font-[700] text-navratri-primary text-[15px]">₹{tt.price}</td>
                  <td className="px-6 py-5 font-[800] text-emerald-600 text-[15px]">{tt.soldQuantity || 0}</td>
                  <td className="px-6 py-5 font-[800] text-amber-600 text-[15px]">{tt.remainingQuantity || 0}</td>
                  <td className="px-6 py-5 font-[600] text-navratri-muted text-[15px]">{tt.totalInventory || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!event.ticketTypes || event.ticketTypes.length === 0) && (
            <div className="text-center py-12 text-navratri-muted font-[600] uppercase tracking-widest text-[12px]">No ticket types configured for this event.</div>
          )}
        </div>
      </div>
    </div>
  );
}
