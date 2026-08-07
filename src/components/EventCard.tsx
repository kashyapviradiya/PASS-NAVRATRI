import Link from 'next/link';
import { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const ticketTypes = event.ticketTypes || [];
  const availableTickets = ticketTypes.filter(p => p.status === 'available' || p.status === 'published' || p.status === 'active' || p.remainingQuantity > 0);
  
  let lowestPrice = 0;
  if (availableTickets.length > 0) {
    lowestPrice = Math.min(...availableTickets.map(p => p.price));
  } else if (ticketTypes.length > 0) {
    lowestPrice = Math.min(...ticketTypes.map(p => p.price));
  }

  const totalInventory = ticketTypes.reduce((sum, p) => sum + (p.totalInventory || 0), 0);
  const totalSold = ticketTypes.reduce((sum, p) => sum + (p.soldQuantity || 0), 0);
  const remainingQuantity = totalInventory - totalSold;
  const isSoldOut = remainingQuantity <= 0;
  const isAlmostSoldOut = remainingQuantity > 0 && remainingQuantity <= 150;

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] no-underline overflow-hidden"
    >
      {/* Event Poster — 10:13 aspect ratio (≈3:4), NO overlay text */}
      <div className="relative w-full pb-[130%] overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=800&auto=format&fit=crop'}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Status badge only for sold out / selling fast */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
            Sold Out
          </div>
        )}
        {isAlmostSoldOut && !isSoldOut && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
            Selling Fast
          </div>
        )}
      </div>

      {/* Compact info below image */}
      <div className="p-2.5 space-y-1.5">
        {/* Date */}
        <div className="flex items-center text-[12px] text-emerald-700 font-semibold">
          <span className="line-clamp-1">
            {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
            {' | '}
            {new Date(event.startDate).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
        </div>

        {/* Event title */}
        <h3 className="text-[13px] sm:text-[14px] font-bold text-gray-900 line-clamp-2 leading-snug">
          {event.title}
        </h3>

        {/* Venue */}
        <div className="text-[11px] text-gray-500 font-semibold line-clamp-1">
          {event.venue}, {event.city}
        </div>

        {/* Price */}
        <div className="text-[12px] sm:text-[13px] font-bold text-gray-600">
          {lowestPrice === 0 ? 'FREE' : `${formatCurrency(lowestPrice)} onwards`}
        </div>
      </div>
    </Link>
  );
}
