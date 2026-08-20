import Link from 'next/link';
import type { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function EventCard({ event }: { event: Event }) {
  const imageUrl = event.bannerImage || event.bannerUrl || '/demo/events/poster_navratri.jpg';
  const title = event.title || event.name;
  
  // Format date 'DD MMM'
  const dateObj = new Date(event.startDate);
  const dateDay = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const dateMonth = dateObj.toLocaleDateString('en-US', { month: 'short' });
  
  // Minimum price
  const pricingArray = event.ticketTypes || event.passes || [];
  const minPrice = pricingArray.length > 0 
    ? Math.min(...pricingArray.map((t: any) => t.price || 0)) 
    : 0;
    
  // Selling Fast badge
  const isSellingFast = event.ticketTypes?.some((t: any) => (t.remainingQuantity || 0) < 50);

  return (
    <Link 
      href={`/events/${event.id}`}
      className="group block w-full transition-all duration-300 hover:-translate-y-[2px]"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        <img 
          src={imageUrl} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-navratri-dark">{dateDay} {dateMonth}</span>
        </div>
      </div>
      
      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-navratri-dark line-clamp-2 leading-tight">
          {title}
        </h3>
        <div className="text-xs text-navratri-muted font-medium truncate mt-0.5">
          {event.venue}, {event.city}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm font-bold text-navratri-primary">
            {formatCurrency(minPrice)} onwards
          </div>
          {isSellingFast && (
            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm">
              Selling Fast
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
