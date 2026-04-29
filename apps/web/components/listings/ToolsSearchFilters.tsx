'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface ToolsSearchFiltersProps {
  categories: { name: string; slug: string }[];
}

export default function ToolsSearchFilters({ categories }: ToolsSearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'relevance';

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (activeCategory) params.set('category', activeCategory);
    if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);
    
    const queryStr = params.toString();
    router.push(`/tools${queryStr ? `?${queryStr}` : ''}`, { scroll: false });
  }, [debouncedSearchQuery, activeCategory, sortBy, router]);

  const toggleCategory = (slug: string) => {
    setActiveCategory(prev => prev === slug ? '' : slug);
  };

  return (
    <>
      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 focus-within:border-brand-300 focus-within:shadow-lg focus-within:shadow-brand-500/10 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search by name, brand, or category..." 
            className="flex-1 bg-transparent outline-none text-sm text-dark-900 placeholder:text-gray-400" 
            id="browse-search" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary !px-5">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <div className="relative">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="appearance-none btn-secondary !pr-10 cursor-pointer w-full" 
            id="browse-sort"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Filter chips */}
      {filtersOpen && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <button 
                key={cat.slug} 
                onClick={() => toggleCategory(cat.slug)}
                className={`px-4 py-2.5 text-sm rounded-xl border transition-all ${
                  activeCategory === cat.slug 
                    ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium' 
                    : 'border-gray-200 text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {['Delivery Available','Instant Book','Like New Only','Under $20/day','Under $50/day'].map((f) => (
              <button key={f} className="px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-500 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-all">
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
