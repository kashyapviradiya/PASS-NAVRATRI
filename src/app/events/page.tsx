'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { DEMO_EVENTS, CITIES } from '@/lib/demo-data';
import type { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

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
    // Category mapping is mocked here since schema doesn't have exact categories
    return true;
  });

  return (
    <div className="bg-[#F7F7F8] min-h-screen pt-[100px] pb-20 font-sans">
      
      {/* PAGE HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-[800] text-[#111111] mb-4 tracking-tight">Explore Events</h1>
        <p className="text-lg text-[#6B7280] font-[500]">Find the best live experiences happening near you.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEARCH & FILTERS DESKTOP */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4">
          
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, artists or venues"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 transition-all"
            />
          </div>

          <div className="hidden lg:flex gap-4">
            <div className="relative min-w-[200px]">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] appearance-none focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 cursor-pointer"
              >
                <option value="">All Cities</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] appearance-none focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] appearance-none focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 cursor-pointer"
              >
                {sortOptions.map(sort => <option key={sort} value={sort}>Sort by: {sort}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <button 
            className="lg:hidden w-full flex justify-center items-center gap-2 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[800]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
        </div>

        {/* MOBILE FILTERS */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-4"
            >
              <div>
                <label className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2 block">City</label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] appearance-none">
                  <option value="">All Cities</option>
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] appearance-none">
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-[800] text-gray-400 uppercase tracking-widest mb-2 block">Sort By</label>
                <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F8] text-[#111111] font-[600] appearance-none">
                  {sortOptions.map(sort => <option key={sort} value={sort}>{sort}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EVENT GRID */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto mt-12">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-3xl font-[800] text-[#111111] mb-4">No Events Found</h2>
            <p className="text-[#6B7280] font-[500] mb-8">Try changing your filters or search for another city.</p>
            <button onClick={clearFilters} className="px-8 py-4 bg-[#E53935] text-white font-[800] rounded-2xl hover:bg-[#D32F2F] hover:-translate-y-0.5 transition-all shadow-lg">
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
