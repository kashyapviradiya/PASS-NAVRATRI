import Link from 'next/link';
import { MapPin, Calendar, Ticket } from 'lucide-react';
import { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const ticketTypes = event.ticketTypes || [];
  const availableTickets = ticketTypes.filter(p => p.status === 'available' || p.status === 'published' || p.status === 'active' || p.remainingQuantity > 0);
  
  // Calculate lowest price
  let lowestPrice = 0;
  if (availableTickets.length > 0) {
    lowestPrice = Math.min(...availableTickets.map(p => p.price));
  } else if (ticketTypes.length > 0) {
    lowestPrice = Math.min(...ticketTypes.map(p => p.price));
  }

  // Calculate inventory
  const totalInventory = ticketTypes.reduce((sum, p) => sum + (p.totalInventory || 0), 0);
  const totalSold = ticketTypes.reduce((sum, p) => sum + (p.soldQuantity || 0), 0);
  const remainingQuantity = totalInventory - totalSold;
  
  const isAlmostSoldOut = remainingQuantity > 0 && remainingQuantity <= 150;
  const isSoldOut = remainingQuantity <= 0;

  return (
    <Link href={`/events/${event.id}`} className="group block bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 flex flex-col h-full">
      {/* Event Image */}
      <div className="h-56 relative overflow-hidden bg-gray-100 shrink-0">
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* City Badge Optional */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[#111111] text-[10px] uppercase tracking-wider font-[800] px-3 py-1.5 rounded-full shadow-sm">
            {event.city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Event Name */}
        <h3 className="text-xl font-sans font-[800] text-[#111111] leading-tight mb-4 group-hover:text-[#E53935] transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Venue */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm font-[600] text-[#6B7280]">
            <Calendar className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm font-[600] text-[#6B7280]">
            <MapPin className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="mt-auto">
          {/* Starting Price */}
          <div className="mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-[800] mb-0.5">Starting From</p>
            <p className="text-2xl font-[800] text-[#111111]">{formatCurrency(lowestPrice)}</p>
          </div>

          {/* Book Now Button Row */}
          <div className="flex items-center justify-between gap-3">
            <button className="bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-[800] hover:bg-black transition-colors shrink-0 shadow-sm flex items-center justify-center">
              Book Now
            </button>
            
            <div className="flex-1 text-right flex items-center justify-end gap-1.5">
              {isSoldOut ? (
                <span className="text-xs font-[800] text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md">
                  Sold Out
                </span>
              ) : isAlmostSoldOut ? (
                <span className="text-xs font-[800] text-[#E53935] flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                  🔥 Few Passes Left
                </span>
              ) : (
                <span className="text-xs font-[700] text-[#6B7280] flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                  <Ticket className="w-3.5 h-3.5" /> {remainingQuantity} Passes Remaining
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
