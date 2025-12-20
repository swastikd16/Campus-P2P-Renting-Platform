
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, Item } from '../types';
import { suggestDescription, suggestPrice } from '../services/geminiService';

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, user } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    category: Category.OTHERS as string,
    condition: 'Good',
    originalPrice: '',
    pricePerDay: '',
    description: '',
    location: '',
  });

  const [loadingDesc, setLoadingDesc] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAISuggestDescription = async () => {
    if (!formData.title) return alert("Please enter a title first.");
    setLoadingDesc(true);
    try {
      const desc = await suggestDescription(formData.title, formData.category, formData.condition);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDesc(false);
    }
  };

  const handleAISuggestPrice = async () => {
    if (!formData.title || !formData.originalPrice) return alert("Please enter title and original price.");
    setLoadingPrice(true);
    try {
      const result = await suggestPrice(formData.title, parseFloat(formData.originalPrice));
      setFormData(prev => ({ ...prev, pricePerDay: result.price.toString() }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/auth');
    setIsSubmitting(true);
    
    setTimeout(() => {
        const newItem: Item = {
            id: `i${Date.now()}`,
            ownerId: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category as Category,
            pricePerDay: parseFloat(formData.pricePerDay),
            originalPrice: parseFloat(formData.originalPrice),
            imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
            isAvailable: true,
            location: formData.location,
            condition: formData.condition as any,
        };

        addItem(newItem);
        setIsSubmitting(false);
        navigate('/profile');
    }, 1000);
  };

  const securityDeposit = formData.originalPrice ? (parseFloat(formData.originalPrice) * 0.5).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="px-6 py-8 border-b border-slate-100 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-900/20">
            <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">List an Item</h1>
            <p className="text-indigo-600 dark:text-indigo-400 mt-1">Lend to fellow students safely.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white border-b dark:border-slate-800 pb-2">Item Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                        placeholder="e.g., Engineering Mathematics textbook"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                    >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Condition</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                    >
                        {['New', 'Like New', 'Good', 'Fair'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                 <button 
                    type="button" 
                    onClick={handleAISuggestDescription}
                    disabled={loadingDesc || !formData.title}
                    className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-1 disabled:opacity-50 transition-colors"
                 >
                    {loadingDesc ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                    AI Suggested
                 </button>
               </div>
               <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                    placeholder="Provide details about the item..."
               />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white border-b dark:border-slate-800 pb-2">Pricing & Handover</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price (₹)</label>
                    <input
                        type="number"
                        name="originalPrice"
                        required
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                    />
                    <div className="mt-2 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded flex items-start gap-2 border border-indigo-100">
                        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                        <span>Security Deposit: <strong>₹{securityDeposit}</strong></span>
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Daily Rent (₹)</label>
                        <button 
                            type="button" 
                            onClick={handleAISuggestPrice}
                            disabled={loadingPrice || !formData.originalPrice}
                            className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 flex items-center gap-1 disabled:opacity-50"
                        >
                            AI Suggest
                        </button>
                    </div>
                    <input
                        type="number"
                        name="pricePerDay"
                        required
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                    />
                 </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pickup Location</label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-colors"
                        placeholder="e.g., Library Stairs"
                    />
                 </div>
              </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95"
            >
                {isSubmitting && <Loader2 size={20} className="animate-spin"/>}
                {isSubmitting ? 'Listing...' : 'List Item Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
