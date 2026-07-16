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
    <Link href={`/events/${event.id}`} className="group block bg-white rounded-card overflow-hidden transition-all duration-300 hover:shadow-card border border-navratri-lightGrey flex flex-col h-full">
      {/* Event Image */}
      <div className="aspect-[16/10] relative overflow-hidden bg-navratri-lightGrey shrink-0">
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* City Badge Optional */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-navratri-text text-[11px] uppercase tracking-wider font-[700] px-3 py-1.5 rounded-full shadow-sm">
            {event.city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Event Name */}
        <h3 className="text-[20px] font-display font-[700] text-navratri-text leading-snug mb-4 group-hover:text-navratri-accent transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Venue */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-[14px] font-[500] text-navratri-muted">
            <Calendar className="w-4 h-4 mr-3 text-navratri-muted/70 shrink-0" />
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-[14px] font-[500] text-navratri-muted">
            <MapPin className="w-4 h-4 mr-3 text-navratri-muted/70 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="mt-auto">
          {/* Starting Price */}
          <div className="mb-5">
            <p className="text-[11px] text-navratri-muted uppercase tracking-widest font-[700] mb-1">Starting From</p>
            <p className="text-[22px] font-display font-[700] text-navratri-text">{formatCurrency(lowestPrice)}</p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-navratri-lightGrey/50">
            <span className="text-navratri-accent text-[14px] font-[600] group-hover:text-navratri-darkAccent transition-colors">
              View Event &rarr;
            </span>
            
            <div className="text-right">
              {isSoldOut ? (
                <span className="text-[12px] font-[600] text-navratri-muted uppercase tracking-wider bg-navratri-lightGrey/50 px-2.5 py-1 rounded-md">
                  Sold Out
                </span>
              ) : isAlmostSoldOut ? (
                <span className="text-[12px] font-[600] text-navratri-accent flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-md">
                  🔥 Few Passes Left
                </span>
              ) : (
                <span className="text-[12px] font-[500] text-navratri-muted flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" /> {remainingQuantity} Remaining
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
