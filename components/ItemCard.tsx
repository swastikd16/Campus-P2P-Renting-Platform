
import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { MapPin, Tag } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  showOwner?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, showOwner = true }) => {
  return (
    <Link to={`/item/${item.id}`} className="group block h-full">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider shadow-sm ${
              item.isAvailable 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {item.isAvailable ? 'Available' : 'Rented'}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-slate-900/80 text-white backdrop-blur-sm border border-white/20">
              {item.category}
            </span>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{item.title}</h3>
            <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{item.pricePerDay}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">/day</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow font-medium leading-relaxed">{item.description}</p>
          
          <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-indigo-500" />
              <span className="truncate max-w-[120px]">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <Tag size={12} className="text-indigo-500" />
               <span>{item.condition}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
