'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, User, Phone, Mail, MapPin, Calendar, 
  CreditCard, ShieldCheck, Ticket, Download, 
  CheckCircle2, XCircle, Clock, Trash2, AlertTriangle, Loader2, Link as LinkIcon, MessageSquare, History
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, Ticket as TicketType } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBookingDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [booking, setBooking] = useState<Order | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
        setTickets(data.tickets);
        setNotes(data.booking.notes || '');
      } else {
        toast.error(data.message || 'Failed to load booking details');
      }
    } catch (error) {
      toast.error('Error fetching booking details');
    }
    setLoading(false);
  };

  const handleAction = async (action: string) => {
    if (action === 'delete') {
      const confirmDelete = window.confirm('Are you sure you want to permanently delete this booking and all associated tickets? This action cannot be undone.');
      if (!confirmDelete) return;
    }
    if (action === 'cancel') {
      const confirmCancel = window.confirm('Are you sure you want to cancel this booking? This will invalidate all tickets.');
      if (!confirmCancel) return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        if (action === 'delete') {
          router.push('/admin/bookings');
        } else {
          fetchBookingDetails();
        }
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
    setActionLoading(false);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Notes saved successfully');
      } else {
        toast.error('Failed to save notes');
      }
    } catch (error) {
      toast.error('Error saving notes');
    }
    setSavingNotes(false);
  };

  const copyTicketUrl = (ticketId: string) => {
    const url = `${window.location.origin}/ticket/${ticketId}`;
    navigator.clipboard.writeText(url);
    toast.success('Ticket link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-accent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Booking not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-navratri-accent font-semibold hover:underline">Go Back</button>
      </div>
    );
  }

  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-semibold transition-colors">
        <ChevronLeft className="w-5 h-5" /> Back to Bookings
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-[800] text-gray-900">Order <span className="font-mono text-navratri-accent">#{booking.id}</span></h1>
            {booking.demo && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">DEMO</span>}
          </div>
          <p className="text-gray-500 font-medium">Placed on {formatDate(booking.createdAt)}</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => handleAction(booking.paymentStatus === 'paid' ? 'mark_unpaid' : 'mark_paid')}
            disabled={actionLoading || isCancelled}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Mark {booking.paymentStatus === 'paid' ? 'Unpaid' : 'Paid'}
          </button>
          
          {!isCancelled && (
            <button 
              onClick={() => handleAction('cancel')}
              disabled={actionLoading}
              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-semibold hover:bg-amber-100 disabled:opacity-50"
            >
              Cancel Booking
            </button>
          )}

          <button 
            onClick={() => handleAction('delete')}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-navratri-accent" /> Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="font-semibold text-gray-900">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mobile</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> {booking.mobile}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> {booking.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">City</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> {booking.city || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Purchased Tickets List */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-navratri-accent" /> Issued Tickets ({tickets.length})
              </h2>
            </div>
            
            {tickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-2">Ticket ID</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">QR Status</th>
                      <th className="py-3 px-2">Check-In</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tickets.map(ticket => (
                      <tr key={ticket.ticketId} className="hover:bg-gray-50/50">
                        <td className="py-4 px-2 font-mono text-sm font-bold text-gray-900 flex items-center gap-2">
                          {ticket.ticketId}
                          <button onClick={() => copyTicketUrl(ticket.ticketId)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Copy Ticket Link">
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-4 px-2 font-medium text-gray-700">{ticket.ticketType}</td>
                        <td className="py-4 px-2">
                          {ticket.status === 'valid' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5"/> Valid</span>
                          ) : ticket.status === 'used' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full"><ShieldCheck className="w-3.5 h-3.5"/> Scanned</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full"><XCircle className="w-3.5 h-3.5"/> Cancelled</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          {ticket.checkedIn ? (
                            <div>
                              <p className="text-xs font-bold text-gray-900">Yes</p>
                            </div>
                          ) : (
                            <p className="text-xs font-semibold text-gray-400">-</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 font-medium py-4">No tickets generated for this booking.</p>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Payment Status</span>
                {booking.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-green-700"><CheckCircle2 className="w-4 h-4"/> Paid</span>
                ) : booking.paymentStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700"><Clock className="w-4 h-4"/> Pending</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-red-700"><XCircle className="w-4 h-4"/> Failed</span>
                )}
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Booking Status</span>
                <span className={`font-bold capitalize ${isCancelled ? 'text-red-600' : 'text-blue-600'}`}>
                  {booking.status || 'Confirmed'}
                </span>
              </div>
              {booking.paymentMode && (
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Payment Mode</span>
                  <span className="font-bold text-gray-900 capitalize flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> {booking.paymentMode}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
              {(booking.ticketTypes || []).map(pass => (
                <div key={pass.ticketTypeId} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{pass.quantity}x {pass.ticketTypeName}</span>
                  <span className="font-bold text-gray-900">{formatCurrency(pass.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total Amount</span>
                <span className="text-3xl font-display font-[800] text-navratri-accent">{formatCurrency(booking.amount)}</span>
              </div>
            </div>

            {booking.razorpayOrderId && !booking.razorpayOrderId.includes('mock') && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Razorpay Order ID</p>
                <p className="font-mono text-xs text-gray-600 break-all">{booking.razorpayOrderId}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-3 mb-1">Razorpay Payment ID</p>
                <p className="font-mono text-xs text-gray-600 break-all">{booking.razorpayPaymentId}</p>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-navratri-accent" /> Internal Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal comments, payment references, or staff notes here..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent mb-4"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black disabled:opacity-50"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-navratri-accent" /> Booking Timeline
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {(booking.timeline || [{ action: 'Booking Created', date: booking.createdAt, actor: 'System' }]).map((event, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{event.action}</h3>
                      <time className="text-xs text-gray-500 font-medium">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{new Date(event.date).toLocaleDateString()} • By {event.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
