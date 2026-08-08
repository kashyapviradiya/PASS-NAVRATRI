import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function EventCard({ event }: { event: Event }) {
  // Showmates aspect ratio is pb-[130%]
  return (
    <Link 
      href={`/events/${event.id}`}
      className="block bg-white rounded-[16px] border border-gray-100 shadow-sm flex-shrink-0 tracking-wide cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] no-underline group"
    >
      <div className="relative w-full pb-[130%] overflow-hidden rounded-t-xl">
        <img 
          src={event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg'} 
          alt={event.title || event.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-3 space-y-2">
        <div className="flex items-center space-x-1 text-[13px] text-green-700 font-[700]">
          <span className="line-clamp-1 uppercase tracking-wider">
            {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })} | {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <h3 className="text-[14px] sm:text-[16px] font-[800] text-gray-900 line-clamp-2 leading-tight">
          {event.title || event.name}
        </h3>
        
        <div className="flex items-center space-x-1 text-[12px] text-gray-500 font-[600]">
          <span className="line-clamp-1">{event.venue}, {event.city}</span>
        </div>
        
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="text-[13px] sm:text-[14px] font-[800] text-gray-600">
            {formatCurrency(event.ticketTypes?.[0]?.price || 0)} onwards
          </div>
        </div>
      </div>
    </Link>
  );
}
