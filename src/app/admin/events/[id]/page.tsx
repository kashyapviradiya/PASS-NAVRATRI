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
      // Fetch basic event info
      const eventRes = await fetch(`/api/admin/events/${params.id}`);
      const eventData = await eventRes.json();
      
      if (eventData.success) {
        setEvent(eventData.event);
        
        // Fetch specific analytics
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-primary" />
      </div>
    );
  }

  if (!event || !analytics) {
    return (
      <div className="p-8 text-center text-gray-500">
        <h2 className="text-xl font-bold">Failed to load analytics.</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 underline">Go Back</button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(analytics.totalRevenue), icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Tickets Sold', value: analytics.ticketsSold, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Remaining Tickets', value: analytics.remainingTickets, icon: Ticket, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Check-ins (Scanned)', value: analytics.checkIns, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Cancellations', value: analytics.cancellationCount, icon: Ban, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Occupancy Rate', value: `${analytics.occupancy}%`, icon: Percent, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-semibold transition-colors">
        <ChevronLeft className="w-5 h-5" /> Back to Events
      </button>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-[800] text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-navratri-accent" /> Event Analytics
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Performance metrics for <span className="font-bold text-gray-700">{event.title}</span>
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            event.status === 'published' ? 'bg-green-100 text-green-700' :
            event.status === 'sold_out' ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {event.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-[800] text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Ticket Type Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-[800] text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 rounded-l-xl">Ticket Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Sold</th>
                <th className="px-6 py-4">Remaining</th>
                <th className="px-6 py-4 rounded-r-xl">Total Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(event.ticketTypes || []).map((tt) => (
                <tr key={tt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{tt.name}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">₹{tt.price}</td>
                  <td className="px-6 py-4 font-bold text-navratri-accent">{tt.soldQuantity || 0}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">{tt.remainingQuantity || 0}</td>
                  <td className="px-6 py-4 font-medium text-gray-500">{tt.totalInventory || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!event.ticketTypes || event.ticketTypes.length === 0) && (
            <div className="text-center py-8 text-gray-500 font-medium">No ticket types configured for this event.</div>
          )}
        </div>
      </div>
    </div>
  );
}
