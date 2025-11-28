import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Upload, IndianRupee, ShieldCheck } from 'lucide-react';
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
  const [priceReasoning, setPriceReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setPriceReasoning(result.reasoning);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
        const newItem: Item = {
            id: `i${Date.now()}`,
            ownerId: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category as Category,
            pricePerDay: parseFloat(formData.pricePerDay),
            originalPrice: parseFloat(formData.originalPrice),
            imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`, // Random placeholder
            isAvailable: true,
            location: formData.location,
            condition: formData.condition as any,
        };

        addItem(newItem);
        setIsSubmitting(false);
        navigate('/profile');
    }, 1000);
  };

  // Calculate 50% deposit
  const securityDeposit = formData.originalPrice ? (parseFloat(formData.originalPrice) * 0.5).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
          <div className="px-6 py-8 border-b border-slate-100 bg-indigo-50">
            <h1 className="text-2xl font-bold text-indigo-900">List an Item to Rent</h1>
            <p className="text-indigo-600 mt-1">Earn money from your unused items with secure 50% deposit protection.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Item Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Scientific Calculator FX-991"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        {['New', 'Like New', 'Good', 'Fair'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>
            </div>

            {/* Description with AI */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <label className="block text-sm font-medium text-slate-700">Description</label>
                 <button 
                    type="button" 
                    onClick={handleAISuggestDescription}
                    disabled={loadingDesc || !formData.title}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1 disabled:opacity-50"
                 >
                    {loadingDesc ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                    Auto-Generate
                 </button>
               </div>
               <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the item's features and condition..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
               />
            </div>

            {/* Pricing with AI */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Pricing & Security</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Original Value / MRP (₹)</label>
                    <input
                        type="number"
                        name="originalPrice"
                        min="0"
                        required
                        value={formData.originalPrice}
                        onChange={handleChange}
                        placeholder="e.g. 1500"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="mt-2 text-xs text-indigo-700 bg-indigo-50 p-2 rounded flex items-start gap-2">
                        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                        <span>Borrowers will deposit <strong>₹{securityDeposit}</strong> (50% of MRP) as refundable security.</span>
                    </div>
                 </div>
                 
                 <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-700">Daily Rent (₹)</label>
                        <button 
                            type="button" 
                            onClick={handleAISuggestPrice}
                            disabled={loadingPrice || !formData.originalPrice}
                            className="text-xs text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 disabled:opacity-50"
                        >
                            {loadingPrice ? <Loader2 size={12} className="animate-spin"/> : <IndianRupee size={12} />}
                            Suggest Price
                        </button>
                    </div>
                    <input
                        type="number"
                        name="pricePerDay"
                        min="0"
                        required
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {priceReasoning && (
                        <p className="text-xs text-slate-500 mt-1 italic">{priceReasoning}</p>
                    )}
                 </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Secure Pickup Location (On Campus)</label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Library Entrance, Hostel H4 Lobby, Canteen"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">Choose a public spot designated for secure handovers.</p>
                 </div>
              </div>
            </div>

            {/* Image Placeholder */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Item Photos</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-500">
                        <span className="font-medium text-indigo-600 cursor-pointer">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB (Simulated)</p>
                    <input type="file" className="hidden" />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 size={20} className="animate-spin"/>}
                    {isSubmitting ? 'Listing Item...' : 'List Item Now'}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;