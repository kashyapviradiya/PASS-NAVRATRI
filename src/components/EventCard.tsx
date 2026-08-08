import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function EventCard({ event }: { event: Event }) {
  // Showmates aspect ratio is pb-[130%]
  return (
    <Link 
      href={`/events/${event.id}`}
      className="block bg-white rounded-[12px] border border-navratri-border shadow-sm flex-shrink-0 tracking-wide cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] no-underline group overflow-hidden"
    >
      <div className="relative w-full pb-[130%] overflow-hidden">
        <img 
          src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
          alt={event.title || event.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
        <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] text-navratri-primary font-[800]">
          <span className="line-clamp-1 uppercase tracking-wider">
            {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })} | {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <h3 className="text-[13px] sm:text-[15px] font-[800] text-navratri-text line-clamp-2 leading-tight">
          {event.title || event.name}
        </h3>
        
        <div className="flex items-center space-x-1 text-[11px] sm:text-[12px] text-navratri-muted font-[600] uppercase tracking-wide">
          <span className="line-clamp-1">{event.venue}, {event.city}</span>
        </div>
        
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="text-[12px] sm:text-[13px] font-[800] text-navratri-secondary">
            {formatCurrency(event.ticketTypes?.[0]?.price || 0)} onwards
          </div>
        </div>
      </div>
    </Link>
  );
}
