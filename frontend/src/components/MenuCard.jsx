// components/MenuCard.jsx
import { useState } from 'react';

export default function MenuCard({ item, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleAdd() {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-stone-100 flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        {!imgError ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-stone-600 px-2 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-['Playfair_Display'] font-semibold text-[#1a1a1a] text-base leading-snug">
            {item.name}
          </h3>
          <span className="font-bold text-[#D85A30] whitespace-nowrap text-sm mt-0.5">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-stone-500 text-xs leading-relaxed flex-1 mb-4">
          {item.description}
        </p>
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            added
              ? 'bg-emerald-500 text-white scale-95'
              : 'bg-[#D85A30] hover:bg-[#c04f28] text-white hover:scale-[1.02]'
          }`}
        >
          {added ? '✓ Added!' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// Skeleton loader
export function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
      <div className="h-48 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-5/6" />
        <div className="h-10 skeleton rounded-xl mt-4" />
      </div>
    </div>
  );
}
