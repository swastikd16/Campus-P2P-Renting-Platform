
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../constants';
import { MapPin, Shield, Star, MessageSquare, AlertTriangle, CheckCircle2, Lock, X, Send, User, ChevronRight } from 'lucide-react';
import { analyzeSafety } from '../services/geminiService';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addTransaction, user, messages, sendMessage } = useApp();
  const item = items.find(i => i.id === id);
  
  const [safetyTips, setSafetyTips] = useState<string[]>([]);
  const [rentDays, setRentDays] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    if (item) {
        analyzeSafety(item).then(setSafetyTips);
    }
  }, [item]);

  if (!item) return <div className="p-20 text-center dark:text-white font-bold">Item not found</div>;

  const owner = MOCK_USERS[item.ownerId] || { name: "Campus Student", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.ownerId}`, rating: 4.5 };

  const securityDeposit = Math.ceil(item.originalPrice * 0.5);
  const totalRent = rentDays * item.pricePerDay;
  const grandTotal = totalRent + securityDeposit;

  const itemMessages = messages.filter(m => m.itemId === item.id);

  const handleRent = () => {
    if (!user) return navigate('/auth');
    addTransaction({
        id: `t${Date.now()}`,
        itemId: item.id,
        borrowerId: user.id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + rentDays * 86400000).toISOString(),
        totalPrice: grandTotal,
        status: 'PENDING'
    });
    alert(`Rental request submitted!`);
    navigate('/profile');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/auth');
    if(!chatInput.trim()) return;
    sendMessage(item.id, chatInput);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/marketplace')}>Marketplace</span>
            <ChevronRight size={14} />
            <span className="text-slate-600 dark:text-slate-300">{item.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden relative group">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-[500px] object-cover" />
                    <div className="absolute top-5 left-5 bg-slate-900/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-bold border border-white/10 flex items-center gap-2">
                        <Lock size={14} className="text-indigo-400" />
                        Deposit: ₹{securityDeposit}
                    </div>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-900/50">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="text-indigo-600 dark:text-indigo-400" size={24}/>
                        <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">Safety Checklist</h3>
                    </div>
                    <ul className="space-y-4">
                        {safetyTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
                                <div className="mt-1 bg-indigo-200 dark:bg-indigo-900 p-1 rounded-md text-indigo-700 dark:text-indigo-400"><CheckCircle2 size={14} /></div>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded uppercase tracking-tighter">{item.condition}</span>
                             </div>
                             <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{item.title}</h1>
                             <div className="flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400 text-sm">
                                <MapPin size={16} className="text-indigo-500" /> {item.location}
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                             <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">₹{item.pricePerDay}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">per day</div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 py-6">
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">About</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.description}</p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={owner.avatar} alt={owner.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800" />
                            </div>
                            <div>
                                <div className="font-black text-slate-900 dark:text-white">{owner.name}</div>
                                <div className="flex items-center text-xs font-bold text-slate-500 gap-2 mt-0.5">
                                    <span className="flex items-center gap-1 text-amber-500"><Star size={12} className="fill-amber-500"/> {owner.rating}</span>
                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                    <span>Student</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowChat(true)}
                            className="bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-3 font-bold active:scale-95"
                        >
                            <MessageSquare size={18} /> Chat
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-indigo-100 dark:border-indigo-900/30 ring-4 ring-indigo-50 dark:ring-indigo-950/20">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Duration</label>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                            <button onClick={() => setRentDays(Math.max(1, rentDays - 1))} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-black">-</button>
                            <div className="px-6 text-center font-black text-slate-900 dark:text-white">{rentDays} Day{rentDays > 1 ? 's' : ''}</div>
                            <button onClick={() => setRentDays(rentDays + 1)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-black">+</button>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8 space-y-4 font-bold border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="text-slate-900 dark:text-white">₹{totalRent}</span>
                        </div>
                        <div className="flex justify-between text-sm text-indigo-600 dark:text-indigo-400">
                            <span>Refundable Deposit</span>
                            <span>₹{securityDeposit}</span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between text-xl text-slate-900 dark:text-white font-black">
                            <span>Total</span>
                            <span className="text-indigo-600 dark:text-indigo-400">₹{grandTotal}</span>
                        </div>
                    </div>

                    {!showConfirm ? (
                        <button onClick={() => setShowConfirm(true)} className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-sm">Reserve Now</button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                             <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-400 flex gap-3 font-bold border border-amber-100">
                                <AlertTriangle size={18} className="shrink-0 text-amber-600"/>
                                <span>I understand the deposit conditions.</span>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowConfirm(false)} className="py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Back</button>
                                <button onClick={handleRent} className="py-3 rounded-2xl bg-indigo-600 dark:bg-indigo-700 text-white font-black hover:bg-indigo-700 shadow-lg active:scale-95">Accept & Request</button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {showChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 transition-all animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-slate-200 dark:border-slate-800">
                    <div className="bg-indigo-600 dark:bg-indigo-800 p-5 flex justify-between items-center text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-400 dark:bg-indigo-700 flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-wider">Lender</h3>
                            </div>
                        </div>
                        <button onClick={() => setShowChat(false)} className="hover:bg-indigo-700 dark:hover:bg-indigo-900 p-2 rounded-xl transition-colors"><X size={24}/></button>
                    </div>
                    
                    <div className="flex-grow p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto space-y-6">
                        {itemMessages.length === 0 ? (
                            <div className="text-center py-16 px-8">
                                <h4 className="font-black text-slate-800 dark:text-white mb-2">Start a Conversation</h4>
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed">Discuss pickup locations on campus.</p>
                            </div>
                        ) : (
                            itemMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1`}>
                                    <div className={`px-5 py-3 text-sm font-medium rounded-2xl shadow-sm max-w-[85%] ${
                                        msg.senderId === user?.id 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                        <div className={`text-[9px] mt-2 font-black uppercase tracking-widest ${msg.senderId === user?.id ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <form onSubmit={handleSendChat} className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-grow px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900 dark:text-white transition-all"
                            placeholder="Type a message..."
                        />
                        <button type="submit" className="bg-indigo-600 dark:bg-indigo-700 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 shrink-0">
                             <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ItemDetails;
