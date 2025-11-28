import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    // Basic filtering (non-AI) defaults
    let result = items;
    if (selectedCategory !== 'All') {
      result = result.filter(i => i.category === selectedCategory);
    }
    // Simple text match fallback
    if (searchQuery && !aiSearchActive) {
      result = result.filter(i => 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [items, selectedCategory, searchQuery, aiSearchActive]);

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiSearchActive(true);

    try {
      const matchIds = await smartSearch(searchQuery, items);
      
      let matches = items.filter(item => matchIds.includes(item.id));
      
      // If AI returns nothing, fallback to basic text search
      if (matches.length === 0) {
         matches = items.filter(i => 
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            i.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
      }

      if (selectedCategory !== 'All') {
        matches = matches.filter(i => i.category === selectedCategory);
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
    setFilteredItems(items.filter(i => selectedCategory === 'All' || i.category === selectedCategory));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Marketplace</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleSmartSearch} className="flex-grow relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? <Loader2 className="animate-spin text-indigo-500" size={20} /> : <Search className="text-slate-400" size={20} />}
              </div>
              <input
                type="text"
                placeholder="Describe what you need (e.g., 'something for my chemistry lab')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              />
              {searchQuery && (
                  <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-16 px-2 text-slate-400 hover:text-slate-600">Clear</button>
              )}
              <button 
                type="submit"
                disabled={isSearching}
                className="absolute inset-y-1 right-1 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
              >
                <Sparkles size={14} /> AI Search
              </button>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <SlidersHorizontal className="text-slate-400 flex-shrink-0" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full md:w-48 pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-slate-50"
              >
                <option value="All">All Categories</option>
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          {aiSearchActive && !isSearching && (
             <p className="mt-2 text-sm text-indigo-600 flex items-center gap-1">
               <Sparkles size={12} /> AI filtered results for "{searchQuery}"
             </p>
          )}
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No items found</h3>
            <p className="mt-1 text-slate-500">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
