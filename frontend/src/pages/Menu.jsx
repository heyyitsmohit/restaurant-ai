// pages/Menu.jsx
import { useState } from 'react';
import { useMenu } from '../hooks/useMenu';
import MenuCard, { MenuCardSkeleton } from '../components/MenuCard';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export default function Menu({ onAddToCart, onCartOpen, cartCount }) {
  const { items, loading, error } = useMenu();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf7f4] pt-16">
      {/* Hero banner */}
      <div className="bg-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-[#D85A30] text-xs font-bold uppercase tracking-widest">Our Kitchen</span>
        <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-white mt-2 mb-3">
          The Menu
        </h1>
        <p className="text-stone-400 text-base max-w-md mx-auto">
          Seasonally inspired, carefully crafted. Updated each week to feature the best local produce.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter + Search bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#D85A30] text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-[#D85A30] hover:text-[#D85A30]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 focus:border-[#D85A30]"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            ⚠ Could not load menu from server. Showing demo items.
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-stone-600 font-medium">No dishes found</p>
            <p className="text-stone-400 text-sm mt-1">Try a different filter or search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => (
              <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart button (mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 sm:hidden z-40">
          <button
            onClick={onCartOpen}
            className="bg-[#D85A30] text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            View Cart ({cartCount})
          </button>
        </div>
      )}
    </div>
  );
}
