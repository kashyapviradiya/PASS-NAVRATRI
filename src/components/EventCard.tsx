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

  const progress = totalInventory > 0 ? ((totalSold / totalInventory) * 100) : 0;

  return (
    <Link href={`/events/${event.id}`} className="group block bg-white rounded-card shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-500 hover:-translate-y-2.5 border border-navratri-lightGrey flex flex-col h-full relative z-10">
      {/* Event Image */}
      <div className="aspect-[16/9] relative overflow-hidden bg-navratri-lightGrey shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {isSoldOut ? (
            <span className="bg-red-500/90 backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-[700] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              Sold Out
            </span>
          ) : isAlmostSoldOut ? (
            <span className="bg-orange-500/90 backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-[700] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse-slow">
              Selling Fast
            </span>
          ) : (
            <span className="backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-[700] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}>
              Available
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-white/95 backdrop-blur-md text-navratri-text text-[11px] uppercase tracking-wider font-[700] px-3 py-1.5 rounded-full shadow-sm border border-white/20 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {event.city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1 relative bg-white">
        
        {/* Event Name */}
        <h3 className="text-[22px] font-display font-[800] text-navratri-text leading-snug mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-premium transition-all line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Venue */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-[14px] font-[500] text-navratri-muted">
            <Calendar className="w-4 h-4 mr-3 text-navratri-primary shrink-0" />
            <span>{new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-[14px] font-[500] text-navratri-muted">
            <MapPin className="w-4 h-4 mr-3 text-navratri-primary shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="mt-auto">
          {/* Progress Bar for Tickets */}
          <div className="mb-6 space-y-1.5">
            <div className="flex justify-between text-[11px] font-[700] uppercase tracking-widest text-navratri-muted">
              <span>{isSoldOut ? '0 Tickets Left' : `${remainingQuantity} Tickets Left`}</span>
              <span className="text-navratri-primary">{Math.round(progress)}% Sold</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-premium rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Starting Price & Action */}
          <div className="flex items-end justify-between pt-4 border-t border-navratri-lightGrey/50">
            <div>
              <p className="text-[10px] text-navratri-muted uppercase tracking-widest font-[700] mb-0.5">From</p>
              <p className="text-[26px] font-display font-[800] text-navratri-text">{formatCurrency(lowestPrice)}</p>
            </div>
            
            <div className="w-11 h-11 rounded-full bg-navratri-bg border border-navratri-lightGrey flex items-center justify-center group-hover:bg-navratri-primary group-hover:border-navratri-primary group-hover:shadow-glow-purple transition-all duration-300">
              <Ticket className="w-4 h-4 text-navratri-muted group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
