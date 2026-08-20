'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Calendar, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Event } from '@/types';

export default function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all events once when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Autofocus input
      setTimeout(() => inputRef.current?.focus(), 100);

      if (events.length === 0) {
        setLoading(true);
        fetch('/api/get-events')
          .then(res => res.json())
          .then(data => {
            if (data.success && data.events) {
              setEvents(data.events);
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      }
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter events client-side based on the query
  const filteredEvents = query.trim() === '' 
    ? [] 
    : events.filter(e => {
        const q = query.toLowerCase().trim();
        const searchString = `
          ${e.title || ''} 
          ${e.category || ''} 
          ${e.venue || ''} 
          ${e.city || ''} 
          ${e.organizer || ''}
          ${Array.isArray(e.artists) ? e.artists.join(' ') : ''}
        `.toLowerCase();
        return searchString.includes(q);
      });

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-navratri-dark/95 backdrop-blur-md sm:p-4">
      {/* Search Container */}
      <div className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-navratri-bg sm:rounded-card shadow-elevated flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header / Input Area */}
        <div className="flex items-center gap-3 p-4 border-b border-navratri-border bg-white shrink-0 relative z-10 shadow-sm">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-navratri-primary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists, venues..."
              className="w-full pl-12 pr-10 py-3.5 bg-navratri-bg border border-transparent rounded-xl text-base font-medium text-navratri-text focus:outline-none focus:bg-white focus:border-navratri-primary/30 focus:ring-2 focus:ring-navratri-primary/10 transition-all placeholder:text-navratri-muted/60"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 p-1.5 rounded-full bg-navratri-border text-navratri-text hover:bg-navratri-border/80 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white border border-navratri-border hover:bg-navratri-softBg text-navratri-text rounded-xl font-semibold text-sm transition-colors whitespace-nowrap shadow-xs"
          >
            Cancel
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto bg-navratri-softBg/50 p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-navratri-muted">
              <Loader2 className="w-8 h-8 animate-spin text-navratri-primary mb-4" />
              <p className="font-semibold text-sm">Searching catalog...</p>
            </div>
          ) : query.trim() === '' ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-navratri-border shadow-sm">
                <Search className="w-6 h-6 text-navratri-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-navratri-dark mb-2">Find your next experience</h3>
              <p className="text-sm font-medium text-navratri-muted max-w-sm mx-auto">
                Search for events by name, category, venue, city, or artist.
              </p>
              
              {/* Trending */}
              {events.length > 0 && (
                <div className="mt-10 text-left">
                  <p className="input-label ml-2">Trending Now</p>
                  <div className="flex flex-col gap-2">
                    {events.slice(0, 3).map(e => (
                      <Link 
                        key={`trend-${e.id}`} 
                        href={`/events/${e.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 bg-white rounded-xl border border-navratri-border hover:border-navratri-primary/30 hover:shadow-sm transition-all"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                          <img src={e.bannerImage || e.bannerUrl || '/demo/events/poster_navratri.jpg'} alt={e.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-navratri-dark truncate">{e.title}</h4>
                          <p className="text-xs text-navratri-muted font-medium truncate mt-0.5">{e.city || 'Ahmedabad'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-16 px-6 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-navratri-border shadow-sm">
                <X className="w-6 h-6 text-navratri-muted" />
              </div>
              <h3 className="text-lg font-display font-bold text-navratri-dark mb-2">No events found</h3>
              <p className="text-sm font-medium text-navratri-muted max-w-sm mx-auto">
                Try another event name, category or venue.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-fade-in-up">
              <p className="input-label ml-2">
                Results ({filteredEvents.length})
              </p>
              {filteredEvents.map((event) => {
                const startingPrice = Math.min(...(event.ticketTypes?.map(t => t.price) || [0]));
                
                return (
                  <Link 
                    key={event.id}
                    href={`/events/${event.id}`}
                    onClick={onClose}
                    className="group card-interactive flex gap-4 items-center p-3"
                  >
                    {/* Poster */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-navratri-softBg relative">
                      <img 
                        src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="font-bold text-base text-navratri-dark mb-1.5 truncate group-hover:text-navratri-primary transition-colors">
                        {event.title}
                      </h4>
                      
                      <div className="flex flex-col gap-1.5 text-xs font-medium text-navratri-muted">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 text-navratri-primary shrink-0" />
                          <span className="truncate">
                            {new Date(event.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                            {event.endDate && event.endDate !== event.startDate ? ` - ${new Date(event.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-navratri-primary shrink-0" />
                          <span className="truncate">{event.venue}, {event.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 pr-2">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-navratri-muted">From</p>
                        <p className="font-bold text-base text-navratri-primary">
                          {startingPrice > 0 ? `₹${startingPrice}` : 'Free'}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-navratri-softBg flex items-center justify-center text-navratri-primary group-hover:bg-navratri-primary group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
