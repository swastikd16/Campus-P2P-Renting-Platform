import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { MapPin, Tag, ShieldCheck } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  showOwner?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, showOwner = true }) => {
  return (
    <Link to={`/item/${item.id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {item.isAvailable ? 'Available' : 'Rented'}
            </span>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-900/70 text-white backdrop-blur-sm">
              {item.category}
            </span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{item.title}</h3>
            <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-indigo-600">₹{item.pricePerDay}</span>
                <span className="text-[10px] text-slate-500">/day</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{item.description}</p>
          
          <div className="flex items-center text-xs text-slate-400 gap-3 mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate max-w-[80px]">{item.location}</span>
            </div>
            <div className="flex items-center gap-1">
               <Tag size={12} />
               <span>{item.condition}</span>
            </div>
             <div className="flex items-center gap-1 ml-auto text-emerald-600">
               <ShieldCheck size={12} />
               <span>Verified</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;