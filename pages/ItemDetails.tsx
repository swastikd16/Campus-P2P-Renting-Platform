import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../constants';
import { MapPin, Shield, Star, MessageSquare, AlertTriangle, CheckCircle2, Lock, IndianRupee, X } from 'lucide-react';
import { analyzeSafety } from '../services/geminiService';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addTransaction, user } = useApp();
  const item = items.find(i => i.id === id);
  
  const [safetyTips, setSafetyTips] = useState<string[]>([]);
  const [rentDays, setRentDays] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string}[]>([]);

  useEffect(() => {
    if (item) {
        analyzeSafety(item).then(setSafetyTips);
    }
  }, [item]);

  if (!item) return <div className="p-8 text-center">Item not found</div>;

  const owner = MOCK_USERS[item.ownerId] || MOCK_USERS['u2']; // Fallback

  const securityDeposit = Math.ceil(item.originalPrice * 0.5);
  const totalRent = rentDays * item.pricePerDay;
  const grandTotal = totalRent + securityDeposit;

  const handleRent = () => {
    addTransaction({
        id: `t${Date.now()}`,
        itemId: item.id,
        borrowerId: user.id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + rentDays * 86400000).toISOString(),
        totalPrice: grandTotal, // Saving grand total including deposit for simplicity
        status: 'PENDING'
    });
    alert(`Rental request sent! Deposit of ₹${securityDeposit} will be locked.`);
    navigate('/profile');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if(!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { sender: 'Me', text: chatMessage }]);
    setChatMessage("");
    // Simulate reply
    setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: 'Owner (Masked)', text: 'Hi! Yes, it is available. We can meet at the library.' }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Image & Tips */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-96 object-cover" />
                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-1">
                        <Lock size={14} />
                        Deposit: ₹{securityDeposit}
                    </div>
                </div>
                
                {/* AI Safety Tips */}
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="text-indigo-600" size={20}/>
                        <h3 className="font-semibold text-indigo-900">CipherOps Safety & AI Tips</h3>
                    </div>
                    {safetyTips.length > 0 ? (
                        <ul className="space-y-2">
                            {safetyTips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-indigo-800">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-indigo-700">Loading safety tips...</p>
                    )}
                </div>
            </div>

            {/* Right Column: Details & Action */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                             <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">{item.category}</span>
                             <h1 className="text-3xl font-bold text-slate-900 mt-1 mb-2">{item.title}</h1>
                             <div className="flex items-center text-slate-500 text-sm gap-4">
                                <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                                    <MapPin size={14}/> Secure Zone: {item.location}
                                </span>
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">{item.condition}</span>
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-3xl font-bold text-slate-900">₹{item.pricePerDay}</div>
                             <div className="text-sm text-slate-500">per day</div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-6">
                        <h3 className="font-medium text-slate-900 mb-2">Description</h3>
                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Owner Info */}
                    <div className="mt-6 border-t border-slate-100 pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={owner.avatar} alt={owner.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="font-medium text-slate-900 flex items-center gap-1">
                                    {owner.name}
                                    <Shield size={14} className="text-emerald-500" fill="currentColor" color="white"/>
                                </div>
                                <div className="flex items-center text-xs text-slate-500 gap-2">
                                    <span className="flex items-center"><Star size={12} className="text-amber-400 fill-amber-400 mr-1"/> {owner.rating}</span>
                                    <span>•</span>
                                    <span>Verified Student ID</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowChat(true)}
                            className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <MessageSquare size={16} /> Chat (Masked)
                        </button>
                    </div>
                </div>

                {/* Rental Action Box */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rental Duration</label>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setRentDays(Math.max(1, rentDays - 1))}
                                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                            >-</button>
                            <div className="flex-1 text-center font-medium">
                                {rentDays} Day{rentDays > 1 ? 's' : ''}
                            </div>
                            <button 
                                onClick={() => setRentDays(rentDays + 1)}
                                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                            >+</button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Rent (₹{item.pricePerDay} × {rentDays})</span>
                            <span className="font-medium text-slate-900">₹{totalRent}</span>
                        </div>
                        <div className="flex justify-between text-indigo-700">
                            <div className="flex items-center gap-1">
                                <Lock size={12} />
                                <span>Security Deposit (Refundable)</span>
                            </div>
                            <span className="font-medium">₹{securityDeposit}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900">
                            <span>Total to Pay</span>
                            <span>₹{grandTotal}</span>
                        </div>
                    </div>

                    {!showConfirm ? (
                        <button 
                            onClick={() => setShowConfirm(true)}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow hover:bg-indigo-700 transition-transform active:scale-95"
                        >
                            Request to Rent
                        </button>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                             <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 flex gap-2">
                                <AlertTriangle size={16} className="shrink-0"/>
                                <span>
                                    By confirming, you agree to return the item by <strong>{new Date(Date.now() + rentDays * 86400000).toLocaleDateString()}</strong>.
                                    The ₹{securityDeposit} deposit will be refunded upon safe return.
                                </span>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setShowConfirm(false)} className="py-2 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                                <button onClick={handleRent} className="py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700">Confirm & Pay</button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Chat Modal */}
        {showChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center">
                                <UserIcon />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Anonymous User</h3>
                                <p className="text-xs text-indigo-200">Identity Masked • Online</p>
                            </div>
                        </div>
                        <button onClick={() => setShowChat(false)} className="hover:bg-indigo-700 p-1 rounded"><X size={20}/></button>
                    </div>
                    
                    <div className="flex-grow p-4 bg-slate-50 overflow-y-auto space-y-4">
                        <div className="flex justify-start">
                             <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-slate-700 shadow-sm max-w-[80%]">
                                Hello! Ask me anything about the {item.title}.
                             </div>
                        </div>
                        {chatHistory.map((msg, idx) => (
                             <div key={idx} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 text-sm rounded-2xl shadow-sm max-w-[80%] ${
                                    msg.sender === 'Me' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                             </div>
                        ))}
                    </div>
                    
                    <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                        <input 
                            type="text" 
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                        />
                        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                             <ArrowRightIcon />
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

// Simple Icons for Modal
const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

export default ItemDetails;