'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Loader2, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrganizerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/organizer/bookings');
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.bookings);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus !== 'all' && b.paymentStatus !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        b.id?.toLowerCase().includes(q) ||
        b.customerName?.toLowerCase().includes(q) ||
        b.mobile?.includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'refunded': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#111111]">Bookings</h1>
          <p className="text-gray-500 font-[500] mt-1 text-sm">Manage and view all customer bookings across your events.</p>
        </div>
        <button className="bg-white border border-gray-200 text-[#111111] px-5 py-2.5 rounded-xl font-[700] text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {/* Filters & Search */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Booking ID, Name or Mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-sm font-[500] transition-all"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-[600] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 w-full md:w-auto outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex h-64 items-center justify-center">
               <Loader2 className="w-8 h-8 text-[#E53935] animate-spin" />
             </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-[800] text-[#111111]">No bookings found</h3>
              <p className="text-gray-500 font-[500] text-sm mt-1 max-w-sm">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Passes</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filteredBookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-[800] text-[#E53935]">{booking.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-[700] text-[#111111]">{booking.customerName}</div>
                      <div className="text-xs font-[500] text-gray-500 mt-0.5">{booking.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-[600] text-gray-700">{booking.totalQuantity} <span className="text-xs font-[500] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-1">Total</span></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-[800] text-[#111111]">{formatCurrency(booking.amount || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-[700] rounded-lg border uppercase tracking-wide ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-[600] text-gray-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="p-2 text-gray-400 hover:text-[#E53935] hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
