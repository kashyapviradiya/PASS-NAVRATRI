'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { DEMO_EVENTS, CITIES } from '@/lib/demo-data';
import type { Event } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/api/get-events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events) {
          setEvents(data.events);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'Garba & Navratri',
    'Music',
    'Comedy',
    'Cultural',
    'College Events',
    'Family Events'
  ];

  const sortOptions = [
    'Popular',
    'Date: Soonest',
    'Price: Low to High',
    'Price: High to Low'
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedSort('Popular');
  };

  // Mock filtering
  let filteredEvents = events.filter(e => {
    if (searchQuery && !e.title?.toLowerCase().includes(searchQuery.toLowerCase()) && !e.venue?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCity && e.city !== selectedCity) return false;
    return true;
  });

  return (
    <div className="bg-white min-h-[calc(100vh-50px)] pb-24">
      
      {/* COMPACT SEARCH & FILTERS */}
      <div className="sticky top-[50px] md:top-[60px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-3 mb-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events or artists"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-[12px] bg-slate-100 border-none text-gray-900 font-[600] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-navratri-primary transition-all text-[13px]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <div className="relative min-w-[120px] shrink-0">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-[12px] bg-slate-100 border-none text-gray-900 font-[600] appearance-none focus:outline-none cursor-pointer text-[13px]"
              >
                <option value="">All Cities</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[130px] shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-[12px] bg-slate-100 border-none text-gray-900 font-[600] appearance-none focus:outline-none cursor-pointer text-[13px]"
              >
                <option value="">Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <h1 className="text-[20px] md:text-[24px] font-[800] text-gray-900 mb-4 tracking-tight">Explore Events</h1>

        {/* EVENT GRID */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-3 border-navratri-primary/30 border-t-navratri-primary rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 md:gap-x-5 md:gap-y-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[20px] p-10 text-center border border-gray-100 max-w-lg mx-auto mt-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-[18px] font-[800] text-gray-900 mb-2">No Events Found</h2>
            <p className="text-gray-500 font-[500] mb-6 text-[13px]">Try changing your filters or search for another city.</p>
            <button onClick={clearFilters} className="px-6 py-2 bg-gray-900 text-white font-[700] rounded-full active:scale-95 transition-transform text-[13px]">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
