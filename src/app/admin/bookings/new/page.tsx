'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, UserPlus, FileText, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Event } from '@/types';

export default function ManualBookingPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    city: '',
    paymentMode: 'cash',
    notes: '',
    walkIn: false
  });

  const [selectedTickets, setSelectedTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events.filter((e: Event) => e.status === 'published'));
      }
    } catch (error) {
      toast.error('Failed to load events');
    }
  };

  const currentEvent = events.find(e => e.id === selectedEventId);

  const handleTicketChange = (ticketTypeId: string, qtyStr: string) => {
    const quantity = parseInt(qtyStr) || 0;
    const existing = [...selectedTickets];
    const index = existing.findIndex(t => t.ticketTypeId === ticketTypeId);
    
    if (quantity === 0) {
      if (index !== -1) existing.splice(index, 1);
    } else {
      if (index !== -1) {
        existing[index].quantity = quantity;
      } else {
        existing.push({ ticketTypeId, quantity });
      }
    }
    setSelectedTickets(existing);
  };

  const totalAmount = selectedTickets.reduce((sum, t) => {
    const tt = currentEvent?.ticketTypes?.find(x => x.id === t.ticketTypeId);
    return sum + (t.quantity * (tt?.price || 0));
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return toast.error('Select an event');
    if (selectedTickets.length === 0) return toast.error('Select at least one ticket');
    if (!formData.customerName || !formData.mobile) return toast.error('Name and Mobile are required');

    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventId: selectedEventId,
          ticketTypes: selectedTickets
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking created successfully');
        router.push(`/admin/bookings/${data.orderId}`);
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      toast.error('Error creating booking');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-semibold transition-colors">
        <ChevronLeft className="w-5 h-5" /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-[800] text-gray-900 flex items-center gap-2">
          <UserPlus className="w-8 h-8 text-navratri-accent" /> Manual Booking
        </h1>
        <p className="text-gray-500 font-medium mt-1">Create walk-in entries or custom offline bookings instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Customer Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
              <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
              <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent" placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address (Optional)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">City (Optional)</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent" placeholder="Ahmedabad" />
            </div>
          </div>
        </div>

        {/* Event & Ticket Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Event & Tickets</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Event *</label>
            <select required value={selectedEventId} onChange={e => { setSelectedEventId(e.target.value); setSelectedTickets([]); }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent">
              <option value="">-- Choose Event --</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>

          {currentEvent && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Select Tickets *</label>
              {currentEvent.ticketTypes.filter(t => t.status === 'available').map(tt => (
                <div key={tt.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div>
                    <p className="font-bold text-gray-900">{tt.name}</p>
                    <p className="text-sm text-gray-500">₹{tt.price} • {tt.remainingQuantity} left</p>
                  </div>
                  <div className="w-32">
                    <input 
                      type="number" 
                      min="0" 
                      max={tt.remainingQuantity}
                      placeholder="Qty"
                      onChange={e => handleTicketChange(tt.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment & Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Payment & Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Payment Mode</label>
              <select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent">
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="free">Complimentary / Free</option>
                <option value="demo">Demo / Mock</option>
                <option value="unpaid">Unpaid / Pending</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-blue-100 bg-blue-50/50 rounded-xl w-full">
                <input 
                  type="checkbox" 
                  checked={formData.walkIn}
                  onChange={e => setFormData({...formData, walkIn: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <p className="font-bold text-blue-900">Walk-in Entry</p>
                  <p className="text-xs text-blue-700">Auto-checkin tickets immediately.</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Internal Notes (Optional)</label>
            <textarea 
              rows={3} 
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-accent" 
              placeholder="e.g. Approved by management, Paid via GPay..." 
            />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 sticky bottom-6 shadow-2xl">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">Total Amount</p>
            <p className="text-3xl font-display font-[800]">₹{totalAmount.toLocaleString()}</p>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 bg-navratri-accent text-white rounded-xl font-bold hover:bg-navratri-darkAccent transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Processing...' : <><Save className="w-5 h-5" /> Confirm Booking</>}
          </button>
        </div>

      </form>
    </div>
  );
}
