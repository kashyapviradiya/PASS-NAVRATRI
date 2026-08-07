'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, ChevronRight, CheckCircle2, XCircle, Clock, Loader2, Ticket, ChevronLeft } from 'lucide-react';
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
  const [dateFilter, setDateFilter] = useState('all'); // all, today, yesterday, week, month
  const [vipOnly, setVipOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, eventFilter, paymentFilter, scanFilter, dateFilter, vipOnly]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); 
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today); 
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

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

    if (dateFilter !== 'all') {
      const bDate = new Date(b.createdAt);
      if (dateFilter === 'today' && bDate < today) return false;
      if (dateFilter === 'yesterday' && (bDate < yesterday || bDate >= today)) return false;
      if (dateFilter === 'week' && bDate < weekStart) return false;
      if (dateFilter === 'month' && bDate < monthStart) return false;
    }

    if (vipOnly) {
      const bStr = JSON.stringify(b).toLowerCase();
      if (!bStr.includes('vip')) return false;
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

  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

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
          aria-label="Export Bookings to CSV"
          className="bg-white border border-navratri-lightGrey text-navratri-text px-5 py-2.5 rounded-[12px] font-[800] flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Date Filters & VIP Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'today', 'yesterday', 'week', 'month'].map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              aria-label={`Filter by date: ${df}`}
              className={`px-4 py-2 rounded-[20px] text-[13px] font-[800] uppercase tracking-widest transition-all border ${
                dateFilter === df
                  ? 'bg-navratri-primary text-white border-navratri-primary shadow-sm'
                  : 'bg-white text-navratri-text border-slate-200 hover:border-navratri-primary/50'
              }`}
            >
              {df === 'all' ? 'All Time' : df === 'week' ? 'This Week' : df === 'month' ? 'This Month' : df}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setVipOnly(!vipOnly)}
          aria-pressed={vipOnly}
          aria-label="Toggle VIP Only Filter"
          className={`flex items-center gap-2 px-4 py-2 rounded-[20px] text-[13px] font-[800] uppercase tracking-widest transition-all border ${
            vipOnly
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${vipOnly ? 'bg-white' : 'bg-purple-600'}`}></span>
          VIP Only
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
            aria-label="Search Bookings"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-navratri-primary/30 focus:border-navratri-primary font-[600] text-[14px] transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 flex-wrap">
          <select 
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            aria-label="Filter by Event"
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-navratri-primary/30 focus:border-navratri-primary font-[600] text-[14px] min-w-[150px] transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>

          <select 
            value={scanFilter}
            onChange={(e) => setScanFilter(e.target.value)}
            aria-label="Filter by Ticket State"
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
            aria-label="Filter by Payment Status"
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
          <>
            <div className="overflow-x-auto">
              <table role="table" className="w-full text-left border-collapse">
                <thead role="rowgroup">
                  <tr role="row" className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-[800] text-slate-400 uppercase tracking-wider">
                    <th role="columnheader" className="px-6 py-5">Booking ID & Date</th>
                    <th role="columnheader" className="px-6 py-5">Customer</th>
                    <th role="columnheader" className="px-6 py-5">Event</th>
                    <th role="columnheader" className="px-6 py-5">Tickets (Stats)</th>
                    <th role="columnheader" className="px-6 py-5">Amount</th>
                    <th role="columnheader" className="px-6 py-5">Status</th>
                    <th role="columnheader" className="px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody role="rowgroup" className="divide-y divide-navratri-lightGrey">
                  {paginatedBookings.map((booking: any) => (
                    <tr 
                      role="row"
                      key={booking.id} 
                      onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                      className="hover:bg-slate-50/40 cursor-pointer transition-all duration-200 group/row"
                    >
                      <td role="cell" className="px-6 py-5">
                        <p className="font-[800] text-navratri-text font-mono text-[14px]">{booking.id}</p>
                        <p className="text-[12px] text-navratri-muted font-[600] mt-1">{formatDate(booking.createdAt)}</p>
                        {booking.demo && <span className="inline-block mt-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-[800] rounded-[6px] border border-yellow-200 tracking-widest uppercase">DEMO</span>}
                      </td>
                      <td role="cell" className="px-6 py-5">
                        <p className="font-[800] text-navratri-text text-[15px]">{booking.customerName}</p>
                        <p className="text-[13px] text-navratri-muted font-[600] mt-1">{booking.mobile}</p>
                      </td>
                      <td role="cell" className="px-6 py-5">
                        <p className="font-[700] text-navratri-text text-[14px] max-w-[200px] truncate">
                          {events.find(e => e.id === booking.eventId)?.title || booking.eventId}
                        </p>
                      </td>
                      <td role="cell" className="px-6 py-5">
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
                      <td role="cell" className="px-6 py-5 font-[800] text-navratri-text text-[15px]">
                        {formatCurrency(booking.amount || booking.totalAmount || booking.grandTotal || 0)}
                      </td>
                      <td role="cell" className="px-6 py-5 space-y-2.5">
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
                      <td role="cell" className="px-6 py-5 text-right">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover/row:border-navratri-primary group-hover/row:bg-navratri-primary/5 transition-all ml-auto">
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover/row:text-navratri-primary transition-colors" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                <div className="text-[13px] font-[600] text-navratri-muted">
                  Showing <span className="font-[800] text-navratri-text">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>-
                  <span className="font-[800] text-navratri-text">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-[800] text-navratri-text">{totalItems}</span> bookings
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="p-2 rounded-[8px] bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {pages.map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={currentPage === p ? 'page' : undefined}
                      className={`w-9 h-9 rounded-[8px] text-[13px] font-[800] transition-all flex items-center justify-center ${
                        currentPage === p
                          ? 'bg-navratri-primary text-white shadow-sm border border-navratri-primary'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="p-2 rounded-[8px] bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
