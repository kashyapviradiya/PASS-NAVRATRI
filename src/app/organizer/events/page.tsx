'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, MoreVertical, Loader2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OrganizerEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/organizer/events');
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(data.events);
      } else {
        toast.error('Failed to load events');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8]">
        <Loader2 className="w-8 h-8 text-[#9333EA] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#111111]">My Events</h1>
          <p className="text-gray-500 font-[500] mt-1 text-sm">Manage your assigned events and view their performance.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search events by name or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] text-sm font-[500] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-[1rem] hover:bg-gray-50 font-[700] text-sm text-[#111111] shadow-sm">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const totalPasses = (event.passes || []).reduce((sum: number, p: any) => sum + (p.totalInventory || 0), 0);
          const totalSold = (event.passes || []).reduce((sum: number, p: any) => sum + (p.sold || 0), 0);
          const percentSold = totalPasses > 0 ? Math.round((totalSold / totalPasses) * 100) : 0;
          
          return (
            <div key={event.id} className="bg-white rounded-[1.5rem] overflow-hidden hover:shadow-md transition-shadow group flex flex-col border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img src={event.imageUrl || event.bannerUrl || '/placeholder.jpg'} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-[800] uppercase tracking-wider shadow-sm ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' :
                    event.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-[#9333EA]'
                  }`}>
                    {event.status || 'DRAFT'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-[800] text-lg text-[#111111] line-clamp-1" title={event.name}>{event.name}</h3>
                  <button className="text-gray-400 hover:text-gray-600 p-1 -mr-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-6 flex-1 mt-2">
                  <div className="flex items-center text-gray-500 text-sm font-[500]">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.dates || 'TBD'}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm font-[500]">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{event.venue || event.city || 'TBD'}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100 mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 font-[600]">Sales Progress</span>
                    <span className="font-[800] text-[#111111]">{percentSold}% Sold</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5 overflow-hidden">
                    <div className="bg-[#9333EA] h-2.5 rounded-full" style={{ width: `${percentSold}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-[800] uppercase tracking-wider">Tickets Sold</p>
                      <p className="font-[900] text-[#111111] mt-0.5">{totalSold} <span className="text-gray-400 font-[600] text-xs">/ {totalPasses}</span></p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-right">
                      <p className="text-[10px] text-gray-400 font-[800] uppercase tracking-wider">Pass Types</p>
                      <p className="font-[900] text-[#111111] mt-0.5">{(event.passes || []).length} <span className="text-gray-400 font-[600] text-xs">Types</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-200 border-dashed shadow-sm">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-[900] text-[#111111]">No assigned events found</h3>
          <p className="text-gray-500 mt-2 font-[500] max-w-sm mx-auto">Please contact the platform admin to assign events to your organizer account.</p>
        </div>
      )}
    </div>
  );
}
