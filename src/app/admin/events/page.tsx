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
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto selection:bg-navratri-accent selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-display font-[800] text-navratri-text tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-navratri-primary/10 rounded-[14px] flex items-center justify-center border border-navratri-primary/20">
              <CalendarDays className="w-6 h-6 text-navratri-primary" />
            </div>
            Events Hub
          </h1>
          <p className="text-navratri-muted font-[500] text-[15px] mt-2">Manage all your events and inventory</p>
        </div>
        <Link href="/admin/events/new" className="bg-gradient-premium text-white px-6 py-3 rounded-[12px] font-[800] flex items-center gap-2 hover:shadow-lg transition-all shadow-premium hover:-translate-y-1 relative overflow-hidden group">
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          <span className="relative z-10 flex items-center gap-2"><Plus className="w-4 h-4" /> Create Event</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-navratri-lightGrey rounded-card p-16 text-center shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-premium"></div>
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
            <CalendarDays className="w-10 h-10 text-navratri-primary/50" />
          </div>
          <h2 className="text-[24px] font-display font-[800] text-navratri-text mb-3">No Events Found</h2>
          <p className="text-navratri-muted max-w-sm mx-auto mb-8 font-[500] text-[15px]">You haven't created any events yet. Start by creating your first event to accept bookings.</p>
          <Link href="/admin/events/new" className="bg-navratri-primary text-white px-8 py-3.5 rounded-button font-[800] hover:bg-navratri-darkAccent transition-colors inline-block shadow-sm">
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col hover:-translate-y-1.5">
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                {event.bannerImage ? (
                  <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-[800] uppercase tracking-widest text-[12px] bg-slate-50">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-[800] uppercase tracking-widest backdrop-blur-md border ${
                    event.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                    event.status === 'sold_out' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]' :
                    'bg-white/20 text-white border-white/30'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-[20px] font-display font-[800] text-white line-clamp-1 mb-1 group-hover:text-navratri-accent transition-colors">{event.title}</h3>
                  <p className="text-[12px] text-white/80 font-[600] line-clamp-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> {new Date(event.startDate).toLocaleDateString()} • {event.city}</p>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col bg-white">
                <div className="space-y-3 mb-6 flex-grow">
                  {(event.ticketTypes || []).map((tt: any) => (
                    <div key={tt.id} className="flex justify-between items-center text-[14px] border-b border-slate-100 pb-3 last:border-0 hover:bg-slate-50/60 p-3 rounded-[12px] transition-colors -mx-3">
                      <span className="font-[700] text-slate-700 truncate mr-2">{tt.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-[800] text-transparent bg-clip-text bg-gradient-premium">₹{tt.price}</span>
                        <span className="text-[10px] tracking-widest bg-slate-100 border border-slate-200 px-2 py-1 rounded-full text-slate-600 font-[800] uppercase">
                          {tt.soldQuantity || 0}/{tt.totalInventory || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!event.ticketTypes || event.ticketTypes.length === 0) && (
                    <div className="text-[12px] font-[600] text-navratri-muted italic bg-slate-50 p-3 rounded-[8px] border border-slate-100 text-center">No tickets configured</div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                  <button onClick={() => toggleStatus(event.id, event.status)} className="text-[13px] font-[800] text-slate-400 hover:text-navratri-primary transition-colors flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${event.status === 'published' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                    {event.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <div className="flex items-center gap-1">
                    {event.status === 'published' && (
                      <Link href={`/events/${event.id}`} target="_blank" className="p-2.5 text-slate-400 hover:text-navratri-primary hover:bg-navratri-primary/5 rounded-[12px] transition-colors border border-transparent hover:border-navratri-primary/20" title="View Public Page">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <Link href={`/admin/events/${event.id}`} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-[12px] transition-colors border border-transparent hover:border-blue-200" title="Event Analytics">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </Link>
                    <Link href={`/admin/events/${event.id}/edit`} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[12px] transition-colors border border-transparent hover:border-indigo-200" title="Edit Event">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(event.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[12px] transition-colors border border-transparent hover:border-red-200" title="Delete Event">
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
