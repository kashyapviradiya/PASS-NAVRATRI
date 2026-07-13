'use client';

import { Info, Minus, Plus, Check, Tag } from 'lucide-react';
import { PassType } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';

interface PassSelectorProps {
  pass: PassType;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function PassSelector({ pass, quantity, onIncrement, onDecrement }: PassSelectorProps) {
  const discount = getDiscountPercentage(pass.originalPrice, pass.price);
  const isLowStock = pass.available < 100;
  const isSoldOut = pass.available === 0;

  return (
    <div className={`border-2 rounded-2xl p-5 transition-all duration-300 ${
      isSoldOut 
        ? 'border-gray-200 bg-gray-50 opacity-60' 
        : quantity > 0 
          ? 'border-[#9333EA] bg-[#9333EA]/5 shadow-md shadow-purple-500/10' 
          : 'border-gray-200 bg-white hover:border-[#111111]/30'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-gray-900">{pass.name}</h3>
            {discount > 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />{discount}% OFF
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-[800] text-[#111111]">{formatCurrency(pass.price)}</span>
            {pass.originalPrice > pass.price && (
              <span className="text-sm text-gray-400 line-through font-[600]">{formatCurrency(pass.originalPrice)}</span>
            )}
          </div>
        </div>

        {!isSoldOut && (
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button 
              onClick={onDecrement}
              disabled={quantity === 0}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-[#9333EA] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-lg">{quantity}</span>
            <button 
              onClick={onIncrement}
              disabled={quantity >= pass.maxPerUser || quantity >= pass.available}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-[#9333EA] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
        {isSoldOut && (
          <span className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl">Sold Out</span>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        {pass.benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-[#6B7280] font-[500]">
            <Check className="w-3.5 h-3.5 text-[#9333EA] flex-shrink-0" />
            {benefit}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" /> Max {pass.maxPerUser} per person
        </span>
        <span className={isLowStock ? 'text-red-500 font-bold animate-pulse' : 'text-gray-500'}>
          {pass.available.toLocaleString()} remaining
        </span>
      </div>
    </div>
  );
}
