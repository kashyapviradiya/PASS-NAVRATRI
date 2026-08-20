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

  let filteredEvents = events.filter(e => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const searchString = `
        ${e.title || ''} 
        ${e.category || ''} 
        ${e.venue || ''} 
        ${e.city || ''} 
        ${e.organizer || ''}
        ${Array.isArray(e.artists) ? e.artists.join(' ') : ''}
      `.toLowerCase();
      if (!searchString.includes(q)) return false;
    }
    if (selectedCity && e.city !== selectedCity) return false;
    return true;
  });

  return (
    <div className="bg-navratri-bg min-h-screen pb-20 md:pb-0 font-sans">
      
      {/* STICKY FILTER BAR */}
      <div className="sticky top-[50px] md:top-[60px] z-40 bg-navratri-bg/95 backdrop-blur-md border-b border-navratri-border py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-auto flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
              <input
                type="text"
                placeholder="Search events or artists"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-11"
              />
            </div>
            
            <div className="w-full md:w-48 relative shrink-0">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field w-full appearance-none pr-10"
              >
                <option value="">All Cities</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navratri-muted pointer-events-none" />
            </div>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === '' 
                  ? 'bg-navratri-primary text-white' 
                  : 'bg-white text-navratri-text border border-navratri-border hover:border-navratri-primary'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-navratri-primary text-white' 
                    : 'bg-white text-navratri-text border border-navratri-border hover:border-navratri-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* RESULTS HEADER */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h1 className="section-heading mb-1 text-navratri-dark">Explore Events</h1>
            <p className="text-navratri-muted text-sm font-medium">
              {!loading ? `Showing ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}` : 'Loading events...'}
            </p>
          </div>
        </div>

        {/* EVENT GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-card p-3 border border-navratri-border shadow-card">
                <div className="skeleton aspect-[3/4] w-full rounded-2xl mb-4"></div>
                <div className="skeleton h-5 w-3/4 mb-2 rounded"></div>
                <div className="skeleton h-4 w-1/2 mb-3 rounded"></div>
                <div className="skeleton h-8 w-full rounded-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card p-12 text-center border border-navratri-border shadow-card max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-navratri-bg rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="w-6 h-6 text-navratri-primary" />
            </div>
            <h2 className="text-xl font-bold text-navratri-dark mb-3">No Events Found</h2>
            <p className="text-navratri-muted mb-8">We couldn't find any events matching your current filters. Try adjusting your search criteria.</p>
            <button onClick={clearFilters} className="btn-primary w-full md:w-auto">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
