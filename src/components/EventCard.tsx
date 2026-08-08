'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
      className="block no-underline outline-none rounded-[16px] group transition-all duration-300 active:scale-[0.99] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-full flex flex-col overflow-hidden"
    >
        {/* Event Poster — 10:13 aspect ratio (≈3:4), NO overlay text */}
        <div className="relative w-full pb-[130%] overflow-hidden rounded-t-[16px] bg-slate-100">
          
          {/* Skeleton Loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-slate-200" />
          )}

          <motion.img
            src={event.bannerImage || 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=800&auto=format&fit=crop'}
            alt={event.title}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageLoaded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Status badge only for sold out / selling fast */}
          {isSoldOut && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide z-10 shadow-sm">
              Sold Out
            </div>
          )}
          {isAlmostSoldOut && !isSoldOut && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide z-10 shadow-sm">
              Selling Fast
            </div>
          )}
        </div>

        {/* Compact info below image */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Date */}
          <div className="flex items-center text-[11px] md:text-[12px] text-navratri-primary font-[700] uppercase tracking-wide mb-1">
            <span className="line-clamp-1">
              {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
              {' • '}
              {new Date(event.startDate).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
            </span>
          </div>

          {/* Event title */}
          <h3 className="text-[14px] md:text-[15px] font-[800] text-gray-900 line-clamp-2 leading-snug tracking-tight mb-0.5">
            {event.title}
          </h3>

          {/* Venue */}
          <div className="text-[12px] text-gray-500 font-medium line-clamp-1 mb-3 flex-grow">
            {event.venue}, {event.city}
          </div>

          {/* Price */}
          <div className="text-[13px] md:text-[14px] font-[800] text-gray-900 pt-2 border-t border-gray-100/60 flex justify-between items-center mt-auto">
            <span>{lowestPrice === 0 ? 'FREE' : `${formatCurrency(lowestPrice)}`}</span>
            {lowestPrice !== 0 && <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wide">Onwards</span>}
          </div>
        </div>
    </Link>
  );
}
