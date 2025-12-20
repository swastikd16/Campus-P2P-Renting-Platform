
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { Category } from '../types';
import { smartSearch } from '../services/geminiService';

const Marketplace: React.FC = () => {
  const { items } = useApp();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearchActive, setAiSearchActive] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    let result = items;

    if (selectedCategory !== 'All') {
      result = result.filter(i => i.category === selectedCategory);
    }

    if (selectedCondition !== 'All') {
      result = result.filter(i => i.condition === selectedCondition);
    }

    if (minPrice !== '') {
      result = result.filter(i => i.pricePerDay >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(i => i.pricePerDay <= parseFloat(maxPrice));
    }

    if (searchQuery && !aiSearchActive) {
      result = result.filter(i => 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [items, selectedCategory, searchQuery, aiSearchActive, minPrice, maxPrice, selectedCondition]);

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiSearchActive(true);

    try {
      const matchIds = await smartSearch(searchQuery, items);
      let matches = items.filter(item => matchIds.includes(item.id));
      
      if (matches.length === 0) {
         matches = items.filter(i => 
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            i.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
      }
      
      setFilteredItems(matches);
    } catch (error) {
      console.error("Smart search error", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAiSearchActive(false);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setAiSearchActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marketplace</h1>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
          
          <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSmartSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? <Loader2 className="animate-spin text-indigo-500" size={20} /> : <Search className="text-slate-400" size={20} />}
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-24 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-2">
                {searchQuery && (
                  <button type="button" onClick={clearSearch} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={18} />
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 shadow-sm"
                >
                  <Sparkles size={14} /> AI
                </button>
              </div>
            </form>

            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Categories</option>
                  {Object.values(Category).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">Any Condition</option>
                  {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Daily Rent (₹)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {aiSearchActive && !isSearching && (
             <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-medium">
               <Sparkles size={14} /> Smart results for "{searchQuery}"
             </p>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No items found</h3>
            <button onClick={resetFilters} className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
