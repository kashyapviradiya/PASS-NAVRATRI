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
    // Category mapping is mocked here since schema doesn't have exact categories
    return true;
  });

  return (
    <div className="bg-navratri-bg min-h-[calc(100vh-64px)] pb-24">
      
      {/* PAGE HEADER */}
      <section className="pt-12 pb-16 border-b border-white/5 mb-10 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)' }}>
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute -top-1/2 left-1/4 w-[400px] h-[400px] bg-navratri-accent/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[36px] md:text-[52px] font-display font-[800] text-white mb-4 tracking-tight">Explore Events</h1>
          <p className="text-[18px] text-navratri-muted font-[500]">Find the best live experiences happening near you.</p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEARCH & FILTERS DESKTOP */}
        <div className="bg-white rounded-card p-5 shadow-sm border border-navratri-lightGrey mb-8 flex flex-col lg:flex-row gap-4 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #7C3AED, #FF4D6D, #00E5FF)' }}></div>
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
            <input
              type="text"
              placeholder="Search events, artists or venues"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-[16px] bg-navratri-bg border-none text-navratri-text font-[500] placeholder-navratri-muted focus:outline-none focus:ring-1 focus:ring-navratri-primary transition-all text-[15px]"
            />
          </div>

          <div className="hidden lg:flex gap-4">
            <div className="relative min-w-[200px]">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-5 pr-10 py-3.5 rounded-[16px] bg-navratri-bg border-none text-navratri-text font-[500] appearance-none focus:outline-none focus:ring-1 focus:ring-navratri-primary cursor-pointer text-[15px]"
              >
                <option value="">All Cities</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted pointer-events-none" />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-5 pr-10 py-3.5 rounded-[16px] bg-navratri-bg border-none text-navratri-text font-[500] appearance-none focus:outline-none focus:ring-1 focus:ring-navratri-primary cursor-pointer text-[15px]"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted pointer-events-none" />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full pl-5 pr-10 py-3.5 rounded-[16px] bg-navratri-bg border-none text-navratri-text font-[500] appearance-none focus:outline-none focus:ring-1 focus:ring-navratri-primary cursor-pointer text-[15px]"
              >
                {sortOptions.map(sort => <option key={sort} value={sort}>Sort: {sort}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted pointer-events-none" />
            </div>
          </div>
          
          <button 
            className="lg:hidden w-full flex justify-center items-center gap-2 py-3.5 rounded-[16px] bg-slate-50 border border-navratri-lightGrey hover:bg-white text-navratri-text font-[600] text-[15px]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
        </div>

        {/* MOBILE FILTERS */}
        {showFilters && (
          <div className="lg:hidden bg-white p-6 rounded-card shadow-sm border border-navratri-lightGrey mb-8 space-y-4 animate-fade-in-up">
            <div>
              <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">City</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-4 py-3.5 rounded-[16px] bg-navratri-bg text-navratri-text font-[500] appearance-none border-none">
                <option value="">All Cities</option>
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-[16px] bg-navratri-bg text-navratri-text font-[500] appearance-none border-none">
                <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-[700] text-navratri-muted uppercase tracking-widest mb-2 block">Sort By</label>
              <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="w-full px-4 py-3.5 rounded-[16px] bg-navratri-bg text-navratri-text font-[500] appearance-none border-none">
                {sortOptions.map(sort => <option key={sort} value={sort}>{sort}</option>)}
                </select>
            </div>
          </div>
        )}

        {/* EVENT GRID */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-3 border-navratri-primary/30 border-t-navratri-primary rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card p-16 text-center border border-navratri-lightGrey shadow-sm max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-navratri-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-navratri-muted" />
            </div>
            <h2 className="text-[28px] font-display font-[700] text-navratri-text mb-3">No Events Found</h2>
            <p className="text-navratri-muted font-[500] mb-8 text-[16px]">Try changing your filters or search for another city.</p>
            <button onClick={clearFilters} className="px-8 py-3.5 bg-gradient-premium text-white font-[700] rounded-button transition-all shadow-premium hover:shadow-lg text-[15px]">
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
