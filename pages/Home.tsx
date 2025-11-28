import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, DollarSign, Leaf, Lock } from 'lucide-react';
import { Category } from '../types';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

const Home: React.FC = () => {
  const { items } = useApp();
  const featuredItems = items.filter(i => i.isAvailable).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="lg:w-2/3">
            <div className="inline-block px-3 py-1 bg-indigo-800 rounded-full text-indigo-200 text-sm font-semibold mb-4 border border-indigo-500">
                Created by CipherOps
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Campus P2P Renting <br />
              <span className="text-indigo-300">Verified & Secure.</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl">
              The official P2P platform for students. Rent calculators, books, and gear with 50% security deposit protection and automated return deadlines.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
                Find Items <ArrowRight size={18} />
              </Link>
              <Link to="/add-item" className="bg-indigo-600 border border-indigo-400 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                List an Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">College ID Verified</h3>
              <p className="text-slate-600 text-sm">Every user is verified via their official college email ID.</p>
            </div>
             <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Security Deposit</h3>
              <p className="text-slate-600 text-sm">50% MRP is locked as a refundable security deposit for safety.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-slate-600 text-sm">Affordable daily rates (₹) with clear return deadlines.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Handover</h3>
              <p className="text-slate-600 text-sm">Designated pickup zones inside campus for safe exchanges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Listings</h2>
            <p className="text-slate-500 mt-2">Popular items available for rent now.</p>
          </div>
          <Link to="/marketplace" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hidden sm:block">
            View all &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/marketplace" className="text-indigo-600 font-medium">View all items &rarr;</Link>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.values(Category).map((cat) => (
                <Link to={`/marketplace?category=${encodeURIComponent(cat)}`} key={cat} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group">
                  <div className="font-medium text-slate-700 group-hover:text-indigo-600">{cat}</div>
                </Link>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;