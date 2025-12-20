
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, DollarSign, Leaf, Lock, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

const Home: React.FC = () => {
  const { items, user } = useApp();
  const featuredItems = items.filter(i => i.isAvailable).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <div className="bg-indigo-700 dark:bg-indigo-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Campus P2P Renting <br />
              <span className="text-indigo-300 dark:text-indigo-400">NIT Raipur's Student Hub.</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 dark:text-indigo-200 mb-8 max-w-2xl font-medium">
              Join the official peer-to-peer marketplace exclusive for NIT Raipur students. Rent textbooks, lab gear, and more safely with zero middleman fees.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-black/10 flex items-center gap-2 active:scale-95">
                Browse Marketplace <ArrowRight size={18} />
              </Link>
              {!user ? (
                <Link to="/auth" className="bg-indigo-600 border border-indigo-400 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 active:scale-95">
                  Join Community <UserPlus size={18} />
                </Link>
              ) : (
                <Link to="/add-item" className="bg-indigo-600 border border-indigo-400 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95">
                  Lend an Item
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl transition-colors">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Student Access</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Exclusive access for NIT Raipur students via official domain mail.</p>
            </div>
             <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl transition-colors">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Safety Deposits</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Refundable security deposits ensure items are treated with care.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl transition-colors">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <DollarSign size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Direct Chat</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Secure messaging for students to negotiate and meet on campus.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl transition-colors">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Save & Earn</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Turn your idle lab equipment and books into a source of income.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Hot on Campus</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Latest essential listings for your current semester.</p>
          </div>
          <Link to="/marketplace" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-sm hidden sm:flex items-center gap-1 group">
            View full marketplace <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
