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
  }, [eventFilter, paymentFilter, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (eventFilter) queryParams.append('eventId', eventFilter);
      if (paymentFilter) queryParams.append('paymentStatus', paymentFilter);
      if (statusFilter) queryParams.append('bookingStatus', statusFilter);

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
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-[800] text-navratri-text flex items-center gap-2">
            <Ticket className="w-6 h-6 text-navratri-accent" /> Bookings
          </h1>
          <p className="text-[#6B7280] font-[500] mt-1">Manage and track all customer orders</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-white border border-gray-200 text-[#111111] px-4 py-2.5 rounded-[12px] font-[600] flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name, phone, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-navratri-accent focus:border-transparent font-[500] text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 flex-wrap">
          <select 
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-navratri-accent font-[500] text-sm min-w-[150px]"
          >
            <option value="">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>

          <select 
            value={scanFilter}
            onChange={(e) => setScanFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-navratri-accent font-[500] text-sm min-w-[150px]"
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
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-navratri-accent font-[500] text-sm min-w-[150px]"
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-navratri-accent" />
            <p className="font-[600]">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Ticket className="w-12 h-12 mb-4 text-gray-200" />
            <p className="font-[600]">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-[800] text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Booking ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Tickets (Stats)</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking: any) => (
                  <tr 
                    key={booking.id} 
                    onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-[800] text-[#111111] font-mono text-sm">{booking.id}</p>
                      <p className="text-xs text-gray-500 font-[500] mt-1">{formatDate(booking.createdAt)}</p>
                      {booking.demo && <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-sm">DEMO</span>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-[700] text-[#111111]">{booking.customerName}</p>
                      <p className="text-xs text-gray-500 font-[500] mt-1">{booking.mobile}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-[600] text-[#111111] text-sm max-w-[200px] truncate">
                        {events.find(e => e.id === booking.eventId)?.title || booking.eventId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-700 font-[800] text-xs" title="Total Tickets">
                          {booking.stats?.total || booking.ticketCount || 0}
                        </div>
                      </div>
                      <div className="flex gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                         <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded" title="Valid">V: {booking.stats?.valid || 0}</span>
                         <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded" title="Scanned">S: {booking.stats?.scanned || 0}</span>
                         {(booking.stats?.cancelled || 0) > 0 && (
                            <span className="text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded" title="Cancelled">C: {booking.stats.cancelled}</span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-[800] text-[#111111]">
                      {formatCurrency(booking.amount || booking.totalAmount || booking.grandTotal || 0)}
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <div>
                        {booking.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-[700] text-green-700 bg-green-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5"/> Paid</span>
                        ) : booking.paymentStatus === 'pending' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-[700] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5"/> Pending</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-[700] text-red-700 bg-red-50 px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5"/> Failed</span>
                        )}
                      </div>
                      <div>
                        {(booking.status === 'confirmed' || !booking.status) ? (
                          <span className="inline-flex items-center gap-1 text-xs font-[700] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">Confirmed</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-[700] text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full capitalize">{booking.status}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-navratri-accent transition-colors" />
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
