'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, CalendarDays, ExternalLink, Loader2 } from 'lucide-react';
import type { Event } from '@/types';
import toast from 'react-hot-toast';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Event deleted', { id: toastId });
        setEvents(events.filter(e => e.id !== id));
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const toastId = toast.loading('Updating status...');
    try {
      const res = await fetch(`/api/admin/events/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Event marked as ${newStatus}`, { id: toastId });
        setEvents(events.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Events Hub</h1>
          <p className="text-gray-500 text-sm">Manage all your events and inventory</p>
        </div>
        <Link href="/admin/events/new" className="bg-navratri-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-md shadow-red-500/20">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">You haven't created any events yet. Start by creating your first event to accept bookings.</p>
          <Link href="/admin/events/new" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors inline-block">
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-gray-100 relative">
                {event.bannerImage ? (
                  <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
                    event.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    event.status === 'sold_out' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                    'bg-gray-500/50 text-gray-200 border-gray-400/30'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-serif font-bold text-white line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-gray-300 font-medium line-clamp-1">{event.city} • {new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="space-y-3 mb-6 flex-grow">
                  {(event.ticketTypes || []).map((tt: any) => (
                    <div key={tt.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                      <span className="font-medium text-gray-600 truncate mr-2">{tt.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-gray-900">₹{tt.price}</span>
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-medium">
                          {tt.soldQuantity || 0}/{tt.totalInventory || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!event.ticketTypes || event.ticketTypes.length === 0) && (
                    <div className="text-xs text-gray-400 italic">No tickets configured</div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <button onClick={() => toggleStatus(event.id, event.status)} className="text-sm font-bold text-gray-600 hover:text-navratri-primary transition-colors">
                    {event.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <div className="flex items-center gap-1">
                    {event.status === 'published' && (
                      <Link href={`/events/${event.id}`} target="_blank" className="p-2 text-gray-400 hover:text-navratri-primary hover:bg-red-50 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <Link href={`/admin/events/${event.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
