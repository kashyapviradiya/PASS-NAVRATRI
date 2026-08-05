'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, ChevronRight, CheckCircle2, XCircle, Clock, Loader2, Ticket } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, Event } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [scanFilter, setScanFilter] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, [eventFilter, paymentFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (eventFilter) queryParams.append('eventId', eventFilter);
      if (paymentFilter) queryParams.append('paymentStatus', paymentFilter);

      const res = await fetch(`/api/admin/bookings?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      toast.error('Error fetching bookings');
    }
    setLoading(false);
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Client-side search and scan filtering
  const filteredBookings = bookings.filter(b => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const match = b.id?.toLowerCase().includes(query) ||
        b.customerName?.toLowerCase().includes(query) ||
        b.email?.toLowerCase().includes(query) ||
        b.mobile?.toLowerCase().includes(query);
      if (!match) return false;
    }
    
    if (scanFilter) {
      const stats = (b as any).stats;
      if (!stats) return false;
      if (scanFilter === 'valid' && stats.valid === 0) return false;
      if (scanFilter === 'scanned' && stats.scanned === 0) return false;
      if (scanFilter === 'cancelled' && stats.cancelled === 0) return false;
      if (scanFilter === 'not_checked_in' && stats.scanned === stats.total) return false; // Has no pending check-ins
    }
    
    return true;
  });

  const exportCSV = () => {
    if (filteredBookings.length === 0) {
      toast.error('No bookings to export');
      return;
    }

    const headers = ['Booking ID', 'Date', 'Customer Name', 'Mobile', 'Email', 'City', 'Event', 'Total Tickets', 'Valid', 'Scanned', 'Cancelled', 'Total Amount', 'Payment Status', 'Booking Status', 'Demo'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map((b: any) => [
        b.id,
        `"${formatDate(b.createdAt)}"`,
        `"${b.customerName}"`,
        b.mobile,
        b.email,
        `"${b.city || ''}"`,
        `"${events.find(e => e.id === b.eventId)?.title || b.eventId}"`,
        b.stats?.total || b.ticketCount,
        b.stats?.valid || 0,
        b.stats?.scanned || 0,
        b.stats?.cancelled || 0,
        b.amount,
        b.paymentStatus,
        b.status || 'confirmed',
        b.demo ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto selection:bg-navratri-accent selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-display font-[800] text-navratri-text tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-navratri-primary/10 rounded-[14px] flex items-center justify-center border border-navratri-primary/20">
              <Ticket className="w-6 h-6 text-navratri-primary" />
            </div>
            Bookings
          </h1>
          <p className="text-navratri-muted font-[500] text-[15px] mt-2">Manage and track all customer orders</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-white border border-navratri-lightGrey text-navratri-text px-5 py-2.5 rounded-[12px] font-[800] flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-card border border-slate-100 shadow-card flex flex-col md:flex-row gap-4 flex-wrap relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-premium"></div>
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
          <input 
            type="text" 
            placeholder="Search name, phone, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-navratri-primary/30 focus:border-navratri-primary font-[600] text-[14px] transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 flex-wrap">
          <select 
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-navratri-primary/30 focus:border-navratri-primary font-[600] text-[14px] min-w-[150px] transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>

          <select 
            value={scanFilter}
            onChange={(e) => setScanFilter(e.target.value)}
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-navratri-primary/30 focus:border-navratri-primary font-[600] text-[14px] min-w-[150px] transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Ticket States</option>
            <option value="valid">Has Valid Tickets</option>
            <option value="scanned">Has Scanned Tickets</option>
            <option value="not_checked_in">Not Fully Checked In</option>
            <option value="cancelled">Has Cancelled Tickets</option>
          </select>

          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-navratri-primary/30 focus:border-navratri-primary font-[600] text-[14px] min-w-[150px] transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-card border border-slate-100 shadow-card hover:shadow-card-hover transition-all overflow-hidden group">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-navratri-muted">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-navratri-primary" />
            <p className="font-[700] tracking-widest uppercase text-[12px]">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-navratri-muted">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Ticket className="w-10 h-10 text-navratri-primary/50" />
            </div>
            <p className="font-[800] text-[16px] text-navratri-text">No bookings found</p>
            <p className="font-[500] text-[14px] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-[800] text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-5">Booking ID & Date</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Event</th>
                  <th className="px-6 py-5">Tickets (Stats)</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navratri-lightGrey">
                {filteredBookings.map((booking: any) => (
                  <tr 
                    key={booking.id} 
                    onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                    className="hover:bg-slate-50/40 cursor-pointer transition-all duration-200 group/row"
                  >
                    <td className="px-6 py-5">
                      <p className="font-[800] text-navratri-text font-mono text-[14px]">{booking.id}</p>
                      <p className="text-[12px] text-navratri-muted font-[600] mt-1">{formatDate(booking.createdAt)}</p>
                      {booking.demo && <span className="inline-block mt-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-[800] rounded-[6px] border border-yellow-200 tracking-widest uppercase">DEMO</span>}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-[800] text-navratri-text text-[15px]">{booking.customerName}</p>
                      <p className="text-[13px] text-navratri-muted font-[600] mt-1">{booking.mobile}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-[700] text-navratri-text text-[14px] max-w-[200px] truncate">
                        {events.find(e => e.id === booking.eventId)?.title || booking.eventId}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] bg-slate-100 text-slate-700 font-[800] text-[12px] border border-slate-200" title="Total Tickets">
                          {booking.stats?.total || booking.ticketCount || 0}
                        </div>
                      </div>
                      <div className="flex gap-2 text-[10px] font-[800] uppercase tracking-widest">
                         <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded-[6px] border border-blue-100" title="Valid">V: {booking.stats?.valid || 0}</span>
                         <span className="text-green-700 bg-green-50 px-2 py-1 rounded-[6px] border border-green-100" title="Scanned">S: {booking.stats?.scanned || 0}</span>
                         {(booking.stats?.cancelled || 0) > 0 && (
                            <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded-[6px] border border-slate-200" title="Cancelled">C: {booking.stats.cancelled}</span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-[800] text-navratri-text text-[15px]">
                      {formatCurrency(booking.amount || booking.totalAmount || booking.grandTotal || 0)}
                    </td>
                    <td className="px-6 py-5 space-y-2.5">
                      <div>
                        {booking.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-[800] tracking-widest uppercase text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-100/50 backdrop-blur-sm"><CheckCircle2 className="w-3.5 h-3.5"/> Paid</span>
                        ) : booking.paymentStatus === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-[800] tracking-widest uppercase text-amber-700 bg-amber-50/80 px-3 py-1.5 rounded-full border border-amber-100/50 backdrop-blur-sm"><Clock className="w-3.5 h-3.5"/> Pending</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-[800] tracking-widest uppercase text-red-700 bg-red-50/80 px-3 py-1.5 rounded-full border border-red-100/50 backdrop-blur-sm"><XCircle className="w-3.5 h-3.5"/> Failed</span>
                        )}
                      </div>
                      <div>
                        {(booking.status === 'confirmed' || !booking.status) ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-[800] tracking-widest uppercase text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-full border border-blue-100/50 backdrop-blur-sm">Confirmed</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-[800] tracking-widest uppercase text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm capitalize">{booking.status}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover/row:border-navratri-primary group-hover/row:bg-navratri-primary/5 transition-all ml-auto">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover/row:text-navratri-primary transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
