import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, Clock, ShieldCheck, Settings, Lock } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, items, transactions } = useApp();
  
  const myItems = items.filter(i => i.ownerId === user.id);
  const myRentals = transactions.filter(t => t.borrowerId === user.id);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-indigo-50" />
                {user.isVerified && (
                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Verified Student">
                        <ShieldCheck size={14} />
                    </div>
                )}
            </div>
            <div className="text-center md:text-left flex-grow">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-slate-500 text-sm mb-2">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">Rating: {user.rating}/5.0</span>
                    <span className="text-slate-400">Verified Member</span>
                </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2">
                <Settings size={20} />
            </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
             <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">My Activity</h2>
                
                <div className="space-y-8">
                    
                    {/* Listings Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                             <Package size={20} className="text-indigo-600"/>
                             <h3 className="font-semibold text-slate-800">Items I'm Lending</h3>
                        </div>
                        {myItems.length > 0 ? (
                            <div className="grid gap-4">
                                {myItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                                        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
                                        <div className="flex-grow">
                                            <h4 className="font-medium text-slate-900">{item.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {item.isAvailable ? 'Available' : 'Currently Rented'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-700">₹{item.pricePerDay}/day</div>
                                            <div className="text-xs text-slate-400">MRP ₹{item.originalPrice}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">You haven't listed any items yet.</p>
                        )}
                    </div>

                     {/* Rentals Section */}
                     <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                             <Clock size={20} className="text-emerald-600"/>
                             <h3 className="font-semibold text-slate-800">My Rentals & Returns</h3>
                        </div>
                        {myRentals.length > 0 ? (
                             <div className="grid gap-4">
                                {myRentals.map(t => {
                                    const rItem = items.find(i => i.id === t.itemId);
                                    if(!rItem) return null;
                                    const deposit = (rItem.originalPrice * 0.5).toFixed(0);
                                    return (
                                        <div key={t.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                                            <img src={rItem.imageUrl} alt={rItem.title} className="w-16 h-16 rounded-md object-cover grayscale" />
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-slate-900">{rItem.title}</h4>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Return Deadline: <span className="font-semibold text-red-500">{new Date(t.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                                                    <Lock size={10} /> Deposit Locked: ₹{deposit}
                                                </div>
                                            </div>
                                            <div className="text-right w-full sm:w-auto">
                                                <div className="text-xs text-amber-600 font-medium uppercase mb-1">{t.status}</div>
                                                <div className="font-bold text-slate-900 text-lg">₹{t.totalPrice}</div>
                                                <div className="text-[10px] text-slate-400">Total Paid (Inc. Deposit)</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">No active rentals.</p>
                        )}
                    </div>

                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;