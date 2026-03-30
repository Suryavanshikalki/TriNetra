import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Tag } from 'lucide-react';
import api from '../../services/api';

export default function Marketplace() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMarket = async () => {
      const res = await api.get('/marketplace/items');
      setItems(res.data.items);
    };
    fetchMarket();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-20 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">{t("Marketplace")}</h1>
        <button className="bg-cyan-500 text-black p-2 rounded-full active:scale-90"><Plus size={24}/></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item._id} className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-lg group">
            <div className="h-40 bg-black relative">
              <img src={item.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-black text-cyan-400 border border-cyan-500/30">₹{item.price}</div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-xs truncate">{item.title}</h3>
              <p className="text-[9px] text-gray-500 mt-1 flex items-center gap-1 uppercase tracking-tighter"><Tag size={10}/> {item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
