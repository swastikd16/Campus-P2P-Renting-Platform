
import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, Clock, ShieldCheck, Settings, Lock, IndianRupee, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, items, transactions } = useApp();
  
  if (!user) return null;

  const myItems = items.filter(i => i.ownerId === user.id);
  const myRentals = transactions.filter(t => t.borrowerId === user.id);

  // Stats calculation
  const totalEarned = myItems.reduce((acc, item) => {
    const itemTransactions = transactions.filter(t => t.itemId === item.id && t.status === 'COMPLETED');
    return acc + itemTransactions.reduce((tAcc, t) => tAcc + t.totalPrice, 0);
  }, 0);

  const activeRentalsCount = myRentals.filter(t => t.status === 'ACTIVE').length;
  const myItemsCount = myItems.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Profile Card */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full border-4 border-indigo-50 dark:border-indigo-900 shadow-sm" />
                  {user.isVerified && (
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900" title="Verified NIT Raipur Student">
                      <ShieldCheck size={16} />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">{user.email}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold border border-amber-100 dark:border-amber-900/50">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    {user.rating.toFixed(1)}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">54 Transactions</span>
                </div>

                <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Settings size={18} /> Edit Profile Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mb-2">
                    <IndianRupee size={18} />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">₹{totalEarned}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Earned</div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-2">
                    <TrendingUp size={18} />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{myItemsCount}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Listings</div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Active Lending Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Package className="text-indigo-600 dark:text-indigo-400" size={24}/>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">My Lending Items</h3>
                </div>
                <Link to="/add-item" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">+ List New</Link>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {myItems.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {myItems.map(item => (
                      <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.isAvailable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {item.isAvailable ? 'Available' : 'Rented'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">₹{item.pricePerDay}/day</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Settings size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-slate-400 text-sm">You haven't listed any items for rent yet.</p>
                    <Link to="/add-item" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">Start Earning</Link>
                  </div>
                )}
              </div>
            </section>

            {/* Rentals & Returns Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-emerald-600 dark:text-emerald-400" size={24}/>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Active Rentals & Returns</h3>
              </div>
              
              <div className="space-y-4">
                {myRentals.length > 0 ? (
                  myRentals.map(t => {
                    const rItem = items.find(i => i.id === t.itemId);
                    if(!rItem) return null;
                    const isDueSoon = new Date(t.endDate).getTime() - Date.now() < 86400000;
                    
                    return (
                      <div key={t.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                          <img src={rItem.imageUrl} alt={rItem.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{rItem.title}</h4>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">₹{t.totalPrice}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500"><Clock size={14} /></div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Return Date</p>
                                <p className={`font-bold ${isDueSoon ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{new Date(t.endDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500"><Lock size={14} /></div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Safety Deposit</p>
                                <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{(rItem.originalPrice * 0.5).toFixed(0)} (Locked)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-auto self-stretch flex items-end">
                           <button className="w-full md:w-auto px-6 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all">Mark as Returned</button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                    <p className="text-slate-400 text-sm">No active rentals or pending returns found.</p>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
